import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

let cachedHtml: string | null = null;

function getHtml(): string {
  if (process.env.NODE_ENV === "production" && cachedHtml) {
    return cachedHtml;
  }
  const filePath = path.join(process.cwd(), "public", "framer-home.html");
  cachedHtml = fs.readFileSync(filePath, "utf-8");
  return cachedHtml;
}

export async function GET() {
  try {
    const html = getHtml();
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("Error serving Framer homepage:", err);
    return new NextResponse("Failed to load homepage", { status: 500 });
  }
}
