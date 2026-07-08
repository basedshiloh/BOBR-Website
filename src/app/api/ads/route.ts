export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { isValidToken, SESSION_COOKIE } from "@/cms/server";
import { listAdsAdmin, saveAd, deleteAd, setAdActive, type AdInput } from "@/cms/ads/ads-server";

function cookieAuthed(req: NextRequest): boolean {
  return isValidToken(req.cookies.get(SESSION_COOKIE)?.value);
}

export async function POST(req: NextRequest) {
  if (!cookieAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { action } = body;

  if (action === "list") {
    return NextResponse.json({ ads: await listAdsAdmin() });
  }

  if (action === "save") {
    const result = await saveAd(body.ad as AdInput);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    const result = await deleteAd(String(body.id));
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "toggle") {
    const result = await setAdActive(String(body.id), body.active === true);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
