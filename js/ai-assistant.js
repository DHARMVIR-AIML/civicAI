// =====================================================
// JanSudhar - SMART AI CIVIC ASSISTANT
// FREE MULTILINGUAL TEXT + VOICE + LOCATION
// English + Hindi + Hinglish + Odia + Roman Odia
// =====================================================


// =====================================================
// ELEMENTS
// =====================================================

const complaintText =
    document.getElementById("complaintText");

const voiceBtn =
    document.getElementById("voiceBtn");

const sendBtn =
    document.getElementById("sendBtn");

const aiChat =
    document.getElementById("aiChat");

const aiResult =
    document.getElementById("aiResult");

const aiStatus =
    document.getElementById("aiStatus");

const aiTitle =
    document.getElementById("aiTitle");

const aiRequestType =
    document.getElementById("aiRequestType");

const aiCategory =
    document.getElementById("aiCategory");

const aiDescription =
    document.getElementById("aiDescription");

const aiLocation =
    document.getElementById("aiLocation");

const editComplaintBtn =
    document.getElementById("editComplaintBtn");

const continueComplaintBtn =
    document.getElementById("continueComplaintBtn");


// =====================================================
// LOGIN CHECK
// =====================================================

const userData =
    localStorage.getItem("user");

const userToken =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

if (!userData || !userToken) {

    alert("Please login first.");

    window.location.href =
        "login.html";
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
// USER MESSAGE
// =====================================================

function addUserMessage(message) {

    if (!aiChat) return;

    const div =
        document.createElement("div");

    div.className =
        "user-message-box";

    div.innerHTML = `
        <div class="message-content">

            <strong>You</strong>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

        <div class="message-icon">
            👤
        </div>
    `;

    aiChat.appendChild(div);

    aiChat.scrollTop =
        aiChat.scrollHeight;
}


// =====================================================
// AI MESSAGE
// =====================================================

function addAIMessage(message) {

    if (!aiChat) return;

    const div =
        document.createElement("div");

    div.className =
        "ai-message-box";

    div.innerHTML = `
        <div class="message-icon">
            🤖
        </div>

        <div class="message-content">

            <strong>
                JanSudhar Assistant
            </strong>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>
    `;

    aiChat.appendChild(div);

    aiChat.scrollTop =
        aiChat.scrollHeight;
}


// =====================================================
// LANGUAGE DETECTION
// =====================================================

function detectLanguage(text) {

    if (!text) {
        return "English";
    }

    const value =
        text.toLowerCase().trim();


    // =================================================
    // ODIA UNICODE
    // =================================================

    const odiaMatches =
        value.match(/[\u0B00-\u0B7F]/g);

    if (
        odiaMatches &&
        odiaMatches.length >= 2
    ) {

        return "Odia";
    }


    // =================================================
    // HINDI UNICODE
    // =================================================

    const hindiMatches =
        value.match(/[\u0900-\u097F]/g);

    if (
        hindiMatches &&
        hindiMatches.length >= 2
    ) {

        return "Hindi";
    }


    // =================================================
    // ROMAN ODIA
    // =================================================

    const romanOdiaWords = [

        "mora",
        "mu",
        "mo",
        "mate",
        "mote",
        "amaku",
        "ama",
        "apana",
        "apananka",
        "tanka",

        "kemiti",
        "kana",
        "kahinki",
        "kouthi",

        "eithi",
        "ethare",
        "seithi",
        "sethare",

        "achhi",
        "achi",
        "nahin",
        "nahi",

        "darkar",
        "karantu",
        "kariba",
        "karuchhi",

        "heichi",
        "heuchhi",

        "rasta",
        "sadak",

        "pani",

        "alia",
        "abargana",

        "bijuli",
        "bidyut",

        "andhara",

        "nali",
        "nala",

        "grama",
        "sahara",

        "banchantu",
        "samadhana",
        "samasa"
    ];

    let romanOdiaScore = 0;

    romanOdiaWords.forEach(word => {

        const regex =
            new RegExp(
                "\\b" +
                word +
                "\\b",
                "i"
            );

        if (regex.test(value)) {

            romanOdiaScore++;
        }
    });


    if (romanOdiaScore >= 2) {

        return "Roman Odia";
    }


    // =================================================
    // HINGLISH
    // =================================================

    const hinglishWords = [

        "mera",
        "meri",
        "mere",
        "mujhe",
        "mujko",

        "hamara",
        "hamare",
        "hum",

        "aap",
        "aapka",
        "aapki",

        "kya",
        "kyu",
        "kyon",

        "kaise",
        "kahan",

        "yaha",
        "waha",

        "nahi",
        "nahin",

        "hai",
        "hain",

        "chahiye",

        "karna",
        "karo",

        "problem",
        "samasy",

        "sadak",
        "gaddha",
        "khadda",

        "bijli",
        "current",

        "pani",

        "kachra",

        "nali",
        "naala",

        "road",
        "light"
    ];

    let hinglishScore = 0;

    hinglishWords.forEach(word => {

        const regex =
            new RegExp(
                "\\b" +
                word +
                "\\b",
                "i"
            );

        if (regex.test(value)) {

            hinglishScore++;
        }
    });


    if (hinglishScore >= 2) {

        return "Hinglish";
    }


    // =================================================
    // ENGLISH
    // =================================================

    return "English";
}


// =====================================================
// VOICE RECOGNITION
// =====================================================

let recognition = null;

let isListening = false;


const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


// =====================================================
// INITIALIZE SPEECH RECOGNITION
// =====================================================

if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    recognition.maxAlternatives =
        1;


    // IMPORTANT
    // No Hindi language is forced here.

    recognition.lang =
        "en-IN";


    // =================================================
    // START
    // =================================================

    recognition.onstart =
        function () {

            isListening =
                true;


            if (voiceBtn) {

                voiceBtn.classList.add(
                    "listening"
                );

                voiceBtn.innerHTML =
                    "🔴 Stop Recording";
            }


            if (aiStatus) {

                aiStatus.textContent =
                    "🎤 Listening... Speak your complaint.";
            }
        };


    // =================================================
    // RESULT
    // =================================================

    recognition.onresult =
        function (event) {

            let transcript = "";


            try {

                transcript =
                    event.results[0][0]
                        .transcript
                        .trim();

            }

            catch (error) {

                console.error(
                    "Speech result error:",
                    error
                );

                return;
            }


            if (!transcript) {

                if (aiStatus) {

                    aiStatus.textContent =
                        "⚠️ No speech detected.";
                }

                return;
            }


            // =================================================
            // DETECT LANGUAGE
            // =================================================

            const detectedLanguage =
                detectLanguage(transcript);


            console.log(
                "Detected Language:",
                detectedLanguage
            );


            // =================================================
            // PUT RESULT INTO TEXTBOX
            // =================================================

            if (complaintText) {

                complaintText.value =
                    transcript;
            }


            if (aiStatus) {

                aiStatus.textContent =
                    `✅ Voice captured. Detected: ${detectedLanguage}`;
            }


            addUserMessage(
                transcript
            );


            // =================================================
            // SAVE LANGUAGE
            // =================================================

            localStorage.setItem(
                "aiLanguage",
                detectedLanguage
            );


            // =================================================
            // ANALYZE
            // =================================================

            analyzeComplaint();
        };


    // =================================================
    // ERROR
    // =================================================

    recognition.onerror =
        function (event) {

            console.error(
                "Speech Recognition Error:",
                event.error
            );


            isListening =
                false;


            if (voiceBtn) {

                voiceBtn.classList.remove(
                    "listening"
                );

                voiceBtn.innerHTML =
                    "🎤 <span>Speak Complaint</span>";
            }


            if (!aiStatus) return;


            if (
                event.error ===
                "not-allowed"
            ) {

                aiStatus.textContent =
                    "⚠️ Microphone permission denied.";
            }

            else if (
                event.error ===
                "no-speech"
            ) {

                aiStatus.textContent =
                    "⚠️ No speech detected. Please try again.";
            }

            else if (
                event.error ===
                "network"
            ) {

                aiStatus.textContent =
                    "⚠️ Speech recognition network error.";
            }

            else {

                aiStatus.textContent =
                    "⚠️ Voice recognition failed.";
            }
        };


    // =================================================
    // END
    // =================================================

    recognition.onend =
        function () {

            isListening =
                false;


            if (voiceBtn) {

                voiceBtn.classList.remove(
                    "listening"
                );

                voiceBtn.innerHTML =
                    "🎤 <span>Speak Complaint</span>";
            }
        };
}


// =====================================================
// VOICE BUTTON
// =====================================================

if (voiceBtn) {

    voiceBtn.addEventListener(
        "click",
        function () {

            if (!recognition) {

                alert(
                    "Voice recognition is not supported. Please use Google Chrome or Microsoft Edge."
                );

                return;
            }


            if (isListening) {

                recognition.stop();

                return;
            }


            try {

                // =================================================
                // IMPORTANT
                // Always use English Indian recognition.
                // No Hindi selector.
                // =================================================

                recognition.lang =
                    "en-IN";


                recognition.start();

            }

            catch (error) {

                console.error(
                    "Voice Start Error:",
                    error
                );
            }
        }
    );
}


// =====================================================
// SEND BUTTON
// =====================================================

if (sendBtn) {

    sendBtn.addEventListener(
        "click",
        analyzeComplaint
    );
}


// =====================================================
// ENTER KEY
// =====================================================

if (complaintText) {

    complaintText.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                analyzeComplaint();
            }
        }
    );
}


// =====================================================
// ANALYZE COMPLAINT
// =====================================================

async function analyzeComplaint() {

    if (!complaintText) return;


    const text =
        complaintText.value.trim();


    // =================================================
    // EMPTY
    // =================================================

    if (!text) {

        alert(
            "Please tell me your civic problem first."
        );

        complaintText.focus();

        return;
    }


    // =================================================
    // LANGUAGE
    // =================================================

    const detectedLanguage =
        detectLanguage(text);


    console.log(
        "JanSudhar Language:",
        detectedLanguage
    );


    localStorage.setItem(
        "aiLanguage",
        detectedLanguage
    );


    // =================================================
    // USER MESSAGE
    // =================================================

    const lastMessage =
        aiChat
            ? aiChat.lastElementChild
            : null;


    if (
        !lastMessage ||
        !lastMessage.classList.contains(
            "user-message-box"
        )
    ) {

        addUserMessage(text);
    }


    // =================================================
    // DISABLE BUTTONS
    // =================================================

    if (sendBtn) {

        sendBtn.disabled =
            true;
    }


    if (voiceBtn) {

        voiceBtn.disabled =
            true;
    }


    if (aiStatus) {

        aiStatus.textContent =
            `🤖 JanSudhar is analyzing your complaint... (${detectedLanguage})`;
    }


    try {

        // =================================================
        // BACKEND
        // =================================================

        const response =
            await fetch(
                "/api/ai/analyze",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        complaint: text,

                        language:
                            detectedLanguage
                    })
                }
            );


        // =================================================
        // JSON
        // =================================================

        let data;

        try {

            data =
                await response.json();

        }

        catch (jsonError) {

            throw new Error(
                "Server returned an invalid response."
            );
        }


        console.log(
            "JanSudhar Response:",
            data
        );


        // =================================================
        // ERROR
        // =================================================

        if (!response.ok) {

            throw new Error(
                data.message ||
                "AI analysis failed."
            );
        }


        // =================================================
        // RESULT
        // =================================================

        if (
            !data.success ||
            !data.result
        ) {

            throw new Error(
                data.message ||
                "AI did not return complaint information."
            );
        }


        // =================================================
        // SHOW RESULT
        // =================================================

        showResult(
            data.result,
            detectedLanguage
        );
    }

    catch (error) {

        console.error(
            "AI Analysis Error:",
            error
        );


        if (aiStatus) {

            aiStatus.textContent =
                "⚠️ " +
                error.message;
        }


        addAIMessage(
            "AI Error: " +
            error.message
        );
    }


    finally {

        if (sendBtn) {

            sendBtn.disabled =
                false;
        }


        if (voiceBtn) {

            voiceBtn.disabled =
                false;
        }
    }
}


// =====================================================
// SHOW RESULT
// =====================================================

function showResult(
    result,
    detectedLanguage = "English"
) {

    if (!result) return;


    const title =
        result.title ||
        "Civic Issue";


    const requestType =
        result.requestType ||
        "Complaint";


    const category =
        result.category ||
        "Other";


    const description =
        result.description ||
        complaintText.value.trim();


    const priority =
        result.priority ||
        "Medium";


    // =================================================
    // DISPLAY
    // =================================================

    if (aiTitle) {

        aiTitle.textContent =
            title;
    }


    if (aiRequestType) {

        aiRequestType.textContent =
            requestType;
    }


    if (aiCategory) {

        aiCategory.textContent =
            category;
    }


    if (aiDescription) {

        aiDescription.textContent =
            description;
    }


    // =================================================
    // LOCATION
    // =================================================

    if (aiLocation) {

        aiLocation.textContent =
            "📍 Getting your current location...";
    }


    if (aiResult) {

        aiResult.style.display =
            "block";
    }


    if (aiStatus) {

        aiStatus.textContent =
            `🤖 Complaint understood. Language: ${detectedLanguage} | Category: ${category} | Priority: ${priority}`;
    }


    // =================================================
    // AI MESSAGE
    // =================================================

    addAIMessage(
        `I understood your complaint as "${title}". Category: ${category}. Request type: ${requestType}. Priority: ${priority}.`
    );


    // =================================================
    // LOCATION
    // =================================================

    getCurrentLocation();


    // =================================================
    // SCROLL
    // =================================================

    if (aiResult) {

        aiResult.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// =====================================================
// GET CURRENT LOCATION
// =====================================================

function getCurrentLocation() {

    if (!aiLocation) return;


    if (!navigator.geolocation) {

        aiLocation.textContent =
            "Location is not supported by this browser.";

        return;
    }


    aiLocation.textContent =
        "📍 Requesting location permission...";


    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;


            console.log(
                "Current Coordinates:",
                lat,
                lng
            );


            aiLocation.textContent =
                "📍 Finding address...";


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


                const response =
                    await fetch(url);


                if (!response.ok) {

                    throw new Error(
                        "Address lookup failed."
                    );
                }


                const data =
                    await response.json();


                const address =
                    data.display_name ||
                    `${lat.toFixed(6)}, ${lng.toFixed(6)}`;


                aiLocation.textContent =
                    address;


                localStorage.setItem(
                    "aiLocation",
                    address
                );

                localStorage.setItem(
                    "aiLatitude",
                    String(lat)
                );

                localStorage.setItem(
                    "aiLongitude",
                    String(lng)
                );


                if (aiStatus) {

                    aiStatus.textContent =
                        "✅ Complaint analyzed and location detected.";
                }
            }

            catch (error) {

                console.error(
                    "Reverse Geocoding Error:",
                    error
                );


                const coordinates =
                    `${lat.toFixed(6)}, ${lng.toFixed(6)}`;


                aiLocation.textContent =
                    coordinates;


                localStorage.setItem(
                    "aiLocation",
                    coordinates
                );

                localStorage.setItem(
                    "aiLatitude",
                    String(lat)
                );

                localStorage.setItem(
                    "aiLongitude",
                    String(lng)
                );


                if (aiStatus) {

                    aiStatus.textContent =
                        "📍 GPS location detected.";
                }
            }
        },


        function (error) {

            console.error(
                "Geolocation Error:",
                error
            );


            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                aiLocation.textContent =
                    "⚠️ Location permission denied.";

                if (aiStatus) {

                    aiStatus.textContent =
                        "Please allow location permission.";
                }
            }

            else if (
                error.code ===
                error.TIMEOUT
            ) {

                aiLocation.textContent =
                    "⚠️ Location request timed out.";
            }

            else {

                aiLocation.textContent =
                    "⚠️ Unable to detect location.";
            }
        },


        {

            enableHighAccuracy: true,

            timeout: 20000,

            maximumAge: 0
        }
    );
}


// =====================================================
// SAVE AI DATA
// =====================================================

function saveAIData() {

    if (aiTitle) {

        localStorage.setItem(
            "aiTitle",
            aiTitle.textContent.trim()
        );
    }


    if (aiRequestType) {

        localStorage.setItem(
            "aiRequestType",
            aiRequestType.textContent.trim()
        );
    }


    if (aiCategory) {

        localStorage.setItem(
            "aiCategory",
            aiCategory.textContent.trim()
        );
    }


    if (aiDescription) {

        localStorage.setItem(
            "aiDescription",
            aiDescription.textContent.trim()
        );
    }


    if (aiLocation) {

        localStorage.setItem(
            "aiLocation",
            aiLocation.textContent.trim()
        );
    }
}


// =====================================================
// EDIT COMPLAINT
// =====================================================

if (editComplaintBtn) {

    editComplaintBtn.addEventListener(
        "click",
        function () {

            saveAIData();

            window.location.href =
                "complaint.html";
        }
    );
}


// =====================================================
// CONTINUE TO SUBMIT
// =====================================================

if (continueComplaintBtn) {

    continueComplaintBtn.addEventListener(
        "click",
        function () {

            const title =
                aiTitle
                    ? aiTitle.textContent.trim()
                    : "";

            const requestType =
                aiRequestType
                    ? aiRequestType.textContent.trim()
                    : "";

            const category =
                aiCategory
                    ? aiCategory.textContent.trim()
                    : "";

            const description =
                aiDescription
                    ? aiDescription.textContent.trim()
                    : "";

            const location =
                aiLocation
                    ? aiLocation.textContent.trim()
                    : "";


            // =================================================
            // VALIDATION
            // =================================================

            if (
                !title ||
                !requestType ||
                !category ||
                !description
            ) {

                alert(
                    "Complaint information is incomplete."
                );

                return;
            }


            if (
                !location ||
                location.includes(
                    "Getting your current"
                ) ||
                location.includes(
                    "Requesting location"
                ) ||
                location.includes(
                    "Finding address"
                )
            ) {

                alert(
                    "Please wait until your current location is detected."
                );

                return;
            }


            // =================================================
            // SAVE
            // =================================================

            saveAIData();


            // =================================================
            // OPEN COMPLAINT FORM
            // =================================================

            window.location.href =
                "complaint.html";
        }
    );
}


// =====================================================
// PAGE LOADED
// =====================================================

console.log(
    "✅ JanSudhar Automatic Multilingual Assistant Loaded Successfully"
);

console.log(
    "🌐 English | Hindi | Hinglish | Odia | Roman Odia"
);