import React from 'react';
async function getData(searchParams: any) {
  const q = new URLSearchParams(searchParams).toString();
  const res = await fetch('http://localhost:3000/api/buyers?'+q);
  return res.json();
}
export default async function BuyersPage({ searchParams }: any) {
  const data = await getData(searchParams);
  return (<main style={{padding:20}}>
    <h2>Buyers</h2>
    <p><a href="/buyers/new">Create new</a></p>
    <table border={1} cellPadding={6}>
      <thead><tr><th>Name</th><th>Phone</th><th>City</th><th>Property</th><th>Budget</th><th>Timeline</th><th>Status</th><th>UpdatedAt</th><th>Action</th></tr></thead>
      <tbody>{data.buyers.map((b:any)=>(<tr key={b.id}><td>{b.fullName}</td><td>{b.phone}</td><td>{b.city}</td><td>{b.propertyType}</td><td>{b.budgetMin||''} - {b.budgetMax||''}</td><td>{b.timeline}</td><td>{b.status}</td><td>{new Date(b.updatedAt).toLocaleString()}</td><td><a href={'/buyers/'+b.id}>View</a></td></tr>))}</tbody>
    </table>
  </main>);
}
