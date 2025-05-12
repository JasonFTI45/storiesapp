import AuthModel from "../data/auth-model.js";
import RegisterView from "../pages/auth/register-view.js";
import { showLoading, hideLoading } from "../index.js";

export default class RegisterPresenter {
  constructor() {
    this.model = new AuthModel();
    this.view = new RegisterView();
  }

  async init() {
    this.view.bindRegister(this.handleRegister.bind(this));
  }

  async handleRegister(data) {
    const registerMessage = document.getElementById("register-message");

    registerMessage.textContent = "Registering...";
    showLoading();

    try {
      await this.model.registerUser(data);
      registerMessage.textContent =
        "Registration successful! Redirecting to login...";
      setTimeout(() => {
        hideLoading();
        window.location.hash = "/login";
      }, 2000);
    } catch (error) {
      registerMessage.textContent = `Error: ${error.message}`;
      setTimeout(() => {
        hideLoading();
      }, 1000);
    }
  }
}
