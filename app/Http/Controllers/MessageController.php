<?php

namespace App\Http\Controllers;

use App\Services\MessageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    private MessageService $messageService;

    public function __construct(MessageService $messageService)
    {
        $this->messageService = $messageService;
    }

    /**
     * Obtener conversaciones del usuario autenticado
     */
    public function getConversations()
    {
        $user = Auth::user();
        $conversations = $this->messageService->getConversationsForUser($user);

        return response()->json($conversations);
    }

    /**
     * Obtener mensajes de una conversación específica
     */
    public function getMessages(int $userId)
    {
        $currentUser = Auth::user();
        $messages = $this->messageService->getConversationMessages($currentUser, $userId);

        return response()->json($messages);
    }

    /**
     * Enviar un mensaje
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:5000',
        ]);

        $sender = Auth::user();
        $message = $this->messageService->sendMessage(
            $sender,
            $request->receiver_id,
            $request->message
        );

        return response()->json([
            'success' => true,
            'message' => $message,
        ]);
    }

    /**
     * Contar mensajes no leídos del usuario autenticado
     */
    public function getUnreadCount()
    {
        $user = Auth::user();
        $count = $this->messageService->getUnreadCount($user);

        return response()->json(['count' => $count]);
    }

    /**
     * Marcar todos los mensajes de un remitente como leídos
     */
    public function markAllAsRead(int $senderId)
    {
        $user = Auth::user();
        $this->messageService->markAllFromSenderAsRead($user, $senderId);

        return response()->json(['success' => true]);
    }
}
