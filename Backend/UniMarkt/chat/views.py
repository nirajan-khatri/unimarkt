from django.shortcuts import render

def direct_chat(request, sender_id, receiver_id):
    return render(request, 'chat/lobby.html', {
        'sender_id': sender_id,
        'receiver_id': receiver_id,
    })
