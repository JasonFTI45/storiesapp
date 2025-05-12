import CONFIG from "../config";

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  GUEST: `${CONFIG.BASE_URL}/stories/guest`,
};

export async function register({ username, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: username,
      email: email,
      password: password,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to register");
  }
  return data;
}

export async function login({ email, password }) {
  try {
    const response = await fetch(`${CONFIG.BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to login");
    }

    localStorage.setItem("token", data.loginResult.token);

    window.location.href = "/storiesapp/";

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getStories({ page = 1, size = 10, location = 0 } = {}) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `${ENDPOINTS.STORIES}?page=${page}&size=${size}&location=${location}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch stories");
    }

    return responseData.listStory;
  } catch (error) {
    console.error("Error fetching stories:", error.message);
    throw error;
  }
}

export async function addStory({ description, photo, lat, lon }) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);

  if (lat !== undefined && lon !== undefined) {
    formData.append("lat", lat);
    formData.append("lon", lon);
  }

  const response = await fetch(ENDPOINTS.STORIES, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || "Failed to add story");
  }

  return await response.json();
}

export async function addGuestStory({ description, photo, lat, lon }) {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);

  if (lat !== undefined && lon !== undefined) {
    formData.append("lat", lat);
    formData.append("lon", lon);
  }

  const response = await fetch(ENDPOINTS.GUEST, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || "Failed to add story");
  }

  return await response.json();
}

export async function subscribePush({ subscription,  token }) {
  try {

    if (!subscription) {
      throw new Error("No subscription object provided.");
    }

    const { endpoint, keys } = subscription.toJSON();
    console.log("Subscription keys:", keys);
    const { p256dh, auth } = keys;

    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint: endpoint,
        keys: {
          p256dh,
          auth,
        },
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to subscribe to notifications");
    }

    return result;
  } catch (error) {
    console.error("Error during subscription:", error.message);
    throw error;
  }
}

export async function unsubscribePush({ subscription, token }) {
  try {
    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to unsubscribe from notifications");
    }

    return result;
  } catch (error) {
    console.error("Error during unsubscription:", error.message);
    throw error;
  }
}

export async function getData() {
  const fetchResponse = await fetch(ENDPOINTS.ENDPOINT);
  return await fetchResponse.json();
}
