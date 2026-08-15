import { getAarikaFirebase } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const RED = "#b31318";
const WHITE = "#ffffff";
const auth = getAarikaFirebase().auth;

const modules = {
  academic: {
    title: "Academic",
    subtitle: "Teaching, learning, assessment and student performance",
    items: ["Academic calendar", "Classes & sections", "Subjects & curriculum", "Timetable", "Assessment & examinations", "Results & report cards"]
  },
  admissions: {
    title: "Admissions",
    subtitle: "Enquiries, applications and student onboarding",
    items: ["Enquiries & leads", "Applications", "Document verification", "Selection & approval", "Fee confirmation", "New student onboarding"]
  },
  activity: {
    title: "Activity",
    subtitle: "Daily school activity, attendance and follow-up",
    items: ["Today's attendance", "Teacher activity", "Student activities", "Events & calendar", "Tasks & follow-up", "Alerts & exceptions"]
  },
  administration: {
    title: "Administration",
    subtitle: "People, finance, facilities and school controls",
    items: ["Students & profiles", "Teachers & staff", "Fees & finance", "Transport", "Facilities & maintenance", "Users & permissions"]
  },
  reports: {
    title: "Reports",
    subtitle: "Management reports, MIS and audit visibility",
    items: ["Academic reports", "Admissions reports", "Attendance reports", "Finance reports", "Operational MIS", "Audit logs"]
  },
  ai: {
    title: "AI Intelligence",
    subtitle: "Decision support for school leadership",
    items: ["School performance brief", "Attendance risk signals", "Admission conversion insights", "Academic performance insights", "Operational exceptions", "Ask AARIKA AI"]
  }
};

const style = document.createElement("style");
style.textContent = `
:root{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--red:${RED};--white:${WHITE};--line:${RED};color:var(--red);background:var(--white)}
*{box-sizing:border-box}body{margin:0;background:var(--white);color:var(--red)}button{font:inherit}.app{min-height:100vh;display:grid;grid-template-columns:250px minmax(0,1fr)}
.sidebar{background:var(--red);color:var(--white);padding:22px 15px;position:sticky;top:0;height:100vh;display:flex;flex-direction:column}.brand{padding:3px 10px 20px;border-bottom:1px solid var(--white)}.brand strong{font-size:27px;letter-spacing:.02em}.brand small{display:block;font-size:9px;letter-spacing:.2em;margin-top:4px}.school{padding:18px 10px 13px;font-size:11px;line-height:1.5}.school strong{display:block;font-size:13px}.label{font-size:9px;letter-spacing:.16em;padding:12px 10px 7px;text-transform:uppercase}.nav{display:grid;gap:4px}.nav button{border:1px solid transparent;background:transparent;color:var(--white);text-align:left;padding:11px 12px;border-radius:9px;cursor:pointer;font-size:13px;font-weight:650}.nav button:hover,.nav button.active{background:var(--white);color:var(--red)}.bottom{margin-top:auto;border-top:1px solid var(--white);padding:14px 10px 0}.user{font-size:11px;margin-bottom:10px}.user strong{font-size:12px}.signout{width:100%;border:1px solid var(--white);background:var(--red);color:var(--white);border-radius:8px;padding:9px;cursor:pointer;font-size:12px}.signout:hover{background:var(--white);color:var(--red)}
main{min-width:0}.topbar{height:76px;background:var(--white);border-bottom:1px solid var(--red);display:flex;align-items:center;justify-content:space-between;padding:0 28px;position:sticky;top:0;z-index:5}.top-left{display:flex;align-items:center;gap:12px}.menu{display:none;border:1px solid var(--red);background:var(--white);color:var(--red);border-radius:8px;padding:8px 10px}.title{font-size:19px;font-weight:850}.subtitle{font-size:11px;margin-top:3px}.top-actions{display:flex;align-items:center;gap:8px}.top-action{border:1px solid var(--red);background:var(--white);color:var(--red);border-radius:8px;padding:9px 13px;font-size:12px;font-weight:750;cursor:pointer}.top-action:hover,.top-action.active{background:var(--red);color:var(--white)}.profile{display:flex;align-items:center;gap:9px;margin-left:8px;padding-left:12px;border-left:1px solid var(--red)}.profile-text{text-align:right}.profile-name{font-size:11px;font-weight:800}.profile-role{font-size:9px;margin-top:2px;letter-spacing:.08em}.avatar{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--red);color:var(--white);font-size:12px;font-weight:800}
.content{padding:27px;max-width:1500px;margin:auto}.welcome{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:19px}.eyebrow{font-size:10px;font-weight:850;letter-spacing:.16em}.welcome h1{font-size:29px;margin:5px 0 4px;letter-spacing:-.02em}.welcome p{margin:0;font-size:13px}.date{font-size:11px;border:1px solid var(--red);padding:9px 12px;border-radius:8px}.modules{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}.module{border:1px solid var(--red);background:var(--white);color:var(--red);border-radius:13px;padding:17px;text-align:left;cursor:pointer}.module:hover,.module.active{background:var(--red);color:var(--white)}.module-icon{width:34px;height:34px;border:1px solid currentColor;border-radius:9px;display:grid;place-items:center;font-size:11px;font-weight:900;margin-bottom:13px}.module strong{display:block;font-size:14px}.module small{display:block;font-size:10px;margin-top:5px}.lower{display:grid;grid-template-columns:1.55fr 1fr;gap:14px}.card{border:1px solid var(--red);background:var(--white);border-radius:13px;padding:18px}.card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.card-head h3{margin:0;font-size:14px}.card-head span{font-size:10px}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.stat{border:1px solid var(--red);padding:13px;border-radius:10px}.stat span{display:block;font-size:10px}.stat strong{display:block;font-size:22px;margin-top:6px}.stat small{font-size:9px}.row{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:12px 0;border-bottom:1px solid var(--red);font-size:12px}.row:last-child{border-bottom:0}.tag{font-size:9px;border:1px solid var(--red);border-radius:999px;padding:4px 7px}.quick button{width:100%;border:0;border-bottom:1px solid var(--red);background:transparent;color:var(--red);text-align:left;padding:12px 0;display:flex;justify-content:space-between;cursor:pointer;font-size:12px}.quick button:last-child{border-bottom:0}.ai-card{margin-top:14px;border:1px solid var(--red);background:var(--red);color:var(--white);border-radius:13px;padding:18px;display:flex;justify-content:space-between;align-items:center;gap:18px}.ai-card h3{margin:4px 0;font-size:16px}.ai-card p{margin:0;font-size:11px}.ai-card button{border:1px solid var(--white);background:var(--red);color:var(--white);border-radius:8px;padding:9px 12px;font-size:11px;font-weight:750;cursor:pointer}.ai-card button:hover{background:var(--white);color:var(--red)}.module-page h1{font-size:26px;margin:4px 0}.module-page>p{font-size:12px;margin:0 0 18px}.module-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.module-card{border:1px solid var(--red);background:var(--white);color:var(--red);border-radius:12px;padding:16px;text-align:left;cursor:pointer}.module-card:hover{background:var(--red);color:var(--white)}.module-card strong{font-size:12px}.module-card small{display:block;font-size:10px;margin-top:5px}.toast{position:fixed;right:20px;bottom:20px;background:var(--red);color:var(--white);padding:11px 14px;border-radius:8px;font-size:11px;opacity:0;transform:translateY(8px);transition:.2s}.toast.show{opacity:1;transform:none}
@media(max-width:1050px){.modules{grid-template-columns:repeat(2,1fr)}.lower{grid-template-columns:1fr}.stats{grid-template-columns:repeat(2,1fr)}.module-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:760px){.app{display:block}.sidebar{position:fixed;left:0;top:0;width:265px;z-index:10;transform:translateX(-105%);transition:.2s;box-shadow:10px 0 25px #0002}.sidebar.open{transform:translateX(0)}.menu{display:block}.topbar{padding:0 15px}.top-actions .reports{display:none}.profile-text{display:none}.content{padding:16px}.welcome{align-items:flex-start}.date{display:none}.modules{grid-template-columns:1fr 1fr}.ai-card{align-items:flex-start;flex-direction:column}.module-grid{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.modules{grid-template-columns:1fr}.module-grid{grid-template-columns:1fr}.stats{grid-template-columns:1fr 1fr}.title{font-size:16px}.content{padding:13px}}
`;
document.head.appendChild(style);

document.body.innerHTML = `
<div class="app">
<aside id="sidebar" class="sidebar">
  <div class="brand"><strong>AARIKA</strong><small>SCHOOL MANAGEMENT & LEARNING PLATFORM</small></div>
  <div class="school"><strong>Bal Jyoti Public School</strong>Director workspace</div>
  <div class="label">Core Workspace</div>
  <nav class="nav">
    <button class="nav-item active" data-section="dashboard">Overview</button>
    <button class="nav-item" data-section="academic">Academic</button>
    <button class="nav-item" data-section="admissions">Admissions</button>
    <button class="nav-item" data-section="activity">Activity</button>
    <button class="nav-item" data-section="administration">Administration</button>
  </nav>
  <div class="label">Leadership</div>
  <nav class="nav">
    <button class="nav-item" data-section="reports">Reports</button>
    <button class="nav-item" data-section="ai">AI Intelligence</button>
  </nav>
  <div class="bottom"><div class="user"><strong id="userName">Director</strong><br><span id="userEmail"></span></div><button id="signOut" class="signout">Sign out</button></div>
</aside>
<main><header class="topbar"><div class="top-left"><button id="mobileMenu" class="menu">☰</button><div><div id="pageTitle" class="title">School Overview</div><div id="pageSubtitle" class="subtitle">Academics, admissions, activity and administration</div></div></div><div class="top-actions"><button class="top-action reports" data-section="reports">Reports</button><button class="top-action" data-section="ai">AI</button><div class="profile"><div class="profile-text"><div id="schoolName" class="profile-name">Bal Jyoti Public School</div><div id="role" class="profile-role">SUPER ADMIN</div></div><div id="avatar" class="avatar">D</div></div></div></header><section id="contentArea" class="content"></section></main></div><div id="toast" class="toast"></div>`;

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const content = $("#contentArea");
const toast = $("#toast");

function escapeHtml(value="") { return String(value).replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c])); }
function notify(message){toast.textContent=message;toast.classList.add("show");clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove("show"),2200)}
function setActive(section){$$('.nav-item,.top-action,.module').forEach(el=>el.classList.toggle('active',el.dataset.section===section));}
function bindActions(){
  $$('.nav-item,.top-action,.module,[data-module-item]').forEach(el=>el.addEventListener('click',()=>openSection(el.dataset.section||el.dataset.moduleItem)));
}
function renderHome(){
  content.innerHTML=`<div class="welcome"><div><div class="eyebrow">BAL JYOTI PUBLIC SCHOOL</div><h1>Good morning, ${escapeHtml($("#userName").textContent||"Director")}</h1><p>One leadership view across the four core AARIKA workspaces.</p></div><div class="date">15 August 2026 · Director view</div></div>
  <div class="modules">
    <button class="module" data-section="academic"><span class="module-icon">A</span><strong>Academic</strong><small>Curriculum · timetable · assessment · results</small></button>
    <button class="module" data-section="admissions"><span class="module-icon">↗</span><strong>Admissions</strong><small>Enquiries · applications · onboarding</small></button>
    <button class="module" data-section="activity"><span class="module-icon">✓</span><strong>Activity</strong><small>Attendance · events · tasks · alerts</small></button>
    <button class="module" data-section="administration"><span class="module-icon">▦</span><strong>Administration</strong><small>People · finance · transport · controls</small></button>
  </div>
  <div class="lower"><section class="card"><div class="card-head"><h3>School Snapshot</h3><span>Live data connection ready</span></div><div class="stats"><div class="stat"><span>Students</span><strong>—</strong><small>Enrolled</small></div><div class="stat"><span>Teachers & Staff</span><strong>—</strong><small>Active</small></div><div class="stat"><span>Attendance</span><strong>—</strong><small>Today</small></div><div class="stat"><span>Admissions</span><strong>—</strong><small>Pipeline</small></div></div><div class="card-head" style="margin-top:22px"><h3>Today's Activity</h3><span>Priority view</span></div><div class="row"><span>Attendance & exceptions</span><span class="tag">Ready</span></div><div class="row"><span>Academic / assessment activity</span><span class="tag">Ready</span></div><div class="row"><span>Admissions follow-up</span><span class="tag">Ready</span></div><div class="row"><span>Administration exceptions</span><span class="tag">Ready</span></div></section>
  <section class="card"><div class="card-head"><h3>Leadership</h3><span>Top layer</span></div><div class="quick"><button data-section="reports"><span>Management Reports</span><b>→</b></button><button data-section="reports"><span>MIS & Audit</span><b>→</b></button><button data-section="ai"><span>AI School Brief</span><b>→</b></button><button data-section="ai"><span>Ask AARIKA AI</span><b>→</b></button></div><div class="ai-card"><div><div class="eyebrow" style="color:#fff">AARIKA AI</div><h3>Leadership intelligence</h3><p>AI layer for school performance, risks and exceptions.</p></div><button data-section="ai">Open AI</button></div></section></div>`;
  bindActions();
}
function renderModule(key){
  const m=modules[key];
  content.innerHTML=`<div class="module-page"><div class="eyebrow">AARIKA WORKSPACE</div><h1>${escapeHtml(m.title)}</h1><p>${escapeHtml(m.subtitle)}</p><div class="module-grid">${m.items.map(item=>`<button class="module-card" data-module-item="${key}"><strong>${escapeHtml(item)}</strong><small>Module ready for configuration</small></button>`).join('')}</div></div>`;
  bindActions();
}
function openSection(section){
  setActive(section);
  const meta=modules[section];
  $("#pageTitle").textContent=section==='dashboard'?'School Overview':(meta?.title||'AARIKA');
  $("#pageSubtitle").textContent=section==='dashboard'?'Academics, admissions, activity and administration':(meta?.subtitle||'Leadership workspace');
  $("#sidebar").classList.remove('open');
  if(section==='dashboard') renderHome(); else if(meta) renderModule(section); else renderHome();
}

$("#mobileMenu").addEventListener('click',()=>$("#sidebar").classList.toggle('open'));
$("#signOut").addEventListener('click',async()=>{await signOut(auth);window.location.assign(new URL('index.html',window.location.href).href)});

onAuthStateChanged(auth,user=>{
  if(!user || !user.email?.toLowerCase().endsWith('@baljyoti.com')){
    window.location.replace(new URL('index.html',window.location.href).href);
    return;
  }
  const display=user.displayName||user.email.split('@')[0]||'Director';
  $("#userName").textContent=display;
  $("#userEmail").textContent=user.email;
  $("#schoolName").textContent='Bal Jyoti Public School';
  $("#role").textContent='SUPER ADMIN';
  $("#avatar").textContent=display.charAt(0).toUpperCase();
  renderHome();
});
