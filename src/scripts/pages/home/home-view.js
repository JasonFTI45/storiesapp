import { getStories, addStory, addGuestStory } from "../../data/api.js";
import { idbSaveStory } from '../../utils/idb.js';

export default class HomeView {
  async render() {
    return `
      <section class="container">
        <h1>Home Page</h1>
        <p class="homeInfo">Sharing stories is a powerful way to connect with others, inspire change, and preserve memories. Every story holds a unique perspective, offering a glimpse into the experiences, emotions, and journeys of the storyteller. Whether it's a tale of triumph, a moment of vulnerability, or a simple reflection on everyday life, stories have the ability to resonate deeply with others. By sharing your story, you not only express yourself but also create a bridge of understanding and empathy with your audience. 
        Stories can spark conversations, foster community, and even motivate others to share their own experiences. In a world where everyone has a voice, your story matters—it has the potential to inspire, educate, and leave a lasting impact. So take a moment to reflect, capture your thoughts, and share your story with the world. You never know who might be touched by your words or how your experiences might inspire someone else to embark on their own journey.</p>
        <div id="stories-container" class="stories-container">
          <h2>Stories</h2>
          <div id="stories-list"></div>
          <button class="addstory" onclick="toggleStoryForm()">+</button>
          <form id="storyForm" class="hidden">
            <video id="video" autoplay></video>
            <div class="cenrow" id="capture">
            <button type="button" id="captureButton" class="form-button">Capture Photo</button>
            <button type="button" id="resetPhotoButton" class="form-button">Reset Photo</button>
            </div>
            <canvas id="canvas" class="hidden"></canvas>
            <input type="file" id="photoUrl" accept="image/*" required />
            <small class="error" id="photoUrlError"></small>
            <textarea id="desc" placeholder="Description" required></textarea>
            <small class="error" id="descError"></small> 
            <div id="input-map"></div>
            <div class="row" id="locate">
            <p class ="label">Latitude</p>
            <input type="float" id="lati" placeholder="Latitude">
            </div>
            <div class="row" id="locate">
            <p class ="label">Longitude</p>
            <input type="float" id="long" placeholder="Longitude">
            </div>
            <button class="submit-button" type="submit">Add Story</button>
          </form>
        </div>
      </section>  
    `;
  }

  async afterRender() {
    const latInput = document.getElementById("lati");
    const lonInput = document.getElementById("long");

    const map = L.map("input-map").setView([-6.2088, 106.8456], 13); // Default ke Jakarta

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Tambahkan event klik untuk menangkap latitude dan longitude
    map.on("click", (event) => {
      const { lat, lng } = event.latlng;

      latInput.value = lat.toFixed(6);
      lonInput.value = lng.toFixed(6);

      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`)
        .openPopup();
    });

    const descriptionInput = document.getElementById("desc");
    const photoInput = document.getElementById("photoUrl");

    descriptionInput.addEventListener("input", this.validateForm.bind(this));
    photoInput.addEventListener("input", this.validateForm.bind(this));
  }

  bindAddStory(handler) {
    document.getElementById("storyForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const description = document.getElementById("desc").value;
      const photo = document.getElementById("photoUrl").files[0];
      const lat = document.getElementById("lati").value.trim();
      const lon = document.getElementById("long").value.trim();

      // Convert empty lat/lon to undefined
      const latValue = lat === "" ? undefined : parseFloat(lat);
      const lonValue = lon === "" ? undefined : parseFloat(lon);

      handler({ description, photo, lat: latValue, lon: lonValue });
    });
  }

  validateForm() {
    const description = document.getElementById("desc").value;
    const photoInput = document.getElementById("photoUrl");
    const descError = document.getElementById("descError");
    const photoUrlError = document.getElementById("photoUrlError");

    let isValid = true;

    if (!description.trim()) {
      descError.textContent = "Description is required.";
      descError.style.display = "block";
      isValid = false;
    } else {
      descError.textContent = "";
      descError.style.display = "none";
    }

    if (!photoInput.files || photoInput.files.length === 0) {
      photoUrlError.textContent = "Photo is required.";
      photoUrlError.style.display = "block";
      isValid = false;
    } else {
      const photo = photoInput.files[0];
      if (photo.size > 1048576) {
        const dataTransfer = new DataTransfer();
        photoInput.files = dataTransfer.files;
        photoUrlError.textContent = "Photo size must not exceed 1MB.";
        photoUrlError.style.display = "block";
        isValid = false;
      } else {
        photoUrlError.textContent = "";
        photoUrlError.style.display = "none";
      }
    }

    return isValid;
  }

  renderStories(stories, container) {
    container.innerHTML = "";

    if (stories.length === 0) {
      container.innerHTML = "<p>No stories available.</p>";
      return;
    }

    stories.forEach((story) => {
      const storyElement = document.createElement("div");
      storyElement.classList.add("story-item");
      storyElement.innerHTML = `
      <div class="cenrow">
        <img src="${story.photoUrl}" alt="${story.name}" class="story-image" />
        <div id="map-${story.id}" class="story-map" style="height: 450px;"></div>
      </div>
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p>Latitude: ${story.lat ?? "-"} , Longitude: ${story.lon ?? "-"}</p>
        <button type="button" id="locateButton" class="save-button">Save Story</button>
      `;
      container.appendChild(storyElement);

      // Default to Jakarta if no location is provided
      const latitude = story.lat ?? -6.2088;
      const longitude = story.lon ?? 106.8456;

      const map = L.map(`map-${story.id}`).setView([latitude, longitude], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`<strong>${story.name}</strong><br>${story.description}`)
        .openPopup();
    });
  }

  
  getStoriesContainer() {
    return document.getElementById("stories-list");
  }
}
