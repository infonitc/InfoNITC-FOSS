import { useState, useEffect, useRef } from "react";

const COLORS = [
  "#FF6B6B","#FF9F43","#FECA57","#48DBFB","#FF9FF3",
  "#54A0FF","#5F27CD","#00D2D3","#FF6348","#2ED573",
  "#FFA502","#3742FA","#EE5A24","#009432","#EA2027",
  "#0652DD","#833471","#C4E538","#ED4C67","#F79F1F",
];

const ITEM_H = 64;

const IC = {
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:16,height:16}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 9.13 19.79 19.79 0 0 1 1.61.5 2 2 0 0 1 3.6 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  map:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
};

const TYPE_COLORS = {
  Restaurant:"#1a6eb5", Bakery:"#c2410c", Cafe:"#92400e",
  Canteen:"#065f46", "Fast Food":"#d97706", Other:"#6b7280",
};

export default function SpinWheel({ places, T, showThavalam }) {
  const [showWheel,  setShowWheel]  = useState(false);
  const [spinning,   setSpinning]   = useState(false);
  const [offset,     setOffset]     = useState(0);
  const [winner,     setWinner]     = useState(null);
  const [winnerPlace,setWinnerPlace]= useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const [showPlace,  setShowPlace]  = useState(false);
  const [menuImg,    setMenuImg]    = useState(null); // lightbox
  const animRef  = useRef(null);
  const offsetRef= useRef(0);

  const names  = places.map(p => p.name);
  const count  = names.length;
  const totalH = count * ITEM_H;

  useEffect(() => {
    offsetRef.current = 0;
    setOffset(0);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [count]);

  if (count === 0) return null;

  const tripled = [...names, ...names, ...names];

  const spin = () => {
    if (spinning) return;
    setWinner(null);
    setShowWinner(false);
    setShowPlace(false);
    setSpinning(true);

    const winnerIdx    = Math.floor(Math.random() * count);
    const loops        = 4 + Math.floor(Math.random() * 3);
    const targetOffset = loops * totalH + winnerIdx * ITEM_H;
    const duration     = 3500;
    const startTime    = performance.now();
    const ease         = t => 1 - Math.pow(1 - t, 3);

    offsetRef.current = 0;
    setOffset(0);

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current  = targetOffset * ease(progress);
      offsetRef.current = current;
      setOffset(current);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        offsetRef.current = winnerIdx * ITEM_H;
        setOffset(winnerIdx * ITEM_H);
        setSpinning(false);
        const wp = places[winnerIdx];
        setWinner(wp.name);
        setWinnerPlace(wp);
        setTimeout(() => setShowWinner(true), 400);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  const closeAll = () => {
    setShowWheel(false);
    setShowWinner(false);
    setShowPlace(false);
    setMenuImg(null);
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setShowWheel(true)}
        title="Spin the wheel!"
        style={{
          position:"fixed",
          bottom: showThavalam ? 144 : 84,
          right:20, zIndex:500,
          background:"linear-gradient(135deg,#FF6B6B,#FF9F43,#FECA57)",
          color:"#fff", border:"none", borderRadius:50,
          width:52, height:52,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 4px 18px rgba(255,107,107,.4)",
          fontSize:24, cursor:"pointer", touchAction:"manipulation",
          transition:"transform .2s",
          animation:"wheelPulse 2s ease-in-out infinite",
        }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
      >
        🎰
      </button>

      {/* Slot machine modal */}
      {showWheel && !showWinner && !showPlace && (
        <div style={{
          position:"fixed", top:0, left:0, right:0, bottom:0,
          background:"rgba(0,0,20,.8)", zIndex:9999,
          backdropFilter:"blur(6px)", overflowY:"auto",
          display:"flex", alignItems:"flex-start", justifyContent:"center",
          padding:"20px 16px 40px",
        }}>
          <div style={{
            background:T.surface, borderRadius:24, padding:"24px 20px",
            width:"100%", maxWidth:380,
            boxShadow:"0 24px 64px rgba(0,0,0,.4)",
            border:`1px solid ${T.border}`,
            marginTop:20, position:"relative",
          }}>
            {/* ✕ close button */}
            <button
              onClick={closeAll}
              style={{
                position:"absolute", top:14, right:14,
                background:"#dc2626", color:"#fff",
                border:"none", borderRadius:"50%",
                width:28, height:28, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 2px 8px rgba(220,38,38,.4)",
                flexShrink:0,
              }}
            >
              {IC.close}
            </button>

            {/* Header */}
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:28, marginBottom:4 }}>🎰</div>
              <div style={{ fontSize:19, fontWeight:800, color:T.navy, marginBottom:4 }}>
                Where to eat?
              </div>
              <div style={{ fontSize:13, color:T.muted }}>
                Spin and let fate decide!
              </div>
            </div>

            {/* Slot machine */}
            <div style={{
              position:"relative", borderRadius:16, overflow:"hidden",
              height:ITEM_H * 5, border:`3px solid ${T.border}`,
              boxShadow:"inset 0 0 30px rgba(0,0,0,.15)",
              background:T.surface2, marginBottom:20,
            }}>
              <div style={{
                position:"absolute", width:"100%",
                transform:`translateY(calc(-${offset % totalH}px + ${ITEM_H * 2}px))`,
                willChange:"transform",
              }}>
                {tripled.map((name, i) => {
                  const origIdx = i % count;
                  return (
                    <div key={i} style={{
                      height:ITEM_H,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      padding:"0 16px",
                      borderBottom:`1px solid ${T.border}`,
                      background:COLORS[origIdx % COLORS.length] + "22",
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, width:"100%", justifyContent:"center" }}>
                        <div style={{ width:10, height:10, borderRadius:"50%", flexShrink:0, background:COLORS[origIdx % COLORS.length] }}/>
                        <span style={{ fontSize:15, fontWeight:700, color:T.text, textAlign:"center", lineHeight:1.3 }}>
                          {name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fades */}
              <div style={{ position:"absolute", top:0, left:0, right:0, height:ITEM_H*1.5, pointerEvents:"none", background:`linear-gradient(to bottom, ${T.surface}ee, transparent)`, zIndex:2 }}/>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:ITEM_H*1.5, pointerEvents:"none", background:`linear-gradient(to top, ${T.surface}ee, transparent)`, zIndex:2 }}/>

              {/* Centre highlight */}
              <div style={{ position:"absolute", zIndex:3, top:"50%", transform:"translateY(-50%)", left:0, right:0, height:ITEM_H, border:`3px solid ${T.navy}`, borderLeft:"none", borderRight:"none", pointerEvents:"none" }}/>
              <div style={{ position:"absolute", zIndex:3, top:"50%", transform:"translateY(-50%)", left:0, width:4, height:ITEM_H, background:T.navy }}/>
              <div style={{ position:"absolute", zIndex:3, top:"50%", transform:"translateY(-50%)", right:0, width:4, height:ITEM_H, background:T.navy }}/>
            </div>

            {/* Spin button */}
            <button onClick={spin} disabled={spinning} style={{
              width:"100%", border:"none", borderRadius:12,
              padding:"14px", fontSize:16, fontWeight:800,
              cursor:spinning?"default":"pointer",
              background:spinning?"#e5e7eb":"linear-gradient(135deg,#FF6B6B,#FF9F43)",
              color:spinning?"#9ca3af":"#fff",
              boxShadow:spinning?"none":"0 4px 16px rgba(255,107,107,.4)",
              transition:"all .2s",
            }}>
              {spinning ? "Spinning…" : "🎰 Spin!"}
            </button>
          </div>
        </div>
      )}

      {/* Winner modal */}
      {showWinner && !showPlace && winner && (
        <div style={{
          position:"fixed", top:0, left:0, right:0, bottom:0,
          background:"rgba(0,0,20,.85)", zIndex:10000,
          backdropFilter:"blur(6px)",
          display:"flex", alignItems:"flex-start", justifyContent:"center",
          padding:"20px 16px 40px", overflowY:"auto",
        }}>
          <div style={{
            background:T.surface, borderRadius:24, padding:28,
            width:"100%", maxWidth:340,
            boxShadow:"0 24px 64px rgba(0,0,0,.5)",
            border:`1px solid ${T.border}`,
            textAlign:"center", marginTop:80,
            position:"relative",
          }}>
            {/* ✕ close */}
            <button onClick={closeAll} style={{
              position:"absolute", top:14, right:14,
              background:"#dc2626", color:"#fff",
              border:"none", borderRadius:"50%",
              width:28, height:28, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 2px 8px rgba(220,38,38,.4)",
            }}>
              {IC.close}
            </button>

            <div style={{ fontSize:52, marginBottom:8 }}>🎉</div>
            <div style={{ fontSize:14, color:T.muted, marginBottom:8, fontWeight:600 }}>
              Today you're going to…
            </div>
            <div style={{ fontSize:26, fontWeight:900, color:T.navy, marginBottom:24, lineHeight:1.2 }}>
              {winner}
            </div>
            <button
              onClick={() => { setShowWinner(false); setShowPlace(true); }}
              style={{
                width:"100%", border:"none", borderRadius:12,
                padding:"13px", fontSize:15, fontWeight:800,
                cursor:"pointer",
                background:"linear-gradient(135deg,#FF6B6B,#FF9F43)",
                color:"#fff",
                boxShadow:"0 4px 16px rgba(255,107,107,.4)",
                marginBottom:10,
              }}
            >
              Let's go! 🍴
            </button>
            <button
              onClick={() => { setShowWinner(false); setShowWheel(true); }}
              style={{
                width:"100%", border:"none", borderRadius:12,
                padding:"10px", fontSize:14, fontWeight:600,
                cursor:"pointer", background:T.light, color:T.muted,
              }}
            >
              Spin again
            </button>
          </div>
        </div>
      )}

      {/* Place info card — replaces winner modal */}
      {showPlace && winnerPlace && (
        <div style={{
          position:"fixed", top:0, left:0, right:0, bottom:0,
          background:"rgba(0,0,20,.85)", zIndex:10000,
          backdropFilter:"blur(6px)",
          display:"flex", alignItems:"flex-start", justifyContent:"center",
          padding:"20px 16px 40px", overflowY:"auto",
        }}>
          <div style={{
            background:T.surface, borderRadius:24,
            width:"100%", maxWidth:380,
            boxShadow:"0 24px 64px rgba(0,0,0,.5)",
            border:`1px solid ${T.border}`,
            marginTop:20, overflow:"hidden",
            position:"relative",
          }}>
            {/* ✕ close */}
            <button onClick={closeAll} style={{
              position:"absolute", top:14, right:14, zIndex:10,
              background:"#dc2626", color:"#fff",
              border:"none", borderRadius:"50%",
              width:28, height:28, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 2px 8px rgba(220,38,38,.4)",
            }}>
              {IC.close}
            </button>

            {/* Coloured header band */}
            <div style={{
              background:`linear-gradient(135deg,#FF6B6B,#FF9F43)`,
              padding:"24px 20px 20px",
            }}>
              <div style={{ fontSize:36, marginBottom:6 }}>🍽️</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:4, lineHeight:1.2, paddingRight:32 }}>
                {winnerPlace.name}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <span style={{
                  background:"rgba(255,255,255,.25)", color:"#fff",
                  fontSize:11, fontWeight:700, padding:"3px 9px",
                  borderRadius:4, textTransform:"uppercase", letterSpacing:.6,
                }}>
                  {winnerPlace.type}
                </span>
                {winnerPlace.delivery && (
                  <span style={{
                    background:"rgba(255,255,255,.25)", color:"#fff",
                    fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:4,
                  }}>
                    🚚 Delivery
                  </span>
                )}
              </div>
            </div>

            {/* Info body */}
            <div style={{ padding:"18px 20px" }}>
              {winnerPlace.description && (
                <p style={{ fontSize:14, color:T.muted, lineHeight:1.6, marginBottom:16, margin:"0 0 16px" }}>
                  {winnerPlace.description}
                </p>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {winnerPlace.phone && (
                  <a href={`tel:${winnerPlace.phone}`} style={{
                    display:"flex", alignItems:"center", gap:10,
                    background:T.light, borderRadius:10, padding:"10px 14px",
                    textDecoration:"none", color:T.text,
                  }}>
                    <span style={{ color:T.navy }}>{IC.phone}</span>
                    <div>
                      <div style={{ fontSize:11, color:T.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:.5 }}>Phone</div>
                      <div style={{ fontSize:14, fontWeight:700, color:T.navy }}>{winnerPlace.phone}</div>
                    </div>
                  </a>
                )}

                {winnerPlace.mapLink && (
                  <a href={winnerPlace.mapLink} target="_blank" rel="noopener noreferrer" style={{
                    display:"flex", alignItems:"center", gap:10,
                    background:T.light, borderRadius:10, padding:"10px 14px",
                    textDecoration:"none", color:T.text,
                  }}>
                    <span style={{ color:"#059669" }}>{IC.map}</span>
                    <div>
                      <div style={{ fontSize:11, color:T.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:.5 }}>Location</div>
                      <div style={{ fontSize:14, fontWeight:700, color:"#059669" }}>Open in Maps →</div>
                    </div>
                  </a>
                )}
              </div>

              {/* Menu images */}
              {(winnerPlace.menuImages||[]).length > 0 && (
                <div style={{ marginTop:16 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.8, marginBottom:10 }}>
                    📋 Menu
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {winnerPlace.menuImages.map((url, i) => (
                      <img key={i} src={url} alt={`Menu ${i+1}`}
                        onClick={() => setMenuImg(url)}
                        style={{
                          height:80, width:"auto", objectFit:"cover",
                          borderRadius:8, border:`1px solid ${T.border}`,
                          cursor:"pointer",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Back + close buttons */}
              <div style={{ display:"flex", gap:8, marginTop:20 }}>
                <button
                  onClick={() => { setShowPlace(false); setShowWinner(true); }}
                  style={{
                    flex:1, border:"none", borderRadius:12,
                    padding:"10px", fontSize:13, fontWeight:600,
                    cursor:"pointer", background:T.light, color:T.muted,
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={closeAll}
                  style={{
                    flex:2, border:"none", borderRadius:12,
                    padding:"10px", fontSize:14, fontWeight:800,
                    cursor:"pointer",
                    background:"linear-gradient(135deg,#FF6B6B,#FF9F43)",
                    color:"#fff",
                  }}
                >
                  Let's eat! 🍴
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu image lightbox */}
      {menuImg && (
        <div onClick={() => setMenuImg(null)} style={{
          position:"fixed", top:0, left:0, right:0, bottom:0,
          background:"rgba(0,0,0,.9)", zIndex:20000,
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:16, cursor:"pointer",
        }}>
          <img src={menuImg} alt="Menu" style={{ maxWidth:"100%", maxHeight:"90vh", borderRadius:12, objectFit:"contain" }}/>
        </div>
      )}

      <style>{`
        @keyframes wheelPulse {
          0%,100% { box-shadow: 0 4px 18px rgba(255,107,107,.4); }
          50%      { box-shadow: 0 4px 28px rgba(255,107,107,.7); }
        }
      `}</style>
    </>
  );
}
