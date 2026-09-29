// =====================================================
// USER COMPLAINT VIEW
// =====================================================


// =====================================================
// CHECK LOGIN
// =====================================================

const userData =
    localStorage.getItem("user");


if (!userData) {

    window.location.href =
        "login.html";

} else {

    loadComplaintDetails();

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
// LOAD COMPLAINT DETAILS
// =====================================================

async function loadComplaintDetails() {

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

            alert(
                "Your session has expired. Please login again."
            );

            window.location.href =
                "login.html";

            return;
        }


        // =================================================
        // GET COMPLAINT ID FROM URL
        // =================================================

        const params =
            new URLSearchParams(
                window.location.search
            );


        const complaintId =
            params.get("id");


        if (!complaintId) {

            alert(
                "Complaint ID not found."
            );

            window.location.href =
                "my-complaints.html";

            return;
        }


        // =================================================
        // GET USER'S COMPLAINTS
        // =================================================

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


        // =================================================
        // SESSION EXPIRED
        // =================================================

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
        // FIND SELECTED COMPLAINT
        // =================================================

        const complaint =
            complaints.find(
                item =>
                    item.complaintId === complaintId
            );


        if (!complaint) {

            alert(
                "Complaint not found or you do not have access to it."
            );

            window.location.href =
                "my-complaints.html";

            return;
        }


        // =================================================
        // DISPLAY COMPLAINT ID
        // =================================================

        document.getElementById(
            "showComplaintId"
        ).textContent =
            complaint.complaintId || "N/A";


        // =================================================
        // TITLE
        // =================================================

        document.getElementById(
            "showTitle"
        ).textContent =
            complaint.title ||
            "N/A";


        // =================================================
        // REQUEST TYPE
        // =================================================

        document.getElementById(
            "showRequestType"
        ).textContent =
            complaint.requestType ||
            "N/A";


        // =================================================
        // CATEGORY
        // =================================================

        document.getElementById(
            "showCategory"
        ).textContent =
            complaint.category ||
            "N/A";


        // =================================================
        // DESCRIPTION
        // =================================================

        document.getElementById(
            "showDescription"
        ).textContent =
            complaint.description ||
            "N/A";


        // =================================================
        // LOCATION
        // =================================================

        document.getElementById(
            "showLocation"
        ).textContent =
            complaint.location ||
            "N/A";


        // =================================================
        // PRIORITY
        // =================================================

        document.getElementById(
            "showPriority"
        ).textContent =
            complaint.priority ||
            "N/A";


        // =================================================
        // DEPARTMENT
        // =================================================

        document.getElementById(
            "showDepartment"
        ).textContent =
            complaint.department ||
            "N/A";


        // =================================================
        // STATUS
        // =================================================

        const statusElement =
            document.getElementById(
                "showStatus"
            );


        const status =
            complaint.status ||
            "Pending";


        statusElement.textContent =
            status;


        statusElement.classList.remove(
            "status-pending",
            "status-progress",
            "status-resolved"
        );


        const normalizedStatus =
            String(status)
                .trim()
                .toLowerCase();


        if (
            normalizedStatus ===
            "in progress"
        ) {

            statusElement.classList.add(
                "status-progress"
            );

        }

        else if (
            normalizedStatus ===
            "resolved"
        ) {

            statusElement.classList.add(
                "status-resolved"
            );

        }

        else {

            statusElement.classList.add(
                "status-pending"
            );

        }


        // =================================================
        // DATE
        // =================================================

        document.getElementById(
            "showDate"
        ).textContent =
            complaint.createdAt
                ? new Date(
                    complaint.createdAt
                ).toLocaleString(
                    "en-IN"
                )
                : "N/A";


        // =================================================
        // PHOTO
        // =================================================

        const photoElement =
            document.getElementById(
                "showPhoto"
            );


        const noPhotoElement =
            document.getElementById(
                "noPhoto"
            );


        if (complaint.photo) {

            photoElement.src =
                `https://10.65.152.42:5000/uploads/${complaint.photo}`;

            photoElement.style.display =
                "block";


            noPhotoElement.style.display =
                "none";

        }

        else {

            photoElement.style.display =
                "none";


            noPhotoElement.style.display =
                "block";

        }

    }

    catch (error) {

        console.error(
            "Complaint View Error:",
            error
        );


        alert(
            "Unable to load complaint details."
        );


        window.location.href =
            "my-complaints.html";

    }

}