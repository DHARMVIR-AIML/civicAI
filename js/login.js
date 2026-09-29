document.getElementById("loginForm").addEventListener("submit", async function(e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("/api/auth/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {

            alert("Login successful!");

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            if (data.token) {
                localStorage.setItem(
                    "token",
                    data.token
                );
            }

            if (data.accessToken) {
                localStorage.setItem(
                    "accessToken",
                    data.accessToken
                );
            }

            window.location.href = "dashboard.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log(error);

        alert("server error.");

    }
});