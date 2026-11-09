// import React, { useState } from "react";
import Button from "./components/Button";
import { useNavigate } from "react-router-dom";
// import { getUserByEmail } from "../../../api/auth";
// import { useAuthStore } from "../../../stores/auth.store";



export default function Congrats() {
    // const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // const handleGoToDashboard = async () => {
    //     const token = localStorage.getItem("token");
    //     const email =
    //         localStorage.getItem("email") ||
    //         localStorage.getItem("google-email");

    //     if (!token || !email) {
    //         navigate("/dashboard/provider");
    //         return;
    //     }

    //     try {
    //         setLoading(true);
    //         useAuthStore.getState().setToken(token);
    //         const fullUser = await getUserByEmail(email);
    //         useAuthStore.getState().setUser(fullUser);
    //     } catch (err) {
    //         console.error("Failed to load user profile:", err);
    //     } finally {
    //         setLoading(false);
    //         navigate("/dashboard/provider");
    //     }
    // };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 text-center sm:px-6">
            <div className="w-full max-w-xl">
                <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">All Done!</h2>

                <img
                    src="/Group.svg"
                    alt="Group"
                    className="mx-auto w-full max-w-[280px] sm:max-w-md"
                />

                <p className="mt-5 mb-5 text-base leading-relaxed text-slate-700 sm:text-xl lg:text-2xl">
                    We’re reviewing your documents and will notify you once you’re verified.
                </p>

                <div className="mt-8">
                    <Button size="md" onClick={() => navigate("/login")}>
                        Log In
                    </Button>
                </div>

                <p className="mt-8 text-xs italic text-gray-500 sm:text-sm">
                    Tip: You can always update your profile info in settings
                </p>
            </div>
        </div>
    );
}
