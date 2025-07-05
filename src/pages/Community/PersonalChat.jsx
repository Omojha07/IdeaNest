import React from "react";

export default function PersonalChat({ user }) {
  return (
    <div className="flex flex-col h-[calc(100vh_-_100px)] bg-gray-300">
      <header className="bg-gray-100 p-4 border-b">
        <h2 className="text-2xl font-bold">Chat with {user.name}</h2>
      </header>
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Placeholder for personal chat messages */}
        <p className="text-center text-gray-500">
          Personal chat functionality coming soon...
        </p>
      </div>
      <form className="flex items-center gap-2 p-4">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
        <button
          type="button"
          className="px-2 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition focus:outline-none"
        >
          Send
        </button>
      </form>
    </div>
  );
}
