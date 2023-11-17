import { Database, aql } from "arangojs";

export type RsVariant = {
  _key: string;
  _id: string;
  chr: string;
  'pos:long': number;
  rsid: string[];
  annotations: object;
  ref: string;
  alt: string;

}

export type StudyNode = {
  _key: string;
  _id: string;
  pub_title: string;
  pub_date: string;
  pmid: string;
  pub_journal: string;
  source: string;
  trait_reported: string;
}

export type DrugNode = {
  _key: string;
  _id: string;
  _rev: string;
  drug_name: string;
  drug_ontology_terms: string[];
  source: string;
  source_url: string;
}

function getDatabase(): Database {
  return new Database({
    url: process.env.DB_URL || "",
    databaseName: process.env.DB_NAME || "",
    auth: {
      username: process.env.DB_USERNAME || "",
      password: process.env.DB_PASSWORD
    },
  });
}

const db = getDatabase();

const LIMIT = 99;

/**
 * find a list of variants by rsid
 * @param db: the igvf catalog database
 * @param rsid: rsid to be queried 
 * @returns 
 */
export async function getVariantByRsid(rsid: string): Promise<RsVariant[]> {
  const variants = db.collection("variants");
  try {
    const vs = await db.query<any>(aql`
    FOR v IN ${variants}
    FILTER ${rsid} in v.rsid
    RETURN v
    `);
    let res: RsVariant[] = [];
    for await (const v of vs) {
      const newId = v["_key"];
      const newKey = v["_id"];
      res.push({ ...v, _id: newId, _key: newKey });
    }
    return res;
  } catch (err: any) {
    console.error(err.message);
  }
  return [] as RsVariant[];
}

/**
 * get genes linked to a rsid
 * @param db 
 * @param rsid 
 * @param num: how many genes to return, default 5
 */
export async function getGenesLinkedToRsidKey(rsidKey: string, num: number = LIMIT) {
  const genes = db.collection("genes");
  const variants = db.collection("variants");
  try {
    const gs = await db.query<any>(aql`
    WITH ${variants}, ${genes}
      FOR v IN OUTBOUND ${rsidKey} variants_genes
      LIMIT ${num}
      RETURN v
    `);
    let res = [];
    for await (const g of gs) {
      const newId = g["_key"];
      const newKey = g["_id"];
      res.push({ ...g, _id: newId, _key: newKey });
    }
    return res;
  } catch (err: any) {
    console.error(err.message);
  }
  return []
}

/**
 * get proteins linked to a rsid _id
 * @param db 
 * @param rsidKey 
 * @param num 
 * @returns 
 */
export async function getProteinsLinkedToRsidKey(rsidKey: string, num: number = LIMIT) {
  const proteins = db.collection("proteins");
  const variants = db.collection("variants");
  try {
    const gs = await db.query<any>(aql`
    WITH ${variants}, ${proteins}
      FOR v IN OUTBOUND ${rsidKey} variants_proteins
      LIMIT ${num}
      RETURN v
    `);
    let res = [];
    for await (const g of gs) {
      const newId = g["_key"];
      const newKey = g["_id"];
      res.push({ ...g, _id: newId, _key: newKey });
    }
    return res;
  } catch (err: any) {
    console.error(err.message);
  }
  return []
}

/**
 * get drugs linked to a rsid _id
 * @param db 
 * @param rsidKey 
 * @param num 
 * @returns 
 */
export async function getDrugsLinkedToRsidKey(rsidKey: string, num: number = LIMIT) {
  const drugs = db.collection("drugs");
  const variants = db.collection("variants");
  try {
    const gs = await db.query<any>(aql`
    WITH ${variants}, ${drugs}
      FOR v IN OUTBOUND ${rsidKey} variants_drugs
      LIMIT ${num}
      RETURN v
    `);
    let res = [];
    for await (const g of gs) {
      const newId = g["_key"];
      const newKey = g["_id"];
      res.push({ ...g, _id: newId, _key: newKey });
    }
    return res;
  } catch (err: any) {
    console.error(err.message);
  }
  return []
}

export async function getStudiesLinkedToRsidKey(rsidKey: string, num: number = LIMIT) {
  const studies = db.collection("studies");
  const variants = db.collection("variants");
  try {
    const gs = await db.query(aql`
    WITH ${variants}, ${studies}
      FOR v IN INBOUND ${rsidKey} studies_variants
      LIMIT ${num}
      RETURN v
    `);
    let res = [];
    for await (const g of gs) {
      if (g) {
        const newId = g["_key"];
        const newKey = g["_id"];
        res.push({ ...(g as any), _id: newId, _key: newKey });
      }
    }
    return res;
  } catch (err: any) {
    console.error(err.message);
  }
  return []
}