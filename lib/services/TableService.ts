import { apiBaseUrl } from "@/utils/api";
import {
    NodeType
} from "./NodeService";

const nameLookup: { [key: string]: string } = {
    "_id": "ID",
    "transcript_type": "Transcript Type",
    "chr": "Chromosome",
    "start": "Start",
    "end": "End",
    "transcript_name": "Transcript Name",
    "gene_name": "Gene Name",
    "source": "Source",
    "version": "Version",
    "source_url": "Source URL",
    // ... TOOD: add more
}

export default class TableService {
    static async getTableData(sourceType: NodeType, sourceId: string, destType: NodeType) {
        const data: any[] = [];
        let pageNum = 0;
        while (true) {
            const nextPage = await fetch(`${apiBaseUrl}/${sourceType}s/${sourceId}/${destType}s?page=${pageNum++}`).then(res => res.json());
            if (nextPage.length === 0 || pageNum > 99) break;
            data.push(...nextPage);
        }
        return data;
    }

    static lookupName(key: string) { return nameLookup[key] || key; }
}
