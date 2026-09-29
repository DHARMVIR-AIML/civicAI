const trackBtn = document.getElementById("trackBtn");

trackBtn.addEventListener("click", async function () {

    const complaintId =
        document.getElementById("complaintId").value.trim();

    if (!complaintId) {
        alert("Please enter Complaint ID.");
        return;
    }

    try {

        const response = await fetch(
            `https://10.65.152.42:5000/api/complaints/${complaintId}`
        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Complaint not found.");
            return;

        }

        document.getElementById("showComplaintId").textContent =
            data.complaintId;

        document.getElementById("showCategory").textContent =
            data.category;

        document.getElementById("showDescription").textContent =
            data.description;

        document.getElementById("showLocation").textContent =
            data.location;
            const photoElement = document.getElementById("showPhoto");

if (data.photo) {
    photoElement.src = `https://10.65.152.42:5000/uploads/${data.photo}`;
    photoElement.style.display = "block";
} else {
    photoElement.style.display = "none";
}

        document.getElementById("showStatus").textContent =
            data.status;
            const showPhoto = document.getElementById("showPhoto");

        if (data.photo) {
         showPhoto.src = `https://10.65.152.42:5000/uploads/${data.photo}`;
          showPhoto.style.display = "block";
} else {
    showPhoto.style.display = "none";
}

        document.getElementById("showDate").textContent =
            new Date(data.createdAt).toLocaleString();

        document.getElementById("result").style.display = "block";

    } catch (error) {

        console.error("Tracking Error:", error);

        alert("Server se connection nahi ho paya.");

    }

});