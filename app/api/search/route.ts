// app/api/search/route.ts
// "맛집 담기" — 카카오 로컬 키워드 검색 API를 서버에서 중계한다.
// 브라우저는 KAKAO_REST_API_KEY(서버 전용 A등급 키)를 절대 알지 못한다.

import { NextRequest, NextResponse } from "next/server";
import { mapToCategory, type FoodCategory } from "@/lib/categories";

export type SearchRestaurant = {
  id: string;
  name: string;
  category: FoodCategory;
  rawCategory: string;
  address: string;
  tel: string;
  lat: number | null;
  lng: number | null;
  placeUrl: string;
};

type KakaoDocument = {
  id: string;
  place_name: string;
  category_name?: string;
  road_address_name?: string;
  address_name?: string;
  phone?: string;
  x?: string;
  y?: string;
  place_url?: string;
};

type KakaoKeywordSearchResponse = {
  documents?: KakaoDocument[];
};

const KAKAO_SEARCH_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ code: "MISSING_QUERY" }, { status: 400 });
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ code: "MISSING_API_KEY" }, { status: 500 });
  }

  const url = new URL(KAKAO_SEARCH_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("category_group_code", "FD6");

  const kakaoRes = await fetch(url, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });

  if (!kakaoRes.ok) {
    return NextResponse.json({ code: "KAKAO_API_ERROR" }, { status: 502 });
  }

  const data: KakaoKeywordSearchResponse = await kakaoRes.json();
  const documents = data.documents ?? [];

  const restaurants: SearchRestaurant[] = documents.map((d) => ({
    id: d.id,
    name: d.place_name,
    category: mapToCategory(d.category_name ?? ""),
    rawCategory: d.category_name ?? "",
    address: d.road_address_name || d.address_name || "",
    tel: d.phone ?? "",
    lat: d.y ? Number(d.y) : null,
    lng: d.x ? Number(d.x) : null,
    placeUrl: d.place_url ?? "",
  }));

  return NextResponse.json({ restaurants });
}
