export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { auth } from "@/auth";

const BACKEND_BASE = (process.env.AUTH_BACKEND_URL || "http://localhost:4000").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.PROXY_TIMEOUT_MS || 15_000);

const STRIP_REQ_HEADERS = new Set(["connection","content-length","host","accept-encoding","cookie"]);
const PASS_RES_HEADERS  = new Set(["content-type","content-length","cache-control","etag","last-modified","location"]);

function buildBackendUrl(req, segs) {
  const pathname = "/" + (Array.isArray(segs) ? segs.join("/") : "");
  const search = req.nextUrl.search || "";
  return BACKEND_BASE + pathname + search;
}
function filterRequestHeaders(reqHeaders) {
  const out = new Headers();
  for (const [k, v] of reqHeaders.entries()) {
    if (!STRIP_REQ_HEADERS.has(k.toLowerCase())) out.set(k, v);
  }
  return out;
}
function copyResponseHeaders(from, to) {
  for (const [k, v] of from.entries()) {
    if (PASS_RES_HEADERS.has(k.toLowerCase())) to.set(k, v);
  }
}

async function forward(req, { params }) {
  const session = await auth(); // <- triggers jwt() refresh when needed
  if (!session?.accessToken) return new NextResponse("Unauthorized", { status: 401 });

  const url = buildBackendUrl(req, params?.path);
  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);

  const headers = filterRequestHeaders(req.headers);
  headers.set("Authorization", `Bearer ${session.accessToken}`);

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let fres;
  try {
    fres = await fetch(url, {
      method,
      headers,
      cache: "no-store",
      redirect: "manual",
      signal: controller.signal,
      ...(hasBody ? { body: req.body, duplex: "half" } : null),
    });
  } catch (e) {
    clearTimeout(t);
    return NextResponse.json(
      { error: "UpstreamError", message: String(e) },
      { status: 502 }
    );
  } finally {
    clearTimeout(t);
  }

  const resHeaders = new Headers();
  copyResponseHeaders(fres.headers, resHeaders);
  return new NextResponse(fres.body, { status: fres.status, headers: resHeaders });
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
export const HEAD = forward;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*", // tighten as needed
      "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
      "access-control-allow-headers": "content-type,authorization",
      "access-control-max-age": "600",
    },
  });
}