import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: searchParams.get("code"),
    redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
  });
  const basicAuth = Buffer.from(
    `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: body.toString(),
    });
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error_description);
    }

    const res = NextResponse.redirect(searchParams.get("state") || "/");

    cookies().set("spotify_token", json.access_token, {
      secure: process.env.NODE_ENV === "production",
      maxAge: json.expires_in,
      sameSite: "strict",
    });

    cookies().set("spotify_refresh_token", json.refresh_token, {
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30 * 6, // 6 months
      sameSite: "strict",
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
