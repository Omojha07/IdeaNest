import React, { useEffect, useState } from "react";
import { NavLink, useSearchParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  BriefcaseBusiness,
  Heart,
  MessageCircle,
  ChartNoAxesColumn,
  Search,
} from "lucide-react";
import {
  SignIn,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import ChatBot from "@/pages/AI-Mentor/ChatBot";

function NavBar() {
  const { user } = useUser();
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
      document.body.style.backgroundColor = "black";
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
  };

  // Common active styling: if active, add border-black; otherwise, border-transparent with hover effect.
  const linkClasses = ({ isActive }) =>
    `!text-black font-semibold border-b ${
      isActive ? "border-black" : "border-transparent hover:border-black"
    }`;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-8 border-b flex justify-between items-center bg-[#FFFCEF]">
        <div className="flex items-center gap-8 justify-left">
          <Link to="/" className="flex gap-3 items-center">
            <img
              src="/icons/IdeaNestLogo.webp"
              alt="&#128161;"
              className="size-9"
            />
            <h1 className="hidden lg:block text-2xl font-semibold text-black">
              Idea Nest
            </h1>
          </Link>

          <SignedOut>
            <NavLink to="/home" className={linkClasses}>
              Home
            </NavLink>
          </SignedOut>

          <NavLink to="/community" className={linkClasses}>
            Community
          </NavLink>

          <NavLink to="/leaderboard" className={linkClasses}>
            Leaderboard
          </NavLink>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0 items-center">
        <ChatBot onShowId={setSelectedId} />
          <form
            onSubmit={handleSearchSubmit}
            className="flex rounded-full border p-0.5 border-black"
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hidden md:block rounded-full px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="rounded-full bg-[#ffd000] hover:bg-[#e4ba00] p-1.5"
            >
              <Search />
            </button>
          </form>
          <SignedOut>
            <Button variant="outline" onClick={() => setShowSignIn(true)}>
              Login
            </Button>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "!w-9 !h-9",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Posts"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-posts"
                />
                <UserButton.Link
                  label="Saved Posts"
                  labelIcon={<Heart size={15} />}
                  href="/saved-posts"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/select-role"
            fallbackRedirectUrl="/select-role"
          />
        </div>
      )}
      <div className="h-[80px]"></div>
    </>
  );
}

export default NavBar;
