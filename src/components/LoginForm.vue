<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";

const loginZodSchema = z.object({
  username: z.string().min(3, "Användarnamnet måste vara minst 3 tecken långt"),
  password: z.string().min(8, "Lösenordet måste vara minst 8 tecken långt"),
});

const router = useRouter();

const username = ref("");
const password = ref("");
const message = ref("");
const messageType = ref("");
const validationErrors = ref({});

// const loginUser = async () => {
//   validationErrors.value = {};

//   const loginData = { username: username.value, password: password.value };
//   try {
//     loginZodSchema.parse(loginData);
//   } catch (err) {
//     if (err instanceof z.ZodError) {
//       err.errors.forEach((error) => {
//         const field = error.path[0];
//         validationErrors.value[field] = error.message;
//       });
//       message.value = "Inloggningen misslyckades!";
//       messageType.value = "error";
//       return;
//     }
//   }

//   try {
//     const response = await fetch("https://matkistan.onrender.com/login", {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(loginData),
//     });

//     // Hantera svar från backend
//     if (response.ok) {
//       const responseData = await response.json();
//       localStorage.setItem("authToken", responseData.token); // Spara JWT-token
//       localStorage.setItem("user", JSON.stringify(responseData.user));
//       console.log("Inloggning lyckades:", responseData);
//       message.value = "Inloggning lyckades!";
//       messageType.value = "success";
//       localStorage.setItem("isLoggedIn", "true");

//       // Om du vill också spara användardata i localStorage (valfritt)
//       localStorage.setItem("user", JSON.stringify(responseData.user));
//       router.push("/profil", { state: { user: responseData.user } });

//       console.log("User:", responseData.user);
//     } else {
//       const errorText = await response.text();
//       console.error("Inloggning misslyckades:", errorText);
//       message.value = "Fel användarnamn eller lösenord";
//       messageType.value = "error";
//     }
//   } catch (error) {
//     console.error("Ett fel inträffade:", error);
//     message.value = "Ett tekniskt fel inträffade";
//     messageType.value = "error";
//   }
// };
const loginUser = async () => {
  validationErrors.value = {};

  const loginData = { username: username.value, password: password.value };
  try {
    loginZodSchema.parse(loginData);
  } catch (err) {
    if (err instanceof z.ZodError) {
      err.errors.forEach((error) => {
        const field = error.path[0];
        validationErrors.value[field] = error.message;
      });
      message.value = "Inloggningen misslyckades!";
      messageType.value = "error";
      return;
    }
  }

  try {
    const response = await fetch("https://matkistan.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Token från server:", responseData.token);

      localStorage.setItem("authToken", responseData.token);
      localStorage.setItem("user", JSON.stringify(responseData.user));
      sessionStorage.setItem("authToken", responseData.token);
      console.log(
        "Token sparad i sessionStorage:",
        sessionStorage.getItem("authToken")
      );
      console.log("Token sparad:", localStorage.getItem("authToken"));
      console.log("Inloggning lyckades:", responseData);
      message.value = "Inloggning lyckades!";
      messageType.value = "success";
      localStorage.setItem("isLoggedIn", "true");

      console.log("Navigating to /profil...");
      router.push("/profil", { state: { user: responseData.user } });

      console.log("User:", responseData.user);
    } else {
      const errorText = await response.text();
      console.error("Inloggning misslyckades:", errorText);
      message.value = "Fel användarnamn eller lösenord";
      messageType.value = "error";
    }
  } catch (error) {
    console.error("Ett fel inträffade:", error);
    message.value = "Ett tekniskt fel inträffade";
    messageType.value = "error";
  }
};
</script>

<template>
  <form
    class="flex flex-col bg-white px-2 py-4 border border-gray-200 rounded-md shadow-lg gap-2 max-w-[550px] w-full"
    @submit.prevent="loginUser"
  >
    <p class="text-sm md:text-base text-start">Logga in användare</p>
    <label for="username" class="sr-only">Användarnamn:</label>
    <input
      id="username"
      type="text"
      placeholder="Användarnamn"
      v-model="username"
      class="w-full px-2 py-2 border border-gray-300 rounded-md"
      required
    />
    <p v-if="validationErrors.username" class="text-red-500 text-sm">
      {{ validationErrors.username }}
    </p>

    <label for="password" class="sr-only">Lösenord:</label>
    <input
      id="password"
      type="password"
      placeholder="Lösenord"
      v-model="password"
      class="w-full px-2 py-2 border border-gray-300 rounded-md"
      required
    />
    <p v-if="validationErrors.password" class="text-red-500 text-sm">
      {{ validationErrors.password }}
    </p>

    <p
      v-if="message"
      :class="messageType === 'success' ? 'text-green-500' : 'text-red-500'"
    >
      {{ message }}
    </p>

    <button
      type="submit"
      class="max-w-52 bg-[#fa7e61] text-white py-2 px-4 rounded-md hover:bg-[#a4b8c4] hover:text-black uppercase text-sm"
    >
      Logga in
    </button>
  </form>
</template>
