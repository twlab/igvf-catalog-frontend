import { notFound } from 'next/navigation';

import SetNavigation from "@/components/SetNavigation";
import GraphService from "@/lib/services/GraphService";
import NodeService from "@/lib/services/NodeService";
import GeneSidebar from "./GeneSidebar";
import GraphContainer from "../../GraphContainer";

export default async function Page({
    params: { id },
}: {
    params: { id: string; };
}) {
    const geneData = await NodeService.getGeneData(id);
    const edges = await GraphService.getGeneEdges(id);

    if (!geneData || !edges) {
        notFound();
    }

    return (
        <div className="flex-1 flex flex-row">
            <SetNavigation title={geneData._id} />
            <div className="w-1/4">
                <GeneSidebar data={geneData} />
            </div>
            <div className="w-3/4">
                <GraphContainer
                    edges={edges}
                    root={{ gene: geneData }}
                />
            </div>
        </div>
    )
}
