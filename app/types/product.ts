import { SimpleDate } from "./date";

export default interface Product {
  bestBefore?: SimpleDate;
  finishDate?: string;
  id: number;
  isActive: boolean;
  name: string;
  openDate?: string;
  totalUses?: number;
  usedWithin?: number;
}
