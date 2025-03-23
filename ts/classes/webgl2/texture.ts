import { glob } from '../../game';

export class Texture {
    private gl: WebGL2RenderingContext;
    private texture: WebGLTexture;
    private target: number;
    private width: number = 0;
    private height: number = 0;

    constructor(
        target: number = glob.ctx.TEXTURE_2D
    ) {
        this.target = target;

        const texture = glob.ctx.createTexture();
        if (!texture) {
            throw new Error('Failed to create texture');
        }
        this.texture = texture;

        this.bind();
        // Set default texture parameters
        glob.ctx.texParameteri(target, glob.ctx.TEXTURE_WRAP_S, glob.ctx.CLAMP_TO_EDGE);
        glob.ctx.texParameteri(target, glob.ctx.TEXTURE_WRAP_T, glob.ctx.CLAMP_TO_EDGE);
        glob.ctx.texParameteri(target, glob.ctx.TEXTURE_MIN_FILTER, glob.ctx.LINEAR);
        glob.ctx.texParameteri(target, glob.ctx.TEXTURE_MAG_FILTER, glob.ctx.LINEAR);
    }

    public bind(unit: number = 0): void {
        glob.ctx.activeTexture(glob.ctx.TEXTURE0 + unit);
        glob.ctx.bindTexture(this.target, this.texture);
    }

    public unbind(): void {
        glob.ctx.bindTexture(this.target, null);
    }

    public setImage(
        image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap,
        level: number = 0,
        internalFormat: number = glob.ctx.RGBA,
        format: number = glob.ctx.RGBA,
        type: number = glob.ctx.UNSIGNED_BYTE
    ): void {
        this.bind();
        this.width = image.width;
        this.height = image.height;
        glob.ctx.texImage2D(
            this.target,
            level,
            internalFormat,
            format,
            type,
            image
        );
        
        // Generate mipmaps if using LINEAR_MIPMAP_LINEAR
        if (glob.ctx.getTexParameter(this.target, glob.ctx.TEXTURE_MIN_FILTER) === glob.ctx.LINEAR_MIPMAP_LINEAR) {
            glob.ctx.generateMipmap(this.target);
        }
    }

    public setData(
        width: number,
        height: number,
        data: ArrayBufferView | null,
        level: number = 0,
        internalFormat: number = glob.ctx.RGBA,
        format: number = glob.ctx.RGBA,
        type: number = glob.ctx.UNSIGNED_BYTE
    ): void {
        this.bind();
        this.width = width;
        this.height = height;
        glob.ctx.texImage2D(
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
        wrapS: number = glob.ctx.CLAMP_TO_EDGE,
        wrapT: number = glob.ctx.CLAMP_TO_EDGE,
        minFilter: number = glob.ctx.LINEAR,
        magFilter: number = glob.ctx.LINEAR
    ): void {
        this.bind();
        glob.ctx.texParameteri(this.target, glob.ctx.TEXTURE_WRAP_S, wrapS);
        glob.ctx.texParameteri(this.target, glob.ctx.TEXTURE_WRAP_T, wrapT);
        glob.ctx.texParameteri(this.target, glob.ctx.TEXTURE_MIN_FILTER, minFilter);
        glob.ctx.texParameteri(this.target, glob.ctx.TEXTURE_MAG_FILTER, magFilter);
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