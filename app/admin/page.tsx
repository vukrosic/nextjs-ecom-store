import { redirect } from "next/navigation";

export default function AdminDashboard() {
    redirect("/manage-products");
    return null;
}