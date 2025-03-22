export class Texture {
    private gl: WebGL2RenderingContext;
    private texture: WebGLTexture;
    private target: number;
    private width: number = 0;
    private height: number = 0;

    constructor(
        gl: WebGL2RenderingContext,
        target: number = gl.TEXTURE_2D
    ) {
        this.gl = gl;
        this.target = target;

        const texture = gl.createTexture();
        if (!texture) {
            throw new Error('Failed to create texture');
        }
        this.texture = texture;

        this.bind();
        // Set default texture parameters
        gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }

    public bind(unit: number = 0): void {
        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
        this.gl.bindTexture(this.target, this.texture);
    }

    public unbind(): void {
        this.gl.bindTexture(this.target, null);
    }

    public setImage(
        image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap,
        level: number = 0,
        internalFormat: number = this.gl.RGBA,
        format: number = this.gl.RGBA,
        type: number = this.gl.UNSIGNED_BYTE
    ): void {
        this.bind();
        this.width = image.width;
        this.height = image.height;
        this.gl.texImage2D(
            this.target,
            level,
            internalFormat,
            format,
            type,
            image
        );
        
        // Generate mipmaps if using LINEAR_MIPMAP_LINEAR
        if (this.gl.getTexParameter(this.target, this.gl.TEXTURE_MIN_FILTER) === this.gl.LINEAR_MIPMAP_LINEAR) {
            this.gl.generateMipmap(this.target);
        }
    }

    public setData(
        width: number,
        height: number,
        data: ArrayBufferView | null,
        level: number = 0,
        internalFormat: number = this.gl.RGBA,
        format: number = this.gl.RGBA,
        type: number = this.gl.UNSIGNED_BYTE
    ): void {
        this.bind();
        this.width = width;
        this.height = height;
        this.gl.texImage2D(
            this.target,
            level,
            internalFormat,
            width,
            height,
            0,
            format,
            type,
            data
        );
    }

    public setParameters(
        wrapS: number = this.gl.CLAMP_TO_EDGE,
        wrapT: number = this.gl.CLAMP_TO_EDGE,
        minFilter: number = this.gl.LINEAR,
        magFilter: number = this.gl.LINEAR
    ): void {
        this.bind();
        this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, wrapS);
        this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, wrapT);
        this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, minFilter);
        this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, magFilter);
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public dispose(): void {
        this.gl.deleteTexture(this.texture);
    }
} 