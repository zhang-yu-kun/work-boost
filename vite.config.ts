import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    dts({
      compilerOptions: {
        skipLibCheck: true,
        noEmitOnError: false,
      },
      exclude: ["./src/view", "./src/__test__"],
    }),
    cssInjectedByJsPlugin(),
  ],
  build: {
    lib: {
      entry: {
        "work-boost": "./src/index.ts",
        antd: "./src/antd.ts",
      },
      name: "work-boost",
      fileName: (format, entryName) =>
        entryName === "antd" ? `antd.${format}.js` : `work-boost.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "antd"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          antd: "antd",
        },
      },
    },

    cssCodeSplit: true,
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
      scopeBehaviour: "local",
      // ========== 关键修复：添加类名生成规则 ==========
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
