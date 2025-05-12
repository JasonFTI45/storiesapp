// CSS imports
import "../styles/styles.css";
import HomePresenter from "./presenters/home-presenter.js";
import RegisterPresenter from "./presenters/register-presenter.js";
import LoginPresenter from "./presenters/login-presenter.js";
import LogoutPage from "./pages/auth/logout-page.js";
import SavedPage from "./pages/saved/saved-page.js";
import NotFoundView from "./pages/not_found.js";
import { subscribePush, unsubscribePush } from "./data/api.js";
import { idbSaveStory } from './utils/idb.js';
import App from "./pages/app";

const homePresenter = new HomePresenter();
const registerPresenter = new RegisterPresenter();
const loginPresenter = new LoginPresenter();
const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
const main = document.getElementById("main-content");
let isCameraActive = false;
let stream;

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  await app.renderPage();
  const skipToContentLink = document.querySelector(".skip-to-content");
  skipToContentLink.addEventListener("click", (event) => {
    event.preventDefault();

    const storiesList = document.getElementById("stories-list");

    if (storiesList) {
      storiesList.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  const logStatus = document.getElementById("log-status");
  const registerButton = document.getElementById("register");
  const token = localStorage.getItem("token");
  const subscribeButton = document.getElementById("subscribe-button");
  const saveButtons = document.querySelectorAll('.save-button');
    document.querySelectorAll('.save-button').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const story = stories[index];
      idbSaveStory(story);
      alert('Story saved!');
    });
  });

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    updateSubscribeButton(subscription);
  } else {
    console.log("Not subscribed. Ready to subscribe.");
    updateSubscribeButton(null);
  }

  subscribeButton.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to manage notifications.");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const currentSubscription = await registration.pushManager.getSubscription();

    if (currentSubscription) {
      const result = await unsubscribePush({ subscription: currentSubscription, token });
      console.log("Unsubscribed successfully:", result.message);
      await currentSubscription.unsubscribe();
    } else {
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
      const result = await subscribePush({ subscription: newSubscription, token });
      console.log("Subscribed successfully:", result.message);
    }

    // Fetch updated subscription and update UI
    const updatedSubscription = await registration.pushManager.getSubscription();
    updateSubscribeButton(updatedSubscription);
  } catch (error) {
    console.error("Error managing subscription:", error.message);
  }
});

  if (token) {
    logStatus.innerHTML =
      '<a href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a>';
    registerButton.classList.add("hidden");
    logStatus.addEventListener("click", () => {
      localStorage.removeItem("token");
      logStatus.innerHTML =
        '<a href="#/login"><i class="fas fa-sign-in-alt"></i> Login</a>';
      window.location.hash = "/";
    });
  } else {
    logStatus.innerHTML =
      '<a href="#/login"><i class="fas fa-sign-in-alt"></i> Login</a>';
    registerButton.classList.remove("hidden");
  }

  if (saveButtons.length === 0) {
    console.warn('No save buttons found in the DOM.');
  } else {
    saveButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const story = stories[index];
        idbSaveStory(story);
        alert('Story saved!');
      });
    });
  }

  const handleRouteChange = async () => {
    const hash = window.location.hash;

    if (hash === "#/register") {
      console.log("Navigating to register page...");
      const registerPresenter = new RegisterPresenter();
      await registerPresenter.init();
    } else if (hash === "#/login") {
      console.log("Navigating to login page...");
      const loginPresenter = new LoginPresenter();
      await loginPresenter.init();
    } else if (hash === "#/saved") {
      console.log("Navigating to saved page...");
      const savedPage = new SavedPage();
      main.innerHTML = await savedPage.render();
      await savedPage.afterRender();
    } else if (hash === "#/logout") {
      console.log("Navigating to logout page...");
      const logoutPage = new LogoutPage();
      main.innerHTML = await logoutPage.render();
      await logoutPage.afterRender();
    } else if (hash === "" || hash === "#/") {
      console.log("Navigating to home page...");
      await app.renderPage();
      const homePresenter = new HomePresenter();
      homePresenter.init();
    } else {
      console.log("Navigating to Not Found page...");
      const notFoundView = new NotFoundView();
      main.innerHTML = await notFoundView.render();
    }
  };
  
  await handleRouteChange();



  window.addEventListener("hashchange", async () => {
    const content = document.querySelector(".main-content");
    content.dataset.viewTransitionName = "page-transition";

    document.startViewTransition(async () => {
      await app.renderPage();
      await handleRouteChange();
    });
  });
});

export async function toggleStoryForm() {
  const form = document.getElementById("storyForm");
  form.dataset.viewTransitionName = "story-form";

  document.startViewTransition(() => {
    if (form.classList.contains("hidden")) {
      setupCamera();
      form.classList.remove("hidden");
      form.focus();
    } else {
      stopCamera();
      form.classList.add("hidden");
    }
  });
}

window.toggleStoryForm = toggleStoryForm;

async function setupCamera() {
  if (isCameraActive) {
    console.log("Camera is already active.");
    return;
  }

  isCameraActive = true;

  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const captureButton = document.getElementById("captureButton");
  const resetPhotoButton = document.getElementById("resetPhotoButton");
  const photoUrlInput = document.getElementById("photoUrl");
  const photoUrlError = document.getElementById("photoUrlError");

  console.log("Setting up camera...");

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    captureButton.addEventListener("click", () => {
      const context = canvas.getContext("2d");
      canvas.width = 250;
      canvas.height = 250;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Failed to capture photo as Blob.");
          return;
        }

        console.log("Photo captured as Blob:", blob.size);

        const file = new File([blob], "captured-photo.png", {
          type: "image/png",
        });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        photoUrlInput.files = dataTransfer.files;

        console.log("Photo captured and set as input!");
        alert("Photo captured and set as input!");

        stopCamera();
      }, "image/png");
    });

    resetPhotoButton.addEventListener("click", async () => {
      const dataTransfer = new DataTransfer();
      photoUrlInput.files = dataTransfer.files;

      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      photoUrlError.textContent = "";
      photoUrlError.style.display = "none";

      await restartCamera();
    });

    const storyForm = document.getElementById("storyForm");
    storyForm.addEventListener("submit", () => {
      stopCamera();
    });

    storyForm.addEventListener("reset", () => {
      stopCamera();
    });
  } catch (error) {
    console.error("Error accessing the camera:", error);
    isCameraActive = false;
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    console.log("Camera stopped.");
    isCameraActive = false;
  }
}

async function restartCamera() {
  stopCamera();
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById("video");
    video.srcObject = stream;
    console.log("Camera re-enabled after reset.");
    alert("Photo reset and camera re-enabled.");
    isCameraActive = true;
  } catch (error) {
    console.error("Error restarting the camera:", error);
  }
}

const basePath = window.location.hostname === 'localhost' ? '/sw.js' : '/storiesapp/sw.js';

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register(basePath)
  .then(async (registration) => {
    console.log('Service Worker registered successfully.');

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('Notifikasi ditolak');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Token tidak ditemukan. Push Notification tidak akan disubscribe.');
      return;
    }
    const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        console.log('Already subscribed:', subscription);
        return; 
      }

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          vapidPublicKey
        ),
      });

      await subscribePush({ subscription: newSubscription, token });
      console.log('Subscribed successfully.');
  })

  .catch(err => console.error('Service Worker registration failed:', err));

}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


export async function showLoading() {
  document.startViewTransition(() => {
    document.querySelector("#loading-indicator").classList.remove("hidden");
  });
}

export async function hideLoading() {
  document.startViewTransition(() => {
    document.querySelector("#loading-indicator").classList.add("hidden");
  });
}

function updateSubscribeButton(subscription) {
  const subscribeButton = document.getElementById("subscribe-button");
  let icon = subscribeButton.querySelector("i");

  if (!icon) {
    icon = document.createElement("i");
    subscribeButton.prepend(icon); 
  }

  if (subscription) {
    subscribeButton.textContent = " Unsubscribe";
    icon.className = "fa-solid fa-bell-slash"; 
  } else {
    subscribeButton.textContent = " Subscribe";
    icon.className = "fa-solid fa-bell"; 
  }
}


