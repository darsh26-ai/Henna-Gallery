// ========================================
// HENNA GALLERY
// Automatically loads every image from
// the GitHub "images" folder.
// ========================================

const GITHUB_OWNER = "darsh26-ai";
const GITHUB_REPO = "Henna-Gallery";
const IMAGE_FOLDER = "images";


// ========================================
// PAGE ELEMENTS
// ========================================

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let galleryImages = [];
let currentIndex = 0;


// ========================================
// LOAD ALL IMAGES FROM GITHUB
// ========================================

async function loadGallery() {

  try {

    const apiUrl =
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${IMAGE_FOLDER}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status}`
      );
    }

    const files = await response.json();


    // ----------------------------------------
    // Keep only image files
    // ----------------------------------------

    const imageFiles = files
      .filter(file => file.type === "file")
      .filter(file =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
      );


    // ----------------------------------------
    // Sort images by filename
    //
    // This makes:
    // photo1.jpg
    // photo2.jpg
    // photo10.jpg
    //
    // appear in the expected order.
    // ----------------------------------------

    imageFiles.sort((a, b) =>
      a.name.localeCompare(
        b.name,
        undefined,
        {
          numeric: true,
          sensitivity: "base"
        }
      )
    );


    // ----------------------------------------
    // Create gallery image objects
    // ----------------------------------------

    galleryImages = imageFiles.map(file => {

      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .trim();

      return {
        file: `${IMAGE_FOLDER}/${file.name}`,
        alt: `Henna artwork ${cleanName}`
      };

    });


    // ----------------------------------------
    // Display the gallery
    // ----------------------------------------

    displayGallery();


  } catch (error) {

    console.error("Gallery loading error:", error);

    gallery.innerHTML = `
      <div style="
        width: 100%;
        text-align: center;
        padding: 40px 20px;
      ">
        <p>
          Unable to load gallery images.
        </p>
        <p style="
          font-size: 14px;
          opacity: 0.7;
        ">
          Please try refreshing the page.
        </p>
      </div>
    `;

  }

}


// ========================================
// DISPLAY GALLERY
// ========================================

function displayGallery() {

  gallery.innerHTML = "";


  // No images found

  if (galleryImages.length === 0) {

    gallery.innerHTML = `
      <div style="
        width: 100%;
        text-align: center;
        padding: 40px 20px;
      ">
        <p>No gallery images found.</p>
      </div>
    `;

    return;
  }


  // Create each image card

  galleryImages.forEach((item, index) => {

    const card = document.createElement("button");

    card.className = "card";
    card.type = "button";

    card.setAttribute(
      "aria-label",
      `View ${item.alt}`
    );


    const img = document.createElement("img");

    img.src = item.file;
    img.alt = item.alt;

    // Load first 4 immediately.
    // Load remaining images as needed.

    img.loading = index < 4
      ? "eager"
      : "lazy";


    // Add image to card

    card.appendChild(img);


    // Open lightbox when clicked

    card.addEventListener("click", () => {

      openLightbox(index);

    });


    // Add card to gallery

    gallery.appendChild(card);

  });

}


// ========================================
// OPEN LIGHTBOX
// ========================================

function openLightbox(index) {

  if (galleryImages.length === 0) {
    return;
  }


  currentIndex = index;


  lightboxImage.src =
    galleryImages[currentIndex].file;

  lightboxImage.alt =
    galleryImages[currentIndex].alt;


  lightbox.classList.add("open");

  lightbox.setAttribute(
    "aria-hidden",
    "false"
  );


  // Prevent webpage scrolling
  // while lightbox is open.

  document.body.style.overflow = "hidden";

}


// ========================================
// CLOSE LIGHTBOX
// ========================================

function closeLightbox() {

  lightbox.classList.remove("open");

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow = "";

}


// ========================================
// NEXT IMAGE
// ========================================

function showNext() {

  if (galleryImages.length === 0) {
    return;
  }


  currentIndex =
    (currentIndex + 1) %
    galleryImages.length;


  openLightbox(currentIndex);

}


// ========================================
// PREVIOUS IMAGE
// ========================================

function showPrev() {

  if (galleryImages.length === 0) {
    return;
  }


  currentIndex =
    (currentIndex - 1 +
      galleryImages.length) %
    galleryImages.length;


  openLightbox(currentIndex);

}


// ========================================
// BUTTON CONTROLS
// ========================================

closeBtn.addEventListener(
  "click",
  closeLightbox
);

nextBtn.addEventListener(
  "click",
  showNext
);

prevBtn.addEventListener(
  "click",
  showPrev
);


// ========================================
// CLICK OUTSIDE IMAGE TO CLOSE
// ========================================

lightbox.addEventListener("click", (event) => {

  if (event.target === lightbox) {

    closeLightbox();

  }

});


// ========================================
// KEYBOARD CONTROLS
// ========================================

document.addEventListener("keydown", (event) => {

  // Do nothing if lightbox is closed

  if (!lightbox.classList.contains("open")) {
    return;
  }


  // ESC = close

  if (event.key === "Escape") {

    closeLightbox();

  }


  // RIGHT ARROW = next

  if (event.key === "ArrowRight") {

    showNext();

  }


  // LEFT ARROW = previous

  if (event.key === "ArrowLeft") {

    showPrev();

  }

});


// ========================================
// AUTOMATIC COPYRIGHT YEAR
// ========================================

const yearElement =
  document.getElementById("year");

if (yearElement) {

  yearElement.textContent =
    new Date().getFullYear();

}


// ========================================
// START THE GALLERY
// ========================================

loadGallery();
