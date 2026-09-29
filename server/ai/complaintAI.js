// =====================================================
// JanSudhar - FREE LOCAL COMPLAINT AI
// English + Hindi + Hinglish + Odia + Roman Odia
// No OpenAI API required
// =====================================================


// =====================================================
// NORMALIZE TEXT
// =====================================================

function normalizeText(text) {
    return String(text || "")
        .toLowerCase()
        .trim()
        .replace(/[।,!?;:"'()[\]{}]/g, " ")
        .replace(/\s+/g, " ");
}


// =====================================================
// CATEGORY KEYWORDS
// =====================================================

const categoryKeywords = {

    // =================================================
    // ROAD
    // =================================================

    Road: [

        // ---------- English ----------
        "road",
        "roads",
        "pothole",
        "potholes",
        "highway",
        
        "footpath",
        "sidewalk",
        "bridge",
        "road damage",
        "road damaged",
        "damaged road",
        "broken road",
        "bad road",
        "road is bad",
        "road is broken",
        "road repair",
        "road problem",
        "road issue",
        "crack in road",
        "road cracks",
        "mud road",
        "road construction",

        // ---------- Hindi ----------
        "सड़क",
        "सड़क",
        "रोड",
        "गड्ढा",
        "गड्ढे",
        "गड्ढों",
        "पुल",
        "फुटपाथ",
        "टूटी सड़क",
        "खराब सड़क",
        "सड़क खराब",
        "सड़क टूटी",
        "सड़क में गड्ढा",
        "सड़क में गड्ढे",
        "सड़क की मरम्मत",
        "सड़क की समस्या",
        "रास्ता खराब",
        "रास्ता टूटा",

        // ---------- Hinglish ----------
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

        // ---------- Odia ----------
        "ରାସ୍ତା",
        "ରାସ୍ତାରେ",
        "ରାସ୍ତା ଖରାପ",
        "ରାସ୍ତା ଭାଙ୍ଗିଛି",
        "ରାସ୍ତାରେ ଗାତ",
        "ଗାତ",
        "ଗାତଗୁଡିକ",
        "ପୋଲ",
        "ଫୁଟପାଥ",

        // ---------- Roman Odia ----------
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
        "pola bhangichi"
    ],


    // =================================================
    // ELECTRICITY
    // =================================================

    Electricity: [

        // ---------- English ----------
        "electricity",
        "electric",
        "electric pole",
        "electric pole fallen",
        "electric pole broken",
        "power",
        "power cut",
        "power failure",
        "transformer",
        "wire",
        "electric wire",
        "live wire",
        "fallen wire",
        "broken wire",
        "pole",
        "fallen pole",
        "broken pole",
        "electric shock",
        "current problem",
        "electricity problem",
        "electricity issue",
        "no electricity",
        "electricity not working",
        "street light",
        "streetlight",
        "street light not working",
        "bulb",
        "bulb not working",
        "light",
        "light not working",

        // ---------- Hindi ----------
        
        "बिजली का",
        "बिजली की",
        "बिजली के",
        "बिजली नहीं",
        "बिजली नहीं है",
        "बिजली कट",
        "बिजली कटौती",
        "बिजली की समस्या",
        "बिजली की दिक्कत",
        "बिजली का खंभा",
        "बिजली का पोल",
        "खंभा",
        "खम्भा",
        "खम्बा",
        "खंभे",
        "खम्भे",
        "पोल",
        "पोल गिरा",
        "पोल गिर गया",
        "खंभा गिरा",
        "खंभा गिर गया",
        "खंभा टूट गया",
        "बिजली का खंभा गिर गया",
        "बिजली की तार",
        "बिजली का तार",
        "तार",
        "तार गिरा",
        "तार गिर गया",
        "ट्रांसफार्मर",
        "करंट",

        // ---------- Hinglish ----------
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

        // ---------- Odia ----------
        "ବିଦ୍ୟୁତ",
        "ବିଜୁଳି",
        "ବିଦ୍ୟୁତ ଖୁଣ୍ଟ",
        "ବିଦ୍ୟୁତ ତାର",
        "ଖୁଣ୍ଟ",
        "ଖୁଣ୍ଟ ପଡିଛି",
        "ଖୁଣ୍ଟ ଭାଙ୍ଗିଛି",
        "ତାର",
        "ତାର ପଡିଛି",
        "କରେଣ୍ଟ",
        "ଟ୍ରାନ୍ସଫର୍ମର",

        // ---------- Roman Odia ----------
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
        "current problem",
        "power cut",
        "light asuni",
        "light nahi",
        "transformer kharap",
        "transformer problem"
    ],


    // =================================================
    // WATER
    // =================================================

    Water: [

        // ---------- English ----------
        "water",
        "drinking water",
        "water supply",
        "water problem",
        "water issue",
        "water shortage",
        "no water",
        "water not coming",
        "water is not coming",
        "pipeline",
        "pipe",
        "tap",
        "tap water",
        "water leakage",
        "leakage",
        "water leak",
        "pipe leakage",
        "broken pipe",

        // ---------- Hindi ----------
        "पानी",
        "पानी की",
        "पानी का",
        "पानी के",
        "पानी की समस्या",
        "पानी की दिक्कत",
        "पानी नहीं",
        "पानी नहीं आ रहा",
        "पानी नहीं आ रहा है",
        "जल",
        "जल समस्या",
        "जल आपूर्ति",
        "नल",
        "पाइप",
        "पाइपलाइन",
        "पानी की पाइप",
        "पाइप में लीकेज",
        "पानी लीक",
        "पानी की कमी",

        // ---------- Hinglish ----------
        "pani",
        "paani",
        "pani problem",
        "pani ki problem",
        "pani ki dikkat",
        "pani ki samasya",
        "pani nahi",
        "pani nahi aa raha",
        "pani nahi aa raha hai",
        "paani nahi aa raha",
        "paani nahi aa raha hai",
        "pani nahi mil raha",
        "paani nahi mil raha",
        "pani supply",
        "water supply nahi",
        "nal",
        "nal mein pani",
        "nal me pani",
        "nal kharab",
        "pipe",
        "pipeline",
        "pipeline kharab",
        "pipeline leak",
        "pipe leak",
        "pipe leakage",
        "pani leak",
        "pani leakage",
        "pani ki kami",

        // ---------- Odia ----------
        "ପାଣି",
        "ଜଳ",
        "ଜଳ ସମସ୍ୟା",
        "ଜଳ ଯୋଗାଣ",
        "ନଳ",
        "ପାଇପ",
        "ପାଇପଲାଇନ",
        "ପାଣି ଆସୁନି",
        "ପାଣି ନାହିଁ",

        // ---------- Roman Odia ----------
        "pani",
        "paani",
        "pani asuni",
        "pani asu nahi",
        "pani asuni achhi",
        "pani miluni",
        "pani milu nahi",
        "pani nahi",
        "pani nahi asuchi",
        "pani samasya",
        "pani problem",
        "pani supply",
        "pani supply nahi",
        "nal",
        "nal kharap",
        "nal re pani",
        "nalare pani",
        "pipe",
        "pipeline",
        "pipeline kharap",
        "pipeline leak",
        "pipe leak",
        "pani leak",
        "pani leakage",
        "pani kami"
    ],


    // =================================================
    // GARBAGE
    // =================================================

    Garbage: [

        // ---------- English ----------
        "garbage",
        "trash",
        "waste",
        "solid waste",
        "waste collection",
        "garbage collection",
        "garbage not collected",
        "waste not collected",
        "dirty",
        "dirt",
        "dump",
        "garbage dump",
        "dustbin",
        "litter",
        "unclean",
        "dirty area",
        "garbage problem",
        "waste problem",

        // ---------- Hindi ----------
        "कचरा",
        "कूड़ा",
        "कूड़ा",
        "गंदगी",
        "कचरा नहीं उठाया",
        "कचरा नहीं उठाया गया",
        "कचरा जमा",
        "कचरा पड़ा",
        "कूड़ा जमा",
        "कूड़ा जमा",
        "गंदा",
        "कचरे का ढेर",
        "कचरा समस्या",

        // ---------- Hinglish ----------
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

        // ---------- Odia ----------
        "ଆବର୍ଜନା",
        "ଅଳିଆ",
        "ବର୍ଜ୍ୟ",
        "ଅଳିଆ ଜମା",
        "ଆବର୍ଜନା ଜମା",
        "ଅଳିଆ ପଡିଛି",
        "ଗନ୍ଦା",

        // ---------- Roman Odia ----------
        "alia",
        "alia jama",
        "alia jamichi",
        "alia padichi",
        "alia uthau nahi",
        "alia uthajau nahi",
        "abarjana",
        "abarjana jama",
        "abarjana padichi",
        "abarjana uthau nahi",
        "barjya",
        "gandagi",
        "gandagi achhi",
        "bahut gandagi",
        "kachara",
        "kachara jama",
        "kachara padichi",
        "kachara uthau nahi",
        "kachara uthajau nahi",
        "dustbin nahi",
        "dustbin darkar",
        "dustbin chahiye"
    ],


    // =================================================
    // STREET LIGHT
    // =================================================

    "Street Light": [

        // ---------- English ----------
        "street light",
        "streetlight",
        "street lamp",
        "lamp",
        "street lights",
        "street light not working",
        "streetlight not working",
        "light not working",
        "light is not working",
        "street light broken",
        "street light problem",
        "street light issue",
        "no street light",
        "street light required",

        // ---------- Hindi ----------
        "स्ट्रीट लाइट",
        "स्ट्रीट लाइट खराब",
        "स्ट्रीट लाइट बंद",
        "स्ट्रीट लाइट नहीं",
        "सड़क की लाइट",
        "सड़क की लाइट खराब",
        "लाइट खराब",
        "लाइट बंद",
        "बत्ती खराब",
        "बत्ती बंद",
        "रोड की लाइट",

        // ---------- Hinglish ----------
        "street light kharab",
        "street light band",
        "street light nahi",
        "streetlight kharab",
        "streetlight band",
        "light kharab",
        "light band",
        "light nahi jal rahi",
        "light nahi jalta",
        "sadak ki light",
        "sadak ki light kharab",
        "road ki light",
        "road ki light kharab",
        "batti kharab",
        "batti band",
        "street light chahiye",
        "street light lagao",
        "street light lagana hai",

        // ---------- Odia ----------
        "ଷ୍ଟ୍ରିଟ ଲାଇଟ",
        "ଷ୍ଟ୍ରିଟ ଲାଇଟ ଖରାପ",
        "ଷ୍ଟ୍ରିଟ ଲାଇଟ ବନ୍ଦ",
        "ବତୀ",
        "ବତୀ ଖରାପ",
        "ଆଲୋକ",

        // ---------- Roman Odia ----------
        "street light kharap",
        "street light band",
        "street light nahi",
        "light kharap",
        "light band",
        "light jaluni",
        "light jalu nahi",
        "rasta ra light",
        "rasta light kharap",
        "sadak ra light",
        "bati kharap",
        "bati band",
        "street light darkar",
        "street light lagiba darkar",
        "street light lagau"
    ],


    // =================================================
    // DRAINAGE
    // =================================================

    Drainage: [

        // ---------- English ----------
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

        // ---------- Hindi ----------
        "नाली",
        "नाला",
        "नाली जाम",
        "नाला जाम",
        "नाली बंद",
        "नाला बंद",
        "जलभराव",
        "पानी जमा",
        "पानी भर गया",
        "सीवर",
        "सीवेज",
        "नाली की समस्या",
        "नाला की समस्या",

        // ---------- Hinglish ----------
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

        // ---------- Odia ----------
        "ନାଳ",
        "ନାଳି",
        "ଡ୍ରେନ",
        "ଡ୍ରେନେଜ",
        "ନାଳ ଜାମ",
        "ଡ୍ରେନ ଜାମ",
        "ପାଣି ଜମିଛି",
        "ଜଳଭରା",

        // ---------- Roman Odia ----------
        "nala",
        "nali",
        "naali",
        "nala jam",
        "nali jam",
        "naali jam",
        "nala band",
        "nali band",
        "naali band",
        "nala block",
        "nali block",
        "drain jam",
        "drain band",
        "drain kharap",
        "pani jamichi",
        "pani jameichi",
        "pani jama heichi",
        "pani bhari jaichi",
        "pani bharigala",
        "nala re pani",
        "nali re pani",
        "drain re pani",
        "drainage problem"
    ],


    // =================================================
    // EDUCATION
    // =================================================

    Education: [

        // ---------- English ----------
        "school",
        "college",
        "education",
        "teacher",
        "teachers",
        "classroom",
        "student",
        "students",
        "school building",
        "college building",
        "school problem",
        "college problem",
        "education problem",
        "school infrastructure",
        "college infrastructure",
        "school road",

        // ---------- Hindi ----------
        "स्कूल",
        "विद्यालय",
        "कॉलेज",
        "शिक्षा",
        "शिक्षक",
        "शिक्षिका",
        "छात्र",
        "छात्रा",
        "कक्षा",
        "स्कूल की समस्या",
        "कॉलेज की समस्या",
        "स्कूल भवन",
        "कॉलेज भवन",

        // ---------- Hinglish ----------
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

        // ---------- Odia ----------
        "ସ୍କୁଲ",
        "ବିଦ୍ୟାଳୟ",
        "କଲେଜ",
        "ଶିକ୍ଷା",
        "ଶିକ୍ଷକ",
        "ଛାତ୍ର",
        "ଛାତ୍ରୀ",
        "ଶ୍ରେଣୀ କକ୍ଷ",

        // ---------- Roman Odia ----------
        "school",
        "school ra problem",
        "school re problem",
        "school re samasya",
        "college",
        "college ra problem",
        "college re problem",
        "college re samasya",
        "sikhya",
        "sikshya",
        "sikshak",
        "chhatra",
        "classroom problem",
        "school building problem",
        "college building problem"
    ]
};


// =====================================================
// HIGH PRIORITY KEYWORDS
// =====================================================

const highPriorityKeywords = [

    // ---------- English ----------
    "danger",
    "dangerous",
    "emergency",
    "accident",
    "fallen",
    "falling",
    "broken",
    "blocked",
    "fire",
    "electrocution",
    "live wire",
    "electric shock",
    "risk",
    "unsafe",
    "life threatening",
    "life threat",
    "death risk",
    "serious danger",
    "immediate danger",
    "open manhole",
    "open drain",
    "wire on road",
    "pole on road",
    "pole fallen",
    "electric pole fallen",

    // ---------- Hindi ----------
    "खतरा",
    "खतरनाक",
    "आपातकाल",
    "आपात स्थिति",
    "गिरा",
    "गिर गया",
    "गिरी",
    "गिरा हुआ",
    "गिरने वाला",
    "टूटा",
    "टूटी",
    "टूट गया",
    "टूट गई",
    "खुला तार",
    "बिजली का तार",
    "करंट",
    "करंट लग",
    "जान का खतरा",
    "दुर्घटना",
    "असुरक्षित",
    "जानलेवा",
    "बहुत खतरनाक",
    "तुरंत खतरा",
    "खुली नाली",
    "खुला मैनहोल",

    // ---------- Hinglish ----------
    "khatra",
    "khatarnak",
    "bahut khatarnak",
    "emergency",
    "gira",
    "gira hua",
    "gir gaya",
    "gir gayi",
    "gir chuka",
    "toota",
    "tooti",
    "toot gaya",
    "toot gayi",
    "broken",
    "current",
    "current lag",
    "current lag raha",
    "live wire",
    "bijli ka taar",
    "bijli ka wire",
    "khamba gira",
    "khamba gir gaya",
    "khambha gira",
    "khambha gir gaya",
    "pole gira",
    "pole gir gaya",
    "wire gira",
    "wire gir gaya",
    "jaan ka khatra",
    "jaan ko khatra",
    "dangerous",
    "unsafe",
    "accident",
    "hadsa",
    "bahut danger",
    "turant action",
    "turant madad",

    // ---------- Roman Odia ----------
    "bipada",
    "bipajjanaka",
    "bipajonaka",
    "bahut bipada",
    "bahut bipadjanak",
    "padi chi",
    "padichi",
    "padi jaichi",
    "bhangichi",
    "bhangi jaichi",
    "current laguchi",
    "current lagiba",
    "bijuli taar padichi",
    "bijuli tar padichi",
    "bijuli khunta padichi",
    "khunta padichi",
    "khunta bhangichi",
    "jaan prati bipad",
    "jibana prati bipad",
    "turanta sahajya",
    "turanta action",

    // ---------- Odia ----------
    "ବିପଦ",
    "ବିପଦଜନକ",
    "ପଡିଛି",
    "ପଡିଯାଇଛି",
    "ଭାଙ୍ଗିଛି",
    "ଭାଙ୍ଗିଯାଇଛି",
    "କରେଣ୍ଟ",
    "ଜୀବନ ପ୍ରତି ବିପଦ"
];


// =====================================================
// MEDIUM PRIORITY KEYWORDS
// =====================================================

const mediumPriorityKeywords = [

    // ---------- English ----------
    "problem",
    "issue",
    "damage",
    "damaged",
    "leak",
    "leakage",
    "not working",
    "not available",
    "shortage",
    "broken",
    "dirty",
    "blocked",
    "repair",
    "needs repair",
    "requires repair",
    "poor condition",

    // ---------- Hindi ----------
    "समस्या",
    "दिक्कत",
    "खराब",
    "क्षतिग्रस्त",
    "लीकेज",
    "लीक",
    "काम नहीं कर रहा",
    "काम नहीं कर रही",
    "उपलब्ध नहीं",
    "कमी",
    "मरम्मत",
    "मरम्मत चाहिए",
    "खराब स्थिति",

    // ---------- Hinglish ----------
    "samasya",
    "problem",
    "dikkat",
    "kharab",
    "damage",
    "damaged",
    "leak",
    "leakage",
    "kaam nahi kar raha",
    "kaam nahi kar rahi",
    "kaam nahi karta",
    "available nahi",
    "kami",
    "repair",
    "repair chahiye",
    "theek nahi",
    "thik nahi",
    "kharab condition",
    "poor condition",

    // ---------- Roman Odia ----------
    "samasya",
    "samashya",
    "asubidha",
    "asubidha achhi",
    "kharap",
    "kharap achhi",
    "bhanga",
    "bhangichi",
    "leak",
    "leakage",
    "kama karuni",
    "kama karu nahi",
    "thik nahi",
    "maramati darkar",
    "repair darkar",
    "samadhan darkar",

    // ---------- Odia ----------
    "ସମସ୍ୟା",
    "ଅସୁବିଧା",
    "ଖରାପ",
    "ଭାଙ୍ଗିଛି",
    "ଲିକେଜ",
    "ମରାମତି"
];


// =====================================================
// DEVELOPMENT NEED KEYWORDS
// =====================================================

const developmentKeywords = [

    // ---------- English ----------
    "need",
    "needed",
    "required",
    "require",
    "please install",
    "please provide",
    "please construct",
    "please build",
    "new road",
    "new street light",
    "new water supply",
    "new drain",
    "new drainage",
    "development",
    "develop",
    "construct",
    "construction",
    "build",
    "provide",
    "install",
    "setup",
    "facility required",
    "facility needed",

    // ---------- Hindi ----------
    "चाहिए",
    "जरूरत",
    "जरूरत है",
    "आवश्यकता",
    "आवश्यक",
    "बनवाना",
    "बनाने",
    "बनाना",
    "नया",
    "नई",
    "नए",
    "विकास",
    "निर्माण",
    "लगाना",
    "लगवाना",
    "उपलब्ध कराएं",
    "सुविधा चाहिए",
    "सुविधा की जरूरत",

    // ---------- Hinglish ----------
    "chahiye",
    "chahiye hai",
    "zarurat",
    "zarurat hai",
    "zaroorat",
    "zaroorat hai",
    "required hai",
    "lagwana hai",
    "lagana hai",
    "banwana hai",
    "banana hai",
    "naya",
    "nayi",
    "new",
    "vikas",
    "nirman",
    "provide karo",
    "provide karna hai",
    "install karo",
    "install karna hai",
    "facility chahiye",
    "facility ki zarurat",
    "road chahiye",
    "sadak chahiye",
    "street light chahiye",
    "pani chahiye",
    "water supply chahiye",
    "dustbin chahiye",
    "drain chahiye",

    // ---------- Roman Odia ----------
    "darkar",
    "darkar achhi",
    "darkar heichi",
    "abasyak",
    "abasya darkar",
    "deba darkar",
    "debaku darkar",
    "kariba darkar",
    "lagiba darkar",
    "lagau darkar",
    "tiari kariba darkar",
    "nua rasta",
    "nua road",
    "nua street light",
    "nua pani supply",
    "nua drain",
    "bikash",
    "vikash",
    "nirman",
    "suvidha darkar",
    "dustbin darkar",
    "pani darkar",
    "rasta darkar",
    "street light darkar",

    // ---------- Odia ----------
    "ଦରକାର",
    "ଆବଶ୍ୟକ",
    "ଆବଶ୍ୟକତା",
    "ନିର୍ମାଣ",
    "ବିକାଶ",
    "ନୂଆ",
    "ଲଗାଇବା",
    "ଦେବା ଦରକାର"
];


// =====================================================
// CHECK KEYWORD
// =====================================================

function containsKeyword(text, keyword) {

    const normalizedKeyword = normalizeText(keyword);

    if (!normalizedKeyword) {
        return false;
    }

    // Indic language words
    // Direct matching is useful for Hindi/Odia.
    if (/[\u0900-\u097F\u0B00-\u0B7F]/.test(normalizedKeyword)) {
        return text.includes(normalizedKeyword);
    }

    // English / Hinglish / Roman Odia
    // Word-boundary matching prevents small words
    // from accidentally matching inside another word.
    const escaped = normalizedKeyword.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    const pattern = new RegExp(
        "(^|\\s)" + escaped + "(?=\\s|$)",
        "i"
    );

    return pattern.test(text);
}


// =====================================================
// FIND CATEGORY
// =====================================================

function detectCategory(text) {

    const scores = {};

    for (const category in categoryKeywords) {

        scores[category] = 0;

        for (const keyword of categoryKeywords[category]) {

            if (containsKeyword(text, keyword)) {

                const keywordLength =
                    normalizeText(keyword).length;

                // Longer phrases get higher weight
                if (keywordLength >= 12) {
                    scores[category] += 4;
                }
                else if (keywordLength >= 7) {
                    scores[category] += 3;
                }
                else if (keywordLength >= 4) {
                    scores[category] += 2;
                }
                else {
                    scores[category] += 1;
                }
            }
        }
    }


    let bestCategory = "Other";
    let bestScore = 0;

    for (const category in scores) {

        if (scores[category] > bestScore) {

            bestScore = scores[category];
            bestCategory = category;
        }
    }

    return bestCategory;
}


// =====================================================
// FIND PRIORITY
// =====================================================

function detectPriority(text, category) {

    // High priority first
    for (const keyword of highPriorityKeywords) {

        if (containsKeyword(text, keyword)) {
            return "High";
        }
    }


    // Medium priority
    for (const keyword of mediumPriorityKeywords) {

        if (containsKeyword(text, keyword)) {
            return "Medium";
        }
    }


    // -----------------------------------------------
    // Electricity pole / wire = High
    // -----------------------------------------------

    if (category === "Electricity") {

        const dangerousElectricityWords = [

            "pole",
            "khamba",
            "khambha",
            "khambhe",
            "खंभ",
            "खम्भ",
            "खम्ब",
            "तार",
            "wire",
            "taar",
            "tar",
            "खुंट",
            "खुंटा",
            "खुंटि",
            "khunta",
            "khunta padichi",
            "bijuli taar",
            "bijuli tar"
        ];

        for (const word of dangerousElectricityWords) {

            if (containsKeyword(text, word)) {
                return "High";
            }
        }
    }


    // -----------------------------------------------
    // Open drain / manhole = High
    // -----------------------------------------------

    if (
        category === "Drainage" &&
        (
            containsKeyword(text, "open drain") ||
            containsKeyword(text, "open manhole") ||
            containsKeyword(text, "खुली नाली") ||
            containsKeyword(text, "खुला मैनहोल") ||
            containsKeyword(text, "khuli nali") ||
            containsKeyword(text, "khula manhole")
        )
    ) {
        return "High";
    }


    return "Low";
}


// =====================================================
// REQUEST TYPE
// =====================================================

function detectRequestType(text) {

    for (const keyword of developmentKeywords) {

        if (containsKeyword(text, keyword)) {
            return "Development Need";
        }
    }

    return "Complaint";
}


// =====================================================
// CREATE TITLE
// =====================================================

function createTitle(category, text) {


    // =================================================
    // ELECTRICITY
    // =================================================

    if (category === "Electricity") {

        if (
            containsKeyword(text, "khamba") ||
            containsKeyword(text, "khambha") ||
            containsKeyword(text, "khambhe") ||
            containsKeyword(text, "khunta") ||
            containsKeyword(text, "pole") ||
            containsKeyword(text, "खंभ") ||
            containsKeyword(text, "खम्भ") ||
            containsKeyword(text, "खम्बा") ||
            containsKeyword(text, "खुंट") ||
            containsKeyword(text, "ବିଦ୍ୟୁତ ଖୁଣ୍ଟ")
        ) {
            return "Fallen Electricity Pole";
        }


        if (
            containsKeyword(text, "wire") ||
            containsKeyword(text, "तार") ||
            containsKeyword(text, "taar") ||
            containsKeyword(text, "tar") ||
            containsKeyword(text, "ବିଦ୍ୟୁତ ତାର")
        ) {
            return "Electricity Wire Problem";
        }


        if (
            containsKeyword(text, "transformer") ||
            containsKeyword(text, "ଟ୍ରାନ୍ସଫର୍ମର")
        ) {
            return "Transformer Problem";
        }


        if (
            containsKeyword(text, "power cut") ||
            containsKeyword(text, "bijli nahi") ||
            containsKeyword(text, "ବିଜୁଳି ନାହିଁ")
        ) {
            return "Electricity Supply Problem";
        }


        return "Electricity Problem";
    }


    // =================================================
    // ROAD
    // =================================================

    if (category === "Road") {

        if (
            containsKeyword(text, "गड्ढ") ||
            containsKeyword(text, "pothole") ||
            containsKeyword(text, "gaddha") ||
            containsKeyword(text, "gaddhe") ||
            containsKeyword(text, "gaddhon") ||
            containsKeyword(text, "garta") ||
            containsKeyword(text, "gata") ||
            containsKeyword(text, "ଗାତ")
        ) {
            return "Damaged Road and Potholes";
        }


        if (
            containsKeyword(text, "bridge") ||
            containsKeyword(text, "pul") ||
            containsKeyword(text, "ପୁଲ")
        ) {
            return "Bridge Problem";
        }


        return "Road Problem";
    }


    // =================================================
    // WATER
    // =================================================

    if (category === "Water") {

        if (
            containsKeyword(text, "leak") ||
            containsKeyword(text, "leakage") ||
            containsKeyword(text, "leakage") ||
            containsKeyword(text, "ଲିକେଜ")
        ) {
            return "Water Pipeline Leakage";
        }


        if (
            containsKeyword(text, "pani nahi") ||
            containsKeyword(text, "paani nahi") ||
            containsKeyword(text, "pani asuni") ||
            containsKeyword(text, "ପାଣି ଆସୁନି")
        ) {
            return "Water Supply Not Available";
        }


        return "Water Supply Problem";
    }


    // =================================================
    // GARBAGE
    // =================================================

    if (category === "Garbage") {

        if (
            containsKeyword(text, "kachra") ||
            containsKeyword(text, "kachara") ||
            containsKeyword(text, "kooda") ||
            containsKeyword(text, "ଆବର୍ଜନା") ||
            containsKeyword(text, "ଅଳିଆ")
        ) {
            return "Garbage and Waste Problem";
        }


        return "Garbage and Waste Problem";
    }


    // =================================================
    // STREET LIGHT
    // =================================================

    if (category === "Street Light") {

        if (
            containsKeyword(text, "not working") ||
            containsKeyword(text, "kharab") ||
            containsKeyword(text, "band") ||
            containsKeyword(text, "खराब") ||
            containsKeyword(text, "ବନ୍ଦ")
        ) {
            return "Street Light Not Working";
        }


        return "Street Light Problem";
    }


    // =================================================
    // DRAINAGE
    // =================================================

    if (category === "Drainage") {

        if (
            containsKeyword(text, "jam") ||
            containsKeyword(text, "blocked") ||
            containsKeyword(text, "block") ||
            containsKeyword(text, "ଜାମ")
        ) {
            return "Blocked Drain Problem";
        }


        if (
            containsKeyword(text, "water logging") ||
            containsKeyword(text, "waterlogging") ||
            containsKeyword(text, "pani jama") ||
            containsKeyword(text, "pani jamichi") ||
            containsKeyword(text, "ଜଳଭରା")
        ) {
            return "Waterlogging Problem";
        }


        return "Drainage Problem";
    }


    // =================================================
    // EDUCATION
    // =================================================

    if (category === "Education") {

        return "Education Related Problem";
    }


    return "Civic Issue";
}


// =====================================================
// CREATE DESCRIPTION
// =====================================================

function createDescription(category, originalText) {

    switch (category) {

        case "Road":

            return "The reported road has damage or potholes and requires attention from the concerned authority.";


        case "Electricity":

            return "An electricity-related issue has been reported. The concerned electricity department should inspect the issue and take necessary action.";


        case "Water":

            return "A water supply-related problem has been reported and requires attention from the concerned authority.";


        case "Garbage":

            return "A garbage or waste management issue has been reported and requires attention from the concerned municipal authority.";


        case "Street Light":

            return "A street lighting issue has been reported and requires inspection and necessary repair.";


        case "Drainage":

            return "A drainage or waterlogging issue has been reported and requires attention from the concerned authority.";


        case "Education":

            return "An education-related civic issue has been reported and requires attention from the concerned authority.";


        default:

            return "The user has reported a civic issue that requires attention from the concerned authority.";
    }
}


// =====================================================
// DEPARTMENT
// =====================================================

function detectDepartment(category) {

    const departments = {

        Road:
            "Road & Infrastructure Department",

        Electricity:
            "Electricity Department",

        Water:
            "Water Supply Department",

        Garbage:
            "Municipal Waste Management Department",

        "Street Light":
            "Street Lighting Department",

        Drainage:
            "Drainage & Sewerage Department",

        Education:
            "Education Department",

        Other:
            "General Civic Department"
    };


    return departments[category] ||
        "General Civic Department";
}


// =====================================================
// MAIN AI FUNCTION
// =====================================================

function analyzeComplaint(complaint) {

    let originalText = "";


    // -----------------------------------------------
    // String complaint
    // -----------------------------------------------

    if (typeof complaint === "string") {

        originalText = complaint;
    }


    // -----------------------------------------------
    // Object complaint
    // -----------------------------------------------

    else if (complaint) {

        originalText =
            `${complaint.title || ""} ${
                complaint.description || ""
            } ${
                complaint.category || ""
            }`;
    }


    // -----------------------------------------------
    // Normalize
    // -----------------------------------------------

    const text =
        normalizeText(originalText);


    // -----------------------------------------------
    // Detect Category
    // -----------------------------------------------

    const category =
        detectCategory(text);


    // -----------------------------------------------
    // Detect Priority
    // -----------------------------------------------

    const priority =
        detectPriority(
            text,
            category
        );


    // -----------------------------------------------
    // Detect Request Type
    // -----------------------------------------------

    const requestType =
        detectRequestType(text);


    // -----------------------------------------------
    // Create Title
    // -----------------------------------------------

    const title =
        createTitle(
            category,
            text
        );


    // -----------------------------------------------
    // Create Description
    // -----------------------------------------------

    const description =
        createDescription(
            category,
            originalText
        );


    // -----------------------------------------------
    // Detect Department
    // -----------------------------------------------

    const department =
        detectDepartment(
            category
        );


    // -----------------------------------------------
    // Final Result
    // -----------------------------------------------

    const result = {

        title,

        requestType,

        category,

        description,

        priority,

        department
    };


    // -----------------------------------------------
    // Console Result
    // -----------------------------------------------

    console.log(
        "✅ JanSudhar Analysis Result:",
        result
    );


    return result;
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    analyzeComplaint
};