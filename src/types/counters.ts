import { StringLiteralLike } from "typescript";

export type counterModel = "CE-300" | "CE-301" | "CE-102M";

export interface iCounterItem {
  id?: number;
  serial_number: string;
  model: counterModel;
  address: string;
  customer_id: number;
  provider_id: number;
  card_number: string;
  telemetry: boolean
}

export interface ICounterDataHistoryItem {
  id: number;
  value: string;
  timestamp: string;
}

export interface ICounterDataItem {
  id: number;
  serial_number: string;
  model: counterModel;
  address: string;
  telemetry: boolean;
  card_number: string;
  counters_data: ICounterDataHistoryItem[];
}

export interface IDataForReport {
  user: string;
  currentDate: string;
  meters: ICounterDataItem[];
}
