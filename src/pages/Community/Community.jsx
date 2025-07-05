import React, { useState } from "react";
import CommunityChat from "./CommunityChat";
import Sidebar from "./Sidebar";
import PersonalChat from "./PersonalChat";

export default function Community() {
  const [selectedChat, setSelectedChat] = useState("global");

  return (
    <div className="flex h-[calc(100vh_-_90px)] px-4">
      <aside className="w-1/4 max-w-[320px]  border-r overflow-y-auto">
        <Sidebar
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      </aside>

      <main className="flex-1 flex flex-col ">
        {selectedChat === "global" ? (
          <>
            <section className="flex-1 min-h-[calc(100vh_-_110px)]">
              <CommunityChat />
            </section>
          </>
        ) : (
          <PersonalChat user={selectedChat} />
        )}
      </main>
    </div>
  );
}
