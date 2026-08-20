#!/usr/bin/env bash
# 빌드 산출물과 Git 추적 파일에 A등급 키가 새어 나갔는지 검사한다.
# 사용법:  npm run build && bash scripts/check-secrets.sh
set -uo pipefail

fail=0

echo "── 1. .env.local 이 Git에 추적되고 있는가 ──"
if git ls-files --error-unmatch .env.local >/dev/null 2>&1; then
  echo "  ✗ .env.local 이 Git에 추적되고 있습니다! 즉시 제거하고 키를 재발급하세요."
  echo "    git rm --cached .env.local"
  fail=1
else
  echo "  ✓ 추적되지 않음"
fi

echo
echo "── 2. 빌드 산출물(.next/)에 A등급 키 값이 들어갔는가 ──"
if [ ! -d .next ]; then
  echo "  ! .next/ 가 없습니다. 먼저 npm run build 를 실행하세요."
else
  if [ ! -f .env.local ]; then
    echo "  ! .env.local 이 없어 검사를 건너뜁니다."
  else
    for var in CULTURE_API_KEY DATA_GO_KR_SERVICE_KEY KAKAO_REST_API_KEY; do
      val="$(grep -E "^${var}=" .env.local | cut -d= -f2- | tr -d '"'"'"' \r')"
      if [ -z "$val" ]; then
        echo "  - ${var}: 값이 비어 있어 건너뜀"
        continue
      fi
      if grep -rqF -- "$val" .next 2>/dev/null; then
        echo "  ✗ ${var} 의 값이 .next/ 에서 발견되었습니다! 클라이언트 코드에서 참조 중입니다."
        fail=1
      else
        echo "  ✓ ${var}: 산출물에 없음"
      fi
    done
  fi
fi

echo
echo "── 3. 소스에 NEXT_PUBLIC_ 이 잘못 붙은 A등급 키가 있는가 ──"
if grep -rn "NEXT_PUBLIC_\(CULTURE\|DATA_GO_KR\|KAKAO_REST\)" \
     --include='*.ts' --include='*.tsx' --include='*.js' --include='*.mjs' . 2>/dev/null \
     | grep -v node_modules; then
  echo "  ✗ A등급 키에 NEXT_PUBLIC_ 이 붙어 있습니다."
  fail=1
else
  echo "  ✓ 없음"
fi

echo
if [ "$fail" -eq 0 ]; then
  echo "✅ 통과 — 키 노출 흔적 없음"
else
  echo "❌ 실패 — 위 항목을 조치하세요. 이미 커밋·푸시했다면 키를 재발급하는 것이 유일한 확실한 대응입니다."
fi
exit "$fail"
