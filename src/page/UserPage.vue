<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Footer from "../components/Footer.vue";
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
// const user = ref(null);
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
  <div class="flex flex-col min-h-screen">
    <Header />

    <main class="pb-24 md:pt-14 flex-grow">
      <div class="bg-black py-24 relative">
        <div class="absolute inset-0 bg-black/50 z-10"></div>
        <div
          class="absolute inset-0 z-20 px-2 flex items-center justify-center"
        >
          <div v-if="isLoggedIn">
            <h1 class="text-2xl md:text-4xl pb-6 text-white">
              Välkommen tillbaka, {{ user.username }}!
            </h1>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1542814784-133212a2e378?q=80&w=1922&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Detta är en bil på gärfglada grönsaker i rosa och gröna toner"
          class="absolute inset-0 w-full h-full object-cover z-0"
        />
      </div>

      <div
        class="flex flex-col justify-center items-center gap-4 px-2 pt-4 md:flex-row"
      >
        <div
          v-if="user"
          class="border border-gray-300 rounded-md w-full shadow-xl md:w-1/3 p-4 max-h-60"
        >
          <h1 class="pb-4 font-bold">Dina uppgifter</h1>
          <div class="flex gap-1">
            <h3 class="font-bold">Förnamn:</h3>
            <p>{{ user.firstname }}</p>
          </div>
          <div class="flex gap-1">
            <h3 class="font-bold">Användarnamn:</h3>
            <p>{{ user.username }}</p>
          </div>
          <div class="flex gap-1">
            <h3 class="font-bold">Email:</h3>
            <p>{{ user.email }}</p>
          </div>

          <div class="flex gap-2 mt-4">
            <button
              @click="toggleDiv"
              class="bg-[#fa7e61] px-6 py-2 rounded-md text-sm text-black cursor-pointer hover:bg-[#a4b8c4] hover:text-black"
            >
              Uppdatera
            </button>
            <button
              @click="deleteUser"
              class="bg-red-500 px-8 py-2 rounded-md text-sm text-black cursor-pointer hover:bg-[#a4b8c4] hover:text-black"
            >
              Ta bort
            </button>
          </div>
        </div>

        <div class="shadow-xl w-full md:w-1/3">
          <div
            class="relative w-full h-[50vh] max-h-60 rounded-md overflow-hidden"
          >
            <div class="absolute inset-0 bg-black/10 z-10 rounded-md"></div>

            <img
              src="https://plus.unsplash.com/premium_photo-1713551474697-15fe83485bc7?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Ds"
              alt="Detta är en bild på glas med olika bär och yoghurt på en grå bakgrund."
              class="w-full h-[50vh] max-h-60 object-cover rounded-md"
            />

            <div
              class="absolute inset-0 z-20 flex flex-col items-center justify-center"
            >
              <h1 class="text-black font-bold text-2xl pb-2">
                Vill du logga ut?
              </h1>
              <button
                @click="logout"
                class="bg-[#fa7e61] px-12 py-2 rounded-md text-sm text-black cursor-pointer hover:bg-[#a4b8c4] hover:text-black"
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
        <div class="flex max-w-[700px] w-full py-2 px-2">
          <UpdateUser />
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
button:focus {
  outline: 3px solid #000;
}
</style>
