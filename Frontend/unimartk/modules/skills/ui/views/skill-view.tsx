"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

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
  CalendarDaysIcon,
} from "lucide-react";
import { useAuth } from "@/modules/auth/contexts/authContext"; // Updated import
import { fetchSkillById } from "../../api";
import SkillMessageWindow from "../components/messaging-window";
import {
  generateTimeSlots,
  getNextDateForWeekday,
  sortedAvailability,
} from "@/lib/utils";
import { WeekdayDatePicker } from "../components/weekday-date-picker";
import { Button } from "@/components/ui/button";
import { format, formatDate } from "date-fns";
import dynamic from "next/dynamic";

interface Props {
  skillId: string;
}

const ClientLink = dynamic(
  () => import("@/components/client-link").then((m) => m.default),
  {
    ssr: false,
  }
);

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

  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: ["skill", skillId],
    queryFn: () => fetchSkillById(skillId),
  });

  return (
    <>
      <div className="px-4 lg:px-12 py-10">
        <div className="bg-background text-foreground rounded-lg overflow-hidden shadow-sm">
          <div>
            {/* Image Gallery */}
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row">
                {/* Main Image */}
                <div className="flex-1 order-2 sm:order-1">
                  <div className="w-full relative aspect-[4/3] sm:max-h-[500px] cursor-pointer hover:scale-[1.02] transition-transform group bg-muted">
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-muted text-muted-foreground group-hover:brightness-95 transition">
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
              <div className="p-4 border-t border-border flex flex-row justify-between items-center">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                    {data.module}
                  </h2>
                  <div className="flex flex-col md:flex-row gap-1 md:gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <SchoolIcon className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        {data.department.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <GraduationCapIcon className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        {data.degree.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-xl sm:text-2xl font-bold">
                    {data.charge_per_hour}€
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-muted-foreground" />
                  Weekly Availability
                </h3>
                <ul className="space-y-2">
                  {sortedAvailability(data.available_time_week).map(
                    (slot, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-3 bg-muted rounded-md border border-border"
                      >
                        <span className="font-medium">{slot.day}</span>
                        <span className="text-sm text-muted-foreground">
                          {slot.start_time.slice(0, 5)} -{" "}
                          {slot.end_time.slice(0, 5)}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="p-4 sm:p-6 border-t border-border">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {data.description}
                </p>
              </div>
            </div>

            <div className="flex w-full lg:w-96 justify-center items-center  p-2 sm:p-4 border-t lg:border-l border-border">
              {!isInitialized ? (
                <div className="text-center w-full">
                  <div className="animate-pulse">
                    <div className="bg-muted rounded-lg h-48 w-full mb-4"></div>
                    <div className="bg-muted rounded h-4 w-3/4 mx-auto mb-2"></div>
                    <div className="bg-muted rounded h-4 w-1/2 mx-auto"></div>
                  </div>
                </div>
              ) : isAuthenticated && user ? (
                <SkillMessageWindow
                  senderId={user.id.toString()}
                  receiverId={data.user.id.toString()}
                  productName={data.module}
                  sellerName={data.user.name}
                  data={data}
                />
              ) : (
                <div className="text-center">
                  <div className="mb-4 p-4 bg-primary/10 rounded-lg border border-blue-200/30">
                    <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Contact the Seller</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign in to send messages and get contact details
                    </p>
                  </div>

                  <ClientLink basePath="/sign-in">
                    <Button className="w-full mb-2">Log in</Button>
                  </ClientLink>

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
