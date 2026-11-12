
"use strict";

/*
  MINDVAULT ADMIN PANEL

  Security rules:
  1. Never store admin passwords in frontend code.
  2. Never authorize an admin using a browser-side email comparison.
  3. The backend must authenticate the user and verify admin permissions.
  4. The dashboard must remain inaccessible until the backend confirms
     an authorized admin session.

  Backend endpoints to implement:
  POST /api/admin/login
  GET  /api/admin/session
  POST /api/admin/logout
*/

const ADMIN_CONFIG = {
  loginEndpoint: "/api/admin/login",
  sessionEndpoint: "/api/admin/session",
  logoutEndpoint: "/api/admin/logout"
};

document.addEventListener("DOMContentLoaded", () => {
  initializeAdminLogin();
  initializeDashboardNavigation();
  initializeMobileSidebar();
  initializeLogout();
  checkAdminSession();
});

/* ----------------------------------
   ELEMENT HELPERS
---------------------------------- */

function getElement(id) {
  return document.getElementById(id);
}

function showAdminMessage(element, message, type = "") {
  if (!element) return;

  element.textContent = message;
  element.className = "admin-message";

  if (type) {
    element.classList.add(type);
  }
}

/* ----------------------------------
   ADMIN LOGIN
---------------------------------- */

function initializeAdminLogin() {
  const loginForm = getElement("adminLoginForm");
  const loginMessage = getElement("adminLoginMessage");
  const loginButton = getElement("adminLoginButton");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    /*
      The login endpoint does not exist yet.
      Do not simulate authentication or expose the dashboard.
    */

    showAdminMessage(
      loginMessage,
      "Admin authentication is not connected yet. Dashboard access is disabled until secure backend authentication and admin-role verification are configured.",
      "error"
    );

    if (loginButton) {
      loginButton.disabled = true;
      loginButton.textContent = "Authentication unavailable";

      window.setTimeout(() => {
        loginButton.disabled = false;
        loginButton.textContent = "Sign in";
      }, 2500);
    }
  });
}

/* ----------------------------------
   SERVER-VERIFIED SESSION
---------------------------------- */

async function checkAdminSession() {
  const dashboard = getElement("adminDashboard");
  const loginPage = getElement("adminLoginPage");

  /*
    Always start with the dashboard hidden.
    Only a future verified backend response may authorize access.
  */

  if (dashboard) {
    dashboard.hidden = true;
  }

  if (loginPage) {
    loginPage.hidden = false;
  }

  /*
    Session verification is intentionally not enabled yet.

    Once the backend exists, it must:
    - Validate the secure session cookie.
    - Confirm the user is authenticated.
    - Verify the user's admin role.
    - Return only the minimum session information required.

    Do not replace this with a localStorage flag or a client-side
    email/password check.
  */

  return false;
}

/* ----------------------------------
   DASHBOARD NAVIGATION
---------------------------------- */

function initializeDashboardNavigation() {
  const navigationItems = document.querySelectorAll(
    "[data-panel-target]"
  );

  const panels = document.querySelectorAll("[data-panel]");

  navigationItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();

      /*
        Navigation is only available after the dashboard has
        legitimately been made visible by a verified backend.
      */

      const dashboard = getElement("adminDashboard");

      if (!dashboard || dashboard.hidden) {
        return;
      }

      const target = item.dataset.panelTarget;

      if (!target) return;

      const targetPanel = document.querySelector(
        `[data-panel="${CSS.escape(target)}"]`
      );

      if (!targetPanel) return;

      panels.forEach((panel) => {
        panel.classList.remove("active");
        panel.hidden = true;
      });

      navigationItems.forEach((navItem) => {
        navItem.classList.remove("active");
        navItem.removeAttribute("aria-current");
      });

      targetPanel.hidden = false;
      targetPanel.classList.add("active");

      item.classList.add("active");
      item.setAttribute("aria-current", "page");

      closeMobileSidebar();
    });
  });
}

/* ----------------------------------
   MOBILE SIDEBAR
---------------------------------- */

function initializeMobileSidebar() {
  const toggle = getElement("adminMobileToggle");
  const sidebar = document.querySelector(".admin-sidebar");

  if (!toggle || !sidebar) return;

  toggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  document.addEventListener("click", (event) => {
    if (
      sidebar.classList.contains("open") &&
      !sidebar.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      closeMobileSidebar();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileSidebar();
    }
  });
}

function closeMobileSidebar() {
  const sidebar = document.querySelector(".admin-sidebar");
  const toggle = getElement("adminMobileToggle");

  if (sidebar) {
    sidebar.classList.remove("open");
  }

  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
  }
}

/* ----------------------------------
   LOGOUT
---------------------------------- */

function initializeLogout() {
  const logoutButton = getElement("adminLogoutButton");

  if (!logoutButton) return;

  logoutButton.addEventListener("click", async () => {
    /*
      Logout must invalidate the server-side session.
      Clearing browser storage alone is not sufficient.
    */

    logoutButton.disabled = true;

    try {
      const response = await fetch(
        ADMIN_CONFIG.logoutEndpoint,
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Server logout was unsuccessful.");
      }

      window.location.replace("admin.html");
    } catch (error) {
      console.error("Admin logout error:", error);

      logoutButton.disabled = false;

      window.alert(
        "Logout could not be verified by the server. Please try again."
      );
    }
  });
}
