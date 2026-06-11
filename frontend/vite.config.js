import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      // Inclui todas as paginas HTML no build do Vite.
      input: {
        index: resolve(__dirname, "index.html"),
        cadastro: resolve(__dirname, "cadastro.html"),
        login: resolve(__dirname, "login.html"),
        app: resolve(__dirname, "app.html"),
      },
    },
  },
});
