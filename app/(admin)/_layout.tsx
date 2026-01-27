import AdminSidebar from "@/components/AdminSidebar";
import { Slot, usePathname } from "expo-router";

export default function AdminLayout() {
    const pathname = usePathname();

    const active =
        pathname.includes("users") ? "users" :
        pathname.includes("risk") ? "risk" :
        pathname.includes("alerts") ? "alerts" :
        "dashboard";

    return (
        <AdminSidebar prop={active}>
            <Slot />
        </AdminSidebar>
    );
}