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
        <div v-if="isLoggedIn">
          <span class="text-3xl pb-6 text-white"
            >Välkommen tillbaka, {{ user.username }}!</span
          >
        </div>
      </div>
      <!-- Bild -->
      <img
        src="https://images.unsplash.com/photo-1542814784-133212a2e378?q=80&w=1922&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Bild på färgglad mat på en tallrik"
        class="absolute inset-0 w-full h-full object-cover z-0"
      />
    </div>

    <div
      class="flex flex-col justify-center items-center gap-4 pt-6 md:flex-row"
    >
      <div
        class="border border-gray-300 rounded-md w-full shadow-xl md:w-1/3 p-2 h-[50vh] max-h-60"
      >
        <h1>Dina uppgifter</h1>
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
            @click="toggleDiv"
            class="bg-black px-2 py-2 rounded-md text-sm text-white cursor-pointer hover:bg-slate-500 w-24"
          >
            Uppdatera
          </button>
          <button
            @click="deleteUser"
            class="bg-red-600 px-2 py-2 rounded-md text-sm text-white cursor-pointer hover:bg-slate-500 w-24"
          >
            Ta bort
          </button>
        </div>
      </div>

      <div class="shadow-xl w-full md:w-1/3">
        <div
          class="relative w-full h-[50vh] max-h-60 rounded-md overflow-hidden"
        >
          <div class="absolute inset-0 bg-black/50 z-10 rounded-md"></div>

          <img
            src="https://images.unsplash.com/photo-1501747188-61c00b3d8ba0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Overlay bild"
            class="w-full h-[50vh] max-h-60 object-cover rounded-md"
          />

          <div
            class="absolute inset-0 z-20 flex flex-col items-center justify-center"
          >
            <h1 class="text-white text-2xl pb-2">Vill du logga ut?</h1>
            <button
              @click="logout"
              class="bg-black px-2 py-2 rounded-md text-sm text-white cursor-pointer hover:bg-slate-500 w-24"
            >
              Logga ut
            </button>
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
    <div v-if="isOpen" class="flex justify-center pt-6">
      <div class="flex max-w-[700px] w-full py-2">
        <UpdateUser />
      </div>
    </div>
  </main>
</template>

<style></style>
