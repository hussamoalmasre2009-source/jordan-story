const ratingForm = document.querySelector("#rating-form");

if (ratingForm) {
  const stars = [...ratingForm.querySelectorAll(".star-button")];
  const message = ratingForm.querySelector("#rating-message");
  const face = ratingForm.querySelector("#rating-face");
  const emotion = ratingForm.querySelector("#rating-emotion");
  const comment = ratingForm.querySelector("#rating-comment");
  let selectedRating = 0;

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
    const english = document.documentElement.dataset.language === "en";
    if (rating === 1) return ["😢", english ? "We are sorry. Please tell us what went wrong." : "نأسف. أخبرنا ما الذي لم يعجبك."];
    if (rating === 2) return ["😞", english ? "We can do better. Your feedback helps." : "يمكننا تقديم تجربة أفضل. رأيك مهم."];
    if (rating === 3) return ["😐", english ? "An acceptable visit, but we want to improve." : "تجربة مقبولة، ونريد أن نكون أفضل."];
    if (rating === 4) return ["🙂", english ? "Thank you! We are close to excellent." : "شكراً لك! اقتربنا من تجربة ممتازة."];
    return ["😍", english ? "Excellent! Thank you for your support." : "ممتاز! شكراً لدعمك."];
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
      message.textContent = document.documentElement.dataset.language === "en"
        ? `You selected ${selectedRating} out of 5 stars`
        : `اخترت ${selectedRating} من 5 نجوم`;
    });
  });

  ratingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!selectedRating) {
      message.textContent = document.documentElement.dataset.language === "en"
        ? "Please select a rating first."
        : "اختَر عدد النجوم أولاً، من فضلك.";
      stars[0].focus();
      return;
    }

    const hasComment = comment.value.trim().length > 0;
    message.textContent = document.documentElement.dataset.language === "en"
      ? (hasComment ? "Thank you! Your rating and comment have been received." : "Thank you for your rating and visit! We appreciate your feedback.")
      : (hasComment ? "شكراً لك! تم استقبال تقييمك وتعليقك." : "شكراً جزيلاً على تقييمك وزيارتك! رأيك يسعدنا.");
  });

  document.addEventListener("languagechange", () => {
    if (selectedRating) {
      const [, emotionText] = ratingPresentation(selectedRating);
      emotion.textContent = emotionText;
      message.textContent = document.documentElement.dataset.language === "en"
        ? `You selected ${selectedRating} out of 5 stars`
        : `اخترت ${selectedRating} من 5 نجوم`;
    }
  });
}
