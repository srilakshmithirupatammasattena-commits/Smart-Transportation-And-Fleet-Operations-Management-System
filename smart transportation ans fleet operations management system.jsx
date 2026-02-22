import { useState, useEffect } from "react";
const VEHICLES = [
  { id:1, vehicle_id:"TRK-001", type:"Truck",  make:"Volvo",    model:"FH16",    year:2022, plate_number:"MH-12-AB-4521", capacity:25,   fuel_level:82, fuel_status:"Full",     mileage:45230,  maintenance_status:"Operational", is_active:true },
  { id:2, vehicle_id:"BUS-007", type:"Bus",    make:"Mercedes", model:"Citaro",  year:2021, plate_number:"DL-03-CD-7812", capacity:52,   fuel_level:38, fuel_status:"Low",      mileage:102450, maintenance_status:"Due Soon",    is_active:true },
  { id:3, vehicle_id:"VAN-003", type:"Van",    make:"Ford",     model:"Transit", year:2023, plate_number:"KA-05-EF-2233", capacity:3.5,  fuel_level:12, fuel_status:"Critical", mileage:18900,  maintenance_status:"Overdue",     is_active:true },
  { id:4, vehicle_id:"TRK-005", type:"Truck",  make:"Scania",   model:"R500",    year:2020, plate_number:"TN-07-GH-9901", capacity:30,   fuel_level:65, fuel_status:"Adequate", mileage:78340,  maintenance_status:"Operational", is_active:true },
  { id:5, vehicle_id:"VAN-009", type:"Van",    make:"Mercedes", model:"Sprinter",year:2022, plate_number:"MH-01-IJ-3345", capacity:2,    fuel_level:91, fuel_status:"Full",     mileage:22100,  maintenance_status:"Operational", is_active:true },
];

const DRIVERS = [
  { id:1, full_name:"Rajesh Sharma",  role:"driver", email:"r.sharma@fleetops.in", phone:"+91 98201 12345", license_no:"DL-04-20190042312" },
  { id:2, full_name:"Priya Nair",     role:"driver", email:"p.nair@fleetops.in",   phone:"+91 90876 54321", license_no:"KA-19-20200056421" },
  { id:3, full_name:"Arjun Verma",    role:"driver", email:"a.verma@fleetops.in",  phone:"+91 88123 99876", license_no:"MH-02-20210078901" },
  { id:4, full_name:"Sneha Reddy",    role:"driver", email:"s.reddy@fleetops.in",  phone:"+91 77543 22109", license_no:"TN-09-20180034567" },
];

const ROUTES = [
  { id:1, route_code:"RT-MUM-PUN", name:"Mumbai – Pune Express",     origin:"Mumbai",    destination:"Pune",        distance_km:148, estimated_hours:2.5, waypoints:["Khopoli","Lonavala"] },
  { id:2, route_code:"RT-DEL-AGR", name:"Delhi – Agra NH2",          origin:"Delhi",     destination:"Agra",        distance_km:233, estimated_hours:4,   waypoints:["Faridabad","Mathura"] },
  { id:3, route_code:"RT-BLR-CHN", name:"Bangalore – Chennai",       origin:"Bangalore", destination:"Chennai",     distance_km:346, estimated_hours:6,   waypoints:["Vellore","Ambur"] },
  { id:4, route_code:"RT-HYD-VJA", name:"Hyderabad – Vijayawada",    origin:"Hyderabad", destination:"Vijayawada",  distance_km:274, estimated_hours:4.5, waypoints:["Nalgonda"] },
];

const INIT_TRIPS = [
  { id:1, trip_code:"TRP-A4X2F1", vehicle_id:1, driver_id:1, route_id:1, status:"In Progress", scheduled_start:"2026-02-22T07:00", scheduled_end:"2026-02-22T10:30", cargo_type:"Electronics", cargo_weight:18,  fuel_used:22.5, delay_minutes:0  },
  { id:2, trip_code:"TRP-B7K9P3", vehicle_id:2, driver_id:2, route_id:2, status:"Scheduled",   scheduled_start:"2026-02-22T14:00", scheduled_end:"2026-02-22T18:00", cargo_type:"Passengers",  cargo_weight:0,   fuel_used:0,    delay_minutes:0  },
  { id:3, trip_code:"TRP-C2M5Q8", vehicle_id:3, driver_id:3, route_id:3, status:"Delayed",     scheduled_start:"2026-02-21T09:00", scheduled_end:"2026-02-21T16:00", cargo_type:"Pharma",      cargo_weight:2.1, fuel_used:45,   delay_minutes:85 },
  { id:4, trip_code:"TRP-D9R1S4", vehicle_id:4, driver_id:4, route_id:4, status:"Completed",   scheduled_start:"2026-02-21T06:00", scheduled_end:"2026-02-21T11:00", cargo_type:"FMCG",        cargo_weight:22,  fuel_used:68,   delay_minutes:12 },
  { id:5, trip_code:"TRP-E3T6U7", vehicle_id:5, driver_id:1, route_id:1, status:"Scheduled",   scheduled_start:"2026-02-23T08:00", scheduled_end:"2026-02-23T11:00", cargo_type:"Courier",     cargo_weight:1.8, fuel_used:0,    delay_minutes:0  },
];

const INIT_ALERTS = [
  { id:1, trip_id:3,    alert_type:"Delay",       message:"TRP-C2M5Q8 delayed 85 min due to highway congestion on NH44.",         created_at:"2026-02-21T11:25" },
  { id:2, trip_id:null, alert_type:"Fuel",        message:"VAN-003 fuel critically low (12%). Immediate refuelling required.",      created_at:"2026-02-22T06:10" },
  { id:3, trip_id:null, alert_type:"Maintenance", message:"VAN-003 maintenance overdue by 3,200 km. Schedule service immediately.", created_at:"2026-02-20T09:00" },
  { id:4, trip_id:null, alert_type:"Maintenance", message:"BUS-007 scheduled maintenance due within 500 km.",                      created_at:"2026-02-22T07:30" },
  { id:5, trip_id:4,    alert_type:"Delay",       message:"TRP-D9R1S4 arrived 12 min late due to minor traffic at Nalgonda.",      created_at:"2026-02-21T11:12" },
];
const mono = { fontFamily:"'DM Mono',monospace" };

function Badge({ label }) {
  const [color,bg,border] = statusMap[label] || [C.muted,C.surface,C.border];
  return <span style={{ ...mono, background:bg, color, border:`1px solid ${border}`, padding:"3px 10px", borderRadius:4, fontSize:11, fontWeight:700, letterSpacing:"0.06em", whiteSpace:"nowrap" }}>{label}</span>;
}

function KPI({ icon, label, value, sub, accent, blink }) {
  return (
    <div style={{ background:`linear-gradient(135deg,${C.surface} 0%,#111927 100%)`, border:`1px solid ${accent}22`, borderTop:`2px solid ${accent}`, borderRadius:10, padding:"18px 20px", flex:1, minWidth:140, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", right:14, top:14, fontSize:20, opacity:0.12 }}>{icon}</div>
      <div style={{ ...mono, color:C.textDim, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:5 }}>{label}</div>
      <div style={{ ...mono, color:accent, fontSize:34, fontWeight:900, lineHeight:1, animation:blink?"pulse 2s ease-in-out infinite":undefined }}>{value}</div>
      {sub && <div style={{ ...mono, color:"#1e3e50", fontSize:10, marginTop:5 }}>{sub}</div>}
    </div>
  );
}

function FuelBar({ level }) {
  const clr = level>=75?C.green:level>=40?"#86efac":level>=15?C.yellow:C.red;
  return <div style={{display:"flex",alignItems:"center",gap:8}}>
    <div style={{flex:1,background:"#1a2030",borderRadius:3,height:5}}>
      <div style={{width:`${level}%`,background:clr,height:5,borderRadius:3,transition:"width 0.5s"}}/>
    </div>
    <span style={{...mono,color:clr,fontSize:11,width:34,textAlign:"right"}}>{level}%</span>
  </div>;
}

function MiniBar({ data }) {
  const max = Math.max(...data.map(d=>d.t),1);
  return <div style={{display:"flex",alignItems:"flex-end",gap:5,height:90,padding:"0 2px"}}>
    {data.map((d,i)=>(
      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,height:"100%"}}>
        <div style={{flex:1,width:"100%",display:"flex",alignItems:"flex-end",flexDirection:"column",justifyContent:"flex-end",gap:1}}>
          {d.d>0&&<div style={{width:"100%",height:Math.max(2,Math.round((d.d/max)*60)),background:C.orange+"70",borderRadius:"2px 2px 0 0"}}/>}
          <div style={{width:"100%",height:Math.max(2,Math.round((d.c/max)*60)),background:C.primary+"55",borderRadius: d.d>0?"0":"2px 2px 0 0"}}/>
        </div>
        <div style={{...mono,color:C.textDim,fontSize:9}}>{d.date.slice(-2)}</div>
      </div>
    ))}
  </div>;
}

const iSt = { width:"100%", background:"#0a111d", border:`1px solid ${C.faint}`, borderRadius:6, color:C.text, padding:"9px 13px", fontSize:13, outline:"none", boxSizing:"border-box", ...mono };
const lSt = { ...mono, display:"block", color:C.textMid, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:5 };

function Modal({ title, children, onClose, wide }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"#000b",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.surface,border:`1px solid ${C.borderAccent}`,borderRadius:12,width:wide?700:520,maxWidth:"100%",maxHeight:"90vh",overflow:"auto",boxShadow:"0 24px 80px #00000099"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 24px",borderBottom:`1px solid ${C.border}`}}>
          <span style={{...mono,color:C.primary,fontWeight:800,fontSize:13,letterSpacing:"0.08em"}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.textDim,fontSize:22,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:24}}>{children}</div>
      </div>
    </div>
  );
}

function Btn({ children, onClick, primary, danger, sm }) {
  return <button onClick={onClick} style={{ background:primary?C.faint:danger?"#2a0a0a":"none", border:`1px solid ${primary?C.borderAccent:danger?"#4a1a1a":C.border}`, color:primary?C.primary:danger?C.red:C.textMid, padding:sm?"5px 12px":"9px 20px", borderRadius:6, cursor:"pointer", fontSize:sm?11:12, fontWeight:700, letterSpacing:"0.05em", ...mono }}>{children}</button>;
}

function Grid2({ children }) { return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>{children}</div>; }
function Field({ label, children }) { return <div><label style={lSt}>{label}</label>{children}</div>; }
function Login({ onLogin }) {
  const [email, setEmail] = useState("admin@fleetops.in");
  const [pw, setPw] = useState("Admin@1234");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const go = () => {
    setBusy(true); setErr("");
    setTimeout(() => {
      if (email==="admin@fleetops.in" && pw==="Admin@1234")        onLogin({id:0,full_name:"Admin User",      email,role:"admin"});
      else if (email==="dispatcher@fleetops.in" && pw==="Disp@1234") onLogin({id:99,full_name:"Dispatch Demo",  email,role:"dispatcher"});
      else if (email==="driver@fleetops.in"     && pw==="Driver@1") onLogin({id:1, full_name:"Rajesh Sharma",  email,role:"driver"});
      else setErr("Invalid credentials.");
      setBusy(false);
    }, 700);
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",inset:0,backgroundImage:`linear-gradient(${C.faint}14 1px,transparent 1px),linear-gradient(90deg,${C.faint}14 1px,transparent 1px)`,backgroundSize:"48px 48px"}}/>
      <div style={{position:"fixed",top:"25%",left:"50%",transform:"translateX(-50%)",width:500,height:300,background:"radial-gradient(ellipse,#1e6fad14 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",width:400,maxWidth:"100%"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:60,height:60,borderRadius:14,background:`linear-gradient(135deg,${C.faint},#0a1a2a)`,border:`1px solid ${C.borderAccent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px"}}>🚛</div>
          <div style={{color:C.primary,fontSize:28,fontWeight:900,letterSpacing:"-0.02em",fontFamily:"'Exo 2',sans-serif"}}>FleetOps</div>
          <div style={{...mono,color:C.textDim,fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",marginTop:4}}>Transportation Management System</div>
        </div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:30,boxShadow:"0 20px 60px #00000066"}}>
          <Field label="Email Address"><input style={iSt} value={email} onChange={e=>setEmail(e.target.value)} /></Field>
          <div style={{marginTop:14,marginBottom:20}}>
            <Field label="Password"><input type="password" style={iSt} value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} /></Field>
          </div>
          {err && <div style={{...mono,background:"#2a0a0a",border:"1px solid #4a1a1a",color:C.red,borderRadius:6,padding:"10px 14px",fontSize:12,marginBottom:14}}>{err}</div>}
          <button onClick={go} disabled={busy} style={{width:"100%",background:`linear-gradient(135deg,${C.faint},#0e2a4a)`,border:`1px solid ${C.borderAccent}`,color:"#e0f0ff",padding:"12px",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:800,letterSpacing:"0.05em",fontFamily:"'Exo 2',sans-serif"}}>
            {busy?"Authenticating…":"Sign In →"}
          </button>
          <div style={{...mono,color:"#1a3a4a",fontSize:10,marginTop:14,textAlign:"center",lineHeight:2}}>
            admin@fleetops.in / Admin@1234<br/>
            dispatcher@fleetops.in / Disp@1234<br/>
            driver@fleetops.in / Driver@1
          </div>
        </div>
      </div>
    </div>
  );
}
function Dashboard() {
  const active = INIT_TRIPS.filter(t=>t.status==="In Progress").length;
  const critV  = VEHICLES.filter(v=>v.fuel_status==="Critical"||v.maintenance_status==="Overdue").length;
  return (
    <div>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:22}}>
        <KPI icon="🚛" label="Total Fleet"   value={VEHICLES.length} sub="Active vehicles"  accent={C.primary}  />
        <KPI icon="🛣️" label="Active Trips"  value={active}          sub="In progress now"  accent={C.green}   blink />
        <KPI icon="⚠️" label="Alerts"        value={INIT_ALERTS.length} sub="Need attention" accent={C.orange}  />
        <KPI icon="⛽" label="Needs Attention" value={critV}          sub="Fuel / Maintenance" accent={C.red}   />
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18,marginBottom:18}}>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:20}}>
          <div style={{...mono,color:C.muted,fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:14}}>7-Day Trip Performance</div>
          <MiniBar data={DAILY}/>
          <div style={{display:"flex",gap:16,marginTop:10}}>
            {[[C.primary+"55","Completed"],[C.orange+"70","Delayed"]].map(([bg,lbl])=>(
              <div key={lbl} style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:10,height:10,borderRadius:2,background:bg}}/>
                <span style={{...mono,color:C.textDim,fontSize:10}}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:20}}>
          <div style={{...mono,color:C.muted,fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:14}}>Live Alerts</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {INIT_ALERTS.slice(0,4).map(a=>(
              <div key={a.id} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <Badge label={a.alert_type}/>
                <span style={{color:C.textMid,fontSize:11,lineHeight:1.5}}>{a.message.substring(0,52)}…</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:20}}>
        <div style={{...mono,color:C.muted,fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:14}}>Today's Trip Board</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {INIT_TRIPS.filter(t=>t.status!=="Completed").map(t=>{
            const v=VEHICLES.find(x=>x.id===t.vehicle_id), d=DRIVERS.find(x=>x.id===t.driver_id), r=ROUTES.find(x=>x.id===t.route_id);
            return (
              <div key={t.id} style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:8,padding:"12px 16px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <span style={{...mono,color:C.textDim,fontSize:12,minWidth:110}}>{t.trip_code}</span>
                <Badge label={t.status}/>
                <span style={{color:C.text,fontSize:13,flex:1}}>{r?.origin} → {r?.destination}</span>
                <span style={{...mono,color:C.textDim,fontSize:12}}>{v?.vehicle_id}</span>
                <span style={{color:C.textMid,fontSize:12}}>{d?.full_name}</span>
                {t.delay_minutes>0&&<span style={{...mono,color:C.orange,fontSize:12}}>+{t.delay_minutes}m delay</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function Fleet({ userRole }) {
  const [veh, setVeh] = useState(VEHICLES);
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({vehicle_id:"",type:"Truck",make:"",model:"",year:2024,plate_number:"",capacity:"",fuel_level:"100"});

  const types = ["All","Truck","Bus","Van","Sedan"];
  const shown = filter==="All" ? veh : veh.filter(v=>v.type===filter);

  const fuelStatus = lvl => lvl>=75?"Full":lvl>=40?"Adequate":lvl>=15?"Low":"Critical";

  const save = () => {
    if (!form.vehicle_id||!form.plate_number||!form.capacity) return;
    const fl=+form.fuel_level, fs=fuelStatus(fl);
    if (editing) setVeh(veh.map(v=>v.id===editing.id?{...v,...form,fuel_level:fl,fuel_status:fs}:v));
    else setVeh([...veh,{...form,id:Date.now(),fuel_level:fl,fuel_status:fs,mileage:0,maintenance_status:"Operational",is_active:true}]);
    setShowAdd(false); setEditing(null);
    setForm({vehicle_id:"",type:"Truck",make:"",model:"",year:2024,plate_number:"",capacity:"",fuel_level:"100"});
  };

  const startEdit = v => { setEditing(v); setForm({...v,capacity:String(v.capacity),fuel_level:String(v.fuel_level),year:String(v.year)}); setShowAdd(true); };

  const canEdit = ["admin","dispatcher"].includes(userRole);

  return (
    <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18,alignItems:"center"}}>
        {types.map(t=><button key={t} onClick={()=>setFilter(t)} style={{...mono,background:filter===t?C.faint:"none",border:`1px solid ${filter===t?C.borderAccent:C.border}`,color:filter===t?C.primary:C.muted,padding:"6px 14px",borderRadius:6,cursor:"pointer",fontSize:12}}>{t}</button>)}
        {userRole==="admin"&&<Btn primary onClick={()=>{setEditing(null);setShowAdd(true);}}>+ Add Vehicle</Btn>}
      </div>

      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",...mono,fontSize:12}}>
          <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
            {["ID","Type","Make / Model","Plate","Capacity","Fuel Level","Fuel Status","Maintenance",canEdit?"Actions":""].map(h=>(
              <th key={h} style={{color:C.textDim,padding:"10px 14px",textAlign:"left",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {shown.map((v,i)=>(
              <tr key={v.id} style={{borderBottom:`1px solid #0d1520`,background:i%2===0?C.surfaceAlt:"transparent"}}>
                <td style={{padding:"12px 14px",color:C.primary,fontWeight:700}}>{v.vehicle_id}</td>
                <td style={{padding:"12px 14px",color:C.textMid}}>{v.type}</td>
                <td style={{padding:"12px 14px",color:C.text}}>{v.make} {v.model} <span style={{color:C.textDim}}>({v.year})</span></td>
                <td style={{padding:"12px 14px",color:C.muted}}>{v.plate_number}</td>
                <td style={{padding:"12px 14px",color:C.textMid}}>{v.capacity}t</td>
                <td style={{padding:"12px 14px",minWidth:130}}><FuelBar level={v.fuel_level}/></td>
                <td style={{padding:"12px 14px"}}><Badge label={v.fuel_status}/></td>
                <td style={{padding:"12px 14px"}}><Badge label={v.maintenance_status}/></td>
                {canEdit&&<td style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <Btn sm onClick={()=>startEdit(v)}>Edit</Btn>
                    {userRole==="admin"&&<Btn sm danger onClick={()=>setVeh(veh.filter(x=>x.id!==v.id))}>Del</Btn>}
                  </div>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd&&<Modal title={editing?"Edit Vehicle":"Add Vehicle"} onClose={()=>{setShowAdd(false);setEditing(null);}}>
        <Grid2>
          <Field label="Vehicle ID"><input style={iSt} value={form.vehicle_id} onChange={e=>setForm({...form,vehicle_id:e.target.value})} placeholder="TRK-010"/></Field>
          <Field label="Type"><select style={iSt} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
            {["Truck","Bus","Van","Sedan"].map(t=><option key={t}>{t}</option>)}
          </select></Field>
          <Field label="Make"><input style={iSt} value={form.make} onChange={e=>setForm({...form,make:e.target.value})}/></Field>
          <Field label="Model"><input style={iSt} value={form.model} onChange={e=>setForm({...form,model:e.target.value})}/></Field>
          <Field label="Plate Number"><input style={iSt} value={form.plate_number} onChange={e=>setForm({...form,plate_number:e.target.value})}/></Field>
          <Field label="Year"><input type="number" style={iSt} value={form.year} onChange={e=>setForm({...form,year:e.target.value})}/></Field>
          <Field label="Capacity (tons)"><input type="number" style={iSt} value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})}/></Field>
          <Field label="Fuel Level (%)"><input type="number" style={iSt} min="0" max="100" value={form.fuel_level} onChange={e=>setForm({...form,fuel_level:e.target.value})}/></Field>
        </Grid2>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}>
          <Btn onClick={()=>{setShowAdd(false);setEditing(null);}}>Cancel</Btn>
          <Btn primary onClick={save}>Save Vehicle</Btn>
        </div>
      </Modal>}
    </div>
  );
}
function RoutesView({ userRole }) {
  const [routes, setRoutes] = useState(ROUTES);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({route_code:"",name:"",origin:"",destination:"",distance_km:"",estimated_hours:"",waypoints:""});

  const save = () => {
    if (!form.name||!form.origin) return;
    setRoutes([...routes,{...form,id:Date.now(),distance_km:+form.distance_km,estimated_hours:+form.estimated_hours,waypoints:form.waypoints.split(",").map(w=>w.trim()).filter(Boolean)}]);
    setShowAdd(false); setForm({route_code:"",name:"",origin:"",destination:"",distance_km:"",estimated_hours:"",waypoints:""});
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:18}}>
        {["admin","dispatcher"].includes(userRole)&&<Btn primary onClick={()=>setShowAdd(true)}>+ Add Route</Btn>}
      </div>
      <div style={{display:"grid",gap:12}}>
        {routes.map(r=>(
          <div key={r.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"18px 22px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                  <span style={{...mono,color:C.textDim,fontSize:12}}>{r.route_code}</span>
                  <span style={{color:C.text,fontWeight:700,fontSize:15}}>{r.name}</span>
                </div>
                <div style={{color:C.primary,fontSize:14}}>{r.origin} <span style={{color:C.faint}}>→</span> {r.destination}</div>
                {r.waypoints?.length>0&&<div style={{...mono,color:C.muted,fontSize:11,marginTop:5}}>via {r.waypoints.join(" → ")}</div>}
              </div>
              <div style={{display:"flex",gap:24}}>
                {[["DISTANCE",`${r.distance_km}km`],["EST. TIME",`${r.estimated_hours}hr`]].map(([k,v])=>(
                  <div key={k} style={{textAlign:"right"}}>
                    <div style={{...mono,color:C.textDim,fontSize:10,letterSpacing:"0.12em"}}>{k}</div>
                    <div style={{color:C.text,fontSize:20,fontWeight:900}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {showAdd&&<Modal title="Add New Route" onClose={()=>setShowAdd(false)}>
        <Grid2>
          <Field label="Route Code"><input style={iSt} value={form.route_code} onChange={e=>setForm({...form,route_code:e.target.value})} placeholder="RT-MUM-PUN"/></Field>
          <Field label="Route Name"><input style={iSt} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
          <Field label="Origin"><input style={iSt} value={form.origin} onChange={e=>setForm({...form,origin:e.target.value})}/></Field>
          <Field label="Destination"><input style={iSt} value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})}/></Field>
          <Field label="Distance (km)"><input type="number" style={iSt} value={form.distance_km} onChange={e=>setForm({...form,distance_km:e.target.value})}/></Field>
          <Field label="Est. Hours"><input type="number" style={iSt} value={form.estimated_hours} onChange={e=>setForm({...form,estimated_hours:e.target.value})}/></Field>
        </Grid2>
        <div style={{marginTop:14}}>
          <Field label="Waypoints (comma-separated)"><input style={iSt} value={form.waypoints} onChange={e=>setForm({...form,waypoints:e.target.value})} placeholder="Khopoli, Lonavala"/></Field>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}>
          <Btn onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn primary onClick={save}>Save Route</Btn>
        </div>
      </Modal>}
    </div>
  );
}
function TripsView({ user }) {
  const [trips, setTrips] = useState(INIT_TRIPS);
  const [open, setOpen] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [statusEdit, setStatusEdit] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [form, setForm] = useState({vehicle_id:"1",driver_id:"1",route_id:"1",scheduled_start:"",scheduled_end:"",cargo_type:"",cargo_weight:""});

  const create = () => {
    if (!form.scheduled_start||!form.scheduled_end) return;
    const code="TRP-"+Math.random().toString(36).substring(2,8).toUpperCase();
    setTrips([...trips,{...form,id:Date.now(),trip_code:code,vehicle_id:+form.vehicle_id,driver_id:+form.driver_id,route_id:+form.route_id,status:"Scheduled",fuel_used:0,delay_minutes:0}]);
    setShowAdd(false);
  };

  const applyStatus = () => {
    setTrips(trips.map(t=>t.id===statusEdit.id?{...t,status:newStatus}:t));
    setStatusEdit(null);
  };

  const visible = user.role==="driver" ? trips.filter(t=>t.driver_id===user.id) : trips;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:18}}>
        {["admin","dispatcher"].includes(user.role)&&<Btn primary onClick={()=>setShowAdd(true)}>+ Schedule Trip</Btn>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {visible.map(t=>{
          const v=VEHICLES.find(x=>x.id===t.vehicle_id), dr=DRIVERS.find(x=>x.id===t.driver_id), r=ROUTES.find(x=>x.id===t.route_id);
          const isOpen=open===t.id;
          return (
            <div key={t.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 20px",cursor:"pointer"}} onClick={()=>setOpen(isOpen?null:t.id)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{...mono,color:C.textDim,fontSize:12}}>{t.trip_code}</span>
                  <Badge label={t.status}/>
                </div>
                <div style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{color:C.text,fontSize:13}}>{r?.origin} → {r?.destination}</span>
                  <span style={{...mono,color:C.muted,fontSize:12}}>{v?.vehicle_id}</span>
                  <span style={{color:C.textMid,fontSize:12}}>{dr?.full_name}</span>
                  {t.delay_minutes>0&&<span style={{...mono,color:C.orange,fontSize:12}}>+{t.delay_minutes}m</span>}
                </div>
              </div>
              {isOpen&&(
                <div style={{marginTop:16,borderTop:`1px solid ${C.border}`,paddingTop:16}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:10,marginBottom:14}}>
                    {[
                      ["Sched. Start",new Date(t.scheduled_start).toLocaleString()],
                      ["Sched. End",  new Date(t.scheduled_end).toLocaleString()],
                      ["Cargo Type",  t.cargo_type||"—"],
                      ["Cargo Wt.",   t.cargo_weight?t.cargo_weight+"t":"—"],
                      ["Fuel Used",   t.fuel_used+"L"],
                      ["Delay",       t.delay_minutes?t.delay_minutes+"min":"None"],
                    ].map(([k,val])=>(
                      <div key={k} style={{background:C.surfaceAlt,borderRadius:6,padding:"10px 14px"}}>
                        <div style={{...mono,color:C.textDim,fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:3}}>{k}</div>
                        <div style={{color:C.text,fontSize:12}}>{val}</div>
                      </div>
                    ))}
                  </div>
                  {(user.role!=="driver"||(user.role==="driver"&&t.driver_id===user.id))&&t.status!=="Completed"&&t.status!=="Cancelled"&&(
                    <Btn onClick={e=>{e.stopPropagation();setStatusEdit(t);setNewStatus(t.status);}}>Update Status</Btn>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAdd&&<Modal title="Schedule New Trip" wide onClose={()=>setShowAdd(false)}>
        <Grid2>
          <Field label="Vehicle">
            <select style={iSt} value={form.vehicle_id} onChange={e=>setForm({...form,vehicle_id:e.target.value})}>
              {VEHICLES.map(v=><option key={v.id} value={v.id}>{v.vehicle_id} — {v.type}</option>)}
            </select>
          </Field>
          <Field label="Driver">
            <select style={iSt} value={form.driver_id} onChange={e=>setForm({...form,driver_id:e.target.value})}>
              {DRIVERS.map(d=><option key={d.id} value={d.id}>{d.full_name}</option>)}
            </select>
          </Field>
          <div style={{gridColumn:"span 2"}}>
            <Field label="Route">
              <select style={iSt} value={form.route_id} onChange={e=>setForm({...form,route_id:e.target.value})}>
                {ROUTES.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Start Date & Time"><input type="datetime-local" style={iSt} value={form.scheduled_start} onChange={e=>setForm({...form,scheduled_start:e.target.value})}/></Field>
          <Field label="End Date & Time"><input type="datetime-local" style={iSt} value={form.scheduled_end} onChange={e=>setForm({...form,scheduled_end:e.target.value})}/></Field>
          <Field label="Cargo Type"><input style={iSt} value={form.cargo_type} onChange={e=>setForm({...form,cargo_type:e.target.value})} placeholder="e.g. Electronics"/></Field>
          <Field label="Cargo Weight (t)"><input type="number" style={iSt} value={form.cargo_weight} onChange={e=>setForm({...form,cargo_weight:e.target.value})}/></Field>
        </Grid2>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}>
          <Btn onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn primary onClick={create}>Schedule Trip</Btn>
        </div>
      </Modal>}

      {statusEdit&&<Modal title={`Update Status — ${statusEdit.trip_code}`} onClose={()=>setStatusEdit(null)}>
        <Field label="New Status">
          <select style={iSt} value={newStatus} onChange={e=>setNewStatus(e.target.value)}>
            {["Scheduled","In Progress","Completed","Delayed","Cancelled"].map(s=><option key={s}>{s}</option>)}
          </select>
        </Field>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}>
          <Btn onClick={()=>setStatusEdit(null)}>Cancel</Btn>
          <Btn primary onClick={applyStatus}>Update</Btn>
        </div>
      </Modal>}
    </div>
  );
}

// ── Alerts ─────────────────────────────────────────────────────────────────────
function AlertsView() {
  const [alerts, setAlerts] = useState(INIT_ALERTS);
  const icons = {Delay,Breakdown,Fuel,Maintenance,Info};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <span style={{...mono,color:C.textMid,fontSize:12}}>{alerts.length} active alert{alerts.length!==1?"s":""}</span>
        {alerts.length>0&&<Btn onClick={()=>setAlerts([])}>Dismiss All</Btn>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {alerts.map(a=>{
          const [clr,,border]=statusMap[a.alert_type]||[C.muted,C.surface,C.border];
          return <div key={a.id} style={{background:C.surface,border:`1px solid ${border}`,borderLeft:`3px solid ${clr}`,borderRadius:10,padding:"16px 20px",display:"flex",gap:14,alignItems:"flex-start"}}>
            <span style={{fontSize:20,flexShrink:0}}>{icons[a.alert_type]}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:10,marginBottom:6}}>
                <Badge label={a.alert_type}/>
                <span style={{...mono,color:C.textDim,fontSize:10}}>{new Date(a.created_at).toLocaleString()}</span>
              </div>
              <div style={{color:C.textMid,fontSize:13,lineHeight:1.5}}>{a.message}</div>
            </div>
            <button onClick={()=>setAlerts(alerts.filter(x=>x.id!==a.id))} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",fontSize:18}}>×</button>
          </div>;
        })}
        {!alerts.length&&<div style={{textAlign:"center",padding:60,...mono,color:C.faint}}><div style={{fontSize:36,marginBottom:10}}>✓</div>All clear — no active alerts</div>}
      </div>
    </div>
  );
}

function ReportsView() {
  const tot = DAILY.reduce((a,d)=>({t:a.t+d.t,c:a.c+d.c,d:a.d+d.d,f:a.f+d.f}),{t:0,c:0,d:0,f:0});
  return (
    <div>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:22}}>
        <KPI icon="Total Trips (7d)"  value={tot.t}         accent={C.primary}/>
        <KPI icon="Completed"           value={tot.c}         sub={`${Math.round(tot.c/tot.t*100)}% success`} accent={C.green}/>
        <KPI icon="Delayed"             value={tot.d}         sub="Incidents" accent={C.orange}/>
        <KPI icon="Fuel Used (7d)"      value={`${tot.f}L`}   accent={C.purple}/>
      </div>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:20}}>
        <div style={{...mono,color:C.muted,fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:18}}>Daily Performance Breakdown</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",...mono,fontSize:12}}>
            <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
              {["Date","Total","Completed","Delayed","Cancelled","Fuel (L)","Avg Delay","Utilization"].map(h=>(
                <th key={h} style={{color:C.textDim,padding:"8px 14px",textAlign:"left",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {DAILY.map((d,i)=>(
                <tr key={i} style={{borderBottom:`1px solid #0d1520`,background:i%2===0?C.surfaceAlt:"transparent"}}>
                  <td style={{padding:"11px 14px",color:C.primary}}>{d.date}</td>
                  <td style={{padding:"11px 14px",color:C.text,fontWeight:700}}>{d.t}</td>
                  <td style={{padding:"11px 14px",color:C.green}}>{d.c}</td>
                  <td style={{padding:"11px 14px",color:C.orange}}>{d.d}</td>
                  <td style={{padding:"11px 14px",color:C.red}}>{d.x}</td>
                  <td style={{padding:"11px 14px",color:C.textMid}}>{d.f}L</td>
                  <td style={{padding:"11px 14px",color:d.ad>20?C.orange:C.textMid}}>{d.ad}m</td>
                  <td style={{padding:"11px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{flex:1,background:"#1a2030",borderRadius:3,height:5,minWidth:60}}>
                        <div style={{width:`${d.u}%`,background:"#3b82f680",height:5,borderRadius:3}}/>
                      </div>
                      <span style={{color:C.textMid,fontSize:11}}>{d.u}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [time, setTime] = useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);

  if (!user) return <Login onLogin={u=>{setUser(u);setTab("dashboard");}}/>;

  const allTabs = [
    {id:"dashboard",label:"Dashboard",icon:"◈",roles:["admin","dispatcher","driver"]},
    {id:"fleet",    label:"Fleet",    icon:"🚛",roles:["admin","dispatcher","driver"]},
    {id:"routes",   label:"Routes",   icon:"🗺",roles:["admin","dispatcher","driver"]},
    {id:"trips",    label:"Trips",    icon:"📍",roles:["admin","dispatcher","driver"]},
    {id:"alerts",   label:"Alerts",   icon:"🔔",roles:["admin","dispatcher"]},
    {id:"reports",  label:"Reports",  icon:"📊",roles:["admin","dispatcher"]},
  ];
  const tabs = allTabs.filter(t=>t.roles.includes(user.role));
  const roleC = {admin:C.red,dispatcher:C.yellow,driver:C.green};

  const subtitles = {
    dashboard:"OPERATIONS OVERVIEW",fleet:"FLEET ASSET MANAGEMENT",
    routes:"ROUTE CONFIGURATION",trips:"TRIP SCHEDULING & TRACKING",
    alerts:"OPERATIONAL ALERTS",reports:"PERFORMANCE ANALYTICS",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Exo+2:wght@600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;}body{margin:0;background:${C.bg};}
        ::-webkit-scrollbar{width:5px;height:5px;} ::-webkit-scrollbar-track{background:${C.surface};}
        ::-webkit-scrollbar-thumb{background:${C.faint};border-radius:3px;}
        input[type=datetime-local]::-webkit-calendar-picker-indicator,input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.3);}
        select option{background:${C.surface};}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>
      <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Exo 2',sans-serif",display:"flex",flexDirection:"column"}}>
        <div style={{position:"fixed",inset:0,backgroundImage:`linear-gradient(${C.faint}10 1px,transparent 1px),linear-gradient(90deg,${C.faint}10 1px,transparent 1px)`,backgroundSize:"48px 48px",pointerEvents:"none",zIndex:0}}/>
        <div style={{position:"fixed",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${C.borderAccent}60,transparent)`,zIndex:1}}/>

        <header style={{position:"sticky",top:0,zIndex:100,background:`${C.bg}e8`,backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",height:56,gap:14,maxWidth:1400,margin:"0 auto",padding:"0 20px",width:"100%"}}>
            <div style={{display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
              <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${C.faint},#0a1a2a)`,border:`1px solid ${C.borderAccent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🚛</div>
              <div>
                <div style={{color:C.primary,fontWeight:900,fontSize:14,letterSpacing:"-0.02em",lineHeight:1}}>FleetOps</div>
                <div style={{...mono,color:C.textDim,fontSize:8,letterSpacing:"0.18em",textTransform:"uppercase"}}>Fleet Mgmt</div>
              </div>
            </div>

            <nav style={{display:"flex",gap:2,overflowX:"auto",flex:1}}>
              {tabs.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{...mono,background:tab===t.id?C.faint:"none",border:`1px solid ${tab===t.id?C.borderAccent:"transparent"}`,color:tab===t.id?C.primary:C.muted,padding:"5px 12px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:700,whiteSpace:"nowrap",transition:"all 0.15s"}}>
                  {t.icon} {t.label}
                </button>
              ))}
            </nav>

            <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
              <div style={{textAlign:"right"}}>
                <div style={{...mono,color:roleC[user.role]||C.primary,fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em"}}>{user.role}</div>
                <div style={{...mono,color:C.textDim,fontSize:10}}>{time.toLocaleTimeString()}</div>
              </div>
              <div style={{width:30,height:30,borderRadius:8,background:C.faint,border:`1px solid ${C.borderAccent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>👤</div>
              <button onClick={()=>setUser(null)} style={{...mono,background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:10}}>Logout</button>
            </div>
          </div>
        </header>

        <main style={{position:"relative",zIndex:1,flex:1,maxWidth:1400,margin:"0 auto",width:"100%",padding:"24px 20px"}}>
          <div style={{marginBottom:20}}>
            <h1 style={{margin:0,fontSize:20,fontWeight:900,color:C.text,letterSpacing:"-0.02em"}}>{tabs.find(t=>t.id===tab)?.label}</h1>
            <div style={{...mono,color:C.textDim,fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",marginTop:3}}>{subtitles[tab]}</div>
          </div>
          {tab==="dashboard"&&<Dashboard/>}
          {tab==="fleet"    &&<Fleet      userRole={user.role}/>}
          {tab==="routes"   &&<RoutesView userRole={user.role}/>}
          {tab==="trips"    &&<TripsView  user={user}/>}
          {tab==="alerts"   &&<AlertsView/>}
          {tab==="reports"  &&<ReportsView/>}
        </main>
      </div>
    </>
  );
}
