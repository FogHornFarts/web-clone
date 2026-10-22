/* Renders the rebuilt VTOP shell: header, horizontal menu (Hostels panel) and the dashboard. */

const esc = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const pageWrapper = document.getElementById("b5-pagewrapper");

function showUnderConstruction() {
    bootstrap.Modal.getOrCreateInstance("#myModalFooter").show();
}

// Mimics VTOP's blockGUI()/unblockGUI() around an ajax page load
function withLoader(render) {
    const popup = document.getElementById("popup");
    popup.classList.remove("noshow");
    setTimeout(() => {
        render();
        popup.classList.add("noshow");
        pageWrapper.scrollTop = 0;
    }, 350);
}

/* ---------------------------------------------------------------- Header */

function renderHeader() {
    document.querySelectorAll('[data-field="userLabel"]').forEach(el => {
        el.textContent = `${STUDENT.regNo} (${STUDENT.role})`;
    });
    document.querySelectorAll('[data-field="userName"]').forEach(el => {
        el.textContent = STUDENT.name;
    });

    document.getElementById("quickLinksMenu").innerHTML = QUICK_LINKS.map(link => `
        <li>
            <div class="d-flex justify-content-between">
                <a href="#" data-url="${esc(link.url)}" class="dropdown-item menuFontStyle quickB5MainMenu">
                    <i class="fa fa-dot-circle-o iconSpace"></i><span>${esc(link.label)}</span></a>
                <button type="button" class="btn btn-sm btn-light text-dark deleteQuickLinkBtn">x</button>
            </div>
        </li>`).join("");

    document.querySelectorAll('[data-action="home"]').forEach(el => el.addEventListener("click", (event) => {
        event.preventDefault();
        closeAllMenus();
        withLoader(renderDashboard);
    }));

    document.getElementById("printVTOPCoreDocument").addEventListener("click", (event) => {
        event.preventDefault();
        window.print();
    });

    document.querySelectorAll('[data-action="history"], [data-action="signout"], .quickB5MainMenu, .deleteQuickLinkBtn, #favouriteBtn, #campusEtiquetteBtn')
        .forEach(el => el.addEventListener("click", (event) => {
            event.preventDefault();
            showUnderConstruction();
        }));

    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
}

/* ------------------------------------------------------- Horizontal menu */

function renderMenuBar() {
    const items = document.getElementById("hmenuItems");
    const panels = document.getElementById("hmenuPanels");

    // VTOP's hamburger toggles the first group (Academics)
    const first = MENU_GROUPS[0];
    let itemsHtml = `<a class="navbar-brand d-inline text-dark fw-bold" role="button" ${menuToggleAttrs(first)}>☰ </a>`;

    itemsHtml += MENU_GROUPS.map(group => `
        <a class="btn btn-outline ps-0 fw-bold text-start text-nowrap hmenuItem" role="button" ${menuToggleAttrs(group)}>
            <i class="bi bi-chevron-right fs-6 me-md-1 text-primary d-none d-md-inline-block rotate-caret"></i>
            <span class="primaryColor1"><i class="fs-6 bi ${esc(group.icon)}"></i>
                <span class="d-none d-md-inline-block">${esc(group.label)}</span></span>
        </a>`).join("");

    items.innerHTML = itemsHtml;
    panels.innerHTML = MENU_GROUPS.filter(g => g.columns).map(renderMenuPanel).join("");

    items.querySelectorAll("[data-unbuilt]").forEach(el => el.addEventListener("click", (event) => {
        event.preventDefault();
        closeAllMenus();
        showUnderConstruction();
    }));

    panels.querySelectorAll(".collapse.hmenuitem").forEach(panel => {
        panel.addEventListener("show.bs.collapse", onMenuShow);
        panel.addEventListener("hidden.bs.collapse", onMenuHidden);
    });

    panels.querySelectorAll(".systemB5BtnMenu").forEach(link => link.addEventListener("click", (event) => {
        event.preventDefault();
        const { url, label } = event.currentTarget.dataset;
        closeAllMenus();
        withLoader(() => {
            document.body.classList.remove("dashboard-page");
            (MENU_PAGES[url] || renderMenuPage)(label, url);
        });
    }));

    // Close an open panel when clicking anywhere outside the menu bar
    document.addEventListener("click", (event) => {
        if (!event.target.closest("#top-hmenu-bar")) {
            closeAllMenus();
        }
    });
}

function menuToggleAttrs(group) {
    return group.columns
        ? `data-bs-toggle="collapse" href="#${group.id}" aria-expanded="false" aria-controls="${group.id}"`
        : `href="#" data-unbuilt="true"`;
}

function renderMenuPanel(group) {
    const columns = group.columns.map(column => `
        <div class="list-group list-group-flush overflow-auto h-100 w-100">
            ${column.map(entry => entry.heading ? `
                <div class="list-group-item fs-6 card-title fw-bold primaryColor1 my-2 text-nowrap">
                    <i class="text-danger text-opacity-50 me-2 ${esc(entry.icon)}"></i><span>${esc(entry.heading)}</span>
                </div>` : `
                <a href="#" data-url="${esc(entry.url)}" data-label="${esc(entry.label)}" class="list-group-item list-group-item-action border-0 fs-6 card-text text-nowrap text-dark systemB5BtnMenu">
                    <i class="bi bi-forward small text-muted text-secondary"></i>
                    <span class="fw-bold">${esc(entry.label)}</span></a>`).join("")}
        </div>`).join("");

    return `
        <div class="collapse w-100 hmenuitem shadow-lg menuBorderStyle overlay-window mt-5 position-absolute top-0 start-0 overflow-auto WhiteBackground hmenubox" id="${group.id}">
            <div class="card border-0">
                <div class="row g-0">
                    <div class="col-12 col-md-2 border-md-end border-3">
                        <div class="h-100 d-flex align-items-center justify-content-center p-3 shadow-sm">
                            <div class="fw-bold h5">${esc(group.label)}</div>
                        </div>
                    </div>
                    <div class="col-12 col-md-8">
                        <div class="card-body">
                            <div class="d-flex flex-wrap flex-md-nowrap mb-5 mb-md-2 pb-5 pb-md-2">
                                ${columns}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer d-block d-md-none"><br><br><br><br></div>
            </div>
        </div>`;
}

function caretFor(panelId) {
    return document.querySelector(`.hmenuItem[href="#${panelId}"] .rotate-caret`);
}

// Same behaviour as VTOP's doHideOtherMenus(): one panel open at a time, highlighted trigger
function onMenuShow(event) {
    document.querySelectorAll(".collapse.show.hmenuitem").forEach(open => {
        if (open !== event.target) {
            bootstrap.Collapse.getOrCreateInstance(open).hide();
        }
    });

    const caret = caretFor(event.target.id);
    if (caret) {
        caret.style.transform = "rotate(90deg)";
        caret.classList.replace("text-primary", "text-danger");
        caret.parentElement.classList.add("border-bottom", "border-3", "bg-info", "bg-opacity-10");
    }
}

function onMenuHidden(event) {
    const caret = caretFor(event.target.id);
    if (caret) {
        caret.style.transform = "rotate(0deg)";
        caret.classList.replace("text-danger", "text-primary");
        caret.parentElement.classList.remove("border-bottom", "border-3", "bg-info", "bg-opacity-10");
    }
}

function closeAllMenus() {
    document.querySelectorAll(".collapse.show.hmenuitem").forEach(open => {
        bootstrap.Collapse.getOrCreateInstance(open).hide();
    });
}

// Placeholder for a menu page that hasn't been rebuilt yet
function renderMenuPage(label, url) {
    pageWrapper.innerHTML = `
        <div class="card shadow-sm primaryBorderTop">
            <div class="card-header">
                <span class="fs-6 fontcolor3 fw-bold">${esc(label)}</span>
            </div>
            <div class="card-body">
                <p class="text-danger fw-bold mb-2">This page is under Construction !!! Please try later</p>
                <p class="text-secondary small mb-3">VTOP route: <code>${esc(url)}</code></p>
                <button class="btn btn-sm btn-primary" type="button" id="backHomeBtn">
                    <i class="bi bi-house-door me-1"></i>Back to Dashboard</button>
            </div>
        </div>`;
    document.getElementById("backHomeBtn").addEventListener("click", () => withLoader(renderDashboard));
}

/* ------------------------------------------------------------ Menu pages */

function renderMessSelection() {
    const m = MESS_SELECTION;
    const row = (label, value) => `
        <tr>
            <th class="text-nowrap">${label}</th>
            <td>${esc(value)}</td>
        </tr>`;

    pageWrapper.innerHTML = `
        <div class="p-1 p-md-2 p-lg-4">
            <div class="card shadow-sm primaryBorderTop mt-md-4">
                <div class="card-header border-0">
                    <span class="fs-3">${esc(m.title)}</span>
                </div>
                <div class="card-body p-3 pb-4">
                    <div class="table-responsive">
                        <table class="mess-info-table">
                            <thead>
                                <tr><th colspan="2" class="text-center">Counselling Room Information</th></tr>
                            </thead>
                            <tbody>
                                ${row("Application Number", `${m.applicationNumber} - [ ${STUDENT.regNo} ]`)}
                                ${row("Room Number", m.roomNumber)}
                                ${row("Room Details", m.roomDetails)}
                                ${row("Block Details", m.blockDetails)}
                            </tbody>
                        </table>
                    </div>
                    <div class="mess-info-message mx-auto mt-5">
                        <div class="mess-opted">You have opted for ${esc(m.optedMess)}</div>
                        ${m.confirmed ? `<div class="mess-confirmed text-success">Congrats !! you have confirmed your booking.</div>` : ""}
                    </div>
                </div>
            </div>
        </div>`;
}

// VTOP route -> page renderer; routes not listed here fall back to renderMenuPage
const MENU_PAGES = {
    "hostels/counselling/mess/registration": renderMessSelection
};

/* ------------------------------------------------------------- Dashboard */

// Thresholds inferred from the saved page (85 = Good, 93+ = Excellent, <75 = Critical)
function attendanceStatus(value) {
    if (value >= 90) return { css: "text-success", remark: "Excellent - Keep going" };
    if (value >= 80) return { css: "text-primary", remark: "Good" };
    if (value >= 75) return { css: "text-warning", remark: "Average - can improve" };
    return { css: "text-danger", remark: "Critical - must improve" };
}

function courseTable() {
    const rows = DASHBOARD.courses.map((course, i) => {
        const status = attendanceStatus(course.attendance);
        return `
            <tr class="text-center">
                <th scope="row">${i + 1}</th>
                <td class="mx-1 text-start text-nowrap"><span class="mx-2 text-dark fw-bold">${esc(course.code)}</span>-
                    <span class="mx-2 text-dark">${esc(course.name)}</span></td>
                <td class="fst-italic text-primary fw-bold mx-1">${esc(course.type)}</td>
                <td><span class="${status.css} fw-bold">${course.attendance.toFixed(1)}</span></td>
                <td class="text-nowrap text-start"><span class="${status.css} fw-bold">${status.remark}</span></td>
            </tr>`;
    }).join("");

    return `
        <table class="table table-sm table-hover table-borderless">
            <thead>
                <tr class="text-center">
                    <th scope="col">#</th>
                    <th class="px-1 mx-1" scope="col">Code - Course Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Attendance</th>
                    <th class="w-50 text-start" scope="col">Remarks</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;
}

function eventsList() {
    return DASHBOARD.events.map(day => {
        const body = day.events.length === 0
            ? `<div class="card-body text-secondary">--- No events scheduled ---</div>`
            : day.events.map(ev => `
                <div class="card-body small">
                    <div><span class="card-title fw-bold me-2">${esc(ev.title)}</span>(<span class="fst-italic mx-2">${esc(ev.category)}</span>)</div>
                    <div class="card-text fst-italic"><span class="mx-3 fw-bold text-secondary">${esc(ev.date)}</span></div>
                    <span class="card-text ms-3"><small class="text-dark fw-bold">${esc(ev.club)}</small></span>
                </div>`).join("");

        return `
            <div class="card lightGoldenbackground2 border-0 mb-3">
                <div class="row g-0">
                    ${day.label ? `<div class="col-12 card-title fs-6 mb-3 fw-bold fontcolor5">${esc(day.label)}</div>` : ""}
                    <div class="col-2 border-bottom text-center small align-middle">
                        <div class="h5 fontcolor3 fw-bold">${esc(day.day)}</div>
                        <div class="subtitle fw-bold text-nowrap">${esc(day.month)}</div>
                    </div>
                    <div class="col-10 border-bottom align-middle">${body}</div>
                </div>
            </div>`;
    }).join("");
}

function spotlightItems(items, inCanvas) {
    return `
        <ul class="list-group list-group-flush text-start spotlight-background">
            ${items.map(item => `
                <li class="list-group-item ${inCanvas ? "py-0 text-dark" : "py-1"}">
                    <div class="d-flex align-items-stretch ${inCanvas ? "my-2 " : ""}justify-content-start">
                        <div class="hightlight1 px-3"><i class="fa fa-bolt" aria-hidden="true"></i></div>
                        <div class="py-0">
                            ${item.href
                                ? `<a class="list-group-item-action text-decoration-none" target="_blank" rel="noopener" href="${esc(item.href)}"><span class="fg-black">${esc(item.text)}</span></a>`
                                : `<a class="list-group-item-action text-decoration-none fg-black spotlight-download" href="#"><span class="fg-black">${esc(item.text)}</span></a>`}
                        </div>
                    </div>
                </li>`).join("")}
        </ul>`;
}

function spotlightCards() {
    return DASHBOARD.spotlight.map(group => `
        <div class="col">
            <div class="card border-0">
                <div class="card-header">
                    <button class="btn btn-sm btn-info fw-bold position-relative" type="button" data-bs-toggle="offcanvas"
                            data-spotlighttitle="${esc(group.key)}" data-bs-target="#spotlightCanvas" aria-controls="spotlightCanvas">
                        <span>${esc(group.label)}</span>
                        <span class="badge rounded-pill bg-danger">
                            <span class="text-light">${group.items.length}</span>
                            <span class="visually-hidden">unread messages</span>
                        </span>
                    </button>
                </div>
                <div class="card-body">${spotlightItems(group.items, false)}</div>
            </div>
        </div>`).join("");
}

function creditStatus() {
    const c = DASHBOARD.credits;
    const row = (label, value, shade) => `
        <li class="list-group-item d-flex justify-content-between align-items-start p-0 m-0">
            <span class="card-title fontcolor1 p-0 m-0">${label}</span>
            <span class="fontcolor3 w-25 py-1 m-0 text-center ${shade}"><span>${esc(value)}</span></span>
        </li>`;

    return `
        <ul class="list-group list-group-flush fs-6 fw-bold">
            ${row("Total Credits Required :", c.required, "bg-primary bg-opacity-10")}
            ${row("Earned Credits :", c.earned, "bg-primary bg-opacity-25")}
            ${row("Current CGPA :", c.cgpa, "bg-primary bg-opacity-50")}
            ${row("Non-graded Core Requirement", c.nonGradedCore, "bg-danger bg-opacity-10")}
        </ul>
        <table class="table table-sm">
            <tbody><tr>
                <th class="fw-bold bg-info">Placement Eligibility</th>
                <td class="fw-bold text-primary bg-success bg-opacity-50">${esc(c.placement)}</td>
            </tr></tbody>
        </table>`;
}

function assignmentsTable() {
    return `
        <table class="table table-sm table-hover table-borderless">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th class="px-1 mx-1 text-center" scope="col">Course Name</th>
                    <th scope="col">Title</th>
                    <th scope="col">Last Date</th>
                    <th scope="col">Uploaded</th>
                </tr>
            </thead>
            <tbody>
                ${DASHBOARD.digitalAssignments.map((da, i) => `
                    <tr>
                        <th scope="row">${i + 1}</th>
                        <td class="mx-1 text-nowrap">${esc(da.course)}</td>
                        <td class="fst-italic text-primary fw-bold mx-1">${esc(da.title)}</td>
                        <td class="mx-1">${esc(da.lastDate)}</td>
                        <td></td>
                    </tr>`).join("")}
            </tbody>
        </table>`;
}

function feedbackTable() {
    return `
        <table class="table table-sm table-hover table-borderless">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Feedback</th>
                    <th scope="col">Category</th>
                    <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
                ${DASHBOARD.feedbacks.map((fb, i) => `
                    <tr>
                        <th scope="row">${i + 1}</th>
                        <td class="mx-1 text-wrap">${esc(fb.title)}</td>
                        <td class="fst-italic text-primary fw-bold mx-1">${esc(fb.category)}</td>
                        <td class="mx-1">${esc(fb.status)}</td>
                    </tr>`).join("")}
            </tbody>
        </table>`;
}

function renderDashboard() {
    document.body.classList.add("dashboard-page");
    pageWrapper.innerHTML = `
        <div class="row p-1 p-md-2 p-lg-3">

            <div class="col-12 col-md-8 mb-3">
                <div class="card goldenBorderTop shadow-sm lightGoldenbackground2">
                    <div class="d-flex p-3">
                        <h5 class="card-title fontcolor3 fw-bold">Action Plan - Academic Performance</h5>
                        <button class="btn btn-sm bg-warning bg-opacity-50 fw-bold w-25 mx-2" title="View Document" id="viewPdfBtn">View</button>
                    </div>
                </div>
            </div>
            <div class="w-100"></div>

            <div class="col-12 col-md-8">

                <div class="card border-2 mb-3 p-0 shadow-sm border-3" id="course-data">
                    <div class="card-header d-flex flex-column flex-md-row primaryBorderTop">
                        <span class="fs-6 fontcolor3 flex-fill text-nowrap fw-bold">CURRENT SEMESTER COURSE REGISTRATION DETAILS</span>
                        <span class="bg-warning bg-opacity-10 text-danger text-nowrap fw-bold w-50 text-center">${esc(DASHBOARD.semester)}</span>
                    </div>
                    <div class="card-body small courseData overflow-scroll">${courseTable()}</div>
                </div>

                <div class="row">
                    <div class="col-12 col-md-6">
                        <div class="card goldenBorderTop shadow-sm lightGoldenbackground2">
                            <h5 class="p-3 card-title fontcolor3 fw-bold">Clubs &amp; Chapters : Events Scheduled</h5>
                            <div class="card-body" id="events-info-content">${eventsList()}</div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="fs-5 fontcolor3 primaryBorderTop fw-bold">SPOT-LIGHT</div>
                        <div class="row row-cols-1 row-cols-md-1 g-1">${spotlightCards()}</div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-4">
                <div class="card border-0 mb-3">
                    <div class="card-header primaryBorderTop"><span class="fs-6 fontcolor3 fw-bold">PROCTOR Message</span></div>
                    <div class="card-body" id="proctor-message">${esc(DASHBOARD.proctorMessage)}</div>
                </div>

                <div class="card border-0 mb-3">
                    <div class="card-header primaryBorderTop"><span class="fs-6 fontcolor3 fw-bold">CGPA and CREDIT Status</span></div>
                    <div class="card-body" id="edu-status">${creditStatus()}</div>
                </div>

                <div class="card border-0">
                    <div class="card-header primaryBorderTop"><span class="fs-6 fontcolor3 fw-bold">Forthcoming Digital Assignments</span></div>
                    <div class="card-body" id="digital-assignments">${assignmentsTable()}</div>
                </div>

                <div class="card border-0 mb-3">
                    <div class="card-header primaryBorderTop"><span class="fs-6 fontcolor3 fw-bold">Last Five Feedback Details</span></div>
                    <div class="card-body" id="last-five-feedbacks">${feedbackTable()}</div>
                </div>
            </div>
        </div>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="spotlightCanvas" aria-labelledby="spotlightCanvasLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="spotlightCanvasLabel">SPOTLIGHT :</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                ${DASHBOARD.spotlight.map(group => `
                    <div class="d-none spotlightMsgDivs" id="spotlight${esc(group.key)}">
                        <h5 class="text-primary fw-bold text-center mb-2">${esc(group.label)}</h5>
                        ${spotlightItems(group.items, true)}
                    </div>`).join("")}
            </div>
        </div>`;

    document.getElementById("viewPdfBtn").addEventListener("click", showUnderConstruction);

    pageWrapper.querySelectorAll(".spotlight-download").forEach(el => el.addEventListener("click", (event) => {
        event.preventDefault();
        showUnderConstruction();
    }));

    document.getElementById("spotlightCanvas").addEventListener("show.bs.offcanvas", (event) => {
        document.querySelectorAll(".spotlightMsgDivs").forEach(div => div.classList.add("d-none"));
        const title = event.relatedTarget.getAttribute("data-spotlighttitle");
        document.getElementById("spotlight" + title).classList.remove("d-none");
    });
}

/* ------------------------------------------------------------------ Init */

renderHeader();
renderMenuBar();
renderDashboard();
