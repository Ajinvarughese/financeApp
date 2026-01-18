export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN"
}

export enum RiskClass {
    SAFE = "SAFE",
    RISKY = "RISKY",
    NOT_RECOMMENDED = "NOT_RECOMMENDED"
}

export type Message = {
    id?: number;
    text: string;
    textFrom : "USER" | "ASSISTANT";
    userId: number;
};

export interface MessageRequest {
    text: string;
    userId: number;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    role: UserRole;
}

export type Asset = {
    id: string;
    source: string;
    income: number;
    expenses: number;
    user: User;
    debt: number;
    notes?: string;
    createdAt: number;
    updatedAt: number;
};

export type Liability = {
    id: string;
    name: string;
    amount: number;
    interest?: number;
    months?: number;
    expense: number;
    note?: string;
    riskClass: RiskClass;
    aiResponse: string;
    createdAt: number;
    updatedAt: number;
};

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
