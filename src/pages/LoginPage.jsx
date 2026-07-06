import { useState } from "react";
import { gs } from "../styles/sharedStyles";
import { USERS } from "../data/users";

export default function LoginPage({ onLogin, dark }) {
  const s = gs(dark);
  const [form,setForm]=useState({phone:"",password:""});
  const [msg,setMsg]=useState("");
  const [loading,setLoading]=useState(false);

  const login=()=>{
    setLoading(true);setMsg("");
    setTimeout(()=>{
      const user=USERS.find(u=>u.phone===form.phone&&u.password===form.password);
      if(user){onLogin(user);}
      else setMsg("ভুল নম্বর বা পাসওয়ার্ড");
      setLoading(false);
    },600);
  };

  const demoAccounts=[
    { label:"🛡️ Admin",      phone:"01700000000", password:"admin123"   },
    { label:"👨‍🌾 কৃষক ১",   phone:"01811111111", password:"farmer123"  },
    { label:"👩‍🌾 কৃষক ২",   phone:"01822222222", password:"farmer456"  },
    { label:"🛒 গ্রাহক",     phone:"01900000000", password:"user123"    },
    { label:"🧑‍✈️ কুরিয়ার ১", phone:"01912345678", password:"courier123" },
    { label:"👩‍✈️ কুরিয়ার ২", phone:"01823456789", password:"courier456" },
  ];

  return(
    <div style={{ ...s.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:`linear-gradient(135deg,${C.soil},${C.leaf})` }}>
      <div style={{ background:dark?C.darkCard:C.white,borderRadius:6,padding:36,width:400,boxShadow:"0 4px 24px rgba(15,23,42,0.18)",border:`1px solid ${dark?C.darkBorder:"#E8E5F9"}` }}>
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ width:48,height:48,background:C.leaf,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",color:C.white,fontSize:20,fontWeight:800 }}>KB</div>
          <div style={{ fontSize:22,fontWeight:800,color:dark?"#E8E5F9":C.soil,letterSpacing:"-0.3px" }}>কৃষিবাজার</div>
          <div style={{ color:C.muted,fontSize:12.5,marginTop:2,textTransform:"uppercase",letterSpacing:"0.4px" }}>সম্পূর্ণ প্ল্যাটফর্ম</div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={s.label}>মোবাইল নম্বর</label>
          <input type="tel" style={s.input} value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="01XXXXXXXXX" />
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={s.label}>পাসওয়ার্ড</label>
          <input type="password" style={s.input} value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="••••••••" />
        </div>
        <button style={{ ...s.btn(C.leaf),width:"100%",padding:13,fontSize:15,marginBottom:14 }} onClick={login} disabled={loading}>{loading?"অপেক্ষা করুন...":"লগইন করুন →"}</button>
        {msg&&<div style={{ background:"#f8d7da",color:"#721c24",padding:"10px 14px",borderRadius:4,fontSize:13,marginBottom:14 }}>{msg}</div>}
        <div style={{ background:dark?"#160F2E":C.offwhite,borderRadius:6,padding:16 }}>
          <div style={{ fontSize:12,fontWeight:700,color:C.muted,marginBottom:10 }}>⚡ Demo অ্যাকাউন্ট</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:7 }}>
            {demoAccounts.map(acc=>(
              <button key={acc.phone} onClick={()=>setForm({phone:acc.phone,password:acc.password})}
                style={{ background:dark?"#3D3470":C.white,border:`1px solid ${dark?C.darkBorder:"#D6D2F0"}`,borderRadius:4,padding:"8px 10px",cursor:"pointer",fontSize:11,fontWeight:600,color:dark?C.white:C.soil,textAlign:"left" }}>
                {acc.label}<div style={{ fontSize:10,color:C.muted,fontWeight:400 }}>{acc.phone}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
