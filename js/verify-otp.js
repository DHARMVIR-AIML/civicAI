document
    .getElementById("verifyOtpForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const otp = document
            .getElementById("otp")
            .value
            .trim();

        const email = localStorage.getItem("resetEmail");

        if (!email) {

            alert("Reset email not found. Please try again.");

            window.location.href = "forgot-password.html";

            return;
        }

        if (!/^\d{6}$/.test(otp)) {

            alert("Please enter a valid 6-digit OTP.");

            return;
        }

        try {

            const response = await fetch(
                "https://10.65.152.42:5000/api/auth/verify-otp",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        otp: otp
                    })
                }
            );

            const data = await response.json();

            console.log("Verify OTP Response:", data);

            if (response.ok) {

                // IMPORTANT:
                // Save OTP for reset-password page
                localStorage.setItem(
                    "resetOTP",
                    otp
                );

                localStorage.setItem(
                    "otpVerified",
                    "true"
                );

                alert(
                    "OTP verified successfully!"
                );

                window.location.href =
                    "reset-password.html";

            } else {

                alert(
                    data.message ||
                    "Invalid OTP."
                );

            }

        } catch (error) {

            console.error(
                "Verify OTP Error:",
                error
            );

            alert(
                "An error occurred while verifying OTP. Please try again."
            );

        }

    });