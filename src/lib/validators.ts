import { z } from 'zod';
const cityEnum = z.enum(['Chandigarh','Mohali','Zirakpur','Panchkula','Other']);
const propertyEnum = z.enum(['Apartment','Villa','Plot','Office','Retail']);
const bhkEnum = z.enum(['1','2','3','4','Studio']);
const purposeEnum = z.enum(['Buy','Rent']);
const timelineEnum = z.enum(['0-3m','3-6m','>6m','Exploring']);
const sourceEnum = z.enum(['Website','Referral','Walk-in','Call','Other']);
const statusEnum = z.enum(['New','Qualified','Contacted','Visited','Negotiation','Converted','Dropped']);
export const buyerCreateSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\d{10,15}$/),
  city: cityEnum,
  propertyType: propertyEnum,
  bhk: z.union([bhkEnum, z.undefined(), z.null()]),
  purpose: purposeEnum,
  budgetMin: z.number().int().positive().optional().nullable(),
  budgetMax: z.number().int().positive().optional().nullable(),
  timeline: timelineEnum,
  source: sourceEnum,
  notes: z.string().max(1000).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  status: statusEnum.optional()
}).superRefine((data, ctx) => {
  if (data.budgetMin != null && data.budgetMax != null && data.budgetMax < data.budgetMin) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'budgetMax must be >= budgetMin', path: ['budgetMax'] });
  }
  if (['Apartment','Villa'].includes(data.propertyType)) {
    if (!data.bhk) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'bhk required for Apartment/Villa', path: ['bhk'] });
  }
});
export type BuyerCreate = z.infer<typeof buyerCreateSchema>;
