import { NextResponse } from "next/server";

import { sendLead } from "@/lib/lead/send";
import type { LeadPayload } from "@/lib/lead/types";

export const runtime = "nodejs";

const bad = (message: string, status = 400) => NextResponse.json({ ok: false, message }, { status });

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const honeypot = String(form.get("company") || "");
    if (honeypot.trim().length > 0) return bad("Spam detected", 429);

    const phone = String(form.get("phone") || "").trim();
    const context = String(form.get("context") || "").trim();
    if (!phone || !context) return bad("phone and context are required");

    const payload: LeadPayload = {
      name: String(form.get("name") || "").trim(),
      phone,
      context,
      service: String(form.get("service") || "").trim(),
      page: String(form.get("page") || "").trim(),
      source: String(form.get("source") || "direct").trim(),
      referrer: String(form.get("referrer") || "").trim(),
      utm_source: String(form.get("utm_source") || "").trim(),
      utm_campaign: String(form.get("utm_campaign") || "").trim(),
      utm_term: String(form.get("utm_term") || "").trim(),
      utm_content: String(form.get("utm_content") || "").trim(),
      submittedAt: new Date().toISOString()
    };

    const maybeFile = form.get("file");
    const file = maybeFile instanceof File && maybeFile.size > 0 ? maybeFile : undefined;

    await sendLead(payload, file);
    return NextResponse.json({ ok: true });
  } catch {
    return bad("Internal error", 500);
  }
}

