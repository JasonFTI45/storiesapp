import { register, login } from "./api.js";

export default class AuthModel {
  async registerUser(userData) {
    return await register(userData);
  }

  async loginUser(userData) {
    return await login(userData);
  }
}
