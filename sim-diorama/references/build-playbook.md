# 제작 플레이북 (Hearthblock·Marina GP에서 검증된 방식)

먼저 `quality-bar.md`를 읽는다. 거기 있는 A~G는 사용자가 말하지 않아도 첫 판에 넣는다.

## 파일 구조 (HTML 한 장, 약 120~170KB)
1. `<head>`: title 2~4단어, :root 색 토큰(밝은 테마 + 다크), 글꼴 Google Fonts(예: Silkscreen 제목 + IBM Plex Mono 본문).
2. 레이아웃: 왼쪽 무대(canvas + 말풍선/라벨 레이어 + HUD 시계·날씨·카운트 + 카메라 버튼 + 호버 정보), 오른쪽 패널. 휴대폰에서는 패널이 아래로.
3. 패널 섹션: 보기·시간(속도 Pause/1×/2×/4×/8×, 날씨 Auto/…, 시각 점프, 줌·픽셀 슬라이더, 오버레이/Raw 3D/Follow 체크) → 진짜 규칙 증거(장부·점수판) → 사람 카드(할 일·소지품) → 진행률 → 저장소 등 → "How it's drawn".
4. `<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js">` 하나, 나머지 인라인.

## 렌더링 (pixel-pipeline.js를 그대로 붙여 쓴다)
- OrthographicCamera, 고도 30°, 방위 45°+90°×rot. 회전은 angLerp로 부드럽게.
- 저해상도 WebGLRenderTarget(css크기 ÷ pix, Nearest) + DepthTexture(UnsignedIntType).
- 후처리: 이웃 깊이 차 > uThr(0.0018)면 0.45배로 어둡게(외곽선) → OKLab 최근접 64색.
- 카메라 위치를 저해상도 픽셀 격자에 스냅(안 하면 움직일 때 픽셀이 지글거림). Raw 3D면 스냅·후처리 생략.
- 월드 메시는 정점색 + 커스텀 ShaderMaterial(하늘빛·횃불빛·주변광 유니폼, 비 오면 어둡게, 번개 flash, 오버레이). 블록 종류별 텍셀 무늬는 셰이더에서 world pos 기반으로.
- 복셀이면: 청크(16) 단위 면 메싱 + AO, 바뀐 청크만 dirty 재생성.
- 사람·동물: 박스 리그(몸통·머리·팔다리 그룹), 다리·팔은 두 뼈 IK(코사인 법칙). 모자·도구로 역할 구분.

## 시뮬레이션 구조
- 고정 서브스텝: `n = min(16, ceil(rdt*speed/0.05))` 로 쪼개 simStep. 8배속에서도 안정.
- 행동은 **제너레이터 코루틴**: `function* jobX(v){ while(true){ yield; ... } }`, `yield* walkTo()`, `yield* wait(s)`.
  - **모든 while(true) 첫 줄에 `yield;`** — 안 넣으면 할 일이 없을 때 무한루프로 페이지가 얼어붙는다(실제로 겪음).
  - 실패로 return하는 경로도 return 전에 한 번 yield.
- 길찾기 A*: 이동 규칙(한 칸 오르기, 3칸까지 내려가기, 문 통과 규칙 종족별)과 maxIter 제한.
- 빛(해당하면): 하늘빛·블록빛을 BFS로 퍼뜨림(광원 15, 칸마다 −1). 바뀌면 관련 청크 dirty.
- 스폰 규칙은 빛/상태와 묶는다(예: max(블록빛, 하늘빛−11) ≤ 7인 곳에만). 후보 목록이 비면 건너뛰기(가드).
- 진짜 규칙의 증거(장부)는 **모든 출입 경로**를 센다: 시작량 + 생산(캐기·수확·제작) − 소비(설치·사용) = 보관 + 소지 + 바닥 아이템. 매 패널 갱신(0.25초)마다 양변을 계산해 표시하고 다르면 빨갛게.
- 하루 ≈ 4분, 속도 조절. 시간대별 하늘색·빛 세기 보간, 노을 따뜻한 색.

## 검증 훅 (필수)
```js
window.__sim = {
  setSpeed(n){...},            // 0,1,2,4,8
  jump(h){...},                // 6(아침), 18(노을), 21(밤)
  state(){ return { clock, actors: people.map(p=>p.name+': '+p.task), counts:{...} }; },
  invariants(){ return { ledgerBalanced: lhs===rhs, lhs, rhs, /* 주제별 추가 */ }; },
  fastForward(sec){ for(let t=0;t<sec;t+=0.05) simStep(0.05); },  // 화면 없이 시뮬만
  cam(mode){...}, share(on, aspect){...}, spectacle(on){...},      // 카메라·공유 모드·볼거리
};
```
전역 함수(`function cineUpdate` 등)는 녹화 샷 파일에서 `window.cineUpdate = ...`로 덮어써 카메라를 대본대로 움직일 수 있다. 그래서 카메라·업데이트 함수는 전역 function 선언으로 둔다.
```
```

## 함정 목록 (Hearthblock에서 실제로 고친 것)
- 코루틴 무한루프 → while(true) 첫 줄 yield.
- 죽은 개체 제거 시 말풍선·라벨·조명 목록(litObjs)에서도 같이 지우기, 제거 전 존재 확인.
- 지면 높이 계산이 잎·장식 블록을 땅으로 착각 → 무시할 블록 목록.
- 화면 드래그 이동은 카메라 오른쪽·위 벡터로 계산(회전 상태 고려).
- 빈 후보 목록에서 랜덤 뽑기(스폰·번개 위치) → 가드.
- 확률·체력 튜닝: 초기값은 대개 너무 쉽거나 너무 많다(묘목이 너무 많이 떨어짐 → 0.07, 좀비가 너무 빨리 죽음 → 체력 6). 8배속으로 하루를 돌려보고 조정.
- 헤드리스 콘솔의 "GPU stall due to ReadPixels" 경고는 무해.

## 함정 목록 (Marina GP에서 실제로 고친 것)
- 첫 rAF 타임스탬프가 `last`보다 작아 **dt가 음수** → 타이머가 거꾸로 감. `rdt = clamp((now-last)/1000, 0, 0.1)`.
- InstancedMesh는 기본 바운딩이 원점 근처라 **엉뚱하게 컬링**된다 → `frustumCulled=false`.
- 투명 건물(alpha)은 정렬이 깨지고 깜빡인다 → 디더링 discard(onBeforeCompile로 Bayer 4×4)로 페이드.
- 페이드는 "카메라→목표 광선이 박스와 만나면"인데, **먼 공중샷**에선 거의 모든 건물이 걸려 하얀 점무늬 덩어리(+블룸)가 된다 → 원근 카메라가 목표에서 90m 넘게 떨어지면 끈다.
- 주인공을 줌에 맞춰 키우면(carBoost) 어색하다 → 실제 치수 고정 + Follow 카메라 + 라벨.
- 원근(SHARE) 카메라에서 깊이 외곽선 계산은 선형 깊이로(uPersp, near/far 유니폼). 직교용 임계값을 그대로 쓰면 온통 외곽선.
- 그림자 카메라도 텍셀 격자에 스냅(안 하면 움직일 때 그림자가 지글거림). 크기는 화면 범위에 맞춰 16~260.
- 밤 조명 판이 벽 **뒤쪽 면**에 붙어 있으면 그쪽에서 볼 때 안 보인다 → 보는 쪽에 한 장 더.
- `setTimeout`으로 지연 효과(갈라지는 불꽃 등)를 걸면 녹화용 가짜 시계가 그것까지 돌려야 한다(record.mjs가 처리).
- 헤드리스 swiftshader는 초당 0.5~2장 → 타이밍 확인은 `__sim.fastForward(sec)`로 시뮬만 돌리고, 화면 확인만 스크린샷.

## 큰 파일 고치기
150KB가 넘으면 Edit보다 `scripts/patch.py`가 안전하다: 패치 파일에 `rep(옛, 새)`(정확히 1번 나와야 함) / `cut(시작, 끝, 새)`를 쓰고
`python3 scripts/patch.py page.html patch/eN.py`. 고치기 전 `page.vN.html`로 백업, 패치는 버전별로 남긴다.

## 오리지널 규칙
기존 게임 이름·고유 몹·공식 텍스처·로고 없음. 블록 종류·캐릭터 이름·UI 문구는 새로 짓는다. UI는 영어(프롬프트 원칙), 사용자 보고는 한국어.

## 완성 예제
`references/example-marina-gp.html`(약 160KB, 품질 기준 A~G가 다 들어간 최신 예제). grep할 곳: `function crewTargets`(단계별 정비사), `function cineUpdate`·`SHOTS`(SHARE 샷), `function fwLaunch`·`fwBurst`(불꽃), `ditherable`(페이드), `updateShadow`, `updateFx`(블룸·반사), `IX0`(섬 경계), `fill`/`addPeople`(채우기), `window.__sim`.

`references/example-hearthblock.html`(약 120KB, `window.__sim` 훅 포함). 통째로 읽지 말고 grep으로 필요한 부분만:
`function\* job` (사람 루틴), `function astar`, `computeLight`, `buildChunk`, `renderPanel`(장부), `function frame`, `poseHumanoid`(IK).
