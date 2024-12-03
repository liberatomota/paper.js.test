import Editor from './entities/Editor';
import paper from 'paper';
import './styles/main.css';

window.onload = async () => {
    console.log("Window Loaded!");
    const canvas = document.getElementById("canvasOne") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    paper.setup(canvas);

    if (ctx) {
        const editor = new Editor(canvas, ctx);
    }
}