"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import Image from "next/image";
import React, { useState } from "react";

import {
  DollarSign,
  Book,
  Code,
  Dumbbell,
  Languages,
  Lightbulb,
  Music,
  Palette,
  MapPinIcon,
  MessageCircle,
  Building,
  GraduationCapIcon,
  SchoolIcon,
} from "lucide-react";
import { useAuth } from "@/modules/auth/contexts/authContext"; // Updated import
import { fetchSkillById } from "../../api";
import SkillMessageWindow from "../components/messaging-window";
import { generateTimeSlots, getNextDateForWeekday } from "@/lib/utils";
import { WeekdayDatePicker } from "../components/weekday-date-picker";
import { Button } from "@/components/ui/button";
import { format, formatDate } from "date-fns";

interface Props {
  skillId: string;
}

const skillCovers = [
  { value: "academic", label: "Academic", icon: Book },
  { value: "programming", label: "Programming", icon: Code },
  { value: "language", label: "Language", icon: Languages },
  { value: "creative", label: "Creative", icon: Palette },
  { value: "finance", label: "Finance", icon: DollarSign },
  { value: "music", label: "Music", icon: Music },
  { value: "fitness", label: "Fitness", icon: Dumbbell },
  { value: "softskills", label: "Soft Skills", icon: Lightbulb },
];

export const SkillView = ({ skillId }: Props) => {
  const { isAuthenticated, user, isInitialized } = useAuth();
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();

  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: ["skill", skillId],
    queryFn: () => fetchSkillById(skillId),
  });

  const initialMessage =
    selectedDay && selectedTime && selectedDate
      ? `Hi ${data.user.name}, I'm interested in your "${data.module}" skill. Could we schedule on ${selectedDay}, ${formatDate(selectedDate, "MMMM do")} at ${selectedTime}?`
      : `Hi ${data.user.name}, I'm interested in your "${data.module}" skill.`;

  return (
    <>
      <div className="px-4 lg:px-12 py-10">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="">
            {/* Image Gallery */}
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row">
                {/* Main Image */}
                <div className="flex-1 order-2 sm:order-1">
                  <div className="w-full relative aspect-[4/3] sm:max-h-[500px] cursor-pointer hover:scale-[1.02] transition-transform group bg-gray-200">
                    {/* Banner with category icon */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-slate-200 text-slate-600 group-hover:brightness-95 transition">
                      {(() => {
                        const cover = skillCovers.find(
                          (c) =>
                            c.value === data.skill_category.name.toLowerCase()
                        );
                        const Icon = cover?.icon || Lightbulb;
                        return (
                          <>
                            <Icon className="w-16 h-16 mb-2" />
                            <span className="text-lg font-semibold">
                              {cover?.label || "Skill"}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="flex-1">
              <div className="p-4 border-t flex flex-row justify-between items-center">
                <div className="">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                    {data.module}
                  </h2>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1 text-gray-600 mb-4">
                      <SchoolIcon className="w-4 h-4" />
                      <span className="text-sm">{data.department.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 mb-4">
                      <GraduationCapIcon className="w-4 h-4" />
                      <span className="text-sm">{data.degree.name}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    {data.charge_per_hour}€
                  </span>
                </div>
              </div>
              {/* Description */}
              <div className="p-4 sm:p-6 border-t">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {data.description}
                </p>
              </div>
            </div>
            {/* Right Sidebar */}
            <div className="flex w-full lg:w-96 justify-center items-center bg-gray-50 p-2 sm:p-4 border-t lg:border-l">
              {!isInitialized ? (
                // Loading state while auth is initializing
                <div className="text-center w-full">
                  <div className="animate-pulse">
                    <div className="bg-gray-300 rounded-lg h-48 w-full mb-4"></div>
                    <div className="bg-gray-300 rounded h-4 w-3/4 mx-auto mb-2"></div>
                    <div className="bg-gray-300 rounded h-4 w-1/2 mx-auto"></div>
                  </div>
                </div>
              ) : isAuthenticated && user ? (
                <div className="flex flex-col gap-4 p-2 w-full">
                  <div className="space-y-2">
                    <label className="font-medium">Choose a Day:</label>
                    <div className="flex gap-2 flex-wrap">
                      {Array.from(
                        new Set(data.available_time_week.map((t) => t.day))
                      ).map((day) => (
                        <Button
                          key={day}
                          variant={"outline"}
                          className={`px-3 py-2 rounded-md border ${
                            selectedDay === day
                              ? "bg-blue-100 border-blue-500 text-blue-700"
                              : "border-gray-300 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setSelectedDay(day);
                            setSelectedTime("");
                            setSelectedDate(undefined);
                          }}
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDay && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        Choose Time
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          const slot = data.available_time_week.find(
                            (s) => s.day === selectedDay
                          );
                          if (!slot) return null;
                          const times = generateTimeSlots(
                            slot.start_time,
                            slot.end_time,
                            30
                          );
                          return times.map((t) => (
                            <button
                              key={t}
                              onClick={() => setSelectedTime(t)}
                              className={`px-3 py-2 rounded-md border ${
                                selectedTime === t
                                  ? "bg-blue-100 border-blue-500 text-blue-700"
                                  : "border-gray-300 hover:bg-gray-100"
                              }`}
                            >
                              {t}
                            </button>
                          ));
                        })()}
                      </div>
                    </div>
                  )}

                  {/* 3. Date Picker */}
                  {selectedDay && selectedTime && (
                    <div className="">
                      <label className="font-medium block mb-2">
                        Pick a Date:
                      </label>
                      <WeekdayDatePicker
                        selected={selectedDate}
                        onSelect={(date) => setSelectedDate(date)}
                        allowedWeekday={selectedDay}
                      />
                    </div>
                  )}
                  <SkillMessageWindow
                    senderId={user.id.toString()}
                    receiverId={data.user.id.toString()}
                    productName={data.module}
                    sellerName={data.user.name}
                    initialMessage={initialMessage}
                  />
                </div>
              ) : (
                // Non-authenticated User View
                <div className="text-center">
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Contact the Seller
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sign in to send messages and get contact details
                    </p>
                  </div>

                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors mb-4">
                    Log in to Contact Seller
                  </button>

                  <p className="text-xs text-gray-500">
                    By signing in, you can message sellers directly and access
                    their contact information
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ProductViewSkeleton = () => {
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            alt={"Placeholder"}
            src={"/placeholder.jpg"}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};
