import React from "react";
import { Link } from "react-router-dom";
import {  ArrowLeft } from "lucide-react";
const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center ">
        <h1 className="text-[14vw] font-bold text-red-500">404</h1>
        <p className="text-xl mt-2 text-gray-700">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="mt-6 px-4 py-2 bg-yellow-400 w-fit mx-auto !text-black rounded hover:bg-yellow-600 transition-colors flex gap-4"
        >
          <ArrowLeft/>Go to Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
