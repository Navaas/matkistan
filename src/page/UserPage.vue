<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Header from "../components/Header.vue";
import { fetchUserData, user } from "../utils/checkLoginHandler";

const message = ref("");
const messageType = ref("");

const router = useRouter();

fetchUserData();

const logout = async () => {
  try {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log("Utloggning lyckades");
      // Om utloggningen lyckades, visa meddelande och omdirigera användaren
      message.value = "Du är nu utloggad!";
      messageType.value = "success";
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      router.push("/"); // Navigera till startsidan eller annan sida
    } else {
      const errorData = await response.json();
      message.value = errorData.error || "Problem med utloggning";
      messageType.value = "error";
    }
  } catch (error) {
    console.error("Ett fel inträffade:", error);
    message.value = "Ett tekniskt fel inträffade vid utloggning";
    messageType.value = "error";
  }
};
</script>

<template>
  <Header />
  <div class="md:pt-14">
    <h1>UserPage</h1>
    <h2 v-if="user">Välkommen, {{ user.username }}!</h2>
    <p v-else>Du är inte inloggad.</p>

    <div v-if="user">
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
    </div>

    <button
      @click="logout"
      class="bg-black px-4 py-2 rounded-xl text-white cursor-pointer hover:bg-slate-500"
    >
      Logga ut
    </button>

    <span
      v-if="message"
      :class="messageType === 'Success' ? 'text-green-500' : 'text-red-500'"
    >
      {{ message }}
    </span>
  </div>
</template>

<style></style>
