/* =========================================================
   RAYMOND PATUNGAN — SOFTWARE QA ANALYST PORTFOLIO
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       01. ELEMENT REFERENCES
       ===================================================== */

    const body = document.body;

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const themeLabel = document.getElementById("theme-label");

    const currentYear = document.getElementById("current-year");

    const loginTestButton =
        document.getElementById("login-test-button");

    const testEmail =
        document.getElementById("test-email");

    const testPassword =
        document.getElementById("test-password");

    const testResult =
        document.getElementById("test-result");

    const testCaseContent =
        document.getElementById("test-case-content");


    /* =====================================================
       02. THEME
       ===================================================== */

    const THEME_KEY = "raymondPortfolioTheme";

    function getPreferredTheme() {

        const savedTheme =
            localStorage.getItem(THEME_KEY);

        if (
            savedTheme === "light" ||
            savedTheme === "dark"
        ) {
            return savedTheme;
        }

        return window.matchMedia(
            "(prefers-color-scheme: light)"
        ).matches
            ? "light"
            : "dark";
    }


    function applyTheme(theme) {

        const isLight = theme === "light";

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-pressed",
                String(isLight)
            );

            themeToggle.setAttribute(
                "aria-label",
                isLight
                    ? "Switch to dark theme"
                    : "Switch to light theme"
            );
        }

        if (themeIcon) {
            themeIcon.textContent =
                isLight ? "☾" : "☀";
        }

        if (themeLabel) {
            themeLabel.textContent =
                isLight ? "Dark" : "Light";
        }
    }


    const initialTheme = getPreferredTheme();

    applyTheme(initialTheme);


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                const currentTheme =
                    document.documentElement.getAttribute(
                        "data-theme"
                    ) || "dark";

                const newTheme =
                    currentTheme === "dark"
                        ? "light"
                        : "dark";

                localStorage.setItem(
                    THEME_KEY,
                    newTheme
                );

                applyTheme(newTheme);
            }
        );

    }


    /* =====================================================
       03. MOBILE NAVIGATION
       ===================================================== */

    function closeMenu() {

        if (!navMenu || !menuToggle) {
            return;
        }

        navMenu.classList.remove("open");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        body.classList.remove("menu-open");
    }


    function toggleMenu() {

        if (!navMenu || !menuToggle) {
            return;
        }

        const isOpen =
            navMenu.classList.toggle("open");

        menuToggle.classList.toggle(
            "active",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

        body.classList.toggle(
            "menu-open",
            isOpen
        );
    }


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            toggleMenu
        );

    }


    /* =====================================================
       04. CLOSE MENU WHEN NAV LINK IS CLICKED
       ===================================================== */

    const navLinks =
        document.querySelectorAll(".nav-link");


    navLinks.forEach((link) => {

        link.addEventListener(
            "click",
            () => {
                closeMenu();
            }
        );

    });


    /* =====================================================
       05. CLOSE MENU WHEN CLICKING OUTSIDE
       ===================================================== */

    document.addEventListener(
        "click",
        (event) => {

            if (!navMenu || !menuToggle) {
                return;
            }

            const clickedInsideMenu =
                navMenu.contains(event.target);

            const clickedMenuButton =
                menuToggle.contains(event.target);

            if (
                !clickedInsideMenu &&
                !clickedMenuButton &&
                navMenu.classList.contains("open")
            ) {
                closeMenu();
            }

        }
    );


    /* =====================================================
       06. CLOSE MENU WITH ESCAPE
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                navMenu &&
                navMenu.classList.contains("open")
            ) {
                closeMenu();

                if (menuToggle) {
                    menuToggle.focus();
                }
            }

        }
    );


    /* =====================================================
       07. HANDLE DESKTOP RESIZE
       ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth >= 900 &&
                navMenu &&
                navMenu.classList.contains("open")
            ) {
                closeMenu();
            }

        }
    );


    /* =====================================================
       08. ACTIVE NAVIGATION
       ===================================================== */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const sectionObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const currentId =
                        entry.target.getAttribute("id");

                    navLinks.forEach((link) => {

                        const linkTarget =
                            link.getAttribute("href");

                        link.classList.toggle(
                            "active",
                            linkTarget === `#${currentId}`
                        );

                    });

                });

            },
            {
                rootMargin:
                    "-30% 0px -60% 0px",

                threshold: 0
            }
        );


    sections.forEach((section) => {

        sectionObserver.observe(section);

    });


    /* =====================================================
       09. SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    if (
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach((element) => {

            element.classList.add("visible");

        });

    }


    /* =====================================================
       10. QA LAB — TEST SCENARIOS
       ===================================================== */

    const scenarioButtons =
        document.querySelectorAll(
            ".scenario-button"
        );


    const scenarios = {

        valid: {
            email: "qa@example.com",
            password: "Password123",
            message:
                "PASS — Valid credentials accepted."
        },

        invalid: {
            email: "qa@example.com",
            password: "wrongpassword",
            message:
                "PASS — Invalid credentials rejected."
        },

        empty: {
            email: "",
            password: "",
            message:
                "PASS — Empty required fields detected."
        },

        boundary: {
            email: "a".repeat(100) + "@example.com",
            password: "a".repeat(100),
            message:
                "CHECK — Boundary input requires validation."
        }

    };


    scenarioButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                scenarioButtons.forEach(
                    (item) => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );

                button.classList.add("active");

                const scenarioName =
                    button.dataset.scenario;

                const scenario =
                    scenarios[scenarioName];

                if (!scenario) {
                    return;
                }

                if (testEmail) {
                    testEmail.value =
                        scenario.email;
                }

                if (testPassword) {
                    testPassword.value =
                        scenario.password;
                }

                if (testResult) {

                    testResult.textContent =
                        `Scenario loaded: ${scenario.message}`;

                    testResult.style.color =
                        scenarioName === "boundary"
                            ? "var(--warning)"
                            : "var(--success)";
                }

            }
        );

    });


    /* =====================================================
       11. QA LAB — RUN TEST
       ===================================================== */

    if (loginTestButton) {

        loginTestButton.addEventListener(
            "click",
            () => {

                const email =
                    testEmail
                        ? testEmail.value.trim()
                        : "";

                const password =
                    testPassword
                        ? testPassword.value
                        : "";


                if (!testResult) {
                    return;
                }


                /* Empty fields */

                if (!email || !password) {

                    testResult.textContent =
                        "FAIL — Required fields are empty.";

                    testResult.style.color =
                        "var(--danger)";

                    return;
                }


                /* Basic email validation */

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(email)) {

                    testResult.textContent =
                        "FAIL — Invalid email format.";

                    testResult.style.color =
                        "var(--danger)";

                    return;
                }


                /* Demo login behavior */

                if (
                    email === "qa@example.com" &&
                    password === "Password123"
                ) {

                    testResult.textContent =
                        "PASS — Login successful. Dashboard loaded.";

                    testResult.style.color =
                        "var(--success)";

                    return;
                }


                testResult.textContent =
                    "PASS — Invalid credentials correctly rejected.";

                testResult.style.color =
                    "var(--success)";

            }
        );

    }


    /* =====================================================
       12. TEST CASE TABS
       ===================================================== */

    const testTabs =
        document.querySelectorAll(
            ".test-tab"
        );


    const testCases = {

        positive: {
            title:
                "TC-001 — Successful Login",

            steps: [
                "Open the login page.",
                "Enter a valid registered email.",
                "Enter the correct password.",
                "Click Login."
            ],

            expected:
                "User is authenticated and redirected to the dashboard."
        },


        negative: {
            title:
                "TC-002 — Invalid Password",

            steps: [
                "Open the login page.",
                "Enter a valid registered email.",
                "Enter an incorrect password.",
                "Click Login."
            ],

            expected:
                "Login is rejected and an appropriate error message is displayed."
        },


        boundary: {
            title:
                "TC-003 — Maximum Input Length",

            steps: [
                "Open the login page.",
                "Enter the maximum supported email length.",
                "Enter the maximum supported password length.",
                "Submit the form."
            ],

            expected:
                "The application handles maximum-length input without layout, validation, or processing errors."
        }

    };


    function renderTestCase(type) {

        if (!testCaseContent) {
            return;
        }

        const testCase =
            testCases[type];

        if (!testCase) {
            return;
        }


        const stepsHTML =
            testCase.steps
                .map(
                    (step, index) =>
                        `<li>
                            <span>${index + 1}</span>
                            ${step}
                        </li>`
                )
                .join("");


        testCaseContent.innerHTML = `
            <div class="test-case-details">

                <span class="mini-label">
                    TEST CASE
                </span>

                <h3>
                    ${testCase.title}
                </h3>

                <ol class="test-case-steps">
                    ${stepsHTML}
                </ol>

                <div class="test-case-expected">

                    <span class="bug-label">
                        EXPECTED RESULT
                    </span>

                    <p>
                        ${testCase.expected}
                    </p>

                </div>

            </div>
        `;
    }


    testTabs.forEach((tab) => {

        tab.addEventListener(
            "click",
            () => {

                testTabs.forEach(
                    (item) => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );

                tab.classList.add("active");

                renderTestCase(
                    tab.dataset.tab
                );

            }
        );

    });


    /* =====================================================
       13. QA DASHBOARD COUNTERS
       ===================================================== */

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );


    function animateCounter(element) {

        const target =
            Number(
                element.dataset.counter
            );


        if (
            !Number.isFinite(target) ||
            target < 0
        ) {
            return;
        }


        const duration = 1000;
        const startTime = performance.now();


        function updateCounter(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /*
             * Ease-out animation.
             */

            const easedProgress =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const currentValue =
                Math.round(
                    target * easedProgress
                );


            element.textContent =
                currentValue.toLocaleString();


            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            }

        }


        requestAnimationFrame(
            updateCounter
        );
    }


    if (counters.length > 0) {

        const counterObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        animateCounter(
                            entry.target
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.4
                }
            );


        counters.forEach((counter) => {

            counterObserver.observe(counter);

        });

    }


    /* =====================================================
       14. CURRENT YEAR
       ===================================================== */

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       15. INITIAL TEST CASE
       ===================================================== */

    renderTestCase("positive");


    /* =====================================================
       16. SAFETY CHECK — MOBILE MENU
       ===================================================== */

    /*
     * If the page is loaded directly on desktop,
     * make sure the mobile menu cannot remain locked
     * in an unexpected state.
     */

    if (
        window.innerWidth >= 900
    ) {
        closeMenu();
    }

});