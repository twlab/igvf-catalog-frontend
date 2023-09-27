import Modal from "@/components/Modal";
import NodeEdgesTable from "@/components/NodeEdgesTable/NodeEdgesTable";
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
        <Modal title={id + ": " + tableType + "s"}>
            <NodeEdgesTable baseType="variant" baseId={id} tableType={tableType} />
        </Modal>
    )
}
