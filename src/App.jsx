import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import AppLayout from "./layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/home/Home";
import ProtectedRoute from "./components/protected-route";
import RoleSelection from "./pages/RoleSelection";
import CreateIdea from "./pages/home/subpages/CreateIdea";
import Ideas from "./pages/admin/Ideas";
import IdeaDetails from "./components/IdeaDetails";
import ProjectSection from "./pages/home/subpages/Projects";
import ProjectDetails from "./components/ProjectDetails";
import SyncUser from "./auth/SyncUser.jsx";
import Community from "./pages/Community/Community.jsx";
import SearchPage from "./pages/searchPage/SearchPage";
import PageNotFound from "./pages/PageNotFound";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import ProfilePage from "./pages/Profile/ProfilePage";
import MyProjects from "./pages/Profile/MyProjects";
import AdminDashboard from "./pages/AdminDashboard";
import Unauthorized from "./components/Unauthorized";
import Users from "./pages/admin/Users";
import Main from "./pages/AI-Mentor/components/Main/Main";
import ChatBot from "./pages/AI-Mentor/ChatBot";
import Leaderboard from "./pages/Leaderboard";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <SignedIn>
              <Navigate to="/home" />
            </SignedIn>
            <SignedOut>
              <LandingPage />
            </SignedOut>
          </>
        ),
      },
      {
        path: "/select-role",
        element: (
          <ProtectedRoute>
            <RoleSelection />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create-idea",
        element: (
          <ProtectedRoute>
            <CreateIdea />
          </ProtectedRoute>
        ),
      },
      {
        path: "/community",
        element: (
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ideas",
        element: (
          <ProtectedRoute>
            <Ideas />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ideas/:id",
        element: (
          <ProtectedRoute>
            <IdeaDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/*",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ideas/:id",
        element: (
          <ProtectedRoute>
            <IdeaDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/projects",
        element: (
          <ProtectedRoute>
            <ProjectSection />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/projects",
        element: (
          <ProtectedRoute>
            <ProjectSection />
          </ProtectedRoute>
        ),
      },
      {
        path: "/projects/:id",
        element: (
          <ProtectedRoute>
            <ProjectDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/leaderboard",
        element: (
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ai-mentor",
        element: (
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ask-ai",
        element: (
          <ProtectedRoute>
            <ChatBot />
          </ProtectedRoute>
        ),
      },
      {
        path: "/unauthorized",
        element: (
            <Unauthorized />
        ),
      },
      {
        path: "*", // Wildcard route for 404 page
        element: <PageNotFound />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SignedIn>
        <SyncUser />
      </SignedIn>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
