// ==========================================
// AMDR - AUTONOMOUS MEDICINE DELIVERY ROBOT
// ==========================================

// Store medicines added by the nurse
let medicineList = [];

// Store all delivery requests
let deliveryRequests = [];


// ==========================================
// PAGE / PANEL SWITCHING
// ==========================================

function showPanel(panelName, clickedButton) {

    // Hide all panels
    const panels = document.querySelectorAll(".panel");

    panels.forEach(function(panel) {
        panel.classList.add("hidden");
    });

    // Show selected panel
    const selectedPanel = document.getElementById(panelName);

    if (selectedPanel) {
        selectedPanel.classList.remove("hidden");
    }

    // Remove active status from all navigation buttons
    const buttons = document.querySelectorAll(".tab");

    buttons.forEach(function(button) {
        button.classList.remove("active");
    });

    // Make clicked button active
    if (clickedButton) {
        clickedButton.classList.add("active");
    }
}


// ==========================================
// ADD MEDICINE TO LIST
// ==========================================

function addMedicine() {

    const medicineElement = document.getElementById("medicine");
    const quantityElement = document.getElementById("quantity");

    if (!medicineElement || !quantityElement) {
        alert("Medicine fields not found.");
        return;
    }

    const medicine = medicineElement.value;
    const quantity = parseInt(quantityElement.value);

    // Check quantity
    if (isNaN(quantity) || quantity < 1) {
        alert("Please enter a valid quantity.");
        return;
    }

    // Add medicine
    medicineList.push({
        medicine: medicine,
        quantity: quantity
    });

    // Display updated list
    displayMedicineList();

    // Update billing
    calculateBill();


    // Confirmation
    alert("Medicine added to list successfully!");
}


// ==========================================
// DISPLAY MEDICINE LIST
// ==========================================

function displayMedicineList() {

    const list = document.getElementById("medicineList");

    if (!list) {
        return;
    }

    // No medicines
    if (medicineList.length === 0) {
        list.innerHTML = "<p>No medicines added yet.</p>";
        return;
    }

    // Clear old list
    list.innerHTML = "";

    // Display every medicine
    medicineList.forEach(function(item, index) {

        const div = document.createElement("div");

        div.className = "medicine-item";

        div.innerHTML = `
            <span>
                ${item.medicine}
                × ${item.quantity}
            </span>

            <button
                class="remove-btn"
                onclick="removeMedicine(${index})"
            >
                Remove
            </button>
        `;

        list.appendChild(div);
    });
}


// ==========================================
// REMOVE MEDICINE
// ==========================================

function removeMedicine(index) {

    medicineList.splice(index, 1);

    displayMedicineList();
}


// ==========================================
// REQUEST MEDICINE
// ==========================================

function requestMedicine() {

    const roomElement = document.getElementById("room");
    const patientElement = document.getElementById("patient");

    if (!roomElement || !patientElement) {
        alert("Required fields are missing.");
        return;
    }

    const room = roomElement.value.trim();
    const patient = patientElement.value.trim();

    // Check room
    if (room === "") {
        alert("Please enter Ward / Room No.");
        return;
    }

    // Check patient
    if (patient === "") {
        alert("Please enter Patient ID / Name.");
        return;
    }

    // Check medicine
    if (medicineList.length === 0) {
        alert("Please add at least one medicine.");
        return;
    }

    // Create request
    const request = {

        id:
            "REQ-" +
            String(deliveryRequests.length + 1)
            .padStart(3, "0"),

        room: room,

        patient: patient,

        medicines:
            JSON.parse(
                JSON.stringify(medicineList)
            ),

        status: "Awaiting Loading"
    };

    // Save request
    deliveryRequests.push(request);

    // Clear medicine list
    medicineList = [];

    // Update screens
    displayMedicineList();
    displayMyRequests();
    displayPharmacistRequests();

    // Success message
    alert("Medicine request submitted successfully!");
}


// ==========================================
// DISPLAY NURSE REQUESTS
// ==========================================

function displayMyRequests() {

    const container = document.getElementById("requests");

    if (!container) {
        return;
    }

    if (deliveryRequests.length === 0) {

        container.innerHTML =
            "<p>No requests yet — submit one above.</p>";

        return;
    }

    container.innerHTML = "";

    deliveryRequests.forEach(function(request) {

        const div = document.createElement("div");

        div.className = "request-card";

        let medicines = "";

        request.medicines.forEach(function(item) {

            medicines +=
                item.medicine +
                " × " +
                item.quantity +
                "<br>";
        });

        div.innerHTML = `

            <h3>${request.id}</h3>

            <p>
                <b>Room:</b>
                ${request.room}
            </p>

            <p>
                <b>Patient:</b>
                ${request.patient}
            </p>

            <p>
                <b>Medicine:</b><br>
                ${medicines}
            </p>

            <p>
                <b>Status:</b>
                ${request.status}
            </p>

        `;

        container.appendChild(div);
    });
}


// ==========================================
// PHARMACIST - INCOMING REQUESTS
// ==========================================

function displayPharmacistRequests() {

    const container =
        document.getElementById("pharmacistRequests");

    if (!container) {
        return;
    }

    const pendingRequests =
        deliveryRequests.filter(function(request) {

            return request.status ===
                "Awaiting Loading";
        });

    if (pendingRequests.length === 0) {

        container.innerHTML =
            "<p>No new requests.</p>";

        return;
    }

    container.innerHTML = "";

    pendingRequests.forEach(function(request) {

        const div = document.createElement("div");

        div.className = "pharmacist-card";

        div.innerHTML = `

            <div>

                <h3>${request.id}</h3>

                <p>
                    <b>Room:</b>
                    ${request.room}
                </p>

                <p>
                    <b>Patient:</b>
                    ${request.patient}
                </p>

            </div>

            <button
                class="load-btn"
                onclick="loadMedicine('${request.id}')"
            >
                Load Medicine
            </button>

        `;

        container.appendChild(div);
    });
}


// ==========================================
// PHARMACIST - LOAD MEDICINE
// ==========================================

function loadMedicine(requestID) {

    const request =
        deliveryRequests.find(function(item) {

            return item.id === requestID;
        });

    if (!request) {
        alert("Request not found.");
        return;
    }

    // Change status
    request.status =
        "Loaded — Ready to Dispatch";

    // Refresh screens
    displayMyRequests();
    displayPharmacistRequests();
    displayLoadedRequests();

    alert(
        request.id +
        " medicine loaded successfully."
    );
}


// ==========================================
// DISPLAY LOADED REQUESTS
// ==========================================

function displayLoadedRequests() {

    const container =
        document.getElementById("loaded");

    if (!container) {
        return;
    }

    const loadedRequests =
        deliveryRequests.filter(function(request) {

            return request.status ===
                "Loaded — Ready to Dispatch";
        });

    if (loadedRequests.length === 0) {

        container.innerHTML =
            "<p>Nothing loaded yet.</p>";

        return;
    }

    container.innerHTML = "";

    loadedRequests.forEach(function(request) {

        const div = document.createElement("div");

        div.className = "pharmacist-card";

        div.innerHTML = `

            <div>

                <h3>${request.id}</h3>

                <p>
                    Room:
                    ${request.room}
                </p>

                <p>
                    Patient:
                    ${request.patient}
                </p>

            </div>

            <button
                class="load-btn"
                onclick="dispatchRobot('${request.id}')"
            >
                Dispatch Robot
            </button>

        `;

        container.appendChild(div);
    });
}


// ==========================================
// DISPATCH ROBOT
// ==========================================

function dispatchRobot(requestID) {

    const request =
        deliveryRequests.find(function(item) {

            return item.id === requestID;
        });

    if (!request) {
        alert("Request not found.");
        return;
    }

    // Change status
    request.status = "In Progress";

    // Update displays
    displayMyRequests();
    displayLoadedRequests();
    displayProgressRequests();

    // Update robot screen
    updateRobotDisplay(request);

    // Automatically simulate delivery
    setTimeout(function() {

        request.status = "Delivered";

        displayMyRequests();
        displayProgressRequests();

        const robotDisplay =
            document.getElementById("robotStatus");

        if (robotDisplay) {

            robotDisplay.innerHTML = `

                <h3>✓ Medicine Delivered</h3>

                <br>

                <p>
                    Request:
                    ${request.id}
                </p>

                <p>
                    Patient:
                    ${request.patient}
                </p>

                <p>
                    Destination:
                    Room ${request.room}
                </p>

                <br>

                <p>
                    Delivery completed successfully.
                </p>

            `;
        }

    }, 8000);
}


// ==========================================
// ROBOT DISPLAY
// ==========================================

function updateRobotDisplay(request) {

    const display =
        document.getElementById("robotStatus");

    if (!display) {
        return;
    }

    display.innerHTML = `

        <h3>🤖 Robot Delivering</h3>

        <br>

        <p>
            <b>Request:</b>
            ${request.id}
        </p>

        <p>
            <b>Patient:</b>
            ${request.patient}
        </p>

        <p>
            <b>Destination:</b>
            Room ${request.room}
        </p>

        <br>

        <p>
            Robot status:
            <b>ON THE WAY</b>
        </p>

    `;
}


// ==========================================
// IN-PROGRESS REQUESTS
// ==========================================

function displayProgressRequests() {

    const container =
        document.getElementById("progress");

    if (!container) {
        return;
    }

    const activeRequests =
        deliveryRequests.filter(function(request) {

            return request.status ===
                "In Progress";
        });

    if (activeRequests.length === 0) {

        container.innerHTML =
            "<p>No active deliveries.</p>";

        return;
    }

    container.innerHTML = "";

    activeRequests.forEach(function(request) {

        const div = document.createElement("div");

        div.className = "pharmacist-card";

        div.innerHTML = `

            <div>

                <h3>${request.id}</h3>

                <p>
                    Robot → Room
                    ${request.room}
                </p>

                <p>
                    Patient:
                    ${request.patient}
                </p>

            </div>

            <span class="badge">
                IN PROGRESS
            </span>

        `;

        container.appendChild(div);
    });
}


// ==========================================
// LOGIN
// ==========================================

function loginUser() {

    const userId =
        document.getElementById("userId").value.trim();

    const password =
        document.getElementById("password").value;

    if (userId === "admin" &&
        password === "1234") {

        document.getElementById(
            "loginPage"
        ).style.display = "none";

        document.getElementById(
            "dashboard"
        ).style.display = "block";

        document.getElementById(
            "loginMessage"
        ).innerText = "";

    } else {

        document.getElementById(
            "loginMessage"
        ).innerText =
            "Invalid User ID or Password.";
    }
}


// ==========================================
// INITIALIZE PAGE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayMedicineList();

        displayMyRequests();

        displayPharmacistRequests();

        displayLoadedRequests();

        displayProgressRequests();

    }
);

// your existing script.js code
// ...
// ...
// your existing last code here


// ==========================================
// BILLING CALCULATION
// ==========================================

function calculateBill() {

    const medicine =
        document.getElementById("medicine").value;

    const quantity =
        parseInt(document.getElementById("quantity").value);

    let price = 0;

    if (medicine.includes("Paracetamol")) {
        price = 5;
    }
    else if (medicine.includes("Amoxicillin")) {
        price = 6;
    }
    else if (medicine.includes("Cetirizine")) {
        price = 2;
    }
    else if (medicine.includes("Vitamin C")) {
        price = 2;
    }

    const total = price * quantity;

document.getElementById("totalAmount").innerText =
    "Total Amount: ₹" + total;

document.getElementById("billingDetails").innerHTML = `.
    <p><strong>Medicine:</strong> ${medicine}</p>
    <p><strong>Quantity:</strong> ${quantity}</p>
    <p><strong>Price per unit:</strong> ₹${price}</p>
    <p><strong>Total:</strong> ₹${total}</p>
`;
}