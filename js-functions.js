// ===============================
// 🚪 Login check on load
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("loggedUser");
    const isLoggedIn = localStorage.getItem("loggedIn");

    if (!user || isLoggedIn !== "true") {
        window.location.href = "index.html"; // redirect if not logged in
    } else {
        document.getElementById("loggedUser").textContent = user;
        loadPhotos();
        loadCustomTheme();
    }
});

// ===============================
// 🔐 Logout function
// ===============================
function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
}

// ===============================
// 📸 Upload photo
// ===============================
function uploadPhoto() {
    const fileInput = document.getElementById("photoInput");
    const descriptionInput = document.getElementById("photoDescription");
    const file = fileInput.files[0];
    const description = descriptionInput.value.trim();
    const loggedUser = localStorage.getItem("loggedUser");

    if (!file || !description) {
        alert("Please select a photo and enter a description.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        let photos = JSON.parse(localStorage.getItem("photos")) || [];

        photos.push({
            src: e.target.result,
            description: description,
            owner: loggedUser,
            album: "My Album",
            public: true
        });

        localStorage.setItem("photos", JSON.stringify(photos));
        loadPhotos();
        fileInput.value = "";
        descriptionInput.value = "";
    };

    reader.readAsDataURL(file);
}

// ===============================
// 🖼️ Load & display photos
// ===============================
function loadPhotos() {
    const photoContainer = document.getElementById("photo-container");
    const photos = JSON.parse(localStorage.getItem("photos")) || [];
    const loggedUser = localStorage.getItem("loggedUser");

    photoContainer.innerHTML = "";

    photos.forEach((photo, index) => {
        const div = document.createElement("div");
        div.classList.add("photo");

        const img = document.createElement("img");
        img.src = photo.src;
        div.appendChild(img);

        const descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add("description");
        descriptionDiv.textContent = photo.description;
        div.appendChild(descriptionDiv);

        const controls = document.createElement("div");
        controls.classList.add("controls");
        controls.innerHTML = `Album: ${photo.album} | Public: ${photo.public ? "Yes" : "No"}`;

        // Only allow delete if it's the owner or the admin user "2013"
        if (photo.owner === loggedUser || loggedUser === "2013") {
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function() {
                deletePhoto(index);
            };
            controls.appendChild(deleteButton);
        }

        div.appendChild(controls);
        photoContainer.appendChild(div);
    });
}

// ===============================
// 🗑️ Delete a photo
// ===============================
function deletePhoto(index) {
    let photos = JSON.parse(localStorage.getItem("photos")) || [];
    const loggedUser = localStorage.getItem("loggedUser");

    if (photos[index].owner === loggedUser || loggedUser === "2013") {
        photos.splice(index, 1);
        localStorage.setItem("photos", JSON.stringify(photos));
        loadPhotos();
    } else {
        alert("You can only delete your own photos.");
    }
}

// ===============================
// 🌈 Theme Switcher
// ===============================
function applyTheme() {
    document.body.classList.add("fade-out");

    setTimeout(() => {
        const color = document.getElementById("bgColorPicker").value;
        const imageFile = document.getElementById("bgImagePicker").files[0];

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.body.style.background = `url('${e.target.result}') no-repeat center center fixed`;
                document.body.style.backgroundSize = "cover";
                localStorage.setItem("bgImage", e.target.result);
                localStorage.removeItem("bgColor");

                document.body.classList.remove("fade-out");
                document.body.classList.add("fade-in");
            };
            reader.readAsDataURL(imageFile);
        } else {
            document.body.style.background = color;
            localStorage.setItem("bgColor", color);
            localStorage.removeItem("bgImage");

            document.body.classList.remove("fade-out");
            document.body.classList.add("fade-in");
        }
    }, 300);
}

// Load saved theme
function loadCustomTheme() {
    const savedColor = localStorage.getItem("bgColor");
    const savedImage = localStorage.getItem("bgImage");

    if (savedImage) {
        document.body.style.background = `url('${savedImage}') no-repeat center center fixed`;
        document.body.style.backgroundSize = "cover";
    } else if (savedColor) {
        document.body.style.background = savedColor;
    }
}

// Reset theme to default
function resetTheme() {
    localStorage.removeItem("bgColor");
    localStorage.removeItem("bgImage");
    document.body.style.background = "#fffafc"; // default cute pink
}
