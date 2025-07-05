import React from "react";

function IconCard({ icon, name, category, techStack="" }) {
  const techItems = techStack
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div
      className={`min-w-[220px] my-4 p-6 border rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-lg bg-gray-300 shadow-md`}
    >
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold mb-1 text-gray-800 text-center">
        {name}
      </h3>
      {category && (
        <p className="text-sm text-gray-500 text-center mb-3">{category}</p>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        {techItems.map((tech) => (
          <span
            key={tech}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export default IconCard;
