// pages/api/login.ts
import axios from "axios";
import { serialize } from "cookie";

export default async function handler(req, res) {
  const { email, password } = req.body;

  const { data } = await axios.post(
    process.env.BACKEND_URL + "/auth/jwt/",
    { email, password }
  );

  // 1.  httpOnly → JS can’t read it, XSS-safe
  // 2.  SameSite=lax prevents CSRF in most cases
  res.setHeader("Set-Cookie", [
    serialize("access", data.access,  { httpOnly: true, sameSite: "lax", path: "/" }),
    serialize("refresh", data.refresh,{ httpOnly: true, sameSite: "lax", path: "/" }),
  ]);

  res.status(200).json({ ok: true });
}
