// lib/sources/food/mock.ts
// PRD §4.1 STEP 0 — 문화공공데이터광장 API(API_CNV_063)가 응답하지 않아
// 1차는 모의 데이터 어댑터로 진행한다. 실제 응답을 받으면 이 파일을 culture.ts로
// 교체하되, FoodSource 인터페이스와 정규화 결과(Restaurant)는 그대로 유지한다.

import { mapToCategory } from "@/lib/categories";
import type { FoodSource, Restaurant, RegionQuery } from "./types";

type RawItem = {
  id: string;
  sidoCode: string;
  sigunguCode: string;
  name: string;
  rawCategory: string;
  address: string;
  tel?: string;
  hours?: string;
  menu?: string;
};

// PRD §2.1.1 확보 대상 6개 도시 중심의 표본 데이터.
const RAW_ITEMS: RawItem[] = [
  // 서울 종로구 (11 / 11010)
  { id: "m-001", sidoCode: "11", sigunguCode: "11010", name: "종로할매순대국", rawCategory: "한식류", address: "서울 종로구 종로3길 12", tel: "02-111-2222", hours: "07:00-21:00", menu: "순대국" },
  { id: "m-002", sidoCode: "11", sigunguCode: "11010", name: "인사동일식당", rawCategory: "일식", address: "서울 종로구 인사동길 34", tel: "02-222-3333", hours: "11:30-22:00", menu: "초밥 오마카세" },
  { id: "m-003", sidoCode: "11", sigunguCode: "11010", name: "북촌떡볶이", rawCategory: "분식", address: "서울 종로구 계동길 5", hours: "10:00-20:00", menu: "즉석떡볶이" },
  { id: "m-004", sidoCode: "11", sigunguCode: "11010", name: "종로커피로스터스", rawCategory: "카페", address: "서울 종로구 자하문로 88", hours: "08:00-22:00", menu: "핸드드립" },
  // 서울 강남구 (11 / 11230)
  { id: "m-005", sidoCode: "11", sigunguCode: "11230", name: "강남중화반점", rawCategory: "중화요리", address: "서울 강남구 테헤란로 101", tel: "02-333-4444", hours: "11:00-21:30", menu: "짜장면, 탕수육" },
  { id: "m-006", sidoCode: "11", sigunguCode: "11230", name: "청담스테이크하우스", rawCategory: "양식", address: "서울 강남구 압구정로 45", tel: "02-444-5555", hours: "17:00-23:00", menu: "안심 스테이크" },
  { id: "m-007", sidoCode: "11", sigunguCode: "11230", name: "역삼회센터", rawCategory: "횟집", address: "서울 강남구 역삼로 12", hours: "16:00-24:00", menu: "광어회" },
  // 부산 해운대구 (26 / 26090)
  { id: "m-008", sidoCode: "26", sigunguCode: "26090", name: "해운대조개구이", rawCategory: "조개구이", address: "부산 해운대구 달맞이길 62", tel: "051-111-2222", hours: "15:00-24:00", menu: "모듬조개구이" },
  { id: "m-009", sidoCode: "26", sigunguCode: "26090", name: "해운대돼지국밥", rawCategory: "국밥", address: "부산 해운대구 구남로 20", hours: "06:00-22:00", menu: "돼지국밥" },
  { id: "m-010", sidoCode: "26", sigunguCode: "26090", name: "마린시티베이커리", rawCategory: "베이커리", address: "부산 해운대구 마린시티2로 9", hours: "08:00-21:00", menu: "소금빵" },
  { id: "m-011", sidoCode: "26", sigunguCode: "26090", name: "센텀돈까스", rawCategory: "돈까스", address: "부산 해운대구 센텀중앙로 78", hours: "11:00-21:00", menu: "등심돈까스" },
  // 경북 경주시 (47 / 47020)
  { id: "m-012", sidoCode: "47", sigunguCode: "47020", name: "황남맷돌순두부", rawCategory: "한식류", address: "경북 경주시 태종로 745", tel: "054-111-2222", hours: "09:00-20:00", menu: "순두부백반" },
  { id: "m-013", sidoCode: "47", sigunguCode: "47020", name: "불국사한정식", rawCategory: "한정식", address: "경북 경주시 불국로 385", hours: "10:00-21:00", menu: "정식 코스" },
  { id: "m-014", sidoCode: "47", sigunguCode: "47020", name: "경주찻집", rawCategory: "찻집", address: "경북 경주시 첨성로 90", hours: "10:00-22:00", menu: "쌍화차" },
  // 전북 전주시 (45 / 45010)
  { id: "m-015", sidoCode: "45", sigunguCode: "45010", name: "한옥마을비빔밥", rawCategory: "향토음식", address: "전북 전주시 완산구 은행로 20", tel: "063-111-2222", hours: "09:00-21:00", menu: "전주비빔밥" },
  { id: "m-016", sidoCode: "45", sigunguCode: "45010", name: "전주중화루", rawCategory: "중식", address: "전북 전주시 완산구 팔달로 12", hours: "11:00-21:00", menu: "짬뽕" },
  { id: "m-017", sidoCode: "45", sigunguCode: "45010", name: "객리단길카페", rawCategory: "카페", address: "전북 전주시 완산구 경기전길 5", hours: "10:00-22:00", menu: "라떼" },
  // 전남광주 여수시 (46 / 46070)
  { id: "m-018", sidoCode: "46", sigunguCode: "46070", name: "여수돌게장정식", rawCategory: "해산물", address: "전남 여수시 중앙로 55", tel: "061-111-2222", hours: "10:00-21:00", menu: "간장게장정식" },
  { id: "m-019", sidoCode: "46", sigunguCode: "46070", name: "여수하모횟집", rawCategory: "회", address: "전남 여수시 종화로 8", hours: "12:00-23:00", menu: "하모샤브샤브" },
  { id: "m-020", sidoCode: "46", sigunguCode: "46070", name: "낭만포차분식", rawCategory: "분식", address: "전남 여수시 이순신광장로 3", hours: "17:00-01:00", menu: "떡볶이, 튀김" },
  // 강원 강릉시 (51 / 51030)
  { id: "m-021", sidoCode: "51", sigunguCode: "51030", name: "강릉초당순두부", rawCategory: "한식류", address: "강원 강릉시 초당순두부길 15", tel: "033-111-2222", hours: "07:00-20:00", menu: "순두부정식" },
  { id: "m-022", sidoCode: "51", sigunguCode: "51030", name: "안목해변커피", rawCategory: "카페", address: "강원 강릉시 창해로 14", hours: "08:00-22:00", menu: "핸드드립" },
  { id: "m-023", sidoCode: "51", sigunguCode: "51030", name: "강릉물회식당", rawCategory: "물회", address: "강원 강릉시 사천진리 44", hours: "10:00-20:00", menu: "가자미물회" },
  { id: "m-024", sidoCode: "51", sigunguCode: "51030", name: "경포분식", rawCategory: "김밥", address: "강원 강릉시 경포로 100", hours: "09:00-19:00", menu: "김밥, 라면" },
];

function normalize(raw: RawItem): Restaurant | null {
  if (!raw.name) return null;
  return {
    id: raw.id,
    sidoCode: raw.sidoCode,
    sigunguCode: raw.sigunguCode,
    name: raw.name,
    category: mapToCategory(raw.rawCategory),
    rawCategory: raw.rawCategory,
    address: raw.address,
    lat: null,
    lng: null,
    tel: raw.tel,
    hours: raw.hours,
    menu: raw.menu,
    sourceId: "mock",
    geocoded: false,
  };
}

export const mockFoodSource: FoodSource = {
  id: "mock",
  label: "모의 데이터 (문화공공데이터광장 API 응답 대기 중)",
  async fetchByRegion({ sido, sigungu }: RegionQuery): Promise<Restaurant[]> {
    return RAW_ITEMS.filter((raw) => {
      if (raw.sidoCode !== sido.code) return false;
      if (sigungu && raw.sigunguCode !== sigungu.code) return false;
      return true;
    })
      .map(normalize)
      .filter((r): r is Restaurant => r !== null);
  },
};
