(function () {
  "use strict";

  const STORAGE_PREFIX = "lesson4_check_";

  const img = (file) => `assets/images/${file}`;

  const topics = [
    {
      id: "flight-instrument-failures",
      label: "Flight Instrument Failures",
      imagePath: img("Discuss2.png"),
      heading: "Flight Instrument Failures",
      bullets: [
        "Identification",
        "Procedures / checklists",
        "Operations with failed instruments",
        "Resources and options available"
      ],
      images: [
        { title: "ADC failure", src: img("ADC Failure.png"), alt: "Primary flight display with failure indication." },
        { title: "AHRS failure", src: img("AHRS failure.bmp"), alt: "Cockpit displays with attitude and heading reference issues." },
        { title: "Magnetometer failure", src: img("Magnetometer failure.png"), alt: "Flight instruments with compass and heading indicators." },
        { title: "PFD failure", src: img("PFD Failure.png"), alt: "Panel with one display dark and backup instruments active." }
      ]
    },
    {
      id: "standby-instruments",
      label: "Standby Instruments & Reversionary Mode",
      imagePath: img("Discuss2.png"),
      heading: "Standby Instruments & Reversionary Mode",
      bullets: [
        "Pressing Display Backup",
        "System redundancy",
        "Applicable procedures"
      ],
      images: [
        { title: "Reversionary Mode", src: img("PFD Failure.png"), alt: "Panel with one display dark and backup instruments active." }
      ]
    },
    {
      id: "baif-sequence-3",
      label: "BAIF Sequence 3",
      imagePath: img("Preview.png"),
      heading: "BAIF Sequence 3",
      bullets: ["Procedures", "Route", "Potential challenges"],
      images: [
        { title: "Baif Sequence 3", src: img("BAIF3.png"), alt: "BAIF Sequence 3 overview." }
      ]
    },
    {
      id: "pitot-static-system",
      label: "Pitot-Static System",
      imagePath: img("Discuss2.png"),
      heading: "Pitot-Static System",
      bullets: ["System function", "System components", "System limitations and failures"],
      images: [
        { title: "Pitot Static System", src: img("PitotStaticCHAK.png"), alt: "Pitot-static system diagram." },
        { title: "ADAHRS", src: img("PiotStaticADAHRS.png"), alt: "ADAHRS relationship to pitot-static system." }
      ]
    },
    {
      id: "pitot-static-instruments",
      label: "Pitot-static Instruments",
      imagePath: img("Discuss2.png"),
      heading: "Pitot-static Instruments",
      bullets: ["Indicators", "Errors", "Review Carefully"],
      images: [
        { title: "Altimeter & VSI", src: img("PFDPitotStatic Instruments.png"), alt: "Altimeter and VSI reference." },
        { title: "Pitot Static System", src: img("PitotCHAK.png"), alt: "Pitot-static system reference." }
      ]
    },
    {
      id: "crm",
      label: "Crew Resources Management",
      imagePath: img("Discuss2.png"),
      heading: "Crew Resources Management",
      bullets: [
        "Define roles and responsibilities in abnormal situations",
        "Brief communication expectations",
        "Use all available resources, including ATC and passengers",
        "Manage workload and avoid fixation"
      ],
      images: [
        { title: "Aircraft in IMC", src: img("IMC CockpitView.png"), alt: "Aircraft cockpit view in IMC." }
      ]
    },
    {
      id: "flight-mission",
      label: "Flight Mission",
      imagePath: img("Brief3.png"),
      heading: "Flight Mission",
      bullets: [
        "Preview Lesson Tasks",
        "Discuss New Elements",
        "Develop a plan of action",
        "Complete PAVE Checklists",
        "Pilot",
        "Aircraft",
        "enVironment",
        "External Factors"
      ],
      checklistLastN: 4,
      checklistHeader: "PAVE",
      images: []
    },
    {
      id: "task-matrix",
      label: "Task Matrix",
      imagePath: img("Preview.png"),
      heading: "Task Matrix",
      bullets: [],
      images: [],
      table: {
        columns: ["Flight Task", "Performance Score", "Score Definition"],
        rows: [
          ["PERFORM Flight Deck Check", "2", "Considerable Assistance"],
          ["PERFORM Standard Rate Turn", "3", "Minimal Assistance"],
          ["PERFORM Constant Rate & Airspeed Climbs & Descents", "3", "Minimal Assistance"],
          ["PERFORM Attitude Instrument Flight", "3", "Minimal Assistance"],
          ["RECOVER From Unusual Attitudes", "3", "Minimal Assistance"],
          ["TRACK Nav System", "3", "Minimal Assistance"],
          ["MANAGE Flight Instrument Failure", "1", "Instructor Guided"],
          ["MANAGE Flight By Reference to Standby Instruments", "1", "Instructor Guided"]
        ]
      }
    }
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
