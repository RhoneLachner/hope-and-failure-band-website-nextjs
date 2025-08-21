/// <reference types="vite/client" />

// Declare SASS/SCSS modules
declare module '*.sass' {
    const content: Record<string, string>;
    export default content;
}

declare module '*.scss' {
    const content: Record<string, string>;
    export default content;
}
