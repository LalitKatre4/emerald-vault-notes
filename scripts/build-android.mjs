import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const dist = path.resolve(root, "dist");

console.log("Building Android web app...");

// Clean dist
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}

// Build Android client
try {
  execSync("npx vite build --config vite.android.config.ts", {
    stdio: "inherit",
    shell: true,
  });
} catch (error) {
  console.error("Android Vite build failed.");
  process.exit(1);
}

// Check assets
const assets = path.join(dist, "assets");

if (!fs.existsSync(assets)) {
  throw new Error("Android build failed: dist/assets was not generated.");
}

const files = fs.readdirSync(assets);

const js = files.find(
  (file) =>
    (file.startsWith("android-main-") || file.startsWith("index-")) &&
    file.endsWith(".js")
);

const css = files.find(
  (file) => file.startsWith("styles-") && file.endsWith(".css")
);

if (!js) {
  throw new Error("Android build failed: Android JS asset not found.");
}

if (!css) {
  throw new Error("Android build failed: CSS asset not found.");
}

// Create index.html
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, viewport-fit=cover"
  >
  <meta name="theme-color" content="#161d1a">
  <title>Private Notes Vault</title>
  <link rel="stylesheet" href="./assets/${css}">
</head>
<body>
  <div id="root"></div>

  <script type="module" src="./assets/${js}"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(dist, "index.html"), html);

console.log("");
console.log("=================================");
console.log("Android web build ready!");
console.log("=================================");
console.log("JS :", js);
console.log("CSS:", css);
console.log("HTML:", path.join(dist, "index.html"));