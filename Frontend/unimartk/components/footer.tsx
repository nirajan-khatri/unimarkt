import React from "react";

export const Footer = () => {
  return (
    <footer className="flex border-t border-border justify-between font-medium p-6">
      <div className="flex items-center w-full justify-between text-muted-foreground">
        <p className="">UniMarkt, Inc.</p>
        <p className="">
          {" "}
          &copy; This project is developed solely for educational purposes at
          Hochschule Fulda.
        </p>
      </div>
    </footer>
  );
};
