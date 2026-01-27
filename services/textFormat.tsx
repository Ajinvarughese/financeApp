export function enumToString(value: string = "") {
    switch (value) {
        case "SAFE":
            return "Safe";
        case "RISKY":
            return "Risky";
        case "NOT_RECOMMENDED":
            return "Not Recommended";
        default:
            return "Unknown";
    }
}


export const extractUpiName = (particular: string): string => {
    if (!particular) return "";

    // normalize (remove line breaks, extra spaces)
    const clean = particular.replace(/\s+/g, " ").trim();

    // match name between bank code and /UPI
    const match = clean.match(/UPI\s+\d+\/[^/]+\/([^/]+)\/UPI/i);

    if (match && match[1]) {
        return match[1].trim();
    }

    return clean; // fallback if pattern not matched
};