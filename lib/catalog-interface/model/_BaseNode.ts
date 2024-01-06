import { GraphNode } from "@/lib/types/derived-types";
import { GetAdjacentOptions, ParsedProperties } from "@/lib/types/graph-model-types";

export default class BaseNode {
    data: any;
    parsed: ParsedProperties;
    constructor(data: any) {
        if (this.constructor === BaseNode) {
            throw new Error("Cannot instantiate BaseNode");
        }
        this.parsed = {
            id: "",
            displayName: "",
        }
    }

    serialize(): GraphNode {
        throw new Error("Not implemented");
    }

    getDisplayName(): string {
        throw new Error("Not implemented");
    }

    static async get(id: string): Promise<BaseNode | null> {
        throw new Error("Not implemented");
    }

    static async getAdjacent(id: string, options?: GetAdjacentOptions): Promise<BaseNode[] | null> {
        throw new Error("Not implemented");
    }
}
