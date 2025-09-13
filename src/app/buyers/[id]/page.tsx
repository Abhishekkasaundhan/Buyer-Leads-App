import React from 'react';
async function getBuyer(id:string) {
  const res = await fetch('http://localhost:3000/api/buyers/'+id);
  if (!res.ok) return null;
  return res.json();
}
export default async function BuyerPage({ params }: any) {
  const b = await getBuyer(params.id);
  if (!b) return (<main style={{padding:20}}>Not found</main>);
  return (<main style={{padding:20}}>
    <h2>{b.fullName}</h2>
    <pre>{JSON.stringify(b, null, 2)}</pre>
  </main>);
}
