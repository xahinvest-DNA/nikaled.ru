import { NextResponse } from "next/server";

import { sendLead } from "@/lib/lead/send";
import type { LeadPayload } from "@/lib/lead/types";
import { buildDailyReportText } from "@/lib/reporting/daily-report";
import { DAILY_REPORT_LEAD_SOURCE } from "@/lib/reporting/lead-events";

export const runtime = "nodejs";

const unauthorized = () => NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
const disabled = () => NextResponse.json({ ok: false, message: "Disabled" }, { status: 404 });

export async function POST(request: Request) {
  const isEnabled = (process.env.DAILY_REPORT_ENABLED?.trim().toLowerCase() || "false") === "true";
  const token = process.env.DAILY_REPORT_TOKEN?.trim() || "";
  const providedToken = request.headers.get("x-internal-report-token")?.trim() || "";

  if (!isEnabled) {
    return disabled();
  }

  if (!token || providedToken !== token) {
    return unauthorized();
  }

  const url = new URL(request.url);
  const date = url.searchParams.get("date")?.trim() || undefined;

  try {
    const report = await buildDailyReportText(date);
    const payload: LeadPayload = {
      phone: "-",
      context: report.text,
      page: "/api/internal/daily-report",
      source: DAILY_REPORT_LEAD_SOURCE,
      submittedAt: new Date().toISOString()
    };

    await sendLead(payload);

    return NextResponse.json({
      ok: true,
      dateKey: report.dateKey,
      total: report.total
    });
  } catch (error) {
    console.error("Daily report error:", error);
    return NextResponse.json({ ok: false, message: "Internal error" }, { status: 500 });
  }
}
