import { join } from "path";

const projectTop = join(__dirname, "..");
const distDir = join(projectTop, "dist");

export { projectTop, distDir };
