import { TypeDocument } from "./type-document";

export interface Enterprise {
  id_enterprise: string;
  document: string;
  id_type_document: string;
  contract_expires_at: Date;
  type_document: TypeDocument;
}