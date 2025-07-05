import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

const categories = [
  { name: "Technology & Software" },
  { name: "Healthcare & Biotechnology" },
  { name: "Aerospace & Defense" },
  { name: "Environment & Sustainability" },
  { name: "Infrastructure & Smart Cities" },
  { name: "Business & Finance" },
  { name: "Education & EdTech" },
  { name: "Media & Entertainment" },
  { name: "Food & Agriculture" },
  { name: "Automotive & Transportation" },
  { name: "Retail & E-Commerce" },
];

const CreateIdea = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    problemStatement: "",
    description: "",
    category: "",
    technology: "",
    referenceLinks: "",
    media: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setFormData((prev) => ({ ...prev, category: categoryName })); // Sync with formData
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, media: Array.from(e.target.files) }); // Convert FileList to Array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // **Validation Check**
    if (
      !formData.title ||
      !formData.problemStatement ||
      !formData.description ||
      !formData.category || // Now properly set
      formData.media.length === 0
    ) {
      alert("All fields are required. Please fill out everything.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("problemStatement", formData.problemStatement);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("technology", formData.technology);
    data.append("referenceLinks", formData.referenceLinks);
    // ✅ Use Clerk user ID dynamically
    if (user) {
      data.append("userObject", user.id);
    } else {
      alert("User not authenticated. Please log in.");
      return;
    }

    formData.media.forEach((file) => data.append("media", file));

    try {
      const response = await fetch("http://localhost:3000/api/ideas", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (result.success) {
        alert("Idea submitted successfully!");
        navigate("/ideas");
      } else {
        alert(`Error: ${result.message}`);
        console.error("Error details:", result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error! Check console for details.");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 md:mx-[10%] my-10">
        Share Your Idea
      </h2>
      <form
        onSubmit={handleSubmit}
        className="p-10 md:mx-[10%] mx-auto rounded-2xl bg-amber-600/10 my-5"
      >
        <div className="lg:flex gap-4 w-full space-y-4">
          {/* Left Section */}
          <div className="space-y-4 flex-1">
            <input
              type="text"
              name="title"
              placeholder="Your project's name?"
              onChange={handleChange}
              required
              className="block w-full p-3 border border-slate-500 rounded-lg"
            />
            <textarea
              name="problemStatement"
              placeholder="Problem Statement (What issue does it solve?)"
              onChange={handleChange}
              required
              className="block w-full p-3 border border-slate-500 rounded-lg"
            ></textarea>

            <textarea
              name="description"
              placeholder="Describe your idea.."
              onChange={handleChange}
              required
              className="block w-full p-3 border border-slate-500 rounded-lg"
            ></textarea>
          </div>

          {/* Right Section */}
          <div className="space-y-4 w-min">
            <div className="relative w-48 h-48 border border-slate-500 rounded-lg flex items-center justify-center cursor-pointer hover:border-slate-500 transition-colors">
              <div className="relative w-48 h-48 border border-slate-500 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-colors">
                <input
                  type="file"
                  name="media"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-12 h-12 text-black" />
                <span className="mt-2 text-sm text-gray-700">Upload Image</span>
              </div>
            </div>
            <input
              type="text"
              name="referenceLinks"
              placeholder="Github Link?"
              onChange={handleChange}
              className="block w-full p-3 border border-slate-500 rounded-lg"
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2 mt-6">Select a Category:</h3>
        <div className="flex flex-wrap gap-4 mb-10">
          {categories.map((category) => (
            <button
              type="button"
              key={category.name}
              onClick={() => handleCategorySelect(category.name)}
              className={`px-4 py-2 rounded-full text-sm border border-slate-500 transition-colors flex items-center justify-center ${
                formData.category === category.name
                  ? "bg-yellow-500 text-white"
                  : "hover:bg-yellow-500/50"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <input
          type="text"
          name="technology"
          placeholder="Technology (comma-separated)  eg: React, javaScript, Python"
          onChange={handleChange}
          className="block w-full p-3 border border-slate-500 rounded-lg mb-4"
        />
        <button
          type="submit"
          className="mt-3 bg-yellow-300 hover:bg-yellow-400 text-black p-3 px-5 border border-slate-500 rounded-full font-semibold"
        >
          Submit Idea
        </button>
      </form>
    </>
  );
};

export default CreateIdea;
