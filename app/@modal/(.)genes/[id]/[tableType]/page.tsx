import Modal from "@/components/Modal";
import NodeEdgesTable from "@/components/NodeEdgesTable";
import { NodeType } from "@/lib/services/NodeService";

export default function TableModal({
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
        <Modal title={id + ": " + tableType}>
            <NodeEdgesTable baseType="gene" baseId={id} tableType={tableType} />
        </Modal>
    )
}
