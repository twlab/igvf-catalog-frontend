import NodeEdgesTable from "@/components/NodeEdgesTable/NodeEdgesTable";
import { NodeType } from "@/lib/services/NodeService";


export default function Page({
    params: {
        id,
        tableType
    }
}: {
    params: {
        id: string,
        tableType: NodeType
    }
}) {
    return (
        <div className="p-8 h-screen">
            <div className="bg-white rounded-md border border-gray-400">
                <h1 className="text-2xl font-bold p-4">{id + ": " + tableType + "s"}</h1>
                <NodeEdgesTable baseType="gene" baseId={id} tableType={tableType} />
            </div>
        </div>
    )
}
