import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { stringify } from 'csv-stringify/sync';
export async function GET(req: Request) {
  const url = new URL(req.url);
  const filters: any = {};
  const city = url.searchParams.get('city');
  const propertyType = url.searchParams.get('propertyType');
  const status = url.searchParams.get('status');
  const q = url.searchParams.get('q');
  const where: any = {};
  if (city) where.city = city;
  if (propertyType) where.propertyType = propertyType;
  if (status) where.status = status;
  if (q) where.OR = [{ fullName: { contains: q, mode: 'insensitive' } }, { phone: { contains: q } }, { email: { contains: q, mode: 'insensitive' } }];
  const buyers = await prisma.buyer.findMany({ where, orderBy: { updatedAt: 'desc' }});
  const records = buyers.map(b => ({
    fullName: b.fullName,
    email: b.email ?? '',
    phone: b.phone,
    city: b.city,
    propertyType: b.propertyType,
    bhk: b.bhk ?? '',
    purpose: b.purpose,
    budgetMin: b.budgetMin ?? '',
    budgetMax: b.budgetMax ?? '',
    timeline: b.timeline,
    source: b.source,
    notes: b.notes ?? '',
    tags: (b.tags||[]).join('|'),
    status: b.status
  }));
  const csv = stringify(records, { header: true });
  const res = new NextResponse(csv);
  res.headers.set('Content-Type','text/csv');
  res.headers.set('Content-Disposition','attachment; filename="buyers.csv"');
  return res;
}
