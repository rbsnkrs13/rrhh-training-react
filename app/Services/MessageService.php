<?php

namespace App\Services;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;

class MessageService
{
    private const ADMIN_EMAIL = 'admin@empresa.com';

    /**
     * Obtener usuario admin
     */
    private function getAdmin(): ?User
    {
        return User::where('email', self::ADMIN_EMAIL)->first();
    }

    /**
     * Verificar si un usuario es admin
     */
    public function isAdmin(User $user): bool
    {
        return $user->email === self::ADMIN_EMAIL;
    }

    /**
     * Obtener conversaciones del usuario actual
     * - Admin: lista de empleados con los que ha chateado
     * - Empleado: solo conversación con admin
     */
    public function getConversationsForUser(User $user): array
    {
        $admin = $this->getAdmin();

        if (!$admin) {
            return [];
        }

        // Si es admin, obtener lista de empleados con mensajes
        if ($this->isAdmin($user)) {
            return $this->getAdminConversations($admin);
        }

        // Si es empleado, solo conversación con admin
        return $this->getEmployeeConversations($user, $admin);
    }

    /**
     * Obtener conversaciones del admin (lista de empleados)
     */
    private function getAdminConversations(User $admin): array
    {
        $conversations = Message::latestByConversation($admin->id)
            ->with(['sender', 'receiver'])
            ->get()
            ->map(function ($message) use ($admin) {
                // El empleado es quien NO es admin
                $empleado = $message->sender_id === $admin->id
                    ? $message->receiver
                    : $message->sender;

                // Contar mensajes no leídos del empleado hacia el admin
                $unreadCount = Message::unreadFor($admin->id)
                    ->where('sender_id', $empleado->id)
                    ->count();

                return [
                    'empleadoId' => $empleado->id,
                    'nombre' => $empleado->name,
                    'ultimoMensaje' => $message->message,
                    'horaUltimoMensaje' => $message->created_at->diffForHumans(),
                    'mensajesNoLeidos' => $unreadCount,
                ];
            });

        return $conversations->toArray();
    }

    /**
     * Obtener conversación del empleado (solo con admin)
     */
    private function getEmployeeConversations(User $employee, User $admin): array
    {
        $unreadCount = Message::unreadFor($employee->id)
            ->where('sender_id', $admin->id)
            ->count();

        return [
            [
                'empleadoId' => $admin->id,
                'nombre' => 'Administración',
                'ultimoMensaje' => '',
                'horaUltimoMensaje' => '',
                'mensajesNoLeidos' => $unreadCount,
            ]
        ];
    }

    /**
     * Obtener mensajes de una conversación entre admin y empleado
     */
    public function getConversationMessages(User $currentUser, int $otherUserId): array
    {
        $admin = $this->getAdmin();

        if (!$admin) {
            return [];
        }

        // Determinar quién es admin y quién es empleado
        $adminId = $admin->id;
        $empleadoId = $this->isAdmin($currentUser) ? $otherUserId : $currentUser->id;

        // Obtener mensajes
        $messages = Message::conversation($adminId, $empleadoId)
            ->with(['sender'])
            ->get()
            ->map(function ($message) use ($currentUser) {
                return [
                    'id' => $message->id,
                    'mensaje' => $message->message,
                    'hora' => $message->created_at->format('H:i'),
                    'esPropio' => $message->sender_id === $currentUser->id,
                    'nombreRemitente' => $message->sender->name,
                ];
            });

        // Marcar mensajes como leídos
        $this->markConversationAsRead($currentUser, $otherUserId);

        return $messages->toArray();
    }

    /**
     * Enviar un mensaje
     */
    public function sendMessage(User $sender, int $receiverId, string $messageText): array
    {
        // Crear mensaje
        $message = Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiverId,
            'message' => $messageText,
        ]);

        // Cargar relación sender
        $message->load('sender');

        // Disparar evento de broadcast
        broadcast(new MessageSent($message))->toOthers();

        // Retornar mensaje formateado
        return [
            'id' => $message->id,
            'mensaje' => $message->message,
            'hora' => $message->created_at->format('H:i'),
            'esPropio' => true,
            'nombreRemitente' => $message->sender->name,
        ];
    }

    /**
     * Contar mensajes no leídos de un usuario
     */
    public function getUnreadCount(User $user): int
    {
        return Message::unreadFor($user->id)->count();
    }

    /**
     * Marcar mensajes de una conversación como leídos
     */
    public function markConversationAsRead(User $currentUser, int $otherUserId): void
    {
        Message::where('receiver_id', $currentUser->id)
            ->where('sender_id', $otherUserId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    /**
     * Marcar todos los mensajes de un remitente como leídos
     */
    public function markAllFromSenderAsRead(User $receiver, int $senderId): void
    {
        Message::where('receiver_id', $receiver->id)
            ->where('sender_id', $senderId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }
}
