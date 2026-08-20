// lib/categories.ts
// PRD §2.6 / R-07 / R-08 — 원본 분류 문자열을 8종 표준 카테고리로 매핑한다.

export const FOOD_CATEGORIES = [
  "한식",
  "중식",
  "일식",
  "양식",
  "분식",
  "카페·디저트",
  "해산물",
  "기타",
] as const;

export type FoodCategory = (typeof FOOD_CATEGORIES)[number];

const CATEGORY_KEYWORDS: Record<Exclude<FoodCategory, "기타">, string[]> = {
  한식: ["한식", "백반", "국밥", "한정식", "향토음식", "육류"],
  중식: ["중식", "중화요리", "중국"],
  일식: ["일식", "초밥", "돈까스", "라멘"],
  양식: ["양식", "이탈리안", "스테이크", "피자", "파스타"],
  분식: ["분식", "김밥", "떡볶이"],
  "카페·디저트": ["카페", "제과", "베이커리", "찻집", "디저트", "커피"],
  해산물: ["회", "횟집", "조개구이", "해물탕", "해산물", "수산"],
};

/** R-07/R-08: 매핑되지 않는 원본 분류는 버리지 않고 "기타"로 남긴다. */
export function mapToCategory(rawCategory: string): FoodCategory {
  for (const category of FOOD_CATEGORIES) {
    if (category === "기타") continue;
    const keywords = CATEGORY_KEYWORDS[category];
    if (keywords.some((kw) => rawCategory.includes(kw))) {
      return category;
    }
  }
  return "기타";
}
