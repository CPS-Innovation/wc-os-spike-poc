export {};

declare global {
  interface Window {
    acquireAccessToken: () => Promise<string | null>;
  }
}