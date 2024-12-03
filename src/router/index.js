import { createRouter, createWebHistory } from "vue-router";

import CreateRecipe from "../page/CreateRecipePage.vue";
import LoginPage from "../page/LoginPage.vue";
import StartPage from "../page/StartPage.vue";
import UserPage from "../page/UserPage.vue";

// Lägg till fler sidor här som ska kunna navigeras till
const routes = [
  { path: "/", name: "start", component: StartPage },
  { path: "/login", name: "login", component: LoginPage },
  { path: "/profil", name: "profil", component: UserPage },
  { path: "/createRecipe", name: "createRecipe", component: CreateRecipe },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
