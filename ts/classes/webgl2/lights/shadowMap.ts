export class ShadowMap {
    private framebuffer: WebGLFramebuffer;
    private depthTexture: WebGLTexture;
    private size: number;

    constructor(gl: WebGL2RenderingContext, size: number = 1024) {
        this.size = size;
        
        // Create depth texture
        this.depthTexture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.DEPTH_COMPONENT32F,
            size,
            size,
            0,
            gl.DEPTH_COMPONENT,
            gl.FLOAT,
            null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Create and setup framebuffer
        this.framebuffer = gl.createFramebuffer()!;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.DEPTH_ATTACHMENT,
            gl.TEXTURE_2D,
            this.depthTexture,
            0
        );

        // No color buffer needed for shadow map
        gl.drawBuffers([gl.NONE]);
        gl.readBuffer(gl.NONE);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    bind(gl: WebGL2RenderingContext) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.viewport(0, 0, this.size, this.size);
    }

    bindDepthTexture(gl: WebGL2RenderingContext, textureUnit: number) {
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
    }

    getDepthTexture(): WebGLTexture {
        return this.depthTexture;
    }
} 