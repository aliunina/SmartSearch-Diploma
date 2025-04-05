import { defineConfig } from "vite";
import dotenv from "dotenv";
import react from "@vitejs/plugin-react-swc";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.VITE_SERVER_API_URL": JSON.stringify(process.env.VITE_SERVER_API_URL),
    "process.env.VITE_SEARCH_ENGINE_URL": JSON.stringify(process.env.VITE_SEARCH_ENGINE_URL),
    "process.env.VITE_SEARCH_ENGINE_KEY": JSON.stringify(process.env.VITE_SEARCH_ENGINE_KEY),
    "process.env.VITE_SEARCH_ENGINE_CX": JSON.stringify(process.env.VITE_SEARCH_ENGINE_CX)
  }
});