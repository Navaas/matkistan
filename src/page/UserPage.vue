<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const message = ref("");
const messageType = ref("");

const router = useRouter();

const logout = async () => {
  try {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log("Utloggning lyckades");
      // Om utloggningen lyckades, visa meddelande och omdirigera användaren
      message.value = "Du är nu utloggad!";
      messageType.value = "success";
      router.push("/"); // Navigera till startsidan eller annan sida
    } else {
      const errorData = await response.json();
      message.value = errorData.error || "Problem med utloggning";
      messageType.value = "error";
    }
  } catch (error) {
    console.error("Ett fel inträffade:", error);
    message.value = "Ett tekniskt fel inträffade vid utloggning";
    messageType.value = "error";
  }
};
</script>

<template>
  <div>
    <h1>UserPage</h1>
    <button
      @click="logout"
      class="bg-black px-4 py-2 rounded-xl text-white cursor-pointer hover:bg-slate-500"
    >
      Logga ut
    </button>

    <span
      v-if="message"
      :class="messageType === 'Success' ? 'text-green-500' : 'text-red-500'"
    >
      {{ message }}
    </span>
  </div>
</template>

<style></style>
