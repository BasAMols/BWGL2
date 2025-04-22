import { glob } from '../../game';
import { UrlUtils } from '../util/urlUtils';

export class EnvironmentMap {
    private cubemapTexture: WebGLTexture;
    private irradianceTexture: WebGLTexture;
    private prefilterTexture: WebGLTexture;
    private brdfLUTTexture: WebGLTexture;

    constructor() {
        const gl = glob.ctx;
        
        // Create cubemap texture
        this.cubemapTexture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubemapTexture);
        
        // Initialize each face with a placeholder
        const faces = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
        ];

        faces.forEach(face => {
            // Use RGBA8 format which supports mipmaps
            gl.texImage2D(face, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
        });

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

        // Create irradiance map texture (for diffuse IBL)
        this.irradianceTexture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.irradianceTexture);
        faces.forEach(face => {
            gl.texImage2D(face, 0, gl.RGBA8, 32, 32, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        });
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

        // Create prefilter map texture (for specular IBL)
        this.prefilterTexture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.prefilterTexture);
        faces.forEach(face => {
            gl.texImage2D(face, 0, gl.RGBA8, 128, 128, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        });
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

        // Create BRDF LUT texture
        this.brdfLUTTexture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, this.brdfLUTTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    public async loadFromUrls(urls: string[]) {
        if (urls.length !== 6) {
            throw new Error('Environment map requires exactly 6 image URLs for the cubemap faces');
        }

        const gl = glob.ctx;
        const faces = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
        ];

        // Load all images
        const imagePromises = urls.map(url => {
            return new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = url;
            });
        });

        try {
            const images = await Promise.all(imagePromises);

            // Upload images to cubemap
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubemapTexture);
            images.forEach((image, i) => {
                gl.texImage2D(faces[i], 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, image);
            });

            // Generate mipmaps after all faces are loaded
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

            // TODO: Generate irradiance map and prefiltered environment map
            // This requires additional render passes and shaders
            // Will be implemented in the next step
        } catch (error) {
            console.error('Failed to load environment map images:', error);
            throw error;
        }
    }

    public bind(unit: number = 0) {
        const gl = glob.ctx;
        
        // Bind environment map
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubemapTexture);
        
        // Bind irradiance map
        gl.activeTexture(gl.TEXTURE0 + unit + 1);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.irradianceTexture);
        
        // Bind prefilter map
        gl.activeTexture(gl.TEXTURE0 + unit + 2);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.prefilterTexture);
        
        // Bind BRDF LUT
        gl.activeTexture(gl.TEXTURE0 + unit + 3);
        gl.bindTexture(gl.TEXTURE_2D, this.brdfLUTTexture);
    }

    /**
     * Binds only the main cubemap texture (for skybox)
     * @param unit The texture unit to bind to
     */
    public bindCubemap(unit: number = 0) {
        const gl = glob.ctx;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubemapTexture);
    }
} 


export interface EnvironmentMapUrls {
    positiveX: string;
    negativeX: string;
    positiveY: string;
    negativeY: string;
    positiveZ: string;
    negativeZ: string;
}

export class EnvironmentMapLoader {
    public static async loadFromUrls(urls: EnvironmentMapUrls): Promise<EnvironmentMap> {
        const envMap = new EnvironmentMap();
        
        // Convert the URLs object to an array in the correct order
        // and resolve relative URLs using UrlUtils
        const urlArray = [
            UrlUtils.resolveUrl(urls.positiveX),
            UrlUtils.resolveUrl(urls.negativeX),
            UrlUtils.resolveUrl(urls.positiveY),
            UrlUtils.resolveUrl(urls.negativeY),
            UrlUtils.resolveUrl(urls.positiveZ),
            UrlUtils.resolveUrl(urls.negativeZ)
        ];

        await envMap.loadFromUrls(urlArray);
        return envMap;
    }

    public static async loadFromDirectory(baseUrl: string, format: string = 'png'): Promise<EnvironmentMap> {
        // Resolve the baseUrl using UrlUtils
        const fullBaseUrl = UrlUtils.resolveUrl(baseUrl);
        
        return this.loadFromUrls({
            positiveX: `${fullBaseUrl}/px.${format}`,
            negativeX: `${fullBaseUrl}/nx.${format}`,
            positiveY: `${fullBaseUrl}/py.${format}`,
            negativeY: `${fullBaseUrl}/ny.${format}`,
            positiveZ: `${fullBaseUrl}/pz.${format}`,
            negativeZ: `${fullBaseUrl}/nz.${format}`
        });
    }
}