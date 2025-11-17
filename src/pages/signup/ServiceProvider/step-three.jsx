import React from "react";
import Button from "../../../components/button";
import Navbar from "../../../components/layouts/navbar";
import AuthLayout from "../../../components/layouts/layout";




export default function StepThree ({onNext}) {
    return (
        <>
        <Navbar/>
        <AuthLayout
        title="A few clicks away from creating your account"
        >
        <div className="flex flex-col min-h-screen justify-center items-center">
            <h2 className="font-semibold text-3xl mb-6">Congratulations!</h2>
                <p className="text-gray-500 mb-5">Welcome Onboard, Your SABIGUY account is almost complete.
Just a few more details to help personalize your experience.</p>
               
                    <Button variant="secondary"
                    onClick={onNext}
                    >Continue</Button>
                    <button className="mt-7">Skip for now</button>


            </div>
            </AuthLayout>
            </>

    )
}