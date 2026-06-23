import { useState } from "react";

const TAG_COLORS = {
  Technical:"#1a6eb5", Cultural:"#c2410c", Literary:"#4c1d95",
  Social:"#065f46", Arts:"#92400e", Sports:"#0f766e",
};

const IC = {
  back:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:18,height:18,flexShrink:0}}><polyline points="15 18 9 12 15 6"/></svg>,
  plus:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14,flexShrink:0}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  del:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  save:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  close:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:13,height:13,flexShrink:0}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  link:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:13,height:13,flexShrink:0}}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  lock:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};

function emptyEvent() {
  return { id:"", title:"", date:"", time:"", venue:"", desc:"", fee:"Free", eligibility:"", rewards:"", regLink:"" };
}

function EventForm({ form, setForm, onSave, onCancel, T }) {
  const fv = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const inputS = {
    width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
    padding:"9px 12px", fontSize:14, boxSizing:"border-box",
    background:T.inputBg, color:T.text, fontFamily:"inherit",
    marginBottom:8, display:"block",
  };
  const labelS = {
    fontSize:11, fontWeight:600, color:T.muted, marginBottom:4,
    letterSpacing:.5, textTransform:"uppercase", display:"block",
  };

  return (
    <div style={{ background:T.surface2, border:`1.5px solid ${T.border}`, borderRadius:12, padding:16, marginBottom:16 }}>
      <div style={{ fontWeight:700, color:T.navy, marginBottom:12, fontSize:14 }}>
        {form.id ? "Edit Event" : "New Event"}
      </div>
      <label style={labelS}>Event Title *</label>
      <input style={inputS} placeholder="e.g. Debutante 2025" value={form.title} onChange={fv("title")}/>
      <label style={labelS}>Date</label>
      <input style={inputS} type="date" value={form.date} onChange={fv("date")}/>
      <label style={labelS}>Time</label>
      <input style={inputS} placeholder="e.g. 6:00 PM – 9:00 PM" value={form.time} onChange={fv("time")}/>
      <label style={labelS}>Venue</label>
      <input style={inputS} placeholder="e.g. NITC Auditorium" value={form.venue} onChange={fv("venue")}/>
      <label style={labelS}>Description</label>
      <textarea style={{...inputS, height:80, resize:"vertical"}} placeholder="About this event…" value={form.desc} onChange={fv("desc")}/>
      <label style={labelS}>Registration Fee</label>
      <div style={{ display:"flex", gap:8, marginBottom:8 }}>
        {["Free","Paid"].map(opt => (
          <button key={opt} type="button"
            onClick={() => setForm(p => ({ ...p, fee: opt }))}
            style={{ flex:1, padding:"8px", border:`2px solid ${form.fee===opt ? T.navy : T.border}`,
              borderRadius:8, background:form.fee===opt ? T.light : T.surface,
              cursor:"pointer", fontWeight:700, fontSize:13,
              color:form.fee===opt ? T.navy : T.muted }}>
            {opt === "Free" ? "🆓 Free" : "💰 Paid"}
          </button>
        ))}
      </div>
      {form.fee === "Paid" && (
        <>
          <label style={labelS}>Fee Amount / Details</label>
          <input style={inputS} placeholder="e.g. ₹50 per team" value={form.feeDetails||""} onChange={fv("feeDetails")}/>
        </>
      )}
      <label style={labelS}>Eligibility</label>
      <input style={inputS} placeholder="e.g. All B.Tech students" value={form.eligibility} onChange={fv("eligibility")}/>
      <label style={labelS}>Rewards / Prizes</label>
      <input style={inputS} placeholder="e.g. ₹5000 cash prize + certificate" value={form.rewards} onChange={fv("rewards")}/>
      <label style={labelS}>Registration Link</label>
      <input style={inputS} placeholder="https://forms.gle/..." value={form.regLink} onChange={fv("regLink")}/>
      <div style={{ display:"flex", gap:8, marginTop:8 }}>
        <button onClick={onSave}
          style={{ background:T.navy, color:"#fff", border:"none", borderRadius:8,
            padding:"8px 14px", fontSize:13, fontWeight:600,
            display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer" }}>
          Save
        </button>
        <button onClick={onCancel}
          style={{ background:T.light, color:T.text, border:"none", borderRadius:8,
            padding:"8px 14px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ClubDetail({ club, data, setData, isAdmin, isClubAdmin, T, onBack }) {
  const [tab,      setTab]      = useState("upcoming");
  const [showAdd,  setShowAdd]  = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(emptyEvent());
  const [expanded, setExpanded] = useState({});

  const fv = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const canEdit = isAdmin || isClubAdmin;

  // Get events for this club
  const allEvents = (data.clubEvents || {})[club.name] || [];
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = allEvents.filter(e => !e.date || e.date >= today)
    .sort((a,b) => (a.date||"").localeCompare(b.date||""));
  const past = allEvents.filter(e => e.date && e.date < today)
    .sort((a,b) => b.date.localeCompare(a.date));
  const displayed = tab === "upcoming" ? upcoming : past;

  const updateEvents = (newEvents) => {
    const ce = { ...(data.clubEvents || {}), [club.name]: newEvents };
    setData({ ...data, clubEvents: ce });
  };

  const add = () => {
    if (!form.title.trim()) return;
    updateEvents([...allEvents, { ...form, id: "ev_" + Date.now() }]);
    setShowAdd(false); setForm(emptyEvent());
  };

  const saveEdit = () => {
    updateEvents(allEvents.map(e => e.id === editing ? { ...e, ...form } : e));
    setEditing(null);
  };

  const del = id => updateEvents(allEvents.filter(e => e.id !== id));

  const toggleExpand = id => setExpanded(ex => ({ ...ex, [id]: !ex[id] }));

  const inputS = {
    width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
    padding:"9px 12px", fontSize:14, boxSizing:"border-box",
    background:T.inputBg, color:T.text, fontFamily:"inherit", marginBottom:8, display:"block",
  };
  const labelS = {
    fontSize:11, fontWeight:600, color:T.muted, marginBottom:4,
    letterSpacing:.5, textTransform:"uppercase", display:"block",
  };

  return (
    <div>
      {/* Back button + club header */}
      <div style={{ marginBottom:20 }}>
        <button onClick={onBack}
          style={{ background:"none", border:"none", color:T.navy, cursor:"pointer",
            display:"flex", alignItems:"center", gap:5, fontSize:13, fontWeight:700,
            padding:0, marginBottom:14, touchAction:"manipulation" }}>
          {IC.back} Back to Clubs
        </button>

        <div style={{ display:"flex", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
              <h2 style={{ fontSize:22, fontWeight:800, color:T.navy, margin:0, letterSpacing:-.3 }}>
                {club.name}
              </h2>
              <span style={{ background:TAG_COLORS[club.category]||"#555", color:"#fff",
                fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:4,
                textTransform:"uppercase", letterSpacing:.6 }}>
                {club.category}
              </span>
              {isClubAdmin && (
                <span style={{ background:"#fef3c7", color:"#92400e", fontSize:10,
                  fontWeight:700, padding:"3px 8px", borderRadius:4, border:"1px solid #fcd34d" }}>
                  {IC.lock} Club Admin
                </span>
              )}
            </div>
            <p style={{ fontSize:14, color:T.muted, margin:0, lineHeight:1.6 }}>{club.desc}</p>
            {club.contact && (
              <a href={`mailto:${club.contact}`}
                style={{ fontSize:13, color:T.navy, marginTop:6, display:"inline-block" }}>
                ✉️ {club.contact}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Events header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        marginBottom:14, flexWrap:"wrap", gap:10 }}>
        <div style={{ fontWeight:800, fontSize:17, color:T.text }}>Events</div>
        {canEdit && !showAdd && !editing && (
          <button onClick={() => { setShowAdd(true); setForm(emptyEvent()); setEditing(null); }}
            style={{ background:T.navy, color:"#fff", border:"none", borderRadius:9,
              padding:"8px 14px", fontSize:13, fontWeight:600,
              display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer" }}>
            {IC.plus} Add Event
          </button>
        )}
      </div>

      {/* Add/Edit form */}
      {(showAdd || editing) && (
        <EventForm
        form={form}
        setForm={setForm}
        T={T}
        onSave={editing ? saveEdit : add}
        onCancel={() => { setShowAdd(false); setEditing(null); setForm(emptyEvent()); }}
        />
      )}

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {[["upcoming","📅 Upcoming", upcoming.length], ["past","🕘 Past Events", past.length]].map(([id, label, count]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ background: tab===id ? T.navy : T.light,
              color: tab===id ? "#fff" : T.text,
              border:"none", borderRadius:20, padding:"7px 16px",
              fontSize:12, fontWeight:700, cursor:"pointer",
              display:"flex", alignItems:"center", gap:6 }}>
            {label}
            <span style={{ background: tab===id ? "rgba(255,255,255,.25)" : T.border,
              borderRadius:10, fontSize:10, padding:"1px 6px", fontWeight:700 }}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Event list */}
      {displayed.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 20px", color:T.muted,
          background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, fontSize:14 }}>
          {tab === "upcoming"
            ? (canEdit ? "No upcoming events. Click 'Add Event' to create one." : "No upcoming events. Check back soon!")
            : "No past events recorded yet."}
        </div>
      )}

      {displayed.map(ev => {
        const isExpanded = expanded[ev.id];
        const isEditing  = editing === ev.id;

        if (isEditing) return (
          <div key={ev.id}>
            <EventForm
              form={form}
              setForm={setForm}
              T={T}
              onSave={editing ? saveEdit : add}
              onCancel={() => { setShowAdd(false); setEditing(null); setForm(emptyEvent()); }}
            />
          </div>
        );

        return (
          <div key={ev.id} style={{ background:T.surface, border:`1px solid ${T.border}`,
            borderRadius:14, marginBottom:12, overflow:"hidden" }}>

            {/* Event card header */}
            <div style={{ padding:"14px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
              {/* Date block */}
              {ev.date && (
                <div style={{ flexShrink:0, textAlign:"center", background:T.light,
                  borderRadius:10, padding:"8px 10px", minWidth:48 }}>
                  <div style={{ fontSize:20, fontWeight:800, color:T.navy, lineHeight:1 }}>
                    {new Date(ev.date+"T00:00:00").getDate()}
                  </div>
                  <div style={{ fontSize:10, fontWeight:600, color:T.muted, textTransform:"uppercase" }}>
                    {new Date(ev.date+"T00:00:00").toLocaleDateString("en-IN",{month:"short"})}
                  </div>
                  <div style={{ fontSize:10, color:T.muted }}>
                    {new Date(ev.date+"T00:00:00").getFullYear()}
                  </div>
                </div>
              )}

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:16, color:T.text, marginBottom:4 }}>{ev.title}</div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap", fontSize:12, color:T.muted, marginBottom:6 }}>
                  {ev.time   && <span>🕐 {ev.time}</span>}
                  {ev.venue  && <span>📍 {ev.venue}</span>}
                  {ev.fee && (
                    <span style={{ background: ev.fee==="Free" ? "#dcfce7" : "#fef9c3",
                      color: ev.fee==="Free" ? "#166534" : "#854d0e",
                      borderRadius:4, padding:"1px 7px", fontWeight:700, fontSize:11 }}>
                      {ev.fee==="Free" ? "🆓 Free" : `💰 ${ev.feeDetails||"Paid"}`}
                    </span>
                  )}
                </div>
                {ev.desc && (
                  <div style={{ fontSize:13, color:T.muted, lineHeight:1.55,
                    display: isExpanded ? "block" : "-webkit-box",
                    WebkitLineClamp: isExpanded ? "unset" : 2,
                    WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                    {ev.desc}
                  </div>
                )}
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0, alignItems:"flex-end" }}>
                <button onClick={() => toggleExpand(ev.id)}
                  style={{ background:T.light, border:"none", borderRadius:7, padding:"5px 10px",
                    fontSize:11, fontWeight:700, color:T.navy, cursor:"pointer", whiteSpace:"nowrap" }}>
                  {isExpanded ? "▲ Less" : "▼ More"}
                </button>
                {canEdit && (
                  <div style={{ display:"flex", gap:4 }}>
                    <button onClick={() => { setEditing(ev.id); setForm({...ev}); setShowAdd(false); }}
                      style={{ background:"none", border:"none", color:T.navy, cursor:"pointer", padding:"4px 5px", display:"flex" }}>
                      {IC.edit}
                    </button>
                    <button onClick={() => del(ev.id)}
                      style={{ background:"none", border:"none", color:"#dc2626", cursor:"pointer", padding:"4px 5px", display:"flex" }}>
                      {IC.del}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div style={{ borderTop:`1px solid ${T.border}`, padding:"12px 16px",
                background:T.surface2, display:"flex", flexDirection:"column", gap:8 }}>
                {ev.eligibility && (
                  <div style={{ fontSize:13 }}>
                    <span style={{ fontWeight:700, color:T.navy }}>Eligibility: </span>
                    <span style={{ color:T.text }}>{ev.eligibility}</span>
                  </div>
                )}
                {ev.rewards && (
                  <div style={{ fontSize:13 }}>
                    <span style={{ fontWeight:700, color:T.navy }}>Rewards: </span>
                    <span style={{ color:T.text }}>{ev.rewards}</span>
                  </div>
                )}
                {ev.regLink && (
                  <a href={ev.regLink} target="_blank" rel="noopener noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:6,
                      background:T.navy, color:"#fff", borderRadius:9,
                      padding:"8px 16px", fontSize:13, fontWeight:700,
                      textDecoration:"none", alignSelf:"flex-start", marginTop:4 }}>
                    {IC.link} Register Now
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}