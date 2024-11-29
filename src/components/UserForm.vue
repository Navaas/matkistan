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
  // Rensa gamla fel från föregående inlämning
  validationErrors.value = {};

  const userData = {
    firstname: firstName.value,
    username: userName.value,
    email: email.value,
    password: password.value,
  };

  try {
    // Försök att validera användardata
    userZodSchema.parse(userData);
    message.value = ""; // Återställ meddelandet om valideringen lyckas
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

  // Skicka användardata till backend om valideringen är ok
  try {
    const response = await fetch("http://localhost:3000/register", {
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
    <p>Registrera användare</p>

    <input
      type="text"
      placeholder="Förnamn"
      v-model="firstName"
      class="w-full px-2 py-2 border border-gray-300 rounded-md"
      required
    />
    <p v-if="validationErrors.firstname" class="text-red-500 text-sm">
      {{ validationErrors.firstname }}
    </p>

    <input
      type="text"
      placeholder="Användarnamn"
      v-model="userName"
      class="w-full px-2 py-2 border border-gray-300 rounded-md"
      required
    />
    <p v-if="validationErrors.username" class="text-red-500 text-sm">
      {{ validationErrors.username }}
    </p>

    <input
      type="email"
      placeholder="E-post"
      v-model="email"
      class="w-full px-2 py-2 border border-gray-300 rounded-md"
      required
    />
    <p v-if="validationErrors.email" class="text-red-500 text-sm">
      {{ validationErrors.email }}
    </p>

    <input
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
      class="max-w-52 bg-black text-white py-2 px-4 rounded-md hover:bg-slate-500"
    >
      Skicka
    </button>
  </form>
</template>

<style scoped></style>
