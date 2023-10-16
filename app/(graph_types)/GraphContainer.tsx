"use client";

import { GeneEnsemblById, ProteinUniprotById, PubMedLink } from "@/components/extLinks";
import { GraphNode } from "@/lib/services/GraphService";
import { NodeType } from "@/lib/services/NodeService";
import { getDrugsLinkedToRsidKey } from "@/utils/db";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
        <ProteinUniprotById id={protein._id} />
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

function StudyNodeContent({
  study
}: {
  study: GraphNode['study']
}) {
  if (!study) return null;

  return (
    <>
      <Link href={`/studys/${study._id}`}>
        <h1 className="text-2xl font-bold mb-2">{study.trait_reported}</h1>
      </Link>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Title:</span> {study.pub_title}
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Journal:</span> {study.pub_journal}
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <span className="font-bold">Source:</span> {study.source}
      </div>
      <div className="text-gray-700 mb-2 truncate">
        <PubMedLink pmid={study.pmid} />
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
    <div className="bg-white rounded-lg shadow-lg p-4 border border-slate-400 m-1 w-72 hover:shadow-xl hover:border-black">
      {(() => {
        if (node.gene) return <GeneNodeContent gene={node.gene} />
        if (node.protein) return <ProteinNodeContent protein={node.protein} />
        if (node.transcript) return <TranscriptNodeContent transcript={node.transcript} />
        if (node.drug) return <DrugNodeContent drug={node.drug} />
        if (node.study) return <StudyNodeContent study={node.study} />
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
  const studies = edges.filter((edge) => edge.study);

  const [openType, setOpenType] = useState<NodeType | null>(null);

  const handleCloseType = () => {
    window.location.hash = "";
  }
  
  const handleSetType = (type: NodeType) => {
    window.location.hash = type;
  }

  const [
    geneStrokeWidth,
    proteinStrokeWidth,
    transcriptStrokeWidth,
    drugStrokeWidth,
    studyStrokeWidth,
  ] = calculateStrokeWidths([
    genes.length,
    proteins.length,
    transcripts.length,
    drugs.length,
    studies.length,
  ]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.length === 0) return setOpenType(null);

      const hashContent = window.location.hash.substr(1);
      if (!(['gene', 'protein', 'transcript', 'drug', 'study'] as NodeType[]).includes(hashContent as any)) return setOpenType(null);
      setOpenType(hashContent as NodeType);
    };

    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); 

  const [
    geneStrokeWidth,
    proteinStrokeWidth,
    transcriptStrokeWidth,
    drugStrokeWidth,
    studyStrokeWidth,
  ] = calculateStrokeWidths([
    genes.length,
    proteins.length,
    transcripts.length,
    drugs.length,
    studies.length,
  ]);

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

            if (openType === "study") {
              return (
                <div className="mb-6">
                  <div className="flex flex-row items-center gap-x-4">
                    <BackButton onClick={handleCloseType} />
                    <h2 className="text-2xl">Studies</h2>
                  </div>
                  <div className="grid grid-cols-3">
                    {studies.map(n => <DisplayGraphNode key={n.study?._id} node={n} />)}
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
                  style: { strokeColor: 'black', strokeWidth: geneStrokeWidth }
                },
                {
                  targetId: 'proteinContainer',
                  targetAnchor: 'left',
                  sourceAnchor: 'right',
                  style: { strokeColor: 'black', strokeWidth: proteinStrokeWidth }
                },
                {
                  targetId: 'transcriptContainer',
                  targetAnchor: 'left',
                  sourceAnchor: 'right',
                  style: { strokeColor: 'black', strokeWidth: transcriptStrokeWidth }
                },
                {
                  targetId: 'drugContainer',
                  targetAnchor: 'left',
                  sourceAnchor: 'right',
                  style: { strokeColor: 'black', strokeWidth: drugStrokeWidth }
                },
                {
                  targetId: 'studyContainer',
                  targetAnchor: 'left',
                  sourceAnchor: 'right',
                  style: { strokeColor: 'red', strokeWidth: studyStrokeWidth }
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
                      <h2 className="text-2xl">Genes ({genes.length})</h2>
                      <ExpandIcon onClick={() => handleSetType('gene')} />
                      <TableButton type="gene" />
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
                      <h2 className="text-2xl">Proteins ({proteins.length})</h2>
                      <ExpandIcon onClick={() => handleSetType('protein')} />
                      <TableButton type="protein" />
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
                      <h2 className="text-2xl">Transcripts ({transcripts.length})</h2>
                      <ExpandIcon onClick={() => handleSetType('transcript')} />
                      <TableButton type="transcript" />
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
                      <h2 className="text-2xl">Drugs ({drugs.length})</h2>
                      <ExpandIcon onClick={() => handleSetType('drug')} />
                      <TableButton type="drug" />
                    </div>
                    <div className="flex flex-row">
                      {drugs.map(n => <DisplayGraphNode key={n.drug?._id} node={n} />)}
                    </div>
                  </div>
                </ArcherElement>
              ) : null}
              {studies.length > 0 ? (
                <ArcherElement
                  id="studyContainer"
                >
                  <div className="mb-6">
                    <div className="flex flex-row items-center gap-x-4">
                      <h2 className="text-2xl">Studies ({studies.length})</h2>
                      <ExpandIcon onClick={() => handleSetType('study')} />
                    </div>
                    <div className="flex flex-row">
                      {studies.map(n => <DisplayGraphNode key={n.study?._id} node={n} />)}
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

function TableButton({
  type
}: {
  type: NodeType;
}) {
  const pathname = usePathname();

  let basepath = pathname;

  if (pathname.split('/').length > 3) {
    basepath = pathname.split('/').slice(0, 3).join('/');
  }

  return (
    <Link href={`${basepath}/${type}`} className="cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
      </svg>
    </Link>
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

function calculateStrokeWidths(lengths: number[]): number[] {
  const min = 1;
  const max = 4;

  const mid = (min + max) / 2;
  const delta = (max - min) / 2;

  const minLen = Math.min(...lengths);
  const maxLen = Math.max(...lengths);

  const diff = maxLen - minLen;

  if (diff === 0) return lengths.map(() => mid);

  return lengths.map((len) => {
    const ratio = (len - minLen) / diff;
    return min + ratio * delta;
  });
}
