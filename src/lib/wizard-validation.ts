// Validation logic for each wizard step. Kept separate so UI code
// can simply ask: "is this step's answer valid?"

import type { WizardAnswers } from "./document-generator";

type PartialAnswers = Partial<WizardAnswers>;

export function isStepValid(stepId: string, answers: PartialAnswers): boolean {
  switch (stepId) {
    case "welcome":
      return true;
    case "dbName":
      return !!(answers.dbName && answers.dbName.trim().length >= 2);
    case "purpose":
      return !!(answers.purpose && answers.purpose.trim().length >= 10);
    case "collectionMethod":
      return (
        answers.collectionMethod === "direct" ||
        answers.collectionMethod === "thirdParty" ||
        answers.collectionMethod === "mixed"
      );
    case "subjectsCount":
      return typeof answers.subjectsCount === "number" && answers.subjectsCount > 0;
    case "permissionsCount":
      return (
        typeof answers.permissionsCount === "number" && answers.permissionsCount > 0
      );
    case "dataTypes":
      return Array.isArray(answers.dataTypes) && answers.dataTypes.length > 0;
    case "subjectCategories":
      return (
        Array.isArray(answers.subjectCategories) &&
        answers.subjectCategories.length > 0
      );
    case "transferAbroad":
      return typeof answers.transferAbroad === "boolean";
    case "vendors":
      // Vendors is optional — empty list is a valid answer.
      return Array.isArray(answers.vendors);
    case "manager":
      return !!(
        answers.manager &&
        answers.manager.name.trim().length >= 2 &&
        answers.manager.role.trim().length >= 2 &&
        /^\S+@\S+\.\S+$/.test(answers.manager.email)
      );
    default:
      return false;
  }
}

export function emptyAnswers(): WizardAnswers {
  return {
    dbName: "",
    purpose: "",
    collectionMethod: "direct",
    subjectsCount: 0,
    permissionsCount: 0,
    dataTypes: [],
    sensitiveTypes: [],
    subjectCategories: [],
    transferAbroad: false,
    vendors: [],
    manager: { name: "", role: "", email: "" },
  };
}
