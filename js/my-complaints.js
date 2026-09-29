// =====================================================
// MY COMPLAINTS
// =====================================================

const userData =
    localStorage.getItem("user");


// =====================================================
// CHECK LOGIN
// =====================================================

if (!userData) {

    window.location.href =
        "login.html";

} else {

    loadMyComplaints();

}


// =====================================================
// GET USER TOKEN
// =====================================================

function getUserToken(user) {

    return (
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        user.token ||
        user.accessToken
    );

}


// =====================================================
// LOAD COMPLAINTS
// =====================================================

async function loadMyComplaints() {

    const tableBody =
        document.getElementById(
            "complaintsTableBody"
        );


    try {

        const user =
            JSON.parse(userData);


        const userId =
            user._id || user.id;


        const token =
            getUserToken(user);


        if (!userId) {

            throw new Error(
                "User ID not found"
            );

        }


        if (!token) {

            throw new Error(
                "Authentication token not found"
            );

        }


        const response =
            await fetch(
                `https://10.65.152.42:5000/api/complaints/user/${userId}`,
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


        if (response.status === 401) {

            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("accessToken");

            alert(
                "Your session has expired. Please login again."
            );

            window.location.href =
                "login.html";

            return;
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load complaints"
            );

        }


        const complaints =
            data.complaints || [];


        // =================================================
        // TOTAL COUNT
        // =================================================

        document.getElementById(
            "totalComplaints"
        ).textContent =
            complaints.length;


        // =================================================
        // NO COMPLAINTS
        // =================================================

        if (complaints.length === 0) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="empty-complaints"
                    >

                        📋 You have not submitted
                        any complaints yet.

                    </td>

                </tr>

            `;

            return;
        }


        // =================================================
        // DISPLAY COMPLAINTS
        // =================================================

        tableBody.innerHTML = "";


        complaints.forEach(
            complaint => {

                const row =
                    document.createElement("tr");


                // =========================================
                // STATUS
                // =========================================

                const status =
                    complaint.status ||
                    "Pending";


                let statusClass =
                    "status-pending";


                const normalizedStatus =
                    String(status)
                    .trim()
                    .toLowerCase();


                if (
                    normalizedStatus ===
                    "in progress"
                ) {

                    statusClass =
                        "status-progress";

                }

                else if (
                    normalizedStatus ===
                    "resolved"
                ) {

                    statusClass =
                        "status-resolved";

                }


                // =========================================
                // DATE
                // =========================================

                let complaintDate =
                    "N/A";


                if (complaint.createdAt) {

                    complaintDate =
                        new Date(
                            complaint.createdAt
                        ).toLocaleDateString(
                            "en-IN",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            }
                        );

                }


                
            // =========================================
            // TABLE ROW
            // =========================================

row.innerHTML = `

    <td>

        <span class="complaint-id">

            ${
                complaint.complaintId ||
                "N/A"
            }

        </span>

    </td>


    <td>

        <span class="complaint-title">

            ${
                complaint.title ||
                "Untitled Complaint"
            }

        </span>

    </td>


    <td>

        ${complaintDate}

    </td>


    <td>

        <span 
            class="status-badge ${statusClass}"
        >

            ${status}

        </span>

    </td>


    <!-- OPEN BUTTON -->

    <td>

        <button
            type="button"
            class="open-complaint-btn"
            onclick="openComplaint('${complaint.complaintId}')"
        >
            Open
        </button>

    </td>

`;


                tableBody.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(
            "My Complaints Error:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-complaints"
                >

                    ❌ Unable to load complaints.

                    <br><br>

                    Please login again and try.

                </td>

             </tr>

        `;

    }

}
// =====================================================
// OPEN COMPLAINT DETAILS
// =====================================================

function openComplaint(complaintId) {

    if (!complaintId) {
        alert("Complaint ID not found.");
        return;
    }

    window.location.href =
        `complaint-view.html?id=${encodeURIComponent(complaintId)}`;
}