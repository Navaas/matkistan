<script setup></script>

<template>
  <!-- Header för desktop -->
  <div class="hidden md:block">
    <div
      class="flex justify-between px-2 py-2 bg-black text-white cursor-pointer fixed top-0 left-0 w-full"
    >
      <div>
        <span>Icon</span>
      </div>
      <router-link to="/login">
        <span class="material-symbols-outlined"> login </span>
      </router-link>
    </div>
  </div>

  <!-- Header för mobile -->
  <div
    class="fixed bottom-0 left-0 w-full bg-black text-white py-4 px-2 md:hidden"
  >
    <router-link to="/login">
      <span class="material-symbols-outlined"> login </span>
    </router-link>
  </div>
</template>

<style scoped></style>
