import React from "react";

const UserSkeleton = () => {
    return (
        <div className="bg-white border border-gray-200 shadow-md rounded-xl p-5 flex flex-col gap-4 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-300" />
                <div className="flex flex-col gap-2 w-full">
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-20" />
            <div className="flex justify-end gap-3 mt-4">
                <div className="h-8 w-20 bg-gray-300 rounded" />
                <div className="h-8 w-20 bg-gray-300 rounded" />
            </div>
        </div>
    );
};

export default UserSkeleton;
