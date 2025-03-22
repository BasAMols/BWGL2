export class Buffer {
    private gl: WebGL2RenderingContext;
    private buffer: WebGLBuffer;
    private type: number;
    private usage: number;

    constructor(
        gl: WebGL2RenderingContext,
        type: number = gl.ARRAY_BUFFER,
        usage: number = gl.STATIC_DRAW
    ) {
        this.gl = gl;
        this.type = type;
        this.usage = usage;

        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error('Failed to create buffer');
        }
        this.buffer = buffer;
    }

    public bind(): void {
        this.gl.bindBuffer(this.type, this.buffer);
    }

    public unbind(): void {
        this.gl.bindBuffer(this.type, null);
    }

    public setData(data: BufferSource): void {
        this.bind();
        this.gl.bufferData(this.type, data, this.usage);
    }

    public updateData(data: BufferSource, offset: number = 0): void {
        this.bind();
        this.gl.bufferSubData(this.type, offset, data);
    }

    public dispose(): void {
        this.gl.deleteBuffer(this.buffer);
    }
}

export class VertexArray {
    private gl: WebGL2RenderingContext;
    private vao: WebGLVertexArrayObject;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        const vao = gl.createVertexArray();
        if (!vao) {
            throw new Error('Failed to create vertex array object');
        }
        this.vao = vao;
    }

    public bind(): void {
        this.gl.bindVertexArray(this.vao);
    }

    public unbind(): void {
        this.gl.bindVertexArray(null);
    }

    public setAttributePointer(
        location: number,
        size: number,
        type: number,
        normalized: boolean = false,
        stride: number = 0,
        offset: number = 0
    ): void {
        this.gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
        this.gl.enableVertexAttribArray(location);
    }

    public dispose(): void {
        this.gl.deleteVertexArray(this.vao);
    }
}

export class VertexBuffer extends Buffer {
    constructor(gl: WebGL2RenderingContext, usage: number = gl.STATIC_DRAW) {
        super(gl, gl.ARRAY_BUFFER, usage);
    }
}

export class IndexBuffer extends Buffer {
    private count: number = 0;

    constructor(gl: WebGL2RenderingContext, usage: number = gl.STATIC_DRAW) {
        super(gl, gl.ELEMENT_ARRAY_BUFFER, usage);
    }

    public setData(data: BufferSource): void {
        super.setData(data);
        this.count = data.byteLength / 2; // Assuming 16-bit indices
    }

    public getCount(): number {
        return this.count;
    }
} 