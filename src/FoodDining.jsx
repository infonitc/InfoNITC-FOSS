import { useState, useRef } from "react";
import { uploadMenuImage } from "./firebase.js";
import { useDragReorder } from "./useDrag.js";

const TYPES = ["Restaurant", "Bakery", "Cafe", "Canteen", "Fast Food", "Other"];

const IC = {
  plus:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14,flexShrink:0}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  del:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  save:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  close:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:13,height:13,flexShrink:0}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  map:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  phone:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 9.13 19.79 19.79 0 0 1 1.61.5 2 2 0 0 1 3.6 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  img:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  drag:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16,flexShrink:0,opacity:.4}}><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="18" x2="16" y2="18"/></svg>,
  spin:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:15,height:15,animation:"spin .7s linear infinite",flexShrink:0}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  menu:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M3 3h18M3 9h18M3 15h18M3 21h18"/></svg>,
  expand: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16,flexShrink:0}}><polyline points="6 9 12 15 18 9"/></svg>,
};

const TYPE_COLORS = {
  Restaurant:"#1a6eb5", Bakery:"#c2410c", Cafe:"#92400e",
  Canteen:"#065f46", "Fast Food":"#d97706", Other:"#6b7280",
};

function emptyForm() {
  return { name:"", type:"Restaurant", delivery:false, phone:"", mapLink:"", description:"", menuImages:[] };
}
function FormBody({ form, setForm, uploading, fileRef, T, onImageUpload }) {
  const fv = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const ft = k => e => setForm(p => ({ ...p, [k]: e.target.checked }));
  const removeImage = (idx) =>
    setForm(p => ({ ...p, menuImages: p.menuImages.filter((_,i) => i!==idx) }));

  const inputStyle = {
    width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
    padding:"9px 12px", fontSize:14, boxSizing:"border-box",
    background:T.inputBg, color:T.text, fontFamily:"inherit",
    marginBottom:8, display:"block",
  };
  const labelStyle = {
    fontSize:11, fontWeight:600, color:T.muted, marginBottom:4,
    letterSpacing:.5, textTransform:"uppercase", display:"block", marginTop:8,
  };

  return (
    <div>
      <label style={labelStyle}>Name *</label>
      <input style={inputStyle} placeholder="e.g. Hotel Saravana Bhavan" value={form.name} onChange={fv("name")}/>
      <label style={labelStyle}>Type</label>
      <select style={inputStyle} value={form.type} onChange={fv("type")}>
        {TYPES.map(t => <option key={t}>{t}</option>)}
      </select>
      <label style={labelStyle}>Description</label>
      <textarea style={{...inputStyle, height:60, resize:"vertical"}} placeholder="Brief description…" value={form.description} onChange={fv("description")}/>
      <label style={labelStyle}>Phone Number</label>
      <input style={inputStyle} placeholder="e.g. 9400000000" value={form.phone} onChange={fv("phone")} type="tel"/>
      <label style={labelStyle}>Google Maps Link</label>
      <input style={inputStyle} placeholder="https://maps.google.com/..." value={form.mapLink} onChange={fv("mapLink")}/>
      <div style={{ display:"flex", alignItems:"center", gap:10, margin:"10px 0" }}>
        <input type="checkbox" id="delivery_toggle" checked={form.delivery} onChange={ft("delivery")}
          style={{ width:18, height:18, cursor:"pointer", accentColor:T.navy }}/>
        <label htmlFor="delivery_toggle" style={{ fontSize:14, color:T.text, cursor:"pointer", fontWeight:600 }}>
          Offers Delivery
        </label>
      </div>
      <label style={labelStyle}>Menu Images</label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:8 }}>
        {(form.menuImages||[]).map((url,i) => (
          <div key={i} style={{ position:"relative", width:80, height:80 }}>
            <img src={url} alt="menu" style={{ width:80, height:80, objectFit:"cover", borderRadius:8, border:`1px solid ${T.border}` }}/>
            <button onClick={() => removeImage(i)}
              style={{ position:"absolute", top:-6, right:-6, background:"#dc2626", color:"#fff",
                border:"none", borderRadius:"50%", width:20, height:20, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>×</button>
          </div>
        ))}
        <button onClick={() => fileRef.current.click()} disabled={uploading}
          style={{ width:80, height:80, border:`2px dashed ${T.border}`, borderRadius:8,
            background:T.surface2, color:T.muted, cursor:"pointer", display:"flex",
            flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, fontSize:11 }}>
          {uploading ? "Uploading…" : "Add Photo"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={onImageUpload}/>
      </div>
    </div>
  );
}

export default function FoodDiningSection({ data, setData, isAdmin, T, isMobile }) {
  const dining = data.dining || [];
  const [showAdd,   setShowAdd]   = useState(false);
  const [editing,   setEditing]   = useState(null); // id
  const [form,      setForm]      = useState(emptyForm());
  const [expanded,  setExpanded]  = useState({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();


  const { dragProps, reorderStyle } = useDragReorder(dining, reordered =>
    setData({ ...data, dining: reordered })
  );

  const toggleExpand = id => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMenuImage(file, form.id || "new_" + Date.now());
      setForm(p => ({ ...p, menuImages: [...(p.menuImages || []), url] }));
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally { setUploading(false); }
  };

  const saveAdd = () => {
    if (!form.name.trim()) return;
    const entry = { ...form, id: "d_" + Date.now() };
    setData({ ...data, dining: [...dining, entry] });
    setShowAdd(false); setForm(emptyForm());
  };

  const saveEdit = () => {
    setData({ ...data, dining: dining.map(d => d.id===editing ? { ...d, ...form } : d) });
    setEditing(null);
  };

  const del = id => setData({ ...data, dining: dining.filter(d => d.id!==id) });

  const startEdit = (d) => { setEditing(d.id); setForm({ ...d }); setShowAdd(false); };

  const inputStyle = {
    width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
    padding:"9px 12px", fontSize:14, boxSizing:"border-box",
    background:T.inputBg, color:T.text, fontFamily:"inherit",
    marginBottom:8, display:"block",
  };
  const labelStyle = { fontSize:11, fontWeight:600, color:T.muted, marginBottom:4,
    letterSpacing:.5, textTransform:"uppercase", display:"block", marginTop:8 };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:800, color:T.navy, margin:0, marginBottom:3, letterSpacing:-.3 }}>
          Food &amp; Dining
        </h2>
        <p style={{ fontSize:13, color:T.muted, margin:0 }}>
          Restaurants, bakeries and cafes near NITC campus
          {isAdmin && <span style={{ marginLeft:8, fontSize:11, color:T.muted }}>· Drag cards to reorder</span>}
        </p>
      </div>

      {isAdmin && (
        <button onClick={() => { setShowAdd(true); setForm(emptyForm()); setEditing(null); }}
          style={{ background:T.navy, color:"#fff", border:"none", borderRadius:9,
            padding:"9px 15px", fontSize:13, fontWeight:600, display:"inline-flex",
            alignItems:"center", gap:5, cursor:"pointer", marginBottom:16 }}>
          {IC.plus} Add Restaurant / Bakery
        </button>
      )}

      {/* Add form */}
      {showAdd && (
        <div style={{ background:T.surface2, border:`1.5px solid ${T.border}`,
          borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontWeight:700, color:T.navy, marginBottom:4, fontSize:14 }}>New Place</div>
          <FormBody form={form} setForm={setForm} uploading={uploading} fileRef={fileRef} T={T} onImageUpload={handleImageUpload}/>
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <button onClick={saveAdd}
              style={{ background:T.navy, color:"#fff", border:"none", borderRadius:8, padding:"8px 14px",
                fontSize:13, fontWeight:600, display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer" }}>
              {IC.save} Save
            </button>
            <button onClick={() => setShowAdd(false)}
              style={{ background:T.light, color:T.text, border:"none", borderRadius:8, padding:"8px 14px",
                fontSize:13, fontWeight:600, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cards */}
      {dining.length === 0 && !showAdd && (
        <div style={{ textAlign:"center", padding:"40px 20px", color:T.muted, fontSize:14 }}>
          No places added yet.{isAdmin ? " Click 'Add' to get started." : ""}
        </div>
      )}

      {dining.map((d, i) => {
        const isExpanded = expanded[d.id];
        const isEditingThis = editing === d.id;

        return (
          <div key={d.id} {...(isAdmin ? dragProps(i) : {})}
            style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14,
              marginBottom:12, overflow:"hidden", ...( isAdmin ? reorderStyle(i) : {} ) }}>

            {isEditingThis ? (
              <div style={{ padding:16 }}>
                <div style={{ fontWeight:700, color:T.navy, marginBottom:8, fontSize:14 }}>Edit Place</div>
                <FormBody form={form} setForm={setForm} uploading={uploading} fileRef={fileRef} T={T} onImageUpload={handleImageUpload}/>
                <div style={{ display:"flex", gap:8, marginTop:4 }}>
                  <button onClick={saveEdit}
                    style={{ background:T.navy, color:"#fff", border:"none", borderRadius:8, padding:"8px 14px",
                      fontSize:13, fontWeight:600, display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer" }}>
                    {IC.save} Save
                  </button>
                  <button onClick={() => setEditing(null)}
                    style={{ background:T.light, color:T.text, border:"none", borderRadius:8, padding:"8px 14px",
                      fontSize:13, fontWeight:600, cursor:"pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Card header */}
                <div style={{ padding:"14px 16px", display:"flex", alignItems:"flex-start", gap:10 }}>
                  {isAdmin && <div style={{ paddingTop:2, flexShrink:0 }}>{IC.drag}</div>}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                      <span style={{ fontWeight:700, fontSize:15, color:T.text }}>{d.name}</span>
                      <span style={{ background:TYPE_COLORS[d.type]||"#555", color:"#fff",
                        fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:4,
                        textTransform:"uppercase", letterSpacing:.6 }}>{d.type}</span>
                      {d.delivery && (
                        <span style={{ background:"#dcfce7", color:"#166534", fontSize:10,
                          fontWeight:700, padding:"2px 8px", borderRadius:4, letterSpacing:.5 }}>
                          🚚 Delivery
                        </span>
                      )}
                    </div>
                    {d.description && (
                      <div style={{ fontSize:13, color:T.muted, lineHeight:1.5, marginBottom:6 }}>{d.description}</div>
                    )}
                    <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                      {d.phone && (
                        <a href={`tel:${d.phone}`}
                          style={{ display:"flex", alignItems:"center", gap:5, fontSize:13,
                            color:T.navy, fontWeight:600, textDecoration:"none" }}>
                          {IC.phone} {d.phone}
                        </a>
                      )}
                      {d.mapLink && (
                        <a href={d.mapLink} target="_blank" rel="noopener noreferrer"
                          style={{ display:"flex", alignItems:"center", gap:5, fontSize:13,
                            color:"#059669", fontWeight:600, textDecoration:"none" }}>
                          {IC.map} View on Map
                        </a>
                      )}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:4, flexShrink:0, alignItems:"center" }}>
                    {(d.menuImages||[]).length > 0 && (
                      <button onClick={() => toggleExpand(d.id)}
                        style={{ background:T.light, border:"none", borderRadius:7, padding:"6px 10px",
                          fontSize:11, fontWeight:700, color:T.navy, cursor:"pointer",
                          display:"flex", alignItems:"center", gap:4 }}>
                        {IC.menu} Menu {isExpanded ? "▲" : "▼"}
                      </button>
                    )}
                    {isAdmin && (<>
                      <button onClick={() => startEdit(d)}
                        style={{ background:"none", border:"none", color:T.navy,
                          cursor:"pointer", padding:"4px 6px", display:"flex" }}>{IC.edit}</button>
                      <button onClick={() => del(d.id)}
                        style={{ background:"none", border:"none", color:"#dc2626",
                          cursor:"pointer", padding:"4px 6px", display:"flex" }}>{IC.del}</button>
                    </>)}
                  </div>
                </div>

                {/* Menu images */}
                {isExpanded && (d.menuImages||[]).length > 0 && (
                  <div style={{ borderTop:`1px solid ${T.border}`, padding:"12px 16px",
                    background:T.surface2 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:T.muted,
                      textTransform:"uppercase", letterSpacing:.8, marginBottom:10 }}>📋 Menu</div>
                    <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                      {d.menuImages.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt={`Menu ${i+1}`}
                            style={{ height:isMobile?140:200, width:"auto", maxWidth:"100%",
                              objectFit:"contain", borderRadius:10,
                              border:`1px solid ${T.border}`, cursor:"pointer" }}/>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
