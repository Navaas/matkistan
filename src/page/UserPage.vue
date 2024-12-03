<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Header from "../components/Header.vue";

const message = ref("");
const messageType = ref("");

const router = useRouter();

const user = ref(null);

const getLoggedInUser = async () => {
  try {
    const response = await fetch("http://localhost:3000/auth", {
      method: "GET",
      credentials: "include", // Viktigt för att skicka med sessionen via cookies
    });

    if (response.ok) {
      const data = await response.json();
      user.value = data.user; // Sätt användardata i 'user'
      console.log("Inloggad användare:", data.user); // Logga användaren för att bekräfta
    } else {
      console.error(
        "Användaren är inte inloggad eller något gick fel:",
        await response.text()
      );
      user.value = null; // Om användaren inte är inloggad, sätt 'user' till null
    }
  } catch (error) {
    console.error("Fel vid hämtning av användardata:", error);
  }
};

// Kalla på funktionen när komponenten laddas
getLoggedInUser();

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
  <div class="pt-14">
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
