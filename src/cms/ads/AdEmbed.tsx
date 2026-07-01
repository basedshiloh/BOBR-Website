"use client";

import { useEffect, useRef } from "react";

// Injects an ad-network / Google Ads embed and (re)executes any <script> tags it
// contains — React does not run scripts set via innerHTML, so we recreate them.
// Only admins (service role) can author this HTML, so it is trusted content.
export default function AdEmbed({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.innerHTML = html;
    const scripts = Array.from(host.querySelectorAll("script"));
    for (const old of scripts) {
      const s = document.createElement("script");
      for (const attr of Array.from(old.attributes)) {
        s.setAttribute(attr.name, attr.value);
      }
      s.text = old.textContent ?? "";
      old.replaceWith(s);
    }
  }, [html]);

  return <div ref={ref} />;
}
