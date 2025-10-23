let currentEvent = null;
let uploadedImageUrls = []; // To store new image URLs



document.addEventListener("DOMContentLoaded", () => {
  const pathSegments = window.location.pathname.split("/");
  const eventId = pathSegments[pathSegments.length - 1]; // gets '19' from /event-details/19

  if (!eventId) {
    console.error("Event ID missing in URL");
    return;
  }

  fetch(`http://localhost:8083/api/events/${eventId}`)
    .then(res => {
      if (!res.ok) throw new Error("Event not found");
      return res.json();
    })
    .then(event => {
      currentEvent = event;
currentGalleryImages = event.imageUrls ? event.imageUrls.split(",").map(url => url.trim()) : [];

      document.getElementById("event-name").innerText = event.name;
      document.getElementById("event-date").innerText = event.date;
      document.getElementById("event-time").innerText = event.time;
      document.getElementById("event-location").innerText = event.location;
      document.getElementById("event-description").innerText = event.description;
 renderGallery(currentGalleryImages);
      // renderImages(event.imageUrls);

      // optional: store it in the hidden field too
      const hiddenInput = document.getElementById("event-id");
      if (hiddenInput) hiddenInput.value = eventId;
    })
    .catch(err => {
      console.error("Error loading event:", err);
      alert("Could not load event details.");
    });
});



const cloudName = "dgbfro133"; // Replace this with your Cloudinary cloud name
const uploadPreset = "socialsync"; // Replace this with your Cloudinary unsigned upload preset

async function uploadImages() {
  const files = document.getElementById("image-upload").files;
  const uploadedUrls = [];

  for (let file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    uploadedUrls.push(data.secure_url);
  }

  console.log("Uploaded URLs:", uploadedUrls);

  // Show image previews
  const previewDiv = document.getElementById("uploaded-preview");
  previewDiv.innerHTML = uploadedUrls.map(url => `<img src="${url}" width="100" class="rounded shadow-sm"/>`).join("");

  // Send the uploadedUrls to your Spring Boot backend to store them in DB
  currentEvent.imageUrls = [...(currentEvent.imageUrls?.split(",") || []), ...uploadedUrls].slice(0, 6).join(",");

  fetch(`http://localhost:8083/api/events/${currentEvent.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(currentEvent)
  }).then(res => {
    if (res.ok) {
      renderImages(currentEvent.imageUrls);
      alert("Images uploaded successfully!");
    }
  }).catch(err => {
    console.error("Failed to update event with new images", err);
    alert("Image upload failed.");
  });
}


function renderImages(urlsString) {
  const gallery = document.getElementById("event-image-gallery");
  gallery.innerHTML = "";

  const urls = urlsString ? urlsString.split(",").map(url => url.trim()) : [];

  urls.forEach((url) => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <a href="${url}" class="glightbox" data-gallery="event-gallery">
        <img src="${url}" class="img-fluid rounded shadow-sm" />
      </a>
    `;
    gallery.appendChild(col);
  });

  GLightbox({ selector: '.glightbox' });
}

// ========== Description Editing ==========
function enableEdit(section) {
  if (section === 'description') {
    document.getElementById("edit-description-area").classList.remove("d-none");
    document.getElementById("event-description").style.display = "none";
    document.getElementById("edit-description").value = currentEvent.description;
  }
}

function cancelEdit(section) {
  if (section === 'description') {
    document.getElementById("edit-description-area").classList.add("d-none");
    document.getElementById("event-description").style.display = "block";
  }
}

function saveDescription() {
  const newDesc = document.getElementById("edit-description").value;
  currentEvent.description = newDesc;

  fetch(`http://localhost:8083/api/events/${currentEvent.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(currentEvent)
  }).then(res => {
    if (res.ok) {
      document.getElementById("event-description").innerText = newDesc;
      cancelEdit('description');
    }
  });
}


let galleryEditMode = false;


let sortableInstance = null;

function toggleGalleryEdit() {
  galleryEditMode = true;
  renderGallery(currentGalleryImages);
  document.getElementById("save-gallery-btn").classList.remove("d-none");
  document.getElementById("upload-btn").classList.remove("d-none");

    // 🔄 Enable drag-and-drop
  sortableInstance = new Sortable(document.getElementById('event-image-gallery'), {
    animation: 150,
    onEnd: function (evt) {
    const oldIndex = evt.oldIndex;
    const newIndex = evt.newIndex;

    const movedItem = currentGalleryImages.splice(oldIndex, 1)[0];
    currentGalleryImages.splice(newIndex, 0, movedItem);

    // 🖼️ Re-render updated order
    renderGallery(currentGalleryImages);

    // 💾 SAVE the new order to backend
    const updatedEvent = {
      ...currentEvent,
      imageUrls: currentGalleryImages.join(",")
    };

    fetch(`http://localhost:8083/api/events/${currentEvent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    }).then(res => {
      if (res.ok) {
        currentEvent.imageUrls = updatedEvent.imageUrls;
        showToast("Gallery order saved!", "success");
      } else {
        showToast("Failed to save new order", "error");
      }
    }).catch(err => {
      console.error("Failed to save reordered images:", err);
      showToast("Error saving image order", "error");
    });
  }
});
}

function saveGalleryEdit() {
  galleryEditMode = false;
  renderGallery(currentGalleryImages);
  document.getElementById("save-gallery-btn").classList.add("d-none");
  document.getElementById("upload-btn").classList.add("d-none");
  showToast("Gallery saved successfully!", "success");

   // ❌ Disable drag-and-drop
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }

  // 💾 Optionally save to backend here if needed
}







// Store loaded image URLs (e.g., from Firebase or DB)
let currentGalleryImages = [];


function renderGallery(images) {
  const galleryContainer = document.getElementById("event-image-gallery");
  galleryContainer.innerHTML = "";

  images.forEach((url, index) => {
    const col = document.createElement("div");
    col.className = "col-md-4 position-relative";

    col.innerHTML = `
      <div class="gallery-image-wrapper">
        <a href="${url}" class="glightbox" data-gallery="event-gallery">
          <img src="${url}" class="img-fluid rounded shadow-sm" alt="Event Image ${index + 1}">
        </a>
        ${galleryEditMode ? `
        <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2" 
          onclick="confirmDeleteImage(${index})">&times;</button>` : ""}
      </div>
    `;
    galleryContainer.appendChild(col);
  });

  // ✅ Initialize GLightbox after rendering
  GLightbox({ selector: '.glightbox' });
}

function confirmDeleteImage(index) {
  if (confirm("Are you sure you want to delete this image?")) {
    currentGalleryImages.splice(index, 1);
    renderGallery(currentGalleryImages);
    showToast("Image deleted", "warning");
  }
}

// Remove image by index
function removeImage(index) {
  currentGalleryImages.splice(index, 1);
  renderGallery(currentGalleryImages);

  // Update DB after removal
  const updatedEvent = {
    ...currentEvent,
    imageUrls: currentGalleryImages.join(",")
  };

  fetch(`http://localhost:8083/api/events/${currentEvent.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedEvent),
  }).then(res => {
    if (res.ok) {
      currentEvent.imageUrls = updatedEvent.imageUrls;
    } else {
      alert("Failed to remove image.");
    }
  });
}


// Upload new images
async function uploadImages(event) {
  const files = event.target.files;
  if (!files.length) return;

  for (let file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      currentGalleryImages.push(data.secure_url);

    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      alert("Image upload failed.");
    }
  }

  // Limit to 6 images max
  currentGalleryImages = currentGalleryImages.slice(0, 6);
  renderGallery(currentGalleryImages);

  // Update in backend
  const updatedEvent = {
    ...currentEvent,
    imageUrls: currentGalleryImages.join(",")
  };

  fetch(`http://localhost:8083/api/events/${currentEvent.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedEvent),
  }).then(res => {
    if (res.ok) {
      alert("Images updated successfully!");
      currentEvent.imageUrls = updatedEvent.imageUrls;
    } else {
      alert("Failed to update images in backend.");
    }
  });
}

//Toast message
function showToast(message, type = "info") {
  const toastContainer = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = "toast-message shadow-sm";
  toast.style.backgroundColor =
    type === "success" ? "#28a745" :
    type === "warning" ? "#ffc107" :
    type === "error" ? "#dc3545" : "#333";

  toast.innerText = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}


