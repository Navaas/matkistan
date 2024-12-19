import { ref } from "vue";

const isLoggedIn = ref(false);
const user = ref(null);
const message = ref("");
const messageType = ref("");

// Funktion för att kontrollera användarens inloggning
const checkUserAuth = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    isLoggedIn.value = false;
    user.value = null;
    return;
  }

  try {
    const response = await fetch("https://matkistan.onrender.com/auth", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      isLoggedIn.value = true;
      user.value = data.user;
    } else {
      isLoggedIn.value = false;
      user.value = null;
      localStorage.removeItem("authToken");
      message.value = "Sessionen har gått ut. Logga in igen.";
      messageType.value = "error";
    }
  } catch (error) {
    console.error("Fel vid autentisering:", error);
    isLoggedIn.value = false;
    user.value = null;
    message.value = "Ett tekniskt fel inträffade. Försök igen senare.";
    messageType.value = "error";
  }
};

export const fetchUserData = async () => {
  const token = localStorage.getItem("authToken");
  console.log("Token vid hämtning:", token);

  if (!token) {
    console.log("Ingen token hittades.");
    return;
  }

  try {
    const response = await fetch("https://matkistan.onrender.com/auth", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      console.log("Användardata hämtad:", userData);
    } else {
      console.log("Fel vid hämtning av användardata.");
    }
  } catch (error) {
    console.error("Fel vid autentisering:", error);
  }
};

// Exportera funktionerna och reaktiva variabler
export { checkUserAuth, isLoggedIn, message, messageType, user };
