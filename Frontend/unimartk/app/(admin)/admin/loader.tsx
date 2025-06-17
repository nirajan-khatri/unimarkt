"use client";
import { Loader } from "lucide-react";
import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center h-96">
      <Loader className="animate-spin" />
    </div>
  );
};

export default LoadingPage;
