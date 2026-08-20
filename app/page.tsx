"use client";

import { useEffect, useMemo, useState } from "react";
import { SIDO_LIST, findSido, findSigungu } from "@/lib/regions";
import { FOOD_CATEGORIES, type FoodCategory } from "@/lib/categories";
import { mockFoodSource } from "@/lib/sources/food/mock";
import type { Restaurant } from "@/lib/sources/food/types";

export default function HomePage() {
  const [sidoCode, setSidoCode] = useState<string>("");
  const [sigunguCode, setSigunguCode] = useState<string>(""); // "" = 전체
  const [selectedCategories, setSelectedCategories] = useState<FoodCategory[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  const sido = sidoCode ? findSido(sidoCode) : undefined;
  const sigungu = sido && sigunguCode ? findSigungu(sido.code, sigunguCode) : null;
  const regionConfirmed = Boolean(sido);

  // R-14: 시/도를 바꾸면 구·군·카테고리 선택을 초기화한다.
  function handleSidoChange(nextCode: string) {
    setSidoCode(nextCode);
    setSigunguCode("");
    setSelectedCategories([]);
  }

  // F-04: 지역이 확정된 뒤에만 데이터를 가져온다.
  useEffect(() => {
    if (!sido) {
      setRestaurants([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    mockFoodSource
      .fetchByRegion({ sido, sigungu: sigungu ?? null })
      .then((result) => {
        if (!cancelled) setRestaurants(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sido, sigungu]);

  // 카테고리별 개수는 지역 필터링 결과 기준(카테고리 필터 적용 전)으로 병기한다.
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<FoodCategory, number>> = {};
    for (const r of restaurants) {
      counts[r.category] = (counts[r.category] ?? 0) + 1;
    }
    return counts;
  }, [restaurants]);

  function toggleCategory(category: FoodCategory) {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }

  const filteredRestaurants = useMemo(() => {
    if (selectedCategories.length === 0) return restaurants;
    return restaurants.filter((r) => selectedCategories.includes(r.category));
  }, [restaurants, selectedCategories]);

  return (
    <main className="page">
      <header className="header">
        <h1>전국 시티투어 맛집 지도 — 1차(필터·리스트)</h1>
        <p className="subtitle">지역과 음식 종류를 골라 맛집을 찾아보세요.</p>
      </header>

      <section className="region-picker" aria-label="지역 선택">
        <div className="field">
          <label htmlFor="sido-select">시/도</label>
          <select
            id="sido-select"
            value={sidoCode}
            onChange={(e) => handleSidoChange(e.target.value)}
          >
            <option value="">시/도를 선택해 주세요</option>
            {SIDO_LIST.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="sigungu-select">구·군</label>
          <select
            id="sigungu-select"
            value={sigunguCode}
            disabled={!sido}
            onChange={(e) => setSigunguCode(e.target.value)}
          >
            <option value="">전체</option>
            {sido?.sigungu.map((g) => (
              <option key={g.code} value={g.code}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {!regionConfirmed && (
        <p className="notice" role="status">
          시/도를 먼저 선택해 주세요.
        </p>
      )}

      <section
        className="category-filter"
        aria-label="음식 카테고리 필터"
        aria-disabled={!regionConfirmed}
      >
        {FOOD_CATEGORIES.map((category) => {
          const count = categoryCounts[category] ?? 0;
          const active = selectedCategories.includes(category);
          const disabled = !regionConfirmed || count === 0;
          return (
            <button
              key={category}
              type="button"
              className="chip"
              aria-pressed={active}
              disabled={disabled}
              data-active={active}
              onClick={() => toggleCategory(category)}
            >
              {category} {regionConfirmed ? count : ""}
            </button>
          );
        })}
      </section>

      <section className="result-list" aria-label="맛집 목록">
        <div className="result-header">
          {regionConfirmed && (
            <span>
              {sido!.label}
              {sigungu ? ` · ${sigungu.label}` : " · 전체"} — 총 {filteredRestaurants.length}곳
            </span>
          )}
        </div>

        {loading && <p className="notice">불러오는 중...</p>}

        {!loading && regionConfirmed && filteredRestaurants.length === 0 && (
          <p className="notice">
            조건에 맞는 맛집이 없습니다.
            {selectedCategories.length > 0 && (
              <button type="button" className="link-button" onClick={() => setSelectedCategories([])}>
                필터 초기화
              </button>
            )}
          </p>
        )}

        <ul className="restaurant-list">
          {filteredRestaurants.map((r) => (
            <li key={r.id} className="restaurant-card">
              <div className="restaurant-main">
                <span className="restaurant-name">{r.name}</span>
                <span className="badge">{r.category}</span>
              </div>
              <p className="restaurant-address">{r.address}</p>
              {r.menu && <p className="restaurant-menu">대표메뉴: {r.menu}</p>}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
