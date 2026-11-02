// 從 src/app/site.css 自動產生深色模式覆寫：node scripts/gen-dark-css.mjs
// 樣式裡的顏色大多直接寫死（#FFFFFF、#444444…），逐條手寫太多，這裡掃過每條規則，
// 遇到白底、淺灰底、深灰字、淺灰框線就產生一條 :root.dark 開頭的覆寫規則（@media 也一起保留）。
// 第二階段改成 Tailwind 的頁面直接用 dark: 前綴，這份就會越來越小。
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";

const ROOT = path.resolve(import.meta.dirname, "..");
const src = fs.readFileSync(path.join(ROOT, "src/app/site.css"), "utf8");

const norm = (v) => v.toLowerCase().replace(/\s+/g, "");
const BG = {
  "#fff": "var(--dk-bg)",
  "#ffffff": "var(--dk-bg)",
  "var(--neutral-white)": "var(--dk-bg)",
  "#f8f9fa": "var(--dk-surface)",
  "#f2f8ff": "var(--dk-surface-2)",
  "#e8ecf0": "var(--dk-surface-2)",
  "rgba(255,255,255,0.7)": "var(--dk-glass)",
  "var(--overlay-white-70)": "var(--dk-glass)",
  "var(--overlay-white-80)": "var(--dk-glass)",
};
const TEXT = {
  "#000": "var(--dk-text-strong)",
  "#000000": "var(--dk-text-strong)",
  "#2c2c2c": "var(--dk-text-strong)",
  "#444444": "var(--dk-text)",
  "#444": "var(--dk-text)",
  "#555555": "var(--dk-text)",
  "#666666": "var(--dk-text-muted)",
  "#666": "var(--dk-text-muted)",
  "#787877": "var(--dk-text-muted)",
  "#999999": "var(--dk-text-muted)",
  "#999": "var(--dk-text-muted)",
  "#999ea8": "var(--dk-text-muted)",
  "#06478f": "var(--dk-link)",
};
// 白底上的品牌藍字在深色底對比不夠，只改「文字」，按鈕底色維持原樣
const BLUE_TEXT = { "#1e6ec8": "var(--dk-link)", "var(--brand-blue)": "var(--dk-link)" };
const BORDER_COLORS = ["#e8ecf0", "#dde3ec", "#cccccc", "#cbcbcb", "#eae9e9", "#d9d9d9"];

function mapDecl(decl, rule) {
  const prop = decl.prop.toLowerCase();
  const v = norm(decl.value.replace(/!important/, ""));
  if (prop === "background" || prop === "background-color") {
    if (BG[v]) return BG[v];
    if (v === "#d9d9d9") return "var(--dk-border)"; // 輪播圓點
    return null;
  }
  if (prop === "color") {
    if (TEXT[v]) return TEXT[v];
    // 藍底按鈕上的白字不動；其他地方的白字（例如 hero 上）本來就在深色圖上，也不動
    if (BLUE_TEXT[v] && !/btn|button|tag|toggle/.test(rule.selector)) return BLUE_TEXT[v];
    return null;
  }
  if (/^border(-(top|right|bottom|left))?(-color)?$/.test(prop)) {
    const hit = BORDER_COLORS.find((c) => v.includes(c));
    if (hit) return decl.value.replace(new RegExp(hit, "i"), "var(--dk-border)");
    return null;
  }
  return null;
}

const out = postcss.root();
const prefixSelector = (sel) =>
  sel
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && s !== ":root")
    .map((s) => (/^(html|body)\b/.test(s) ? `:root.dark ${s.replace(/^html/, "")}`.replace(/\s+$/, "") : `:root.dark ${s}`))
    .join(",\n");

postcss.parse(src).walkRules((rule) => {
  if (rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
  const decls = [];
  rule.each((node) => {
    if (node.type !== "decl") return;
    const mapped = mapDecl(node, rule);
    if (mapped) decls.push(postcss.decl({ prop: node.prop, value: mapped, important: node.important }));
  });
  const selector = prefixSelector(rule.selector);
  if (!decls.length || !selector) return;
  const newRule = postcss.rule({ selector, nodes: decls });
  // 保留外層的 @media
  let target = out;
  const chain = [];
  for (let p = rule.parent; p && p.type === "atrule"; p = p.parent) chain.unshift(p);
  for (const at of chain) {
    const wrap = postcss.atRule({ name: at.name, params: at.params });
    target.append(wrap);
    target = wrap;
  }
  target.append(newRule);
});

const header = `/* 自動產生，請勿手動修改：node scripts/gen-dark-css.mjs */\n`;
fs.writeFileSync(path.join(ROOT, "src/app/site-dark.css"), header + out.toString() + "\n");
console.log("rules:", out.nodes.length);
