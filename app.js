/**
 * Cirrus Lesson Module — Single-File Baseline (Team-Grade)
 * --------------------------------------------------------
 * CONTENT-ONLY CHANGES:
 *  - LESSON (number/subtitle)
 *  - TOPICS_RAW (topic data + filenames)
 * Everything else is locked baseline behavior.
 */

(function () {
  "use strict";

  /* =========================================================
    LESSON META (CONTENT ONLY)
  ========================================================= */
  const LESSON = {
    number: 7,
    subtitle: "", // Per your direction: no splash subtitle for Lesson 7
  };

  /* =========================================================
    TOPICS (CONTENT ONLY) — Lesson 7
    Filenames below match your screenshot naming (underscores, parentheses).
    Missing filename in screenshot => uses Awaiting Content.jpg placeholder.
  ========================================================= */
  const TOPICS_RAW = [
    {
      id: "fuel-system",
      label: "Fuel System",
      iconKey: "DESCRIBE",
      heading: "Fuel System",
      bullets: [],
      images: [
        "Fuel_System_Purpose(SR20).png",
        "Fuel_System(SR20).png",
        "CAS_Fuel_Advisories.png",
        "CAS_Fuel_Cautions.png",
        "CAS_Fuel_Warnings.png",
      ],
    },

    {
      id: "calculating-fuel-requirements",
      label: "Calculating Fuel Requirements",
      iconKey: "REFERENCE",
      heading: "Calculating Fuel Requirements",
      bullets: ["FAR/AIM", "POH/AFM", "Cirrus Standards"],
      images: [
        "VFR_Fuel_Requirements.png",
        "Time_Fuel_Distance_to_Climb(SR20).png",
        "Range_Endurance_Profile(SR20).png",
      ],
    },

    {
      id: "electrical-system",
      label: "Electrical System",
      iconKey: "DESCRIBE",
      heading: "Electrical System",
      bullets: [],
      images: [
        "Electrical_System_Purpose(SR20).png",
        "Electrical_System(SR20).png",
        "Main_Bus_Cautions.png",
        "Alternator_Cautions.png",
        "Battery_Cautions.png",
        "Main_Bus_Warnings.png",
        "CAS_Essential_Bus_Warning.png",
        "Electrical_System_Limitations(SR20).png",
      ],
    },

    {
      id: "avionics-system",
      label: "Avionics System",
      iconKey: "DESCRIBE",
      heading: "Avionics System",
      bullets: [],
      images: [
        "Avionics_Purpose.png",
        "Avionics_Components(SR20)(1).png",
        "Avionics_Components(SR20)(2).png",
        "Avionics_Limitations.png",
        "Avionics_Cautions.png",
      ],
    },

    {
      id: "types-of-cas-annunciators",
      label: "Types of CAS Annunciators",
      iconKey: "DIFFERENTIATE",
      heading: "Types of CAS Annunciators",
      bullets: [],
      images: [
        "CAS_Fuel_Advisories.png",
        "Advisory_Message_Guidance.png",
        "CAS_Fuel_Cautions.png",
        "Caution_Message_Guidance.png",
        "Awaiting Content.jpg", // Placeholder for Fuel Imbalance Caution Procedure (SR20)
        "CAS_Essential_Bus_Warning.png",
        "Warning_Message_Guidance.png",
        "Essential_Bus_Warning_Procedure(SR20)(1).png",
        "Essential_Bus_Warning_Procedure(SR20)(2).png",
      ],
    },

    {
      id: "cas-annunciators",
      label: "CAS Annunciators",
      iconKey: "DESCRIBE",
      heading: "CAS Annunciators",
      bullets: [],
      images: [
        "CAS_Fuel_Advisories.png",
        "Advisory_Message_Guidance.png",
        "CAS_Fuel_Cautions.png",
        "Caution_Message_Guidance.png",
        "Awaiting Content.jpg", // Placeholder for Fuel Imbalance Caution Procedure (SR20)
        "CAS_Essential_Bus_Warning.png",
        "Warning_Message_Guidance.png",
        "Essential_Bus_Warning_Procedure(SR20)(1).png",
        "Essential_Bus_Warning_Procedure(SR20)(2).png",
      ],
    },
  ];

  /* =========================================================
    BASELINE CONFIG (DO NOT EDIT)
  ========================================================= */
  const STORAGE_PREFIX = `lesson${LESSON.number}_check_`;
  const img = (file) => `assets/images/${file}`;

  const ICON = {
    BRIEF: "Brief.png",
    DETERMINE: "Determine.png",
    DISCUSS: "Discuss.png",
    LIST: "List.png",
    DESCRIBE: "Describe.png",
    PREVIEW: "Preview.png",
    REVIEW: "Review.png",

    // Temporary mappings so Lesson 7 doesn't break.
    // If/when you add these files to assets/images, update these two lines:
    REFERENCE: "Discuss.png",
    DIFFERENTIATE: "Discuss.png",
  };

  function titleFromFilename(filename) {
    if (!filename) return "";
    return filename.replace(/\.[^/.]+$/, "");
  }

  /* =========================================================
    DOM HOOKS (DO NOT EDIT)
  ========================================================= */
  const pageSplash = document.getElementById("pageSplash");
  const pageLesson = document.getElementById("pageLesson");
  const startBriefBtn = document.getElementById("startBriefBtn");

  const menuList = document.getElementById("lessonMenuList");
  const contentHeading = document.getElementById("contentHeading");
  const contentBullets = document.getElementById("contentBullets");
  const thumbGrid = document.getElementById("thumbGrid");

  const lessonContent = document.querySelector(".lesson-content");

  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxImageWrap = lightbox ? lightbox.querySelector(".lightbox-image-wrap") : null;

  /* =========================================================
    LESSON META INJECTION (DO NOT EDIT)
  ========================================================= */
  const elLessonNumber = document.getElementById("lessonNumber");
  const elLessonSubtitle = document.getElementById("lessonSubtitle");
  if (elLessonNumber) elLessonNumber.textContent = `Lesson ${LESSON.number}`;
  if (elLessonSubtitle) elLessonSubtitle.textContent = LESSON.subtitle;

  /* =========================================================
    NORMALIZE TOPICS (DO NOT EDIT)
  ========================================================= */
  const topics = TOPICS_RAW.map((t) => ({
    ...t,
    imagePath: img(ICON[t.iconKey] || ICON.DISCUSS),
    images: (t.images || []).map((file) => ({
      title: titleFromFilename(file),
      src: img(file),
      alt: titleFromFilename(file),
      file,
    })),
  }));

  let currentTopicId = topics[0]?.id || "";

  /* =========================================================
    UTILITIES (DO NOT EDIT)
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
    BULLETS + CHECKLIST (DO NOT EDIT)
     - Adds .no-bullets on .lesson-content when bullets are empty
  ========================================================= */
  function renderBullets(topic) {
    if (!contentBullets) return;

    contentBullets.innerHTML = "";
    contentBullets.classList.remove("has-checklist");
    contentBullets.classList.remove("is-single-column");

    const bullets = Array.isArray(topic.bullets) ? topic.bullets : [];

    if (lessonContent) lessonContent.classList.toggle("no-bullets", bullets.length === 0);
    if (!bullets.length) return;

    const LONG_BULLET_THRESHOLD = 110;
    const hasLongBullet = bullets.some((b) => (b || "").length > LONG_BULLET_THRESHOLD);
    if (hasLongBullet) contentBullets.classList.add("is-single-column");

    const checklistLastN = Number.isFinite(topic.checklistLastN) ? Math.max(0, topic.checklistLastN) : 0;
    const checklistCount = Math.min(checklistLastN, bullets.length);
    const checklistStart = bullets.length - checklistCount;

    bullets.forEach((text, i) => {
      if (!checklistCount || i < checklistStart) {
        const li = document.createElement("li");
        li.textContent = text;
        contentBullets.appendChild(li);
        return;
      }

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
    LIGHTBOX (DO NOT EDIT)
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
    MEDIA: CAROUSEL (DO NOT EDIT)
  ========================================================= */
  function buildBootstrapCarousel(images, carouselId) {
    const carousel = document.createElement("div");
    carousel.id = carouselId;
    carousel.className = "carousel slide";
    carousel.setAttribute("data-bs-touch", "true");

    const indicators = document.createElement("div");
    indicators.className = "carousel-indicators";

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

      const fsBtn = document.createElement("button");
      fsBtn.type = "button";
      fsBtn.setAttribute("aria-label", "Open fullscreen view");
      fsBtn.innerHTML = "<span>⤢</span>";
      fsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(imgData);
      });

      wrap.addEventListener("click", () => openLightbox(imgData));

      wrap.appendChild(imageEl);
      wrap.appendChild(fsBtn);

      item.appendChild(wrap);
      inner.appendChild(item);
    });

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

    wrap.addEventListener("click", () => openLightbox(imgData));

    wrap.appendChild(imageEl);
    wrap.appendChild(fsBtn);

    hero.appendChild(wrap);
    return hero;
  }

  /* =========================================================
    OPTIONAL TABLE (DO NOT EDIT)
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
    PANEL BUILD (DO NOT EDIT)
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
      const carouselId = `topicCarousel_${topic.id}`;
      const carousel = buildBootstrapCarousel(safeImages, carouselId);
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
    MENU BUILD (DO NOT EDIT)
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
    TOPIC SWITCH (DO NOT EDIT)
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
    SPLASH START (DO NOT EDIT)
  ========================================================= */
  if (startBriefBtn) {
    startBriefBtn.addEventListener("click", () => {
      if (pageSplash) pageSplash.classList.remove("is-active");
      if (pageLesson) pageLesson.classList.add("is-active");
      setTopic(currentTopicId);
    });
  }

  /* =========================================================
    LIGHTBOX CLOSE HANDLERS (DO NOT EDIT)
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
    INIT (DO NOT EDIT)
  ========================================================= */
  buildMenu();
  if (currentTopicId) setTopic(currentTopicId);
})();
