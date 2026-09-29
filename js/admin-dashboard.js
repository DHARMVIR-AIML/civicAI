// =====================================================
// ADMIN DASHBOARD AUTH CHECK
// =====================================================

const adminData = localStorage.getItem("admin");
const adminToken = localStorage.getItem("adminToken");

if (!adminData || !adminToken) {
    window.location.href = "admin-login.html";
}


// =====================================================
// DISPLAY ADMIN INFORMATION
// =====================================================

let admin = null;

try {

    admin = JSON.parse(adminData);

} catch (error) {

    console.error("Invalid admin data");

    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");

    window.location.href = "admin-login.html";
}


if (admin) {

    const adminName =
        document.getElementById("adminName");

    if (adminName && admin.name) {

        adminName.textContent =
            admin.name;

    }
}


// =====================================================
// DASHBOARD ELEMENTS
// =====================================================

const totalComplaints =
    document.getElementById("totalComplaints");

const pendingComplaints =
    document.getElementById("pendingComplaints");

const progressComplaints =
    document.getElementById("progressComplaints");

const resolvedComplaints =
    document.getElementById("resolvedComplaints");

const recentComplaintsBody =
    document.getElementById("recentComplaintsBody");


// =====================================================
// AI OVERVIEW ELEMENTS
// =====================================================

const highPriorityCount =
    document.getElementById("highPriorityCount");

const mediumPriorityCount =
    document.getElementById("mediumPriorityCount");

const lowPriorityCount =
    document.getElementById("lowPriorityCount");

const topAICategory =
    document.getElementById("topAICategory");


// =====================================================
// LOAD COMPLAINTS
// =====================================================

async function loadComplaints() {

    try {

        const response = await fetch(
    "https://10.65.152.42:5000/api/complaints/admin/all",
    {
        headers: {
            "Authorization":
                `Bearer ${adminToken}`
        }
    }
);


// =====================================================
// CHECK ADMIN TOKEN EXPIRY
// =====================================================

if (response.status === 401) {

    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");

    alert(
        "Your admin session has expired. Please login again."
    );

    window.location.href =
        "admin-login.html";

    return;
}


const data =
    await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to fetch complaints"
            );

        }


        const complaints =
            data.complaints || [];


        // =================================================
// BASIC STATISTICS
// =================================================



 const total =
            complaints.length;


        const pending =
            complaints.filter(
                complaint =>
                    complaint.status === "Pending"
            ).length;


        const inProgress =
            complaints.filter(
                complaint =>
                    complaint.status === "In Progress"
            ).length;


        const resolved =
            complaints.filter(
                complaint =>
                    complaint.status === "Resolved"
            ).length;


        // =================================================
        // UPDATE STAT CARDS
        // =================================================

        totalComplaints.textContent =
            total;

        pendingComplaints.textContent =
            pending;

        progressComplaints.textContent =
            inProgress;

        resolvedComplaints.textContent =
            resolved;



        // =================================================
        // UPDATE STAT CARDS
        // =================================================

        totalComplaints.textContent =
            total;

        pendingComplaints.textContent =
            pending;

        progressComplaints.textContent =
            inProgress;

        resolvedComplaints.textContent =
            resolved;


        // =================================================
        // AI PRIORITY STATISTICS
        // =================================================

        const highPriority =
            complaints.filter(complaint => {

                const priority =
                    String(
                        complaint.priority || ""
                    )
                    .trim()
                    .toLowerCase();

                return priority === "high";

            }).length;


        const mediumPriority =
            complaints.filter(complaint => {

                const priority =
                    String(
                        complaint.priority || ""
                    )
                    .trim()
                    .toLowerCase();

                return priority === "medium";

            }).length;


        const lowPriority =
            complaints.filter(complaint => {

                const priority =
                    String(
                        complaint.priority || ""
                    )
                    .trim()
                    .toLowerCase();

                return priority === "low";

            }).length;


        // =================================================
        // MOST DETECTED AI CATEGORY
        // =================================================

        const categoryCount = {};


        complaints.forEach(complaint => {

            const category =
                complaint.aiCategory ||
                complaint.category;


            if (category) {

                const cleanCategory =
                    String(category).trim();


                categoryCount[cleanCategory] =
                    (categoryCount[cleanCategory] || 0) + 1;

            }

        });


        let mostCommonCategory =
            "No Data";


        let highestCategoryCount =
            0;


        Object.keys(categoryCount).forEach(
            category => {

                if (
                    categoryCount[category] >
                    highestCategoryCount
                ) {

                    highestCategoryCount =
                        categoryCount[category];

                    mostCommonCategory =
                        category;

                }

            }
        );


        // =================================================
        // UPDATE AI OVERVIEW
        // =================================================

        if (highPriorityCount) {

            highPriorityCount.textContent =
                highPriority;

        }


        if (mediumPriorityCount) {

            mediumPriorityCount.textContent =
                mediumPriority;

        }


        if (lowPriorityCount) {

            lowPriorityCount.textContent =
                lowPriority;

        }


        if (topAICategory) {

            topAICategory.textContent =
                mostCommonCategory;

        }


        // =================================================
        // DISPLAY RECENT COMPLAINTS
        // =================================================

        recentComplaintsBody.innerHTML = "";


        if (complaints.length === 0) {

            recentComplaintsBody.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        class="admin-empty-state"
                    >
                        No complaints available yet.
                    </td>
                </tr>
            `;

            return;
        }


        // =================================================
        // SHOW LATEST 5 COMPLAINTS
        // =================================================

        const recentComplaints =
            complaints.slice(0, 5);


        recentComplaints.forEach(
            complaint => {

                const row =
                    document.createElement("tr");


                // =========================================
                // STATUS CLASS
                // =========================================

                let statusClass = "";


                if (
                    complaint.status === "Pending"
                ) {

                    statusClass =
                        "status-pending";

                }

                else if (
                    complaint.status === "In Progress"
                ) {

                    statusClass =
                        "status-progress";

                }

                else if (
                    complaint.status === "Resolved"
                ) {

                    statusClass =
                        "status-resolved";

                }


                // =========================================
                // TABLE ROW
                // =========================================

                row.innerHTML = `

                    <td>
                        <strong>
                            ${complaint.complaintId || "N/A"}
                        </strong>
                    </td>


                    <td>
                        ${complaint.title || "Untitled"}
                    </td>


                    <td>
                        ${complaint.category || "N/A"}
                    </td>


                    <td>

                        <span
                            class="admin-status-badge ${statusClass}"
                        >
                            ${complaint.status || "Pending"}
                        </span>

                    </td>


                    <td>

                        <button
                            class="admin-open-btn"
                            onclick="openComplaint('${complaint.complaintId}')"
                        >
                            Open
                        </button>

                    </td>

                `;


                recentComplaintsBody.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(
            "Load Complaints Error:",
            error
        );


        recentComplaintsBody.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="admin-empty-state"
                >
                    Unable to load complaints.
                </td>
            </tr>
        `;

    }

}
// =====================================================
// LOAD USER COMPLAINT SUMMARY
// =====================================================

async function loadUserComplaintSummary() {

    try {

        const response = await fetch(
            "https://10.65.152.42:5000/api/complaints/admin/user-summary",
            {
                headers: {
                    "Authorization": `Bearer ${adminToken}`
                }
            }
        );


        // Check token expiry
        if (response.status === 401) {

            localStorage.removeItem("admin");
            localStorage.removeItem("adminToken");

            alert(
                "Your admin session has expired. Please login again."
            );

            window.location.href =
                "admin-login.html";

            return;
        }


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load user complaint summary"
            );

        }


        const users =
            data.users || [];


        const tableBody =
            document.getElementById(
                "userComplaintSummaryBody"
            );


        if (!tableBody) {

            console.error(
                "userComplaintSummaryBody not found in HTML"
            );

            return;
        }


        // No complaints
        if (users.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        class="admin-empty-state"
                    >
                        No user complaints available.
                    </td>
                </tr>
            `;

            return;
        }


        // =================================================
        // DISPLAY USER SUMMARY
        // =================================================

        tableBody.innerHTML = "";


        users.forEach(user => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${user.name || "Unknown User"}
                    </strong>
                </td>


                <td>
                    ${user.email || "No Email"}
                </td>


                <td>

                    <strong>
                        ${user.totalComplaints}
                    </strong>

                    Complaints

                </td>


                <td>

                    <button
                        class="admin-open-btn"
                        onclick="viewUserComplaints('${user.userId}')"
                    >
                        View Complaints →
                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Load User Complaint Summary Error:",
            error
        );


        const tableBody =
            document.getElementById(
                "userComplaintSummaryBody"
            );


        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        class="admin-empty-state"
                    >
                        Unable to load user activity.
                    </td>
                </tr>
            `;

        }

    }

}


// =====================================================
// VIEW USER COMPLAINTS
// =====================================================

function viewUserComplaints(userId) {

    localStorage.setItem(
        "selectedUserId",
        userId
    );


    window.location.href =
        "user-complaints.html";

}

// =====================================================
// OPEN COMPLAINT
// =====================================================

function openComplaint(complaintId) {

    localStorage.setItem(
        "selectedComplaintId",
        complaintId
    );


    window.location.href =
        "complaint-details.html";

}


// =====================================================
// MANAGE COMPLAINTS
// =====================================================

const manageComplaintsBtn =
    document.getElementById(
        "manageComplaintsBtn"
    );


if (manageComplaintsBtn) {

    manageComplaintsBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "complaint-management.html";

        }
    );

}
// =====================================================
// COMPLAINT ACTIVITY
// =====================================================

const complaintActivityBtn =
    document.getElementById("complaintActivityBtn");

if (complaintActivityBtn) {

    complaintActivityBtn.addEventListener("click", () => {

        window.location.href =
            "user-activity.html";

    });

}
// =====================================================
// STATISTICS
// =====================================================

const statisticsBtn =
    document.getElementById("statisticsBtn");

if (statisticsBtn) {

    statisticsBtn.addEventListener("click", () => {

        window.location.href =
            "statistics.html";

    });

}
// =====================================================
// VIEW ALL COMPLAINTS
// =====================================================

const viewAllComplaintsBtn =
    document.getElementById("viewAllComplaintsBtn");

if (viewAllComplaintsBtn) {

    viewAllComplaintsBtn.addEventListener("click", () => {

        window.location.href =
            "https://10.65.152.42:5000/complaint-management.html";

    });

}


// =====================================================
// LOGOUT
// =====================================================

const logoutButton =
    document.getElementById("adminLogoutBtn");

if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        localStorage.removeItem("admin");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("selectedComplaintId");

        window.location.href =
            "https://10.65.152.42:5000/admin-login.html";

    });

}


// =====================================================
// LOAD DASHBOARD
// =====================================================

loadComplaints();
loadUserComplaintSummary();


// =====================================================
// SUPER ADMIN - MANAGE ADMINS
// =====================================================

const manageAdminsBtn =
    document.getElementById("manageAdminsBtn");

if (manageAdminsBtn) {

    // Default: hide button
    manageAdminsBtn.style.display = "none";

    const adminData =
        localStorage.getItem("admin");

    if (adminData) {

        try {

            const admin =
                JSON.parse(adminData);

            console.log("Logged-in Admin:", admin);
            console.log("Admin Role:", admin.role);

            // ONLY SUPERADMIN
            if (admin.role === "superadmin") {

                manageAdminsBtn.style.display = "flex";

                manageAdminsBtn.onclick = () => {

                    window.location.href =
                        "https://10.65.152.42:5000/admin-management.html";

                };

            }

        } catch (error) {

            console.error(
                "Admin data error:",
                error
            );

            manageAdminsBtn.style.display = "none";
        }
    }
}
// ==========================================
// ROLE BASED BUDGET ACCESS
// ==========================================

function setupBudgetAccess() {

    let admin = null;

    try {

        const adminData =
            localStorage.getItem("admin");

        if (adminData) {
            admin = JSON.parse(adminData);
        }

    } catch (error) {

        console.error(
            "Admin data error:",
            error
        );

    }


    const optimizerLink =
        document.getElementById(
            "budgetOptimizerLink"
        );


    const adminBudgetLink =
        document.getElementById(
            "adminBudgetLink"
        );


    if (!admin) {

        if (optimizerLink) {
            optimizerLink.style.display =
                "none";
        }

        if (adminBudgetLink) {
            adminBudgetLink.style.display =
                "none";
        }

        return;
    }


    // ==========================================
    // SUPER ADMIN
    // ==========================================

    if (
        admin.role === "superadmin"
    ) {

        // Super Admin → Optimizer
        if (optimizerLink) {

            optimizerLink.style.display =
                "block";
        }


        // Super Admin → Department Budget
        if (adminBudgetLink) {

            adminBudgetLink.style.display =
                "block";
        }

        return;
    }


    // ==========================================
    // NORMAL ADMIN
    // ==========================================

    if (
        admin.role === "admin"
    ) {

        // Normal Admin → NO optimizer
        if (optimizerLink) {

            optimizerLink.style.display =
                "none";
        }


        // Normal Admin → Department Budget
        if (adminBudgetLink) {

            adminBudgetLink.style.display =
                "block";
        }

        return;
    }


    // ==========================================
    // NORMAL USER / UNKNOWN ROLE
    // ==========================================

    if (optimizerLink) {

        optimizerLink.style.display =
            "none";
    }


    if (adminBudgetLink) {

        adminBudgetLink.style.display =
            "none";
    }
}