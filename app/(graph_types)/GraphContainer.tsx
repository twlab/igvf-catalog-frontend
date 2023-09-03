"use client";

import { GeneEnsemblById } from "@/components/extLinks";
import { GraphNode } from "@/lib/services/GraphService";
import { NodeType } from "@/lib/services/NodeService";
import Link from "next/link";
import { useState } from "react";
import { ArcherContainer, ArcherElement } from 'react-archer';

function GeneNodeContent({
  gene
}: {
  gene: GraphNode['gene']
}) {
  if (!gene) return null;

  return (
    <>
      <Link href={`/genes/${gene._id}`}>
        <h1 className="text-2xl font-bold mb-2">{gene.gene_name}</h1>
      </Link>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Gene Type:</span> {gene.gene_type ?? 'Unknown'}
      </div>
      {/* {gene.alias && (
        <div className="text-gray-700 mb-2 truncate">
          <span className="font-bold">Alias:</span> {gene.alias.join(', ')}
        </div>
      )} */}
      <div className="text-gray-700 mb-2 truncate">
        <GeneEnsemblById id={gene._id} />
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Chromosome:</span> {gene.chr}
      </div>
      {gene.start != null && gene.end != null && (
        <>
          <div className="text-gray-700 mb-2 truncate">
            <span className="font-bold">Start:</span> {gene.start}
          </div>
          <div className="text-gray-700 mb-2 truncate">
            <span className="font-bold">End:</span> {gene.end}
          </div>
        </>
      )}
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Source:</span> {gene.source}
      </div>
    </>
  );
}

function ProteinNodeContent({
  protein
}: {
  protein: GraphNode['protein']
}) {
  if (!protein) return null;

  return (
    <>
      <Link href={`/proteins/${protein._id}`}>
        <h1 className="text-2xl font-bold mb-2 break-words">{protein.name}</h1>
      </Link>
      <div className="text-gray-700 mb-2 truncate">
        <GeneEnsemblById id={protein._id} />
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Source:</span> {protein.source}
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Source URL:</span> {protein.source_url}
      </div>
      {/* {protein.dbxrefs && (
        <div className="text-gray-700 mb-2 truncate">
          <span className="font-bold">DB Xrefs:</span> {protein.dbxrefs.join(', ')}
        </div>
      )} */}
    </>
  );
}

function TranscriptNodeContent({
  transcript
}: {
  transcript: GraphNode['transcript']
}) {
  if (!transcript) return null;

  return (
    <>
      <Link href={`/transcripts/${transcript._id}`}>
        <h1 className="text-2xl font-bold mb-2">{transcript.transcript_name}</h1>
      </Link>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Gene Name:</span> {transcript.gene_name}
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <GeneEnsemblById id={transcript._id} />
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Transcript Type:</span> {transcript.transcript_type}
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Chromosome:</span> {transcript.chr}
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Start:</span> {transcript.start}
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">End:</span> {transcript.end}
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Source:</span> {transcript.source}
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Version:</span> {transcript.version}
      </div>
    </>
  );
}

function DrugNodeContent({
  drug
}: {
  drug: GraphNode['drug']
}) {
  if (!drug) return null;

  return (
    <>
      <Link href={`/drugs/${drug._id}`}>
        <h1 className="text-2xl font-bold mb-2">{drug.drug_name}</h1>
      </Link>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Drug Ontology Terms:</span> {drug.drug_ontology_terms.join(', ')}
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Source:</span> {drug.source}
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Source URL:</span> {drug.source_url}
      </div>
    </>
  )
}

function VariantNodeContent({
  variant
}: {
  variant: GraphNode['variant']; // RsVariant;
}) {
  if (!variant) return null;

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Variant</h1>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Chromosome:</span> {variant.chr}
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Position:</span> {variant['pos:long']}
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">RSID:</span> {variant.rsid.join(', ')}
      </div>
      {/* annotations */}
    </>
  );
}

function DisplayGraphNode({
  node
}: {
  node: GraphNode;
}) {

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-black m-1 w-72">
      {(() => {
        if (node.gene) return <GeneNodeContent gene={node.gene} />
        if (node.protein) return <ProteinNodeContent protein={node.protein} />
        if (node.transcript) return <TranscriptNodeContent transcript={node.transcript} />
        if (node.drug) return <DrugNodeContent drug={node.drug} />
        if (node.variant) return <VariantNodeContent variant={node.variant} />

        return null;
      })()}
    </div>
  )
}

export default function GraphContainer({
  edges,
  root
}: {
  edges: GraphNode[];
  root: GraphNode;
}) {
  const genes = edges.filter((edge) => edge.gene);
  const proteins = edges.filter((edge) => edge.protein);
  const transcripts = edges.filter((edge) => edge.transcript);
  const drugs = edges.filter((edge) => edge.drug);

  const [openType, setOpenType] = useState<NodeType | null>(null);

  const handleCloseType = () => setOpenType(null);

  if (openType) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-medium pb-6">Graph</h1>
        <div>
          {(() => {
            if (openType === "gene") {
              return (
                <div className="mb-6">
                  <div className="flex flex-row items-center gap-x-4">
                    <BackButton onClick={handleCloseType} />
                    <h2 className="text-2xl">Genes</h2>
                  </div>
                  <div className="grid grid-cols-3">
                    {genes.map(n => <DisplayGraphNode key={n.gene?._id} node={n} />)}
                  </div>
                </div>
              )
            }

            if (openType === "protein") {
              return (
                <div className="mb-6">
                  <div className="flex flex-row items-center gap-x-4">
                    <BackButton onClick={handleCloseType} />
                    <h2 className="text-2xl">Proteins</h2>
                  </div>
                  <div className="grid grid-cols-3">
                    {proteins.map(n => <DisplayGraphNode key={n.protein?._id} node={n} />)}
                  </div>
                </div>
              )
            }

            if (openType === "transcript") {
              return (
                <div className="mb-6">
                  <div className="flex flex-row items-center gap-x-4">
                    <BackButton onClick={handleCloseType} />
                    <h2 className="text-2xl">Transcripts</h2>
                  </div>
                  <div className="grid grid-cols-3">
                    {transcripts.map(n => <DisplayGraphNode key={n.transcript?._id} node={n} />)}
                  </div>
                </div>
              )
            }

            if (openType === "drug") {
              return (
                <div className="mb-6">
                  <div className="flex flex-row items-center gap-x-4">
                    <BackButton onClick={handleCloseType} />
                    <h2 className="text-2xl">Drugs</h2>
                  </div>
                  <div className="grid grid-cols-3">
                    {drugs.map(n => <DisplayGraphNode key={n.drug?._id} node={n} />)}
                  </div>
                </div>
              )
            }

            return null;
          })()}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-scroll noScrollbar">
      <ArcherContainer>
        <div className="p-6">
          <h1 className="text-3xl font-medium pb-6">Graph</h1>
          <div className="flex flex-row items-center gap-x-20">
            <ArcherElement
              id="rootNode"
              relations={[
                {
                  targetId: 'geneContainer',
                  targetAnchor: 'left',
                  sourceAnchor: 'right',
                  style: { strokeColor: 'black' }
                },
                {
                  targetId: 'proteinContainer',
                  targetAnchor: 'left',
                  sourceAnchor: 'right',
                  style: { strokeColor: 'black' }
                },
                {
                  targetId: 'transcriptContainer',
                  targetAnchor: 'left',
                  sourceAnchor: 'right',
                  style: { strokeColor: 'black' }
                },
                {
                  targetId: 'drugContainer',
                  targetAnchor: 'left',
                  sourceAnchor: 'right',
                  style: { strokeColor: 'black' }
                },
              ]}
            >
              <div>
                <DisplayGraphNode node={root} />
              </div>
            </ArcherElement>
            <div>
              {genes.length > 0 ? (
                <ArcherElement
                  id="geneContainer"
                  relations={[
                    {
                      targetId: 'root',
                      targetAnchor: 'right',
                      sourceAnchor: 'left',
                    },
                  ]}
                >
                  <div className="mb-6">
                    <div className="flex flex-row items-center gap-x-4">
                      <h2 className="text-2xl">Genes</h2>
                      <ExpandIcon onClick={() => setOpenType('gene')} />
                    </div>
                    <div className="flex flex-row">
                      {genes.map(n => <DisplayGraphNode key={n.gene?._id} node={n} />)}
                    </div>
                  </div>
                </ArcherElement>
              ) : null}
              {proteins.length > 0 ? (
                <ArcherElement
                  id="proteinContainer"
                >
                  <div className="mb-6">
                    <div className="flex flex-row items-center gap-x-4">
                      <h2 className="text-2xl">Proteins</h2>
                      <ExpandIcon onClick={() => setOpenType('protein')} />
                    </div>
                    <div className="flex flex-row">
                      {proteins.map(n => <DisplayGraphNode key={n.protein?._id} node={n} />)}
                    </div>
                  </div>
                </ArcherElement>
              ) : null}
              {transcripts.length > 0 ? (
                <ArcherElement
                  id="transcriptContainer"
                >
                  <div className="mb-6">
                    <div className="flex flex-row items-center gap-x-4">
                      <h2 className="text-2xl">Transcripts</h2>
                      <ExpandIcon onClick={() => setOpenType('transcript')} />
                    </div>
                    <div className="flex flex-row">
                      {transcripts.map(n => <DisplayGraphNode key={n.transcript?._id} node={n} />)}
                    </div>
                  </div>
                </ArcherElement>
              ) : null}
              {drugs.length > 0 ? (
                <ArcherElement
                  id="drugContainer"
                >
                  <div className="mb-6">
                    <div className="flex flex-row items-center gap-x-4">
                      <h2 className="text-2xl">Drugs</h2>
                      <ExpandIcon onClick={() => setOpenType('drug')} />
                    </div>
                    <div className="flex flex-row">
                      {drugs.map(n => <DisplayGraphNode key={n.drug?._id} node={n} />)}
                    </div>
                  </div>
                </ArcherElement>
              ) : null}
            </div>
          </div>
        </div>
      </ArcherContainer>
    </div>
  );
}

function ExpandIcon({
  onClick
}: {
  onClick: () => void;
}) {


  return (
    <div onClick={onClick} className="cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
      </svg>
    </div>
  );
}

function BackButton({
  onClick
}: {
  onClick: () => void;
}) {


  return (
    <div onClick={onClick} className="cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
      </svg>
    </div>
  );
}
