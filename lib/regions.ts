// lib/regions.ts
// PRD §2.1 / R-01 / R-02 — 지역 목록은 이 파일 한 곳에서만 정의한다.
//
// ⚠️ sigungu.code는 개발용 임시 코드다 (시도코드 + 일련번호).
//    실제 행정표준코드는 행정안전부 공개 파일로 STEP 0~2차 착수 전에 교체해야 한다.
//    center/zoom은 1차(지도 미구현)에서는 쓰이지 않아 비워 두었다 — 2차 착수 시 채운다.

export type Sido = {
  code: string;
  label: string;
  short: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  sigungu: Sigungu[];
};

export type Sigungu = {
  code: string;
  label: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  hasCityTour: boolean;
  foodParams: Record<string, string>;
};

function makeSigungu(
  sidoCode: string,
  names: string[],
  cityTourNames: string[] = []
): Sigungu[] {
  return names.map((label, i) => ({
    code: `${sidoCode}${String((i + 1) * 10).padStart(3, "0")}`,
    label,
    hasCityTour: cityTourNames.includes(label),
    foodParams: { region: label },
  }));
}

export const SIDO_LIST: Sido[] = [
  {
    code: "11",
    label: "서울특별시",
    short: "서울",
    sigungu: makeSigungu(
      "11",
      [
        "종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구",
        "성북구", "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구",
        "양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구",
        "서초구", "강남구", "송파구", "강동구",
      ]
    ),
  },
  {
    code: "26",
    label: "부산광역시",
    short: "부산",
    sigungu: makeSigungu(
      "26",
      [
        "중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구",
        "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구",
        "기장군",
      ]
    ),
  },
  {
    code: "27",
    label: "대구광역시",
    short: "대구",
    sigungu: makeSigungu("27", ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"]),
  },
  {
    code: "28",
    label: "인천광역시",
    short: "인천",
    sigungu: makeSigungu(
      "28",
      ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"]
    ),
  },
  {
    code: "30",
    label: "대전광역시",
    short: "대전",
    sigungu: makeSigungu("30", ["동구", "중구", "서구", "유성구", "대덕구"]),
  },
  {
    code: "31",
    label: "울산광역시",
    short: "울산",
    sigungu: makeSigungu("31", ["중구", "남구", "동구", "북구", "울주군"]),
  },
  {
    code: "36",
    label: "세종특별자치시",
    short: "세종",
    sigungu: makeSigungu("36", ["세종시"]),
  },
  {
    code: "41",
    label: "경기도",
    short: "경기",
    sigungu: makeSigungu(
      "41",
      [
        "수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시",
        "남양주시", "화성시", "평택시", "의정부시", "시흥시", "파주시", "김포시",
        "광명시", "광주시", "군포시", "이천시", "양주시", "오산시", "구리시",
        "안성시", "포천시", "의왕시", "하남시", "여주시", "동두천시", "과천시",
        "양평군", "가평군", "연천군",
      ]
    ),
  },
  {
    code: "51",
    label: "강원특별자치도",
    short: "강원",
    sigungu: makeSigungu(
      "51",
      [
        "춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시",
        "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군",
        "양구군", "인제군", "고성군", "양양군",
      ],
      ["강릉시"]
    ),
  },
  {
    code: "43",
    label: "충청북도",
    short: "충북",
    sigungu: makeSigungu(
      "43",
      ["청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"]
    ),
  },
  {
    code: "44",
    label: "충청남도",
    short: "충남",
    sigungu: makeSigungu(
      "44",
      [
        "천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시",
        "당진시", "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군",
      ]
    ),
  },
  {
    code: "45",
    label: "전북특별자치도",
    short: "전북",
    sigungu: makeSigungu(
      "45",
      ["전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"],
      ["전주시"]
    ),
  },
  {
    code: "46",
    label: "전남광주특별시",
    short: "전남광주",
    sigungu: makeSigungu(
      "46",
      [
        "동구", "서구", "남구", "북구", "광산구", // 옛 광주광역시 5구
        "목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군",
        "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군",
        "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군",
      ],
      ["여수시"]
    ),
  },
  {
    code: "47",
    label: "경상북도",
    short: "경북",
    sigungu: makeSigungu(
      "47",
      [
        "포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시",
        "상주시", "문경시", "경산시", "의성군", "청송군", "영양군", "영덕군",
        "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군",
      ],
      ["경주시"]
    ),
  },
  {
    code: "48",
    label: "경상남도",
    short: "경남",
    sigungu: makeSigungu(
      "48",
      [
        "창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시",
        "양산시", "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군",
        "산청군", "함양군", "거창군", "합천군",
      ]
    ),
  },
  {
    code: "50",
    label: "제주특별자치도",
    short: "제주",
    sigungu: makeSigungu("50", ["제주시", "서귀포시"]),
  },
];

export function findSido(sidoCode: string): Sido | undefined {
  return SIDO_LIST.find((s) => s.code === sidoCode);
}

export function findSigungu(sidoCode: string, sigunguCode: string): Sigungu | undefined {
  return findSido(sidoCode)?.sigungu.find((g) => g.code === sigunguCode);
}
