<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Canal privado para mensajes de chat (Admin ↔ Empleado)
Broadcast::channel('chat.{userId}', function ($user, $userId) {
    // Solo el usuario autenticado puede escuchar en su propio canal
    return (int) $user->id === (int) $userId;
});
