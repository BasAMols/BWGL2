export class ShadowMap {
    private framebuffer: WebGLFramebuffer;
    private depthTexture: WebGLTexture;
    private size: number;

    constructor(gl: WebGL2RenderingContext, size: number = 2048) {
        this.size = size;
        
        // Create depth texture with high precision format
        this.depthTexture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.DEPTH_COMPONENT24,  // Use 24-bit depth for better precision
            size,
            size,
            0,
            gl.DEPTH_COMPONENT,
            gl.UNSIGNED_INT,       // Use unsigned int format for wider range
            null
        );
        
        // Use NEAREST filtering for more precise depth values
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
        // Use CLAMP_TO_EDGE to avoid sampling outside shadow map
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
        
        // Clear depth buffer with maximum depth
        gl.clearDepth(1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        
        // Set up depth test - important for proper shadow maps
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);
        gl.depthMask(true);
        
        // Important: When rendering shadows, disable color writing
        // We only want to write to the depth buffer
        gl.colorMask(false, false, false, false);
    }

    unbind(gl: WebGL2RenderingContext) {
        // Re-enable color writing when we're done with shadow map
        gl.colorMask(true, true, true, true);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
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