import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════
   ДАННЫЕ — замените на реальных студентов
══════════════════════════════════════════════ */
const MEMBERS = [
  { id: 1, name: "Погодина Эльза-София",      role: "Капитан команды",         initials: "ПЭ", photo: null },
  { id: 2, name: "Погорелов Максим",      role: "Аналитик и оратор",          initials: "ПМ", photo: null },
  { id: 3, name: "Вертячкин Алексей",       role: "Генератор идей",         initials: "ВА", photo: null },
  { id: 4, name: "Чистов Никита",      role: "Исследователь",    initials: "ЧН", photo: null },
  { id: 5, name: "Вахитов Алексей",  role: "Разработчик/дизайнер сайта-презентации",        initials: "ВА", photo: null },
];

/* ══════════════════════════════════════════════
   ДАННЫЕ — КЕЙСЫ
   insights[] — краткие выводы команды по кейсу
   slides[]   — слайды презентации
   ready      — true когда презентация готова
══════════════════════════════════════════════ */
const WEEKS = [
  {
    week: 1,
    ready: true,
    title: "Анализ рынка и позиционирование",
    subtitle: "Конкурентная среда и лидерство СВЕЗА на рынке берёзовой фанеры",
    accent: "#3d6b52",
    accentLight: "#c8dfc8",
    tag: "Рынок · Конкуренция",

    /* ── Выводы команды по кейсу 1 ── */
    insights: [
      {
        author: "Команда",
        icon: "💡",
        text: "Мы ожидали увидеть типичного регионального игрока, но СВЕЗА оказалась компанией с по-настоящему глобальным мышлением — 80 стран экспорта говорят сами за себя.",
      },
      {
        author: "Вывод об отрасли",
        icon: "🌲",
        text: "Рынок берёзовой фанеры значительно более концентрирован, чем мы предполагали. 20% мирового рынка у одного игрока — это нетипично для сырьевых отраслей.",
      },
      {
        author: "Неожиданное открытие",
        icon: "🚢",
        text: "Самым интересным оказался сегмент СПГ-танкеров: специализированная фанера SVEZA Gas с долей 15% мирового рынка — это пример нишевого лидерства через инновации.",
      },
      {
        author: "Что можно улучшить",
        icon: "⚠️",
        text: "Высокая зависимость от экспортных маршрутов делает компанию уязвимой к геополитическим изменениям. Диверсификация внутреннего рынка — недоиспользованный резерв.",
      },
    ],

    /* ── Слайды презентации ── */
    slides: [
      {
        layout: "cover",
        bg: "linear-gradient(135deg,#1e3a28 0%,#3d6b52 60%,#6b9e6b 100%)",
        title: "Анализ рынка\nберёзовой фанеры",
        subtitle: "Кейс 1 · Неделя 1",
        label: "СВЕЗА — мировой лидер",
        icon: "🌲",
        tags: ["Рынок", "Конкуренция", "Позиционирование"],
      },
      {
        layout: "stats",
        bg: "linear-gradient(160deg,#f4f9f0 0%,#e8f2e0 100%)",
        title: "Компания в цифрах",
        accent: "#3d6b52",
        items: [
          { num: "20%",      label: "доля мирового рынка\nберёзовой фанеры" },
          { num: "29%",      label: "доля российского\nрынка фанеры" },
          { num: "80",       label: "стран экспорта\nна 5 континентах" },
          { num: "7 500",    label: "сотрудников\nв группе компаний" },
          { num: "1.46 млн", label: "м³ производства\nв год" },
          { num: "7",        label: "фанерных\nкомбинатов" },
        ],
      },
      {
        layout: "textimage",
        bg: "#fff",
        title: "Продуктовый портфель",
        accent: "#3d6b52",
        body: "СВЕЗА производит берёзовую, ламинированную и большеформатную фанеру, ДСП/ЛДСП, биотопливо. Уникальный продукт — фанера SVEZA Gas для СПГ-танкеров с долей 15% мирового рынка.",
        imageLabel: "Продукция СВЕЗА",
        imageBg: "linear-gradient(135deg,#c8dfc8,#7aab68)",
        imageIcon: "🪵",
        tags: ["Фанера берёзовая", "Ламинат", "СПГ-класс", "Биотопливо"],
      },
      {
        layout: "timeline",
        bg: "linear-gradient(170deg,#f8faf5 0%,#eef4e8 100%)",
        title: "История роста",
        accent: "#3d6b52",
        events: [
          { year: "1997", text: "Основание группы компаний СВЕЗА" },
          { year: "2003", text: "Запуск 3-го комбината, выход на европейский рынок" },
          { year: "2012", text: "FSC-сертификация всех производственных площадок" },
          { year: "2018", text: "Запуск UV-линии лакирования фанеры" },
          { year: "2021", text: "Расширение на рынки Африки и Азии" },
          { year: "2023", text: "Рост поставок в Африку на 240%" },
        ],
      },
      {
        layout: "swot",
        bg: "#fff",
        title: "SWOT-анализ СВЕЗА",
        accent: "#3d6b52",
        quadrants: [
          { label: "Сильные стороны", color: "#3d6b52", items: ["Вертикальная интеграция", "FSC по всей цепи", "20% мирового рынка", "Уникальные продукты"] },
          { label: "Слабые стороны",  color: "#b85c38", items: ["Зависимость от курса рубля", "Концентрация в одном сегменте", "Логистические ограничения"] },
          { label: "Возможности",     color: "#5a7ab8", items: ["Рост рынка Африки", "Цифровизация производства", "Биотопливный сегмент"] },
          { label: "Угрозы",          color: "#9b6e1a", items: ["Санкционное давление", "Конкуренция из Азии", "Волатильность ЛПК"] },
        ],
      },
      {
        layout: "conclusion",
        bg: "linear-gradient(135deg,#1e3a28 0%,#2d5a3a 100%)",
        title: "Итоги анализа рынка",
        accent: "#8ab870",
        points: [
          "СВЕЗА занимает устойчивую лидирующую позицию благодаря вертикальной интеграции и диверсификации.",
          "Расширение на рынки Африки и Азии снижает зависимость от европейского направления.",
          "Инновационные продукты (UV-фанера, SVEZA Gas) формируют premium-сегмент с высокой маржой.",
          "Ключевой риск — экспортные ограничения при высокой доле внешних поставок.",
        ],
      },
    ],
  },

  {
    week: 2,
    ready: false,
    title: "Продуктовая стратегия и инновации",
    subtitle: "Диверсификация портфеля и технологическое лидерство",
    accent: "#5a7e3a",
    accentLight: "#d2e8be",
    tag: "Продукт · Инновации",
    insights: [],   // ← добавьте выводы после защиты кейса
    slides: [],     // ← добавьте слайды и поставьте ready: true
  },

  {
    week: 3,
    ready: false,
    title: "Устойчивое развитие и ESG",
    subtitle: "Экологическая ответственность и социальные программы",
    accent: "#4a6b5a",
    accentLight: "#c4ddd0",
    tag: "ESG · Экология",
    insights: [],
    slides: [],
  },

  {
    week: 4,
    ready: false,
    title: "Стратегия роста и будущее",
    subtitle: "Масштабирование, M&A и цифровая трансформация",
    accent: "#3a5a6b",
    accentLight: "#bcd0dd",
    tag: "Стратегия · M&A",
    insights: [],
    slides: [],
  },
];

/* ══ SVG-декоры ══ */
function WoodRings({ style }) {
  return (
    <svg viewBox="0 0 200 200" style={style}>
      {[10,22,36,50,64,78,90].map((r,i)=>(
        <ellipse key={i} cx="100" cy="100" rx={r} ry={r*0.9}
          fill="none" stroke="currentColor" strokeWidth="1.2"
          opacity={0.6 - i * 0.07}/>
      ))}
    </svg>
  );
}
function Leaf({ style }) {
  return (
    <svg viewBox="0 0 60 80" style={style}>
      <path d="M30 76 Q5 52 10 22 Q30 2 50 22 Q55 52 30 76Z" fill="currentColor"/>
      <path d="M30 76 Q30 45 30 8" stroke="white" strokeWidth="1.2" fill="none" opacity="0.4"/>
      {[20,35,50,62].map((y,i)=>(
        <path key={i} d={`M30 ${y} Q${i%2===0?18:42} ${y-5} ${i%2===0?12:48} ${y+4}`}
          stroke="white" strokeWidth="0.8" fill="none" opacity="0.3"/>
      ))}
    </svg>
  );
}

/* ══ Слайды ══ */
function SlideCover({ s }) {
  return (
    <div style={{background:s.bg,height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"48px 52px",position:"relative",overflow:"hidden"}}>
      <WoodRings style={{position:"absolute",right:-60,top:-60,width:260,height:260,color:"rgba(255,255,255,0.06)"}}/>
      <Leaf style={{position:"absolute",right:52,bottom:32,width:88,height:118,color:"rgba(255,255,255,0.06)"}}/>
      <span style={{background:"rgba(255,255,255,0.14)",borderRadius:100,padding:"5px 16px",fontSize:"0.7rem",color:"rgba(255,255,255,0.85)",letterSpacing:2,textTransform:"uppercase",fontWeight:600,display:"inline-block",width:"fit-content"}}>{s.label}</span>
      <div>
        <div style={{fontSize:"2.8rem",marginBottom:14}}>{s.icon}</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.7rem,3.5vw,2.8rem)",color:"#fff",fontWeight:700,lineHeight:1.15,marginBottom:14,whiteSpace:"pre-line"}}>{s.title}</h2>
        <p style={{color:"rgba(255,255,255,0.52)",fontSize:"0.85rem",marginBottom:24}}>{s.subtitle}</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {s.tags.map((t,i)=>(
            <span key={i} style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",fontSize:"0.72rem",color:"rgba(255,255,255,0.8)"}}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
function SlideStats({ s }) {
  return (
    <div style={{background:s.bg,height:"100%",padding:"36px 44px"}}>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.7rem",color:s.accent,fontWeight:700,marginBottom:28}}>{s.title}</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,height:"calc(100% - 88px)"}}>
        {s.items.map((item,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:16,padding:"22px 18px",border:`1px solid ${s.accent}20`,boxShadow:"0 2px 14px rgba(0,0,0,0.04)",display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.8rem",color:s.accent,fontWeight:700,lineHeight:1}}>{item.num}</div>
            <div style={{fontSize:"0.7rem",color:"#6a7a60",marginTop:7,lineHeight:1.55,whiteSpace:"pre-line",fontWeight:300}}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function SlideTextImage({ s }) {
  return (
    <div style={{background:s.bg,height:"100%",padding:"36px 44px",display:"flex",gap:34,alignItems:"stretch"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.7rem",color:s.accent,fontWeight:700,marginBottom:18}}>{s.title}</h2>
        <p style={{fontSize:"0.87rem",color:"#4a5a40",lineHeight:1.82,fontWeight:300,marginBottom:22}}>{s.body}</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {s.tags.map((t,i)=>(
            <span key={i} style={{background:`${s.accent}13`,border:`1px solid ${s.accent}27`,borderRadius:8,padding:"4px 11px",fontSize:"0.72rem",color:s.accent,fontWeight:500}}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{width:"36%",background:s.imageBg,borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,position:"relative",overflow:"hidden"}}>
        <WoodRings style={{position:"absolute",color:"rgba(255,255,255,0.1)",width:"150%",height:"150%",top:"-25%",left:"-25%"}}/>
        <span style={{position:"relative",zIndex:1,fontSize:"3.5rem"}}>{s.imageIcon}</span>
        <span style={{position:"relative",zIndex:1,fontSize:"0.72rem",color:"rgba(255,255,255,0.75)",fontWeight:500,textAlign:"center",padding:"0 16px"}}>{s.imageLabel}</span>
      </div>
    </div>
  );
}
function SlideTimeline({ s }) {
  return (
    <div style={{background:s.bg,height:"100%",padding:"36px 44px"}}>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.7rem",color:s.accent,fontWeight:700,marginBottom:28}}>{s.title}</h2>
      <div style={{display:"flex",flexDirection:"column",height:"calc(100% - 100px)",justifyContent:"space-between"}}>
        {s.events.map((ev,i)=>(
          <div key={i} style={{display:"flex",gap:18,alignItems:"center"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.05rem",color:s.accent,fontWeight:700,width:50,textAlign:"right",flexShrink:0}}>{ev.year}</div>
            <div style={{width:12,height:12,borderRadius:"50%",background:s.accent,flexShrink:0,boxShadow:`0 0 0 3px ${s.accent}28`}}/>
            <div style={{height:1,width:14,background:`${s.accent}28`,flexShrink:0}}/>
            <div style={{fontSize:"0.83rem",color:"#4a5a40",lineHeight:1.45}}>{ev.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function SlideSwot({ s }) {
  return (
    <div style={{background:s.bg,height:"100%",padding:"36px 44px"}}>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.7rem",color:s.accent,fontWeight:700,marginBottom:22}}>{s.title}</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13,height:"calc(100% - 94px)"}}>
        {s.quadrants.map((q,i)=>(
          <div key={i} style={{background:`${q.color}08`,border:`1.5px solid ${q.color}22`,borderRadius:14,padding:"16px 16px"}}>
            <div style={{fontSize:"0.65rem",letterSpacing:1.5,textTransform:"uppercase",color:q.color,fontWeight:700,marginBottom:10}}>{q.label}</div>
            <ul style={{listStyle:"none",padding:0,display:"flex",flexDirection:"column",gap:7}}>
              {q.items.map((it,j)=>(
                <li key={j} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                  <span style={{width:5,height:5,borderRadius:"50%",background:q.color,flexShrink:0,marginTop:6}}/>
                  <span style={{fontSize:"0.79rem",color:"#3a4a30",lineHeight:1.4,fontWeight:300}}>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
function SlideConclusion({ s }) {
  return (
    <div style={{background:s.bg,height:"100%",padding:"48px 52px",position:"relative",overflow:"hidden"}}>
      <Leaf style={{position:"absolute",left:-18,bottom:-8,width:110,height:150,color:"rgba(255,255,255,0.05)"}}/>
      <WoodRings style={{position:"absolute",right:-80,top:-80,width:300,height:300,color:"rgba(255,255,255,0.04)"}}/>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.9rem",color:s.accent,fontWeight:700,marginBottom:30}}>{s.title}</h2>
      <div style={{display:"flex",flexDirection:"column",gap:17}}>
        {s.points.map((pt,i)=>(
          <div key={i} style={{display:"flex",gap:16,alignItems:"flex-start"}}>
            <div style={{width:28,height:28,borderRadius:8,background:`${s.accent}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"'Playfair Display',serif",fontSize:"0.9rem",color:s.accent,fontWeight:700}}>{i+1}</div>
            <p style={{fontSize:"0.87rem",color:"rgba(255,255,255,0.78)",lineHeight:1.8,fontWeight:300}}>{pt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderSlide(slide) {
  const map = { cover: SlideCover, stats: SlideStats, textimage: SlideTextImage, timeline: SlideTimeline, swot: SlideSwot, conclusion: SlideConclusion };
  const C = map[slide.layout];
  return C ? <C s={slide}/> : null;
}

/* ══ Навигационные кнопки (переиспользуются в обоих режимах) ══ */
function SlideNav({ cur, total, onPrev, onNext, onDot, accent, size = "normal" }) {
  const pad = size === "large" ? "10px 28px" : "8px 20px";
  const fs = size === "large" ? "0.9rem" : "0.82rem";
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
      <button onClick={onPrev} disabled={cur===0}
        style={{background:cur===0?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.15)",border:`1.5px solid ${cur===0?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.3)"}`,borderRadius:10,padding:pad,cursor:cur===0?"default":"pointer",color:cur===0?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.9)",fontFamily:"'Mulish',sans-serif",fontSize:fs,fontWeight:600,transition:"all 0.2s",backdropFilter:"blur(8px)"}}>← Назад</button>
      <div style={{display:"flex",gap:6,flex:1,justifyContent:"center"}}>
        {Array.from({length:total}).map((_,i)=>(
          <button key={i} onClick={()=>onDot(i)}
            style={{width:i===cur?28:8,height:8,borderRadius:6,background:i===cur?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.3)",border:"none",cursor:"pointer",transition:"all 0.3s ease",flexShrink:0}}/>
        ))}
      </div>
      <button onClick={onNext} disabled={cur===total-1}
        style={{background:cur===total-1?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.15)",border:`1.5px solid ${cur===total-1?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.3)"}`,borderRadius:10,padding:pad,cursor:cur===total-1?"default":"pointer",color:cur===total-1?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.9)",fontFamily:"'Mulish',sans-serif",fontSize:fs,fontWeight:600,transition:"all 0.2s",backdropFilter:"blur(8px)"}}>Вперёд →</button>
    </div>
  );
}

/* ══ Модальное окно на весь экран ══ */
function PresentationModal({ week, startSlide, onClose }) {
  const [cur, setCur] = useState(startSlide);
  const total = week.slides.length;

  // Закрытие по Escape, навигация стрелками
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCur(c => Math.min(total - 1, c + 1));
      if (e.key === "ArrowLeft")  setCur(c => Math.max(0, c - 1));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [total, onClose]);

  return (
    <div
      onClick={onClose}
      style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(10,24,16,0.92)",backdropFilter:"blur(12px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",animation:"fadeInModal 0.25s ease"}}
    >
      <style>{`
        @keyframes fadeInModal { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUpModal { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
      `}</style>

      {/* Шапка модалки */}
      <div
        onClick={e => e.stopPropagation()}
        style={{width:"100%",maxWidth:1200,display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,animation:"slideUpModal 0.3s ease"}}
      >
        <div>
          <div style={{fontSize:"0.68rem",letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.45)",fontWeight:700,marginBottom:4}}>Неделя {week.week}</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",color:"rgba(255,255,255,0.85)",fontWeight:600}}>{week.title}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.4)",fontFamily:"'Mulish',sans-serif"}}>
            {cur + 1} / {total} · ESC для закрытия
          </span>
          <button
            onClick={onClose}
            style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1.5px solid rgba(255,255,255,0.2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",color:"rgba(255,255,255,0.7)",transition:"all 0.2s"}}
          >✕</button>
        </div>
      </div>

      {/* Слайд */}
      <div
        onClick={e => e.stopPropagation()}
        style={{width:"100%",maxWidth:1200,borderRadius:20,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.5)",aspectRatio:"16/9",background:"#1a2e1e",animation:"slideUpModal 0.35s ease",flexShrink:0}}
      >
        {renderSlide(week.slides[cur])}
      </div>

      {/* Навигация */}
      <div
        onClick={e => e.stopPropagation()}
        style={{width:"100%",maxWidth:1200,marginTop:20,animation:"slideUpModal 0.4s ease"}}
      >
        <SlideNav
          cur={cur} total={total}
          onPrev={() => setCur(c => Math.max(0, c - 1))}
          onNext={() => setCur(c => Math.min(total - 1, c + 1))}
          onDot={i => setCur(i)}
          accent={week.accent}
          size="large"
        />
      </div>
    </div>
  );
}

/* ══ Вьюер презентации (встроенный, маленький) ══ */
function PresentationViewer({ week }) {
  const [cur, setCur] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const total = week.slides.length;
  if (!total) return null;
  const slide = week.slides[cur];

  return (
    <>
      {modalOpen && (
        <PresentationModal week={week} startSlide={cur} onClose={() => setModalOpen(false)} />
      )}
      <div>
        {/* Слайд с кнопкой открытия */}
        <div style={{position:"relative",borderRadius:18,overflow:"hidden",boxShadow:"0 8px 48px rgba(30,60,40,0.16)",aspectRatio:"16/9",background:"#e8ede4",cursor:"pointer",group:"true"}}
          onClick={() => setModalOpen(true)}
        >
          {renderSlide(slide)}

          {/* Счётчик */}
          <div style={{position:"absolute",bottom:13,right:15,fontSize:"0.67rem",color:"rgba(255,255,255,0.55)",background:"rgba(0,0,0,0.28)",borderRadius:7,padding:"3px 9px",backdropFilter:"blur(4px)"}}>{cur+1} / {total}</div>

          {/* Кнопка на весь экран */}
          <div style={{position:"absolute",top:13,right:13,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(8px)",borderRadius:10,padding:"7px 13px",display:"flex",alignItems:"center",gap:7,color:"rgba(255,255,255,0.85)",fontSize:"0.75rem",fontWeight:600,fontFamily:"'Mulish',sans-serif",border:"1px solid rgba(255,255,255,0.15)",transition:"background 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.55)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0.35)"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            На весь экран
          </div>

          {/* Затемнение при наведении */}
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0)",transition:"background 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.04)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0)"}
          />
        </div>

        {/* Навигация под слайдом */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:14,gap:12}}>
          <button onClick={e=>{e.stopPropagation();setCur(c=>Math.max(0,c-1));}} disabled={cur===0}
            style={{background:cur===0?"#f0f0ec":"#fff",border:`1.5px solid ${week.accent}30`,borderRadius:10,padding:"8px 20px",cursor:cur===0?"default":"pointer",color:cur===0?"#ccc":week.accent,fontFamily:"'Mulish',sans-serif",fontSize:"0.82rem",fontWeight:600,transition:"all 0.2s",boxShadow:cur===0?"none":"0 2px 10px rgba(0,0,0,0.06)"}}>← Назад</button>
          <div style={{display:"flex",gap:6,flex:1,justifyContent:"center"}}>
            {week.slides.map((_,i)=>(
              <button key={i} onClick={e=>{e.stopPropagation();setCur(i);}}
                style={{width:i===cur?26:8,height:8,borderRadius:6,background:i===cur?week.accent:`${week.accent}35`,border:"none",cursor:"pointer",transition:"all 0.3s ease",flexShrink:0}}/>
            ))}
          </div>
          <button onClick={e=>{e.stopPropagation();setCur(c=>Math.min(total-1,c+1));}} disabled={cur===total-1}
            style={{background:cur===total-1?"#f0f0ec":"#fff",border:`1.5px solid ${week.accent}30`,borderRadius:10,padding:"8px 20px",cursor:cur===total-1?"default":"pointer",color:cur===total-1?"#ccc":week.accent,fontFamily:"'Mulish',sans-serif",fontSize:"0.82rem",fontWeight:600,transition:"all 0.2s",boxShadow:cur===total-1?"none":"0 2px 10px rgba(0,0,0,0.06)"}}>Вперёд →</button>
        </div>

        {/* Подсказка */}
        <div style={{textAlign:"center",marginTop:10,fontSize:"0.7rem",color:"#9aaa90"}}>
          Нажмите на слайд для просмотра на весь экран
        </div>
      </div>
    </>
  );
}

/* ══ Блок выводов команды ══ */
function InsightsBlock({ insights, accent }) {
  if (!insights || insights.length === 0) return null;
  return (
    <div style={{marginTop:32,borderTop:`1px solid ${accent}18`,paddingTop:28}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
        <div style={{width:3,height:22,background:`linear-gradient(180deg,${accent},${accent}60)`,borderRadius:2}}/>
        <span style={{fontSize:"0.72rem",letterSpacing:2,textTransform:"uppercase",color:accent,fontWeight:700}}>Выводы команды</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {insights.map((ins,i)=>(
          <div key={i} style={{background:`${accent}07`,border:`1px solid ${accent}18`,borderRadius:16,padding:"20px 20px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:14,right:16,fontSize:"1.3rem",opacity:0.6}}>{ins.icon}</div>
            <div style={{fontSize:"0.67rem",letterSpacing:1.5,textTransform:"uppercase",color:accent,fontWeight:700,marginBottom:9}}>{ins.author}</div>
            <p style={{fontSize:"0.86rem",color:"#3a4a30",lineHeight:1.72,fontWeight:300}}>{ins.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ WIP-заглушка ══ */
function WipBlock({ week }) {
  return (
    <div style={{background:"linear-gradient(135deg,#f4f8f0,#ecf4e6)",borderRadius:16,padding:"36px 32px",textAlign:"center",border:"2px dashed rgba(61,107,82,0.16)"}}>
      <div style={{fontSize:"2.2rem",marginBottom:12}}>🛠️</div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",color:"#3d6b52",fontWeight:600,marginBottom:8}}>Презентация в разработке</div>
      <p style={{fontSize:"0.82rem",color:"#6a8a60",lineHeight:1.72,fontWeight:300,maxWidth:420,margin:"0 auto"}}>
        Материалы кейса {week.week} появятся после защиты.<br/>
        Для добавления заполните{" "}
        <code style={{background:"rgba(61,107,82,0.1)",padding:"1px 7px",borderRadius:5,fontSize:"0.77rem"}}>slides[]</code>,{" "}
        <code style={{background:"rgba(61,107,82,0.1)",padding:"1px 7px",borderRadius:5,fontSize:"0.77rem"}}>insights[]</code>{" "}
        и поставьте <code style={{background:"rgba(61,107,82,0.1)",padding:"1px 7px",borderRadius:5,fontSize:"0.77rem"}}>ready: true</code>.
      </p>
    </div>
  );
}

/* ══ Карточка участника ══ */
function MemberCard({ member, onUpload }) {
  const ref = useRef();
  const grads = [
    "linear-gradient(135deg,#3d6b52,#8ab870)",
    "linear-gradient(135deg,#5a7e3a,#a0c060)",
    "linear-gradient(135deg,#2d5a3a,#6b9e6b)",
    "linear-gradient(135deg,#4a6b5a,#7aab68)",
    "linear-gradient(135deg,#3a5a6b,#6b9e8a)",
    "linear-gradient(135deg,#6b5a3a,#b89a6b)",
  ];
  const bg = grads[member.id % grads.length];
  const onFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => onUpload(member.id, ev.target.result);
    r.readAsDataURL(f);
  };
  return (
    <div className="mcard">
      <div className="mavatar" onClick={()=>ref.current.click()} title="Загрузить фото">
        {member.photo
          ? <img src={member.photo} alt={member.name} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
          : <div style={{width:"100%",height:"100%",background:bg,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontWeight:700,color:"#fff"}}>{member.initials}</div>
        }
        <div className="moverlay">📷</div>
        <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={onFile}/>
      </div>
      <div>
        <div className="mname">{member.name}</div>
        <div className="mrole">{member.role}</div>
        <div style={{width:6,height:6,borderRadius:"50%",background:member.photo?"#8ab870":"#c8dab8",marginTop:8}}/>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ГЛАВНЫЙ КОМПОНЕНТ
══════════════════════════════════════════════ */
export default function SVEZASite() {
  const [members, setMembers] = useState(MEMBERS);
  const [activeWeek, setActiveWeek] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [vis, setVis] = useState({});

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 56);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) setVis(p => ({...p, [e.target.id]: true})); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-obs]").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const upload = (id, url) => setMembers(p => p.map(m => m.id === id ? {...m, photo: url} : m));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Mulish:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{width:100%;min-height:100%;scroll-behavior:smooth;}
        body{font-family:'Mulish',sans-serif;background:#f7faf4;color:#2a2a1e;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
        #root{width:100%;min-height:100vh;}

        /* ── NAV ── */
        .nav{position:fixed;top:0;left:0;right:0;z-index:200;padding:18px 48px;display:flex;align-items:center;justify-content:space-between;gap:18px;transition:all 0.35s ease;}
        .nav.sc{background:rgba(255,255,255,0.97);backdrop-filter:blur(16px);box-shadow:0 1px 20px rgba(40,80,50,0.08);padding:11px 48px;}
        .nlogo{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:#2d5a3a;text-decoration:none;display:flex;align-items:baseline;gap:2px;}
        .nlogo em{color:#6b9e6b;font-style:normal;}
        .nlinks{display:flex;gap:26px;list-style:none;}
        .nlinks a{text-decoration:none;color:#4a5a40;font-size:0.84rem;font-weight:500;transition:color 0.2s;letter-spacing:0.2px;}
        .nlinks a:hover{color:#3d6b52;}
        .ubadge{display:flex;align-items:center;gap:8px;background:rgba(61,107,82,0.09);border:1px solid rgba(61,107,82,0.17);border-radius:11px;padding:6px 13px;}
        .uico{width:28px;height:28px;background:linear-gradient(135deg,#2d5a3a,#6b9e6b);border-radius:7px;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.58rem;text-align:center;line-height:1.3;font-family:'Playfair Display',serif;flex-shrink:0;}
        .utxt{font-size:0.65rem;color:#3d6b52;font-weight:600;line-height:1.4;}

        /* ── HERO ── */
        .hero{min-height:100vh;background:linear-gradient(155deg,#f4f9f0 0%,#e6f2da 40%,#d5e8cc 100%);display:flex;align-items:center;padding:100px 48px 64px;position:relative;overflow:hidden;}
        .hd1{position:absolute;right:-100px;top:-120px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(61,107,82,0.07) 0%,transparent 70%);pointer-events:none;}
        .hd2{position:absolute;left:38%;bottom:-100px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,rgba(107,158,107,0.07) 0%,transparent 70%);pointer-events:none;}
        .hcontent{position:relative;z-index:2;max-width:700px;}
        /* Студенческий тег */
        .stud-tag{display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,0.7);border:1px solid rgba(61,107,82,0.2);border-radius:14px;padding:9px 16px;margin-bottom:28px;backdrop-filter:blur(6px);}
        .stud-tag-uni{font-size:0.72rem;color:#3d6b52;font-weight:700;line-height:1.4;}
        .stud-tag-uni span{font-weight:300;color:#6a8a60;display:block;}
        .hh1{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,5vw,4.2rem);line-height:1.1;color:#1a3220;font-weight:700;margin-bottom:20px;}
        .hh1 em{color:#4a7c59;font-style:normal;}
        .hsub{font-size:1rem;line-height:1.85;color:#4d5e43;font-weight:300;max-width:540px;margin-bottom:36px;}
        .hsub strong{font-weight:600;color:#2d5a3a;}
        /* Кнопки-ссылки */
        .hbtns{display:flex;gap:12px;flex-wrap:wrap;}
        .hbtn{display:inline-flex;align-items:center;gap:8px;border-radius:12px;padding:11px 22px;font-family:'Mulish',sans-serif;font-size:0.84rem;font-weight:600;cursor:pointer;transition:all 0.22s;text-decoration:none;}
        .hbtn-primary{background:#3d6b52;color:#fff;border:1.5px solid #3d6b52;box-shadow:0 4px 20px rgba(61,107,82,0.25);}
        .hbtn-primary:hover{background:#2d5a3a;box-shadow:0 6px 28px rgba(61,107,82,0.32);transform:translateY(-1px);}
        .hbtn-ghost{background:rgba(255,255,255,0.7);color:#3d6b52;border:1.5px solid rgba(61,107,82,0.25);backdrop-filter:blur(6px);}
        .hbtn-ghost:hover{background:rgba(255,255,255,0.9);transform:translateY(-1px);}
        /* Правая панель */
        .hright{position:absolute;right:0;top:0;bottom:0;width:40%;background:linear-gradient(135deg,#b4d89c,#7aab68 50%,#4a7c59);clip-path:polygon(16% 0,100% 0,100% 100%,0% 100%);overflow:hidden;}
        .hwd{position:absolute;inset:0;opacity:0.22;background:repeating-linear-gradient(82deg,transparent,transparent 22px,rgba(80,50,20,0.1) 22px,rgba(80,50,20,0.1) 23px);}
        .htxt{position:absolute;top:50%;left:50%;transform:translate(-32%,-50%);font-family:'Playfair Display',serif;font-size:clamp(4rem,9vw,10rem);font-weight:700;color:rgba(255,255,255,0.11);user-select:none;white-space:nowrap;letter-spacing:-5px;}
        .hcard{position:absolute;bottom:56px;left:26%;transform:translateX(-50%);background:rgba(255,255,255,0.92);backdrop-filter:blur(10px);border-radius:16px;padding:13px 19px;box-shadow:0 8px 36px rgba(40,80,50,0.14);}
        .hcl{font-size:0.61rem;text-transform:uppercase;letter-spacing:1.2px;color:#7a9a70;font-weight:700;}
        .hcv{font-family:'Playfair Display',serif;font-size:1.4rem;color:#2d5a3a;font-weight:700;margin-top:1px;}

        /* ── SECTION ── */
        .sec{padding:84px 48px;}
        .stag{font-size:0.68rem;letter-spacing:2.5px;text-transform:uppercase;color:#5a9a6a;font-weight:700;margin-bottom:10px;}
        .sh2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,3.5vw,2.6rem);color:#1a3220;font-weight:700;line-height:1.2;margin-bottom:12px;}
        .sdesc{font-size:0.95rem;color:#607060;line-height:1.85;font-weight:300;}
        .center{text-align:center;max-width:540px;margin:0 auto;}

        /* ── TEAM ── */
        .tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(235px,1fr));gap:14px;max-width:1060px;margin:44px auto 0;}
        .mcard{background:#fff;border-radius:20px;padding:22px 18px;border:1px solid rgba(61,107,82,0.1);display:flex;align-items:center;gap:15px;transition:transform 0.25s,box-shadow 0.25s;box-shadow:0 2px 12px rgba(40,80,50,0.05);}
        .mcard:hover{transform:translateY(-3px);box-shadow:0 10px 36px rgba(40,80,50,0.11);}
        .mavatar{width:54px;height:54px;flex-shrink:0;position:relative;cursor:pointer;border-radius:50%;}
        .moverlay{position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,0.38);display:flex;align-items:center;justify-content:center;font-size:1rem;opacity:0;transition:opacity 0.2s;}
        .mavatar:hover .moverlay{opacity:1;}
        .mname{font-size:0.91rem;font-weight:600;color:#1a3220;margin-bottom:2px;}
        .mrole{font-size:0.73rem;color:#7a8a70;}
        .uphint{font-size:0.69rem;color:#9aaa90;margin-top:10px;text-align:center;}
        .gbadge{display:inline-flex;align-items:center;gap:10px;background:linear-gradient(135deg,#eef5e8,#e3f0da);border:1px solid rgba(61,107,82,0.16);border-radius:13px;padding:10px 17px;margin-top:16px;}
        .gnum{font-family:'Playfair Display',serif;font-size:1.9rem;color:#2d5a3a;font-weight:700;line-height:1;}
        .ginfo{font-size:0.71rem;color:#5a7a50;line-height:1.55;}
        .ginfo strong{font-weight:700;color:#3d6b52;display:block;}

        /* ── ACCORDION ── */
        .awrap{max-width:880px;margin:50px auto 0;display:flex;flex-direction:column;gap:13px;}
        .aitem{background:#fff;border-radius:20px;border:1px solid rgba(61,107,82,0.1);overflow:hidden;box-shadow:0 2px 12px rgba(40,80,50,0.04);transition:box-shadow 0.3s;}
        .aitem.open{box-shadow:0 8px 48px rgba(40,80,50,0.12);}
        .abtn{width:100%;background:none;border:none;cursor:pointer;padding:22px 26px;display:flex;align-items:center;gap:15px;text-align:left;transition:background 0.2s;}
        .abtn:hover{background:rgba(61,107,82,0.025);}
        .abadge{width:50px;height:50px;border-radius:13px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;}
        .abl{font-size:0.5rem;text-transform:uppercase;letter-spacing:1px;opacity:0.8;}
        .abn{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;line-height:1;}
        .atitles{flex:1;min-width:0;}
        .amain{font-family:'Playfair Display',serif;font-size:1.08rem;color:#1a3220;font-weight:600;margin-bottom:2px;}
        .asub{font-size:0.77rem;color:#7a8a70;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .atag{font-size:0.64rem;padding:3px 10px;border-radius:100px;font-weight:600;letter-spacing:0.4px;flex-shrink:0;}
        .astat{font-size:0.64rem;padding:3px 10px;border-radius:100px;font-weight:600;flex-shrink:0;}
        .aarrow{width:27px;height:27px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(61,107,82,0.08);transition:transform 0.3s,background 0.2s;font-size:0.6rem;color:#4a7c59;flex-shrink:0;}
        .aitem.open .aarrow{transform:rotate(180deg);background:rgba(61,107,82,0.15);}
        .abody{overflow:hidden;max-height:0;transition:max-height 0.55s cubic-bezier(0.4,0,0.2,1);}
        .abody.open{max-height:1400px;}
        .abin{padding:0 26px 26px;border-top:1px solid rgba(61,107,82,0.07);padding-top:24px;}

        /* ── FOOTER ── */
        .footer{background:#1a3220;padding:48px 48px;}
        .fin{max-width:1060px;margin:0 auto;display:flex;justify-content:space-between;align-items:flex-end;gap:24px;}
        .flogo{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:700;color:#fff;margin-bottom:6px;}
        .flogo em{color:#8ab870;font-style:normal;}
        .fdesc{font-size:0.78rem;color:rgba(255,255,255,0.46);line-height:1.72;max-width:290px;}
        .fright{text-align:right;font-size:0.74rem;color:rgba(255,255,255,0.42);}
        .fq{font-family:'Playfair Display',serif;font-style:italic;font-size:0.94rem;color:rgba(255,255,255,0.3);margin-bottom:8px;}

        /* ── FADE IN ── */
        .fi{opacity:0;transform:translateY(18px);transition:opacity 0.6s ease,transform 0.6s ease;}
        .fi.v{opacity:1;transform:none;}
        .d1{transition-delay:.08s;}.d2{transition-delay:.18s;}.d3{transition-delay:.28s;}
        .d4{transition-delay:.38s;}.d5{transition-delay:.48s;}.d6{transition-delay:.58s;}

        @media(max-width:768px){
          .hero{padding:106px 20px 56px;}.hright,.hcard{display:none;}
          .sec{padding:52px 20px;}.nav{padding:13px 20px;}.nav.sc{padding:9px 20px;}
          .nlinks{display:none;}.fin{flex-direction:column;}.fright{text-align:left;}
          .awrap{margin-top:32px;}.tgrid{gap:12px;}
          .hbtns{flex-direction:column;align-items:flex-start;}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className={`nav ${scrolled ? "sc" : ""}`}>
        <a className="nlogo" href="#">СВЕ<em>ЗА</em></a>
        <ul className="nlinks">
          <li><a href="#team">Команда</a></li>
          <li><a href="#cases">Кейсы</a></li>
        </ul>
        <div className="ubadge">
          <div className="uico">ВШ<br/>ТЭ</div>
          <div className="utxt">СПБГУПТД · ВШТЭ<br/>221 группа</div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hd1"/><div className="hd2"/>
        <div className="hcontent">

          {/* Студенческий бейдж */}
          <div className="stud-tag">
            <div style={{width:32,height:32,background:"linear-gradient(135deg,#2d5a3a,#6b9e6b)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M12 3L2 9l10 6 10-6-10-6zM2 15l10 6 10-6M2 12l10 6 10-6" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stud-tag-uni">
              221 группа · СПБГУПТД ВШТЭ
              <span>Учебный проект · Кейс-анализ</span>
            </div>
          </div>

          <h1 className="hh1">
            Разбираем кейсы<br/>
            <em>СВЕЗА</em> —<br/>
            мирового лидера фанеры
          </h1>
          <p className="hsub">
            Четыре недели мы анализируем реальные управленческие задачи компании{" "}
            <strong>СВЕЗА</strong> — крупнейшего производителя берёзовой фанеры в мире.
            Каждую неделю — новый кейс, новая презентация, новые выводы.
          </p>
          <div className="hbtns">
            <a className="hbtn hbtn-primary" href="#cases">Смотреть кейсы →</a>
            <a className="hbtn hbtn-ghost" href="#team">Команда Непризнанные гении</a>
          </div>
        </div>

        <div className="hright">
          <div className="hwd"/>
          <WoodRings style={{position:"absolute",right:-60,top:-60,width:280,height:280,color:"rgba(255,255,255,0.07)"}}/>
          <div className="htxt">СВЕЗА</div>
          <div className="hcard">
            <div className="hcl">Клиент кейса</div>
            <div className="hcv">sveza.ru</div>
          </div>
        </div>
      </section>

      {/* ══ КОМАНДА ══ */}
      <section className="sec" id="team" style={{background:"#fff"}}>
        <div className="center">
          <div className="stag">Авторы проекта</div>
          <h2 className="sh2">Непризнанные гении</h2>
          <p className="sdesc">Студенты Высшей школы технологий и энергетики Санкт-Петербургского государственного университета промышленных технологий и дизайна.</p>
          <div className="gbadge">
            <div style={{background:"linear-gradient(135deg,#2d5a3a,#6b9e6b)",width:36,height:36,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none">
                <path d="M12 3L2 9l10 6 10-6-10-6zM2 15l10 6 10-6M2 12l10 6 10-6" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="gnum">221</div>
              <div className="ginfo"><strong>СПБГУПТД · ВШТЭ</strong>Учебная группа</div>
            </div>
          </div>
        </div>
        <p className="uphint">Нажмите на аватар, чтобы загрузить фото 📷</p>
        <div className="tgrid">
          {members.map((m, i) => (
            <div key={m.id} id={`m${m.id}`} data-obs className={`fi d${(i % 6) + 1} ${vis[`m${m.id}`] ? "v" : ""}`}>
              <MemberCard member={m} onUpload={upload}/>
            </div>
          ))}
        </div>
      </section>

      {/* ══ КЕЙСЫ ══ */}
      <section className="sec" id="cases" style={{background:"#eef5e8"}}>
        <div className="center">
          <div className="stag">Учебные кейсы</div>
          <h2 className="sh2">4 недели — 4 кейса</h2>
          <p className="sdesc">
            Каждую неделю — новый стратегический или управленческий кейс компании СВЕЗА.
            После защиты добавляем выводы о проделанной работе.
          </p>
        </div>

        <div className="awrap">
          {WEEKS.map((w, wi) => (
            <div key={wi} id={`acc${wi}`} data-obs className={`aitem fi d${wi+1} ${vis[`acc${wi}`]?"v":""} ${activeWeek === wi ? "open" : ""}`}>
              <button className="abtn" onClick={() => setActiveWeek(activeWeek === wi ? null : wi)}>
                <div className="abadge" style={{background:`linear-gradient(135deg,${w.accent},${w.accentLight})`}}>
                  <span className="abl">неделя</span>
                  <span className="abn">{w.week}</span>
                </div>
                <div className="atitles">
                  <div className="amain">{w.title}</div>
                  <div className="asub">{w.subtitle}</div>
                </div>
                <span className="atag" style={{background:`${w.accent}14`,color:w.accent}}>{w.tag}</span>
                {w.ready
                  ? <span className="astat" style={{background:"rgba(61,107,82,0.1)",color:"#3d6b52"}}>● Готово</span>
                  : <span className="astat" style={{background:"rgba(180,140,60,0.1)",color:"#9a7a20"}}>⏳ Скоро</span>
                }
                <div className="aarrow">▼</div>
              </button>

              <div className={`abody ${activeWeek === wi ? "open" : ""}`}>
                <div className="abin">
                  {w.ready ? (
                    <>
                      <PresentationViewer week={w}/>
                      <InsightsBlock insights={w.insights} accent={w.accent}/>
                    </>
                  ) : (
                    <WipBlock week={w}/>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="fin">
          <div>
            <div className="flogo">СВЕ<em>ЗА</em></div>
            <p className="fdesc">Учебный проект · Кейс-анализ компании СВЕЗА.<br/>221 группа · СПБГУПТД ВШТЭ · Санкт-Петербург.</p>
          </div>
          <div className="fright">
            <div style={{display:"flex",alignItems:"center",gap:7,justifyContent:"flex-end",marginBottom:10}}>
              <div style={{background:"linear-gradient(135deg,#3d6b52,#6b9e6b)",width:24,height:24,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.5rem",color:"white",fontWeight:700,lineHeight:1.3,textAlign:"center"}}>ВШ<br/>ТЭ</div>
              <span>СПБГУПТД · ВШТЭ · 221 группа</span>
            </div>
            <div className="fq">«Потенциал дерева безграничен»</div>
            <div>sveza.ru</div>
          </div>
        </div>
      </footer>
    </>
  );
}
