<script setup>
import { onMounted, ref } from "vue";
import { getLoggedInUser } from "../utils/checkLoginHandler";
import Header from "./Header.vue";

// Reaktiva variabler för användardata
const updatedFirstname = ref("");
const updatedUsername = ref("");
const updatedEmail = ref("");
const updatedPassword = ref("");
const message = ref("");
const messageType = ref(""); // success eller error

// Reaktiv variabel för att hålla användardata från fetchUserData
const user = ref(null);

// Funktion för att hämta användardata
const fetchUserData = async () => {
  try {
    const isLoggedIn = await getLoggedInUser();
    if (isLoggedIn) {
      const response = await fetch(`${import.meta.env.VITE_FETCH_URL}/auth`, {
        method: "GET",
        credentials: "include", // För att skicka med sessionen
      });

      if (response.ok) {
        const data = await response.json();
        user.value = data.user;
        console.log("Inloggad användare:", data.user);

        // Fyll formuläret med användarens aktuella uppgifter
        updatedFirstname.value = data.user.firstname;
        updatedUsername.value = data.user.username;
        updatedEmail.value = data.user.email;
      }
    } else {
      console.log("Användaren är inte inloggad.");
      user.value = null;
    }
  } catch (error) {
    console.error("Fel vid hämtning av användardata:", error);
    message.value = "Kunde inte hämta användardata";
    messageType.value = "error";
  }
};
const updateUserInfo = async () => {
  // Kontrollera om användaren är inloggad och har ett giltigt ID
  if (!user.value || !user.value.id) {
    message.value = "Användarens ID saknas eller användaren är inte inloggad";
    messageType.value = "error";
    return;
  }

  // Förbered payload
  const payload = {
    username: updatedUsername.value,
    email: updatedEmail.value,
    firstname: updatedFirstname.value,
  };

  // Om användaren har angett ett nytt lösenord, lägg till det i payload
  if (updatedPassword.value) {
    // Kontrollera att lösenordet är minst 8 tecken långt om det är ifyllt
    if (updatedPassword.value.length < 8) {
      message.value = "Lösenordet måste vara minst 8 tecken långt.";
      messageType.value = "error";
      return;
    }
    payload.password = updatedPassword.value; // Lägg till lösenordet i payload
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_FETCH_URL}/updateUser/${user.value.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // För att skicka med sessionen om nödvändigt
      }
    );

    const data = await response.json();

    if (response.ok) {
      message.value = data.message;
      messageType.value = "success";
    } else {
      throw new Error(data.error || "Kunde inte uppdatera användardata");
    }
  } catch (err) {
    message.value = err.message;
    messageType.value = "error";
  }
};

// Hämta användardata när komponenten monteras
onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <Header />
  <div class="md:pt-14 bg-gray-100 p-4">
    <h1 class="text-3xl mb-6">Uppdatera dina uppgifter</h1>

    <form @submit.prevent="updateUserInfo" class="space-y-4">
      <div>
        <label for="firstname" class="block font-semibold">Förnamn:</label>
        <input
          v-model="updatedFirstname"
          type="text"
          id="firstname"
          class="border p-2 w-full"
        />
      </div>
      <div>
        <label for="username" class="block font-semibold">Användarnamn:</label>
        <input
          v-model="updatedUsername"
          type="text"
          id="username"
          class="border p-2 w-full"
        />
      </div>
      <div>
        <label for="email" class="block font-semibold">Email:</label>
        <input
          v-model="updatedEmail"
          type="email"
          id="email"
          class="border p-2 w-full"
        />
      </div>
      <div>
        <label for="password" class="block font-semibold">Lösenord:</label>
        <input
          v-model="updatedPassword"
          type="password"
          id="password"
          class="border p-2 w-full"
        />
        <small class="text-gray-700"
          >Om du inte vill ändra lösenordet, lämna detta fält tomt.</small
        >
      </div>

      <button type="submit" class="bg-blue-700 text-white px-4 py-2 rounded">
        Uppdatera
      </button>
    </form>

    <div
      v-if="message"
      :class="messageType === 'success' ? 'text-green-500' : 'text-red-500'"
    >
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
/* Eventuellt CSS för att styla formuläret */
</style>
