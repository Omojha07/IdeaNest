import { clerkClient } from "@clerk/clerk-sdk-node";

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  };

  // export const requireAuth = async (req, res, next) => {
  //   const token = req.headers.authorization?.split(" ")[1];
  
  //   if (!token) {
  //     return res.status(401).json({ message: "Unauthorized - No token provided" });
  //   }
  
  //   try {
  //     const { userId } = await clerkClient.verifyToken(token);
  //     const clerkUser = await clerkClient.users.getUser(userId);
  
  //     req.user = {
  //       userId: clerkUser.id,
  //       name: `${clerkUser.firstName} ${clerkUser.lastName}`,
  //       email: clerkUser.emailAddresses[0]?.emailAddress,
  //       role: clerkUser.unsafeMetadata?.role || "user",
  //       avatar: clerkUser.imageUrl,
  //     };
  
  //     next();
  //   } catch (error) {
  //     console.error("❌ Error verifying token:", error);
  //     return res.status(401).json({ message: "Unauthorized - Invalid token" });
  //   }
  // };
  