import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      compilerOptions: {
        skipLibCheck: true,
        noEmitOnError: false,
      },
      exclude: ["./src/view", "./src/__test__"],
    }),
  ],
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "work-boost",
      fileName: (format) => `work-boost.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
