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