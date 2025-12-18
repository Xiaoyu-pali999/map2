
export type Region = 'Europe' | 'AsiaPacific' | 'Americas' | 'Africa';
export type MemberType = 'Member' | 'Affiliate';
export type ActiveStatus = 'active' | 'inactive';
export type VerificationStatus = 'auto' | 'pending' | 'confirmed';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface FieldVersion {
  valueCN: string;
  valueEN: string;
  status: VerificationStatus;
  updatedAt: string;
}

export interface Field {
  valueCN: string;
  valueEN: string;
  status: VerificationStatus;
  source?: string;
  updatedAt?: string;
  allowAutoUpdate?: boolean;
  history?: FieldVersion[];
}

export interface CustomField extends Field {
  id: string;
  labelCN: string;
  labelEN: string;
}

// Added missing interfaces for exports to fix imports in constants.ts
export interface BasicFacts {
  yearEstablished: Field;
  legalStatus: Field;
  memberScale: Field;
  staffScale: Field;
}

export interface CoreAreas {
  tagsCN: string[];
  tagsEN: string[];
  status: VerificationStatus;
}

export interface ContactInfo {
  delegate: string;
  emails: string[];
  website: string;
}

export interface AssociationMember {
  id: string;
  memberType: MemberType;
  memberCategory: 'association' | 'corporate'; // Added to fix memberCategory errors
  abbreviation: string;
  nameEN: string;
  nameCN: string;
  country: string;
  countryCN: string; 
  region: Region;
  coordinates: Coordinates;
  logo: string;
  overview: Field;
  coreAreas: CoreAreas; // Added to fix coreAreas errors
  basicFacts: BasicFacts; // Updated to use exported interface
  customFields?: CustomField[];
  contacts: ContactInfo; // Updated to use exported interface
  status: ActiveStatus; 
  internalNotes?: string; 
  allowGlobalAutoUpdate?: boolean; // Added to support constants initialization
  news?: any[]; // Added to support constants initialization
}

export interface DisplaySettings {
  showActiveOnly: boolean;
  allowedRegions: Region[];
  allowedTypes: MemberType[];
  showCorporate: boolean; // Added for export filters in exportSystem.ts
  showAssociation: boolean; // Added for export filters in exportSystem.ts
  showAffiliate: boolean; // Added for export filters in exportSystem.ts
}

export type Language = 'zh' | 'en';
