import React from "react";

const categories = [
  "Artificial Intelligence",
  "Data",
  "Development Tools",
  "End User Applications",
  "Infrastructure and Cloud",
  "Media",
];

const CategoryFilter = ({ selected, setSelected }) => {
  const handleCheckboxChange = (category) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Categories</h2>
      {/* Removed search input */}
      <div className="max-h-40 overflow-y-auto">
        {categories.map((category, index) => (
          <label key={index} className="block mb-1">
            <input
              type="checkbox"
              className="mr-2"
              checked={selected.includes(category)}
              onChange={() => handleCheckboxChange(category)}
            />
            {category}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
