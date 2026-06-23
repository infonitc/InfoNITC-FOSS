import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { loadData, saveData, loginAdmin, logoutAdmin, changeAdminPassword, onAuthChanged, loadSecrets } from "./firebase.js";
import { DEFAULT_DATA, DEFAULT_CONTACTS, DEFAULT_DINING, DAYS, MESS_GROUPS } from "./defaultData.js";
import FoodDiningSection from "./FoodDining.jsx";
import ContactsSection   from "./Contacts.jsx";
import { useDragReorder } from "./useDrag.js";
import ExamSchedule from "./ExamSchedule.jsx";
import ClubsSection from "./Clubs.jsx";
import SpinWheel from "./SpinWheel.jsx";
import AcademicCalendar from "./AcademicCalendar.jsx";
import NutritionPopup from "./NutritionPopup.jsx";
import { getRotationalNutrition, getEMessNutrition } from "./nutritionData.js";
import LostFound from "./LostFound.jsx";
import AnnouncementManager, { AnnouncementBanner } from "./Announcement.jsx";

// ─── Theme ────────────────────────────────────────────────────────────────────
function makeTheme(dark) {
  return dark ? {
    bg:"#0f1117",surface:"#1a1d27",surface2:"#22263a",border:"#2e3350",
    text:"#e8eaf2",muted:"#7a88aa",navy:"#4a8cff",blue:"#6fa3ff",
    light:"#1e2340",inputBg:"#1e2340",
    headerGrad:"linear-gradient(135deg,#060a1a 0%,#0d1a3a 55%,#0f2060 100%)",
    navBg:"rgba(0,0,0,.3)",mutedCard:"#13161f",
  } : {
    bg:"#f0f4fb",surface:"#ffffff",surface2:"#f4f7ff",border:"#dde3ef",
    text:"#1a1a2e",muted:"#7a8aaa",navy:"#003087",blue:"#1a5cbf",
    light:"#eef3ff",inputBg:"#ffffff",
    headerGrad:"linear-gradient(135deg,#001f5e 0%,#003087 55%,#004bb5 100%)",
    navBg:"rgba(0,0,0,.15)",mutedCard:"#f8f9fb",
  };
}

const TAG_COLORS = {
  Academic:"#1a4fa0",Event:"#d97706",Hostel:"#059669",General:"#6b7280",
  Holiday:"#dc2626",Exam:"#7c3aed",Technical:"#1a6eb5",Cultural:"#c2410c",
  Social:"#065f46",Arts:"#92400e",Literary:"#4c1d95",Sports:"#0f766e",
};
const TYPE_ICON   = {Academic:"🎓",Holiday:"🏖️",Exam:"📝",Event:"🎉"};
const MEALS       = ["breakfast","lunch","eveningTea","dinner"];
const MEAL_LABELS = {breakfast:"Breakfast",lunch:"Lunch",eveningTea:"Evening Tea / Snacks",dinner:"Dinner"};

function useWidth() {
  const [w,setW] = useState(()=>window.innerWidth);
  useEffect(()=>{const fn=()=>setW(window.innerWidth);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);},[]);
  return w;
}
function useDarkMode() {
  const [dark,setDark] = useState(()=>{
    const s=localStorage.getItem("nitc_dark");
    if(s!==null)return s==="true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const toggle = ()=>setDark(d=>{const n=!d;localStorage.setItem("nitc_dark",String(n));return n;});
  return [dark,toggle];
}
function useOnlineStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on  = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online",  on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}

function useMessPref() {
  const getDefault = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("nitc_mess_pref")||"null");
      // Only use if saved this month
      if (saved) {
        const now = new Date();
        const key = `${now.getFullYear()}-${now.getMonth()}`;
        if (saved.monthKey === key) return { group: saved.group, mess: saved.mess };
      }
    } catch {}
    return null;
  };

  const [pref, setPref] = useState(getDefault);

  const save = (group, mess) => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
    const val = { group, mess, monthKey };
    localStorage.setItem("nitc_mess_pref", JSON.stringify(val));
    setPref({ group, mess });
  };

  const clear = () => {
    localStorage.removeItem("nitc_mess_pref");
    setPref(null);
  };

  return [pref, save, clear];
}
function useSwipe(onSwipeLeft, onSwipeRight) {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    // Only trigger if horizontal swipe is dominant (not scrolling vertically)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) onSwipeLeft();   // swipe left  → next section
      else        onSwipeRight();  // swipe right → previous section
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return { onTouchStart, onTouchEnd };
}
function FeedbackButton() {
  const FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSe6pacpeXI7btFxQOGEuAVERRgLI_zHYIJex3Tbrsf3vNXVXw/viewform?usp=publish-editor"; // ← paste your link here
  return (
    <a
      href={FORM_LINK}
      target="_blank"
      rel="noopener noreferrer"
      title="Give Feedback"
      style={{
        position: "fixed",
        bottom: 24,
        right: 20,
        zIndex: 500,
        background: "#003087",
        color: "#fff",
        borderRadius: 50,
        width: 52,
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 18px rgba(0,48,135,.35)",
        fontSize: 22,
        textDecoration: "none",
        transition: "transform .2s, box-shadow .2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.12)";
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,48,135,.5)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,48,135,.35)";
      }}
    >
      💬
    </a>
  );
}
function ThavalimButton({ show }) {
  if (!show) return null;
  return (
      <a
      href="https://thavalam.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      title="Campus Map – Thavalam"
      style={{
        position:"fixed", bottom:84, right:20, zIndex:500,
        background:"#059669", color:"#fff", borderRadius:50,
        width:52, height:52, display:"flex", alignItems:"center",
        justifyContent:"center", boxShadow:"0 4px 18px rgba(5,150,105,.35)",
        fontSize:22, textDecoration:"none", transition:"transform .2s, box-shadow .2s",
      }}
      onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.12)";e.currentTarget.style.boxShadow="0 6px 24px rgba(5,150,105,.5)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 18px rgba(5,150,105,.35)";}}
    >
      🗺️
    </a>
  );
}
function InstallButton() {
  const [prompt,       setPrompt]       = useState(null);
  const [showGuide,    setShowGuide]    = useState(false);
  const [isStandalone, setIsStandalone] = useState(
    () => window.matchMedia("(display-mode: standalone)").matches
       || window.navigator.standalone === true
  );

  useEffect(() => {
    // Listen for native install prompt
    const promptHandler = e => { e.preventDefault(); setPrompt(e); };
    window.addEventListener("beforeinstallprompt", promptHandler);

    // Hide button when app is installed
    const installedHandler = () => {
      setShowGuide(false);
      setIsStandalone(true);
    };
    window.addEventListener("appinstalled", installedHandler);

    // Listen for standalone mode change in real time
    const mq = window.matchMedia("(display-mode: standalone)");
    const mqHandler = e => setIsStandalone(e.matches);
    mq.addEventListener("change", mqHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", promptHandler);
      window.removeEventListener("appinstalled", installedHandler);
      mq.removeEventListener("change", mqHandler);
    };
  }, []);

  // Already installed — hide button
  if (isStandalone) return null;

  const ua        = navigator.userAgent.toLowerCase();
  const isIOS     = /iphone|ipad|ipod/.test(ua);
  const isSamsung = /samsungbrowser/.test(ua);
  const isFirefox = /firefox/.test(ua);

  const getGuide = () => {
    if (isIOS) return [
      <><strong>Tap the Share button ⎋</strong> at the bottom of Safari</>,
      <>Tap <strong>"Add to Home Screen"</strong></>,
      <>Tap <strong>"Add"</strong> to confirm</>,
    ];
    if (isSamsung) return [
      <>Tap the <strong>menu ⋮</strong> at the bottom</>,
      <>Tap <strong>"Add page to"</strong> → <strong>"Home screen"</strong></>,
      <>Tap <strong>"Add"</strong></>,
    ];
    if (isFirefox) return [
      <>Tap the <strong>menu ⋮</strong> at the top right</>,
      <>Tap <strong>"Install"</strong> or <strong>"Add to Home Screen"</strong></>,
      <>Tap <strong>"Add"</strong></>,
    ];
    return [
      <>Tap the <strong>menu ⋮</strong> at the top right</>,
      <>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></>,
      <>Tap <strong>"Add"</strong> or <strong>"Install"</strong></>,
    ];
  };

  const handleClick = () => {
    if (prompt) {
      prompt.prompt();
      prompt.userChoice.then(() => setPrompt(null));
    } else {
      setShowGuide(true);
    }
  };

  const btnStyle = {
    background: "linear-gradient(90deg,#60a5fa,#a5f3fc)",
    color: "#003087", border: "none", borderRadius: 20,
    padding: "6px 14px", fontSize: 12, fontWeight: 800,
    cursor: "pointer", display: "flex", alignItems: "center",
    gap: 6, touchAction: "manipulation", flexShrink: 0,
    boxShadow: "0 2px 8px rgba(96,165,250,.4)",
  };

  return (
    <>
      <button onClick={handleClick} style={btnStyle}>
        ⬇ Install App
      </button>

      {showGuide && (
        <div onClick={() => setShowGuide(false)} style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,20,.6)", zIndex: 9999,
          backdropFilter: "blur(5px)", overflowY: "auto",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 18, padding: 24,
            width: "calc(100% - 32px)", maxWidth: 340,
            margin: "80px auto 40px auto",
            boxShadow: "0 24px 64px rgba(0,0,0,.35)",
          }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📲</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#003087" }}>
                Install InfoNITC
              </div>
              <div style={{ fontSize: 12, color: "#7a8aaa", marginTop: 4 }}>
                Add to your Home Screen
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {getGuide().map((step, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  background: "#f4f7ff", borderRadius: 10, padding: "10px 14px",
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0, fontWeight: 800, color: "#003087" }}>
                    {i + 1}.
                  </span>
                  <div style={{ fontSize: 14, color: "#1a1a2e", lineHeight: 1.6 }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowGuide(false)} style={{
              width: "100%", background: "#003087", color: "#fff",
              border: "none", borderRadius: 9, padding: 12, fontSize: 14,
              fontWeight: 700, cursor: "pointer", marginTop: 20,
            }}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({size=40}){
  return(
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a5cbf"/><stop offset="100%" stopColor="#003087"/>
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a5f3fc"/>
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#lg1)"/>
      <circle cx="14" cy="13" r="3.5" fill="url(#lg2)"/>
      <rect x="11.5" y="19" width="5" height="17" rx="2.5" fill="url(#lg2)"/>
      <path d="M22 36V19h4.5l7 11.5V19H38v17h-4.5L26.5 24.5V36H22z" fill="white"/>
    </svg>
  );
}

function DarkToggle({dark,toggle}){
  return(
    <button onClick={toggle} title={dark?"Light mode":"Dark mode"}
      style={{background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.22)",
        borderRadius:9,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",
        cursor:"pointer",fontSize:18,flexShrink:0,touchAction:"manipulation"}}>
      {dark?"☀️":"🌙"}
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const mk=(d,w=16)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:w,height:w,flexShrink:0}}><path d={d}/></svg>;
const IC={
  mess:    mk("M3 11l19-9-9 19-2-8-8-2z"),
  bus:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16,flexShrink:0}}><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M6 20v-2M18 20v-2M2 10h20"/><circle cx="7" cy="16" r="1" fill="currentColor"/><circle cx="17" cy="16" r="1" fill="currentColor"/></svg>,
  notice:  mk("M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"),
  contact: mk("M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 9.13 19.79 19.79 0 0 1 1.61.5 2 2 0 0 1 3.6 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"),
  club:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16,flexShrink:0}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  calendar:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16,flexShrink:0}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  food:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16,flexShrink:0}}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  exam: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16,flexShrink:0}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  shield:  mk("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",15),
  edit:    mk("M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",14),
  del:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  plus:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14,flexShrink:0}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  logout:  mk("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",15),
  check:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{width:14,height:14,flexShrink:0}}><polyline points="20 6 9 17 4 12"/></svg>,
  close:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:13,height:13,flexShrink:0}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  key:     mk("M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",14),
  eye:     mk("M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 0 1 0 6 3 3 0 0 1 0-6z",16),
  eyeOff:  mk("M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22",16),
  save:    mk("M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",14),
  spin:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:15,height:15,animation:"spin .7s linear infinite",flexShrink:0}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  hmenu:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:20,height:20,flexShrink:0}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  lostfound: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16,flexShrink:0}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  chevDown: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14,flexShrink:0}}><polyline points="6 9 12 15 18 9"/></svg>,
};

// ─── Shared primitives ────────────────────────────────────────────────────────
const Tag=({label})=>(
  <span style={{display:"inline-block",background:TAG_COLORS[label]||"#555",color:"#fff",
    fontSize:10,fontWeight:700,letterSpacing:.7,padding:"3px 8px",borderRadius:4,textTransform:"uppercase",whiteSpace:"nowrap"}}>
    {label}
  </span>
);
function Btn({onClick,variant="primary",style={},disabled=false,children,T}){
  const base={border:"none",borderRadius:9,padding:"9px 15px",fontSize:13,fontWeight:600,
    display:"inline-flex",alignItems:"center",gap:5,transition:"all .15s",
    opacity:disabled?.5:1,cursor:disabled?"default":"pointer",touchAction:"manipulation",minHeight:38,flexShrink:0};
  const v={
    primary:{background:T.navy,color:"#fff"},
    secondary:{background:T.light,color:T.text},
    danger:{background:"none",color:"#dc2626",padding:"5px 7px",minHeight:"auto"},
    ghost:{background:"none",color:T.navy,padding:"5px 7px",minHeight:"auto"},
  };
  return <button onClick={onClick} disabled={disabled} style={{...base,...v[variant],...style}}>{children}</button>;
}
const Inp=({style={},T,...p})=>(
  <input style={{width:"100%",border:`1.5px solid ${T.border}`,borderRadius:9,padding:"10px 12px",
    fontSize:15,boxSizing:"border-box",background:T.inputBg,color:T.text,fontFamily:"inherit",
    WebkitAppearance:"none",...style}} {...p}/>
);
const Txa=({style={},T,...p})=>(
  <textarea style={{width:"100%",border:`1.5px solid ${T.border}`,borderRadius:9,padding:"10px 12px",
    fontSize:15,boxSizing:"border-box",background:T.inputBg,color:T.text,
    resize:"vertical",fontFamily:"inherit",...style}} {...p}/>
);
const Sel=({children,style={},T,...p})=>(
  <select style={{width:"100%",border:`1.5px solid ${T.border}`,borderRadius:9,padding:"10px 12px",
    fontSize:15,boxSizing:"border-box",background:T.inputBg,color:T.text,
    fontFamily:"inherit",WebkitAppearance:"none",appearance:"none",...style}} {...p}>{children}</select>
);
function PwInp({value,onChange,placeholder,T}){
  const [show,setShow]=useState(false);
  return(
    <div style={{position:"relative"}}>
      <Inp T={T} type={show?"text":"password"} value={value} onChange={onChange} placeholder={placeholder} style={{paddingRight:42}}/>
      <button type="button" onClick={()=>setShow(s=>!s)}
        style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
          background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",padding:4,touchAction:"manipulation"}}>
        {show?IC.eyeOff:IC.eye}
      </button>
    </div>
  );
}
const Fld=({label,children,T})=>(
  <div style={{marginBottom:10}}>
    {label&&<div style={{fontSize:11,fontWeight:600,color:T.muted,marginBottom:4,letterSpacing:.5,textTransform:"uppercase"}}>{label}</div>}
    {children}
  </div>
);
const FC=({title,onCancel,onSave,children,T})=>(
  <div style={{background:T.surface2,border:`1.5px solid ${T.border}`,borderRadius:12,padding:16,marginBottom:16}}>
    {title&&<div style={{fontWeight:700,color:T.navy,marginBottom:12,fontSize:14}}>{title}</div>}
    {children}
    <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
      <Btn onClick={onSave} T={T}>{IC.save} Save</Btn>
      <Btn onClick={onCancel} variant="secondary" T={T}>{IC.close} Cancel</Btn>
    </div>
  </div>
);
const SH=({title,subtitle,T})=>(
  <div style={{marginBottom:20}}>
    <h2 style={{fontSize:20,fontWeight:800,color:T.navy,margin:0,marginBottom:3,letterSpacing:-.3}}>{title}</h2>
    <p style={{fontSize:13,color:T.muted,margin:0}}>{subtitle}</p>
  </div>
);
const Ov=({onClose,children,T})=>(
  <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,20,.6)",
    display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,
    padding:16,backdropFilter:"blur(5px)",overflowY:"auto"}}>
    <div onClick={e=>e.stopPropagation()} style={{background:T.surface,borderRadius:18,
      padding:24,width:"100%",maxWidth:360,boxShadow:"0 24px 64px rgba(0,0,0,.35)",
      animation:"fadeIn .2s ease",margin:"auto",border:`1px solid ${T.border}`}}>
      {children}
    </div>
  </div>
);

// ─── Bus time helpers ─────────────────────────────────────────────────────────
function parseTime(str){
  const clean=str.replace(/\(S\)/g,"").trim();
  const [time,mer]=clean.split(" ");
  let [h,m]=time.split(":").map(Number);
  if(mer==="PM"&&h!==12)h+=12;
  if(mer==="AM"&&h===12)h=0;
  return h*60+m;
}
function getBusStatus(timings){
  const now=new Date();
  const nowMins=now.getHours()*60+now.getMinutes();
  const parsed=timings.map(t=>parseTime(t));
  let nextIdx=-1;
  for(let i=0;i<parsed.length;i++){if(parsed[i]>=nowMins){nextIdx=i;break;}}
  return{parsed,nowMins,nextIdx};
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [section,      setSection]     = useState("mess");
  const [data,         setDataState]   = useState(null);
  const [saving,       setSaving]      = useState(false);
  const [saveMsg,      setSaveMsg]     = useState("");
  const [isAdmin,      setIsAdmin]     = useState(false);
  const [showLogin,    setShowLogin]   = useState(false);
  const [showPwChange, setShowPwCh]    = useState(false);
  const [appLoading,   setAppLoading]  = useState(true);
  const [mobileMenu,   setMobileMenu]  = useState(false);
  const [showNavDropdown, setShowNavDropdown] = useState(false);
  const [dark,         toggleDark]     = useDarkMode();
  const T   = useMemo(()=>makeTheme(dark),[dark]);
  const w   = useWidth();
  const mob = w<640;
  const xs  = w<420;
  const isOnline = useOnlineStatus();

  useEffect(()=>{const u=onAuthChanged(user=>setIsAdmin(!!user));return u;},[]);
  useEffect(()=>{
    loadData({...DEFAULT_DATA, contacts_v2:DEFAULT_CONTACTS, dining:DEFAULT_DINING, showThavalam:false})
      .then(d=>{setDataState(d);setAppLoading(false);});
  },[]);
  useEffect(()=>{document.body.style.background=T.bg;document.body.style.color=T.text;},[T]);

  const setData=useCallback(async(nd)=>{
    setDataState(nd);setSaving(true);
    const ok=await saveData(nd);
    setSaving(false);setSaveMsg(ok?"✓ Saved":"⚠ Failed");
    setTimeout(()=>setSaveMsg(""),2500);
  },[]);

  const handleLogout=async()=>{await logoutAdmin();setIsAdmin(false);};

  const DEFAULT_NAV = [
    {id:"mess",     label:"Mess Menu",    icon:IC.mess},
    {id:"buses",    label:"Bus Schedule", icon:IC.bus},
    {id:"food",     label:"Food & Dining",icon:IC.food},
    {id:"lostfound",label:"Lost & Found", icon:IC.lostfound},
    {id:"notices",  label:"Notices",      icon:IC.notice},
    {id:"contacts", label:"Contacts",     icon:IC.contact},
    {id:"clubs",    label:"Clubs",        icon:IC.club},
    {id:"calendar", label:"Calendar",     icon:IC.calendar},
    {id:"exams",    label:"Exam Schedule",icon:IC.exam},
  ];

  // Nav order from Firebase — fallback to default if not set
const savedOrder = data?.navOrder;
const nav = savedOrder
  ? savedOrder.map(id => DEFAULT_NAV.find(n => n.id===id)).filter(Boolean)
      .concat(DEFAULT_NAV.filter(n => !savedOrder.includes(n.id)))
  : DEFAULT_NAV;

const setNav = (newNav) => {
  setData({ ...data, navOrder: newNav.map(n => n.id) });
};

const resetNav = () => {
  setData({ ...data, navOrder: DEFAULT_NAV.map(n => n.id) });
};
  const [messPref, saveMessPref, clearMessPref] = useMessPref();
  const [reorderMode, setReorderMode] = useState(false);
const dragNavIdx = useRef(null);
const dragNavOver = useRef(null);

const handleNavDragStart = (i) => { dragNavIdx.current = i; };
const handleNavDragEnter = (i) => { dragNavOver.current = i; };
const handleNavDragEnd   = () => {
  if (dragNavIdx.current===null || dragNavOver.current===null) return;
  if (dragNavIdx.current===dragNavOver.current) return;
  const copy = [...nav];
  const [moved] = copy.splice(dragNavIdx.current, 1);
  copy.splice(dragNavOver.current, 0, moved);
  setNav(copy);
  dragNavIdx.current = null;
  dragNavOver.current = null;
};
  const navIds = nav.map(n => n.id);

const goNext = () => {
  const idx = navIds.indexOf(section);
  if (idx < navIds.length - 1) setSection(navIds[idx + 1]);
};
const goPrev = () => {
  const idx = navIds.indexOf(section);
  if (idx > 0) setSection(navIds[idx - 1]);
};

const swipeHandlers = useSwipe(goNext, goPrev);

  if(appLoading) return(
    <div style={{minHeight:"100dvh",display:"flex",alignItems:"center",justifyContent:"center",
      flexDirection:"column",gap:16,background:T.bg}}>
      <Logo size={52}/>
      <div style={{color:T.navy,fontWeight:700,fontSize:17}}>InfoNITC</div>
      <div style={{color:T.muted,fontSize:13}}>Loading campus data…</div>
    </div>
  );

  const props={data,setData,isAdmin,T,isMobile:mob,isSmall:xs};

  return(
    <div style={{minHeight:"100dvh",background:T.bg,overflowX:"hidden",transition:"background .25s,color .25s"}}>

      {/* HEADER */}
      <header style={{background:T.headerGrad,position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 24px rgba(0,0,0,.35)"}}>
        {!isOnline && (
  <div style={{
    background:"#fef3c7", borderBottom:"1px solid #f59e0b",
    padding:"8px 16px", textAlign:"center",
    fontSize:12, fontWeight:600, color:"#92400e",
    display:"flex", alignItems:"center", justifyContent:"center", gap:6,
  }}>
    📴 You are offline — showing last saved data. Some features may be unavailable.
  </div>
)}
        <div style={{maxWidth:960,margin:"0 auto",padding:`0 ${mob?"12px":"20px"}`,
          display:"flex",justifyContent:"space-between",alignItems:"center",height:mob?54:64}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Logo size={mob?34:40}/>
            <div>
              <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                <span style={{fontSize:mob?17:21,fontWeight:900,color:"#fff",letterSpacing:-.5,fontFamily:"'Lora',serif"}}>Info</span>
                <span style={{fontSize:mob?17:21,fontWeight:900,
                  background:"linear-gradient(90deg,#60a5fa,#a5f3fc)",
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                  letterSpacing:-.5,fontFamily:"'Lora',serif"}}>NITC</span>
              </div>
              {!xs&&<div style={{fontSize:9.5,color:"rgba(255,255,255,.5)",letterSpacing:1.4,textTransform:"uppercase",marginTop:-1}}>NIT Calicut · Campus Portal</div>}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            {saving&&<div style={{display:"flex",alignItems:"center",fontSize:12,color:"rgba(255,255,255,.65)"}}>{IC.spin}</div>}
            {saveMsg&&<span style={{fontSize:11,color:"#86efac",fontWeight:700}}>{saveMsg}</span>}
            <InstallButton />
            <DarkToggle dark={dark} toggle={toggleDark}/>
            {isAdmin?(<>
              {!mob&&<button onClick={()=>setShowPwCh(true)}
                style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",
                  color:"#fde68a",borderRadius:9,padding:"6px 11px",fontSize:12,fontWeight:600,
                  display:"flex",alignItems:"center",gap:5,cursor:"pointer",touchAction:"manipulation"}}>
                {IC.key} Password
              </button>}
              <button onClick={handleLogout}
                style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.22)",
                  color:"#fff",padding:"7px 12px",borderRadius:9,fontSize:12,fontWeight:600,
                  display:"flex",alignItems:"center",gap:5,cursor:"pointer",touchAction:"manipulation"}}>
                {IC.logout}{!xs&&<span> Logout</span>}
              </button>
              {mob&&<button onClick={()=>setMobileMenu(o=>!o)}
                style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",
                  color:"#fff",borderRadius:9,padding:"7px 10px",display:"flex",alignItems:"center",
                  cursor:"pointer",touchAction:"manipulation"}}>
                {IC.hmenu}
              </button>}
            </>):(
              <button onClick={()=>setShowLogin(true)}
                style={{background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.25)",
                  color:"#fff",padding:"7px 12px",borderRadius:9,display:"flex",alignItems:"center",
                  gap:6,fontSize:13,fontWeight:600,cursor:"pointer",touchAction:"manipulation"}}>
                {IC.shield}{!xs&&<span> Admin</span>}
              </button>
            )}
          </div>
        </div>

        {mobileMenu&&isAdmin&&(
          <div style={{background:"rgba(0,10,40,.95)",borderTop:"1px solid rgba(255,255,255,.08)",padding:"10px 14px"}}>
            <button onClick={()=>{setShowPwCh(true);setMobileMenu(false);}}
              style={{background:"rgba(255,255,255,.08)",border:"none",color:"#fde68a",
                borderRadius:8,padding:"10px 14px",fontSize:14,fontWeight:600,width:"100%",
                display:"flex",alignItems:"center",gap:8,cursor:"pointer",touchAction:"manipulation"}}>
              {IC.key} Change Password
            </button>
          </div>
        )}

        {isAdmin&&(
          <div style={{background:"linear-gradient(90deg,#f59e0b,#fbbf24)",padding:"5px 14px",
            fontSize:11,fontWeight:700,color:"#78350f",
            display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6,
            paddingLeft:16,paddingRight:16}}>
          <span style={{display:"flex",alignItems:"center",gap:5}}>{IC.shield} Admin Mode — edits save to Firebase instantly</span>
          <div style={{display:"flex",gap:6}}>
            <button
              onClick={()=>setReorderMode(r=>!r)}
              style={{background:"rgba(120,53,15,.15)",border:"1px solid rgba(120,53,15,.3)",
                color:"#78350f",borderRadius:7,padding:"3px 10px",fontSize:11,fontWeight:700,
                cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
              {reorderMode ? "✓ Done Reordering" : "⇄ Reorder Tabs"}
            </button>
            {reorderMode && (
              <button onClick={resetNav}
                style={{background:"rgba(120,53,15,.15)",border:"1px solid rgba(120,53,15,.3)",
                  color:"#78350f",borderRadius:7,padding:"3px 10px",fontSize:11,fontWeight:700,
                  cursor:"pointer"}}>
                Reset
              </button>
            )}
            <button
              onClick={()=>setData({...data, showThavalam:!data.showThavalam})}
              style={{background:"rgba(120,53,15,.15)",border:"1px solid rgba(120,53,15,.3)",
                color:"#78350f",borderRadius:7,padding:"3px 10px",fontSize:11,fontWeight:700,
                cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
              🗺️ Thavalam: {data.showThavalam ? "ON ✓" : "OFF"}
            </button>
          </div>
        </div>
        )}

        {/* Nav */}
        <div style={{borderTop:"1px solid rgba(255,255,255,.09)",background:T.navBg,position:"relative"}}>
          <div style={{maxWidth:960,margin:"0 auto",display:"flex",alignItems:"center",
            padding:`0 ${mob?"2px":"6px"}`}}>
            <div className="nav-scroll" style={{display:"flex",overflowX:"auto",flex:1,minWidth:0}}>
              {nav.map((n,navI) => (
                <button
                  key={n.id}
                  onClick={() => { if(!reorderMode){ setSection(n.id); setMobileMenu(false); } }}
                  draggable={reorderMode}
                  onDragStart={() => handleNavDragStart(navI)}
                  onDragEnter={() => handleNavDragEnter(navI)}
                  onDragEnd={handleNavDragEnd}
                  onDragOver={e => e.preventDefault()}
                  style={{
                    padding:mob?"10px 10px":"12px 14px",
                    color:section===n.id?"#fff":"rgba(255,255,255,.58)",
                    fontSize:mob?11:12,display:"flex",alignItems:"center",gap:4,
                    fontWeight:section===n.id?700:500,whiteSpace:"nowrap",
                    border:"none",
                    transition:"all .15s",touchAction:"manipulation",flexShrink:0,
                    cursor: reorderMode ? "grab" : "pointer",
                    opacity: reorderMode ? .85 : 1,
                    background: reorderMode
                      ? "rgba(255,255,255,.08)"
                      : section===n.id ? "rgba(255,255,255,.14)" : "none",
                    borderBottom: reorderMode
                      ? "2px dashed rgba(255,255,255,.4)"
                      : section===n.id ? "2px solid #60a5fa" : "2px solid transparent",
                  }}>
                  {n.icon}<span>{n.label}</span>
                </button>
              ))}
            </div>

            {/* Dropdown toggle — always visible, lists all sections */}
            <button
              onClick={() => setShowNavDropdown(s => !s)}
              style={{
                background: showNavDropdown
                  ? "rgba(255,255,255,.18)"
                  : "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.1) 40%, rgba(255,255,255,.16) 100%)",
                border:"none",
                color:"rgba(255,255,255,.85)", padding: mob?"10px 14px":"12px 16px",
                display:"flex", alignItems:"center", cursor:"pointer",
                flexShrink:0, touchAction:"manipulation",
                boxShadow: showNavDropdown ? "none" : "inset 1px 0 0 rgba(255,255,255,.08)",
                backdropFilter:"blur(2px)",
                transition:"background .2s",
              }}>
              <span style={{ transform: showNavDropdown ? "rotate(180deg)" : "none", transition:"transform .2s" }}>
                {IC.chevDown}
              </span>
            </button>
          </div>

          {/* Dropdown panel */}
          {showNavDropdown && (
            <>
              <div onClick={() => setShowNavDropdown(false)}
                style={{ position:"fixed", inset:0, zIndex:299 }}/>
              <div style={{
                position:"absolute", top:"100%", right:0, zIndex:300,
                background: dark ? "#1a1d27" : "#fff",
                border:`1px solid ${T.border}`, borderRadius:"0 0 0 12px",
                boxShadow:"0 12px 32px rgba(0,0,0,.25)",
                minWidth:220, maxWidth:280, overflow:"hidden",
                animation:"fadeIn .15s ease",
              }}>
                {nav.map(n => (
                  <button key={n.id}
                    onClick={() => { setSection(n.id); setShowNavDropdown(false); setMobileMenu(false); }}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:10,
                      padding:"12px 16px", border:"none",
                      background: section===n.id ? T.light : "none",
                      color: section===n.id ? T.navy : T.text,
                      fontSize:14, fontWeight: section===n.id ? 700 : 500,
                      cursor:"pointer", textAlign:"left",
                      borderBottom:`1px solid ${T.border}` }}>
                    <span style={{ color: section===n.id ? T.navy : T.muted, display:"flex" }}>{n.icon}</span>
                    {n.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      <AnnouncementBanner data={data} section={section} T={T} isMobile={mob}/>  

      {/* MAIN */}
      <main
  style={{maxWidth:960,margin:"0 auto",padding:mob?"14px 12px 80px":"24px 20px 80px"}}
  className="fade-in"
  {...(mob ? swipeHandlers : {})}
>
        {section==="mess" && <MessSection {...props} messPref={messPref} saveMessPref={saveMessPref} clearMessPref={clearMessPref}/>}
        {section==="buses"    && <BusSection      {...props}/>}
        {section==="food"     && <FoodDiningSection {...props}/>}
        {section==="lostfound" && <LostFound {...props}/>}
        {section==="notices"  && <NoticesSection  {...props}/>}
        {section==="contacts" && <ContactsSection {...props}/>}
        {section==="clubs"    && <ClubsSection    {...props}/>}
        {section==="calendar" && <AcademicCalendar {...props}/>}
        {section==="exams"    && <ExamSchedule     {...props}/>}
      </main>

      {showLogin    && <LoginModal    T={T} onClose={()=>setShowLogin(false)} onLogin={(secrets)=>{
  setIsAdmin(true);
  setShowLogin(false);
  if (secrets?.clubPins) {
    setData({...data, clubPins: secrets.clubPins});
  }
}}/>}
      {showPwChange && <PwChangeModal T={T} onClose={()=>setShowPwCh(false)}/>}
      {section === "food" && (
        <SpinWheel places={data?.dining || []} T={T} showThavalam={data?.showThavalam} />
      )}
      <ThavalimButton show={data?.showThavalam} />
      <FeedbackButton />
    </div>
  );
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function LoginModal({onClose,onLogin,T}){
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");const [err,setErr]=useState("");const [loading,setLoading]=useState(false);
  const attempt=async()=>{
    if(!pw)return;setLoading(true);setErr("");
    try{
      await loginAdmin(email,pw);
      onLogin();
    }
    catch(e){setErr(e.code==="auth/invalid-credential"?"Incorrect email or password.":"Login failed.");}
    finally{setLoading(false);}
  };
  return(
    <Ov onClose={onClose} T={T}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <Logo size={46}/>
        <div style={{marginTop:10,fontSize:19,fontWeight:800,color:T.navy}}>Admin Login</div>
        <div style={{fontSize:13,color:T.muted,marginTop:3}}>Sign in with your admin account</div>
      </div>
      <Fld label="Email" T={T}><Inp T={T} value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Enter admin email"/></Fld>
      <Fld label="Password" T={T}><PwInp T={T} value={pw} onChange={e=>setPw(e.target.value)} placeholder="Your password"/></Fld>
      {err&&<div style={{color:"#ef4444",fontSize:13,marginBottom:8,textAlign:"center"}}>{err}</div>}
      <Btn onClick={attempt} disabled={loading} T={T} style={{width:"100%",justifyContent:"center",padding:12,marginBottom:8,marginTop:4}}>
        {loading?IC.spin:IC.shield} {loading?"Signing in…":"Sign In"}
      </Btn>
      <Btn onClick={onClose} variant="secondary" T={T} style={{width:"100%",justifyContent:"center"}}>Cancel</Btn>
    </Ov>
  );
}
function PwChangeModal({onClose,T}){
  const [c,setC]=useState("");const [n,setN]=useState("");const [cf,setCf]=useState("");
  const [err,setErr]=useState("");const [ok,setOk]=useState(false);const [loading,setLoading]=useState(false);
  const handle=async()=>{
    setErr("");
    if(!c||!n||!cf)return setErr("Fill in all fields.");
    if(n.length<8)return setErr("New password must be ≥ 8 characters.");
    if(n!==cf)return setErr("Passwords don't match.");
    setLoading(true);
    try{await changeAdminPassword(c,n);setOk(true);setTimeout(onClose,2000);}
    catch(e){setErr(e.code?.includes("credential")?"Current password incorrect.":"Failed. Try again.");}
    finally{setLoading(false);}
  };
  return(
    <Ov onClose={onClose} T={T}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:34,marginBottom:8}}>🔑</div>
        <div style={{fontSize:19,fontWeight:800,color:T.navy}}>Change Password</div>
        <div style={{fontSize:13,color:T.muted,marginTop:3}}>Updates your Firebase admin password</div>
      </div>
      {ok?(
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{fontSize:38,marginBottom:8}}>✅</div>
          <div style={{color:"#059669",fontWeight:700,fontSize:15}}>Password changed!</div>
        </div>
      ):(<>
        <Fld label="Current Password" T={T}><PwInp T={T} value={c} onChange={e=>setC(e.target.value)} placeholder="Current password"/></Fld>
        <Fld label="New Password" T={T}><PwInp T={T} value={n} onChange={e=>setN(e.target.value)} placeholder="Min 8 characters"/></Fld>
        <Fld label="Confirm New Password" T={T}><PwInp T={T} value={cf} onChange={e=>setCf(e.target.value)} placeholder="Repeat new password"/></Fld>
        {err&&<div style={{color:"#ef4444",fontSize:13,marginBottom:8}}>{err}</div>}
        <Btn onClick={handle} disabled={loading} T={T} style={{width:"100%",justifyContent:"center",padding:12,marginBottom:8,marginTop:4}}>
          {loading?IC.spin:IC.key} {loading?"Changing…":"Change Password"}
        </Btn>
        <Btn onClick={onClose} variant="secondary" T={T} style={{width:"100%",justifyContent:"center"}}>Cancel</Btn>
      </>)}
    </Ov>
  );
}

// ─── Mess Section ─────────────────────────────────────────────────────────────
function MessSection({data,setData,isAdmin,T,isMobile,messPref,saveMessPref,clearMessPref}){
  const todayIdx=new Date().getDay()===0?6:new Date().getDay()-1;
  const [aDay,setADay]=useState(DAYS[todayIdx]);
  const [aGrp,setAGrp]=useState(messPref?.group||"Boys (A–G, PG2)");
  const [aMess,setAMess]=useState(messPref?.mess||"Mess A");
  const [ed,setEd]=useState(null);const [ev,setEv]=useState("");
  const [nutrition,     setNutrition]     = useState(null);
  const [nutritionMeal, setNutritionMeal] = useState(null);
  const save=()=>{
    const nd={...data,messMenu:{...data.messMenu,[ed.mess]:{...data.messMenu[ed.mess],
      [ed.day]:{...data.messMenu[ed.mess][ed.day],[ed.meal]:ev}}}};
    setData(nd);setEd(null);
  };
  const dm=data.messMenu[aMess]?.[aDay];
  const dl=dm?._dayKey||"";
  const chip=(a,sm)=>({border:"none",borderRadius:sm?8:20,padding:sm?"5px 11px":"7px 14px",
    fontSize:sm?11:12,fontWeight:700,cursor:"pointer",touchAction:"manipulation",whiteSpace:"nowrap",
    background:a?T.navy:T.light,color:a?"#fff":T.text});

  const getNutrition = (meal) => {
    const isEMess = aMess === "Mess E (Pure Veg)";
    if (isEMess) {
      return getEMessNutrition(aDay, meal);
    } else {
      return getRotationalNutrition(dl, meal);
    }
  };
  return(
    <div>
      <SH title="Mess Menu" subtitle="Official NITC 2025–26 · 7-day rotational cycle" T={T}/>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:10}}>
        {Object.keys(MESS_GROUPS).map(g=>(
          <button key={g} onClick={()=>{setAGrp(g);setAMess(MESS_GROUPS[g][0]);}} style={chip(aGrp===g)}>{g}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {MESS_GROUPS[aGrp].filter(m=>data.messMenu[m]).map(m=>(
          <button key={m} onClick={()=>setAMess(m)} style={{...chip(aMess===m,true),
            background:aMess===m?"#1a5cbf":T.light,color:aMess===m?"#fff":T.text}}>
            {m.replace("Mess ","")}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:4,marginBottom:14,width:"100%"}}>
        {DAYS.map(d=>(
          <button key={d} onClick={()=>setADay(d)} style={{border:"none",borderRadius:8,padding:"8px 0",
            fontSize:11,fontWeight:700,cursor:"pointer",touchAction:"manipulation",
            textTransform:"uppercase",letterSpacing:.7,flex:1,minWidth:0,
            background:aDay===d?T.navy:T.light,color:aDay===d?"#fff":T.text}}>
            {d.slice(0,3)}
          </button>
        ))}
      </div>
      {dl&&<div style={{fontSize:12,color:T.muted,marginBottom:10}}>📋 <strong style={{color:T.navy}}>{dl}</strong> · {aMess} · {aDay}</div>}
      {/* My Mess preference */}
<div style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10,
  padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",
  justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
  <div>
    <div style={{fontSize:12,fontWeight:700,color:T.navy,marginBottom:1}}>
      📌 My Mess This Month
    </div>
    <div style={{fontSize:12,color:T.muted}}>
      {messPref
        ? <span>Set to <strong style={{color:T.navy}}>{messPref.mess}</strong> — auto-selected on every visit this month</span>
        : "Set your mess to auto-select it every time you visit"}
    </div>
  </div>
  <div style={{display:"flex",gap:6}}>
    <button
      onClick={()=>{ saveMessPref(aGrp,aMess); }}
      style={{background:T.navy,color:"#fff",border:"none",borderRadius:8,
        padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer",
        whiteSpace:"nowrap"}}>
      {messPref?.mess===aMess ? "✓ Saved" : "Set as My Mess"}
    </button>
    {messPref && (
      <button onClick={clearMessPref}
        style={{background:"none",border:`1px solid ${T.border}`,color:T.muted,
          borderRadius:8,padding:"6px 10px",fontSize:12,fontWeight:600,
          cursor:"pointer"}}>
        Clear
      </button>
    )}
  </div>
</div>
      <div style={{background:T.light,border:`1px solid ${T.border}`,borderRadius:10,
        padding:"9px 14px",fontSize:12,color:T.text,marginBottom:14,lineHeight:1.6,opacity:.85}}>
        <strong style={{color:T.navy}}>Every day: </strong>Tea, Coffee, Milk, Cornflakes, Fruit, Boiled Egg, Bread, Jams, Butter, Green Gram/Peanuts
      </div>
      {dm&&MEALS.map(meal=>(
        <div key={meal} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:"13px 15px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontWeight:700,fontSize:11,color:T.navy,textTransform:"uppercase",letterSpacing:.8}}>{MEAL_LABELS[meal]}</span>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <button
                onClick={()=>{
                  const n = getNutrition(meal);
                  setNutrition(n);
                  setNutritionMeal(meal);
                }}
                style={{background:"none",border:`1px solid ${T.border}`,borderRadius:7,
                  padding:"3px 9px",fontSize:11,fontWeight:600,color:T.navy,
                  cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}>
                🥗 Nutrition
              </button>
              {isAdmin&&ed?.mess!==aMess&&<Btn variant="ghost" T={T} onClick={()=>{setEd({mess:aMess,day:aDay,meal});setEv(dm[meal]||"");}}>{IC.edit}</Btn>}
            </div>
          </div>
          {ed?.mess===aMess&&ed?.day===aDay&&ed?.meal===meal?(
            <div>
              <Txa T={T} value={ev} onChange={e=>setEv(e.target.value)} style={{height:70,marginBottom:8}}/>
              <div style={{display:"flex",gap:6}}>
                <Btn T={T} onClick={save}>{IC.check} Save</Btn>
                <Btn T={T} onClick={()=>setEd(null)} variant="secondary">{IC.close} Cancel</Btn>
              </div>
            </div>
          ):(
            <div style={{fontSize:14,color:T.text,lineHeight:1.75,whiteSpace:"pre-line"}}>{dm[meal]||"—"}</div>
          )}
        </div>
      ))}
      {nutrition && nutritionMeal && (
        <NutritionPopup
          nutrition={nutrition}
          mealLabel={MEAL_LABELS[nutritionMeal]}
          dayKey={dl || aDay}
          T={T}
          onClose={()=>{ setNutrition(null); setNutritionMeal(null); }}
        />
      )}
    </div>
  );
}

function BusSection({data,setData,isAdmin,T,isMobile}){
  const [showAdd,   setSA]      = useState(false);
  const [editing,   setEd]      = useState(null);
  const [form,      setForm]    = useState({route:"",stops:"",timings:""});
  const [expanded,  setExpanded]= useState(null); // route group key
  const fv=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  const parse=s=>s.split(",").map(t=>t.trim()).filter(Boolean);
  const [tick,setTick]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setTick(t=>t+1),30000);return()=>clearInterval(id);},[]);

  const del=i=>{const b=[...data.buses];b.splice(i,1);setData({...data,buses:b});};
  const add=()=>{setData({...data,buses:[...data.buses,{...form,timings:parse(form.timings)}]});setSA(false);setForm({route:"",stops:"",timings:""});};
  const saveEd=i=>{const b=[...data.buses];b[i]={...form,timings:parse(form.timings)};setData({...data,buses:b});setEd(null);};

  const dayOfWeek=new Date().getDay();
  const isWeekend=dayOfWeek===0||dayOfWeek===6;

  // Group routes by direction/path — strip bus number suffix to find duplicates
  // e.g. "MBH → East Campus (Bus 1)" and "MBH → East Campus (Bus 2)" → same group
  const grouped = {};
  data.buses.forEach((bus, i) => {
    // Strip trailing "(Bus N)" or "(Bus N)" pattern to get base route name
    const baseRoute = bus.route.replace(/\s*\(Bus\s*\d+\)\s*$/i,"").replace(/\s*\(A\/C Bus\)\s*$/i," (A/C)").trim();
    if (!grouped[baseRoute]) grouped[baseRoute] = { stops: bus.stops, buses: [] };
    grouped[baseRoute].buses.push({ ...bus, _i: i });
  });

  // Merge and sort timings for a group
  const getMergedTimings = (buses) => {
    const all = buses.flatMap(b => b.timings);
    return all.sort((a, b) => parseTime(a) - parseTime(b));
  };

  return(
    <div>
      <SH title="Bus Schedule" subtitle="Official NITC campus bus timings · (S) = via SOMS" T={T}/>

      {/* Weekend banner */}
      {isWeekend&&(
        <div style={{background:"#fef3c7",border:"1px solid #f59e0b",borderRadius:12,
          padding:"12px 16px",marginBottom:18,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>🚫</span>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:"#92400e"}}>No Bus Service Today</div>
            <div style={{fontSize:13,color:"#b45309",marginTop:2}}>Campus bus services are not available on Saturdays and Sundays.</div>
          </div>
        </div>
      )}
      {!isWeekend&&(
        <div style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10,
          padding:"8px 14px",marginBottom:16,fontSize:12,color:T.muted,
          display:"flex",alignItems:"center",gap:6}}>
          ℹ️ <span>Bus services are <strong>not available on Saturdays &amp; Sundays</strong>.</span>
        </div>
      )}

      {/* Legend + add */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:10,fontSize:11,color:T.muted,flexWrap:"wrap"}}>
          <span style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{width:10,height:10,borderRadius:3,background:"#fed7aa",border:"1px solid #fb923c",display:"inline-block"}}/>Next bus
          </span>
          <span style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{width:10,height:10,borderRadius:3,background:T.light,border:`1px solid ${T.border}`,display:"inline-block"}}/>Upcoming
          </span>
          <span style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{width:10,height:10,borderRadius:3,background:"#e5e7eb",border:"1px solid #d1d5db",opacity:.6,display:"inline-block"}}/>Passed
          </span>
        </div>
        {isAdmin&&<Btn onClick={()=>{setSA(true);setForm({route:"",stops:"",timings:""});}} T={T}>{IC.plus} Add Route</Btn>}
      </div>

      {showAdd&&(
        <FC title="New Bus Route" onCancel={()=>setSA(false)} onSave={add} T={T}>
          <Fld label="Route Name" T={T}><Inp T={T} placeholder="MBH → East Campus (Bus 1)" value={form.route} onChange={fv("route")}/></Fld>
          <Fld label="Stops" T={T}><Inp T={T} placeholder="MBH → Main Gate → East Campus" value={form.stops} onChange={fv("stops")}/></Fld>
          <Fld label="Timings (comma-separated)" T={T}><Inp T={T} placeholder="7:20 AM, 8:00 AM" value={form.timings} onChange={fv("timings")}/></Fld>
        </FC>
      )}

      {/* Route cards */}
      {Object.entries(grouped).map(([baseRoute, group]) => {
        const isOpen = expanded === baseRoute;
        const mergedTimings = getMergedTimings(group.buses);
        const {parsed, nowMins, nextIdx} = getBusStatus(mergedTimings);

        // Count upcoming buses
        const upcomingCount = mergedTimings.filter((_,j) => parsed[j] >= nowMins).length;

        return (
          <div key={baseRoute} style={{marginBottom:10}}>
            {/* Route header — always visible, clickable */}
            <div
              onClick={() => setExpanded(isOpen ? null : baseRoute)}
              style={{
                background:T.surface, border:`1px solid ${isOpen ? T.navy : T.border}`,
                borderRadius: isOpen ? "12px 12px 0 0" : 12,
                padding:"14px 16px", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"space-between",
                gap:10, transition:"all .15s",
                boxShadow: isOpen ? `0 0 0 1px ${T.navy}` : "none",
              }}>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontWeight:700, fontSize:14, color:T.navy, marginBottom:3}}>
                  {baseRoute}
                </div>
                <div style={{fontSize:12, color:T.muted, lineHeight:1.4}}>{group.stops}</div>
              </div>
              <div style={{display:"flex", alignItems:"center", gap:8, flexShrink:0}}>
                {!isWeekend && upcomingCount > 0 && !isOpen && (
                  <span style={{background:"#eff6ff", color:"#1d4ed8",
                    fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20}}>
                    {upcomingCount} upcoming
                  </span>
                )}
                {!isWeekend && upcomingCount === 0 && !isOpen && (
                  <span style={{fontSize:11, color:T.muted}}>No more today</span>
                )}
                <span style={{
                  color:T.navy, fontSize:18, fontWeight:700,
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition:"transform .2s", lineHeight:1,
                }}>⌄</span>
              </div>
            </div>

            {/* Expanded timings */}
            {isOpen && (
              <div style={{
                background:T.surface2, border:`1px solid ${T.navy}`,
                borderTop:`1px solid ${T.border}`,
                borderRadius:"0 0 12px 12px",
                padding:"14px 16px",
                boxShadow:`0 0 0 1px ${T.navy}`,
              }}>
                {/* Admin edit buttons for individual buses in this group */}
                {isAdmin && (
                  <div style={{marginBottom:12, display:"flex", flexDirection:"column", gap:6}}>
                    {group.buses.map(bus => (
                      <div key={bus._i}>
                        {editing===bus._i ? (
                          <FC title="" onCancel={()=>setEd(null)} onSave={()=>saveEd(bus._i)} T={T}>
                            <Fld label="Route" T={T}><Inp T={T} value={form.route} onChange={fv("route")}/></Fld>
                            <Fld label="Stops" T={T}><Inp T={T} value={form.stops} onChange={fv("stops")}/></Fld>
                            <Fld label="Timings" T={T}><Inp T={T} value={form.timings} onChange={fv("timings")}/></Fld>
                          </FC>
                        ) : (
                          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between",
                            background:T.surface, borderRadius:8, padding:"6px 10px",
                            border:`1px solid ${T.border}`}}>
                            <span style={{fontSize:12, color:T.muted}}>{bus.route}</span>
                            <div style={{display:"flex", gap:4}}>
                              <Btn variant="ghost" T={T} onClick={()=>{setEd(bus._i);setForm({route:bus.route,stops:bus.stops,timings:bus.timings.join(", ")});}}>{IC.edit}</Btn>
                              <Btn variant="danger" T={T} onClick={()=>del(bus._i)}>{IC.del}</Btn>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Merged timings */}
                <div style={{display:"flex", gap:5, flexWrap:"wrap"}}>
                  {mergedTimings.map((t,j)=>{
                    const isSoms=t.includes("(S)");
                    const isPast=parsed[j]<nowMins;
                    const isNext=j===nextIdx;
                    let bg,bc,col;
                    if(isPast){bg="#f1f5f9";bc="#cbd5e1";col="#94a3b8";}
                    else if(isNext){bg="#fed7aa";bc="#fb923c";col="#7c2d12";}
                    else{bg=isSoms?"#fffbeb":T.light;bc=isSoms?"#fcd34d":T.border;col=isSoms?"#92400e":T.navy;}
                    return(
                      <span key={j} style={{background:bg,border:`1px solid ${bc}`,
                        borderRadius:6,padding:"4px 10px",fontSize:12,fontWeight:700,color:col,
                        whiteSpace:"nowrap",opacity:isPast?.6:1,
                        boxShadow:isNext?"0 0 0 2px rgba(251,146,60,.3)":"none",
                        transition:"all .3s"}}>
                        {t}
                      </span>
                    );
                  })}
                </div>
                {nextIdx===-1&&!isWeekend&&(
                  <div style={{fontSize:12,color:T.muted,marginTop:10}}>
                    ⏹ No more buses today on this route.
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Notices ──────────────────────────────────────────────────────────────────
function NoticesSection({data,setData,isAdmin,T}){
  const [showAdd,setSA]=useState(false);const [editing,setEd]=useState(null);
  const [form,setForm]=useState({title:"",body:"",date:"",tag:"General"});
  const fv=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  const TAGS=["Academic","Event","Hostel","General"];
  const del=id=>setData({...data,notices:data.notices.filter(n=>n.id!==id)});
  const add=()=>{setData({...data,notices:[{id:Date.now(),...form},...data.notices]});setSA(false);setForm({title:"",body:"",date:"",tag:"General"});};
  const saveEd=()=>{setData({...data,notices:data.notices.map(n=>n.id===editing?{...n,...form}:n)});setEd(null);};
  return(
    <div>
      <SH title="Notices & Announcements" subtitle="Latest updates from NIT Calicut administration" T={T}/>
      {isAdmin && (
        <AnnouncementManager
          data={data} setData={setData} T={T} isMobile={false}
          sections={[
            {id:"mess",label:"Mess Menu"},
            {id:"buses",label:"Bus Schedule"},
            {id:"food",label:"Food & Dining"},
            {id:"lostfound",label:"Lost & Found"},
            {id:"notices",label:"Notices"},
            {id:"contacts",label:"Contacts"},
            {id:"clubs",label:"Clubs"},
            {id:"calendar",label:"Calendar"},
            {id:"exams",label:"Exam Schedule"},
          ]}
        />
      )}
      {isAdmin&&<Btn onClick={()=>{setSA(true);setForm({title:"",body:"",date:"",tag:"General"});setEd(null);}} T={T} style={{marginBottom:16}}>{IC.plus} Add Notice</Btn>}
      {(showAdd||editing!==null)&&(
        <FC title={showAdd?"New Notice":"Edit Notice"} onCancel={()=>{setSA(false);setEd(null);}} onSave={showAdd?add:saveEd} T={T}>
          <Fld label="Title" T={T}><Inp T={T} placeholder="Notice title" value={form.title} onChange={fv("title")}/></Fld>
          <Fld label="Body" T={T}><Txa T={T} placeholder="Content…" value={form.body} onChange={fv("body")} style={{height:80}}/></Fld>
          <Fld label="Date" T={T}><Inp T={T} type="date" value={form.date} onChange={fv("date")}/></Fld>
          <Fld label="Category" T={T}><Sel T={T} value={form.tag} onChange={fv("tag")}>{TAGS.map(t=><option key={t}>{t}</option>)}</Sel></Fld>
        </FC>
      )}
      {data.notices.map(n=>(
        <div key={n.id} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 15px",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8,flexWrap:"wrap"}}>
            <Tag label={n.tag}/><span style={{fontSize:12,color:T.muted}}>{n.date}</span>
            {isAdmin&&<div style={{display:"flex",gap:4,marginLeft:"auto"}}>
              <Btn variant="ghost" T={T} onClick={()=>{setEd(n.id);setForm({title:n.title,body:n.body,date:n.date,tag:n.tag});setSA(false);}}>{IC.edit}</Btn>
              <Btn variant="danger" T={T} onClick={()=>del(n.id)}>{IC.del}</Btn>
            </div>}
          </div>
          <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:5}}>{n.title}</div>
          <div style={{fontSize:13,color:T.muted,lineHeight:1.65}}>{n.body}</div>
        </div>
      ))}
    </div>
  );
}