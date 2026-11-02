import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // 沿用 <img>（含 <picture> 響應式圖片），之後再逐步換 next/image
      "@next/next/no-img-element": "off",
    },
  },
  { ignores: [".next/**", "node_modules/**", "scripts/**", "next-env.d.ts"] },
];

export default eslintConfig;
