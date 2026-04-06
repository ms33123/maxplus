import { createApp } from "vue";
import App from "./App.vue";
import { reveal, syncRevealVisibility } from "./directives/reveal";
import { router } from "./router";
import "../styles-sporting.css";

const app = createApp(App);

app.use(router);
app.directive("reveal", reveal);

router.afterEach(() => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      syncRevealVisibility();
    });
  });
});

app.mount("#app");
