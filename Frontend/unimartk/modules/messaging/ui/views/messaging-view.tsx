"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Mic,
  X,
} from "lucide-react";

// Types
interface User {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

interface Conversation {
  id: number;
  user: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

interface Props {
  senderId: string;
  receiverId: string;
}

const WhatsAppMessaging = ({ receiverId, senderId }: Props) => {
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 1; // Mock current user ID

  // Mock data
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: 1,
        user: {
          id: 2,
          name: "Alice Johnson",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          isOnline: true,
        },
        lastMessage: "Hey! How are you doing?",
        lastMessageTime: "10:30 AM",
        unreadCount: 2,
        messages: [
          {
            id: 1,
            senderId: 2,
            content: "Hi there!",
            timestamp: "2024-01-15T10:00:00Z",
            status: "read",
          },
          {
            id: 2,
            senderId: 1,
            content: "Hello! How are you?",
            timestamp: "2024-01-15T10:05:00Z",
            status: "read",
          },
          {
            id: 3,
            senderId: 2,
            content: "I'm doing great, thanks for asking!",
            timestamp: "2024-01-15T10:10:00Z",
            status: "read",
          },
          {
            id: 4,
            senderId: 2,
            content: "Hey! How are you doing?",
            timestamp: "2024-01-15T10:30:00Z",
            status: "delivered",
          },
        ],
      },
      {
        id: 2,
        user: {
          id: 3,
          name: "Bob Smith",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          isOnline: false,
          lastSeen: "last seen 2 hours ago",
        },
        lastMessage: "Sure, let's meet tomorrow",
        lastMessageTime: "Yesterday",
        unreadCount: 0,
        messages: [
          {
            id: 5,
            senderId: 3,
            content: "Are you free tomorrow?",
            timestamp: "2024-01-14T15:00:00Z",
            status: "read",
          },
          {
            id: 6,
            senderId: 1,
            content: "Yes, what time works for you?",
            timestamp: "2024-01-14T15:05:00Z",
            status: "read",
          },
          {
            id: 7,
            senderId: 3,
            content: "How about 3 PM?",
            timestamp: "2024-01-14T15:10:00Z",
            status: "read",
          },
          {
            id: 8,
            senderId: 1,
            content: "Perfect!",
            timestamp: "2024-01-14T15:15:00Z",
            status: "read",
          },
          {
            id: 9,
            senderId: 3,
            content: "Sure, let's meet tomorrow",
            timestamp: "2024-01-14T15:20:00Z",
            status: "read",
          },
        ],
      },
      {
        id: 3,
        user: {
          id: 4,
          name: "Carol Williams",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          isOnline: true,
        },
        lastMessage: "Thanks for your help!",
        lastMessageTime: "Tuesday",
        unreadCount: 0,
        messages: [
          {
            id: 10,
            senderId: 4,
            content: "Could you help me with the project?",
            timestamp: "2024-01-12T09:00:00Z",
            status: "read",
          },
          {
            id: 11,
            senderId: 1,
            content: "Of course! What do you need?",
            timestamp: "2024-01-12T09:05:00Z",
            status: "read",
          },
          {
            id: 12,
            senderId: 4,
            content: "I need help with the design part",
            timestamp: "2024-01-12T09:10:00Z",
            status: "read",
          },
          {
            id: 13,
            senderId: 1,
            content: "Let me share some resources with you",
            timestamp: "2024-01-12T09:15:00Z",
            status: "read",
          },
          {
            id: 14,
            senderId: 4,
            content: "Thanks for your help!",
            timestamp: "2024-01-12T09:30:00Z",
            status: "read",
          },
        ],
      },
      {
        id: 4,
        user: {
          id: 5,
          name: "David Brown",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          isOnline: false,
          lastSeen: "last seen 1 day ago",
        },
        lastMessage: "See you later!",
        lastMessageTime: "Monday",
        unreadCount: 1,
        messages: [
          {
            id: 15,
            senderId: 5,
            content: "Hey, are we still on for the meeting?",
            timestamp: "2024-01-11T14:00:00Z",
            status: "read",
          },
          {
            id: 16,
            senderId: 1,
            content: "Yes, see you at 5 PM",
            timestamp: "2024-01-11T14:05:00Z",
            status: "read",
          },
          {
            id: 17,
            senderId: 5,
            content: "See you later!",
            timestamp: "2024-01-11T14:10:00Z",
            status: "delivered",
          },
        ],
      },
    ];
    setConversations(mockConversations);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: Date.now(),
      senderId: currentUserId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            messages: [...conv.messages, newMsg],
            lastMessage: newMessage.trim(),
            lastMessageTime: "now",
          };
        }
        return conv;
      })
    );

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find(
    (conv) => conv.id === selectedConversation
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="px-4 h-full lg:px-12 py-10 ">
      <div className="flex h-full bg-gray-100 rounded-xl overflow-hidden  border border-gray-200">
        {/* Sidebar */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
              <button className="p-2 hover:bg-gray-200 rounded-full">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  selectedConversation === conversation.id
                    ? "bg-green-50 border-r-4 border-r-green-500"
                    : ""
                }`}
              >
                <div className="relative mr-3">
                  <img
                    src={conversation.user.avatar}
                    alt={conversation.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.user.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                </div>

                {conversation.unreadCount > 0 && (
                  <div className="ml-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <img
                      src={selectedConv.user.avatar}
                      alt={selectedConv.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedConv.user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {selectedConv.user.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedConv.user.isOnline
                        ? "Online"
                        : selectedConv.user.lastSeen}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Phone size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Video size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {selectedConv.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === currentUserId
                          ? "bg-green-500 text-white"
                          : "bg-white text-gray-800 border"
                      }`}
                    >
                      <p className="break-words">{message.content}</p>
                      <div
                        className={`flex items-center justify-end mt-1 text-xs ${
                          message.senderId === currentUserId
                            ? "text-green-100"
                            : "text-gray-500"
                        }`}
                      >
                        <span>{formatTime(message.timestamp)}</span>
                        {message.senderId === currentUserId && (
                          <span className="ml-1">
                            {message.status === "sent" && "✓"}
                            {message.status === "delivered" && "✓✓"}
                            {message.status === "read" && (
                              <span className="text-blue-200">✓✓</span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white p-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Paperclip size={20} className="text-gray-600" />
                  </button>

                  <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none focus:outline-none"
                    />
                    <button className="p-1 hover:bg-gray-200 rounded-full ml-2">
                      <Smile size={20} className="text-gray-600" />
                    </button>
                  </div>

                  {newMessage.trim() ? (
                    <button
                      onClick={sendMessage}
                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full"
                    >
                      <Send size={20} />
                    </button>
                  ) : (
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <Mic size={20} className="text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* No conversation selected */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={48} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-medium text-gray-600 mb-2">
                  Select a conversation
                </h2>
                <p className="text-gray-500">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppMessaging;
