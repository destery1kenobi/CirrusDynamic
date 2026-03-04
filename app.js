(function () {
  "use strict";

  /* =========================================================
     LESSON METADATA (Option 1)
     - Keeps lesson number + subtitle centralized
     - Prevents storage collisions across lessons
  ========================================================= */
  const LESSON = {
    number: 1,
    subtitle: "",
  };

  const STORAGE_PREFIX = `lesson${LESSON.number}_check_`;

  // Path helper (all images live here)
  const img = (file) => `assets/images/${file}`;

  // Icon mapping (unused in the new workflow, but retained for compatibility)
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
     VERB STYLING (inline, no icons)
     - Leading ALL CAPS token becomes the "verb"
     - Verb is bold + Cirrus blue
     - Rest of title remains default styling
  ========================================================= */
  function splitLeadingVerb(title) {
    const raw = (title || "").trim();
    if (!raw) return { verb: "", rest: "" };

    const firstSpace = raw.indexOf(" ");
    const token = firstSpace === -1 ? raw : raw.slice(0, firstSpace);
    const rest = firstSpace === -1 ? "" : raw.slice(firstSpace + 1);

    const isAllCaps = /^[A-Z0-9]+$/.test(token);
    if (!isAllCaps) return { verb: "", rest: raw };

    return { verb: token, rest };
  }

  function renderHeadingText(node, text) {
    if (!node) return;
    node.innerHTML = "";

    const { verb, rest } = splitLeadingVerb(text);
    if (!verb) {
      node.textContent = text || "";
      return;
    }

    const verbSpan = document.createElement("span");
    verbSpan.className = "title-verb";
    verbSpan.textContent = verb;

    const restSpan = document.createElement("span");
    restSpan.textContent = rest ? " " + rest : "";

    node.appendChild(verbSpan);
    node.appendChild(restSpan);
  }

  /* =========================================================
     MENU LABEL RENDER
     - Same verb styling rule as headings (blue + bold)
     - Does NOT change font sizes; only uses inline spans
  ========================================================= */
  function renderMenuLabel(node, text) {
    if (!node) return;
    node.innerHTML = "";

    const { verb, rest } = splitLeadingVerb(text);
    if (!verb) {
      node.textContent = text || "";
      return;
    }

    const verbSpan = document.createElement("span");
    verbSpan.className = "menu-verb";
    verbSpan.textContent = verb;

    const restSpan = document.createElement("span");
    restSpan.className = "menu-rest";
    restSpan.textContent = rest ? " " + rest : "";

    node.appendChild(verbSpan);
    node.appendChild(restSpan);
  }

  /* =========================================================
     INJECT LESSON META INTO HTML
  ========================================================= */
  const elLessonNumber = document.getElementById("lessonNumber");
  const elLessonSubtitle = document.getElementById("lessonSubtitle");

  if (elLessonNumber) elLessonNumber.textContent = `Lesson ${LESSON.number}`;
  if (elLessonSubtitle) elLessonSubtitle.textContent = LESSON.subtitle;

  /* =========================================================
     TOPICS – LESSON 1
     - Headings now include the verb inline (DISCUSS/LIST/etc.)
     - No captions; image titles derived from filename for lightbox title bar
  ========================================================= */
  const topics = [
    {
      id: "private-pilot-certificate",
      label: "DISCUSS Private Pilot Certificate",
      heading: "DISCUSS Private Pilot Certificate",
      bullets: ["Privileges", "Limitations"],
      images: ["61.113 - slide"],
    },
    {
      id: "required-documents",
      label: "LIST Required Documents",
      heading: "LIST Required Documents",
      bullets: ["What documents are required to exercise private pilot privileges?"],
      images: ["FAR 61.3- slide", "Figure1-6_ FAA Pilot Certificate", "ARROW"],
    },
    {
      id: "medical-certificates",
      label: "DISCUSS Medical Certificates",
      heading: "DISCUSS Medical Certificates",
      bullets: ["Process to obtain", "Different types", "Privileges", "Expiration"],
      images: ["MedExpress", "Basic Med - What"],
    },
    {
      id: "record-keeping-logbook",
      label: "DESCRIBE Record keeping/logbook",
      heading: "DESCRIBE Record keeping/logbook",
      bullets: ["What are the requirements for currency?"],
      images: ["CFR 61.51", "Pilot Logbook"],
    },
    {
      id: "certification-requirements",
      label: "LIST Certification Requirements",
      heading: "LIST Certification Requirements",
      bullets: ["What are the certificate requirements for a private pilot?"],
      images: [
        "PPP ACS",
        "CFR 61.103 – slide",
        "CFR 61.105- slide",
        "CFR 61.107- slide",
        "CFR 61. 109- slide",
      ],
    },
  ].map((t) => ({
    ...t,
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
  const els = {
    pageSplash: document.getElementById("pageSplash"),
    pageLesson: document.getElementById("pageLesson"),
    startBriefBtn: document.getElementById("startBriefBtn"),

    menuList: document.getElementById("lessonMenuList"),
    contentHeading: document.getElementById("contentHeading"),
    contentBullets: document.getElementById("contentBullets"),
    thumbGrid: document.getElementById("thumbGrid"),

    lightbox: document.getElementById("lightbox"),
    lightboxClose: document.getElementById("lightboxClose"),
    lightboxImage: document.getElementById("lightboxImage"),
    lightboxTitle: document.getElementById("lightboxTitle"),
  };

  const lightboxImageWrap = els.lightbox ? els.lightbox.querySelector(".lightbox-image-wrap") : null;

  let currentTopicId = topics[0]?.id || "";

  /* =========================================================
     HELPERS
  ========================================================= */
  function storageKey(topicId, idx) {
    return STORAGE_PREFIX + topicId + "_" + idx;
  }

  function setNoBulletsFlag(hasBullets) {
    const panel = els.contentHeading?.closest(".lesson-content");
    if (!panel) return;
    panel.classList.toggle("no-bullets", !hasBullets);
  }

  /* =========================================================
     BULLETS (default + optional checklist)
     - No punctuation changes (verbatim)
  ========================================================= */
  function renderBullets(topic) {
    if (!els.contentBullets) return;

    els.contentBullets.innerHTML = "";
    els.contentBullets.classList.remove("has-checklist");

    const bullets = Array.isArray(topic.bullets) ? topic.bullets : [];
    setNoBulletsFlag(bullets.length > 0);

    if (!bullets.length) return;

    const checklistLastN = Number.isFinite(topic.checklistLastN) ? Math.max(0, topic.checklistLastN) : 0;
    const checklistCount = Math.min(checklistLastN, bullets.length);
    const checklistStart = bullets.length - checklistCount;

    bullets.forEach((text, i) => {
      // Normal bullet
      if (!checklistCount || i < checklistStart) {
        const li = document.createElement("li");
        li.textContent = text;
        els.contentBullets.appendChild(li);
        return;
      }

      // Checklist bullet
      els.contentBullets.classList.add("has-checklist");

      if (i === checklistStart) {
        const headerLi = document.createElement("li");
        headerLi.className = "checklist-header";
        headerLi.textContent = (topic.checklistHeader || "CHECKLIST").toUpperCase();
        els.contentBullets.appendChild(headerLi);
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
      els.contentBullets.appendChild(li);
    });
  }
  /* =========================================================
     LIGHTBOX (title bar only; preview has no captions)
     - Open by clicking image or fullscreen button
     - Close by: X, clicking image, clicking image area, clicking backdrop, Esc
  ========================================================= */
  function openLightbox(imgData) {
    if (!els.lightbox || !els.lightboxImage || !els.lightboxTitle) return;

    els.lightboxTitle.textContent = imgData.title || "Image";
    els.lightboxImage.classList.remove("is-visible");
    els.lightboxImage.src = "";
    els.lightboxImage.alt = imgData.alt || imgData.title || "";

    els.lightbox.classList.add("is-visible");

    const pre = new Image();
    pre.onload = () => {
      els.lightboxImage.src = imgData.src;
      requestAnimationFrame(() => els.lightboxImage.classList.add("is-visible"));
    };
    pre.onerror = () => {
      // Missing images will still attempt to load; console shows 404 (acceptable for placeholders)
      els.lightboxImage.src = imgData.src;
      requestAnimationFrame(() => els.lightboxImage.classList.add("is-visible"));
    };
    pre.src = imgData.src;
  }

  function closeLightbox() {
    if (!els.lightbox || !els.lightboxImage) return;
    els.lightbox.classList.remove("is-visible");
    els.lightboxImage.classList.remove("is-visible");
  }

  /* =========================================================
     MEDIA AREA
     - Carousel when >1 images
     - Single hero when 1 image
     - Empty state hides media container
  ========================================================= */
  function clearMedia() {
    if (!els.thumbGrid) return;
    els.thumbGrid.innerHTML = "";
    els.thumbGrid.className = "media-container";
  }

  function chevronSvg(direction) {
    // direction: "left" | "right"
    const d =
      direction === "left"
        ? "M14.5 4.5L7.5 12l7 7.5"
        : "M9.5 4.5L16.5 12l-7 7.5";
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function buildBootstrapCarousel(images) {
    const carouselId = "topicCarousel";

    // Carousel shell (touch/swipe enabled; no auto-advance)
    const carousel = document.createElement("div");
    carousel.id = carouselId;
    carousel.className = "carousel slide";
    carousel.setAttribute("data-bs-touch", "true");

    const inner = document.createElement("div");
    inner.className = "carousel-inner";

    images.forEach((imgData, index) => {
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

    carousel.appendChild(inner);

    // Controls BELOW the image (arrows + dots)
    const controls = document.createElement("div");
    controls.className = "carousel-controls";

    const prev = document.createElement("button");
    prev.className = "carousel-nav-btn";
    prev.type = "button";
    prev.setAttribute("data-bs-target", "#" + carouselId);
    prev.setAttribute("data-bs-slide", "prev");
    prev.setAttribute("aria-label", "Previous slide");
    prev.innerHTML = chevronSvg("left");

    const next = document.createElement("button");
    next.className = "carousel-nav-btn";
    next.type = "button";
    next.setAttribute("data-bs-target", "#" + carouselId);
    next.setAttribute("data-bs-slide", "next");
    next.setAttribute("aria-label", "Next slide");
    next.innerHTML = chevronSvg("right");

    const indicators = document.createElement("div");
    indicators.className = "carousel-indicators";

    images.forEach((_, index) => {
      const ind = document.createElement("button");
      ind.type = "button";
      ind.setAttribute("data-bs-target", "#" + carouselId);
      ind.setAttribute("data-bs-slide-to", String(index));
      ind.setAttribute("aria-label", "Slide " + (index + 1));
      if (index === 0) ind.classList.add("active");
      indicators.appendChild(ind);
    });

    controls.appendChild(prev);
    controls.appendChild(indicators);
    controls.appendChild(next);

    const wrapper = document.createElement("div");
    wrapper.appendChild(carousel);
    wrapper.appendChild(controls);

    return { carousel, wrapper };
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

  function buildPanel(topic) {
    clearMedia();
    if (!els.thumbGrid) return;

    // Table feature preserved (not used in Lesson 1)
    if (topic.table) {
      // Existing behavior: render table in media area
      els.thumbGrid.classList.add("is-table");
      els.thumbGrid.appendChild(buildTable(topic.table));
      return;
    }

    const safeImages = Array.isArray(topic.images) ? topic.images : [];
    const count = safeImages.length;

    if (count > 1) {
      els.thumbGrid.classList.add("is-carousel");

      const { carousel, wrapper } = buildBootstrapCarousel(safeImages);
      els.thumbGrid.appendChild(wrapper);

      try {
        // Bootstraps the carousel without auto-advancing
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
      els.thumbGrid.classList.add("is-single");
      els.thumbGrid.appendChild(buildSingleHero(safeImages[0]));
      return;
    }

    els.thumbGrid.classList.add("is-empty");
  }
  /* =========================================================
     OPTIONAL TABLE (baseline completeness)
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
        if (idx === 1) td.classList.add("definition");
        if (idx === 2) td.classList.add("score");
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    tbl.appendChild(thead);
    tbl.appendChild(tbody);
    wrap.appendChild(tbl);
    return wrap;
  }

  /* =========================================================
     MENU (no icons)
  ========================================================= */
  function buildMenu() {
    if (!els.menuList) return;

    const frag = document.createDocumentFragment();

    topics.forEach((topic, idx) => {
      const li = document.createElement("li");
      li.className = "lesson-menu-item" + (idx === 0 ? " is-active" : "");
      li.setAttribute("data-topic-id", topic.id);

      // Inline verb styling in menu label (no icon usage)
      renderMenuLabel(li, topic.label);

      li.addEventListener("click", () => setTopic(topic.id));
      frag.appendChild(li);
    });

    els.menuList.innerHTML = "";
    els.menuList.appendChild(frag);
  }

  /* =========================================================
     TOPIC SWITCH
  ========================================================= */
  function setTopic(topicId) {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return;

    currentTopicId = topicId;

    if (els.menuList) {
      els.menuList.querySelectorAll(".lesson-menu-item").forEach((item) => {
        item.classList.toggle("is-active", item.getAttribute("data-topic-id") === topicId);
      });
    }

    renderHeadingText(els.contentHeading, topic.heading || "");
    renderBullets(topic);
    buildPanel(topic);
  }

  /* =========================================================
     SPLASH START
  ========================================================= */
  if (els.startBriefBtn) {
    els.startBriefBtn.addEventListener("click", () => {
      if (els.pageSplash) els.pageSplash.classList.remove("is-active");
      if (els.pageLesson) els.pageLesson.classList.add("is-active");
      setTopic(currentTopicId);
    });
  }

  /* =========================================================
     LIGHTBOX CLOSE HANDLERS
  ========================================================= */
  if (els.lightboxClose) els.lightboxClose.addEventListener("click", closeLightbox);
  if (els.lightboxImage) els.lightboxImage.addEventListener("click", closeLightbox);
  if (lightboxImageWrap) lightboxImageWrap.addEventListener("click", closeLightbox);
  if (els.lightbox) {
    els.lightbox.addEventListener("click", (e) => {
      if (e.target === els.lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (!els.lightbox || !els.lightbox.classList.contains("is-visible")) return;
    if (e.key === "Escape") closeLightbox();
  });

  /* =========================================================
     INIT
  ========================================================= */
  buildMenu();
  if (currentTopicId) setTopic(currentTopicId);
})();