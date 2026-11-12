
/* =========================================
   MINDVAULT
   Main application JavaScript
   ========================================= */

"use strict";

/* =========================================
   1. DOM ELEMENTS
========================================= */

const entryScreen = document.getElementById("entryScreen");
const enterButton = document.getElementById("enterButton");

const siteWrapper = document.getElementById("siteWrapper");

const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileNavigation = document.getElementById("mobileNavigation");

const accountButton = document.getElementById("accountButton");
const accountDialog = document.getElementById("accountDialog");
const closeAccountDialog = document.getElementById("closeAccountDialog");

const currentYear = document.getElementById("currentYear");


/* =========================================
   2. ENTRY SCREEN
========================================= */

function enterMindVault() {

  if (!entryScreen || !siteWrapper) {
    return;
  }

  entryScreen.classList.add("entry-exit");

  window.setTimeout(() => {

    entryScreen.hidden = true;
    siteWrapper.hidden = false;

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

  }, 450);

}

if (enterButton) {

  enterButton.addEventListener("click", enterMindVault);

}


/* =========================================
   3. MOBILE NAVIGATION
========================================= */

function closeMobileNavigation() {

  if (!mobileNavigation || !mobileMenuButton) {
    return;
  }

  mobileNavigation.hidden = true;

  mobileMenuButton.setAttribute(
    "aria-expanded",
    "false"
  );

  mobileMenuButton.setAttribute(
    "aria-label",
    "Open navigation menu"
  );

}


function toggleMobileNavigation() {

  if (!mobileNavigation || !mobileMenuButton) {
    return;
  }

  const isOpen = !mobileNavigation.hidden;

  mobileNavigation.hidden = isOpen;

  mobileMenuButton.setAttribute(
    "aria-expanded",
    String(!isOpen)
  );

  mobileMenuButton.setAttribute(
    "aria-label",
    isOpen
      ? "Open navigation menu"
      : "Close navigation menu"
  );

}


if (mobileMenuButton) {

  mobileMenuButton.addEventListener(
    "click",
    toggleMobileNavigation
  );

}


if (mobileNavigation) {

  mobileNavigation
    .querySelectorAll("a")
    .forEach(link => {

      link.addEventListener(
        "click",
        closeMobileNavigation
      );

    });

}


/* =========================================
   4. ACCOUNT DIALOG
========================================= */

function openAccountDialog() {

  if (!accountDialog) {
    return;
  }

  if (typeof accountDialog.showModal === "function") {
    accountDialog.showModal();
  }

}


function closeAccountWindow() {

  if (!accountDialog) {
    return;
  }

  accountDialog.close();

}


if (accountButton) {

  accountButton.addEventListener(
    "click",
    openAccountDialog
  );

}


if (closeAccountDialog) {

  closeAccountDialog.addEventListener(
    "click",
    closeAccountWindow
  );

}


if (accountDialog) {

  accountDialog.addEventListener("click", event => {

    if (event.target === accountDialog) {
      closeAccountWindow();
    }

  });

}


/* =========================================
   5. FOOTER YEAR
========================================= */

if (currentYear) {

  currentYear.textContent = new Date().getFullYear();

}


/* =========================================
   6. SECTION NAVIGATION
========================================= */

const sectionButtons = document.querySelectorAll(
  "[data-section]"
);


sectionButtons.forEach(button => {

  button.addEventListener("click", () => {

    const sectionName = button.dataset.section;

    if (!sectionName) {
      return;
    }

    /*
      These destinations will be connected
      to their dedicated application views
      in later development stages.
    */

    console.info(
      `MindVault section selected: ${sectionName}`
    );

  });

});


/* =========================================
   7. KEYBOARD ACCESSIBILITY
========================================= */

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {

    closeMobileNavigation();

  }

});


/* =========================================
   8. INITIAL STATE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  closeMobileNavigation();

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

});


/* =========================================
   9. APPLICATION STATUS
========================================= */

console.info(
  "MindVault interface initialized."
);

console.info(
  "Backend authentication and database integration are pending."
);
