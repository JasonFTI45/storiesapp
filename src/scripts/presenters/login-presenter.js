import AuthModel from "../data/auth-model.js";
import LoginView from "../pages/auth/login-view.js";
import { showLoading, hideLoading } from "../index.js";

export default class LoginPresenter {
  constructor() {
    this.model = new AuthModel();
    this.view = new LoginView();
  }

  async init() {
    this.view.bindLogin(this.handleLogin.bind(this));
  }

  async handleLogin(data) {
    const loginMessage = document.getElementById("login-message");

    loginMessage.textContent = "Logging in...";
    showLoading();

    try {
      await this.model.loginUser(data);
      if (this.model.result.success) {
        loginMessage.textContent = "Login successful! Redirecting to home...";
        setTimeout(() => {
          hideLoading();
          window.location.hash = "/storiesapp/";
        }, 2000);
      } else {
        loginMessage.textContent = `Error: ${this.model.result.message}`;
        setTimeout(() => {
          hideLoading();
        }, 1000);
      }
    } catch (error) {
      loginMessage.textContent = `Error: ${error.message}`;
      setTimeout(() => {
        hideLoading();
      }, 1000);
    }
  }
}
