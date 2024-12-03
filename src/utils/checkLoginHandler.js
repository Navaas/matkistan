export const getLoggedInUser = async () => {
  let isLoggedIn = false;
  let user = null;

  try {
    const response = await fetch("http://localhost:3000/auth", {
      method: "GET",
      credentials: "include", // Viktigt för att skicka cookies
    });

    if (response.ok) {
      const data = await response.json();
      isLoggedIn = !!data.user;
      user = data.user || null; // Om användaren finns, sätt isLoggedIn till true
    } else {
      isLoggedIn = false; // Om svaret är negativt, användaren är inte inloggad
    }
  } catch (error) {
    console.error("Fel vid hämtning av användardata:", error);
    isLoggedIn = false; // Vid fel, anta att användaren inte är inloggad
    user = null;
  }
  return isLoggedIn, user;
};
