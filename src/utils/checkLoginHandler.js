// import { ref } from "vue";

// export const getLoggedInUser = async () => {
//   let isLoggedIn = false;

//   try {
//     const response = await fetch(`${import.meta.env.VITE_FETCH_URL}/auth`, {
//       method: "GET",
//       credentials: "include",
//     });

//     if (response.ok) {
//       const data = await response.json();
//       isLoggedIn = !!data.user;
//     } else {
//       isLoggedIn = false;
//     }
//   } catch (error) {
//     console.error("Fel vid hämtning av användardata:", error);
//     isLoggedIn = false;
//   }
//   return isLoggedIn;
// };

// export const checkLoginStatus = () => {
//   const cachedIsLoggedIn = localStorage.getItem("isLoggedIn");
//   return cachedIsLoggedIn === "true";
// };

// export const logoutUser = () => {
//   localStorage.removeItem("isLoggedIn");
//   localStorage.removeItem("user");
// };

// const user = ref(null);

// export const fetchUserData = async () => {
//   try {
//     const isLoggedIn = await getLoggedInUser();
//     if (isLoggedIn) {
//       const response = await fetch(`${import.meta.env.VITE_FETCH_URL}/auth`, {
//         method: "GET",
//         credentials: "include",
//       });

//       if (response.ok) {
//         const data = await response.json();
//         user.value = data.user;
//         console.log("Inloggad användare:", data.user);
//         return data.user;
//       } else {
//         console.log(
//           "Fel vid hämtning av användardata, svar från servern var inte OK."
//         );
//         return null;
//       }
//     } else {
//       console.log("Användaren är inte inloggad.");
//       user.value = null;
//       return null;
//     }
//   } catch (error) {
//     console.error("Fel vid hämtning av användardata:", error);
//     return null;
//   }
// };

// export { user };
import { ref } from "vue";

const isLoggedIn = ref(false); // Spåra inloggningsstatus
const user = ref(null); // Spåra användardata
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

  // Lägg till logg för att kontrollera om tokenen finns i localStorage
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
