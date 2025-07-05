import { useEffect } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";

const SyncUser = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    async function syncUser() {
      if (!isLoaded || !user) return;

      try {
        const token = await getToken();
        const userData = {
          clerkId: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          avatar: user.imageUrl,
          role: user?.unsafeMetadata?.role,
        };
        await axios.post(
          "http://localhost:3000/api/users",
          userData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Sync error:", error);
      }
    }

    syncUser();
  }, [user, isLoaded, getToken]);

  return null;
};

export default SyncUser;