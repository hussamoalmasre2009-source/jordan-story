document.addEventListener("DOMContentLoaded", () => {
  const origin = document.querySelector("#map-route-origin");
  const destination = document.querySelector("#map-route-destination");
  const button = document.querySelector("#map-route-button");
  const map = document.querySelector("#jordan-map");

  if (!origin || !destination || !button || !map) return;

  button.addEventListener("click", () => {
    const from = encodeURIComponent(origin.value.trim() || "عمّان، الأردن");
    const to = encodeURIComponent(destination.value);
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${from}&destination=${to}&travelmode=driving`, "_blank", "noopener,noreferrer");
    map.src = `https://www.google.com/maps?q=${to}&z=10&output=embed`;
  });

  destination.addEventListener("change", () => {
    map.src = `https://www.google.com/maps?q=${encodeURIComponent(destination.value)}&z=11&output=embed`;
  });
});
