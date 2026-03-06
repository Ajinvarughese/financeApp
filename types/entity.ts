export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN"
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED"
}

export enum RiskClass {
    SAFE = "SAFE",
    RISKY = "RISKY",
    NOT_RECOMMENDED = "NOT_RECOMMENDED"
}
export enum TransactionType {
    CREDIT = "CREDIT",
    DEBIT = "DEBIT"
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
export interface FullUser {
    user: User;
    assets: Asset[];
    liabilities: Liability[];
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    role: UserRole;
    accountStatus: AccountStatus;
    createdAt: number | null;
    updatedAt: number | null;
}

export interface OTP {
    email: string;
    otp: string;
}

export type Asset = {
    id: string;
    name: string;
    income: number;
    expense: number;
    user: User;
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
  emi: number;
  institution?: string;
  document?: string;
  note?: string;
  riskClass: RiskClass;
  aiResponse: string;
  createdAt: number;
  updatedAt: number;
};

export interface Notification {
  id?: number;

  user: {id : number};

  title: string;

  message: string;

  priority: "LOW" | "MEDIUM" | "HIGH";

  isRead?: boolean;

  createdAt?: number;
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


export interface BankStatement {
    id: number | string;
    date: string;
    particular: string;
    transactionType: TransactionType,
    amount: number
}

export enum FeedbackStatus {
    ISSUED = "ISSUED",
    RESOLVED = "RESOLVED"
}
export interface Feedback {
  id?: number;
  user: { id: number };
  title: string;
  comment: string;
  feedbackStatus: FeedbackStatus;
  document?: string;
  createdAt?: number;
  updatedAt?: number;
}