'use client';

import useLayout from "@/lib/hooks/useLayout";
import { useChat } from "ai/react";
import { useEffect } from "react";


export default function Page() {
    const { contentHeight } = useLayout();
    const { messages, input, handleInputChange, handleSubmit, data: streamData, setMessages } = useChat();

    useEffect(() => {
        const mockEvent = {
            target: {
                value: "which genes are linked to variant rs699"
            }
        };

        handleInputChange(mockEvent as any);
    }, []);

    return (
        <div className="w-full bg-white flex flex-row" style={{ height: contentHeight }}>
            <div className="flex flex-col bg-slate-300 w-72">

            </div>
            <div className="flex flex-col items-center justify-between h-full flex-1">
                <div className="max-w-4xl h-full w-full flex flex-col items-center justify-between">
                    <div className="w-full">
                        {messages.map(m => (
                            <div key={m.id}>
                                {m.role}: {m.content}
                            </div>
                        ))}
                    </div>

                    <div className="w-full flex flex-col items-center">
                        <form onSubmit={handleSubmit} className="w-full border border-red-300 p-4 rounded-xl">
                            <input
                                value={input}
                                placeholder="Say something..."
                                onChange={handleInputChange}
                                className="border border-red-700 w-full"
                            />
                        </form>
                        <p className="text-xs text-slate-600 my-2">ChatIGVF could provide inaccurate information. Please double check important information against the fact bank.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
