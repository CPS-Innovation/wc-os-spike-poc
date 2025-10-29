import { useEffect, useState } from 'react';
import { mapOldCaseInfo } from '../../utils/mapOldCaseInfo.ts';
import { CaseInfoType } from '../../types/caseInfo.ts';

const eventName = 'cwm-unauthorised';
const API_URL = import.meta.env.VITE_POLARIS_API_URL;

export const CaseInfoSummary = ({ caseId, urn }: { caseId: string, urn: string}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [caseInfo, setCaseInfo] = useState<CaseInfoType | null>(null);

  let accessToken: string | null;

  const fetchData = async () => {
      setIsLoading(true);

      try {

        if (typeof window.acquireAccessToken === 'function') {
          accessToken = await window.acquireAccessToken();
        } else {
          throw new Error;
        }

        const response = await fetch(
          `${API_URL}/urns/${urn}/cases/${caseId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Correlation-Id': crypto.randomUUID()
            },
            credentials: 'include'
          }
        );

        if (!response.ok) {
          throw new Error;
        }

        const data = await response.json();
        setCaseInfo(mapOldCaseInfo(data));
      } catch {
        window.dispatchEvent(
          new CustomEvent(eventName, {
            detail: { error: 'There was a problem connecting to Case Info via the web component' }
          }
        ));
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, [caseId, urn]);

  if (isLoading || !caseInfo) {
    return null;
  }


  const surname = caseInfo?.leadDefendantSurname?.toString()?.toUpperCase();
  const firstNames = caseInfo?.leadDefendantFirstNames
    ? `, ${caseInfo?.leadDefendantFirstNames}`
    : '';
  const plusNumber =
    caseInfo?.numberOfDefendants > 1
      ? ` +${caseInfo?.numberOfDefendants - 1}`
      : '';
  
  const caseInfoName = `${surname}${firstNames}${plusNumber}`;
  
  return (
    <div className="case-info-details">
      {!!caseInfo && (
        <>
          <h2 className="govuk-heading-m case-info-name">{caseInfoName}</h2>
          <p className="govuk-body">{caseInfo?.urn}</p>
        </>
      )}
    </div>
  );
};
