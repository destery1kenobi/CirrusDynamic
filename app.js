(function () {
  "use strict";

  // Standardize per-lesson storage prefix so checklist state never collides across lessons
  const STORAGE_PREFIX = "lesson1_check_";

  const img = (file) => `assets/images/${file}`;

  // STANDARD ICON MAP (use this same block in every lesson app.js)
  // Your outline ALL CAPS keyword maps to these filenames.
  const ICON = {
    BRIEF: "Brief.png",
    DETERMINE: "Determine.png",
    DISCUSS: "Discuss.png",
    PREVIEW: "Preview.png",
    REVIEW: "Review.png",
    LIST: "List.png",
    DESCRIBE: "Describe.png",
  };

  // Helper: derive display title from filename (remove extension if present)
  function titleFromFilename(filename) {
    if (!filename) return "";
    return filename.replace(/\.[^/.]+$/, "");
  }

  // LESSON 1 TOPICS (content swap only)
  // NOTE: Filenames must match exactly (including spaces/case/extensions).
  // If your real files are .jpg/.bmp/etc, update the src strings accordingly.
  const topics = [
    {
      id: "private-pilot-certificate",
      label: "Private Pilot Certificate",
      imagePath: img(ICON.DISCUSS),
      heading: "Private Pilot Certificate",
      bullets: ["Privileges", "Limitations"],
      images: [
        {
          title: titleFromFilename("Private Pilot Limitations.png"),
          src: img("Private Pilot Limitations.png"),
          alt: titleFromFilename("Private Pilot Limitations.png"),
        },
      ],
    },

    {
      id: "required-documents",
      label: "Required Documents",
      imagePath: img(ICON.BRIEF),
      heading: "Required Documents",
      bullets: ["Documents required to exercise private pilot privileges"],
      images: [
        {
          title: titleFromFilename("Requirements for Certificates.png"),
          src: img("Requirements for Certificates.png"),
          alt: titleFromFilename("Requirements for Certificates.png"),
        },
        {
          title: titleFromFilename("FAA Pilot Certificate.png"),
          src: img("FAA Pilot Certificate.png"),
          alt: titleFromFilename("FAA Pilot Certificate.png"),
        },
        {
          title: titleFromFilename("ARROW.png"),
          src: img("ARROW.png"),
          alt: titleFromFilename("ARROW.png"),
        },
      ],
    },

    {
      id: "medical-certificates",
      label: "Medical Certificates",
      imagePath: img(ICON.DISCUSS),
      heading: "Medical Certificates",
      bullets: ["Process to obtain", "Different types", "Privileges", "Expiration"],
      images: [
        {
          title: titleFromFilename("Med Express.png"),
          src: img("Med Express.png"),
          alt: titleFromFilename("Med Express.png"),
        },
        {
          title: titleFromFilename("Basic Med_What.png"),
          src: img("Basic Med_What.png"),
          alt: titleFromFilename("Basic Med_What.png"),
        },
      ],
    },

    {
      id: "record-keeping-logbook",
      label: "Record keeping/logbook",
      imagePath: img(ICON.DISCUSS),
      heading: "Record keeping/logbook",
      bullets: ["What are the requirements for currency?"],
      images: [
        {
          title: titleFromFilename("Logbook Requirements.png"),
          src: img("Logbook Requirements.png"),
          alt: titleFromFilename("Logbook Requirements.png"),
        },
        {
          title: titleFromFilename("Pilot Logbook.png"),
          src: img("Pilot Logbook.png"),
          alt: titleFromFilename("Pilot Logbook.png"),
        },
      ],
    },

    {
      id: "certification-requirements",
      label: "Certification Requirements",
      imagePath: img(ICON.PREVIEW),
      heading: "Certification Requirements",
      bullets: ["What are the certificate requirements for a private pilot?"],
      images: [
        {
          title: titleFromFilename("Eligibility Requirements.png"),
          src: img("Eligibility Requirements.png"),
          alt: titleFromFilename("Eligibility Requirements.png"),
        },
        {
          title: titleFromFilename("Aeronautical Knowledge Requirements.png"),
          src: img("Aeronautical Knowledge Requirements.png"),
          alt: titleFromFilename("Aeronautical Knowledge Requirements.png"),
        },
        {
          title: titleFromFilename("Flight Proficiency.png"),
          src: img("Flight Proficiency.png"),
          alt: titleFromFilename("Flight Proficiency.png"),
        },
        {
          title: titleFromFilename("Private Pilot Certification Requirements.png"),
          src: img("Private Pilot Certification Requirements.png"),
          alt: titleFromFilename("Private Pilot Certification Requirements.png"),
        },
      ],
    },
  ];

  const pageSplash     = document.getElementById("pageSplash");
  const pageLesson     = document.getElementById("pageLesson");
  const startBriefBtn  = document.getElementById("startBriefBtn");

  const menuList       = document.getElementById("lessonMenuList");
  const contentHeading = document.getElementById("contentHeading");
  const contentBullets = document.getElementById("contentBullets");
  const thumbGrid      = document.getElementById("thumbGrid");

  const lightbox         = document.getElementById("lightbox");
  const lightboxClose    = document.getElementById("lightboxClose");
  const lightboxImage    = document.getElementById("lightboxImage");
  const lightboxTitle    = document.getElementById("lightboxTitle");
  const lightboxCaption  = document.getElementById("lightboxCaption");

  const lightboxImageWrap = lightbox.querySelector(".lightbox-image-wrap");

  let currentTopicId = topics[0].id;

  function clearMediaContainerClasses() {
    thumbGrid.className = "media-container";
  }

  function storageKey(topicId, idx) {
    return STORAGE_PREFIX + topicId + "_" + idx;
  }

  /* =========================
     BULLETS + OPTIONAL CHECKLIST
  ========================= */
  function renderBullets(topic) {
    contentBullets.innerHTML = "";
    contentBullets.classList.remove("has-checklist");

    const bullets = Array.isArray(topic.bullets) ? topic.bullets : [];
    const checklistLastN = Number.isFinite(topic.checklistLastN) ? Math.max(0, topic.checklistLastN) : 0;

    if (!bullets.length) return;

    const checklistCount = Math.min(checklistLastN, bullets.length);
    const checklistStart = bullets.length - checklistCount;

    const frag = document.createDocumentFragment();

    bullets.forEach((text, i) => {
      if (i < checklistStart) {
        const li = document.createElement("li");
        li.textContent = text;
        frag.appendChild(li);
        return;
      }

      contentBullets.classList.add("has-checklist");

      if (i === checklistStart) {
        const headerLi = document.createElement("li");
        headerLi.className = "checklist-header";
        headerLi.textContent = (topic.checklistHeader || "CHECKLIST").toUpperCase();
        frag.appendChild(headerLi);
      }

      const li = document.createElement("li");
      li.className = "check-row";

      const checkboxId = `chk_${topic.id}_${i}`;
      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = checkboxId;

      const saved = localStorage.getItem(storageKey(topic.id, i));
      if (saved === "1") {
        input.checked = true;
        li.classList.add("is-done");
      }

      const label = document.createElement("label");
      label.setAttribute("for", checkboxId);
      label.textContent = text;

      input.addEventListener("change", () => {
        li.classList.toggle("is-done", input.checked);
        localStorage.setItem(storageKey(topic.id, i), input.checked ? "1" : "0");
      });

      li.appendChild(input);
      li.appendChild(label);
      frag.appendChild(li);
    });

    contentBullets.appendChild(frag);
  }

  /* =========================
     TASK MATRIX TABLE
  ========================= */
  function buildTaskTable(table) {
    const wrap = document.createElement("div");
    wrap.className = "task-table-wrap";

    const scroll = document.createElement("div");
    scroll.className = "task-table-scroll";

    const t = document.createElement("table");
    t.className = "task-table";

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    (table.columns || []).forEach(col => {
      const th = document.createElement("th");
      th.textContent = col;
      trh.appendChild(th);
    });
    thead.appendChild(trh);

    const tbody = document.createElement("tbody");
    (table.rows || []).forEach(row => {
      const tr = document.createElement("tr");
      row.forEach((cell) => {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    t.appendChild(thead);
    t.appendChild(tbody);
    scroll.appendChild(t);
    wrap.appendChild(scroll);
    return wrap;
  }

  /* =========================
     MEDIA: Carousel / Single / Empty / Table
  ========================= */
  function buildBootstrapCarousel(images) {
    const carouselId = "topicCarousel";
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
      imageEl.onerror = function () {
        this.src = `https://placehold.co/1200x675/0F2438/ffffff?text=${encodeURIComponent(imgData.title || "Image")}`;
      };
      imageEl.src = imgData.src;
      imageEl.alt = imgData.alt || imgData.title || "Lesson image";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "Open fullscreen view for " + (imgData.title || "image"));
      btn.innerHTML = '<span>⤢</span>';
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(imgData);
      });

      wrap.appendChild(imageEl);
      wrap.appendChild(btn);
      wrap.addEventListener("click", () => openLightbox(imgData));

      const caption = document.createElement("div");
      caption.className = "carousel-caption d-none d-md-block";
      caption.innerHTML = `<div style="font-weight:600">${imgData.title || ""}</div>`;

      item.appendChild(wrap);
      item.appendChild(caption);
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
    imageEl.onerror = function () {
      this.src = `https://placehold.co/1200x675/0F2438/ffffff?text=${encodeURIComponent(imgData.title || "Image")}`;
    };
    imageEl.src = imgData.src;
    imageEl.alt = imgData.alt || imgData.title || "Lesson image";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", "Open fullscreen view for " + (imgData.title || "image"));
    btn.innerHTML = '<span>⤢</span>';
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(imgData);
    });

    wrap.appendChild(imageEl);
    wrap.appendChild(btn);
    wrap.addEventListener("click", () => openLightbox(imgData));

    hero.appendChild(wrap);

    const caption = document.createElement("div");
    caption.className = "single-caption";
    caption.textContent = imgData.title || "";
    hero.appendChild(caption);

    return hero;
  }

  function buildPanel(topic) {
    thumbGrid.innerHTML = "";
    clearMediaContainerClasses();

    if (topic.table) {
      thumbGrid.classList.add("is-single");
      thumbGrid.appendChild(buildTaskTable(topic.table));
      return;
    }

    const safeImages = Array.isArray(topic.images) ? topic.images.filter(Boolean) : [];
    const count = safeImages.length;

    if (count > 1) {
      thumbGrid.classList.add("is-carousel");
      const carousel = buildBootstrapCarousel(safeImages);
      thumbGrid.appendChild(carousel);

      try {
        new bootstrap.Carousel(carousel, {
          interval: false,
          ride: false,
          pause: false,
          wrap: true,
          touch: true
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

  /* =========================
     TOPIC SWITCH
  ========================= */
  function setTopic(topicId) {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    currentTopicId = topicId;

    menuList.querySelectorAll(".lesson-menu-item").forEach(item => {
      item.classList.toggle("is-active", item.getAttribute("data-topic-id") === topicId);
    });

    contentHeading.textContent = topic.heading || "";

    renderBullets(topic);
    buildPanel(topic);
  }

  /* =========================
     LIGHTBOX
  ========================= */
  function openLightbox(imgData) {
    lightboxImage.classList.remove("is-visible");
    lightboxImage.src = "";
    lightboxImage.alt = "";

    lightboxTitle.textContent = imgData.title || "Image";
    lightboxCaption.textContent = imgData.alt || imgData.title || "";

    lightbox.classList.add("is-visible");
    lightbox.setAttribute("aria-hidden", "false");

    const loader = new Image();
    loader.onload = () => {
      lightboxImage.src = imgData.src;
      lightboxImage.alt = imgData.alt || imgData.title || "";
      requestAnimationFrame(() => lightboxImage.classList.add("is-visible"));
    };
    loader.src = imgData.src;
  }

  function closeLightbox() {
    lightbox.classList.remove("is-visible");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.classList.remove("is-visible");
  }

  /* =========================
     MENU
  ========================= */
  function buildMenu() {
    const frag = document.createDocumentFragment();
    topics.forEach((topic, index) => {
      const li = document.createElement("li");
      li.className = "lesson-menu-item" + (index === 0 ? " is-active" : "");
      li.setAttribute("data-topic-id", topic.id);

      const iconContainer = document.createElement("span");
      iconContainer.className = "lesson-menu-icon";

      const icon = document.createElement("img");
      icon.src = topic.imagePath;
      icon.alt = "";
      iconContainer.appendChild(icon);

      const label = document.createElement("span");
      label.textContent = topic.label;

      li.appendChild(iconContainer);
      li.appendChild(label);
      li.addEventListener("click", () => setTopic(topic.id));

      frag.appendChild(li);
    });

    menuList.innerHTML = "";
    menuList.appendChild(frag);
  }

  /* =========================
     EVENTS
  ========================= */
  startBriefBtn.addEventListener("click", () => {
    pageSplash.classList.remove("is-active");
    pageLesson.classList.add("is-active");
    setTopic(currentTopicId);
  });

  // Close lightbox: X, image, or anywhere in the image area
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxImage.addEventListener("click", closeLightbox);
  lightboxImageWrap.addEventListener("click", closeLightbox);

  // Keep overlay click-to-close
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-visible")) return;
    if (e.key === "Escape") closeLightbox();
  });

  /* INIT */
  buildMenu();
  setTopic(currentTopicId);
})();
