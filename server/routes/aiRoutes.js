// =====================================================
// CIVICAI - FREE AI ROUTES
// MULTILINGUAL CIVIC COMPLAINT ANALYSIS
// NO OPENAI API REQUIRED
// Hindi + English + Odia + Hinglish
// =====================================================

const express = require("express");

const router = express.Router();


// =====================================================
// HELPER: NORMALIZE TEXT
// =====================================================

function normalizeText(text) {

    return String(text || "")
        .trim()
        .toLowerCase();

}


// =====================================================
// CATEGORY DETECTION
// =====================================================

function detectCategory(text) {

    const t = normalizeText(text);


    // -------------------------------------------------
    // ROAD
    // -------------------------------------------------

    const roadWords = [

        // English
        "road",
        "roads",
        "pothole",
        "potholes",
        
        "highway",
        "road damage",
        "damaged road",
        "broken road",

        // Hindi
        "सड़क",
        "सड़क",
        "रोड",
        "गड्ढा",
        "गड्ढे",
        "खराब सड़क",
        "टूटी सड़क",

        // Hinglish
        "sadak",
        "gaddha",
        "gaddhe",
        "khadda",
        "khadde",
        "road kharab",
        "road me gaddha",
        "road mein gaddha",
        "sadak",
        "sadak kharab",
        "sadak kharab hai",
        "sadak tooti",
        "sadak tuti",
        "sadak toot gayi",
        "sadak toot gaya",
        "sadak mein gaddha",
        "sadak me gaddha",
        "sadak mein gaddhe",
        "sadak me gaddhe",
        "gaddha",
        "gaddhe",
        "gaddhon",
        "gaddha hai",
        "bahut gaddhe",
        "road kharab",
        "road kharab hai",
        "road toot gaya",
        "road toot gayi",
        "tooti road",
        "tuti road",
        "broken sadak",
        "rasta kharab",
        "rasta kharab hai",
        "rasta toot gaya",
        "rasta toota hua",
        "footpath kharab",
        "pul kharab",
        "bridge kharab",
        "road repair chahiye",
        "sadak repair chahiye",

        // Odia
        "ରାସ୍ତା",
        "ଗାତ",
        "ରାସ୍ତାରେ ଗାତ",
          "rasta",
        "rastaa",
        "rastare",
        "rasta kharap",
        "rasta kharap achhi",
        "rasta bhangichi",
        "rasta bhangi jaichi",
        "rasta re garta",
        "rasta re gata",
        "rasta re gaddha",
        "garta",
        "gata",
        "gata achhi",
        "garta achhi",
        "garta gudika",
        "bahut garta",
        "rasta repair darkar",
        "rasta repair kara",
        "road kharap achhi",
        "pothole achhi",
        "pothole bahut achhi",
        "footpath kharap",
        "pola kharap",
        "bridge kharap",
        "pola bhangichi",
        "ଖରାପ ରାସ୍ତା",

    ];


    if (
        roadWords.some(word =>
            t.includes(word)
        )
    ) {

        return "Road";
    }


    // -------------------------------------------------
    // ELECTRICITY
    // -------------------------------------------------

    const electricityWords = [
        "street light",
        "streetlight",
        "light",
        "bulb",
        "electricity",
        "electric",
        "power",
        "power cut",
        "electric pole",
        "current",
        "bijli",
        "bijli ka",
        "bijli ke",
        "bijli ki",
        "bijli nahi",
        "bijli nahi hai",
        "bijli nahi aa rahi",
        "bijli nahi aa raha",
        "bijli ka problem",
        "bijli ki problem",
        "bijli ki dikkat",
        "bijli ka khamba",
        "bijli ka khambha",
        "khamba",
        "khambha",
        "khambhe",
        "khambha gira",
        "khamba gira",
        "khamba gir gaya",
        "khambha gir gaya",
        "khamba toot gaya",
        "khambha toot gaya",
        "bijli ka pole",
        "electric pole gira",
        "electric pole gir gaya",
        "pole gira",
        "pole gir gaya",
        "pole toot gaya",
        "wire gira",
        "wire gir gaya",
        "bijli ka wire",
        "bijli ka taar",
        "bijli ki taar",
        "taar",
        "taar gira",
        "taar gir gaya",
        "transformer",
        "current",
        "current lag raha",
        "current ka problem",
        "power cut",
        "light nahi hai",
        "light nahi aa rahi",
        "bijuli",
        "bijuli nahi",
        "bijuli asuni",
        "bijuli asu nahi",
        "bijuli samasya",
        "bijuli problem",
        "bijuli khunta",
        "khunta",
        "khunta padichi",
        "khunta bhangichi",
        "khunta bhangi jaichi",
        "bijuli khunta padichi",
        "bijuli khunta bhangichi",
        "bijuli taar",
        "bijuli tar",
        "taar",
        "tar",
        "taar padichi",
        "tar padichi",
        "taar bhangichi",
        "current",
        "current laguchi",
        "बिजली",
        "बिजली नहीं",
        "बिजली कट",
        "करंट",
        "बिजली का पोल",
        "bijli",
        "bijli nahi",
        "light nahi",
        "current nahi",
        "ବିଦ୍ୟୁତ",
        "କରେଣ୍ଟ"

    ];


    if (
        electricityWords.some(word =>
            t.includes(word)
        )
    ) {

        return "Electricity";
    }


    // -------------------------------------------------
    // WATER
    // -------------------------------------------------

    const waterWords = [

        "water",
        "drinking water",
        "water supply",
        "water problem",
        "tap water",
        "पानी",
        "पानी नहीं",
        "पानी की समस्या",
        "नल का पानी",
        "pani",
        "pani nahi",
        "pani problem",
        "water problem",
        "ପାଣି",
        "ପାଣି ସମସ୍ୟା"

    ];


    if (
        waterWords.some(word =>
            t.includes(word)
        )
    ) {

        return "Water";
    }


    // -------------------------------------------------
    // GARBAGE
    // -------------------------------------------------

    const garbageWords = [

        "garbage",
        "waste",
        "trash",
        "rubbish",
        "dustbin",
        "dirty garbage",
        "कचरा",
        "कूड़ा",
        "कूड़ा",
        "कचरे",
        "कचरा नहीं उठता",
        "kachra",
        "kachra nahi",
        "waste problem",
         "kachra",
        "kachra nahi uthaya",
        "kachra nahi uthaya gaya",
        "kachra pada hai",
        "kachra jama hai",
        "kachra jama",
        "kachre ka dher",
        "kooda",
        "kooda nahi uthaya",
        "kooda pada hai",
        "kooda jama hai",
        "gandagi",
        "gandagi hai",
        "bahut gandagi",
        "dirty area",
        "kachra problem",
        "garbage problem",
        "dustbin",
        "dustbin nahi hai",
        "dustbin chahiye",
        "waste collection",
        "kachra collection",
        "kachra uthao",

        "ଅଳିଆ",
        "ଆବର୍ଜନା"

    ];


    if (
        garbageWords.some(word =>
            t.includes(word)
        )
    ) {

        return "Garbage";
    }


    // -------------------------------------------------
    // STREET LIGHT
    // -------------------------------------------------

    const streetLightWords = [

        "street light",
        "streetlight",
        "street lights",
        "lamp post",
        "street lamp",
        "स्ट्रीट लाइट",
        "सड़क की लाइट",
        "सड़क की लाइट",
        "लाइट खराब",
        "light kharab",
        "street light kharab",
        "streetlight not working",
        "ଷ୍ଟ୍ରିଟ୍ ଲାଇଟ୍"

    ];


    if (
        streetLightWords.some(word =>
            t.includes(word)
        )
    ) {

        return "Street Light";
    }


    // -------------------------------------------------
    // DRAINAGE
    // -------------------------------------------------

    const drainageWords = [

        "drain",
        "drainage",
        "sewer",
        "sewage",
        "water logging",
        "waterlogging",
        "blocked drain",
         "drain",
        "drainage",
        "sewer",
        "sewage",
        "sewerage",
        "blocked drain",
        "drain blocked",
        "drain blockage",
        "water logging",
        "waterlogging",
        "flooded road",
        "dirty drain",
        "open drain",
        "drain overflow",
        "sewer overflow",
        "drain problem",
        "drainage problem",
         "naali",
        "nali",
        "nala",
        "naali jam",
        "nali jam",
        "nala jam",
        "naali band",
        "nali band",
        "nala band",
        "naali block",
        "nali block",
        "drain jam",
        "drain blocked",
        "drain band",
        "water logging",
        "waterlogging",
        "pani jama",
        "pani jam gaya",
        "pani bhar gaya",
        "pani bhar gaya hai",
        "sewer problem",
        "drain problem",
        "nali ki problem",
        "नाली",
        "नाला",
        "नाली बंद",
        "नाली की समस्या",
        "पानी जमा",
        "pani jama",
        "nali",
        "raste me pani jam gaya hai",
        "pani jama hai",
        "pani jam",
        "nala",
        "drain problem",
        "ନାଳ",
        "ଡ୍ରେନ"

    ];


    if (
        drainageWords.some(word =>
            t.includes(word)
        )
    ) {

        return "Drainage";
    }


    // -------------------------------------------------
    // EDUCATION
    // -------------------------------------------------

    const educationWords = [

        "school",
        "college",
        "education",
        "teacher",
        "classroom",
        "student",
        "school problem",
        "college problem",
        "school problem",
        "school ki problem",
        "school ki dikkat",
        "school ki samasya",
        "college problem",
        "college ki problem",
        "college ki dikkat",
        "college ki samasya",
        "school building",
        "college building",
        "teacher problem",
        "student problem",
        "classroom problem",
        "school me problem",
        "college me problem",
        "school mein problem",
        "college mein problem",
        "स्कूल",
        "कॉलेज",
        "शिक्षा",
        "शिक्षक",
        "छात्र",
        "स्कूल की समस्या",
        "कॉलेज की समस्या",
        "school me problem",
        "college me problem",
        "ଶିକ୍ଷା",
        "ସ୍କୁଲ",
        "କଲେଜ"

    ];


    if (
        educationWords.some(word =>
            t.includes(word)
        )
    ) {

        return "Education";
    }


    return "Other";

}


// =====================================================
// PRIORITY DETECTION
// =====================================================

function detectPriority(text, category) {

    const t = normalizeText(text);


    // -------------------------------------------------
    // HIGH PRIORITY WORDS
    // -------------------------------------------------

    const highWords = [

        "emergency",
        "urgent",
        "danger",
        "dangerous",
        "accident",
        "life threat",
        "very dangerous",
        "तुरंत",
        "आपातकाल",
        "खतरा",
        "खतरनाक",
        "दुर्घटना",
        "बहुत खतरनाक",
        "तत्काल",
        "jaldi",
        "bahut kharab",
        "बहुत खराब",
        "ଜରୁରୀ",
        "ବିପଦ"

    ];


    if (
        highWords.some(word =>
            t.includes(word)
        )
    ) {

        return "High";
    }


    // -------------------------------------------------
    // ROAD DAMAGE / LARGE POTHOLES
    // -------------------------------------------------

    if (
        category === "Road" &&
        (
            t.includes("pothole") ||
            t.includes("potholes") ||
            t.includes("गड्ढा") ||
            t.includes("गड्ढे") ||
            t.includes("gaddha") ||
            t.includes("gaddhe") ||
            t.includes("khadda") ||
            t.includes("khadde") ||
            t.includes("ଗାତ")
        )
    ) {

        return "High";
    }


    return "Medium";

}


// =====================================================
// REQUEST TYPE
// =====================================================

function detectRequestType(text) {

    const t = normalizeText(text);


    const developmentWords = [

        "build",
        "construct",
        "construction",
        "new road",
        "new school",
        "new hospital",
        "new drain",
        "install",
        "development",
        "develop",
        "बनाना",
        "निर्माण",
        "नई सड़क",
        "नया रोड",
        "नया स्कूल",
        "विकास",
        "बनवाना",
        "banana hai",
        "banwana hai",
        "ନିର୍ମାଣ",
        "ବିକାଶ"

    ];


    if (
        developmentWords.some(word =>
            t.includes(word)
        )
    ) {

        return "Development Need";
    }


    return "Complaint";

}


// =====================================================
// TITLE GENERATOR
// =====================================================

function generateTitle(category, text) {

    const t = normalizeText(text);


    if (category === "Road") {

        return "Damaged Road and Potholes";
    }


    if (category === "Electricity") {

        return "Electricity Problem";
    }


    if (category === "Water") {

        return "Water Supply Problem";
    }


    if (category === "Garbage") {

        return "Garbage and Waste Problem";
    }


    if (category === "Street Light") {

        return "Street Light Problem";
    }


    if (category === "Drainage") {

        return "Drainage Problem";
    }


    if (category === "Education") {

        return "Education Related Problem";
    }


    return "Civic Issue";

}


// =====================================================
// DESCRIPTION GENERATOR
// =====================================================

function generateDescription(category, text) {

    if (category === "Road") {

        return (
            "The road has potholes and appears to be damaged. " +
            "This may cause difficulty and safety risks for people and vehicles."
        );
    }


    if (category === "Electricity") {

        return (
            "There is an electricity-related problem that needs " +
            "attention from the concerned department."
        );
    }


    if (category === "Water") {

        return (
            "There is a water supply-related problem that requires " +
            "attention from the concerned department."
        );
    }


    if (category === "Garbage") {

        return (
            "Garbage or waste is creating a civic cleanliness problem " +
            "and requires proper collection or disposal."
        );
    }


    if (category === "Street Light") {

        return (
            "There is a problem with the street lighting system " +
            "that needs inspection and repair."
        );
    }


    if (category === "Drainage") {

        return (
            "There is a drainage-related problem that may cause " +
            "waterlogging or sanitation issues."
        );
    }


    if (category === "Education") {

        return (
            "There is an education-related civic issue that requires " +
            "attention from the concerned authority."
        );
    }


    return (
        "The user has reported a civic issue that requires " +
        "attention from the concerned authority."
    );

}


// =====================================================
// AI ANALYSIS ROUTE
// =====================================================

router.post(
    "/analyze",
    async function (req, res) {

        try {

            // -------------------------------------------------
            // SUPPORT BOTH "complaint" AND "text"
            // -------------------------------------------------

            const complaint =
                req.body.complaint ||
                req.body.text ||
                "";


            if (!complaint.trim()) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Complaint text is required."

                });
            }


           


            // -------------------------------------------------
            // ANALYSIS
            // -------------------------------------------------

            const category =
                detectCategory(complaint);


            const requestType =
                detectRequestType(complaint);


            const priority =
                detectPriority(
                    complaint,
                    category
                );


            const title =
                generateTitle(
                    category,
                    complaint
                );


            const description =
                generateDescription(
                    category,
                    complaint
                );


            // -------------------------------------------------
            // RESULT
            // -------------------------------------------------

            const result = {

                title:
                    title,

                requestType:
                    requestType,

                category:
                    category,

                description:
                    description,

                priority:
                    priority

            };


            

            // -------------------------------------------------
            // RESPONSE
            // -------------------------------------------------

            return res.json({

                success: true,

                result: result

            });

        }

        catch (error) {

            console.error(
                "❌ CivicAI Analysis Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "CivicAI analysis failed."

            });

        }

    }
);


// =====================================================
// HEALTH CHECK
// =====================================================

router.get(
    "/test",
    function (req, res) {

        res.json({

            success: true,

            message:
                "CivicAI free AI route is working."

        });

    }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;