"use client";

export default function TableModal({
    params: {
        openType,
        openId
    }
}: {
    params: {
        openType: string,
        openId: string
    }
}) {
    console.log("MODAL OPEN");

    return (
        <div>
            <h1>The table modal is open right now, with params
                {JSON.stringify({ openType, openId })}
            </h1>
        </div>
    )
}
