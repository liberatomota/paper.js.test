const colors = new Map([
    ['green', [203, 240, 120]],
    ['yellow', [248, 243, 152]],
    ['orange', [241, 185, 99]],
    ['magenta', [228, 97, 97]]
  ]);
  

export default class Color {
    colorName: string | undefined;
    alpha: number = 1;
    rgb: string;
    constructor(colorName: string, alpha: number) {
        this.alpha = (alpha < 0 || alpha > 1) ? 1 : alpha;
        this.colorName = colorName;
        const color = colors.get(this.colorName);
        if (color) {
            this.rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]}, ${this.alpha})`;
        } else {
            this.rgb = `rgb(128,128,128, ${this.alpha})`;
        }
    }
}