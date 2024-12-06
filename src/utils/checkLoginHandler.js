import { ref } from "vue";

export const getLoggedInUser = async () => {
  let isLoggedIn = false;

  try {
    const response = await fetch("http://localhost:3000/auth", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      isLoggedIn = !!data.user;
    } else {
      isLoggedIn = false;
    }
  } catch (error) {
    console.error("Fel vid hämtning av användardata:", error);
    isLoggedIn = false;
  }
  return isLoggedIn;
};

export const checkLoginStatus = () => {
  const cachedIsLoggedIn = localStorage.getItem("isLoggedIn");
  return cachedIsLoggedIn === "true";
};

export const logoutUser = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
};

const user = ref(null);

export const fetchUserData = async () => {
  try {
    const isLoggedIn = await getLoggedInUser();
    if (isLoggedIn) {
      const response = await fetch("http://localhost:3000/auth", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        user.value = data.user;
        console.log("Inloggad användare:", data.user);
      }
    } else {
      console.log("Användaren är inte inloggad.");
      user.value = null;
    }
  } catch (error) {
    console.error("Fel vid hämtning av användardata:", error);
  }
};

export { user };
