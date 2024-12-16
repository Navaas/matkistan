<script setup>
import { onMounted, ref } from "vue";
import Header from "../components/Header.vue";
import Search from "../components/Search.vue";
import UserForm from "../components/UserForm.vue";
import Welcome from "../components/Welcome.vue";
import { checkLoginStatus } from "../utils/checkLoginHandler";

const isOpen = ref(false);

const isLoggedIn = ref(false);

const checkLogin = () => {
  isLoggedIn.value = checkLoginStatus();
};

const loggedInBackgroundStyle = {
  backgroundImage:
    "url('https://images.unsplash.com/31/RpgvvtYAQeqAIs1knERU_vegetables.jpg?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
};

const loggedOutBackgroundStyle = {
  backgroundImage:
    "url('https://images.unsplash.com/photo-1555243896-c709bfa0b564?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
};

onMounted(checkLogin);
</script>

<template>
  <Header />
  <main class="bg-[#fafafa] pt-12">
    <div
      :class="
        isLoggedIn
          ? 'relative bg-cover bg-center py-12'
          : 'relative bg-cover py-24'
      "
      :style="isLoggedIn ? loggedInBackgroundStyle : loggedOutBackgroundStyle"
    >
      <div class="absolute inset-0 bg-black/50 z-0"></div>
      <div class="relative z-10">
        <Search />
      </div>
    </div>

    <div v-if="isOpen" class="flex px-2 justify-center md:py-2">
      <div class="flex justify-center items-center max-w-[700px] w-full py-2">
        <UserForm />
      </div>
    </div>

    <Welcome />
  </main>
</template>

<style scoped></style>
