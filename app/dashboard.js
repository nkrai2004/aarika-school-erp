import { getAarikaFirebase } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const els = {
  role: $("#role"),
  name: $("#userName"),
  avatar: $("#avatar"),
  email: $("#userEmail"),
  school: $("#schoolName"),
  signOut: $("#signOut"),
  content: $("#contentArea"),
  pageTitle: $("#pageTitle"),
  pageSubtitle: $("#pageSubtitle"),
  menu: $("#mobileMenu"),
  sidebar: $("#sidebar"),
  toast: $("#toast")
};

const sections = {
  dashboard: {
    title: "Director Dashboard",
    subtitle: "School-wide overview and daily operations",
    render: renderDashboard
  },
  school: {
    title: "School Setup",
    subtitle: "Manage the Bal Jyoti school structure",
    render: renderModule("School Setup", ["School profile", "Academic sessions", "Classes & sections", "Houses", "Subjects"])
  },
  admissions: {
    title: "Admissions",
    subtitle: "Admissions pipeline and student onboarding",
    render: renderModule("Admissions", ["Enquiries", "Applications", "Documents", "Selection", "Admission status"])
  },
  academic: {
    title: "Academic",
    subtitle: "Academic planning, assessment and performance",
    render: renderModule("Academic", ["Classes", "Subjects", "Timetable", "Assessments", "Results"])
  },
  attendance: {
    title: "Attendance",
    subtitle: "Daily student and staff attendance",
    render: renderModule("Attendance", ["Student attendance", "Staff attendance", "Leave", "Attendance reports"])
  },
  duties: {
    title: "Duties",
    subtitle: "Staff duty allocation and follow-up",
    render: renderModule("Duties", ["Duty roster", "Assignments", "Completion", "Exceptions"])
  },
  transport: {
    title: "Transport",
    subtitle: "School transport operations",
    render: renderModule("Transport", ["Routes", "Vehicles", "Drivers", "Students", "Daily status"])
  },
  maintenance: {
    title: "Maintenance",
    subtitle: "Facilities, issues and service requests",
    render: renderModule("Maintenance", ["Open issues", "Work orders", "Facilities", "Vendor follow-up"])
  },
  reports: {
    title: "Reports & Audit",
    subtitle: "Management reports and system accountability",
    render: renderModule("Reports & Audit", ["Management reports", "Attendance reports", "Operational reports", "Audit logs"])
  }
};

function escapeHtml(value = "") {
  return String(value).replace(/[&<>\"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"
  }[char]));
}

function renderModule(title, items) {
  return () => {
    els.content.innerHTML = `
      <section class="module-head">
        <div><span class="section-kicker">AARIKA MODULE</span><h2>${escapeHtml(title)}</h2></div>
        <span class="status-pill">Foundation ready</span>
      </section>
      <div class="module-grid">
        ${items.map((item, index) => `
          <button class="module-card" type="button" data-module="${escapeHtml(item)}">
            <span class="module-icon">${index + 1}</span>
            <span><strong>${escapeHtml(item)}</strong><small>Open module →</small></span>
          </button>`).join("")}
      </div>
      <div class="info-panel">
        <strong>Next build layer</strong>
        <p>This module is now part of the Director navigation. Live Firestore records will be connected module-by-module without changing the authentication foundation.</p>
      </div>`;

    $$("[data-module]").forEach((button) => button.addEventListener("click", () => showToast(`${button.dataset.module} is queued for the next data layer.`)));
  };
}

function renderDashboard() {
  els.content.innerHTML = `
    <section class="hero">
      <div>
        <span class="section-kicker">BAL JYOTI PUBLIC SCHOOL</span>
        <h2>Good morning, ${escapeHtml(els.name.textContent || "Director")}</h2>
        <p>Welcome to the AARIKA school operations centre.</p>
      </div>
      <div class="hero-status"><span class="dot"></span> System active</div>
    </section>

    <section class="metric-grid">
      <article class="metric-card"><span>Students</span><strong>—</strong><small>Live data layer next</small></article>
      <article class="metric-card"><span>Teachers & Staff</span><strong>—</strong><small>Live data layer next</small></article>
      <article class="metric-card"><span>Attendance</span><strong>—</strong><small>Today's status</small></article>
      <article class="metric-card"><span>Open Tasks</span><strong>—</strong><small>Requires attention</small></article>
    </section>

    <section class="dashboard-grid">
      <article class="panel">
        <div class="panel-title"><h3>Today's Operations</h3><span>15 Aug 2026</span></div>
        ${["Attendance", "Staff & teacher duty", "Transport", "Maintenance"].map(item => `<div class="operation"><span>${item}</span><span class="pending">Awaiting live data</span></div>`).join("")}
      </article>
      <article class="panel">
        <div class="panel-title"><h3>Director Quick Access</h3></div>
        ${["School Setup", "Users & Permissions", "Reports & Audit"].map(item => `<button class="quick-link" type="button" data-module="${item}">${item}<span>→</span></button>`).join("")}
      </article>
    </section>
  `;

  $$("[data-module]").forEach((button) => button.addEventListener("click", () => {
    const match = Object.entries(sections).find(([, section]) => section.title === button.dataset.module);
    if (match) navigate(match[0]); else showToast(`${button.dataset.module} is queued for the next data layer.`);
  }));
}

function navigate(key) {
  const section = sections[key] || sections.dashboard;
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.section === key));
  els.pageTitle.textContent = section.title;
  els.pageSubtitle.textContent = section.subtitle;
  section.render();
  els.sidebar.classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 2600);
}

async function loadProfile(user) {
  // Profile data is optional for opening the dashboard. Authentication alone
  // must never leave the user stuck on a blank/loading page.
  try {
    const { db } = getAarikaFirebase();
    const snapshot = await getDoc(doc(db, "users", user.uid));
    const profile = snapshot.exists() ? snapshot.data() : {};

    const displayName = profile.displayName || user.displayName || "Director";
    els.name.textContent = displayName;
    els.email.textContent = profile.email || user.email || "";
    els.role.textContent = String(profile.roleId || "VIEWER").replaceAll("_", " ");
    els.school.textContent = profile.schoolId || "Bal Jyoti Public School";
    els.avatar.textContent = displayName.trim().charAt(0).toUpperCase() || "A";
  } catch (error) {
    console.warn("AARIKA profile read failed; continuing with authenticated user", error);
    els.name.textContent = user.displayName || "Director";
    els.email.textContent = user.email || "";
    els.role.textContent = "SUPER ADMIN";
    els.school.textContent = "Bal Jyoti Public School";
    els.avatar.textContent = (user.displayName || "A").trim().charAt(0).toUpperCase();
  }
}

function dashboardUrl() {
  return new URL("./dashboard.html", window.location.href).href;
}

function loginUrl() {
  return new URL("./login.html", window.location.href).href;
}

try {
  const { auth } = getAarikaFirebase();

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.replace(loginUrl());
      return;
    }

    // Render immediately after Firebase confirms authentication.
    // Do not block navigation on Firestore profile loading.
    navigate("dashboard");
    showToast("AARIKA dashboard loaded.");

    await loadProfile(user);
    navigate("dashboard");
  });

  els.signOut?.addEventListener("click", async () => {
    await signOut(auth);
    window.location.replace(loginUrl());
  });

  els.menu?.addEventListener("click", () => els.sidebar.classList.toggle("open"));
  $$(".nav-item").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.section)));
} catch (error) {
  console.error("AARIKA dashboard startup failed", error);
  window.location.replace(loginUrl());
}
