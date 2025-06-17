import { AvailableTimeWeekEntity } from "@/modules/skills/types";
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

export const generateTimeSlots = (
  start: string,
  end: string,
  interval = 30
): string[] => {
  const slots: string[] = [];
  let [startH, startM] = start.split(":").map(Number);
  let [endH, endM] = end.split(":").map(Number);

  while (startH < endH || (startH === endH && startM < endM)) {
    const time = `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")}`;
    slots.push(time);

    startM += interval;
    if (startM >= 60) {
      startM = startM % 60;
      startH += 1;
    }
  }
  return slots;
};

export const getNextDateForWeekday = (weekday: string): string => {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  const todayIndex = today.getDay();
  const targetIndex = weekdays.indexOf(weekday);

  const diff = (targetIndex + 7 - todayIndex) % 7 || 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + diff);

  return nextDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
};

export async function uploadToS3(file: File): Promise<string> {
  const res = await fetch("http://localhost:3000/api/s3-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to get presigned URL");
  }

  const { uploadUrl, publicUrl } = await res.json(); // ✅ Only call once!

  // Now upload to S3
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Upload to S3 failed");
  }

  console.log("✅ Uploaded:", publicUrl);
  return publicUrl;
}

const daysOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const sortedAvailability = (data: AvailableTimeWeekEntity[]) =>
  data.sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day));
