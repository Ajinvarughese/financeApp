// services/api.ts
// Simple mock APIs — replace with real endpoints later.

type Asset = {
    id: number;
    name: string;
    value: number;
    category?: string;
    thumbnail?: any;
};

type Liability = {
    id: number;
    name: string;
    amount: number;
    monthly_installment?: number;
    dueDate?: string;
    status?: "Active" | "Closed" | "Overdue";
};

/**
 * Utility: mock delay
 */
const delay = (ms = 700) => new Promise((res) => setTimeout(res, ms));

export async function fetchAssets({ query = "" }: { query?: string } = {}) {
    await delay(700);

    const mockAssets: Asset[] = [
        { id: 1, name: "Savings Account", value: 250000, category: "Bank" },
        { id: 2, name: "Fixed Deposit", value: 150000, category: "FD" },
        { id: 3, name: "Mutual Funds", value: 320000, category: "Investments" },
        { id: 4, name: "Car (resale)", value: 450000, category: "Vehicle" },
        { id: 5, name: "Gold", value: 90000, category: "Precious Metals" },
    ];

    if (!query) return mockAssets;
    return mockAssets.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));
}

export async function fetchLiabilities({ query = "" }: { query?: string } = {}) {
    await delay(700);

    const mockLiabilities: Liability[] = [
        {
            id: 1,
            name: "Home Loan",
            amount: 4500000,
            monthly_installment: 35000,
            dueDate: "2038-12-01",
            status: "Active",
        },
        {
            id: 2,
            name: "Car Loan",
            amount: 400000,
            monthly_installment: 12000,
            dueDate: "2027-05-12",
            status: "Active",
        },
        {
            id: 3,
            name: "Credit Card",
            amount: 15000,
            monthly_installment: 15000,
            dueDate: "2025-12-25",
            status: "Active",
        },
        {
            id: 4,
            name: "Personal Loan",
            amount: 100000,
            monthly_installment: 8000,
            dueDate: "2026-07-01",
            status: "Closed",
        },
    ];

    if (!query) return mockLiabilities;
    return mockLiabilities.filter((l) => l.name.toLowerCase().includes(query.toLowerCase()));
}
