import { useState, useEffect } from "react";

const TYPE_CONFIG = {
  instructional: { color:"#1a5cbf", bg:"#dbeafe", darkBg:"#1e3a5f", label:"Instructional Day",  short:"Class"     },
  holiday:       { color:"#dc2626", bg:"#fee2e2", darkBg:"#5f1e1e", label:"Holiday",             short:"Holiday"   },
  midsem:        { color:"#7c3aed", bg:"#ede9fe", darkBg:"#3b1a6e", label:"Mid Semester Exam",   short:"Mid Sem"   },
  endsem:        { color:"#b45309", bg:"#fef3c7", darkBg:"#5f3a0a", label:"End Semester Exam",   short:"End Sem"   },
  event:         { color:"#059669", bg:"#d1fae5", darkBg:"#0a3d2a", label:"Event",               short:"Event"     },
  important:     { color:"#c026d3", bg:"#fae8ff", darkBg:"#4a0a52", label:"Important Date",      short:"Important" },
  weekend:       { color:"#9ca3af", bg:"transparent",               label:"Weekend",             short:""          },
};

const MONTHS = [
  { label:"Jul 2026", year:2026, month:6  },
  { label:"Aug 2026", year:2026, month:7  },
  { label:"Sep 2026", year:2026, month:8  },
  { label:"Oct 2026", year:2026, month:9  },
  { label:"Nov 2026", year:2026, month:10 },
  { label:"Dec 2026", year:2026, month:11 },
];

const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getDaysInMonth(y,m){ return new Date(y,m+1,0).getDate(); }
function getFirstDay(y,m)   { return new Date(y,m,1).getDay(); }
function toStr(y,m,d)       { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

// Priority order for when multiple types exist on same date
const PRIORITY = ["endsem","midsem","holiday","event","important","instructional"];

export default function AcademicCalendar({ data, setData, isAdmin, T, isMobile }) {
  const calData = data.academicCalendar || null;
  const hiddenKeyDates = new Set(data.hiddenKeyDates || []);
  const keyDates = (calData?.days||[])
  .filter(e => e.type!=="instructional")
  .filter(e => !hiddenKeyDates.has(`${e.date}||${e.type}||${e.label}`))
  .sort((a,b)=>a.date.localeCompare(b.date))
  .reduce((acc,e)=>{
    const k=`${e.date}||${e.type}||${e.label}`;
    if(!acc.seen.has(k)){acc.seen.add(k);acc.list.push(e);}
    return acc;
  },{seen:new Set(),list:[]}).list;

  const deleteKeyDate = (date, type, label) => {
  const key     = `${date}||${type}||${label}`;
  const updated = [...(data.hiddenKeyDates||[]), key];
  setData({...data, hiddenKeyDates: updated});
};
  const today   = new Date().toISOString().slice(0,10);

  // Default to current month if within semester, else first month
  const defaultMonthIdx = () => {
    const now = new Date();
    for (let i = 0; i < MONTHS.length; i++) {
      const { year, month } = MONTHS[i];
      if (now.getFullYear() === year && now.getMonth() === month) return i;
    }
    return 0;
  };

  const [editIdx,  setEditIdx]  = useState(null);
  const [editForm, setEditForm] = useState({ date:"", type:"instructional", label:"" });
  const [selMonth,    setSelMonth]    = useState(defaultMonthIdx);
  const [tooltip,     setTooltip]     = useState(null);
  const [showKeyDates,setShowKeyDates]= useState(false);
  const [showLegend,  setShowLegend]  = useState(false);
  const [showAdd,     setShowAdd]     = useState(false);
  const [addForm,     setAddForm]     = useState({ date:"", type:"instructional", label:"" });

  const { year, month } = MONTHS[selMonth];

  // Auto-show today's tooltip on mount / month change
  useEffect(() => {
    const todayMonth = new Date(today+"T00:00:00").getMonth();
    if (todayMonth === month) {
      const todayDay = new Date(today+"T00:00:00").getDate();
      const entries  = (calData?.days||[]).filter(e=>e.date===today);
      setTooltip({ date:today, entries, day:todayDay });
    } else {
      setTooltip(null);
    }
  }, [selMonth, calData]);

  // Build date map
  const dayMap = {};
  (calData?.days||[]).forEach(e => {
    if (!dayMap[e.date]) dayMap[e.date] = [];
    if (!dayMap[e.date].find(x=>x.type===e.type && x.label===e.label))
      dayMap[e.date].push(e);
  });

  const getPrimary = (dateStr) => {
    const entries = dayMap[dateStr]||[];
    for (const p of PRIORITY) { if (entries.find(e=>e.type===p)) return p; }
    return null;
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDay(year, month);
  const cells       = [];
  for (let i=0;i<firstDay;i++) cells.push(null);
  for (let d=1;d<=daysInMonth;d++) cells.push(d);
  while (cells.length%7!==0) cells.push(null);

  const saveEntry = () => {
    if (!addForm.date||!addForm.type) return;
    const updated = [...(calData?.days||[]), { date:addForm.date, type:addForm.type, label:addForm.label }];
    setData({...data, academicCalendar:{...(calData||{}), days:updated}});
    setShowAdd(false);
    setAddForm({date:"",type:"instructional",label:""});
  };

  const saveEdit = () => {
    const target = sortedKeyDates[editIdx];
    if (!target) return;
    const updated = (calData?.days||[]).map(e =>
      e.date===target.date && e.type===target.type && e.label===target.label
        ? { ...editForm } : e
    );
    setData({...data, academicCalendar:{...(calData||{}), days:updated}});
    setEditIdx(null);
  };

  const deleteEntry = (date, type, label) => {
    const updated = (calData?.days||[]).filter(e=>!(e.date===date&&e.type===type&&e.label===label));
    setData({...data, academicCalendar:{...(calData||{}), days:updated}});
    setTooltip(prev => prev ? {...prev, entries: prev.entries.filter(e=>!(e.type===type&&e.label===label))} : null);
  };

  const inputS = {
    width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
    padding:"9px 12px", fontSize:14, boxSizing:"border-box",
    background:T.inputBg, color:T.text, fontFamily:"inherit", marginBottom:8, display:"block",
  };
  const labelS = { fontSize:11, fontWeight:600, color:T.muted, marginBottom:4,
    textTransform:"uppercase", letterSpacing:.5, display:"block" };

  // Key dates — deduplicated, non-instructional, sorted
  const sortedKeyDates = [...keyDates]
    .sort((a,b) => a.date.localeCompare(b.date));

  return (
    <div>
      {/* Header */}
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:20,fontWeight:800,color:T.navy,margin:0,marginBottom:3,letterSpacing:-.3}}>
          Academic Calendar
        </h2>
        <p style={{fontSize:13,color:T.muted,margin:0}}>
          {calData?.semester||"Monsoon 2026-27"} — tap any date for details
        </p>
      </div>

      {/* Controls */}
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <select value={selMonth} onChange={e=>setSelMonth(Number(e.target.value))}
          style={{border:`1.5px solid ${T.border}`,borderRadius:9,padding:"8px 12px",
            fontSize:14,background:T.inputBg,color:T.text,fontFamily:"inherit",fontWeight:700,cursor:"pointer"}}>
          {MONTHS.map((m,i)=><option key={i} value={i}>{m.label}</option>)}
        </select>
        <button onClick={()=>setShowLegend(s=>!s)}
          style={{background:T.light,border:`1px solid ${T.border}`,borderRadius:9,
            padding:"8px 12px",fontSize:12,fontWeight:700,color:T.navy,cursor:"pointer"}}>
          {showLegend?"Hide":"Show"} Legend
        </button>
        {isAdmin && (
          <button onClick={()=>setShowAdd(s=>!s)}
            style={{background:T.navy,color:"#fff",border:"none",borderRadius:9,
              padding:"8px 14px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
            + Add Date
          </button>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
          {Object.entries(TYPE_CONFIG).filter(([k])=>k!=="weekend").map(([type,cfg])=>(
            <div key={type} style={{display:"flex",alignItems:"center",gap:5,
              background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"5px 10px"}}>
              <div style={{width:11,height:11,borderRadius:3,background:cfg.color,flexShrink:0}}/>
              <span style={{fontSize:11,fontWeight:600,color:T.text}}>{cfg.label}</span>
            </div>
          ))}
          <div style={{display:"flex",alignItems:"center",gap:5,
            background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"5px 10px"}}>
            <div style={{width:11,height:11,borderRadius:3,background:"#dc2626",flexShrink:0}}/>
            <span style={{fontSize:11,fontWeight:600,color:T.text}}>Weekend</span>
          </div>
        </div>
      )}
      
      {/* Add form */}
      {showAdd && isAdmin && (
        <div style={{background:T.surface2,border:`1.5px solid ${T.border}`,
          borderRadius:12,padding:16,marginBottom:16}}>
          <div style={{fontWeight:700,color:T.navy,marginBottom:12,fontSize:14}}>Add Calendar Date</div>
          <label style={labelS}>Date</label>
          <input type="date" value={addForm.date} onChange={e=>setAddForm(p=>({...p,date:e.target.value}))} style={inputS}/>
          <label style={labelS}>Type</label>
          <select value={addForm.type} onChange={e=>setAddForm(p=>({...p,type:e.target.value}))} style={inputS}>
            {Object.entries(TYPE_CONFIG).filter(([k])=>k!=="weekend").map(([k,v])=>(
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <label style={labelS}>Label (optional)</label>
          <input value={addForm.label} onChange={e=>setAddForm(p=>({...p,label:e.target.value}))}
            placeholder="e.g. Independence Day" style={inputS}/>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button onClick={saveEntry}
              style={{background:T.navy,color:"#fff",border:"none",borderRadius:8,
                padding:"8px 14px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Save</button>
            <button onClick={()=>setShowAdd(false)}
              style={{background:T.light,color:T.text,border:"none",borderRadius:8,
                padding:"8px 14px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}

      {/* Calendar grid */}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,
        borderRadius:14,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,48,135,.06)"}}>

        {/* Month title */}
        <div style={{background:T.navy,padding:"12px 16px",textAlign:"center"}}>
          <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>{MONTHS[selMonth].label}</div>
        </div>

        {/* Day headers */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",
          background:T.surface2,borderBottom:`1px solid ${T.border}`}}>
          {DOW.map(d=>(
            <div key={d} style={{padding:"8px 0",textAlign:"center",
              fontSize:11,fontWeight:700,
              color: d==="Sun"||d==="Sat" ? "#dc2626" : T.muted,
              textTransform:"uppercase",letterSpacing:.8}}>
              {d}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
          {cells.map((day,idx)=>{
            if (!day) return (
              <div key={idx} style={{minHeight:isMobile?44:60,
                borderRight:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,
                background:T.surface2,opacity:.25}}/>
            );

            const dateStr    = toStr(year,month,day);
            const isWeekend  = idx%7===0 || idx%7===6;
            const isToday    = dateStr===today;
            const isSel      = tooltip?.date===dateStr;
            const primaryType= getPrimary(dateStr);
            const entries    = dayMap[dateStr]||[];
            const cfg        = primaryType ? TYPE_CONFIG[primaryType] : null;
            const isHoliday  = isWeekend || primaryType==="holiday";

            // Background
            let bgColor = isToday
              ? T.navy
              : cfg
                ? cfg.bg
                : isWeekend
                  ? "#fee2e2"  // red tint for weekends
                  : T.surface;

            let textColor = isToday
              ? "#fff"
              : isHoliday && !cfg
                ? "#dc2626"
                : cfg
                  ? cfg.color
                  : T.text;

            // Border for today or selected
            let borderStyle = "none";
            if (isToday) {
              const darkerColor = cfg ? cfg.color : T.navy;
              borderStyle = `2px solid ${darkerColor === T.navy ? "#60a5fa" : darkerColor}`;
            } else if (isSel) {
              borderStyle = `2px solid ${T.navy}`;
            }

            return (
              <div key={idx}
                onClick={()=>{
                  if (isSel && !isToday) { setTooltip(null); return; }
                  setTooltip({date:dateStr, entries, day});
                }}
                style={{
                  minHeight: isMobile?44:60,
                  borderRight:`1px solid ${T.border}`,
                  borderBottom:`1px solid ${T.border}`,
                  background: bgColor,
                  cursor:"pointer",
                  position:"relative",
                  transition:"filter .1s",
                  display:"flex",flexDirection:"column",
                  alignItems:"center",justifyContent:"flex-start",
                  padding:"5px 2px 3px",
                  outline: borderStyle,
                  outlineOffset:"-2px",
                  boxSizing:"border-box",
                }}
                onMouseEnter={e=>{if(!isMobile)e.currentTarget.style.filter="brightness(.92)";}}
                onMouseLeave={e=>{e.currentTarget.style.filter="none";}}
              >
                {/* Day number */}
                <div style={{
                  fontSize:isMobile?12:13,
                  fontWeight: isToday||entries.length>0 ? 800 : 400,
                  color: textColor,
                  lineHeight:1,
                }}>
                  {day}
                </div>

                {/* Colour dots */}
                {entries.length>0 && !isToday && (
                  <div style={{display:"flex",gap:2,marginTop:3,flexWrap:"wrap",justifyContent:"center"}}>
                    {[...new Set(entries.map(e=>e.type))].slice(0,3).map((t,i)=>(
                      <div key={i} style={{width:5,height:5,borderRadius:"50%",
                        background:TYPE_CONFIG[t]?.color||"#555",flexShrink:0}}/>
                    ))}
                  </div>
                )}

                {/* Short label — desktop only */}
                {!isMobile && cfg && !isToday && (
                  <div style={{fontSize:9,fontWeight:700,color:textColor,
                    marginTop:2,textAlign:"center",lineHeight:1.2,
                    maxWidth:"100%",overflow:"hidden",opacity:.85}}>
                    {isWeekend && !cfg ? "Off" : cfg.short}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail card */}
      {tooltip && (
        <div style={{marginTop:12,background:T.surface,border:`1.5px solid ${T.border}`,
          borderRadius:12,padding:"14px 16px",animation:"fadeIn .15s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontWeight:800,fontSize:15,color:T.navy}}>
              {new Date(tooltip.date+"T00:00:00").toLocaleDateString("en-IN",
                {weekday:"long",day:"numeric",month:"long",year:"numeric"})}
              {tooltip.date===today && (
                <span style={{marginLeft:8,fontSize:11,background:T.navy,color:"#fff",
                  borderRadius:4,padding:"2px 7px",fontWeight:700}}>Today</span>
              )}
            </div>
            <button onClick={()=>setTooltip(null)}
              style={{background:"none",border:"none",color:T.muted,cursor:"pointer",
                fontSize:18,lineHeight:1,padding:"0 4px"}}>×</button>
          </div>

          {/* Weekend note */}
          {(new Date(tooltip.date+"T00:00:00").getDay()===0 ||
            new Date(tooltip.date+"T00:00:00").getDay()===6) && (
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{width:10,height:10,borderRadius:3,background:"#dc2626",flexShrink:0}}/>
              <span style={{fontSize:13,color:"#dc2626",fontWeight:600}}>Weekend — No Classes</span>
            </div>
          )}

          {tooltip.entries.length===0 && !(new Date(tooltip.date+"T00:00:00").getDay()===0||new Date(tooltip.date+"T00:00:00").getDay()===6) ? (
            <div style={{fontSize:13,color:T.muted}}>Regular instructional day — no special events.</div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {tooltip.entries.map((e,i)=>{
                const cfg=TYPE_CONFIG[e.type]||{};
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",
                    justifyContent:"space-between",gap:10,
                    background:T.surface2,borderRadius:8,padding:"8px 12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                      <div style={{width:10,height:10,borderRadius:3,
                        background:cfg.color,flexShrink:0}}/>
                      <div style={{minWidth:0}}>
                        <span style={{fontSize:10,fontWeight:700,color:cfg.color,
                          textTransform:"uppercase",letterSpacing:.5,display:"block"}}>
                          {cfg.label}
                        </span>
                        {e.label && (
                          <span style={{fontSize:13,color:T.text,lineHeight:1.4}}>{e.label}</span>
                        )}
                      </div>
                    </div>
                    {isAdmin && (
                      <button onClick={()=>deleteEntry(e.date,e.type,e.label)}
                        style={{background:"none",border:"none",color:"#dc2626",
                          cursor:"pointer",fontSize:16,padding:"0 4px",flexShrink:0}}>
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Key Dates — collapsible */}
      <div style={{marginTop:16,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
        <button
          onClick={()=>setShowKeyDates(s=>!s)}
          style={{width:"100%",background:T.surface2,border:"none",
            padding:"12px 16px",display:"flex",justifyContent:"space-between",
            alignItems:"center",cursor:"pointer",color:T.text}}>
          <span style={{fontWeight:700,fontSize:14,color:T.navy}}>
            📌 Key Dates — {calData?.semester||"Monsoon 2026-27"}
          </span>
          {isAdmin && (data.hiddenKeyDates||[]).length > 0 && (
            <button
              onClick={()=>setData({...data, hiddenKeyDates:[]})}
              style={{background:"none",border:`1px solid ${T.border}`,color:T.muted,
                borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:600,cursor:"pointer"}}>
              Restore hidden ({(data.hiddenKeyDates||[]).length})
            </button>
          )}
          <span style={{fontSize:18,color:T.muted,transform:showKeyDates?"rotate(180deg)":"none",
            transition:"transform .2s"}}>⌄</span>
        </button>

        {showKeyDates && (
          <div style={{padding:"12px 14px",display:"flex",flexDirection:"column",gap:7}}>
            {keyDates.length===0 ? (
              <div style={{fontSize:13,color:T.muted,textAlign:"center",padding:"20px 0"}}>
                No key dates added yet.
              </div>
            ) : sortedKeyDates.map((e,i)=>{
  const cfg   = TYPE_CONFIG[e.type]||{};
  const isPast= e.date<today;

  if (editIdx===i) return (
    <div key={i} style={{background:T.surface2,border:`1.5px solid ${T.border}`,
      borderRadius:10,padding:12,marginBottom:4}}>
      <input type="date" value={editForm.date}
        onChange={ev=>setEditForm(p=>({...p,date:ev.target.value}))}
        style={inputS}/>
      <select value={editForm.type}
        onChange={ev=>setEditForm(p=>({...p,type:ev.target.value}))}
        style={inputS}>
        {Object.entries(TYPE_CONFIG).filter(([k])=>k!=="weekend").map(([k,v])=>(
          <option key={k} value={k}>{v.label}</option>
        ))}
      </select>
      <input value={editForm.label}
        onChange={ev=>setEditForm(p=>({...p,label:ev.target.value}))}
        placeholder="Label" style={inputS}/>
      <div style={{display:"flex",gap:8,marginTop:4}}>
        <button onClick={saveEdit}
          style={{background:T.navy,color:"#fff",border:"none",borderRadius:8,
            padding:"7px 13px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
          Save
        </button>
        <button onClick={()=>setEditIdx(null)}
          style={{background:T.light,color:T.text,border:"none",borderRadius:8,
            padding:"7px 13px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div key={i} style={{background:T.surface,border:`1px solid ${T.border}`,
      borderRadius:10,padding:"10px 13px",
      display:"flex",alignItems:"center",gap:10,
      opacity:isPast?.55:1,flexWrap:isMobile?"wrap":"nowrap"}}>
      <div style={{width:10,height:10,borderRadius:3,
        background:cfg.color,flexShrink:0}}/>
      <span style={{width:isMobile?80:110,fontSize:12,fontWeight:700,
        color:T.navy,flexShrink:0}}>
        {new Date(e.date+"T00:00:00").toLocaleDateString("en-IN",
          {day:"numeric",month:"short",year:isMobile?"2-digit":"numeric"})}
      </span>
      <span style={{flex:1,fontSize:13,color:T.text,minWidth:0}}>{e.label}</span>
      <span style={{background:T.surface2,color:cfg.color,
        fontSize:10,fontWeight:700,padding:"2px 8px",
        borderRadius:4,textTransform:"uppercase",
        letterSpacing:.5,flexShrink:0,whiteSpace:"nowrap",
        border:`1px solid ${cfg.color}33`}}>
        {cfg.short}
      </span>
      {isAdmin && (
        <div style={{display:"flex",gap:4,flexShrink:0}}>
          <button onClick={()=>{setEditIdx(i);setEditForm({date:e.date,type:e.type,label:e.label});}}
            style={{background:"none",border:"none",color:T.navy,cursor:"pointer",
              padding:"3px 5px",display:"flex"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button onClick={()=>deleteKeyDate(e.date,e.type,e.label)}
            style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",
              padding:"3px 5px",display:"flex"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      )}
    </div>
  );
})}
          </div>
        )}
      </div>
    </div>
  );
}
