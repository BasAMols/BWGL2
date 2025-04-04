export interface ShaderUniformData {
    type: string;
    value: number | number[] | Float32Array | Int32Array;
    location?: WebGLUniformLocation;
    isArray?: boolean;
    arraySize?: number;
}

export interface ShaderAttributeData {
    type: string;
    size: number;
    location: number;
}

export class ShaderManager {
    private gl: WebGL2RenderingContext;
    private shaderPrograms: Map<string, WebGLProgram>;
    private uniforms: Map<string, Map<string, ShaderUniformData>>;
    private attributes: Map<string, Map<string, ShaderAttributeData>>;
    private currentProgram: string | null = null;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.shaderPrograms = new Map();
        this.uniforms = new Map();
        this.attributes = new Map();
    }

    public loadShaderProgram(
        name: string,
        vertexSource: string,   
        fragmentSource: string
    ) {
        try {
            const vertexShader = this.compileShader(vertexSource, this.gl.VERTEX_SHADER);
            const fragmentShader = this.compileShader(fragmentSource, this.gl.FRAGMENT_SHADER);
            
            const program = this.createProgram(vertexShader, fragmentShader);
            this.shaderPrograms.set(name, program);
            
            // Initialize uniform and attribute maps for this program
            this.uniforms.set(name, new Map());
            this.attributes.set(name, new Map());
            
            // Clean up individual shaders
            this.gl.deleteShader(vertexShader);
            this.gl.deleteShader(fragmentShader);
            
            // Parse uniforms and attributes
            this.introspectShaderProgram(name);
        } catch (error) {
            console.error(`Failed to load shader program '${name}':`, error);
            throw error;
        }
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

    private introspectShaderProgram(name: string): void {
        const program = this.shaderPrograms.get(name);
        if (!program) {
            throw new Error(`Shader program '${name}' not found`);
        }

        // Get active uniforms
        const numUniforms = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
        const uniformMap = this.uniforms.get(name)!;

        for (let i = 0; i < numUniforms; i++) {
            const info = this.gl.getActiveUniform(program, i);
            if (!info) continue;

            const location = this.gl.getUniformLocation(program, info.name);
            if (!location) continue;

            // For array uniforms, store with the base name (without array index)
            const baseName = info.name.replace(/\[\d+\].*$/, '');
            
            uniformMap.set(baseName, {
                type: this.getUniformTypeName(info.type),
                value: this.getDefaultValueForType(info.type),
                location,
                isArray: info.size > 1,
                arraySize: info.size
            });
        }

        // Get active attributes
        const numAttributes = this.gl.getProgramParameter(program, this.gl.ACTIVE_ATTRIBUTES);
        const attributeMap = this.attributes.get(name)!;

        for (let i = 0; i < numAttributes; i++) {
            const info = this.gl.getActiveAttrib(program, i);
            if (!info) continue;

            const location = this.gl.getAttribLocation(program, info.name);
            if (location === -1) continue;

            attributeMap.set(info.name, {
                type: this.getAttributeTypeName(info.type),
                size: this.getAttributeSize(info.type),
                location
            });
        }
    }

    public useProgram(name: string): void {
        const program = this.shaderPrograms.get(name);
        if (!program) {
            throw new Error(`Shader program '${name}' not found`);
        }
        this.gl.useProgram(program);
        this.currentProgram = name;
    }

    public setUniform(name: string, value: number | number[] | Float32Array | Int32Array): void {
        if (!this.currentProgram) {
            throw new Error('No shader program is currently in use');
        }

        const uniformMap = this.uniforms.get(this.currentProgram);
        if (!uniformMap) {
            throw new Error(`Uniform map not found for program '${this.currentProgram}'`);
        }

        const uniform = uniformMap.get(name);
        if (!uniform || !uniform.location) {
            throw new Error(`Uniform '${name}' not found in program '${this.currentProgram}'. Make sure to use the u_camelCase naming convention for uniforms, v_camelCase for varyings, and a_camelCase for attributes.`);
        }

        this.setUniformValue(uniform.type, uniform.location, value);
        uniform.value = value;
    }

    private setUniformValue(
        type: string,
        location: WebGLUniformLocation,
        value: number | number[] | Float32Array | Int32Array
    ): void {
        switch (type) {
            case 'float':
                if (Array.isArray(value) || value instanceof Float32Array) {
                    this.gl.uniform1fv(location, value);
                } else {
                    this.gl.uniform1f(location, value as number);
                }
                break;
            case 'vec2':
                this.gl.uniform2fv(location, value as Float32Array);
                break;
            case 'vec3':
                this.gl.uniform3fv(location, value as Float32Array);
                break;
            case 'vec4':
                this.gl.uniform4fv(location, value as Float32Array);
                break;
            case 'mat4':
                this.gl.uniformMatrix4fv(location, false, value as Float32Array);
                break;
            case 'mat4[]':
                // Handle array of mat4
                this.gl.uniformMatrix4fv(location, false, value as Float32Array);
                break;
            case 'mat3':
                this.gl.uniformMatrix3fv(location, false, value as Float32Array);
                break;
            case 'int':
            case 'bool':
            case 'sampler2D':
            case 'sampler2D[]':
                if (Array.isArray(value) || value instanceof Int32Array) {
                    this.gl.uniform1iv(location, value);
                } else {
                    this.gl.uniform1i(location, value as number);
                }
                break;
            case 'Light':
                // Handle Light struct array
                const data = value as Float32Array;
                this.gl.uniform1fv(location, data);
                break;
            default:
                console.warn(`Unsupported uniform type: ${type}`);
                break;
        }
    }

    public getAttributeLocation(name: string): number {
        if (!this.currentProgram) {
            throw new Error('No shader program is currently in use');
        }

        const attributeMap = this.attributes.get(this.currentProgram);
        if (!attributeMap) {
            throw new Error(`Attribute map not found for program '${this.currentProgram}'`);
        }

        const attribute = attributeMap.get(name);
        if (!attribute) {
            throw new Error(`Attribute '${name}' not found in program '${this.currentProgram}'. Make sure to use the a_camelCase naming convention.`);
        }

        return attribute.location;
    }

    private getUniformTypeName(type: number): string {
        switch (type) {
            case this.gl.FLOAT: return 'float';
            case this.gl.FLOAT_VEC2: return 'vec2';
            case this.gl.FLOAT_VEC3: return 'vec3';
            case this.gl.FLOAT_VEC4: return 'vec4';
            case this.gl.FLOAT_MAT4: 
                return 'mat4';
            case this.gl.FLOAT_MAT4 | 0x20: // Array flag
                return 'mat4[]';
            case this.gl.FLOAT_MAT3: return 'mat3';
            case this.gl.INT: return 'int';
            case this.gl.BOOL: return 'bool';
            case this.gl.SAMPLER_2D: 
                return 'sampler2D';
            case this.gl.SAMPLER_2D | 0x20: // Array flag
                return 'sampler2D[]';
            case 0x8B52: // GL_STRUCT
                return 'Light'; // Handle Light struct type
            default:
                console.warn(`Unknown uniform type: ${type}`);
                return 'unknown';
        }
    }

    private getAttributeTypeName(type: number): string {
        switch (type) {
            case this.gl.FLOAT: return 'float';
            case this.gl.FLOAT_VEC2: return 'vec2';
            case this.gl.FLOAT_VEC3: return 'vec3';
            case this.gl.FLOAT_VEC4: return 'vec4';
            default: return 'unknown';
        }
    }

    private getAttributeSize(type: number): number {
        switch (type) {
            case this.gl.FLOAT: return 1;
            case this.gl.FLOAT_VEC2: return 2;
            case this.gl.FLOAT_VEC3: return 3;
            case this.gl.FLOAT_VEC4: return 4;
            default: return 0;
        }
    }

    private getDefaultValueForType(type: number): number | Float32Array {
        switch (type) {
            case this.gl.FLOAT:
            case this.gl.INT:
            case this.gl.BOOL:
            case this.gl.SAMPLER_2D:
                return 0;
            case this.gl.FLOAT_VEC2:
                return new Float32Array(2);
            case this.gl.FLOAT_VEC3:
                return new Float32Array(3);
            case this.gl.FLOAT_VEC4:
                return new Float32Array(4);
            case this.gl.FLOAT_MAT4:
                return new Float32Array(16);
            default:
                return 0;
        }
    }

    public dispose(): void {
        // Delete all shader programs
        for (const [name, program] of this.shaderPrograms) {
            this.gl.deleteProgram(program);
        }
        this.shaderPrograms.clear();
        this.uniforms.clear();
        this.attributes.clear();
        this.currentProgram = null;
    }
} 