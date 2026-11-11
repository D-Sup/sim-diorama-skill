# 프롬프트 레시피 (7덩어리)

## 영감: vib3coded "Deep End"
이 레시피는 [vib3coded](https://x.com/vib3coded)가 공개한 "Deep End"(떠 있는 섬 위 야외 수영장 디오라마) 프롬프트의 **구조**에서 출발했다. 원문은 원작자 글에서 직접 보고, 여기에는 옮기지 않는다.
그 프롬프트에서 배운 뼈대는 이것이다:
- 그림체를 아주 구체적으로 못 박는다(직교 아이소 카메라, 저해상도 렌더, 안티에일리어싱 없음, 깊이 외곽선, 고정 64색 팔레트).
- 핵심 하나를 "애니메이션이 아니라 진짜 계산"으로 정하고 공식과 숫자를 쓴다.
- 사람마다 할 일이 있고, 사소한 행동 1~2개로 살아 있는 느낌을 준다.
- 낮·노을·밤과 날씨가 화면과 규칙을 바꾼다.
- 클릭 반응, 설명 패널, "How it's drawn" 메모. 끝은 Original fictional content only.

## 7덩어리 (6덩어리 + ⑦ Showcase)
| # | 덩어리 | 역할 |
|---|---|---|
| ① | 그림체 | 픽셀아트의 정체. 문구를 거의 그대로 쓴다 |
| ② | 화면 조작 | 90° 회전, 줌, 픽셀 크기, Raw 3D |
| ③ | 무대 | 실제 크기가 붙은 소품 6~10개 |
| ④ | 진짜 규칙 하나 | 볼거리. "simulated, not animated" + 공식 + 화면 증거 |
| ⑤ | 살아 있는 요소 | 사람 루틴(서로 의존) + 사소한 행동 + 물/불/연기 |
| ⑥ | 상태 전환·UI | 낮/노을/밤, 날씨, 클릭 반응, 패널, "How it's drawn" |
| ⑦ | Showcase | quality-bar.md A~G: 실제 치수+Follow, 섬 경계+빽빽함, 사람 리그, 노을·블룸·물 반사·작업등, 중계식 UI, SHARE 모드(4:5·9:16), 볼거리 토글 |

## 템플릿
```
Build "[TITLE]": [place in one line, e.g. a night market on a floating island],
rendered as a real-time 3D scene in pixel art (three.js, orthographic
isometric camera rendering into a small low-res target, no anti-aliasing,
depth-buffer outlines, every pixel snapped to a fixed 64-colour palette
matched in OKLab; quarter-turn rotation, zoom, pixel-size slider,
Raw 3D toggle).

Scene: [6–10 props with real sizes/counts].

[CORE SYSTEM] is real, not decoration — [what is computed, with the
formula and numbers]. [How outcomes/scores are decided]. A live
[ledger / scoreboard / overlay] in the panel shows [values], and
[invariant] must always hold.

People: box-rig figures with two-bone IK and per-person inventories,
moving by A* pathfinding ([movement limits]).
- [Role]: [routine, and what they need from another role].
- ... (3–5 roles; at least one waits on another)
Small touches: [1–2 tiny behaviours].

Light, night and weather: day / dusk / night on a clock (one in-game day
≈ 4 minutes, with a speed control), [weather states]. [A rule that ties
light or weather to the core system, e.g. spawns only where light ≤ 7].
[What changes at night], [what rain changes].

Interaction: click [target] to [reaction], [a direct tool the viewer
can use], click a person to see their inventory and current task.

Showcase: [hero] at true scale ([sizes]) regardless of zoom; the
default camera follows [hero], with camera buttons for [landmarks].
The whole world is one island ([W] × [D] m) with sky around it, packed
so no bare ground shows: [landmarks], plus a fill pass of blocks, trees,
parked vehicles and people. Box-rig people with separate head, body,
arms and legs, varied clothing, cheering; [role] crews in [colour]
uniforms and helmets. Dusk paints the sky orange and purple with long
shadows; at night floodlights pool white and orange on the ground,
emissive windows and signs glow (bloom), water reflects the lights, and
a work lamp lights [key spot]. Buildings that hide [hero] fade out with
a dither. [Key event] plays in steps with slow-motion and a banner
naming each step. Broadcast-style UI: [list] on the left, [progress] on
top, [hero info + 1–2 buttons] at the bottom, everything else in a
menu. A SHARE mode hides the UI and cuts between cinematic camera shots
(chase, side, heli, trackside, low, [event] shot) in 16:9, 4:5 or 9:16.
A [SPECTACLE] button (and key [K]) sets off [spectacle] at any time,
always where the camera is looking.

Side panel (in the menu) with [ledger/scoreboard], each person's task,
[progress], clock, controls, and a short "How it's drawn" note.
Original fictional content only, no references to existing games,
English UI.
```

## 쓰기 체크리스트
- [ ] ④에 공식이 있다(나누기·곱하기·확률·보존법칙 중 하나 이상).
- [ ] ④의 결과가 **화면에서 검증된다**(장부 = 0, 점수식, 오버레이). 이게 "진짜 계산하네" 반응을 만든다.
- [ ] 사람 루틴끼리 사슬이 있다(만든다 → 옮긴다 → 쓴다, 부족하면 기다린다).
- [ ] 밤/날씨가 ④나 사람 행동을 바꾼다(그냥 색만 바뀌면 약하다).
- [ ] 크기·개수·확률이 숫자로 적혀 있다.
- [ ] 기존 게임·IP 이름·고유 캐릭터가 없다. 끝에 Original fictional content only.
- [ ] 사용자가 말한 항목이 하나도 빠지지 않았다(표로 대응 확인).
- [ ] ⑦ Showcase가 있다: 실제 치수·Follow, 섬 경계·채우기, 사람 리그, 노을·밤 빛(블룸·반사·작업등), 중계식 UI, SHARE 4:5·9:16, 볼거리 버튼.
- [ ] 사용자가 실제 장소를 말했으면 그 장소의 대표 구조물 5~8개를 (이름 바꿔) 다 넣었다.

## 예시: Hearthblock (사용자 요청: 마인크래프트 마을, 픽셀 아이소, 블록 캐고 놓기 계산, 나무꾼·상자정리·조련사·건축가·농부, 낮밤·날씨·밤 좀비)
```
Build "Hearthblock": a small village in a blocky voxel world on a floating
island of earth and stone, rendered as a real-time 3D scene in pixel art
(...①② 그대로...). The world is a true voxel grid of 1 m cubes (about
48 × 48 × 24) with original block types: grass, dirt, stone, gravel, sand,
oak log, leaves, planks, cobblestone, glass, farmland, water.

Scene: a cluster of plank-and-cobblestone cottages around a well, a small
oak forest on the west edge, a stream with a wooden bridge, a fenced wheat
and carrot field, a storage hut lined with chests, a crafting bench and
furnace, a half-built two-storey house with scaffolding, torches on posts
along the paths, and a dog kennel.

Blocks are real, not decoration — every block is mined and placed by
someone, and the totals always balance. Each block has a hardness;
break time = hardness ÷ tool speed (hand, wooden, stone axe/pick), shown
as 4 crack stages before it pops into a small spinning item that the
villager picks up. Felling a tree removes it log by log from the bottom,
then the leaves decay one by one and may drop a sapling that is
replanted and grows back over a few in-game days. Logs are carried to
the bench and turned into planks (1 log → 4 planks). The new house is
built from a blueprint, one block at a time, bottom layer first; a block
can only be placed if it touches an existing block and the builder has
it in their inventory — when they run out they walk to the chests, and
if the chests are empty they wait for the woodcutter. A live ledger in
the panel shows blocks mined, blocks placed, blocks in chests and
blueprint progress, and mined − placed − stored must always equal zero.

People: box-rig figures with two-bone IK and per-villager inventories,
moving by A* pathfinding on the voxel grid (step up 1 block, never 2,
no walking through blocks).
- Woodcutter: picks the nearest mature tree, chops it, hauls logs, turns
  them into planks, replants saplings.
- Builder: fetches materials, climbs the scaffolding, places blocks
  following the blueprint, steps back to look at the work now and then.
- Quartermaster: walks between chests sorting the mess by item type,
  so each chest's lid opens and you see its stack counts change.
- Farmer: tills dirt into farmland near water, sows seeds, crops grow
  through 4 visible stages, harvests ripe ones and resows.
- Dog trainer: offers bones to a stray dog; each bone has a 1-in-3
  chance to tame it (hearts on success, smoke puff on a miss); a tamed
  dog wears a collar, follows its owner, sits on command and growls at
  zombies.
Small touches: villagers chat in speech bubbles, yawn at dusk, eat bread
from their inventory, and drop crumbs the chickens peck at.

Light, night and weather: day / dusk / night on a clock (one in-game day
≈ 4 minutes, with a speed control), clear / rain / thunder. Light is
computed per block: sky light plus block light from torches spreading
outward and dropping by 1 per block (15 at the torch). At night zombies
spawn only on surface blocks with light level 7 or less, so dark corners
spawn them and torch-lit paths stay safe — show a light-level overlay
toggle to prove it. Villagers stop work at dusk, go inside and shut the
doors; zombies shamble toward the nearest villager, bang on doors, and
are chased off by tamed dogs. At sunrise zombies crumble into dust.
Rain darkens the blocks, puts out unsheltered torches and makes crops
grow faster; lightning lights the scene for a frame.

Interaction: click a block to mine it yourself, right-click to place
the block selected in a small hotbar, place torches to make safe zones,
click a villager to see their inventory and current task.

Side panel with the block ledger, each villager's task and inventory,
blueprint progress, day clock and zombie count, controls, and a short
"How it's drawn" note. Original fictional content only, no references
to existing games, English UI.
```
만들면서 장부식을 넓혔다: start + mined + harvested + crafted − placed − used = chests + carried + on ground.
프롬프트에 "mined − placed − stored = 0" 같은 단순식을 써도, 만들 때는 모든 출입을 넣은 완전한 식으로 구현한다.

## 예시 2: Twilight Marina GP (사용자 요청: 야스 마리나 F1, 20대 15랩, 타이어 3종·2종 의무, 피트 스톱 완벽 구현, 언더컷, 내 팀 조작, 노을→밤)
첫 판 프롬프트엔 ①~⑥만 있었고, 사용자가 4번 더 요청해서 아래 ⑦이 생겼다. 이제는 처음부터 넣는다.
```
Build "Twilight Marina GP": a night race on a fictional marina circuit,
(...①② 그대로...).
Scene: a 5.2 km street-style circuit with a pit straight, a hotel that
straddles the track with a colour-cycling lattice canopy, a pit building
with 10 garages, a main grandstand, a marina of moored yachts, a
red-roofed theme-park dome, palm-lined roads and car parks.
The race is simulated, not animated — lap time = base + tyre delta +
wear × laps + fuel − DRS; soft/medium/hard wear at different rates and
every car must use two compounds. A pit stop costs about 20 s (lane at
80 km/h + stationary time). Undercuts work because a fresh tyre is
faster than the gap. Standings, gaps and the pit log are live, and
each pit stop logs positions before and after.
People: a 20-person crew per team (front/rear jackmen, gun/off/on per
wheel, front-wing, lollipop) waiting with blanketed tyres...
Showcase: cars at true scale (5.6 × 2 m, track 12–15 m) ... (템플릿 ⑦
그대로, hero = my car, landmarks = Pit / Hotel / Marina / Park,
key event = the pit stop, spectacle = fireworks, key F).
```
완성본: `references/example-marina-gp.html`.
