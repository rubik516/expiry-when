import { SimpleDate } from "@/types/date";

export default interface Product {
  bestBefore?: SimpleDate;
  finishDate?: string;
  id: number;
  isActive: boolean;
  name: string;
  openDate?: string;
  totalDaytimeUses: number;
  totalNighttimeUses: number;
  totalUses?: number;
  usedWithin?: number;
}
