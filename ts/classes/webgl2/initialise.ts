
export class WebGL2Initializer {
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext | null = null;

    constructor(canvas: HTMLCanvasElement) {
        if (!canvas) {
            throw new Error(`Canvas not found`);
        }
        this.canvas = canvas;
        this.initializeWebGL2();
    }

    private initializeWebGL2(): void {
        try {
            this.gl = this.canvas.getContext('webgl2');
            if (!this.gl) {
                throw new Error('WebGL2 not supported');
            }

            // Enable common WebGL features
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.cullFace(this.gl.BACK);
            this.gl.frontFace(this.gl.CCW);
            
            // Clear color to black
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        } catch (error) {
            console.error('Failed to initialize WebGL2:', error);
            throw error;
        }
    }

    public getContext(): WebGL2RenderingContext {
        if (!this.gl) {
            throw new Error('WebGL2 context not initialized');
        }
        return this.gl;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public resizeCanvas(width: number, height: number): void {
        this.gl?.viewport(0, 0, width, height);
    }

    public clear(): void {
        this.gl?.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}
