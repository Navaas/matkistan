<script setup>
import { onMounted, ref } from "vue";
import Header from "./Header.vue";

import {
  checkUserAuth,
  isLoggedIn,
  message,
  messageType,
  user,
} from "../utils/checkLoginHandler";

const updatedFirstname = ref("");
const updatedUsername = ref("");
const updatedEmail = ref("");
const updatedPassword = ref("");
const formVisible = ref(true);

onMounted(() => {
  message.value = null;
  messageType.value = null;
});

const updateUserInfo = async () => {
  if (!user.value || !user.value.id) {
    message.value = "Användarens ID saknas eller användaren är inte inloggad";
    messageType.value = "error";
    return;
  }

  const payload = {
    username: updatedUsername.value,
    email: updatedEmail.value,
    firstname: updatedFirstname.value,
  };

  if (updatedPassword.value) {
    if (updatedPassword.value.length < 8) {
      message.value = "Lösenordet måste vara minst 8 tecken långt.";
      messageType.value = "error";
      return;
    }
    payload.password = updatedPassword.value;
  }

  const token = localStorage.getItem("authToken");

  if (!token) {
    message.value = "Du måste vara inloggad för att uppdatera dina uppgifter.";
    messageType.value = "error";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/updateUser/${user.value.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Lägg till JWT i headern
        },
        body: JSON.stringify(payload),
        credentials: "include",
      }
    );

    const data = await response.json();

    if (response.ok) {
      message.value = data.message || "Dina uppgifter har uppdaterats.";
      messageType.value = "success";
    } else {
      throw new Error(data.error || "Kunde inte uppdatera användardata");
    }
  } catch (err) {
    message.value = err.message;
    messageType.value = "error";
  }
};

onMounted(async () => {
  await checkUserAuth(); // Kontrollera om användaren är inloggad
  if (isLoggedIn.value) {
    // Om användaren är inloggad, hämta användardata
    updatedFirstname.value = user.value.firstname;
    updatedUsername.value = user.value.username;
    updatedEmail.value = user.value.email;
  } else {
    message.value = "Du är inte inloggad.";
    messageType.value = "error";
  }
});
</script>

<template>
  <Header />
  <div class="bg-gray-100 p-4">
    <form v-if="formVisible" @submit.prevent="updateUserInfo" class="space-y-4">
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

      <button
        type="submit"
        class="bg-[#fa7e61] text-black px-4 py-2 rounded text-sm cursor-pointer hover:bg-[#a4b8c4] hover:text-black"
      >
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
