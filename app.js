(function () {
  "use strict";

  /* =========================================================
     LESSON METADATA (Option 1)
     - Keeps lesson number + subtitle centralized
     - Prevents storage collisions across lessons
  ========================================================= */
  const LESSON = {
    number: 6,
    subtitle: "Pre-Brief (1 hour)",
  };

  const STORAGE_PREFIX = `lesson${LESSON.number}_check_`;

  // Path helper (all images live here)
  const img = (file) => `assets/images/${file}`;

  // Icon mapping (must match files in assets/images/)
  const ICON = {
    BRIEF: "Brief.png",
    DETERMINE: "Determine.png",
    DISCUSS: "Discuss.png",
    LIST: "List.png",
    DESCRIBE: "Describe.png",
    PREVIEW: "Preview.png",
    REVIEW: "Review.png",
  };

  // Title derived from filename (no captions shown; title used in lightbox bar)
  function titleFromFilename(filename) {
    if (!filename) return "";
    return filename.replace(/\.[^/.]+$/, "");
  }

  /* =========================================================
     INJECT LESSON META INTO HTML
  ========================================================= */
  const elLessonNumber = document.getElementById("lessonNumber");
  const elLessonSubtitle = document.getElementById("lessonSubtitle");

  if (elLessonNumber) elLessonNumber.textContent = `Lesson ${LESSON.number}`;
  if (elLessonSubtitle) elLessonSubtitle.textContent = LESSON.subtitle;

  /* =========================================================
     TOPICS – LESSON 6 (filenames EXACTLY as provided)
  ========================================================= */
  const topics = [
    {
      id: "aerodynamics",
      label: "Aerodynamics",
      iconKey: "DISCUSS",
      heading: "Aerodynamics",
      bullets: [],
      images: [
        "4_forces_of_flight.jpg",
        "Static_Stability.png",
        "Stalls_Coefficient_of_Lift.png",
        "Aerodynamics_Affecting_Maneuvers.png",
        "Gyroscopic_Precession.png",
        "P-Factor.png",
        "Awaiting Content.jpg", // placeholder slot
        "Torque_Effect.png",
        "Adverse-Yaw.png",
      ],
    },

    {
      id: "use-of-metars",
      label: "Use of METARs",
      iconKey: "DESCRIBE",
      heading: "Use of METARs",
      bullets: [],
      images: ["METAR_decoder(1).png", "METAR_decoder(2).png", "METAR example.png"],
    },

    {
      id: "use-of-tafs",
      label: "Use of TAFs",
      iconKey: "DESCRIBE",
      heading: "Use of TAFs",
      bullets: [],
      images: ["TAF_decoder.png", "TAF Example.jpg"],
    },

    {
      id: "types-of-airspace",
      label: "Types of Airspace",
      iconKey: "DISCUSS",
      heading: "Types of Airspace",
      bullets: [],
      images: ["Airspace_Classifications.png"],
    },

    {
      id: "entering-operating-airspaces",
      label: "Entering and Operating in Various Airspaces",
      iconKey: "DESCRIBE",
      heading: "Entering and Operating in Various Airspaces",
      bullets: ["Requirements and limitations"],
      images: ["VFR_Weather_Minimums.png", "Required_Equipment_for_Airspace_Entry.png"],
    },
  ].map((t) => ({
    ...t,
    imagePath: img(ICON[t.iconKey] || ICON.DISCUSS),
    images: (t.images || []).map((file) => ({
      title: titleFromFilename(file),
      src: img(file),
      alt: titleFromFilename(file),
      file,
    })),
  }));

  /* =========================================================
     DOM HOOKS
  ========================================================= */
  const pageSplash = document.getElementById("pageSplash");
  const pageLesson = document.getElementById("pageLesson");
  const startBriefBtn = document.getElementById("startBriefBtn");

  const menuList = document.getElementById("lessonMenuList");
  const contentHeading = document.getElementById("contentHeading");
  const contentBullets = document.getElementById("contentBullets");
  const thumbGrid = document.getElementById("thumbGrid");

  const lessonContent = document.querySelector(".lesson-content"); // ✅ for no-bullets state

  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");

  const lightboxImageWrap = lightbox ? lightbox.querySelector(".lightbox-image-wrap") : null;

  let currentTopicId = topics[0]?.id || "";

  /* =========================================================
     HELPERS
  ========================================================= */
  function storageKey(topicId, idx) {
    return STORAGE_PREFIX + topicId + "_" + idx;
  }

  function clearMedia() {
    if (!thumbGrid) return;
    thumbGrid.innerHTML = "";
    thumbGrid.className = "media-container";
  }

  /* =========================================================
     BULLETS (default + optional checklist)
     - Long bullets => single column (threshold 110)
     - No punctuation changes
     - NEW: when no bullets, add .no-bullets to .lesson-content
  ========================================================= */
  function renderBullets(topic) {
    if (!contentBullets) return;

    contentBullets.innerHTML = "";
    contentBullets.classList.remove("has-checklist");
    contentBullets.classList.remove("is-single-column");

    const bullets = Array.isArray(topic.bullets) ? topic.bullets : [];

    // ✅ NEW: flag no-bullets state for vertical centering behavior
    if (lessonContent) lessonContent.classList.toggle("no-bullets", bullets.length === 0);

    if (!bullets.length) return;

    // Auto single-column when any bullet is "long"
    const LONG_BULLET_THRESHOLD = 110;
    const hasLongBullet = bullets.some((b) => (b || "").length > LONG_BULLET_THRESHOLD);
    if (hasLongBullet) contentBullets.classList.add("is-single-column");

    // Optional checklist feature (not used in Lesson 6 but preserved baseline)
    const checklistLastN = Number.isFinite(topic.checklistLastN)
      ? Math.max(0, topic.checklistLastN)
      : 0;
    const checklistCount = Math.min(checklistLastN, bullets.length);
    const checklistStart = bullets.length - checklistCount;

    bullets.forEach((text, i) => {
      // normal bullet
      if (!checklistCount || i < checklistStart) {
        const li = document.createElement("li");
        li.textContent = text;
        contentBullets.appendChild(li);
        return;
      }

      // checklist mode
      contentBullets.classList.add("has-checklist");

      if (i === checklistStart) {
        const headerLi = document.createElement("li");
        headerLi.className = "checklist-header";
        headerLi.textContent = (topic.checklistHeader || "CHECKLIST").toUpperCase();
        contentBullets.appendChild(headerLi);
      }

      const li = document.createElement("li");
      li.className = "check-row";

      const id = `chk_${topic.id}_${i}`;
      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = id;

      const saved = localStorage.getItem(storageKey(topic.id, i));
      if (saved === "1") {
        input.checked = true;
        li.classList.add("is-done");
      }

      const label = document.createElement("label");
      label.setAttribute("for", id);
      label.textContent = text;

      input.addEventListener("change", () => {
        li.classList.toggle("is-done", input.checked);
        localStorage.setItem(storageKey(topic.id, i), input.checked ? "1" : "0");
      });

      li.appendChild(input);
      li.appendChild(label);
      contentBullets.appendChild(li);
    });
  }

  /* =========================================================
     LIGHTBOX (title bar only, no captions)
  ========================================================= */
  function openLightbox(imgData) {
    if (!lightbox || !lightboxImage || !lightboxTitle) return;

    lightboxTitle.textContent = imgData.title || "Image";
    lightboxImage.classList.remove("is-visible");
    lightboxImage.src = "";
    lightboxImage.alt = imgData.alt || imgData.title || "";

    lightbox.classList.add("is-visible");

    const pre = new Image();
    pre.onload = () => {
      lightboxImage.src = imgData.src;
      requestAnimationFrame(() => lightboxImage.classList.add("is-visible"));
    };
    pre.onerror = () => {
      lightboxImage.src = imgData.src;
      requestAnimationFrame(() => lightboxImage.classList.add("is-visible"));
    };
    pre.src = imgData.src;
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove("is-visible");
    lightboxImage.classList.remove("is-visible");
  }

  /* =========================================================
     CAROUSEL BUILDER (POC feature-complete)
     - indicators + prev/next controls
     - fullscreen button overlay
     - click image opens lightbox
     - no captions
  ========================================================= */
  function buildBootstrapCarousel(images) {
    const carouselId = "topicCarousel";

    const carousel = document.createElement("div");
    carousel.id = carouselId;
    carousel.className = "carousel slide";
    carousel.setAttribute("data-bs-touch", "true");

    // Indicators
    const indicators = document.createElement("div");
    indicators.className = "carousel-indicators";

    // Inner
    const inner = document.createElement("div");
    inner.className = "carousel-inner";

    images.forEach((imgData, index) => {
      const ind = document.createElement("button");
      ind.type = "button";
      ind.setAttribute("data-bs-target", "#" + carouselId);
      ind.setAttribute("data-bs-slide-to", String(index));
      ind.setAttribute("aria-label", "Slide " + (index + 1));
      if (index === 0) ind.classList.add("active");
      indicators.appendChild(ind);

      const item = document.createElement("div");
      item.className = "carousel-item" + (index === 0 ? " active" : "");

      const wrap = document.createElement("div");
      wrap.className = "thumb-image-wrap";

      const imageEl = document.createElement("img");
      imageEl.className = "d-block w-100";
      imageEl.src = imgData.src;
      imageEl.alt = imgData.alt || imgData.title || "Lesson image";

      // Fullscreen button (bottom-right)
      const fsBtn = document.createElement("button");
      fsBtn.type = "button";
      fsBtn.setAttribute("aria-label", "Open fullscreen view");
      fsBtn.innerHTML = "<span>⤢</span>";
      fsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(imgData);
      });

      // Click image area => open lightbox
      wrap.addEventListener("click", () => openLightbox(imgData));

      wrap.appendChild(imageEl);
      wrap.appendChild(fsBtn);

      item.appendChild(wrap);
      inner.appendChild(item);
    });

    // Prev/Next controls
    const prev = document.createElement("button");
    prev.className = "carousel-control-prev";
    prev.type = "button";
    prev.setAttribute("data-bs-target", "#" + carouselId);
    prev.setAttribute("data-bs-slide", "prev");
    prev.setAttribute("aria-label", "Previous slide");
    prev.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span>';

    const next = document.createElement("button");
    next.className = "carousel-control-next";
    next.type = "button";
    next.setAttribute("data-bs-target", "#" + carouselId);
    next.setAttribute("data-bs-slide", "next");
    next.setAttribute("aria-label", "Next slide");
    next.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span>';

    carousel.appendChild(indicators);
    carousel.appendChild(inner);
    carousel.appendChild(prev);
    carousel.appendChild(next);

    return carousel;
  }

  function buildSingleHero(imgData) {
    const hero = document.createElement("div");
    hero.className = "single-hero";

    const wrap = document.createElement("div");
    wrap.className = "thumb-image-wrap";

    const imageEl = document.createElement("img");
    imageEl.src = imgData.src;
    imageEl.alt = imgData.alt || imgData.title || "Lesson image";

    const fsBtn = document.createElement("button");
    fsBtn.type = "button";
    fsBtn.setAttribute("aria-label", "Open fullscreen view");
    fsBtn.innerHTML = "<span>⤢</span>";
    fsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(imgData);
    });

    wrap.appendChild(imageEl);
    wrap.appendChild(fsBtn);

    wrap.addEventListener("click", () => openLightbox(imgData));

    hero.appendChild(wrap);
    return hero;
  }

  /* =========================================================
     OPTIONAL TABLE (kept for baseline completeness)
  ========================================================= */
  function buildTable(table) {
    const wrap = document.createElement("div");
    wrap.className = "task-table-wrap";

    const tbl = document.createElement("table");
    tbl.className = "task-table";

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    (table.headers || []).forEach((h) => {
      const th = document.createElement("th");
      th.textContent = h;
      trh.appendChild(th);
    });
    thead.appendChild(trh);

    const tbody = document.createElement("tbody");
    (table.rows || []).forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cell, idx) => {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
        if (idx === 1) td.classList.add("definition");
        if (idx === 2) td.classList.add("score");
      });
      tbody.appendChild(tr);
    });

    tbl.appendChild(thead);
    tbl.appendChild(tbody);
    wrap.appendChild(tbl);
    return wrap;
  }

  /* =========================================================
     PANEL BUILD
  ========================================================= */
  function buildPanel(topic) {
    clearMedia();

    if (!thumbGrid) return;

    if (topic.table) {
      thumbGrid.classList.add("is-table");
      thumbGrid.appendChild(buildTable(topic.table));
      return;
    }

    const safeImages = Array.isArray(topic.images) ? topic.images : [];
    const count = safeImages.length;

    if (count > 1) {
      thumbGrid.classList.add("is-carousel");
      const carousel = buildBootstrapCarousel(safeImages);
      thumbGrid.appendChild(carousel);

      try {
        new bootstrap.Carousel(carousel, {
          interval: false,
          ride: false,
          wrap: true,
          touch: true,
        });
      } catch (e) {}
      return;
    }

    if (count === 1) {
      thumbGrid.classList.add("is-single");
      thumbGrid.appendChild(buildSingleHero(safeImages[0]));
      return;
    }

    thumbGrid.classList.add("is-empty");
  }

  /* =========================================================
     MENU BUILD (matches CSS wrapper structure)
  ========================================================= */
  function buildMenu() {
    if (!menuList) return;

    const frag = document.createDocumentFragment();

    topics.forEach((topic, idx) => {
      const li = document.createElement("li");
      li.className = "lesson-menu-item" + (idx === 0 ? " is-active" : "");
      li.setAttribute("data-topic-id", topic.id);

      const iconWrap = document.createElement("span");
      iconWrap.className = "lesson-menu-icon";

      const icon = document.createElement("img");
      icon.src = topic.imagePath;
      icon.alt = "";
      iconWrap.appendChild(icon);

      const label = document.createElement("span");
      label.textContent = topic.label;

      li.appendChild(iconWrap);
      li.appendChild(label);

      li.addEventListener("click", () => setTopic(topic.id));

      frag.appendChild(li);
    });

    menuList.innerHTML = "";
    menuList.appendChild(frag);
  }

  /* =========================================================
     TOPIC SWITCH
  ========================================================= */
  function setTopic(topicId) {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return;

    currentTopicId = topicId;

    if (menuList) {
      menuList.querySelectorAll(".lesson-menu-item").forEach((item) => {
        item.classList.toggle("is-active", item.getAttribute("data-topic-id") === topicId);
      });
    }

    if (contentHeading) contentHeading.textContent = topic.heading || "";
    renderBullets(topic);
    buildPanel(topic);
  }

  /* =========================================================
     SPLASH START
  ========================================================= */
  if (startBriefBtn) {
    startBriefBtn.addEventListener("click", () => {
      if (pageSplash) pageSplash.classList.remove("is-active");
      if (pageLesson) pageLesson.classList.add("is-active");
      setTopic(currentTopicId);
    });
  }

  /* =========================================================
     LIGHTBOX CLOSE HANDLERS (POC)
  ========================================================= */
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxImage) lightboxImage.addEventListener("click", closeLightbox);
  if (lightboxImageWrap) lightboxImageWrap.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("is-visible")) return;
    if (e.key === "Escape") closeLightbox();
  });

  /* =========================================================
     INIT
  ========================================================= */
  buildMenu();
  if (currentTopicId) setTopic(currentTopicId);
})();
