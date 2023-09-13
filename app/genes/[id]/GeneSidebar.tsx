"use client";

import { GeneEnsemblById, GeneGenecardsByName } from "@/components/extLinks";
import useLayout from "@/lib/hooks/useLayout";
import { GeneNodeData } from "@/lib/services/NodeService";

export default function GeneSidebar({
    data
}: {
    data: GeneNodeData;
}) {
    const { contentHeight } = useLayout();

    return (
        <div className="flex flex-col border-r border-slate-400 pt-6 pr-6 pl-6" style={{ height: contentHeight,  }}>
            <h1 className="text-3xl font-medium pb-6">Gene {data.gene_name}</h1>
            <div className="bg-white p-4 shadow-md rounded-xl">
                <h2 className="text-xl font-semibold">{data.gene_name} <GeneGenecardsByName name={data.gene_name} /></h2>
                <p className="text-gray-500">{data.gene_type || 'Unknown Type'}</p>
                {data.alias && (
                    <div className="mt-2">
                        <p className="text-gray-700">Aliases:</p>
                        <ul className="list-disc pl-4">
                            {data.alias.map((alias, index) => (
                                <li key={index}>
                                    <span className="line-clamp-1">{alias}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <p className="text-gray-600 mt-2"><GeneEnsemblById id={data._id} /></p>
                <p className="text-gray-600">Chromosome: {data.chr}</p>
                <p className="text-gray-600">Start: {data.start || 'N/A'}</p>
                <p className="text-gray-600">End: {data.end || 'N/A'}</p>
                <p className="text-gray-600">Source: {data.source}</p>
            </div>
        </div>
    );
}
