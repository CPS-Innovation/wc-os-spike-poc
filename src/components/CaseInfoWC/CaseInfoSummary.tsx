import { useEffect, useState } from "react";
import { mapOldCaseInfo } from "../../utils/mapOldCaseInfo.ts";
import { CaseInfoType } from "../../types/caseInfo.ts";

const eventName = "cwm-unauthorised";
const API_URL = import.meta.env.VITE_POLARIS_API_URL;

export const CaseInfoSummary = ({
  caseId,
  urn,
}: {
  caseId?: string;
  urn?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [caseInfo, setCaseInfo] = useState<CaseInfoType | null>(null);

  let accessToken: string | null;

  const fetchData = async () => {
    setIsLoading(true);

    try {
      if (typeof window.acquireAccessToken === "function") {
        console.log("CIS Component: acquiring MSAL access token..");
        accessToken = await window.acquireAccessToken();
      } else {
        throw new Error();
      }

      const fetchUrl = `${API_URL}/urns/${urn}/cases/${caseId}`;
      console.log(`CIS Component: fetching from API URL: ${fetchUrl}`);
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Correlation-Id": crypto.randomUUID(),
        },
        credentials: "include",
      });

      console.log("CIS Component: response received");

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      console.log(`CIS Component: response data: ${JSON.stringify(data)}`);
      setCaseInfo(mapOldCaseInfo(data));
    } catch {
      console.log(
        `CIS component: Error trying to fetch case data: urn ${urn} caseId ${caseId}`,
      );
      window.dispatchEvent(
        new CustomEvent(eventName, {
          detail: {
            error:
              "There was a problem connecting to Case Info via the web component",
          },
        }),
      );
    } finally {
      console.log("CIS Component: finally block");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (caseId && urn) {
      fetchData();
    }
  }, [caseId, urn]);

  if (isLoading || !caseInfo) {
    return null;
  }

  const surname = caseInfo?.leadDefendantSurname?.toString()?.toUpperCase();
  const firstNames = caseInfo?.leadDefendantFirstNames
    ? `, ${caseInfo?.leadDefendantFirstNames}`
    : "";
  const plusNumber =
    caseInfo?.numberOfDefendants > 1
      ? ` +${caseInfo?.numberOfDefendants - 1}`
      : "";

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
