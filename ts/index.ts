import { Game } from "./game";

document.addEventListener("DOMContentLoaded", async () => {
    const g = new Game();
    document.body.appendChild(g.renderer.dom);
});