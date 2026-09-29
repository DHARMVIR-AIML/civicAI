// =====================================================
// JanSudhar - COMPLAINT PAGE
// LOCATION + MAP + PHOTO + COMPLAINT SUBMISSION
// =====================================================


// =====================================================
// LOCATION ELEMENTS
// =====================================================

const locationInput = document.getElementById("location");
const locationSuggestions = document.getElementById("locationSuggestions");


// =====================================================
// MAP
// =====================================================

const DEFAULT_LAT = 20.2961;
const DEFAULT_LNG = 85.8245;

let map = L.map("map").setView(
    [DEFAULT_LAT, DEFAULT_LNG],
    13
);


// OpenStreetMap
L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);


let marker = null;


// =====================================================
// MAP MARKER
// =====================================================

function updateMarker(lat, lng) {

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lng]).addTo(map);

    map.setView(
        [lat, lng],
        16
    );
}


// =====================================================
// SET LOCATION
// =====================================================

function setLocation(lat, lng, address) {

    updateMarker(lat, lng);

    locationInput.value =
        address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    hideSuggestions();

    if (marker) {

        marker.bindPopup(
            "<strong>📍 Selected Location</strong><br>" +
            escapeHTML(
                address || "Selected Location"
            )
        ).openPopup();
    }
}


// =====================================================
// HIDE SUGGESTIONS
// =====================================================

function hideSuggestions() {

    if (!locationSuggestions) {
        return;
    }

    locationSuggestions.innerHTML = "";

    locationSuggestions.style.display = "none";
}


// =====================================================
// MAP CLICK
// MAP → ADDRESS
// =====================================================

map.on("click", async function (event) {

    const lat = event.latlng.lat;
    const lng = event.latlng.lng;

    updateMarker(lat, lng);

    locationInput.value = "Finding location...";

    try {

        const url =
            "https://nominatim.openstreetmap.org/reverse?" +
            new URLSearchParams({

                lat: lat,
                lon: lng,
                format: "jsonv2",
                addressdetails: "1",
                zoom: "18",
                "accept-language": "en"

            });

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Reverse location failed");
        }

        const data = await response.json();

        const address =
            data.display_name ||
            `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        locationInput.value = address;

        if (marker) {

            marker.bindPopup(
                "<strong>📍 Selected Location</strong><br>" +
                escapeHTML(address)
            ).openPopup();
        }

    } catch (error) {

        console.error(
            "Reverse Geocoding Error:",
            error
        );

        locationInput.value =
            `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

});


// =====================================================
// LOCATION SEARCH
// =====================================================

let searchTimer = null;

locationInput.addEventListener(
    "input",
    function () {

        const text = this.value.trim();

        clearTimeout(searchTimer);

        hideSuggestions();

        if (text.length < 2) {
            return;
        }

        searchTimer = setTimeout(
            function () {
                searchLocation(text);
            },
            700
        );

    }
);


// =====================================================
// SEARCH LOCATION
// =====================================================

async function searchLocation(query) {

    try {

        locationSuggestions.innerHTML = `
            <div class="location-searching">
                🔎 Searching location...
            </div>
        `;

        locationSuggestions.style.display = "block";


        // ---------------------------------------------
        // SEARCH 1 - INDIA
        // ---------------------------------------------

        let results = await nominatimSearch(
            query,
            true
        );


        // ---------------------------------------------
        // SEARCH 2 - WITHOUT COUNTRY FILTER
        // ---------------------------------------------

        if (results.length === 0) {

            results = await nominatimSearch(
                query,
                false
            );
        }


        // ---------------------------------------------
        // SEARCH 3 - INDIA ADDED
        // ---------------------------------------------

        if (results.length === 0) {

            results = await nominatimSearch(
                query + ", India",
                false
            );
        }


        // ---------------------------------------------
        // NO RESULT
        // ---------------------------------------------

        if (results.length === 0) {

            locationSuggestions.innerHTML = `
                <div class="location-no-result">

                    📍 Location not found

                    <small>
                        Try city, village, area,
                        road, landmark or PIN code.
                    </small>

                </div>
            `;

            locationSuggestions.style.display = "block";

            return;
        }


        // ---------------------------------------------
        // REMOVE DUPLICATES
        // ---------------------------------------------

        const unique = [];

        const seen = new Set();


        results.forEach(function (item) {

            const key =
                item.lat + "," + item.lon;

            if (!seen.has(key)) {

                seen.add(key);

                unique.push(item);
            }

        });


        // ---------------------------------------------
        // SHOW RESULTS
        // ---------------------------------------------

        locationSuggestions.innerHTML = "";


        unique.slice(0, 10).forEach(
            function (item) {

                const div =
                    document.createElement("div");

                div.className =
                    "location-suggestion-item";


                const type =
                    getLocationType(item);


                div.innerHTML = `

                    <span class="location-pin">
                        📍
                    </span>

                    <div class="location-suggestion-content">

                        <strong>
                            ${escapeHTML(type)}
                        </strong>

                        <span>
                            ${escapeHTML(
                                item.display_name
                            )}
                        </span>

                    </div>

                `;


                div.addEventListener(
                    "click",
                    function () {

                        const lat =
                            parseFloat(item.lat);

                        const lng =
                            parseFloat(item.lon);


                        setLocation(
                            lat,
                            lng,
                            item.display_name
                        );

                    }
                );


                locationSuggestions.appendChild(div);

            }
        );


        locationSuggestions.style.display =
            "block";


    } catch (error) {

        console.error(
            "Location Search Error:",
            error
        );


        locationSuggestions.innerHTML = `
            <div class="location-no-result">

                ⚠️ Unable to search location.

                <small>
                    Please check your internet connection.
                </small>

            </div>
        `;

        locationSuggestions.style.display =
            "block";
    }

}


// =====================================================
// NOMINATIM SEARCH
// =====================================================

async function nominatimSearch(
    query,
    indiaOnly
) {

    try {

        const params = new URLSearchParams({

            q: query,

            format: "jsonv2",

            addressdetails: "1",

            limit: "10",

            dedupe: "1",

            "accept-language": "en"

        });


        if (indiaOnly) {

            params.set(
                "countrycodes",
                "in"
            );
        }


        const url =
            "https://nominatim.openstreetmap.org/search?" +
            params.toString();


        const response =
            await fetch(url);


        if (!response.ok) {
            return [];
        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {
            return [];
        }


        return data;

    } catch (error) {

        console.error(
            "Nominatim Error:",
            error
        );

        return [];
    }

}


// =====================================================
// LOCATION TYPE
// =====================================================

function getLocationType(item) {

    if (item.type) {

        return item.type
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                function (letter) {
                    return letter.toUpperCase();
                }
            );
    }


    if (item.class) {

        return item.class
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                function (letter) {
                    return letter.toUpperCase();
                }
            );
    }


    return "Location";
}


// =====================================================
// SAFE HTML
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// =====================================================
// CLOSE LOCATION SUGGESTIONS
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        const wrapper =
            document.querySelector(
                ".location-search-wrapper"
            );


        if (
            wrapper &&
            !wrapper.contains(event.target)
        ) {

            hideSuggestions();
        }

    }
);


// =====================================================
// PHOTO PREVIEW
// =====================================================

const photoInput =
    document.getElementById("photo");

const preview =
    document.getElementById("preview");


if (photoInput && preview) {

    photoInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];


            if (!file) {

                preview.style.display =
                    "none";

                return;
            }


            preview.src =
                URL.createObjectURL(file);

            preview.style.display =
                "block";

        }
    );
}

// =====================================================
// LOAD AI ASSISTANT DATA
// =====================================================

function loadAIComplaintData() {

    const aiTitle =
        localStorage.getItem("aiTitle");

    const aiRequestType =
        localStorage.getItem("aiRequestType");

    const aiCategory =
        localStorage.getItem("aiCategory");

    const aiDescription =
        localStorage.getItem("aiDescription");

    const aiLocation =
        localStorage.getItem("aiLocation");


    // ---------------------------------------------
    // TITLE
    // ---------------------------------------------

    if (aiTitle) {

        const titleInput =
            document.getElementById("title");

        if (titleInput) {
            titleInput.value = aiTitle;
        }
    }


    // ---------------------------------------------
    // REQUEST TYPE
    // ---------------------------------------------

    if (aiRequestType) {

        const requestTypeInput =
            document.getElementById("requestType");

        if (requestTypeInput) {

            requestTypeInput.value =
                aiRequestType;
        }
    }


    // ---------------------------------------------
    // CATEGORY
    // ---------------------------------------------

    if (aiCategory) {

        const categoryInput =
            document.getElementById("category");

        if (categoryInput) {

            categoryInput.value =
                aiCategory;
        }
    }


    // ---------------------------------------------
    // DESCRIPTION
    // ---------------------------------------------

    if (aiDescription) {

        const descriptionInput =
            document.getElementById("description");

        if (descriptionInput) {

            descriptionInput.value =
                aiDescription;
        }
    }


    // ---------------------------------------------
    // LOCATION
    // ---------------------------------------------

    if (aiLocation) {

        if (locationInput) {

            locationInput.value =
                aiLocation;
        }
    }


    // ---------------------------------------------
    // AI DATA LOADED MESSAGE
    // ---------------------------------------------

    if (
        aiTitle ||
        aiCategory ||
        aiDescription ||
        aiLocation
    ) {

        console.log(
            "✅ AI complaint data loaded successfully."
        );
    }
}


// Load AI data when complaint page opens

loadAIComplaintData();

// =====================================================
// COMPLAINT FORM
// =====================================================

const complaintForm =
    document.getElementById(
        "complaintForm"
    );


if (complaintForm) {

    complaintForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const submitButton =
                complaintForm.querySelector(
                    "button[type='submit']"
                );


            if (submitButton.disabled) {
                return;
            }


            // -----------------------------------------
            // GET LOGIN USER
            // -----------------------------------------

            const userData =
                localStorage.getItem("user");


            if (!userData) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "login.html";

                return;
            }


            let user;


            try {

                user =
                    JSON.parse(userData);

            } catch (error) {

                console.error(
                    "User data error:",
                    error
                );

                localStorage.removeItem("user");

                alert(
                    "Login session invalid. Please login again."
                );

                window.location.href =
                    "login.html";

                return;
            }


            const userId =
                user._id || user.id;


            if (!userId) {

                alert(
                    "User information not found. Please login again."
                );

                return;
            }


            // -----------------------------------------
            // GET FORM DATA
            // -----------------------------------------

            const title =
                document
                    .getElementById("title")
                    .value
                    .trim();


            const requestType =
                document
                    .getElementById("requestType")
                    .value;


            const category =
                document
                    .getElementById("category")
                    .value;


            const description =
                document
                    .getElementById("description")
                    .value
                    .trim();


            const location =
                locationInput.value.trim();


            // -----------------------------------------
            // VALIDATION
            // -----------------------------------------

            if (
                !title ||
                !requestType ||
                !category ||
                !description ||
                !location
            ) {

                alert(
                    "Please fill all fields and select a location."
                );

                return;
            }


            // -----------------------------------------
            // BUTTON
            // -----------------------------------------

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Submitting...";


            try {

                const formData =
                    new FormData();


                // IMPORTANT:
                // Current backend requires userId

                formData.append(
                    "userId",
                    userId
                );


                formData.append(
                    "title",
                    title
                );


                formData.append(
                    "requestType",
                    requestType
                );


                formData.append(
                    "category",
                    category
                );


                formData.append(
                    "description",
                    description
                );


                formData.append(
                    "location",
                    location
                );


                if (
                    photoInput &&
                    photoInput.files.length > 0
                ) {

                    formData.append(
                        "photo",
                        photoInput.files[0]
                    );
                }


                // -------------------------------------
                // SEND TO SERVER
                // -------------------------------------

               const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    user.token ||
    user.accessToken;

if (!token) {

    alert(
        "Login session expired. Please login again."
    );

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");

    window.location.href = "login.html";

    return;
}

const response =
    await fetch(
        "https://10.65.152.42:5000/api/complaints/submit",
        {
            method: "POST",

            headers: {
                "Authorization": `Bearer ${token}`
            },

            body: formData
        }
    );

                const data =
                    await response.json();


                console.log(
                    "Complaint Server Response:",
                    data
                );


                // -------------------------------------
                // SUCCESS
                // -------------------------------------

                if (response.ok) {

                    alert(
                        "Complaint submitted successfully!\n\n" +
                        "Complaint ID: " +
                        data.complaintId
                    );
                 // Clear AI Assistant data after successful submission

localStorage.removeItem("aiTitle");
localStorage.removeItem("aiRequestType");
localStorage.removeItem("aiCategory");
localStorage.removeItem("aiDescription");
localStorage.removeItem("aiLocation");

localStorage.removeItem("aiLatitude");
localStorage.removeItem("aiLongitude");

                    complaintForm.reset();


                    // Hide photo preview

                    if (preview) {

                        preview.style.display =
                            "none";
                    }


                    // Remove marker

                    if (marker) {

                        map.removeLayer(
                            marker
                        );

                        marker = null;
                    }


                    // Reset map

                    map.setView(
                        [DEFAULT_LAT, DEFAULT_LNG],
                        13
                    );


                    hideSuggestions();


                } else {

                    console.error(
                        "Server Error:",
                        data
                    );


                    alert(
                        data.message ||
                        "Failed to submit complaint."
                    );
                }


            } catch (error) {

                console.error(
                    "Complaint Submission Error:",
                    error
                );


                alert(
                    "Server se connection nahi ho paya."
                );


            } finally {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Submit Request";
            }

        }
    );
}


// =====================================================
// FINISH
// =====================================================

console.log(
    "JanSudhar Complaint Page Loaded Successfully"
);