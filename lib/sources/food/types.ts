// lib/sources/food/types.ts
// PRD §2.3 / R-03 — 맛집 데이터 소스는 어댑터 인터페이스 뒤에 둔다.

import type { Sido, Sigungu } from "@/lib/regions";
import type { FoodCategory } from "@/lib/categories";

export type Restaurant = {
  id: string;
  sidoCode: string;
  sigunguCode: string | null;
  name: string;
  category: FoodCategory;
  rawCategory?: string;
  address: string;
  lat: number | null;
  lng: number | null;
  tel?: string;
  hours?: string;
  menu?: string;
  imageUrl?: string;
  sourceId: string;
  geocoded: boolean;
};

export type RegionQuery = {
  sido: Sido;
  sigungu: Sigungu | null; // null = "전체"
};

export interface FoodSource {
  id: string;
  label: string;
  fetchByRegion(q: RegionQuery): Promise<Restaurant[]>;
}
