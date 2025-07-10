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
      plugins: [
        {
          name: "css-injection",
          generateBundle(options, bundle) {
            // 收集所有CSS内容
            let css = "";
            for (const key in bundle) {
              if (bundle[key].type === "asset" && key.endsWith(".css")) {
                css += bundle[key].source;
                delete bundle[key];
              }
            }

            // 注入到JS中
            if (css) {
              this.emitFile({
                type: "asset",
                fileName: "work-boost.css",
                source: css,
              });
            }
          },
        },
      ],
    },
  },
});
