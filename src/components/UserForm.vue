<script setup>
import { ref } from "vue";

const firstName = ref("");
const userName = ref("");
const password = ref("");

const registerNewUser = () => {
  console.log(firstName.value, userName.value, password.value);

  (firstName.value = ""), (userName.value = ""), (password.value = "");
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

    <input
      type="text"
      placeholder="Användarnamn"
      v-model="userName"
      class="w-full px-2 py-2 border border-gray-300 rounded-md"
      required
    />

    <input
      type="password"
      placeholder="Lösenord"
      v-model="password"
      class="w-full px-2 py-2 border border-gray-300 rounded-md"
      required
    />

    <button
      type="submit"
      class="max-w-52 bg-black text-white py-2 px-4 rounded-md hover:bg-slate-500"
    >
      Skicka
    </button>
  </form>
</template>

<style scoped></style>
