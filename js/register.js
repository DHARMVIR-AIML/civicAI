document.getElementById("registerForm").addEventListener("submit", async function(e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Check password
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {

        const response = await fetch("https://10.65.152.42:5000/api/auth/register", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {

            alert("Registration Successful!");

            window.location.href = "login.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error("Registration Error:", error);

        alert("An error occurred during registration. Please try again later.");
    }

});