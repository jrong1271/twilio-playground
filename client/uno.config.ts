// uno.config.ts
import { defineConfig, presetWind3 } from "unocss";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  presets: [presetWind3()],
  transformers: [
    transformerDirectives(), // 👈 enables @apply and @screen
  ],
  shortcuts: {},
});
