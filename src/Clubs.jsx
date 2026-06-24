import { useState, useEffect } from "react";
import ClubDetail from "./ClubDetail.jsx";
import { saveSecrets } from "./firebase.js";

const TAG_COLORS = {
  Technical:"#1a6eb5", Cultural:"#c2410c", Literary:"#4c1d95",
  Social:"#065f46", Arts:"#92400e", Sports:"#0f766e",
};

const IC = {
  plus:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14,flexShrink:0}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  del:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  save:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  lock:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:13,height:13,flexShrink:0}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  eye:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:15,height:15,flexShrink:0}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:15,height:15,flexShrink:0}}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>,
  arrow:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:15,height:15,flexShrink:0}}><polyline points="9 18 15 12 9 6"/></svg>,
};

function ClubAdminLoginModal({ clubs, clubPins, onLogin, onClose, T }) { 
  const [selectedClub, setSelectedClub] = useState(clubs[0]?.name || "");
  const [pin,  setPin]  = useState("");
  const [err,  setErr]  = useState("");
  const [show, setShow] = useState(false);

  const attempt = () => {
    const correctPin = (clubPins || {})[selectedClub];
    if (!correctPin) return setErr("No pin set for this club yet. Contact the main admin.");
    if (pin === correctPin) { onLogin(selectedClub); }
    else { setErr("Incorrect pin. Try again."); setTimeout(() => setErr(""), 2000); }
  };

return (
  <div onClick={onClose} style={{
    position:"fixed", top:0, left:0, right:0, bottom:0,
    background:"rgba(0,0,20,.6)",
    zIndex:9999, backdropFilter:"blur(5px)",
    overflowY:"auto",
  }}>
    <div onClick={e => e.stopPropagation()} style={{
      background:T.surface, borderRadius:18,
      padding:20, width:"calc(100% - 32px)", maxWidth:340,
      boxShadow:"0 24px 64px rgba(0,0,0,.35)",
      border:`1px solid ${T.border}`,
      margin:"80px auto 40px auto",
    }}>
      <div style={{ textAlign:"center", marginBottom:16 }}>
        <div style={{ fontSize:26, marginBottom:6 }}>🎓</div>
        <div style={{ fontSize:17, fontWeight:800, color:T.navy }}>Club Admin Login</div>
        <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>Select your club and enter your pin</div>
      </div>

      <div style={{ fontSize:11, fontWeight:600, color:T.muted, marginBottom:4,
        letterSpacing:.5, textTransform:"uppercase" }}>Your Club</div>
      <select value={selectedClub} onChange={e => setSelectedClub(e.target.value)}
        style={{ width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
          padding:"8px 12px", fontSize:14, boxSizing:"border-box",
          background:T.inputBg, color:T.text, fontFamily:"inherit",
          marginBottom:12, display:"block" }}>
        {clubs.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
      </select>

      <div style={{ fontSize:11, fontWeight:600, color:T.muted, marginBottom:4,
        letterSpacing:.5, textTransform:"uppercase" }}>Pin</div>
      <div style={{ position:"relative", marginBottom:12 }}>
        <input type={show ? "text" : "password"} value={pin}
          onChange={e => setPin(e.target.value)}
          onKeyDown={e => e.key === "Enter" && attempt()}
          placeholder="Enter club pin"
          style={{ width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
            padding:"8px 42px 8px 12px", fontSize:14, boxSizing:"border-box",
            background:T.inputBg, color:T.text, fontFamily:"inherit", display:"block" }}/>
        <button type="button" onClick={() => setShow(s => !s)}
          style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
            background:"none", border:"none", color:T.muted, cursor:"pointer",
            display:"flex", padding:4 }}>
          {show ? IC.eyeOff : IC.eye}
        </button>
      </div>

      {err && <div style={{ color:"#ef4444", fontSize:13, marginBottom:10, textAlign:"center" }}>{err}</div>}

      <button onClick={attempt}
        style={{ width:"100%", background:T.navy, color:"#fff", border:"none",
          borderRadius:9, padding:10, fontSize:14, fontWeight:700,
          cursor:"pointer", marginBottom:8 }}>
        Login
      </button>
      <button onClick={onClose}
        style={{ width:"100%", background:T.light, color:T.text, border:"none",
          borderRadius:9, padding:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>
        Cancel
      </button>
    </div>
  </div>
);
}

function SetPinModal({ clubName, currentPin, onSave, onClose, T }) {
  const [pin,  setPin]  = useState(currentPin || "");
  const [show, setShow] = useState(false);

  return (
    <div onClick={onClose} 
      style={{ position:"fixed", inset:0, background:"rgba(0,0,20,.55)",
        display:"flex", alignItems:"center", justifyContent:"center", zIndex:999,
        padding:16, backdropFilter:"blur(4px)" , overflowY:"auto" }}>
      <div onClick={e => e.stopPropagation()} 
        style={{ background:T.surface, borderRadius:16,
          padding:24, width:"100%", maxWidth:320,
          boxShadow:"0 20px 50px rgba(0,0,0,.3)", border:`1px solid ${T.border}`,
          maxHeight:"90dvh", overflowY:"auto" }}>
        <div style={{ fontWeight:800, fontSize:16, color:T.navy, marginBottom:4 }}>Set Club Pin</div>
        <div style={{ fontSize:13, color:T.muted, marginBottom:16 }}>{clubName}</div>

        <div style={{ position:"relative", marginBottom:12 }}>
          <input type={show ? "text" : "password"} value={pin}
            onChange={e => setPin(e.target.value)}
            placeholder="Enter a pin for this club"
            style={{ width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
              padding:"10px 42px 10px 12px", fontSize:15, boxSizing:"border-box",
              background:T.inputBg, color:T.text, fontFamily:"inherit", display:"block" }}/>
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
              background:"none", border:"none", color:T.muted, cursor:"pointer",
              display:"flex", padding:4 }}>
            {show ? IC.eyeOff : IC.eye}
          </button>
        </div>

        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => { if(pin.trim()) onSave(pin.trim()); }}
            style={{ flex:1, background:T.navy, color:"#fff", border:"none",
              borderRadius:9, padding:"10px", fontSize:14, fontWeight:700, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
            {IC.save} Save Pin
          </button>
          <button onClick={onClose}
            style={{ flex:1, background:T.light, color:T.text, border:"none",
              borderRadius:9, padding:"10px", fontSize:14, fontWeight:600, cursor:"pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClubsSection({ data, setData, isAdmin, T, isMobile }) {
  const [selectedClub,    setSelectedClub]    = useState(null);
  const [secretPins, setSecretPins] = useState({});
  const [view, setView] = useState("clubs");
  const [showAddClub,     setShowAddClub]      = useState(false);
  const [editingClub,     setEditingClub]      = useState(null);
  const [clubForm,        setClubForm]         = useState({ name:"", category:"Technical", desc:"", contact:"" });
  const [showLoginModal,  setShowLoginModal]   = useState(false);
  const [clubAdminOf,     setClubAdminOf]      = useState(null); // which club this session's club admin manages
  const [setPinFor,       setSetPinFor]        = useState(null);
  
  useEffect(() => {
    import("./firebase.js").then(({ loadSecrets }) => {
      loadSecrets().then(s => setSecretPins(s.clubPins || {}));
    });
  }, []);

  const clubPins = secretPins;

  const fv = k => e => setClubForm(p => ({ ...p, [k]: e.target.value }));
  const CATS = ["Technical","Cultural","Social","Arts","Literary","Sports"];

  const sortedClubs = [...data.clubs].sort((a, b) => a.name.localeCompare(b.name));
  const today = new Date().toISOString().slice(0, 10);
  const allUpcomingEvents = Object.entries(data.clubEvents || {})
    .flatMap(([clubName, events]) =>
      (events || [])
        .filter(e => !e.date || e.date >= today)
        .map(e => ({ ...e, clubName }))
    )
    .sort((a, b) => (a.date||"9999").localeCompare(b.date||"9999"));

  const del = (clubName) => {
    etData({ ...data, clubs: data.clubs.filter(c => c.name !== clubName) });
  };
  const add     = () => { setData({...data,clubs:[...data.clubs,clubForm]}); setShowAddClub(false); setClubForm({name:"",category:"Technical",desc:"",contact:""}); };
  const saveEdit = (originalName) => {
    const updated = data.clubs.map(c => c.name === originalName ? clubForm : c);
    setData({ ...data, clubs: updated });
    setEditingClub(null);
  };

  const savePin = async (clubName, pin) => {
    const updatedPins = { ...clubPins, [clubName]: pin };
    await saveSecrets({ clubPins: updatedPins });
    setSecretPins(updatedPins);
    setSetPinFor(null);
  };

  const handleClubAdminLogin = (clubName) => {
    setClubAdminOf(clubName);
    setShowLoginModal(false);
    // Open that club's detail immediately
    const club = data.clubs.find(c => c.name === clubName);
    if (club) setSelectedClub(club);
  };

  // If a club is selected, show its detail page
  if (selectedClub) {
    const isClubAdmin = clubAdminOf === selectedClub.name;
    return (
      <div>
        {/* Club admin logout bar */}
        {isClubAdmin && (
          <div style={{ background:"#fef3c7", border:"1px solid #fcd34d", borderRadius:10,
            padding:"8px 14px", marginBottom:16, display:"flex",
            alignItems:"center", justifyContent:"space-between", gap:10 }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#92400e", display:"flex", alignItems:"center", gap:5 }}>
              {IC.lock} Logged in as Club Admin — {selectedClub.name}
            </span>
            <button onClick={() => { setClubAdminOf(null); }}
              style={{ background:"none", border:"1px solid #f59e0b", color:"#92400e",
                borderRadius:7, padding:"4px 10px", fontSize:11, fontWeight:700,
                cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
              {IC.logout} Logout
            </button>
          </div>
        )}
        <ClubDetail
          club={selectedClub}
          data={data}
          setData={setData}
          isAdmin={isAdmin}
          isClubAdmin={isClubAdmin}
          T={T}
          isMobile={isMobile}
          onBack={() => setSelectedClub(null)}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:20 }}>
  <h2 style={{ fontSize:20, fontWeight:800, color:T.navy, margin:0, marginBottom:3, letterSpacing:-.3 }}>
    Clubs & Events
  </h2>
  <p style={{ fontSize:13, color:T.muted, margin:0 }}>
    Student organisations — tap a club to see their upcoming events
  </p>
</div>

{/* View toggle */}
<div style={{ display:"flex", gap:8, marginBottom:18 }}>
  <button onClick={() => setView("clubs")}
    style={{ background: view==="clubs" ? T.navy : T.light,
      color: view==="clubs" ? "#fff" : T.text,
      border:"none", borderRadius:20, padding:"7px 18px",
      fontSize:13, fontWeight:700, cursor:"pointer", touchAction:"manipulation" }}>
    🎓 Clubs
  </button>
  <button onClick={() => setView("events")}
    style={{ background: view==="events" ? T.navy : T.light,
      color: view==="events" ? "#fff" : T.text,
      border:"none", borderRadius:20, padding:"7px 18px",
      fontSize:13, fontWeight:700, cursor:"pointer", touchAction:"manipulation",
      display:"flex", alignItems:"center", gap:6 }}>
    📅 All Upcoming Events
    {allUpcomingEvents.length > 0 && (
      <span style={{ background: view==="events" ? "rgba(255,255,255,.25)" : T.navy,
        color: view==="events" ? "#fff" : "#fff",
        borderRadius:10, fontSize:10, padding:"1px 7px", fontWeight:700 }}>
        {allUpcomingEvents.length}
      </span>
    )}
  </button>
</div>

      {/* Action row */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {isAdmin && (
          <button onClick={() => { setShowAddClub(true); setClubForm({name:"",category:"Technical",desc:"",contact:""}); }}
            style={{ background:T.navy, color:"#fff", border:"none", borderRadius:9,
              padding:"9px 15px", fontSize:13, fontWeight:600,
              display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer" }}>
            + Add Club
          </button>
        )}
        {/* Club admin login button — always visible */}
        {!clubAdminOf && (
          <button onClick={() => setShowLoginModal(true)}
            style={{ background:T.light, color:T.navy, border:`1.5px solid ${T.border}`,
              borderRadius:9, padding:"9px 15px", fontSize:13, fontWeight:600,
              display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer" }}>
            {IC.lock} Club Admin Login
          </button>
        )}
        {clubAdminOf && (
          <div style={{ display:"flex", alignItems:"center", gap:8,
            background:"#fef3c7", border:"1px solid #fcd34d", borderRadius:9,
            padding:"7px 14px", fontSize:13, fontWeight:700, color:"#92400e" }}>
            {IC.lock} Club Admin: {clubAdminOf}
            <button onClick={() => setClubAdminOf(null)}
              style={{ background:"none", border:"none", color:"#92400e",
                cursor:"pointer", fontSize:11, fontWeight:700, padding:0,
                display:"flex", alignItems:"center", gap:3 }}>
              {IC.logout} Logout
            </button>
          </div>
        )}
      </div>

      {/* Add club form */}
      {showAddClub && (
        <div style={{ background:T.surface2, border:`1.5px solid ${T.border}`,
          borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontWeight:700, color:T.navy, marginBottom:12, fontSize:14 }}>New Club</div>
          {[["name","Club Name","e.g. Photography Club"],["contact","Contact Email","club@nitc.ac.in"]].map(([k,l,p])=>(
            <div key={k} style={{ marginBottom:8 }}>
              <div style={{ fontSize:11, fontWeight:600, color:T.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:.5 }}>{l}</div>
              <input value={clubForm[k]} onChange={fv(k)} placeholder={p}
                style={{ width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
                  padding:"9px 12px", fontSize:14, boxSizing:"border-box",
                  background:T.inputBg, color:T.text, fontFamily:"inherit" }}/>
            </div>
          ))}
          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:11, fontWeight:600, color:T.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:.5 }}>Category</div>
            <select value={clubForm.category} onChange={fv("category")}
              style={{ width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
                padding:"9px 12px", fontSize:14, boxSizing:"border-box",
                background:T.inputBg, color:T.text, fontFamily:"inherit" }}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:600, color:T.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:.5 }}>Description</div>
            <textarea value={clubForm.desc} onChange={fv("desc")} placeholder="Brief description…" rows={3}
              style={{ width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
                padding:"9px 12px", fontSize:14, boxSizing:"border-box",
                background:T.inputBg, color:T.text, fontFamily:"inherit", resize:"vertical" }}/>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={add}
              style={{ background:T.navy, color:"#fff", border:"none", borderRadius:8,
                padding:"8px 14px", fontSize:13, fontWeight:600,
                display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer" }}>
              {IC.save} Save
            </button>
            <button onClick={() => setShowAddClub(false)}
              style={{ background:T.light, color:T.text, border:"none", borderRadius:8,
                padding:"8px 14px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* All Upcoming Events view */}
      {view === "events" && (
        <div>
          {allUpcomingEvents.length === 0 && (
            <div style={{ textAlign:"center", padding:"40px 20px", color:T.muted,
              background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, fontSize:14 }}>
              No upcoming events across any club right now.
            </div>
          )}
          {allUpcomingEvents.map((ev, i) => (
            <div key={ev.id || i} style={{ background:T.surface, border:`1px solid ${T.border}`,
              borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
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
                  {/* Club name tag */}
                  <div style={{ fontSize:11, fontWeight:700, color:T.navy,
                    marginBottom:4, textTransform:"uppercase", letterSpacing:.6 }}>
                    {ev.clubName}
                  </div>
                  <div style={{ fontWeight:700, fontSize:15, color:T.text, marginBottom:4 }}>
                    {ev.title}
                  </div>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap", fontSize:12, color:T.muted, marginBottom:4 }}>
                    {ev.time  && <span>🕐 {ev.time}</span>}
                    {ev.venue && <span>📍 {ev.venue}</span>}
                    {ev.fee && (
                      <span style={{ background: ev.fee==="Free" ? "#dcfce7" : "#fef9c3",
                        color: ev.fee==="Free" ? "#166534" : "#854d0e",
                        borderRadius:4, padding:"1px 7px", fontWeight:700, fontSize:11 }}>
                        {ev.fee==="Free" ? "🆓 Free" : `💰 ${ev.feeDetails||"Paid"}`}
                      </span>
                    )}
                  </div>
                  {ev.desc && (
                    <div style={{ fontSize:13, color:T.muted, lineHeight:1.5,
                      display:"-webkit-box", WebkitLineClamp:2,
                      WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                      {ev.desc}
                    </div>
                  )}
                  {/* View full event link */}
                  <button onClick={() => {
                      const club = data.clubs.find(c => c.name === ev.clubName);
                      if (club) { setView("clubs"); setSelectedClub(club); }
                    }}
                    style={{ background:"none", border:"none", color:T.navy,
                      fontSize:12, fontWeight:700, cursor:"pointer",
                      padding:0, marginTop:6, display:"inline-flex", alignItems:"center", gap:3 }}>
                    View full details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Club cards grid */}
      {view === "clubs" && (
        <div className="grid-clubs">
          {sortedClubs.map((cl, i) => {
          const eventCount = ((data.clubEvents || {})[cl.name] || []).length;
          const upcomingCount = ((data.clubEvents || {})[cl.name] || [])
            .filter(e => !e.date || e.date >= new Date().toISOString().slice(0,10)).length;
          const hasPin = !!(clubPins[cl.name]);
          const isThisClubAdmin = clubAdminOf === cl.name;

          if (editingClub === cl.name) return (
            <div key={i} style={{ background:T.surface, border:`1px solid ${T.border}`,
              borderRadius:12, padding:16 }}>
              {[["name","Club Name"],["contact","Contact Email"]].map(([k,l])=>(
                <div key={k} style={{ marginBottom:8 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:T.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:.5 }}>{l}</div>
                  <input value={clubForm[k]} onChange={fv(k)}
                    style={{ width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
                      padding:"9px 12px", fontSize:14, boxSizing:"border-box",
                      background:T.inputBg, color:T.text, fontFamily:"inherit" }}/>
                </div>
              ))}
              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:11, fontWeight:600, color:T.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:.5 }}>Category</div>
                <select value={clubForm.category} onChange={fv("category")}
                  style={{ width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
                    padding:"9px 12px", fontSize:14, boxSizing:"border-box",
                    background:T.inputBg, color:T.text, fontFamily:"inherit" }}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:600, color:T.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:.5 }}>Description</div>
                <textarea value={clubForm.desc} onChange={fv("desc")} rows={3}
                  style={{ width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
                    padding:"9px 12px", fontSize:14, boxSizing:"border-box",
                    background:T.inputBg, color:T.text, fontFamily:"inherit", resize:"vertical" }}/>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => saveEdit(cl.name)}
                  style={{ background:T.navy, color:"#fff", border:"none", borderRadius:8,
                    padding:"8px 14px", fontSize:13, fontWeight:600,
                    display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer" }}>
                  {IC.save} Save
                </button>
                <button onClick={() => setEditingClub(null)}
                  style={{ background:T.light, color:T.text, border:"none", borderRadius:8,
                    padding:"8px 14px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          );

          return (
            <div key={i}
              onClick={() => setSelectedClub(cl)}
              style={{ background:T.surface, border:`1px solid ${isThisClubAdmin ? "#f59e0b" : T.border}`,
                borderRadius:12, padding:16, cursor:"pointer",
                transition:"box-shadow .15s, transform .15s",
                boxShadow: isThisClubAdmin ? "0 0 0 2px #f59e0b" : "none" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,48,135,.12)`; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = isThisClubAdmin?"0 0 0 2px #f59e0b":"none"; e.currentTarget.style.transform="translateY(0)"; }}>

              {/* Card top row */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                <span style={{ background:TAG_COLORS[cl.category]||"#555", color:"#fff",
                  fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:4,
                  textTransform:"uppercase", letterSpacing:.6 }}>
                  {cl.category}
                </span>
                <div style={{ display:"flex", gap:4 }} onClick={e => e.stopPropagation()}>
                  {/* Set Pin button — main admin only */}
                  {isAdmin && (
                    <button onClick={e => { e.stopPropagation(); setSetPinFor(cl.name); }}
                      title={hasPin ? "Change club pin" : "Set club pin"}
                      style={{ background: hasPin ? "#dcfce7" : T.light,
                        border: `1px solid ${hasPin ? "#86efac" : T.border}`,
                        color: hasPin ? "#166534" : T.muted,
                        borderRadius:6, padding:"3px 8px", fontSize:10,
                        fontWeight:700, cursor:"pointer",
                        display:"flex", alignItems:"center", gap:3 }}>
                      {IC.lock} {hasPin ? "Pin ✓" : "Set Pin"}
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <button onClick={e => { e.stopPropagation(); setEditingClub(cl.name); setClubForm({name:cl.name,category:cl.category,desc:cl.desc,contact:cl.contact}); }}
                        style={{ background:"none", border:"none", color:T.navy, cursor:"pointer", padding:"3px 5px", display:"flex" }}>
                        {IC.edit}
                      </button>
                      <button onClick={e => { e.stopPropagation(); del(cl.name); }}
                        style={{ background:"none", border:"none", color:"#dc2626", cursor:"pointer", padding:"3px 5px", display:"flex" }}>
                        {IC.del}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div style={{ fontWeight:700, fontSize:15, color:T.text, margin:"6px 0 5px", lineHeight:1.3 }}>{cl.name}</div>
              <div style={{ fontSize:13, color:T.muted, lineHeight:1.5, marginBottom:10,
                display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                {cl.desc}
              </div>

              {/* Footer row */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", gap:8 }}>
                  {upcomingCount > 0 && (
                    <span style={{ background:"#eff6ff", color:"#1d4ed8", fontSize:11,
                      fontWeight:700, padding:"3px 8px", borderRadius:4 }}>
                      📅 {upcomingCount} upcoming
                    </span>
                  )}
                  {eventCount > 0 && upcomingCount === 0 && (
                    <span style={{ background:T.light, color:T.muted, fontSize:11,
                      fontWeight:600, padding:"3px 8px", borderRadius:4 }}>
                      {eventCount} past event{eventCount>1?"s":""}
                    </span>
                  )}
                </div>
                <span style={{ fontSize:12, color:T.navy, fontWeight:700,
                  display:"flex", alignItems:"center", gap:3 }}>
                  View {IC.arrow}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Modals */}
      {showLoginModal && (
        <ClubAdminLoginModal
          clubs={data.clubs}
          clubPins={secretPins}
          onLogin={handleClubAdminLogin}
          onClose={() => setShowLoginModal(false)}
          T={T}
        />
      )}
      {setPinFor && (
        <SetPinModal
          clubName={setPinFor}
          currentPin={clubPins[setPinFor] || ""}
          onSave={pin => savePin(setPinFor, pin)}
          onClose={() => setSetPinFor(null)}
          T={T}
        />
      )}
    </div>
  );
}