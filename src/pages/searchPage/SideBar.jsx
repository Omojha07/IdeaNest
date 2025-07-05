import React, { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import TechnologyFilter from "./TechnologyFilter";
import TopicFilter from "./TopicFilter";

const Sidebar = () => {
  // State for each filter
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

  // Example: Combined data for debugging
  // console.log({ selectedCategories, selectedTechnologies, selectedTopics });

  return (
    <aside className="w-full md:w-64 bg-white p-4 shadow-md">
      {/* Category Filter (search bar removed) */}
      <CategoryFilter
        selected={selectedCategories}
        setSelected={setSelectedCategories}
      />

      {/* Technology Filter (unchanged) */}
      <TechnologyFilter
        selected={selectedTechnologies}
        setSelected={setSelectedTechnologies}
      />

      {/* Topic Filter (unchanged) */}
      <TopicFilter
        selected={selectedTopics}
        setSelected={setSelectedTopics}
      />
    </aside>
  );
};

export default Sidebar;
