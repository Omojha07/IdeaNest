import React from "react";

const topics = ["Web", "Machine Learning", "Cloud", "Graphics", "AI", "Education"];

const TopicFilter = ({ selected, setSelected }) => {
  const handleCheckboxChange = (topic) => {
    setSelected((prev) =>
      prev.includes(topic)
        ? prev.filter((item) => item !== topic)
        : [...prev, topic]
    );
  };

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Topics</h2>
      {/* Removed search input */}
      <div className="max-h-40 overflow-y-auto">
        {topics.map((topic, index) => (
          <label key={index} className="block mb-1">
            <input
              type="checkbox"
              className="mr-2"
              checked={selected.includes(topic)}
              onChange={() => handleCheckboxChange(topic)}
            />
            {topic}
          </label>
        ))}
      </div>
    </div>
  );
};

export default TopicFilter;
