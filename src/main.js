import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Skapa appen och använd router
const app = createApp(App);

app.use(router);
app.mount("#app");
