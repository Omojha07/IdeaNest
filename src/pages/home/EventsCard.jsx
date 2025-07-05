import React from "react";

function EventsCard({ backgroundImage, heading, date }) {
  const textShadowStyle = {
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  };

  return (
    <div className="relative flex-shrink-0 mr-4 w-64 md:w-80 h-96 rounded-xl shadow-md overflow-hidden group">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 transform group-hover:scale-110"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
        <h3 className="text-white text-2xl font-bold" style={textShadowStyle}>
          {heading}
        </h3>
        <p className="text-white" style={textShadowStyle}>
          {date}
        </p>
      </div>
    </div>
  );
}

export default EventsCard;
