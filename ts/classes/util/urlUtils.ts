/**
 * Utilities for handling URLs in the application
 */
export class UrlUtils {
    /**
     * Gets the base URL for the application, considering base tags and current location
     */
    public static getBaseUrl(): string {
        // If we have a base tag, use that href
        const baseTag = document.querySelector('base');
        if (baseTag && baseTag.href) {
            return baseTag.href;
        }
        
        // Use the window.location.href but ensure it ends with a slash
        // This preserves the full path including any directories
        const href = window.location.href;
        // Remove any query parameters or hash
        const cleanHref = href.split(/[?#]/)[0];
        // Ensure the URL ends with a slash
        return cleanHref.endsWith('/') ? cleanHref : cleanHref.substring(0, cleanHref.lastIndexOf('/') + 1);
    }

    /**
     * Resolve a relative URL against the application's base URL
     * @param url The URL to resolve
     * @returns The fully resolved URL
     */
    public static resolveUrl(url: string): string {
        // Don't modify URLs that are already absolute
        if (url.match(/^(https?:)?\/\//)) {
            return url;
        }
        
        // For absolute paths starting with /, use the origin only
        if (url.startsWith('/')) {
            return new URL(url, window.location.origin).href;
        }
        
        // For relative paths, use the full base URL
        return new URL(url, this.getBaseUrl()).href;
    }
} 