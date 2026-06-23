import { uploadMenuImage, deleteMenuImage, loadLostFound, saveLostFound } from "./firebase.js";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const CATEGORIES = [
  "Electronics", "ID Cards / Documents", "Stationery", "Clothing & Accessories",
  "Bags", "Keys", "Water Bottles", "Sports Equipment", "Books", "Other",
];

const IC = {
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16,flexShrink:0}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  plus:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14,flexShrink:0}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14,flexShrink:0}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  call:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 9.13 19.79 19.79 0 0 1 1.61.5 2 2 0 0 1 3.6 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  mail:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  del:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  image:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:22,height:22,flexShrink:0}}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  pin:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:13,height:13,flexShrink:0}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};

function emptyForm() {
  return {
    itemName:"", category:CATEGORIES[0], date:new Date().toISOString().slice(0,10),
    time:"", venue:"", description:"", contactPhone:"", contactEmail:"",
    imageUrl:"", pin:"",
  };
}

function fmtDate(d) {
  return new Date(d+"T00:00:00").toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
}
function fmtTime(t) {
  if (!t) return "";
  const [h,m] = t.split(":").map(Number);
  const mer = h>=12 ? "PM" : "AM";
  const h12 = h%12===0 ? 12 : h%12;
  return `${h12}:${String(m).padStart(2,"0")} ${mer}`;
}

export default function LostFound({ isAdmin, T, isMobile }) {
  const [lfData, setLfData] = useState({ lostItems: [], foundItems: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLostFound().then(d => { setLfData(d); setLoading(false); });
  }, []);

  const lostItems  = lfData.lostItems  || [];
  const foundItems = lfData.foundItems || [];

  // Local setData equivalent — saves only to the lostfound document
  const setData = async (updated) => {
    setLfData(updated);
    await saveLostFound(updated);
  };
  const data = lfData;

  const [tab,       setTab]       = useState("lost"); // "lost" | "found"
  const [search,    setSearch]    = useState("");
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState(emptyForm());
  const [uploading, setUploading] = useState(false);
  const [formErr,   setFormErr]   = useState("");
  const [deleteFor, setDeleteFor] = useState(null); // item id pending pin confirm
  const [deletePin, setDeletePin] = useState("");
  const [deleteErr, setDeleteErr] = useState("");
  const [viewItem,  setViewItem]  = useState(null);

  const items   = tab === "lost" ? lostItems : foundItems;
  const dataKey = tab === "lost" ? "lostItems" : "foundItems";

  const fv = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const filtered = items
    .filter(it => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (it.itemName||"").toLowerCase().includes(q) ||
             (it.venue||"").toLowerCase().includes(q) ||
             (it.category||"").toLowerCase().includes(q) ||
             (it.description||"").toLowerCase().includes(q);
    })
    .sort((a,b) => {
      const dCmp = (b.date||"").localeCompare(a.date||"");
      if (dCmp !== 0) return dCmp;
      return (b.time||"").localeCompare(a.time||"");
    });

  const groupedByDate = filtered.reduce((acc, it) => {
    const d = it.date || "Unknown date";
    if (!acc[d]) acc[d] = [];
    acc[d].push(it);
    return acc;
  }, {});
  const dateGroups = Object.keys(groupedByDate).sort((a,b) => b.localeCompare(a));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMenuImage(file, `lostfound_${Date.now()}`);
      setForm(p => ({ ...p, imageUrl: url }));
    } catch (err) {
      setFormErr("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const submitItem = () => {
    setFormErr("");
    if (!form.itemName.trim())        return setFormErr("Item name is required.");
    if (!form.venue.trim())           return setFormErr(tab==="lost" ? "Where you lost it is required." : "Where you found it is required.");
    if (!form.contactPhone.trim() && !form.contactEmail.trim())
      return setFormErr("Provide at least a phone number or email.");
    if (!form.pin || form.pin.length !== 4 || !/^\d{4}$/.test(form.pin))
      return setFormErr("Set a 4-digit PIN (numbers only) so you can delete this later.");

    const newItem = {
      id: "lf_" + Date.now(),
      itemName: form.itemName.trim(),
      category: form.category,
      date: form.date,
      time: form.time,
      venue: form.venue.trim(),
      description: form.description.trim(),
      contactPhone: form.contactPhone.trim(),
      contactEmail: form.contactEmail.trim(),
      imageUrl: form.imageUrl,
      pin: form.pin,
      postedAt: Date.now(),
    };

    setData({ ...data, [dataKey]: [newItem, ...items] });
    setShowForm(false);
    setForm(emptyForm());
  };

  const confirmDelete = (item) => {
    if (isAdmin) {
      doDelete(item);
      return;
    }
    setDeleteFor(item.id);
    setDeletePin("");
    setDeleteErr("");
  };

  const doDelete = async (item) => {
    if (item.imageUrl) { try { await deleteMenuImage(item.imageUrl); } catch {} }
    setData({ ...data, [dataKey]: items.filter(i => i.id !== item.id) });
    setDeleteFor(null);
    setViewItem(null);
  };

  const attemptPinDelete = (item) => {
    if (String(deletePin).trim() === String(item.pin).trim()) {
      doDelete(item);
    } else {
      setDeleteErr("Incorrect PIN.");
    }
  };

  const inputS = {
    width:"100%", border:`1.5px solid ${T.border}`, borderRadius:9,
    padding:"9px 12px", fontSize:14, boxSizing:"border-box",
    background:T.inputBg, color:T.text, fontFamily:"inherit", marginBottom:10, display:"block",
  };
  const labelS = { fontSize:11, fontWeight:600, color:T.muted, marginBottom:4,
    textTransform:"uppercase", letterSpacing:.5, display:"block" };

  if (loading) {
    return (
      <div style={{ textAlign:"center", padding:"60px 20px", color:T.muted }}>
        Loading…
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:16 }}>
        <h2 style={{ fontSize:20, fontWeight:800, color:T.navy, margin:0, marginBottom:3, letterSpacing:-.3 }}>
          Lost & Found
        </h2>
        <p style={{ fontSize:13, color:T.muted, margin:0 }}>
          Report a lost item or browse items found around campus
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:0, marginBottom:18,
        background:T.surface2, borderRadius:12, padding:4,
        border:`1px solid ${T.border}`, width:"fit-content" }}>
        {[["lost","🔍 Lost Items"],["found","📦 Found Items"]].map(([id,label]) => (
          <button key={id}
            onClick={() => { setTab(id); setShowForm(false); setSearch(""); }}
            style={{ background:tab===id?T.navy:"none", color:tab===id?"#fff":T.muted,
              border:"none", borderRadius:9, padding:"9px 18px",
              fontSize:13, fontWeight:700, cursor:"pointer",
              transition:"all .15s", touchAction:"manipulation" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Search + Add button */}
      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, minWidth:200 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:T.muted }}>
            {IC.search}
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${tab === "lost" ? "lost" : "found"} items…`}
            style={{ width:"100%", border:`1.5px solid ${T.border}`, borderRadius:10,
              padding:"10px 14px 10px 36px", fontSize:14, boxSizing:"border-box",
              background:T.inputBg, color:T.text, fontFamily:"inherit" }}/>
        </div>
        <button onClick={() => { setShowForm(s=>!s); setForm(emptyForm()); setFormErr(""); }}
          style={{ background:T.navy, color:"#fff", border:"none", borderRadius:10,
            padding:"10px 16px", fontSize:13, fontWeight:700, cursor:"pointer",
            display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
          {IC.plus} Report {tab === "lost" ? "Lost" : "Found"} Item
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background:T.surface2, border:`1.5px solid ${T.border}`,
          borderRadius:14, padding:18, marginBottom:20 }}>
          <div style={{ fontWeight:800, color:T.navy, marginBottom:14, fontSize:15 }}>
            Report a {tab === "lost" ? "Lost" : "Found"} Item
          </div>

          <label style={labelS}>Item Name *</label>
          <input style={inputS} placeholder="e.g. Samsung Buds" value={form.itemName} onChange={fv("itemName")}/>

          <label style={labelS}>Category</label>
          <select style={inputS} value={form.category} onChange={fv("category")}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <div style={{ display:"flex", gap:10 }}>
            <div style={{ flex:1 }}>
              <label style={labelS}>Date</label>
              <input style={inputS} type="date" value={form.date} onChange={fv("date")}/>
            </div>
            <div style={{ flex:1 }}>
              <label style={labelS}>Time</label>
              <input style={inputS} type="time" value={form.time} onChange={fv("time")}/>
            </div>
          </div>

          <label style={labelS}>{tab === "lost" ? "Where did you lose it? *" : "Where did you find it? *"}</label>
          <input style={inputS} placeholder="e.g. Basketball court, Mega hostel" value={form.venue} onChange={fv("venue")}/>

          <label style={labelS}>Description</label>
          <textarea style={{ ...inputS, height:70, resize:"vertical" }}
            placeholder="Any extra details — color, brand, identifying marks…"
            value={form.description} onChange={fv("description")}/>

          <label style={labelS}>Photo (optional)</label>
          <div style={{ marginBottom:10 }}>
            {form.imageUrl ? (
              <div style={{ position:"relative", width:120, height:120 }}>
                <img src={form.imageUrl} alt="Item" style={{ width:120, height:120, objectFit:"cover", borderRadius:10, border:`1px solid ${T.border}` }}/>
                <button onClick={() => setForm(p => ({...p, imageUrl:""}))}
                  style={{ position:"absolute", top:-8, right:-8, background:"#dc2626", color:"#fff",
                    border:"none", borderRadius:"50%", width:24, height:24, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {IC.close}
                </button>
              </div>
            ) : (
              <label style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                border:`1.5px dashed ${T.border}`, borderRadius:10, padding:"20px",
                cursor:"pointer", color:T.muted, background:T.surface }}>
                {uploading ? <span style={{ fontSize:13 }}>Uploading…</span> : (
                  <>
                    {IC.image}
                    <span style={{ fontSize:12 }}>Tap to upload a photo</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display:"none" }} disabled={uploading}/>
              </label>
            )}
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <div style={{ flex:1 }}>
              <label style={labelS}>Contact Phone</label>
              <input style={inputS} type="tel" placeholder="e.g. 9876543210" value={form.contactPhone} onChange={fv("contactPhone")}/>
            </div>
            <div style={{ flex:1 }}>
              <label style={labelS}>Contact Email</label>
              <input style={inputS} type="email" placeholder="e.g. name@nitc.ac.in" value={form.contactEmail} onChange={fv("contactEmail")}/>
            </div>
          </div>

          <label style={labelS}>Set a 4-digit PIN *</label>
          <input style={{ ...inputS, letterSpacing:4, fontWeight:700 }} type="text" inputMode="numeric" maxLength={4}
            placeholder="e.g. 1234" value={form.pin}
            onChange={e => setForm(p => ({ ...p, pin: e.target.value.replace(/\D/g,"").slice(0,4) }))}/>
          <div style={{ fontSize:11, color:T.muted, marginBottom:10, marginTop:-4 }}>
            You'll need this PIN to delete your post later. Choose something you'll remember.
          </div>

          {formErr && <div style={{ color:"#dc2626", fontSize:13, marginBottom:10 }}>{formErr}</div>}

          <div style={{ display:"flex", gap:8 }}>
            <button onClick={submitItem} disabled={uploading}
              style={{ background:T.navy, color:"#fff", border:"none", borderRadius:9,
                padding:"10px 18px", fontSize:13, fontWeight:700, cursor:"pointer", opacity: uploading ? .6 : 1 }}>
              Post {tab === "lost" ? "Lost" : "Found"} Item
            </button>
            <button onClick={() => setShowForm(false)}
              style={{ background:T.light, color:T.text, border:"none", borderRadius:9,
                padding:"10px 18px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"50px 20px", color:T.muted, fontSize:14,
          background:T.surface, border:`1px solid ${T.border}`, borderRadius:14 }}>
          {search.trim()
            ? "No items match your search."
            : `No ${tab === "lost" ? "lost" : "found"} items reported yet.`}
        </div>
      )}

      {/* Item list grouped by date */}
      {dateGroups.map(dateKey => (
        <div key={dateKey} style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.muted, marginBottom:10,
            textTransform:"uppercase", letterSpacing:.6 }}>
            {dateKey === "Unknown date" ? dateKey : fmtDate(dateKey)}
          </div>

          {groupedByDate[dateKey].map(item => {
            const isPendingDelete = deleteFor === item.id;
            return (
              <div key={item.id} style={{ background:T.surface, border:`1px solid ${T.border}`,
                borderRadius:14, padding:14, marginBottom:10 }}>

                {isPendingDelete ? (
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:T.navy, marginBottom:8 }}>
                      Enter your PIN to delete "{item.itemName}"
                    </div>
                    <input
                      type="text" inputMode="numeric" maxLength={4}
                      value={deletePin}
                      onChange={e => { setDeletePin(e.target.value.replace(/\D/g,"").slice(0,4)); setDeleteErr(""); }}
                      placeholder="4-digit PIN"
                      style={{ ...inputS, maxWidth:140, letterSpacing:4, fontWeight:700, marginBottom:8 }}/>
                    {deleteErr && <div style={{ color:"#dc2626", fontSize:12, marginBottom:8 }}>{deleteErr}</div>}
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={() => attemptPinDelete(item)}
                        style={{ background:"#dc2626", color:"#fff", border:"none", borderRadius:8,
                          padding:"7px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                        Confirm Delete
                      </button>
                      <button onClick={() => setDeleteFor(null)}
                        style={{ background:T.light, color:T.text, border:"none", borderRadius:8,
                          padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display:"flex", gap:12 }}>
                    {/* Thumbnail */}
                    <div onClick={() => setViewItem(item)} style={{ cursor:"pointer", flexShrink:0 }}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.itemName}
                          style={{ width:64, height:64, objectFit:"cover", borderRadius:10, border:`1px solid ${T.border}` }}/>
                      ) : (
                        <div style={{ width:64, height:64, borderRadius:10, background:T.light,
                          display:"flex", alignItems:"center", justifyContent:"center", color:T.muted }}>
                          {IC.image}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div onClick={() => setViewItem(item)} style={{ flex:1, minWidth:0, cursor:"pointer" }}>
                      <div style={{ fontWeight:700, fontSize:15, color:T.text, marginBottom:3 }}>
                        {item.itemName}
                      </div>
                      <div style={{ display:"flex", gap:10, flexWrap:"wrap", fontSize:12, color:T.muted, marginBottom:4 }}>
                        {item.time  && <span>🕐 {fmtTime(item.time)}</span>}
                        {item.venue && <span>📍 {item.venue}</span>}
                      </div>
                      <span style={{ background:T.light, color:T.navy, fontSize:10, fontWeight:700,
                        padding:"2px 8px", borderRadius:4, textTransform:"uppercase", letterSpacing:.4 }}>
                        {item.category}
                      </span>
                    </div>

                    {/* Quick actions */}
                    <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0, alignItems:"flex-end" }}>
                      <div style={{ display:"flex", gap:5 }}>
                        {item.contactPhone && (
                          <a href={`tel:${item.contactPhone}`} onClick={e => e.stopPropagation()}
                            style={{ background:"#dcfce7", color:"#166534", border:"none", borderRadius:8,
                              width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center",
                              textDecoration:"none" }}>
                            {IC.call}
                          </a>
                        )}
                        {item.contactEmail && (
                          <a href={`mailto:${item.contactEmail}`} onClick={e => e.stopPropagation()}
                            style={{ background:"#eff6ff", color:"#1d4ed8", border:"none", borderRadius:8,
                              width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center",
                              textDecoration:"none" }}>
                            {IC.mail}
                          </a>
                        )}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); confirmDelete(item); }}
                        style={{ background:"none", border:"none", color:T.muted, cursor:"pointer",
                          fontSize:11, display:"flex", alignItems:"center", gap:3, padding:0 }}>
                        {isAdmin ? IC.del : IC.pin} {isAdmin ? "Delete" : "Remove"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Full detail modal — rendered via portal to escape any ancestor transform/animation context */}
      {viewItem && createPortal(
        <div onClick={() => setViewItem(null)} style={{
          position:"fixed", inset:0,
          background:"rgba(0,0,20,.6)", zIndex:9999,
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"16px 14px", boxSizing:"border-box",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.surface, borderRadius:18, width:"100%", maxWidth:420,
            maxHeight:"100%",
            boxShadow:"0 24px 64px rgba(0,0,0,.35)", border:`1px solid ${T.border}`,
            overflow:"hidden", display:"flex", flexDirection:"column",
          }}>
            <div style={{ overflowY:"auto", flex:1 }}>
            <div style={{ padding:"16px 18px", display:"flex", justifyContent:"space-between",
              alignItems:"flex-start", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ fontWeight:800, fontSize:17, color:T.navy }}>{viewItem.itemName}</div>
              <button onClick={() => setViewItem(null)}
                style={{ background:T.light, border:"none", borderRadius:"50%", width:28, height:28,
                  color:T.text, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {IC.close}
              </button>
            </div>

            {viewItem.imageUrl && (
              <img src={viewItem.imageUrl} alt={viewItem.itemName}
                style={{ width:"100%", maxHeight:280, objectFit:"cover", display:"block" }}/>
            )}

            <div style={{ padding:18 }}>
              <div style={{ display:"flex", gap:20, marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:11, color:T.muted, fontWeight:600, textTransform:"uppercase", marginBottom:2 }}>
                    {tab === "lost" ? "Lost at" : "Found at"}
                  </div>
                  <div style={{ fontWeight:700, fontSize:14, color:T.text }}>{viewItem.venue}</div>
                </div>
                {viewItem.time && (
                  <div>
                    <div style={{ fontSize:11, color:T.muted, fontWeight:600, textTransform:"uppercase", marginBottom:2 }}>Time</div>
                    <div style={{ fontWeight:700, fontSize:14, color:T.text }}>{fmtTime(viewItem.time)}</div>
                  </div>
                )}
              </div>

              {viewItem.description && (
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11, color:T.muted, fontWeight:600, textTransform:"uppercase", marginBottom:4 }}>Description</div>
                  <div style={{ fontSize:14, color:T.text, lineHeight:1.6 }}>{viewItem.description}</div>
                </div>
              )}

              <div style={{ display:"flex", gap:8 }}>
                {viewItem.contactPhone && (
                  <a href={`tel:${viewItem.contactPhone}`}
                    style={{ flex:1, background:"#dcfce7", color:"#166534", textDecoration:"none",
                      borderRadius:9, padding:"10px", fontSize:13, fontWeight:700, textAlign:"center",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    {IC.call} Call
                  </a>
                )}
                {viewItem.contactEmail && (
                  <a href={`mailto:${viewItem.contactEmail}`}
                    style={{ flex:1, background:"#eff6ff", color:"#1d4ed8", textDecoration:"none",
                      borderRadius:9, padding:"10px", fontSize:13, fontWeight:700, textAlign:"center",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    {IC.mail} Email
                  </a>
                )}
              </div>

              <button onClick={() => { setViewItem(null); confirmDelete(viewItem); }}
                style={{ width:"100%", marginTop:10, background:"none",
                  border:`1px solid ${T.border}`, color:T.muted, borderRadius:9,
                  padding:"8px", fontSize:12, fontWeight:600, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                {isAdmin ? IC.del : IC.pin} {isAdmin ? "Delete this post" : "This is my post — remove it"}
              </button>
            </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
