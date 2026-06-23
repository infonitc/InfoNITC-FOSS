import { useState, useEffect } from "react";

const IC = {
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14,flexShrink:0}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  bell:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:15,height:15,flexShrink:0}}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  edit:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  del:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  plus:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14,flexShrink:0}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
};

function emptyForm(currentSection) {
  const now = new Date();
  const inAWeek = new Date(now.getTime() + 7*24*60*60*1000);
  return {
    title: "", message: "",
    startDate: now.toISOString().slice(0,10),
    endDate: inAWeek.toISOString().slice(0,10),
    showOn: "all", // "all" | a specific section id
  };
}

// Banner shown to regular users (and admin) on relevant sections
export function AnnouncementBanner({ data, section, T, isMobile }) {
  const announcements = data?.announcements || [];
  const today = new Date().toISOString().slice(0,10);

  const active = announcements.filter(a =>
    a.startDate <= today && a.endDate >= today &&
    (a.showOn === "all" || a.showOn === section)
  );

  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("nitc_dismissed_announcements") || "[]"); }
    catch { return []; }
  });

  const visible = active.filter(a => !dismissed.includes(a.id));
  const current = visible[0]; // show one at a time, queue-style

  const dismiss = (id) => {
    const updated = [...dismissed, id];
    setDismissed(updated);
    try { sessionStorage.setItem("nitc_dismissed_announcements", JSON.stringify(updated)); } catch {}
  };

  if (!current) return null;

  return (
    <div style={{
      background: "linear-gradient(90deg, #fef3c7, #fde68a)",
      borderBottom: "1px solid #f59e0b",
      padding: isMobile ? "9px 12px" : "10px 20px",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ color:"#92400e", flexShrink:0, display:"flex" }}>{IC.bell}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <span style={{ fontWeight:700, fontSize: isMobile ? 12.5 : 13, color:"#78350f" }}>
          {current.title}
        </span>
        {current.message && (
          <span style={{ fontSize: isMobile ? 12 : 12.5, color:"#92400e", marginLeft:7 }}>
            {current.message}
          </span>
        )}
      </div>
      <button onClick={() => dismiss(current.id)}
        style={{ background:"rgba(120,53,15,.12)", border:"none", borderRadius:"50%",
          width:24, height:24, color:"#78350f", cursor:"pointer", flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
        {IC.close}
      </button>
    </div>
  );
}

// Admin management panel
export default function AnnouncementManager({ data, setData, T, isMobile, sections }) {
  const announcements = data?.announcements || [];
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [err, setErr] = useState("");

  const today = new Date().toISOString().slice(0,10);
  const fv = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = () => {
    setErr("");
    if (!form.title.trim()) return setErr("Title is required.");
    if (!form.startDate || !form.endDate) return setErr("Start and end dates are required.");
    if (form.endDate < form.startDate) return setErr("End date must be after start date.");

    if (editing) {
      const updated = announcements.map(a => a.id === editing ? { ...a, ...form } : a);
      setData({ ...data, announcements: updated });
    } else {
      const newAnn = { id: "ann_" + Date.now(), ...form };
      setData({ ...data, announcements: [newAnn, ...announcements] });
    }
    setShowAdd(false); setEditing(null); setForm(emptyForm()); setErr("");
  };

  const startEdit = (a) => {
    setEditing(a.id);
    setForm({ title:a.title, message:a.message, startDate:a.startDate, endDate:a.endDate, showOn:a.showOn });
    setShowAdd(true);
  };

  const del = (id) => {
    setData({ ...data, announcements: announcements.filter(a => a.id !== id) });
  };

  const inputS = {
    width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
    padding:"9px 12px", fontSize:14, boxSizing:"border-box",
    background:T.inputBg, color:T.text, fontFamily:"inherit", marginBottom:10, display:"block",
  };
  const labelS = { fontSize:11, fontWeight:600, color:T.muted, marginBottom:4,
    textTransform:"uppercase", letterSpacing:.5, display:"block" };

  const isLive = (a) => a.startDate <= today && a.endDate >= today;
  const isPast = (a) => a.endDate < today;
  const isFuture = (a) => a.startDate > today;

  const statusOf = (a) =>
    isLive(a) ? { label:"Live now", color:"#166534", bg:"#dcfce7" }
    : isFuture(a) ? { label:"Scheduled", color:"#1d4ed8", bg:"#eff6ff" }
    : { label:"Ended", color:"#6b7280", bg:"#f3f4f6" };

  const sorted = [...announcements].sort((a,b) => b.startDate.localeCompare(a.startDate));

  return (
    <div style={{ background:T.surface2, border:`1.5px solid ${T.border}`, borderRadius:14,
      padding:16, marginBottom:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ fontWeight:800, fontSize:15, color:T.navy, display:"flex", alignItems:"center", gap:7 }}>
          {IC.bell} Announcements
        </div>
        <button onClick={() => { setShowAdd(s => !s); setEditing(null); setForm(emptyForm()); setErr(""); }}
          style={{ background:T.navy, color:"#fff", border:"none", borderRadius:9,
            padding:"7px 13px", fontSize:12, fontWeight:700, cursor:"pointer",
            display:"flex", alignItems:"center", gap:5 }}>
          {IC.plus} New Announcement
        </button>
      </div>

      {showAdd && (
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12,
          padding:16, marginBottom:16 }}>
          <div style={{ fontWeight:700, color:T.navy, marginBottom:12, fontSize:14 }}>
            {editing ? "Edit Announcement" : "New Announcement"}
          </div>

          <label style={labelS}>Title *</label>
          <input style={inputS} placeholder="e.g. Mess timings changed for exam week"
            value={form.title} onChange={fv("title")}/>

          <label style={labelS}>Message (optional)</label>
          <textarea style={{ ...inputS, height:60, resize:"vertical" }}
            placeholder="Any additional detail…" value={form.message} onChange={fv("message")}/>

          <div style={{ display:"flex", gap:10 }}>
            <div style={{ flex:1 }}>
              <label style={labelS}>Active From</label>
              <input style={inputS} type="date" value={form.startDate} onChange={fv("startDate")}/>
            </div>
            <div style={{ flex:1 }}>
              <label style={labelS}>Active Until</label>
              <input style={inputS} type="date" value={form.endDate} onChange={fv("endDate")}/>
            </div>
          </div>

          <label style={labelS}>Show On</label>
          <select style={inputS} value={form.showOn} onChange={fv("showOn")}>
            <option value="all">All sections (landing page default)</option>
            {sections.map(s => (
              <option key={s.id} value={s.id}>{s.label} only</option>
            ))}
          </select>

          {err && <div style={{ color:"#dc2626", fontSize:13, marginBottom:8 }}>{err}</div>}

          <div style={{ display:"flex", gap:8 }}>
            <button onClick={save}
              style={{ background:T.navy, color:"#fff", border:"none", borderRadius:8,
                padding:"8px 14px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
              {editing ? "Save Changes" : "Create Announcement"}
            </button>
            <button onClick={() => { setShowAdd(false); setEditing(null); }}
              style={{ background:T.light, color:T.text, border:"none", borderRadius:8,
                padding:"8px 14px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div style={{ textAlign:"center", padding:"24px 0", color:T.muted, fontSize:13 }}>
          No announcements yet.
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {sorted.map(a => {
            const st = statusOf(a);
            const sectionLabel = a.showOn === "all" ? "All sections" :
              sections.find(s => s.id === a.showOn)?.label || a.showOn;
            return (
              <div key={a.id} style={{ background:T.surface, border:`1px solid ${T.border}`,
                borderRadius:10, padding:"10px 13px", display:"flex", alignItems:"flex-start", gap:10 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:700, fontSize:13.5, color:T.text }}>{a.title}</span>
                    <span style={{ background:st.bg, color:st.color, fontSize:10, fontWeight:700,
                      padding:"2px 7px", borderRadius:4, textTransform:"uppercase", letterSpacing:.4 }}>
                      {st.label}
                    </span>
                  </div>
                  {a.message && <div style={{ fontSize:12.5, color:T.muted, marginBottom:4 }}>{a.message}</div>}
                  <div style={{ fontSize:11, color:T.muted }}>
                    {a.startDate} → {a.endDate} · {sectionLabel}
                  </div>
                </div>
                <div style={{ display:"flex", gap:4, flexShrink:0 }}>
                  <button onClick={() => startEdit(a)}
                    style={{ background:"none", border:"none", color:T.navy, cursor:"pointer", padding:"3px 5px", display:"flex" }}>
                    {IC.edit}
                  </button>
                  <button onClick={() => del(a.id)}
                    style={{ background:"none", border:"none", color:"#dc2626", cursor:"pointer", padding:"3px 5px", display:"flex" }}>
                    {IC.del}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
