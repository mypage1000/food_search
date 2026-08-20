// lib/geocode.ts
// PRD §2.4 / R-05 / S-05 — 지오코딩은 서버에서만 수행한다.
// ⚠️ 'use client' 파일에서 이 모듈을 import하지 않는다. node:fs를 쓰기 때문에
//    클라이언트 번들에 들어가면 빌드가 깨지고, KAKAO_REST_API_KEY(A등급)도 노출된다.

import fs from "node:fs";
import path from "node:path";

const CACHE_PATH = path.join(process.cwd(), "data", "geocode-cache.json");

type Coord = { lat: number; lng: number };
type GeocodeCache = Record<string, Coord | null>;

let cache: GeocodeCache | null = null;

function loadCache(): GeocodeCache {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8")) as GeocodeCache;
  } catch {
    cache = {};
  }
  return cache;
}

function saveCache() {
  if (!cache) return;
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n", "utf-8");
}

// R-04: 정규화 직후 WGS84 범위를 검증한다. 벗어나면(=좌표계·순서 착오) 좌표를 버린다.
function isValidWgs84(lat: number, lng: number): boolean {
  return lat >= 33 && lat <= 39 && lng >= 124 && lng <= 132;
}

/** R-05: 주소 → 좌표. 캐시 우선 조회, 실패 시 null(지도에는 안 찍고 목록에만 남긴다). */
export async function geocodeAddress(address: string): Promise<Coord | null> {
  const c = loadCache();
  if (address in c) return c[address];

  const key = process.env.KAKAO_REST_API_KEY;
  if (!key) {
    c[address] = null;
    return null;
  }

  let result: Coord | null = null;
  try {
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
    const res = await fetch(url, { headers: { Authorization: `KakaoAK ${key}` } });
    if (res.ok) {
      const data: { documents?: Array<{ x: string; y: string }> } = await res.json();
      const doc = data.documents?.[0];
      if (doc) {
        const lat = parseFloat(doc.y);
        const lng = parseFloat(doc.x);
        if (isValidWgs84(lat, lng)) {
          result = { lat, lng };
        }
      }
    }
  } catch {
    result = null;
  }

  c[address] = result;
  saveCache();
  return result;
}
