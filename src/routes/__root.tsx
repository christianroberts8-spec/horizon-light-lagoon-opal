import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "REMAP";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Paint borders and export genuine Ages of Conflict Mobile .aoc scenarios.",
      },
      { name: "theme-color", content: "#0c0d0f" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function show(){if(document.getElementById("mod-fail"))return;var d=document.createElement("div");d.id="mod-fail";d.setAttribute("role","alert");d.style.cssText="position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:#0c0d0f;color:#ece8e1;font-family:sans-serif;padding:24px;text-align:center";d.innerHTML='<div><p style="font-size:22px;margin:0 0 12px">Could not load the editor.</p><p style="opacity:.7;max-width:22rem">Tap reload, then open your map again.</p><button id="mod-fail-btn" style="margin-top:16px;min-height:48px;padding:0 20px;border:0;border-radius:10px;background:#e6b956;color:#19140a;font-weight:800">Reload</button></div>';document.body.appendChild(d);var b=document.getElementById("mod-fail-btn");if(b)b.onclick=function(){location.reload()};}window.addEventListener("error",function(e){var m=String((e&&e.message)||"");if(/module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module/i.test(m))show();},true);window.addEventListener("unhandledrejection",function(e){var m=String((e&&e.reason&&(e.reason.message||e.reason))||"");if(/module script failed|Failed to fetch dynamically imported module|Importing a module/i.test(m))show();});})();`,
          }}
        />
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
