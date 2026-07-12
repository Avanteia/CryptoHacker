import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

function slugifyUsername(base: string) {
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 24) || "hacker"
  );
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_INPUT", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "EMAIL_TAKEN" }, { status: 409 });
  }

  const baseSlug = slugifyUsername(name);
  let username = baseSlug;
  let i = 0;
  while (await prisma.user.findUnique({ where: { username } })) {
    i += 1;
    username = `${baseSlug}${i}`;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const role = process.env.ADMIN_EMAIL === normalizedEmail ? "ADMIN" : "USER";

  const user = await prisma.user.create({
    data: { name, email: normalizedEmail, username, passwordHash, role },
  });

  await prisma.subscription.create({
    data: { userId: user.id, plan: "FREE", status: "NONE" },
  });

  return NextResponse.json({ id: user.id, username: user.username });
}
