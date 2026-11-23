document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector("main")) return;

  const main = document.querySelector("main");
  main.id = "main-content";

  const skip = document.createElement("a");
  skip.className = "skip-link";
  skip.href = "#main-content";
  skip.textContent = {
    ar: "انتقل إلى المحتوى",
    en: "Skip to main content",
    ja: "メインコンテンツへ移動"
  }[document.documentElement.lang] || "انتقل إلى المحتوى";
  document.body.prepend(skip);

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "a11y-toggle";
  toggle.textContent = "♿";
  toggle.setAttribute("aria-label", "فتح أدوات ذوي الاحتياجات الخاصة");
  toggle.setAttribute("aria-expanded", "false");

  const panel = document.createElement("aside");
  panel.className = "a11y-panel";
  panel.setAttribute("aria-label", "أدوات تسهيل الوصول");
  panel.innerHTML = `
    <h2>تسهيل الوصول</h2>
    <div class="a11y-grid">
      <button type="button" class="a11y-action" data-mode="contrast">تباين عالي</button>
      <button type="button" class="a11y-action" data-mode="grayscale">أبيض وأسود</button>
      <button type="button" class="a11y-action" data-mode="protanopia">عمى أحمر</button>
      <button type="button" class="a11y-action" data-mode="deuteranopia">عمى أخضر</button>
      <button type="button" class="a11y-action" data-mode="tritanopia">عمى أزرق</button>
      <button type="button" class="a11y-action" data-mode="readable">نص أوضح</button>
      <button type="button" class="a11y-action" data-mode="large">نص أكبر</button>
      <button type="button" class="a11y-action" data-mode="dyslexia">خط القراءة</button>
      <button type="button" class="a11y-action" data-mode="pause">إيقاف الحركة</button>
      <button type="button" class="a11y-action" data-mode="speak">قراءة الصفحة</button>
      <button type="button" class="a11y-action" data-mode="stop">إيقاف الصوت</button>
      <button type="button" class="a11y-action" data-mode="reset">إعادة الضبط</button>
    </div>
    <p class="a11y-status" aria-live="polite"></p>
  `;

  document.body.append(toggle, panel);

  const accessibilityCopy = {
    ar: {
      toggle: "فتح أدوات ذوي الاحتياجات الخاصة",
      title: "تسهيل الوصول",
      panel: "أدوات تسهيل الوصول",
      modes: ["تباين عالي", "أبيض وأسود", "عمى أحمر", "عمى أخضر", "عمى أزرق", "نص أوضح", "نص أكبر", "خط القراءة", "إيقاف الحركة", "قراءة الصفحة", "إيقاف الصوت", "إعادة الضبط"],
      reading: "يتم قراءة محتوى الصفحة.",
      stopped: "تم إيقاف قراءة الصوت.",
      reset: "تمت إعادة الإعدادات.",
      enabled: "تم تفعيل الإعداد.",
      disabled: "تم إلغاء الإعداد."
    },
    en: {
      toggle: "Open accessibility tools",
      title: "Accessibility",
      panel: "Accessibility tools",
      modes: ["High contrast", "Grayscale", "Red color filter", "Green color filter", "Blue color filter", "Clearer text", "Larger text", "Reading font", "Pause motion", "Read page aloud", "Stop speech", "Reset settings"],
      reading: "Reading page content.",
      stopped: "Speech stopped.",
      reset: "Settings reset.",
      enabled: "Setting enabled.",
      disabled: "Setting disabled."
    },
    ja: {
      toggle: "アクセシビリティ設定を開く",
      title: "アクセシビリティ",
      panel: "アクセシビリティ設定",
      modes: ["高コントラスト", "グレースケール", "赤色覚サポート", "緑色覚サポート", "青色覚サポート", "読みやすい文字", "文字を大きく", "読みやすいフォント", "動きを止める", "ページを読み上げる", "読み上げを停止", "設定をリセット"],
      reading: "ページを読み上げています。",
      stopped: "読み上げを停止しました。",
      reset: "設定をリセットしました。",
      enabled: "設定を有効にしました。",
      disabled: "設定を無効にしました。"
    },
    ru: {
      toggle: "Открыть настройки доступности",
      title: "Специальные возможности",
      panel: "Настройки доступности",
      modes: ["Высокая контрастность", "Оттенки серого", "Фильтр красного цвета", "Фильтр зелёного цвета", "Фильтр синего цвета", "Чёткий текст", "Крупный текст", "Удобный шрифт", "Отключить анимацию", "Читать страницу", "Остановить чтение", "Сбросить настройки"],
      reading: "Чтение содержимого страницы.",
      stopped: "Чтение остановлено.",
      reset: "Настройки сброшены.",
      enabled: "Настройка включена.",
      disabled: "Настройка выключена."
    },
    la: {
      toggle: "Optiones accessibilitatis aperi",
      title: "Accessibilitas",
      panel: "Optiones accessibilitatis",
      modes: ["Contrarium altum", "Grisei colores", "Filtrum rubrum", "Filtrum viride", "Filtrum caeruleum", "Litterae clariores", "Litterae maiores", "Litterae faciles", "Motum siste", "Paginam lege", "Lecturam siste", "Optiones restitue"],
      reading: "Contentum paginae legitur.",
      stopped: "Lectura intermissa est.",
      reset: "Optiones restitutae sunt.",
      enabled: "Optio activa est.",
      disabled: "Optio inactiva est."
    }
  };
  function applyAccessibilityLanguage() {
    const language = document.documentElement.lang;
    const copy = accessibilityCopy[language] || accessibilityCopy.en;
    skip.textContent = {
      ar: "انتقل إلى المحتوى",
      en: "Skip to main content",
      ja: "メインコンテンツへ移動",
      ru: "Перейти к основному содержимому",
      la: "Ad contentum principale"
    }[language] || "Skip to main content";
    toggle.setAttribute("aria-label", copy.toggle);
    panel.setAttribute("aria-label", copy.panel);
    panel.querySelector("h2").textContent = copy.title;
    panel.querySelectorAll(".a11y-action").forEach((button, index) => {
      button.textContent = copy.modes[index];
    });
  }
  applyAccessibilityLanguage();
  document.addEventListener("languagechange", applyAccessibilityLanguage);

  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  const status = panel.querySelector(".a11y-status");
  const colorModes = ["contrast", "grayscale", "protanopia", "deuteranopia", "tritanopia"];
  const classNames = {
    contrast: "a11y-high-contrast",
    grayscale: "a11y-grayscale",
    protanopia: "a11y-protanopia",
    deuteranopia: "a11y-deuteranopia",
    tritanopia: "a11y-tritanopia",
    readable: "a11y-readable-text",
    large: "a11y-large-text",
    dyslexia: "a11y-dyslexia",
    pause: "a11y-paused"
  };

  const saved = JSON.parse(localStorage.getItem("a11y-settings") || "{}");
  Object.entries(saved).forEach(([mode, enabled]) => {
    if (enabled && classNames[mode]) document.body.classList.add(classNames[mode]);
  });

  function saveSettings() {
    const settings = {};
    Object.entries(classNames).forEach(([mode, className]) => {
      settings[mode] = document.body.classList.contains(className);
    });
    localStorage.setItem("a11y-settings", JSON.stringify(settings));
  }

  panel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");
    if (!button) return;
    const mode = button.dataset.mode;

    if (mode === "speak") {
      window.speechSynthesis.cancel();
      const language = document.documentElement.lang || "ar";
      const utterance = new SpeechSynthesisUtterance(main.innerText);
      utterance.lang = { ar: "ar-JO", en: "en-US", ja: "ja-JP", ru: "ru-RU", la: "la" }[language] || "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      status.textContent = (accessibilityCopy[language] || accessibilityCopy.ar).reading;
      return;
    }

    if (mode === "stop") {
      window.speechSynthesis.cancel();
      status.textContent = (accessibilityCopy[document.documentElement.lang] || accessibilityCopy.ar).stopped;
      return;
    }

    if (mode === "reset") {
      document.body.classList.remove(...Object.values(classNames));
      window.speechSynthesis.cancel();
      panel.querySelectorAll(".a11y-action").forEach((item) => item.classList.remove("active"));
      localStorage.removeItem("a11y-settings");
      status.textContent = (accessibilityCopy[document.documentElement.lang] || accessibilityCopy.ar).reset;
      return;
    }

    if (colorModes.includes(mode)) {
      colorModes.forEach((name) => {
        document.body.classList.remove(classNames[name]);
        panel.querySelector(`[data-mode="${name}"]`)?.classList.remove("active");
      });
    }

    if (classNames[mode]) {
      const enabled = document.body.classList.toggle(classNames[mode]);
      button.classList.toggle("active", enabled);
      const copy = accessibilityCopy[document.documentElement.lang] || accessibilityCopy.ar;
      status.textContent = enabled ? copy.enabled : copy.disabled;
    }
    saveSettings();
  });

  panel.querySelectorAll("[data-mode]").forEach((button) => {
    if (classNames[button.dataset.mode] &&
        document.body.classList.contains(classNames[button.dataset.mode])) {
      button.classList.add("active");
    }
  });
});
