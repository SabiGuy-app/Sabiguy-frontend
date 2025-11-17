import React from "react";
import Button from "../../../components/button";



export default function StepThree () {
    return (
        <div className="flex flex-col min-h-screen justify-center items-center">
        {/* <div className="  justify-center items-center"> */}
            <h2 className="font-semibold text-3xl mb-6">All Done!</h2>
                <img src="/public/Group.svg" alt="Group" className="w-full max-w-md"/>
                {/* </div> */}
                <p className="text-gray-500 mb-5">Your account is all set up and ready to go.</p>
                <p className="text-sm">Explore our services, connect with professionals, and start getting
things done with ease.</p>
                   <div className="flex gap-10 mt-10">
                    <Button size="md">Go To Dashboard</Button>
                    <button>Browse Services</button>
                   </div>
  <p className="text-gray-500 text-sm font-extralight italic mt-8">Tip: You can always update your profile or verification info in settings</p>


            </div>

    )
}