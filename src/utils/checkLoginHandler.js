export const getLoggedInUser = async () => {
  let isLoggedIn = false;
  let user = null;

  try {
    const response = await fetch("http://localhost:3000/auth", {
      method: "GET",
      credentials: "include", // Skicka cookies med begäran
    });

    if (response.ok) {
      const data = await response.json();
      isLoggedIn = !!data.user;
      user = data.user || null;
    } else {
      isLoggedIn = false;
    }
  } catch (error) {
    console.error("Fel vid hämtning av användardata:", error);
    isLoggedIn = false;
    user = null;
  }

  return { isLoggedIn, user }; // Returnera både isLoggedIn och user korrekt
};

// export const getLoggedInUser = async () => {
//   let isLoggedIn = false;
//   let user = null;

//   try {
//     const response = await fetch("http://localhost:3000/auth", {
//       method: "GET",
//       credentials: "include",
//     });

//     if (response.ok) {
//       const data = await response.json();
//       isLoggedIn = !!data.user;
//       user = data.user || null;
//     } else {
//       isLoggedIn = false;
//     }
//   } catch (error) {
//     console.error("Fel vid hämtning av användardata:", error);
//     isLoggedIn = false;
//     user = null;
//   }
//   return isLoggedIn, user;
// };
