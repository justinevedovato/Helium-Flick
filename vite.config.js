import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Pages from "vite-plugin-pages"
const path = require("path")

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [Vue(), Pages()],
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
})
