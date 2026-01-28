import React from "react";
import { MapPin } from "lucide-react";

export default function SearchingLoader () {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-green-50 text-green-900 rounded-full p-10 animate-pulse">
            <MapPin size={120}/>
            </div>
            <div className="mt-12  items-center justify-center">
                <p className="font-bold mb-2 text-2xl">Finding nearby providers...</p>
                <p>Matching you with the best professionals in your area</p>
            </div>

        </div>
    )
}