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
      style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(10,24,16,0.92)",backdropFilter:"blur(12px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"clamp(8px,3vw,24px)",animation:"fadeInModal 0.25s ease",overflowY:"auto"}}
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
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(0.85rem,2vw,1.1rem)",color:"rgba(255,255,255,0.85)",fontWeight:600}}>{week.title}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.4)",fontFamily:"'Mulish',sans-serif"}}>
            {cur + 1} / {total}
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
        style={{width:"100%",maxWidth:1200,borderRadius:20,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.5)",aspectRatio:"16/9",background:"#1a2e1e",animation:"slideUpModal 0.35s ease",flexShrink:0,position:"relative"}}
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
        .tgrid{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;max-width:1060px;margin:44px auto 0;}
        .mcard{width:calc(33.333% - 10px);min-width:220px;max-width:320px;flex-grow:0;flex-shrink:0;}
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
          .awrap{margin-top:32px;}.tgrid{gap:10px;}
          .hbtns{flex-direction:column;align-items:flex-start;}
          .mcard{width:100%;max-width:100%;min-width:unset;}
          .ubadge{display:none;}
          .atag{display:none;}
          .abtn{padding:16px 14px;gap:10px;}
          .abody.open{max-height:2400px;}
          .abin{padding:0 14px 20px;padding-top:18px;}
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
          <img src="data:image/png;base64,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" alt="ВШТЭ" style={{width:"30px",height:"30px",objectFit:"contain",borderRadius:"6px",background:"#fff",padding:"2px"}}/>
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
            <img src="data:image/png;base64,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" alt="ВШТЭ" style={{width:"44px",height:"44px",objectFit:"contain",background:"#fff",borderRadius:"10px",padding:"3px",flexShrink:0}}/>
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
              <img src="data:image/png;base64,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" alt="ВШТЭ" style={{width:"24px",height:"24px",objectFit:"contain",background:"#fff",borderRadius:"5px",padding:"2px"}}/>
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
