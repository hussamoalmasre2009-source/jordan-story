document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector("main")) return;

  const main = document.querySelector("main");
  main.id = "main-content";

  const skip = document.createElement("a");
  skip.className = "skip-link";
  skip.href = "#main-content";
  skip.textContent = document.documentElement.lang === "ar" ? "انتقل إلى المحتوى" : "Skip to main content";
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
      utterance.lang = language === "ar" ? "ar-JO" : "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      status.textContent = "يتم قراءة محتوى الصفحة.";
      return;
    }

    if (mode === "stop") {
      window.speechSynthesis.cancel();
      status.textContent = "تم إيقاف قراءة الصوت.";
      return;
    }

    if (mode === "reset") {
      document.body.classList.remove(...Object.values(classNames));
      window.speechSynthesis.cancel();
      panel.querySelectorAll(".a11y-action").forEach((item) => item.classList.remove("active"));
      localStorage.removeItem("a11y-settings");
      status.textContent = "تمت إعادة الإعدادات.";
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
      status.textContent = enabled ? "تم تفعيل الإعداد." : "تم إلغاء الإعداد.";
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
