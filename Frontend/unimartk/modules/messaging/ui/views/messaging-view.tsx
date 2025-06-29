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
  const [isMobile, setIsMobile] = useState(false);
  const [isChatOpenOnMobile, setIsChatOpenOnMobile] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, isInitialized } = useAuth();

  const isAdminMessage = (message: string): boolean => {
    return message.includes(
      "--- This is an automated message. Do not reply. ---"
    );
  };

  // Helper function to parse admin message
  const parseAdminMessage = (message: string) => {
    const parts = message.split(
      "--- This is an automated message. Do not reply. ---"
    );
    return {
      mainMessage: parts[0].trim(),
      isAdmin: parts.length > 1,
    };
  };

  if (isInitialized && !isAuthenticated) {
    redirect("/sign-in");
  }

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind `md` breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

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
    if (isMobile) {
      setIsChatOpenOnMobile(true);
    }

    if (userId === selectedConversation) return;
    setSelectedConversation(userId);
    setMessages([]); // Clear messages when switching conversations
  };

  if (isLoading) {
    return (
      <div className="px-4 h-full lg:px-12 py-10">
        <div className="flex h-full rounded-xl overflow-hidden border border-border items-center justify-center">
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
        <div className="flex h-full  rounded-xl overflow-hidden border border-border items-center justify-center">
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
      <div className="flex h-full bg-muted rounded-xl overflow-hidden border border-border">
        {/* Sidebar */}
        <div
          className={`
          w-full md:w-1/3 bg-background border-r border-border flex flex-col 
          ${selectedConversation ? "hidden md:flex" : "flex"}
        `}
        >
          {/* Sidebar Header */}
          <div className="p-4 bg-muted border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-foreground">
                Messages
              </h1>
              <button className="p-2 hover:bg-accent rounded-full">
                <MoreVertical size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No conversations found
              </div>
            ) : (
              filteredUsers.map((user: User) => (
                <div
                  key={user.id}
                  onClick={() => handleConversationSelect(user.id)}
                  className={`flex items-center p-4 hover:bg-muted cursor-pointer border-b border-border ${
                    selectedConversation === user.id
                      ? "bg-primary/10 border-r-4 border-primary"
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
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {user.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div
          className={`
          flex-1 flex flex-col 
          ${!selectedConversation ? "hidden md:flex" : "flex"}
        `}
        >
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-background p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center">
                  {/* Back button on small screens */}
                  <button
                    className="mr-4 md:hidden text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <X />
                  </button>
                  <div className="relative mr-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src="" alt="User Avatar" />
                      <AvatarFallback>
                        {`${selectedUser.name.split(" ")[0][0].toUpperCase()}`}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-foreground">
                      {selectedUser.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.isOnline ? "Online" : selectedUser.lastSeen}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const { mainMessage, isAdmin } = parseAdminMessage(
                      message.message
                    );
                    const isOwnMessage =
                      message.sender_id.toString() === user?.id.toString();

                    return (
                      <div
                        key={index}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwnMessage
                              ? "bg-primary text-primary-foreground"
                              : isAdmin
                                ? "bg-orange-50 border border-orange-200 text-orange-900 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-100"
                                : "bg-accent text-accent-foreground"
                          }`}
                        >
                          <div className="break-words">
                            {isAdmin ? (
                              <div className="space-y-2">
                                <p className="font-medium">{mainMessage}</p>
                                <p className="text-xs text-orange-600 dark:text-orange-300 italic border-t border-orange-200 pt-2">
                                  This is an automated message. Do not reply.
                                </p>
                              </div>
                            ) : (
                              <p>{message.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-background p-4 border-t border-border">
                <div className="flex items-center space-x-4">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-background text-foreground border-border"
                    disabled={!socket}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!socket || !newMessage.trim()}
                    className="bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground p-2 rounded-lg transition-colors h-10 w-10 flex items-center justify-center"
                  >
                    <Send size={20} />
                  </button>
                </div>
                {!socket && selectedConversation && (
                  <p className="text-xs text-destructive mt-2 text-center">
                    Connecting to chat...
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted">
              <div className="text-center">
                <div className="w-32 h-32 bg-muted-foreground/10 dark:bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={48} className="text-muted-foreground" />
                </div>
                <h2 className="text-xl font-medium text-muted-foreground mb-2">
                  Select a conversation
                </h2>
                <p className="text-muted-foreground">
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
