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

// const logout = async () => {
//   try {
//     const response = await fetch("http://localhost:3000/logout", {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (response.ok) {
//       console.log("Utloggning lyckades");
//       // Om utloggningen lyckades, visa meddelande och omdirigera användaren
//       message.value = "Du är nu utloggad!";
//       messageType.value = "success";
//       localStorage.removeItem("isLoggedIn");
//       localStorage.removeItem("user");
//       router.push("/"); // Navigera till startsidan eller annan sida
//     } else {
//       const errorData = await response.json();
//       message.value = errorData.error || "Problem med utloggning";
//       messageType.value = "error";
//     }
//   } catch (error) {
//     console.error("Ett fel inträffade:", error);
//     message.value = "Ett tekniskt fel inträffade vid utloggning";
//     messageType.value = "error";
//   }
// };

const logout = () => {
  // Ta bort token från localStorage eller sessionStorage
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");

  // Ta bort användardata om du har sparat det
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");

  // Uppdatera applikationens tillstånd
  isLoggedIn.value = false;
  user.value = null;

  // Navigera till login-sidan eller någon offentlig sida
  router.push("/login");
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
      // Rensa localStorage och visa meddelande
      message.value = "Ditt konto har tagits bort.";
      messageType.value = "success";
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      router.push("/"); // Navigera till startsidan eller annan sida
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

  <!-- <div v-if="user">
    <h3>Skapade recept:</h3>
    <ul>
      <li v-for="recipe in user.recipesCreated" :key="recipe._id">
        <span>{{ recipe.title }}</span>
      </li>
    </ul>

    <h3>Gillade recept:</h3>
    <ul>
      <li v-for="recipe in user.likedRecipes" :key="recipe._id">
        <span>{{ recipe.title }}</span>
      </li>
    </ul>
  </div> -->

  <span
    v-if="message"
    :class="messageType === 'Success' ? 'text-green-500' : 'text-red-500'"
  >
    {{ message }}
  </span>
</template>

<style></style>
