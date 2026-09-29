// =====================================================
// USER COMPLAINTS PAGE
// =====================================================


// =====================================================
// ADMIN AUTH
// =====================================================

const adminToken =
    localStorage.getItem("adminToken");

const adminData =
    localStorage.getItem("admin");


if (!adminToken || !adminData) {

    window.location.href =
        "admin-login.html";

}


// =====================================================
// SELECTED USER
// =====================================================

const selectedUserId =
    localStorage.getItem("selectedUserId");


if (!selectedUserId) {

    alert(
        "User not selected."
    );

    window.location.href =
        "admin-dashboard.html";

}


// =====================================================
// LOAD USER COMPLAINTS
// =====================================================

async function loadUserComplaints() {

    try {

        const response = await fetch(

            `https://10.65.152.42:5000/api/complaints/admin/user/${selectedUserId}`,

            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${adminToken}`
                }
            }

        );


        // =================================================
        // TOKEN EXPIRED
        // =================================================

        if (response.status === 401) {

            localStorage.removeItem(
                "admin"
            );

            localStorage.removeItem(
                "adminToken"
            );

            localStorage.removeItem(
                "selectedUserId"
            );

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
                "Failed to load complaints"
            );

        }


        // =================================================
        // GET DATA
        // =================================================

        const complaints =
            data.complaints || [];

        const user =
            data.user || null;


        const totalComplaints =
            data.totalComplaints || complaints.length;


        const container =
            document.getElementById(
                "complaintsContainer"
            );


        const userDetails =
            document.getElementById(
                "userDetails"
            );


        // =================================================
        // USER INFORMATION
        // =================================================

        if (user) {

            userDetails.innerHTML = `

                <h1>
                    ${user.name || "Unknown User"}
                </h1>

                <p>
                    📧 ${user.email || "No Email"}
                </p>

                <div class="complaints-count">

                    Total Complaints:
                    ${totalComplaints}

                </div>

            `;

        } else {

            userDetails.innerHTML = `

                <h1>
                    Unknown User
                </h1>

                <p>
                    📧 No Email
                </p>

                <div class="complaints-count">

                    Total Complaints:
                    ${totalComplaints}

                </div>

            `;

        }


        // =================================================
        // NO COMPLAINTS
        // =================================================

        if (complaints.length === 0) {

            container.innerHTML = `

                <div class="empty-message">

                    This user has not submitted
                    any complaints.

                </div>

            `;

            return;

        }


        // =================================================
        // DISPLAY COMPLAINTS
        // =================================================

        container.innerHTML = "";


        complaints.forEach(
            (complaint) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "complaint-card";


                // =================================================
                // STATUS CLASS
                // =================================================

                let statusClass =
                    "status-pending";


                if (
                    complaint.status ===
                    "In Progress"
                ) {

                    statusClass =
                        "status-progress";

                }


                if (
                    complaint.status ===
                    "Resolved"
                ) {

                    statusClass =
                        "status-resolved";

                }


                // =================================================
                // PRIORITY CLASS
                // =================================================

                let priorityClass =
                    "priority-medium";


                if (
                    complaint.priority ===
                    "High"
                ) {

                    priorityClass =
                        "priority-high";

                }


                if (
                    complaint.priority ===
                    "Low"
                ) {

                    priorityClass =
                        "priority-low";

                }


                // =================================================
                // DATE
                // =================================================

                let createdDate =
                    "N/A";


                if (complaint.createdAt) {

                    createdDate =
                        new Date(
                            complaint.createdAt
                        ).toLocaleString();

                }


                // =================================================
                // COMPLAINT CARD
                // =================================================

                card.innerHTML = `

                    <div
                        class="complaint-card-header"
                    >

                        <div
                            class="complaint-id"
                        >

                            Complaint ID:
                            ${complaint.complaintId}

                        </div>


                        <span
                            class="complaint-status ${statusClass}"
                        >

                            ${complaint.status || "Pending"}

                        </span>

                    </div>


                    <div
                        class="complaint-info-grid"
                    >


                        <!-- TITLE -->

                        <div
                            class="complaint-info-item"
                        >

                            <strong>
                                Title
                            </strong>

                            <span>
                                ${complaint.title || "N/A"}
                            </span>

                        </div>


                        <!-- REQUEST TYPE -->

                        <div
                            class="complaint-info-item"
                        >

                            <strong>
                                Request Type
                            </strong>

                            <span>
                                ${complaint.requestType || "N/A"}
                            </span>

                        </div>


                        <!-- CATEGORY -->

                        <div
                            class="complaint-info-item"
                        >

                            <strong>
                                Category
                            </strong>

                            <span>
                                ${complaint.category || "N/A"}
                            </span>

                        </div>


                        <!-- AI CATEGORY -->

                        <div
                            class="complaint-info-item"
                        >

                            <strong>
                                AI Category
                            </strong>

                            <span>
                                ${complaint.aiCategory || "N/A"}
                            </span>

                        </div>


                        <!-- PRIORITY -->

                        <div
                            class="complaint-info-item"
                        >

                            <strong>
                                Priority
                            </strong>

                            <span
                                class="${priorityClass}"
                            >

                                ${complaint.priority || "Medium"}

                            </span>

                        </div>


                        <!-- DEPARTMENT -->

                        <div
                            class="complaint-info-item"
                        >

                            <strong>
                                Department
                            </strong>

                            <span>
                                ${complaint.department || "N/A"}
                            </span>

                        </div>


                        <!-- DESCRIPTION -->

                        <div
                            class="complaint-info-item full-width"
                        >

                            <strong>
                                Description
                            </strong>

                            <span>
                                ${complaint.description || "N/A"}
                            </span>

                        </div>


                        <!-- LOCATION -->

                        <div
                            class="complaint-info-item full-width"
                        >

                            <strong>
                                Location
                            </strong>

                            <span>
                                ${complaint.location || "N/A"}
                            </span>

                        </div>


                        <!-- SUBMITTED DATE -->

                        <div
                            class="complaint-info-item"
                        >

                            <strong>
                                Submitted On
                            </strong>

                            <span>
                                ${createdDate}
                            </span>

                        </div>


                        <!-- PHOTO -->

                        <div
                            class="complaint-info-item"
                        >

                            <strong>
                                Photo
                            </strong>

                            <span>

                                ${
                                    complaint.photo
                                    ? "Photo Available"
                                    : "No Photo"
                                }

                            </span>

                        </div>


                    </div>


                    <!-- OPEN COMPLAINT -->

                    <button
                        class="open-complaint-btn"
                        onclick="openComplaint('${complaint.complaintId}')"
                    >

                        🔎 Open Complaint

                    </button>

                `;


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Load User Complaints Error:",
            error
        );


        document.getElementById(
            "complaintsContainer"
        ).innerHTML = `

            <div class="empty-message">

                Unable to load complaints.

                <br><br>

                ${error.message}

            </div>

        `;

    }

}


// =====================================================
// OPEN COMPLAINT
// =====================================================

function openComplaint(
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

const backBtn =
    document.getElementById(
        "backBtn"
    );


if (backBtn) {

    backBtn.addEventListener(
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

const logoutBtn =
    document.getElementById(
        "adminLogoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "admin"
            );

            localStorage.removeItem(
                "adminToken"
            );

            localStorage.removeItem(
                "selectedUserId"
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
// LOAD
// =====================================================

loadUserComplaints();