import React from "react";

const technologies = ["Python", "JavaScript", "C++", "C", "Java", "Android"];

const TechnologyFilter = ({ selected, setSelected }) => {
  const handleCheckboxChange = (technology) => {
    setSelected((prev) =>
      prev.includes(technology)
        ? prev.filter((item) => item !== technology)
        : [...prev, technology]
    );
  };

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Technologies</h2>
      {/* Removed search input */}
      <div className="max-h-40 overflow-y-auto">
        {technologies.map((tech, index) => (
          <label key={index} className="block mb-1">
            <input
              type="checkbox"
              className="mr-2"
              checked={selected.includes(tech)}
              onChange={() => handleCheckboxChange(tech)}
            />
            {tech}
          </label>
        ))}
      </div>
    </div>
  );
};

export default TechnologyFilter;
