import { getAarikaFirebase } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { createDemoData } from "./data/demo-data.js";

const RED = "#b31318";

const firebase = getAarikaFirebase();
const auth = firebase.auth;

const demo = createDemoData();

const STORAGE_KEY = "aarika_demo_state_v2";

const savedState =
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");

const state = savedState || {
  admissions: demo.admissions.map(x => ({ ...x })),
  attendance: demo.attendance.map(x => ({ ...x })),
  maintenance: demo.maintenance.map(x => ({ ...x })),
  activities: demo.activities.map(x => ({ ...x }))
};

const save = () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
};

const $ = selector =>
  document.querySelector(selector);

const $$ = selector =>
  [...document.querySelectorAll(selector)];

const esc = value =>
  String(value ?? "").replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char])
  );

const toast = message => {
  const element = $("#toast");

  if (!element) return;

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(toast.timer);

  toast.timer = setTimeout(() => {
    element.classList.remove("show");
  }, 2200);
};


/* =========================================================
   MODULES
========================================================= */

const modules = {

  dashboard: [
    "Director Dashboard",
    "School-wide overview and daily operations"
  ],

  academic: [
    "Academic",
    "Classes, curriculum, timetable, assessment and results"
  ],

  admissions: [
    "Admissions",
    "Enquiries, applications, verification and onboarding"
  ],

  attendance: [
    "Attendance & Leave",
    "Daily attendance, exceptions and staff follow-up"
  ],

  duties: [
    "Activity",
    "Daily duties, events, tasks and school activity"
  ],

  school: [
    "Administration",
    "School profile, session, classes, subjects and staff"
  ],

  transport: [
    "Transport",
    "Routes, buses, drivers and student movement"
  ],

  maintenance: [
    "Maintenance",
    "Facilities, tickets, assets and service follow-up"
  ],

  reports: [
    "Reports & Audit",
    "Management information, reports and audit visibility"
  ],

  ai: [
    "AI Intelligence",
    "Decision support for school leadership"
  ]

};


/* =========================================================
   BASIC UI STYLE
========================================================= */

const style = document.createElement("style");

style.textContent = `

:root {
  --r: ${RED};
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #fff;
  color: var(--r);
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.app {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 245px 1fr;
}

.side {
  background: var(--r);
  color: #fff;
  padding: 20px 14px;
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.brand {
  padding: 3px 10px 18px;
  border-bottom: 1px solid #fff;
}

.brand b {
  font-size: 27px;
}

.brand small {
  display: block;
  font-size: 9px;
  letter-spacing: .15em;
  margin-top: 4px;
}

.school {
  padding: 16px 10px;
  font-size: 11px;
}

.school b {
  display: block;
  font-size: 13px;
  margin-bottom: 2px;
}

.label {
  font-size: 9px;
  letter-spacing: .15em;
  padding: 8px 10px 5px;
}

.nav {
  display: grid;
  gap: 4px;
}

.nav button {
  border: 1px solid transparent;
  background: transparent;
  color: #fff;
  text-align: left;
  border-radius: 8px;
  padding: 10px 11px;
  font-size: 12px;
  font-weight: 700;
}

.nav button:hover,
.nav button.active {
  background: #fff;
  color: var(--r);
}

.side-bottom {
  margin-top: auto;
  border-top: 1px solid #fff;
  padding: 13px 10px 0;
  font-size: 11px;
}

.signout {
  width: 100%;
  margin-top: 9px;
  border: 1px solid #fff;
  background: var(--r);
  color: #fff;
  border-radius: 8px;
  padding: 8px;
}

.signout:hover {
  background: #fff;
  color: var(--r);
}

main {
  min-width: 0;
}

.top {
  height: 72px;
  border-bottom: 1px solid var(--r);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 5;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu {
  display: none;
  border: 1px solid var(--r);
  background: #fff;
  color: var(--r);
  border-radius: 8px;
  padding: 7px 9px;
}

.title {
  font-weight: 850;
  font-size: 19px;
}

.subtitle {
  font-size: 10px;
  margin-top: 3px;
}

.profile {
  display: flex;
  gap: 9px;
  align-items: center;
}

.profile-text {
  text-align: right;
}

.profile-name {
  font-size: 11px;
  font-weight: 800;
}

.profile-role {
  font-size: 9px;
}

.avatar {
  width: 34px;
  height: 34px;
  background: var(--r);
  color: #fff;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 900;
}

.content {
  padding: 25px;
  max-width: 1550px;
  margin: auto;
}

.hero {
  border: 1px solid var(--r);
  border-radius: 14px;
  padding: 19px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.eyebrow {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .16em;
}

.hero h1 {
  font-size: 26px;
  margin: 5px 0;
}

.hero p {
  margin: 0;
  font-size: 11px;
}

.pill,
.status {
  border: 1px solid var(--r);
  border-radius: 999px;
  padding: 5px 8px;
  font-size: 9px;
  white-space: nowrap;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin: 12px 0;
}

.metric,
.card,
.table-card,
.item {
  border: 1px solid var(--r);
  border-radius: 12px;
  padding: 15px;
  background: #fff;
}

.metric span {
  font-size: 9px;
}

.metric b {
  display: block;
  font-size: 24px;
  margin: 5px 0;
}

.metric small {
  font-size: 9px;
}

.grid2 {
  display: grid;
  grid-template-columns: 1.45fr 1fr;
  gap: 12px;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.head h3,
.table-card h3 {
  font-size: 13px;
  margin: 0;
}

.head span {
  font-size: 9px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--r);
  font-size: 11px;
}

.row:last-child {
  border-bottom: 0;
}

.quick button {
  display: flex;
  width: 100%;
  justify-content: space-between;
  background: #fff;
  color: var(--r);
  border: 0;
  border-bottom: 1px solid var(--r);
  padding: 11px 0;
  font-size: 11px;
}

.quick button:last-child {
  border-bottom: 0;
}

.ai {
  margin-top: 12px;
  border: 1px solid var(--r);
  background: var(--r);
  color: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.item b {
  display: block;
  font-size: 13px;
}

.item small {
  display: block;
  margin-top: 5px;
  font-size: 9px;
}

.item p {
  font-size: 10px;
  line-height: 1.5;
}

.btn {
  border: 1px solid var(--r);
  background: #fff;
  color: var(--r);
  border-radius: 7px;
  padding: 7px 10px;
  font-size: 10px;
  font-weight: 700;
}

.btn:hover,
.btn.primary {
  background: var(--r);
  color: #fff;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
}

.section-head h1 {
  margin: 4px 0;
  font-size: 22px;
}

.section-head p {
  margin: 0;
  font-size: 10px;
}

.tools {
  display: flex;
  gap: 8px;
}

.search {
  border: 1px solid var(--r);
  border-radius: 7px;
  padding: 8px 10px;
  min-width: 220px;
  color: var(--r);
}

.table-wrap {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
}

.table th {
  background: var(--r);
  color: #fff;
  padding: 9px;
  text-align: left;
}

.table td {
  padding: 9px;
  border-bottom: 1px solid var(--r);
}

.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}

.toast {
  position: fixed;
  right: 20px;
  bottom: 20px;
  background: var(--r);
  color: #fff;
  padding: 10px 13px;
  border-radius: 8px;
  font-size: 10px;
  opacity: 0;
  transform: translateY(7px);
  transition: .2s;
  z-index: 30;
}

.toast.show {
  opacity: 1;
  transform: none;
}

.auth-loading {
  min-height: 50vh;
  display: grid;
  place-items: center;
  text-align: center;
  font-size: 13px;
}

@media(max-width:1050px) {
  .metrics {
    grid-template-columns: repeat(3, 1fr);
  }

  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media(max-width:800px) {

  .app {
    display: block;
  }

  .side {
    position: fixed;
    left: 0;
    top: 0;
    width: 265px;
    z-index: 10;
    transform: translateX(-105%);
    transition: .2s;
  }

  .side.open {
    transform: translateX(0);
  }

  .menu {
    display: block;
  }

  .top {
    padding: 0 14px;
  }

  .profile-text {
    display: none;
  }

  .content {
    padding: 15px;
  }

  .grid2 {
    grid-template-columns: 1fr;
  }

  .metrics {
    grid-template-columns: repeat(2, 1fr);
  }

  .cards {
    grid-template-columns: 1fr;
  }

  .two {
    grid-template-columns: 1fr;
  }

  .hero {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media(max-width:470px) {

  .title {
    font-size: 16px;
  }

  .search {
    min-width: 160px;
  }

  .content {
    padding: 12px;
  }
}

`;

document.head.appendChild(style);


/* =========================================================
   ROOT
========================================================= */

const root = $("#contentArea");


/* =========================================================
   NAVIGATION
========================================================= */

function header(key) {

  const module =
    modules[key] || modules.dashboard;

  $("#pageTitle").textContent = module[0];
  $("#pageSubtitle").textContent = module[1];

  $$(".nav button").forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.section === key
    );

  });
}

function nav(key) {

  header(key);
  render(key);

  $("#sidebar")?.classList.remove("open");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   DASHBOARD
========================================================= */

function dashboard() {

  const present =
    state.attendance.filter(
      x => x.status === "Present"
    ).length;

  const absent =
    state.attendance.length - present;

  const attendance =
    state.attendance.length
      ? Math.round(
          present /
          state.attendance.length *
          100
        )
      : 0;

  root.innerHTML = `

    <div class="hero">

      <div>

        <div class="eyebrow">
          BAL JYOTI PUBLIC SCHOOL ·
          ${esc(demo.school.session)}
        </div>

        <h1>
          Good morning, Director
        </h1>

        <p>
          One operating view across academics,
          admissions, activity and administration.
        </p>

      </div>

      <span class="pill">
        DEMO SCHOOL DATA · INTERACTIVE
      </span>

    </div>

    <div class="metrics">

      <div class="metric">
        <span>Students</span>
        <b>${demo.students.length}</b>
        <small>Active enrolment</small>
      </div>

      <div class="metric">
        <span>Teachers & Staff</span>
        <b>${demo.teachers.length}</b>
        <small>Active workforce</small>
      </div>

      <div class="metric">
        <span>Classes</span>
        <b>${demo.classes.length}</b>
        <small>Sections</small>
      </div>

      <div class="metric">
        <span>Attendance</span>
        <b>${attendance}%</b>
        <small>Today's sample</small>
      </div>

      <div class="metric">
        <span>Admissions</span>
        <b>${state.admissions.length}</b>
        <small>Pipeline records</small>
      </div>

    </div>

    <div class="grid2">

      <div class="card">

        <div class="head">
          <h3>Today's School Activity</h3>
          <span>15 Aug 2026</span>
        </div>

        ${state.activities
          .slice(0, 6)
          .map(x => `
            <div class="row">

              <span>
                ${esc(x.time)} ·
                ${esc(x.action)}
                <br>
                <small>
                  ${esc(x.reference)}
                </small>
              </span>

              <span class="status">
                ${esc(x.category)}
              </span>

            </div>
          `)
          .join("")}

      </div>


      <div class="card">

        <div class="head">
          <h3>Leadership Actions</h3>
          <span>Priority</span>
        </div>

        <div class="quick">

          <button data-go="admissions">
            <span>
              Review admission follow-ups
            </span>
            <b>
              ${state.admissions.filter(
                x => x.stage !== "Approved"
              ).length} →
            </b>
          </button>

          <button data-go="attendance">
            <span>
              Review attendance exceptions
            </span>
            <b>
              ${absent} →
            </b>
          </button>

          <button data-go="maintenance">
            <span>
              Open maintenance tickets
            </span>
            <b>
              ${state.maintenance.filter(
                x => x.status !== "Closed"
              ).length} →
            </b>
          </button>

          <button data-go="reports">
            <span>
              Open management MIS
            </span>
            <b>→</b>
          </button>

        </div>

      </div>

    </div>


    <div class="ai">

      <div>

        <div class="eyebrow">
          AARIKA AI
        </div>

        <h3>
          School performance brief
        </h3>

        <p>
          ${esc(demo.ai.brief)}
        </p>

      </div>

      <button
        class="btn"
        data-go="ai"
      >
        Open AI Intelligence →
      </button>

    </div>

  `;
}


/* =========================================================
   SCHOOL / ADMINISTRATION
========================================================= */

function school() {

  root.innerHTML = `

    <div class="section-head">

      <div>

        <div class="eyebrow">
          SCHOOL CONTROL
        </div>

        <h1>
          Administration
        </h1>

        <p>
          ${esc(demo.school.name)}
          · Academic Session
          ${esc(demo.school.session)}
        </p>

      </div>

      <button
        class="btn primary"
        data-toast="School profile edit workflow opened"
      >
        Edit Profile
      </button>

    </div>


    <div class="cards">

      ${[
        [
          "School Profile",
          `${demo.school.name} · ${demo.school.location}`
        ],
        [
          "Academic Session",
          `${demo.school.session} · Active`
        ],
        [
          "Classes & Sections",
          `${demo.classes.length} sections`
        ],
        [
          "Subjects & Curriculum",
          `${demo.subjects.length} subjects configured`
        ],
        [
          "Teachers & Staff",
          `${demo.teachers.length} active profiles`
        ],
        [
          "School Leadership",
          demo.school.principal
        ]
      ]
      .map(x => `

        <div class="item">

          <b>${esc(x[0])}</b>

          <small>
            ${esc(x[1])}
          </small>

          <p>
            Configured and available
            for the school workflow.
          </p>

          <button
            class="btn"
            data-toast="${esc(x[0])} opened"
          >
            Open
          </button>

        </div>

      `)
      .join("")}

    </div>


    <div
      class="table-card"
      style="margin-top:12px"
    >

      <div class="head">

        <h3>
          Classes & Sections
        </h3>

        <span>
          Capacity view
        </span>

      </div>

      <div class="table-wrap">

        <table class="table">

          <thead>

            <tr>
              <th>Class</th>
              <th>Room</th>
              <th>Class Teacher</th>
              <th>Students</th>
              <th>Capacity</th>
              <th>Utilisation</th>
            </tr>

          </thead>

          <tbody>

            ${demo.classes.map(c => `

              <tr>

                <td>
                  ${esc(c.name)}-${esc(c.section)}
                </td>

                <td>
                  ${esc(c.room)}
                </td>

                <td>
                  ${esc(c.classTeacher)}
                </td>

                <td>
                  ${esc(c.students)}
                </td>

                <td>
                  ${esc(c.capacity)}
                </td>

                <td>
                  ${Math.round(
                    c.students /
                    c.capacity *
                    100
                  )}%
                </td>

              </tr>

            `).join("")}

          </tbody>

        </table>

      </div>

    </div>

  `;
}


/* =========================================================
   ACADEMIC
========================================================= */

function academic() {

  root.innerHTML = `

    <div class="section-head">

      <div>

        <div class="eyebrow">
          ACADEMIC CONTROL
        </div>

        <h1>
          Academic
        </h1>

        <p>
          Classes, curriculum, timetable,
          assessment and results.
        </p>

      </div>

      <button
        class="btn primary"
        data-add="assessment"
      >
        + Schedule Assessment
      </button>

    </div>


    <div class="cards">

      ${[
        [
          "Classes & Sections",
          `${demo.classes.length} active sections`,
          `Average strength ${Math.round(
            demo.students.length /
            demo.classes.length
          )}`
        ],
        [
          "Curriculum",
          `${demo.subjects.length} subjects`,
          "Core + activity subjects"
        ],
        [
          "Timetable",
          `${demo.timetable.length} periods`,
          "Today's sample timetable"
        ],
        [
          "Assessments",
          `${demo.assessments.length} scheduled`,
          "Next assessment 18 Aug"
        ],
        [
          "Results",
          `${demo.students.length} student profiles`,
          "Result entry workflow ready"
        ],
        [
          "Report Cards",
          "Term 1",
          "Generate and publish workflow"
        ]
      ]
      .map(x => `

        <div class="item">

          <b>${esc(x[0])}</b>

          <small>${esc(x[1])}</small>

          <p>${esc(x[2])}</p>

          <button
            class="btn"
            data-toast="${esc(x[0])} workflow opened"
          >
            Open
          </button>

        </div>

      `)
      .join("")}

    </div>


    <div class="two">

      <div class="table-card">

        <div class="head">

          <h3>
            Today's Timetable
          </h3>

          <span>
            15 Aug
          </span>

        </div>

        <div class="table-wrap">

          <table class="table">

            <thead>

              <tr>
                <th>Time</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Teacher</th>
                <th>Room</th>
              </tr>

            </thead>

            <tbody>

              ${demo.timetable.map(t => `

                <tr>
                  <td>${esc(t.time)}</td>
                  <td>${esc(t.subject)}</td>
                  <td>${esc(t.className)}</td>
                  <td>${esc(t.teacher)}</td>
                  <td>${esc(t.room)}</td>
                </tr>

              `).join("")}

            </tbody>

          </table>

        </div>

      </div>


      <div class="table-card">

        <div class="head">

          <h3>
            Upcoming Assessments
          </h3>

          <span>
            Schedule
          </span>

        </div>

        ${demo.assessments.map(a => `

          <div class="row">

            <span>

              <b>
                ${esc(a.title)}
              </b>

              <br>

              ${esc(a.subject)}
              ·
              ${esc(a.className)}

            </span>

            <span class="status">
              ${esc(a.date)}
            </span>

          </div>

        `).join("")}

      </div>

    </div>

  `;
}


/* =========================================================
   TABLE MODULES
========================================================= */

function tablePage(key) {

  const configurations = {

    admissions: {
      title: "Admissions Pipeline",
      search: "Search applicant...",
      columns: [
        "ID",
        "Student",
        "Class",
        "Source",
        "Date",
        "Stage",
        "Priority",
        "Action"
      ],
      rows: () => state.admissions,
      render: r => [
        r.id,
        r.student,
        r.className,
        r.source,
        r.date,
        r.stage,
        r.priority,
        `<button class="btn"
          data-adm="${esc(r.id)}">
          Update
        </button>`
      ]
    },

    attendance: {
      title: "Today's Attendance",
      search: "Search student...",
      columns: [
        "Student ID",
        "Student",
        "Class",
        "Status",
        "Time",
        "Action"
      ],
      rows: () => state.attendance,
      render: r => [
        r.studentId,
        r.name,
        r.className,
        r.status,
        r.time,
        `<button class="btn"
          data-att="${esc(r.studentId)}">
          ${r.status === "Present"
            ? "Mark absent"
            : "Mark present"}
        </button>`
      ]
    },

    maintenance: {
      title: "Maintenance Tickets",
      search: "Search issue...",
      columns: [
        "ID",
        "Issue",
        "Location",
        "Priority",
        "Status",
        "Reported",
        "Action"
      ],
      rows: () => state.maintenance,
      render: r => [
        r.id,
        r.issue,
        r.location,
        r.priority,
        r.status,
        r.reported,
        `<button class="btn"
          data-maint="${esc(r.id)}">
          ${r.status === "Closed"
            ? "Reopen"
            : "Close"}
        </button>`
      ]
    },

    transport: {
      title: "Transport Operations",
      search: "Search route or driver...",
      columns: [
        "Bus",
        "Route",
        "Coverage",
        "Driver",
        "Students",
        "Capacity",
        "Status"
      ],
      rows: () => demo.transport,
      render: r => [
        r.id,
        r.route,
        r.stops,
        r.driver,
        r.students,
        r.capacity,
        r.status
      ]
    },

    duties: {
      title: "Daily Activity & Events",
      search: "Search activity...",
      columns: [
        "Time/Date",
        "Activity",
        "Reference",
        "Category"
      ],
      rows: () => [
        ...state.activities,
        ...demo.events.map(e => ({
          time: e.date,
          action: e.title,
          reference: e.audience,
          category: e.type
        }))
      ],
      render: r => [
        r.time,
        r.action,
        r.reference,
        r.category
      ]
    },

    reports: {
      title: "Reports & Audit",
      search: "Search report...",
      columns: [
        "Report",
        "Frequency",
        "Owner",
        "Status",
        "Open"
      ],
      rows: () => [
        {
          report: "Student Strength & Attendance MIS",
          frequency: "Daily",
          owner: "Academic",
          status: "Ready"
        },
        {
          report: "Admissions Funnel",
          frequency: "Weekly",
          owner: "Admissions",
          status: "Ready"
        },
        {
          report: "Fee Collection & Dues",
          frequency: "Daily",
          owner: "Finance",
          status: "Ready"
        },
        {
          report: "Academic Performance",
          frequency: "Monthly",
          owner: "Academic",
          status: "Ready"
        },
        {
          report: "Transport Utilisation",
          frequency: "Weekly",
          owner: "Administration",
          status: "Ready"
        },
        {
          report: "Audit Log",
          frequency: "Live",
          owner: "System",
          status: "Ready"
        }
      ],
      render: r => [
        r.report,
        r.frequency,
        r.owner,
        r.status,
        `<button class="btn"
          data-report="${esc(r.report)}">
          Open
        </button>`
      ]
    }

  };

  const config = configurations[key];

  if (!config) {
    dashboard();
    return;
  }

  const rows = config.rows();

  root.innerHTML = `

    <div class="section-head">

      <div>

        <div class="eyebrow">
          AARIKA WORKSPACE
        </div>

        <h1>
          ${esc(config.title)}
        </h1>

        <p>
          ${rows.length}
          records · demo workflow is interactive
        </p>

      </div>

      <div class="tools">

        <input
          class="search"
          id="tableSearch"
          placeholder="${esc(config.search)}"
        >

        <button
          class="btn primary"
          data-add="${esc(key)}"
        >
          ${key === "reports"
            ? "Generate Report"
            : "+ Add / Update"}
        </button>

      </div>

    </div>


    <div class="table-card">

      <div class="table-wrap">

        <table class="table">

          <thead>

            <tr>

              ${config.columns
                .map(column =>
                  `<th>${esc(column)}</th>`
                )
                .join("")}

            </tr>

          </thead>

          <tbody id="tableBody">

            ${rows.map(row => `

              <tr>

                ${config
                  .render(row)
                  .map(cell => `

                    <td>
                      ${
                        String(cell)
                          .includes("<button")
                          ? cell
                          : esc(cell)
                      }
                    </td>

                  `)
                  .join("")}

              </tr>

            `).join("")}

          </tbody>

        </table>

      </div>

    </div>

  `;

  $("#tableSearch")?.addEventListener(
    "input",
    event => {

      const query =
        event.target.value.toLowerCase();

      $$("#tableBody tr").forEach(row => {

        row.style.display =
          row.textContent
            .toLowerCase()
            .includes(query)
            ? ""
            : "none";

      });

    }
  );
}


/* =========================================================
   AI
========================================================= */

function ai() {

  root.innerHTML = `

    <div class="section-head">

      <div>

        <div class="eyebrow">
          LEADERSHIP LAYER
        </div>

        <h1>
          AI Intelligence
        </h1>

        <p>
          AARIKA decision support using
          the current demo school dataset.
        </p>

      </div>

      <button
        class="btn primary"
        data-ai-refresh
      >
        Refresh AI Brief
      </button>

    </div>


    <div class="metrics">

      <div class="metric">
        <span>Attendance Risk</span>
        <b>${demo.ai.attendanceRisk}</b>
        <small>Students needing review</small>
      </div>

      <div class="metric">
        <span>Admission Follow-ups</span>
        <b>
          ${state.admissions.filter(
            x => x.stage !== "Approved"
          ).length}
        </b>
        <small>Priority actions</small>
      </div>

      <div class="metric">
        <span>Academic Alerts</span>
        <b>${demo.ai.academicAlerts}</b>
        <small>Performance signals</small>
      </div>

      <div class="metric">
        <span>Operational Alerts</span>
        <b>
          ${state.maintenance.filter(
            x => x.status !== "Closed"
          ).length}
        </b>
        <small>Open exceptions</small>
      </div>

      <div class="metric">
        <span>AI Confidence</span>
        <b>92%</b>
        <small>Demo analytical confidence</small>
      </div>

    </div>


    <div class="cards">

      ${[
        [
          "School Performance Brief",
          demo.ai.brief,
          "reports"
        ],
        [
          "Attendance Risk",
          "Three students have attendance below the review threshold in the sample dataset.",
          "attendance"
        ],
        [
          "Admissions Conversion",
          `${state.admissions.filter(
            x => x.stage !== "Approved"
          ).length} active cases require next-step follow-up across verification, interview and fee confirmation.`,
          "admissions"
        ],
        [
          "Academic Performance",
          "Assessment calendar is populated for Classes 7–10. Periodic tests are the next major academic activity.",
          "academic"
        ],
        [
          "Operations",
          `${state.maintenance.filter(
            x => x.status !== "Closed"
          ).length} maintenance issues are not closed. One high-priority issue needs attention.`,
          "maintenance"
        ],
        [
          "Ask AARIKA AI",
          "Try: What needs my attention today?",
          "ask"
        ]
      ]
      .map(item => `

        <div class="item">

          <b>${esc(item[0])}</b>

          <p>
            ${esc(item[1])}
          </p>

          <button
            class="btn ${item[2] === "ask"
              ? "primary"
              : ""}"
            data-go="${esc(item[2])}"
          >
            ${item[2] === "ask"
              ? "Ask AARIKA"
              : "Open →"}
          </button>

        </div>

      `)
      .join("")}

    </div>

  `;
}


/* =========================================================
   RENDER
========================================================= */

function render(key) {

  if (key === "dashboard") {
    dashboard();
  }

  else if (key === "school") {
    school();
  }

  else if (key === "academic") {
    academic();
  }

  else if (key === "ai") {
    ai();
  }

  else if (
    [
      "admissions",
      "attendance",
      "maintenance",
      "transport",
      "duties",
      "reports"
    ].includes(key)
  ) {
    tablePage(key);
  }

  else {
    dashboard();
  }

  bind();
}


/* =========================================================
   INTERACTIONS
========================================================= */

function bind() {

  $$("[data-go]").forEach(button => {

    button.onclick = () => {

      const destination =
        button.dataset.go;

      if (destination === "ask") {

        toast(
          "AI response: Review admissions, attendance and maintenance exceptions first."
        );

        return;
      }

      nav(destination);

    };

  });


  $$("[data-toast]").forEach(button => {

    button.onclick = () => {

      toast(button.dataset.toast);

    };

  });


  $$("[data-adm]").forEach(button => {

    button.onclick = () => {

      const record =
        state.admissions.find(
          item =>
            item.id === button.dataset.adm
        );

      if (!record) return;

      const stages = [
        "Enquiry",
        "Documents pending",
        "Verification pending",
        "Interview scheduled",
        "Fee confirmation",
        "Approved"
      ];

      const current =
        stages.indexOf(record.stage);

      record.stage =
        stages[
          (current + 1) %
          stages.length
        ];

      save();

      toast(
        `${record.student}: ${record.stage}`
      );

      render("admissions");

    };

  });


  $$("[data-att]").forEach(button => {

    button.onclick = () => {

      const record =
        state.attendance.find(
          item =>
            item.studentId ===
            button.dataset.att
        );

      if (!record) return;

      record.status =
        record.status === "Present"
          ? "Absent"
          : "Present";

      record.time =
        record.status === "Present"
          ? "07:45 AM"
          : "—";

      save();

      toast(
        `${record.name}: ${record.status}`
      );

      render("attendance");

    };

  });


  $$("[data-maint]").forEach(button => {

    button.onclick = () => {

      const record =
        state.maintenance.find(
          item =>
            item.id ===
            button.dataset.maint
        );

      if (!record) return;

      record.status =
        record.status === "Closed"
          ? "Open"
          : "Closed";

      save();

      toast(
        `${record.id}: ${record.status}`
      );

      render("maintenance");

    };

  });


  $$("[data-report]").forEach(button => {

    button.onclick = () => {

      toast(
        `Report opened: ${button.dataset.report}`
      );

    };

  });


  $$("[data-add]").forEach(button => {

    button.onclick = () => {

      addDemo(
        button.dataset.add
      );

    };

  });


  $("[data-ai-refresh]")?.addEventListener(
    "click",
    () => {

      toast("AI brief refreshed");

      render("ai");

    }
  );

}


/* =========================================================
   DEMO DATA ACTIONS
========================================================= */

function addDemo(key) {

  if (key === "admissions") {

    const number =
      state.admissions.length + 26001;

    state.admissions.unshift({
      id: `ADM-${number}`,
      student: "Demo Applicant",
      className: "Class 7",
      source: "Website",
      date: "15 Aug 2026",
      stage: "Enquiry",
      priority: "Medium"
    });

    save();

    toast("Demo admission added");

    render("admissions");

    return;
  }


  if (key === "maintenance") {

    const number =
      state.maintenance.length + 1001;

    state.maintenance.unshift({
      id: `MT-${number}`,
      issue: "Demo maintenance request",
      location: "Academic Block",
      priority: "Low",
      status: "Open",
      reported: "15 Aug 2026"
    });

    save();

    toast("Demo ticket added");

    render("maintenance");

    return;
  }


  if (key === "assessment") {

    demo.assessments.push({
      id: `ASM-${demo.assessments.length + 1}`,
      title: "Demo Assessment",
      subject: "Mathematics",
      className: "Class 8-A",
      date: "26 Aug 2026",
      maxMarks: 40,
      status: "Scheduled"
    });

    toast("Assessment scheduled");

    render("academic");

    return;
  }


  if (key === "reports") {

    toast(
      "Management report generated successfully"
    );

    return;
  }


  toast("Edit workflow opened");

}


/* =========================================================
   SIDEBAR
========================================================= */

$$(".nav button").forEach(button => {

  button.onclick = () => {

    nav(button.dataset.section);

  };

});


$("#mobileMenu")?.addEventListener(
  "click",
  () => {
    $("#sidebar")?.classList.toggle("open");
  }
);


/* =========================================================
   SIGN OUT
========================================================= */

$("#signOut")?.addEventListener(
  "click",
  async () => {

    try {

      await signOut(auth);

      window.location.replace(
        "./index.html"
      );

    }

    catch (error) {

      console.error(
        "AARIKA sign-out error:",
        error
      );

      toast(
        "Unable to sign out. Please try again."
      );

    }

  }
);


/* =========================================================
   AUTHENTICATION
   IMPORTANT FIX
========================================================= */

let authResolved = false;

function showDashboardUser(user) {

  const name =
    user.displayName ||
    "Director";

  const email =
    user.email ||
    "";

  $("#userName").textContent =
    name;

  $("#userEmail").textContent =
    email;

  $("#schoolName").textContent =
    demo.school.name;

  $("#role").textContent =
    "SUPER ADMIN";

  $("#avatar").textContent =
    name.charAt(0).toUpperCase();

  nav("dashboard");

}


/*
 * Firebase calls this after it restores
 * the persisted authentication session.
 *
 * We DO NOT immediately redirect when
 * user is null.
 */

onAuthStateChanged(
  auth,
  user => {

    console.log(
      "AARIKA dashboard authentication:",
      user
        ? user.email
        : "checking session"
    );


    if (user) {

      authResolved = true;

      const email =
        user.email || "";

      if (
        !email
          .toLowerCase()
          .endsWith("@baljyoti.com")
      ) {

        console.warn(
          "Unauthorised AARIKA account:",
          email
        );

        toast(
          "Only @baljyoti.com accounts can access AARIKA."
        );

        setTimeout(() => {

          window.location.replace(
            "./index.html"
          );

        }, 1200);

        return;
      }


      showDashboardUser(user);

      return;
    }


    /*
     * Do not immediately send the user away.
     * Give Firebase time to restore the session.
     */

    if (!authResolved) {

      root.innerHTML = `

        <div class="auth-loading">

          <div>

            <div class="eyebrow">
              AARIKA
            </div>

            <h2>
              Checking secure session…
            </h2>

            <p>
              Please wait while Firebase
              restores your authorised session.
            </p>

          </div>

        </div>

      `;

      setTimeout(() => {

        if (!auth.currentUser) {

          console.warn(
            "AARIKA: No authenticated session found."
          );

          window.location.replace(
            "./index.html"
          );

        }

      }, 4000);

    }

  }
);
