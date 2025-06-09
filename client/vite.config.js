import { defineConfig } from "vite";
import dotenv from "dotenv";
import react from "@vitejs/plugin-react-swc";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5554,
    allowedHosts: ["libsearch.bntu.by", "localhost", "127.0.0.1"],
    hmr: {
      protocol: "wss",  
      host: "libsearch.bntu.by",
      port: "443"
    }
  }
});