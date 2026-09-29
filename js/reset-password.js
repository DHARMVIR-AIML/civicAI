document
    .getElementById("resetPasswordForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const newPassword =
            document.getElementById("newPassword").value.trim();

        const confirmPassword =
            document.getElementById("confirmPassword").value.trim();

        const email =
            localStorage.getItem("resetEmail");

        const otp =
            localStorage.getItem("resetOTP");


        // Check email and OTP
        if (!email || !otp) {

            alert(
                "Reset session expired. Please request OTP again."
            );

            window.location.href =
                "forgot-password.html";

            return;
        }


        if (!newPassword || !confirmPassword) {

            alert("Please enter both passwords.");

            return;
        }


        if (newPassword.length < 6) {

            alert(
                "Password must be at least 6 characters."
            );

            return;
        }


        if (newPassword !== confirmPassword) {

            alert(
                "Passwords do not match."
            );

            return;
        }


        try {

            const response = await fetch(
                "https://10.65.152.42:5000/api/auth/reset-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        otp: otp,
                        newPassword: newPassword
                    })
                }
            );


            const data = await response.json();


            if (response.ok) {

                alert(
                    "Password reset successfully! Please login with your new password."
                );

                localStorage.removeItem("resetEmail");
                localStorage.removeItem("resetOTP");

                window.location.href =
                    "login.html";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(
                "Reset Password Error:",
                error
            );

            alert(
                "Server error occurred."
            );

        }

    });