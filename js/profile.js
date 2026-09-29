let user = JSON.parse(localStorage.getItem("user"));

if (user) {

    // ===============================
    // USER INFORMATION
    // ===============================

    document.getElementById("name").textContent =
        user.name || "User";

    document.getElementById("email").textContent =
        user.email || "Not Available";


    // ===============================
    // GET USER TOKEN
    // ===============================

    function getUserToken() {

        return (
            localStorage.getItem("token") ||
            localStorage.getItem("accessToken") ||
            user.token ||
            user.accessToken
        );

    }


    // ===============================
    // LOAD USER COMPLAINT COUNT
    // ===============================

    async function loadComplaintCount() {

        try {

            const userId =
                user._id || user.id;

            const token =
                getUserToken();


            if (!userId) {

                console.error(
                    "User ID not found"
                );

                return;
            }


            if (!token) {

                console.error(
                    "Authentication token not found"
                );

                return;
            }


            const response = await fetch(
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


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to load complaints"
                );

            }


            const complaints =
                data.complaints || [];


            document.getElementById(
                "totalComplaint"
            ).textContent =
                complaints.length;


        } catch (error) {

            console.error(
                "Complaint Count Error:",
                error
            );


            document.getElementById(
                "totalComplaint"
            ).textContent =
                "0";

        }

    }


    // ===============================
    // VIEW MY COMPLAINTS
    // ===============================

    window.viewMyComplaints = function () {

        window.location.href =
            "my-complaints.html";

    };


    // ===============================
    // LOAD COMPLAINT COUNT
    // ===============================

    loadComplaintCount();


} else {

    // User login nahi hai
    window.location.href =
        "login.html";
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    localStorage.removeItem("accessToken");

    alert("Logout Successful!");

    window.location.href =
        "login.html";
}