
// ========================================
// PET ADOPTION MANAGEMENT SYSTEM
// Main JavaScript
// ========================================

// ADMIN ACCOUNT
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// DEFAULT PET DATA
const defaultPets = [
    {
        id: 1,
        name: "Bella",
        type: "Dog",
        breed: "Golden Retriever",
        age: "2 years",
        gender: "Female",
        status: "Available",
        description: "Friendly and playful. Loves spending time with people.",
        emoji: "🐶"
    },
    {
        id: 2,
        name: "Milo",
        type: "Cat",
        breed: "Persian",
        age: "1 year",
        gender: "Male",
        status: "Available",
        description: "A calm and affectionate cat looking for a loving home.",
        emoji: "🐱"
    },
    {
        id: 3,
        name: "Coco",
        type: "Dog",
        breed: "Poodle",
        age: "3 years",
        gender: "Female",
        status: "Available",
        description: "An energetic dog who loves playing and walking.",
        emoji: "🐩"
    },
    {
        id: 4,
        name: "Luna",
        type: "Cat",
        breed: "Domestic Shorthair",
        age: "8 months",
        gender: "Female",
        status: "Adopted",
        description: "A sweet little cat with a gentle personality.",
        emoji: "🐈"
    }
];

// INITIALISE LOCAL STORAGE
function initialiseData() {

    if (!localStorage.getItem("pets")) {
        localStorage.setItem("pets", JSON.stringify(defaultPets));
    }

    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify([]));
    }

    if (!localStorage.getItem("applications")) {
        localStorage.setItem("applications", JSON.stringify([]));
    }
}

initialiseData();


// ========================================
// LOGIN AND REGISTER PAGE
// ========================================

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// SWITCH TO LOGIN
if (loginTab) {

    loginTab.addEventListener("click", function () {

        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");

        loginTab.classList.add("active");
        registerTab.classList.remove("active");

    });
}

// SWITCH TO REGISTER
if (registerTab) {

    registerTab.addEventListener("click", function () {

        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");

        registerTab.classList.add("active");
        loginTab.classList.remove("active");

    });
}


// ========================================
// REGISTER NEW ADOPTER
// ========================================

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const username = document.getElementById("registerUsername").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;

        const message = document.getElementById("registerMessage");

        let users = JSON.parse(localStorage.getItem("users")) || [];

        // CHECK EXISTING USERNAME
        const existingUser = users.find(
            user => user.username.toLowerCase() === username.toLowerCase()
        );

        if (username.toLowerCase() === ADMIN_USERNAME) {
            message.style.color = "red";
            message.textContent = "This username is unavailable.";
            return;
        }

        if (existingUser) {
            message.style.color = "red";
            message.textContent = "Username already exists.";
            return;
        }

        // CREATE NEW USER
        const newUser = {
            id: Date.now(),
            name: name,
            username: username,
            email: email,
            password: password,
            role: "adopter"
        };

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));

        message.style.color = "green";
        message.textContent = "Registration successful! You can now log in.";

        registerForm.reset();

    });

}


// ========================================
// USER LOGIN
// ========================================

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const username = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        // ADMIN LOGIN
        if (
            username === ADMIN_USERNAME &&
            password === ADMIN_PASSWORD
        ) {

            localStorage.setItem("currentUser", JSON.stringify({
                username: "admin",
                name: "System Administrator",
                role: "admin"
            }));

            window.location.href = "dashboard.html";
            return;

        }

        // ADOPTER LOGIN
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(
            account =>
                account.username.toLowerCase() === username.toLowerCase() &&
                account.password === password
        );

        if (user) {

            localStorage.setItem("currentUser", JSON.stringify(user));

            window.location.href = "browse.html";

        } else {

            message.style.color = "red";
            message.textContent = "Invalid username or password.";

        }

    });

}


// ========================================
// SHARED FUNCTIONS FOR OTHER PAGES
// ========================================

// GET CURRENT USER
function getCurrentUser() {

    return JSON.parse(localStorage.getItem("currentUser"));

}

// CHECK LOGIN
function checkLogin() {

    const user = getCurrentUser();

    if (!user) {
        window.location.href = "index.html";
        return null;
    }

    return user;
}

// CHECK ADMIN ACCESS
function checkAdmin() {

    const user = checkLogin();

    if (user && user.role !== "admin") {
        window.location.href = "pets.html";
        return null;
    }

    return user;
}

// LOGOUT
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "index.html";

}

// GET PET DATA
function getPets() {

    return JSON.parse(localStorage.getItem("pets")) || [];

}

// SAVE PET DATA
function savePets(pets) {

    localStorage.setItem("pets", JSON.stringify(pets));

}

// GET ADOPTION APPLICATIONS
function getApplications() {

    return JSON.parse(localStorage.getItem("applications")) || [];

}

// SAVE ADOPTION APPLICATIONS
function saveApplications(applications) {

    localStorage.setItem("applications", JSON.stringify(applications));

}

// GET REGISTERED USERS
function getUsers() {

    return JSON.parse(localStorage.getItem("users")) || [];

}

// ========================================
// ADMIN DASHBOARD FUNCTIONALITY
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const adminNameElement = document.getElementById("adminName");

    // Only run this section on dashboard page
    if (!adminNameElement) {
        return;
    }

    // CHECK ADMIN LOGIN
    const admin = checkAdmin();

    if (!admin) {
        return;
    }

    adminNameElement.textContent = admin.name || "Administrator";


    // GET DATA FROM LOCAL STORAGE
    const pets = getPets();
    const applications = getApplications();

    // COUNT PETS
    const totalPets = pets.length;

    const availablePets = pets.filter(
        pet => pet.status.toLowerCase() === "available"
    ).length;

    const adoptedPets = pets.filter(
        pet => pet.status.toLowerCase() === "adopted"
    ).length;

    const pendingApplications = applications.filter(
        application =>
            (application.status || "Pending").toLowerCase() === "pending"
    ).length;


    // DISPLAY STATISTICS
    document.getElementById("totalPets").textContent = totalPets;

    document.getElementById("availablePets").textContent = availablePets;

    document.getElementById("adoptedPets").textContent = adoptedPets;

    document.getElementById("pendingApplications").textContent =
        pendingApplications;


    // DISPLAY RECENT PETS
    const recentPetsTable = document.getElementById("recentPetsTable");

    if (recentPetsTable) {

        const recentPets = [...pets].reverse().slice(0, 5);

        if (recentPets.length === 0) {

            recentPetsTable.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">
                        No pet records available.
                    </td>
                </tr>
            `;

        } else {

            recentPetsTable.innerHTML = recentPets.map(pet => `

                <tr>
                    <td>${pet.emoji || "🐾"} ${pet.name}</td>
                    <td>${pet.type}</td>
                    <td>${pet.breed}</td>
                    <td>
                        <span class="status-badge">
                            ${pet.status}
                        </span>
                    </td>
                </tr>

            `).join("");

        }
    }


    // PET ADOPTION CHART
    const chartCanvas = document.getElementById("adoptionChart");

    if (chartCanvas && typeof Chart !== "undefined") {

        new Chart(chartCanvas, {

            type: "doughnut",

            data: {

                labels: [
                    "Available Pets",
                    "Adopted Pets"
                ],

                datasets: [{

                    data: [
                        availablePets,
                        adoptedPets
                    ],

                    backgroundColor: [
                        "#E9A2B6",
                        "#B98B9B"
                    ],

                    borderWidth: 2,
                    borderColor: "#FFFFFF"

                }]

            },

            options: {

                responsive: true,
                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        position: "bottom"
                    },

                    tooltip: {
                        enabled: true
                    }

                }

            }

        });

    }

});

// ========================================
// PET MANAGEMENT FUNCTIONS
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const petTableBody = document.getElementById("petTableBody");

    // Only run on Pet Management page
    if (!petTableBody) {
        return;
    }

    // CHECK ADMIN ACCESS
    const admin = checkAdmin();

    if (!admin) {
        return;
    }

    // PET EMOJI
    function getPetEmoji(type) {
        const emojis = {
            Dog: "🐶",
            Cat: "🐱",
            Rabbit: "🐰",
            Bird: "🐦",
            Other: "🐾"
        };

        return emojis[type] || "🐾";
    }


    // UPDATE PET STATISTICS
    function updatePetStats() {

        const pets = getPets();

        document.getElementById("petTotal").textContent = pets.length;

        document.getElementById("petAvailable").textContent =
            pets.filter(p => p.status === "Available").length;

        document.getElementById("petAdopted").textContent =
            pets.filter(p => p.status === "Adopted").length;

    }


    // DISPLAY PET RECORDS
    function displayPets() {

        const pets = getPets();

        const search = document.getElementById("petSearch").value.toLowerCase();

        const filter = document.getElementById("petFilter").value;

        const filteredPets = pets.filter(pet => {

            const matchesSearch =
                pet.name.toLowerCase().includes(search) ||
                pet.breed.toLowerCase().includes(search);

            const matchesFilter =
                filter === "All" || pet.status === filter;

            return matchesSearch && matchesFilter;

        });

        if (filteredPets.length === 0) {

            petTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-4">
                        No pets found.
                    </td>
                </tr>
            `;

        } else {

            petTableBody.innerHTML = filteredPets.map(pet => `

                <tr>

                    <td>
                        <span class="pet-table-emoji">
                            ${getPetEmoji(pet.type)}
                        </span>
                        <strong>${escapeHTML(pet.name)}</strong>
                    </td>

                    <td>${escapeHTML(pet.type)}</td>

                    <td>${escapeHTML(pet.breed)}</td>

                    <td>${escapeHTML(pet.age)}</td>

                    <td>${escapeHTML(pet.gender)}</td>

                    <td>
                        <span class="${
                            pet.status === "Available"
                            ? "pet-status-available"
                            : "pet-status-adopted"
                        }">
                            ${escapeHTML(pet.status)}
                        </span>
                    </td>

                    <td>
                        <button
                            class="pet-action-btn edit-pet"
                            onclick="editPet(${pet.id})">
                            Edit
                        </button>

                        <button
                            class="pet-action-btn delete-pet"
                            onclick="deletePet(${pet.id})">
                            Delete
                        </button>
                    </td>

                </tr>

            `).join("");

        }

        updatePetStats();

    }


    // SAFELY DISPLAY TEXT
    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function(char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char];
        });
    }


    // OPEN ADD PET FORM
    window.openPetForm = function () {

        document.getElementById("petForm").reset();

        document.getElementById("petId").value = "";

        document.getElementById("petFormTitle").textContent = "Add New Pet";

        document.getElementById("petFormSection").classList.remove("hidden");

        document.getElementById("petFormSection").scrollIntoView({
            behavior: "smooth"
        });

    };


    // CLOSE FORM
    window.closePetForm = function () {

        document.getElementById("petFormSection").classList.add("hidden");

    };


    // ADD OR UPDATE PET
    document.getElementById("petForm").addEventListener("submit", function(event) {

        event.preventDefault();

        const id = document.getElementById("petId").value;

        const pet = {

            id: id ? Number(id) : Date.now(),

            name: document.getElementById("petName").value.trim(),

            type: document.getElementById("petType").value,

            breed: document.getElementById("petBreed").value.trim(),

            age: document.getElementById("petAge").value.trim(),

            gender: document.getElementById("petGender").value,

            status: document.getElementById("petStatus").value,

            description: document.getElementById("petDescription").value.trim(),

            emoji: getPetEmoji(document.getElementById("petType").value)

        };

        let pets = getPets();

        if (id) {

            pets = pets.map(oldPet =>
                oldPet.id === Number(id) ? pet : oldPet
            );

            alert("Pet information updated successfully!");

        } else {

            pets.push(pet);

            alert("New pet added successfully!");

        }

        savePets(pets);

        document.getElementById("petForm").reset();

        closePetForm();

        displayPets();

    });


    // EDIT PET
    window.editPet = function(id) {

        const pets = getPets();

        const pet = pets.find(p => p.id === id);

        if (!pet) return;

        document.getElementById("petId").value = pet.id;
        document.getElementById("petName").value = pet.name;
        document.getElementById("petType").value = pet.type;
        document.getElementById("petBreed").value = pet.breed;
        document.getElementById("petAge").value = pet.age;
        document.getElementById("petGender").value = pet.gender;
        document.getElementById("petStatus").value = pet.status;
        document.getElementById("petDescription").value = pet.description || "";

        document.getElementById("petFormTitle").textContent = "Edit Pet Information";

        document.getElementById("petFormSection").classList.remove("hidden");

        document.getElementById("petFormSection").scrollIntoView({
            behavior: "smooth"
        });

    };


    // DELETE PET
    window.deletePet = function(id) {

        const confirmDelete = confirm(
            "Are you sure you want to delete this pet record?"
        );

        if (!confirmDelete) return;

        let pets = getPets();

        pets = pets.filter(p => p.id !== id);

        savePets(pets);

        displayPets();

        alert("Pet record deleted successfully!");

    };


    // SEARCH PETS
    document.getElementById("petSearch").addEventListener("input", displayPets);

    // FILTER PETS
    document.getElementById("petFilter").addEventListener("change", displayPets);


    // INITIAL DISPLAY
    displayPets();

});

// ========================================
// ADOPTION APPLICATION MANAGEMENT
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const tableBody = document.getElementById("applicationTableBody");

    // Only run on Adoption Applications page
    if (!tableBody) {
        return;
    }

    // CHECK ADMIN ACCESS
    const admin = checkAdmin();

    if (!admin) {
        return;
    }


    // SAFE TEXT DISPLAY
    function safeText(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }


    // DISPLAY APPLICATION STATISTICS
    function updateApplicationStats() {

        const applications = getApplications();

        document.getElementById("totalApplications").textContent =
            applications.length;

        document.getElementById("pendingCount").textContent =
            applications.filter(a => a.status === "Pending").length;

        document.getElementById("approvedCount").textContent =
            applications.filter(a => a.status === "Approved").length;

        document.getElementById("rejectedCount").textContent =
            applications.filter(a => a.status === "Rejected").length;

    }


    // DISPLAY APPLICATION RECORDS
    function displayApplications() {

        const applications = getApplications();

        const search = document.getElementById(
            "applicationSearch"
        ).value.toLowerCase();

        const filter = document.getElementById(
            "applicationFilter"
        ).value;

        const filtered = applications.filter(application => {

            const applicant = application.applicantName || "";
            const petName = application.petName || "";

            const matchesSearch =
                applicant.toLowerCase().includes(search) ||
                petName.toLowerCase().includes(search);

            const matchesFilter =
                filter === "All" || application.status === filter;

            return matchesSearch && matchesFilter;

        });


        if (filtered.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5 text-muted">
                        No adoption applications found.
                        <br>
                        <small>New applications will appear here.</small>
                    </td>
                </tr>
            `;

        } else {

            tableBody.innerHTML = filtered.map(application => {

                const status = application.status || "Pending";

                const statusClass = {
                    Pending: "application-pending",
                    Approved: "application-approved",
                    Rejected: "application-rejected"
                }[status] || "application-pending";

                const date = application.date || "Not provided";

                return `

                    <tr>

                        <td>
                            <strong>
                                ${safeText(application.applicantName)}
                            </strong>
                            <br>
                            <small class="text-muted">
                                ${safeText(application.phone || "")}
                            </small>
                        </td>

                        <td>${safeText(application.email)}</td>

                        <td>🐾 ${safeText(application.petName)}</td>

                        <td>${safeText(date)}</td>

                        <td>
                            <span class="${statusClass}">
                                ${safeText(status)}
                            </span>
                        </td>

                        <td>

                            <button
                                class="application-action approve-btn"
                                data-id="${Number(application.id)}"
                                data-action="approve"
                                ${status !== "Pending" ? "disabled" : ""}>
                                Approve
                            </button>

                            <button
                                class="application-action reject-btn"
                                data-id="${Number(application.id)}"
                                data-action="reject"
                                ${status !== "Pending" ? "disabled" : ""}>
                                Reject
                            </button>

                        </td>

                    </tr>

                `;

            }).join("");

        }

        updateApplicationStats();

    }


    // APPROVE OR REJECT APPLICATION
    tableBody.addEventListener("click", function(event) {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const id = Number(button.dataset.id);
        const action = button.dataset.action;

        let applications = getApplications();

        const application = applications.find(a => a.id === id);

        if (!application || application.status !== "Pending") {
            return;
        }

        if (action === "approve") {

            const confirmed = confirm(
                "Approve this adoption application?"
            );

            if (!confirmed) return;

            const pets = getPets();

            const pet = pets.find(
                p => Number(p.id) === Number(application.petId)
            );

            if (!pet || pet.status !== "Available") {

                alert(
                    "This pet is no longer available. The application cannot be approved."
                );

                return;

            }

            // UPDATE APPLICATION
            application.status = "Approved";

            // UPDATE PET STATUS
            pet.status = "Adopted";

            savePets(pets);

            // Prevent another pending application for the same pet
            applications.forEach(other => {

                if (
                    other.id !== application.id &&
                    Number(other.petId) === Number(application.petId) &&
                    other.status === "Pending"
                ) {
                    other.status = "Rejected";
                }

            });

            saveApplications(applications);

            alert("Application approved successfully! ❤️");

        } else if (action === "reject") {

            const confirmed = confirm(
                "Are you sure you want to reject this application?"
            );

            if (!confirmed) return;

            application.status = "Rejected";

            saveApplications(applications);

            alert("Application rejected.");

        }

        displayApplications();

    });


    // SEARCH APPLICATIONS
    document.getElementById("applicationSearch")
        .addEventListener("input", displayApplications);


    // FILTER APPLICATIONS
    document.getElementById("applicationFilter")
        .addEventListener("change", displayApplications);


    // INITIAL DISPLAY
    displayApplications();

});

// ========================================
// PUBLIC ADOPTER PET GALLERY
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const gallery = document.getElementById("publicPetGallery");

    // Only run on the public browse page
    if (!gallery) return;

    // CHECK ADOPTER LOGIN
    const user = getCurrentUser();

    if (!user || user.role !== "adopter") {
        window.location.href = "index.html";
        return;
    }

    // SHOW ADOPTER NAME
    document.getElementById("adopterName").textContent =
        user.name || user.username;

    // BOOTSTRAP MODAL
    const modalElement = document.getElementById("adoptionModal");
    const adoptionModal = new bootstrap.Modal(modalElement);


    // SAFE TEXT DISPLAY
    function safeText(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }


    // PET EMOJI
    function getEmoji(type) {

        const emojis = {
            Dog: "🐶",
            Cat: "🐱",
            Rabbit: "🐰",
            Bird: "🐦",
            Other: "🐾"
        };

        return emojis[type] || "🐾";
    }


    // DISPLAY AVAILABLE PETS
    function displayPublicPets() {

        const pets = getPets();

        const search = document.getElementById(
            "browseSearch"
        ).value.toLowerCase();

        const filter = document.getElementById(
            "browseFilter"
        ).value;

        const availablePets = pets.filter(pet => {

            const matchesSearch =
                pet.name.toLowerCase().includes(search) ||
                pet.breed.toLowerCase().includes(search);

            const matchesFilter =
                filter === "All" || pet.type === filter;

            return (
                pet.status === "Available" &&
                matchesSearch &&
                matchesFilter
            );

        });


        if (availablePets.length === 0) {

            gallery.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h3>🐾</h3>
                    <h5>No pets available</h5>
                    <p class="text-muted small">
                        Please check again later.
                    </p>
                </div>
            `;

            return;

        }

        function getPetImage(pet) {

            const petImages = {
                bella: "images/dog.jpg",
                milo: "images/cat.jpg",
                coco: "images/coco.jpg",
                luna: "images/luna.jpg",
                oreo: "images/oreo.jpg",
                snowy: "images/snowy.jpg",
                kiwi: "images/bird.jpg",
                snowball: "images/rabbit.jpg",
                hammy: "images/hamster.jpg",
                shelly: "images/turtle.jpg",
                peanut: "images/guineapig.jpg",
                spike: "images/hedgehog.jpg",
                ash: "images/ash.jpg",
                mimi: "images/mimi.jpg",
                oyen: "images/oyen.jpg"
            };

            const petName = pet.name.toLowerCase();

            return petImages[petName] ||
                (pet.type.toLowerCase() === "dog"
                    ? "images/dog.jpg"
                    : "images/cat.jpg");
        }


        gallery.innerHTML = availablePets.map(pet => `

            <div class="col-md-6 col-lg-4">

                <div class="public-pet-card">
                    
            <div class="public-pet-image">
                <img
                    src="${getPetImage(pet)}"
                    alt="${safeText(pet.name)}"
                    class="pet-photo"
                    onerror="this.style.display='none'; this.parentElement.innerHTML='🐾';"
                >
            </div>


                    <div class="public-pet-details">

                        <h5>${safeText(pet.name)}</h5>

                        <p>
                            ${safeText(pet.description || "Looking for a loving home.")}
                        </p>

                        <span class="pet-detail-label">
                            ${safeText(pet.type)}
                        </span>

                        <span class="pet-detail-label">
                            ${safeText(pet.breed)}
                        </span>

                        <span class="pet-detail-label">
                            ${safeText(pet.age)}
                        </span>

                        <span class="pet-detail-label">
                            ${safeText(pet.gender)}
                        </span>

                        <button
                            class="adopt-button"
                            data-pet-id="${Number(pet.id)}">
                            Apply for Adoption ❤️
                        </button>

                    </div>

                </div>

            </div>

        `).join("");

    }


    // OPEN ADOPTION FORM
    gallery.addEventListener("click", function(event) {

        const button = event.target.closest("[data-pet-id]");

        if (!button) return;

        const petId = Number(button.dataset.petId);

        const pet = getPets().find(
            p => Number(p.id) === petId
        );

        if (!pet || pet.status !== "Available") {
            alert("Sorry, this pet is no longer available.");
            displayPublicPets();
            return;
        }

        // CHECK EXISTING APPLICATION
        const applications = getApplications();

        const existing = applications.find(a =>
            Number(a.petId) === petId &&
            a.applicantUsername === user.username &&
            ["Pending", "Approved"].includes(a.status)
        );

        if (existing) {
            alert("You already have an active application for this pet.");
            return;
        }

        document.getElementById("selectedPetId").value = pet.id;

        document.getElementById("selectedPetName").value = pet.name;

        document.getElementById("applicantName").value =
            user.name || "";

        document.getElementById("applicantEmail").value =
            user.email || "";

        document.getElementById("applicantPhone").value = "";

        document.getElementById("adoptionReason").value = "";

        adoptionModal.show();

    });


    // SUBMIT ADOPTION APPLICATION
    document.getElementById("adoptionForm")
        .addEventListener("submit", function(event) {

        event.preventDefault();

        const petId = Number(
            document.getElementById("selectedPetId").value
        );

        const pet = getPets().find(
            p => Number(p.id) === petId
        );

        if (!pet || pet.status !== "Available") {
            alert("This pet is no longer available.");
            adoptionModal.hide();
            displayPublicPets();
            return;
        }

        let applications = getApplications();

        const duplicate = applications.find(a =>
            Number(a.petId) === petId &&
            a.applicantUsername === user.username &&
            ["Pending", "Approved"].includes(a.status)
        );

        if (duplicate) {
            alert("You already submitted an application for this pet.");
            return;
        }


        const newApplication = {

            id: Date.now(),

            petId: pet.id,

            petName: pet.name,

            applicantName:
                document.getElementById("applicantName").value.trim(),

            applicantUsername: user.username,

            email:
                document.getElementById("applicantEmail").value.trim(),

            phone:
                document.getElementById("applicantPhone").value.trim(),

            reason:
                document.getElementById("adoptionReason").value.trim(),

            date: new Date().toLocaleDateString("en-MY"),

            status: "Pending"

        };


        applications.push(newApplication);

        saveApplications(applications);

        alert(
            "Your adoption application has been submitted successfully! ❤️"
        );

        adoptionModal.hide();

        document.getElementById("adoptionForm").reset();

        displayMyApplications();

    });


    // DISPLAY MY APPLICATIONS
    function displayMyApplications() {

        const body = document.getElementById(
            "myApplicationsBody"
        );

        const applications = getApplications().filter(
            a => a.applicantUsername === user.username
        );

        if (applications.length === 0) {

            body.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-muted py-4">
                        You have not submitted any applications yet.
                    </td>
                </tr>
            `;

            return;

        }

        body.innerHTML = applications.map(application => {

            const status = application.status || "Pending";

            const statusClass = {
                Pending: "application-pending",
                Approved: "application-approved",
                Rejected: "application-rejected"
            }[status] || "application-pending";

            return `

                <tr>

                    <td>🐾 ${safeText(application.petName)}</td>

                    <td>${safeText(application.date)}</td>

                    <td>
                        <span class="${statusClass}">
                            ${safeText(status)}
                        </span>
                    </td>

                </tr>

            `;

        }).join("");

    }


    // SEARCH
    document.getElementById("browseSearch")
        .addEventListener("input", displayPublicPets);

    // FILTER
    document.getElementById("browseFilter")
        .addEventListener("change", displayPublicPets);


    // INITIAL DISPLAY
    displayPublicPets();

    displayMyApplications();

});

// ========================================
// REPORTS AND ANALYTICS
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // Only run on Reports page
    if (!document.getElementById("petStatusChart")) {
        return;
    }

    // CHECK ADMIN ACCESS
    const admin = checkAdmin();

    if (!admin) return;


    // GET SYSTEM DATA
    const pets = getPets();
    const applications = getApplications();


    // PET STATISTICS
    const available = pets.filter(
        p => p.status === "Available"
    ).length;

    const adopted = pets.filter(
        p => p.status === "Adopted"
    ).length;


    // APPLICATION STATISTICS
    const pending = applications.filter(
        a => a.status === "Pending"
    ).length;

    const approved = applications.filter(
        a => a.status === "Approved"
    ).length;

    const rejected = applications.filter(
        a => a.status === "Rejected"
    ).length;


    // DISPLAY SUMMARY CARDS
    document.getElementById("reportTotalPets").textContent =
        pets.length;

    document.getElementById("reportAvailable").textContent =
        available;

    document.getElementById("reportAdopted").textContent =
        adopted;

    document.getElementById("reportApplications").textContent =
        applications.length;

    document.getElementById("reportPending").textContent =
        pending;

    document.getElementById("reportApproved").textContent =
        approved;

    document.getElementById("reportRejected").textContent =
        rejected;


    // PET ADOPTION STATUS CHART
    new Chart(document.getElementById("petStatusChart"), {

        type: "doughnut",

        data: {

            labels: ["Available", "Adopted"],

            datasets: [{

                data: [available, adopted],

                backgroundColor: [
                    "#E9A2B6",
                    "#B98B9B"
                ],

                borderWidth: 3,
                borderColor: "#FFFFFF"

            }]

        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            plugins: {

                legend: {
                    position: "bottom"
                }

            }

        }

    });


    // APPLICATION STATUS CHART
    new Chart(document.getElementById("applicationStatusChart"), {

        type: "bar",

        data: {

            labels: ["Pending", "Approved", "Rejected"],

            datasets: [{

                label: "Number of Applications",

                data: [pending, approved, rejected],

                backgroundColor: [
                    "#F2C77D",
                    "#92C9A3",
                    "#E99AAA"
                ],

                borderRadius: 8

            }]

        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            scales: {

                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }

            },

            plugins: {

                legend: {
                    display: false
                }

            }

        }

    });


    // PET CATEGORY DISTRIBUTION
    const petTypes = ["Dog", "Cat", "Rabbit", "Bird", "Other"];

    const petTypeCounts = petTypes.map(type =>

        pets.filter(pet => pet.type === type).length

    );


    new Chart(document.getElementById("petTypeChart"), {

        type: "bar",

        data: {

            labels: petTypes,

            datasets: [{

                label: "Number of Pets",

                data: petTypeCounts,

                backgroundColor: [
                    "#E9A2B6",
                    "#DCA8C2",
                    "#EBC4D2",
                    "#C5A4C9",
                    "#E8B5A1"
                ],

                borderRadius: 8

            }]

        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            scales: {

                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }

            },

            plugins: {

                legend: {
                    display: false
                }

            }

        }

    });


    // PET SUMMARY TABLE
    const summaryTable = document.getElementById("petSummaryTable");

    summaryTable.innerHTML = petTypes.map(type => {

        const typePets = pets.filter(
            pet => pet.type === type
        );

        const typeAvailable = typePets.filter(
            pet => pet.status === "Available"
        ).length;

        const typeAdopted = typePets.filter(
            pet => pet.status === "Adopted"
        ).length;

        return `

            <tr>

                <td>${type}</td>

                <td>${typePets.length}</td>

                <td>${typeAvailable}</td>

                <td>${typeAdopted}</td>

            </tr>

        `;

    }).join("");

});

