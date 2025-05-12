import { showLoading, hideLoading } from "../../index.js";

export default class LoginView {
  async render() {
    return `
        <section class="container">
        <form id="login-form" class="auth-form">
        <h1>Login Page</h1>
          <div>
            <label for="email">Email:</label>
            <input type="email" id="email" placeholder="Your Email" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" id="password" placeholder="Your Password" required />
          </div>
          <button type="submit" class="auth-button">Login</button>
        </form>
        <div id="loading-indicator" class="hidden">
            <div id="login-message" class="auth-message"></div>
            <div class="spinner"></div>
        </div>
        </section>
      `;
  }

  async afterRender() {}

  bindLogin(handler) {
    document
      .getElementById("login-form")
      .addEventListener("submit", (event) => {
        const loginMessage = document.getElementById("login-message");

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        loginMessage.textContent = "Logging in...";
        showLoading();

        handler({ email, password });
      });
  }
}
