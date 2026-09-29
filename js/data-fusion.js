const API_BASE = "https://10.65.152.42:5000";

const token = localStorage.getItem("adminToken");

if (!token) {
    alert("Admin login required.");
    window.location.href = "admin-login.html";
}


// ======================================
// COMMON HEADERS
// ======================================

function getHeaders() {
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}


// ======================================
// ADD AREA DATA
// ======================================

async function addAreaData(event) {

    if (event) {
        event.preventDefault();
    }

    try {

        const area = document.getElementById("area").value.trim();

        const population = Number(
            document.getElementById("population").value
        );

        const populationDensity =
            document.getElementById("populationDensity").value;

        const roadCondition =
            document.getElementById("roadCondition").value;

        const waterInfrastructure =
            document.getElementById("waterInfrastructure").value;

        const drainageCondition =
            document.getElementById("drainageCondition").value;

        const streetLighting =
            document.getElementById("streetLighting").value;

        const existingProjects = Number(
            document.getElementById("existingProjects").value
        ) || 0;

        const dataSource =
            document.getElementById("dataSource").value.trim();


        // ==============================
        // VALIDATION
        // ==============================

        if (!area) {
            alert("Please enter area name.");
            return;
        }

        if (!population || population < 0) {
            alert("Please enter a valid population.");
            return;
        }


        // ==============================
        // AREA DATA OBJECT
        // ==============================

        const areaData = {

            area,
            population,
            populationDensity,

            roadCondition,
            waterInfrastructure,
            drainageCondition,
            streetLighting,

            existingProjects,

            dataSource: dataSource || "Admin Input"

        };


        console.log(
            "Sending Area Data:",
            areaData
        );


        // ==============================
        // POST AREA DATA
        // ==============================

        const response = await fetch(
            `${API_BASE}/api/area-data/add`,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(areaData)
            }
        );


        const data = await response.json();


        console.log(
            "Add Area Data Response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to add area data"
            );

        }


        alert(
            "Area data added successfully!"
        );


        // ==============================
        // RESET FORM
        // ==============================

        const form =
            document.getElementById(
                "areaDataForm"
            );

        if (form) {
            form.reset();
        }


        // ==============================
        // REFRESH BOTH SECTIONS
        // ==============================

        await loadAreaData();

        await loadAnalysis();


    } catch (error) {

        console.error(
            "Add Area Data Error:",
            error
        );

        alert(
            error.message ||
            "Unable to add area data."
        );

    }

}


// ======================================
// LOAD SAVED AREA DATA
// ======================================

async function loadAreaData() {

    try {

        const response = await fetch(
            `${API_BASE}/api/area-data/all`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );


        const data =
            await response.json();


        console.log(
            "Area Data Result:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load area data"
            );

        }


        // Backend response:
        // { success: true, areas: [...] }

        const areas =
            data.areas || [];


        console.log(
            "Saved Areas:",
            areas
        );


        displayAreaData(areas);


    } catch (error) {

        console.error(
            "Load Area Data Error:",
            error
        );

    }

}


// ======================================
// DISPLAY SAVED AREA DATA
// ======================================

function displayAreaData(areas) {

    const tableBody =
        document.getElementById(
            "areaDataTableBody"
        );


    if (!tableBody) {

        console.warn(
            "areaDataTableBody not found"
        );

        return;

    }


    tableBody.innerHTML = "";


    if (!areas || areas.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="10"
                    style="
                        text-align:center;
                        padding:25px;
                    ">
                    No area data available.
                </td>
            </tr>
        `;

        return;

    }


    areas.forEach((item) => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(item.area)}
                </strong>
            </td>

            <td>
                ${Number(
                    item.population || 0
                ).toLocaleString()}
            </td>

            <td>
                ${escapeHTML(
                    item.populationDensity ||
                    "Unknown"
                )}
            </td>

            <td>
                ${escapeHTML(
                    item.roadCondition ||
                    "Unknown"
                )}
            </td>

            <td>
                ${escapeHTML(
                    item.waterInfrastructure ||
                    "Unknown"
                )}
            </td>

            <td>
                ${escapeHTML(
                    item.drainageCondition ||
                    "Unknown"
                )}
            </td>

            <td>
                ${escapeHTML(
                    item.streetLighting ||
                    "Unknown"
                )}
            </td>

            <td>
                ${item.existingProjects || 0}
            </td>

            <td>
                ${escapeHTML(
                    item.dataSource ||
                    "Admin Input"
                )}
            </td>

            <td>

                <button
                    class="delete-area-btn"
                    onclick="deleteAreaData('${item._id}')">

                    Delete

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ======================================
// DELETE AREA DATA
// ======================================

async function deleteAreaData(id) {

    if (!id) {
        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this area data?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE}/api/area-data/${id}`,
            {
                method: "DELETE",
                headers: getHeaders()
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete area data"
            );

        }


        alert(
            "Area data deleted successfully!"
        );


        // Refresh saved data

        await loadAreaData();


        // Refresh contextual analysis

        await loadAnalysis();


    } catch (error) {

        console.error(
            "Delete Area Data Error:",
            error
        );

        alert(
            error.message ||
            "Unable to delete area data."
        );

    }

}


// ======================================
// LOAD CONTEXTUAL ANALYSIS
// ======================================

async function loadAnalysis() {

    try {

        const response = await fetch(
            `${API_BASE}/api/data-fusion/analysis`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );


        const data =
            await response.json();


        console.log(
            "Contextual Analysis Result:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load contextual analysis"
            );

        }


        const analysis =
            data.analysis || [];


        console.log(
            "Analysis Data:",
            analysis
        );


        // Update summary cards

        updateSummary(analysis);


        // Display analysis table

        displayAnalysis(analysis);


    } catch (error) {

        console.error(
            "Load Analysis Error:",
            error
        );

    }

}


// ======================================
// DISPLAY CONTEXTUAL ANALYSIS
// ======================================

function displayAnalysis(analysis) {

    const tableBody =
        document.getElementById(
            "analysisTableBody"
        );


    if (!tableBody) {

        console.warn(
            "analysisTableBody not found"
        );

        return;

    }


    tableBody.innerHTML = "";


    if (!analysis || analysis.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="10"
                    style="
                        text-align:center;
                        padding:25px;
                    ">
                    No contextual analysis available.
                </td>
            </tr>
        `;

        return;

    }


    analysis.forEach((item) => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(
                        item.area || "-"
                    )}
                </strong>
            </td>

            <td>
                ${Number(
                    item.population || 0
                ).toLocaleString()}
            </td>

            <td>
                ${item.totalComplaints || 0}
            </td>

            <td>
                ${item.highPriority || 0}
            </td>

            <td>
                ${item.mediumPriority || 0}
            </td>

            <td>
                ${item.lowPriority || 0}
            </td>

            <td>
                ${item.infrastructureIssues || 0}
            </td>

            <td>

               <td>
    <span class="level-badge ${getLevelClass(item.demandLevel)}">
        ${escapeHTML(
            item.demandLevel || "Low"
        )}
    </span>
</td>

<td>
    <strong class="context-score">
        ${item.contextScore || 0}
    </strong>
</td>

<td>
    <span class="level-badge ${getLevelClass(item.contextLevel)}">
        ${escapeHTML(
            item.contextLevel || "Low"
        )}
    </span>
</td>
            <td>

                <button
                    class="view-details-btn"
                    onclick='viewAreaDetails(${JSON.stringify(item)})'>

                    View Details

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ======================================
// UPDATE SUMMARY
// ======================================

function updateSummary(analysis) {

    let totalComplaints = 0;

    let highPriority = 0;

    let infrastructureIssues = 0;

    let highContextAreas = 0;


    analysis.forEach((item) => {

        totalComplaints +=
            Number(
                item.totalComplaints
            ) || 0;


        highPriority +=
            Number(
                item.highPriority
            ) || 0;


        infrastructureIssues +=
            Number(
                item.infrastructureIssues
            ) || 0;


        if (
            String(
                item.contextLevel
            ).toLowerCase() === "high"
        ) {

            highContextAreas++;

        }

    });


    const totalElement =
        document.getElementById(
            "fusionTotalComplaints"
        );


    const highPriorityElement =
        document.getElementById(
            "fusionHighPriority"
        );


    const infrastructureElement =
        document.getElementById(
            "fusionInfrastructureIssues"
        );


    const highContextElement =
        document.getElementById(
            "fusionHighContextAreas"
        );


    if (totalElement) {

        totalElement.textContent =
            totalComplaints;

    }


    if (highPriorityElement) {

        highPriorityElement.textContent =
            highPriority;

    }


    if (infrastructureElement) {

        infrastructureElement.textContent =
            infrastructureIssues;

    }


    if (highContextElement) {

        highContextElement.textContent =
            highContextAreas;

    }

}


// ======================================
// VIEW DETAILS
// ======================================

function viewAreaDetails(item) {

    alert(

        `AREA: ${item.area}\n\n` +

        `Population: ${item.population || 0}\n` +

        `Population Density: ${
            item.populationDensity || "Unknown"
        }\n\n` +

        `Reported Complaints: ${
            item.totalComplaints || 0
        }\n` +

        `High Priority: ${
            item.highPriority || 0
        }\n` +

        `Medium Priority: ${
            item.mediumPriority || 0
        }\n` +

        `Low Priority: ${
            item.lowPriority || 0
        }\n\n` +

        `Infrastructure Issues: ${
            item.infrastructureIssues || 0
        }\n\n` +

        `Road: ${
            item.roadCondition || "Unknown"
        }\n` +

        `Water: ${
            item.waterInfrastructure || "Unknown"
        }\n` +

        `Drainage: ${
            item.drainageCondition || "Unknown"
        }\n` +

        `Street Lighting: ${
            item.streetLighting || "Unknown"
        }\n\n` +

        `Demand Level: ${
            item.demandLevel || "Low"
        }\n` +

        `Context Level: ${
            item.contextLevel || "Low"
        }`

    );

}


// ======================================
// LEVEL CLASS
// ======================================

function getLevelClass(level) {

    if (!level) {
        return "low";
    }


    return String(level)
        .toLowerCase()
        .replace(/\s+/g, "-");

}


// ======================================
// ESCAPE HTML
// ======================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value === undefined ||
        value === null
            ? ""
            : value;


    return div.innerHTML;

}


// ======================================
// FORM EVENT
// ======================================

const areaDataForm =
    document.getElementById(
        "areaDataForm"
    );


if (areaDataForm) {

    areaDataForm.addEventListener(
        "submit",
        addAreaData
    );

}


// ======================================
// INITIAL LOAD
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadAreaData();

        loadAnalysis();

    }
);