import { showLoading, hideLoading } from "../../index.js";

export default class LogoutPage {
  async render() {
    return `
        <div id="loading-indicator" class="hidden">
            <h1>Logout in process, please wait....</h1>
            <div class="spinner"></div>
        </div>
      `;
  }

  async afterRender() {
    const registerButton = document.getElementById("register");
    showLoading();
    setTimeout(() => {
      localStorage.removeItem("token");
      hideLoading();
      registerButton.classList.remove("hidden");
      window.location.hash = "/login";
    }, 2000);
  }
}
