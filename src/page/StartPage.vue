<script setup>
import { onMounted, ref } from "vue";
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import Search from "../components/Search.vue";
import UserForm from "../components/UserForm.vue";
import Welcome from "../components/Welcome.vue";
import { checkUserAuth, isLoggedIn } from "../utils/checkLoginHandler";

const isOpen = ref(false);

const toggleDiv = () => {
  isOpen.value = !isOpen.value;
  console.log(isOpen.value);
};

const loggedInBackgroundStyle = {
  backgroundImage:
    "url('https://images.unsplash.com/31/RpgvvtYAQeqAIs1knERU_vegetables.jpg?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
};

const loggedOutBackgroundStyle = {
  backgroundImage:
    "url('https://images.unsplash.com/photo-1555243896-c709bfa0b564?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
};

onMounted(checkUserAuth);
</script>

<!-- <template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="flex-1 bg-[#fafafa] md:pt-14">
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
          <div v-if="!isLoggedIn" class="flex gap-4 justify-center py-6">
            <button
              class="bg-[#fa7e61] px-4 py-2 rounded-full md:py-3 md:px-8 text-white cursor-pointer hover:bg-[#a4b8c4] uppercase text-sm hover:text-black"
              @click="toggleDiv"
            >
              Skapa konto
            </button>

            <router-link to="/login">
              <button
                class="bg-[#fa7e61] px-4 py-2 rounded-full md:py-3 md:px-8 text-white cursor-pointer hover:bg-[#a4b8c4] hover:text-black uppercase text-sm"
              >
                Logga in
              </button>
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="isOpen" class="flex px-2 justify-center md:py-2">
        <div class="flex justify-center items-center max-w-[700px] w-full py-2">
          <UserForm />
        </div>
      </div>

      <Welcome />
    </main>

    <Footer />
  </div>
</template> -->
<template>
  <div class="flex flex-col min-h-screen">
    <Header />

    <main class="flex-1 bg-[#fafafa] md:pt-14">
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
          <div v-if="!isLoggedIn" class="flex gap-4 justify-center py-6">
            <button
              class="bg-[#fa7e61] px-4 py-2 rounded-full md:py-3 md:px-8 text-white cursor-pointer hover:bg-[#a4b8c4] uppercase text-sm hover:text-black"
              @click="toggleDiv"
            >
              Skapa konto
            </button>

            <router-link to="/login">
              <button
                class="bg-[#fa7e61] px-4 py-2 rounded-full md:py-3 md:px-8 text-white cursor-pointer hover:bg-[#a4b8c4] hover:text-black uppercase text-sm"
              >
                Logga in
              </button>
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="isOpen" class="flex px-2 justify-center md:py-2">
        <div class="flex justify-center items-center max-w-[700px] w-full py-2">
          <UserForm />
        </div>
      </div>

      <Welcome />
    </main>

    <!-- Lägg till fotern här, den kommer att ligga längst ner -->

    <Footer />
  </div>
</template>
<style scoped></style>
