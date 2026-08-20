"use client";

// app/search/page.tsx
// "맛집 담기" — 카카오 로컬 API(/api/search)를 실시간으로 호출해 실제 맛집을 카드로 보여준다.
// app/page.tsx(모의 데이터 · 지역 필터)와는 별개의 새 페이지.

import { useRef, useState, type FormEvent } from "react";
import { FOOD_CATEGORIES, type FoodCategory } from "@/lib/categories";
import type { SearchRestaurant } from "@/app/api/search/route";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [restaurants, setRestaurants] = useState<SearchRestaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FoodCategory | null>(null);

  // 연속 클릭/제출 시 오래된 응답이 새 응답을 덮어쓰지 않도록 요청 순번을 추적한다.
  const requestSeq = useRef(0);

  async function runSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;

    const seq = ++requestSeq.current;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(trimmed)}`);
      const data: { restaurants?: SearchRestaurant[] } = await res.json();
      if (seq === requestSeq.current) {
        setRestaurants(data.restaurants ?? []);
        setHasSearched(true);
      }
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setActiveCategory(null);
    void runSearch(query);
  }

  function handleCategoryClick(category: FoodCategory) {
    setActiveCategory(category);
    const trimmedQuery = query.trim();
    const merged = trimmedQuery ? `${trimmedQuery} ${category}` : category;
    setQuery(merged);
    void runSearch(merged);
  }

  return (
    <main className="page">
      <header className="header">
        <h1>맛집 담기</h1>
        <p className="subtitle">키워드로 검색하면 실제 맛집을 실시간으로 보여드려요.</p>
      </header>

      <form className="search-bar" onSubmit={handleSubmit} aria-label="맛집 검색">
        <div className="field">
          <label htmlFor="search-query">검색어</label>
          <input
            id="search-query"
            className="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 강남역 맛집"
          />
        </div>
        <button type="submit" className="search-button">
          검색
        </button>
      </form>

      <section className="search-chip-row" aria-label="음식 카테고리로 검색">
        {FOOD_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className="chip"
            aria-pressed={activeCategory === category}
            data-active={activeCategory === category}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </section>

      <section aria-label="검색 결과">
        <div className="result-header">
          {hasSearched ? `검색 결과 ${restaurants.length}곳` : "검색어를 입력하거나 카테고리를 선택해보세요."}
        </div>

        {loading && <p className="notice">불러오는 중...</p>}

        {!loading && hasSearched && restaurants.length === 0 && (
          <p className="notice">검색 결과가 없습니다.</p>
        )}

        <ul className="restaurant-list">
          {restaurants.map((r) => (
            <li key={r.id} className="restaurant-card">
              <a
                className="search-card-link"
                href={r.placeUrl}
                target="_blank"
                rel="noreferrer"
              >
                <div className="restaurant-main">
                  <span className="restaurant-name">{r.name}</span>
                  <span className="badge">{r.category}</span>
                </div>
                <p className="restaurant-address">{r.address}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
