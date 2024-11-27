import { montserrat } from "@/constants/font";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div
      className={`flex items-center justify-center h-screen bg-gray-100 ${montserrat.className}`}
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold text-dark mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Tour Not Found</p>
        <Link href="/" className="text-primary hover:underline">
          Go back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
