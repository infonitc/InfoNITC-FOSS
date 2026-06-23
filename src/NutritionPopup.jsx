import { useState } from "react";
import { createPortal } from "react-dom";

const NUTRIENTS = [
  { key:"kcal",    label:"Calories",    unit:"kcal", icon:"🔥", color:"#ef4444", group:"macro" },
  { key:"protein", label:"Protein",     unit:"g",    icon:"💪", color:"#3b82f6", group:"macro" },
  { key:"carbs",   label:"Carbohydrates",unit:"g",   icon:"🌾", color:"#f59e0b", group:"macro" },
  { key:"fat",     label:"Total Fat",   unit:"g",    icon:"🫙", color:"#8b5cf6", group:"macro" },
  { key:"fibre",   label:"Dietary Fibre",unit:"g",   icon:"🌿", color:"#10b981", group:"macro" },
  { key:"sugar",   label:"Sugar",       unit:"g",    icon:"🍬", color:"#f97316", group:"macro" },
  { key:"sodium",  label:"Sodium",      unit:"mg",   icon:"🧂", color:"#6b7280", group:"micro" },
  { key:"calcium", label:"Calcium",     unit:"mg",   icon:"🦷", color:"#0ea5e9", group:"micro" },
  { key:"iron",    label:"Iron",        unit:"mg",   icon:"⚙️", color:"#78350f", group:"micro" },
  { key:"vitC",    label:"Vitamin C",   unit:"mg",   icon:"🍊", color:"#f59e0b", group:"micro" },
  { key:"vitA",    label:"Vitamin A",   unit:"mcg",  icon:"🥕", color:"#ea580c", group:"micro" },
];

// Daily Reference Intakes (ICMR India 2020 — sedentary adult)
const DRI = {
  kcal:2000, protein:50, carbs:300, fat:65, fibre:25,
  sugar:50,  sodium:2000, calcium:1000, iron:17, vitC:40, vitA:600,
};

export default function NutritionPopup({ nutrition, mealLabel, dayKey, T, onClose }) {
  const [tab, setTab] = useState("macro");
  if (!nutrition) return null;

  const { totals, sources } = nutrition;
  const macros  = NUTRIENTS.filter(n => n.group==="macro");
  const micros  = NUTRIENTS.filter(n => n.group==="micro");
  const shown   = tab==="macro" ? macros : tab==="micro" ? micros : [];

  const pct = (key) => Math.min(100, Math.round((totals[key]/(DRI[key]||1))*100));

  return createPortal(
    <div onClick={onClose} style={{
      position:"fixed", inset:0,
      background:"rgba(0,0,20,.7)", zIndex:9999,
      backdropFilter:"blur(6px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"16px 14px", boxSizing:"border-box",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:T.surface, borderRadius:20,
        width:"100%", maxWidth:420,
        maxHeight:"100%",
        boxShadow:"0 24px 64px rgba(0,0,0,.4)",
        border:`1px solid ${T.border}`,
        overflow:"hidden", display:"flex", flexDirection:"column",
      }}>
        {/* Header */}
        <div style={{
          background:`linear-gradient(135deg,${T.navy},#1a5cbf)`,
          padding:"16px 18px",
          display:"flex", justifyContent:"space-between", alignItems:"flex-start",
        }}>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.6)",fontWeight:700,
              textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>
              Nutritional Values
            </div>
            <div style={{fontSize:17,fontWeight:800,color:"#fff"}}>{mealLabel}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.65)",marginTop:2}}>
              {dayKey} — combined total
            </div>
          </div>
          <button onClick={onClose} style={{
            background:"rgba(255,255,255,.15)", border:"none",
            borderRadius:"50%", width:28, height:28, color:"#fff",
            cursor:"pointer", display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:16, flexShrink:0,
          }}>×</button>
        </div>

        {/* Calorie hero */}
        <div style={{
          background:T.surface2, padding:"14px 18px",
          display:"flex", alignItems:"center", gap:16,
          borderBottom:`1px solid ${T.border}`,
        }}>
          <div style={{textAlign:"center", flexShrink:0}}>
            <div style={{fontSize:36, fontWeight:900, color:"#ef4444", lineHeight:1}}>
              {totals.kcal}
            </div>
            <div style={{fontSize:11, color:T.muted, fontWeight:600}}>kcal</div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:12, color:T.muted, marginBottom:6}}>
              % of daily reference intake (ICMR 2020)
            </div>
            <div style={{background:T.border, borderRadius:6, height:8, overflow:"hidden"}}>
              <div style={{
                height:"100%", borderRadius:6,
                width:`${pct("kcal")}%`,
                background:"linear-gradient(90deg,#ef4444,#f97316)",
                transition:"width .5s ease",
              }}/>
            </div>
            <div style={{fontSize:11, color:T.muted, marginTop:4}}>
              {pct("kcal")}% of {DRI.kcal} kcal daily target
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex", borderBottom:`1px solid ${T.border}`}}>
          {[["macro","Macronutrients"],["micro","Micronutrients"],["sources","Food Items"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{
                flex:1, padding:"10px 6px", border:"none",
                background: tab===id ? T.surface : T.surface2,
                color: tab===id ? T.navy : T.muted,
                fontWeight: tab===id ? 700 : 500, fontSize:12,
                cursor:"pointer", borderBottom: tab===id ? `2px solid ${T.navy}` : "2px solid transparent",
                transition:"all .15s",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{padding:"14px 18px", overflowY:"auto", flex:1}}>

          {/* Macro / Micro nutrients */}
          {(tab==="macro"||tab==="micro") && (
            <div style={{display:"flex", flexDirection:"column", gap:10}}>
              {shown.map(n => {
                const val    = totals[n.key]||0;
                const pcVal  = pct(n.key);
                return (
                  <div key={n.key}>
                    <div style={{display:"flex", justifyContent:"space-between",
                      alignItems:"center", marginBottom:4}}>
                      <div style={{display:"flex", alignItems:"center", gap:6}}>
                        <span style={{fontSize:14}}>{n.icon}</span>
                        <span style={{fontSize:13, fontWeight:600, color:T.text}}>{n.label}</span>
                      </div>
                      <div style={{display:"flex", alignItems:"baseline", gap:4}}>
                        <span style={{fontSize:16, fontWeight:800, color:n.color}}>
                          {val}
                        </span>
                        <span style={{fontSize:11, color:T.muted}}>{n.unit}</span>
                        <span style={{fontSize:11, color:T.muted, marginLeft:4}}>
                          ({pcVal}% DRI)
                        </span>
                      </div>
                    </div>
                    <div style={{background:T.border, borderRadius:4, height:6, overflow:"hidden"}}>
                      <div style={{
                        height:"100%", borderRadius:4,
                        width:`${pcVal}%`,
                        background:n.color,
                        opacity:.75,
                        transition:"width .4s ease",
                      }}/>
                    </div>
                  </div>
                );
              })}

              {/* DRI note */}
              <div style={{
                marginTop:8, padding:"8px 12px",
                background:T.surface2, borderRadius:8,
                fontSize:11, color:T.muted, lineHeight:1.5,
              }}>
                DRI = Daily Reference Intake for a sedentary adult (ICMR India 2020).
                Values shown are for this meal only.
              </div>
            </div>
          )}

          {/* Food sources */}
          {tab==="sources" && (
            <div>
              <div style={{fontSize:12, color:T.muted, marginBottom:10, lineHeight:1.5}}>
                Nutritional values calculated from the following items and serving sizes:
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:6}}>
                {sources.map((s,i) => (
                  <div key={i} style={{
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                    background:T.surface2, borderRadius:8, padding:"7px 11px",
                    gap:8,
                  }}>
                    <span style={{fontSize:13, color:T.text, fontWeight:600, textTransform:"capitalize"}}>
                      {s.name}
                    </span>
                    <span style={{fontSize:11, color:T.muted, whiteSpace:"nowrap", flexShrink:0}}>
                      {s.serving}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div style={{
          padding:"10px 18px 16px",
          borderTop:`1px solid ${T.border}`,
          fontSize:11, color:T.muted, lineHeight:1.55,
          background:T.surface2,
        }}>
          ⚠️ <strong>Disclaimer:</strong> These are approximate values based on standard
          serving sizes (IFCT 2017, NIN Hyderabad, USDA). Actual values may vary based
          on cooking method, quantity served, and ingredient quality.
          Where the mess PDF specifies serving sizes (e.g. 50g paneer, 80g chicken),
          those have been used; all other items use standard serving sizes.
        </div>
      </div>
    </div>,
    document.body
  );
}
