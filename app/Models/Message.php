<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'message',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación: mensaje pertenece a un remitente (User)
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Relación: mensaje pertenece a un destinatario (User)
     */
    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    /**
     * Marcar mensaje como leído
     */
    public function markAsRead(): void
    {
        $this->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Scope: conversación entre admin y un empleado específico
     * Solo permite conversaciones Admin ↔ Empleado
     */
    public function scopeConversation($query, int $adminId, int $empleadoId)
    {
        return $query->where(function ($q) use ($adminId, $empleadoId) {
            $q->where('sender_id', $adminId)->where('receiver_id', $empleadoId);
        })->orWhere(function ($q) use ($adminId, $empleadoId) {
            $q->where('sender_id', $empleadoId)->where('receiver_id', $adminId);
        })->orderBy('created_at', 'asc');
    }

    /**
     * Scope: mensajes no leídos para un usuario
     */
    public function scopeUnreadFor($query, int $userId)
    {
        return $query->where('receiver_id', $userId)->where('is_read', false);
    }

    /**
     * Scope: últimos mensajes por conversación (para lista de conversaciones del admin)
     */
    public function scopeLatestByConversation($query, int $adminId)
    {
        return $query->whereIn('id', function ($subQuery) use ($adminId) {
            $subQuery->selectRaw('MAX(id)')
                ->from('messages')
                ->where(function ($q) use ($adminId) {
                    $q->where('sender_id', $adminId)
                      ->orWhere('receiver_id', $adminId);
                })
                ->groupByRaw('LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)');
        })->orderBy('created_at', 'desc');
    }
}
