// components/ProductMessageWindow.tsx
import { useState, useEffect, useRef } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import {
  Message,
  SkillMessageWindowProps,
  WebSocketMessage,
} from "../../types";

const SkillMessageWindow: React.FC<SkillMessageWindowProps> = ({
  senderId,
  receiverId,
  productName,
  sellerName,
  initialMessage,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string>("");
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug: Log when component mounts
  useEffect(() => {
    console.log("ProductMessageWindow mounted with props:", {
      senderId,
      receiverId,
      productName,
      sellerName,
    });
  }, []);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced WebSocket connection with better error handling and retries
  useEffect(() => {
    if (senderId && receiverId) {
      // Validate required props
      if (!senderId || !receiverId) {
        console.error("Missing required props:", { senderId, receiverId });
        setConnectionError("Missing sender or receiver ID");
        return;
      }

      console.log("Attempting WebSocket connection...", {
        senderId,
        receiverId,
        attempt: connectionAttempts + 1,
      });

      const wsBaseUrl =
        process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/";
      const wsUrl = `${wsBaseUrl}chat/${senderId}/${receiverId}/`;
      console.log("WebSocket URL:", wsUrl);

      const ws = new WebSocket(wsUrl);

      // Set a connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          // console.error("WebSocket connection timeout");
          ws.close();
          setConnectionError("Connection timeout - check if server is running");
        }
      }, 10000); // 10 second timeout

      ws.onopen = (): void => {
        clearTimeout(connectionTimeout);
        setIsConnected(true);
        setConnectionError("");
        setConnectionAttempts(0);
        // console.log("WebSocket connected successfully");
        // console.log("WebSocket readyState:", ws.readyState);
      };

      ws.onmessage = (event: MessageEvent): void => {
        // console.log("Received WebSocket message:", event.data);
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          // console.log("Parsed message data:", data);
          setMessages((prev) => [
            ...prev,
            {
              message: data.message,
              sender_id: data.sender_id,
              receiver_id: receiverId,
              timestamp: data.timestamp,
              id: Date.now(),
            },
          ]);
        } catch (error) {
          // console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = (event: CloseEvent): void => {
        clearTimeout(connectionTimeout);
        setIsConnected(false);
        console.log("WebSocket disconnected:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });

        // Set specific error messages based on close code
        if (event.code === 1006) {
          setConnectionError("Connection failed - server may be down");
        } else if (event.code === 1002) {
          setConnectionError("Protocol error");
        } else if (event.code === 1003) {
          setConnectionError("Unsupported data type");
        } else if (event.code === 1011) {
          setConnectionError("Server error");
        } else if (!event.wasClean) {
          setConnectionError(`Connection lost (Code: ${event.code})`);
        }
      };

      ws.onerror = (error: Event): void => {
        clearTimeout(connectionTimeout);
        // console.error("WebSocket error:", error);
        // console.error("WebSocket readyState:", ws.readyState);
        setIsConnected(false);
        setConnectionError("Connection error - check server and network");
      };

      setSocket(ws);

      return () => {
        clearTimeout(connectionTimeout);
        if (
          ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING
        ) {
          ws.close(1000, "Component unmounting");
        }
      };
    }
  }, [senderId, receiverId, connectionAttempts]);

  // Retry connection function
  const retryConnection = (): void => {
    if (connectionAttempts < 3) {
      setConnectionAttempts((prev) => prev + 1);
      setConnectionError("");
      setMessages([]);
      // console.log("Retrying connection, attempt:", connectionAttempts + 1);
    } else {
      setConnectionError("Max retry attempts reached");
    }
  };

  const sendMessage = (): void => {
    if (socket && newMessage.trim() && isConnected) {
      // console.log("Sending message:", newMessage.trim());
      // console.log("Socket readyState:", socket.readyState);

      try {
        socket.send(
          JSON.stringify({
            message: newMessage.trim(),
          })
        );
        setNewMessage("");
      } catch (error) {
        // console.error("Error sending message:", error);
        setConnectionError("Failed to send message");
      }
    } else {
      console.log("Cannot send message:", {
        hasSocket: !!socket,
        hasMessage: !!newMessage.trim(),
        isConnected,
        socketReadyState: socket?.readyState,
      });
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleOpenFullConversation = (): void => {
    window.open(`/messages`, "_blank");
  };

  useEffect(() => {
    if (messages.length === 0) {
      setNewMessage(initialMessage);
    } else {
      setNewMessage("");
    }
  }, [initialMessage, messages]);

  // return (
  //   <div className="bg-white border overflow-hidden rounded-lg shadow-xl w-full h-96 flex flex-col z-50">
  //     {/* Header */}
  //     <div className="flex justify-between items-center p-3 border-b bg-gray-50 rounded-t-lg">
  //       <div>
  //         <h3 className="font-semibold text-sm">Message {sellerName}</h3>
  //         <p className="text-xs text-gray-500 truncate">{productName}</p>
  //       </div>
  //       {!isConnected && (
  //         <div className="px-3 py-2 bg-yellow-50 border-b">
  //           {connectionError ? (
  //             <div className="space-y-1">
  //               <p className="text-[10px] text-red-600">{connectionError}</p>
  //               {connectionAttempts < 3 && (
  //                 <button
  //                   onClick={retryConnection}
  //                   className="text-[10px] text-blue-600 hover:text-blue-800 underline"
  //                 >
  //                   Retry connection
  //                 </button>
  //               )}
  //             </div>
  //           ) : (
  //             <p className="text-[10px] text-yellow-600">
  //               Connecting... (Attempt {connectionAttempts + 1})
  //             </p>
  //           )}
  //         </div>
  //       )}
  //       {isConnected && (
  //         <div className="px-3 py-1 bg-green-50 border-green-600 border rounded-md">
  //           <p className="text-[10px] text-green-600">Connected</p>
  //         </div>
  //       )}
  //     </div>

  //     {/* Messages */}
  //     <div
  //       className="flex-1 overflow-y-auto p-3 space-y-2"
  //       style={{ scrollbarWidth: "none" }}
  //     >
  //       {messages.length === 0 ? (
  //         <div className="text-center text-gray-500 text-sm mt-8">
  //           <p>Start a conversation about this product</p>
  //         </div>
  //       ) : (
  //         messages.map((msg, index) => (
  //           <div
  //             key={index}
  //             className={`flex ${msg.sender_id.toString() === senderId ? "justify-end" : "justify-start"}`}
  //           >
  //             <div
  //               className={`max-w-3/4 px-3 py-2 rounded-lg text-xs ${
  //                 msg.sender_id.toString() === senderId
  //                   ? "bg-blue-500 text-white"
  //                   : "bg-gray-100 text-gray-800"
  //               }`}
  //             >
  //               <p>{msg.message}</p>
  //             </div>
  //           </div>
  //         ))
  //       )}
  //       <div ref={messagesEndRef} />
  //     </div>

  //     {/* Input */}
  //     <div className="p-3 border-t">
  //       <div className="flex space-x-2 items-end">
  //         <textarea
  //           value={newMessage}
  //           onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
  //             setNewMessage(e.target.value)
  //           }
  //           onKeyDown={handleKeyPress}
  //           placeholder="Type a message..."
  //           style={{ scrollbarWidth: "none" }}
  //           className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
  //           disabled={!isConnected}
  //         />
  //         <button
  //           onClick={sendMessage}
  //           disabled={!newMessage.trim() || !isConnected}
  //           className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors h-10 w-10 flex items-center justify-center"
  //           aria-label="Send message"
  //         >
  //           <Send size={16} />
  //         </button>
  //       </div>
  //       <div className="mt-1 text-center">
  //         <button
  //           onClick={handleOpenFullConversation}
  //           className="text-xs text-blue-500 hover:text-blue-600"
  //         >
  //           Open full conversation →
  //         </button>
  //       </div>
  //     </div>

  //     {/* Debug Info (remove in production) */}
  //     {process.env.NODE_ENV === "development" && (
  //       <div className="p-2 bg-gray-100 text-[8px]">
  //         <p>
  //           Debug: senderId={senderId}, receiverId={receiverId}
  //         </p>
  //         <p>Socket state: {socket?.readyState ?? "null"}</p>
  //         <p>Connected: {isConnected.toString()}</p>
  //       </div>
  //     )}
  //   </div>
  // );
  return (
    <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 overflow-hidden rounded-lg shadow-xl w-full h-96 flex flex-col z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div>
          <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
            Message {sellerName}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {productName}
          </p>
        </div>
        {!isConnected && (
          <div className="px-3 py-2 bg-yellow-50 dark:bg-yellow-900 border-b dark:border-yellow-800">
            {connectionError ? (
              <div className="space-y-1">
                <p className="text-[10px] text-red-600 dark:text-red-400">
                  {connectionError}
                </p>
                {connectionAttempts < 3 && (
                  <button
                    onClick={retryConnection}
                    className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Retry connection
                  </button>
                )}
              </div>
            ) : (
              <p className="text-[10px] text-yellow-600 dark:text-yellow-300">
                Connecting... (Attempt {connectionAttempts + 1})
              </p>
            )}
          </div>
        )}
        {isConnected && (
          <div className="px-3 py-1 bg-green-50 dark:bg-green-900 border-green-600 dark:border-green-500 border rounded-md">
            <p className="text-[10px] text-green-600 dark:text-green-300">
              Connected
            </p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-2"
        style={{ scrollbarWidth: "none" }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
            <p>Start a conversation about this product</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender_id.toString() === senderId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-3/4 px-3 py-2 rounded-lg text-xs ${
                  msg.sender_id.toString() === senderId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                }`}
              >
                <p>{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t dark:border-gray-700">
        <div className="flex space-x-2 items-end">
          <textarea
            value={newMessage}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setNewMessage(e.target.value)
            }
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            style={{ scrollbarWidth: "none" }}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors h-10 w-10 flex items-center justify-center"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="mt-1 text-center">
          <button
            onClick={handleOpenFullConversation}
            className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
          >
            Open full conversation →
          </button>
        </div>
      </div>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-2 bg-gray-100 dark:bg-gray-800 text-[8px] text-gray-700 dark:text-gray-300">
          <p>
            Debug: senderId={senderId}, receiverId={receiverId}
          </p>
          <p>Socket state: {socket?.readyState ?? "null"}</p>
          <p>Connected: {isConnected.toString()}</p>
        </div>
      )}
    </div>
  );
};

export default SkillMessageWindow;
