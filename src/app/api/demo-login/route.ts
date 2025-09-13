import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('userId', userId, { httpOnly: true, path: '/' });
  return res;
}
