import { useState, useEffect, useRef } from "react";

const COLORS = [
  "#FF6B6B","#FF9F43","#FECA57","#48DBFB","#FF9FF3",
  "#54A0FF","#5F27CD","#00D2D3","#FF6348","#2ED573",
  "#FFA502","#3742FA","#EE5A24","#009432","#EA2027",
  "#0652DD","#833471","#C4E538","#ED4C67","#F79F1F",
];

const ITEM_H = 64; // height of each slot item in px

export default function SpinWheel({ places, T, showThavalam }) {
  const [showWheel, setShowWheel] = useState(false);
  const [spinning,  setSpinning]  = useState(false);
  const [offset,    setOffset]    = useState(0);
  const [winner,    setWinner]    = useState(null);
  const [showWinner,setShowWinner]= useState(false);
  const animRef   = useRef(null);
  const startRef  = useRef(null);
  const offsetRef = useRef(0);

  const names = places.map(p => p.name);
  const count = names.length;

  if (count === 0) return null;

  // Triple the list so we can loop seamlessly
  const tripled = [...names, ...names, ...names];
  const totalH  = count * ITEM_H;

  const spin = () => {
  if (spinning) return;
  setWinner(null);
  setShowWinner(false);
  setSpinning(true);

  // Pick random winner
  const winnerIdx = Math.floor(Math.random() * count);
  const loops = 4 + Math.floor(Math.random() * 3);
  const targetOffset = loops * totalH + winnerIdx * ITEM_H;

  const duration  = 3500;
  const startTime = performance.now();
  const startOff  = 0; 

  offsetRef.current = 0;
  setOffset(0);

  const ease = (t) => 1 - Math.pow(1 - t, 3);

  const animate = (now) => {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = ease(progress);
    const current  = startOff + (targetOffset - startOff) * eased;

    offsetRef.current = current;
    setOffset(current);

    if (progress < 1) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      
      offsetRef.current = winnerIdx * ITEM_H;
      setOffset(winnerIdx * ITEM_H);
      setSpinning(false);
      setWinner(names[winnerIdx]);
      setTimeout(() => setShowWinner(true), 400);
    }
  };

  animRef.current = requestAnimationFrame(animate);
};

  useEffect(() => {
    offsetRef.current = 0;
    setOffset(0);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [count]);

 
  const windowCount = 5;
  const windowH     = windowCount * ITEM_H;
  const startIdx    = Math.floor(offset / ITEM_H) - Math.floor(windowCount / 2);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setShowWheel(true)}
        title="Spin the wheel!"
        style={{
          position:"fixed", bottom: showThavalam ? 144 : 84, right:20, zIndex:500,
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
      {showWheel && (
        <div onClick={()=>{ if(!spinning){ setShowWheel(false); setShowWinner(false); }}}
          style={{
            position:"fixed", top:0, left:0, right:0, bottom:0,
            background:"rgba(0,0,20,.8)", zIndex:9999,
            backdropFilter:"blur(6px)", overflowY:"auto",
            display:"flex", alignItems:"flex-start", justifyContent:"center",
            padding:"20px 16px 40px",
          }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:T.surface, borderRadius:24, padding:"24px 20px",
            width:"100%", maxWidth:380,
            boxShadow:"0 24px 64px rgba(0,0,0,.4)",
            border:`1px solid ${T.border}`,
            marginTop:20,
          }}>
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
              height:windowH, border:`3px solid ${T.border}`,
              boxShadow:"inset 0 0 30px rgba(0,0,0,.15)",
              background:T.surface2, marginBottom:20,
            }}>
              {/* Scrolling items */}
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
                      <div style={{
                        display:"flex", alignItems:"center", gap:10,
                        width:"100%", justifyContent:"center",
                      }}>
                        <div style={{
                          width:10, height:10, borderRadius:"50%", flexShrink:0,
                          background:COLORS[origIdx % COLORS.length],
                        }}/>
                        <span style={{
                          fontSize:15, fontWeight:700, color:T.text,
                          textAlign:"center", lineHeight:1.3,
                        }}>
                          {name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Top fade */}
              <div style={{
                position:"absolute", top:0, left:0, right:0,
                height:ITEM_H * 1.5, pointerEvents:"none",
                background:`linear-gradient(to bottom, ${T.surface}ee, transparent)`,
                zIndex:2,
              }}/>

              {/* Bottom fade */}
              <div style={{
                position:"absolute", bottom:0, left:0, right:0,
                height:ITEM_H * 1.5, pointerEvents:"none",
                background:`linear-gradient(to top, ${T.surface}ee, transparent)`,
                zIndex:2,
              }}/>

              {/* Centre highlight window */}
              <div style={{
                position:"absolute", zIndex:3,
                top:"50%", transform:"translateY(-50%)",
                left:0, right:0, height:ITEM_H,
                border:`3px solid ${T.navy}`,
                borderLeft:"none", borderRight:"none",
                pointerEvents:"none",
              }}/>

              {/* Left accent bar */}
              <div style={{
                position:"absolute", zIndex:3,
                top:"50%", transform:"translateY(-50%)",
                left:0, width:4, height:ITEM_H,
                background:T.navy,
              }}/>

              {/* Right accent bar */}
              <div style={{
                position:"absolute", zIndex:3,
                top:"50%", transform:"translateY(-50%)",
                right:0, width:4, height:ITEM_H,
                background:T.navy,
              }}/>
            </div>

            {/* Spin button */}
            <button
              onClick={spin}
              disabled={spinning}
              style={{
                width:"100%", border:"none", borderRadius:12,
                padding:"14px", fontSize:16, fontWeight:800,
                cursor:spinning?"default":"pointer",
                background:spinning
                  ? "#e5e7eb"
                  : "linear-gradient(135deg,#FF6B6B,#FF9F43)",
                color:spinning?"#9ca3af":"#fff",
                boxShadow:spinning?"none":"0 4px 16px rgba(255,107,107,.4)",
                transition:"all .2s", marginBottom:10,
              }}
            >
              {spinning ? "Spinning…" : "🎰 Spin!"}
            </button>

            <button
              onClick={()=>{ setShowWheel(false); setShowWinner(false); }}
              style={{
                width:"100%", border:"none", borderRadius:12,
                padding:"10px", fontSize:14, fontWeight:600,
                cursor:"pointer", background:T.light, color:T.text,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Winner popup */}
      {showWinner && winner && (
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
          }}>
            <div style={{ fontSize:52, marginBottom:8 }}>🎉</div>
            <div style={{ fontSize:14, color:T.muted, marginBottom:8, fontWeight:600 }}>
              Today you're going to…
            </div>
            <div style={{
              fontSize:26, fontWeight:900, color:T.navy,
              marginBottom:24, lineHeight:1.2,
            }}>
              {winner}
            </div>
            <button
              onClick={()=>{ setShowWinner(false); setShowWheel(false); }}
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
              onClick={()=>{ setShowWinner(false); }}
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

      <style>{`
        @keyframes wheelPulse {
          0%,100% { box-shadow: 0 4px 18px rgba(255,107,107,.4); }
          50%      { box-shadow: 0 4px 28px rgba(255,107,107,.7); }
        }
      `}</style>
    </>
  );
}