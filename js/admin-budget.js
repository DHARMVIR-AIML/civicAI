// ==========================================
// CIVICAI ADMIN BUDGET
// ==========================================

const API_URL =
    "https://10.65.152.42:5000/api";


// ==========================================
// GET TOKEN
// ==========================================

function getAdminToken() {

    return (
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken")
    );
}


// ==========================================
// GET ADMIN
// ==========================================

function getCurrentAdmin() {

    try {

        const admin =
            localStorage.getItem("admin");

        if (!admin) {
            return null;
        }

        return JSON.parse(admin);

    } catch (error) {

        console.error(
            "Admin data error:",
            error
        );

        return null;
    }
}


// ==========================================
// FORMAT MONEY
// ==========================================

function formatCurrency(amount) {

    return "₹" +
        Number(amount || 0)
            .toLocaleString("en-IN");
}


// ==========================================
// LOAD BUDGET
// ==========================================

async function loadBudget() {

    const token =
        getAdminToken();

    const admin =
        getCurrentAdmin();


    // ==========================================
    // AUTH CHECK
    // ==========================================

    if (!token || !admin) {

        alert(
            "Admin authentication required."
        );

        window.location.href =
            "admin-login.html";

        return;
    }


    // ==========================================
    // ONLY ADMIN / SUPERADMIN
    // ==========================================

    if (
        admin.role !== "admin" &&
        admin.role !== "superadmin"
    ) {

        alert(
            "You do not have access to budget information."
        );

        window.location.href =
            "index.html";

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/budget/latest`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            if (
                response.status === 404
            ) {

                showNoBudget();

                return;
            }


            throw new Error(
                data.message ||
                "Failed to fetch budget"
            );
        }


        const budget =
            data.budget;


        if (!budget) {

            showNoBudget();

            return;
        }


        displayBudget(
            budget,
            admin
        );


    } catch (error) {

        console.error(
            "Budget Loading Error:",
            error
        );


        document
            .getElementById(
                "loading"
            )
            .textContent =
            "Unable to load budget information.";
    }
}


// ==========================================
// DISPLAY BUDGET
// ==========================================

function displayBudget(
    budget,
    admin
) {

    const allocations =
        budget.allocations || [];


    // ==========================================
    // TOTAL BUDGET
    // ==========================================

    document
        .getElementById(
            "totalBudget"
        )
        .textContent =
        formatCurrency(
            budget.totalBudget
        );


    // ==========================================
    // DEPARTMENT COUNT
    // ==========================================

    document
        .getElementById(
            "departmentCount"
        )
        .textContent =
        allocations.length;


    // ==========================================
    // TOTAL ASSIGNED TO THIS ADMIN
    // ==========================================

    const myTotal =
        allocations.reduce(
            (
                total,
                allocation
            ) => {

                return total +
                    Number(
                        allocation.allocatedBudget ||
                        0
                    );

            },
            0
        );


    document
        .getElementById(
            "myAllocatedBudget"
        )
        .textContent =
        formatCurrency(
            myTotal
        );


    // ==========================================
    // ADMIN DEPARTMENTS
    // ==========================================

    if (
        admin.role === "superadmin"
    ) {

        document
            .getElementById(
                "adminDepartmentText"
            )
            .textContent =
            "Super Admin — viewing all department allocations.";

    } else {

        document
            .getElementById(
                "adminDepartmentText"
            )
            .textContent =
            "Assigned departments: " +
            (
                admin.departments || []
            ).join(", ");
    }


    // ==========================================
    // HIDE LOADING
    // ==========================================

    document
        .getElementById(
            "loading"
        )
        .style.display =
        "none";


    // ==========================================
    // NO ALLOCATION
    // ==========================================

    if (
        allocations.length === 0
    ) {

        document
            .getElementById(
                "emptyState"
            )
            .style.display =
            "block";

        return;
    }


    // ==========================================
    // CREATE CARDS
    // ==========================================

    const container =
        document.getElementById(
            "allocationContainer"
        );


    container.innerHTML =
        allocations
            .map(
                allocation => {

                    return `

                    <div class="allocation-card">

                        <h3>
                            ${allocation.department}
                        </h3>


                        <div class="allocation-amount">

                            ${formatCurrency(
                                allocation.allocatedBudget
                            )}

                        </div>


                        <div class="allocation-info">


                            <div class="info-box">

                                <small>
                                    Complaints
                                </small>

                                <strong>
                                    ${allocation.complaints || 0}
                                </strong>

                            </div>


                            <div class="info-box">

                                <small>
                                    High Priority
                                </small>

                                <strong>
                                    ${allocation.highPriority || 0}
                                </strong>

                            </div>


                            <div class="info-box">

                                <small>
                                    Share
                                </small>

                                <strong>
                                    ${Number(
                                        allocation.percentage || 0
                                    ).toFixed(1)}%
                                </strong>

                            </div>


                        </div>

                    </div>

                    `;
                }
            )
            .join("");
}


// ==========================================
// NO BUDGET
// ==========================================

function showNoBudget() {

    document
        .getElementById(
            "loading"
        )
        .style.display =
        "none";


    document
        .getElementById(
            "emptyState"
        )
        .style.display =
        "block";


    document
        .getElementById(
            "emptyState"
        )
        .textContent =
        "No budget has been distributed yet.";
}


// ==========================================
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    loadBudget
);