// =====================================================
// ADMIN AUTH CHECK
// =====================================================

const adminData = localStorage.getItem("admin");
const adminToken = localStorage.getItem("adminToken");

if (!adminData || !adminToken) {
    window.location.href = "admin-login.html";
}


// =====================================================
// ADMIN INFORMATION
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
        adminName.textContent = admin.name;
    }
}


// =====================================================
// ELEMENTS
// =====================================================

const statTotal =
    document.getElementById("statTotal");

const statPending =
    document.getElementById("statPending");

const statProgress =
    document.getElementById("statProgress");

const statResolved =
    document.getElementById("statResolved");

const statHighPriority =
    document.getElementById("statHighPriority");

const statMediumPriority =
    document.getElementById("statMediumPriority");

const statLowPriority =
    document.getElementById("statLowPriority");

const statTopCategory =
    document.getElementById("statTopCategory");

const categoryStatistics =
    document.getElementById("categoryStatistics");

const departmentStatistics =
    document.getElementById("departmentStatistics");


// =====================================================
// LOAD STATISTICS
// =====================================================

async function loadStatistics() {

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


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load statistics"
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
    complaints.filter(complaint =>
        String(complaint.status || "")
            .trim()
            .toLowerCase() === "pending"
    ).length;


const progress =
    complaints.filter(complaint =>
        String(complaint.status || "")
            .trim()
            .toLowerCase() === "in progress"
    ).length;


const resolved =
    complaints.filter(complaint =>
        String(complaint.status || "")
            .trim()
            .toLowerCase() === "resolved"
    ).length;


// ===============================
// SHOW STATISTICS
// ===============================

statTotal.textContent = total;
statPending.textContent = pending;
statProgress.textContent = progress;
statResolved.textContent = resolved;


// Make sure In Progress number is visible
statProgress.style.display = "block";
statProgress.style.visibility = "visible";
statProgress.style.opacity = "1";
statProgress.style.color = "#111827";

        // =================================================
        // AI PRIORITY STATISTICS
        // =================================================

        const high =
            complaints.filter(
                complaint =>
                    String(
                        complaint.priority || ""
                    ).toLowerCase() === "high"
            ).length;


        const medium =
            complaints.filter(
                complaint =>
                    String(
                        complaint.priority || ""
                    ).toLowerCase() === "medium"
            ).length;


        const low =
            complaints.filter(
                complaint =>
                    String(
                        complaint.priority || ""
                    ).toLowerCase() === "low"
            ).length;


        statHighPriority.textContent =
            high;

        statMediumPriority.textContent =
            medium;

        statLowPriority.textContent =
            low;


        // =================================================
        // CATEGORY ANALYSIS
        // =================================================

        const categoryCount = {};


        complaints.forEach(complaint => {

            const category =
                complaint.aiCategory ||
                complaint.category ||
                "Other";


            const cleanCategory =
                String(category).trim();


            categoryCount[cleanCategory] =
                (categoryCount[cleanCategory] || 0) + 1;

        });


        // =================================================
        // TOP CATEGORY
        // =================================================

        let topCategory =
            "No Data";

        let topCategoryCount =
            0;


        Object.keys(categoryCount).forEach(
            category => {

                if (
                    categoryCount[category] >
                    topCategoryCount
                ) {

                    topCategoryCount =
                        categoryCount[category];

                    topCategory =
                        category;

                }

            }
        );


        statTopCategory.textContent =
            topCategory;


        // =================================================
        // DISPLAY CATEGORY STATISTICS
        // =================================================

        categoryStatistics.innerHTML = "";


        if (Object.keys(categoryCount).length === 0) {

            categoryStatistics.innerHTML = `
                <div class="statistics-empty">
                    No category data available.
                </div>
            `;

        } else {

            Object.entries(categoryCount)
                .sort((a, b) => b[1] - a[1])
                .forEach(
                    ([category, count]) => {

                        const percentage =
                            total > 0
                                ? Math.round(
                                    (count / total) * 100
                                )
                                : 0;


                        const item =
                            document.createElement("div");

                        item.className =
                            "statistics-item";


                        item.innerHTML = `

                            <div class="statistics-item-header">

                                <strong>
                                    ${category}
                                </strong>

                                <span>
                                    ${count} complaint${count !== 1 ? "s" : ""}
                                </span>

                            </div>


                            <div class="statistics-progress">

                                <div
                                    class="statistics-progress-bar"
                                    style="width: ${percentage}%"
                                ></div>

                            </div>


                            <small>
                                ${percentage}% of total complaints
                            </small>

                        `;


                        categoryStatistics.appendChild(
                            item
                        );

                    }
                );

        }


        // =================================================
        // DEPARTMENT ANALYSIS
        // =================================================

        const departmentCount = {};


        complaints.forEach(complaint => {

            // Different possible field names
            const department =
                complaint.department ||
                complaint.aiDepartment ||
                "Unassigned";


            const cleanDepartment =
                String(department).trim();


            departmentCount[cleanDepartment] =
                (departmentCount[cleanDepartment] || 0) + 1;

        });


        // =================================================
        // DISPLAY DEPARTMENT STATISTICS
        // =================================================

        departmentStatistics.innerHTML = "";


        if (
            Object.keys(departmentCount).length === 0
        ) {

            departmentStatistics.innerHTML = `
                <div class="statistics-empty">
                    No department data available.
                </div>
            `;

        } else {

            Object.entries(departmentCount)
                .sort((a, b) => b[1] - a[1])
                .forEach(
                    ([department, count]) => {

                        const percentage =
                            total > 0
                                ? Math.round(
                                    (count / total) * 100
                                )
                                : 0;


                        const item =
                            document.createElement("div");

                        item.className =
                            "statistics-item";


                        item.innerHTML = `

                            <div class="statistics-item-header">

                                <strong>
                                    ${department}
                                </strong>

                                <span>
                                    ${count} complaint${count !== 1 ? "s" : ""}
                                </span>

                            </div>


                            <div class="statistics-progress">

                                <div
                                    class="statistics-progress-bar"
                                    style="width: ${percentage}%"
                                ></div>

                            </div>


                            <small>
                                ${percentage}% of total complaints
                            </small>

                        `;


                        departmentStatistics.appendChild(
                            item
                        );

                    }
                );

        }


    } catch (error) {

        console.error(
            "Statistics Error:",
            error
        );


        categoryStatistics.innerHTML = `
            <div class="statistics-empty">
                Unable to load category statistics.
            </div>
        `;


        departmentStatistics.innerHTML = `
            <div class="statistics-empty">
                Unable to load department statistics.
            </div>
        `;

    }

}


// =====================================================
// BACK TO DASHBOARD
// =====================================================

const backToDashboardBtn =
    document.getElementById(
        "backToDashboardBtn"
    );


if (backToDashboardBtn) {

    backToDashboardBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "admin-dashboard.html";

        }
    );

}


// =====================================================
// LOGOUT
// =====================================================

const logoutButton =
    document.getElementById(
        "adminLogoutBtn"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "admin"
            );

            localStorage.removeItem(
                "adminToken"
            );

            localStorage.removeItem(
                "selectedComplaintId"
            );


            window.location.href =
                "admin-login.html";

        }
    );

}


// =====================================================
// START
// =====================================================

loadStatistics();