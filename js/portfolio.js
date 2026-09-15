/* =========================================================
   RAYMOND PATUNGAN — PORTFOLIO INTERACTIONS
   ========================================================= */


/* ================= MOBILE NAVIGATION ================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-menu a");

function toggleMenu() {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
}

if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
}

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    });
});


/* ================= HEADER ON SCROLL ================= */

const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}, { passive: true });


/* ================= SCROLL REVEAL ================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(element => {
    revealObserver.observe(element);
});


/* ================= ACTIVE NAVIGATION ================= */

const sections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(".nav-menu a");

const sectionObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {

            if (entry.isIntersecting) {

                navigationLinks.forEach(link => {
                    link.classList.remove("active");

                    if (link.getAttribute("href") === `#${entry.target.id}`) {
                        link.classList.add("active");
                    }
                });

            }

        });
    },
    {
        rootMargin: "-30% 0px -60% 0px"
    }
);

sections.forEach(section => {
    sectionObserver.observe(section);
});


/* ================= QA LAB SCENARIOS ================= */

const scenarios = {

    valid: {
        title: "Valid Login",
        result: "PASS",
        precondition: "Registered user account exists.",
        action: "Enter valid username and password.",
        expected: "User is authenticated and redirected to dashboard."
    },

    invalid: {
        title: "Invalid Password",
        result: "PASS",
        precondition: "Registered user account exists.",
        action: "Enter valid username with an incorrect password.",
        expected: "Login is rejected and an appropriate error message is displayed."
    },

    empty: {
        title: "Empty Credentials",
        result: "PASS",
        precondition: "Login page is accessible.",
        action: "Submit the login form without entering credentials.",
        expected: "Required-field validation messages are displayed."
    },

    boundary: {
        title: "Boundary Input",
        result: "PASS",
        precondition: "Username field has a defined maximum length.",
        action: "Enter input at and beyond the allowed boundary.",
        expected: "The application correctly handles the boundary condition."
    }

};


const scenarioButtons = document.querySelectorAll(".scenario-btn");

const scenarioTitle = document.getElementById("scenarioTitle");
const scenarioResult = document.getElementById("scenarioResult");
const scenarioPrecondition = document.getElementById("scenarioPrecondition");
const scenarioAction = document.getElementById("scenarioAction");
const scenarioExpected = document.getElementById("scenarioExpected");
const scenarioFooter = document.getElementById("scenarioFooter");


scenarioButtons.forEach(button => {

    button.addEventListener("click", () => {

        const scenarioName = button.dataset.scenario;
        const scenario = scenarios[scenarioName];

        if (!scenario) return;

        scenarioButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        scenarioTitle.textContent = scenario.title;
        scenarioResult.textContent = scenario.result;
        scenarioFooter.textContent = scenario.result;

        scenarioPrecondition.textContent = scenario.precondition;
        scenarioAction.textContent = scenario.action;
        scenarioExpected.textContent = scenario.expected;

    });

});


/* ================= TEST CASE TABS ================= */

const testCases = {

    functional: {
        title: "Verify successful login with valid credentials",
        precondition: "A registered user account exists.",
        steps: "1. Open login page.<br>2. Enter valid username.<br>3. Enter valid password.<br>4. Click Login.",
        expected: "User is successfully authenticated and redirected to the dashboard."
    },

    negative: {
        title: "Verify login rejection with invalid credentials",
        precondition: "Login page is accessible.",
        steps: "1. Open login page.<br>2. Enter valid username.<br>3. Enter invalid password.<br>4. Click Login.",
        expected: "Login is rejected and a clear error message is displayed."
    },

    boundary: {
        title: "Verify maximum username input length",
        precondition: "Username field has a defined maximum length.",
        steps: "1. Open login page.<br>2. Enter maximum allowed characters.<br>3. Enter one additional character.",
        expected: "Input is handled according to the defined boundary requirement."
    },

    regression: {
        title: "Verify login after authentication-related changes",
        precondition: "A new application build is available.",
        steps: "1. Execute existing login regression tests.<br>2. Validate successful login.<br>3. Validate negative scenarios.<br>4. Record results.",
        expected: "Existing login functionality continues to behave as expected."
    }

};


const testTabs = document.querySelectorAll(".test-tab");

const testCaseTitle = document.getElementById("testCaseTitle");
const testCasePrecondition = document.getElementById("testCasePrecondition");
const testCaseSteps = document.getElementById("testCaseSteps");
const testCaseExpected = document.getElementById("testCaseExpected");


testTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        const testName = tab.dataset.tab;
        const test = testCases[testName];

        if (!test) return;

        testTabs.forEach(item => {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        testCaseTitle.textContent = test.title;
        testCasePrecondition.textContent = test.precondition;
        testCaseSteps.innerHTML = test.steps;
        testCaseExpected.textContent = test.expected;

    });

});


/* ================= DASHBOARD COUNTERS ================= */

const counters = document.querySelectorAll("[data-count]");
let countersStarted = false;

function animateCounters() {

    if (countersStarted) return;

    countersStarted = true;

    counters.forEach(counter => {

        const target = Number(counter.dataset.count);
        const duration = 900;
        const startTime = performance.now();

        function updateCounter(currentTime) {

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = 1 - Math.pow(1 - progress, 3);

            counter.textContent =
                Math.floor(target * easedProgress);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);

    });
}


const dashboard = document.querySelector(".dashboard");

if (dashboard) {

    const dashboardObserver = new IntersectionObserver(
        entries => {

            if (entries[0].isIntersecting) {
                animateCounters();
                dashboardObserver.disconnect();
            }

        },
        {
            threshold: 0.25
        }
    );

    dashboardObserver.observe(dashboard);

}


/* ================= CURRENT YEAR ================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* ================= KEYBOARD ESCAPE ================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        navMenu.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");

    }

});
