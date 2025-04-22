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
        
        // Otherwise, build from the current location
        const location = window.location;
        return `${location.protocol}//${location.host}${location.pathname.replace(/\/[^/]*$/, '/')}`;
    }

    /**
     * Resolve a relative URL against the application's base URL
     * @param url The URL to resolve
     * @returns The fully resolved URL
     */
    public static resolveUrl(url: string): string {
        return new URL(url, this.getBaseUrl()).href;
    }
} 