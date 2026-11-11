# 제작 기록: Twilight Marina GP

야간 F1 레이스 디오라마를 만들며 **실제로 주고받은 요청과 프롬프트**를 옮긴 기록입니다. 요청은 맞춤법만 다듬었습니다.
첫 판부터 영상까지 다섯 번 고쳤고, 그 내용은 지금 스킬의 [`quality-bar.md`](../sim-diorama/references/quality-bar.md)에 들어가 있습니다.

완성본: [`example-marina-gp.html`](../sim-diorama/references/example-marina-gp.html) · 영상: 15초 웹뷰 8배속

---

## 1. 처음 요청

> 아부다비 야스 마리나 F1 경기장에서 가상의 10개 팀 20대 차량이 15랩 동안 실제 F1 룰에 따라 경주했으면 좋겠어. 타이어는 소프트·미디엄·하드 3종류로 랩이 지날수록 닳아서 느려지고, 경기 중 최소 2종류를 써야 해. 특히 피트 스톱이 완벽하게 구현됐으면 좋겠어. 차가 피트 레인으로 들어와 속도 제한에 맞춰 감속하고, 자기 팀 박스에 멈춰서 정비사들이 타이어를 교체한 뒤, 트랙 아래 터널로 이어지는 피트 출구를 지나 다시 레이스에 합류하는 과정까지 눈으로 보였으면 해. 피트 스톱은 한 번에 20초 정도 손해 보게 하고, 합류 후 순위가 실제로 바뀌어야 해. 팀마다 1스톱·2스톱 전략이 달라서 먼저 들어가 새 타이어로 앞차를 따라잡는 언더컷 같은 전략이 실제로 통했으면 좋겠어. 나는 한 팀을 맡아서 피트 타이밍과 타이어를 직접 고르고 싶고, 화면에는 순위·랩 수·타이어 상태가 보이고 배속 조절도 됐으면 해. 배경은 야스 호텔이 보이고 해 질 녘에서 밤으로 바뀌는 분위기면 좋겠어.

실제 상표(F1, 야스 마리나, 야스 호텔, 실제 팀)는 스킬이 오리지널 "Twilight Marina GP"와 가상의 팀으로 바꿨습니다.

## 2. 스킬이 짠 첫 프롬프트 (원문)

```text
Build "Twilight Marina GP": a fictional 5.281 km waterfront street-style circuit on a floating desert
island, with a marina full of yachts and a hotel whose two towers straddle the back section under a
glowing lattice canopy, rendered as a real-time 3D scene in pixel art (three.js, orthographic isometric
camera rendering into a small low-res target, no anti-aliasing, depth-buffer outlines, every pixel
snapped to a fixed 64-colour palette matched in OKLab; quarter-turn rotation, zoom, pixel-size slider,
Raw 3D toggle).

Scene: a 15 m wide track with red/white kerbs, a long main straight with a 5-light start gantry and
painted grid slots, a pit lane beside it with ten garages, a pit wall and a fast lane / working lane
split, a pit exit that dips into a tunnel under Turn 1 and rejoins behind a blend line, a stepped
grandstand with a crowd, 20 floodlight towers, palm trees, marshal posts, and the hotel bridge over the
back section.

The race is simulated, not animated — 10 fictional teams, 20 cars, 15 laps under real top-tier
open-wheel rules. Every car's speed at every metre comes from physics: corner speed
v = √(μg / (κ − μ·c_aero)) from the track curvature, power/drag-limited acceleration, and braking
envelopes. Lap pace = team + driver + tyre compound offset + wear (k·age + cliff·(age − life)²) + fuel
load + cold tyres, which is turned into grip and so into corner speeds. Soft / Medium / Hard tyres, at
least two compounds are mandatory (otherwise DSQ). Pit lane limit 80 km/h, the stop itself takes 2–3 s
(sometimes a slow wheel), the pit lane is calibrated to cost about 20.0 s in total, and each stop's
actual loss is measured and logged. Overtaking happens only on straights with slipstream and DRS (from
lap 3, within 1.0 s at the detection point), and dirty air makes following hard — so the undercut
(pitting first and gaining on fresh tyres) really works and is detected and logged as UNDERCUT ✓ /
failed. Cooler track at night lowers wear. Proof panel: pit loss target vs measured, max speed in the pit
lane, predicted vs measured lap time, the two-compound check, positions before → after each stop.

People: pit crews of 6 per team (4 wheel gunners, front and rear jack) walk out when their car is coming
in, jack the car up, swap the wheels (the old wheels go onto the floor, the new compound colour appears),
and release it on a green light only when the fast lane is clear (unsafe-release rule); a double stack
makes the second car wait. Marshals wave blue flags at lapped cars. Small touches: crew cheer after a
sub-2.3 s stop, the rear light blinks while the pit limiter is on, floor sparks fly on the straights at
night.

Light: 17:20 golden hour → sunset → floodlit night, tied to race progress, the hotel canopy cycling
colours.

Interaction: the player runs one team — starting tyre, BOX THIS LAP + next compound, push/normal/save,
engineer recommendation; speed 1–32×, auto slow-motion and an automatic camera for your own pit stops,
camera views (overview / pit / tunnel / hotel / follow), click a car to follow it. Side panel with timing
tower, team controls, strategy model, pit log, events, rule checks and "How it's drawn". Original
fictional content only, English UI.
```

## 3. 고친 과정 (요청 원문)

### 2판: 배경

> 전체 화면에서 차가 너무 작아. 차를 더 크게 보이게 하고, 기본 카메라가 내 차를 자동으로 따라가게 해줘. 그리고 배경 퀄리티가 너무 아쉬워. 건물도 거의 없고 꾸며진 게 없어서 아부다비 야스 마리나 느낌이 전혀 안 나. 트랙 위를 가로지르는 호텔 건물을 더 크고 눈에 띄게 만들고, 피트 건물과 메인 관중석, 관중, 요트가 정박한 마리나, 빨간 지붕의 대형 테마파크 건물, 야자수, 바다를 추가해줘. 밤이 되면 건물과 트랙 조명이 켜지면서 화려한 분위기가 났으면 좋겠어. 전체적으로 실제 서킷처럼 꽉 차 보이게 개선해줘.

### 3판: 크기 · 맵 · 피트 스톱

> **차 크기**: 지금 차가 너무 크고, 화면을 확대·축소할 때마다 크기가 바뀌는 게 어색해. 확대 배율과 상관없이 실제 비율로 고정해줘. 실제 F1 차는 길이 약 5.6m, 폭 약 2m이고 트랙 폭은 12~15m 정도니까 트랙에 차가 2~3대 나란히 들어갈 정도면 돼.
>
> **맵**: 하나의 섬 안에서 모든 일이 벌어지는 것처럼, 전체 맵 크기를 정해두고 그 경계 안에 서킷, 호텔, 마리나, 테마파크, 도로, 주차장을 배치해줘. 섬 밖은 하늘로 둘러싸이게 하고.
>
> **배경 밀도**: 에셋을 넣었다고 했는데 실제로 보면 비어 보여. 빈 땅이 보이지 않을 정도로 건물, 나무, 관중, 차량, 구조물을 빽빽하게 채워줘. 밤에는 땅 색이 갈색이라 어색하니까 아스팔트·잔디·모래가 구분되고 트랙 바닥에 조명이 비쳐 자연스럽게 보이게 해줘.
>
> **피트 스톱 디테일**: 지금은 너무 단순해. 실제처럼 정비사 20명 정도가 미리 대기하고, 차가 정해진 위치에 정확히 멈추면 앞뒤 잭맨이 차를 들어 올리고, 바퀴마다 3명(휠건, 헌 타이어 빼기, 새 타이어 끼우기)이 붙어 교체하고, 필요하면 앞날개 각도를 조정하고, 출발 신호등이 바뀌면 차가 나가는 과정이 단계별로 보였으면 해. 새 타이어에는 타이어 워머가 씌워져 있다가 벗겨지는 것도 넣어줘.
>
> **그 밖에**: 내 차가 지나갈 때 건물이 투명해지는 게 부드럽게 바뀌게 하고, 테마파크와 마리나를 비추는 카메라 버튼도 추가해줘.

### 4판: 완성도

> 이번엔 전체적인 완성도를 올려서 쓰레드에 올렸을 때 눈길을 끄는 수준으로 만들고 싶어.
>
> **사람**: 관중과 정비사가 덩어리로 보여. 머리·몸·팔다리가 구분되고, 옷 색이 다양하고, 응원하거나 움직이는 모습이 보였으면 해. 정비사는 팀 색 유니폼과 헬멧으로 한 명씩 구분되게 해줘.
>
> **조명**: 지금은 밋밋해. 해 질 녘에는 하늘이 주황·보라로 물들고 건물에 긴 그림자가 지고, 밤에는 조명탑 빛이 흰색·주황빛으로 바닥에 퍼지고 건물과 트랙 조명이 은은하게 번지는(글로우) 느낌이 났으면 해. 물에도 불빛이 반사되게 해줘.
>
> **그래픽**: 그림자, 반사, 질감 등 브라우저에서 무리 없이 돌아가는 선에서 최대한 고급스럽게 올려줘.
>
> **인터페이스**: 지금은 정보가 흩어져 있어. F1 중계 화면처럼 한 화면에 깔끔하게 정리해줘. 왼쪽에 순위표, 위쪽에 랩 수, 아래쪽에 내 차 정보와 피트 버튼 정도로 최소화하고, 나머지는 필요할 때만 열리게 해줘.
>
> **공유용 모드**: UI를 숨기고 시네마틱 카메라가 차를 따라가며 멋진 각도로 보여주는 모드를 추가해줘. 쓰레드에 올리기 좋게 세로(4:5 또는 9:16) 화면 비율로도 볼 수 있으면 좋겠어.

### 5판: 볼거리

> 불꽃 놀이를 계속 터뜨리게 할수도있게해줘

## 4. 영상

### 첫 요청

> 가장 고사양 설정에 맵의 전체 뷰를 자연스럽게 보여주면서도 차가 레이싱하면서 피트인하는 그런 장면까지 좀 자연스럽게 영상을 찍어줬으면 좋겠어. 그리고 불꽃놀이가 완주하면 터지는 게 아니라 애초부터 터져서 보는 임팩트가 좋게끔 해주면 좋겠네.

공중을 도는 영화식 카메라로 먼저 찍었는데, 원한 느낌이 아니었습니다.

### 다시 찍기

> 나는 저런 연출을 원한 게 아니라 그냥 웹뷰 같은 걸 보여주면서 전체 맵이랑 차들이 경주하는 모습과 피트인 하는 모습을 보여주고, 다시 전체 맵을 보여주면서 자연스럽게 마치는 영상을 원한 거야. 속도는 x8 배속으로 해가지고 최대한 자연스럽게 말이야.

웹 화면 그대로 8배속으로 바꿨습니다. 전체 맵 → 내 차로 줌인 → 피트인 순간만 1배속 → 다시 전체 맵 순서입니다. 같은 시드로 한 번 돌려 피트인 시각을 재고, 그 몇 초 전부터 찍었습니다.

### 마지막 수정

> 자동차에 포커싱될 때 불꽃놀이가 작아지면서 자동차만 보이는데 불꽃놀이가 보이는 게 말이 안 되잖아? 그래서 이 부분을 고려해서 다시 촬영해야 할 것 같아.

불꽃을 카메라 앞이 아니라 섬 뒤 하늘의 고정된 자리에서 실제 크기로 터지게 바꿨습니다. 그래서 줌인하면 불꽃은 화면 밖에 있고, 대신 터질 때마다 장면 전체가 그 색으로 잠깐 물듭니다. 22초판과 15초판 두 개로 마무리했습니다.

---

## 이 기록에서 스킬로 옮긴 것

| 고친 요청 | 지금 스킬의 첫 판 기본값 |
|---|---|
| 차가 너무 작음 / 확대마다 크기 바뀜 | 주인공은 실제 크기로 고정하고 기본 카메라가 따라감 |
| 건물이 없음 / 빈 땅이 보임 | 섬 하나를 세계 전체로 정하고, 명소 5~8개를 놓은 뒤 남은 땅을 채움 |
| 사람이 덩어리로 보임 | 머리·몸·팔다리 리그, 옷 색 다양화, 역할별 유니폼 |
| 피트 스톱이 단순함 | 핵심 장면은 사람별 역할과 단계로 쪼개고 배너로 단계를 보여 줌 |
| 밋밋함 | 노을 그림자, 밤 조명 풀, 빛 번짐, 물 반사, 작업등 |
| 정보가 흩어짐 | 중계 화면식 최소 UI, 나머지는 메뉴 안으로 |
| 쓰레드용 | SHARE 모드 4:5 · 9:16 |
| 불꽃을 계속 | 볼거리 버튼은 아무 때나, 세계에 고정된 자리에서 실제 크기로 |
| 영상 연출 | 웹 화면 그대로 8배속: 전체 → 주인공 → 핵심 장면 1배속 → 전체 |
