import React from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import PageNotFound from "../PageNotFound"; // Import the 404 page
import SavedProjects from "./SavedProjects";
import MyProjects from "./MyProjects";

const ProfilePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <nav className="mb-4">
        <NavLink
          to="/profile/saved-projects"
          style={({ isActive }) => ({
            marginRight: "1rem",
            padding: "0.5rem 1rem",
            color: "black",
            borderRadius: "5rem",
            backgroundColor: isActive ? "#fff7a3" : "transparent",
          })}
        >
          Saved Projects
        </NavLink>
        <NavLink
          to="/profile/my-projects"
          style={({ isActive }) => ({
            padding: "0.5rem 1rem",
            color: "black",
            borderRadius: "5rem",
            backgroundColor: isActive ? "#fff7a3" : "transparent",
          })}
        >
          My Projects
        </NavLink>
      </nav>

      <Routes>
        <Route index element={<Navigate to="saved-projects" replace />} />
        <Route path="saved-projects" element={<SavedProjects />} />
        <Route path="my-projects" element={<MyProjects />} />
        <Route path="*" element={<PageNotFound />} />{" "}
      </Routes>
    </div>
  );
};

export default ProfilePage;
