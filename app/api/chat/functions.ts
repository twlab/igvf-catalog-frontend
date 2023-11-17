
import { api } from "@/utils/api";
import OpenAI from "openai";

interface IGVFApiFunction {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            [key: string]: {
                type: string;
            };
        };
        required: string[];
    };
    actionDescription: string;
    function: (data: any) => Promise<string>;
};

export const igvfApiFunctions: IGVFApiFunction[] = [
    {
        name: "get_variant_genes",
        description: "A function to get the genes that are linked to a variant",
        parameters: {
            "type": "object",
            "properties": {
                "rsid": { "type": "string" }
            },
            "required": ["rsid"]
        },
        actionDescription: "Retrieving genes linked to variant",
        function: async ({
            rsid
        }: {
            rsid: string
        }) => {
            const variantResp = await api.variants.query({ rsid: rsid });

            const resp = [];

            for (const variant of variantResp) {
                const variantId = variant._id;

                const variantGenes = await api
                    .genesFromVariants
                    .query({ variant_id: variantId, verbose: "true" })
                    .then(genes => genes.map(gene => gene.gene));

                resp.push(...variantGenes);
            }

            return JSON.stringify(resp)
        }
    },
    {
        name: "get_protein_genes",
        description: "A function to get the genes that are linked to a protein",
        parameters: {
            "type": "object",
            "properties": {
                "protein": { "type": "string" }
            },
            "required": ["protein"]
        },
        actionDescription: "Retrieving genes linked to variant",
        function: async ({
            protein
        }: {
            protein: string
        }) => {
            const geneNodes = (await api.genesFromProteinID.query({ protein_id: protein })).map(gene => ({ gene }));
            return JSON.stringify(geneNodes)
        }
    },
];

export const igvfApiFunctionsMapped = igvfApiFunctions.map<OpenAI.Chat.Completions.ChatCompletionCreateParams.Function>(f => ({
    name: f.name,
    description: f.description,
    parameters: f.parameters
}))
