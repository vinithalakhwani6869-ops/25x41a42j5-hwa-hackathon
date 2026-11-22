/* Time plus smell - Interactive behavior */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initSteps();
  initDrumSim();
  initActivityTabs();
  initContactForm();
  initScrollReveal();
});

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const toggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  document.querySelectorAll(".nav a").forEach((a) => {
    a.addEventListener("click", () => nav.classList.remove("open"));
  });
}

/* ---------- How it works steps ---------- */
function initSteps() {
  const cards = document.querySelectorAll(".step-card");
  const detailTitle = document.getElementById("step-detail-title");
  const detailText = document.getElementById("step-detail-text");
  const detailVisual = document.getElementById("step-detail-visual");

  if (!cards.length) return;

  const data = {
    1: {
      title: "Step 1 — Prepare the chambers",
      text: "The owner loads each chamber with dog-safe scent materials and an appropriate reward. Every chamber holds a different scent-based puzzle, ready for the day ahead.",
      visual: "Loading chambers",
    },
    2: {
      title: "Step 2 — Wind the clockwork",
      text: "The owner turns the mechanical knob to arm the proposed timing system. No batteries, no electronics — just a hand-wound spring mechanism that sets the schedule in motion.",
      visual: "Winding the knob",
    },
    3: {
      title: "Step 3 — Dog explores",
      text: "The dog accesses the currently presented chamber through the single protected opening and works the scent-based activity to find the reward.",
      visual: "Dog investigates",
    },
    4: {
      title: "Step 4 — Drum advances",
      text: "At the next scheduled interval, the drum rotates and a new chamber takes its place behind the shutter. The cycle of scent-based variety begins again.",
      visual: "Drum rotates",
    },
  };

  function select(index) {
    cards.forEach((c) => c.classList.remove("selected"));
    const card = cards[index - 1];
    if (!card) return;
    card.classList.add("selected");

    const d = data[index];
    if (detailTitle) detailTitle.textContent = d.title;
    if (detailText) detailText.textContent = d.text;
    if (detailVisual) detailVisual.textContent = d.visual;

    const stage = document.querySelector(".drum-stage");
    if (stage) stage.setAttribute("data-state", index);
  }

  cards.forEach((card, i) => {
    card.addEventListener("click", () => select(i + 1));
  });

  select(1);
}

/* ---------- Drum simulation ---------- */
function initDrumSim() {
  const btn = document.getElementById("advance-drum");
  if (!btn) return;

  const chambers = document.querySelectorAll(".sim-chamber");
  let current = 0;

  function advance() {
    chambers[current].classList.remove("active");
    current = (current + 1) % chambers.length;
    chambers[current].classList.add("active");

    const drum = document.querySelector(".sim-drum");
    if (drum) {
      const rot = (current * 90) % 360;
      drum.style.transform = `rotate(${rot}deg)`;
    }
  }

  btn.addEventListener("click", () => {
    btn.textContent = "Advancing…";
    btn.disabled = true;
    setTimeout(() => {
      advance();
      btn.textContent = "Advance to next chamber";
      btn.disabled = false;
    }, 650);
  });
}

/* ---------- Activity tabs / explorer ---------- */
function initActivityTabs() {
  const triggers = document.querySelectorAll("[data-activity]");
  const panels = document.querySelectorAll("[data-panel]");
  if (!triggers.length) return;

  const data = {
    sniff: {
      title: "Sniff & Find",
      module: "Scent nose module",
      purpose: "Engages the dog's strongest sense — scent discrimination.",
      dog: "The dog sniffs scent-bearing compartments to locate the hidden reward.",
    },
    slide: {
      title: "Slide & Discover",
      module: "Paw-slide module",
      purpose: "Encourages paw coordination and gentle problem solving.",
      dog: "The dog nudges a paw-friendly sliding panel to reveal the reward.",
    },
    lift: {
      title: "Lift & Explore",
      module: "Flap-lift module",
      purpose: "Builds confidence through safe, oversized discovery actions.",
      dog: "The dog lifts a safe, oversized flap to uncover the reward inside.",
    },
    search: {
      title: "Search & Solve",
      module: "Puzzle-space module",
      purpose: "Challenges the dog to identify the correct reward location.",
      dog: "The dog investigates scent-bearing puzzle spaces and picks the right one.",
    },
  };

  function show(key) {
    triggers.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    panels.forEach((p) => p.classList.remove("active"));

    const t = document.querySelector(`[data-activity="${key}"]`);
    const p = document.getElementById(`panel-${key}`);
    if (t) { t.classList.add("active"); t.setAttribute("aria-selected", "true"); }
    if (p) p.classList.add("active");

    const d = data[key];
    const titleEl = document.getElementById("activity-title");
    const moduleEl = document.getElementById("activity-module");
    const purposeEl = document.getElementById("activity-purpose");
    const dogEl = document.getElementById("activity-dog");
    if (titleEl) titleEl.textContent = d.title;
    if (moduleEl) moduleEl.textContent = d.module;
    if (purposeEl) purposeEl.textContent = d.purpose;
    if (dogEl) dogEl.textContent = d.dog;
  }

  triggers.forEach((t) => {
    t.addEventListener("click", () => show(t.dataset.activity));
  });

  const hasDetail = document.getElementById("activity-title");
  if (hasDetail) show("sniff");
}

/* ---------- Contact form ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const msg = document.getElementById("form-message");

    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    const message = form.elements["message"].value.trim();

    if (!name || !email || !message) {
      showMsg(msg, "Please fill in all fields.", "err");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMsg(msg, "Please enter a valid email address.", "err");
      return;
    }

    // Simulate submission
    const orig = btn.textContent;
    btn.textContent = "Sending…";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = orig;
      btn.disabled = false;
      form.reset();
      showMsg(msg, "Thanks — your interest has been recorded.", "ok");
    }, 1200);
  });
}

function showMsg(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = "form-msg " + type;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 7000);
}

/* ---------- Simple scroll reveal ---------- */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) {
          ent.target.classList.add("revealed");
          observer.unobserve(ent.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".step-card, .tech-card, .activity-card").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 600ms ease, transform 600ms ease";
    observer.observe(el);
  });
  document.addEventListener("reveal:apply", () => {
    document.querySelectorAll(".revealed").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  });
}
