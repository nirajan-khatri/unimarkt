import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export const sendAdminMessage = (
  receiverId: string,
  message: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const senderId = "1"; // Admin ID
    const wsBaseUrl =
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/";
    const wsUrl = `${wsBaseUrl}chat/${senderId}/${receiverId}/`;

    const ws = new WebSocket(wsUrl);

    const timeout = setTimeout(() => {
      ws.close();
      reject("WebSocket connection timeout");
    }, 10000);

    ws.onopen = () => {
      clearTimeout(timeout);
      console.log("WebSocket (admin) connected");
      ws.send(JSON.stringify({ message }));
      ws.close();
      resolve();
    };

    ws.onerror = (err) => {
      clearTimeout(timeout);
      console.error("WebSocket error", err);
      reject("WebSocket error");
    };

    ws.onclose = (event) => {
      clearTimeout(timeout);
      if (!event.wasClean) {
        reject(`Connection closed unexpectedly: ${event.code}`);
      }
    };
  });
};
