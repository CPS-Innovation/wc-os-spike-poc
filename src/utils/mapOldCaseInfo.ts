import { CaseInfoType, OldCaseInfoType } from '../types/caseInfo.ts';
 
export const mapOldCaseInfo = (oldCaseInfo: OldCaseInfoType): CaseInfoType => ({
  id: oldCaseInfo.id,
  urn: oldCaseInfo.uniqueReferenceNumber,
  leadDefendantFirstNames: oldCaseInfo.leadDefendantDetails.firstNames,
  leadDefendantSurname: oldCaseInfo.leadDefendantDetails.surname,
  numberOfDefendants: oldCaseInfo.numberOfDefendants
});