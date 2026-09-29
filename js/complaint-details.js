// =====================================================
// ADMIN AUTH CHECK
// =====================================================

const adminData = localStorage.getItem("admin");

if (!adminData) {
    window.location.href = "admin-login.html";
}


// =====================================================
// ADMIN INFORMATION
// =====================================================

let admin = null;

try {
    admin = JSON.parse(adminData);
} catch (error) {

    localStorage.removeItem("admin");

    window.location.href = "admin-login.html";
}


if (admin) {

    const adminName = document.getElementById("adminName");

    if (adminName && admin.name) {
        adminName.textContent = admin.name;
    }
}


// =====================================================
// GET SELECTED COMPLAINT ID
// =====================================================

const complaintId =
    localStorage.getItem("selectedComplaintId");


if (!complaintId) {

    alert("No complaint selected.");

    window.location.href = "admin-dashboard.html";
}


// =====================================================
// PAGE ELEMENTS
// =====================================================

const complaintIdElement =
    document.getElementById("complaintId");

const complaintStatus =
    document.getElementById("complaintStatus");

const complaintTitle =
    document.getElementById("complaintTitle");

const complaintRequestType =
    document.getElementById("complaintRequestType");

const complaintCategory =
    document.getElementById("complaintCategory");

const complaintUser =
    document.getElementById("complaintUser");

const complaintEmail =
    document.getElementById("complaintEmail");

const complaintLocation =
    document.getElementById("complaintLocation");

const complaintDescription =
    document.getElementById("complaintDescription");

const complaintPhotoSection =
    document.getElementById("complaintPhotoSection");

const complaintPhoto =
    document.getElementById("complaintPhoto");

const statusSelect =
    document.getElementById("statusSelect");

const updateStatusBtn =
    document.getElementById("updateStatusBtn");

const statusMessage =
    document.getElementById("statusMessage");

// =====================================================
// AI ANALYSIS ELEMENTS
// =====================================================

const aiCategory =
    document.getElementById("aiCategory");

const aiPriority =
    document.getElementById("aiPriority");

const aiDepartment =
    document.getElementById("aiDepartment");
// =====================================================
// LOAD COMPLAINT DETAILS
// =====================================================

async function loadComplaintDetails() {

    try {

        const response = await fetch(
            `https://10.65.152.42:5000/api/complaints/${complaintId}`
        );


        const complaint = await response.json();


        if (!response.ok) {

            throw new Error(
                complaint.message ||
                "Failed to load complaint"
            );

        }


        // =============================================
        // BASIC INFORMATION
        // =============================================

        complaintIdElement.textContent =
            complaint.complaintId || "N/A";


        complaintTitle.textContent =
            complaint.title || "N/A";


        complaintRequestType.textContent =
            complaint.requestType || "N/A";


        complaintCategory.textContent =
            complaint.category || "N/A";


        complaintLocation.textContent =
            complaint.location || "N/A";


        complaintDescription.textContent =
            complaint.description || "No description available";

// =============================================
// AI ANALYSIS
// =============================================

if (aiCategory) {

    aiCategory.textContent =
        complaint.aiCategory ||
        complaint.category ||
        "Not available";

}


if (aiPriority) {

    const priority =
        complaint.priority ||
        "Medium";

    aiPriority.textContent =
        priority;


    // Remove previous priority classes

    aiPriority.classList.remove(
        "ai-priority-low",
        "ai-priority-medium",
        "ai-priority-high"
    );


    // Add correct priority class

    if (priority === "Low") {

        aiPriority.classList.add(
            "ai-priority-low"
        );

    }

    else if (priority === "High") {

        aiPriority.classList.add(
            "ai-priority-high"
        );

    }

    else {

        aiPriority.classList.add(
            "ai-priority-medium"
        );

    }

}


if (aiDepartment) {

    aiDepartment.textContent =
        complaint.department ||
        "Not available";

}
        // =============================================
        // USER INFORMATION
        // =============================================

        if (complaint.userId) {

            complaintUser.textContent =
                complaint.userId.name || "N/A";

            complaintEmail.textContent =
                complaint.userId.email || "N/A";

        } else {

            complaintUser.textContent = "N/A";

            complaintEmail.textContent = "N/A";

        }


        // =============================================
        // CURRENT STATUS
        // =============================================

        const currentStatus =
            complaint.status || "Pending";


        complaintStatus.textContent =
            currentStatus;


        statusSelect.value =
            currentStatus;


        updateStatusBadge(currentStatus);


        // =============================================
        // COMPLAINT PHOTO
        // =============================================

        if (complaint.photo) {

            complaintPhoto.src =
                `https://10.65.152.42:5000/uploads/${complaint.photo}`;

            complaintPhotoSection.style.display = "block";

        } else {

            complaintPhotoSection.style.display = "none";

        }


    } catch (error) {

        console.error(
            "Complaint Details Error:",
            error
        );


        alert(
            "Unable to load complaint details."
        );

        window.location.href =
            "admin-dashboard.html";
    }

}


// =====================================================
// UPDATE STATUS BADGE
// =====================================================

function updateStatusBadge(status) {

    complaintStatus.classList.remove(
        "status-pending",
        "status-progress",
        "status-resolved"
    );


    if (status === "Pending") {

        complaintStatus.classList.add(
            "status-pending"
        );

    }
    else if (status === "In Progress") {

        complaintStatus.classList.add(
            "status-progress"
        );

    }
    else if (status === "Resolved") {

        complaintStatus.classList.add(
            "status-resolved"
        );

    }

}


// =====================================================
// UPDATE COMPLAINT STATUS
// =====================================================

updateStatusBtn.addEventListener(
    "click",
    async () => {

        const newStatus =
            statusSelect.value;


        updateStatusBtn.disabled = true;

        updateStatusBtn.textContent =
            "Updating...";


        try {

            const adminToken = localStorage.getItem("adminToken");

const response = await fetch(
    `https://10.65.152.42:5000/api/complaints/admin/${complaintId}/status`,
    {
        method: "PUT",

        headers: {
            "Content-Type": "application/json",

            "Authorization": `Bearer ${adminToken}`
        },

        body: JSON.stringify({
            status: newStatus
        })
    }
);

            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update status"
                );

            }


            // Update status on page

            complaintStatus.textContent =
                newStatus;


            updateStatusBadge(
                newStatus
            );


            statusMessage.textContent =
                "Complaint status updated successfully.";

            statusMessage.classList.add(
                "success"
            );


        } catch (error) {

            console.error(
                "Status Update Error:",
                error
            );


            statusMessage.textContent =
                "Failed to update complaint status.";

            statusMessage.classList.add(
                "error"
            );

        }


        updateStatusBtn.disabled = false;

        updateStatusBtn.textContent =
            "Update Status";

    }
);


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

loadComplaintDetails();