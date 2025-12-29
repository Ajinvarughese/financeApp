// services/appwrite.ts
// Mock AI recommendations — returns safety verdicts and short suggestions.

type Recommendation = {
    id: number;
    title: string;
    summary?: string;
    safety: "Safe" | "Risky" | "Not Recommended";
    confidence?: number;
    suggestedAssets?: { name: string; reason: string; estInvestment?: number }[];
};

const delay = (ms = 700) => new Promise((res) => setTimeout(res, ms));

export async function getAIRecommendations() {
    await delay(700);

    const recs: Recommendation[] = [
        {
            id: 101,
            title: "Apply for new personal loan ₹50,000",
            summary: "Assessing current cashflow and EMIs.",
            safety: "Risky",
            confidence: 0.82,
            suggestedAssets: [
                { name: "Top-up FD", reason: "Increase liquid savings", estInvestment: 20000 },
            ],
        },
        {
            id: 102,
            title: "Increase SIP in equity mutual funds",
            summary: "Surplus monthly cashflow suggests opportunity.",
            safety: "Safe",
            confidence: 0.76,
        },
        {
            id: 103,
            title: "Add emergency fund (₹40,000)",
            summary: "Low liquid buffer detected.",
            safety: "Not Recommended",
            confidence: 0.9,
            suggestedAssets: [
                { name: "Liquid fund", reason: "Immediate access to cash", estInvestment: 40000 },
            ],
        },
    ];

    return recs;
}
