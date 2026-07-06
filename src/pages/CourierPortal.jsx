import { useState } from "react";
import { C } from "../styles/theme";
import { gs } from "../styles/sharedStyles";
import { DELIVERY_STAGES } from "../data/couriers";
import TrackModal from "../components/TrackModal";

export default function CourierPortal({ user, courier, couriers, setCouriers, orders, setOrders, products, dark, setDark, onLogout }) {
  const s = gs(dark);
  const [page,setPage]=useState("home");
  const [trackOrder,setTrackOrder]=useState(null);
  const [simStage,setSimStage]=useState({});

  const myOrders = orders.filter(o=>o.courierId===courier.id);
  const available = orders.filter(o=>!o.courierId && o.status==="pending");
  const active = myOrders.filter(o=>o.status!=="delivered");
  const completed = myOrders.filter(o=>o.status==="delivered");

  const acceptOrder=(orderId)=>{
    setOrders(p=>p.map(o=>o.id===orderId?{...o,courierId:courier.id,status:"confirmed",stage:"assigned"}:o));
  };

  const advanceStage=(orderId)=>{
    const order=orders.find(o=>o.id===orderId);
    const idx=DELIVERY_STAGES.findIndex(st=>st.key===order.stage);
    if(idx>=DELIVERY_STAGES.length-1)return;
    const nextStage=DELIVERY_STAGES[idx+1].key;
    setOrders(p=>p.map(o=>o.id===orderId?{...o,stage:nextStage,status:nextStage==="delivered"?"delivered":"confirmed"}:o));
    if(nextStage==="delivered"){
      setCouriers(p=>p.map(c=>c.id===courier.id?{...c,deliveries:c.deliveries+1}:c));
    }
  };

  const toggleOnline=()=>setCouriers(p=>p.map(c=>c.id===courier.id?{...c,active:!c.active}:c));

  const todayEarnings = completed.reduce((s,o)=>s+Math.round(o.total*0.03),0); // 3% delivery fee cut example

  const navItems=[["home","🏠","ড্যাশবোর্ড"],["available","🆕","নতুন অর্ডার"],["active","🚚","চলমান ডেলিভারি"],["history","✅","সম্পন্ন ইতিহাস"],["profile","🧑‍✈️","প্রোফাইল"]];

  return(
    <div style={s.app}>
      <nav style={{ background:dark?C.darkCard:C.soil,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 12px rgba(0,0,0,0.25)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:9 }}>
          <div style={{ width:30,height:30,background:C.harvest,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:12,fontWeight:800 }}>KB</div>
          <div><div style={{ fontWeight:700,color:"#E8E5F9",fontSize:15,lineHeight:1,letterSpacing:"-0.2px" }}>KrishiBazar</div><div style={{ fontSize:9.5,color:"#A39DC9" }}>কুরিয়ার পোর্টাল</div></div>
        </div>
        <div style={{ display:"flex",gap:4 }}>
          {navItems.map(([p,icon,label])=>(
            <button key={p} onClick={()=>setPage(p)} style={{ background:page===p?C.harvest+"22":"transparent",color:page===p?"#E0B8FF":C.muted,border:"none",padding:"6px 10px",borderRadius:4,cursor:"pointer",fontWeight:page===p?700:400,fontSize:12 }}>
              {icon} {label} {p==="available"&&available.length>0&&<span style={{ background:C.red,color:C.white,borderRadius:"50%",padding:"1px 6px",fontSize:10,marginLeft:3 }}>{available.length}</span>}
            </button>
          ))}
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ color:C.sprout,fontSize:12 }}>{courier.avatar} {courier.name}</span>
          <button onClick={()=>setDark(!dark)} style={{ background:"transparent",border:"none",fontSize:18,cursor:"pointer" }}>{dark?"☀️":"🌙"}</button>
          <button onClick={onLogout} style={{ background:"transparent",border:`1px solid #555`,color:C.muted,padding:"5px 12px",borderRadius:4,cursor:"pointer",fontSize:12 }}>লগআউট</button>
        </div>
      </nav>

      <div style={{ maxWidth:1100,margin:"0 auto",padding:"24px 20px" }}>

        {/* ONLINE TOGGLE BAR */}
        <div style={{ ...s.card,display:"flex",justifyContent:"space-between",alignItems:"center",background:courier.active?(dark?"#16241c":"#eaf7ef"):(dark?"#241616":"#fbeaea") }}>
          <div style={{ display:"flex",gap:12,alignItems:"center" }}>
            <span style={{ fontSize:30 }}>{courier.avatar}</span>
            <div>
              <div style={{ fontWeight:800 }}>{courier.name}</div>
              <div style={{ fontSize:12,color:C.muted }}>{courier.vehicle} · {courier.zone} · ⭐ {courier.rating}</div>
            </div>
          </div>
          <button style={{ ...s.btn(courier.active?C.red:C.leaf),padding:"9px 20px" }} onClick={toggleOnline}>
            {courier.active?"🔴 অফলাইন হোন":"🟢 অনলাইন হোন"}
          </button>
        </div>

        {/* HOME */}
        {page==="home"&&(
          <div>
            <div style={{ fontSize:20,fontWeight:800,margin:"20px 0" }}>স্বাগতম, {courier.name}! 👋</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24 }}>
              {[["🆕",available.length,"নতুন অর্ডার",C.blue],["🚚",active.length,"চলমান ডেলিভারি",C.orange],["✅",completed.length,"সম্পন্ন (মোট)",C.leaf],["💰","৳"+todayEarnings,"আজকের আয়",C.harvest]].map(([icon,val,label,color])=>(
                <div key={label} style={s.statCard(color)}><div style={{ fontSize:28 }}>{icon}</div><div style={{ fontSize:22,fontWeight:900,color,marginTop:6 }}>{val}</div><div style={{ fontSize:11,color:C.muted,marginTop:4 }}>{label}</div></div>
              ))}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>🚚 চলমান ডেলিভারি</div>
                {active.length===0?<div style={{ color:C.muted,fontSize:13 }}>কোনো চলমান ডেলিভারি নেই</div>:active.slice(0,4).map(o=>{
                  const stage=DELIVERY_STAGES.find(st=>st.key===o.stage);
                  return(
                    <div key={o.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${dark?C.darkBorder:"#EDEBFA"}` }}>
                      <div><div style={{ fontWeight:700,fontSize:13 }}>#{o.id}</div><div style={{ fontSize:11,color:C.muted }}>{o.address}</div></div>
                      <span style={s.badge(stage?.color||C.muted)}>{stage?.icon} {stage?.label}</span>
                    </div>
                  );
                })}
              </div>
              <div style={s.card}>
                <div style={{ fontWeight:700,marginBottom:14 }}>🆕 নতুন অর্ডার পাওয়া যাচ্ছে</div>
                {available.length===0?<div style={{ color:C.muted,fontSize:13 }}>এই মুহূর্তে নতুন অর্ডার নেই</div>:available.slice(0,4).map(o=>(
                  <div key={o.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${dark?C.darkBorder:"#EDEBFA"}` }}>
                    <div><div style={{ fontWeight:700,fontSize:13 }}>#{o.id}</div><div style={{ fontSize:11,color:C.muted }}>{o.zone} · ৳{o.total}</div></div>
                    <button style={{ ...s.btn(C.blue),padding:"5px 12px",fontSize:11 }} onClick={()=>acceptOrder(o.id)}>গ্রহণ করুন</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AVAILABLE ORDERS */}
        {page==="available"&&(
          <div>
            <div style={{ fontSize:20,fontWeight:800,margin:"20px 0" }}>🆕 নতুন অর্ডার সমূহ</div>
            {available.length===0?<div style={{ ...s.card,textAlign:"center",padding:50,color:C.muted }}>এই মুহূর্তে কোনো নতুন অর্ডার নেই</div>:
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14 }}>
                {available.map(o=>(
                  <div key={o.id} style={s.card}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
                      <div style={{ fontWeight:800 }}>#{o.id}</div>
                      <span style={s.badge(C.blue)}>{o.zone}</span>
                    </div>
                    <div style={{ fontSize:13,color:C.muted,marginBottom:6 }}>📍 {o.address}</div>
                    <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:10 }}>
                      {o.items.map((item,i)=>{const p=products.find(pr=>pr.id===item.productId);return p?<span key={i} style={{ background:dark?"#160F2E":C.offwhite,borderRadius:4,padding:"3px 9px",fontSize:11 }}>{p.emoji} ×{item.qty}</span>:null;})}
                    </div>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                      <span style={{ fontWeight:800,color:C.leaf,fontSize:16 }}>৳{o.total}</span>
                      <button style={s.btn(C.leaf)} onClick={()=>acceptOrder(o.id)}>✅ গ্রহণ করুন</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {/* ACTIVE DELIVERIES */}
        {page==="active"&&(
          <div>
            <div style={{ fontSize:20,fontWeight:800,margin:"20px 0" }}>🚚 চলমান ডেলিভারি</div>
            {active.length===0?<div style={{ ...s.card,textAlign:"center",padding:50,color:C.muted }}>কোনো চলমান ডেলিভারি নেই</div>:
              active.map(o=>{
                const stage=DELIVERY_STAGES.find(st=>st.key===o.stage);
                const stageIdx=DELIVERY_STAGES.findIndex(st=>st.key===o.stage);
                return(
                  <div key={o.id} style={s.card}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
                      <div>
                        <div style={{ fontWeight:800,fontSize:16 }}>#{o.id}</div>
                        <div style={{ fontSize:12,color:C.muted }}>{o.customerName} · {o.phone}</div>
                      </div>
                      <span style={s.badge(stage?.color||C.muted)}>{stage?.icon} {stage?.label}</span>
                    </div>
                    <div style={{ fontSize:13,color:C.muted,marginBottom:10 }}>📍 {o.address}</div>
                    <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:12 }}>
                      {o.items.map((item,i)=>{const p=products.find(pr=>pr.id===item.productId);return p?<span key={i} style={{ background:dark?"#160F2E":C.offwhite,borderRadius:4,padding:"3px 9px",fontSize:11 }}>{p.emoji} {p.name} ×{item.qty}</span>:null;})}
                    </div>
                    {/* mini progress bar */}
                    <div style={{ height:6,background:dark?"#3D3470":"#eee",borderRadius:6,marginBottom:12 }}>
                      <div style={{ height:"100%",background:`linear-gradient(90deg,${C.leaf},${C.orange})`,borderRadius:6,width:`${(stageIdx/(DELIVERY_STAGES.length-1))*100}%`,transition:"width .5s" }} />
                    </div>
                    <div style={{ display:"flex",gap:10,justifyContent:"space-between",alignItems:"center" }}>
                      <span style={{ fontWeight:800,color:C.leaf,fontSize:15 }}>৳{o.total} · {o.payment}</span>
                      <div style={{ display:"flex",gap:8 }}>
                        <a href={`tel:${o.phone}`} style={{ ...s.btn(C.blue,true),textDecoration:"none",padding:"7px 14px",fontSize:12 }}>📞 কল</a>
                        {stageIdx<DELIVERY_STAGES.length-1&&
                          <button style={{ ...s.btn(C.orange),padding:"7px 16px",fontSize:12 }} onClick={()=>advanceStage(o.id)}>
                            ▶ {DELIVERY_STAGES[stageIdx+1].label}
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        )}

        {/* HISTORY */}
        {page==="history"&&(
          <div>
            <div style={{ fontSize:20,fontWeight:800,margin:"20px 0" }}>✅ সম্পন্ন ডেলিভারি ইতিহাস</div>
            <div style={{ ...s.card,overflowX:"auto" }}>
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead><tr>{["অর্ডার","গ্রাহক","ঠিকানা","মূল্য","পেমেন্ট","তারিখ","ডেলিভারি ফি"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {completed.map(o=>(
                    <tr key={o.id}>
                      <td style={{ ...s.td,fontWeight:800 }}>#{o.id}</td>
                      <td style={s.td}>{o.customerName}</td>
                      <td style={{ ...s.td,fontSize:12,color:C.muted }}>{o.address}</td>
                      <td style={{ ...s.td,fontWeight:700,color:C.leaf }}>৳{o.total}</td>
                      <td style={s.td}>{o.payment}</td>
                      <td style={{ ...s.td,fontSize:12,color:C.muted }}>{o.created}</td>
                      <td style={{ ...s.td,fontWeight:700,color:C.harvest }}>৳{Math.round(o.total*0.03)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {completed.length===0&&<div style={{ textAlign:"center",padding:40,color:C.muted }}>এখনো কোনো ডেলিভারি সম্পন্ন হয়নি</div>}
            </div>
          </div>
        )}

        {/* PROFILE */}
        {page==="profile"&&(
          <div>
            <div style={{ fontSize:20,fontWeight:800,margin:"20px 0" }}>🧑‍✈️ আমার প্রোফাইল</div>
            <div style={{ ...s.card,display:"flex",gap:20,alignItems:"center",marginBottom:16 }}>
              <div style={{ fontSize:64,background:dark?"#160F2E":C.offwhite,borderRadius:"50%",width:96,height:96,display:"flex",alignItems:"center",justifyContent:"center" }}>{courier.avatar}</div>
              <div>
                <div style={{ fontSize:20,fontWeight:800 }}>{courier.name}</div>
                <div style={{ color:C.muted,fontSize:13 }}>{courier.phone}</div>
                <div style={{ marginTop:6 }}>
                  <span style={s.badge(courier.active?C.leaf:C.red)}>{courier.active?"● অনলাইন":"○ অফলাইন"}</span>
                </div>
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14 }}>
              {[["📍",courier.zone,"কর্মএলাকা"],["🚗",courier.vehicle,"যানবাহন"],["⭐",courier.rating,"রেটিং"],["✅",courier.deliveries,"মোট ডেলিভারি"]].map(([icon,val,label])=>(
                <div key={label} style={{ ...s.card,textAlign:"center",padding:16 }}><div style={{ fontSize:26 }}>{icon}</div><div style={{ fontSize:18,fontWeight:900,color:C.leaf }}>{val}</div><div style={{ fontSize:11,color:C.muted }}>{label}</div></div>
              ))}
            </div>
            <div style={s.card}>
              <div style={{ fontWeight:700,marginBottom:12 }}>💡 দক্ষতার টিপস</div>
              {["দ্রুত স্ট্যাটাস আপডেট দিন — গ্রাহক স্বস্তি পান","সবসময় ফোন করে নিশ্চিত করুন ঠিকানা","নিরাপদে গাড়ি চালান — সময়ের চেয়ে নিরাপত্তা জরুরি","রেটিং বাড়াতে নম্র আচরণ করুন"].map((t,i)=>(
                <div key={i} style={{ display:"flex",gap:10,marginBottom:8,fontSize:13 }}>
                  <span style={{ background:C.orange,color:C.white,width:20,height:20,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0 }}>{i+1}</span>
                  <span style={{ color:C.muted }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {trackOrder&&<TrackModal order={trackOrder} onClose={()=>setTrackOrder(null)} dark={dark}/>}
    </div>
  );
}
