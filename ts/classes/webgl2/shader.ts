export class ShaderProgram {
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram;
    private uniformLocations: Map<string, WebGLUniformLocation>;
    private attributeLocations: Map<string, number>;

    constructor(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) {
        this.gl = gl;
        this.uniformLocations = new Map();
        this.attributeLocations = new Map();
        
        const vertexShader = this.compileShader(vertexSource, gl.VERTEX_SHADER);
        const fragmentShader = this.compileShader(fragmentSource, gl.FRAGMENT_SHADER);
        
        this.program = this.createProgram(vertexShader, fragmentShader);
        
        // Clean up individual shaders
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
    }

    private compileShader(source: string, type: number): WebGLShader {
        const shader = this.gl.createShader(type);
        if (!shader) {
            throw new Error('Failed to create shader');
        }

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const info = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error(`Shader compilation error: ${info}`);
        }

        return shader;
    }

    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
        const program = this.gl.createProgram();
        if (!program) {
            throw new Error('Failed to create shader program');
        }

        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            const info = this.gl.getProgramInfoLog(program);
            this.gl.deleteProgram(program);
            throw new Error(`Shader program linking error: ${info}`);
        }

        return program;
    }

    public use(): void {
        this.gl.useProgram(this.program);
    }

    public getUniformLocation(name: string): WebGLUniformLocation {
        let location = this.uniformLocations.get(name);
        if (!location) {
            location = this.gl.getUniformLocation(this.program, name);
            if (!location) {
                throw new Error(`Uniform ${name} not found in shader program`);
            }
            this.uniformLocations.set(name, location);
        }
        return location;
    }

    public getAttributeLocation(name: string): number {
        let location = this.attributeLocations.get(name);
        if (location === undefined) {
            location = this.gl.getAttribLocation(this.program, name);
            if (location === -1) {
                throw new Error(`Attribute ${name} not found in shader program`);
            }
            this.attributeLocations.set(name, location);
        }
        return location;
    }

    public setUniformMatrix4fv(name: string, value: Float32Array): void {
        const location = this.getUniformLocation(name);
        this.gl.uniformMatrix4fv(location, false, value);
    }

    public setUniform1f(name: string, value: number): void {
        const location = this.getUniformLocation(name);
        this.gl.uniform1f(location, value);
    }

    public setUniform3fv(name: string, value: Float32Array): void {
        const location = this.getUniformLocation(name);
        this.gl.uniform3fv(location, value);
    }

    public setUniform4fv(name: string, value: Float32Array): void {
        const location = this.getUniformLocation(name);
        this.gl.uniform4fv(location, value);
    }

    public dispose(): void {
        this.gl.deleteProgram(this.program);
    }
} 