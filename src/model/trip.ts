export interface TripApiItem {
  origin?: string;
  destination?: string;
  cost?: number;
  duration?: number;
  type?: string;
  id?: string;
  display_name: string;
}

export type FindTripResponse = TripApiItem[];

export interface TripApiRequest {
  origin: string;
  destination: string;
}

export const FIND_SORTED_TRIPS_SORT_BY_VALUES = {
  FASTEST: 'fastest',
  CHEAPEST: 'cheapest',
};

export interface FindSortedTripsRequest extends TripApiRequest {
  sort_by:
    | typeof FIND_SORTED_TRIPS_SORT_BY_VALUES.FASTEST
    | typeof FIND_SORTED_TRIPS_SORT_BY_VALUES.CHEAPEST;
}

export const SUPPORTED_TRIP_POINTS_LIST = [
  'ATL',
  'PEK',
  'LAX',
  'DXB',
  'HND',
  'ORD',
  'LHR',
  'PVG',
  'CDG',
  'DFW',
  'AMS',
  'FRA',
  'IST',
  'CAN',
  'JFK',
  'SIN',
  'DEN',
  'ICN',
  'BKK',
  'SFO',
  'LAS',
  'CLT',
  'MIA',
  'KUL',
  'SEA',
  'MUC',
  'EWR',
  'MAD',
  'HKG',
  'MCO',
  'PHX',
  'IAH',
  'SYD',
  'MEL',
  'GRU',
  'YYZ',
  'LGW',
  'BCN',
  'MAN',
  'BOM',
  'DEL',
  'ZRH',
  'SVO',
  'DME',
  'JNB',
  'ARN',
  'OSL',
  'CPH',
  'HEL',
  'VIE',
];

export const SUPPORTED_TRIP_POINTS = new Set(SUPPORTED_TRIP_POINTS_LIST);

export interface BaseTripRecord {
  description?: string;
  origin: string;
  destination: string;
  startDate: Date;
  createdBy: string;
}

export interface TripRecord extends BaseTripRecord {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
