export type CaseInfoType = {
    id?: number;
    urn?: string;
    leadDefendantFirstNames?: string;
    leadDefendantSurname?: string;
    numberOfDefendants: number;
}

export type OldCaseInfoType = {
    id: number;
    uniqueReferenceNumber: string;
    leadDefendantDetails: {
        firstNames: string;
        surname: string;
    };
    numberOfDefendants: number;
}