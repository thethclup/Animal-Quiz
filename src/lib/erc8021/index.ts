/**
 * ERC-8021 Transaction Attribution
 * Specifies how actions can be attributed to specific builders or referrers.
 */

export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const BUILDER_CODE = "bc_pztj2h8z";

export function generateAttributionPayload(actionDetails: Record<string, any>) {
  return {
    attributionCode: ATTRIBUTION_CODE,
    builderCode: BUILDER_CODE,
    ...actionDetails
  };
}

export function logAttributedAction(actionName: string) {
  console.log(`[ERC-8021] Tracking attributed action: ${actionName} for`, ATTRIBUTION_CODE);
}
