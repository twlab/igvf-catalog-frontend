import { DrugNode, RsVariant, StudyNode } from "@/utils/db";
import { api, RouterOutputs } from "@/utils/api";

export type GeneNodeData = RouterOutputs["geneID"];
export type ProteinNodeData = RouterOutputs["proteinID"];
export type TranscriptNodeData = RouterOutputs["transcriptID"];
export type DrugNodeData = DrugNode;
export type VariantNodeData = RsVariant;
export type StudyNodeData = StudyNode;

export type NodeType = "gene" | "protein" | "transcript" | "drug" | "variant" | "study";

export default class NodeService {
    static async getGeneData(id: string) {
        try {
            return await api.geneID.query({ id });
        } catch (error) {
            return null;
        }
    }

    static async getProteinData(id: string) {
        try {
            return await api.proteinID.query({ id });
        } catch (error) {
            return null;
        }
    }

    static async getTranscriptData(id: string) {
        try {
            return await api.transcriptID.query({ id });
        } catch (error) {
            return null;
        }
    }
}
