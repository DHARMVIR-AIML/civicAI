document.addEventListener("DOMContentLoaded", () => {

    const API_BASE = "/api/auth";

    const usersTableBody =
        document.getElementById("usersTableBody");

    const messageBox =
        document.getElementById("adminManagementMessage");

    const adminToken =
        localStorage.getItem("adminToken");


    // =====================================================
    // DEPARTMENT MODAL ELEMENTS
    // =====================================================

    const departmentModal =
        document.getElementById("departmentModal");

    const closeDepartmentModal =
        document.getElementById("closeDepartmentModal");

    const cancelDepartmentBtn =
        document.getElementById("cancelDepartmentBtn");

    const confirmMakeAdminBtn =
        document.getElementById("confirmMakeAdminBtn");

    const departmentCheckboxes =
        document.querySelectorAll(".department-checkbox-input");


    // Currently selected user
    let selectedUserId = null;


    // =====================================================
    // CHECK LOGIN
    // =====================================================

    if (!adminToken) {

        alert("Please login as Super Admin.");

        window.location.href = "admin-login.html";

        return;
    }


    // =====================================================
    // LOAD USERS
    // =====================================================

    async function loadUsers() {

        try {

            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="admin-empty-state">
                        Loading users...
                    </td>
                </tr>
            `;


            const response = await fetch(
                `${API_BASE}/users`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${adminToken}`
                    }
                }
            );


            const data =
                await response.json();


            console.log(
                "Users API Response:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to load users"
                );

            }


            displayUsers(data.users);

        } catch (error) {

            console.error(
                "Load Users Error:",
                error
            );


            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="admin-empty-state">
                        ${escapeHTML(error.message)}
                    </td>
                </tr>
            `;

        }

    }


    // =====================================================
    // DISPLAY USERS
    // =====================================================

    function displayUsers(users) {

        if (!users || users.length === 0) {

            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="admin-empty-state">
                        No registered users found.
                    </td>
                </tr>
            `;

            return;
        }


        usersTableBody.innerHTML = "";


        users.forEach((user, index) => {

            const row =
                document.createElement("tr");


            // =================================================
            // ROLE
            // =================================================

            let roleHTML = "";


            if (user.role === "superadmin") {

                roleHTML = `
                    <span class="role-badge superadmin">
                        🛡️ Super Admin
                    </span>
                `;

            }

            else if (user.role === "admin") {

                roleHTML = `
                    <span class="role-badge admin">
                        👑 Admin
                    </span>
                `;

            }

            else {

                roleHTML = `
                    <span class="role-badge user">
                        👤 User
                    </span>
                `;

            }


            // =================================================
            // ACTION
            // =================================================

            let actionHTML = "";


            if (user.role === "superadmin") {

                actionHTML = `
                    <button
                        type="button"
                        class="role-btn protected-btn"
                        disabled
                    >
                        🔒 Protected
                    </button>
                `;

            }

            else if (user.role === "admin") {

                actionHTML = `
                    <button
                        type="button"
                        class="role-btn make-user-btn"
                        data-id="${user._id}"
                        data-role="user"
                    >
                        ↓ Make User
                    </button>
                `;

            }

            else {

                actionHTML = `
                    <button
                        type="button"
                        class="role-btn make-admin-btn"
                        data-id="${user._id}"
                        data-role="admin"
                    >
                        ↑ Make Admin
                    </button>
                `;

            }


            // =================================================
            // ROW
            // =================================================

            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(user.name)}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(user.email)}
                </td>

                <td>
                    ${roleHTML}
                </td>

                <td>
                    ${actionHTML}
                </td>

            `;


            usersTableBody.appendChild(row);

        });


        // =====================================================
        // BUTTON EVENTS
        // =====================================================

        const buttons =
            document.querySelectorAll(
                ".role-btn:not([disabled])"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                changeRole
            );

        });

    }


    // =====================================================
    // CHANGE ROLE
    // =====================================================

    async function changeRole(event) {

        const button =
            event.currentTarget;


        const userId =
            button.dataset.id;


        const newRole =
            button.dataset.role;


        // =================================================
        // MAKE ADMIN
        // =================================================

        if (newRole === "admin") {

            openDepartmentModal(userId);

            return;
        }


        // =================================================
        // MAKE USER
        // =================================================

        const message =
            "Do you want to change this Admin to User?";


        if (!confirm(message)) {

            return;
        }


        await updateRole(
            userId,
            "user",
            []
        );

    }


    // =====================================================
    // OPEN DEPARTMENT MODAL
    // =====================================================

    function openDepartmentModal(userId) {

        selectedUserId = userId;


        // Clear previous selections

        departmentCheckboxes.forEach(
            checkbox => {
                checkbox.checked = false;
            }
        );


        if (departmentModal) {

            departmentModal.style.display =
                "flex";

        }

    }


    // =====================================================
    // CLOSE DEPARTMENT MODAL
    // =====================================================

    function closeModal() {

        selectedUserId = null;


        departmentCheckboxes.forEach(
            checkbox => {
                checkbox.checked = false;
            }
        );


        if (departmentModal) {

            departmentModal.style.display =
                "none";

        }

    }


    // =====================================================
    // CLOSE BUTTON
    // =====================================================

    if (closeDepartmentModal) {

        closeDepartmentModal.addEventListener(
            "click",
            closeModal
        );

    }


    // =====================================================
    // CANCEL BUTTON
    // =====================================================

    if (cancelDepartmentBtn) {

        cancelDepartmentBtn.addEventListener(
            "click",
            closeModal
        );

    }


    // =====================================================
    // CONFIRM MAKE ADMIN
    // =====================================================

    if (confirmMakeAdminBtn) {

        confirmMakeAdminBtn.addEventListener(
            "click",
            async () => {

                // =============================================
                // CHECK USER
                // =============================================

                if (!selectedUserId) {

                    alert(
                        "User not selected."
                    );

                    return;
                }


                // =============================================
                // GET SELECTED DEPARTMENTS
                // =============================================

                const selectedDepartments = [];


                departmentCheckboxes.forEach(
                    checkbox => {

                        if (checkbox.checked) {

                            selectedDepartments.push(
                                checkbox.value
                            );

                        }

                    }
                );


                // =============================================
                // AT LEAST ONE DEPARTMENT REQUIRED
                // =============================================

                if (
                    selectedDepartments.length === 0
                ) {

                    alert(
                        "Please select at least one department."
                    );

                    return;
                }


                console.log(
                    "Selected Departments:",
                    selectedDepartments
                );


                // =============================================
                // BUTTON LOADING
                // =============================================

                confirmMakeAdminBtn.disabled =
                    true;

                confirmMakeAdminBtn.textContent =
                    "Updating...";


                // =============================================
                // UPDATE ROLE
                // =============================================

                const success =
                    await updateRole(
                        selectedUserId,
                        "admin",
                        selectedDepartments
                    );


                // =============================================
                // RESET BUTTON
                // =============================================

                confirmMakeAdminBtn.disabled =
                    false;

                confirmMakeAdminBtn.textContent =
                    "✓ Make Admin";


                // =============================================
                // CLOSE MODAL
                // =============================================

                if (success) {

                    closeModal();

                }

            }
        );

    }


    // =====================================================
    // UPDATE ROLE API
    // =====================================================

    async function updateRole(
        userId,
        role,
        departments = []
    ) {

        try {

            const response =
                await fetch(
                    `${API_BASE}/change-role/${userId}`,
                    {
                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${adminToken}`

                        },

                        body: JSON.stringify({

                            role: role,

                            departments:
                                departments

                        })

                    }
                );


            const data =
                await response.json();


            console.log(
                "Change Role Response:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Role change failed"
                );

            }


            showMessage(
                data.message ||
                "Role changed successfully.",
                true
            );


            // Reload users

            await loadUsers();


            return true;


        } catch (error) {

            console.error(
                "Change Role Error:",
                error
            );


            showMessage(
                error.message,
                false
            );


            return false;

        }

    }


    // =====================================================
    // MESSAGE
    // =====================================================

    function showMessage(
        message,
        success
    ) {

        if (!messageBox) {

            alert(message);

            return;
        }


        messageBox.textContent =
            message;


        messageBox.style.display =
            "block";


        messageBox.className =
            success
                ? "admin-management-message success"
                : "admin-management-message error";


        setTimeout(() => {

            messageBox.style.display =
                "none";

        }, 3000);

    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHTML(value) {

        return String(value || "")
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    // =====================================================
    // START
    // =====================================================

    loadUsers();

});