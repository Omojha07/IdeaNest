import { useContext, useState, useEffect } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import { Line, Radar, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const INDUSTRY_BENCHMARKS = {
  tech: {
    avgGrowthRate: 25,
    avgProfitMargin: 65,
    marketSize: "Large",
    initialInvestment: "High",
    breakEvenMonths: 18,
  },
  retail: {
    avgGrowthRate: 15,
    avgProfitMargin: 45,
    marketSize: "Medium",
    initialInvestment: "Medium",
    breakEvenMonths: 12,
  },
  food: {
    avgGrowthRate: 10,
    avgProfitMargin: 35,
    marketSize: "Medium",
    initialInvestment: "Medium",
    breakEvenMonths: 24,
  },
  healthcare: {
    avgGrowthRate: 20,
    avgProfitMargin: 55,
    marketSize: "Large",
    initialInvestment: "High",
    breakEvenMonths: 36,
  },
};

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    error,
  } = useContext(Context);

  // Make sure we have a way to safely access business metrics
  const defaultBusinessMetrics = {
    marketPotential: 75,
    competitionLevel: 60,
    initialInvestment: 50,
    profitMargin: 65,
    riskFactor: 45,
    scalability: 80,
    innovationScore: 70,
    marketTrend: 65,
    customerDemand: 70,
    regulatoryRisk: 40,
  };

  const [businessMetrics, setBusinessMetrics] = useState(
    defaultBusinessMetrics
  );
  const [industryType, setIndustryType] = useState("tech");
  const [revenueProjection, setRevenueProjection] = useState([
    30, 45, 57, 75, 85, 95,
  ]);
  const [historicalData, setHistoricalData] = useState({
    success_rate: 75,
    avg_growth: 20,
    market_size: "$5B",
  });

  // Add a state for industry comparison data
  const [industryComparisonData, setIndustryComparisonData] = useState({
    labels: ["Success Rate", "Growth Rate", "Profit Margin", "Market Size"],
    datasets: [
      {
        label: "Your Business",
        data: [
          Math.round(
            (businessMetrics.marketPotential + businessMetrics.scalability) / 2
          ),
          businessMetrics.scalability,
          businessMetrics.profitMargin,
          businessMetrics.marketPotential,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Industry Average",
        data: [
          historicalData.success_rate,
          INDUSTRY_BENCHMARKS[industryType].avgGrowthRate,
          INDUSTRY_BENCHMARKS[industryType].avgProfitMargin,
          70, // Base market size score
        ],
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
    ],
  });

  // Function to analyze AI response and update metrics
  const analyzeAIResponse = (response) => {
    if (!response) return;

    try {
      const text = response.toLowerCase();
      const newMetrics = { ...businessMetrics };

      // Advanced industry detection with NLP-like pattern matching and keyword weighting
      const industryKeywords = {
        tech: [
          "tech",
          "software",
          "digital",
          "technology",
          "it ",
          "app",
          "saas",
          "platform",
          "online",
          "internet",
          "web",
          "cloud",
          "ai",
          "machine learning",
          "blockchain",
        ],
        food: [
          "food",
          "restaurant",
          "catering",
          "culinary",
          "bakery",
          "meal",
          "cooking",
          "kitchen",
          "chef",
          "dining",
          "cafe",
          "grocery",
          "menu",
        ],
        retail: [
          "retail",
          "store",
          "shop",
          "e-commerce",
          "ecommerce",
          "commerce",
          "merchandise",
          "mall",
          "shopping",
          "consumer goods",
          "products",
          "sales",
        ],
        healthcare: [
          "healthcare",
          "medical",
          "health",
          "wellness",
          "clinic",
          "hospital",
          "doctor",
          "patient",
          "therapy",
          "pharma",
          "medicine",
          "treatment",
          "care",
        ],
      };

      // Safety check for text content
      if (!text || typeof text !== "string") {
        console.error("Invalid response text:", text);
        return;
      }

      // Calculate scores for each industry based on keyword presence
      const industryScores = Object.entries(industryKeywords).reduce(
        (scores, [industry, keywords]) => {
          scores[industry] = keywords.reduce((score, keyword) => {
            return score + (text.includes(keyword) ? 1 : 0);
          }, 0);
          return scores;
        },
        {}
      );

      // Find industry with highest score
      let detectedIndustry = industryType;
      let highestScore = 0;

      Object.entries(industryScores).forEach(([industry, score]) => {
        if (score > highestScore) {
          highestScore = score;
          detectedIndustry = industry;
        }
      });

      // Only update if we have a reasonable confidence (score > 1)
      if (highestScore > 1 && detectedIndustry !== industryType) {
        setIndustryType(detectedIndustry);
      }

      // Advanced pattern matching with contextual awareness
      const extractDataPoint = (
        metricName,
        defaultValue,
        min = 0,
        max = 100
      ) => {
        // Try exact percentage pattern first
        const exactPattern = new RegExp(`${metricName}.*?(\\d+)%`, "i");
        const exactMatch = text.match(exactPattern);

        if (exactMatch && exactMatch[1]) {
          const value = parseInt(exactMatch[1]);
          if (!isNaN(value)) {
            return Math.min(Math.max(value, min), max);
          }
        }

        // Try contextual pattern next (looking for the metric name and then finding numbers nearby)
        const metricIndex = text.indexOf(metricName.toLowerCase());
        if (metricIndex !== -1) {
          // Look for numbers in surrounding context (50 chars before and after)
          const context = text.substring(
            Math.max(0, metricIndex - 50),
            Math.min(text.length, metricIndex + metricName.length + 50)
          );

          const numberMatches = context.match(/(\d+)%/g);
          if (numberMatches && numberMatches.length > 0) {
            // Take the closest number to the metric name
            const value = parseInt(numberMatches[0]);
            if (!isNaN(value)) {
              return Math.min(Math.max(value, min), max);
            }
          }
        }

        // If no explicit numbers found, use qualitative analysis
        const qualitativePatterns = {
          high: [
            "high",
            "strong",
            "significant",
            "substantial",
            "considerable",
            "excellent",
          ],
          medium: [
            "medium",
            "moderate",
            "average",
            "fair",
            "reasonable",
            "decent",
          ],
          low: ["low", "minimal", "limited", "small", "weak", "poor"],
        };

        // Search for qualitative descriptors near the metric name
        const metricContext = text.includes(metricName.toLowerCase())
          ? text.substring(
              Math.max(0, metricIndex - 30),
              Math.min(text.length, metricIndex + metricName.length + 30)
            )
          : "";

        if (metricContext) {
          if (
            qualitativePatterns.high.some((term) =>
              metricContext.includes(term)
            )
          ) {
            return Math.floor(Math.random() * 15) + 75; // 75-90 range for high
          } else if (
            qualitativePatterns.medium.some((term) =>
              metricContext.includes(term)
            )
          ) {
            return Math.floor(Math.random() * 20) + 50; // 50-70 range for medium
          } else if (
            qualitativePatterns.low.some((term) => metricContext.includes(term))
          ) {
            return Math.floor(Math.random() * 20) + 20; // 20-40 range for low
          }
        }

        // Fallback to existing value or default
        return defaultValue;
      };

      // Extract metrics with improved contextual awareness
      newMetrics.marketPotential = extractDataPoint(
        "market potential",
        text.includes("high demand") ||
          text.includes("growing market") ||
          text.includes("large market")
          ? 85
          : text.includes("moderate demand") || text.includes("stable market")
          ? 65
          : text.includes("saturated market") ||
            text.includes("limited demand") ||
            text.includes("small market")
          ? 45
          : newMetrics.marketPotential
      );

      newMetrics.competitionLevel = extractDataPoint(
        "competition",
        text.includes("high competition") ||
          text.includes("competitive market") ||
          text.includes("saturated")
          ? 80
          : text.includes("moderate competition") ||
            text.includes("some competitors")
          ? 60
          : text.includes("low competition") ||
            text.includes("unique") ||
            text.includes("few competitors")
          ? 40
          : newMetrics.competitionLevel
      );

      newMetrics.initialInvestment = extractDataPoint(
        "investment",
        text.includes("high investment") ||
          text.includes("significant capital") ||
          text.includes("expensive")
          ? 80
          : text.includes("moderate investment") ||
            text.includes("reasonable capital")
          ? 60
          : text.includes("low investment") ||
            text.includes("minimal capital") ||
            text.includes("affordable")
          ? 40
          : newMetrics.initialInvestment
      );

      newMetrics.profitMargin = extractDataPoint(
        "profit margin",
        text.includes("high profit") ||
          text.includes("profitable") ||
          text.includes("high margin")
          ? 75
          : text.includes("moderate profit") || text.includes("average margin")
          ? 55
          : text.includes("low profit") ||
            text.includes("slim margin") ||
            text.includes("thin margin")
          ? 35
          : newMetrics.profitMargin
      );

      newMetrics.riskFactor = extractDataPoint(
        "risk",
        text.includes("high risk") ||
          text.includes("risky") ||
          text.includes("volatile")
          ? 80
          : text.includes("moderate risk") || text.includes("manageable risk")
          ? 60
          : text.includes("low risk") ||
            text.includes("safe") ||
            text.includes("stable")
          ? 40
          : newMetrics.riskFactor
      );

      newMetrics.scalability = extractDataPoint(
        "scalability",
        text.includes("highly scalable") ||
          text.includes("great scaling") ||
          text.includes("easy to scale")
          ? 85
          : text.includes("moderately scalable") ||
            text.includes("some scaling")
          ? 65
          : text.includes("limited scalability") ||
            text.includes("difficult to scale") ||
            text.includes("not scalable")
          ? 45
          : newMetrics.scalability
      );

      newMetrics.innovationScore = extractDataPoint(
        "innovation",
        text.includes("highly innovative") ||
          text.includes("novel") ||
          text.includes("breakthrough")
          ? 85
          : text.includes("moderately innovative") ||
            text.includes("some innovation")
          ? 65
          : text.includes("not innovative") ||
            text.includes("common") ||
            text.includes("standard")
          ? 45
          : newMetrics.innovationScore
      );

      newMetrics.marketTrend = extractDataPoint(
        "market trend",
        text.includes("trending") ||
          text.includes("emerging market") ||
          text.includes("growing trend")
          ? 85
          : text.includes("stable trend") || text.includes("established market")
          ? 65
          : text.includes("declining") ||
            text.includes("shrinking market") ||
            text.includes("fading trend")
          ? 35
          : newMetrics.marketTrend
      );

      newMetrics.customerDemand = extractDataPoint(
        "customer demand",
        text.includes("high demand") ||
          text.includes("strong need") ||
          text.includes("eager customers")
          ? 85
          : text.includes("moderate demand") || text.includes("some interest")
          ? 65
          : text.includes("low demand") ||
            text.includes("little interest") ||
            text.includes("niche market")
          ? 45
          : newMetrics.customerDemand
      );

      newMetrics.regulatoryRisk = extractDataPoint(
        "regulatory",
        text.includes("heavily regulated") ||
          text.includes("strict compliance") ||
          text.includes("legal challenges")
          ? 85
          : text.includes("moderately regulated") ||
            text.includes("some compliance")
          ? 65
          : text.includes("lightly regulated") ||
            text.includes("minimal compliance") ||
            text.includes("few regulations")
          ? 35
          : newMetrics.regulatoryRisk
      );

      // Update business metrics state
      setBusinessMetrics(newMetrics);

      // Use the detected industry type for benchmarks
      const benchmark = INDUSTRY_BENCHMARKS[detectedIndustry];

      // Advanced revenue projection with multiple data points
      // Extract growth rate with multiple pattern matching
      const growthPatterns = [
        /growth rate.*?(\d+)%/i,
        /grow.*?(\d+)%.*?annually/i,
        /annual growth.*?(\d+)%/i,
        /(\d+)%.*?growth/i,
      ];

      let mentionedGrowthRate = null;
      for (const pattern of growthPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          const value = parseInt(match[1]);
          if (!isNaN(value)) {
            mentionedGrowthRate = value / 100;
            break;
          }
        }
      }

      // If no explicit growth rate found, calculate based on industry and business metrics
      if (mentionedGrowthRate === null) {
        // Calculate based on market trend, scalability, and industry benchmark
        mentionedGrowthRate =
          (newMetrics.scalability / 100) * 0.4 +
          (newMetrics.marketTrend / 100) * 0.3 +
          (benchmark.avgGrowthRate / 100) * 0.3;
      }

      // Extract base revenue with multiple pattern matching
      const revenuePatterns = [
        /initial revenue.*?\$(\d+)k/i,
        /starting revenue.*?\$(\d+)k/i,
        /first year.*?revenue.*?\$(\d+)k/i,
        /revenue.*?\$(\d+)k.*?first/i,
        /(\d+)k.*?initial revenue/i,
      ];

      let baseRevenue = null;
      for (const pattern of revenuePatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          const value = parseInt(match[1]);
          if (!isNaN(value)) {
            baseRevenue = value;
            break;
          }
        }
      }

      // If no explicit base revenue found, calculate using a more sophisticated model
      if (baseRevenue === null) {
        // Base revenue depends on market potential, profit margin, and industry
        const marketFactor = newMetrics.marketPotential / 100;
        const profitFactor = newMetrics.profitMargin / 100;
        const industryMultiplier =
          {
            tech: 1.2,
            healthcare: 1.1,
            retail: 0.9,
            food: 0.8,
          }[detectedIndustry] || 1.0;

        baseRevenue =
          Math.round(30 + marketFactor * 50 + profitFactor * 30) *
          industryMultiplier;
      }

      // Generate more realistic and varied revenue projections with market fluctuations
      const months = [1, 3, 6, 9, 12, 15];
      const newRevenue = months.map((month, i) => {
        // Base growth calculation
        const monthsElapsed = month;
        const growthPeriods = monthsElapsed / 3; // Quarters

        // Add a random element to simulate market fluctuations
        const randomFactor = 0.9 + Math.random() * 0.2; // 0.9-1.1 random factor

        // Create growth curve with diminishing returns for later months
        const growthFactor = Math.pow(
          1 + mentionedGrowthRate * (1 - i * 0.05),
          growthPeriods
        );

        // Apply seasonal fluctuations based on month number
        const seasonalFactor = 1 + Math.sin((month / 3) * Math.PI) * 0.05;

        return Math.round(
          baseRevenue * growthFactor * randomFactor * seasonalFactor
        );
      });

      // Update revenue projection
      setRevenueProjection(newRevenue);

      // Calculate more insightful historical comparison data
      const successRate = Math.round(
        newMetrics.marketPotential * 0.3 +
          newMetrics.scalability * 0.3 +
          (100 - newMetrics.riskFactor) * 0.2 +
          newMetrics.innovationScore * 0.2
      );

      // Update historical data with more nuanced calculations
      setHistoricalData({
        success_rate: Math.min(100, Math.max(0, successRate)),
        avg_growth: benchmark.avgGrowthRate,
        market_size: benchmark.marketSize,
      });
    } catch (err) {
      console.error("Error analyzing AI response:", err);
      // Fallback to default values if analysis fails
      setBusinessMetrics(defaultBusinessMetrics);
    }
  };

  // Function to format the AI response for better readability
  const formatAIResponse = (response) => {
    if (!response) return "";

    // Highlight percentages
    let formattedResponse = response.replace(
      /(\d+)%/g,
      '<span class="highlight-percent">$1%</span>'
    );

    // Highlight key metrics
    const keyMetrics = [
      "Market Potential",
      "Competition Level",
      "Investment",
      "Profit Margin",
      "Risk",
      "Scalability",
      "Innovation",
      "Market Trend",
      "Customer Demand",
      "Regulatory",
      "Growth Rate",
      "Revenue",
    ];

    keyMetrics.forEach((metric) => {
      const regex = new RegExp(`(${metric}[^.]*?)`, "gi");
      formattedResponse = formattedResponse.replace(
        regex,
        '<span class="highlight-metric">$1</span>'
      );
    });

    // Format sections with headers
    const sections = ["Conclusion", "Summary", "Recommendation", "Overall"];
    sections.forEach((section) => {
      const regex = new RegExp(`(${section}[^.]*?:)`, "gi");
      formattedResponse = formattedResponse.replace(regex, "<h4>$1</h4>");
    });

    // Add paragraph breaks
    formattedResponse = formattedResponse.replace(/\n\n/g, "</p><p>");

    return `<p>${formattedResponse}</p>`;
  };

  // Listen for changes in AI response
  useEffect(() => {
    if (resultData && !loading) {
      analyzeAIResponse(resultData);
    }
  }, [resultData, loading]);

  // Update chart data when business metrics or industry type changes
  useEffect(() => {
    // Calculate updated insights
    const insights = getBusinessInsights();

    // Update industry comparison data
    const updatedIndustryComparisonData = {
      labels: [
        "Success Rate",
        "Growth Potential",
        "Profit Margin",
        "Market Position",
        "Risk Assessment",
      ],
      datasets: [
        {
          label: "Your Business",
          data: [
            Math.min(100, Math.max(0, insights.feasibilityScore)),
            Math.min(100, Math.max(0, insights.growthPotentialScore)),
            businessMetrics.profitMargin,
            Math.min(100, Math.max(0, insights.marketPositionScore)),
            Math.min(100, Math.max(0, insights.riskAssessmentScore)),
          ],
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        },
        {
          label: "Industry Average",
          data: [
            historicalData.success_rate,
            INDUSTRY_BENCHMARKS[industryType].avgGrowthRate,
            INDUSTRY_BENCHMARKS[industryType].avgProfitMargin,
            65, // Base market position score
            industryType === "tech"
              ? 55
              : industryType === "healthcare"
              ? 70
              : industryType === "food"
              ? 60
              : 50, // Risk assessment by industry
          ],
          backgroundColor: "rgba(255, 99, 132, 0.7)",
        },
      ],
    };

    // Update the chart data
    setIndustryComparisonData(updatedIndustryComparisonData);
  }, [businessMetrics, industryType, historicalData]);

  const handleSendQuery = () => {
    // Validate that input is not empty
    if (!input || input.trim() === "") {
      // Display some feedback that input is required (could be enhanced with a UI component)
      alert("Please enter a business idea before submitting");
      return;
    }

    // Proceed with sending the query if input is valid
    onSent(
      input +
        " Analyze this business idea and provide detailed feedback about: market potential (%), competition level (%), required investment (%), profit margins (%), risks (%), scalability potential (%), innovation score (%), market trends (%), customer demand (%), and regulatory risks (%). Please include percentages for each metric where possible and mention if this is a tech, retail, food, or healthcare business. Also estimate initial revenue and growth rate percentages."
    );
  };

  // Enhanced line chart data with moving averages and trend lines
  const getLineChartData = () => {
    try {
      // Ensure revenueProjection has valid numbers
      const validRevenue = revenueProjection.map((val) =>
        isNaN(val) || val < 0 ? 0 : val
      );

      // Calculate 3-month moving average to smooth the revenue curve
      const movingAverage = validRevenue.map((val, i, arr) => {
        if (i < 2) return val;
        const sum = arr[i - 2] + arr[i - 1] + val;
        return Math.round(sum / 3);
      });

      // Calculate fitted trend line using simple linear regression
      const xValues = [1, 3, 6, 9, 12, 15]; // Months

      // Calculate means
      const xMean = xValues.reduce((sum, val) => sum + val, 0) / xValues.length;
      const yMean =
        validRevenue.reduce((sum, val) => sum + val, 0) / validRevenue.length;

      // Calculate slope and intercept
      let numerator = 0;
      let denominator = 0;
      for (let i = 0; i < xValues.length; i++) {
        numerator += (xValues[i] - xMean) * (validRevenue[i] - yMean);
        denominator += Math.pow(xValues[i] - xMean, 2);
      }

      const slope = denominator !== 0 ? numerator / denominator : 0;
      const intercept = yMean - slope * xMean;

      // Generate trend line data points
      const trendLine = xValues.map((x) =>
        Math.max(0, Math.round(x * slope + intercept))
      );

      // Calculate industry average with a more realistic curve
      const industryAvg = validRevenue.map((val, i) => {
        const benchmark = INDUSTRY_BENCHMARKS[industryType];
        const industryCurve = benchmark.avgGrowthRate / 100;
        const baseVal = val * 0.7; // Industry starts at 70% of your projection
        const growthFactor = Math.pow(1 + industryCurve, i * 0.2);
        return Math.round(baseVal * growthFactor);
      });

      return {
        labels: [
          "Month 1",
          "Month 3",
          "Month 6",
          "Month 9",
          "Month 12",
          "Month 15",
        ],
        datasets: [
          {
            label: "Your Projected Revenue ($k)",
            data: validRevenue,
            fill: true,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgb(75, 192, 192)",
            tension: 0.3,
            pointBackgroundColor: "rgb(75, 192, 192)",
            pointBorderColor: "#fff",
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: "Industry Average ($k)",
            data: industryAvg,
            fill: false,
            borderColor: "rgba(192, 75, 75, 0.7)",
            tension: 0.3,
            borderDash: [5, 5],
            pointBackgroundColor: "rgba(192, 75, 75, 0.7)",
            pointBorderColor: "#fff",
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: "Trend Line",
            data: trendLine,
            fill: false,
            borderColor: "rgba(255, 255, 255, 0.5)",
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [10, 5],
            tension: 0,
          },
          {
            label: "Moving Average (3mo)",
            data: movingAverage,
            fill: false,
            borderColor: "rgba(153, 102, 255, 0.7)",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
        ],
      };
    } catch (err) {
      console.error("Error generating line chart data:", err);
      // Return fallback data
      return {
        labels: [
          "Month 1",
          "Month 3",
          "Month 6",
          "Month 9",
          "Month 12",
          "Month 15",
        ],
        datasets: [
          {
            label: "Your Projected Revenue ($k)",
            data: [30, 45, 57, 75, 85, 95],
            fill: true,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgb(75, 192, 192)",
            tension: 0.3,
            pointBackgroundColor: "rgb(75, 192, 192)",
            pointBorderColor: "#fff",
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      };
    }
  };

  // Enhanced radar chart data with benchmark comparisons
  const getFeasibilityData = () => {
    try {
      // Get industry benchmarks
      const benchmark =
        INDUSTRY_BENCHMARKS[industryType] || INDUSTRY_BENCHMARKS.tech;

      // Ensure all business metrics are valid numbers and within range
      const safeMetrics = Object.keys(businessMetrics).reduce((safe, key) => {
        const value = businessMetrics[key];
        safe[key] = isNaN(value)
          ? defaultBusinessMetrics[key]
          : Math.min(100, Math.max(0, value));
        return safe;
      }, {});

      // Calculate benchmark values based on industry averages
      const benchmarkValues = {
        marketPotential: 65,
        competitionLevel: benchmark.avgProfitMargin < 50 ? 75 : 55,
        initialInvestment:
          benchmark.initialInvestment === "High"
            ? 80
            : benchmark.initialInvestment === "Medium"
            ? 60
            : 40,
        profitMargin: benchmark.avgProfitMargin,
        riskFactor:
          benchmark.breakEvenMonths > 24
            ? 70
            : benchmark.breakEvenMonths > 12
            ? 55
            : 40,
        scalability: benchmark.avgGrowthRate > 20 ? 75 : 60,
        innovationScore:
          industryType === "tech"
            ? 80
            : industryType === "healthcare"
            ? 70
            : 60,
        marketTrend:
          benchmark.marketSize === "Large"
            ? 75
            : benchmark.marketSize === "Medium"
            ? 60
            : 45,
        customerDemand: benchmark.avgGrowthRate > 15 ? 70 : 55,
        regulatoryRisk:
          industryType === "healthcare"
            ? 80
            : industryType === "food"
            ? 65
            : industryType === "tech"
            ? 45
            : 55,
      };

      return {
        labels: [
          "Market Potential",
          "Competition Level",
          "Initial Investment",
          "Profit Margin",
          "Risk Factor",
          "Scalability",
          "Innovation Score",
          "Market Trend",
          "Customer Demand",
          "Regulatory Risk",
        ],
        datasets: [
          {
            label: "Your Business",
            data: [
              safeMetrics.marketPotential,
              safeMetrics.competitionLevel,
              safeMetrics.initialInvestment,
              safeMetrics.profitMargin,
              safeMetrics.riskFactor,
              safeMetrics.scalability,
              safeMetrics.innovationScore,
              safeMetrics.marketTrend,
              safeMetrics.customerDemand,
              safeMetrics.regulatoryRisk,
            ],
            backgroundColor: "rgba(54, 162, 235, 0.3)",
            borderColor: "rgb(54, 162, 235)",
            pointBackgroundColor: "rgb(54, 162, 235)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(54, 162, 235)",
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: "Industry Benchmark",
            data: [
              benchmarkValues.marketPotential,
              benchmarkValues.competitionLevel,
              benchmarkValues.initialInvestment,
              benchmarkValues.profitMargin,
              benchmarkValues.riskFactor,
              benchmarkValues.scalability,
              benchmarkValues.innovationScore,
              benchmarkValues.marketTrend,
              benchmarkValues.customerDemand,
              benchmarkValues.regulatoryRisk,
            ],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 0.7)",
            pointBackgroundColor: "rgba(255, 99, 132, 0.7)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255, 99, 132, 0.7)",
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };
    } catch (err) {
      console.error("Error generating feasibility data:", err);
      // Return fallback data with default values
      return {
        labels: [
          "Market Potential",
          "Competition Level",
          "Initial Investment",
          "Profit Margin",
          "Risk Factor",
          "Scalability",
          "Innovation Score",
          "Market Trend",
          "Customer Demand",
          "Regulatory Risk",
        ],
        datasets: [
          {
            label: "Your Business",
            data: Object.values(defaultBusinessMetrics),
            backgroundColor: "rgba(54, 162, 235, 0.3)",
            borderColor: "rgb(54, 162, 235)",
            pointBackgroundColor: "rgb(54, 162, 235)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(54, 162, 235)",
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      };
    }
  };

  // Enhanced analytics for better business insights
  const getBusinessInsights = () => {
    try {
      // Create a safe copy of business metrics with valid values
      const safeMetrics = Object.keys(businessMetrics).reduce((safe, key) => {
        const value = businessMetrics[key];
        safe[key] = isNaN(value)
          ? defaultBusinessMetrics[key]
          : Math.min(100, Math.max(0, value));
        return safe;
      }, {});

      // Calculate overall feasibility with weighted metrics
      const feasibilityScore = Math.round(
        safeMetrics.marketPotential * 0.25 +
          safeMetrics.scalability * 0.2 +
          safeMetrics.profitMargin * 0.2 -
          safeMetrics.riskFactor * 0.15 +
          safeMetrics.innovationScore * 0.1 +
          (100 - safeMetrics.competitionLevel) * 0.1
      );

      // Calculate market position with weighted metrics
      const marketPositionScore = Math.round(
        safeMetrics.marketPotential * 0.4 +
          safeMetrics.marketTrend * 0.3 +
          safeMetrics.customerDemand * 0.3
      );

      // Calculate risk assessment with weighted metrics
      const riskAssessmentScore = Math.round(
        safeMetrics.riskFactor * 0.4 +
          safeMetrics.regulatoryRisk * 0.3 +
          safeMetrics.competitionLevel * 0.3
      );

      // Calculate growth potential with weighted metrics
      const growthPotentialScore = Math.round(
        safeMetrics.scalability * 0.4 +
          safeMetrics.marketTrend * 0.3 +
          safeMetrics.innovationScore * 0.3
      );

      // Calculate profit potential with weighted metrics
      const profitPotentialScore = Math.round(
        safeMetrics.profitMargin * 0.5 +
          (100 - safeMetrics.initialInvestment) * 0.3 +
          (100 - safeMetrics.competitionLevel) * 0.2
      );

      // Ensure all scores are within bounds
      return {
        feasibilityScore: Math.min(100, Math.max(0, feasibilityScore)),
        marketPositionScore: Math.min(100, Math.max(0, marketPositionScore)),
        riskAssessmentScore: Math.min(100, Math.max(0, riskAssessmentScore)),
        growthPotentialScore: Math.min(100, Math.max(0, growthPotentialScore)),
        profitPotentialScore: Math.min(100, Math.max(0, profitPotentialScore)),
      };
    } catch (err) {
      console.error("Error calculating business insights:", err);
      // Return fallback values
      return {
        feasibilityScore: 70,
        marketPositionScore: 65,
        riskAssessmentScore: 50,
        growthPotentialScore: 75,
        profitPotentialScore: 65,
      };
    }
  };

  // Get enhanced data for charts
  const lineChartData = getLineChartData();
  const feasibilityData = getFeasibilityData();
  const insights = getBusinessInsights();

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        padding: 10,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: $${context.raw}k`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          callback: function (value) {
            return "$" + value + "k";
          },
        },
      },
    },
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          backdropColor: "transparent",
          color: "rgba(255, 255, 255, 0.7)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        angleLines: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        pointLabels: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 11,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        padding: 10,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        padding: 10,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Business Mentor</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        {!showResult ? (
          <div className="greet">
            <p>
              Share your <span>business idea</span> for instant feasibility
              analysis
            </p>
          </div>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              {loading ? (
                <>
                  <img src={assets.gemini_icon} alt="" />
                  <div className="loader">
                    <hr />
                    <hr />
                    <hr />
                  </div>
                </>
              ) : error ? (
                <>
                  <div className="error-container">
                    <div className="error-icon">❌</div>
                    <h3>Something went wrong</h3>
                    <p>{error}</p>
                    <p>
                      Please try again with a different business idea or check
                      your connection.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="statistics-dashboard">
                    <h2>Business Feasibility Analysis</h2>
                    <div className="industry-info">
                      <h3>
                        Industry:{" "}
                        {industryType.charAt(0).toUpperCase() +
                          industryType.slice(1)}
                      </h3>
                      <p>
                        Average Break-even:{" "}
                        {INDUSTRY_BENCHMARKS[industryType].breakEvenMonths}{" "}
                        months
                      </p>
                    </div>
                    <div className="charts-container">
                      <div className="chart-box">
                        <h3>Revenue Projection with Industry Analysis</h3>
                        <Line data={lineChartData} options={lineChartOptions} />
                      </div>
                      <div className="chart-box">
                        <h3>Comprehensive Business Analysis</h3>
                        <Radar data={feasibilityData} options={radarOptions} />
                      </div>
                      <div className="chart-box full-width">
                        <h3>Market Comparison & Competitive Analysis</h3>
                        <Bar
                          data={industryComparisonData}
                          options={barChartOptions}
                        />
                      </div>
                      <div className="stats-summary">
                        <div className="stat-card">
                          <h4>Overall Feasibility</h4>
                          <p>{insights.feasibilityScore}%</p>
                        </div>
                        <div className="stat-card">
                          <h4>Market Position</h4>
                          <p>{insights.marketPositionScore}%</p>
                        </div>
                        <div className="stat-card">
                          <h4>Risk Assessment</h4>
                          <p>{insights.riskAssessmentScore}%</p>
                        </div>
                        <div className="stat-card">
                          <h4>Growth Potential</h4>
                          <p>{insights.growthPotentialScore}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="gemini-response">
                      <div className="gemini-header">
                        <img src={assets.gemini_icon} alt="" />
                        <h3>AI Analysis Details</h3>
                      </div>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: formatAIResponse(resultData),
                        }}
                      ></p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendQuery();
                }
              }}
              value={input}
              type="text"
              placeholder="Describe your business idea for instant analysis..."
            />
            <img src={assets.gallery_icon} alt="" />
            <img src={assets.mic_icon} alt="" />
            <img onClick={handleSendQuery} src={assets.send_icon} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
