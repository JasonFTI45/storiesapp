import { register } from "../../data/api.js";
import { showLoading, hideLoading } from "../../index.js";

export default class RegisterPage {
  async render() {
    return `
      <section class="container">
        <form id="register-form" class="auth-form">
        <h1>Register Page</h1>
          <div>
            <label for="username">Username:</label>
            <input type="text" id="username" placeholder="Your Name" required />
          </div>
          <div>
            <label for="email">Email:</label>
            <input type="email" id="email" placeholder="Your Email" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" id="password" placeholder="Your Password" required />
          </div>
          <button type="submit" class="auth-button">Register</button>
        </form>
        <div id="loading-indicator" class="hidden">
          <div id="register-message" class="auth-message"></div>
          <div class="spinner"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {}

  bindRegister(handler) {
    document
      .getElementById("register-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        handler({ username, email, password });
      });
  }
}
