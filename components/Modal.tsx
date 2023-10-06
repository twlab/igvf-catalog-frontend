"use client";

import { useRouter } from "next/navigation";

export default function Modal({
    title,
    children
}:{
    title: string,
    children: React.ReactNode
}) {
    const router = useRouter();

    const handleClose = () => {
        router.back();
    }

    return (
        <div tabIndex={-1} aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full h-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 flex flex-row items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="relative w-full max-w-6xl h-5/6">
                <div className="flex flex-col relative bg-white rounded-lg shadow h-full">
                    <div className="flex items-center justify-between p-4 border-b rounded-t">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {title}
                        </h3>
                        <button onClick={handleClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="defaultModal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="overflow-scroll">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
