<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Header from "../components/Header.vue";
import Search from "../components/Search.vue";
import UserForm from "../components/UserForm.vue";
import Welcome from "../components/Welcome.vue";
import { checkLoginStatus } from "../utils/checkLoginHandler";

const isOpen = ref(false);

const isLoggedIn = ref(false);
const router = useRouter();

const checkLogin = () => {
  isLoggedIn.value = checkLoginStatus();
};

const toggleDiv = () => {
  isOpen.value = !isOpen.value;
  console.log(isOpen.value);
};
onMounted(checkLogin);
</script>

<template>
  <Header />
  <main class="bg-[#fafafa]">
    <div class="flex flex-col-reverse md:flex-row px-4 pb-4 pt-14 bg-[#fafafa]">
      <div
        class="flex flex-col bg-[#d8ddef] px-2 pt-2 pb-4 rounded-md justify-center items-center text-center w-full md:max-h-80 gap-4 md:gap-6"
      >
        <h1 class="font-inter text-2xl text-black md:text-3xl">
          Din digitala receptbok
        </h1>
        <p class="text-black">
          Upptäck matglädje och inspiration med Matkistan! Här kan du skapa ett
          konto för att samla och spara dina favoritrecept på ett enkelt och
          smidigt sätt. Oavsett om du letar efter nya idéer till vardagsmiddagen
          eller inspiration till festmåltiden, hjälper Matkistan dig att göra
          matlagningen både roligare och enklare. Börja din resa mot en värld av
          smakupplevelser redan idag
        </p>
        <div v-if="!isLoggedIn" class="flex gap-4">
          <button
            class="bg-[#385F4E] px-4 py-2 rounded-full md:py-3 md:px-8 text-white cursor-pointer hover:bg-[#2F4B3D] uppercase text-sm"
            @click="toggleDiv"
          >
            Skapa konto
          </button>
          <router-link to="/login">
            <button
              class="bg-[#385F4E] px-4 py-2 rounded-full md:py-3 md:px-8 text-white cursor-pointer hover:bg-[#2F4B3D] uppercase text-sm"
            >
              Logga in
            </button>
          </router-link>
        </div>
      </div>
      <div class="w-full max-h-80">
        <img
          src="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Bild på färgglad mat på en tallrik"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
    <div v-if="isOpen" class="flex px-2 justify-center md:py-2">
      <div class="flex justify-center items-center max-w-[700px] w-full py-2">
        <UserForm />
      </div>
    </div>

    <Search />

    <Welcome />
  </main>
</template>

<style scoped></style>
