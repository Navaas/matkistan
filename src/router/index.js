import { createRouter, createWebHistory } from "vue-router";

import CreateRecipe from "../page/CreateRecipePage.vue";
import LikedRecipes from "../page/LikedRecipes.vue";
import LoginPage from "../page/LoginPage.vue";
import SingelRecipePage from "../page/SingelRecipePage.vue";
import StartPage from "../page/StartPage.vue";
import UserPage from "../page/UserPage.vue";
import UsersCreatedRecipes from "../page/UsersCreatedRecipesPage.vue";

// Lägg till fler sidor här som ska kunna navigeras till
const routes = [
  { path: "/", name: "start", component: StartPage },
  { path: "/login", name: "login", component: LoginPage },
  { path: "/profil", name: "profil", component: UserPage },
  { path: "/createRecipe", name: "createRecipe", component: CreateRecipe },
  { path: "/likedRecipes", name: "likedRecipes", component: LikedRecipes },
  {
    path: "/singelRecipe/:id",
    name: "singelRecipe",
    component: SingelRecipePage,
    props: true,
  },
  {
    path: "/userCreatedRecipes",
    name: "userCreatedRecipes",
    component: UsersCreatedRecipes,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
