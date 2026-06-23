import { useState, useRef } from "react";


const UG_DEPARTMENTS = [
  { name:"Computer Science & Engineering",         sems:8 },
  { name:"Electrical & Electronics Engineering",   sems:8 },
  { name:"Electronics & Communication Engineering",sems:8 },
  { name:"Mechanical Engineering",                 sems:8 },
  { name:"Civil Engineering",                      sems:8 },
  { name:"Chemical Engineering",                   sems:8 },
  { name:"Biotechnology",                          sems:8 },
  { name:"Materials Science & Engineering",        sems:8 },
  { name:"Production Engineering",                 sems:8 },
  { name:"Energy Engineering",                     sems:8 },
  { name:"Engineering Physics",                    sems:8 },
  { name:"Architecture & Planning (B.Arch)",       sems:10 },
  { name:"Mathematics & Computing (Dual Degree)",  sems:10 },
  { name:"B.Sc-B.Ed / ITEP",                       sems:8 },
];

const PG_STREAMS = {
  "CSE": [
    "M.Tech CSE",
    "M.Tech CSE — AI & Data Analytics",
    "M.Tech CSE — Information Security",
  ],
  "ECE": [
    "M.Tech ECE — Telecommunication",
    "M.Tech ECE — Signal Processing",
    "M.Tech ECE — Microelectronics & VLSI Design",
    "M.Tech ECE — Electronics Design & Technology",
  ],
  "EE": [
    "M.Tech EE — Power Systems",
    "M.Tech EE — Power Electronics",
    "M.Tech EE — High Voltage Engineering",
    "M.Tech EE — Industrial Power & Automation",
    "M.Tech EE — Instrumentation & Control Systems",
    "M.Tech EE — Electric Vehicle Engineering",
    "M.Tech EE — High Voltage & Renewable Energy",
  ],
  "ME": [
    "M.Tech ME — Machine Design",
    "M.Tech ME — Thermal Sciences",
    "M.Tech ME — Industrial Engineering & Management",
    "M.Tech ME — Operations Research & Data Analytics",
    "M.Tech ME — Logistics & Supply Chain Management",
    "M.Tech ME — Advanced Materials & Manufacturing",
    "M.Tech ME — Digital Product Engineering",
    "M.Tech ME — Sustainable Energy Engineering",
  ],
  "CE": [
    "M.Tech CE — Environmental Engineering",
    "M.Tech CE — Water Resources Engineering",
    "M.Tech CE — Geotechnical Engineering",
    "M.Tech CE — Structural Engineering",
    "M.Tech CE — Offshore Structures",
    "M.Tech CE — Traffic & Transportation Planning",
  ],
  "Chemical": [
    "M.Tech — Chemical Engineering",
  ],
  "Bioengineering": [
    "M.Tech — Bioengineering",
  ],
  "Nanotechnology": [
    "M.Tech — Nanotechnology",
  ],
  "Planning": [
    "M.Plan — Urban Planning",
  ],
  "Sciences": [
    "M.Sc — Mathematics",
    "M.Sc — Physics",
    "M.Sc — Chemistry",
  ],
  "Management": [
    "MBA — Management Studies",
    "MCA",
  ],
};

const BTECH_ODD  = ["S1","S3","S5","S7"];
const BTECH_EVEN = ["S2","S4","S6","S8"];
const PG_ODD     = ["S1","S3"];
const PG_EVEN    = ["S2","S4"];
const ARCH_ODD   = ["S1","S3","S5","S7","S9"];
const ARCH_EVEN  = ["S2","S4","S6","S8","S10"];

function filterByOddEven(allSems, isOdd) {
  const odd  = allSems.filter(s => { const n=parseInt(s.replace(/\D/g,"")); return !isNaN(n)&&n%2!==0; });
  const even = allSems.filter(s => { const n=parseInt(s.replace(/\D/g,"")); return !isNaN(n)&&n%2===0; });
  if (odd.length===0||even.length===0) return allSems;
  return isOdd ? odd : even;
}

function getSemesters(deptName, isOdd, customDepts) {
  const custom = customDepts.find(d => d.name === deptName);
  if (custom) return filterByOddEven(custom.semesters, isOdd);

  // UG special cases
  const ugDept = UG_DEPARTMENTS.find(d => d.name === deptName);
  if (ugDept) {
    if (ugDept.sems === 10) return isOdd ? ARCH_ODD : ARCH_EVEN;
    return isOdd ? BTECH_ODD : BTECH_EVEN;
  }

  // PG — all are 4 semesters
  return isOdd ? PG_ODD : PG_EVEN;
}

// All pre-filled dept names flat list
function getAllPrefilledNames() {
  const ug = UG_DEPARTMENTS.map(d => d.name);
  const pg = Object.values(PG_STREAMS).flat();
  return [...ug, ...pg];
}

function buildOrderedDepts(customDepts, savedOrder) {
  const all = [...getAllPrefilledNames(), ...customDepts.map(d=>d.name)];
  if (!savedOrder||savedOrder.length===0) return all;
  const ordered = savedOrder.filter(n=>all.includes(n));
  const added   = all.filter(n=>!savedOrder.includes(n));
  return [...ordered, ...added];
}

const IC = {
  plus:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14,flexShrink:0}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  del:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  save:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:13,height:13,flexShrink:0}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  drag:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0,opacity:.4}}><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="18" x2="16" y2="18"/></svg>,
};

function emptyExam() {
  return { id:"", date:"", time:"", subject:"", code:"", venue:"" };
}

export default function ExamSchedule({ data, setData, isAdmin, T, isMobile }) {
  const examData    = data.examSchedule || { isOdd:true, exams:{} };
  const isOdd       = examData.isOdd ?? true;
  const exams       = examData.exams || {};
  const customDepts = data.customDepartments || [];

  // Navigation state
  const [level,    setLevel]    = useState("ug"); // "ug" | "pg"
  const [pgStream, setPgStream] = useState(null);  // e.g. "CSE"
  const [dept,     setDept]     = useState(null);
  const [sem,      setSem]      = useState(null);

  // Exam CRUD state
  const [showAdd,  setShowAdd]  = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(emptyExam());

  // Dept management state
  const [showAddDept,  setShowAddDept]  = useState(false);
  const [editingDept,  setEditingDept]  = useState(null);
  const [deptForm,     setDeptForm]     = useState({ name:"", semesters:"" });
  const [deptErr,      setDeptErr]      = useState("");

  const dragIdx  = useRef(null);
  const dragOver = useRef(null);

  const fv = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const semesters = dept ? getSemesters(dept, isOdd, customDepts) : [];
  const key       = dept && sem ? `${dept}||${sem}` : null;
  const entries   = (key ? exams[key] : []) || [];
  const today     = new Date().toISOString().slice(0,10);

  const updateExams = (newExams) =>
    setData({ ...data, examSchedule: { ...examData, exams: newExams } });

  const toggleSemType = () =>
    setData({ ...data, examSchedule: { ...examData, isOdd: !isOdd } });

  const addExam = () => {
    if (!key||!form.subject) return;
    updateExams({ ...exams, [key]: [...entries, { ...form, id:"e_"+Date.now() }] });
    setShowAdd(false); setForm(emptyExam());
  };

  const saveEdit = () => {
    updateExams({ ...exams, [key]: entries.map(e => e.id===editing ? {...e,...form} : e) });
    setEditing(null);
  };

  const delExam = id => updateExams({ ...exams, [key]: entries.filter(e=>e.id!==id) });

  // Dept CRUD
  const saveDept = () => {
    const newName = deptForm.name.trim();
    const sems    = deptForm.semesters.split(",").map(s=>s.trim()).filter(Boolean);
    if (!newName)          return setDeptErr("Department name is required.");
    if (sems.length===0)   return setDeptErr("Enter at least one semester.");
    const allNames = getAllPrefilledNames().concat(customDepts.map(d=>d.name));
    if (!editingDept && allNames.includes(newName)) return setDeptErr("Already exists.");
    if (editingDept && newName!==editingDept && allNames.includes(newName)) return setDeptErr("Already exists.");

    let updatedCustom = [...customDepts];
    let updatedExams  = { ...exams };

    if (editingDept) {
      const idx = updatedCustom.findIndex(d=>d.name===editingDept);
      if (idx>=0) updatedCustom[idx] = { name:newName, semesters:sems };
      else updatedCustom.push({ name:newName, semesters:sems });
      if (newName!==editingDept) {
        const renamed={};
        Object.entries(updatedExams).forEach(([k,v])=>{
          renamed[k.startsWith(editingDept+"||") ? k.replace(editingDept+"||",newName+"||") : k]=v;
        });
        updatedExams=renamed;
        if (dept===editingDept) setDept(newName);
      }
    } else {
      updatedCustom.push({ name:newName, semesters:sems });
    }

    setData({ ...data, customDepartments:updatedCustom, examSchedule:{...examData,exams:updatedExams} });
    setDeptForm({name:"",semesters:""}); setDeptErr(""); setShowAddDept(false); setEditingDept(null);
  };

  const deleteDept = (deptName) => {
    const updatedCustom = customDepts.filter(d=>d.name!==deptName);
    const updatedExams  = Object.fromEntries(Object.entries(exams).filter(([k])=>!k.startsWith(deptName+"||")));
    setData({ ...data, customDepartments:updatedCustom, examSchedule:{...examData,exams:updatedExams} });
    if (dept===deptName) { setDept(null); setSem(null); }
  };

  // Helpers
  const examCountFor = (deptName) => {
    return semesters.reduce((sum,s)=>{
      return sum + ((exams[`${deptName}||${s}`]||[]).length);
    },0);
  };

  const upcomingCountFor = (deptName, sems) => {
    return sems.reduce((sum,s)=>{
      return sum + ((exams[`${deptName}||${s}`]||[])).filter(e=>!e.date||e.date>=today).length;
    },0);
  };

  const sorted = [...entries].sort((a,b)=>{
    if (!a.date||!b.date) return 0;
    return a.date.localeCompare(b.date);
  });

  const inputS = {
    width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
    padding:"9px 12px", fontSize:14, boxSizing:"border-box",
    background:T.inputBg, color:T.text, fontFamily:"inherit", marginBottom:8, display:"block",
  };
  const labelS = {
    fontSize:11, fontWeight:600, color:T.muted, marginBottom:4,
    letterSpacing:.5, textTransform:"uppercase", display:"block",
  };

  // Chip button helper
  const Chip = ({ label, active, onClick, badge, isCustom }) => (
    <button onClick={onClick}
      style={{ background:active?T.navy:T.light, color:active?"#fff":T.text,
        border:"none", borderRadius:20, padding:"6px 14px",
        fontSize:12, fontWeight:700, cursor:"pointer",
        touchAction:"manipulation", whiteSpace:"nowrap", position:"relative" }}>
      {label}
      {isAdmin && isCustom && (
        <span style={{ marginLeft:4, fontSize:8, opacity:.6 }}>●</span>
      )}
      {badge>0 && (
        <span style={{ position:"absolute", top:-6, right:-4,
          background:active?"#60a5fa":T.navy, color:"#fff",
          borderRadius:10, fontSize:9, fontWeight:700,
          padding:"1px 5px", minWidth:16, textAlign:"center" }}>
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:16 }}>
        <h2 style={{ fontSize:20, fontWeight:800, color:T.navy, margin:0, marginBottom:3, letterSpacing:-.3 }}>
          Exam Schedule
        </h2>
        <p style={{ fontSize:13, color:T.muted, margin:0 }}>
          Select your programme and department to view the exam timetable
        </p>
      </div>

      {/* Admin: Odd/Even toggle */}
      {isAdmin && (
        <div style={{ background:T.surface2, border:`1.5px solid ${T.border}`, borderRadius:12,
          padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center",
          justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:T.navy, marginBottom:2 }}>Current Semester Type</div>
            <div style={{ fontSize:12, color:T.muted }}>
              {isOdd ? "Odd Semester (S1, S3, S5, S7…)" : "Even Semester (S2, S4, S6, S8…)"}
            </div>
          </div>
          <button onClick={toggleSemType}
            style={{ background:T.navy, color:"#fff", border:"none", borderRadius:9,
              padding:"8px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
            Switch to {isOdd?"Even":"Odd"} Semester
          </button>
        </div>
      )}

      {/* Semester badge */}
      <div style={{ display:"inline-flex", alignItems:"center", gap:6,
        background:isOdd?"#eff6ff":"#f0fdf4",
        border:`1px solid ${isOdd?"#93c5fd":"#86efac"}`,
        borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:700,
        color:isOdd?"#1d4ed8":"#166534", marginBottom:18 }}>
        {isOdd?"🍂 Odd Semester":"🌸 Even Semester"} &nbsp;·&nbsp;
        {isOdd?"S1, S3, S5, S7":"S2, S4, S6, S8"}
      </div>

      {/* LEVEL TABS: UG | PG */}
      <div style={{ display:"flex", gap:0, marginBottom:20,
        background:T.surface2, borderRadius:12, padding:4,
        border:`1px solid ${T.border}`, width:"fit-content" }}>
        {[["ug","🎓 UG Programmes"],["pg","📚 PG Programmes"]].map(([id,label])=>(
          <button key={id} onClick={()=>{ setLevel(id); setPgStream(null); setDept(null); setSem(null); setShowAddDept(false); }}
            style={{ background:level===id?T.navy:"none", color:level===id?"#fff":T.muted,
              border:"none", borderRadius:9, padding:"9px 20px",
              fontSize:13, fontWeight:700, cursor:"pointer",
              transition:"all .15s", touchAction:"manipulation" }}>
            {label}
          </button>
        ))}
      </div>

      {/* UG DEPARTMENTS */}
      {level==="ug" && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:600, color:T.muted, marginBottom:10,
            letterSpacing:.5, textTransform:"uppercase" }}>
            Select Department
          </div>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            {UG_DEPARTMENTS.map(d => {
              const sems = getSemesters(d.name, isOdd, customDepts);
              const upcoming = upcomingCountFor(d.name, sems);
              return (
                <Chip key={d.name} label={d.name} active={dept===d.name}
                  badge={upcoming}
                  onClick={()=>{ setDept(d.name); setSem(null); setShowAdd(false); setEditing(null); }}/>
              );
            })}
            {/* Custom depts that don't belong to PG streams */}
            {customDepts.filter(d => !Object.values(PG_STREAMS).flat().includes(d.name)).map(d => {
              const sems = getSemesters(d.name, isOdd, customDepts);
              const upcoming = upcomingCountFor(d.name, sems);
              return (
                <Chip key={d.name} label={d.name} active={dept===d.name}
                  badge={upcoming} isCustom
                  onClick={()=>{ setDept(d.name); setSem(null); }}/>
              );
            })}
          </div>
        </div>
      )}

      {/* PG STREAM SELECTOR */}
      {level==="pg" && (
        <div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:600, color:T.muted, marginBottom:10,
              letterSpacing:.5, textTransform:"uppercase" }}>
              Select Stream
            </div>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              {Object.keys(PG_STREAMS).map(stream => (
                <button key={stream}
                  onClick={()=>{ setPgStream(stream); setDept(null); setSem(null); setShowAdd(false); setEditing(null); }}
                  style={{ background:pgStream===stream?T.navy:T.light,
                    color:pgStream===stream?"#fff":T.text,
                    border:"none", borderRadius:20, padding:"7px 16px",
                    fontSize:13, fontWeight:700, cursor:"pointer",
                    touchAction:"manipulation" }}>
                  {stream}
                </button>
              ))}
            </div>
          </div>

          {/* Departments within selected stream */}
          {pgStream && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:600, color:T.muted, marginBottom:10,
                letterSpacing:.5, textTransform:"uppercase" }}>
                {pgStream} — Select Department
              </div>
              <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                {PG_STREAMS[pgStream].map(d => {
                  const sems = getSemesters(d, isOdd, customDepts);
                  const upcoming = upcomingCountFor(d, sems);
                  return (
                    <Chip key={d} label={d} active={dept===d}
                      badge={upcoming}
                      onClick={()=>{ setDept(d); setSem(null); setShowAdd(false); setEditing(null); }}/>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin: Add Department */}
      {isAdmin && (
        <div style={{ marginBottom:16 }}>
          <button onClick={()=>{ setShowAddDept(s=>!s); setDeptForm({name:"",semesters:""}); setDeptErr(""); setEditingDept(null); }}
            style={{ background:"none", border:`1px dashed ${T.border}`, borderRadius:9,
              padding:"7px 14px", fontSize:12, fontWeight:600, color:T.muted,
              cursor:"pointer", display:"inline-flex", alignItems:"center", gap:5 }}>
            {IC.plus} Add Custom Department
          </button>

          {showAddDept && (
            <div style={{ background:T.surface2, border:`1.5px solid ${T.border}`,
              borderRadius:12, padding:16, marginTop:10 }}>
              <div style={{ fontWeight:700, color:T.navy, marginBottom:12, fontSize:14 }}>
                {editingDept ? `Edit — ${editingDept}` : "New Department"}
              </div>
              <label style={labelS}>Department Name *</label>
              <input value={deptForm.name} onChange={e=>setDeptForm(p=>({...p,name:e.target.value}))}
                placeholder="e.g. M.Tech — Robotics" style={inputS}/>
              <label style={labelS}>All Semesters (comma-separated) *</label>
              <input value={deptForm.semesters} onChange={e=>setDeptForm(p=>({...p,semesters:e.target.value}))}
                placeholder="e.g. S1, S2, S3, S4" style={inputS}/>
              <div style={{ fontSize:11, color:T.muted, marginBottom:10, lineHeight:1.5 }}>
                Enter all semesters in order. The site auto-filters odd/even based on the toggle.
              </div>
              {deptErr && <div style={{ color:"#dc2626", fontSize:13, marginBottom:8 }}>{deptErr}</div>}
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={saveDept}
                  style={{ background:T.navy, color:"#fff", border:"none", borderRadius:8,
                    padding:"8px 14px", fontSize:13, fontWeight:600,
                    display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer" }}>
                  {IC.save} Save
                </button>
                <button onClick={()=>{ setShowAddDept(false); setEditingDept(null); setDeptErr(""); }}
                  style={{ background:T.light, color:T.text, border:"none", borderRadius:8,
                    padding:"8px 14px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SEMESTER SELECTOR */}
      {dept && (
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            marginBottom:10, flexWrap:"wrap", gap:8 }}>
            <div style={{ fontSize:11, fontWeight:600, color:T.muted,
              letterSpacing:.5, textTransform:"uppercase" }}>
              Semester — <span style={{ color:T.navy }}>{dept}</span>
            </div>
            {isAdmin && customDepts.find(d=>d.name===dept) && (
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={()=>{ const d=customDepts.find(x=>x.name===dept); setEditingDept(dept); setDeptForm({name:d.name,semesters:d.semesters.join(", ")}); setShowAddDept(true); }}
                  style={{ background:"none", border:"none", color:T.navy, cursor:"pointer", display:"flex", alignItems:"center", gap:3, fontSize:12, fontWeight:600 }}>
                  {IC.edit} Edit dept
                </button>
                <button onClick={()=>deleteDept(dept)}
                  style={{ background:"none", border:"none", color:"#dc2626", cursor:"pointer", display:"flex", alignItems:"center", gap:3, fontSize:12, fontWeight:600 }}>
                  {IC.del} Delete dept
                </button>
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {semesters.map(s => {
              const k = `${dept}||${s}`;
              const count = (exams[k]||[]).length;
              return (
                <button key={s} onClick={()=>{ setSem(s); setShowAdd(false); setEditing(null); }}
                  style={{ background:sem===s?T.navy:T.light, color:sem===s?"#fff":T.text,
                    border:"none", borderRadius:10, padding:"10px 20px",
                    fontSize:14, fontWeight:800, cursor:"pointer",
                    touchAction:"manipulation", position:"relative", minWidth:60 }}>
                  {s}
                  {count>0 && (
                    <span style={{ position:"absolute", top:-6, right:-6,
                      background:sem===s?"#60a5fa":T.navy, color:"#fff",
                      borderRadius:10, fontSize:9, fontWeight:700,
                      padding:"1px 5px", minWidth:16, textAlign:"center" }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* EXAM LIST */}
      {sem && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            marginBottom:14, flexWrap:"wrap", gap:8 }}>
            <div style={{ fontWeight:700, fontSize:15, color:T.text }}>
              {dept} — {sem}
              <span style={{ fontSize:12, color:T.muted, fontWeight:400, marginLeft:8 }}>
                {sorted.length} exam{sorted.length!==1?"s":""}
              </span>
            </div>
            {isAdmin && (
              <button onClick={()=>{ setShowAdd(true); setForm(emptyExam()); setEditing(null); }}
                style={{ background:T.navy, color:"#fff", border:"none", borderRadius:9,
                  padding:"8px 14px", fontSize:13, fontWeight:600,
                  display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer" }}>
                {IC.plus} Add Exam
              </button>
            )}
          </div>

          {/* Add form */}
          {showAdd && (
            <div style={{ background:T.surface2, border:`1.5px solid ${T.border}`,
              borderRadius:12, padding:16, marginBottom:16 }}>
              <div style={{ fontWeight:700, color:T.navy, marginBottom:12, fontSize:14 }}>New Exam</div>
              <label style={labelS}>Subject Name *</label>
              <input style={inputS} placeholder="e.g. Data Structures" value={form.subject} onChange={fv("subject")}/>
              <label style={labelS}>Subject Code</label>
              <input style={inputS} placeholder="e.g. CS201" value={form.code} onChange={fv("code")}/>
              <label style={labelS}>Date</label>
              <input style={inputS} type="date" value={form.date} onChange={fv("date")}/>
              <label style={labelS}>Time</label>
              <input style={inputS} placeholder="e.g. 9:00 AM – 12:00 PM" value={form.time} onChange={fv("time")}/>
              <label style={labelS}>Venue / Hall</label>
              <input style={inputS} placeholder="e.g. LT-1, Academic Block" value={form.venue} onChange={fv("venue")}/>
              <div style={{ display:"flex", gap:8, marginTop:4 }}>
                <button onClick={addExam}
                  style={{ background:T.navy, color:"#fff", border:"none", borderRadius:8,
                    padding:"8px 14px", fontSize:13, fontWeight:600,
                    display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer" }}>
                  {IC.save} Save
                </button>
                <button onClick={()=>setShowAdd(false)}
                  style={{ background:T.light, color:T.text, border:"none", borderRadius:8,
                    padding:"8px 14px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {sorted.length===0 && !showAdd && (
            <div style={{ textAlign:"center", padding:"40px 20px", color:T.muted, fontSize:14,
              background:T.surface, border:`1px solid ${T.border}`, borderRadius:12 }}>
              No exams added yet for {dept} {sem}.
              {isAdmin ? " Click 'Add Exam' to get started." : " Check back later."}
            </div>
          )}

          {sorted.map(ex => {
            const isPast = ex.date && ex.date < today;
            return (
              <div key={ex.id} style={{ background:isPast?T.mutedCard:T.surface,
                border:`1px solid ${T.border}`, borderRadius:12,
                padding:"14px 16px", marginBottom:10, opacity:isPast?.6:1 }}>
                {editing===ex.id ? (
                  <div>
                    <label style={labelS}>Subject Name</label>
                    <input style={inputS} value={form.subject} onChange={fv("subject")}/>
                    <label style={labelS}>Subject Code</label>
                    <input style={inputS} value={form.code} onChange={fv("code")}/>
                    <label style={labelS}>Date</label>
                    <input style={inputS} type="date" value={form.date} onChange={fv("date")}/>
                    <label style={labelS}>Time</label>
                    <input style={inputS} value={form.time} onChange={fv("time")}/>
                    <label style={labelS}>Venue / Hall</label>
                    <input style={inputS} value={form.venue} onChange={fv("venue")}/>
                    <div style={{ display:"flex", gap:8, marginTop:4 }}>
                      <button onClick={saveEdit}
                        style={{ background:T.navy, color:"#fff", border:"none", borderRadius:8,
                          padding:"8px 14px", fontSize:13, fontWeight:600,
                          display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer" }}>
                        {IC.save} Save
                      </button>
                      <button onClick={()=>setEditing(null)}
                        style={{ background:T.light, color:T.text, border:"none", borderRadius:8,
                          padding:"8px 14px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                    {ex.date && (
                      <div style={{ flexShrink:0, textAlign:"center", background:T.light,
                        borderRadius:10, padding:"8px 10px", minWidth:48 }}>
                        <div style={{ fontSize:18, fontWeight:800, color:T.navy, lineHeight:1 }}>
                          {new Date(ex.date+"T00:00:00").getDate()}
                        </div>
                        <div style={{ fontSize:10, fontWeight:600, color:T.muted, textTransform:"uppercase" }}>
                          {new Date(ex.date+"T00:00:00").toLocaleDateString("en-IN",{month:"short"})}
                        </div>
                      </div>
                    )}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:15, color:T.text, marginBottom:3 }}>
                        {ex.subject}
                        {ex.code && <span style={{ fontSize:11, color:T.muted, fontWeight:500, marginLeft:8 }}>({ex.code})</span>}
                      </div>
                      <div style={{ display:"flex", gap:12, flexWrap:"wrap", fontSize:12, color:T.muted }}>
                        {ex.time  && <span>🕐 {ex.time}</span>}
                        {ex.venue && <span>📍 {ex.venue}</span>}
                      </div>
                    </div>
                    {isAdmin && (
                      <div style={{ display:"flex", gap:4, flexShrink:0 }}>
                        <button onClick={()=>{ setEditing(ex.id); setForm({...ex}); setShowAdd(false); }}
                          style={{ background:"none", border:"none", color:T.navy, cursor:"pointer", padding:"4px 5px", display:"flex" }}>
                          {IC.edit}
                        </button>
                        <button onClick={()=>delExam(ex.id)}
                          style={{ background:"none", border:"none", color:"#dc2626", cursor:"pointer", padding:"4px 5px", display:"flex" }}>
                          {IC.del}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Prompt when nothing selected */}
      {!dept && (
        <div style={{ textAlign:"center", padding:"30px 20px", color:T.muted, fontSize:14,
          background:T.surface, border:`1px solid ${T.border}`, borderRadius:12 }}>
          {level==="pg" && !pgStream
            ? "👆 Select a stream above to see departments"
            : "👆 Select a department above to view the exam schedule"}
        </div>
      )}
    </div>
  );
}
