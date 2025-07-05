import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Check, Star, GitFork, Eye } from "lucide-react";

const ProjectDetails = ({ projectId: propProjectId }) => {
  const { id: routeId } = useParams();
  const projectId = propProjectId || routeId;
  const navigate = useNavigate();
  const { user } = useUser();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubRepoData, setGithubRepoData] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [commitCount, setCommitCount] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");

  const parseGithubUrl = (url) => {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/;
    const match = url.match(regex);
    if (match && match.length >= 3) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
    }
    return null;
  };

  useEffect(() => {
    if (!projectId) {
      console.error("No project id provided");
      setLoading(false);
      return;
    }
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/projects/${projectId}`
        );
        const data = await response.json();
        console.log("Fetched project data:", data);
        if (data.success && data.project) {
          setProject(data.project);
        } else {
          console.error("Project not found or error occurred", data.message);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
      setLoading(false);
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const fetchGithubData = async () => {
      if (
        project &&
        project.referenceLinks &&
        project.referenceLinks.length > 0
      ) {
        const githubUrl = project.referenceLinks.find((link) =>
          link.includes("github.com")
        );
        if (githubUrl) {
          const parsed = parseGithubUrl(githubUrl);
          if (parsed) {
            const { owner, repo } = parsed;
            try {
              // Fetch repository data
              const repoResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}`
              );
              const repoData = await repoResponse.json();
              console.log("GitHub repo data:", repoData);
              setGithubRepoData(repoData);

              // Fetch contributors
              const contributorsResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contributors`
              );
              const contributorsData = await contributorsResponse.json();
              console.log("GitHub contributors data:", contributorsData);
              setContributors(
                Array.isArray(contributorsData) ? contributorsData : []
              );

              // Fetch commit count by requesting 1 commit per page and reading the Link header
              const commitsResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`
              );
              const linkHeader = commitsResponse.headers.get("Link");
              console.log("Commits Link header:", linkHeader);
              if (linkHeader) {
                const lastPageMatch = linkHeader.match(
                  /page=(\d+)>; rel="last"/
                );
                if (lastPageMatch) {
                  setCommitCount(parseInt(lastPageMatch[1]));
                  console.log("Total commits (from header):", lastPageMatch[1]);
                }
              } else {
                const commitsData = await commitsResponse.json();
                setCommitCount(commitsData.length);
                console.log("Total commits (from data length):", commitsData.length);
              }
            } catch (error) {
              console.error("Error fetching GitHub data:", error);
            }
          }
        }
      }
    };
    fetchGithubData();
  }, [project]);

  const getFileType = (fileUrl) => {
    if (!fileUrl) return "unknown";
    if (fileUrl.match(/\.(jpg|jpeg|png)$/)) return "image";
    if (fileUrl.match(/\.(mp4|webm|mov)$/)) return "video";
    if (fileUrl.match(/\.pdf$/)) return "pdf";
    return "unknown";
  };

  // Process technology field: split by commas if it's a string.
  const technologyItems =
    typeof project?.technology === "string"
      ? project.technology
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : Array.isArray(project?.technology)
      ? project.technology
      : [];

  // Use the first media item for the figure.
  const media = project?.media?.[0] || "";

  const handleDonate = async () => {
    const amount = parseFloat(donationAmount);
    console.log("Attempting donation with amount:", donationAmount, "Parsed:", amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }
    // Ensure the user is logged in
    if (!user) {
      alert("User not authenticated. Please log in.");
      return;
    }
    try {
      const userId = user.id;
      console.log("Sending donation for project:", project._id, "User:", userId);
      // Updated URL: make sure your server mounts the route under /api/projects
      const response = await fetch(`http://localhost:3000/api/projects/${project._id}/fund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount }),
      });
      const text = await response.text();
      console.log("Raw donation response text:", text);
      try {
        const data = JSON.parse(text);
        console.log("Donation response parsed JSON:", data);
        if (data.success) {
          alert("Donation successful!");
          // Update the current funding value locally
          setProject({
            ...project,
            currentFunding: project.currentFunding + amount,
          });
          setDonationAmount("");
        } else {
          alert("Donation failed: " + data.message);
        }
      } catch (jsonError) {
        console.error("Error parsing donation response JSON:", jsonError);
        alert("Donation failed: Unable to parse server response.");
      }
    } catch (error) {
      console.error("Error donating:", error);
      alert("An error occurred while processing your donation.");
    }
  };

  if (loading) return <p className="text-center">Loading project...</p>;

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-500 mb-4">Project not found.</p>
        <Button onClick={() => navigate("/projects")}>
          ← Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="md:mx-[10%] mx-auto p-6">
      <header className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-6">
          <span className="text-5xl">{project.icon || "📁"}</span>
          <div>
            <span className="text-2xl font-bold">{project.title}</span>
            <p className="text-sm text-gray-500">
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div>
          {project.approved && (
            <div className="flex items-center bg-green-600 text-white px-3 py-2 rounded-full">
              <Check className="w-6 h-6" />
              approved
            </div>
          )}
        </div>
      </header>

      {project.media?.length > 0 && getFileType(media) === "image" && (
        <figure className="relative aspect-video mx-24 my-10 bg-gray-200">
          <img
            src={media}
            alt="Project media"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </figure>
      )}

      <div className="mt-6 flex justify-between lg:flex-row flex-col space-y-6">
        {/* Left Section: Project Details */}
        <div className="space-y-5">
          <div className="flex gap-4">
            <p className="text-black mt-2 border border-green-700 bg-green-200 w-fit px-3 py-1 rounded-full">
              {project.category || "N/A"}
            </p>
            <p className="text-black mt-2 border border-yellow-700 bg-yellow-200 w-fit px-3 py-1 rounded-full">
              Feasibility: {project.feasibilityScore}
            </p>
          </div>
          <p className="text-gray-600 mt-2">
            <b>Description:</b> <br /> {project.description}
          </p>
          {technologyItems.length > 0 && (
            <div className="">
              <h3 className="text-lg font-semibold">Tech stacks:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {technologyItems.map((tech, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-300 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Funding Section */}
          <div className="mt-8 border-t pt-4">
            <h3 className="text-xl font-semibold mb-2">Funding</h3>
            <div className="mb-4">
              <p>
                Current Funding: ${project.currentFunding} / ${project.fundingGoal}
              </p>
              <progress
                className="w-full"
                value={project.currentFunding}
                max={project.fundingGoal}
              ></progress>
            </div>
            <div className="flex gap-4">
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => {
                  console.log("Donation amount changed to:", e.target.value);
                  setDonationAmount(e.target.value);
                }}
                placeholder="Enter donation amount"
                className="border border-gray-300 rounded p-2 w-40"
              />
              <Button onClick={handleDonate}>Donate</Button>
            </div>
          </div>
        </div>

        {/* Right Section: Repository Details */}
        <div className="border border-gray-300 bg-white p-5 pb-8 rounded-2xl md:min-w-[380px] overflow-hidden h-fit">
          <h3 className="text-lg font-semibold mb-2">Repository:</h3>
          {Array.isArray(project.referenceLinks) && project.referenceLinks.length > 0 ? (
            <p className="text-blue-500 underline truncate">
              <a
                href={project.referenceLinks.find((link) => link.includes("github.com"))}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.referenceLinks.find((link) => link.includes("github.com"))}
              </a>
            </p>
          ) : (
            <p>No repository link available</p>
          )}
          {githubRepoData && (
            <div className="mt-4 space-y-2.5">
              <p className="text-gray-900 mt-1 flex gap-2">
                <Star /> <span className="font-semibold">Stars:</span> {githubRepoData.stargazers_count}
              </p>
              <p className="text-gray-900 mt-1 flex gap-2">
                <GitFork /> <span className="font-semibold">Forks:</span> {githubRepoData.forks_count}
              </p>
              <p className="text-gray-900 mt-1 flex gap-2">
                <Eye /> <span className="font-semibold">Watchers:</span> {githubRepoData.watchers_count}
              </p>
              <p className="text-gray-900 mt-1 flex gap-2">
                <span className="font-semibold">Total Contributors:</span> {contributors.length}
              </p>
              {commitCount !== null && (
                <p className="text-gray-900 mt-1 flex gap-2">
                  <span className="font-semibold">Total Commits:</span> {commitCount}
                </p>
              )}
              <p className="text-gray-900 mt-1 flex gap-2">
                <span className="font-semibold">Repo Created:</span> {new Date(githubRepoData.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
