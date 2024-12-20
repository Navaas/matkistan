<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Header from "../components/Header.vue";
import UpdateUser from "../components/UpdateUser.vue";
import {
  checkUserAuth,
  fetchUserData,
  isLoggedIn,
  user,
} from "../utils/checkLoginHandler";

const isOpen = ref(false);
const message = ref("");
const messageType = ref("");
const router = useRouter();

const errorMessage = ref("");

const toggleDiv = () => {
  isOpen.value = !isOpen.value;
  console.log(isOpen.value);
};
onMounted(() => {
  fetchUserData();
  checkUserAuth();
});

const logout = () => {
  localStorage.removeItem("authToken");

  localStorage.removeItem("user");

  isLoggedIn.value = false;
  user.value = null;

  router.push("/");
};

const deleteUser = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_FETCH_URL}/deleteUser`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      console.log("Användaren har tagits bort");

      message.value = "Ditt konto har tagits bort.";
      messageType.value = "success";
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      router.push("/");
    } else {
      const errorData = await response.json();
      message.value = errorData.error || "Problem med borttagning av konto";
      messageType.value = "error";
    }
  } catch (error) {
    console.error("Ett fel inträffade:", error);
    message.value = "Ett tekniskt fel inträffade vid borttagning av konto";
    messageType.value = "error";
  }
};
</script>

<template>
  <Header />
  <main class="pt-14 px-2">
    <div class="bg-black py-24 relative">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/50 z-10"></div>
      <div class="absolute inset-0 z-20 flex items-center justify-center">
        <h1 class="text-3xl text-white">Lägg till nytt recept</h1>
      </div>
      <!-- Bild -->
      <img
        src="https://images.unsplash.com/photo-1432457990754-c8b5f21448de?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Bild på färgglad mat på en tallrik"
        class="absolute inset-0 w-full h-full object-cover z-0"
      />
    </div>
    <div v-if="isLoggedIn" class="p-4 md:pt-14 bg-green-100 w-full">
      <div class="flex flex-col">
        <span class="text-3xl pb-6">Välkommen, {{ user.username }}!</span>
        <div class="flex gap-1">
          <p class="font-bold">Förnamn:</p>
          <span>{{ user.firstname }}</span>
        </div>
        <div class="flex gap-1">
          <p class="font-bold">Användarnamn:</p>
          <span>{{ user.username }}</span>
        </div>
        <div class="flex gap-1">
          <p class="font-bold">Email:</p>
          <span>{{ user.email }}</span>
        </div>
        <div class="flex gap-2 mt-4">
          <button
            @click="logout"
            class="bg-black px-2 py-2 rounded-md text-sm text-white cursor-pointer hover:bg-slate-500 w-24"
          >
            Logga ut
          </button>
          <button
            @click="toggleDiv"
            class="bg-black px-2 py-2 rounded-md text-sm text-white cursor-pointer hover:bg-slate-500 w-24"
          >
            Uppdatera
          </button>
          <button
            @click="deleteUser"
            class="bg-red-600 px-2 py-2 rounded-md text-sm text-white cursor-pointer hover:bg-slate-500 w-24"
          >
            Radera konto
          </button>
        </div>
        <div v-if="isOpen" class="flex">
          <div class="flex max-w-[700px] w-full py-2">
            <span>Uppdatera här</span>
            <UpdateUser />
          </div>
        </div>
      </div>
    </div>

    <span
      v-if="message"
      :class="messageType === 'Success' ? 'text-green-500' : 'text-red-500'"
    >
      {{ message }}
    </span>
  </main>
</template>

<style></style>
