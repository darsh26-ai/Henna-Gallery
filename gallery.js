const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let galleryImages = [];
let currentIndex = 0;


// ========================================
// AUTOMATICALLY FIND IMAGES FROM GITHUB
// ========================================

// If your GitHub Pages address is:
// https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
// this will automatically figure out the username/repository.

const host = window.location.hostname;
const pathParts = window.location.pathname.split("/").filter(Boolean);

let owner = "";
let repo = "";

if (host.endsWith(".github.io")) {
  owner = host.split(".")[0];

  // Project Pages: username.github.io/repository
  // User Pages: username.github.io
  repo = pathParts.length > 0
    ? pathParts[0]
    : `${owner}.github.io`;
}


// Get all images from the GitHub images folder
async function loadGallery() {
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/images`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Could not load images from GitHub.");
    }

    const files = await response.json();

    // Only show image files
    const imageFiles = files
      .filter(file => file.type === "file")
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base"
      }));

    galleryImages = imageFiles.map(file => ({
      file: `images/${file.name}`,
      alt: `Henna artwork - ${file.name.replace(/\.[^/.]+$/, "")}`
    }));

    displayGallery();

  } catch (error) {
    console.error(error);

    gallery.innerHTML = `
      <p style="text-align:center; width:100%;">
        Unable to load gallery images.
      </p>
    `;
  }
}


// ========================================
// DISPLAY GALLERY
// ========================================

function displayGallery() {
  gallery.innerHTML = "";

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

    card.addEventListener("click", () => {
      openLightbox(index);
    });

    gallery.appendChild(card);
  });
}


// ========================================
// LIGHTBOX
// ========================================

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
  if (galleryImages.length === 0) return;

  currentIndex =
    (currentIndex + 1) % galleryImages.length;

  openLightbox(currentIndex);
}


function showPrev() {
  if (galleryImages.length === 0) return;

  currentIndex =
    (currentIndex - 1 + galleryImages.length) %
    galleryImages.length;

  openLightbox(currentIndex);
}


// ========================================
// BUTTONS
// ========================================

closeBtn.addEventListener("click", closeLightbox);
nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);


// Close when clicking outside image
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});


// Keyboard controls
document.addEventListener("keydown", (e) => {

  if (!lightbox.classList.contains("open")) return;

  if (e.key === "Escape") {
    closeLightbox();
  }

  if (e.key === "ArrowRight") {
    showNext();
  }

  if (e.key === "ArrowLeft") {
    showPrev();
  }
});


// Current year
document.getElementById("year").textContent =
  new Date().getFullYear();


// ========================================
// START GALLERY
// ========================================

loadGallery();
