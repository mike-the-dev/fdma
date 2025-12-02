/**
 * @author Michael Camacho (mike-the-dev)
 * @editor Michael Camacho (mike-the-dev)
 * @lastUpdated 2025-05-04
 * @name QueryCacheTime
 * @description Enum of standardized cache stale times (in milliseconds) for use in TanStack Query across client-side logic.
 */

export enum QueryCacheTime {
  OneMinute = 1000 * 60,           // 1 minute
  FiveMinutes = 1000 * 60 * 5,     // 5 minutes
  FifteenMinutes = 1000 * 60 * 15, // 15 minutes
  OneHour = 1000 * 60 * 60         // 1 hour
};

export const STALE_TIME_PUBLIC_SERVICES = QueryCacheTime.FiveMinutes;