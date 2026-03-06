import { Asset, Liability } from "@/types/entity";

interface AnalyzedRisk {
    totalIncome: number,
    totalEmi: number,
    netWorth: number,
    emiRatio: string,
    riskLevel: { label: string, color: string }
}

export const analyzeRisk = (assets: Asset[], liabilities: Liability[]) : AnalyzedRisk => {
    const totalIncome = assets.reduce((s, a) => s + Number(a.income || 0), 0);
    const totalEmi = liabilities.reduce((s, l) => s + Number(l.emi || 0), 0);

    const netWorth = totalIncome - totalEmi;
    const emiRatio =
      totalIncome > 0 ? ((totalEmi / totalIncome) * 100).toFixed(1) : "0";

    const riskLevel =
      Number(emiRatio) > 80
        ? { label: "High Risk", color: "#ff6b6b" }
        : Number(emiRatio) > 40
        ? { label: "Moderate", color: "#ffb84d" }
        : { label: "Healthy", color: "#00d48a" };

    return { totalIncome, totalEmi, netWorth, emiRatio, riskLevel };
}