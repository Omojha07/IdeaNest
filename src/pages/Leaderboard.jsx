import { useState, useEffect } from "react";

export default function Leaderboard() {
    const indianNames = [
      "Aarav Sharma", "Vihaan Patel", "Reyansh Gupta", "Aadhya Iyer", "Anaya Reddy",
      "Ishaan Mehta", "Kabir Nair", "Vivaan Singh", "Advait Choudhury", "Riya Agarwal",
      "Aryan Bhatia", "Meera Joshi", "Dhruv Malhotra", "Kavya Menon", "Tanisha Shah",
      "Neel Desai", "Saanvi Rao", "Rudra Saxena", "Tanishq Kapoor", "Parth Varma",
      "Devansh Tiwari", "Ira Das", "Laksh Mittal", "Suhana Bose", "Rohan Pillai"
    ];
  
    const [leaderboardData, setLeaderboardData] = useState([]);
  
    useEffect(() => {
      const sortedData = indianNames.map((name, index) => ({
        name,
        score: Math.floor(Math.random() * 1000) + 500,
        avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
      }))
      .sort((a, b) => b.score - a.score)
      .map((user, index) => ({ ...user, rank: index + 1 }));
  
      setLeaderboardData(sortedData);
    }, []);
  
    return (
      <div className="bg-gray-900 text-white p-4 shadow-lg border-l border-gray-700 
                      h-screen flex flex-col justify-start overflow-y-auto overflow-x-hidden">
        <h2 className="text-2xl font-bold text-center text-white mb-4">🏆 Leaderboard</h2>
  
        <div className="space-y-2 w-full">
          {leaderboardData.map((user) => (
            <div key={user.rank} 
              className="flex items-center justify-between p-3 border-b border-gray-700 last:border-none 
                         rounded-lg transition-all duration-300 hover:bg-gray-800 hover:scale-10">
              
              {/* Avatar & Name */}
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-gray-600" />
                <span className={`text-lg font-semibold ${user.rank <= 3 ? "text-yellow-400" : "text-white"}`}>
                  {user.rank}. {user.name}
                </span>
              </div>
  
              {/* Rank Icon */}
              <span className={`text-2xl transition-all duration-300 ${user.rank <= 3 ? "animate-pulse" : ""}`}>
                {user.rank === 1 ? "🏆" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : "🎖"}
              </span>
  
              {/* Score */}
              <span className="text-gray-400">{user.score} pts</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  