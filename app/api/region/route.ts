// app/api/region/route.ts
// PRD §4.2 — 브라우저가 서비스키를 직접 쓰지 않도록 서버가 중계한다.
// 1차 범위: 맛집 어댑터(현재 모의 데이터) 호출 + 좌표 없는 항목만 서버 지오코딩(R-05).

import { NextRequest, NextResponse } from "next/server";
import { findSido, findSigungu } from "@/lib/regions";
import { mockFoodSource } from "@/lib/sources/food/mock";
import { geocodeAddress } from "@/lib/geocode";
import type { Restaurant } from "@/lib/sources/food/types";

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

  const restaurants = await mockFoodSource.fetchByRegion({ sido, sigungu });

  const enriched: Restaurant[] = await Promise.all(
    restaurants.map(async (r) => {
      if (r.lat !== null && r.lng !== null) return r;
      const coord = await geocodeAddress(r.address);
      if (!coord) return r;
      return { ...r, lat: coord.lat, lng: coord.lng, geocoded: true };
    })
  );

  return NextResponse.json({ restaurants: enriched });
}
