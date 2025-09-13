import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { buyerCreateSchema } from '@/src/lib/validators';
export async function POST(req: Request) {
  const userId = req.cookies.get('userId')?.value;
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const body = await req.json();
  const parsed = buyerCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const buyer = await prisma.buyer.create({ data: {
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    city: data.city.replace('-', '_') as any,
    propertyType: data.propertyType as any,
    bhk: data.bhk ? (data.bhk === '1' ? 'One' : data.bhk === '2' ? 'Two' : data.bhk === '3' ? 'Three' : data.bhk === '4' ? 'Four' : 'Studio') : null,
    purpose: data.purpose as any,
    budgetMin: data.budgetMin ?? null,
    budgetMax: data.budgetMax ?? null,
    timeline: data.timeline === '0-3m' ? '_0_3m' : data.timeline === '3-6m' ? '_3_6m' : data.timeline === '>6m' ? '_gt_6m' : 'Exploring',
    source: data.source.replace('-', '_') as any,
    notes: data.notes ?? null,
    tags: data.tags ?? [],
    ownerId: userId
  }});
  await prisma.buyerHistory.create({ data: { buyerId: buyer.id, changedBy: userId, diff: { created: true } }});
  return NextResponse.json(buyer);
}
export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page') || '1');
  const pageSize = 10;
  const filters: any = {};
  const city = url.searchParams.get('city');
  const propertyType = url.searchParams.get('propertyType');
  const status = url.searchParams.get('status');
  const timeline = url.searchParams.get('timeline');
  if (city) filters.city = city;
  if (propertyType) filters.propertyType = propertyType;
  if (status) filters.status = status;
  if (timeline) {
    filters.timeline = timeline === '0-3m' ? '_0_3m' : timeline === '3-6m' ? '_3_6m' : timeline === '>6m' ? '_gt_6m' : 'Exploring';
  }
  const search = url.searchParams.get('q');
  const where: any = {};
  if (Object.keys(filters).length) Object.assign(where, filters);
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }
  const total = await prisma.buyer.count({ where });
  const buyers = await prisma.buyer.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    skip: (page-1)*pageSize,
    take: pageSize
  });
  return NextResponse.json({ buyers, total, page, pageSize });
}
