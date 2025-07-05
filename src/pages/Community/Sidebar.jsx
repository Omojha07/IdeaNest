import React from "react";

const dummyUsers = [
  { id: 1, name: "Alice", avatar: "/avatars/alice.png" },
  { id: 2, name: "Bob", avatar: "/avatars/bob.png" },
  { id: 3, name: "Charlie", avatar: "/avatars/charlie.png" },
  { id: 4, name: "David", avatar: "/avatars/david.png" },
];

export default function Sidebar({ selectedChat, setSelectedChat }) {
  return (
    <div className="space-y-4 mx-4 ">
      <h3 className="text-lg font-bold mb-2">Community </h3>

      <div
        className={`flex items-center space-x-3 p-2 rounded-full hover:bg-yellow-100 transition-colors cursor-pointer ${
          selectedChat === "global" ? "bg-yellow-200" : ""
        }`}
        onClick={() => setSelectedChat("global")}
      >
        <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full">
          G
        </div>
        <span className="font-medium">Global Chat</span>
      </div>

      <div className="border-t border-gray-400 pt-4">
        <h3 className="text-lg font-bold mb-2">Personal Chats</h3>
        {dummyUsers.map((user) => (
          <div
            key={user.id}
            className={`flex items-center space-x-3 p-2 rounded-full hover:bg-yellow-100 transition-colors cursor-pointer ${
              selectedChat?.id === user.id ? "bg-yellow-200" : ""
            }`}
            onClick={() => setSelectedChat(user)}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-gray-500"
            />
            <span className="font-medium">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
