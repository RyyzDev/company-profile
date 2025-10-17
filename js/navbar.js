// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-theme");
  });
}

// ========== MENU NAVIGATION ==========
const circleBtn = document.getElementById("circleBtn");
const menuDropdown = document.getElementById("menuDropdown");
const hamburger = document.getElementById("hamburger");
const menuItems = document.querySelectorAll(".menu-item");

if (circleBtn && menuDropdown && hamburger) {
  circleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    menuDropdown.classList.toggle("active");
    hamburger.classList.toggle("active");
    const isActive = menuDropdown.classList.contains("active");
    menuDropdown.setAttribute("aria-hidden", String(!isActive));
  });

  // Close menu when clicking menu item
  if (menuItems && menuItems.length) {
    menuItems.forEach((item) => {
      item.addEventListener("click", () => {
        menuDropdown.classList.remove("active");
        hamburger.classList.remove("active");
        menuDropdown.setAttribute("aria-hidden", "true");
      });
    });
  }

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!circleBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
      menuDropdown.classList.remove("active");
      hamburger.classList.remove("active");
      menuDropdown.setAttribute("aria-hidden", "true");
    }
  });
}

// ========== PROJECT CAROUSEL - ALL FEATURES ==========
document.addEventListener("DOMContentLoaded", function () {
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const sliderTrack = document.querySelector(".slider-track-projects");
  const projectCards = document.querySelectorAll(".project-card");
  const modal = document.getElementById("projectModal");
  const closeButton = document.querySelector(".close-button");
  const modalImage = document.getElementById("modalProjectImage");
  const modalTitle = document.getElementById("modalProjectTitle");
  const modalDescription = document.getElementById("modalProjectDescription");
  const modalLink = document.getElementById("modalProjectLink");
  const prevBtn = document.getElementById("prevProjectBtn");
  const nextBtn = document.getElementById("nextProjectBtn");
  const indicatorsContainer = document.getElementById("carouselIndicators");

  // Check if elements exist
  if (!sliderWrapper || !sliderTrack || projectCards.length === 0) {
    console.error("Carousel elements not found!");
    return;
  }

  console.log("Carousel initialized with", projectCards.length, "cards");

  // ========== SHARED VARIABLES ==========
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  let currentSlide = 0;

  const totalSlides = Math.floor(projectCards.length / 2); // Half because duplicated
  console.log("Total slides:", totalSlides);

  // ========== HELPER FUNCTIONS ==========
  function getCardWidth() {
    return projectCards[0].offsetWidth + 20; // width + margin-right
  }

  function pauseAnimation() {
    sliderTrack.style.animationPlayState = "paused";
  }

  function resumeAnimation() {
    sliderTrack.style.animationPlayState = "running";
  }

  function setSliderPosition(position) {
    sliderTrack.style.transform = `translateX(${position}px)`;
    currentTranslate = position;
  }

  // ========== BUTTON NAVIGATION ==========
  function updateSlidePosition() {
    const cardWidth = getCardWidth();
    const translateX = -currentSlide * cardWidth;

    console.log("Updating slide to:", currentSlide, "translateX:", translateX);

    pauseAnimation();
    sliderTrack.style.transition = "transform 0.5s ease";
    setSliderPosition(translateX);
    prevTranslate = translateX;

    updateButtonStates();
    updateIndicators();

    // Resume animation after delay
    setTimeout(() => {
      sliderTrack.style.transition = "";
      resumeAnimation();
    }, 3000);
  }

  function updateButtonStates() {
    if (!prevBtn || !nextBtn) return;

    // Disable prev button at start
    if (currentSlide <= 0) {
      prevBtn.classList.add("disabled");
      prevBtn.disabled = true;
    } else {
      prevBtn.classList.remove("disabled");
      prevBtn.disabled = false;
    }

    // Disable next button at end
    if (currentSlide >= totalSlides - 1) {
      nextBtn.classList.add("disabled");
      nextBtn.disabled = true;
    } else {
      nextBtn.classList.remove("disabled");
      nextBtn.disabled = false;
    }

    console.log(
      "Button states - Prev disabled:",
      prevBtn.disabled,
      "Next disabled:",
      nextBtn.disabled
    );
  }

  // Button event listeners
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      console.log("Prev button clicked, current slide:", currentSlide);
      if (currentSlide > 0) {
        currentSlide--;
        updateSlidePosition();
      }
    });

    nextBtn.addEventListener("click", () => {
      console.log("Next button clicked, current slide:", currentSlide);
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlidePosition();
      }
    });

    // Initialize button states
    updateButtonStates();
    console.log("Buttons initialized");
  } else {
    console.error("Navigation buttons not found!");
  }

  // ========== INDICATOR DOTS ==========
  function updateIndicators() {
    if (!indicatorsContainer) return;

    const dots = indicatorsContainer.querySelectorAll(".indicator-dot");
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  if (indicatorsContainer) {
    // Create indicator dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.classList.add("indicator-dot");
      if (i === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        console.log("Indicator dot clicked:", i);
        currentSlide = i;
        updateSlidePosition();
      });

      indicatorsContainer.appendChild(dot);
    }
    console.log("Indicator dots created:", totalSlides);
  }

  // ========== DRAG/SWIPE FUNCTIONALITY ==========
  sliderTrack.addEventListener("touchstart", touchStart, { passive: false });
  sliderTrack.addEventListener("touchend", touchEnd);
  sliderTrack.addEventListener("touchmove", touchMove, { passive: false });
  sliderTrack.addEventListener("mousedown", touchStart);
  sliderTrack.addEventListener("mouseup", touchEnd);
  sliderTrack.addEventListener("mouseleave", touchEnd);
  sliderTrack.addEventListener("mousemove", touchMove);
  sliderTrack.addEventListener("contextmenu", (e) => e.preventDefault());

  function getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }

  function touchStart(e) {
    isDragging = true;
    pauseAnimation();
    startPos = getPositionX(e);

    const style = window.getComputedStyle(sliderTrack);
    const matrix = new WebKitCSSMatrix(style.transform);
    prevTranslate = matrix.m41;

    animationID = requestAnimationFrame(animation);
    sliderTrack.style.cursor = "grabbing";
  }

  function touchMove(e) {
    if (isDragging) {
      const currentPosition = getPositionX(e);
      currentTranslate = prevTranslate + currentPosition - startPos;
      setSliderPosition(currentTranslate);
    }
  }

  function animation() {
    if (isDragging) requestAnimationFrame(animation);
  }

  function touchEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;
    const cardWidth = getCardWidth();

    // Calculate which slide we should snap to
    let targetSlide = currentSlide;

    if (movedBy < -cardWidth / 3 && currentSlide < totalSlides - 1) {
      targetSlide = currentSlide + 1;
    } else if (movedBy > cardWidth / 3 && currentSlide > 0) {
      targetSlide = currentSlide - 1;
    }

    currentSlide = targetSlide;

    sliderTrack.style.cursor = "grab";
    sliderTrack.style.transition = "transform 0.3s ease-out";

    const translateX = -currentSlide * cardWidth;
    setSliderPosition(translateX);
    prevTranslate = translateX;

    updateButtonStates();
    updateIndicators();

    setTimeout(() => {
      sliderTrack.style.transition = "";
      resumeAnimation();
    }, 3000);
  }

  // Set grab cursor
  sliderTrack.style.cursor = "grab";

  // Prevent image dragging
  const images = sliderTrack.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("dragstart", (e) => e.preventDefault());
  });

  // ========== MODAL FUNCTIONALITY ==========
  projectCards.forEach((card) => {
    let clickStartTime = 0;
    let clickStartPos = { x: 0, y: 0 };

    card.addEventListener("mousedown", (e) => {
      clickStartTime = Date.now();
      clickStartPos = { x: e.clientX, y: e.clientY };
    });

    card.addEventListener(
      "touchstart",
      (e) => {
        clickStartTime = Date.now();
        clickStartPos = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      },
      { passive: true }
    );

    card.addEventListener("click", (e) => {
      const clickEndTime = Date.now();
      const timeDiff = clickEndTime - clickStartTime;
      const distance = Math.sqrt(
        Math.pow(e.clientX - clickStartPos.x, 2) +
          Math.pow(e.clientY - clickStartPos.y, 2)
      );

      // Only open modal if it was a quick click without dragging
      if (timeDiff < 300 && distance < 10) {
        openModal(card);
      }
    });
  });

  function openModal(card) {
    const title = card.getAttribute("data-title");
    const image = card.getAttribute("data-image");
    const description = card.getAttribute("data-description");
    const projectLink = card.getAttribute("data-project-link");

    if (modalTitle) modalTitle.textContent = title;
    if (modalImage) {
      modalImage.src = image;
      modalImage.alt = title;
    }
    if (modalDescription) modalDescription.textContent = description;
    if (modalLink) modalLink.href = projectLink;

    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  // Close modal events
  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.style.display === "flex") {
      closeModal();
    }
  });

  // ========== AUTO-SCROLL CONTROL ==========//
  sliderWrapper.addEventListener("mouseenter", () => {
    pauseAnimation();
  });

  sliderWrapper.addEventListener("mouseleave", () => {
    if (!isDragging) {
      resumeAnimation();
    }
  });

  sliderWrapper.addEventListener(
    "touchstart",
    () => {
      pauseAnimation();
    },
    { passive: true }
  );

  // ========== WINDOW RESIZE HANDLER ==========
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateSlidePosition();
    }, 250);
  });

  console.log("Carousel setup complete!");
});
