// Cloudflare Turnstile bot check: the leads collector stores a submission only with a fresh token from it.
// Cloudflare shows its checkbox (bottom centre of the screen) only to visitors it suspects are bots.
const SITE_KEY = import.meta.env.DEV ? "1x00000000000000000000AA" : "0x4AAAAAAFwgEqf88mtunnwK"; // dev: Cloudflare's always-pass test key

type Turnstile = {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  remove(widgetId: string): void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let api: Promise<Turnstile> | undefined;

function loadTurnstile(): Promise<Turnstile> {
  api ??= new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing")));
    script.onerror = () => {
      api = undefined; // let the next submit retry the download
      reject(new Error("Turnstile failed to load"));
    };
    document.head.append(script);
  });
  return api;
}

/** A one-time Turnstile token, or "" if the check could not run (the collector then rejects the lead). */
export async function turnstileToken(): Promise<string> {
  const turnstile = await loadTurnstile().catch(() => null);
  if (!turnstile) return "";
  const box = document.createElement("div");
  box.style.cssText = "position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:2147483647";
  document.body.append(box);
  return new Promise((resolve) => {
    const finish = (token: string) => {
      setTimeout(() => {
        turnstile.remove(widgetId);
        box.remove();
      });
      resolve(token);
    };
    const widgetId = turnstile.render(box, {
      sitekey: SITE_KEY,
      appearance: "interaction-only",
      retry: "never",
      callback: finish,
      "error-callback": () => finish(""),
      "timeout-callback": () => finish(""),
    });
  });
}
