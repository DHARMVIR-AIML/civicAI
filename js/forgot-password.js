document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document
            .getElementById("email")
            .value
            .trim();

        if (!email) {
            alert("Please enter your email.");
            return;
        }

        console.log("Forgot Password Email:", email);

        try {

            const response = await fetch(
                "https://10.65.152.42:5000/api/auth/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email
                    })
                }
            );

            console.log("Response Status:", response.status);

            const data = await response.json();

            console.log("Server Response:", data);

            if (response.ok) {

                alert(
                    "OTP has been sent to your registered email."
                );

                localStorage.setItem(
                    "resetEmail",
                    email
                );

                window.location.href = "verify-otp.html";

            } else {

                alert(
                    data.message || "Something went wrong."
                );

            }

        } catch (error) {

            console.error(
                "Forgot Password Error:",
                error
            );

            alert(
                "Server error occurred."
            );
        }

    });