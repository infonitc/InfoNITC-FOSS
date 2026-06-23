import { useState } from "react";
import { useDragReorder } from "./useDrag.js";
import { DEFAULT_CONTACTS } from "./defaultData.js";

const AutoIcon = ({ size=32 }) => (
  <span style={{ fontSize: size * 0.75, lineHeight: 1 }}>🛺</span>
);

const TaxiIcon = ({ size=32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 40" fill="none">
    <rect x="6" y="14" width="52" height="18" rx="4" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5"/>
    <path d="M14 14 C14 14 18 6 26 6 L38 6 C46 6 50 14 50 14Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5"/>
    <rect x="16" y="8" width="12" height="8" rx="2" fill="#bfdbfe"/>
    <rect x="32" y="8" width="12" height="8" rx="2" fill="#bfdbfe"/>
    <circle cx="16" cy="34" r="5.5" fill="#1f2937" stroke="#374151" strokeWidth="1"/>
    <circle cx="16" cy="34" r="2" fill="#9ca3af"/>
    <circle cx="48" cy="34" r="5.5" fill="#1f2937" stroke="#374151" strokeWidth="1"/>
    <circle cx="48" cy="34" r="2" fill="#9ca3af"/>
    <rect x="28" y="6" width="8" height="3" rx="1" fill="#fde68a"/>
    <text x="32" y="22" textAnchor="middle" fill="#92400e" fontSize="7" fontWeight="bold" fontFamily="sans-serif">TAXI</text>
  </svg>
);

const IC = {
  plus:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14,flexShrink:0}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  del:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  save:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:13,height:13,flexShrink:0}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  drag:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16,flexShrink:0,opacity:.35}}><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="18" x2="16" y2="18"/></svg>,
};

const SUBSECTIONS = [
  { key:"official",  label:"Official Contacts", emoji:"🏛️" },
  { key:"autoTaxi",  label:"Auto / Taxi",        emoji:"🚖" },
  { key:"helpline",  label:"Helplines",           emoji:"🆘" },
  { key:"other",     label:"Other Services",      emoji:"🔧" },
];

function ContactList({ items, onReorder, onUpdate, onDelete, isAdmin, T, showTypeToggle=false }) {
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState({});
  const fv = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const { dragProps, reorderStyle } = useDragReorder(items, onReorder);

  const inputS = { width:"100%", border:`1.5px solid ${T.border}`, borderRadius:8,
    padding:"8px 11px", fontSize:14, boxSizing:"border-box",
    background:T.inputBg, color:T.text, fontFamily:"inherit", marginBottom:6 };

  const save = () => { onUpdate(editing, form); setEditing(null); };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {items.map((c, i) => (
        <div key={c.id} {...(isAdmin ? dragProps(i) : {})}
          style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:11,
            padding:"11px 13px", display:"flex", alignItems:"center", gap:10,
            ...(isAdmin ? reorderStyle(i) : {}) }}>

          {isAdmin && <div style={{flexShrink:0}}>{IC.drag}</div>}

          {editing === c.id ? (
            <div style={{ flex:1 }}>
              <input style={inputS} placeholder="Name" value={form.name||""} onChange={fv("name")}/>
              <input style={inputS} placeholder="Phone number" value={form.number||""} onChange={fv("number")} type="tel"/>
              <input style={inputS} placeholder="Note (e.g. 24x7, Ext 200)" value={form.note||""} onChange={fv("note")}/>
              {showTypeToggle && (
                <div style={{ display:"flex", gap:8, margin:"6px 0" }}>
                  {["auto","taxi"].map(t => (
                    <button key={t} onClick={() => setForm(p => ({...p, type:t}))}
                      style={{ flex:1, padding:"6px", border:`2px solid ${form.type===t?T.navy:T.border}`,
                        borderRadius:8, background:form.type===t?T.light:T.surface,
                        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                        fontWeight:700, fontSize:12, color:form.type===t?T.navy:T.muted }}>
                      {t==="auto" ? <AutoIcon size={24}/> : <TaxiIcon size={24}/>}
                      {t.charAt(0).toUpperCase()+t.slice(1)}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display:"flex", gap:6, marginTop:4 }}>
                <button onClick={save}
                  style={{ background:T.navy, color:"#fff", border:"none", borderRadius:7, padding:"7px 12px",
                    fontSize:12, fontWeight:600, display:"inline-flex", alignItems:"center", gap:4, cursor:"pointer" }}>
                  {IC.save} Save
                </button>
                <button onClick={() => setEditing(null)}
                  style={{ background:T.light, color:T.text, border:"none", borderRadius:7, padding:"7px 12px",
                    fontSize:12, fontWeight:600, cursor:"pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Auto/Taxi icon */}
              {showTypeToggle && (
                <div style={{ flexShrink:0 }}>
                  {c.type==="taxi" ? <TaxiIcon size={36}/> : <AutoIcon size={36}/>}
                </div>
              )}

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, color:T.text, marginBottom:2 }}>{c.name}</div>
                <a href={`tel:${c.number}`}
                  style={{ fontSize:15, fontWeight:800, color:T.navy, display:"block", marginBottom:2 }}>
                  {c.number}
                </a>
                {c.note && <div style={{ fontSize:11, color:T.muted }}>{c.note}</div>}
              </div>

              {isAdmin && (
                <div style={{ display:"flex", gap:4, flexShrink:0 }}>
                  <button onClick={() => { setEditing(c.id); setForm({...c}); }}
                    style={{ background:"none", border:"none", color:T.navy, cursor:"pointer", padding:"4px 5px", display:"flex" }}>{IC.edit}</button>
                  <button onClick={() => onDelete(c.id)}
                    style={{ background:"none", border:"none", color:"#dc2626", cursor:"pointer", padding:"4px 5px", display:"flex" }}>{IC.del}</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function AddForm({ onSave, onCancel, T, showTypeToggle=false }) {
  const [form, setForm] = useState({ name:"", number:"", note:"", type:"auto" });
  const fv = k => e => setForm(p => ({...p, [k]: e.target.value}));
  const inputS = { width:"100%", border:`1.5px solid ${T.border}`, borderRadius:8,
    padding:"8px 11px", fontSize:14, boxSizing:"border-box",
    background:T.inputBg, color:T.text, fontFamily:"inherit", marginBottom:6 };
  return (
    <div style={{ background:T.surface2, border:`1.5px solid ${T.border}`,
      borderRadius:11, padding:14, marginBottom:10 }}>
      <input style={inputS} placeholder="Name / Department" value={form.name} onChange={fv("name")}/>
      <input style={inputS} placeholder="Phone number" value={form.number} onChange={fv("number")} type="tel"/>
      <input style={inputS} placeholder="Note (e.g. 24x7)" value={form.note} onChange={fv("note")}/>
      {showTypeToggle && (
        <div style={{ display:"flex", gap:8, margin:"6px 0" }}>
          {["auto","taxi"].map(t => (
            <button key={t} onClick={() => setForm(p => ({...p, type:t}))}
              style={{ flex:1, padding:"6px", border:`2px solid ${form.type===t?T.navy:T.border}`,
                borderRadius:8, background:form.type===t?T.light:T.surface,
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                fontWeight:700, fontSize:12, color:form.type===t?T.navy:T.muted }}>
              {t==="auto" ? <AutoIcon size={24}/> : <TaxiIcon size={24}/>}
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
      )}
      <div style={{ display:"flex", gap:6, marginTop:6 }}>
        <button onClick={() => onSave({...form, id:"c_"+Date.now()})}
          style={{ background:T.navy, color:"#fff", border:"none", borderRadius:7, padding:"7px 12px",
            fontSize:12, fontWeight:600, display:"inline-flex", alignItems:"center", gap:4, cursor:"pointer" }}>
          {IC.save} Save
        </button>
        <button onClick={onCancel}
          style={{ background:T.light, color:T.text, border:"none", borderRadius:7, padding:"7px 12px",
            fontSize:12, fontWeight:600, cursor:"pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ContactsSection({ data, setData, isAdmin, T, isMobile }) {
  const [activeTab, setActiveTab] = useState("official");
  const [adding,    setAdding]    = useState(false);

  // Migrate old flat contacts array to new structure if needed
  const contacts = data.contacts_v2 || DEFAULT_CONTACTS;

  const updateContacts = (newContacts) => setData({ ...data, contacts_v2: newContacts });

  const handleReorder = (key, reordered) =>
    updateContacts({ ...contacts, [key]: reordered });

  const handleUpdate = (key, id, form) =>
    updateContacts({ ...contacts, [key]: contacts[key].map(c => c.id===id ? {...c,...form} : c) });

  const handleDelete = (key, id) =>
    updateContacts({ ...contacts, [key]: contacts[key].filter(c => c.id!==id) });

  const handleAdd = (key, item) => {
    updateContacts({ ...contacts, [key]: [...contacts[key], item] });
    setAdding(false);
  };

  const active = SUBSECTIONS.find(s => s.key === activeTab);

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:800, color:T.navy, margin:0, marginBottom:3, letterSpacing:-.3 }}>
          Contacts
        </h2>
        <p style={{ fontSize:13, color:T.muted, margin:0 }}>
          Important numbers — tap to call on mobile
          {isAdmin && <span style={{ marginLeft:8, fontSize:11 }}>· Drag to reorder</span>}
        </p>
      </div>

      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:18 }}>
        {SUBSECTIONS.map(s => (
          <button key={s.key} onClick={() => { setActiveTab(s.key); setAdding(false); }}
            style={{ background:activeTab===s.key?T.navy:T.light,
              color:activeTab===s.key?"#fff":T.text,
              border:"none", borderRadius:20, padding:"7px 14px",
              fontSize:12, fontWeight:700, cursor:"pointer", touchAction:"manipulation",
              display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* Add button */}
      {isAdmin && !adding && (
        <button onClick={() => setAdding(true)}
          style={{ background:T.navy, color:"#fff", border:"none", borderRadius:9,
            padding:"9px 15px", fontSize:13, fontWeight:600, display:"inline-flex",
            alignItems:"center", gap:5, cursor:"pointer", marginBottom:14 }}>
          {IC.plus} Add to {active?.label}
        </button>
      )}

      {adding && (
        <AddForm
          T={T}
          showTypeToggle={activeTab==="autoTaxi"}
          onSave={item => handleAdd(activeTab, item)}
          onCancel={() => setAdding(false)}
        />
      )}

      {/* Helpline warning */}
      {activeTab==="helpline" && (
        <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10,
          padding:"9px 14px", fontSize:12, color:"#991b1b", marginBottom:14,
          display:"flex", alignItems:"center", gap:8, lineHeight:1.5 }}>
          🆘 <span>In an emergency always call <strong>112</strong> (All-in-one emergency number)</span>
        </div>
      )}

      <ContactList
        key={activeTab}
        items={contacts[activeTab] || []}
        onReorder={reordered => handleReorder(activeTab, reordered)}
        onUpdate={(id, form) => handleUpdate(activeTab, id, form)}
        onDelete={id => handleDelete(activeTab, id)}
        isAdmin={isAdmin}
        T={T}
        showTypeToggle={activeTab==="autoTaxi"}
      />
    </div>
  );
}
