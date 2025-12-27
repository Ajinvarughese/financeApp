// src/types/financial.ts
export interface Asset {
    id: number | string;
    name: string;                 // required (used in UI)
    category?: string;
    value?: number;
    thumbnail?: any;
    notes?: string;
    // allow other unknown fields from API
    [k: string]: any;
}

export interface Liability {
    id: number | string;
    name: string;                 // required (used in UI)
    amount?: number;
    monthly_installment?: number;
    dueDate?: string;
    status?: "Active" | "Closed" | "Overdue" | string;
    notes?: string;
    [k: string]: any;
}

export interface SuggestedAsset {
    name: string;
    reason?: string;
    estInvestment?: number;
    [k: string]: any;
}

export interface Recommendation {
    id: number | string;
    title: string;                // required (fixes your TS2322)
    summary?: string;
    safety?: "Safe" | "Risky" | "Not Recommended" | string;
    confidence?: number;          // 0..1
    suggestedAssets?: SuggestedAsset[];
    explanation?: string;
    [k: string]: any;
}
