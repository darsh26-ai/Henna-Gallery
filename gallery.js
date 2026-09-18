const galleryImages = [
  { file: "images/henna-001.jpeg", alt: "Henna artwork design 1" },
  { file: "images/henna-002.jpg", alt: "Henna artwork design 2" },

  // Add more artwork below:
  // { file: "images/henna-003.jpg", alt: "Henna artwork design 3" },
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let currentIndex = 0;

galleryImages.forEach((item, index) => {
  const card = document.createElement("button");
  card.className = "card";
  card.type = "button";
  card.setAttribute("aria-label", `View ${item.alt}`);

  const img = document.createElement("img");
  img.src = item.file;
  img.alt = item.alt;
  img.loading = index < 4 ? "eager" : "lazy";

  card.appendChild(img);
  card.addEventListener("click", () => openLightbox(index));
  gallery.appendChild(card);
});

function openLightbox(index) {
  currentIndex = index;
  lightboxImage.src = galleryImages[currentIndex].file;
  lightboxImage.alt = galleryImages[currentIndex].alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  openLightbox(currentIndex);
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  openLightbox(currentIndex);
}

closeBtn.addEventListener("click", closeLightbox);
nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
});

document.getElementById("year").textContent = new Date().getFullYear();
