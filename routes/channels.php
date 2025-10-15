<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Canal privado para mensajes de chat (Admin ↔ Empleado)
Broadcast::channel('chat.{userId}', function ($user, $userId) {
    \Log::info('Broadcasting auth attempt', [
        'authenticated_user_id' => $user->id,
        'requested_channel_user_id' => $userId,
        'match' => (int) $user->id === (int) $userId
    ]);

    // Solo el usuario autenticado puede escuchar en su propio canal
    // IMPORTANTE: Debe devolver true/false O un array con datos del usuario
    if ((int) $user->id === (int) $userId) {
        return ['id' => $user->id, 'name' => $user->name];
    }

    return false;
});
