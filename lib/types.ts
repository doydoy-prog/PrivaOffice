export type OrganizationType = "nonprofit" | "company" | "public";

export const ORGANIZATION_TYPE_LABELS: Record<OrganizationType, string> = {
  nonprofit: "עמותה",
  company: "חברה",
  public: "גוף ציבורי",
};

// Client-side representation of an organization's state, mirroring the
// prototype's localStorage shape. Will be replaced by Prisma-backed server
// state in the next iteration.
export interface ClientOrganization {
  id: string;
  name: string;
  type: OrganizationType;
  createdAt: string;
  dataAsset: {
    name: string;
    subjectCategories: string[];
    purpose: string[];
    collectionMethods: string[];
    subjectsCount: number;
    permissionsCount: number;
    dataTypes: string[];
    sensitiveTypes: string[];
    transferAbroad: boolean | null;
    vendors: { name: string; activity: string }[];
    managerName: string;
    managerRole: string;
    managerEmail: string;
  };
  tasks: Record<string, "open" | "in_progress" | "done">;
  dpoAssessment: Record<string, string>;
}

export function createEmptyDataAsset(): ClientOrganization["dataAsset"] {
  return {
    name: "",
    subjectCategories: [],
    purpose: [],
    collectionMethods: [],
    subjectsCount: 0,
    permissionsCount: 0,
    dataTypes: [],
    sensitiveTypes: [],
    transferAbroad: null,
    vendors: [],
    managerName: "",
    managerRole: "",
    managerEmail: "",
  };
}
