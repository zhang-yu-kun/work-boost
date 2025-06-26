export default {
  // 使用ts-jest预设，这个预设包含了处理TypeScript文件所需的所有配置
  preset: "ts-jest",

  // 设置测试环境为jsdom，jsdom模拟了一个浏览器环境，允许在Node环境下运行浏览器特定的API
  // testEnvironment: 'jsdom',
  testEnvironment: "jest-environment-jsdom",
  // 在每个测试文件运行之后，立即执行指定的脚本文件，这里是项目根目录下的src/setupTests.ts
  // 通常用于全局的测试设置，比如配置enzyme或jest-dom等
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  // 配置文件转换规则，告诉Jest如何处理项目中的不同类型的文件
  transform: {
    // 使用ts-jest处理.ts和.tsx文件
    // 这允许Jest理解TypeScript语法并将其转换为JavaScript
    "^.+\\.(ts|tsx)$": "ts-jest",

    // 使用babel-jest处理.js和.jsx文件
    // 这允许Jest通过Babel转换这些文件，支持ES6语法和React JSX
    "^.+\\.(js|jsx)$": "babel-jest",
  },

  // 指定Jest在转换过程中应该忽略的文件模式
  // 这里配置为忽略node_modules目录下的所有文件，这些文件通常不需要转换
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "jest-transform-stub",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.ts",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
