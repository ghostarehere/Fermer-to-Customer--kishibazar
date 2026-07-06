import { useState } from "react";
import { C } from "../styles/theme";
import { gs } from "../styles/sharedStyles";
import { CATS, STATUS_COLOR, STATUS_LABEL } from "../data/constants";
import MiniChart from "../components/MiniChart";

export default function FarmerPortal({ user, products, setProducts, orders, dark, setDark, onLogout }) {
  const s = gs(dark);
  const [page,setPage]=useState("home");
  const [showForm,setShowForm]=useState(false);
  const [editId,setEditId]=useState(null);
  const [form,setForm]=useState({name:"",nameEn:"",price:"",unit:"kg",category:"vegetables",stock:"",emoji:"🌿",organic:false,description:""});
  const [msg,setMsg]=useState("");

  const myProducts=products.filter(p=>p.farmerId===user.id);
  const myOrders=orders.filter(o=>o.items.some(i=>i.farmerId===user.id));
  const myRevenue=myOrders.filter(o=>o.status==="delivered").reduce((s,o)=>s+o.items.filter(i=>i.farmerId===user.id).reduce((ss,i)=>ss+i.price*i.qty,0),0);
  const pending=myOrders.filter(o=>o.status==="pending").length;

  const saveProduct=()=>{
    if(!form.name||!form.price)return;
    if(editId){
      setProducts(p=>p.map(pr=>pr.id===editId?{...pr,...form,price:+form.price,stock:+form.stock,organic:!!form.organic}:pr));
      setMsg("পণ্য আপডেট হয়েছে!");
    } else {
      const newP={...form,id:Date.now(),farmerId:user.id,rating:0,reviews:0,featured:false,active:true,sales:0,price:+form.price,stock:+form.stock,organic:!!form.organic};
      setProducts(p=>[...p,newP]);
      setMsg("নতুন পণ্য যোগ হয়েছে!");
    }
    setShowForm(false);setEditId(null);
    setForm({name:"",nameEn:"",price:"",unit:"kg",category:"vegetables",stock:"",emoji:"🌿",organic:false,description:""});
    setTimeout(()=>setMsg(""),3000);
  };

  const delProduct=(id)=>{if(confirm("মুছে ফেলবেন?"))setProducts(p=>p.filter(pr=>pr.id!==id))};
  const editProduct=(p)=>{setEditId(p.id);setForm({name:p.name,nameEn:p.nameEn||"",price:p.price,unit:p.unit,category:p.category,stock:p.stock,emoji:p.emoji,organic:p.organic,description:p.description||""});setShowForm(true)};
  const toggleActive=(id)=>setProducts(p=>p.map(pr=>pr.id===id?{...pr,active:!pr.active}:pr));

  const accentColor=C.leafLight;
  const navItems=[["home","🏠","ড্যাশবোর্ড"],["products","📦","আমার পণ্য"],["orders","🛒","অর্ডার"],["analytics","📊","বিশ্লেষণ"],["profile","👨‍🌾","প্রোফাইল"]];

  return(
    <div style={s.app}>
      <nav style={{ background:dark?C.darkCard:C.soil,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:9 }}>
          <div style={{ width:30,height:30,background:C.leafLight,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:12,fontWeight:800 }}>KB</div>
          <div><div style={{ fontWeight:700,color:"#E8E5F9",fontSize:15,lineHeight:1,letterSpacing:"-0.2px" }}>কৃষিবাজার</div><div style={{ fontSize:9.5,color:C.sprout }}>কৃষক ড্যাশবোর্ড</div></div>
        </div>
        <div style={{ display:"flex",gap:4 }}>
          {navItems.map(([p,icon,label])=>(
            <button key={p} onClick={()=>setPage(p)} style={{ background:page===p?C.leaf+"33":"transparent",color:page===p?C.sprout:C.muted,border:"none",padding:"6px 10px",borderRadius:4,cursor:"pointer",fontWeight:page===p?700:400,fontSize:12 }}>{icon} {label}</button>
          ))}
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ color:C.sprout,fontSize:12 }}>{user.emoji} {user.name}</span>
          <button onClick={()=>setDark(!dark)} style={{ background:"transparent",border:"none",fontSize:18,cursor:"pointer" }}>{dark?"☀️":"🌙"}</button>
          <button onClick={onLogout} style={{ background:"transparent",border:`1px solid #555`,color:C.muted,padding:"5px 12px",borderRadius:4,cursor:"pointer",fontSize:12 }}>লগআউট</button>
        </div>
      </nav>

      <div style={{ maxWidth:1100,margin:"0 auto",padding:"24px 20px" }}>
        {msg&&<div style={{ background:"#d4edda",color:"#155724",padding:"12px 16px",borderRadius:5,marginBottom:16,fontWeight:600 }}>✅ {msg}</div>}

        {/* HOME */}
        {page==="home"&&(
          <div>
            <div style={{ fontSize:20,fontWeight:800,marginBottom:20 }}>স্বাগতম, {user.name}! 👋</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24 }}>
              {[["📦",myProducts.length,"মোট পণ্য",C.leaf],["🛒",myOrders.length,"মোট অর্ডার",C.blue],["⏳",pending,"অপেক্ষমাণ",C.harvest],["💰","৳"+myRevenue.toLocaleString(),"মোট আয়",C.orange]].map(([icon,val,label,color])=>(
                <div key={label} style={s.statCard(color)}><div style={{ fontSize:28 }}>{icon}</div><div style={{ fontSize:22,fontWeight:900,color,marginTop:6 }}>{val}</div><div style={{ fontSize:11,color:C.muted,marginTop:4 }}>{label}</div></div>
              ))}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>📈 সাপ্তাহিক বিক্রয়</div>
                <MiniChart data={[8,14,10,18,22,16,25]} color={C.leaf} height={80}/>
                <div style={{ display:"flex",justifyContent:"space-between",marginTop:8 }}>
                  {["রবি","সোম","মঙ্গল","বুধ","বৃহ","শুক্র","শনি"].map(d=><div key={d} style={{ fontSize:10,color:C.muted }}>{d}</div>)}
                </div>
              </div>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>🛒 সাম্প্রতিক অর্ডার</div>
                {myOrders.slice(0,4).map(o=>(
                  <div key={o.id} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${dark?C.darkBorder:"#EDEBFA"}`,fontSize:13 }}>
                    <span style={{ fontWeight:700 }}>#{o.id}</span>
                    <span style={{ color:C.muted,fontSize:12 }}>{o.customerName}</span>
                    <span style={s.badge(STATUS_COLOR[o.status]||C.muted)}>{STATUS_LABEL[o.status]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {page==="products"&&(
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <div style={{ fontSize:20,fontWeight:800 }}>📦 আমার পণ্যসমূহ</div>
              <button style={s.btn()} onClick={()=>{setShowForm(true);setEditId(null);setForm({name:"",nameEn:"",price:"",unit:"kg",category:"vegetables",stock:"",emoji:"🌿",organic:false,description:""})}}>+ নতুন পণ্য যোগ করুন</button>
            </div>
            {showForm&&(
              <div style={{ ...s.card,background:dark?"#160F2E":"#F5F4FB",marginBottom:20 }}>
                <div style={{ fontWeight:700,marginBottom:14 }}>{editId?"পণ্য সম্পাদনা":"নতুন পণ্য যোগ করুন"}</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                  {[["পণ্যের নাম (বাংলা)","name","text"],["পণ্যের নাম (ইং)","nameEn","text"],["মূল্য (৳)","price","number"],["স্টক","stock","number"],["বিবরণ","description","text"]].map(([l,k,t])=>(
                    <div key={k}><label style={s.label}>{l}</label><input type={t} style={s.input} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/></div>
                  ))}
                  <div>
                    <label style={s.label}>ইউনিট</label>
                    <select style={s.input} value={form.unit} onChange={e=>setForm(p=>({...p,unit:e.target.value}))}>
                      {["kg","bundle","dozen","500g","litre","piece"].map(u=><option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={s.label}>ক্যাটাগরি</label>
                    <select style={s.input} value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                      {Object.entries(CATS).filter(([k])=>k!=="all").map(([k,v])=><option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={s.label}>ইমোজি</label>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                      {["🍅","🥬","🥔","🎃","🍯","🥚","🍌","🌶️","🥒","🧅","🧄","🥭","🍆","🌽","🫑"].map(e=>(
                        <button key={e} onClick={()=>setForm(p=>({...p,emoji:e}))} style={{ fontSize:20,background:form.emoji===e?C.leaf+"22":"transparent",border:form.emoji===e?`2px solid ${C.leaf}`:"2px solid transparent",borderRadius:4,padding:"3px 6px",cursor:"pointer" }}>{e}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <input type="checkbox" id="org" checked={form.organic} onChange={e=>setForm(p=>({...p,organic:e.target.checked}))}/>
                    <label htmlFor="org" style={{ fontWeight:600,color:C.leaf,cursor:"pointer" }}>🌿 অর্গানিক পণ্য</label>
                  </div>
                </div>
                <div style={{ display:"flex",gap:10,marginTop:14 }}>
                  <button style={s.btn()} onClick={saveProduct}>✅ সংরক্ষণ করুন</button>
                  <button style={s.btn(C.muted,true)} onClick={()=>{setShowForm(false);setEditId(null)}}>বাতিল</button>
                </div>
              </div>
            )}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14 }}>
              {myProducts.map(p=>(
                <div key={p.id} style={{ ...s.card,padding:0,overflow:"hidden",opacity:p.active?1:.6 }}>
                  <div style={{ background:`${dark?"#160F2E":"#EDEBFA"}`,fontSize:50,textAlign:"center",padding:"16px 0 10px",position:"relative" }}>
                    {p.emoji}
                    {!p.active&&<div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontWeight:700,fontSize:12 }}>নিষ্ক্রিয়</div>}
                  </div>
                  <div style={{ padding:"12px 14px" }}>
                    <div style={{ fontWeight:800,fontSize:14 }}>{p.name} {p.organic&&<span style={{ fontSize:10,background:"#d4edda",color:"#155724",padding:"2px 6px",borderRadius:4,marginLeft:4 }}>Organic</span>}</div>
                    <div style={{ fontSize:11,color:C.muted }}>{CATS[p.category]}</div>
                    <div style={{ fontSize:18,fontWeight:900,color:C.leaf,marginTop:6 }}>৳{p.price} <span style={{ fontSize:11,fontWeight:400,color:C.muted }}>/{p.unit}</span></div>
                    <div style={{ fontSize:12,color:C.muted,marginTop:3 }}>স্টক: {p.stock} · বিক্রয়: {p.sales}</div>
                    <div style={{ display:"flex",gap:7,marginTop:10 }}>
                      <button style={{ ...s.btn(C.blue),padding:"7px 10px",fontSize:12,flex:1 }} onClick={()=>editProduct(p)}>✏️ সম্পাদনা</button>
                      <button style={{ ...s.btn(p.active?C.harvest:C.leaf),padding:"7px 10px",fontSize:12 }} onClick={()=>toggleActive(p.id)}>{p.active?"❌":"✅"}</button>
                      <button style={{ ...s.btn(C.red),padding:"7px 10px",fontSize:12 }} onClick={()=>delProduct(p.id)}>🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {page==="orders"&&(
          <div>
            <div style={{ fontSize:20,fontWeight:800,marginBottom:20 }}>🛒 আমার অর্ডার</div>
            <div style={{ ...s.card,overflowX:"auto" }}>
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead><tr>{["অর্ডার","গ্রাহক","পণ্য","মোট","পেমেন্ট","স্ট্যাটাস"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {myOrders.map(o=>(
                    <tr key={o.id}>
                      <td style={{ ...s.td,fontWeight:800 }}>#{o.id}<div style={{ fontSize:10,color:C.muted,fontWeight:400 }}>{o.created}</div></td>
                      <td style={s.td}><div style={{ fontWeight:600 }}>{o.customerName}</div><div style={{ fontSize:11,color:C.muted }}>{o.phone}</div></td>
                      <td style={s.td}>
                        {o.items.filter(i=>i.farmerId===user.id).map((item,idx)=>{
                          const p=products.find(pr=>pr.id===item.productId);
                          return p?<div key={idx} style={{ fontSize:12 }}>{p.emoji} {p.name} ×{item.qty} = ৳{item.price*item.qty}</div>:null;
                        })}
                      </td>
                      <td style={{ ...s.td,fontWeight:700,color:C.leaf }}>৳{o.items.filter(i=>i.farmerId===user.id).reduce((s,i)=>s+i.price*i.qty,0)}</td>
                      <td style={s.td}>{o.payment}</td>
                      <td style={s.td}><span style={s.badge(STATUS_COLOR[o.status]||C.muted)}>{STATUS_LABEL[o.status]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {myOrders.length===0&&<div style={{ textAlign:"center",padding:40,color:C.muted }}>কোনো অর্ডার নেই</div>}
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {page==="analytics"&&(
          <div>
            <div style={{ fontSize:20,fontWeight:800,marginBottom:20 }}>📊 বিশ্লেষণ</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20 }}>
              {[["💰","৳"+myRevenue.toLocaleString(),"মোট আয়",C.leaf],["🛒",myOrders.length,"মোট অর্ডার",C.blue],["📦",myProducts.reduce((s,p)=>s+p.sales,0),"মোট বিক্রয়",C.orange]].map(([icon,val,label,color])=>(
                <div key={label} style={s.statCard(color)}><div style={{ fontSize:28 }}>{icon}</div><div style={{ fontSize:24,fontWeight:900,color,marginTop:6 }}>{val}</div><div style={{ fontSize:11,color:C.muted,marginTop:4 }}>{label}</div></div>
              ))}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>📈 সাপ্তাহিক অর্ডার</div>
                <MiniChart data={[5,9,7,12,15,10,18]} color={C.leaf} height={90}/>
              </div>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>📈 সাপ্তাহিক আয় (৳)</div>
                <MiniChart data={[500,900,700,1200,1500,1000,1800]} color={C.harvest} height={90}/>
              </div>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>🏆 সেরা পণ্য</div>
                {myProducts.sort((a,b)=>b.sales-a.sales).slice(0,5).map((p,i)=>(
                  <div key={p.id} style={{ display:"flex",gap:10,alignItems:"center",marginBottom:10 }}>
                    <span style={{ fontSize:22 }}>{p.emoji}</span>
                    <div style={{ flex:1 }}><div style={{ fontSize:13,fontWeight:600 }}>{p.name}</div>
                      <div style={{ height:6,background:dark?"#3D3470":"#eee",borderRadius:6,marginTop:3 }}>
                        <div style={{ height:"100%",background:C.leaf,borderRadius:6,width:`${Math.min(100,(p.sales/120)*100)}%` }} />
                      </div>
                    </div>
                    <span style={{ fontWeight:700,fontSize:13 }}>{p.sales}</span>
                  </div>
                ))}
              </div>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>💡 উন্নতির টিপস</div>
                {["সুন্দর বিবরণ দিন — বিক্রয় ৩০% বাড়ে","অর্গানিক হলে অবশ্যই চিহ্নিত করুন","স্টক সবসময় আপডেট রাখুন","অর্ডার পেলে দ্রুত স্ট্যাটাস দিন"].map((t,i)=>(
                  <div key={i} style={{ display:"flex",gap:10,marginBottom:10,fontSize:13 }}>
                    <span style={{ background:C.leaf,color:C.white,width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0 }}>{i+1}</span>
                    <span style={{ color:C.muted }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {page==="profile"&&(
          <div>
            <div style={{ fontSize:20,fontWeight:800,marginBottom:20 }}>👨‍🌾 আমার প্রোফাইল</div>
            <div style={{ ...s.card,display:"flex",gap:20,alignItems:"center",marginBottom:16 }}>
              <div style={{ fontSize:72,background:"#EDEBFA",borderRadius:"50%",width:100,height:100,display:"flex",alignItems:"center",justifyContent:"center" }}>{user.emoji}</div>
              <div>
                <div style={{ fontSize:22,fontWeight:800 }}>{user.name}</div>
                <div style={{ color:C.muted }}>📍 {user.location}</div>
                <div style={{ color:C.muted,fontSize:13,marginTop:4 }}>{user.bio}</div>
                <div style={{ marginTop:8 }}><span style={s.badge(user.verified?C.leaf:C.harvest)}>{user.verified?"✅ যাচাইকৃত কৃষক":"⏳ যাচাই বাকি"}</span></div>
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
              {[["📦",myProducts.length,"পণ্য"],["🛒",myOrders.length,"অর্ডার"],["💰","৳"+myRevenue.toLocaleString(),"আয়"]].map(([icon,val,label])=>(
                <div key={label} style={{ ...s.card,textAlign:"center",padding:16 }}><div style={{ fontSize:28 }}>{icon}</div><div style={{ fontSize:22,fontWeight:900,color:C.leaf }}>{val}</div><div style={{ fontSize:12,color:C.muted }}>{label}</div></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
