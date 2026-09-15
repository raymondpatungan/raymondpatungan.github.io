/* =========================================================
   RAYMOND PATUNGAN — QA / ENGINEERING PORTFOLIO
   Portfolio JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       01. DOM REFERENCES
       ===================================================== */

    const html = document.documentElement;
    const body = document.body;

    const themeToggle = document.getElementById("theme-toggle");

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    const backToTop = document.getElementById("back-to-top");

    const cvLink = document.getElementById("cv-link");

    const currentYear = document.getElementById("current-year");

    const testEmail = document.getElementById("test-email");
    const testPassword = document.getElementById("test-password");
    const runTestButton = document.getElementById("run-test");
    const testResult = document.getElementById("test-result");

    const testTypeOptions = document.querySelectorAll(
        'input[name="test-type"]'
    );

    const testCaseTabs = document.querySelectorAll(".test-case-tab");
    const testCaseContent = document.getElementById("test-case-content");

    const dashboardCounters = document.querySelectorAll(
        "[data-counter]"
    );


    /* =====================================================
       02. THEME
       ===================================================== */

    const THEME_KEY = "raymondPortfolioTheme";

    function getPreferredTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);

        if (savedTheme === "dark" || savedTheme === "light") {
            return savedTheme;
        }

        return window.matchMedia("(prefers-color-scheme: light)").matches
            ? "light"
            : "dark";
    }

    function updateThemeButton(theme) {
        if (!themeToggle) {
            return;
        }

        const isLight = theme === "light";

        themeToggle.setAttribute(
            "aria-label",
            isLight
                ? "Switch to dark theme"
                : "Switch to light theme"
        );

        themeToggle.setAttribute(
            "title",
            isLight
                ? "Switch to dark theme"
                : "Switch to light theme"
        );

        themeToggle.setAttribute(
            "aria-pressed",
            String(isLight)
        );
    }

    function applyTheme(theme, save = true) {
        const validTheme =
            theme === "light" || theme === "dark"
                ? theme
                : "dark";

        html.setAttribute("data-theme", validTheme);

        updateThemeButton(validTheme);

        if (save) {
            localStorage.setItem(THEME_KEY, validTheme);
        }
    }

    applyTheme(getPreferredTheme(), false);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme =
                html.getAttribute("data-theme") || "dark";

            const nextTheme =
                currentTheme === "dark"
                    ? "light"
                    : "dark";

            applyTheme(nextTheme);
        });
    }


    /* =====================================================
       03. MOBILE NAVIGATION
       ===================================================== */

    function setMenuState(isOpen) {
        if (!navMenu || !menuToggle) {
            return;
        }

        navMenu.classList.toggle("open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));

        body.classList.toggle("menu-open", isOpen);
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.contains("open");

            setMenuState(!isOpen);
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                setMenuState(false);
            });
        });

        document.addEventListener("click", (event) => {
            const clickedInsideMenu =
                navMenu.contains(event.target);

            const clickedMenuButton =
                menuToggle.contains(event.target);

            if (
                navMenu.classList.contains("open") &&
                !clickedInsideMenu &&
                !clickedMenuButton
            ) {
                setMenuState(false);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setMenuState(false);
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth >= 900) {
                setMenuState(false);
            }
        });
    }


    /* =====================================================
       04. ACTIVE NAVIGATION
       ===================================================== */

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    if ("IntersectionObserver" in window && sections.length) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const currentId = entry.target.id;

                    navLinks.forEach((link) => {
                        const linkTarget =
                            link.getAttribute("href");

                        const isActive =
                            linkTarget === `#${currentId}`;

                        link.classList.toggle(
                            "active",
                            isActive
                        );
                    });
                });
            },
            {
                rootMargin: "-30% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }


    /* =====================================================
       05. SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if (
        "IntersectionObserver" in window &&
        revealElements.length
    ) {
        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
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
       06. QA LAB — TEST DATA
       ===================================================== */

    const validEmail = "qa@example.com";
    const validPassword = "Password123";

    const MAX_INPUT_LENGTH = 100;

    function showTestResult(message, status) {
        if (!testResult) {
            return;
        }

        testResult.textContent = message;

        testResult.classList.remove(
            "pass",
            "fail"
        );

        if (status === "pass") {
            testResult.classList.add("pass");
        }

        if (status === "fail") {
            testResult.classList.add("fail");
        }
    }

    function getSelectedTestType() {
        const selected =
            document.querySelector(
                'input[name="test-type"]:checked'
            );

        return selected
            ? selected.value
            : "valid";
    }

    function runQaTest() {
        if (!testEmail || !testPassword) {
            return;
        }

        const email = testEmail.value.trim();
        const password = testPassword.value;

        const testType = getSelectedTestType();

        /* -----------------------------------------------
           EMPTY FIELD TEST
           ----------------------------------------------- */

        if (testType === "empty") {
            if (!email || !password) {
                showTestResult(
                    "PASS — Empty required fields were correctly rejected.",
                    "pass"
                );
            } else {
                showTestResult(
                    "FAIL — Empty-field validation did not trigger.",
                    "fail"
                );
            }

            return;
        }


        /* -----------------------------------------------
           BOUNDARY TEST
           ----------------------------------------------- */

        if (testType === "boundary") {
            const exceedsLimit =
                email.length > MAX_INPUT_LENGTH ||
                password.length > MAX_INPUT_LENGTH;

            if (exceedsLimit) {
                showTestResult(
                    `PASS — Input exceeding ${MAX_INPUT_LENGTH} characters was correctly rejected.`,
                    "pass"
                );
            } else {
                showTestResult(
                    `FAIL — Boundary test requires input longer than ${MAX_INPUT_LENGTH} characters.`,
                    "fail"
                );
            }

            return;
        }


        /* -----------------------------------------------
           EMAIL FORMAT VALIDATION
           ----------------------------------------------- */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !password) {
            showTestResult(
                "FAIL — Email and password are required.",
                "fail"
            );

            return;
        }

        if (!emailPattern.test(email)) {
            showTestResult(
                "FAIL — Invalid email format.",
                "fail"
            );

            return;
        }


        /* -----------------------------------------------
           VALID LOGIN TEST
           ----------------------------------------------- */

        if (testType === "valid") {
            if (
                email === validEmail &&
                password === validPassword
            ) {
                showTestResult(
                    "PASS — Valid credentials accepted.",
                    "pass"
                );
            } else {
                showTestResult(
                    "FAIL — Valid credential test did not authenticate.",
                    "fail"
                );
            }

            return;
        }


        /* -----------------------------------------------
           INVALID LOGIN TEST
           ----------------------------------------------- */

        if (testType === "invalid") {
            const credentialsAreValid =
                email === validEmail &&
                password === validPassword;

            if (!credentialsAreValid) {
                showTestResult(
                    "PASS — Invalid credentials correctly rejected.",
                    "pass"
                );
            } else {
                showTestResult(
                    "FAIL — Invalid credential test used valid credentials.",
                    "fail"
                );
            }
        }
    }

    if (runTestButton) {
        runTestButton.addEventListener(
            "click",
            runQaTest
        );
    }

    if (testTypeOptions.length) {
        testTypeOptions.forEach((option) => {
            option.addEventListener("change", () => {
                showTestResult(
                    "Ready — configure the test data and run the test.",
                    ""
                );
            });
        });
    }


    /* =====================================================
       07. QA LAB — INPUT SAFETY
       ===================================================== */

    function enforceInputLimit(input) {
        if (!input) {
            return;
        }

        input.addEventListener("input", () => {
            if (input.value.length > MAX_INPUT_LENGTH) {
                input.value =
                    input.value.slice(
                        0,
                        MAX_INPUT_LENGTH
                    );
            }
        });
    }

    enforceInputLimit(testEmail);
    enforceInputLimit(testPassword);


    /* =====================================================
       08. TEST CASES
       ===================================================== */

    const testCases = {
        positive: {
            title: "TC-001 — Successful Login",
            description:
                "Verify that a user can log in using valid credentials.",
            steps: [
                "Open the login page.",
                "Enter a valid email address.",
                "Enter the correct password.",
                "Click the Login button.",
                "Verify that the user is authenticated successfully."
            ]
        },

        negative: {
            title: "TC-002 — Invalid Password",
            description:
                "Verify that login is rejected when an incorrect password is provided.",
            steps: [
                "Open the login page.",
                "Enter a registered email address.",
                "Enter an incorrect password.",
                "Click the Login button.",
                "Verify that an appropriate authentication error is displayed."
            ]
        },

        boundary: {
            title: "TC-003 — Maximum Input Length",
            description:
                "Verify that input fields correctly handle the defined maximum length.",
            steps: [
                "Open the login page.",
                "Enter a value at the maximum allowed length.",
                "Verify that the value is accepted.",
                "Enter a value exceeding the maximum allowed length.",
                "Verify that the excess input is rejected or prevented."
            ]
        }
    };

    function renderTestCase(type) {
        if (!testCaseContent) {
            return;
        }

        const testCase =
            testCases[type] || testCases.positive;

        const stepsHtml = testCase.steps
            .map(
                (step, index) => `
                    <li>
                        <span aria-hidden="true">
                            ${index + 1}
                        </span>
                        <p>${step}</p>
                    </li>
                `
            )
            .join("");

        testCaseContent.innerHTML = `
            <h3>${testCase.title}</h3>
            <p>${testCase.description}</p>

            <ol class="test-case-steps">
                ${stepsHtml}
            </ol>
        `;
    }

    if (testCaseTabs.length) {
        testCaseTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const type =
                    tab.dataset.testCase;

                testCaseTabs.forEach((item) => {
                    item.classList.toggle(
                        "active",
                        item === tab
                    );

                    item.setAttribute(
                        "aria-selected",
                        String(item === tab)
                    );
                });

                renderTestCase(type);
            });
        });
    }

    renderTestCase("positive");


    /* =====================================================
       09. DASHBOARD COUNTERS
       ===================================================== */

    function animateCounter(element) {
        const target = Number(
            element.dataset.counter
        );

        if (!Number.isFinite(target)) {
            return;
        }

        const duration = 900;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed =
                currentTime - startTime;

            const progress = Math.min(
                elapsed / duration,
                1
            );

            const easedProgress =
                1 - Math.pow(1 - progress, 3);

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

        requestAnimationFrame(updateCounter);
    }

    if (
        "IntersectionObserver" in window &&
        dashboardCounters.length
    ) {
        let dashboardAnimated = false;

        const dashboardObserver =
            new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (
                            !entry.isIntersecting ||
                            dashboardAnimated
                        ) {
                            return;
                        }

                        dashboardAnimated = true;

                        dashboardCounters.forEach(
                            (counter) => {
                                animateCounter(
                                    counter
                                );
                            }
                        );

                        observer.disconnect();
                    });
                },
                {
                    threshold: 0.25
                }
            );

        const dashboard =
            document.querySelector(".dashboard");

        if (dashboard) {
            dashboardObserver.observe(
                dashboard
            );
        }
    } else {
        dashboardCounters.forEach(
            (counter) => {
                const value =
                    Number(
                        counter.dataset.counter
                    );

                if (Number.isFinite(value)) {
                    counter.textContent =
                        value.toLocaleString();
                }
            }
        );
    }


    /* =====================================================
       10. BACK TO TOP
       ===================================================== */

    function updateBackToTop() {
        if (!backToTop) {
            return;
        }

        const shouldShow =
            window.scrollY > 500;

        backToTop.classList.toggle(
            "visible",
            shouldShow
        );
    }

    if (backToTop) {
        window.addEventListener(
            "scroll",
            updateBackToTop,
            { passive: true }
        );

        backToTop.addEventListener(
            "click",
            () => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );

        updateBackToTop();
    }


    /* =====================================================
       11. CV LINK
       ===================================================== */

    if (cvLink) {
        cvLink.addEventListener("click", (event) => {
            const href =
                cvLink.getAttribute("href");

            /*
             * Prevent an empty placeholder link from
             * jumping to the top of the page.
             *
             * Replace href="#" in index.html with the
             * actual CV file path when the CV is uploaded.
             */

            if (
                !href ||
                href === "#"
            ) {
                event.preventDefault();
            }
        });
    }


    /* =====================================================
       12. CURRENT YEAR
       ===================================================== */

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       13. INITIAL MOBILE NAV SAFETY
       ===================================================== */

    if (window.innerWidth >= 900) {
        setMenuState(false);
    }


    /* =====================================================
       14. INITIAL QA LAB STATE
       ===================================================== */

    if (testResult) {
        showTestResult(
            "Ready — select a test scenario and run the test.",
            ""
        );
    }
});