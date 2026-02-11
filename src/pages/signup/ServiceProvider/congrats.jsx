import React from "react";
import Button from "../../../components/button";
import { Link } from "react-router-dom";



export default function Congrats () {
    return (
        <div className="flex flex-col min-h-screen justify-center items-center">
        {/* <div className="  justify-center items-center"> */}
            <h2 className="font-semibold text-3xl mb-6">All Done!</h2>
                <img src="/Group.svg" alt="Group" className="w-full max-w-md"/>
                {/* </div> */}
                <p className="text-2xl mb-5 mt-5">We’re reviewing your documents and will notify you once
you’re verified.</p>
                   <div className="flex gap-10 mt-10">
                    <Link to="/dashboard/provider"> 
                    <Button size="md">Go To Dashboard</Button>
                    </Link>
                   </div>
  <p className="text-gray-500 text-sm font-extralight italic mt-8">Tip: You can always update your profile or verification info in settings</p>


            </div>

    )
}