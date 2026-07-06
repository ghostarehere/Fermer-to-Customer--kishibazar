import { useState, useEffect, useRef } from "react";
import { C } from "../styles/theme";
import { gs } from "../styles/sharedStyles";
import { USERS } from "../data/users";
import { CATS, STATUS_COLOR, STATUS_LABEL } from "../data/constants";
import Stars from "../components/Stars";
import TrackModal from "../components/TrackModal";

// ══════════════════════════════════════════════════════════════
// 🛒 CUSTOMER MARKET PORTAL
// ══════════════════════════════════════════════════════════════
export default function CustomerPortal({ user, products, orders, setOrders, dark, setDark, lang, setLang, onLogout }) {
  const s = gs(dark);
  const [page,setPage]=useState("market");
  const [cart,setCart]=useState([]);
  const [search,setSearch]=useState("");
  const [cat,setCat]=useState("all");
  const [organicOnly,setOrganicOnly]=useState(false);
  const [sortBy,setSortBy]=useState("default");
  const [minP,setMinP]=useState("");
  const [maxP,setMaxP]=useState("");
  const [selected,setSelected]=useState(null);
  const [reviewData,setReviewData]=useState({});
  const [trackOrder,setTrackOrder]=useState(null);
  const [orderSuccess,setOrderSuccess]=useState(null);
  const [form,setForm]=useState({name:user.name||"",phone:user.phone||"",address:"",payment:"cash"});
  const [chatMsgs,setChatMsgs]=useState([{ id:1,from:"farmer",text:"আস্সালামু আলাইকুম! কীভাবে সাহায্য করতে পারি?",time:"এখন" }]);
  const [chatInput,setChatInput]=useState("");
  const [subDone,setSubDone]=useState(null);
  const chatEnd=useRef(null);

  const cartTotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  const myOrders=orders.filter(o=>o.customerId===user.id||o.customerName===user.name);

  const addToCart=(p)=>setCart(prev=>{const ex=prev.find(i=>i.id===p.id);return ex?prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...prev,{...p,qty:1}]});
  const updateQty=(id,qty)=>{if(qty<=0)setCart(p=>p.filter(i=>i.id!==id));else setCart(p=>p.map(i=>i.id===id?{...i,qty}:i))};

  const placeOrder=()=>{
    if(!form.name||!form.phone||!form.address)return;
    const newOrder={
      id:"KB"+Math.floor(1000+Math.random()*9000),
      customerId:user.id, customerName:form.name, phone:form.phone, address:form.address,
      items:cart.map(i=>({productId:i.id,qty:i.qty,price:i.price,farmerId:i.farmerId})),
      total:cartTotal, payment:form.payment, status:"pending", stage:"placed",
      courierId:null, created:new Date().toLocaleDateString('bn-BD'), zone:"ঢাকা"
    };
    setOrders(p=>[newOrder,...p]);
    setOrderSuccess(newOrder);
    setCart([]);
    setPage("orders");
  };

  const sendChat=()=>{
    if(!chatInput.trim())return;
    setChatMsgs(p=>[...p,{id:p.length+1,from:"customer",text:chatInput,time:"এখন"}]);
    setChatInput("");
    setTimeout(()=>setChatMsgs(p=>[...p,{id:p.length+2,from:"farmer",text:"ধন্যবাদ! শীঘ্রই উত্তর দেব।",time:"এখন"}]),1200);
  };

  useEffect(()=>chatEnd.current?.scrollIntoView({behavior:"smooth"}),[chatMsgs]);

  let filtered=[...products].filter(p=>p.active)
    .filter(p=>cat==="all"||p.category===cat)
    .filter(p=>!organicOnly||p.organic)
    .filter(p=>!minP||p.price>=+minP).filter(p=>!maxP||p.price<=+maxP)
    .filter(p=>p.name.includes(search)||p.nameEn.toLowerCase().includes(search.toLowerCase()));
  if(sortBy==="price_asc")filtered.sort((a,b)=>a.price-b.price);
  if(sortBy==="price_desc")filtered.sort((a,b)=>b.price-a.price);
  if(sortBy==="rating")filtered.sort((a,b)=>b.rating-a.rating);

  const navItems=[["market","🛒","বাজার"],["subscribe","📦","সাবস্ক্রিপশন"],["chat","💬","চ্যাট"],["orders","📋","আমার অর্ডার"],["track","🔍","ট্র্যাক"]];

  const accentColor=C.leaf;
  return(
    <div style={s.app}>
      <nav style={{ background:dark?C.darkCard:C.soil,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:9,cursor:"pointer" }} onClick={()=>setPage("market")}>
          <div style={{ width:30,height:30,background:C.harvest,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:12,fontWeight:800 }}>KB</div>
          <div><div style={{ fontWeight:700,color:"#E8E5F9",fontSize:15,lineHeight:1,letterSpacing:"-0.2px" }}>কৃষিবাজার</div><div style={{ fontSize:9.5,color:C.sprout }}>কৃষক থেকে আপনার দরজায়</div></div>
        </div>
        <div style={{ display:"flex",gap:4 }}>
          {navItems.map(([p,icon,label])=>(
            <button key={p} onClick={()=>setPage(p)} style={{ background:page===p?C.leaf+"33":"transparent",color:page===p?C.sprout:C.muted,border:"none",padding:"6px 10px",borderRadius:4,cursor:"pointer",fontWeight:page===p?700:400,fontSize:12,display:"flex",alignItems:"center",gap:4 }}>
              {icon}<span>{label}</span>
            </button>
          ))}
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <button onClick={()=>setLang(l=>l==="bn"?"en":"bn")} style={{ background:C.harvest,color:C.white,border:"none",padding:"5px 10px",borderRadius:4,cursor:"pointer",fontWeight:700,fontSize:11 }}>{lang==="bn"?"EN":"বাং"}</button>
          <button onClick={()=>setDark(!dark)} style={{ background:"transparent",border:"none",fontSize:18,cursor:"pointer" }}>{dark?"☀️":"🌙"}</button>
          <button onClick={()=>setPage("cart")} style={{ background:C.harvest,color:C.white,border:"none",padding:"6px 14px",borderRadius:4,cursor:"pointer",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:5 }}>
            🛒{cartCount>0&&<span style={{ background:C.red,color:C.white,borderRadius:"50%",width:16,height:16,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10 }}>{cartCount}</span>}কার্ট
          </button>
          <button onClick={onLogout} style={{ background:"transparent",border:`1px solid #555`,color:C.muted,padding:"5px 12px",borderRadius:4,cursor:"pointer",fontSize:12 }}>লগআউট</button>
        </div>
      </nav>

      <div style={{ maxWidth:1200,margin:"0 auto",padding:"24px 20px" }}>
        {/* MARKET */}
        {page==="market"&&(<>
          <div style={{ background:dark?C.darkCard:C.white,borderRadius:4,padding:"18px 24px",marginBottom:20,border:`1px solid ${dark?C.darkBorder:"#DDD9F3"}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16 }}>
            <div>
              <div style={{ fontSize:10.5,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4 }}>মার্কেটপ্লেস ওভারভিউ</div>
              <div style={{ fontSize:18,fontWeight:700,color:dark?"#E8E5F9":C.soil }}>সরাসরি কৃষক থেকে সংগ্রহকৃত পণ্য</div>
            </div>
            <div style={{ display:"flex",gap:24,flexWrap:"wrap" }}>
              {[["৩০০+","যাচাইকৃত কৃষক"],["৮","সক্রিয় জেলা"],["৫,০০০+","গ্রাহক"],["৪৮ঘ","ডেলিভারি SLA"]].map(([n,l])=>(
                <div key={l} style={{ textAlign:"right",borderLeft:`2px solid ${C.harvest}`,paddingLeft:12 }}>
                  <div style={{ fontSize:17,fontWeight:800,color:dark?"#E8E5F9":C.soil }}>{n}</div>
                  <div style={{ fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:"0.3px" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex",gap:10,marginBottom:14 }}>
            <input style={{ ...s.input,flex:1 }} placeholder="🔍 পণ্য খুঁজুন..." value={search} onChange={e=>setSearch(e.target.value)} />
            <select style={{ ...s.input,width:"auto" }} value={sortBy} onChange={e=>setSortBy(e.target.value)}>
              <option value="default">সাজান</option><option value="price_asc">মূল্য ↑</option><option value="price_desc">মূল্য ↓</option><option value="rating">রেটিং</option>
            </select>
          </div>
          <div style={{ display:"flex",gap:10,marginBottom:12,flexWrap:"wrap",alignItems:"center" }}>
            <input type="number" style={{ ...s.input,width:100 }} placeholder="কম ৳" value={minP} onChange={e=>setMinP(e.target.value)} />
            <input type="number" style={{ ...s.input,width:100 }} placeholder="বেশি ৳" value={maxP} onChange={e=>setMaxP(e.target.value)} />
            <label style={{ display:"flex",gap:6,alignItems:"center",cursor:"pointer",fontSize:13 }}>
              <input type="checkbox" checked={organicOnly} onChange={e=>setOrganicOnly(e.target.checked)} />🌿 শুধু অর্গানিক
            </label>
          </div>
          <div style={{ display:"flex",gap:7,flexWrap:"wrap",marginBottom:20 }}>
            {Object.entries(CATS).map(([k,v])=>(
              <button key={k} onClick={()=>setCat(k)} style={{ background:cat===k?C.leaf:(dark?"#160F2E":C.white),color:cat===k?C.white:C.muted,border:`1px solid ${cat===k?C.leaf:(dark?C.darkBorder:"#D6D2F0")}`,padding:"6px 14px",borderRadius:4,cursor:"pointer",fontSize:12,fontWeight:600 }}>{v}</button>
            ))}
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:16 }}>
            {filtered.map(p=>(
              <div key={p.id} style={{ ...s.card,padding:0,overflow:"hidden",cursor:"pointer",transition:"transform .2s,box-shadow .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(15,23,42,0.10)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}
                onClick={()=>setSelected(p)}>
                <div style={{ background:`${dark?"#160F2E":"#EDEBFA"}`,fontSize:56,textAlign:"center",padding:"18px 0 12px",position:"relative" }}>
                  {p.emoji}
                  {p.featured&&<div style={{ position:"absolute",top:8,left:8,background:C.harvest,color:C.white,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4 }}>⭐ ফিচার্ড</div>}
                  {p.organic&&<div style={{ position:"absolute",top:8,right:8,background:C.leaf,color:C.white,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4 }}>🌿 অর্গানিক</div>}
                </div>
                <div style={{ padding:"12px 14px 14px" }}>
                  <div style={{ fontWeight:800,fontSize:14 }}>{p.name}</div>
                  <div style={{ fontSize:11,color:C.muted }}>{p.nameEn}</div>
                  <div style={{ color:C.harvest,fontSize:11,marginTop:3 }}><Stars value={p.rating} size={12}/> <span style={{ color:C.muted }}>{p.rating} ({p.reviews})</span></div>
                  <div style={{ fontSize:11,color:C.muted,marginTop:3 }}>👨‍🌾 {USERS.find(u=>u.id===p.farmerId)?.name||"কৃষক"}</div>
                  <div style={{ fontSize:18,fontWeight:900,color:C.leaf,marginTop:6 }}>৳{p.price} <span style={{ fontSize:11,fontWeight:400,color:C.muted }}>/{p.unit}</span></div>
                  <button style={{ ...s.btn(C.leaf),width:"100%",marginTop:10,padding:"9px 0" }} onClick={e=>{e.stopPropagation();addToCart(p)}}>+ কার্টে যোগ করুন</button>
                </div>
              </div>
            ))}
            {filtered.length===0&&<div style={{ gridColumn:"1/-1",textAlign:"center",padding:60,color:C.muted }}>কোনো পণ্য পাওয়া যায়নি 😔</div>}
          </div>
          {/* Product modal */}
          {selected&&(
            <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,padding:16 }} onClick={()=>setSelected(null)}>
              <div style={{ ...s.card,maxWidth:440,width:"100%",maxHeight:"88vh",overflowY:"auto",margin:0,padding:24 }} onClick={e=>e.stopPropagation()}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                  <div style={{ fontSize:18,fontWeight:900 }}>{selected.name}</div>
                  <button onClick={()=>setSelected(null)} style={{ background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.muted }}>×</button>
                </div>
                <div style={{ fontSize:64,textAlign:"center",background:`${dark?"#160F2E":"#EDEBFA"}`,borderRadius:6,padding:"18px 0",marginBottom:14 }}>{selected.emoji}</div>
                <div style={{ fontSize:22,fontWeight:900,color:C.leaf,marginBottom:8 }}>৳{selected.price} <span style={{ fontSize:12,fontWeight:400,color:C.muted }}>/{selected.unit}</span></div>
                <p style={{ color:C.muted,fontSize:13,marginBottom:14 }}>{selected.description}</p>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:14 }}>
                  {[["👨‍🌾 কৃষক",USERS.find(u=>u.id===selected.farmerId)?.name||"—"],["📍 এলাকা",USERS.find(u=>u.id===selected.farmerId)?.location||"—"],["📦 স্টক",`${selected.stock} ${selected.unit}`],["🌿 ধরন",selected.organic?"অর্গানিক":"সাধারণ"]].map(([l,v])=>(
                    <div key={l} style={{ background:dark?"#160F2E":C.offwhite,borderRadius:4,padding:"9px 12px" }}>
                      <div style={{ fontSize:10,color:C.muted }}>{l}</div><div style={{ fontWeight:700,fontSize:13,marginTop:2 }}>{v}</div>
                    </div>
                  ))}
                </div>
                {/* Review form */}
                <div style={{ background:dark?"#160F2E":C.offwhite,borderRadius:5,padding:14,marginBottom:14 }}>
                  <div style={{ fontWeight:700,marginBottom:8,fontSize:13 }}>⭐ রিভিউ লিখুন</div>
                  <Stars value={reviewData[selected.id]?.rating||0} onChange={v=>setReviewData(p=>({...p,[selected.id]:{...p[selected.id],rating:v}}))} />
                  <textarea style={{ ...s.input,marginTop:8,minHeight:60,resize:"vertical" }} placeholder="আপনার মতামত..." value={reviewData[selected.id]?.text||""} onChange={e=>setReviewData(p=>({...p,[selected.id]:{...p[selected.id],text:e.target.value}}))} />
                  <button style={{ ...s.btn(C.blue),marginTop:8,fontSize:12 }}>✅ জমা দিন</button>
                </div>
                <button style={{ ...s.btn(C.leaf),width:"100%",padding:12,fontSize:15 }} onClick={()=>{addToCart(selected);setSelected(null)}}>🛒 কার্টে যোগ করুন</button>
              </div>
            </div>
          )}
        </>)}

        {/* CART & CHECKOUT */}
        {page==="cart"&&(
          <div>
            <h2 style={{ marginBottom:20 }}>🛒 কার্ট</h2>
            {cart.length===0?<div style={{ ...s.card,textAlign:"center",padding:60 }}><div style={{ fontSize:50 }}>🛒</div><p style={{ color:C.muted }}>কার্ট খালি</p></div>:(
              <div style={{ display:"grid",gridTemplateColumns:"1fr 320px",gap:20 }}>
                <div>
                  {cart.map(item=>(
                    <div key={item.id} style={{ ...s.card,display:"flex",gap:12,alignItems:"center" }}>
                      <span style={{ fontSize:36 }}>{item.emoji}</span>
                      <div style={{ flex:1 }}><div style={{ fontWeight:700 }}>{item.name}</div><div style={{ color:C.leaf,fontWeight:700 }}>৳{item.price}/{item.unit}</div></div>
                      <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                        <button onClick={()=>updateQty(item.id,item.qty-1)} style={{ background:dark?"#3D3470":C.offwhite,border:"none",width:26,height:26,borderRadius:4,cursor:"pointer",fontWeight:700 }}>−</button>
                        <span style={{ fontWeight:700,minWidth:18,textAlign:"center" }}>{item.qty}</span>
                        <button onClick={()=>updateQty(item.id,item.qty+1)} style={{ background:dark?"#3D3470":C.offwhite,border:"none",width:26,height:26,borderRadius:4,cursor:"pointer",fontWeight:700 }}>+</button>
                      </div>
                      <span style={{ fontWeight:900,color:C.leaf,minWidth:55,textAlign:"right" }}>৳{item.price*item.qty}</span>
                      <button onClick={()=>updateQty(item.id,0)} style={{ background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18 }}>×</button>
                    </div>
                  ))}
                </div>
                <div style={s.card}>
                  <div style={{ fontWeight:700,fontSize:15,marginBottom:14 }}>ডেলিভারি তথ্য</div>
                  {[["নাম","name","text"],["ফোন","phone","tel"],["ঠিকানা","address","text"]].map(([l,k,t])=>(
                    <div key={k} style={{ marginBottom:10 }}>
                      <label style={s.label}>{l}</label>
                      <input type={t} style={s.input} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} />
                    </div>
                  ))}
                  <label style={s.label}>পেমেন্ট</label>
                  {[["cash","💵 ক্যাশ অন ডেলিভারি"],["bkash","📱 বিকাশ"],["nagad","📱 নগদ"]].map(([v,l])=>(
                    <label key={v} style={{ display:"flex",gap:7,alignItems:"center",cursor:"pointer",padding:"7px 10px",borderRadius:4,background:form.payment===v?C.leaf+"15":"transparent",border:`1px solid ${form.payment===v?C.leaf:"transparent"}`,marginBottom:5 }}>
                      <input type="radio" name="payment" value={v} checked={form.payment===v} onChange={()=>setForm(p=>({...p,payment:v}))} />
                      <span style={{ fontWeight:form.payment===v?700:400,fontSize:13 }}>{l}</span>
                    </label>
                  ))}
                  <div style={{ borderTop:`1px solid ${dark?C.darkBorder:"#f0e8d8"}`,paddingTop:12,marginTop:8 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:13 }}><span style={{ color:C.muted }}>পণ্যের মূল্য</span><span>৳{cartTotal}</span></div>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:13 }}><span style={{ color:C.muted }}>ডেলিভারি</span><span style={{ color:C.leaf }}>বিনামূল্যে</span></div>
                    <div style={{ display:"flex",justifyContent:"space-between",fontSize:17,fontWeight:900 }}><span>মোট</span><span style={{ color:C.leaf }}>৳{cartTotal}</span></div>
                  </div>
                  <button style={{ ...s.btn(C.leaf),width:"100%",padding:12,fontSize:14,marginTop:10 }} onClick={placeOrder}>✅ অর্ডার নিশ্চিত করুন — ৳{cartTotal}</button>
                </div>
              </div>
            )}
            {orderSuccess&&(
              <div style={{ ...s.card,background:"#d4edda",textAlign:"center",padding:24 }}>
                <div style={{ fontSize:50 }}>✅</div>
                <h3 style={{ color:"#155724" }}>অর্ডার সফল হয়েছে!</h3>
                <p>অর্ডার আইডি: <strong>#{orderSuccess.id}</strong></p>
                <p style={{ color:"#155724",fontSize:13 }}>কৃষকের কাছে পাঠানো হয়েছে। শীঘ্রই ডেলিভারি হবে।</p>
              </div>
            )}
          </div>
        )}

        {/* MY ORDERS */}
        {page==="orders"&&(
          <div>
            <h2 style={{ marginBottom:20 }}>📋 আমার অর্ডার</h2>
            {myOrders.length===0?<div style={{ ...s.card,textAlign:"center",padding:60,color:C.muted }}>কোনো অর্ডার নেই</div>:
              myOrders.map(o=>(
                <div key={o.id} style={{ ...s.card }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
                    <div><div style={{ fontWeight:800,fontSize:16 }}>#{o.id}</div><div style={{ fontSize:12,color:C.muted }}>{o.created}</div></div>
                    <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                      <span style={s.badge(STATUS_COLOR[o.status]||C.muted)}>{STATUS_LABEL[o.status]||o.status}</span>
                      <button style={{ ...s.btn(C.blue),padding:"6px 12px",fontSize:12 }} onClick={()=>setTrackOrder(o)}>🔍 ট্র্যাক</button>
                    </div>
                  </div>
                  <div style={{ fontSize:13,color:C.muted,marginBottom:6 }}>📍 {o.address} · {o.payment}</div>
                  <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                    {o.items.map((item,i)=>{const p=products.find(pr=>pr.id===item.productId);return p?<span key={i} style={{ background:dark?"#160F2E":C.offwhite,borderRadius:4,padding:"4px 10px",fontSize:12 }}>{p.emoji} {p.name} ×{item.qty}</span>:null;})}
                  </div>
                  <div style={{ fontWeight:800,color:C.leaf,marginTop:8,fontSize:16 }}>মোট: ৳{o.total}</div>
                </div>
              ))
            }
          </div>
        )}

        {/* TRACK */}
        {page==="track"&&(
          <div>
            <h2 style={{ marginBottom:20 }}>🔍 অর্ডার ট্র্যাক</h2>
            <div style={{ ...s.card,marginBottom:20 }}>
              <div style={{ fontWeight:700,marginBottom:12 }}>আপনার অর্ডার আইডি দিন</div>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                {myOrders.map(o=>(
                  <button key={o.id} onClick={()=>setTrackOrder(o)} style={{ background:dark?"#160F2E":C.offwhite,border:`1px solid ${dark?C.darkBorder:"#D6D2F0"}`,borderRadius:4,padding:"7px 14px",fontSize:13,cursor:"pointer",fontWeight:600 }}>
                    #{o.id} <span style={s.badge(STATUS_COLOR[o.status]||C.muted)}>{STATUS_LABEL[o.status]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CHAT */}
        {page==="chat"&&(
          <div>
            <h2 style={{ marginBottom:20 }}>💬 কৃষকের সাথে চ্যাট</h2>
            <div style={{ ...s.card,padding:0,overflow:"hidden" }}>
              <div style={{ padding:"14px 18px",borderBottom:`1px solid ${dark?C.darkBorder:"#f0e8d8"}`,display:"flex",gap:10,alignItems:"center" }}>
                <span style={{ fontSize:28 }}>👨‍🌾</span>
                <div><div style={{ fontWeight:800 }}>রহিম উদ্দিন</div><div style={{ fontSize:11,color:C.leaf }}>● অনলাইন · গাজীপুর</div></div>
              </div>
              <div style={{ height:340,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:10 }}>
                {chatMsgs.map(m=>(
                  <div key={m.id} style={{ display:"flex",justifyContent:m.from==="customer"?"flex-end":"flex-start" }}>
                    <div style={{ maxWidth:"70%",padding:"9px 13px",borderRadius:m.from==="customer"?"4px 4px 0 4px":"4px 4px 4px 0",background:m.from==="customer"?C.leaf:(dark?"#2A2154":C.offwhite),color:m.from==="customer"?C.white:(dark?"#E8E5F9":C.soil) }}>
                      <div style={{ fontSize:13 }}>{m.text}</div>
                      <div style={{ fontSize:10,opacity:.7,marginTop:3,textAlign:"right" }}>{m.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={chatEnd}/>
              </div>
              <div style={{ padding:"12px 16px",borderTop:`1px solid ${dark?C.darkBorder:"#f0e8d8"}`,display:"flex",gap:8 }}>
                <input style={{ ...s.input,flex:1 }} placeholder="বার্তা লিখুন..." value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} />
                <button style={{ ...s.btn(C.leaf),padding:"9px 16px" }} onClick={sendChat}>পাঠান ➤</button>
              </div>
            </div>
          </div>
        )}

        {/* SUBSCRIBE */}
        {page==="subscribe"&&(
          <div>
            <div style={{ background:`linear-gradient(135deg,${C.soil},${C.leaf})`,borderRadius:4,padding:"30px 24px",marginBottom:24,color:C.white }}>
              <h2 style={{ margin:"0 0 6px",fontSize:24 }}>📦 সাপ্তাহিক সবজি বাক্স</h2>
              <p style={{ opacity:.85,margin:0,fontSize:13 }}>প্রতি সপ্তাহে তাজা সবজি আপনার দরজায়। ২০–২৫% সাশ্রয়!</p>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16 }}>
              {[{ id:1,name:"সবজি বাক্স",price:350,savings:80,emoji:"🥦",items:["🍅 টমেটো ২কেজি","🥬 শাক ২বান্ডেল","🥔 আলু ২কেজি","🧅 পেঁয়াজ ১কেজি"] },
                { id:2,name:"ফ্যামিলি বাক্স",price:650,savings:150,emoji:"👨‍👩‍👧‍👦",items:["🍅 টমেটো ৩কেজি","🥬 শাক ৩বান্ডেল","🥚 ডিম ১ডজন","🍌 কলা ১ডজন"] },
                { id:3,name:"অর্গানিক বাক্স",price:900,savings:200,emoji:"🌿",items:["🍅 জৈব টমেটো","🍯 মধু ২৫০গ্রাম","🧄 জৈব রসুন","🌶️ জৈব মরিচ"] }
              ].map(box=>(
                <div key={box.id} style={{ ...s.card,textAlign:"center",border:subDone===box.id?`2px solid ${C.leaf}`:`1px solid ${dark?C.darkBorder:"#f0e8d8"}` }}>
                  <div style={{ fontSize:48,marginBottom:10 }}>{box.emoji}</div>
                  <div style={{ fontSize:17,fontWeight:800 }}>{box.name}</div>
                  <div style={{ margin:"12px auto",textAlign:"left",background:dark?"#160F2E":C.offwhite,borderRadius:4,padding:"10px 14px" }}>
                    {box.items.map((item,i)=><div key={i} style={{ fontSize:12,marginBottom:3 }}>✓ {item}</div>)}
                  </div>
                  <div style={{ fontSize:22,fontWeight:900,color:C.leaf }}>৳{box.price}<span style={{ fontSize:12,fontWeight:400,color:C.muted }}>/সপ্তাহ</span></div>
                  <div style={{ ...s.badge(C.leaf),margin:"8px 0 14px" }}>৳{box.savings} সাশ্রয়</div>
                  <button style={{ ...s.btn(subDone===box.id?C.muted:C.leaf),width:"100%" }} onClick={()=>setSubDone(box.id)}>{subDone===box.id?"✅ সাবস্ক্রাইব করা আছে":"সাবস্ক্রাইব করুন"}</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {trackOrder&&<TrackModal order={trackOrder} onClose={()=>setTrackOrder(null)} dark={dark} />}
    </div>
  );
}
