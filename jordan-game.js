document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("#game-canvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const startButton = document.querySelector("#start-game");
  const restartButton = document.querySelector("#restart-stage");
  const pauseButton = document.querySelector("#pause-game");
  const soundButton = document.querySelector("#sound-toggle");
  const stageList = document.querySelector("#stage-list");
  const statusElement = document.querySelector("#game-status");
  const objectiveElement = document.querySelector("#objective-text");
  const stageDescription = document.querySelector("#stage-description");
  const stageName = document.querySelector("#stage-name");
  const canvasLocation = document.querySelector("#canvas-location");
  const fieldCode = document.querySelector("#field-code");
  const collectCount = document.querySelector("#collect-count");
  const healthValue = document.querySelector("#health-value");
  const waterValue = document.querySelector("#water-value");
  const healthBar = document.querySelector("#health-bar");
  const waterBar = document.querySelector("#water-bar");

  const world = { width: 960, height: 540 };
  const stages = [
    { key: "amman", colors: ["#8dc1bd", "#355c59", "#d9b780", "#263f40"], type: "city", hazard: { x: 590, y: 264, radius: 34 }, hint: "ammanHint" },
    { key: "jerash", colors: ["#98c4a0", "#365c48", "#d6c18a", "#284639"], type: "ruins", hazard: { x: 700, y: 205, radius: 34 }, hint: "jerashHint" },
    { key: "petra", colors: ["#dfa17c", "#835045", "#f0c08e", "#633d37"], type: "petra", hazard: { x: 370, y: 397, radius: 32 }, hint: "petraHint" },
    { key: "deadSea", colors: ["#e8c89a", "#9d7657", "#7bc4c2", "#426e72"], type: "shore", hazard: { x: 627, y: 328, radius: 36 }, hint: "deadSeaHint" },
    { key: "wadiRum", colors: ["#d88b69", "#9e4f3e", "#f0bb83", "#70392f"], type: "desert", hazard: { x: 572, y: 298, radius: 40 }, hint: "wadiHint" },
    { key: "aqaba", colors: ["#91c6c5", "#396c69", "#74c7db", "#235767"], type: "coast", hazard: { x: 740, y: 220, radius: 32 }, hint: "aqabaHint" }
  ];
  const copy = {
    ar: {
      names: ["عمّان", "جرش", "البتراء", "البحر الميت", "وادي رم", "العقبة"],
      statusReady: "جاهز للانطلاق",
      statusPlaying: "الرحلة مستمرة",
      statusPaused: "اللعبة متوقفة مؤقتاً",
      statusLost: "انتهت الرحلة — حاول مجدداً",
      statusWon: "اكتملت الرحلة — أحسنت!",
      start: "ابدأ الرحلة",
      resume: "متابعة",
      retry: "إعادة المرحلة",
      next: "ابدأ المرحلة التالية",
      pause: "إيقاف مؤقت",
      soundOn: "الصوت يعمل",
      soundOff: "الصوت متوقف",
      soundUnsupported: "الصوت غير مدعوم في هذا المتصفح.",
      soundBlocked: "تعذّر تشغيل الصوت. جرّب الضغط على زر الصوت مرة أخرى.",
      objective: "اركض واقفز فوق الفجوات والعقارب، واجمع الشواهد الثلاثة للوصول إلى خط النهاية.",
      count: (n) => `${n} / 3`,
      level: (n) => `المرحلة ${n + 1}`,
      locked: "مغلقة",
      collect: "جمعت شاهداً. أحسنت!",
      water: "وجدت ماءً إضافياً.",
      needArtifacts: "اجمع الشواهد الثلاثة أولاً.",
      stageClear: "اكتملت المرحلة! استعد للمحطة التالية.",
      gameClear: "أكملت الرحلة عبر الأردن كلها. فوز مستحق!",
      finalMessage: "انتهت رحلتك عبر الأردن! جمعت الشواهد وتخطّيت كل المراحل. مشوارك انتهى بنجاح.",
      gameOver: "انتهت صحتك. أعد المرحلة وحاول القفز فوق العقبات.",
      pauseMessage: "أوقفنا الرحلة مؤقتاً. خذ وقتك ثم تابع.",
      readyMessage: "تحرّك يميناً، اقفز فوق الفجوات والعقارب، واجمع الشواهد.",
      offTrail: "اقفز فوق الفجوات وتجنّب العقارب.",
      heat: "أُصبت! انتبه للعقارب والفجوات.",
      ammanHint: "اقفز فوق أسطح عمّان القديمة وتجنّب العقارب.",
      jerashHint: "اعبر أعمدة جرش وقفزات أطول بين الفجوات.",
      petraHint: "تجاوز فجوات السيق وعقارب البتراء السريعة.",
      deadSeaHint: "اقفز فوق المنحدرات قرب شاطئ البحر الميت.",
      wadiHint: "فجوات وادي رم أوسع والعقارب أسرع.",
      aqabaHint: "اقفز بحذر فوق المنصات الساحلية حتى النهاية.",
      canvasHint: "اجمع الشواهد الثلاثة ثم وصل إلى نقطة النهاية.",
      difficulty: (n) => `الصعوبة ${n + 1} من 6`,
      name: (n) => `المرحلة ${n + 1} · ${stages[n].key === "deadSea" ? "البحر الميت" : copy.ar.names[n]}`,
      ariaStage: (n) => `المرحلة ${n + 1}: ${copy.ar.names[n]}`,
      win: "فوز",
      lose: "خسارة"
    },
    en: {
      names: ["Amman", "Jerash", "Petra", "Dead Sea", "Wadi Rum", "Aqaba"],
      statusReady: "Ready to explore",
      statusPlaying: "Journey in progress",
      statusPaused: "Journey paused",
      statusLost: "Journey over — try again",
      statusWon: "Journey complete — well done!",
      start: "Start journey",
      resume: "Resume",
      retry: "Retry stage",
      next: "Start next stage",
      pause: "Pause",
      soundOn: "Sound on",
      soundOff: "Sound off",
      soundUnsupported: "Sound is not supported in this browser.",
      soundBlocked: "Sound could not start. Tap the sound button to try again.",
      objective: "Run and jump over gaps and scorpions. Collect all three markers to reach the finish.",
      count: (n) => `${n} / 3`,
      level: (n) => `Stage ${n + 1}`,
      locked: "Locked",
      collect: "Marker collected. Nice work!",
      water: "Extra water found.",
      needArtifacts: "Collect all three markers first.",
      stageClear: "Stage complete! Prepare for the next stop.",
      gameClear: "You completed the whole Jordan trail. You win!",
      finalMessage: "Your Jordan journey has ended. You collected the markers and crossed every stage. You made it!",
      gameOver: "You ran out of health. Retry and jump over the hazards.",
      pauseMessage: "Journey paused. Take a moment, then continue.",
      readyMessage: "Move right, jump over gaps and scorpions, and collect the markers.",
      offTrail: "Jump over gaps and avoid the scorpions.",
      heat: "Hit! Watch out for scorpions and gaps.",
      ammanHint: "Jump across old Amman's rooftops and avoid scorpions.",
      jerashHint: "Cross Jerash's columns with longer jumps over gaps.",
      petraHint: "Clear the Siq's gaps and faster Petra scorpions.",
      deadSeaHint: "Jump over rocky drops near the Dead Sea shore.",
      wadiHint: "Wadi Rum has wider gaps and faster scorpions.",
      aqabaHint: "Jump carefully across coastal platforms to the finish.",
      canvasHint: "Collect all three markers, then reach the exit.",
      difficulty: (n) => `Difficulty ${n + 1} of 6`,
      name: (n) => `Stage ${n + 1} · ${copy.en.names[n]}`,
      ariaStage: (n) => `Stage ${n + 1}: ${copy.en.names[n]}`,
      win: "Victory",
      lose: "Game over"
    },
    ja: {
      names: ["アンマン", "ジェラシュ", "ペトラ", "死海", "ワディ・ラム", "アカバ"],
      statusReady: "出発の準備完了",
      statusPlaying: "旅を続けています",
      statusPaused: "旅を一時停止中",
      statusLost: "旅は終了です — もう一度挑戦",
      statusWon: "旅を達成しました — お見事！",
      start: "旅を始める",
      resume: "再開",
      retry: "ステージを再挑戦",
      next: "次のステージへ",
      pause: "一時停止",
      soundOn: "サウンド：オン",
      soundOff: "サウンド：オフ",
      soundUnsupported: "このブラウザーでは音声を利用できません。",
      soundBlocked: "音声を開始できませんでした。もう一度ボタンを押してください。",
      objective: "走ってジャンプし、穴やサソリを避けて記念品を3つ集めましょう。",
      count: (n) => `${n} / 3`,
      level: (n) => `ステージ ${n + 1}`,
      locked: "ロック中",
      collect: "記念品を獲得しました。いい調子！",
      water: "水を補給しました。",
      needArtifacts: "先に3つの記念品を集めてください。",
      stageClear: "ステージクリア！次の目的地へ進みましょう。",
      gameClear: "ヨルダンの旅をすべて達成しました。勝利です！",
      finalMessage: "ヨルダンの旅が終了しました。すべてのしるしを集め、全ステージを突破しました！",
      gameOver: "体力が尽きました。障害物をジャンプして再挑戦しましょう。",
      pauseMessage: "旅を一時停止しました。準備ができたら再開しましょう。",
      readyMessage: "右へ進み、穴やサソリをジャンプで避けて記念品を集めましょう。",
      offTrail: "穴をジャンプで越え、サソリを避けましょう。",
      heat: "ダメージ！サソリと穴に注意しましょう。",
      ammanHint: "アンマン旧市街の屋根をジャンプし、サソリを避けましょう。",
      jerashHint: "ジェラシュの柱を越え、長いジャンプで穴を渡りましょう。",
      petraHint: "ペトラの谷の穴と速いサソリを越えましょう。",
      deadSeaHint: "死海の岸辺の岩場をジャンプで越えましょう。",
      wadiHint: "ワディ・ラムでは穴が広く、サソリも速くなります。",
      aqabaHint: "海岸の足場を慎重にジャンプしてゴールへ進みましょう。",
      canvasHint: "3つの記念品を集めてゴールに到達しましょう。",
      difficulty: (n) => `難易度 ${n + 1} / 6`,
      name: (n) => `ステージ ${n + 1} · ${copy.ja.names[n]}`,
      ariaStage: (n) => `ステージ ${n + 1}：${copy.ja.names[n]}`,
      win: "クリア",
      lose: "終了"
    }
  };
  copy.ru = {
    ...copy.en,
    names: ["Амман", "Джераш", "Петра", "Мёртвое море", "Вади-Рам", "Акаба"],
    statusReady: "Готовы к путешествию",
    statusPlaying: "Путешествие продолжается",
    statusPaused: "Путешествие приостановлено",
    statusLost: "Путешествие окончено — попробуйте снова",
    statusWon: "Путешествие завершено — отлично!",
    start: "Начать путешествие",
    resume: "Продолжить",
    retry: "Повторить уровень",
    next: "Начать следующий уровень",
    pause: "Пауза",
    soundOn: "Звук включён",
    soundOff: "Звук выключен",
    soundUnsupported: "Этот браузер не поддерживает звук.",
    soundBlocked: "Не удалось включить звук. Нажмите кнопку звука ещё раз.",
    objective: "Бегите и перепрыгивайте пропасти и скорпионов. Соберите все три знака и доберитесь до финиша.",
    level: (n) => `Уровень ${n + 1}`,
    locked: "Закрыт",
    collect: "Знак собран. Отлично!",
    water: "Найдена дополнительная вода.",
    needArtifacts: "Сначала соберите все три знака.",
    stageClear: "Уровень пройден! Готовьтесь к следующей остановке.",
    gameClear: "Вы прошли весь маршрут по Иордании. Победа!",
    finalMessage: "Ваше путешествие по Иордании завершено. Вы собрали знаки и прошли все этапы!",
    gameOver: "Здоровье закончилось. Попробуйте снова и перепрыгивайте препятствия.",
    pauseMessage: "Путешествие приостановлено. Отдохните и продолжайте.",
    readyMessage: "Двигайтесь вправо, перепрыгивайте пропасти и скорпионов, собирайте знаки.",
    offTrail: "Перепрыгивайте пропасти и избегайте скорпионов.",
    heat: "Удар! Осторожно: скорпионы и пропасти.",
    ammanHint: "Прыгайте по крышам старого Аммана и избегайте скорпионов.",
    jerashHint: "Преодолейте колонны Джераша и длинные прыжки через пропасти.",
    petraHint: "Преодолейте пропасти Сика и быстрых скорпионов Петры.",
    deadSeaHint: "Перепрыгивайте каменистые обрывы у Мёртвого моря.",
    wadiHint: "В Вади-Рам пропасти шире, а скорпионы быстрее.",
    aqabaHint: "Осторожно прыгайте по прибрежным платформам к финишу.",
    canvasHint: "Соберите все три знака и дойдите до выхода.",
    difficulty: (n) => `Сложность ${n + 1} из 6`,
    name: (n) => `Уровень ${n + 1} · ${copy.ru.names[n]}`,
    ariaStage: (n) => `Уровень ${n + 1}: ${copy.ru.names[n]}`,
    win: "Победа",
    lose: "Игра окончена"
  };
  copy.la = {
    ...copy.en,
    names: ["Amman", "Gerasa", "Petra", "Mare Mortuum", "Vallis Ram", "Aqaba"],
    statusReady: "Paratus ad iter",
    statusPlaying: "Iter pergit",
    statusPaused: "Iter pausatum",
    statusLost: "Iter finitum — iterum conare",
    statusWon: "Iter perfectum — bene factum!",
    start: "Iter incipe",
    resume: "Perge",
    retry: "Gradum repete",
    next: "Gradum proximum incipe",
    pause: "Pausa",
    soundOn: "Sonus auditur",
    soundOff: "Sonus tacet",
    soundUnsupported: "Hic navigator sonum non sustinet.",
    soundBlocked: "Sonus incipere non potuit. Preme iterum bullam soni.",
    objective: "Curre et super hiatus scorpionesque salta. Tria signa collige et ad finem perveni.",
    level: (n) => `Gradus ${n + 1}`,
    locked: "Clausus",
    collect: "Signum collectum. Optime!",
    water: "Aqua addita inventa.",
    needArtifacts: "Primum tria signa collige.",
    stageClear: "Gradus perfectus! Ad stationem proximam para.",
    gameClear: "Totum iter per Iordaniam perfecisti. Victoria!",
    finalMessage: "Iter tuum per Iordaniam finitum est. Omnia itinera superasti!",
    gameOver: "Sanitas tua defecit. Iterum conare et super impedimenta salta.",
    pauseMessage: "Iter pausatum. Requiesce, deinde perge.",
    readyMessage: "Ad dextram move, super hiatus scorpionesque salta, signa collige.",
    offTrail: "Super hiatus salta et scorpiones evita.",
    heat: "Laesus es! Scorpiones hiatusque cave.",
    ammanHint: "Super tecta veteris Ammanis salta et scorpiones evita.",
    jerashHint: "Inter columnas Gerasae transi et super hiatus longius salta.",
    petraHint: "Hiatus Siq et scorpiones Petrae celeres supera.",
    deadSeaHint: "Super saxa prope litus Maris Mortui salta.",
    wadiHint: "In Valle Ram hiatus latiores sunt et scorpiones celeriores.",
    aqabaHint: "Cautus super suggesta maritima ad finem salta.",
    canvasHint: "Tria signa collige, deinde ad exitum perveni.",
    difficulty: (n) => `Difficultas ${n + 1} ex 6`,
    name: (n) => `Gradus ${n + 1} · ${copy.la.names[n]}`,
    ariaStage: (n) => `Gradus ${n + 1}: ${copy.la.names[n]}`,
    win: "Victoria",
    lose: "Finis ludi"
  };
  const initialUnlocked = Number(localStorage.getItem("jordan-game-unlocked"));
  const initialCharacter = localStorage.getItem("jordan-game-character") === "girl" ? "girl" : "boy";
  const state = {
    stage: 0,
    unlocked: Number.isFinite(initialUnlocked) ? Math.max(0, Math.min(stages.length - 1, initialUnlocked)) : 0,
    character: initialCharacter,
    mode: "ready",
    player: { x: 70, y: 408, vx: 0, vy: 0, grounded: true },
    health: 100,
    water: 100,
    collected: new Set(),
    waterFound: new Set(),
    held: new Set(),
    message: "",
    messageTime: 0,
    audio: null,
    sound: false,
    lastStep: 0,
    walkPhase: 0,
    facing: { x: 1, y: 0 },
    cameraX: 0,
    jumpQueued: false,
    invulnerable: 0,
    checkpointX: 70,
    level: null
  };
  let lastFrame = 0;
  let lastUiUpdate = 0;
  let renderedStageSignature = "";
  let audioError = "";

  const language = () => copy[document.documentElement.dataset.language] ? document.documentElement.dataset.language : "ar";
  const text = () => copy[language()];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const stage = () => stages[state.stage];

  function buildLevel() {
    const difficulty = state.stage;
    const length = (difficulty === 5 ? 4300 : 2700) + difficulty * 260;
    const segmentWidth = difficulty === 5 ? 330 : 405 - difficulty * 12;
    const gapWidth = difficulty === 5 ? 150 : 92 + difficulty * 14;
    const platforms = [];
    let x = 0;
    let segmentIndex = 0;

    while (x < length) {
      const remaining = length - x;
      const width = remaining <= segmentWidth + gapWidth + 150 ? remaining : segmentWidth;
      platforms.push({ x, y: 450, width, height: 90, ground: true });
      if (x + width < length) {
        const gap = Math.min(gapWidth, length - x - width);
        if (gap > 45 && (segmentIndex + difficulty) % 4 !== 3) {
          platforms.push({
            x: x + width + gap * 0.24,
            y: 375 - Math.min(difficulty * 3, 15) + (segmentIndex % 2) * 12,
            width: gap * 0.42,
            height: 18,
            ground: false
          });
        }
      }
      x += width + gapWidth;
      segmentIndex += 1;
    }

    const groundSegments = platforms.filter((platform) => platform.ground);
    const artifactSegments = [
      groundSegments[Math.floor(groundSegments.length * 0.28)],
      groundSegments[Math.floor(groundSegments.length * 0.54)],
      groundSegments[Math.min(groundSegments.length - 1, Math.floor(groundSegments.length * 0.8))]
    ];
    const artifacts = artifactSegments.map((platform, index) => ({
      x: platform.x + platform.width * (index === 1 ? 0.72 : 0.56),
      y: platform.y - 44,
      collected: false
    }));
    const water = groundSegments
      .filter((_, index) => index % 2 === 1)
      .slice(0, 3)
      .map((platform) => ({ x: platform.x + platform.width * 0.3, y: platform.y - 32, collected: false }));
    const enemies = [];
    groundSegments.slice(1, -1).forEach((platform, platformIndex) => {
      const enemyCount = difficulty === 5 ? 3 : 1 + Math.floor(difficulty / 2);
      const padding = 38;
      const left = platform.x + padding;
      const right = platform.x + platform.width - padding;
      for (let index = 0; index < enemyCount; index += 1) {
        const amount = (index + 1) / (enemyCount + 1);
        enemies.push({
          x: left + (right - left) * amount,
          y: platform.y - 24,
          left,
          right,
          direction: (platformIndex + index) % 2 ? -1 : 1,
          speed: 48 + difficulty * 24 + (index % 2) * 16 + (difficulty === 5 ? 35 : 0),
          type: (platformIndex + index) % 2 ? "snake" : "scorpion",
          alive: true
        });
      }
    });

    return {
      width: length,
      platforms,
      artifacts,
      water,
      enemies,
      finishX: length - 48
    };
  }

  function currentMessage() {
    if (state.message) return text()[state.message] || state.message;
    if (state.mode === "ready") return text().readyMessage;
    if (state.mode === "paused") return text().pauseMessage;
    if (state.mode === "lost") return text().gameOver;
    if (state.mode === "won") return text().gameClear;
    return text()[stage().hint];
  }

  function renderStages() {
    const signature = `${state.stage}:${state.unlocked}:${language()}`;
    if (signature === renderedStageSignature) return;
    renderedStageSignature = signature;
    stageList.replaceChildren();
    stages.forEach((entry, index) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      const unlocked = index <= state.unlocked;
      button.type = "button";
      button.className = "game-stage-button";
      button.disabled = !unlocked;
      button.setAttribute("aria-current", index === state.stage ? "step" : "false");
      button.setAttribute("aria-label", unlocked ? text().ariaStage(index) : `${text().ariaStage(index)} · ${text().locked}`);
      button.innerHTML = `<span class="game-stage-index">${String(index + 1).padStart(2, "0")}</span><span class="game-stage-copy"><strong>${text().names[index]}</strong><small>${unlocked ? text().level(index) : text().locked}</small></span><span class="game-stage-arrow" aria-hidden="true">${unlocked ? "↗" : "·"}</span>`;
      button.addEventListener("click", () => {
        if (unlocked) beginStage(index);
      });
      item.append(button);
      stageList.append(item);
    });
  }

  function renderInterface() {
    const strings = text();
    const collected = state.collected.size;
    const pctHealth = Math.round(state.health);
    const pctWater = Math.round(state.water);
    const location = strings.names[state.stage];
    stageName.textContent = location;
    canvasLocation.textContent = location;
    fieldCode.textContent = `FIELD ${String(state.stage + 1).padStart(2, "0")}`;
    collectCount.textContent = strings.count(collected);
    healthValue.textContent = `${pctHealth}%`;
    waterValue.textContent = `${pctWater}%`;
    healthBar.style.width = `${pctHealth}%`;
    waterBar.style.width = `${pctWater}%`;
    healthBar.classList.toggle("is-low", state.health < 30);
    waterBar.classList.toggle("is-low", state.water < 30);
    statusElement.textContent = state.mode === "playing" ? strings.statusPlaying
      : state.mode === "paused" ? strings.statusPaused
        : state.mode === "lost" ? strings.statusLost
          : state.mode === "won" ? strings.statusWon : strings.statusReady;
    objectiveElement.textContent = currentMessage();
    stageDescription.textContent = `${strings[stage().hint]} · ${strings.difficulty(state.stage)}`;
    document.querySelector("#game-tip").textContent = strings[stage().hint];
    startButton.textContent = state.mode === "paused" ? strings.resume
      : state.mode === "lost" ? strings.retry
        : state.mode === "ready" && state.message === "stageClear" ? strings.next
          : strings.start;
    startButton.disabled = state.mode === "won";
    pauseButton.textContent = state.mode === "paused" ? strings.resume : strings.pause;
    pauseButton.disabled = state.mode === "ready" || state.mode === "lost" || state.mode === "won";
    soundButton.textContent = state.sound ? strings.soundOn : strings.soundOff;
    soundButton.setAttribute("aria-pressed", String(state.sound));
    soundButton.title = audioError || strings.soundOn;
    if (audioError) objectiveElement.textContent = audioError;
    renderStages();
  }

  function beginStage(index = state.stage) {
    state.stage = index;
    state.level = buildLevel();
    state.player = { x: 70, y: 408, vx: 0, vy: 0, grounded: true };
    state.health = 100;
    state.water = 100;
    state.collected = new Set();
    state.waterFound = new Set();
    state.held.clear();
    state.cameraX = 0;
    state.checkpointX = 70;
    state.jumpQueued = false;
    state.invulnerable = 0;
    state.walkPhase = 0;
    state.facing = { x: 1, y: 0 };
    state.message = "";
    state.messageTime = 0;
    state.mode = "playing";
    audioError = "";
    renderInterface();
    if (state.audio && state.sound) state.audio.resume().catch(() => {
      audioError = text().soundBlocked;
      state.sound = false;
      renderInterface();
    });
  }

  function togglePause() {
    if (state.mode === "playing") {
      state.mode = "paused";
      state.held.clear();
      state.jumpQueued = false;
    } else if (state.mode === "paused") {
      state.mode = "playing";
    } else {
      return;
    }
    state.message = "";
    renderInterface();
  }

  async function toggleSound() {
    audioError = "";
    if (state.sound) {
      state.sound = false;
      renderInterface();
      return;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      audioError = text().soundUnsupported;
      renderInterface();
      return;
    }
    try {
      if (!state.audio) state.audio = new AudioContext();
      await state.audio.resume();
      if (state.audio.state !== "running") throw new Error("Audio context is not running");
      state.sound = true;
      renderInterface();
      playTone(620, 0.1);
    } catch (error) {
      audioError = text().soundBlocked;
      state.sound = false;
      renderInterface();
    }
  }

  function playTone(frequency, duration = 0.12) {
    if (!state.sound || !state.audio || state.audio.state !== "running") return;
    const oscillator = state.audio.createOscillator();
    const gain = state.audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, state.audio.currentTime);
    gain.gain.setValueAtTime(0.0001, state.audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.06, state.audio.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, state.audio.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(state.audio.destination);
    oscillator.start();
    oscillator.stop(state.audio.currentTime + duration + 0.02);
  }

  function collectNearby() {
    const player = state.player;
    state.level.artifacts.forEach((artifact, index) => {
      if (!artifact.collected && Math.abs(player.x + 13 - artifact.x) < 24
        && Math.abs(player.y + 20 - artifact.y) < 34) {
        artifact.collected = true;
        state.collected.add(index);
        state.message = "collect";
        state.messageTime = 1.6;
        playTone(820 + index * 100, 0.2);
      }
    });
    state.level.water.forEach((flask, index) => {
      if (!flask.collected && Math.abs(player.x + 13 - flask.x) < 22
        && Math.abs(player.y + 20 - flask.y) < 34) {
        flask.collected = true;
        state.waterFound.add(index);
        state.water = clamp(state.water + 25, 0, 100);
        state.message = "water";
        state.messageTime = 1.6;
        playTone(440, 0.16);
      }
    });

    if (player.grounded && player.x + 26 >= state.level.finishX) {
      if (state.collected.size < state.level.artifacts.length) {
        state.message = "needArtifacts";
      } else {
        finishStage();
      }
    }
  }

  function finishStage() {
    playTone(680, 0.12);
    window.setTimeout(() => playTone(920, 0.2), 110);
    state.message = "";
    state.messageTime = 0;
    state.held.clear();
    state.jumpQueued = false;
    if (state.stage === stages.length - 1) {
      state.mode = "won";
      state.message = "finalMessage";
      renderInterface();
      return;
    }
    state.unlocked = Math.max(state.unlocked, state.stage + 1);
    localStorage.setItem("jordan-game-unlocked", String(state.unlocked));
    state.stage += 1;
    state.mode = "ready";
    state.level = buildLevel();
    state.player = { x: 70, y: 408, vx: 0, vy: 0, grounded: true };
    state.health = 100;
    state.water = 100;
    state.collected = new Set();
    state.waterFound = new Set();
    state.cameraX = 0;
    state.checkpointX = 70;
    state.message = "stageClear";
    renderInterface();
  }

  function update(deltaSeconds) {
    if (state.mode !== "playing" || !state.level) return;
    const player = state.player;
    if (state.messageTime > 0) {
      state.messageTime = Math.max(0, state.messageTime - deltaSeconds);
      if (state.messageTime === 0 && ["collect", "water", "heat"].includes(state.message)) state.message = "";
    }
    const direction = Number(state.held.has("right")) - Number(state.held.has("left"));
    const speed = 230 + state.stage * 15;
    player.vx = direction * speed;
    if (direction) state.facing.x = direction;
    if (state.jumpQueued && player.grounded) {
      player.vy = -480 - state.stage * 9;
      player.grounded = false;
      playTone(300, 0.08);
    }
    state.jumpQueued = false;

    const previousBottom = player.y + 42;
    player.x = clamp(player.x + player.vx * deltaSeconds, 0, state.level.width - 28);
    player.vy = Math.min(player.vy + (1260 + state.stage * 35) * deltaSeconds, 760);
    player.y += player.vy * deltaSeconds;
    player.grounded = false;

    if (player.vy >= 0) {
      const landing = state.level.platforms.find((platform) =>
        previousBottom <= platform.y + 2
        && player.y + 42 >= platform.y
        && player.x + 26 > platform.x
        && player.x + 2 < platform.x + platform.width
      );
      if (landing) {
        player.y = landing.y - 42;
        player.vy = 0;
        player.grounded = true;
      }
    }

    if (player.grounded && player.x >= state.checkpointX + 520) {
      state.checkpointX = Math.floor(player.x / 520) * 520;
    }
    state.invulnerable = Math.max(0, state.invulnerable - deltaSeconds);
    state.water = clamp(state.water - deltaSeconds * (0.12 + state.stage * 0.045), 0, 100);
    if (state.water <= 0) state.health = clamp(state.health - deltaSeconds * 1.4, 0, 100);

    state.level.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      enemy.x += enemy.direction * enemy.speed * deltaSeconds;
      if (enemy.x <= enemy.left || enemy.x >= enemy.right) enemy.direction *= -1;
      const overlaps = player.x + 26 > enemy.x - 16 && player.x + 2 < enemy.x + 16
        && player.y + 42 > enemy.y - 12 && player.y + 4 < enemy.y + 12;
      if (!overlaps) return;
      if (player.vy > 80 && previousBottom <= enemy.y + 5) {
        enemy.alive = false;
        player.vy = -285;
        playTone(520, 0.12);
      } else if (state.invulnerable <= 0) {
        state.health = clamp(state.health - 35, 0, 100);
        state.invulnerable = 0.75;
        player.vx = -enemy.direction * 190;
        player.vy = -250;
        state.message = "heat";
        state.messageTime = 1.1;
        playTone(160, 0.18);
      }
    });

    if (player.y > world.height + 35) {
      if (state.invulnerable <= 0) state.health = clamp(state.health - 34, 0, 100);
      state.invulnerable = 1.2;
      player.x = state.checkpointX;
      const ground = state.level.platforms.find((platform) => platform.ground && player.x >= platform.x && player.x < platform.x + platform.width);
      player.y = (ground ? ground.y : 450) - 42;
      player.vx = 0;
      player.vy = 0;
      player.grounded = true;
      state.message = "heat";
      state.messageTime = 1.1;
      playTone(160, 0.18);
    }

    if (player.grounded && direction) {
      state.walkPhase += deltaSeconds * 12;
      const now = performance.now();
      if (now - state.lastStep > 310) {
        playTone(100 + Math.random() * 18, 0.04);
        state.lastStep = now;
      }
    } else if (!direction) {
      state.walkPhase *= Math.max(0, 1 - deltaSeconds * 7);
    }
    collectNearby();
    state.cameraX = clamp(player.x - world.width * 0.34, 0, state.level.width - world.width);

    if (state.health <= 0) {
      state.mode = "lost";
      state.message = "";
      state.held.clear();
      playTone(180, 0.45);
    }
  }

  function drawBackground() {
    const palette = stage().colors;
    const sky = context.createLinearGradient(0, 0, 0, world.height);
    sky.addColorStop(0, palette[0]);
    sky.addColorStop(0.64, palette[1]);
    sky.addColorStop(1, palette[3]);
    context.fillStyle = sky;
    context.fillRect(0, 0, world.width, world.height);
    const sunX = 790 - state.cameraX * 0.08;
    context.fillStyle = "rgba(255,235,194,.82)";
    context.beginPath();
    context.arc(sunX, 83, 34, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "rgba(255,235,194,.12)";
    context.beginPath();
    context.arc(sunX, 83, 59, 0, Math.PI * 2);
    context.fill();

    drawDistantLandscape();
    context.save();
    context.translate(-state.cameraX, 0);
    drawPlatformWorld();
    drawLevelItems();
    drawEnemies();
    drawFinish();
    drawPlayer();
    context.restore();
    drawCanvasState();
  }

  function drawDistantLandscape() {
    context.save();
    for (let layer = 0; layer < 3; layer += 1) {
      const shift = (state.cameraX * (0.08 + layer * 0.07)) % 420;
      context.fillStyle = [stage().colors[3], stage().colors[2], stage().colors[1]][layer];
      context.globalAlpha = [0.28, 0.2, 0.14][layer];
      context.beginPath();
      context.moveTo(-440, 410);
      for (let i = -1; i < 5; i += 1) {
        const x = i * 420 - shift;
        const peak = 230 + ((i + layer) % 3) * 32;
        context.lineTo(x + 170, peak);
        context.lineTo(x + 420, 410);
      }
      context.lineTo(world.width + 450, world.height);
      context.lineTo(-440, world.height);
      context.closePath();
      context.fill();
    }
    context.restore();

    context.save();
    context.translate(-state.cameraX * 0.38, 0);
    if (stage().type === "shore" || stage().type === "coast") drawWaterBackdrop();
    for (let x = 170, landmarkIndex = 0; x < state.level.width + 300; x += 620, landmarkIndex += 1) {
      drawLocationLandmark(x, landmarkIndex);
    }
    context.restore();
  }

  function drawWaterBackdrop() {
    const sea = context.createLinearGradient(0, 300, 0, 465);
    sea.addColorStop(0, stage().type === "shore" ? "rgba(105,174,174,.56)" : "rgba(36,151,181,.72)");
    sea.addColorStop(1, stage().type === "shore" ? "rgba(50,119,124,.88)" : "rgba(15,100,139,.92)");
    context.fillStyle = sea;
    context.fillRect(-100, 315, state.level.width + 400, 180);
    context.strokeStyle = stage().type === "shore" ? "rgba(231,231,201,.38)" : "rgba(200,245,243,.46)";
    context.lineWidth = 2;
    for (let x = -80; x < state.level.width + 300; x += 105) {
      const y = 340 + (Math.floor(x / 105) % 4) * 17;
      context.beginPath();
      context.moveTo(x, y);
      context.quadraticCurveTo(x + 24, y - 5, x + 48, y);
      context.quadraticCurveTo(x + 69, y + 5, x + 92, y);
      context.stroke();
    }
  }

  function drawLocationLandmark(x, index) {
    const palette = stage().colors;
    context.save();
    if (stage().type === "city") {
      const baseY = 374 + (index % 2) * 13;
      for (let building = 0; building < 5; building += 1) {
        const bx = x + building * 42;
        const height = 50 + ((building + index) % 3) * 22;
        context.fillStyle = building % 2 ? "rgba(227,194,145,.7)" : "rgba(43,67,61,.78)";
        context.fillRect(bx, baseY - height, 34, height);
        context.fillStyle = "rgba(249,220,171,.6)";
        for (let window = 0; window < 2; window += 1) {
          context.fillRect(bx + 7 + window * 15, baseY - height + 12, 5, 8);
          context.fillRect(bx + 7 + window * 15, baseY - 18, 5, 7);
        }
      }
      const templeX = x + 235;
      context.fillStyle = "rgba(219,192,146,.92)";
      context.fillRect(templeX, 320, 8, 63);
      context.fillRect(templeX + 52, 320, 8, 63);
      context.fillRect(templeX - 7, 313, 74, 9);
      context.fillStyle = "rgba(244,220,178,.88)";
      context.beginPath();
      context.moveTo(templeX - 8, 313);
      context.lineTo(templeX + 30, 291);
      context.lineTo(templeX + 68, 313);
      context.closePath();
      context.fill();
      context.fillStyle = "rgba(41,49,42,.66)";
      context.fillRect(templeX + 19, 336, 22, 47);
    } else if (stage().type === "ruins") {
      const baseY = 401;
      context.fillStyle = "rgba(198,166,116,.46)";
      context.beginPath();
      context.ellipse(x + 130, baseY, 139, 34, 0, Math.PI, Math.PI * 2);
      context.fill();
      for (let column = 0; column < 6; column += 1) {
        const cx = x + 14 + column * 39;
        const top = 298 + (column % 2) * 13;
        context.fillStyle = "rgba(232,207,158,.86)";
        context.fillRect(cx, top, 12, baseY - top);
        context.fillRect(cx - 5, top - 5, 22, 7);
        context.fillRect(cx - 4, baseY - 4, 20, 7);
        context.fillStyle = "rgba(105,80,54,.36)";
        for (let joint = top + 16; joint < baseY - 8; joint += 19) {
          context.fillRect(cx, joint, 12, 2);
        }
      }
      context.fillStyle = "rgba(225,199,151,.9)";
      context.fillRect(x + 225, 327, 15, 74);
      context.fillRect(x + 284, 327, 15, 74);
      context.fillRect(x + 217, 320, 90, 11);
      context.beginPath();
      context.arc(x + 269, 328, 37, Math.PI, 0);
      context.fill();
      context.fillStyle = "rgba(53,54,45,.58)";
      context.fillRect(x + 254, 342, 29, 59);
    } else if (stage().type === "petra") {
      context.fillStyle = "rgba(95,49,40,.72)";
      context.beginPath();
      context.moveTo(x - 15, 420);
      context.lineTo(x + 6, 285);
      context.lineTo(x + 42, 255);
      context.lineTo(x + 66, 310);
      context.lineTo(x + 96, 238);
      context.lineTo(x + 130, 420);
      context.closePath();
      context.fill();
      context.beginPath();
      context.moveTo(x + 205, 420);
      context.lineTo(x + 219, 270);
      context.lineTo(x + 255, 232);
      context.lineTo(x + 279, 293);
      context.lineTo(x + 316, 258);
      context.lineTo(x + 337, 420);
      context.closePath();
      context.fill();
      const facadeX = x + 133;
      context.fillStyle = "rgba(215,151,102,.94)";
      context.fillRect(facadeX, 319, 81, 93);
      context.fillRect(facadeX - 8, 315, 97, 8);
      context.beginPath();
      context.moveTo(facadeX - 5, 315);
      context.lineTo(facadeX + 40, 287);
      context.lineTo(facadeX + 86, 315);
      context.closePath();
      context.fill();
      context.beginPath();
      context.arc(facadeX + 40, 317, 24, Math.PI, 0);
      context.fill();
      context.fillStyle = "rgba(66,39,34,.78)";
      context.fillRect(facadeX + 31, 365, 19, 47);
      for (let column = 0; column < 4; column += 1) {
        context.fillStyle = "rgba(239,185,132,.95)";
        context.fillRect(facadeX + 9 + column * 21, 328, 5, 47);
        context.fillRect(facadeX + 5 + column * 21, 326, 13, 4);
      }
    } else if (stage().type === "shore") {
      context.fillStyle = "rgba(235,220,186,.8)";
      context.beginPath();
      context.moveTo(x - 10, 391);
      context.lineTo(x + 20, 353);
      context.lineTo(x + 56, 363);
      context.lineTo(x + 78, 333);
      context.lineTo(x + 118, 365);
      context.lineTo(x + 150, 347);
      context.lineTo(x + 193, 391);
      context.closePath();
      context.fill();
      context.fillStyle = "rgba(255,249,221,.72)";
      for (let crystal = 0; crystal < 7; crystal += 1) {
        const cx = x + (crystal * 29) % 190;
        const cy = 355 + (crystal % 3) * 14;
        context.beginPath();
        context.moveTo(cx, cy);
        context.lineTo(cx + 7, cy - 19 - (crystal % 2) * 7);
        context.lineTo(cx + 15, cy);
        context.closePath();
        context.fill();
      }
      context.fillStyle = "rgba(60,82,72,.72)";
      context.fillRect(x + 248, 354, 5, 42);
      context.fillRect(x + 270, 348, 5, 48);
      context.strokeStyle = "rgba(64,93,72,.8)";
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(x + 250, 356);
      context.quadraticCurveTo(x + 225, 335, x + 215, 349);
      context.moveTo(x + 251, 356);
      context.quadraticCurveTo(x + 271, 333, x + 286, 347);
      context.moveTo(x + 272, 351);
      context.quadraticCurveTo(x + 293, 332, x + 302, 345);
      context.stroke();
    } else if (stage().type === "desert") {
      const shape = (rockX, peak, width) => {
        context.beginPath();
        context.moveTo(rockX, 422);
        context.lineTo(rockX + 12, peak + 36);
        context.lineTo(rockX + width * 0.22, peak + 12);
        context.lineTo(rockX + width * 0.4, peak);
        context.lineTo(rockX + width * 0.59, peak + 9);
        context.lineTo(rockX + width * 0.74, peak + 43);
        context.lineTo(rockX + width, 422);
        context.closePath();
        context.fill();
      };
      context.fillStyle = "rgba(119,61,47,.78)";
      shape(x, 243 + (index % 2) * 24, 245);
      context.fillStyle = "rgba(200,116,76,.8)";
      shape(x + 204, 292 + (index % 3) * 12, 138);
      context.strokeStyle = "rgba(243,179,121,.34)";
      context.lineWidth = 5;
      for (let line = 0; line < 3; line += 1) {
        context.beginPath();
        context.moveTo(x + 32, 326 + line * 20);
        context.lineTo(x + 84, 314 + line * 20);
        context.lineTo(x + 135, 327 + line * 20);
        context.stroke();
      }
      context.fillStyle = "rgba(69,43,35,.76)";
      context.beginPath();
      context.ellipse(x + 166, 394, 31, 26, 0, Math.PI, Math.PI * 2);
      context.fill();
      context.fillRect(x + 135, 394, 62, 16);
    } else {
      context.fillStyle = "rgba(44,100,111,.6)";
      context.beginPath();
      context.moveTo(x - 12, 359);
      context.lineTo(x + 50, 278);
      context.lineTo(x + 104, 351);
      context.lineTo(x + 146, 263);
      context.lineTo(x + 226, 361);
      context.lineTo(x + 280, 290);
      context.lineTo(x + 347, 362);
      context.closePath();
      context.fill();
      context.fillStyle = "rgba(222,198,150,.9)";
      context.fillRect(x + 46, 361, 5, 45);
      context.fillRect(x + 69, 355, 5, 51);
      context.strokeStyle = "rgba(231,211,172,.9)";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(x + 48, 364);
      context.lineTo(x + 78, 364);
      context.moveTo(x + 48, 375);
      context.lineTo(x + 78, 375);
      context.stroke();
      context.fillStyle = "rgba(39,76,78,.92)";
      context.beginPath();
      context.ellipse(x + 206, 346, 21, 6, 0, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "rgba(242,232,206,.92)";
      context.beginPath();
      context.moveTo(x + 202, 342);
      context.lineTo(x + 202, 324);
      context.lineTo(x + 214, 342);
      context.closePath();
      context.fill();
      context.fillStyle = "rgba(231,115,82,.85)";
      context.beginPath();
      context.moveTo(x + 182, 365);
      context.lineTo(x + 177, 402);
      context.lineTo(x + 187, 402);
      context.closePath();
      context.fill();
      context.beginPath();
      context.moveTo(x + 211, 365);
      context.lineTo(x + 206, 402);
      context.lineTo(x + 216, 402);
      context.closePath();
      context.fill();
    }
    context.restore();
  }

  function drawPlatformWorld() {
    state.level.platforms.forEach((platform) => {
      const gradient = context.createLinearGradient(0, platform.y, 0, platform.y + platform.height);
      gradient.addColorStop(0, platform.ground ? "#b8915d" : "#c8a572");
      gradient.addColorStop(1, platform.ground ? "#624b39" : "#74604a");
      context.fillStyle = gradient;
      context.fillRect(platform.x, platform.y, platform.width, platform.height);
      context.fillStyle = platform.ground ? "#e1c38a" : "#eed19a";
      context.fillRect(platform.x, platform.y, platform.width, 7);
      context.fillStyle = "rgba(58,43,33,.24)";
      for (let x = platform.x + 12; x < platform.x + platform.width - 6; x += 34) {
        context.fillRect(x, platform.y + 17 + ((Math.floor(x) % 3) * 8), 13, 3);
      }
    });
  }

  function drawLevelItems() {
    state.level.artifacts.forEach((artifact) => {
      if (artifact.collected) return;
      const bob = Math.sin(performance.now() / 230 + artifact.x) * 3;
      context.save();
      context.translate(artifact.x, artifact.y + bob);
      context.shadowColor = "#ffe6a5";
      context.shadowBlur = 13;
      context.fillStyle = "#f4d276";
      context.beginPath();
      context.arc(0, 0, 10, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
      context.strokeStyle = "#805a32";
      context.lineWidth = 2;
      context.stroke();
      context.fillStyle = "#805a32";
      context.font = "700 10px sans-serif";
      context.textAlign = "center";
      context.fillText("★", 0, 4);
      context.restore();
    });
    state.level.water.forEach((flask) => {
      if (flask.collected) return;
      context.save();
      context.translate(flask.x, flask.y);
      context.fillStyle = "#b6ebdf";
      context.beginPath();
      context.moveTo(0, -11);
      context.bezierCurveTo(13, 4, 8, 11, 0, 11);
      context.bezierCurveTo(-8, 11, -13, 4, 0, -11);
      context.fill();
      context.restore();
    });
  }

  function drawEnemies() {
    state.level.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      context.save();
      context.translate(enemy.x, enemy.y);
      context.scale(enemy.direction, 1);
      context.fillStyle = "rgba(34,24,20,.34)";
      context.beginPath();
      context.ellipse(0, 15, 20, 5, 0, 0, Math.PI * 2);
      context.fill();
      if (enemy.type === "snake") {
        context.strokeStyle = "#2f4e3e";
        context.lineWidth = 8;
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(-18, 9);
        context.bezierCurveTo(-8, -4, 8, 15, 18, 1);
        context.stroke();
        context.fillStyle = "#55785f";
        context.beginPath();
        context.ellipse(18, 0, 7, 5, 0, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#e8dca5";
        context.beginPath();
        context.arc(20, -1, 1.2, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#b84a3d";
        context.lineWidth = 1.2;
        context.beginPath();
        context.moveTo(24, 0);
        context.lineTo(30, -2);
        context.moveTo(24, 1);
        context.lineTo(30, 3);
        context.stroke();
        context.restore();
        return;
      }
      context.strokeStyle = "#4a2922";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(9, 3);
      context.quadraticCurveTo(24, -12, 16, -18);
      context.moveTo(-5, 7);
      context.lineTo(-13, 13);
      context.lineTo(-18, 8);
      context.moveTo(4, 8);
      context.lineTo(12, 14);
      context.lineTo(17, 9);
      context.stroke();
      context.fillStyle = "#8c4937";
      context.beginPath();
      context.ellipse(0, 4, 12, 8, 0, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#e3b27a";
      context.beginPath();
      context.arc(6, 2, 2, 0, Math.PI * 2);
      context.fill();
      context.restore();
    });
  }

  function drawFinish() {
    const x = state.level.finishX;
    const ground = state.level.platforms.find((platform) =>
      platform.ground && x >= platform.x && x <= platform.x + platform.width
    );
    const y = ground ? ground.y : 450;
    context.fillStyle = "rgba(12,30,25,.35)";
    context.fillRect(x, y - 112, 6, 112);
    context.fillStyle = "#101313";
    context.fillRect(x + 6, y - 110, 58, 12);
    context.fillStyle = "#f4f1df";
    context.fillRect(x + 6, y - 98, 58, 12);
    context.fillStyle = "#2e734c";
    context.fillRect(x + 6, y - 86, 58, 12);
    context.fillStyle = "#b73538";
    context.beginPath();
    context.moveTo(x + 6, y - 110);
    context.lineTo(x + 26, y - 98);
    context.lineTo(x + 6, y - 86);
    context.closePath();
    context.fill();
    context.fillStyle = "#fff";
    context.beginPath();
    context.moveTo(x + 15, y - 101);
    context.lineTo(x + 17, y - 96);
    context.lineTo(x + 22, y - 96);
    context.lineTo(x + 18, y - 93);
    context.lineTo(x + 19, y - 88);
    context.lineTo(x + 15, y - 91);
    context.lineTo(x + 11, y - 88);
    context.lineTo(x + 12, y - 93);
    context.lineTo(x + 8, y - 96);
    context.lineTo(x + 13, y - 96);
    context.closePath();
    context.fill();
    context.fillStyle = "#fff1bd";
    context.font = "700 11px sans-serif";
    context.textAlign = "center";
    context.fillText("FINISH", x + 24, y - 119);
  }

  function drawTerrainTexture() {
    const palette = stage().colors;
    context.save();
    for (let i = 0; i < 150; i += 1) {
      const x = (i * 197 + (i % 7) * 31) % world.width;
      const y = 92 + ((i * 127 + (i % 11) * 19) % 430);
      const size = 1 + (i % 4) * 0.65;
      context.fillStyle = i % 3
        ? `rgba(255,225,182,${0.035 + (i % 4) * 0.012})`
        : `rgba(18,30,27,${0.045 + (i % 3) * 0.015})`;
      context.beginPath();
      context.ellipse(x, y, size * 1.8, size, (i % 5) * 0.3, 0, Math.PI * 2);
      context.fill();
    }

    context.globalAlpha = 0.18;
    context.fillStyle = palette[3];
    for (let i = 0; i < 18; i += 1) {
      const x = (i * 173 + 45) % world.width;
      const y = 115 + ((i * 83) % 310);
      const width = 24 + (i % 5) * 9;
      context.beginPath();
      context.ellipse(x, y, width, 5 + (i % 4) * 2, (i % 6) * 0.25, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "rgba(255,231,193,.12)";
      context.beginPath();
      context.ellipse(x - 2, y - 2, width * 0.72, 2 + (i % 3), (i % 6) * 0.25, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = palette[3];
    }
    context.restore();
  }

  function drawLandmarks() {
    const palette = stage().colors;
    context.save();
    if (stage().type === "city") {
      for (let i = 0; i < 9; i += 1) {
        const x = 32 + i * 112;
        const y = 176 + (i % 3) * 20;
        context.fillStyle = i % 2 ? "rgba(24,46,46,.52)" : "rgba(223,190,144,.42)";
        context.fillRect(x, y, 55 + (i % 3) * 8, 65 + (i % 4) * 12);
        context.fillStyle = "rgba(255,228,175,.42)";
        for (let window = 0; window < 3; window += 1) context.fillRect(x + 10 + window * 13, y + 15, 5, 9);
      }
    } else if (stage().type === "ruins") {
      for (let i = 0; i < 8; i += 1) {
        const x = 65 + i * 114;
        const y = 188 + (i % 3) * 27;
        context.fillStyle = "rgba(238,213,160,.68)";
        context.fillRect(x, y, 13, 61);
        context.fillRect(x - 5, y - 5, 23, 8);
        context.fillRect(x - 5, y + 56, 23, 7);
        if (i < 7) context.fillRect(x + 14, y + 2, 92, 7);
      }
    } else if (stage().type === "petra") {
      context.fillStyle = "rgba(89,48,42,.7)";
      context.beginPath();
      context.moveTo(0, 70);
      context.lineTo(170, 94);
      context.lineTo(205, 230);
      context.lineTo(105, 278);
      context.lineTo(0, 227);
      context.fill();
      context.beginPath();
      context.moveTo(960, 42);
      context.lineTo(812, 95);
      context.lineTo(769, 236);
      context.lineTo(885, 273);
      context.lineTo(960, 213);
      context.fill();
      context.fillStyle = palette[2];
      context.fillRect(428, 231, 95, 56);
      context.beginPath();
      context.arc(475, 230, 48, Math.PI, 0);
      context.fill();
      context.fillStyle = "rgba(64,43,38,.78)";
      context.fillRect(463, 246, 24, 42);
      context.fillRect(438, 245, 7, 42);
      context.fillRect(505, 245, 7, 42);
    } else if (stage().type === "shore" || stage().type === "coast") {
      context.fillStyle = stage().type === "shore" ? "rgba(70,151,154,.72)" : "rgba(49,151,177,.78)";
      context.beginPath();
      context.moveTo(0, 105);
      context.bezierCurveTo(250, 140, 320, 86, 526, 122);
      context.bezierCurveTo(710, 153, 790, 106, 960, 127);
      context.lineTo(960, 540);
      context.lineTo(0, 540);
      context.fill();
      context.strokeStyle = "rgba(208,246,233,.5)";
      context.lineWidth = 3;
      for (let i = 0; i < 5; i += 1) {
        context.beginPath();
        context.moveTo(i * 181, 190 + i * 16);
        context.quadraticCurveTo(i * 181 + 70, 177 + i * 16, i * 181 + 142, 194 + i * 16);
        context.stroke();
      }
    } else {
      for (let i = 0; i < 6; i += 1) {
        const x = i * 182 - 30;
        const height = 150 + (i % 3) * 57;
        context.fillStyle = i % 2 ? "rgba(99,55,47,.65)" : "rgba(238,179,128,.44)";
        context.beginPath();
        context.moveTo(x, 355);
        context.lineTo(x + 68, 355 - height);
        context.lineTo(x + 153, 355);
        context.closePath();
        context.fill();
        context.fillStyle = "rgba(255,220,172,.2)";
        context.beginPath();
        context.moveTo(x + 68, 355 - height);
        context.lineTo(x + 94, 355 - height + 54);
        context.lineTo(x + 60, 355 - height + 49);
        context.fill();
      }
    }
    context.restore();
  }

  function drawTrail() {
    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(route[0].x, route[0].y);
    for (let i = 1; i < route.length - 1; i += 1) {
      const middleX = (route[i].x + route[i + 1].x) / 2;
      const middleY = (route[i].y + route[i + 1].y) / 2;
      context.quadraticCurveTo(route[i].x, route[i].y, middleX, middleY);
    }
    context.lineTo(route[route.length - 1].x, route[route.length - 1].y);
    context.strokeStyle = "rgba(20,29,25,.35)";
    context.lineWidth = 58;
    context.stroke();
    context.strokeStyle = "rgba(238,206,151,.9)";
    context.lineWidth = 38;
    context.stroke();
    context.setLineDash([4, 17]);
    context.strokeStyle = "rgba(111,86,60,.55)";
    context.lineWidth = 2;
    context.stroke();
    context.restore();

    context.save();
    context.translate(positions.exit.x, positions.exit.y);
    context.fillStyle = "rgba(171,231,184,.2)";
    context.beginPath();
    context.arc(0, 0, 34, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#b8f5c5";
    context.lineWidth = 3;
    context.strokeRect(-12, -16, 24, 32);
    context.fillStyle = "#d5ffe0";
    context.font = "700 10px sans-serif";
    context.textAlign = "center";
    context.fillText("EXIT", 0, 4);
    context.restore();
  }

  function drawHazard() {
    const hot = stage().hazard;
    const pulse = 1 + Math.sin(performance.now() / 360) * 0.08;
    context.save();
    context.fillStyle = "rgba(255,120,79,.1)";
    context.beginPath();
    context.arc(hot.x, hot.y, hot.radius * 1.8 * pulse, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "rgba(255,151,103,.5)";
    context.setLineDash([5, 8]);
    context.lineWidth = 2;
    context.beginPath();
    context.arc(hot.x, hot.y, hot.radius * pulse, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }

  function drawPickups() {
    positions.artifacts.forEach((position, index) => {
      if (state.collected.has(index)) return;
      const pulse = 1 + Math.sin(performance.now() / 260 + index) * 0.1;
      context.save();
      context.translate(position.x, position.y);
      context.rotate(Math.PI / 4);
      context.shadowColor = "#fff1bd";
      context.shadowBlur = 20;
      context.fillStyle = "#fff1bd";
      context.fillRect(-8 * pulse, -8 * pulse, 16 * pulse, 16 * pulse);
      context.shadowBlur = 0;
      context.strokeStyle = "rgba(116,73,43,.9)";
      context.lineWidth = 2;
      context.strokeRect(-8 * pulse, -8 * pulse, 16 * pulse, 16 * pulse);
      context.restore();
    });
    positions.water.forEach((position, index) => {
      if (state.waterFound.has(index)) return;
      context.save();
      context.translate(position.x, position.y);
      context.fillStyle = "rgba(120,226,240,.3)";
      context.beginPath();
      context.arc(0, 0, 17, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#b7f4f4";
      context.beginPath();
      context.moveTo(0, -10);
      context.bezierCurveTo(11, 3, 8, 10, 0, 10);
      context.bezierCurveTo(-8, 10, -11, 3, 0, -10);
      context.fill();
      context.restore();
    });
  }

  function drawObstacles() {
    obstacles().forEach((rock) => {
      context.fillStyle = "rgba(19,31,29,.28)";
      context.beginPath();
      context.ellipse(rock.x + 5, rock.y + 8, rock.radius + 4, rock.radius / 2, 0, 0, Math.PI * 2);
      context.fill();
      const stone = context.createLinearGradient(rock.x - rock.radius, rock.y - rock.radius, rock.x + rock.radius, rock.y + rock.radius);
      stone.addColorStop(0, "rgba(239,217,178,.9)");
      stone.addColorStop(1, "rgba(117,91,69,.9)");
      context.fillStyle = stone;
      context.beginPath();
      context.moveTo(rock.x - rock.radius, rock.y + 8);
      context.lineTo(rock.x - rock.radius * 0.48, rock.y - rock.radius);
      context.lineTo(rock.x + rock.radius * 0.36, rock.y - rock.radius * 0.8);
      context.lineTo(rock.x + rock.radius, rock.y + 5);
      context.lineTo(rock.x + 5, rock.y + rock.radius * 0.8);
      context.closePath();
      context.fill();
    });
  }

  function drawPlayer() {
    if (state.invulnerable > 0 && Math.floor(performance.now() / 90) % 2) return;
    const step = Math.sin(state.walkPhase);
    const stride = state.player.grounded ? step * 4 : 0;
    const bob = state.player.grounded ? Math.abs(step) * 1.2 : 0;
    context.save();
    context.translate(state.player.x + 14, state.player.y);
    context.scale(state.facing.x < 0 ? -1 : 1, 1);
    context.fillStyle = "rgba(13,22,20,.35)";
    context.beginPath();
    context.ellipse(0, 42, 13, 4, 0, 0, Math.PI * 2);
    context.fill();

    context.translate(0, -bob);
    if (state.character === "girl") {
      context.fillStyle = "#302a24";
      context.beginPath();
      context.ellipse(0, 10, 8, 7, 0, Math.PI, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.ellipse(-7, 14, 3.2, 8, -.18, 0, Math.PI * 2);
      context.ellipse(7, 14, 3.2, 8, .18, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#9b5c78";
      context.beginPath();
      context.ellipse(0, 25, 9, 12, 0, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#dca4bd";
      context.fillRect(-7, 20, 14, 3);
    } else {
      context.fillStyle = "#483b30";
      context.beginPath();
      context.ellipse(0, 25, 7.5, 10, 0, 0, Math.PI * 2);
      context.fill();
    }
    context.strokeStyle = "#302a24";
    context.lineWidth = 3.2;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(-3, 29);
    context.lineTo(-4 + stride, 36);
    context.lineTo(-5 + stride, 41);
    context.moveTo(3, 29);
    context.lineTo(4 - stride, 36);
    context.lineTo(5 - stride, 41);
    context.stroke();
    context.fillStyle = "#483b30";
    context.beginPath();
    context.ellipse(-5 + stride, 41, 3.5, 2, 0, 0, Math.PI * 2);
    context.ellipse(5 - stride, 41, 3.5, 2, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = state.character === "girl" ? "#9b5c78" : "#744a32";
    context.beginPath();
    context.ellipse(0, 25, state.character === "girl" ? 9 : 7.5, state.character === "girl" ? 12 : 10, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = state.character === "girl" ? "#dca4bd" : "#9c6540";
    context.beginPath();
    context.ellipse(0, 22, 8.5, 7.5, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "rgba(239,193,137,.55)";
    context.fillRect(-6, 19, 2, 7);

    context.strokeStyle = "#d1a477";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-7, 21);
    context.lineTo(-10 - stride * 0.5, 28);
    context.moveTo(7, 21);
    context.lineTo(10 + stride * 0.5, 28);
    context.stroke();

    context.fillStyle = "#d8b18a";
    context.beginPath();
    context.arc(0, 11 - bob * 0.2, 5.2, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#3e342b";
    context.beginPath();
    context.ellipse(0, 8 - bob * 0.2, 6.4, 3.2, 0, Math.PI, Math.PI * 2);
    context.fill();
    context.restore();
  }

  function drawCanvasState() {
    if (state.mode === "playing") return;
    let headline = "";
    if (state.mode === "ready") headline = state.stage > 0 && state.message ? text().stageClear : text().level(state.stage);
    if (state.mode === "paused") headline = text().pauseMessage;
    if (state.mode === "lost") headline = text().lose;
    if (state.mode === "won") headline = text().win;
    if (!headline) return;
    context.save();
    context.fillStyle = "rgba(9,24,21,.58)";
    context.fillRect(0, 0, world.width, world.height);
    context.fillStyle = "#fff8e9";
    context.textAlign = "center";
    context.font = "700 28px Cairo, sans-serif";
    context.fillText(headline, world.width / 2, world.height / 2);
    context.font = "400 14px Cairo, sans-serif";
    context.fillStyle = "rgba(255,248,233,.8)";
    context.fillText(currentMessage(), world.width / 2, world.height / 2 + 33, 680);
    context.restore();
  }

  function drawFrame(timestamp) {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.max(1, Math.round(rect.width * pixelRatio));
    const pixelHeight = Math.max(1, Math.round(rect.height * pixelRatio));
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.scale(rect.width / world.width, rect.height / world.height);
    const deltaSeconds = lastFrame ? Math.min((timestamp - lastFrame) / 1000, 0.05) : 0;
    lastFrame = timestamp;
    update(deltaSeconds);
    if (timestamp - lastUiUpdate > 150) {
      renderInterface();
      lastUiUpdate = timestamp;
    }
    drawBackground();
    window.requestAnimationFrame(drawFrame);
  }

  startButton.addEventListener("click", () => {
    if (state.mode === "paused") {
      togglePause();
      return;
    }
    if (state.mode === "won") return;
    beginStage(state.stage);
  });
  restartButton.addEventListener("click", () => beginStage(state.stage));
  pauseButton.addEventListener("click", togglePause);
  soundButton.addEventListener("click", toggleSound);

  document.querySelectorAll(".game-character-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.character === state.character);
    button.setAttribute("aria-pressed", String(button.dataset.character === state.character));
    button.addEventListener("click", () => {
      state.character = button.dataset.character;
      localStorage.setItem("jordan-game-character", state.character);
      document.querySelectorAll(".game-character-button").forEach((item) => {
        const active = item.dataset.character === state.character;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });

  document.querySelectorAll("[data-move]").forEach((button) => {
    const direction = button.dataset.move;
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      state.held.add(direction);
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
      button.addEventListener(eventName, () => state.held.delete(direction));
    });
  });

  document.querySelector("[data-jump]").addEventListener("pointerdown", (event) => {
    event.preventDefault();
    state.jumpQueued = true;
  });
  document.querySelector("[data-jump]").addEventListener("click", () => {
    state.jumpQueued = true;
  });

  let canvasTouchStartX = null;
  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch") return;
    event.preventDefault();
    canvasTouchStartX = event.clientX;
  });
  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "touch" || canvasTouchStartX === null) return;
    event.preventDefault();
    const delta = event.clientX - canvasTouchStartX;
    state.held.delete(delta >= 0 ? "left" : "right");
    state.held.add(delta >= 0 ? "right" : "left");
  });
  canvas.addEventListener("pointerup", (event) => {
    if (event.pointerType !== "touch") return;
    event.preventDefault();
    if (canvasTouchStartX !== null && Math.abs(event.clientX - canvasTouchStartX) < 18) {
      state.jumpQueued = true;
    }
    canvasTouchStartX = null;
    state.held.delete("left");
    state.held.delete("right");
  });
  canvas.addEventListener("pointercancel", () => {
    canvasTouchStartX = null;
    state.held.delete("left");
    state.held.delete("right");
  });

  const keyDirections = {
    ArrowLeft: "left", KeyA: "left",
    ArrowRight: "right", KeyD: "right"
  };
  window.addEventListener("keydown", (event) => {
    if (event.code === "Escape") {
      togglePause();
      return;
    }
    if (["ArrowUp", "KeyW", "Space"].includes(event.code) && state.mode === "playing") {
      event.preventDefault();
      if (!event.repeat) state.jumpQueued = true;
      return;
    }
    const direction = keyDirections[event.code];
    if (direction && state.mode === "playing") {
      event.preventDefault();
      state.held.add(direction);
    }
  });
  window.addEventListener("keyup", (event) => {
    const direction = keyDirections[event.code];
    if (direction) state.held.delete(direction);
  });
  window.addEventListener("blur", () => {
    state.held.clear();
    state.jumpQueued = false;
    if (state.mode === "playing") togglePause();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.mode === "playing") togglePause();
  });
  document.addEventListener("languagechange", renderInterface);

  state.level = buildLevel();
  renderInterface();
  window.requestAnimationFrame(drawFrame);
});
