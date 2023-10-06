import { RouterInputs, RouterOutputs, api } from "@/utils/api";

export type QueryType = RouterInputs['autocomplete']['type'];

export type AutocompleteResp = (RouterOutputs['autocomplete'][0] & { type: QueryType });

export default class AutocompleteService {
    static allTypes: QueryType[] = ['gene', 'ontology term', 'protein'];

    static async getAutocompleteResults(query: string, type?: QueryType): Promise<AutocompleteResp[]> {
        let promises: Promise<AutocompleteResp[]>[] = [];

        if (type) {
            promises.push(
                api.autocomplete.query({ term: query, type, page: 0 }).then(res => res.map(r => ({ ...r, type })))
            );
        } else {
            promises = this.allTypes.map(t =>
                api.autocomplete.query({ term: query, type: t, page: 0 })
                    .then(res => res.map(r => ({ ...r, type: t })))
            );
        }

        const results = await Promise.all(promises);

        const flattened = results.flat();

        return flattened;
    }
}
