<script setup>
import { ref } from "vue";
import { z } from "zod";

const userZodSchema = z.object({
  firstname: z.string().min(2, "Förnamnet måste innehålla minst 2 tecken"),
  username: z.string().min(3, "Användarnamn måste innehålla minst 3 tecken"),
  email: z.string().email("E-postadressen är ogiltig"),
  password: z.string().min(8, "Lösenordet måste vara minst 8 tecken"),
});

const firstName = ref("");
const userName = ref("");
const password = ref("");
const email = ref("");
const message = ref("");
const messageType = ref("");
const validationErrors = ref({});

const registerNewUser = async () => {
  validationErrors.value = {};

  const userData = {
    firstname: firstName.value,
    username: userName.value,
    email: email.value,
    password: password.value,
  };

  try {
    userZodSchema.parse(userData);
    message.value = "";
  } catch (err) {
    if (err instanceof z.ZodError) {
      err.errors.forEach((error) => {
        const field = error.path[0];
        validationErrors.value[field] = error.message;
      });
      message.value = "Registreringen misslyckades!";
      messageType.value = "error";
      return;
    }
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_FETCH_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const userData = await response.json();
      console.log("User registered successfully:", userData);
      message.value = "Användare registrerad!";
      messageType.value = "success";
    } else {
      const errorText = await response.text();
      console.error("Registration failed:", errorText);
      message.value = "Något gick fel!";
      messageType.value = "error";
    }
  } catch (error) {
    console.error("Error occurred during registration:", error);
    message.value = "Något gick fel!";
    messageType.value = "error";
  }

  firstName.value = "";
  userName.value = "";
  password.value = "";
  email.value = "";
};
</script>

<template>
  <form
    class="flex flex-col bg-white px-2 py-4 border border-gray-200 rounded-md shadow-lg gap-2 max-w-[550px] w-full"
    @submit.prevent="registerNewUser"
  >
    <h2 class="text-sm md:text-base">Registrera användare</h2>
    <label for="firstname" class="sr-only">Förnamn:</label>
    <input
      id="firstname"
      type="text"
      placeholder="Förnamn"
      v-model="firstName"
      class="w-full px-2 py-2 border border-gray-300 rounded-md"
      required
    />
    <p
      v-if="validationErrors.firstname"
      class="text-red-500 text-sm"
      aria-live="assertive"
    >
      {{ validationErrors.firstname }}
    </p>
    <label for="username" class="sr-only">Användarnamn:</label>
    <input
      id="username"
      type="text"
      placeholder="Användarnamn"
      v-model="userName"
      class="w-full px-2 py-2 border border-gray-300 rounded-md"
      required
    />
    <p v-if="validationErrors.username" class="text-red-500 text-sm">
      {{ validationErrors.username }}
    </p>
    <label for="email" class="sr-only">Email:</label>
    <input
      id="email"
      type="email"
      placeholder="E-post"
      v-model="email"
      class="w-full px-2 py-2 border border-gray-300 rounded-md"
      required
    />
    <p v-if="validationErrors.email" class="text-red-500 text-sm">
      {{ validationErrors.email }}
    </p>
    <label for="password" class="sr-only">Lösenord:</label>
    <input
      id="password"
      type="password"
      aria-describedby="password-help"
      placeholder="Lösenord"
      v-model="password"
      class="w-full px-2 py-2 border border-gray-300 rounded-md"
      required
    />
    <p id="password-help" class="text-sm text-gray-500">
      Ange ett säkert lösenord med minst 8 tecken.
    </p>

    <p
      v-if="message"
      :class="messageType === 'success' ? 'text-green-500' : 'text-red-500'"
      aria-live="assertive"
    >
      {{ message }}
    </p>

    <button
      type="submit"
      aria-label="Skicka formulär"
      class="max-w-52 bg-[#fa7e61] text-black py-2 px-4 rounded-md hover:bg-[#a4b8c4] hover:text-black"
    >
      Skicka
    </button>
  </form>
</template>

<style scoped>
input:focus,
button:focus {
  outline: 2px solid #000;
}
</style>
