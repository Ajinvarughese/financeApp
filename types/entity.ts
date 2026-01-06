export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
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
