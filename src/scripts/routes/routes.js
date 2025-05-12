import HomePage from "../pages/home/home-view.js";
import HomeGuestPage from "../pages/home/home-guest-view.js";
import SavedPage from "../pages/saved/saved-page";
import RegisterPage from "../pages/auth/register-view.js";
import LoginPage from "../pages/auth/login-view";
import LogoutPage from "../pages/auth/logout-page";

const isLoggedIn = !!localStorage.getItem("token");

const routes = {
  "/": isLoggedIn ? new HomePage() : new HomeGuestPage(),
  "/guest": new HomeGuestPage(),
  "/saved": new SavedPage(),
  "/register": new RegisterPage(),
  "/login": new LoginPage(),
  "/logout": new LogoutPage(),
};

export default routes;
