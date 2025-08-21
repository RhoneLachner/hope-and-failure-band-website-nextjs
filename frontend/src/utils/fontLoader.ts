// Font loading utility for better performance and FOUT prevention

interface FontLoadOptions {
    family: string;
    weight?: string;
    style?: string;
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
}

class FontLoader {
    private loadedFonts = new Set<string>();
    private loadingPromises = new Map<string, Promise<void>>();

    async loadFont(options: FontLoadOptions): Promise<void> {
        const fontKey = `${options.family}-${options.weight || '400'}-${
            options.style || 'normal'
        }`;

        // Return if already loaded
        if (this.loadedFonts.has(fontKey)) {
            return Promise.resolve();
        }

        // Return existing promise if currently loading
        if (this.loadingPromises.has(fontKey)) {
            return this.loadingPromises.get(fontKey)!;
        }

        // Create new loading promise
        const loadingPromise = this.loadFontInternal(options, fontKey);
        this.loadingPromises.set(fontKey, loadingPromise);

        try {
            await loadingPromise;
            this.loadedFonts.add(fontKey);
        } finally {
            this.loadingPromises.delete(fontKey);
        }
    }

    private async loadFontInternal(
        options: FontLoadOptions,
        fontKey: string
    ): Promise<void> {
        // Use CSS Font Loading API if available
        if ('fonts' in document) {
            try {
                const fontFace = new FontFace(
                    options.family,
                    `url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2)`,
                    {
                        weight: options.weight || '400',
                        style: options.style || 'normal',
                        display: options.display || 'swap',
                    }
                );

                await fontFace.load();
                document.fonts.add(fontFace);

                // Add loaded class to document
                document.documentElement.classList.add('fonts-loaded');
                return;
            } catch (error) {
                console.warn(`Failed to load font ${fontKey}:`, error);
            }
        }

        // Fallback: Check if font is available
        await this.checkFontAvailability(options.family);
    }

    private checkFontAvailability(fontFamily: string): Promise<void> {
        return new Promise((resolve) => {
            const testString =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            const fallbackFont = 'Arial, sans-serif';
            const testFont = `"${fontFamily}", ${fallbackFont}`;

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;

            // Measure text with fallback font
            context.font = `12px ${fallbackFont}`;
            const fallbackWidth = context.measureText(testString).width;

            // Measure text with target font
            context.font = `12px ${testFont}`;
            const targetWidth = context.measureText(testString).width;

            // Font is loaded if widths differ
            if (fallbackWidth !== targetWidth) {
                document.documentElement.classList.add('fonts-loaded');
                resolve();
            } else {
                // Check again after a delay
                setTimeout(() => {
                    context.font = `12px ${testFont}`;
                    const newWidth = context.measureText(testString).width;
                    if (fallbackWidth !== newWidth) {
                        document.documentElement.classList.add('fonts-loaded');
                    }
                    resolve();
                }, 100);
            }
        });
    }

    // Preload critical font weights
    async preloadCriticalFonts(): Promise<void> {
        const criticalFonts: FontLoadOptions[] = [
            { family: 'Inter', weight: '300' }, // Light for headings
            { family: 'Inter', weight: '400' }, // Regular for body
            { family: 'Inter', weight: '500' }, // Medium for emphasis
        ];

        const loadPromises = criticalFonts.map((font) => this.loadFont(font));

        try {
            await Promise.allSettled(loadPromises);
        } catch (error) {
            console.warn('Some fonts failed to preload:', error);
        }
    }

    // Check if a font is loaded
    isFontLoaded(
        family: string,
        weight: string = '400',
        style: string = 'normal'
    ): boolean {
        const fontKey = `${family}-${weight}-${style}`;
        return this.loadedFonts.has(fontKey);
    }

    // Get loaded fonts list
    getLoadedFonts(): string[] {
        return Array.from(this.loadedFonts);
    }
}

// Export singleton instance
export const fontLoader = new FontLoader();

// Auto-preload critical fonts when module loads
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready but don't delay too much
    const loadFonts = () => {
        // Use requestIdleCallback to avoid blocking initial render
        if ('requestIdleCallback' in window) {
            requestIdleCallback(
                () => {
                    fontLoader.preloadCriticalFonts();
                },
                { timeout: 2000 }
            );
        } else {
            setTimeout(() => {
                fontLoader.preloadCriticalFonts();
            }, 100);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFonts);
    } else {
        loadFonts();
    }
}

export default FontLoader;
