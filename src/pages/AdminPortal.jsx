import { useState } from "react";
import { C } from "../styles/theme";
import { gs } from "../styles/sharedStyles";
import { STATUS_COLOR, STATUS_LABEL } from "../data/constants";
import MiniChart from "../components/MiniChart";
import TrackModal from "../components/TrackModal";

export default function AdminPortal({ users, setUsers, products, setProducts, orders, setOrders, couriers, setCouriers, dark, setDark, onLogout }) {
  const s = gs(dark);
  const [page,setPage]=useState("home");
  const [trackOrder,setTrackOrder]=useState(null);
  const [showCourierForm,setShowCourierForm]=useState(false);
  const [courierForm,setCourierForm]=useState({name:"",phone:"",zone:"",vehicle:"মোটরসাইকেল"});

  const farmers=users.filter(u=>u.role==="farmer");
  const totalRevenue=orders.filter(o=>o.status==="delivered").reduce((s,o)=>s+o.total,0);
  const commission=Math.round(totalRevenue*0.06);
  const pending=orders.filter(o=>o.status==="pending").length;
  const delivered=orders.filter(o=>o.status==="delivered").length;

  const verifyFarmer=(id,v)=>setUsers(p=>p.map(u=>u.id===id?{...u,verified:v}:u));
  const deleteProduct=(id)=>{if(confirm("মুছে ফেলবেন?"))setProducts(p=>p.filter(pr=>pr.id!==id))};
  const updateOrderStatus=(id,status)=>setOrders(p=>p.map(o=>o.id===id?{...o,status,stage:status==="delivered"?"delivered":status==="confirmed"?"assigned":"placed"}:o));
  const toggleFeatured=(id)=>setProducts(p=>p.map(pr=>pr.id===id?{...pr,featured:!pr.featured}:pr));
  const assignCourier=(orderId,courierId)=>setOrders(p=>p.map(o=>o.id===orderId?{...o,courierId:courierId?+courierId:null,status:courierId?"confirmed":"pending",stage:courierId?"assigned":"placed"}:o));
  const toggleCourierActive=(id)=>setCouriers(p=>p.map(c=>c.id===id?{...c,active:!c.active}:c));
  const addCourier=()=>{
    if(!courierForm.name||!courierForm.phone)return;
    setCouriers(p=>[...p,{id:Math.max(...p.map(c=>c.id))+1,userId:null,...courierForm,active:true,deliveries:0,rating:5.0,avatar:"🧑‍✈️"}]);
    setCourierForm({name:"",phone:"",zone:"",vehicle:"মোটরসাইকেল"});
    setShowCourierForm(false);
  };

  const navItems=[["home","📊","ড্যাশবোর্ড"],["farmers","👨‍🌾","কৃষক"],["products","📦","পণ্য"],["orders","🛒","অর্ডার"],["couriers","🚚","কুরিয়ার"],["analytics","📈","বিশ্লেষণ"]];

  return(
    <div style={s.app}>
      <nav style={{ background:dark?C.darkCard:C.soil,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 12px rgba(0,0,0,0.3)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:9 }}>
          <div style={{ width:30,height:30,background:C.muted,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:12,fontWeight:800 }}>KB</div>
          <div><div style={{ fontWeight:700,color:"#E8E5F9",fontSize:15,lineHeight:1,letterSpacing:"-0.2px" }}>Admin Console</div><div style={{ fontSize:9.5,color:"#A39DC9" }}>KrishiBazar পরিচালনা</div></div>
        </div>
        <div style={{ display:"flex",gap:4 }}>
          {navItems.map(([p,icon,label])=>(
            <button key={p} onClick={()=>setPage(p)} style={{ background:page===p?C.leafLight+"30":"transparent",color:page===p?"#C9BFFB":C.muted,border:"none",padding:"6px 10px",borderRadius:4,cursor:"pointer",fontWeight:page===p?700:400,fontSize:12 }}>{icon} {label}</button>
          ))}
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <button onClick={()=>setDark(!dark)} style={{ background:"transparent",border:"none",fontSize:18,cursor:"pointer" }}>{dark?"☀️":"🌙"}</button>
          <button onClick={onLogout} style={{ background:"transparent",border:`1px solid #555`,color:C.muted,padding:"5px 12px",borderRadius:4,cursor:"pointer",fontSize:12 }}>লগআউট</button>
        </div>
      </nav>

      <div style={{ maxWidth:1200,margin:"0 auto",padding:"24px 20px" }}>
        {/* DASHBOARD HOME */}
        {page==="home"&&(
          <div>
            <div style={{ fontSize:20,fontWeight:800,marginBottom:20 }}>📊 Admin ড্যাশবোর্ড</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,marginBottom:24 }}>
              {[["👨‍🌾",farmers.length,"মোট কৃষক",C.leaf],["⏳",farmers.filter(f=>!f.verified).length,"যাচাই বাকি",C.harvest],["📦",products.length,"মোট পণ্য",C.blue],["🛒",orders.length,"মোট অর্ডার",C.purple],["💰","৳"+commission.toLocaleString(),"কমিশন আয়",C.orange]].map(([icon,val,label,color])=>(
                <div key={label} style={s.statCard(color)}><div style={{ fontSize:26 }}>{icon}</div><div style={{ fontSize:20,fontWeight:900,color,marginTop:6 }}>{val}</div><div style={{ fontSize:10,color:C.muted,marginTop:4 }}>{label}</div></div>
              ))}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>📈 অর্ডার ট্রেন্ড</div>
                <MiniChart data={[12,18,15,22,28,19,35]} color={C.leaf} height={80}/>
              </div>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>💰 রাজস্ব ট্রেন্ড (৳)</div>
                <MiniChart data={[1200,1800,1500,2200,2800,1900,3500]} color={C.harvest} height={80}/>
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>⚠️ যাচাই বাকি কৃষক</div>
                {farmers.filter(f=>!f.verified).map(f=>(
                  <div key={f.id} style={{ display:"flex",gap:10,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${dark?C.darkBorder:"#EDEBFA"}` }}>
                    <span style={{ fontSize:28 }}>{f.emoji}</span>
                    <div style={{ flex:1 }}><div style={{ fontWeight:700,fontSize:13 }}>{f.name}</div><div style={{ fontSize:11,color:C.muted }}>{f.location}</div></div>
                    <button style={{ ...s.btn(C.leaf),padding:"6px 12px",fontSize:12 }} onClick={()=>verifyFarmer(f.id,true)}>✅ অনুমোদন</button>
                  </div>
                ))}
                {farmers.filter(f=>!f.verified).length===0&&<div style={{ color:C.muted,fontSize:13 }}>সব কৃষক যাচাই হয়েছে ✅</div>}
              </div>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>🛒 সাম্প্রতিক অর্ডার</div>
                {orders.slice(0,5).map(o=>(
                  <div key={o.id} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${dark?C.darkBorder:"#EDEBFA"}`,fontSize:13 }}>
                    <span style={{ fontWeight:700 }}>#{o.id}</span>
                    <span style={{ color:C.muted,fontSize:12 }}>{o.customerName}</span>
                    <span style={{ fontWeight:600 }}>৳{o.total}</span>
                    <span style={s.badge(STATUS_COLOR[o.status]||C.muted)}>{STATUS_LABEL[o.status]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FARMERS */}
        {page==="farmers"&&(
          <div>
            <div style={{ fontSize:20,fontWeight:800,marginBottom:20 }}>👨‍🌾 কৃষক ব্যবস্থাপনা</div>
            <div style={{ display:"flex",gap:10,marginBottom:14 }}>
              {[["সকল",farmers.length,C.muted],["যাচাইকৃত",farmers.filter(f=>f.verified).length,C.leaf],["অপেক্ষমাণ",farmers.filter(f=>!f.verified).length,C.harvest]].map(([l,v,c])=>(
                <div key={l} style={{ padding:"7px 14px",background:c+"22",color:c,borderRadius:4,fontWeight:700,fontSize:12 }}>{l}: {v}</div>
              ))}
            </div>
            <div style={{ ...s.card,overflowX:"auto" }}>
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead><tr>{["#","কৃষক","মোবাইল","এলাকা","পণ্য","স্ট্যাটাস","অ্যাকশন"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {farmers.map(f=>(
                    <tr key={f.id}>
                      <td style={{ ...s.td,color:C.muted }}>#{f.id}</td>
                      <td style={s.td}><div style={{ display:"flex",gap:8,alignItems:"center" }}><span style={{ fontSize:26 }}>{f.emoji}</span><div><div style={{ fontWeight:700 }}>{f.name}</div><div style={{ fontSize:11,color:C.muted }}>{f.bio?.slice(0,30)}...</div></div></div></td>
                      <td style={{ ...s.td,fontSize:12 }}>{f.phone}</td>
                      <td style={s.td}>{f.location||"—"}</td>
                      <td style={{ ...s.td,fontWeight:700,color:C.blue }}>{products.filter(p=>p.farmerId===f.id).length}</td>
                      <td style={s.td}><span style={s.badge(f.verified?C.leaf:C.harvest)}>{f.verified?"✅ যাচাইকৃত":"⏳ অপেক্ষমাণ"}</span></td>
                      <td style={s.td}>
                        {f.verified
                          ?<button style={{ ...s.btn(C.red),padding:"6px 12px",fontSize:12 }} onClick={()=>verifyFarmer(f.id,false)}>❌ বাতিল</button>
                          :<button style={{ ...s.btn(C.leaf),padding:"6px 12px",fontSize:12 }} onClick={()=>verifyFarmer(f.id,true)}>✅ অনুমোদন</button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {page==="products"&&(
          <div>
            <div style={{ fontSize:20,fontWeight:800,marginBottom:20 }}>📦 পণ্য ব্যবস্থাপনা</div>
            <div style={{ ...s.card,overflowX:"auto" }}>
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead><tr>{["পণ্য","কৃষক","মূল্য","স্টক","বিক্রয়","অর্গানিক","ফিচার্ড","স্ট্যাটাস","অ্যাকশন"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {products.map(p=>{
                    const farmer=users.find(u=>u.id===p.farmerId);
                    return(
                      <tr key={p.id}>
                        <td style={s.td}><span style={{ fontSize:22 }}>{p.emoji}</span> <strong style={{ fontSize:13 }}>{p.name}</strong><div style={{ fontSize:11,color:C.muted }}>{p.nameEn}</div></td>
                        <td style={{ ...s.td,fontSize:12 }}>{farmer?.name||"—"}</td>
                        <td style={{ ...s.td,fontWeight:700,color:C.leaf }}>৳{p.price}/{p.unit}</td>
                        <td style={s.td}>{p.stock}</td>
                        <td style={{ ...s.td,fontWeight:700 }}>{p.sales}</td>
                        <td style={s.td}>{p.organic?<span style={s.badge(C.leaf)}>🌿</span>:"—"}</td>
                        <td style={s.td}><button onClick={()=>toggleFeatured(p.id)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:16 }}>{p.featured?"⭐":"☆"}</button></td>
                        <td style={s.td}><span style={s.badge(p.active?C.leaf:C.red)}>{p.active?"সক্রিয়":"বন্ধ"}</span></td>
                        <td style={s.td}><button style={{ ...s.btn(C.red),padding:"6px 10px",fontSize:12 }} onClick={()=>deleteProduct(p.id)}>🗑️</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {page==="orders"&&(
          <div>
            <div style={{ fontSize:20,fontWeight:800,marginBottom:20 }}>🛒 অর্ডার ব্যবস্থাপনা</div>
            <div style={{ display:"flex",gap:8,marginBottom:14,flexWrap:"wrap" }}>
              {Object.entries(STATUS_LABEL).map(([v,l])=>(
                <div key={v} style={{ padding:"5px 12px",background:STATUS_COLOR[v]+"22",color:STATUS_COLOR[v],borderRadius:4,fontSize:12,fontWeight:700 }}>
                  {l}: {orders.filter(o=>o.status===v).length}
                </div>
              ))}
            </div>
            <div style={{ ...s.card,overflowX:"auto" }}>
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead><tr>{["অর্ডার","গ্রাহক","ফোন","মোট","পেমেন্ট","তারিখ","কুরিয়ার","স্ট্যাটাস","পরিবর্তন","ট্র্যাক"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {orders.map(o=>{
                    const assignedCourier=couriers.find(c=>c.id===o.courierId);
                    return(
                    <tr key={o.id}>
                      <td style={{ ...s.td,fontWeight:800 }}>#{o.id}</td>
                      <td style={s.td}>{o.customerName}<div style={{ fontSize:11,color:C.muted }}>{o.address}</div></td>
                      <td style={{ ...s.td,fontSize:12 }}>{o.phone}</td>
                      <td style={{ ...s.td,fontWeight:700,color:C.leaf }}>৳{o.total}</td>
                      <td style={s.td}>{o.payment}</td>
                      <td style={{ ...s.td,fontSize:12,color:C.muted }}>{o.created}</td>
                      <td style={s.td}>
                        <select style={{ padding:"5px 8px",borderRadius:4,border:`1px solid ${dark?C.darkBorder:"#D6D2F0"}`,fontSize:11,background:dark?C.darkCard:C.white,color:dark?C.white:C.soil,cursor:"pointer" }}
                          value={o.courierId||""} onChange={e=>assignCourier(o.id,e.target.value)}>
                          <option value="">নিযুক্ত করুন...</option>
                          {couriers.filter(c=>c.active).map(c=><option key={c.id} value={c.id}>{c.avatar} {c.name}</option>)}
                        </select>
                      </td>
                      <td style={s.td}><button style={{ ...s.btn(C.blue),padding:"5px 10px",fontSize:12 }} onClick={()=>setTrackOrder(o)}>🔍</button></td>
                    </tr>
                  );})}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COURIERS */}
        {page==="couriers"&&(
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <div style={{ fontSize:20,fontWeight:800 }}>🚚 কুরিয়ার ব্যবস্থাপনা</div>
              <button style={s.btn(C.blue)} onClick={()=>setShowCourierForm(!showCourierForm)}>+ নতুন কুরিয়ার যোগ করুন</button>
            </div>

            {showCourierForm&&(
              <div style={{ ...s.card,background:dark?"#160F2E":"#EFE9FE",marginBottom:20 }}>
                <div style={{ fontWeight:700,marginBottom:14 }}>নতুন কুরিয়ার</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                  {[["নাম","name","text"],["মোবাইল","phone","tel"],["জোন","zone","text"]].map(([l,k,t])=>(
                    <div key={k}><label style={s.label}>{l}</label><input type={t} style={s.input} value={courierForm[k]} onChange={e=>setCourierForm(p=>({...p,[k]:e.target.value}))}/></div>
                  ))}
                  <div>
                    <label style={s.label}>যানবাহন</label>
                    <select style={s.input} value={courierForm.vehicle} onChange={e=>setCourierForm(p=>({...p,vehicle:e.target.value}))}>
                      {["মোটরসাইকেল","সাইকেল","পিকআপ","ভ্যান","ট্রাক"].map(v=><option key={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display:"flex",gap:10,marginTop:14 }}>
                  <button style={s.btn(C.blue)} onClick={addCourier}>✅ যোগ করুন</button>
                  <button style={s.btn(C.muted,true)} onClick={()=>setShowCourierForm(false)}>বাতিল</button>
                </div>
              </div>
            )}

            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16 }}>
              {couriers.map(c=>{
                const activeOrders=orders.filter(o=>o.courierId===c.id&&o.status!=="delivered").length;
                return(
                  <div key={c.id} style={{ ...s.card,padding:0,overflow:"hidden" }}>
                    <div style={{ background:`linear-gradient(135deg,${c.active?C.leaf:"#888"},${c.active?C.leafLight:"#aaa"})`,padding:"20px",color:C.white,position:"relative" }}>
                      <div style={{ fontSize:44 }}>{c.avatar}</div>
                      <div style={{ fontSize:17,fontWeight:800,marginTop:8 }}>{c.name}</div>
                      <div style={{ fontSize:12,opacity:.85 }}>{c.phone}</div>
                      <div style={{ position:"absolute",top:14,right:14,display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end" }}>
                        <span style={{ background:"rgba(255,255,255,0.25)",color:C.white,padding:"3px 10px",borderRadius:4,fontSize:11,fontWeight:700 }}>{c.active?"● অনলাইন":"○ অফলাইন"}</span>
                        {c.userId?<span style={{ background:"rgba(255,255,255,0.18)",color:C.white,padding:"2px 8px",borderRadius:6,fontSize:10 }}>🔐 লগইন আছে</span>:null}
                      </div>
                    </div>
                    <div style={{ padding:16 }}>
                      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12 }}>
                        {[["📍",c.zone,"জোন"],["🚗",c.vehicle,"যান"],["⭐",c.rating,"রেটিং"]].map(([icon,val,label])=>(
                          <div key={label} style={{ textAlign:"center",background:dark?"#160F2E":C.offwhite,borderRadius:4,padding:"7px 4px" }}>
                            <div style={{ fontSize:14 }}>{icon}</div><div style={{ fontWeight:700,fontSize:13 }}>{val}</div><div style={{ fontSize:9,color:C.muted }}>{label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display:"flex",gap:8,marginBottom:10 }}>
                        <div style={{ flex:1,background:C.orange+"15",borderRadius:4,padding:"8px",textAlign:"center" }}>
                          <div style={{ fontWeight:800,color:C.orange,fontSize:16 }}>{activeOrders}</div>
                          <div style={{ fontSize:10,color:C.muted }}>চলমান</div>
                        </div>
                        <div style={{ flex:1,background:C.leaf+"15",borderRadius:4,padding:"8px",textAlign:"center" }}>
                          <div style={{ fontWeight:800,color:C.leaf,fontSize:16 }}>{c.deliveries}</div>
                          <div style={{ fontSize:10,color:C.muted }}>সম্পন্ন</div>
                        </div>
                      </div>
                      <button style={{ ...s.btn(c.active?C.harvest:C.leaf),width:"100%",fontSize:12,padding:"7px 0" }} onClick={()=>toggleCourierActive(c.id)}>{c.active?"⏸ নিষ্ক্রিয় করুন":"▶ সক্রিয় করুন"}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {page==="analytics"&&(
          <div>
            <div style={{ fontSize:20,fontWeight:800,marginBottom:20 }}>📈 প্ল্যাটফর্ম বিশ্লেষণ</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>📦 সাপ্তাহিক অর্ডার</div>
                <MiniChart data={[12,18,15,22,28,19,35]} color={C.leaf} height={90}/>
              </div>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>💰 সাপ্তাহিক রাজস্ব</div>
                <MiniChart data={[12000,18000,15000,22000,28000,19000,35000]} color={C.harvest} height={90}/>
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14 }}>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>🏆 শীর্ষ পণ্য</div>
                {products.sort((a,b)=>b.sales-a.sales).slice(0,5).map((p,i)=>(
                  <div key={p.id} style={{ display:"flex",gap:8,alignItems:"center",marginBottom:9 }}>
                    <span style={{ fontSize:18 }}>{p.emoji}</span>
                    <div style={{ flex:1,fontSize:13 }}>{p.name}</div>
                    <span style={{ fontWeight:700,color:C.leaf,fontSize:13 }}>{p.sales}</span>
                  </div>
                ))}
              </div>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>👨‍🌾 শীর্ষ কৃষক</div>
                {farmers.slice(0,5).map((f,i)=>(
                  <div key={f.id} style={{ display:"flex",gap:8,alignItems:"center",marginBottom:9 }}>
                    <span style={{ fontSize:22 }}>{f.emoji}</span>
                    <div style={{ flex:1 }}><div style={{ fontSize:13,fontWeight:600 }}>{f.name}</div><div style={{ fontSize:11,color:C.muted }}>{f.location}</div></div>
                    <span style={{ fontWeight:700,color:C.harvest,fontSize:12 }}>⭐{f.rating}</span>
                  </div>
                ))}
              </div>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>💰 আয় ভাগাভাগি</div>
                {[["কৃষক আয়","৳"+(totalRevenue-commission).toLocaleString(),C.leaf,"94%"],["কমিশন","৳"+commission.toLocaleString(),C.orange,"6%"]].map(([label,val,color,pct])=>(
                  <div key={label} style={{ marginBottom:14 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:13 }}>
                      <span style={{ color:C.muted }}>{label}</span><span style={{ fontWeight:700,color }}>{val} ({pct})</span>
                    </div>
                    <div style={{ height:8,background:dark?"#3D3470":"#eee",borderRadius:4 }}>
                      <div style={{ height:"100%",background:color,borderRadius:4,width:pct,transition:"width .8s" }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop:16,padding:12,background:C.orange+"15",borderRadius:4,fontSize:13 }}>
                  <div style={{ fontWeight:700,color:C.orange }}>মোট প্ল্যাটফর্ম আয়</div>
                  <div style={{ fontSize:22,fontWeight:900,color:C.orange }}>৳{commission.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {trackOrder&&<TrackModal order={trackOrder} onClose={()=>setTrackOrder(null)} dark={dark}/>}
    </div>
  );
}
