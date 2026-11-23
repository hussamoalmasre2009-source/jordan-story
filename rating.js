const ratingForm = document.querySelector("#rating-form");

if (ratingForm) {
  const stars = [...ratingForm.querySelectorAll(".star-button")];
  const message = ratingForm.querySelector("#rating-message");
  const face = ratingForm.querySelector("#rating-face");
  const emotion = ratingForm.querySelector("#rating-emotion");
  const comment = ratingForm.querySelector("#rating-comment");
  let selectedRating = 0;
  let submitted = false;
  const ratingCopy = {
    ar: {
      emotions: [
        "نأسف. أخبرنا ما الذي لم يعجبك.",
        "يمكننا تقديم تجربة أفضل. رأيك مهم.",
        "تجربة مقبولة، ونريد أن نكون أفضل.",
        "شكراً لك! اقتربنا من تجربة ممتازة.",
        "ممتاز! شكراً لدعمك."
      ],
      selected: (rating) => `اخترت ${rating} من 5 نجوم`,
      required: "اختَر عدد النجوم أولاً، من فضلك.",
      ready: "لن يُرسل التقييم تلقائياً. افتح الرابط أدناه لمراجعته واضغط إرسال.",
      send: "افتح واتساب لإرسال التقييم",
      rating: (value) => `تقييم موقع الأردن: ${value} من 5`,
      comment: (value) => `التعليق: ${value}`
    },
    en: {
      emotions: [
        "We are sorry. Please tell us what went wrong.",
        "We can do better. Your feedback helps.",
        "An acceptable visit, but we want to improve.",
        "Thank you! We are close to excellent.",
        "Excellent! Thank you for your support."
      ],
      selected: (rating) => `You selected ${rating} out of 5 stars`,
      required: "Please select a rating first.",
      ready: "Your rating is not sent automatically. Open the link below, review it, and press Send.",
      send: "Open WhatsApp to send your rating",
      rating: (value) => `Jordan website rating: ${value} out of 5`,
      comment: (value) => `Comment: ${value}`
    },
    ja: {
      emotions: [
        "申し訳ありません。お気づきの点をお聞かせください。",
        "より良い体験を目指します。ご意見をお聞かせください。",
        "ご満足いただけたようですが、さらに改善していきます。",
        "ありがとうございます！より良い体験に近づいています。",
        "最高の評価をありがとうございます！"
      ],
      selected: (rating) => `星${rating}つの評価を選択しました`,
      required: "先に星の数を選んでください。",
      ready: "評価は自動送信されません。下のリンクを開き、内容を確認して送信してください。",
      send: "WhatsAppを開いて評価を送信",
      rating: (value) => `ヨルダンのウェブサイト評価：${value}/5`,
      comment: (value) => `コメント：${value}`
    },
    ru: {
      emotions: [
        "Нам жаль. Расскажите, что пошло не так.",
        "Мы можем стать лучше. Ваш отзыв поможет.",
        "Неплохо, но мы хотим стать лучше.",
        "Спасибо! Мы близки к отличному результату.",
        "Прекрасно! Спасибо за поддержку."
      ],
      selected: (rating) => `Вы выбрали ${rating} из 5 звёзд`,
      required: "Сначала выберите оценку.",
      ready: "Оценка не отправляется автоматически. Откройте ссылку ниже, проверьте сообщение и отправьте его.",
      send: "Открыть WhatsApp и отправить оценку",
      rating: (value) => `Оценка сайта Иордании: ${value} из 5`,
      comment: (value) => `Комментарий: ${value}`
    },
    la: {
      emotions: [
        "Paenitet nos. Dic quid tibi displicuerit.",
        "Meliorem experientiam praebere possumus. Sententia tua adiuvat.",
        "Experientia tolerabilis; melius esse volumus.",
        "Gratias! Ad optimam experientiam appropinquamus.",
        "Optime! Gratias tibi agimus."
      ],
      selected: (rating) => `Stellas ${rating} ex 5 elegisti`,
      required: "Primum aestimationem elige.",
      ready: "Aestimatio tua automatice non mittitur. Vinculum infra aperi, nuntium lege et mitte.",
      send: "WhatsApp aperi et aestimationem mitte",
      rating: (value) => `Aestimatio situs Iordaniae: ${value} ex 5`,
      comment: (value) => `Commentarium: ${value}`
    }
  };
  const copy = () => ratingCopy[document.documentElement.dataset.language] || ratingCopy.ar;

  function playTone(frequency, start, duration, gainValue = 0.08) {
    const context = playTone.context || new (window.AudioContext || window.webkitAudioContext)();
    playTone.context = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime + start);
    gain.gain.setValueAtTime(gainValue, context.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(context.currentTime + start);
    oscillator.stop(context.currentTime + start + duration);
  }

  function playApplause() {
    const context = playTone.context || new (window.AudioContext || window.webkitAudioContext)();
    playTone.context = context;
    const duration = 1.5;
    const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const source = context.createBufferSource();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1400;
    gain.gain.setValueAtTime(0.42, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    source.buffer = buffer;
    source.connect(filter).connect(gain).connect(context.destination);
    source.start();
    [523.25, 659.25, 783.99].forEach((frequency, index) => playTone(frequency, index * 0.12, 0.35, 0.06));
  }

  function playRatingSound(rating) {
    if (rating === 5) {
      playApplause();
      return;
    }
    const base = 300 - rating * 18;
    playTone(base, 0, 0.28, 0.07);
    playTone(base * 0.78, 0.25, 0.42, 0.06);
  }

  function ratingPresentation(rating) {
    const faces = ["😢", "😞", "😐", "🙂", "😍"];
    return [faces[rating - 1], copy().emotions[rating - 1]];
  }

  const updateStars = (rating) => {
    stars.forEach((star) => {
      const isSelected = Number(star.dataset.rating) <= rating;
      star.classList.toggle("selected", isSelected);
      star.setAttribute("aria-pressed", String(Number(star.dataset.rating) === rating));
    });
  };

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      selectedRating = Number(star.dataset.rating);
      updateStars(selectedRating);
      const [faceValue, emotionText] = ratingPresentation(selectedRating);
      face.textContent = faceValue;
      emotion.textContent = emotionText;
      playRatingSound(selectedRating);
      submitted = false;
      message.textContent = copy().selected(selectedRating);
    });
  });

  comment.addEventListener("input", () => {
    if (submitted) {
      submitted = false;
      message.textContent = copy().selected(selectedRating);
    }
  });

  ratingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!selectedRating) {
      message.textContent = copy().required;
      stars[0].focus();
      return;
    }

    submitted = true;
    renderSubmissionLink();
  });

  function renderSubmissionLink() {
    const localized = copy();
    const parts = [localized.rating(selectedRating)];
    const commentText = comment.value.trim();
    if (commentText) parts.push(localized.comment(commentText));

    const link = document.createElement("a");
    link.href = `https://wa.me/962786189116?text=${encodeURIComponent(parts.join("\n"))}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = localized.send;

    message.textContent = localized.ready;
    message.append(document.createElement("br"), link);
  }

  document.addEventListener("languagechange", () => {
    if (selectedRating) {
      const [, emotionText] = ratingPresentation(selectedRating);
      emotion.textContent = emotionText;
      if (submitted) renderSubmissionLink();
      else message.textContent = copy().selected(selectedRating);
    }
  });
}
