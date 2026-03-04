(function () {
"use strict";

/* =========================================================
HELPERS
========================================================= */

const img = (file) => `assets/images/${file}`;

function titleFromFilename(filename) {
  if (!filename) return "";
  return filename.replace(/\.[^/.]+$/, "");
}

/* =========================================================
LESSON DATA
========================================================= */

const LESSON = {
  number: lessonData.lessonNumber,
  subtitle: lessonData.subtitle
};

const topics = lessonData.topics.map(t => ({
  ...t,
  images: t.images.map(file => ({
    src: img(file),
    title: titleFromFilename(file),
    alt: titleFromFilename(file)
  }))
}));

let currentTopicId = topics[0]?.id || "";

/* =========================================================
VERB SPLIT
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
DOM
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
  lightboxTitle: document.getElementById("lightboxTitle")
};

const lightboxImageWrap = els.lightbox
  ? els.lightbox.querySelector(".lightbox-image-wrap")
  : null;

/* =========================================================
LESSON TITLE
========================================================= */

const elLessonNumber = document.getElementById("lessonNumber");
const elLessonSubtitle = document.getElementById("lessonSubtitle");

if (elLessonNumber) elLessonNumber.textContent = `Lesson ${LESSON.number}`;
if (elLessonSubtitle) elLessonSubtitle.textContent = LESSON.subtitle;

/* =========================================================
LIGHTBOX
========================================================= */

function openLightbox(imgData) {
  if (!els.lightbox) return;

  els.lightboxTitle.textContent = imgData.title || "Image";
  els.lightboxImage.src = imgData.src;
  els.lightboxImage.alt = imgData.alt || "";

  els.lightbox.classList.add("is-visible");
}

function closeLightbox() {
  if (!els.lightbox) return;
  els.lightbox.classList.remove("is-visible");
}

/* =========================================================
CHEVRON SVG
========================================================= */

function chevronSvg(direction) {
  return direction === "left"
    ? `<svg viewBox="0 0 24 24"><path d="M14.5 4.5L7.5 12l7 7.5" stroke="currentColor" stroke-width="2.5" fill="none"/></svg>`
    : `<svg viewBox="0 0 24 24"><path d="M9.5 4.5L16.5 12l-7 7.5" stroke="currentColor" stroke-width="2.5" fill="none"/></svg>`;
}

/* =========================================================
CAROUSEL BUILDER
========================================================= */

function buildBootstrapCarousel(images) {

  const carouselId = "topicCarousel";

  const make = (tag, cls) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    return el;
  };

  const carousel = make("div", "carousel slide");
  carousel.id = carouselId;
  carousel.setAttribute("data-bs-touch", "true");

  const inner = make("div", "carousel-inner");

images.forEach((imgData, index) => {

  const item = make("div", "carousel-item" + (index === 0 ? " active" : ""));

  const wrap = make("div", "thumb-image-wrap");

  const imgEl = make("img", "d-block w-100");
  imgEl.src = imgData.src;
  imgEl.alt = imgData.alt || imgData.title || "Lesson image";

  /* click image to open lightbox */
  imgEl.onclick = (e) => {
    e.stopPropagation();
    openLightbox(imgData);
  };

  const fsBtn = make("button");
  fsBtn.type = "button";
  fsBtn.innerHTML = "<span>⤢</span>";
  fsBtn.onclick = (e) => {
    e.stopPropagation();
    openLightbox(imgData);
  };

  wrap.append(imgEl, fsBtn);
  item.appendChild(wrap);
  inner.appendChild(item);

});

  carousel.appendChild(inner);

  const controls = make("div", "carousel-controls");

  const prev = make("button", "carousel-nav-btn");
  prev.type = "button";
  prev.setAttribute("data-bs-target", "#" + carouselId);
  prev.setAttribute("data-bs-slide", "prev");
  prev.innerHTML = chevronSvg("left");

  const next = make("button", "carousel-nav-btn");
  next.type = "button";
  next.setAttribute("data-bs-target", "#" + carouselId);
  next.setAttribute("data-bs-slide", "next");
  next.innerHTML = chevronSvg("right");

  const indicators = make("div", "carousel-indicators");

  images.forEach((_, i) => {
    const dot = make("button");
    dot.type = "button";
    dot.setAttribute("data-bs-target", "#" + carouselId);
    dot.setAttribute("data-bs-slide-to", i);
    if (i === 0) dot.classList.add("active");
    indicators.appendChild(dot);
  });

  controls.append(prev, indicators, next);

  const wrapper = make("div");
  wrapper.append(carousel, controls);

  return { carousel, wrapper };
}

/* =========================================================
MEDIA PANEL
========================================================= */

function buildPanel(topic) {

  if (!els.thumbGrid) return;

  els.thumbGrid.innerHTML = "";

  const safeImages = Array.isArray(topic.images) ? topic.images : [];
  const count = safeImages.length;

  if (count > 1) {

    els.thumbGrid.classList.add("is-carousel");

    const { carousel, wrapper } = buildBootstrapCarousel(safeImages);
    els.thumbGrid.appendChild(wrapper);

    try {

      new bootstrap.Carousel(carousel, {
        interval: false,
        ride: false,
        wrap: true,
        touch: true
      });

      carousel.addEventListener("slid.bs.carousel", function () {

        const activeItem = carousel.querySelector(".carousel-item.active");
        const items = carousel.querySelectorAll(".carousel-item");

        const activeIndex = [...items].indexOf(activeItem);

        const dots = wrapper.querySelectorAll(".carousel-indicators button");
        if (!dots.length) return;

        dots.forEach((dot, i) => {
          dot.classList.toggle("active", i === activeIndex);
        });

      });

    } catch (e) {}

    return;
  }

  if (count === 1) {

    els.thumbGrid.classList.add("is-single");

    const imgData = safeImages[0];

    const wrap = document.createElement("div");
    wrap.className = "thumb-image-wrap";

    const imageEl = document.createElement("img");
    imageEl.src = imgData.src;

    wrap.onclick = () => openLightbox(imgData);

    wrap.appendChild(imageEl);
    els.thumbGrid.appendChild(wrap);

    return;
  }

  els.thumbGrid.classList.add("is-empty");
}

/* =========================================================
BULLETS
========================================================= */

function renderBullets(topic) {

  els.contentBullets.innerHTML = "";

  (topic.bullets || []).forEach((text) => {

    const li = document.createElement("li");
    li.textContent = text;

    els.contentBullets.appendChild(li);

  });
}

/* =========================================================
MENU
========================================================= */

function buildMenu() {

  if (!els.menuList) return;

  const frag = document.createDocumentFragment();

  topics.forEach((topic, idx) => {

    const li = document.createElement("li");
    li.className = "lesson-menu-item" + (idx === 0 ? " is-active" : "");
    li.setAttribute("data-topic-id", topic.id);

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

  els.menuList
    .querySelectorAll(".lesson-menu-item")
    .forEach((item) => {
      item.classList.toggle(
        "is-active",
        item.getAttribute("data-topic-id") === topicId
      );
    });

  renderHeadingText(els.contentHeading, topic.heading);
  renderBullets(topic);
  buildPanel(topic);
}

/* =========================================================
INIT
========================================================= */

buildMenu();
if (currentTopicId) setTopic(currentTopicId);

/* =========================================================
SPLASH BUTTON
========================================================= */

if (els.startBriefBtn) {

  els.startBriefBtn.addEventListener("click", () => {

    els.pageSplash.classList.remove("is-active");
    els.pageLesson.classList.add("is-active");

  });

}

/* =========================================================
LIGHTBOX CLOSE
========================================================= */

if (els.lightboxClose) els.lightboxClose.onclick = closeLightbox;
if (els.lightboxImage) els.lightboxImage.onclick = closeLightbox;

if (lightboxImageWrap)
  lightboxImageWrap.onclick = closeLightbox;

if (els.lightbox) {

  els.lightbox.addEventListener("click", (e) => {
    if (e.target === els.lightbox) closeLightbox();
  });

}

document.addEventListener("keydown", (e) => {

  if (!els.lightbox?.classList.contains("is-visible")) return;

  if (e.key === "Escape") closeLightbox();

});

})();