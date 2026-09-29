const adminLoginForm = document.getElementById("adminLoginForm");

adminLoginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("adminEmail").value.trim();

    const password =
        document.getElementById("adminPassword").value;


    if (!email || !password) {

        alert("Please enter email and password.");

        return;
    }


    try {

        const response = await fetch(
            "https://10.65.152.42:5000/api/auth/admin-login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Admin login failed."
            );

            return;
        }


        // =================================================
        // SAVE ADMIN INFORMATION
        // =================================================

        localStorage.setItem(
            "admin",
            JSON.stringify(data.admin)
        );


        // =================================================
        // SAVE JWT TOKEN
        // =================================================

        localStorage.setItem(
            "adminToken",
            data.token
        );


        alert(
            "Admin login successful!"
        );


        // =================================================
        // OPEN ADMIN DASHBOARD
        // =================================================

       window.location.href =
    "https://10.65.152.42:5000/admin-dashboard.html";


    } catch (error) {

        console.error(
            "Admin Login Error:",
            error
        );


        alert(
            "Unable to connect to server. Please make sure the backend server is running."
        );

    }

});