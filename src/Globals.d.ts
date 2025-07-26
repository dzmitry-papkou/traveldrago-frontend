declare module '*.module.css';
declare module '*.module.scss';
declare global {
    var TextDecoder: typeof import('util').TextDecoder;
    var TextEncoder: typeof import('util').TextEncoder;
}
