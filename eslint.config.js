import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import boundaries from "eslint-plugin-boundaries";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2022 }
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      boundaries
    },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**" },
        { type: "screens", pattern: "src/app/screens/**" },
        { type: "domain-auth", pattern: "src/domains/auth/**" },
        { type: "domain-poi", pattern: "src/domains/poi/**" },
        { type: "domain-routes", pattern: "src/domains/routes/**" },
        { type: "domain-reviews", pattern: "src/domains/reviews/**" },
        { type: "domain-moderation", pattern: "src/domains/moderation/**" },
        { type: "domain-profile", pattern: "src/domains/profile/**" },
        { type: "domain-gamification", pattern: "src/domains/gamification/**" },
        { type: "domain-search", pattern: "src/domains/search/**" },
        { type: "shared", pattern: "src/shared/**" },
        { type: "mocks", pattern: "src/mocks/**" }
      ]
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "boundaries/element-types": ["error", {
        default: "disallow",
        rules: [
          { from: ["app", "screens"], allow: ["app", "screens", "shared", "domain-auth", "domain-poi", "domain-routes", "domain-reviews", "domain-moderation", "domain-profile", "domain-gamification", "domain-search"] },
          { from: ["domain-auth"], allow: ["domain-auth", "shared"] },
          { from: ["domain-poi"], allow: ["domain-poi", "shared", "domain-auth", "domain-reviews", "domain-search"] },
          { from: ["domain-routes"], allow: ["domain-routes", "shared", "domain-poi", "domain-search", "domain-gamification"] },
          { from: ["domain-reviews"], allow: ["domain-reviews", "shared", "domain-auth"] },
          { from: ["domain-moderation"], allow: ["domain-moderation", "shared", "domain-poi", "domain-auth"] },
          { from: ["domain-profile"], allow: ["domain-profile", "shared", "domain-poi", "domain-routes", "domain-gamification", "domain-auth"] },
          { from: ["domain-gamification"], allow: ["domain-gamification", "shared", "domain-auth"] },
          { from: ["domain-search"], allow: ["domain-search", "shared"] },
          { from: ["shared"], allow: ["shared"] },
          { from: ["mocks"], allow: ["mocks", "shared", "domain-auth", "domain-poi", "domain-routes", "domain-reviews", "domain-profile", "domain-gamification", "domain-moderation", "domain-search"] }
        ]
      }]
    }
  }
);
