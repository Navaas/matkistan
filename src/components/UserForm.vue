<script setup></script>

<template>
  <form
    class="flex flex-col bg-white px-2 py-4 border border-gray-200 rounded-md shadow-lg gap-2 max-w-[550px] w-full"
  >
    <p>Registrera användare</p>

    <input
      type="text"
      placeholder="Förnamn"
      class="w-full px-2 py-2 border border-gray-300 rounded-md"
      required
    />

    <input
      type="text"
      placeholder="Användarnamn"
      class="w-full px-2 py-2 border border-gray-300 rounded-md"
      required
    />

    <input
      type="password"
      placeholder="Lösenord"
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
