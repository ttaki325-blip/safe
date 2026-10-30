/* =========================================================
   SAFE CRACKER · 공용 설정 + 데이터 + 실시간 동기화
   선생님이 고칠 곳은 ① 설정 ② 대답 보드 ③ 활동 ④ 금고 네 군데뿐이에요.
   ========================================================= */

/* ① 설정 ------------------------------------------------- */
const SC_CONFIG = {
  // Firebase Realtime Database 주소 (끝에 / 없이). 비워 두면 '로컬 테스트 모드'(한 기기 안에서만 동작)
  DB_URL: "https://ninja-game-56862-default-rtdb.firebaseio.com",
  DB_ROOT: "safecracker",          // DB 안에서 이 게임이 쓰는 폴더 이름
  CLASSES: [7, 8, 9, 10, 11, 12, 13], // 현황판·앱에 나오는 반
  GRADE: 6,
  MAX_TEAMS: 15,
  WRONG_COOLDOWN_SEC: 3,           // 틀렸을 때 다시 입력하기까지 기다리는 시간
  ALARM_TRIES: 3,                  // 같은 금고를 이만큼 틀리면 경보
  ALARM_SEC: 30,                   // 경보가 울리면 이만큼 잠김
  ROUND_SEC_OPTIONS: [90, 120, 150, 180], // 라운드 길이(초) 선택지
  ROUND_SEC_DEFAULT: 120,
  SWITCH_WARN_SEC: 10              // 교대 몇 초 전부터 "곧 교대!" 알림
};

/* ①-2 점수 규칙 ------------------------------------------ */
const SC_SCORE = {
  BASE: 100,            // 금고 하나 열 때마다
  PERFECT: 50,          // 그 금고를 한 번에(오답 없이) 열면
  FIRST: [50, 30, 10],  // 그 금고를 반에서 1등·2등·3등으로 연 팀 보너스
  RULE: [100, 60, 30],  // 암호 규칙을 반에서 1·2·3번째로 찾은 팀(첫 금고를 연 팀) 보너스
  TREASURE: [           // 금고 안 보물 (무작위)
    { icon: "🪙", name: "금화",     pts: 10, w: 40 },
    { icon: "💵", name: "돈다발",   pts: 20, w: 30 },
    { icon: "💍", name: "반지",     pts: 30, w: 20 },
    { icon: "💎", name: "다이아몬드", pts: 50, w: 10 }
  ]
};

/* ② 대답 보드 1~9 (번호 = 코드 숫자) ---------------------
   good: true  → 반응 "Good for you!"
   good: false → 반응 "You should ___ more often."           */
const SC_ANSWERS = [
  null,
  { en: "Every day",          good: true  },  // 1
  { en: "Five times a week",  good: true  },  // 2
  { en: "Four times a week",  good: true  },  // 3
  { en: "Three times a week", good: true  },  // 4
  { en: "Twice a week",       good: true  },  // 5
  { en: "Once a week",        good: true  },  // 6
  { en: "Twice a month",      good: false },  // 7
  { en: "Once a month",       good: false },  // 8
  { en: "Never",              good: false }   // 9
];

/* ②-2 추리 힌트: 대답 보드 번호별로, 정답을 직접 말하지 않는 표현 ----
   "I + (활동) + 힌트." 로 문장이 만들어져요. 여러 개 적으면 금고마다 돌아가며 써요.
   9번(Never)은 "I don't + (활동) + 힌트." */
const SC_CLUES = [
  null,
  ["from Monday to Sunday", "on all seven days of the week"],                         // 1 Every day
  ["from Monday to Friday", "on weekdays, but not on weekends"],                      // 2 Five times a week
  ["on Monday, Tuesday, Thursday, and Saturday", "on Sunday, Monday, Wednesday, and Friday",
   "on Tuesday, Wednesday, Friday, and Sunday"],                                      // 3 Four times a week
  ["on Monday, Wednesday, and Friday", "on Tuesday, Thursday, and Saturday",
   "on Monday, Thursday, and Sunday"],                                                // 4 Three times a week
  ["on Tuesday and Friday", "on Monday and Thursday", "on Wednesday and Saturday"],   // 5 Twice a week
  ["only on Saturday", "only on Sunday", "only on Wednesday"],                        // 6 Once a week
  ["on the 1st and the 15th of every month", "on the 5th and the 20th of every month",
   "on the 10th and the 25th of every month"],                                        // 7 Twice a month
  ["on the last Sunday of every month", "on the first Saturday of every month",
   "only on the 3rd of every month"],                                                 // 8 Once a month
  ["at all", "at all. I don't like it"]                                               // 9 Never
];

/* ②-3 규칙 힌트: 현황판에서 선생님이 한 단계씩 공개 ----------------- */
const SC_RULE_HINTS = [
  null,
  "암호는 대답 카드 4장을 어떤 순서로 늘어놓는 거예요.",
  "들은 대답(빈도)을 서로 비교해 보세요. 무엇의 순서일까요?",
  "가장 자주 하는 것 → 가장 덜 하는 것 순서예요!"
];

/* ③ 활동 목록: [질문용(your), 대답용(my)] ------------------ */
const SC_ACTIVITIES = [
  ["exercise", "exercise"],                         // 0
  ["read books", "read books"],                     // 1
  ["eat vegetables", "eat vegetables"],             // 2
  ["clean your room", "clean my room"],             // 3
  ["help your parents", "help my parents"],         // 4
  ["drink milk", "drink milk"],                     // 5
  ["ride a bike", "ride a bike"],                   // 6
  ["go swimming", "go swimming"],                   // 7
  ["play soccer", "play soccer"],                   // 8
  ["walk your dog", "walk my dog"],                 // 9
  ["wash your hands", "wash my hands"],             // 10
  ["brush your teeth", "brush my teeth"],           // 11
  ["go to the library", "go to the library"],       // 12
  ["eat breakfast", "eat breakfast"],               // 13
  ["water the plants", "water the plants"],         // 14
  ["take a shower", "take a shower"],               // 15
  ["practice the piano", "practice the piano"],     // 16
  ["visit your grandparents", "visit my grandparents"], // 17
  ["do your homework", "do my homework"],           // 18
  ["go to bed early", "go to bed early"]            // 19
];

/* ④ 금고 15개: 질문 4개(활동 번호) + 대답(대답 보드 번호 4개, 서로 달라야 해요) -----
   암호는 자동으로 정해져요: 가장 자주 하는 질문 번호 → 가장 덜 하는 질문 번호 순서.
   예) ans "5183" → Q2(1 Every day) Q4(3) Q1(5) Q3(8) → 암호 2413
   대답을 바꾸면 비밀 카드·정답표·암호가 모두 같이 바뀌니, 다시 인쇄만 하면 돼요. */
const SC_SAFES = [
  null,
  { acts: [5, 15, 4, 1], ans: "5314" }, // 1  → 암호 3241
  { acts: [0, 14, 10, 18], ans: "4715" }, // 2  → 암호 3142
  { acts: [11, 3, 12, 19], ans: "1894" }, // 3  → 암호 1423
  { acts: [7, 2, 9, 13], ans: "8319" }, // 4  → 암호 3214
  { acts: [15, 4, 8, 16], ans: "3671" }, // 5  → 암호 4123
  { acts: [10, 14, 2, 6], ans: "1394" }, // 6  → 암호 1243
  { acts: [16, 17, 0, 3], ans: "9734" }, // 7  → 암호 3421
  { acts: [9, 17, 5, 11], ans: "4751" }, // 8  → 암호 4132
  { acts: [13, 9, 18, 19], ans: "9452" }, // 9  → 암호 4231
  { acts: [3, 1, 15, 11], ans: "6541" }, // 10  → 암호 4321
  { acts: [10, 12, 7, 4], ans: "1965" }, // 11  → 암호 1432
  { acts: [6, 5, 0, 2], ans: "5913" }, // 12  → 암호 3412
  { acts: [8, 13, 6, 7], ans: "7248" }, // 13  → 암호 2314
  { acts: [8, 13, 1, 17], ans: "4957" }, // 14  → 암호 1342
  { acts: [18, 16, 9, 5], ans: "4529" }  // 15  → 암호 3124
];

/* ---------- 문장 도우미 ---------- */
const SC = {
  question(act) { return `How often do you ${SC_ACTIVITIES[act][0]}?`; },
  answerSentence(act, n) {
    const my = SC_ACTIVITIES[act][1], a = SC_ANSWERS[n];
    if (a.en === "Never") return `I never ${my}.`;
    return `I ${my} ${a.en.toLowerCase()}.`;
  },
  /* 추리 힌트 문장 (금고·질문 번호로 변형을 골라 반마다 같은 카드가 나오게) */
  clueSentence(act, n, safe = 0, q = 0) {
    const my = SC_ACTIVITIES[act][1], list = SC_CLUES[n] || [""];
    const c = list[(safe * 3 + q) % list.length];
    return n === 9 ? `I don't ${my} ${c}.` : `I ${my} ${c}.`;
  },
  /* 공격 팀이 추리해서 말할 문장 */
  guessLine(n) { return `${SC_ANSWERS[n].en}?`; },
  reaction(act, n) {
    return SC_ANSWERS[n].good ? "Good for you!" : `You should ${SC_ACTIVITIES[act][0]} more often.`;
  },
  safe(n) { return SC_SAFES[n]; },
  /* 암호 규칙: 질문 번호를 '자주 하는 것 → 덜 하는 것' 순서로 (대답 보드 번호가 작을수록 자주) */
  codeOf(n) { const a = SC_SAFES[n].ans; return [0, 1, 2, 3].sort((i, j) => a[i] - a[j]).map(i => i + 1).join(""); },
  ansOf(n, q) { return +SC_SAFES[n].ans[q]; },
  teams() { return Array.from({ length: SC_CONFIG.MAX_TEAMS }, (_, i) => i + 1); },
  activeTeams(cls) {
    const empty = (cls && cls.empty) || {};
    return SC.teams().filter(t => !empty[t]);
  },
  openedOf(cls, t) {
    const o = cls && cls.teams && cls.teams[t] && cls.teams[t].opened;
    return o ? Object.keys(o).map(Number) : [];
  },
  /* 팀 t가 열어야 할 금고 = 활성 팀 중 자기 빼고 */
  targetsOf(cls, t) { return SC.activeTeams(cls).filter(s => s !== t); },
  progressOf(cls, t) {
    const targets = SC.targetsOf(cls, t);
    const opened = SC.openedOf(cls, t).filter(s => targets.includes(s));
    return { done: opened.length, total: targets.length };
  },
  /* 기록 한 건: {ts, pts, ...} (예전 형식인 숫자도 허용) */
  rec(v) { return (v && typeof v === "object") ? v : { ts: v || 0, pts: SC_SCORE.BASE }; },
  scoreOf(cls, t) {
    const o = cls && cls.teams && cls.teams[t] && cls.teams[t].opened;
    return o ? Object.values(o).reduce((sum, v) => sum + (SC.rec(v).pts || 0), 0) : 0;
  },
  /* 금고 s를 이미 연 팀 수 (나 빼고) */
  openersOf(cls, s, except) {
    return SC.activeTeams(cls).filter(t => t !== except && SC.openedOf(cls, t).includes(s)).length;
  },
  /* 순위: 점수 → 연 금고 수 → 마지막으로 연 시각이 빠른 팀 */
  ranking(cls) {
    return SC.activeTeams(cls).map(t => {
      const o = (cls && cls.teams && cls.teams[t] && cls.teams[t].opened) || {};
      const last = Math.max(0, ...Object.values(o).map(v => SC.rec(v).ts || 0));
      return { t, score: SC.scoreOf(cls, t), done: SC.progressOf(cls, t).done, last };
    }).sort((a, b) => b.score - a.score || b.done - a.done || (a.last || Infinity) - (b.last || Infinity))
      .map((r, i, arr) => { r.rank = (i && arr[i-1].score === r.score) ? arr[i-1].rank : i + 1; return r; });
  },
  rollTreasure() {
    const total = SC_SCORE.TREASURE.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    for (const x of SC_SCORE.TREASURE) { if ((r -= x.w) < 0) return x; }
    return SC_SCORE.TREASURE[0];
  },
  /* 금고를 열 때 점수 계산 */
  scoreOpen(cls, me, safe, wrongTries) {
    const lines = [{ label: "금고 열기", pts: SC_SCORE.BASE }];
    if (!SC.openedOf(cls, me).length) {                     // 우리 팀 첫 금고 = 규칙 발견!
      const found = SC.activeTeams(cls).filter(t => t !== me && SC.openedOf(cls, t).length).length;
      if (found < SC_SCORE.RULE.length) lines.push({ label: `🧠 규칙 발견 ${found + 1}등`, pts: SC_SCORE.RULE[found] });
    }
    if (!wrongTries) lines.push({ label: "퍼펙트 (한 번에 성공)", pts: SC_SCORE.PERFECT });
    const order = SC.openersOf(cls, safe, me);
    if (order < SC_SCORE.FIRST.length) lines.push({ label: `선착순 ${order + 1}등`, pts: SC_SCORE.FIRST[order] });
    const tr = SC.rollTreasure();
    lines.push({ label: `보물 ${tr.icon} ${tr.name}`, pts: tr.pts });
    return { lines, pts: lines.reduce((s, l) => s + l.pts, 0), treasure: tr.icon };
  },
  /* ---------- 공격/수비 라운드 ----------
     팀 번호를 2진수로 보고, 자리(비트)마다 "1인 팀 공격 / 0인 팀 공격"을 한 번씩.
     번호가 다른 두 팀은 적어도 한 자리가 다르므로, 한 바퀴(최대 8라운드) 안에
     모든 팀이 서로를 공격할 기회를 한 번 이상 가져요. */
  schedule(cls) {
    const act = SC.activeTeams(cls), out = [];
    const bits = Math.ceil(Math.log2(SC_CONFIG.MAX_TEAMS + 1));
    for (let b = 0; b < bits; b++) for (const v of [1, 0]) {
      const atk = act.filter(t => ((t >> b) & 1) === v);
      if (atk.length && atk.length < act.length) out.push(atk);
    }
    return out;
  },
  roundEnd(cls) {
    const g = cls && cls.timer;
    return g && g.startAt ? g.startAt + g.rounds * g.roundSec * 1000 : null;
  },
  /* 지금 라운드 상태 */
  round(cls, now = SCDB.now()) {
    const g = cls && cls.timer;
    if (!g || !g.startAt) return { phase: "wait" };
    const len = g.roundSec * 1000, el = now - g.startAt;
    if (el < 0) return { phase: "wait" };
    const idx = Math.floor(el / len);
    if (idx >= g.rounds) return { phase: "over", total: g.rounds };
    const sch = SC.schedule(cls);
    if (!sch.length) return { phase: "wait" };
    const atk = new Set(sch[idx % sch.length]);
    const nextAtk = idx + 1 < g.rounds ? new Set(sch[(idx + 1) % sch.length]) : null;
    return { phase: "play", idx, total: g.rounds, cycle: sch.length, attackers: atk, nextAttackers: nextAtk,
             roundLeft: len - (el % len), totalLeft: g.rounds * len - el };
  },
  role(r, t) { return r.phase !== "play" ? null : r.attackers.has(t) ? "attack" : "defend"; },
  timeLeft(cls) { const e = SC.roundEnd(cls); return e === null ? null : e - SCDB.now(); },
  mmss(ms) { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
};

/* =========================================================
   실시간 동기화 (Firebase REST + 스트리밍 / 또는 로컬 테스트 모드)
   ========================================================= */
const SCDB = (() => {
  const remote = !!SC_CONFIG.DB_URL;
  const LKEY = "sc_local_db";

  const pathFor = (c, rest = "") => `${SC_CONFIG.DB_ROOT}/class${c}${rest ? "/" + rest : ""}`;

  function setIn(tree, path, value) {
    const keys = path.split("/").filter(Boolean);
    if (!keys.length) return value;
    tree = (tree && typeof tree === "object") ? tree : {};
    let node = tree;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!node[keys[i]] || typeof node[keys[i]] !== "object") node[keys[i]] = {};
      node = node[keys[i]];
    }
    const last = keys[keys.length - 1];
    if (value === null) delete node[last]; else node[last] = value;
    return tree;
  }

  /* ---- 로컬 모드 ---- */
  const local = {
    read() { try { return JSON.parse(localStorage.getItem(LKEY) || "{}"); } catch { return {}; } },
    write(t) { try { localStorage.setItem(LKEY, JSON.stringify(t)); } catch {} window.dispatchEvent(new Event("sc-local")); },
    get(path) { return path.split("/").filter(Boolean).reduce((n, k) => (n == null ? null : n[k] ?? null), local.read()); }
  };

  async function put(path, value) {
    if (!remote) {
      const fix = v => (v && typeof v === "object")
        ? (v[".sv"] === "timestamp" ? Date.now() : Object.fromEntries(Object.entries(v).filter(([, x]) => x != null).map(([k, x]) => [k, fix(x)])))
        : v;
      value = fix(value);
    }
    if (remote) {
      const r = await fetch(`${SC_CONFIG.DB_URL}/${path}.json`, { method: "PUT", body: JSON.stringify(value) });
      if (!r.ok) throw new Error("DB 쓰기 실패 " + r.status);
    } else {
      local.write(setIn(local.read(), path, value));
    }
  }

  /* 반 하나를 구독: callback(classData)를 변화가 있을 때마다 호출 */
  function watchClass(c, callback, onStatus = () => {}) {
    const path = pathFor(c);
    let tree = null, es = null, closed = false, retry = 0;

    if (!remote) {
      const fire = () => callback(local.get(path) || {});
      window.addEventListener("storage", fire);
      window.addEventListener("sc-local", fire);
      onStatus("local"); fire();
      return () => { window.removeEventListener("storage", fire); window.removeEventListener("sc-local", fire); };
    }

    const open = () => {
      if (closed) return;
      es = new EventSource(`${SC_CONFIG.DB_URL}/${path}.json`);
      const apply = (ev, patch) => {
        const msg = JSON.parse(ev.data);
        if (patch) Object.entries(msg.data || {}).forEach(([k, v]) => { tree = setIn(tree, (msg.path + "/" + k), v); });
        else tree = setIn(tree, msg.path, msg.data);
        retry = 0; onStatus("online");
        callback(tree || {});
      };
      es.addEventListener("put", e => apply(e, false));
      es.addEventListener("patch", e => apply(e, true));
      es.addEventListener("cancel", () => onStatus("denied"));
      es.addEventListener("auth_revoked", () => onStatus("denied"));
      es.onerror = () => {
        es.close();
        // 왜 끊겼는지 확인: 권한(401/403)이면 "DB 권한 없음", 아니면 와이파이·주소 문제
        fetch(`${SC_CONFIG.DB_URL}/${path}.json?shallow=true`)
          .then(r => onStatus(r.status === 401 || r.status === 403 ? "denied" : "offline"))
          .catch(() => onStatus("offline"));
        setTimeout(open, Math.min(1000 * 2 ** retry++, 10000));
      };
    };
    open();
    return () => { closed = true; es && es.close(); };
  }

  /* 기기마다 시계가 조금씩 달라서, 서버 시각과의 차이를 한 번 재 둬요 */
  let offset = 0;
  if (remote) (async () => {
    try {
      const p = `${SC_CONFIG.DB_URL}/${SC_CONFIG.DB_ROOT}/_clock/${Math.random().toString(36).slice(2)}.json`;
      const t0 = Date.now();
      const r = await fetch(p, { method: "PUT", body: JSON.stringify({ ".sv": "timestamp" }) });
      const server = await r.json(), t1 = Date.now();
      if (typeof server === "number") offset = server - (t0 + t1) / 2;
      fetch(p, { method: "DELETE" }).catch(() => {});
    } catch {}
  })();

  return {
    remote,
    now: () => Date.now() + offset,
    markOpened: (c, team, safe, info) => put(pathFor(c, `teams/${team}/opened/${safe}`), { ...info, ts: { ".sv": "timestamp" } }),
    setAlarm: (c, team, until) => put(pathFor(c, `teams/${team}/alarm`), until || null),
    startRounds: (c, roundSec, rounds) => put(pathFor(c, "timer"), { startAt: { ".sv": "timestamp" }, roundSec, rounds }),
    stopRounds: c => put(pathFor(c, "timer"), null),
    setHint: (c, level) => put(pathFor(c, "hint"), level || null),
    setEmpty: (c, team, isEmpty) => put(pathFor(c, `empty/${team}`), isEmpty ? true : null),
    setEmptyAll: (c, emptyObj) => put(pathFor(c, "empty"), Object.keys(emptyObj).length ? emptyObj : null),
    resetClass: (c, keepEmpty) => put(pathFor(c), { empty: keepEmpty || null, resetAt: { ".sv": "timestamp" } }),
    watchClass
  };
})();
