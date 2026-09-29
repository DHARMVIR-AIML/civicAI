// ==========================================
// CIVICAI BUDGET OPTIMIZER
// ==========================================

const API_URL =
    "https://10.65.152.42:5000/api";


// ==========================================
// FORMAT CURRENCY
// ==========================================

function formatCurrency(amount) {

    return "₹" +
        Number(amount || 0)
            .toLocaleString("en-IN");
}


// ==========================================
// GET ADMIN TOKEN
// ==========================================

function getAdminToken() {

    return (
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken")
    );
}


// ==========================================
// GET CURRENT ADMIN
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
            "Admin Data Error:",
            error
        );

        return null;
    }
}


// ==========================================
// MAIN OPTIMIZER
// ==========================================

async function optimizeFromComplaints() {

    const budget =
        Number(
            document.getElementById(
                "totalBudget"
            ).value
        );


    if (!budget || budget <= 0) {

        alert(
            "Please enter the available development budget."
        );

        return;
    }


    const token =
        getAdminToken();


    if (!token) {

        alert(
            "Admin authentication token not found. Please login again."
        );

        window.location.href =
            "admin-login.html";

        return;
    }


    const admin =
        getCurrentAdmin();


    // ==========================================
    // ONLY SUPER ADMIN CAN RUN OPTIMIZER
    // ==========================================

    if (
        admin &&
        admin.role !== "superadmin"
    ) {

        alert(
            "Only Super Admin can use Budget Optimizer."
        );

        return;
    }


    showLoading();


    try {

        const response =
            await fetch(
                `${API_URL}/complaints/admin/all`,
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

            throw new Error(
                data.message ||
                "Failed to fetch complaints"
            );
        }


        const complaints =
            data.complaints || [];


        if (
            complaints.length === 0
        ) {

            hideLoading();

            alert(
                "No complaints are available for optimization."
            );

            return;
        }


        // ==========================================
        // CALCULATE DISTRIBUTION
        // ==========================================

        const result =
            calculateBudgetDistribution(
                complaints,
                budget
            );


        // Save result temporarily
        window.latestBudgetResult =
            result;


        // ==========================================
        // DISPLAY RESULTS
        // ==========================================

        displayResults(
            complaints,
            result,
            budget
        );


        // Show distribute button
        showDistributeButton();


    } catch (error) {

        console.error(
            "Budget Optimizer Error:",
            error
        );


        alert(
            "Unable to analyze complaints. Please check the admin login and server."
        );

    }


    hideLoading();
}


// ==========================================
// CALCULATE BUDGET DISTRIBUTION
// ==========================================

function calculateBudgetDistribution(
    complaints,
    totalBudget
) {

    const departments = {};

    const locations = {};


    complaints.forEach(
        complaint => {

            const department =
                complaint.department ||
                getDepartmentFromCategory(
                    complaint.category
                );


            const priority =
                normalizePriority(
                    complaint.priority
                );


            const location =
                complaint.location ||
                "Location Not Specified";


            // ==========================================
            // CREATE DEPARTMENT
            // ==========================================

            if (
                !departments[department]
            ) {

                departments[department] = {

                    department,

                    complaints: 0,

                    highPriority: 0,

                    mediumPriority: 0,

                    lowPriority: 0,

                    priorityPoints: 0,

                    benefitScore: 0,

                    locations: {}

                };
            }


            departments[department]
                .complaints++;


            // ==========================================
            // PRIORITY SCORE
            // ==========================================

            let priorityScore =
                50;


            if (
                priority === "High"
            ) {

                departments[department]
                    .highPriority++;

                priorityScore = 100;

            }

            else if (
                priority === "Medium"
            ) {

                departments[department]
                    .mediumPriority++;

                priorityScore = 60;

            }

            else {

                departments[department]
                    .lowPriority++;

                priorityScore = 30;
            }


            departments[department]
                .priorityPoints +=
                priorityScore;


            // ==========================================
            // LOCATION
            // ==========================================

            if (
                !departments[department]
                    .locations[location]
            ) {

                departments[department]
                    .locations[location] = 0;
            }


            departments[department]
                .locations[location]++;


            // ==========================================
            // GLOBAL LOCATION
            // ==========================================

            if (
                !locations[location]
            ) {

                locations[location] = {

                    location,

                    complaints: 0,

                    highPriority: 0

                };
            }


            locations[location]
                .complaints++;


            if (
                priority === "High"
            ) {

                locations[location]
                    .highPriority++;
            }

        }
    );


    // ==========================================
    // DEPARTMENT ARRAY
    // ==========================================

    const departmentArray =
        Object.values(
            departments
        );


    // ==========================================
    // BENEFIT SCORE
    // ==========================================

    departmentArray.forEach(
        department => {

            const complaintScore =
                department.complaints * 10;


            const priorityScore =
                department.priorityPoints;


            const highPriorityBonus =
                department.highPriority * 20;


            department.benefitScore =
                complaintScore +
                priorityScore +
                highPriorityBonus;
        }
    );


    // ==========================================
    // TOTAL SCORE
    // ==========================================

    const totalScore =
        departmentArray.reduce(
            (
                total,
                department
            ) => {

                return total +
                    department.benefitScore;

            },
            0
        );


    let allocated = 0;


    // ==========================================
    // INITIAL ALLOCATION
    // ==========================================

    departmentArray.forEach(
        department => {

            if (
                totalScore === 0
            ) {

                department.allocatedBudget =
                    0;

                department.percentage =
                    0;

                return;
            }


            const percentage =
                department.benefitScore /
                totalScore;


            department.percentage =
                percentage * 100;


            department.allocatedBudget =
                Math.floor(
                    totalBudget *
                    percentage
                );


            allocated +=
                department.allocatedBudget;
        }
    );


    // ==========================================
    // REMAINING AMOUNT
    // ==========================================

    const remaining =
        totalBudget -
        allocated;


    if (
        departmentArray.length > 0 &&
        remaining > 0
    ) {

        departmentArray.sort(
            (
                a,
                b
            ) =>
                b.benefitScore -
                a.benefitScore
        );


        departmentArray[0]
            .allocatedBudget +=
            remaining;
    }


    // ==========================================
    // SORT BY ALLOCATION
    // ==========================================

    departmentArray.sort(
        (
            a,
            b
        ) =>
            b.allocatedBudget -
            a.allocatedBudget
    );


    // ==========================================
    // LOCATIONS
    // ==========================================

    const locationArray =
        Object.values(
            locations
        );


    locationArray.sort(
        (
            a,
            b
        ) =>
            b.complaints -
            a.complaints
    );


    return {

        departments:
            departmentArray,

        locations:
            locationArray,

        totalAllocated:
            totalBudget
    };
}


// ==========================================
// PRIORITY NORMALIZER
// ==========================================

function normalizePriority(
    priority
) {

    if (!priority) {

        return "Medium";
    }


    const value =
        String(priority)
            .toLowerCase()
            .trim();


    if (
        value.includes("high") ||
        value.includes("urgent") ||
        value.includes("critical")
    ) {

        return "High";
    }


    if (
        value.includes("low")
    ) {

        return "Low";
    }


    return "Medium";
}


// ==========================================
// CATEGORY → DEPARTMENT
// ==========================================

function getDepartmentFromCategory(
    category
) {

    if (!category) {

        return "General Civic Department";
    }


    const value =
        String(category)
            .toLowerCase();


    // ROAD
    if (
        value.includes("road") ||
        value.includes("pothole") ||
        value.includes("traffic")
    ) {

        return "Road & Infrastructure Department";
    }


    // ELECTRICITY
    if (
        value.includes("electric") ||
        value.includes("power") ||
        value.includes("wire")
    ) {

        return "Electricity Department";
    }


    // WATER
    if (
        value.includes("water") ||
        value.includes("drinking")
    ) {

        return "Water Supply Department";
    }


    // GARBAGE
    if (
        value.includes("garbage") ||
        value.includes("waste") ||
        value.includes("clean")
    ) {

        return "Municipal Waste Management Department";
    }


    // STREET LIGHT
    if (
        value.includes("light") ||
        value.includes("street")
    ) {

        return "Street Lighting Department";
    }


    // DRAINAGE
    if (
        value.includes("drainage") ||
        value.includes("sewer")
    ) {

        return "Drainage & Sewerage Department";
    }


    // EDUCATION
    if (
        value.includes("education") ||
        value.includes("school") ||
        value.includes("college")
    ) {

        return "Education Department";
    }


    return "General Civic Department";
}


// ==========================================
// DISPLAY RESULTS
// ==========================================

function displayResults(
    complaints,
    result,
    totalBudget
) {

    document
        .getElementById(
            "dashboard"
        )
        .classList.remove("hidden");


    document
        .getElementById(
            "resultSection"
        )
        .classList.remove("hidden");


    const highPriority =
        complaints.filter(
            complaint =>
                normalizePriority(
                    complaint.priority
                ) === "High"
        ).length;


    const departmentCount =
        result.departments.length;


    document
        .getElementById(
            "totalComplaints"
        )
        .textContent =
        complaints.length;


    document
        .getElementById(
            "highPriority"
        )
        .textContent =
        highPriority;


    document
        .getElementById(
            "departmentCount"
        )
        .textContent =
        departmentCount;


    document
        .getElementById(
            "allocatedBudget"
        )
        .textContent =
        formatCurrency(
            totalBudget
        );


    document
        .getElementById(
            "availableBudget"
        )
        .textContent =
        formatCurrency(
            totalBudget
        );


    document
        .getElementById(
            "summaryAllocated"
        )
        .textContent =
        formatCurrency(
            totalBudget
        );


    document
        .getElementById(
            "remainingBudget"
        )
        .textContent =
        formatCurrency(0);


    // ==========================================
    // DEPARTMENT RESULTS
    // ==========================================

    const departmentContainer =
        document.getElementById(
            "departmentResults"
        );


    departmentContainer.innerHTML =
        result.departments
            .map(
                (
                    department,
                    index
                ) => {

                    return `

                    <div class="department-card">

                        <div class="rank">
                            ${index + 1}
                        </div>

                        <div class="department-info">

                            <h3>
                                ${department.department}
                            </h3>

                            <div class="tags">

                                <span>
                                    📋
                                    ${department.complaints}
                                    complaints
                                </span>

                                <span class="high">
                                    🚨
                                    ${department.highPriority}
                                    high priority
                                </span>

                                <span>
                                    🟡
                                    ${department.mediumPriority}
                                    medium
                                </span>

                                <span>
                                    🟢
                                    ${department.lowPriority}
                                    low
                                </span>

                            </div>

                            <div class="progress">

                                <div
                                    style="
                                        width:
                                        ${Math.min(
                                            department.percentage,
                                            100
                                        )}%
                                    "
                                ></div>

                            </div>

                            <small>
                                ${department.percentage.toFixed(1)}%
                                of optimization score
                            </small>

                        </div>

                        <div class="allocation">

                            <small>
                                Allocated Budget
                            </small>

                            <strong>
                                ${formatCurrency(
                                    department.allocatedBudget
                                )}
                            </strong>

                        </div>

                    </div>

                    `;
                }
            )
            .join("");


    // ==========================================
    // LOCATION RESULTS
    // ==========================================

    const locationContainer =
        document.getElementById(
            "locationResults"
        );


    locationContainer.innerHTML =
        result.locations
            .slice(0, 10)
            .map(
                location => {

                    return `

                    <div class="location-row">

                        <div>

                            <strong>
                                📍 ${location.location}
                            </strong>

                            <span>
                                ${location.complaints}
                                reported complaints
                            </span>

                        </div>

                        <div class="location-priority">

                            🚨
                            ${location.highPriority}
                            high priority

                        </div>

                    </div>

                    `;
                }
            )
            .join("");
}


// ==========================================
// SHOW DISTRIBUTE BUTTON
// ==========================================

function showDistributeButton() {

    let button =
        document.getElementById(
            "distributeBudgetBtn"
        );


    // If button already exists
    if (button) {

        button.style.display =
            "inline-block";

        return;
    }


    // ==========================================
    // CREATE BUTTON
    // ==========================================

    const resultSection =
        document.getElementById(
            "resultSection"
        );


    if (!resultSection) {
        return;
    }


    button =
        document.createElement(
            "button"
        );


    button.id =
        "distributeBudgetBtn";


    button.type =
        "button";


    button.textContent =
        "💰 Distribute Budget";


    button.style.marginTop =
        "20px";


    button.style.padding =
        "12px 24px";


    button.style.border =
        "none";


    button.style.borderRadius =
        "8px";


    button.style.cursor =
        "pointer";


    button.style.fontSize =
        "16px";


    button.style.fontWeight =
        "600";


    button.onclick =
        distributeBudget;


    resultSection.appendChild(
        button
    );
}


// ==========================================
// DISTRIBUTE / SAVE BUDGET
// ==========================================

async function distributeBudget() {

    const result =
        window.latestBudgetResult;


    if (!result) {

        alert(
            "Please run the optimizer first."
        );

        return;
    }


    const totalBudget =
        Number(
            document.getElementById(
                "totalBudget"
            ).value
        );


    if (
        !totalBudget ||
        totalBudget <= 0
    ) {

        alert(
            "Invalid budget amount."
        );

        return;
    }


    const token =
        getAdminToken();


    if (!token) {

        alert(
            "Admin authentication token not found."
        );

        return;
    }


    const admin =
        getCurrentAdmin();


    if (
        !admin ||
        admin.role !== "superadmin"
    ) {

        alert(
            "Only Super Admin can distribute budget."
        );

        return;
    }


    const confirmed =
        confirm(
            `Distribute ${formatCurrency(totalBudget)} across ${result.departments.length} departments?`
        );


    if (!confirmed) {
        return;
    }


    // Disable button
    const button =
        document.getElementById(
            "distributeBudgetBtn"
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Saving Budget...";
    }


    try {

        const response =
            await fetch(
                `${API_URL}/budget/distribute`,
                {

                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            totalBudget:

                                totalBudget,

                            allocations:

                                result.departments.map(
                                    department => ({

                                        department:
                                            department.department,

                                        allocatedBudget:
                                            department.allocatedBudget,

                                        percentage:
                                            department.percentage,

                                        complaints:
                                            department.complaints,

                                        highPriority:
                                            department.highPriority,

                                        mediumPriority:
                                            department.mediumPriority,

                                        lowPriority:
                                            department.lowPriority

                                    })
                                )
                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to distribute budget"
            );
        }


        alert(
            "✅ Budget distributed successfully!"
        );


        if (button) {

            button.textContent =
                "✅ Budget Distributed";

            button.disabled =
                true;
        }


        console.log(
            "Saved Budget:",
            data.budget
        );


    } catch (error) {

        console.error(
            "Budget Distribution Error:",
            error
        );


        alert(
            error.message ||
            "Failed to distribute budget."
        );


        if (button) {

            button.disabled =
                false;

            button.textContent =
                "💰 Distribute Budget";
        }
    }
}


// ==========================================
// LOADING
// ==========================================

function showLoading() {

    const loading =
        document.getElementById(
            "loading"
        );


    if (loading) {

        loading.classList.add(
            "show"
        );
    }
}


function hideLoading() {

    const loading =
        document.getElementById(
            "loading"
        );


    if (loading) {

        loading.classList.remove(
            "show"
        );
    }
}