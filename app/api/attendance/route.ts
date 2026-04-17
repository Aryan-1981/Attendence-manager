import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getSupabaseAdmin() {
  // Lazy import to keep edge bundling clean.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");

  const url = process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceRole, {
    auth: { persistSession: false },
  });
}

export async function POST(req: Request) {
  try {
    const secret = req.headers.get("x-device-secret") || "";
    const expected = process.env.DEVICE_SHARED_SECRET || "";

    if (!expected || secret !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as any;
    const name = String(body?.name || "").trim();
    const device_id = String(body?.device_id || "amb82-mini").trim();

    if (!name || name.toLowerCase() === "unknown") {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("attendence")
      .insert({ name, day: today, device_id });

    if (error) {
      // Duplicate key should not make the device retry storm.
      const msg = String((error as any).message || "").toLowerCase();
      if (String((error as any).code) === "23505" || msg.includes("duplicate")) {
        return NextResponse.json({ ok: true, duplicate: true });
      }
      return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 200), 1), 1000);

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("attendence")
      .select("id,name,day,device_id,created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
