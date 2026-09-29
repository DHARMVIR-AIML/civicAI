// ===============================
// MAP SETUP - OpenStreetMap
// ===============================

let map = L.map("map").setView([20.2961, 85.8245], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
}).addTo(map);

let marker = null;

map.on("click", function (e) {

    const latitude = e.latlng.lat;
    const longitude = e.latlng.lng;

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([latitude, longitude]).addTo(map);

    marker.bindPopup("Selected Location").openPopup();

    document.getElementById("location").value =
        `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
});


// ===============================
// PHOTO PREVIEW
// ===============================

const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");

if (photoInput) {

    photoInput.addEventListener("change", function () {

        const file = this.files[0];

        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";
        } else {
            preview.style.display = "none";
        }

    });

}


// ===============================
// SUGGESTION SUBMISSION
// ===============================

const suggestionForm = document.getElementById("suggestionForm");

suggestionForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();
    const location = document.getElementById("location").value.trim();

    if (!title || !category || !description || !location) {
        alert("Please fill all fields and select a location on the map.");
        return;
    }

    try {

    const response = await fetch(
        "https://10.65.152.42:5000/api/suggestions/submit",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                userId: user._id || user.id,
                title: title,
                category: category,
                description: description,
                location: location
            })
        }
    );

    const data = await response.json();

    if (response.ok) {

        alert(
            "Development suggestion submitted successfully!\n" +
            "Suggestion ID: " + data.suggestionId
        );

        suggestionForm.reset();

        if (preview) {
            preview.style.display = "none";
        }

        if (marker) {
            map.removeLayer(marker);
            marker = null;
        }

    } else {

        console.log("SERVER ERROR:", data);

        alert(
            "Failed to submit suggestion.\n" +
            (data.message || JSON.stringify(data))
        );
    }

} catch (error) {

    console.error("Suggestion Error:", error);

    alert("Server se connection nahi ho paya.");

}

});