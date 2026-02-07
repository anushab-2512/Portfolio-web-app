/**
 * Landing page: Login / Register with client-side validation
 */

function $(id) {
  return document.getElementById(id);
}

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function setView(tab) {
  const loginPanel = $("panel-login");
  const registerPanel = $("panel-register");
  if (tab === "login") {
    loginPanel.hidden = false;
    registerPanel.hidden = true;
  } else {
    loginPanel.hidden = true;
    registerPanel.hidden = false;
  }
  clearAllFieldErrors();
  hideMessage("login-message");
  hideMessage("register-message");
}

function showFieldError(id, msg) {
  const el = $(id);
  if (el) {
    el.textContent = msg;
    el.style.display = msg ? "block" : "none";
  }
}

function clearFieldError(id) {
  showFieldError(id, "");
}

function clearAllFieldErrors() {
  ["login-email-error", "login-password-error", "register-email-error", "register-password-error", "register-confirm-error"].forEach(clearFieldError);
}

function hideMessage(elId) {
  const el = $(elId);
  el.style.display = "none";
  el.classList.remove("success", "error");
  el.textContent = "";
}

function showMessage(elId, kind, text) {
  const el = $(elId);
  el.style.display = "block";
  el.classList.remove("success", "error");
  el.classList.add(kind);
  el.textContent = text;
}

function validateLogin() {
  const email = $("login-email").value.trim();
  const password = $("login-password").value;
  let ok = true;

  clearFieldError("login-email-error");
  clearFieldError("login-password-error");

  if (!email) {
    showFieldError("login-email-error", "Email required");
    ok = false;
  } else if (!EMAIL_REGEX.test(email)) {
    showFieldError("login-email-error", "Invalid email");
    ok = false;
  }
  if (!password) {
    showFieldError("login-password-error", "Password required");
    ok = false;
  }
  return ok;
}

function validatePassword(pw) {
  if (pw.length < 8) return "Min 8 characters";
  if (!/[A-Z]/.test(pw)) return "Add uppercase letter";
  if (!/[a-z]/.test(pw)) return "Add lowercase letter";
  if (!/\d/.test(pw)) return "Add digit";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Add special character";
  return null;
}

function validateRegister() {
  const email = $("register-email").value.trim();
  const password = $("register-password").value;
  const confirm = $("register-confirm").value;
  let ok = true;

  clearFieldError("register-email-error");
  clearFieldError("register-password-error");
  clearFieldError("register-confirm-error");

  if (!email) {
    showFieldError("register-email-error", "Email required");
    ok = false;
  } else if (!EMAIL_REGEX.test(email)) {
    showFieldError("register-email-error", "Invalid email");
    ok = false;
  }

  const pwErr = validatePassword(password);
  if (pwErr) {
    showFieldError("register-password-error", pwErr);
    ok = false;
  }

  if (password !== confirm) {
    showFieldError("register-confirm-error", "Passwords do not match");
    ok = false;
  }
  return ok;
}

function getBackendError(data) {
  if (!data) return "Request failed.";
  const d = data.detail ?? data;
  if (typeof d === "string") return d;
  if (d && typeof d === "object") {
    const msg = d.message || "Request failed.";
    const issues = Array.isArray(d.issues) ? d.issues : [];
    return issues.length ? `${msg} ${issues.join(" ")}`.trim() : msg;
  }
  return "Request failed.";
}

async function postJson(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { ok: res.ok, data };
}

document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("twenty20:user");

  $("go-register").addEventListener("click", () => setView("register"));
  $("go-login").addEventListener("click", () => setView("login"));

  $("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    hideMessage("login-message");

    const email = $("login-email").value.trim();
    const password = $("login-password").value;
    const btn = $("login-submit");
    btn.disabled = true;
    btn.textContent = "Please wait...";

    try {
      const { ok, data } = await postJson("/api/login", { email, password });
      if (!ok) {
        showMessage("login-message", "error", getBackendError(data));
        return;
      }
      localStorage.setItem("twenty20:user", JSON.stringify(data.user));
      window.location.href = "/portfolio";
    } catch {
      showMessage("login-message", "error", "Network error.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Login";
    }
  });

  $("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    hideMessage("register-message");

    const email = $("register-email").value.trim();
    const password = $("register-password").value;
    const confirm_password = $("register-confirm").value;
    const btn = $("register-submit");
    btn.disabled = true;
    btn.textContent = "Please wait...";

    try {
      const { ok, data } = await postJson("/api/register", { email, password, confirm_password });
      if (!ok) {
        showMessage("register-message", "error", getBackendError(data));
        return;
      }
      showMessage("register-message", "success", data.message || "Registration successful.");
      setTimeout(() => {
        setView("login");
        $("login-email").value = email;
        $("login-password").value = password;
        $("login-password").focus();
      }, 800);
    } catch {
      showMessage("register-message", "error", "Network error.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Register";
    }
  });

  // Password visibility toggle
  document.querySelectorAll(".password-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const input = $(targetId);
      const eyeIcon = btn.querySelector(".eye-icon");
      const eyeOffIcon = btn.querySelector(".eye-off-icon");

      if (input.type === "password") {
        input.type = "text";
        eyeIcon.style.display = "none";
        eyeOffIcon.style.display = "block";
      } else {
        input.type = "password";
        eyeIcon.style.display = "block";
        eyeOffIcon.style.display = "none";
      }
    });
  });
});
