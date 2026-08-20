// app/api/region/route.ts
// PRD §4.2 — 브라우저가 서비스키를 직접 쓰지 않도록 서버가 중계한다.
// 모의 데이터 대신 카카오 로컬 키워드 검색 API로 지역 내 맛집을 실시간 조회한다
// (app/api/search/route.ts와 동일한 소스 — 좌표도 Kakao 응답에 이미 포함되어
// 별도 지오코딩 단계가 필요 없다).

import { NextRequest, NextResponse } from "next/server";
import { findSido, findSigungu } from "@/lib/regions";
import { mapToCategory } from "@/lib/categories";
import type { Restaurant } from "@/lib/sources/food/types";

type KakaoDocument = {
  id: string;
  place_name: string;
  category_name?: string;
  road_address_name?: string;
  address_name?: string;
  phone?: string;
  x?: string;
  y?: string;
};

type KakaoKeywordSearchResponse = {
  documents?: KakaoDocument[];
};

const KAKAO_SEARCH_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sidoCode = searchParams.get("sido");
  const sigunguCode = searchParams.get("sigungu");

  if (!sidoCode) {
    return NextResponse.json({ code: "MISSING_REGION" }, { status: 400 });
  }

  const sido = findSido(sidoCode);
  if (!sido) {
    return NextResponse.json({ code: "UNKNOWN_REGION" }, { status: 404 });
  }
  const sigungu = sigunguCode ? findSigungu(sido.code, sigunguCode) ?? null : null;

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ code: "MISSING_API_KEY" }, { status: 500 });
  }

  const query = sigungu ? `${sido.label} ${sigungu.label} 맛집` : `${sido.label} 맛집`;

  const url = new URL(KAKAO_SEARCH_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("category_group_code", "FD6");
  url.searchParams.set("size", "15");

  const kakaoRes = await fetch(url, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });

  if (!kakaoRes.ok) {
    return NextResponse.json({ code: "UPSTREAM_ERROR" }, { status: 502 });
  }

  const data: KakaoKeywordSearchResponse = await kakaoRes.json();
  const documents = data.documents ?? [];

  const restaurants: Restaurant[] = documents.map((d) => ({
    id: d.id,
    sidoCode: sido.code,
    sigunguCode: sigungu?.code ?? null,
    name: d.place_name,
    category: mapToCategory(d.category_name ?? ""),
    rawCategory: d.category_name,
    address: d.road_address_name || d.address_name || "",
    lat: d.y ? Number(d.y) : null,
    lng: d.x ? Number(d.x) : null,
    tel: d.phone || undefined,
    sourceId: "kakao",
    geocoded: false,
  }));

  return NextResponse.json({ restaurants });
}
