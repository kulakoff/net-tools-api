export type counterModel = "CE-300" | "CE-301" | "CE-102M";

export interface iCounterItem {
  id?: number;
  serial_number: string;
  model: counterModel;
  address: string;
}
