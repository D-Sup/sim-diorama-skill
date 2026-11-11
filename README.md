# sim-diorama

**"진짜 규칙으로 돌아가는 작은 3D 세계"를 HTML 한 장으로 만들어 주는 Claude Code 스킬**

![Hollowmere — 움직이는 계단이 있는 마법 성](media/hollowmere.gif)

"해리포터 계단처럼 움직이는 계단이 있는 성 만들어줘" 한 줄로 시작해서 위 영상이 나왔어요.
계단은 정해진 애니메이션이 아니라 무게와 회전 힘으로 계산돼서 돌아가고,
사람들은 지금 이어진 계단만 골라 길을 찾아다닙니다.

## 무엇을 해 주나요

1. **먼저 물어봐요**: 참고할 사진·영상이 있는지, 가장 진짜 같아야 할 움직임이 뭔지, 처음 화면은 어떻게 보이면 좋을지, 어디에 쓸지(웹/쇼츠). 비어 있는 것만 최대 4개 묻습니다.
2. **참고 자료가 있으면 구조부터 확인해요**: 영상을 1초에 2장씩 뽑아 보고 "반복되는 단위가 이거 맞죠?"를 먼저 확인합니다. 결과가 어긋나는 가장 큰 이유를 여기서 막아요.
3. **영어 프롬프트를 짜서 보여 줘요**: 7덩어리 구조(그림체 · 조작 · 무대 · 진짜 규칙 · 사람 · 낮밤/날씨 · 볼거리).
4. **그 프롬프트대로 직접 만들어요**: three.js, 픽셀아트 아이소메트릭, HTML 파일 한 장.
5. **헤드리스 브라우저로 검증해요**: 낮 → 8배속 → 밤 스크린샷과 규칙 검사(장부가 맞는지 등), 콘솔 에러 확인.
6. **원하면 쇼츠 영상까지**: 가짜 시계로 한 프레임씩 찍어서 느린 컴퓨터에서도 끊김 없는 30fps 영상.

기존 작품 이름(해리포터, 마인크래프트 등)을 말해도 이름·캐릭터·로고는 빼고 느낌만 살린 오리지널로 바꿔 만듭니다.

## 예시

| | |
|---|---|
| ![Hearthblock](media/hearthblock.png) | **Hearthblock**: 떠 있는 섬 위 블록 마을. 캐고 놓은 블록 수가 장부에서 항상 0으로 맞아떨어지고, 밤에는 어두운 곳에만 좀비가 나와요. 완성본: [`example-hearthblock.html`](sim-diorama/references/example-hearthblock.html) |
| ![Hollowmere](media/hollowmere.gif) | **Hollowmere**: 움직이는 계단이 있는 마법 성. 완성 프롬프트(한글): [`examples/hollowmere-prompt-ko.md`](examples/hollowmere-prompt-ko.md) |

F1식 야간 레이스 **Twilight Marina GP**의 완성본도 들어 있어요: [`example-marina-gp.html`](sim-diorama/references/example-marina-gp.html). 다운로드해서 브라우저로 열면 바로 돌아갑니다.

## 설치

```bash
git clone https://github.com/D-Sup/sim-diorama-skill.git
cp -r sim-diorama-skill/sim-diorama ~/.claude/skills/
```

검증·영상 기능까지 쓰려면 한 번만 설치하세요(선택). 영상은 [ffmpeg](https://ffmpeg.org/)도 필요해요.

```bash
cd ~/.claude/skills/sim-diorama
npm install
npx playwright install chromium
```

## 쓰는 법

Claude Code에서 그냥 말하면 됩니다.

```
움직이는 계단이 있는 성 디오라마 만들어줘
비 오는 밤 야시장 작은 세계 만들어줘. 포장마차마다 손님 줄이 진짜로 계산되게
이 영상처럼 생긴 구조로 만들어줘 (영상 첨부)
프롬프트만 짜줘
쇼츠용 9:16 영상으로도 찍어줘
```

결과가 머릿속 그림과 다르면 "구조가 달라", "움직임이 이상해", "너무 밋밋해"처럼 **어느 축이 다른지**만 말해 주세요. 그 부분만 고칩니다.

## 폴더 구성

```
sim-diorama/
├── SKILL.md                    # 전체 흐름 (물어보기 → 구조 확인 → 프롬프트 → 만들기 → 검증 → 영상)
├── references/
│   ├── prompt-recipe.md        # 7덩어리 프롬프트 템플릿, 체크리스트, 예시
│   ├── quality-bar.md          # 첫 판부터 넣는 품질 기준 (크기·밀도·빛·UI·공유 모드)
│   ├── build-playbook.md       # 렌더 방식, 시뮬 구조, 실제로 겪은 함정 목록
│   ├── pixel-pipeline.js       # 픽셀아트 후처리 (외곽선 + 64색 팔레트)
│   ├── example-*.html          # 완성작 원본
│   └── example-*-shot.mjs      # 영상 연출 예시
└── scripts/
    ├── verify.mjs              # 헤드리스 검증
    ├── record.mjs              # 프레임 단위 영상 녹화
    └── patch.py                # 큰 HTML 안전하게 고치기
```

## 크레딧

프롬프트 구조는 [vib3coded](https://x.com/vib3coded)의 "Deep End" 디오라마 프롬프트에서 영감을 받았어요.

## 라이선스

MIT

---

**English:** A Claude Code skill that builds a tiny "world that runs on real rules" (pixel-art isometric diorama, a genuinely simulated system, people with interlocking routines, day/night and weather) as a single HTML file. It asks a few questions first, confirms the structure from your reference images/videos, writes a 7-part prompt, builds it, verifies it headlessly, and can record a smooth 30 fps short. Install with `cp -r sim-diorama ~/.claude/skills/`. The skill instructions are in Korean, but it works with requests in any language.
