import { AccountAnalyticsTargets, CustomerInsightsFormData } from "./customerInsights.schema";

export const mapFormToTargets = (form: CustomerInsightsFormData): AccountAnalyticsTargets => {
  return {
    // API expects dollars (not cents), so no conversion needed
    avgSpentDollars: Math.round(Number(form.avgSpentDollars || 0)),
    subscriptionRatePercent: Number(form.subscriptionRatePercent || 0),
    repeatRatePercent: Number(form.repeatRatePercent || 0),
    retentionRatePercent: Number(form.retentionRatePercent || 0),
  };
};


