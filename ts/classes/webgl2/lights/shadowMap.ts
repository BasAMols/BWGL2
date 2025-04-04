export class ShadowMap {
    private framebuffer: WebGLFramebuffer;
    private depthTexture: WebGLTexture;
    private size: number;

    constructor(gl: WebGL2RenderingContext, size: number = 2048) {
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
        
        // Change filtering to handle edge cases better
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
        // Use CLAMP_TO_BORDER to avoid sampling outside the shadow map
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
        // Remove comparison mode - shader is using regular texture() calls
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);

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

        // Check framebuffer status
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            console.error('Framebuffer not complete:', status);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    bind(gl: WebGL2RenderingContext) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.viewport(0, 0, this.size, this.size);
        
        // Clear depth buffer
        gl.clear(gl.DEPTH_BUFFER_BIT);
        
        // Set up depth test - important for proper shadow maps
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);
        gl.depthMask(true);
    }

    bindDepthTexture(gl: WebGL2RenderingContext, textureUnit: number) {
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
    }

    getDepthTexture(): WebGLTexture {
        return this.depthTexture;
    }

    getSize(): number {
        return this.size;
    }
} 