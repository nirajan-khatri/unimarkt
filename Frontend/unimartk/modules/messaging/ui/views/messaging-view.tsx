"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
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
import { Message } from "@/modules/products/types";
import { User } from "@/modules/profile/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { redirect } from "next/navigation";

const WhatsAppMessaging = () => {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, isInitialized } = useAuth();

  if ((!isAuthenticated || !user) && isInitialized) {
    redirect("/sign-in");
  }

  // Fetch unique users/conversations
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["uniqueUsers", user?.id],
    queryFn: async () => {
      const response = await axios.get(
        `chat/unique-users/?user_id=${user?.id}`
      );
      return response.data.map((user: User) => ({
        ...user,
      }));
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    if (selectedConversation) {
      // Close existing socket if any
      if (socket) {
        socket.close();
      }

      // Create new WebSocket connection
      const wsBaseUrl =
        process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/";
      const wsUrl = `${wsBaseUrl}chat/${user?.id}/${selectedConversation}/`;
      console.log("Connecting to WebSocket:", wsUrl);
      const newSocket = new WebSocket(wsUrl);

      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          setMessages((prev) => [...prev, data]);
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      newSocket.onclose = () => {
        console.log("WebSocket disconnected");
      };

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      setSocket(newSocket);

      // Cleanup on unmount or conversation change
      return () => {
        newSocket.close();
      };
    }
  }, [selectedConversation, user?.id]);

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !socket) return;

    const messageData = {
      type: "send_message",
      message: newMessage.trim(),
      receiver_id: selectedConversation,
    };

    socket.send(JSON.stringify(messageData));
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUser = users.find(
    (user: User) => user.id === selectedConversation
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleConversationSelect = (userId: string) => {
    if (userId === selectedConversation) return;
    setSelectedConversation(userId);
    setMessages([]); // Clear messages when switching conversations
  };

  if (isLoading) {
    return (
      <div className="px-4 h-full lg:px-12 py-10">
        <div className="flex h-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 h-full lg:px-12 py-10">
        <div className="flex h-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading conversations</p>
            <p className="text-gray-500 text-sm">
              Please check your connection and try again
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 h-full lg:px-12 py-10">
      <div className="flex h-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
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
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations found
              </div>
            ) : (
              filteredUsers.map((user: User) => (
                <div
                  key={user.id}
                  onClick={() => handleConversationSelect(user.id)}
                  className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                    selectedConversation === user.id
                      ? "bg-blue-50 border-r-4 border-r-blue-500"
                      : ""
                  }`}
                >
                  <div className="relative mr-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src="" alt="User Avatar" />
                      <AvatarFallback>
                        {`${user.name.split(" ")[0][0].toUpperCase()}`}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src="" alt="User Avatar" />
                      <AvatarFallback>
                        {`${selectedUser.name.split(" ")[0][0].toUpperCase()}`}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {selectedUser.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedUser.isOnline ? "Online" : selectedUser.lastSeen}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    return (
                      <div
                        key={index}
                        className={`flex ${message.sender_id.toString() === user?.id.toString() ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender_id.toString() === user?.id.toString()
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          <p className="break-words">{message.message}</p>
                          {/* <div
                            className={`flex items-center justify-end mt-1 text-xs ${
                              message.sender_id.toString() === currentUserId
                                ? "text-green-100"
                                : "text-gray-500"
                            }`}
                          >
                            <span>{formatTime(message.timestamp)}</span>
                            {message.sender_id === currentUserId && (
                            <span className="ml-1">
                              {message.status === "sent" && "✓"}
                              {message.status === "delivered" && "✓✓"}
                              {message.status === "read" && (
                                <span className="text-blue-200">✓✓</span>
                              )}
                            </span>
                          )}
                          </div> */}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white p-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  {/* <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none focus:outline-none"
                      disabled={!socket}
                    /> */}
                  <textarea
                    value={newMessage}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewMessage(e.target.value)
                    }
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    style={{ scrollbarWidth: "none" }}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={!socket}
                  />

                  <button
                    onClick={sendMessage}
                    disabled={!socket || !newMessage.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors h-10 w-10 flex items-center justify-center"
                  >
                    <Send size={20} />
                  </button>
                </div>
                {!socket && selectedConversation && (
                  <p className="text-xs text-red-500 mt-2 text-center">
                    Connecting to chat...
                  </p>
                )}
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
