import { RouterInputs, RouterOutputs, api } from "@/utils/trpc";
import {
    DrugNodeData,
    GeneNodeData,
    NodeType,
    ProteinNodeData,
    StudyNodeData,
    TranscriptNodeData,
    VariantNodeData
} from "./NodeService";

const nameLookup: { [key: string]: string } = {
    "_id": "ID",
    "transcript_type": "Transcript Type",
    "chr": "Chromosome",
    // ... TOOD: add more    
}

export default class TableService {
    static async getTableData(sourceType: NodeType, sourceId: string, destType: NodeType, page: number=0) {
        const data = await fetch(`https://api.catalog.igvf.org/api/${sourceType}s/${sourceId}/${destType}s?page=${page}`).then(res => res.json());
        return data;
    }

    static lookupName(key: string) { return nameLookup[key] || key; }
}
