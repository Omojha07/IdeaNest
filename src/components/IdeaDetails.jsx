import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const Tick = () => (
  <svg
    className="w-6 h-6 inline-block mr-2 rounded-full bg-green-500 text-white p-0.5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const IdeaDetails = () => {
  const { user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/ideas/${id}`);
        const data = await response.json();
        if (data.success) {
          setIdea(data.idea);
        } else {
          console.error("Failed to fetch idea");
        }
      } catch (error) {
        console.error("Error fetching idea:", error);
      }
      setLoading(false);
    };

    fetchIdea();
  }, [id]);

  // Handle approve action (only for mentors)
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/ideas/${id}/approve`);

      setIdea((prevIdeas) =>
        Array.isArray(prevIdeas)
          ? prevIdeas.filter((idea) => idea._id !== id)
          : []
      );

      console.log("Idea approved successfully");
      navigate("/projects");
    } catch (error) {
      console.error("Error approving submission:", error);
    }
  };

  if (loading) return <p className="text-center">Loading idea...</p>;
  if (!idea)
    return <p className="text-center text-gray-500">Idea not found.</p>;

  const getFileType = (fileUrl) => {
    if (!fileUrl) return "unknown";
    if (fileUrl.match(/\.(jpg|jpeg|png)$/)) return "image";
    if (fileUrl.match(/\.(mp4|webm|mov)$/)) return "video";
    if (fileUrl.match(/\.pdf$/)) return "pdf";
    return "unknown";
  };

  const nextMedia = () => {
    setMediaIndex((prev) => (prev + 1) % idea.media.length);
  };

  const prevMedia = () => {
    setMediaIndex((prev) => (prev - 1 + idea.media.length) % idea.media.length);
  };

  const currentMedia = idea.media?.[mediaIndex] || "";

  // Function to get a preview (first 5 lines or 200 characters) of AI suggestions markdown
  const getPreview = (text) => {
    if (!text) return "";
    if (text.includes("\n")) {
      const lines = text.split("\n");
      if (lines.length > 5) {
        return lines.slice(0, 5).join("\n") + "...";
      }
      return text;
    } else {
      return text.length > 200 ? text.slice(0, 200) + "..." : text;
    }
  };

  const preview = getPreview(idea.aiSuggestions);

  return (
    <div className="md:mx-[10%] mx-auto p-6">
      <div className="flex justify-between">
        <Button onClick={() => navigate("/ideas")} className="mb-4">
          ← Back to Ideas
        </Button>
        {/* Show Approve Button for Mentors Only */}
        {user?.unsafeMetadata?.role === "admin" && (
          <Button
            onClick={() => handleApprove(idea._id)}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Approve
          </Button>
        )}
      </div>

      <h2 className="text-3xl font-bold">{idea.title}</h2>
      <p className="text-gray-600 mt-2">{idea.description}</p>

      {/* Media Display */}
      {idea.media?.length > 0 && (
        <div className="relative aspect-video mx-24 my-10 bg-gray-200">
          {getFileType(currentMedia) === "image" && (
            <img
              src={currentMedia}
              alt="Idea Media"
              className="w-full aspect-video object-cover"
            />
          )}
          {getFileType(currentMedia) === "video" && (
            <video controls className="w-full aspect-videoobject-cover">
              <source src={currentMedia} type="video/mp4" />
            </video>
          )}
          {getFileType(currentMedia) === "pdf" && (
            <a
              href={currentMedia}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 font-bold underline"
            >
              View PDF
            </a>
          )}

          {/* Navigation Arrows */}
          {idea.media.length > 1 && (
            <>
              <button
                className="absolute left-2 bg-gray-800 text-white p-2 rounded-full"
                onClick={prevMedia}
              >
                ◀
              </button>
              <button
                className="absolute right-2 bg-gray-800 text-white p-2 rounded-full"
                onClick={nextMedia}
              >
                ▶
              </button>
            </>
          )}
        </div>
      )}

      {/* Idea Details */}
      <div className="p-5 bor">
        <span className="inline-block mt-3 text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-600">
          {idea.category}
        </span>
        <p className="text-gray-600 mt-2 mb-4">
          <b>Description :</b>
          <br />
          {idea.description}
        </p>
        <p className="text-gray-600 mt-2 mb-4">
          <b>Problem Statement :</b>
          <br />
          {idea.problemStatement}
        </p>
        <p className="text-gray-600 mt-2 mb-4">
          <b>Links :</b>
          <br />
          {idea.referenceLinks}
        </p>
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Technology:</p>
          <p className="text-gray-800 font-semibold mb-4">
            {idea.technology || "N/A"}
          </p>
        </div>

        {/* AI Feasibility Test Section */}
        <div className="mt-10 p-4 bg-yellow-100 rounded-lg">
          <div className="flex items-center">
            <Tick />
            <span className="ml-2 font-semibold">
              Completed AI feasibility test
            </span>
          </div>
          <div className="mt-3">
            <span className="text-green-100 bg-green-700 rounded-full px-3 py-1 text-sm">
              Score: {idea.feasibilityScore || "Medium"}
            </span>
          </div>
          <div className="mt-4 p-4 bg-white border rounded">
            <div className="whitespace-pre-wrap">
              <ReactMarkdown>{preview}</ReactMarkdown>
            </div>
            {idea.aiSuggestions &&
              idea.aiSuggestions.length > preview.length && (
                <button
                  className="mt-2 text-blue-500 underline"
                  onClick={() => setShowPopup(true)}
                >
                  Read more
                </button>
              )}
          </div>
        </div>
      </div>

      {/* Popup Modal for Full AI Suggestions */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#00000071] bg-opacity-30 z-50">
          <div className="relative bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">AI Suggestions</h2>
            <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap">
              <ReactMarkdown>{idea.aiSuggestions}</ReactMarkdown>
            </div>
            <Button onClick={() => setShowPopup(false)} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaDetails;
