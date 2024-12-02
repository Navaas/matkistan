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

const loginUser = async () => {
  validationErrors.value = {};

  const loginData = { username: username.value, password: password.value };
  try {
    loginZodSchema.parse(loginData); // Validering
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Mappa fel från Zod till `validationErrors`
      err.errors.forEach((error) => {
        const field = error.path[0];
        validationErrors.value[field] = error.message;
      });
      message.value = "Inloggningen misslyckades!";
      messageType.value = "error";
      return; // Avbryt om valideringen misslyckades
    }
  }

  try {
    // Skicka inloggningsdata till backend
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    // Hantera svar från backend
    if (response.ok) {
      const responseData = await response.json();
      console.log("Inloggning lyckades:", responseData);
      message.value = "Inloggning lyckades!";
      messageType.value = "success";
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
    <p>Logga in användare</p>
    <input
      type="text"
      placeholder="Användarnamn"
      v-model="username"
      class="w-full px-2 py-2 border border-gray-300 rounded-md"
      required
    />
    <p v-if="validationErrors.username" class="text-red-500 text-sm">
      {{ validationErrors.username }}
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
      Logga in
    </button>
  </form>
</template>
