import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import Papa from 'papaparse';
import { buyerCreateSchema } from '@/src/lib/validators';
export async function POST(req: Request) {
  const userId = req.cookies.get('userId')?.value;
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const text = await req.text();
  const parsed = Papa.parse(text, { header: true });
  const rows = parsed.data.slice(0, 200);
  const errors = [];
  const toInsert = [];
  for (let i=0;i<rows.length;i++) {
    const r = rows[i];
    const payload = {
      fullName: r.fullName,
      email: r.email || undefined,
      phone: r.phone,
      city: r.city,
      propertyType: r.propertyType,
      bhk: r.bhk || undefined,
      purpose: r.purpose,
      budgetMin: r.budgetMin ? Number(r.budgetMin) : undefined,
      budgetMax: r.budgetMax ? Number(r.budgetMax) : undefined,
      timeline: r.timeline,
      source: r.source,
      notes: r.notes || undefined,
      tags: r.tags ? r.tags.split('|').map((s:string)=>s.trim()).filter(Boolean) : []
    };
    const v = buyerCreateSchema.safeParse(payload);
    if (!v.success) errors.push({ row: i+1, errors: v.error.errors.map(e=>e.message).join('; ') });
    else toInsert.push(v.data);
  }
  if (errors.length) return NextResponse.json({ errors }, { status: 400 });
  const created = [];
  const result = await prisma.$transaction(async (prismaTx)=> {
    for (const item of toInsert) {
      const b = await prismaTx.buyer.create({ data: {
        fullName: item.fullName,
        email: item.email ?? null,
        phone: item.phone,
        city: item.city,
        propertyType: item.propertyType,
        bhk: item.bhk ?? null,
        purpose: item.purpose,
        budgetMin: item.budgetMin ?? null,
        budgetMax: item.budgetMax ?? null,
        timeline: item.timeline,
        source: item.source,
        notes: item.notes ?? null,
        tags: item.tags ?? [],
        ownerId: userId
      }});
      await prismaTx.buyerHistory.create({ data: { buyerId: b.id, changedBy: userId, diff: { created: true } }});
      created.push(b);
    }
    return created;
  });
  return NextResponse.json({ created: result });
}
