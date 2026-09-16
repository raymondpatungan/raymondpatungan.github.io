document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       DOM REFERENCES
    ========================================================= */

    const html = document.documentElement;
    const body = document.body;

    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const themeLabel = document.getElementById("theme-label");

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    const backToTopButton =
        document.getElementById("back-to-top");

    const currentYear =
        document.getElementById("current-year");

    const testEmail =
        document.getElementById("test-email");

    const testPassword =
        document.getElementById("test-password");

    const loginTestButton =
        document.getElementById("login-test-button");

    const testResult =
        document.getElementById("test-result");

    const scenarioButtons =
        document.querySelectorAll(".scenario-button");

    const testCaseTabs =
        document.querySelectorAll(".test-tab");

    const testCaseContent =
        document.getElementById("test-case-content");

    const dashboardCounters =
        document.querySelectorAll("[data-counter]");


    /* =========================================================
       THEME
    ========================================================= */

    const THEME_KEY = "raymondPortfolioTheme";

    function getPreferredTheme() {

        const savedTheme =
            localStorage.getItem(THEME_KEY);

        if (
            savedTheme === "dark" ||
            savedTheme === "light"
        ) {
            return savedTheme;
        }

        return window.matchMedia(
            "(prefers-color-scheme: light)"
        ).matches
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
            "aria-pressed",
            String(isLight)
        );

        if (themeIcon) {
            themeIcon.textContent =
                isLight ? "☾" : "☀";
        }

        if (themeLabel) {
            themeLabel.textContent =
                isLight ? "Dark" : "Light";
        }
    }


    function applyTheme(theme, save = true) {

        const validTheme =
            theme === "light" ||
            theme === "dark"
                ? theme
                : "dark";

        html.setAttribute(
            "data-theme",
            validTheme
        );

        updateThemeButton(validTheme);

        if (save) {
            localStorage.setItem(
                THEME_KEY,
                validTheme
            );
        }
    }


    applyTheme(
        getPreferredTheme(),
        false
    );


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                const currentTheme =
                    html.getAttribute("data-theme") ||
                    "dark";

                const nextTheme =
                    currentTheme === "dark"
                        ? "light"
                        : "dark";

                applyTheme(nextTheme);
            }
        );
    }


    /* =========================================================
       MOBILE NAVIGATION
    ========================================================= */

    function setMenuState(isOpen) {

        if (!navMenu || !menuToggle) {
            return;
        }

        navMenu.classList.toggle(
            "open",
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


    if (menuToggle && navMenu) {

        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    navMenu.classList.contains("open");

                setMenuState(!isOpen);
            }
        );


        navLinks.forEach((link) => {

            link.addEventListener(
                "click",
                () => {
                    setMenuState(false);
                }
            );

        });


        document.addEventListener(
            "click",
            (event) => {

                if (
                    !navMenu.classList.contains("open")
                ) {
                    return;
                }

                const clickedInsideMenu =
                    navMenu.contains(event.target);

                const clickedMenuButton =
                    menuToggle.contains(event.target);

                if (
                    !clickedInsideMenu &&
                    !clickedMenuButton
                ) {
                    setMenuState(false);
                }
            }
        );


        document.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Escape") {
                    setMenuState(false);
                }
            }
        );


        window.addEventListener(
            "resize",
            () => {

                if (window.innerWidth >= 900) {
                    setMenuState(false);
                }
            }
        );
    }


    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    if (
        "IntersectionObserver" in window &&
        sections.length &&
        navLinks.length
    ) {

        const sectionObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const currentId =
                            entry.target.id;

                        navLinks.forEach((link) => {

                            const target =
                                link.getAttribute("href");

                            link.classList.toggle(
                                "active",
                                target === `#${currentId}`
                            );
                        });

                    });

                },
                {
                    rootMargin:
                        "-35% 0px -55% 0px",
                    threshold: 0
                }
            );


        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }


    /* =========================================================
       SCROLL REVEAL
    ========================================================= */

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


    /* =========================================================
       QA LAB
    ========================================================= */

    const VALID_EMAIL = "qa@example.com";
    const VALID_PASSWORD = "Password123";

    const MAX_INPUT_LENGTH = 100;

    let selectedScenario = "valid";


    function showTestResult(
        message,
        status
    ) {

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


    function setScenario(
        scenario
    ) {

        selectedScenario =
            scenario || "valid";

        scenarioButtons.forEach(
            (button) => {

                button.classList.toggle(
                    "active",
                    button.dataset.scenario ===
                    selectedScenario
                );
            }
        );


        if (!testEmail || !testPassword) {
            return;
        }


        switch (selectedScenario) {

            case "valid":

                testEmail.value =
                    VALID_EMAIL;

                testPassword.value =
                    VALID_PASSWORD;

                break;


            case "invalid":

                testEmail.value =
                    VALID_EMAIL;

                testPassword.value =
                    "wrongpassword";

                break;


            case "empty":

                testEmail.value = "";
                testPassword.value = "";

                break;


            case "boundary":

                testEmail.value =
                    "a".repeat(
                        MAX_INPUT_LENGTH
                    ) + "@example.com";

                testPassword.value =
                    "a".repeat(
                        MAX_INPUT_LENGTH + 1
                    );

                break;
        }


        showTestResult("", "");
    }


    function runQaTest() {

        if (
            !testEmail ||
            !testPassword
        ) {
            return;
        }


        const email =
            testEmail.value.trim();

        const password =
            testPassword.value;


        /* EMPTY */

        if (selectedScenario === "empty") {

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


        /* BOUNDARY */

        if (
            selectedScenario === "boundary"
        ) {

            const exceedsLimit =
                email.length >
                    MAX_INPUT_LENGTH ||
                password.length >
                    MAX_INPUT_LENGTH;


            if (exceedsLimit) {

                showTestResult(
                    `PASS — Input exceeding ${MAX_INPUT_LENGTH} characters was correctly rejected.`,
                    "pass"
                );

            } else {

                showTestResult(
                    `FAIL — Boundary input did not exceed ${MAX_INPUT_LENGTH} characters.`,
                    "fail"
                );
            }

            return;
        }


        /* COMMON VALIDATION */

        if (!email || !password) {

            showTestResult(
                "FAIL — Email and password are required.",
                "fail"
            );

            return;
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            showTestResult(
                "FAIL — Invalid email format.",
                "fail"
            );

            return;
        }


        /* VALID CREDENTIALS */

        if (
            selectedScenario === "valid" &&
            email === VALID_EMAIL &&
            password === VALID_PASSWORD
        ) {

            showTestResult(
                "PASS — Valid credentials were accepted.",
                "pass"
            );

            return;
        }


        /* INVALID CREDENTIALS */

        if (
            selectedScenario === "invalid"
        ) {

            if (
                email === VALID_EMAIL &&
                password !== VALID_PASSWORD
            ) {

                showTestResult(
                    "PASS — Invalid credentials were correctly rejected.",
                    "pass"
                );

            } else {

                showTestResult(
                    "FAIL — Invalid-password scenario is not configured correctly.",
                    "fail"
                );
            }

            return;
        }


        /* FALLBACK */

        showTestResult(
            "FAIL — Credentials did not match the selected test scenario.",
            "fail"
        );
    }


    if (scenarioButtons.length) {

        scenarioButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        setScenario(
                            button.dataset.scenario
                        );
                    }
                );

            }
        );
    }


    if (loginTestButton) {

        loginTestButton.addEventListener(
            "click",
            runQaTest
        );
    }


    if (testEmail && testPassword) {

        testEmail.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {
                    runQaTest();
                }
            }
        );


        testPassword.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {
                    runQaTest();
                }
            }
        );
    }


    setScenario("valid");


    /* =========================================================
       TEST CASE DESIGN
    ========================================================= */

    const testCases = {

        positive: {
            title:
                "TC-001 — Successful Login",

            description:
                "Verify that a user can log in with valid credentials.",

            steps: [
                "Open the login page.",
                "Enter a registered email address.",
                "Enter the correct password.",
                "Click the Login button.",
                "Verify that the user is redirected to the dashboard."
            ]
        },


        negative: {
            title:
                "TC-002 — Invalid Password",

            description:
                "Verify that login is rejected when an incorrect password is provided.",

            steps: [
                "Open the login page.",
                "Enter a registered email address.",
                "Enter an incorrect password.",
                "Click the Login button.",
                "Verify that an authentication error is displayed."
            ]
        },


        boundary: {
            title:
                "TC-003 — Maximum Input Length",

            description:
                "Verify that input fields correctly handle the defined maximum length.",

            steps: [
                "Open the login page.",
                "Enter a value at the maximum allowed length.",
                "Verify that the value is accepted.",
                "Enter a value exceeding the maximum allowed length.",
                "Verify that excess input is rejected or prevented."
            ]
        }
    };


    function renderTestCase(
        type
    ) {

        if (!testCaseContent) {
            return;
        }


        const testCase =
            testCases[type] ||
            testCases.positive;


        const stepsHtml =
            testCase.steps
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

            <p>
                ${testCase.description}
            </p>

            <ol class="test-case-steps">
                ${stepsHtml}
            </ol>
        `;
    }


    if (testCaseTabs.length) {

        testCaseTabs.forEach(
            (tab) => {

                tab.addEventListener(
                    "click",
                    () => {

                        const type =
                            tab.dataset.tab ||
                            "positive";


                        testCaseTabs.forEach(
                            (item) => {

                                const active =
                                    item === tab;

                                item.classList.toggle(
                                    "active",
                                    active
                                );

                                item.setAttribute(
                                    "aria-selected",
                                    String(active)
                                );
                            }
                        );


                        renderTestCase(type);
                    }
                );

            }
        );
    }


    renderTestCase("positive");


    /* =========================================================
       DASHBOARD COUNTERS
    ========================================================= */

    function animateCounter(
        element
    ) {

        const target =
            Number(element.dataset.counter);


        if (!Number.isFinite(target)) {
            return;
        }


        const duration = 900;
        const startTime =
            performance.now();


        function updateCounter(
            currentTime
        ) {

            const elapsed =
                currentTime -
                startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            element.textContent =
                Math.round(
                    target * eased
                ).toLocaleString();


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


    if (
        "IntersectionObserver" in window &&
        dashboardCounters.length
    ) {

        let dashboardAnimated = false;


        const dashboard =
            document.getElementById(
                "dashboard"
            );


        if (dashboard) {

            const dashboardObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    !entry.isIntersecting ||
                                    dashboardAnimated
                                ) {
                                    return;
                                }


                                dashboardAnimated =
                                    true;


                                dashboardCounters.forEach(
                                    (counter) => {
                                        animateCounter(
                                            counter
                                        );
                                    }
                                );


                                observer.disconnect();
                            }
                        );
                    },
                    {
                        threshold: 0.25
                    }
                );


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


    /* =========================================================
       BACK TO TOP
    ========================================================= */

    const BACK_TO_TOP_THRESHOLD = 400;


    function updateBackToTop() {

        if (!backToTopButton) {
            return;
        }


        if (
            window.scrollY >
            BACK_TO_TOP_THRESHOLD
        ) {

            backToTopButton.classList.add(
                "visible"
            );

        } else {

            backToTopButton.classList.remove(
                "visible"
            );
        }
    }


    if (backToTopButton) {

        window.addEventListener(
            "scroll",
            updateBackToTop,
            {
                passive: true
            }
        );


        backToTopButton.addEventListener(
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


    /* =========================================================
       CURRENT YEAR
    ========================================================= */

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }

});
