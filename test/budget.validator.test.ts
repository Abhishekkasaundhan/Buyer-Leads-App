import { buyerCreateSchema } from '../src/lib/validators';
test('budgetMax must be >= budgetMin', ()=> {
  const res = buyerCreateSchema.safeParse({ fullName:'Ab', phone:'1234567890', city:'Chandigarh', propertyType:'Plot', purpose:'Buy', timeline:'Exploring', source:'Website', budgetMin:100, budgetMax:50 });
  expect(res.success).toBe(false);
});
