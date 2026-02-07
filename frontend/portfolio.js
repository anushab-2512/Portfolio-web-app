/**
 * Portfolio page: user icon dropdown, no email in main content
 */

function $(id) {
  return document.getElementById(id);
}

function getUser() {
  try {
    const raw = localStorage.getItem("twenty20:user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function chip(text) {
  const el = document.createElement("span");
  el.className = "chip";
  el.textContent = text;
  return el;
}

function projectCard(title, points) {
  const el = document.createElement("div");
  el.className = "project";
  const strong = document.createElement("strong");
  strong.textContent = title;
  el.appendChild(strong);
  const ul = document.createElement("ul");
  ul.className = "project-points";
  points.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  });
  el.appendChild(ul);
  return el;
}

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();
  if (!user || !user.email || !user.username) {
    window.location.href = "/";
    return;
  }

  $("username").textContent = "Anusha B";
  $("dropdown-email").textContent = user.email;

  $("about").textContent =
    "Aspiring Software Engineer with strong foundations in programming, data structures, and databases. " +
    "Passionate about building scalable web applications and applying problem-solving skills in real-world projects.";

  const skills = [
    "Frontend: HTML, CSS, JavaScript",
    "Backend: Python, FastAPI, MySQL",
    "ML & Data: NumPy, Pandas, Machine Learning",
    "Core CS: Data Structures & Algorithms, DBMS, Operating Systems, SDLC",
  ];
  const skillsWrap = $("skills");
  skills.forEach((s) => skillsWrap.appendChild(chip(s)));

  const projects = $("projects");
  projects.appendChild(
    projectCard("Blood Bank Management System", [
      "Desktop application to manage blood donors and blood stock efficiently.",
      "Supports donor registration, updating details, viewing all records, and managing blood availability by group.",
      "Backed by a MySQL database with secure storage and retrieval using JDBC connectivity.",
    ])
  );
  projects.appendChild(
    projectCard("Multiple Disease Prediction", [
      "Web-based health prediction system for Diabetes, Heart Disease, and Parkinson's Disease.",
      "Uses machine-learning models trained on real-world healthcare datasets.",
      "Designed to support early disease risk detection in low-resource healthcare settings.",
    ])
  );

  const icon = $("user-icon");
  const dropdown = $("user-dropdown");

  icon.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = !dropdown.hidden;
    dropdown.hidden = open;
    icon.setAttribute("aria-expanded", !open);
  });

  document.addEventListener("click", () => {
    dropdown.hidden = true;
    icon.setAttribute("aria-expanded", "false");
  });

  $("logout").addEventListener("click", (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("twenty20:user");
    window.location.href = "/";
  });
});
