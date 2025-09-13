import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { buyerCreateSchema } from '@/src/lib/validators';
export async function GET(req: Request, { params }: any) {
  const id = params.id;
  const buyer = await prisma.buyer.findUnique({ where: { id }, include: { histories: { orderBy: { changedAt: 'desc' }, take: 5 } }});
  if (!buyer) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(buyer);
}
export async function PATCH(req: Request, { params }: any) {
  const userId = req.cookies.get('userId')?.value;
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const id = params.id;
  const body = await req.json();
  const parsed = buyerCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const existing = await prisma.buyer.findUnique({ where: { id }});
  if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (existing.ownerId !== userId) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (body.updatedAt && new Date(body.updatedAt).getTime() !== existing.updatedAt.getTime()) {
    return NextResponse.json({ error: 'stale' }, { status: 409 });
  }
  const data = parsed.data;
  const updated = await prisma.buyer.update({ where: { id }, data: {
    fullName: data.fullName,
    email: data.email ?? null,
    phone: data.phone,
    city: data.city,
    propertyType: data.propertyType,
    bhk: data.bhk ?? null,
    purpose: data.purpose,
    budgetMin: data.budgetMin ?? null,
    budgetMax: data.budgetMax ?? null,
    timeline: data.timeline,
    source: data.source,
    notes: data.notes ?? null,
    tags: data.tags ?? []
  }});
  await prisma.buyerHistory.create({ data: { buyerId: id, changedBy: userId, diff: { before: existing, after: updated } }});
  return NextResponse.json(updated);
}
export async function DELETE(req: Request, { params }: any) {
  const userId = req.cookies.get('userId')?.value;
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const id = params.id;
  const existing = await prisma.buyer.findUnique({ where: { id }});
  if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (existing.ownerId !== userId) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  await prisma.buyer.delete({ where: { id }});
  return NextResponse.json({ ok: true });
}
