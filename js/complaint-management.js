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

const complaintsTableBody =
    document.getElementById("complaintsTableBody");

const managementComplaintCount =
    document.getElementById("managementComplaintCount");

const complaintSearch =
    document.getElementById("complaintSearch");

const statusFilter =
    document.getElementById("statusFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const requestTypeFilter =
    document.getElementById("requestTypeFilter");

const resetComplaintFilters =
    document.getElementById("resetComplaintFilters");


// =====================================================
// STORE COMPLAINTS
// =====================================================

let allComplaints = [];


// =====================================================
// LOAD ALL COMPLAINTS
// =====================================================

async function loadAllComplaints() {

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
                "Failed to load complaints"
            );

        }


        allComplaints =
            data.complaints || [];


        displayComplaints(
            allComplaints
        );


    } catch (error) {

        console.error(
            "Complaint Management Error:",
            error
        );


        complaintsTableBody.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    class="admin-empty-state"
                >
                    Unable to load complaints.
                </td>
            </tr>
        `;

    }

}


// =====================================================
// DISPLAY COMPLAINTS
// =====================================================

function displayComplaints(complaints) {

    complaintsTableBody.innerHTML = "";


    managementComplaintCount.textContent =
        complaints.length;


    if (complaints.length === 0) {

        complaintsTableBody.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    class="complaint-no-results"
                >

                    <span class="complaint-no-results-icon">
                        📭
                    </span>

                    No complaints found.

                </td>
            </tr>
        `;

        return;
    }


    complaints.forEach(
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
            // PRIORITY CLASS
            // =========================================

            let priorityClass =
                "ai-priority-medium";


            if (
                complaint.priority === "High"
            ) {

                priorityClass =
                    "ai-priority-high";

            }
            else if (
                complaint.priority === "Low"
            ) {

                priorityClass =
                    "ai-priority-low";

            }


            // =========================================
            // TABLE ROW
            // =========================================

            row.innerHTML = `

                <td>

                    <strong>
                        ${escapeHTML(
                            complaint.complaintId || "N/A"
                        )}
                    </strong>

                </td>


                <td>

                    ${escapeHTML(
                        complaint.title || "Untitled"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        complaint.category || "N/A"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        complaint.requestType || "N/A"
                    )}

                </td>


                <td>

                    <span class="ai-category-badge">

                        ${escapeHTML(
                            complaint.aiCategory ||
                            complaint.category ||
                            "N/A"
                        )}

                    </span>

                </td>


                <td>

                    <span
                        class="ai-priority-badge ${priorityClass}"
                    >

                        ${escapeHTML(
                            complaint.priority ||
                            "Medium"
                        )}

                    </span>

                </td>


                <td>

                    <span class="ai-department-text">

                        ${escapeHTML(
                            complaint.department ||
                            "Not Assigned"
                        )}

                    </span>

                </td>


                <td>

                    <span
                        class="admin-status-badge ${statusClass}"
                    >

                        ${escapeHTML(
                            complaint.status ||
                            "Pending"
                        )}

                    </span>

                </td>


                <td>

                    <button
                        class="admin-open-btn"
                        onclick="openManagedComplaint('${escapeHTML(
                            complaint.complaintId || ""
                        )}')"
                    >

                        Open

                    </button>

                </td>

            `;


            complaintsTableBody.appendChild(
                row
            );

        }
    );

}


// =====================================================
// SEARCH + ALL FILTERS
// =====================================================

function filterComplaints() {

    const searchValue =
        complaintSearch.value
            .trim()
            .toLowerCase();


    const selectedStatus =
        statusFilter.value;


    const selectedCategory =
        categoryFilter.value;


    const selectedRequestType =
        requestTypeFilter
            ? requestTypeFilter.value
            : "All";


    const filtered =
        allComplaints.filter(
            complaint => {

                // =====================================
                // SEARCH
                // =====================================

                const complaintId =
                    String(
                        complaint.complaintId || ""
                    ).toLowerCase();


                const title =
                    String(
                        complaint.title || ""
                    ).toLowerCase();


                const matchesSearch =
                    complaintId.includes(
                        searchValue
                    ) ||
                    title.includes(
                        searchValue
                    );


                // =====================================
                // STATUS
                // =====================================

                const matchesStatus =
                    selectedStatus === "All" ||
                    complaint.status ===
                    selectedStatus;


                // =====================================
                // CATEGORY
                // =====================================

                const matchesCategory =
                    selectedCategory === "All" ||
                    complaint.category ===
                    selectedCategory;


                // =====================================
                // REQUEST TYPE
                // =====================================

                const matchesRequestType =
                    selectedRequestType === "All" ||
                    complaint.requestType ===
                    selectedRequestType;


                // =====================================
                // FINAL RESULT
                // =====================================

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesCategory &&
                    matchesRequestType
                );

            }
        );


    displayComplaints(
        filtered
    );

}


// =====================================================
// SEARCH EVENT
// =====================================================

if (complaintSearch) {

    complaintSearch.addEventListener(
        "input",
        filterComplaints
    );

}


// =====================================================
// STATUS FILTER EVENT
// =====================================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        filterComplaints
    );

}


// =====================================================
// CATEGORY FILTER EVENT
// =====================================================

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterComplaints
    );

}


// =====================================================
// REQUEST TYPE FILTER EVENT
// =====================================================

if (requestTypeFilter) {

    requestTypeFilter.addEventListener(
        "change",
        filterComplaints
    );

}


// =====================================================
// RESET FILTERS
// =====================================================

if (resetComplaintFilters) {

    resetComplaintFilters.addEventListener(
        "click",
        function () {

            complaintSearch.value = "";

            statusFilter.value = "All";

            categoryFilter.value = "All";


            if (requestTypeFilter) {

                requestTypeFilter.value =
                    "All";

            }


            displayComplaints(
                allComplaints
            );

        }
    );

}


// =====================================================
// OPEN COMPLAINT
// =====================================================

function openManagedComplaint(
    complaintId
) {

    localStorage.setItem(
        "selectedComplaintId",
        complaintId
    );


    window.location.href =
        "complaint-details.html";

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
        function () {

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
        function () {

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
// SAFE HTML
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// =====================================================
// START
// =====================================================

loadAllComplaints();