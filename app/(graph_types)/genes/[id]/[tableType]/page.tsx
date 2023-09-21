import NodeEdgesTable from "@/components/NodeEdgesTable";
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
        <div>
            <NodeEdgesTable baseType="gene" baseId={id} tableType={tableType} />
        </div>
    )
}
