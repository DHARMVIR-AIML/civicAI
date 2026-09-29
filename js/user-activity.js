// =====================================================
// USER COMPLAINT ACTIVITY
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
// LOAD USER COMPLAINT ACTIVITY
// =====================================================

async function loadUserActivity() {

    try {

        const response = await fetch(
            "https://10.65.152.42:5000/api/complaints/admin/user-summary",
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
                "Failed to load user activity"
            );

        }


        // =================================================
        // GET USERS
        // =================================================

        const users =
            data.users || [];


        const tableBody =
            document.getElementById(
                "usersTableBody"
            );


        // =================================================
        // NO USERS
        // =================================================

        if (users.length === 0) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="empty-message"
                    >

                        No users or complaints found.

                    </td>

                </tr>

            `;

            return;
        }


        // =================================================
        // DISPLAY USERS
        // =================================================

        tableBody.innerHTML = "";


        users.forEach(user => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="user-name">

                        ${user.name || "Unknown User"}

                    </div>

                </td>


                <td>

                    <div class="user-email">

                        ${user.email || "No Email"}

                    </div>

                </td>


                <td>

                    <span class="complaint-count">

                        ${user.totalComplaints || 0}
                        Complaints

                    </span>

                </td>


                <td>

                    <button
                        class="view-complaints-btn"
                        onclick="viewUserComplaints('${user.userId}')"
                    >

                        👁️ View Complaints →

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "User Activity Error:",
            error
        );


        document.getElementById(
            "usersTableBody"
        ).innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-message"
                >

                    Unable to load user activity.

                    <br><br>

                    ${error.message}

                </td>

            </tr>

        `;

    }

}


// =====================================================
// VIEW USER COMPLAINTS
// =====================================================

function viewUserComplaints(userId) {

    // Save selected user ID

    localStorage.setItem(
        "selectedUserId",
        userId
    );


    // Open user complaints page

    window.location.href =
        "user-complaints.html";

}


// =====================================================
// BACK TO DASHBOARD
// =====================================================

const backBtn =
    document.getElementById("backBtn");


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

loadUserActivity();