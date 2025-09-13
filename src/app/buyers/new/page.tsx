'use client';
import React, { useState } from 'react';
import { z } from 'zod';
const schema = z.object({
  fullName: z.string().min(2).max(80),
  phone: z.string().regex(/^\d{10,15}$/),
  city: z.string(),
  propertyType: z.string(),
  purpose: z.string(),
  timeline: z.string(),
  source: z.string()
});
export default function NewBuyer() {
  const [form,setForm] = useState({});
  const [msg,setMsg] = useState('');
  const onChange = (e:any)=> setForm({...form,[e.target.name]: e.target.value});
  const submit = async ()=> {
    try {
      const res = await fetch('/api/buyers', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(form) });
      if (!res.ok) { setMsg('Error'); return; }
      setMsg('Created');
    } catch(e){ setMsg('Error'); }
  };
  return (<main style={{padding:20}}>
    <h2>Create Buyer</h2>
    <div style={{display:'grid',gap:8,maxWidth:600}}>
      <input name="fullName" placeholder="Full name" onChange={onChange}/>
      <input name="email" placeholder="Email" onChange={onChange}/>
      <input name="phone" placeholder="Phone" onChange={onChange}/>
      <select name="city" onChange={onChange}><option>Chandigarh</option><option>Mohali</option><option>Zirakpur</option><option>Panchkula</option><option>Other</option></select>
      <select name="propertyType" onChange={onChange}><option>Apartment</option><option>Villa</option><option>Plot</option><option>Office</option><option>Retail</option></select>
      <select name="purpose" onChange={onChange}><option>Buy</option><option>Rent</option></select>
      <select name="timeline" onChange={onChange}><option>0-3m</option><option>3-6m</option><option>>6m</option><option>Exploring</option></select>
      <select name="source" onChange={onChange}><option>Website</option><option>Referral</option><option>Walk-in</option><option>Call</option><option>Other</option></select>
      <button onClick={submit}>Create</button>
      <div>{msg}</div>
    </div>
  </main>);
}
