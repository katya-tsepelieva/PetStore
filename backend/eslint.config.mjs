import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "semi": ["error", "always"], 
      "no-console": "off", 
      "curly": ["error", "all"], 
    },
    ignores: [
      "package-lock.json",
      "*.min.js", 
      ".vscode/",             
      "node_modules/",         
      ".env",                  
    ]
  },
  {
    files: ["**/*.js"],
    languageOptions: { 
      sourceType: "commonjs",
      globals: {
        ...globals.node 
      }
    }
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser }
  },
]);
