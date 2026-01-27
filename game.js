// Street to Stability - Apartment Tier, Side Gig Cooking, Computer, Recreation, Lottery Scratch
// with burnout + weekly work tracking + mobile layout HUD

// --- DOM HOOKS ---
const dayDisplay = document.getElementById("dayDisplay");
const weekdayDisplay = document.getElementById("weekdayDisplay");
const segmentDisplay = document.getElementById("segmentDisplay");
const statusDisplay = document.getElementById("statusDisplay");
const segmentSub = document.getElementById("segmentSub");

const moneyDisplay = document.getElementById("moneyDisplay");
const saveBtn = document.getElementById("saveBtn");
const hungerBar = document.getElementById("hungerBar");
const energyBar = document.getElementById("energyBar");
const hygieneBar = document.getElementById("hygieneBar");
const hopeBar = document.getElementById("hopeBar");
const hungerValue = document.getElementById("hungerValue");
const energyValue = document.getElementById("energyValue");
const hygieneValue = document.getElementById("hygieneValue");
const hopeValue = document.getElementById("hopeValue");

const weVal = document.getElementById("weVal");
const intVal = document.getElementById("intVal");
const charmVal = document.getElementById("charmVal");
const fitVal = document.getElementById("fitVal");

const actionsGrid = document.getElementById("actionsGrid");
const logEl = document.getElementById("log");
const bannerContainer = document.getElementById("bannerContainer");
const rentStatusEl = document.getElementById("rentStatus");
const hungerRow = document.getElementById("hungerRow");
const sceneBg = document.getElementById("sceneBackground");
const overlayPanel = document.getElementById("overlayPanel");
const overlayContent = document.getElementById("overlayContent");

// Title screen
const titleScreen = document.getElementById("titleScreen");
const gameShell = document.getElementById("gameShell");

// Character panel
const characterPanel = document.getElementById("characterPanel");
const characterSprite = document.getElementById("characterSprite");


// Collapsible log (console)
const logCard = document.getElementById("logCard");
const logToggle = document.getElementById("logToggle");

// Ensure collapsible-log helpers exist (some bundles omitted them).
// If these are missing, the script can crash on load, causing the UI (buttons) to never render.
let logIsCollapsed = false;

function setLogCollapsed(collapsed) {
  logIsCollapsed = !!collapsed;
  if (!logCard) return;
  if (logIsCollapsed) {
    logCard.classList.add("collapsed");
  } else {
    logCard.classList.remove("collapsed");
  }
  if (logToggle) {
    logToggle.textContent = logIsCollapsed ? "Show Log" : "Hide Log";
    logToggle.setAttribute("aria-expanded", String(!logIsCollapsed));
  }
}

if (logToggle) {
  logToggle.addEventListener("click", () => {
    setLogCollapsed(!logIsCollapsed);
  });
}

// --- TOOLTIP SYSTEM (MOBILE-FRIENDLY) ---
// --- TOOLTIP TOAST (mobile-friendly) ---
// Tooltips are opened via the small "i" icon on each action button.
// Actions execute immediately on tap/click.
const tooltipToast = document.createElement("div");
tooltipToast.id = "tooltipToast";
tooltipToast.className = "tooltip-toast hidden";
tooltipToast.innerHTML = `
  <div class="tooltip-text" id="tooltipText"></div>
  <div class="tooltip-hint" id="tooltipHint">Tap anywhere to close.</div>
  <button class="tooltip-dismiss" id="tooltipDismiss" type="button" aria-label="Dismiss tooltip">✕</button>
`;
document.body.appendChild(tooltipToast);

// Manual save button (mobile-friendly)
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    saveGame();
    showBanner("success", "Saved.");
  });
}

const tooltipTextEl = tooltipToast.querySelector("#tooltipText");
const tooltipHintEl = tooltipToast.querySelector("#tooltipHint");
const tooltipDismissBtn = tooltipToast.querySelector("#tooltipDismiss");

function hideTooltip() {
  tooltipToast.classList.add("hidden");
  tooltipTextEl.textContent = "";
  tooltipHintEl.textContent = "Tap anywhere to close.";
}

function showTooltip(text, hint) {
  tooltipTextEl.textContent = (text || "").trim();
  tooltipHintEl.textContent = (hint || "Tap anywhere to close.").trim();
  tooltipToast.classList.remove("hidden");
}

tooltipDismissBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  hideTooltip();
});

// Click/tap outside closes
document.addEventListener("click", (e) => {
  const t = e.target;
  if (tooltipToast.classList.contains("hidden")) return;
  if (t && (t.closest && t.closest("#tooltipToast"))) return;
  hideTooltip();
}, { capture: true });

// Start collapsed on phones to save space
if (window && window.innerWidth && window.innerWidth <= 520) {
  setLogCollapsed(true);
}

// Work HUD
const workStatusRow = document.getElementById("workStatusRow");
const missedWorkDisplay = document.getElementById("missedWorkDisplay");

const segments = ["Morning", "Midday", "Afternoon", "Night"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// --- META / RELEASE LINKS ---
const GAME_TITLE = "Still Here";
// Replace this with your real Discord invite before publishing.
const DISCORD_INVITE_URL = "https://discord.gg/pmDTSn2v";

const HOW_TO_PLAY_HTML = `
  <div class="howto-body">
    <h3>How to Play</h3>
    <ul>
      <li><strong>Each day</strong> is split into segments. In each segment, choose an action.</li>
      <li>Keep <strong>Hunger</strong> and <strong>Energy</strong> above <strong>0</strong>. If either hits 0, you lose.</li>
      <li>Some actions cost Hunger/Energy, others restore them. Plan your moves.</li>
      <li><strong>Shelter / Motel / Apartment</strong> change what you can do (and how safe you feel).</li>
      <li><strong>Save</strong> anytime with the Save button. Continue appears on the title screen if a save exists.</li>
    </ul>
    <div class="howto-note">
      Tip: If you’re low on Energy, avoid big-cost actions — stabilize first.
      <br><br>
      Keyboard: <span class="howto-kbd">Tab</span> to focus buttons, <span class="howto-kbd">Enter</span> to select.
    </div>
  </div>
`;


// Opening (quiet realism)
const OPENING_LINES = [
  "There wasn’t a single moment when everything fell apart.",
  "Just a few bad weeks stacked too close together.",
  "Now the nights are colder.",
  "Money is tight.",
  "You’re still here."
];

// Chapter framing (V1)
const END_CHAPTER_TITLE = "Chapter One Complete";
const END_CHAPTER_BODY = [
  "You reached stability.",
  "Life doesn’t stop here —",
  "but this chapter does.",
  "Thank you for playing."
];

// Economy constants
const APARTMENT_RENT = 120;
const APARTMENT_DEPOSIT = 240;
const RENT_INTERVAL_DAYS = 7;

// Side gig supplies
const COOKING_SUPPLY_COST = 15;

// Recreation costs
const REC_FISH_COST = 10;
const REC_FISH_ENERGY = 10;
const REC_FISH_HOPE = 3;

const REC_MOVIE_COST = 30;
const REC_MOVIE_ENERGY = 35;
const REC_MOVIE_HOPE = 10;

const REC_VACATION_COST = 100;
const REC_VACATION_ENERGY = 100; // full
const REC_VACATION_HOPE = 25;

// --- PLAYER STATE ---
const player = {
  day: 1,
  segmentIndex: 0,

  hunger: 50,
  energy: 70,
  hygiene: 60,
  // Hope is a hidden mood score from -5..+5. The UI shows a label (Broken..Optimistic)
  // and a bar mapped to 0..100.
  hope: 0,
  // Hope changes accumulate during the day and apply after you sleep (end of day),
  // except for major setbacks (fired / apartment lost) which set hope immediately.
  hopePending: 0,
  money: 0,

  workEthic: 0,
  intelligence: 0,
  charm: 0,
  fitness: 0,

  hasFastFoodJob: false,
  jobAppliedToday: false,
  shiftsWorked: 0,
  isShiftLead: false,
  promoCooldownDays: 0,
  jobCooldownDays: 0,

  motelNights: 0,
  lastSleep: null,

  snackAvailable: true,
  convoAvailable: true,

  // Apartment tier
  hasApartment: false,
  daysUntilRent: null,

  // Gear
  hasComputer: false,

  // Weekly work tracking
  weekDayIndex: 0,          // 0-6, Monday-ish
  missedWorkThisWeek: 0,
  workedThisMorning: false,
  // Some actions can consume your morning without counting as a no-show.
  morningExcused: false,

  // Burnout (apartment tier only)
  burnoutDaysRemaining: 0,

  // Work warning: low hygiene (resets each new day)
  hygieneWarnedToday: false,

  // Eli (street-tier companion beats)
  eliMentions: 0,
  eliIntroduced: false,
  eliLastEventDay: 0,
  // Tim (coworker beats)
  timMentions: 0,
  timIntroduced: false,
  timLastEventDay: 0,
  timLastLine: null,
  workWarningExplained: false,
  eliShelterFailBeatShown: false,
  pendingModal: null,
  // Reflections
  reflectionLastShownDay: 0,
  hiredDay: 0,
  firstMotelReflectionShown: false,

  // Track whether the player has ever been hired before (for rehire messaging)
  everHadJob: false
};

const DEFAULT_PLAYER = JSON.parse(JSON.stringify(player));

function resetPlayerToDefault() {
  // Reset player object in-place (so references remain valid).
  for (const k of Object.keys(player)) {
    if (!(k in DEFAULT_PLAYER)) delete player[k];
  }
  for (const [k, v] of Object.entries(DEFAULT_PLAYER)) {
    // Deep copy nested objects/arrays so we don't share references.
    player[k] = JSON.parse(JSON.stringify(v));
  }
}

// Some actions "use up" your morning without being treated as skipping work.
function excuseMorningIfNeeded() {
  if (segments[player.segmentIndex] === "Morning") {
    player.morningExcused = true;
  }
}

// Overlay state
let currentOverlayMode = null; // 'lottery', 'sidegig', 'recreation'

// --- SAVE / CONTINUE (v1) ---
// Auto-saves after most state changes so mobile players can leave and come back.
const SAVE_KEY = "sts_save_v1";
let gameStarted = false;

  closeOverlay();
  showBanner("", "");
let saveQueued = false;

function hasSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;

    // Defensive: prevent offering Continue after the V1 chapter ending.
    // Save formats we've used:
    //  1) Full payload: { v, t, player, logHtml }
    //  2) Player-only: { ...player }
    const data = JSON.parse(raw);
    const p = (data && data.player) ? data.player : data;
    if (p && p.hasApartment) return false;
    if (p && p.chapterEnded) return false;
    return true;
  } catch (e) {
    return false;
  }
}

function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
}

function queueSave() {
  if (!gameStarted) return;
  if (saveQueued) return;
  saveQueued = true;
  setTimeout(() => {
    saveQueued = false;
    saveGame();
  }, 0);
}

function saveGame() {
  if (!gameStarted) return;
  if (gameOverShown) return;
  try {
    const payload = {
      v: 1,
      t: Date.now(),
      player: player,
      logHtml: (logEl ? logEl.innerHTML : "")
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  } catch (e) {
    // If storage fails (private mode / quota), we silently continue.
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const payload = JSON.parse(raw);
    if (!payload || !payload.player) return false;
    Object.assign(player, payload.player);
    if (logEl && typeof payload.logHtml === "string") {
      logEl.innerHTML = payload.logHtml;
      logEl.scrollTop = logEl.scrollHeight;
    }
    return true;
  } catch (e) {
    return false;
  }
}
let gameOverShown = false;

// Lottery state
const LOTTERY_ANIMALS = ["🐶", "🐱", "🐭", "🐹", "🐰", "🐻"];
let lotteryTarget = null;
let lotterySlots = [null, null, null];
let lotteryRevealed = 0;
let lotteryFinished = false;

// --- HELPERS ---
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function appendLog(msg) {
  const p = document.createElement("p");
  p.innerHTML = msg;
  logEl.appendChild(p);
  logEl.scrollTop = logEl.scrollHeight;
}

function showBanner(type, text) {
  const t = (type || "").trim();
  bannerContainer.className = t ? ("banner " + t) : "banner";
  bannerContainer.textContent = text || "";
}


// --- ELI: SOFT INTRODUCTION EVENTS ---
// One-sentence, observational, infrequent, meaningful.
// Rules:
// - No name initially (2–3 vague mentions while still sleeping on the street).
// - Later: brief, natural introduction.
// - After that: can reference “Eli” by name.
const ELI_VAGUE_LINES = [
  "Someone nearby shares a piece of cardboard without looking up.",
  "A quiet guy a few steps away hums to himself, like he’s trying to stay steady.",
  "You notice someone keeping an eye on the sidewalk—watchful, not nosy.",
  "A stranger offers a half-smile, then goes back to fixing his shoes with duct tape."
];

const ELI_INTRO_LINES = [
  "The guy nearby finally speaks. “Name’s Eli,” he says, like it’s no big deal.",
  "He nods toward you. “I’m Eli.” His voice is calm, practiced at surviving.",
  "“Eli,” he says, offering a hand you don’t have to take. “You holding up?”"
];

const ELI_NAMED_LINES = [
  "Eli points at a warm doorway. “Two minutes. That’s all you need sometimes.”",
  "Eli sits beside you in silence—no advice, just company.",
  "Eli shrugs. “Bad days don’t get a vote.”",
  "Eli watches the street like it’s weather. “It changes fast. Stay ready.”",
  "Eli says, “You’re still here. Count that.”"
];

// After you reach the motel tier, Eli shouldn't appear directly anymore.
// Instead, you get small remnants — memories that linger.
const ELI_REMNANT_LINES = [
  "From the motel window, you think you see someone familiar across the street—then they're gone.",
  "You remember how cold the sidewalk felt, and how long the nights were.",
  "You catch yourself listening for footsteps outside, like you used to.",
  "You keep thinking about the quiet guy from before, and wonder if he ever got inside.",
  "Sometimes you still brace for the worst, even with a door that locks."
];



// --- TIM: CO-WORKER BACKGROUND BEATS ---
// Tim is a quiet, steady presence at work.
// Rules:
// - Not named at first (2–3 vague remarks).
// - Then a brief intro ("Tim").
// - After that, can reference Tim by name.
// - Only triggers on days you actually work a shift.
// - Delivered via queued modal so it can't be missed.
const TIM_VAGUE_LINES = [
  "Someone on the line slides you an extra pair of gloves without a word.",
  "A coworker nods at you like he’s been here too long to judge anyone.",
  "You hear someone mutter, 'Keep your head down. It gets easier.'"
];

const TIM_INTRO_LINES = [
  "The guy beside you finally says, “Tim.” Like it’s all the introduction he’s got.",
  "During a lull, he glances over. “Name’s Tim,” he says, then goes back to the fryer."
];

const TIM_NAMED_LINES = [
  "Tim says, “Clock in. Clock out. Don’t let it eat you.”",
  "Tim glances at your hands. “You’re still learning. That’s fine.”",
  "Tim nods toward the door after close. “One shift at a time.”",
  "Tim says quietly, “You’re showing up. Most people don’t.”"
];

// --- END-OF-DAY REFLECTIONS (Quiet realism) ---
const REFLECT_STREET = [
  "Some days don’t offer much.",
  "You did what you could today.",
  "Not every day moves you forward.",
  "You stayed upright. That counts.",
  "Tomorrow doesn’t promise anything."
];

const REFLECT_EMPLOYED = [
  "Work helps, but it doesn’t fix everything.",
  "The routine makes the days pass faster.",
  "Having somewhere to go changes things.",
  "It’s easier to keep moving when there’s structure."
];

const REFLECT_MOTEL = [
  "A door that locks changes how the night feels.",
  "This isn’t permanent, but it helps.",
  "Sleep comes easier when you’re inside.",
  "You’re closer than you were before."
];

const REFLECT_NEAR_APT = [
  "Stability feels possible now.",
  "You can see what you’re working toward.",
  "The numbers are starting to line up."
];

const REFLECT_FIRST_JOB = "It’s not much, but it’s something.";
const REFLECT_FIRST_MOTEL = "The night feels quieter indoors.";
const REFLECT_APT_ENDING = "Finally, a real night of rest.";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickNotSame(arr, lastVal) {
  if (!arr || arr.length === 0) return null;
  if (arr.length === 1) return arr[0];
  let v = pick(arr);
  let guard = 0;
  while (v === lastVal && guard < 10) {
    v = pick(arr);
    guard += 1;
  }
  return v;
}

function maybeShowEndOfDayReflection(onDone) {
  // Never stack with Eli (or Tim later)
  if (player.eliLastEventDay === player.day || player.timLastEventDay === player.day) return onDone();

  // Never show two days in a row
  if (player.reflectionLastShownDay === player.day - 1) return onDone();

  // Milestones (guaranteed)
  if (player.hiredDay === player.day) {
    player.reflectionLastShownDay = player.day;
    appendLog(REFLECT_FIRST_JOB);
    return openMessageOverlay("Reflection", REFLECT_FIRST_JOB, "OK", onDone);
  }

  const firstMotelTonight = (player.lastSleep === "motel" && player.motelNights === 1 && !player.firstMotelReflectionShown);
  if (firstMotelTonight) {
    player.firstMotelReflectionShown = true;
    player.reflectionLastShownDay = player.day;
    appendLog(REFLECT_FIRST_MOTEL);
    return openMessageOverlay("Reflection", REFLECT_FIRST_MOTEL, "OK", onDone);
  }

  // Base chance (street is higher, employed is lower)
  const employed = player.hasFastFoodJob;
  const chance = employed ? 0.28 : 0.75;
  if (Math.random() > chance) return onDone();

  // Choose pool
  let line = null;

  // Near-apartment hint (only when it makes sense)
  if (!player.hasApartment && player.hasFastFoodJob && player.money >= Math.floor(APARTMENT_DEPOSIT * 0.8)) {
    line = pick(REFLECT_NEAR_APT);
  } else if (player.lastSleep === "motel") {
    line = pick(REFLECT_MOTEL);
  } else if (!employed) {
    line = pick(REFLECT_STREET);
  } else {
    line = pick(REFLECT_EMPLOYED);
  }

  if (!line) return onDone();

  player.reflectionLastShownDay = player.day;
  appendLog(line);
  openMessageOverlay("Reflection", line, "OK", onDone);
}


function maybeTriggerEliEvent(context) {
  // Once you have a job, Eli mostly fades into the background.
  // (Tim takes over the "work" arc.)
  if (player.hasFastFoodJob) return;
  if (player.hasApartment) return;

  // Infrequent: at most once per day
  if (player.eliLastEventDay === player.day) return;

  // Once you reach the motel tier, Eli no longer appears directly.
  // Instead, you occasionally get a small remnant memory.
  // Important: these "remnant" lines should only show when you're actually in the motel tier.
  // (They shouldn't trigger on shelter nights.)
  if (player.motelNights > 0 && player.lastSleep === "motel") {
    const roll2 = Math.random();
    const chance2 = 0.10; // rare, subtle
    if (roll2 > chance2) return;
    player.eliLastEventDay = player.day;
    const rem = ELI_REMNANT_LINES[Math.floor(Math.random() * ELI_REMNANT_LINES.length)];
    appendLog(rem);
    queueModal("A Thought", rem, "OK");
    return;
  }


  // Only trigger on street-tier vibes (before motel nights) unless already introduced
  const stillStreetTier = player.motelNights === 0;

  // Light probability: more likely early, then stays rare
  const roll = Math.random();
  const chance = player.eliIntroduced ? 0.08 : (stillStreetTier ? 0.22 : 0.10);
  if (roll > chance) return;

  player.eliLastEventDay = player.day;

  // Stage logic
  if (!player.eliIntroduced) {
    if (player.eliMentions < 3 && stillStreetTier) {
      const line = ELI_VAGUE_LINES[player.eliMentions % ELI_VAGUE_LINES.length];
      player.eliMentions += 1;
      appendLog(line);
      queueModal("Someone Nearby", line, "OK");

      return;
    }
    // Intro moment
    const intro = ELI_INTRO_LINES[Math.floor(Math.random() * ELI_INTRO_LINES.length)];
    player.eliIntroduced = true;
    appendLog(intro);
    queueModal("A Brief Moment", intro, "OK");

    return;
  }

  const named = ELI_NAMED_LINES[Math.floor(Math.random() * ELI_NAMED_LINES.length)];
  appendLog(named);
  queueModal("Eli", named, "OK");

}


function maybeTriggerTimEvent(context) {
  if (!player.hasFastFoodJob) return false;
  if (player.hasApartment) return false; // V1 ends at apartment; keep Tim in the work arc

  // Only run for post-shift moments (before sleep selection)
  if (context !== "work") return false;

  // Only one Tim moment per day
  if (player.timLastEventDay === player.day) return false;

  // Don't stack with Eli or other overlays/modals
  if (player.eliLastEventDay === player.day) return false;
  if (currentOverlayMode) return false;
  if (player.pendingModal) return false;

  // Only trigger if the player actually worked today
  if (!player.workedThisMorning) return false;
  // Sundays are off; no Tim beat
  if (player.weekDayIndex === 6) return false;

  // First shift: guaranteed meet (named)
  if (!player.timIntroduced && player.shiftsWorked === 1) {
    const intro = pickNotSame(TIM_INTRO_LINES, player.timLastLine);
    player.timIntroduced = true;
    player.timLastEventDay = player.day;
    player.timLastLine = intro;
    appendLog(intro);
    openMessageOverlay("Tim", intro, "OK", () => {
      closeOverlay();
      updateUI();
    });
    return true;
  }

  // Infrequent, but meaningful after work
  const roll = Math.random();
  const chance = player.timIntroduced ? 0.25 : 0.35;
  if (roll > chance) return false;

  player.timLastEventDay = player.day;
  // (vague -> intro -> named)
  if (!player.timIntroduced) {
    if (player.timMentions < 3) {
      const line = TIM_VAGUE_LINES[player.timMentions % TIM_VAGUE_LINES.length];
      player.timMentions += 1;
      player.timLastLine = line;
      appendLog(line);
      openMessageOverlay("A Coworker", line, "OK", () => {
        closeOverlay();
        updateUI();
      });
      return true;
    }
    const intro = pickNotSame(TIM_INTRO_LINES, player.timLastLine);
    player.timIntroduced = true;
    player.timLastLine = intro;
    appendLog(intro);
    openMessageOverlay("Tim", intro, "OK", () => {
      closeOverlay();
      updateUI();
    });
    return true;
  }

  const named = pickNotSame(TIM_NAMED_LINES, player.timLastLine);
  player.timLastLine = named;
  appendLog(named);
  openMessageOverlay("Tim", named, "OK", () => {
    closeOverlay();
    updateUI();
  });
  return true;
}

function clampStats() {
  player.hunger = clamp(player.hunger, 0, 100);
  player.energy = clamp(player.energy, 0, 100);
  player.hygiene = clamp(player.hygiene, 0, 100);
  player.hope = clamp(player.hope, -5, 5);
  player.hopePending = clamp(player.hopePending, -20, 20);
}


// If an action would drop Hunger/Energy to 0 on the street, collapse immediately.
// (Apartment-tier 0 Energy triggers burnout instead of game over.)
function collapseIfCostsWouldKill(actionVerb, energyCost = 0, hungerCost = 0) {
  if (player.hasApartment) return false;

  if (energyCost > 0 && (player.energy - energyCost) <= 0) {
    appendLog("You try to " + actionVerb + ", but your body gives out.");
    player.energy = 0;
    clampStats();
    showBanner("error", "You collapsed from exhaustion.");
    checkGameOver();
    return true;
  }

  if (hungerCost > 0 && (player.hunger - hungerCost) <= 0) {
    appendLog("You try to " + actionVerb + ", but hunger takes you first.");
    player.hunger = 0;
    clampStats();
    showBanner("error", "You collapsed from hunger.");
    checkGameOver();
    return true;
  }

  return false;
}



function effectiveHope() {
  // Shows the player what Hope will be once today’s changes settle.
  return clamp(player.hope + player.hopePending, -5, 5);
}
// --- HOPE (hidden mood) ---
function hopeLabel(v) {
  if (v <= -4) return "Broken";
  if (v <= -2) return "Struggling";
  if (v === -1) return "Worn Down";
  if (v === 0) return "Hanging On";
  if (v === 1) return "OK";
  if (v <= 3) return "Hopeful";
  return "Optimistic";
}

function hopeToPercent(v) {
  // -5..+5 -> 0..100
  return Math.round(((v + 5) / 10) * 100);
}

function addHope(delta) {
  // Accumulate during the day; applied at end-of-day (after sleep).
  player.hopePending += delta;
}

function setHopeImmediate(v) {
  // Major setbacks apply immediately.
  player.hope = clamp(v, -5, 5);
  player.hopePending = 0;
}

function applyHopePendingAfterSleep() {
  if (player.hopePending === 0) return;
  player.hope = clamp(player.hope + player.hopePending, -5, 5);
  player.hopePending = 0;
}

// Hunger only tracked while on the street
function adjustHunger(delta) {
  if (!player.hasApartment) {
    player.hunger = clamp(player.hunger + delta, 0, 100);
  }
}


function saveGame() {
  try {
    localStorage.setItem("sts_save_v1", JSON.stringify(player));
  } catch (e) {
    // ignore
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem("sts_save_v1");
    if (!raw) return false;
    const data = JSON.parse(raw);

    // V1 ends at apartment. If a save exists from a completed run,
    // clear it and force a fresh start (prevents Continue from jumping past the ending).
    if (data && (data.hasApartment || data.chapterEnded)) {
      clearSave();
      return false;
    }

    // Shallow-assign known keys only
    Object.keys(player).forEach(k => {
      if (k in data) player[k] = data[k];
    });
    return true;
  } catch (e) {
    return false;
  }
}
// --- BACKGROUND ---
function updateSceneBackground() {
  // Background is tied to life tier (quiet, consistent).
  let bg = "assets/bg_street.jpg";

  if (player.hasApartment) {
    bg = "assets/bg_apartment.jpg";
  }

  // Motel overrides for the night you stayed there (optional flavor)
  if (!player.hasApartment && player.lastSleep === "motel") {
    bg = "assets/bg_motel.jpg";
  }

  if (sceneBg) {
    sceneBg.style.backgroundImage = "url('" + bg + "')";
  }
}

function updateCharacterSprite() {
  if (!characterSprite) return;

  // Character progression visuals (what the player looks like)
  let src = "assets/char_street.png";
  let alt = "Character (street)";

  if (player.hasApartment) {
    src = "assets/char_apartment.png";
    alt = "Character (apartment)";
  } else if (player.isShiftLead) {
    src = "assets/char_shiftlead.png";
    alt = "Character (shift lead)";
  } else if (player.hasFastFoodJob) {
    src = "assets/char_fastfood.png";
    alt = "Character (fast food)";
  }

  if (characterSprite.getAttribute("src") !== src) {
    characterSprite.setAttribute("src", src);
  }
  characterSprite.setAttribute("alt", alt);
}


// --- OVERLAY HANDLING ---
function closeOverlay() {
  currentOverlayMode = null;
  overlayPanel.classList.add("hidden");
  (overlayContent || overlayPanel).innerHTML = "";
  overlayPanel.setAttribute("aria-hidden", "true");
}

function openOverlay(mode, innerHTMLBuilder) {
  currentOverlayMode = mode;
  overlayPanel.classList.remove("hidden");
  overlayPanel.setAttribute("aria-hidden", "false");
  (overlayContent || overlayPanel).innerHTML = innerHTMLBuilder();
}

function queueModal(title, message, okLabel = "OK") {
  player.pendingModal = { title, message, okLabel };
}


function showWorkNotice(title, message) {
  // Uses the same modal style as Tim/Eli so it's readable and unmissable.
  openMessageOverlay(title, message, "OK");
}

function openMessageOverlay(title, message, okLabel = "OK", onClose = null) {
  openOverlay("message", () => {
    return `
      <div class="sidegig-panel">
        <div class="panel-header">
          <div class="panel-title">${title}</div>
          <div class="panel-sub">${message}</div>
        </div>
        <div class="panel-actions">
          <button class="panel-button primary" id="messageOkBtn" type="button">${okLabel}</button>
        </div>
      </div>
    `;
  });

  const ok = overlayPanel.querySelector("#messageOkBtn");
  if (ok) ok.addEventListener("click", () => {
    closeOverlay();
    if (typeof onClose === "function") onClose();
  });
}



// Game Over overlay (clear reason + restart loop)
function openGameOverOverlay(reasonTitle, reasonHtml) {
  openOverlay("gameover", () => {
    const dayLine = `Day ${player.day} • ${segments[player.segmentIndex] || ""}`.trim();
    const discordHint = (DISCORD_INVITE_URL && !DISCORD_INVITE_URL.includes("REPLACE_ME"))
      ? '<button class="panel-button" id="goDiscordBtn" type="button">Join Discord</button>'
      : '';
    return `
      <div class="sidegig-panel">
        <div class="panel-header">
          <div class="panel-title">Game Over</div>
          <div class="panel-sub"><div style="opacity:.85; margin-bottom:8px;">${dayLine}</div><strong>${reasonTitle}</strong><br>${reasonHtml}</div>
        </div>
        <div class="panel-actions">
          <button class="panel-button primary" id="goRetryBtn" type="button">Try Again</button>
          <button class="panel-button" id="goTitleBtn" type="button">Title Screen</button>
          ${discordHint}
        </div>
      </div>
    `;
  });

  const retryBtn = overlayPanel.querySelector('#goRetryBtn');
  if (retryBtn) retryBtn.addEventListener('click', () => {
    closeOverlay();
    softRestartRun();
  });

  const titleBtn = overlayPanel.querySelector('#goTitleBtn');
  if (titleBtn) titleBtn.addEventListener('click', () => {
    closeOverlay();
    returnToTitleScreen();
  });

  const discordBtn = overlayPanel.querySelector('#goDiscordBtn');
  if (discordBtn) discordBtn.addEventListener('click', () => {
    if (DISCORD_INVITE_URL) window.open(DISCORD_INVITE_URL, '_blank', 'noopener');
  });
}

function softRestartRun() {
  // Clear any saved/dead state and start a fresh Day 1 without reloading the page.
  clearSave();
  gameOverShown = false;
  resetPlayerToDefault();

  // Clear any lingering banner (e.g., "Game over" message)
  showBanner("", "");

  // Reset log + UI
  if (logEl) logEl.innerHTML = '';
  appendLog('<strong>Day 1</strong> begins. Morning.');

  // Make sure gameplay is visible
  if (titleScreen) titleScreen.classList.add('hidden');
  if (gameShell) gameShell.classList.remove('hidden');

  gameStarted = true;
  updateUI();
  queueSave();
}

function returnToTitleScreen() {
  // Leave the game in a clean state on the title screen.
  clearSave();
  gameOverShown = false;
  gameStarted = false;

  if (gameShell) gameShell.classList.add('hidden');
  if (titleScreen) titleScreen.classList.remove('hidden');

  // Hide Continue since we cleared the save.
  const continueBtn = document.getElementById('titleContinueBtn');
  if (continueBtn) continueBtn.style.display = 'none';
}

function openHowToOverlay(onClose = null) {
  openOverlay("howto", () => {
    return `
      <div class="sidegig-panel">
        <div class="panel-header">
          <div class="panel-title">Still Here</div>
          <div class="panel-sub">A hopeful game about survival, choices, and second chances.</div>
        </div>
        ${HOW_TO_PLAY_HTML}
        <div class="panel-actions">
          <button class="panel-button primary" id="howToCloseBtn" type="button">Close</button>
        </div>
      </div>
    `;
  });

  const btn = overlayPanel.querySelector("#howToCloseBtn");
  if (btn) btn.addEventListener("click", () => {
    closeOverlay();
    if (typeof onClose === "function") onClose();
  });
}


// --- END / CREDITS SCREENS ---
function openCreditsOverlay(onBack = null) {
  const year = (new Date()).getFullYear();

  openOverlay("credits", () => {
  const discordHint = (DISCORD_INVITE_URL && !DISCORD_INVITE_URL.includes("REPLACE_ME"))
    ? "Join the Discord to share feedback and help shape the next chapter."
    : "Discord link not set yet — add your invite URL in game.js before publishing.";

  return `
    <div class="sidegig-panel">
      <div class="panel-header">
        <div class="panel-title">Credits</div>
        <div class="panel-sub"><strong>Still Here</strong></div>
      </div>

      <div class="panel-row">
        <span class="panel-label">A game by</span>
        <span class="panel-value"><strong>Armor for Sheep Games</strong></span>
      </div>

      <div class="panel-row">
        <span class="panel-label">Design &amp; Development</span>
        <span class="panel-value">Kyle Donaldson</span>
      </div>

      <div class="panel-row">
        <span class="panel-label">Special Thanks</span>
        <span class="panel-value">Family and friends who playtested and shared feedback</span>
      </div>

      <div class="panel-row">
        <span class="panel-label">© ${year}</span>
        <span class="panel-value">Armor for Sheep Games</span>
      </div>

      <div class="panel-row">
        <span class="panel-label">Community</span>
        <span class="panel-value">${discordHint}</span>
      </div>

      <div class="panel-actions">
        <button class="panel-button" id="creditsDiscordBtn" type="button">Join the Discord</button>
        <button class="panel-button primary" id="creditsBackBtn" type="button">Back</button>
      </div>
    </div>
  `;
});

  const discordBtn = overlayPanel.querySelector("#creditsDiscordBtn");
  if (discordBtn) {
    const disabled = !DISCORD_INVITE_URL || DISCORD_INVITE_URL.includes("REPLACE_ME");
    if (disabled) {
      discordBtn.disabled = true;
      discordBtn.title = "Set DISCORD_INVITE_URL in game.js";
    }
    discordBtn.addEventListener("click", () => {
      if (!disabled) window.open(DISCORD_INVITE_URL, "_blank", "noopener");
    });
  }
  const backBtn = overlayPanel.querySelector("#creditsBackBtn");
  if (backBtn) backBtn.addEventListener("click", () => {
    closeOverlay();
    if (typeof onBack === "function") onBack();
    else updateUI();
  });
}

function openEndCardOverlay() {
  openOverlay("endcard", () => {
    const body = END_CHAPTER_BODY.join("<br>");
    return `
      <div class="sidegig-panel">
        <div class="panel-header">
          <div class="panel-title">${END_CHAPTER_TITLE}</div>
          <div class="panel-sub">${body}</div>
        </div>
        <div class="panel-actions">
          <button class="panel-button primary" id="endRestartBtn" type="button">Restart</button>
          <button class="panel-button" id="endCreditsBtn" type="button">Credits</button>
          <button class="panel-button" id="endDiscordBtn" type="button">Join the Discord</button>
        </div>
      </div>
    `;
  });

  const restartBtn = overlayPanel.querySelector("#endRestartBtn");
  if (restartBtn) restartBtn.addEventListener("click", () => {
    // Ensure a completed-run save can't be continued past the chapter end.
    clearSave();
    window.location.reload();
  });
  const creditsBtn = overlayPanel.querySelector("#endCreditsBtn");
  if (creditsBtn) creditsBtn.addEventListener("click", () => {
    openCreditsOverlay(() => openEndCardOverlay());
  });
  const discordBtn = overlayPanel.querySelector("#endDiscordBtn");
  if (discordBtn) {
    const disabled = !DISCORD_INVITE_URL || DISCORD_INVITE_URL.includes("REPLACE_ME");
    if (disabled) {
      discordBtn.disabled = true;
      discordBtn.title = "Set DISCORD_INVITE_URL in game.js";
    }
    discordBtn.addEventListener("click", () => {
      if (!disabled) window.open(DISCORD_INVITE_URL, "_blank", "noopener");
    });
  }
}

// --- BURNOUT ---
function checkForBurnout() {
  // Burnout only exists once you have an apartment; on the street, 0 energy is game over.
  if (!player.hasApartment) return;
  if (player.energy > 0) return;
  if (player.burnoutDaysRemaining > 0) return;

  player.energy = 0;
  player.burnoutDaysRemaining = 2; // rest of today + next full day
  appendLog("<strong>Burnout:</strong> Your body gives out. You can only sleep for a bit.");
  showBanner("error", "Burnout! Only Sleep available for 2 days.");
  closeOverlay();
}

// --- UI ---
function updateUI() {
  const segName = segments[player.segmentIndex];
  dayDisplay.textContent = player.day;
  if (weekdayDisplay) {
    weekdayDisplay.textContent = WEEKDAYS[player.weekDayIndex % 7];
  }
  segmentDisplay.textContent = segName;

  if (segName === "Night") {
    segmentSub.textContent = "Choose where to sleep tonight.";
  } else {
    segmentSub.textContent = "Choose one action.";
  }

  let status = "On the street";
  if (player.hasFastFoodJob && !player.isShiftLead) status = "Fast Food Helper";
  if (player.isShiftLead) status = "Shift Lead";
  if (player.hasApartment) status += " • Apartment";

  statusDisplay.textContent = status;

  moneyDisplay.textContent = "$" + player.money;

  // Hunger row hides if you have an apartment
  if (player.hasApartment) {
    hungerRow.style.display = "none";
  } else {
    hungerRow.style.display = "grid";
  }

  hungerValue.textContent = player.hunger;
  energyValue.textContent = player.energy;
  hygieneValue.textContent = player.hygiene;
  hopeValue.textContent = hopeLabel(effectiveHope());

  hungerBar.style.width = player.hunger + "%";
  energyBar.style.width = player.energy + "%";
  hygieneBar.style.width = player.hygiene + "%";
  // Hope is now on a -5..+5 scale; convert to a 0..100% fill for the bar.
  hopeBar.style.width = hopeToPercent(effectiveHope()) + "%";

  weVal.textContent = player.workEthic;
  intVal.textContent = player.intelligence;
  charmVal.textContent = player.charm;
  fitVal.textContent = player.fitness;

  // Rent / goal display
  if (player.hasApartment && typeof player.daysUntilRent === "number") {
    rentStatusEl.textContent = "Rent in " + player.daysUntilRent + " day(s) • $" + APARTMENT_RENT;
  } else if (!player.hasApartment && player.motelNights > 0) {
    // After the player reaches the motel tier, show the apartment goal so they can plan.
    rentStatusEl.textContent = "Apartment goal: $" + APARTMENT_DEPOSIT + " deposit • $" + APARTMENT_RENT + "/week";
  } else {
    rentStatusEl.textContent = "";
  }

  // Missed work HUD
  if (player.hasFastFoodJob) {
    workStatusRow.style.display = "flex";
    const missed = player.missedWorkThisWeek;
    missedWorkDisplay.textContent = missed + " / 3";
    if (missed === 0) {
      workStatusRow.style.opacity = 0.95;
    } else if (missed === 1) {
      workStatusRow.style.opacity = 1;
    } else if (missed === 2) {
      workStatusRow.style.opacity = 1;
      workStatusRow.style.boxShadow = "0 0 0 1px rgba(250, 204, 21, 0.7)";
    } else {
      workStatusRow.style.opacity = 1;
      workStatusRow.style.boxShadow = "0 0 0 1px rgba(239, 68, 68, 0.9)";
    }
  } else {
    workStatusRow.style.display = "none";
  }

  // If an overlay is open, don't re-render actions here
  if (!currentOverlayMode) {
    renderActions();
  }
  updateCharacterSprite();
  updateSceneBackground();
  saveGame();
}

// --- GAME OVER ---
function checkGameOver() {
  // If we end the run, make sure the player *sees* the stat hit 0 immediately.
  // (On mobile, the Game Over overlay can appear before the next full UI refresh.)
  function reflectZeroStats() {
    if (!player.hasApartment) {
      if (player.hunger <= 0) {
        player.hunger = 0;
        if (typeof hungerValue !== "undefined" && hungerValue) hungerValue.textContent = "0";
        if (typeof hungerBar !== "undefined" && hungerBar) hungerBar.style.width = "0%";
      }
      if (player.energy <= 0) {
        player.energy = 0;
        if (typeof energyValue !== "undefined" && energyValue) energyValue.textContent = "0";
        if (typeof energyBar !== "undefined" && energyBar) energyBar.style.width = "0%";
      }
    }
  }
  // Hunger can only kill you if you're not in an apartment
  if (!player.hasApartment && player.hunger <= 0) {
    reflectZeroStats();
    const msg = "You collapsed from hunger. Game over.";
    showBanner("error", msg);
    appendLog("<strong>Game Over:</strong> You collapsed from hunger on Day " + player.day + ".");
    actionsGrid.innerHTML = "";
    closeOverlay();
    if (!gameOverShown) {
      gameOverShown = true;
      clearSave();
      openGameOverOverlay("You collapsed from hunger.", "Your <strong>Hunger</strong> hit <strong>0</strong>.<br><br>Try to find food earlier in the day — even small wins stack.");
    }
    return true;
  }
  // Energy only kills you if you're still on the street.
  if (!player.hasApartment && player.energy <= 0) {
    reflectZeroStats();
    const msg = "You collapsed from exhaustion. Game over.";
    showBanner("error", msg);
    appendLog("<strong>Game Over:</strong> You collapsed from exhaustion on Day " + player.day + ".");
    actionsGrid.innerHTML = "";
    closeOverlay();
    if (!gameOverShown) {
      gameOverShown = true;
      clearSave();
      openGameOverOverlay("You collapsed from exhaustion.", "Your <strong>Energy</strong> hit <strong>0</strong>.<br><br>Rest is a resource — pace your day and protect your mornings.");
    }
    return true;
  }
  // Hope is a mood meter now (hidden -5..+5). It never directly ends the run.
  return false;
}

// --- RENT LOGIC ---
function handleRentAtEndOfDay() {
  if (!player.hasApartment) return;

  if (player.daysUntilRent === null) {
    player.daysUntilRent = RENT_INTERVAL_DAYS;
  }

  player.daysUntilRent -= 1;

  if (player.daysUntilRent > 0) return;

  // Rent due
  if (player.money >= APARTMENT_RENT) {
    player.money -= APARTMENT_RENT;
    player.daysUntilRent = RENT_INTERVAL_DAYS;
    appendLog("You pay $" + APARTMENT_RENT + " in rent. You keep your apartment this week.");
    showBanner("success", "Rent paid.");
  } else {
    // Lose apartment
    player.hasApartment = false;
    player.daysUntilRent = null;
    player.hunger = clamp(player.hunger, 40, 100); // you were at least eating
    appendLog("<strong>You couldn't pay rent.</strong> You lose the apartment and are back on the street.");
    showBanner("error", "Apartment lost. You're back on the street.");
    setHopeImmediate(-5);
    // Burnout no longer applies if you lose the apartment
    player.burnoutDaysRemaining = 0;
  }
}

// --- END OF DAY HOPE ADJUST / COOLDOWNS / BURNOUT TICK ---
function applyEndOfDay() {
  // Hope is a small mood score (-5..+5). It updates after you sleep.
  // Keep it simple: sleep quality drives the daily drift.
  let sleepDelta = 0;
  switch (player.lastSleep) {
    case "street":
      sleepDelta = -2;
      break;
    case "shelter_success":
      sleepDelta = -1;
      break;
    case "shelter_fail":
      sleepDelta = -3;
      break;
    case "motel":
      sleepDelta = -1;
      break;
    case "apartment":
      sleepDelta = +1;
      break;
    default:
      sleepDelta = 0;
  }
  if (sleepDelta !== 0) addHope(sleepDelta);
  applyHopePendingAfterSleep();

if (player.hasFastFoodJob) {
  player.hope = Math.max(player.hope, -2); // floor at "Struggling"
}

  if (player.promoCooldownDays > 0) player.promoCooldownDays -= 1;
  if (player.jobCooldownDays > 0) player.jobCooldownDays -= 1;

  player.lastSleep = null;

  // Burnout days tick down at end of each day
  if (player.burnoutDaysRemaining > 0) {
    player.burnoutDaysRemaining -= 1;
    if (player.burnoutDaysRemaining <= 0) {
      appendLog("After some forced rest, you feel ready to take on more again.");
    }
  }

  // Rent tick at end of day
  handleRentAtEndOfDay();
}

// --- WORK ATTENDANCE / WEEKLY RESET ---
function recordMorningPassIfNoWork(prevSegmentIndex) {
  const wasMorning = segments[prevSegmentIndex] === "Morning";
  if (!wasMorning) return;
  if (!player.hasFastFoodJob) return;

  // Sundays are a guaranteed day off (no work expected, no penalty).
  if (player.weekDayIndex === 6) {
    player.workedThisMorning = false;
    return;
  }

  const excused = player.morningExcused;
  // Reset the excuse once the morning window has passed.
  player.morningExcused = false;

  if (!player.workedThisMorning && !excused) {
    player.missedWorkThisWeek += 1;


    if (!player.workWarningExplained) {
      player.workWarningExplained = true;
      appendLog("<em>Work warnings come from missing a morning shift or having Hygiene under 40. Three warnings in a week can get you fired or demoted.</em>");
    }
    appendLog("You miss work this morning. Missed days this week: " + player.missedWorkThisWeek + ".");
    showBanner("error", "You skipped work this morning.");
    showWorkNotice("Work warning", "You missed your <strong>morning shift</strong>.<br><br>Warnings this week: <strong>" + player.missedWorkThisWeek + "/3</strong>.");

    if (player.missedWorkThisWeek >= 3) {
      // too many absences
      if (player.isShiftLead) {
        player.isShiftLead = false;
        appendLog("<strong>You're demoted.</strong> Too many missed days cost you your lead position.");
        showBanner("error", "Demoted for too many absences.");
        showWorkNotice("Demoted", "Too many missed mornings this week cost you your lead position.<br><br>Tip: If you need to recover, use shelter/motel to reset your next day.");
      } else {
        player.hasFastFoodJob = false;
        player.jobCooldownDays = 7;
        setHopeImmediate(-5);
        appendLog("<strong>You're fired.</strong> Too many missed days. You can't reapply here for a week.");
        showBanner("error", "Fired. Job reapplication locked for 7 days.");
        showWorkNotice("You\'re fired", "Too many missed mornings this week. You can\'t reapply here for <strong>7 days</strong>.<br><br>Take a breath — you can rebuild.");
      }
      player.missedWorkThisWeek = 0;
    }
  }
}

function applyHygieneWarningIfNeeded() {
  // If you have a job and your hygiene is very low, your manager warns you.
  // This counts toward the same weekly warning limit as missed mornings.
  if (!player.hasFastFoodJob) return;
  // Raised from 20 -> 40 so hygiene plays a bigger role.
  if (player.hygiene >= 40) return;
  if (player.hygieneWarnedToday) return;

  player.hygieneWarnedToday = true;
  player.missedWorkThisWeek += 1;


    if (!player.workWarningExplained) {
      player.workWarningExplained = true;
      appendLog("<em>Work warnings come from missing a morning shift or having Hygiene under 40. Three warnings in a week can get you fired or demoted.</em>");
    }
  appendLog(
    "<strong>Work warning:</strong> Your manager pulls you aside about your hygiene (Hygiene < 40). " +
      "Warnings this week: " + player.missedWorkThisWeek + "/3."
  );
  showBanner("error", "Work warning: hygiene too low.");
  showWorkNotice("Work warning", "Your manager pulls you aside about your hygiene (<strong>Hygiene &lt; 40</strong>).<br><br>Warnings this week: <strong>" + player.missedWorkThisWeek + "/3</strong>.");

  if (player.missedWorkThisWeek >= 3) {
    // too many warnings/absences
    if (player.isShiftLead) {
      player.isShiftLead = false;
      appendLog("<strong>You're demoted.</strong> Too many warnings this week cost you your lead position.");
      showBanner("error", "Demoted for too many warnings.");
      showWorkNotice("Demoted", "Too many warnings this week cost you your lead position.<br><br>Keep hygiene above 40 and try not to miss mornings.");
    } else {
      player.hasFastFoodJob = false;
      player.jobCooldownDays = 7;
      setHopeImmediate(-5);
      appendLog("<strong>You're fired.</strong> Too many warnings. You can't reapply here for a week.");
      showBanner("error", "Fired. Job reapplication locked for 7 days.");
      showWorkNotice("You\'re fired", "Too many warnings this week. You can\'t reapply here for <strong>7 days</strong>.<br><br>Get stable first — then reapply.");
    }
    player.missedWorkThisWeek = 0;
  }
}

function handleNewDay() {
  player.day += 1;
  player.segmentIndex = 0;
  player.weekDayIndex = (player.weekDayIndex + 1) % 7;
  if (player.weekDayIndex === 0) {
    player.missedWorkThisWeek = 0;
    appendLog("<em>A new work week begins.</em>");
  }
  player.workedThisMorning = false;
  player.morningExcused = false;
  player.hygieneWarnedToday = false;
  player.jobAppliedToday = false;
  appendLog("<strong>Day " + player.day + "</strong> begins. Morning.");

  // Hygiene warnings now only apply if you actually go to work with low hygiene.
  maybeTriggerEliEvent("newDay");
}

// --- DAY PROGRESSION ---
function nextSegment() {
  if (checkGameOver()) return;

  const prevSegmentIndex = player.segmentIndex;

  if (player.segmentIndex === 3) {
    applyEndOfDay();
    if (checkGameOver()) return;

    // End-of-day flow:
    // 1) show any queued modal (Eli / Tim beats), then
    // 2) optional reflection, then
    // 3) start the new day.
    closeOverlay();

    const pending = player.pendingModal;
    player.pendingModal = null;

    const continueFlow = () => {
      maybeShowEndOfDayReflection(() => {
        handleNewDay();
        closeOverlay();
        updateUI();
      });
    };

    if (pending && pending.message) {
      openMessageOverlay(pending.title || "A Brief Moment", pending.message, pending.okLabel || "OK", continueFlow);
    } else {
      continueFlow();
    }

    return;
  } else {
    // when leaving Morning, record no-show if you didn't work
    recordMorningPassIfNoWork(prevSegmentIndex);
    player.segmentIndex += 1;

    // Burnout (apartment tier): you can't do daytime actions—your day effectively skips to Night.
    if (player.hasApartment && player.burnoutDaysRemaining > 0 && player.segmentIndex < 3) {
      player.segmentIndex = 3;
    }
  }
  closeOverlay();
  updateUI();
}

// --- ACTIONS: STREET / JOB TIER ---
function doTrash() {
  if (collapseIfCostsWouldKill("pick up trash", 16, 12)) return;

  const money = Math.floor(Math.random() * 5) + 2;
  player.money += money;
  adjustHunger(-12);
  player.energy -= 16;
  player.hygiene -= 10;
  addHope(-1);
  clampStats();
  showBanner("success", "+$" + money + " from trash.");
  appendLog("You pick up trash and earn <strong>$" + money + "</strong>. It’s rough work.");
  checkForBurnout();
  nextSegment();
}

function doBeg() {
  if (collapseIfCostsWouldKill("beg", 8, 7)) return;

  // Hope affects your "aura" a bit: when you're struggling, fewer people help;
  // when you're optimistic, you do a bit better.
  const mood = effectiveHope(); // -5..+5
  const r = Math.random();
  let money = 0;

  // Base: 25% none, 45% small, 30% decent
  // Low hope: 40% none, 45% small, 15% decent
  // High hope: 15% none, 50% small, 35% decent
  let tNone = 0.25;
  let tSmall = 0.70;
  if (mood <= -2) {
    tNone = 0.40;
    tSmall = 0.85;
  } else if (mood >= 2) {
    tNone = 0.15;
    tSmall = 0.65;
  }

  if (r < tNone) money = 0;
  else if (r < tSmall) money = Math.floor(Math.random() * 2) + 1;
  else money = Math.floor(Math.random() * 3) + 3;

  player.money += money;
  adjustHunger(-7);
  player.energy -= 8;
  player.hygiene -= 3;

  if (money === 0) {
    addHope(-1);
    appendLog("You beg, but no one helps. It hurts.");
    showBanner("error", "No one stopped today.");
  } else {
    addHope(+1);
    appendLog("You beg and receive <strong>$" + money + "</strong> from a stranger.");
    showBanner("success", "+$" + money + " from begging.");
  }
  clampStats();
  checkForBurnout();
  nextSegment();
}


function doEat() {
  if (player.hasApartment) {
    showBanner("error", "You eat at home now. Hunger isn't tracked.");
    return;
  }
  if (player.money < 4) {
    showBanner("error", "Not enough money for a meal.");
    appendLog("You want to eat, but you don’t have enough money.");
    return;
  }
  player.money -= 4;
  adjustHunger(+25);
  player.energy = clamp(player.energy + 6, 0, 100);
  // Cheap meals on the street are messy.
  player.hygiene -= 3;
  addHope(+1);
  appendLog("You buy a cheap meal. You feel fuller and a bit more hopeful.");
  showBanner("success", "You ate a meal.");
  clampStats();
  checkForBurnout();
  nextSegment();
}

function doWash() {
  if (collapseIfCostsWouldKill("wash up", 4, 2)) return;

  adjustHunger(-2);
  player.energy -= 4;
  player.hygiene = clamp(player.hygiene + 15, 0, 100);
  // Wash is important, but doesn't swing mood much by itself.
  addHope(0);
  appendLog("You wash up in a public restroom. You feel a bit more human.");
  showBanner("success", "You washed up (free).");
  clampStats();
  checkForBurnout();
  nextSegment();
}

function doNap() {
  if (collapseIfCostsWouldKill("take a nap", 0, 5)) return;

  adjustHunger(-5);
  player.energy = clamp(player.energy + 20, 0, 100);
  player.hygiene -= 2;
  addHope(0);
  appendLog("You find a corner and take a short nap.");
  showBanner("success", "You napped. Energy +20.");
  clampStats();
  checkForBurnout();
  nextSegment();
}

function doRest() {
  // Apartment-tier rest, no hunger cost
  player.energy = clamp(player.energy + 20, 0, 100);
  appendLog("You take a quiet moment to rest. Energy +20.");
  showBanner("success", "You rested. Energy +20.");
  clampStats();
  checkForBurnout();
  nextSegment();
}

function doLibrary() {
  if (collapseIfCostsWouldKill("study at the library", 10, 6)) return;

  adjustHunger(-6);
  player.energy -= 10;
  player.hygiene -= 3;
  addHope(+1);
  player.intelligence += 1;
  appendLog("You study at the library. Intelligence +1 and you feel more hopeful about your future.");
  showBanner("success", "Intelligence +1.");
  clampStats();
  checkForBurnout();
  nextSegment();
}

function doGym() {
  if (collapseIfCostsWouldKill("work out", 20, 12)) return;

  adjustHunger(-12);
  player.energy -= 20;
  player.hygiene -= 12;
  player.fitness += 1;
  appendLog("You exercise using public space. Fitness +1.");
  showBanner("success", "Fitness +1.");
  clampStats();
  checkForBurnout();
  nextSegment();
}

function doJobCenter() {
  if (collapseIfCostsWouldKill("go to the job center", 12, 6)) return;

  if (player.money < 10) {
    showBanner("error", "Not enough money for the job center.");
    appendLog("You can’t afford the job center fee today.");
    return;
  }
  player.money -= 10;
  adjustHunger(-6);
  player.energy -= 12;
  addHope(+2);

  const r = Math.random();
  if (r < 0.4) {
    player.workEthic += 1;
    appendLog("You attend a workshop on habits. Work Ethic +1.");
    showBanner("success", "Work Ethic +1.");
  } else if (r < 0.8) {
    player.charm += 1;
    appendLog("You practice interviews and introductions. Charm +1.");
    showBanner("success", "Charm +1.");
  } else {
    player.intelligence += 1;
    appendLog("You learn practical skills. Intelligence +1.");
    showBanner("success", "Intelligence +1.");
  }
  clampStats();
  checkForBurnout();
  nextSegment();
}

function canApplyFastFood() {
  if (player.jobCooldownDays > 0) return false;
  return (
    player.workEthic >= 4 &&
    player.intelligence >= 6 &&
    player.charm >= 2 &&
    player.hygiene >= 40
  );
}

function doApplyJob() {
  if (collapseIfCostsWouldKill("apply for the job", 10, 5)) return;

  if (player.jobCooldownDays > 0) {
    showBanner("error", "The manager won't rehire you yet.");
    appendLog("You ask about getting your job back, but they tell you to come back in a few more days.");
    return;
  }

if (player.jobAppliedToday) {
  showBanner("error", "You already applied today.");
  appendLog("You already asked today. You'll have to try again tomorrow.");
  return;
}

  if (!canApplyFastFood()) {
    showBanner("error", "You’re not quite ready yet.");
    appendLog("<strong>Fast Food Requirements:</strong> WE 4, INT 6, CH 2, Hygiene 40+. (Hope affects your chances, but won't block you.)");
    return;
  }

// ✅ mark attempt used for the day (success OR fail)
player.jobAppliedToday = true;

  // Applying takes your morning, but shouldn't count as a no-show.
  excuseMorningIfNeeded();

  adjustHunger(-5);
  player.energy -= 10;
  addHope(+1);

  let chance = 0.11;
  if (player.hygiene < 50) chance -= 0.1;
  if (player.charm >= 2) chance += 0.1;
  if (player.hope >= 2) chance += 0.05;
  if (player.hope <= -2) chance -= 0.1;
  chance = clamp(chance, 0.1, 0.65);

  const r = Math.random();
  if (r < chance) {
    player.hasFastFoodJob = true;
    player.hiredDay = player.day;
    player.jobCooldownDays = 0;
    appendLog("<strong>You got the fast food job!</strong> It’s your first steady income.");
    showBanner("success", "You were hired!");

    // Job expectations popup (first hire vs rehire)
// IMPORTANT: we wait to advance the segment until the player closes the popup
if (!player.everHadJob) {
  player.everHadJob = true;
  openMessageOverlay(
    "First Day",
    "Welcome to the team.<br><br>Here’s what we expect:<br>• Show up for your shifts<br>• Do the work<br>• Look presentable (hygiene above <strong>40</strong>)<br><br>Miss too much and you’ll get warnings.<br><strong>3 warnings in a week</strong> means you’re let go.<br><br>Good luck.",
    "Got it",
    () => {
      clampStats();
      checkForBurnout();
      nextSegment();
    }
  );
} else {
  openMessageOverlay(
    "Back Again",
    "Welcome back.<br><br>You know the expectations:<br>• Show up for your shifts<br>• Keep your hygiene above <strong>40</strong><br><br>Let’s try to make it work this time.",
    "Understood",
    () => {
      clampStats();
      checkForBurnout();
      nextSegment();
    }
  );
}
return;
} else {
    addHope(-2);
    appendLog("They went with someone else this time. You can try again later.");
    showBanner("error", "Job denied.");
  }
  clampStats();
  checkForBurnout();
  nextSegment();
}

function doWorkShift() {
  // Hygiene warning only triggers if you show up to work with low hygiene.
  applyHygieneWarningIfNeeded();
  if (!player.hasFastFoodJob) return;

  // Sundays are always off.
  if (player.weekDayIndex === 6) {
    showBanner("error", "No shifts on Sunday.");
    appendLog("It's Sunday. The shop is closed — no shifts today.");
    return;
  }

  let wage;
  if (!player.isShiftLead) {
    wage = Math.floor(Math.random() * 9) + 26; // 26–34
  } else {
    wage = Math.floor(Math.random() * 12) + 33; // 33–44
  }
  player.money += wage;

  adjustHunger(-30);
  player.energy -= 45;
  // Working is grimy. (Increased hygiene impact by +4)
  player.hygiene -= player.isShiftLead ? 19 : 22;
  // Working doesn't instantly fix morale; hope settles after sleep.
  addHope(0);
  player.shiftsWorked += 1;
  player.workedThisMorning = true;

  clampStats();
  appendLog("You work a full shift and earn <strong>$" + wage + "</strong>.");
  showBanner("success", "Shift complete: +$" + wage + ".");

  // takes entire day
  player.segmentIndex = 3;
  checkForBurnout();
  // Possible coworker beat (post-shift modal before sleep selection)
  const openedTim = maybeTriggerTimEvent("work");
  if (!openedTim) {
    updateUI();
  }
}

// --- PROMOTION ---
function meetsPromoRequirements() {
  const reasons = [];
  if (player.workEthic < 7) reasons.push("• Work Ethic 7 needed.");
  if (player.intelligence < 12) reasons.push("• Intelligence 12 needed.");
  if (player.charm < 4) reasons.push("• Charm 4 needed.");
  if (player.fitness < 10) reasons.push("• Fitness 10 needed.");
  if (effectiveHope() < 0) reasons.push("• Hope needs to be at least 'Hanging On'.");
  if (player.hygiene < 45) reasons.push("• Hygiene 45+ needed.");
  if (player.energy < 40) reasons.push("• Energy 40+ needed.");
  if (player.shiftsWorked < 6) reasons.push("• Need at least 6 shifts. Currently " + player.shiftsWorked + ".");
  if (player.promoCooldownDays > 0) reasons.push("• Wait " + player.promoCooldownDays + " more day(s) to try again.");
  return { ok: reasons.length === 0, reasons };
}

function doAskPromotion() {
  if (collapseIfCostsWouldKill("ask for a promotion", 8, 4)) return;

  if (!player.hasFastFoodJob) {
    showBanner("error", "You need the job first.");
    appendLog("You can’t ask for a promotion without having the job.");
    return;
  }
  if (player.isShiftLead) {
    showBanner("error", "You’re already Shift Lead.");
    appendLog("You’re already a Shift Lead here.");
    return;
  }
  const check = meetsPromoRequirements();
  if (!check.ok) {
    showBanner("error", "Not ready for promotion yet.");
    appendLog("<strong>Shift Lead Requirements:</strong> WE 7, INT 12, CH 4, FIT 10, Hope ≥ 'Hanging On', Hygiene 45+, Energy 40+, 6+ shifts.");
    appendLog(check.reasons.join("<br>"));
    return;
  }

  // Asking for a promotion takes your morning, but shouldn't count as a no-show.
  excuseMorningIfNeeded();

  adjustHunger(-4);
  player.energy -= 8;

  const roll = player.workEthic + player.charm + effectiveHope() + Math.floor(Math.random() * 4);
  const difficulty = 8;
  if (roll >= difficulty) {
    player.isShiftLead = true;
    addHope(+2);
    appendLog("<strong>You’re promoted to Shift Lead!</strong> You earn more each shift.");
    showBanner("success", "Promotion! You are now Shift Lead.");
  } else {
    addHope(-1);
    player.promoCooldownDays = 2;
    appendLog("Your manager says you’re not quite ready. You can try again in a few days.");
    showBanner("error", "Promotion denied.");
  }
  clampStats();
  checkForBurnout();
  nextSegment();
}

// --- ONE-TIME BOOSTS ---
function doSnack() {
  if (!player.snackAvailable) return;
  player.snackAvailable = false;
  adjustHunger(+30);
  appendLog("You found a snack and eat it. Hunger +30.");
  showBanner("success", "Snack used");
  updateUI();
}
function doConvo() {
  if (!player.convoAvailable) return;
  player.convoAvailable = false;
  addHope(+3);
  appendLog("A kind conversation lifts your spirits.");
  showBanner("success", "Conversation used");
  updateUI();
}

// --- NIGHT ACTIONS ---
function doShelter() {
  const r = Math.random();
  if (r < 0.6) {
    adjustHunger(+10);
    player.energy = clamp(player.energy + 35, 0, 100);
    player.hygiene = clamp(player.hygiene + 12, 0, 100);
    addHope(-1);
    appendLog("You get into the shelter tonight. You eat, wash, and sleep indoors.");
    showBanner("success", "Shelter night.");
    player.lastSleep = "shelter_success";
  } else {
    appendLog("The shelter is full tonight. You end up outside after hours in line.");
    adjustHunger(-20);
    player.energy -= 5;
    player.hygiene -= 20;
    addHope(-3);
    if (player.money > 0 && Math.random() < 0.1) {
      const stolen = Math.min(player.money, Math.floor(Math.random() * 3) + 1);
      player.money -= stolen;
      appendLog("In the chaos, you realize <strong>$" + stolen + "</strong> is missing.");
    }
    showBanner("error", "Shelter was full.");
    player.lastSleep = "shelter_fail";

    // Guaranteed Eli beat: first shelter fail only (shows at end-of-day)
    if (!player.eliShelterFailBeatShown && !player.hasApartment) {
      player.eliShelterFailBeatShown = true;

      // Mark an Eli event occurred today so reflection doesn't stack
      player.eliLastEventDay = player.day;

      let line = null;
      if (!player.eliIntroduced) {
        if (player.eliMentions < 3 && player.motelNights === 0) {
          line = ELI_VAGUE_LINES[player.eliMentions % ELI_VAGUE_LINES.length];
          player.eliMentions += 1;
          queueModal("Someone Nearby", line, "OK");
        } else {
          line = pick(ELI_INTRO_LINES);
          player.eliIntroduced = true;
          queueModal("A Brief Moment", line, "OK");
        }
      } else {
        line = pick(ELI_NAMED_LINES);
        queueModal("Eli", line, "OK");
      }

      if (line) appendLog(line);
    }
  }
  clampStats();
  checkForBurnout();
  nextSegment();
}

function doStreetSleep() {
  appendLog("You sleep on the street. It’s rough and cold.");
  adjustHunger(-15);
  player.energy = clamp(player.energy + 20, 0, 100);
  player.hygiene -= 15;
  addHope(-2);
  showBanner("error", "Street sleep. Rough night.");
  player.lastSleep = "street";
  clampStats();
  checkForBurnout();
  maybeTriggerEliEvent("sleep");
  nextSegment();
}

function doMotel() {
  if (player.money < 15) {
    showBanner("error", "Not enough money for a motel.");
    appendLog("You think about a motel, but you can’t afford it.");
    return;
  }
  player.money -= 15;
  adjustHunger(+10);
  player.energy = clamp(player.energy + 35, 0, 100);
  // Motel helps, but only restores 15 Hygiene now.
  player.hygiene = clamp(player.hygiene + 15, 0, 100);
  // Motel is neutral emotionally: it helps you stabilize without directly changing hope.
  player.motelNights += 1;
  appendLog("You stay in a cheap motel. You rest and clean up.");
  showBanner("success", "Motel night.");
  player.lastSleep = "motel";
  clampStats();
  checkForBurnout();
  nextSegment();
}

// Apartment sleep
function doApartmentSleep() {
  appendLog("You sleep in your small apartment. It's not glamorous, but it's yours.");
  player.energy = clamp(player.energy + 30, 0, 100);
  player.hygiene = clamp(player.hygiene + 10, 0, 100);
  addHope(+1);
  player.lastSleep = "apartment";
  clampStats();
  checkForBurnout();
  nextSegment();
}

// --- GET APARTMENT ---
function canRentApartment() {
  if (!player.hasFastFoodJob) return false;
  if (player.money < APARTMENT_DEPOSIT) return false;
  return true;
}

function doRentApartment() {
  if (!canRentApartment()) {
    showBanner("error", "You’re not ready for an apartment yet.");
    appendLog("<strong>Apartment Requirements:</strong> Fast food job and $" + APARTMENT_DEPOSIT + " (2x rent) for deposit.");
    return;
  }

  // V1 HARD STOP: securing an apartment ends the run.
  player.money -= APARTMENT_DEPOSIT;
  player.hasApartment = true;
  player.chapterEnded = true;
  updateUI();

  appendLog("<strong>You sign a lease and move into a tiny apartment.</strong>");
  showBanner("success", "You moved into an apartment!");

  clampStats();
  closeOverlay();

  // Clear any saved progress so "Continue" can't jump past the chapter ending.
  // (Players can still restart immediately from the end card.)
  clearSave();

  openMessageOverlay("Stability", REFLECT_APT_ENDING, "End Chapter", () => {
    appendLog("<strong>Ending:</strong> " + REFLECT_APT_ENDING);
    // Freeze gameplay for V1 (chapter end)
    actionsGrid.innerHTML = "";
    closeOverlay();
    openEndCardOverlay();
  });
}

// --- SIDE GIG: COOKING ---
function getCookingEnergyCost() {
  // 100 minus Fitness, but always at least 10
  return clamp(100 - player.fitness, 10, 100);
}

function getCookingTimeCostSegments() {
  if (player.fitness < 35) return 3; // rest of day
  if (player.fitness < 70) return 2;
  return 1;
}

function getCookingTimeCostText() {
  const segs = getCookingTimeCostSegments();
  if (segs >= 3) return "Rest of day";
  return segs + (segs === 1 ? " segment" : " segments");
}

function getCookingEarnings() {
  // Earnings scale purely from effort + skill
  return 2 * player.workEthic + player.intelligence;
}

function openSideGigPanel() {
  openOverlay("sidegig", () => {
    const energyCost = getCookingEnergyCost();
    const timeCostText = getCookingTimeCostText();
    const earnings = getCookingEarnings();
    const net = earnings - COOKING_SUPPLY_COST;
    const energySafe = player.energy >= energyCost;

    return `
      <div class="sidegig-panel">
        <div class="panel-header">
          <div class="panel-title">Side Gig: Cooking</div>
          <div class="panel-sub">Turn your skills into extra cash. Costs energy and $${COOKING_SUPPLY_COST} for supplies.</div>
        </div>
        <div class="panel-row">
          <span class="panel-label">Energy Cost</span>
          <span class="panel-value">${energyCost} (100 - FIT, min 10)</span>
        </div>
        <div class="panel-row">
          <span class="panel-label">Time Cost</span>
          <span class="panel-value">${timeCostText} (based on Fitness)</span>
        </div>
        <div class="panel-row">
          <span class="panel-label">Earnings Formula</span>
          <span class="panel-value">2×WE + INT</span>
        </div>
        <div class="panel-row">
          <span class="panel-label">Expected Earnings</span>
          <span class="panel-value">$${earnings}</span>
        </div>
        <div class="panel-row">
          <span class="panel-label">Net Profit</span>
          <span class="panel-value">$${net} (after supplies)</span>
        </div>
        <div class="panel-row">
          <span class="panel-label">Hope Boost</span>
          <span class="panel-value">+WE (${player.workEthic})</span>
        </div>
        <div class="panel-buttons">
          <button class="panel-btn primary" id="cookNowBtn" ${(!energySafe || player.money < COOKING_SUPPLY_COST) ? "disabled" : ""}>
            Cook Today (-$${COOKING_SUPPLY_COST})
          </button>
          <button class="panel-btn" id="sideBackBtn">Back</button>
        </div>
        <div class="text-muted">
          Cooking uses your fitness to reduce energy cost and your Work Ethic/Intelligence to increase income.
        </div>
      </div>
    `;
  });

  // Wire up buttons
  const cookBtn = document.getElementById("cookNowBtn");
  const backBtn = document.getElementById("sideBackBtn");
  if (cookBtn) {
    cookBtn.onclick = () => {
      doCookingAction();
    };
  }
  if (backBtn) {
    backBtn.onclick = () => {
      closeOverlay();
      updateUI();
    };
  }
}

function doCookingAction() {
  const energyCost = getCookingEnergyCost();
  if (player.money < COOKING_SUPPLY_COST) {
    showBanner("error", "You can't afford ingredients right now.");
    appendLog("You consider cooking, but you don't have enough money for supplies.");
    return;
  }
  if (player.energy < energyCost) {
    showBanner("error", "You’re too exhausted to cook.");
    appendLog("You try to psych yourself up to cook, but you're too exhausted.");
    return;
  }

  player.money -= COOKING_SUPPLY_COST;
  player.energy = clamp(player.energy - energyCost, 0, 100);
  const earnings = getCookingEarnings();
  player.money += earnings;
  const hopeGain = player.workEthic >= 4 ? 2 : (player.workEthic >= 2 ? 1 : 0);
  if (hopeGain !== 0) addHope(hopeGain);

  appendLog(`You cook and sell meals from your tiny kitchen. You earn <strong>$${earnings}</strong> and feel your effort paying off.`);
  showBanner("success", `Side gig earned $${earnings}. Net +$${earnings - COOKING_SUPPLY_COST}.`);

  clampStats();
  checkForBurnout();

  // Time cost scales with Fitness:
  // - FIT < 35: takes the rest of the day (advances to Night)
  // - 35 <= FIT < 70: takes 2 segments (but never auto-skips Night)
  // - FIT >= 70: takes 1 segment
  if (player.fitness < 35) {
    while (player.segmentIndex < 3) nextSegment();
  } else if (player.fitness < 70) {
    // up to 2 segments, but stop once it's Night
    if (player.segmentIndex < 3) nextSegment();
    if (player.segmentIndex < 3) nextSegment();
  } else {
    nextSegment();
  }
}

// --- COMPUTER / TRAINING ---
function doBuyComputer() {
  const cost = 150;
  if (player.hasComputer) {
    showBanner("error", "You already own a computer.");
    return;
  }
  if (player.money < cost) {
    showBanner("error", "You can't afford a computer yet.");
    appendLog("You look at used laptops online, but you can't afford one yet.");
    return;
  }
  player.money -= cost;
  player.hasComputer = true;
  appendLog("You buy a cheap used laptop. It’s not flashy, but it works.");
  showBanner("success", "You bought a computer.");
  updateUI();
}

function doComputerTraining() {
  if (!player.hasComputer) {
    showBanner("error", "You need a computer first.");
    return;
  }
  if (player.energy < 10) {
    showBanner("error", "You're too tired for computer work.");
    appendLog("You try to study, but your eyes just won't focus.");
    return;
  }

  player.energy = clamp(player.energy - 10, 0, 100);

  // 40% INT, 30% WE, 30% CH
  const r = Math.random();
  if (r < 0.4) {
    player.intelligence += 1;
    appendLog("You complete an online course. Intelligence +1.");
    showBanner("success", "Computer study: INT +1.");
  } else if (r < 0.7) {
    player.workEthic += 1;
    appendLog("You build a consistent online study habit. Work Ethic +1.");
    showBanner("success", "Computer study: WE +1.");
  } else {
    player.charm += 1;
    appendLog("You practice communication and networking online. Charm +1.");
    showBanner("success", "Computer study: CH +1.");
  }

  clampStats();
  checkForBurnout();
  nextSegment();
}

// --- RECREATION MENU ---
function openRecreationPanel() {
  openOverlay("recreation", () => {
    return `
      <div class="recreation-panel">
        <div class="panel-header">
          <div class="panel-title">Recreation</div>
          <div class="panel-sub">Spend time and money to restore Hope and Energy.</div>
        </div>
        <div class="rec-list">
          <div class="rec-item"><span>Go Fishing</span><span>-$${
            REC_FISH_COST
          }, +${REC_FISH_ENERGY} Energy, +${REC_FISH_HOPE} Hope</span></div>
          <div class="rec-item"><span>Go to the Movies</span><span>-$${
            REC_MOVIE_COST
          }, +${REC_MOVIE_ENERGY} Energy, +${REC_MOVIE_HOPE} Hope</span></div>
          <div class="rec-item"><span>Short Vacation</span><span>-$${
            REC_VACATION_COST
          }, Full Energy, +${REC_VACATION_HOPE} Hope</span></div>
        </div>
        <div class="panel-buttons">
          <button class="panel-btn" id="fishBtn">Go Fishing</button>
          <button class="panel-btn" id="movieBtn">Go to Movies</button>
          <button class="panel-btn" id="vacBtn">Take Vacation</button>
          <button class="panel-btn" id="recBackBtn">Back</button>
        </div>
        <div class="text-muted">
          Recreation is easier once you have an apartment. These all consume a segment of your day.
        </div>
      </div>
    `;
  });

  const fishBtn = document.getElementById("fishBtn");
  const movieBtn = document.getElementById("movieBtn");
  const vacBtn = document.getElementById("vacBtn");
  const backBtn = document.getElementById("recBackBtn");

  if (fishBtn) fishBtn.onclick = doFishing;
  if (movieBtn) movieBtn.onclick = doMovies;
  if (vacBtn) vacBtn.onclick = doVacation;
  if (backBtn) backBtn.onclick = () => {
    closeOverlay();
    updateUI();
  };
}

function doFishing() {
  if (player.money < REC_FISH_COST) {
    showBanner("error", "You can’t afford to go fishing.");
    appendLog("You think about going fishing, but don't have enough for bait and travel.");
    return;
  }
  player.money -= REC_FISH_COST;
  player.energy = clamp(player.energy + REC_FISH_ENERGY, 0, 100);
  addHope(+1);

  appendLog("You spend some time fishing at a nearby river. The quiet helps you reset a bit.");
  showBanner("success", "Fishing: Energy +" + REC_FISH_ENERGY + ".");
  clampStats();
  checkForBurnout();
  nextSegment();
}

function doMovies() {
  if (player.money < REC_MOVIE_COST) {
    showBanner("error", "You can’t afford the movies.");
    appendLog("You check showtimes, but the ticket and snacks are out of reach today.");
    return;
  }
  player.money -= REC_MOVIE_COST;
  player.energy = clamp(player.energy + REC_MOVIE_ENERGY, 0, 100);
  addHope(+2);

  appendLog("You go to the movies, get lost in the story, and forget your stress for a while.");
  showBanner("success", "Movies: Energy +" + REC_MOVIE_ENERGY + ".");
  clampStats();
  checkForBurnout();
  nextSegment();
}

function doVacation() {
  if (player.money < REC_VACATION_COST) {
    showBanner("error", "You can’t afford a vacation.");
    appendLog("You daydream about a weekend away, but your bank account says no—for now.");
    return;
  }
  player.money -= REC_VACATION_COST;
  player.energy = 100;
  addHope(+3);

  appendLog("You take a short getaway. New scenery and rest recharge you deeply.");
  showBanner("success", "Vacation: Full Energy.");
  clampStats();
  checkForBurnout();
  nextSegment();
}

// --- LOTTERY TICKET ---
function openLotteryPanel() {
  if (player.money < 10) {
    showBanner("error", "You can't afford a lottery ticket ($10).");
    appendLog("You consider buying a lottery ticket, but you don't have enough money.");
    return;
  }

  // Pay upfront
  player.money -= 10;

  // Reset lottery state
  lotteryTarget = LOTTERY_ANIMALS[Math.floor(Math.random() * LOTTERY_ANIMALS.length)];
  lotterySlots = [null, null, null];
  lotteryRevealed = 0;
  lotteryFinished = false;

  openOverlay("lottery", () => {
    return `
      <div class="lottery-panel">
        <div class="panel-header">
          <div class="panel-title">Scratch-Off Ticket</div>
          <div class="lottery-odds">
            Match 1 = $20 • Match 2 = $100 • Match 3 = $500<br />
            Cost: $10. Your target animal is shown below.
          </div>
        </div>
        <div class="lottery-target-row">
          <span class="lottery-label">Your Animal</span>
          <span class="lottery-target">${lotteryTarget}</span>
        </div>
        <div class="lottery-slots">
          <button class="lottery-slot" data-slot="0">?</button>
          <button class="lottery-slot" data-slot="1">?</button>
          <button class="lottery-slot" data-slot="2">?</button>
        </div>
        <div id="lotteryResult" class="lottery-footer">
          Tap each slot to reveal. After all three, tap Back to continue your day.
        </div>
        <div class="panel-buttons">
          <button class="panel-btn" id="lotteryBackBtn" disabled>Back</button>
        </div>
      </div>
    `;
  });

  const slotButtons = overlayPanel.querySelectorAll(".lottery-slot");
  slotButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-slot"), 10);
      revealLotterySlot(index, btn);
    });
  });

  const backBtn = document.getElementById("lotteryBackBtn");
  if (backBtn) {
    backBtn.onclick = () => {
      if (!lotteryFinished) return;
      // Once finished and the player presses Back, consume the segment
      nextSegment();
    };
  }

  updateUI(); // reflect -$10
}

function revealLotterySlot(index, btn) {
  if (lotterySlots[index] !== null || lotteryFinished) return;

  const symbol = LOTTERY_ANIMALS[Math.floor(Math.random() * LOTTERY_ANIMALS.length)];
  lotterySlots[index] = symbol;
  lotteryRevealed += 1;

  btn.textContent = symbol;
  btn.classList.add("revealed");

  if (lotteryRevealed === 3) {
    resolveLottery();
  }
}

function resolveLottery() {
  const resultEl = document.getElementById("lotteryResult");
  const backBtn = document.getElementById("lotteryBackBtn");
  const matches = lotterySlots.filter(s => s === lotteryTarget).length;

  let payout = 0;
  let message = "";

  if (matches === 3) {
    payout = 500;
    addHope(+3);
    message = "Jackpot! All three match your animal. You win $500 and feel completely renewed.";
  } else if (matches === 2) {
    payout = 100;
    addHope(+2);
    message = "Nice! Two matches. You win $100 and feel a big surge of hope.";
  } else if (matches === 1) {
    payout = 20;
    addHope(+1);
    message = "You get one match. You win $20 and feel a bit more hopeful.";
  } else {
    payout = 0;
    addHope(-1);
    message = "No matches. You lose this one and feel your hope dip.";
  }

  if (payout > 0) {
    player.money += payout;
    showBanner("success", "Lottery win: $" + payout + ".");
  } else {
    showBanner("error", "Lottery loss: -$10. Rough.");
  }

  appendLog("<strong>Lottery result:</strong> " + message);
  clampStats();

  if (resultEl) {
    resultEl.textContent = message + " Tap Back to continue.";
  }
  if (backBtn) {
    backBtn.disabled = false;
  }
  lotteryFinished = true;

  // We do NOT advance the segment here; that happens when Back is pressed
  updateUI();
}

// --- RENDER ACTIONS ---
function renderActions() {
  actionsGrid.innerHTML = "";
  if (checkGameOver()) return;

  const segName = segments[player.segmentIndex];
  const isBurnoutDay = player.hasApartment && player.burnoutDaysRemaining > 0;

  function btn(label, sub, fn, primary, tooltip, disabledReason) {
  const b = document.createElement("button");
  b.className = "action-btn" + (primary ? " primary" : "");
  b.innerHTML =
    "<span class=\"label\">" + label + "</span>" +
    "<span class=\"sub\">" + sub + "</span>" +
    "<span class=\"info-icon\" role=\"button\" tabindex=\"0\" aria-label=\"Info\">i</span>";

  const tipText = (disabledReason ? disabledReason : (tooltip || sub || "")).trim();

  if (disabledReason) {
    b.classList.add("disabled");
    b.setAttribute("aria-disabled", "true");
  }

  // Info icon opens tooltip without triggering the action
  const infoEl = b.querySelector(".info-icon");
  if (infoEl) {
    infoEl.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showTooltip(tipText || "No details available.");
    });
    infoEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        showTooltip(tipText || "No details available.");
      }
    });
  }

  // Button executes immediately
  b.addEventListener("click", (e) => {
    e.preventDefault();
    if (disabledReason) {
      showTooltip(tipText || "This action isn't available right now.");
      return;
    }
    hideTooltip();
    fn();
  });

  actionsGrid.appendChild(b);
}



  // Night: different if you have an apartment
  if (segName === "Night") {
    if (player.hasApartment) {
      btn(
        "Sleep in Apartment",
        "Recover overnight",
        doApartmentSleep,
        true,
        "Gain: +30 Energy, +10 Hygiene, +1 Hope. Time: Night."
      );
    } else {
      btn(
        "Try Shelter",
        "Chance at safe sleep",
        doShelter,
        true,
        "60%: Gain +35 Energy, +12 Hygiene, +10 Hunger. Hope: -1.\n40% (full): -5 Energy, -20 Hygiene, -20 Hunger. Hope: -3.\nAlso: ~10% chance of theft if you have cash."
      );
      btn(
        "Sleep on Street",
        "Rough, but predictable",
        doStreetSleep,
        false,
        "Gain: +20 Energy. Costs: -15 Hunger, -15 Hygiene, -2 Hope. Time: Night."
      );
      if (player.money >= 15) {
        btn(
          "Stay in Motel ($15)",
          "Guaranteed safe sleep",
          doMotel,
          false,
          "Cost: $15. Gain: +35 Energy, +15 Hygiene, +10 Hunger. Hope: -1. Time: Night."
        );
      } else {
        // Keep layout stable: show motel option disabled when unaffordable
        btn(
          "Stay in Motel ($15)",
          "Not enough cash",
          () => {},
          false,
          "Cost: $15. Gain: +35 Energy, +15 Hygiene, +10 Hunger. Hope: -1. Time: Night.",
          "You need $15 to stay in a motel."
        );
      }
      if (canRentApartment()) {
        btn(
          "Rent Apartment ($" + APARTMENT_DEPOSIT + ")",
          "Move in and end run",
          doRentApartment,
          false,
          "Cost now: $" + APARTMENT_DEPOSIT + " deposit. Ongoing: $" + APARTMENT_RENT + "/week rent. Ends the run (V1 hard stop)."
        );
      }
    }
    return;
  }

  // Burnout restriction (apartment tier): no daytime actions—you're just trying to make it to sleep.
  if (isBurnoutDay) {
    btn("Collapse", "You can't do anything but sleep tonight", () => {
      appendLog("You're too exhausted to function. The hours blur by until night.");
      // Burnout skipping the day should still count as missing work when the morning passes.
      // Uses the same rules as the normal morning-pass check.
      recordMorningPassIfNoWork(player.segmentIndex);
      player.segmentIndex = 3;
      closeOverlay();
      updateUI();
    }, true);
    return;
  }

  // Morning + daytime actions
  // Keep button layout stable: reserve the Work slot even before you have a job.
  if (!player.hasFastFoodJob) {
    btn("Work Shift", "Need a job", () => {}, true,
      "You need to be hired before you can work shifts.",
      "You need a job to work shifts.");
  }

  if (player.hasFastFoodJob) {
    if (player.weekDayIndex === 6) {
      // Sunday = guaranteed day off
      if (segName === "Morning") {
        btn("Day Off (Sunday)", "No shifts today", () => {
          showBanner("", "Sunday off — use the day to recover or train.");
        }, true);
      } else {
        // Keep layout stable after morning passes
        btn("Day Off (Sunday)", "(Sunday)", () => {}, true,
          "It's Sunday — no shift today.", "It's Sunday — no shift today.");
      }
    } else {
      // Weekday: work is only available in the Morning, but we keep a disabled placeholder
      // later in the day so buttons don't jump around.
      if (segName === "Morning") {
        btn(player.isShiftLead ? "Work Lead Shift" : "Work Fast Food Shift",
            "Takes all day, good pay", doWorkShift, true,
            (player.isShiftLead
              ? "Work a lead shift. Earn $33–$44. Costs: -30 Hunger, -45 Energy, -19 Hygiene. Takes the whole day."
              : "Work a shift. Earn $26–$34. Costs: -30 Hunger, -45 Energy, -22 Hygiene. Takes the whole day."));
      } else {
        if (player.workedThisMorning) {
          btn(player.isShiftLead ? "Work Lead Shift" : "Work Fast Food Shift",
              "(completed)", () => {}, true,
              "You already worked today.", "You already worked today.");
        } else {
          btn(player.isShiftLead ? "Work Lead Shift" : "Work Fast Food Shift",
              "(missed work)", () => {}, true,
              "You can only start your shift in the Morning. Missing work counts. Come back tomorrow morning.",
              "You can only start your shift in the Morning. Missing work counts. Come back tomorrow morning.");
        }
      }
    }
  }

  // Tier 1 core street tools visible until you have an apartment
  if (!player.hasApartment) {
    btn("Pick Up Trash", "Small $, tiring, hope hit", doTrash, !player.hasFastFoodJob, "Gain $2–$6. Costs: -12 Hunger, -16 Energy, -10 Hygiene, -1 Hope. Time: 1 segment.");
    btn("Beg", "Unreliable cash, emotional cost", doBeg, false, "Random $0–$5 (Hope affects odds). Costs: -7 Hunger, -8 Energy, -3 Hygiene. Hope: -1 if $0, +1 otherwise. Time: 1 segment.");
    btn("Eat ($4)", "Restore hunger & a bit of hope", doEat, false, "Costs $4. Gain: +25 Hunger, +6 Energy, +1 Hope. Also: -3 Hygiene. Time: 1 segment.");
    btn("Wash Up", "Public restroom, free hygiene", doWash, false, "Gain: +15 Hygiene. Costs: -2 Hunger, -4 Energy. Time: 1 segment.");
    btn("Take a Nap", "Recover some energy", doNap, false, "Gain: +20 Energy. Costs: -5 Hunger, -2 Hygiene. Time: 1 segment.");
    btn("Library", "Study, +Int & Hope", doLibrary, false, "Gain: +1 Intelligence, +1 Hope. Costs: -6 Hunger, -10 Energy, -3 Hygiene. Time: 1 segment.");
    btn("Gym", "Exercise, +Fitness", doGym, false, "Gain: +1 Fitness. Costs: -12 Hunger, -20 Energy, -12 Hygiene. Time: 1 segment.");
    btn("Job Center ($10)", "Boost stats & big Hope", doJobCenter, false, "Costs $10. Gain: +2 Hope. Costs: -6 Hunger, -12 Energy. Plus: random +1 (Work Ethic OR Charisma OR Intelligence). Time: 1 segment.");
  } else {
    // Apartment daytime: keep some tools, but not street-only ones
    btn("Library", "Study, +Int & Hope", doLibrary, false, "Gain: +1 Intelligence, +1 Hope. Costs: -6 Hunger, -10 Energy, -3 Hygiene. Time: 1 segment.");
    btn("Gym", "Exercise, +Fitness", doGym, false, "Gain: +1 Fitness. Costs: -12 Hunger, -20 Energy, -12 Hygiene. Time: 1 segment.");
    btn("Rest", "Recover a little energy at home", doRest, false);
    btn("Wash Up", "Restore hygiene (important for work)", doWash, false);
    btn("Recreation...", "Fishing, Movies, Vacation", openRecreationPanel, false);
    {
    const segsNeeded = getCookingTimeCostSegments();
    const remaining = 3 - player.segmentIndex; // segments left before Night
    let disabledReason = "";
    if (player.segmentIndex >= 3) {
      disabledReason = "Too late to start a side gig tonight.";
    } else if (segsNeeded === 2 && remaining < 2) {
      disabledReason = "Not enough time left today — cooking takes 2 segments (based on Fitness).";
    } else if (segsNeeded === 1 && remaining < 1) {
      disabledReason = "Not enough time left today.";
    } else if (segsNeeded >= 3 && remaining < 1) {
      disabledReason = "Not enough time left today.";
    }
    btn("Side Gig: Cooking...", "Cook for extra cash", openSideGigPanel, false,
        "Costs $10 + energy. Time: " + getCookingTimeCostText() + ".",
        disabledReason || null);
  }
    if (!player.hasComputer) {
      btn("Buy Computer ($150)", "Unlock online training", doBuyComputer, false);
    } else {
      btn("Use Computer", "Train WE / INT / CH (Energy -10)", doComputerTraining, false);
    }
  }

if (!player.hasFastFoodJob) {
  const alreadyApplied = player.jobAppliedToday;
  btn(
    "Apply: Fast Food Job",
    alreadyApplied ? "(already applied today)" : "Req: WE4, INT6, CH2, HY40+. Hope affects odds",
    doApplyJob,
    false,
    "Attempts to get hired. Requirements: Work Ethic ≥4, Intelligence ≥6, Charisma ≥2, Hygiene ≥40. If rejected, you must wait until tomorrow to apply again. Time: 1 segment.",
    alreadyApplied ? "You already applied today. Try again tomorrow." : null
  );
}

  if (player.hasFastFoodJob && !player.isShiftLead) {
    btn("Ask for Promotion", "Req: WE7, INT12, CH4, FIT10, Hope≥Hanging On, HY45+, EN40+, 6+ shifts", doAskPromotion, false);
  }

  // Lottery always available
  btn("Lottery Ticket ($10)", "Tiny chance at big win", openLotteryPanel, false);

}

// --- INIT ---

function resetRun() {
  // Hard reset (no save)
  gameOverShown = false;
  // reset all fields by reloading the page (simple + reliable for v1)
  clearSave();
  location.reload();
}
function startRun() {
  gameStarted = true;
  appendLog("<strong>Day 1</strong> begins. Morning.");
  updateUI();
  queueSave();
}

function continueRun() {
  gameStarted = true;
  updateUI();
  showBanner("", "Welcome back.");
}

function openStartMenu() {
  const canContinue = hasSave();
  openOverlay("start", () => {
    return `
      <div class="sidegig-panel">
        <div class="panel-header">
          <div class="panel-title">${GAME_TITLE}</div>
          <div class="panel-sub">${OPENING_LINES.join("<br>")}</div>
        </div>
        <div class="panel-actions">
          <button class="panel-button primary" id="startNewBtn" type="button">New Game</button>
          ${canContinue ? '<button class="panel-button" id="continueBtn" type="button">Continue</button>' : ''}
        </div>
      </div>
    `;
  });

  const startBtn = overlayPanel.querySelector("#startNewBtn");
  if (startBtn) startBtn.addEventListener("click", () => {
    closeOverlay();
    clearSave();
    softRestartRun();
  });

  const contBtn = overlayPanel.querySelector("#continueBtn");
  if (contBtn) contBtn.addEventListener("click", () => {
    const ok = loadGame();
    closeOverlay();
    if (ok) {
      continueRun();
    } else {
      // If the save is corrupt or unavailable, fall back to new run.
      clearSave();
      softRestartRun();
    }
  });
}

// Opening scene (shown once on load)
(function boot() {
  try { document.title = GAME_TITLE; } catch (e) {}

  // Title screen (separate from gameplay)
  if (gameShell) gameShell.classList.add("hidden");

  // 1.5s studio splash (once per app launch)
  const splashScreen = document.getElementById("splashScreen");
  const splashAlreadyShown = (() => {
    try { return sessionStorage.getItem("afsSplashShown") === "1"; } catch (e) { return false; }
  })();

  if (splashScreen && !splashAlreadyShown) {
    try { sessionStorage.setItem("afsSplashShown", "1"); } catch (e) {}
    splashScreen.classList.remove("hidden");
    if (titleScreen) titleScreen.classList.add("hidden");
    window.setTimeout(() => {
      splashScreen.classList.add("hidden");
      if (titleScreen) titleScreen.classList.remove("hidden");
    }, 1500);
  } else {
    if (titleScreen) titleScreen.classList.remove("hidden");
  }

  const startBtn = document.getElementById("titleStartBtn");
  const continueBtn = document.getElementById("titleContinueBtn");
  const discordBtn = document.getElementById("titleDiscordBtn");
  const howToTitleBtn = document.getElementById("titleHowToBtn");
  const creditsTitleBtn = document.getElementById("titleCreditsBtn");
  const howToInGameBtn = document.getElementById("howToBtn");

  // Continue only if save exists
  if (continueBtn) {
    const canContinue = hasSave();
    continueBtn.style.display = canContinue ? "" : "none";
  }

  if (discordBtn) {
    discordBtn.addEventListener("click", () => {
      if (DISCORD_INVITE_URL) window.open(DISCORD_INVITE_URL, "_blank", "noopener");
    });
  }

  if (howToTitleBtn) {
    howToTitleBtn.addEventListener("click", () => openHowToOverlay());
  }

  if (creditsTitleBtn) {
    creditsTitleBtn.addEventListener("click", () => openCreditsOverlay(() => {
      // stay on title screen
    }));
  }

  if (howToInGameBtn) {
    howToInGameBtn.addEventListener("click", () => openHowToOverlay());
  }


  if (startBtn) startBtn.addEventListener("click", () => {
    if (titleScreen) titleScreen.classList.add("hidden");
    if (gameShell) gameShell.classList.remove("hidden");
    closeOverlay();
    clearSave();
    softRestartRun();
  });

  if (continueBtn) continueBtn.addEventListener("click", () => {
    if (titleScreen) titleScreen.classList.add("hidden");
    if (gameShell) gameShell.classList.remove("hidden");
    closeOverlay();
    const ok = loadGame();
    if (ok) continueRun();
    else {
      clearSave();
      softRestartRun();
    }
  });
})();