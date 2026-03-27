import React, { useState } from "react";
import Button from "../../../components/button";

import { useNavigate } from "react-router-dom";
import { getUserByEmail } from "../../../api/auth";
import { useAuthStore } from "../../../stores/auth.store";


export default function StepThree() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoToDashboard = async () => {
        const token = localStorage.getItem("token");
        const email =
            localStorage.getItem("email") ||
            localStorage.getItem("google-email");

        if (!token || !email) {
            navigate("/dashboard");
            return;
        }

        try {
            setLoading(true);
            useAuthStore.getState().setToken(token);
            const fullUser = await getUserByEmail(email);
            useAuthStore.getState().setUser(fullUser);
        } catch (err) {
            console.error("Failed to load user profile:", err);
        } finally {
            setLoading(false);
            navigate("/dashboard");
        }
    };

    return (
        <div className="flex flex-col min-h-screen justify-center items-center">
        {/* <div className="  justify-center items-center"> */}
            <h2 className="font-semibold text-3xl mb-6">All Done!</h2>
                <img src="/Group.svg" alt="Group" className="w-full max-w-md"/>
                {/* </div> */}
                <p className="text-gray-500 mb-5">Your account is all set up and ready to go.</p>
                <p className="text-sm">Explore our services, connect with professionals, and start getting
things done with ease.</p>
                   <div className="flex gap-10 mt-10">
                    <Button size="md" onClick={handleGoToDashboard} disabled={loading}>
                      {loading ? "Loading..." : "Go To Dashboard"}
                    </Button>
                    <button>Browse Services</button>
                   </div>
  <p className="text-gray-500 text-sm font-extralight italic mt-8">Tip: You can always update your profile in settings</p>


            </div>

    )
}
