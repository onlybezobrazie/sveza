import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import './App.css';



/* ══ Утилита: загрузить изображение как base64 ══ */
async function loadImageAsBase64(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || 1280;
      canvas.height = img.naturalHeight || 720;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = src;
  });
}

/* ══ Скачать как PDF (jsPDF через CDN) ══ */
async function downloadAsPDF(week) {
  if (!window.jspdf) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1280, 720], hotfixes: ["px_scaling"] });
  const slides = week.downloadSlides || [];
  for (let i = 0; i < slides.length; i++) {
    if (i > 0) pdf.addPage([1280, 720], "landscape");
    try {
      const b64 = await loadImageAsBase64(slides[i]);
      pdf.addImage(b64, "PNG", 0, 0, 1280, 720);
    } catch(e) {
      console.warn("Не удалось загрузить слайд:", slides[i]);
    }
  }
  pdf.save(`СВЕЗА_Кейс_${week.week}_${week.title}.pdf`);
}

/* ══ Скачать как PPTX (pptxgenjs через CDN) ══ */
async function downloadAsPPTX(week) {
  if (!window.PptxGenJS) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pptxgenjs/3.12.0/pptxgen.bundle.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const prs = new window.PptxGenJS();
  prs.layout = "LAYOUT_16x9";
  prs.title = `СВЕЗА — Кейс ${week.week}: ${week.title}`;
  const slides = week.downloadSlides || [];
  for (let i = 0; i < slides.length; i++) {
    const slide = prs.addSlide();
    try {
      const b64 = await loadImageAsBase64(slides[i]);
      slide.addImage({ data: b64, x: 0, y: 0, w: "100%", h: "100%" });
    } catch(e) {
      console.warn("Не удалось загрузить слайд:", slides[i]);
    }
  }
  await prs.writeFile({ fileName: `СВЕЗА_Кейс_${week.week}_${week.title}.pptx` });
}

/* ══════════════════════════════════════════════
   ДАННЫЕ — замените на реальных студентов
══════════════════════════════════════════════ */
/* ─── ФОТО: положите файлы photo1.jpg, photo2.jpg ... в папку /public/
   photo1.jpg → участник 1, photo2.jpg → участник 2, и т.д.
   victor.jpg → Виктор Александрович ─── */
const MEMBER_PHOTOS = {
  1: "/sveza/photo1.jpg",
  2: "/sveza/photo2.jpg",
  3: "/sveza/photo3.jpg",
  4: "/sveza/photo4.jpg",
  5: "/sveza/photo5.jpg",
};
const VICTOR_PHOTO = "data:image/png;base64,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";

const MEMBERS = [
  { id: 1, name: "Погодина Эльза-София", role: "Капитан команды",                         initials: "ПЭ" },
  { id: 2, name: "Погорелов Максим ",      role: "Аналитик и оратор",                       initials: "ПМ" },
  { id: 3, name: "Вертячкин Алексей ",     role: "Генератор идей",                          initials: "ВА" },
  { id: 4, name: "Чистов Никита",         role: "Исследователь",                           initials: "ЧН" },
  { id: 5, name: "Вахитов Алексей ",       role: "Разработчик/дизайнер сайта-презентации",  initials: "ВА" },
  { id: 6, name: "Марков Виктор Александрович",  role: "Доцент кафедры машин автоматизированных систем, к.т.н., доцент. Куратор команды", initials: "ВА", isVictor: true },
];

const CHAT_DATA = [
  {
    id: 1, name: "Погодина Эльза-София", initials: "ПЭ", time: "14:32",
    messages: [
      { from: "them", text: "Всем привет! Как продвигается работа над кейсом? 👀", time: "14:28" },
      { from: "them", text: "Я уже почти закончила введение, осталось оформить выводы 🌿", time: "14:30" },
      { from: "them", text: "Кто берёт блок с конкурентами?", time: "14:32" },
    ],
  },
  {
    id: 2, name: "Погорелов Максим", initials: "ПМ", time: "13:15",
    messages: [
      { from: "them", text: "Народ, нашёл крутую статью про рынок фанеры в Азии", time: "13:10" },
      { from: "them", text: "Там такие цифры — СВЕЗА реально монстр 😅", time: "13:12" },
      { from: "them", text: "Скидываю в общий чат перед защитой", time: "13:15" },
    ],
  },
  {
    id: 3, name: "Вертячкин Алексей", initials: "ВА", time: "вчера",
    messages: [
      { from: "them", text: "А кто придумал 4 кейса за 4 недели 💀", time: "22:40" },
      { from: "them", text: "Ладно, идеи есть — завтра покажу слайды", time: "22:55" },
    ],
  },
  {
    id: 4, name: "Чистов Никита", initials: "ЧН", time: "вчера",
    messages: [
      { from: "them", text: "Нашёл годную инфу про ESG-стратегию для 3-й недели 📄", time: "19:05" },
      { from: "them", text: "Готовлю слайд с таймлайном — будет огонь 🔥", time: "19:20" },
    ],
  },
  {
    id: 5, name: "Вахитов Алексей", initials: "ВА", time: "12:00",
    messages: [
      { from: "them", text: "Сайт обновил, проверьте на телефоне 📱", time: "11:55" },
      { from: "them", text: "Если что-то криво — пишите, пофикшу 🛠️", time: "12:00" },
    ],
  },
  {
    id: "victor", name: "Виктор Александрович", initials: "ВА", isVictor: true, time: "10:02",
    messages: [
      { from: "them", text: "Добрый день, команда! Посмотрел первый кейс — неплохое начало.", time: "09:58" },
      { from: "them", text: "На защите говорите уверенно. И да — меньше котиков на слайдах, больше аналитики 😄", time: "10:02" },
    ],
  },
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

    /* ── PNG для скачивания (положите файлы в /public/sveza/week1/) ──
       Пример: "/sveza/week1/slide1.png", "/sveza/week1/slide2.png" и т.д.
       Если массив пуст — кнопка скачивания не отображается. */
    downloadSlides: [
      "/sveza/week1/slide1.png",
      "/sveza/week1/slide2.png",
      "/sveza/week1/slide3.png",
      "/sveza/week1/slide4.png",
      "/sveza/week1/slide5.png",
      "/sveza/week1/slide6.png",
    ],

    /* ── Слайды презентации (JSX-рендер) ── */
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
    downloadSlides: [], // ← добавьте пути к PNG: ["/sveza/week2/slide1.png", ...]
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
    downloadSlides: [],
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
    downloadSlides: [],
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
        <h2 style={{fontFamily:"'Montserrat', sans-serif",fontSize:"clamp(1.7rem,3.5vw,2.8rem)",color:"#fff",fontWeight:700,lineHeight:1.15,marginBottom:14,whiteSpace:"pre-line"}}>{s.title}</h2>
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
      <h2 style={{fontFamily:"'Montserrat', sans-serif",fontSize:"1.7rem",color:s.accent,fontWeight:700,marginBottom:28}}>{s.title}</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,height:"calc(100% - 88px)"}}>
        {s.items.map((item,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:16,padding:"22px 18px",border:`1px solid ${s.accent}20`,boxShadow:"0 2px 14px rgba(0,0,0,0.04)",display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <div style={{fontFamily:"'Montserrat', sans-serif",fontSize:"1.8rem",color:s.accent,fontWeight:700,lineHeight:1}}>{item.num}</div>
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
        <h2 style={{fontFamily:"'Montserrat', sans-serif",fontSize:"1.7rem",color:s.accent,fontWeight:700,marginBottom:18}}>{s.title}</h2>
        <p style={{fontSize:"0.87rem",color:"#4a5a40",lineHeight:1.82,fontWeight:300,marginBottom:22}}>{s.body}</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {s.tags.map((t,i)=>(
            <span key={i} style={{background:`${s.accent}13`,border:`1px solid ${s.accent}27`,borderRadius:8,padding:"4px 11px",fontSize:"0.72rem",color:s.accent,fontWeight:500}}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{width:"36%",background:s.imageBg||"linear-gradient(135deg,#c8dfc8,#7aab68)",borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,position:"relative",overflow:"hidden"}}>
        {s.src ? (
          <img src={s.src} alt={s.imageLabel||s.title} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",borderRadius:18}}/>
        ) : (
          <>
            <WoodRings style={{position:"absolute",color:"rgba(255,255,255,0.1)",width:"150%",height:"150%",top:"-25%",left:"-25%"}}/>
            <span style={{position:"relative",zIndex:1,fontSize:"3.5rem"}}>{s.imageIcon}</span>
          </>
        )}
        {s.imageLabel && (
          <span style={{position:"absolute",bottom:12,left:0,right:0,textAlign:"center",zIndex:1,fontSize:"0.72rem",color:"rgba(255,255,255,0.85)",fontWeight:500,padding:"0 16px",textShadow:"0 1px 4px rgba(0,0,0,0.4)"}}>{s.imageLabel}</span>
        )}
      </div>
    </div>
  );
}
function SlideTimeline({ s }) {
  return (
    <div style={{background:s.bg,height:"100%",padding:"36px 44px"}}>
      <h2 style={{fontFamily:"'Montserrat', sans-serif",fontSize:"1.7rem",color:s.accent,fontWeight:700,marginBottom:28}}>{s.title}</h2>
      <div style={{display:"flex",flexDirection:"column",height:"calc(100% - 100px)",justifyContent:"space-between"}}>
        {s.events.map((ev,i)=>(
          <div key={i} style={{display:"flex",gap:18,alignItems:"center"}}>
            <div style={{fontFamily:"'Montserrat', sans-serif",fontSize:"1.05rem",color:s.accent,fontWeight:700,width:50,textAlign:"right",flexShrink:0}}>{ev.year}</div>
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
      <h2 style={{fontFamily:"'Montserrat', sans-serif",fontSize:"1.7rem",color:s.accent,fontWeight:700,marginBottom:22}}>{s.title}</h2>
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
      <h2 style={{fontFamily:"'Montserrat', sans-serif",fontSize:"1.9rem",color:s.accent,fontWeight:700,marginBottom:30}}>{s.title}</h2>
      <div style={{display:"flex",flexDirection:"column",gap:17}}>
        {s.points.map((pt,i)=>(
          <div key={i} style={{display:"flex",gap:16,alignItems:"flex-start"}}>
            <div style={{width:28,height:28,borderRadius:8,background:`${s.accent}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"'Montserrat', sans-serif",fontSize:"0.9rem",color:s.accent,fontWeight:700}}>{i+1}</div>
            <p style={{fontSize:"0.87rem",color:"rgba(255,255,255,0.78)",lineHeight:1.8,fontWeight:300}}>{pt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideImage({ s }) {
  return (
    <div style={{background: s.imageBg || s.bg || "#1a2e1e", height:"100%", position:"relative", overflow:"hidden", display:"flex", alignItems:"flex-end"}}>
      {s.src && (
        <img src={s.src} alt={s.title} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit: s.objectFit || "cover",objectPosition: s.objectPosition || "center"}}/>
      )}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)"}}/>
      <div style={{position:"relative",zIndex:1,padding:"28px 36px",width:"100%", background: s.panelBg || "transparent"}}>
        {s.tags && (
          <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
            {s.tags.map((tag,i) => (
              <span key={i} style={{fontSize:"0.62rem",letterSpacing:1.5,textTransform:"uppercase",background:"rgba(255,255,255,0.18)",color:"rgba(255,255,255,0.9)",padding:"3px 10px",borderRadius:20,fontWeight:600}}>{tag}</span>
            ))}
          </div>
        )}
        {s.title && <h2 style={{fontFamily:"'Montserrat', sans-serif",fontSize:"clamp(1.3rem,2.5vw,2rem)",color:"#fff",fontWeight:700,marginBottom:8,lineHeight:1.2}}>{s.title}</h2>}
        {s.caption && <p style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.75)",lineHeight:1.6,fontWeight:300}}>{s.caption}</p>}
        {s.imageIcon && <div style={{fontSize:"3rem",marginBottom:6}}>{s.imageIcon}</div>}
        {s.imageLabel && <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.7)",fontWeight:500}}>{s.imageLabel}</div>}
      </div>
    </div>
  );
}

function renderSlide(slide) {
  const map = { cover: SlideCover, stats: SlideStats, textimage: SlideTextImage, timeline: SlideTimeline, swot: SlideSwot, conclusion: SlideConclusion, image: SlideImage };
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
        style={{background:cur===0?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.15)",border:`1.5px solid ${cur===0?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.3)"}`,borderRadius:10,padding:pad,cursor:cur===0?"default":"pointer",color:cur===0?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.9)",fontFamily:"'Manrope', sans-serif",fontSize:fs,fontWeight:600,transition:"all 0.2s",backdropFilter:"blur(8px)"}}>← Назад</button>
      <div style={{display:"flex",gap:6,flex:1,justifyContent:"center"}}>
        {Array.from({length:total}).map((_,i)=>(
          <button key={i} onClick={()=>onDot(i)}
            style={{width:i===cur?28:8,height:8,borderRadius:6,background:i===cur?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.3)",border:"none",cursor:"pointer",transition:"all 0.3s ease",flexShrink:0}}/>
        ))}
      </div>
      <button onClick={onNext} disabled={cur===total-1}
        style={{background:cur===total-1?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.15)",border:`1.5px solid ${cur===total-1?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.3)"}`,borderRadius:10,padding:pad,cursor:cur===total-1?"default":"pointer",color:cur===total-1?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.9)",fontFamily:"'Manrope', sans-serif",fontSize:fs,fontWeight:600,transition:"all 0.2s",backdropFilter:"blur(8px)"}}>Вперёд →</button>
    </div>
  );
}

/* ══ Модальное окно на весь экран ══ */
function PresentationModal({ week, startSlide, onClose }) {
  const [cur, setCur] = useState(startSlide);
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [slideHovered, setSlideHovered] = useState(false);
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

  // Поворот в альбомную ориентацию при открытии презентации
  useEffect(() => {
    let orientationLocked = false;
    let mqCleanup = null;

    const tryLock = async () => {
      try {
        // Пробуем нативный API (Android Chrome, некоторые другие браузеры)
        if (screen?.orientation?.lock) {
          await screen.orientation.lock("landscape");
          orientationLocked = true;
          return;
        }
      } catch (_) {
        // Браузер не поддерживает или запрос отклонён (iOS, десктоп)
      }

      // Запасной вариант: CSS-поворот для мобильного портретного режима
      const mq = window.matchMedia(
        "(max-width: 900px) and (orientation: portrait)"
      );
      const update = (e) => setIsPortraitMobile(e.matches);
      setIsPortraitMobile(mq.matches);
      mq.addEventListener("change", update);
      mqCleanup = () => mq.removeEventListener("change", update);
    };

    tryLock();

    return () => {
      if (orientationLocked) {
        try { screen.orientation.unlock(); } catch (_) {}
      }
      setIsPortraitMobile(false);
      mqCleanup?.();
    };
  }, []);

  /* Позиционирование: обычное или повёрнутое на 90° */
  const baseModalStyle = {
    position: "fixed",
    zIndex: 1000,
    background: "rgba(10,24,16,0.92)",
    backdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(8px,3vw,24px)",
    animation: "fadeInModal 0.25s ease",
    overflowY: "auto",
  };

  const positionStyle = isPortraitMobile
    ? {
        // CSS-поворот: элемент разворачивается в ширину экрана
        width: "100vh",
        height: "100vw",
        top: "calc(50% - 50vw)",
        left: "calc(50% - 50vh)",
        transform: "rotate(90deg)",
        transformOrigin: "center center",
        overflowY: "hidden",
      }
    : { inset: 0 };

  return createPortal(
    <div
      onClick={onClose}
      style={{ ...baseModalStyle, inset: 0 }}
    >
      <style>{`
        @keyframes fadeInModal { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUpModal { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
        @keyframes rotatePulse { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(90deg); } }
      `}</style>

      {/* ── Overlay «Переверните устройство» ── */}
      {isPortraitMobile && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            background: "rgba(8,20,12,0.97)",
            backdropFilter: "blur(16px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            padding: 36,
            animation: "fadeInModal 0.3s ease",
          }}
        >
          {/* Иконка телефона с анимацией поворота */}
          <div style={{animation:"rotatePulse 2.4s ease-in-out infinite", transformOrigin:"center"}}>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <rect x="20" y="8" width="32" height="52" rx="7" stroke="rgba(141,198,110,0.5)" strokeWidth="2"/>
              <rect x="24" y="14" width="24" height="40" rx="4" fill="rgba(90,154,90,0.1)"/>
              <circle cx="36" cy="54" r="2.5" fill="rgba(141,198,110,0.6)"/>
              {/* стрелка поворота */}
              <path d="M54 28 A20 20 0 0 1 54 44" stroke="#8dc66e" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
              <polyline points="50,42 54,46 58,42" stroke="#8dc66e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div style={{
            fontFamily:"'Montserrat',sans-serif",
            fontSize:"1.15rem",
            fontWeight:700,
            color:"#fff",
            textAlign:"center",
            lineHeight:1.35,
            letterSpacing:"-0.2px",
          }}>
            Переверните устройство
          </div>

          <div style={{
            fontSize:"0.82rem",
            color:"rgba(232,240,226,0.5)",
            textAlign:"center",
            maxWidth:230,
            lineHeight:1.65,
          }}>
            Презентация оптимизирована для&nbsp;горизонтального режима
          </div>

          <button
            onClick={onClose}
            style={{
              marginTop:6,
              padding:"11px 32px",
              borderRadius:40,
              border:"1px solid rgba(141,198,110,0.3)",
              background:"rgba(90,154,90,0.1)",
              color:"rgba(141,198,110,0.85)",
              fontFamily:"'Manrope',sans-serif",
              fontSize:"0.83rem",
              fontWeight:600,
              cursor:"pointer",
              letterSpacing:"0.5px",
              transition:"all 0.2s",
            }}
          >
            Закрыть
          </button>
        </div>
      )}

      {/* Шапка модалки */}
      <div
        onClick={e => e.stopPropagation()}
        style={{width:"100%",maxWidth:1200,display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,animation:"slideUpModal 0.3s ease"}}
      >
        <div>
          <div style={{fontSize:"0.68rem",letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.45)",fontWeight:700,marginBottom:4}}>Неделя {week.week}</div>
          <div style={{fontFamily:"'Montserrat', sans-serif",fontSize:"clamp(0.85rem,2vw,1.1rem)",color:"rgba(255,255,255,0.85)",fontWeight:600}}>{week.title}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.4)",fontFamily:"'Manrope', sans-serif"}}>
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
        onMouseEnter={() => setSlideHovered(true)}
        onMouseLeave={() => setSlideHovered(false)}
        style={{width:"100%",maxWidth:1200,borderRadius:20,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.5)",aspectRatio:"16/9",background:"#1a2e1e",animation:"slideUpModal 0.35s ease",flexShrink:0,position:"relative"}}
      >
        {renderSlide(week.slides[cur])}

        {/* Стрелка НАЗАД — поверх слайда */}
        {cur > 0 && (
          <button
            onClick={e=>{e.stopPropagation();setCur(c=>c-1);}}
            className="slide-arrow"
            style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",width:44,height:44,borderRadius:"50%",background:"rgba(0,0,0,0.35)",backdropFilter:"blur(8px)",border:"1.5px solid rgba(255,255,255,0.25)",color:"rgba(255,255,255,0.9)",fontSize:"1.2rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,opacity: slideHovered ? 1 : 0,transition:"background 0.2s, opacity 0.2s"}}

            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.6)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0.35)"}
          >‹</button>
        )}

        {/* Стрелка ВПЕРЁД — поверх слайда */}
        {cur < total - 1 && (
          <button
            onClick={e=>{e.stopPropagation();setCur(c=>c+1);}}
            className="slide-arrow"
            style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",width:44,height:44,borderRadius:"50%",background:"rgba(0,0,0,0.35)",backdropFilter:"blur(8px)",border:"1.5px solid rgba(255,255,255,0.25)",color:"rgba(255,255,255,0.9)",fontSize:"1.2rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,opacity: slideHovered ? 1 : 0,transition:"background 0.2s, opacity 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.6)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0.35)"}
          >›</button>
        )}
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
    </div>,
    document.body
  );
}

/* ══ Кнопка скачивания презентации ══ */
function DownloadButton({ week }) {
  const [loading, setLoading] = useState(null); // "pdf" | "pptx" | null
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState(null);
  const ref = useRef(null);
  const slides = week.downloadSlides || [];
  if (!slides.length) return null;

  // Закрытие меню при клике вне
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handle = async (fmt) => {
    setMenuOpen(false);
    setLoading(fmt);
    setError(null);
    try {
      if (fmt === "pdf") await downloadAsPDF(week);
      else await downloadAsPPTX(week);
    } catch(e) {
      setError("Ошибка при создании файла. Проверьте, что PNG-файлы доступны.");
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div ref={ref} style={{position:"relative",display:"inline-block"}}>
      <button
        onClick={() => !loading && setMenuOpen(o => !o)}
        style={{
          display:"flex",alignItems:"center",gap:9,
          background: loading ? "#f0f0ec" : `linear-gradient(135deg,${week.accent},${week.accentLight ? week.accent+"cc" : week.accent})`,
          color: loading ? "#aaa" : "#fff",
          border:"none",borderRadius:11,padding:"10px 20px",
          fontFamily:"'Manrope', sans-serif",fontSize:"0.83rem",fontWeight:700,
          cursor: loading ? "default" : "pointer",
          boxShadow: loading ? "none" : `0 4px 20px ${week.accent}44`,
          transition:"all 0.22s",
          opacity: loading ? 0.7 : 1,
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
      >
        {loading ? (
          <>
            <svg style={{animation:"spin 1s linear infinite"}} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            Создаю {loading.toUpperCase()}…
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Скачать презентацию
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{opacity:0.7,transition:"transform 0.2s",transform:menuOpen?"rotate(180deg)":"none"}}><polyline points="6 9 12 15 18 9"/></svg>
          </>
        )}
      </button>

      {menuOpen && (
        <div style={{
          position:"absolute",bottom:"calc(100% + 8px)",left:0,
          background:"#fff",borderRadius:14,
          boxShadow:"0 8px 40px rgba(30,60,40,0.18)",
          border:`1px solid ${week.accent}22`,
          overflow:"hidden",minWidth:220,zIndex:100,
          animation:"chatPop 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          <div style={{padding:"10px 14px 8px",borderBottom:`1px solid ${week.accent}12`}}>
            <div style={{fontSize:"0.62rem",letterSpacing:1.5,textTransform:"uppercase",color:week.accent,fontWeight:700}}>
              {slides.length} слайд{slides.length===1?"":"ов"} · Выберите формат
            </div>
          </div>
          {[
            { fmt:"pdf",  icon:"📄", label:"Скачать PDF",  sub:"Портативный · для просмотра" },
            { fmt:"pptx", icon:"📊", label:"Скачать PPTX", sub:"PowerPoint · для редактирования" },
          ].map(({ fmt, icon, label, sub }) => (
            <button key={fmt} onClick={() => handle(fmt)} style={{
              width:"100%",background:"none",border:"none",cursor:"pointer",
              padding:"12px 16px",display:"flex",alignItems:"center",gap:12,
              transition:"background 0.15s",textAlign:"left",
            }}
              onMouseEnter={e=>e.currentTarget.style.background=`${week.accent}0a`}
              onMouseLeave={e=>e.currentTarget.style.background="none"}
            >
              <span style={{fontSize:"1.3rem"}}>{icon}</span>
              <div>
                <div style={{fontSize:"0.85rem",fontWeight:600,color:"#1a3220",fontFamily:"'Manrope', sans-serif"}}>{label}</div>
                <div style={{fontSize:"0.7rem",color:"#7a8a70",marginTop:1}}>{sub}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {error && (
        <div style={{marginTop:8,fontSize:"0.72rem",color:"#c04040",background:"#fff0f0",border:"1px solid #f0c0c0",borderRadius:8,padding:"6px 12px"}}>
          ⚠️ {error}
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ══ Вьюер презентации (встроенный, маленькиsй) ══ */
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
      <div style={{width:"100%",overflow:"hidden"}}>
        <div style={{position:"relative",borderRadius:18,overflow:"hidden",boxShadow:"0 8px 48px rgba(30,60,40,0.16)",aspectRatio:"16/9",background:"#e8ede4",cursor:"pointer",width:"100%",maxWidth:"100%",boxSizing:"border-box"}}
          onClick={() => setModalOpen(true)}
        >
          {renderSlide(slide)}

          {/* Счётчик */}
          <div style={{position:"absolute",bottom:13,right:15,fontSize:"0.67rem",color:"rgba(255,255,255,0.55)",background:"rgba(0,0,0,0.28)",borderRadius:7,padding:"3px 9px",backdropFilter:"blur(4px)"}}>{cur+1} / {total}</div>

          {/* Кнопка на весь экран */}
          <div style={{position:"absolute",top:13,right:13,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(8px)",borderRadius:10,padding:"7px 13px",display:"flex",alignItems:"center",gap:7,color:"rgba(255,255,255,0.85)",fontSize:"0.75rem",fontWeight:600,fontFamily:"'Manrope', sans-serif",border:"1px solid rgba(255,255,255,0.15)",transition:"background 0.2s"}}
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
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:14,gap:8,flexWrap:"nowrap",minWidth:0}}>
          <button onClick={e=>{e.stopPropagation();setCur(c=>Math.max(0,c-1));}} disabled={cur===0}
            style={{background:cur===0?"#f0f0ec":"#fff",border:`1.5px solid ${week.accent}30`,borderRadius:10,padding:"8px 14px",cursor:cur===0?"default":"pointer",color:cur===0?"#ccc":week.accent,fontFamily:"'Manrope', sans-serif",fontSize:"0.82rem",fontWeight:600,transition:"all 0.2s",flexShrink:0,boxShadow:cur===0?"none":"0 2px 10px rgba(0,0,0,0.06)"}}>←</button>
          <div style={{display:"flex",gap:5,flex:1,justifyContent:"center",minWidth:0,overflow:"hidden",flexWrap:"wrap"}}>
            {week.slides.map((_,i)=>(
              <button key={i} onClick={e=>{e.stopPropagation();setCur(i);}}
                style={{width:i===cur?22:8,height:8,borderRadius:6,background:i===cur?week.accent:`${week.accent}35`,border:"none",cursor:"pointer",transition:"all 0.3s ease",flexShrink:0}}/>
            ))}
          </div>
          <button onClick={e=>{e.stopPropagation();setCur(c=>Math.min(total-1,c+1));}} disabled={cur===total-1}
            style={{background:cur===total-1?"#f0f0ec":"#fff",border:`1.5px solid ${week.accent}30`,borderRadius:10,padding:"8px 14px",cursor:cur===total-1?"default":"pointer",color:cur===total-1?"#ccc":week.accent,fontFamily:"'Manrope', sans-serif",fontSize:"0.82rem",fontWeight:600,transition:"all 0.2s",flexShrink:0,boxShadow:cur===total-1?"none":"0 2px 10px rgba(0,0,0,0.06)"}}>→</button>
        </div>

        {/* Подсказка */}
        <div style={{textAlign:"center",marginTop:10,fontSize:"0.7rem",color:"#9aaa90"}}>
          Нажмите на слайд для просмотра на весь экран
        </div>

        {/* Кнопка скачивания */}
        <div style={{marginTop:18,display:"flex",justifyContent:"center"}}>
          <DownloadButton week={week}/>
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
      <div style={{fontFamily:"'Montserrat', sans-serif",fontSize:"1.2rem",color:"#3d6b52",fontWeight:600,marginBottom:8}}>Презентация в разработке</div>
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
const GRADS = [
  "linear-gradient(135deg,#3d6b52,#8ab870)",
  "linear-gradient(135deg,#5a7e3a,#a0c060)",
  "linear-gradient(135deg,#2d5a3a,#6b9e6b)",
  "linear-gradient(135deg,#4a6b5a,#7aab68)",
  "linear-gradient(135deg,#3a5a6b,#6b9e8a)",
  "linear-gradient(135deg,#6b5a3a,#b89a6b)",
];

function MemberAvatar({ member, size = 54, fontSize = "1.1rem" }) {
  const bg = GRADS[member.id % GRADS.length];
  const photoSrc = member.isVictor ? VICTOR_PHOTO : MEMBER_PHOTOS[member.id];
  const [err, setErr] = useState(false);
  return (
    <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,overflow:"hidden"}}>
      {photoSrc && !err
        ? <img src={photoSrc} alt={member.name} onError={()=>setErr(true)}
            style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        : <div style={{width:"100%",height:"100%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Montserrat', sans-serif",fontSize,fontWeight:700,color:"#fff"}}>{member.initials}</div>
      }
    </div>
  );
}

function MemberCard({ member }) {
  return (
    <div className={`mcard${member.isVictor ? " mcard-victor" : ""}`}>
      <MemberAvatar member={member}/>
      <div>
        <div className="mname">{member.name}</div>
        <div className="mrole">{member.role}</div>
        <div style={{width:6,height:6,borderRadius:"50%",background:member.isVictor?"#8dc66e":"rgba(141,198,110,0.35)",marginTop:8,boxShadow:member.isVictor?"0 0 6px rgba(141,198,110,0.5)":"none"}}/>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ГЛАВНЫЙ КОМПОНЕНТ
══════════════════════════════════════════════ */
/* ══ Чат ══ */
function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [conv, setConv] = useState(null);

  const getMember = (chat) =>
    MEMBERS.find(m => chat.isVictor ? m.isVictor : m.id === chat.id)
    || { initials: chat.initials, id: chat.id };

  const lastMsg = (chat) => chat.messages[chat.messages.length - 1].text;

  return createPortal(
  <div className="chat-fab">
      {open && (
        <div className="chat-win">
          {/* Шапка */}
          <div className="chat-hd">
            <div>
              <div className="chat-hd-t">{conv ? conv.name : "Сообщения"}</div>
              <div className="chat-hd-s">{conv ? "Личная переписка" : `${CHAT_DATA.length} диалогов`}</div>
            </div>
            <button className="chat-x" onClick={()=>{setOpen(false);setConv(null);}}>✕</button>
          </div>

          {conv ? (
            <>
              <div className="chat-conv-hd">
                <button className="chat-back" onClick={()=>setConv(null)}>←</button>
                <MemberAvatar member={getMember(conv)} size={30} fontSize="0.7rem"/>
                <div className="chat-conv-name">{conv.name}</div>
              </div>
              <div className="chat-msgs">
                {conv.messages.map((msg, i) => (
                  <div key={i}>
                    <div className="chat-msg">{msg.text}</div>
                    <div className="chat-time">{msg.time}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="chat-list">
              {CHAT_DATA.map((chat, i) => (
                <div key={i} className="chat-row" onClick={()=>setConv(chat)}>
                  <MemberAvatar member={getMember(chat)} size={40} fontSize="0.8rem"/>
                  <div className="chat-row-info">
                    <div className="chat-row-name">{chat.name}</div>
                    <div className="chat-row-prev">{lastMsg(chat)}</div>
                  </div>
                  <div className="chat-row-time">{chat.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button className="chat-btn" onClick={()=>{setOpen(o=>!o);setConv(null);}}>
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
        {!open && <div className="chat-badge">{CHAT_DATA.length}</div>}
      </button>
    </div>,
    document.body
  );
}

export default function SVEZASite() {
  const members = MEMBERS;
  const [activeWeek, setActiveWeek] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [vis, setVis] = useState({});

  useEffect(() => { document.title = "Свеза. Кейс чемпионат"; }, []);

  useEffect(() => {
    const h = () => {
      setScrolled(window.scrollY > 56);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
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

  return (
    <>
      

      {/* ── NAV ── */}
      <nav className={`nav ${scrolled ? "sc" : ""}`}>
        <div className="scroll-prog" style={{width: `${scrollProgress}%`}}/>
        
        <ul className="nlinks">
          <li><a href="#team">Команда</a></li>
          <li><a href="#cases">Кейсы</a></li>
        </ul>
        <div className="ubadge">
          <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAD6AMkDASIAAhEBAxEB/8QAHAAAAwEBAAMBAAAAAAAAAAAAAAcIBgUCAwQB/8QAVRAAAQIFAgMEBQQMCgcIAwAAAQIDAAQFBhEHIRIxQQgTUWEUIjJCcRVSgZEjJDdicnR1gqGxstEWMzU2U5Kis8HDFxglQ1Zz4TREVWOTlJXwVNLT/8QAGwEAAQUBAQAAAAAAAAAAAAAABAACAwUGAQf/xAA5EQABAwICBQsEAgIBBQAAAAABAAIDBBEFIRIxQVFxBhMUIjJhgZHB0fA0obHhM/FCcrIWIyRDgv/aAAwDAQACEQMRAD8AsuCJD1L1MumsXdPqp9fqEhTpeYcZlGpGZWyktpVwhRKCCoqxnfOM4GI+On6s6iSLYbaueZcSBgd+006frUkkn4mIefF1nXcpKdry0tNhty91ZEESf/p21B4OH0mm5xji9DGfjzxHEq2qmoNTa7qYuicaRgZ9FSiXP9ZtKT+mEZ2rr+UtKBkCfL3VcXFcFEt6SM5W6pKyDPIF5wAqPgkc1HyAJhMXp2hWW1LlrRpXpBBwJyeBSg+aWwQo/nFPwifpl56ZmFzEy86++vdbjqypaviTuY8IjdMTqVPV8oqiXKIaI8z88FsK9qdflaeU5M3LOy6FZw1Jr9HQkeHqYJ+kkxlZybm518vzs1MTTpGC486pauZPMknmSfpMfbb1v1y4X+5odJnKgrPCosNEoSfvleyn6SIYNH0FvudQlc2aXTEnml+YK1j6EBQ/tdYjs5yrWw1lZmA53nbz1JYS0zMSrhclZh6XWRwlTThQSPDI6bCNTQdTL7orgVKXNPPI6tza/SEEZzj7Jkj6CDG6V2drmCSU16kE42BS4M/TiMvcmjl/URpbyqSipMoAJXT3O+P0IICz9CTHdF7VL0HEKYaQa4cP0mRZXaElH1olrtpfoalED0uSBW2PNTZyoD4FXwh2UipU+r09qoUudl52UdGUPMOBaVdDuOoOxHSIMWlSFqbWlSFoJSpKhgpI5gjoY7tk3fX7Oqfp1DnVNcZHfMLypl4eC0dT4EYI6EZMPbMRrVjQ8opYzo1HWG/b+1cEeLrjbLS3XVpbbQkqUtRwEgcyT0ELOh62WfN2i5WahMiRnmE4epvFxPKX0DY24wfnbAZ9bhhCamak1+95pxqYeVKUgKy1T21epgHYrPvq5HfYHkBErpWgZK9q8bpoIw5p0idQHru/PcnTfevFvUgrlLbZ+XJsbF4K4JZJ/C5r/NGPOE5cmrt/VwqSutqpzKv91T09yB8FZK/7UYMkAZJwI2Np6ZXtcyUPSFFdYlV8pmcPcNkeI4vWUPNIMQF73LKy4lXVz9FhPBvy/msvPT8/PuByfnpqbWMkKfeU4RnnuonngR6mXXWHUusOuNOJ3StCilQ+BG4hxS/Z3utTYL9bora+qUF1Y+vhH6o+Wp9n+9ZZClyc3R54AZCUvLbWT4YUnH9rrHObduUTsKru0Yz8+6xFFv29KMtJp9z1RCU8m3Xy8jp7i+JPTwhnWj2hakwtDF00hmbZzgzMj9jcSPEoUSlR+BT8IVdz2bdNtFRrdCnZRtPN7g42v/UTlP0ZzHABBGQcwg5zU2OurKN1g4juPsVbto3va11shdErEvMOe9LqPdvJ+LasK+nGPAxoogEbKSobKScpI5g+IjW0TUq/KOAmTuioKQNgiZUJgD4d4FY+iJRPvCvqflOLWmZ4j2PurRgiTWNdNQm2koXOU95Q5rXJp4j8eEgfUI+Gf1i1Gm0LQbhLCVknDEs0jAPQHhyMZ8c+cO59qLPKSkAyDvIe6sCCIrpmo99U6qoqTV0VSYdSriLMzMrdZXvuktqPDg8tgCOhEOz/AFgre/8AwZn+of3R1szTrUtLj9LMDpnRtvU0x91No9YqbbjtMpFRnm2zhxctKrdCDzwSkHEfDFA9j91wt3OwVktpVKrSnoFEOgn6QlP1QMxukbLG4fStqqhsJNr3+wuklLW5cUzxejW9WH+H2u7kXVY+OEx36XpZqFUVAM2tONDiwVTKkMAct/XUCRv0B6xZcET8wN607OTEI7byeFh7qZqD2ermmlJVWavTqc0cEhkKfc8xj1Uj6z+9n2volYtFKXJmSerMwDnjn18aR8G0gIx8QT5wyoIeImhWVPg1HBmGXPfn+l4S7LMuyhiXabaaQMJQhISlI8AByjzggiRWiIIIISSwep+l9AvWVcfLKJGsBJ7qeaTgqONg4B7aeXPcdCN8ylddv1W166/RazLhmaZwfVVxIWk8lpPVJ/eCAQRFv1aoSVKpkzUqjMIl5SWbLrzquSUgZJ23PwG5iPdXb4fvq5zPd0GZCWCmpFsoAWGyc8Sz1UcZxnA5DqSPMGjPasnyjgpmtEgykO7bx9/DhjY9snLTE5Nsykow4/MPLDbTTaeJS1E4AA6mPVHWs+4J61rlk69Tg2qZlVEhDgylaSClST8QSM9OcDhZSMNLgHGw2qkNHtIKfbMuzV7gZanq4oBQQrC2pTySOq/FX9XG5LYji2Tc1Lu63Zet0l0qZdylbascbKx7SFjoR+kEEZBBjtQc0ADJem0cMMMIEHZ/PeiCCCHIpBAIIIyDzEYW7tJrHuRa3pilegTSucxIKDKyfEjBSo+ZSY3UEcIB1qKWCOZujI0Ed6nO4+ztVGlldvV6Vmm87NTyC0oD8JIUFH6Exh6zpFqHTAVrt5ybbHvyjqHc7/NB4v0RYkERmFpVPNydo5M23bwPvdQvM2zcsqnimbcrLKc8OXJB1Iz4ZKY9U5Qa9JyXp05Q6rLSgAPfvSbiG99h6xGN8jHjmLtha9pd5DekVRbUDl5+XQnHiHkq3+hJiN0Nhe6rark7HDC+TTOQJ1blJcEEEQLKIh/dj727q+En/nwgYf3Y+9u6vhJ/58SRdsK2wP6+Px/4lUBBBBBi9ERBBBCSRBBBCSRH4tSUIUtaglKRlSicADxj9ie+0fqUXlzFk0GYIbSeCqPoPtHcGXG3LlxEfg/OENe4NFyg66tjo4jI/wABvKzGvWpSrtqZolIeIoMo57Qx9tugn7Jn5g90dfaPTCtQlS1pQhKlrUQlKUjJJPIAdTH5FCdnTTLuQzeVxSmHThVMlnU+wOj5HifdB5e1zIwIAZHLCxRz4rVXOs6zsA+al6ra0GbmtO3VVV0y1zTYS9LqUo8EoBuGlJHMkHCjvg4x7O6Kq1PnqTU5imVKWclpyWcLbrSxgpI/WCMEHkQQRsYqe5dY7fouoMvbDgDsslXdT88FjglnDslPmAfbPu+ZBA9Ou2m7d5UkVqitoNclW8t8OMTbXPuyeWeqT9HI5EjmAjq7FcVuFU80R6Hm6PIjf+/6SF0nvyesS4BNoDkxTZghM9KpIy4kZwpOeS05yPHcHGciw6TUZGrU2XqVNmm5qUmEBbTrZyFD/wC9OYO0Qa62406tp1tbbiFFK0LSQpKgcEEHcEHpDQ0H1LVaFS+R6w+o0GaXupRJ9DcPvgfNJ9ofnDrnkUmjkdSFwTFeju5iU9U6u4+3481VkEfiVJUkKSQpJGQQdiI/YKW4RBBBCSRBBBCSRCu7UH3Knvx1j9qGjCu7UH3Knvx1j9qGSdkoHE/o5f8AU/hSlBBBAS8zRD+7H3t3V8JP/PhAw++x+4kTN0Nb8SkSih8AXv3iJIu2FbYH9fH4/wDEqg4IIIMXoiIIIISSIIIwesuoUrYtA+w8D9Zm0lMkwSCE/wDmrHPgH6TgeJHCQBcqKedkEZkkNgFwNf8AUz+C8kbfob4+W5pvLjid/RGiPa8nD7o6Dc9My4ckkkkk7knrHvqE3NVCfmJ+dfXMTUw4p151fNayckmNvozp3NX1Wi5MJdZocovE3MJOCtWAQ0g/OIIJPQHxIyG5xkcvP6qomxWpAaOA3D5rXe0A0yFzzabjrjP+xZZ37CyoAiccSdwR/RpI3+cduQMMjX3UxNqyBt6hPp+W5lHruIIPoTZxufv1D2R0HreGe3qnetM02tJmXp8vL+nLb7mmSQGEJCcDiUByQkY26nA2zkSPUZ2cqU+/P1CZcmZuYWXHXXDlS1Hr/wBOnKJHERjRGtWlXOzCoOiwH/uHtH59twz1r0CH12ddTu49Hsu4Zr7Fs3TJl1eyOQSwSenzSfwfmiErK0SrTVBna7LyLrlNkXENTMwMcLal8h4npnHLiGcZEc/6x8Iia4tNwqOjqpaKUSt/sKh+0XpkZpL952/Ljv0JK6lLIAHeJAyXkj5w94dRvzBzPA3GRFQdnzUtVyyYtuuTBXWpVviaeWd5todSce2nbPUjff1sYDtA6Ym3pt26KFL4oz6+KaaSf+yuqVzA6NqJGB0JxsMASPaCNJqtsTo46mLp1NqPaG7v9/NdXs56mCUUzZlwTKiytYRTJhZJ4Cdgyo9By4fDl80CiIgAgEEHkYp/s+6mm5JUW3X5lJrMun7XdVgGbaA/S4nBz4jf50Oik/xKNwLFtK1NKc9h9PZOCCCCCFqkQQQQkkQru1B9yp78dY/ahowru1B9yp78dY/ahknZKBxP6OX/AFP4UpQQQQEvM0Q9eyD/ACrcn/Ilv2nIRUPXsg/yrcn/ACJb9pyHxdsK1wT6+Px/BVEwQQQavRUQQR8Fw1inUCizVYqsymXk5ZHE4s/HAAHUkkADqSBC1LjnBoJOpcvUO76ZZVuO1eonvF+xLyyVALfcPJIz9ZPQAnflEb3TX6pc1cmKzWJjvpt874GEoSOSEjokdB9JySSerqZelRvi5HKpOFbUsjKJKV4spl29vrUrAKj1OByAA5FtUSo3FXJajUlgvTcyvhSN+FI6qUeiQNyYDkfpmwWBxXEn18ojj7I1Ded/sulp3Z9Tva426TTgG204cmplQ9VhrO6j4k8gnqfAAkVXVJ62tK7BRhAZk5NHdy7AI72ZdI5ea1HJJ+JOwjwtSh29pZYThmJltpmXb7+oTqxgvOYAJx5nCUoGeg3JyZg1Svefvq41VCYC2JJnKJKVKgQyg4yTjmpWASfgOQEP/iHerEaGC09znM77fr8lci7bhql01+ZrdXeDk0+R6qchDSB7KEDokfvJySTH36c2fUb1uZikyKVIZBC5uZ4cpl2uqj98eSR1PkCRy7cotSuGsy9HpEsZicmFYQnkAOqlHokDcmLEsC1qTp9Z4kkvtJS0gvz865hAcUBlTiiT6qQBsM7AfEwyNmmblVuF4e+vlMkp6o1ned3uupQLco9Dttq3pCTQKchotqacHF3gVniK8+0VZOfHMSzrXp09Y9aD8khxyhTiz6K4cqLKuZaWfHnwk7kDqQY1Fy67VT/SCzO0XK7dlFFsyqgAZ1O4LhJHEk8ikdMDPMiHpi3NQbLBIbqFHqLWR0IIP1pWlQ+IIiU6MgsNivpm0mLRuhhNnM1fru2fAomkpqZkZxmck33JeZYWHGnW1YUhQ5EGK40ovim6j2o/J1Flg1BDRZqUmpPqOJUCONIJOUKGRjocjwJmjUqzKlY9yOUqd4nZdeVyc1w4TMN7bjwUM4UOh8iCeZa1eqds12WrVIeDU3LnKeIZStJ2KFDqkjY/WMEAxExxYc1nqCtkw2cskGWpw9fmta7WvTp+xq0JiUStyhTiyJR1SuItKxktLPiN8HqB1IMYOTmX5OcYnJR5bMxLuJdZcQfWQtJyFDzBEWNb1WtzVWwXEush2WmUdzOyqlDjYcG+NuRBwpKvgYlvUqyqnY1xKpc+e/YcT3kpNJThL7ecZ8lD3k9MjoQT2RlsxqUuLYcISKiDON2eWz9bvJUzoxqJK3zQ+7mFNsVuUSBNy4OOMcu9QPmk9PdOx6E76IStquVS3KyxV6PNKlptg+qobpUOqVDqk9R/jgxY2mt6U2+Lcbqkjhl9PqTcqVhS5dzwPiDzB6jwOQJYpNLI61oMGxUVbeakPXH3G/jvWngggiZXyIUHayWpOnMglKlALq7YUAfaHcvHB8dwD9EN+E92s/ud078sN/3L0Mk7JVdi/wBFJwUxQQQQEvNkQ9eyD/Ktyf8AIlv2nIRUPXsg/wAq3J/yJb9pyHxdsK1wT6+Px/BVEwQQQavRV4vOtssreecQ202kqWtZwlIG5JJ5CJH1v1Fevat+iSK1ooUksiWRuO/VyLqh9fD4A+JMU9f9Kma5ZFapEmvhmZySdZayrhBUUkAE+BOx8iYiWakZ2VqTlMmZR9qebc7tcspB7wL+bw88wPOTqWX5SVErWtib2Xa+/uXhJy0zOzbMnJsOTEw8sNtNNp4lLUdgAPGK10Y09lLCoC5yoFlVZmW+OcmCRhlGAe6SeXCMZJ6nfkABwOz/AKXqt1hNy3FKhNYeSRLMLAJlGz1Pg4oc/AHHMqEZPtDanmpPP2fb0z9otqLdRmEj+OWDu0k/MBHrH3jtyzxcaAwaRQ1FTx4ZD0uoHWPZG3+/wFm9ddSF3nWPk2lurTQZNZ7rGR6Uv+kUPAb8I8NzucBcSrD01NNSss0t595aW2m0DKlqJwAB4kx64pns8aaGhSjd1V2XKatMIPorDicGVbUOZB5OKH1A45kwwAyOVXBDPi1US48TuHzUtHopp1L2PQ+/m0Nu1ycSDNOjB7obENIPzR1PU78gAFR2hNTvlybcta3pvNJYOJx9pXqzax7gPVCSPgo+QGdF2jNTRLIfsugPgvOJKKlMoUCG0nILA++I9o9AccyeGdyQkZOwEOkeANFqscWr2QR9CpsgNZ9Pfy3r9hg6K6izFj1osTZW9RJxafSm8k9yeXeoA6gcwB6wA6gRtrW0HcndPJh+quqk7jmgl2USvPBKgcm1gHcrHtHmnbA2OUfUZKbps+/T5+XXLTcu4W3ml80KHMf9RseYhlnMsVVmCqw5zJyLXzHsfZWbfNr0TUO0UyrryFNuoD8jOs4UW1EZStJ6pIO46g9NiI9uihVK267NUWrM91NyysKwcpWk+ytJ6pI3H6d8wzNAdT/4NTSLbr0yfkV9f2B5xW0ms/qbUefRJ35Ew4NZ9PJa+6El6VKGq1KIJknyrCVg7ltfik9D0O/LIMrgJBca1eVUMeMU/Pwi0g1j09j4cJq0wvWoWNcqKnK8b0o6A3OyvFgPN5+riTklJ+I5ExUdz0S3NUrFaU26h1iZa76QnUo9dhZGArGx2OyknGcEHHSOJ2WmZKbek5xhyXmWFlt1pxOFIUDggjxhgaI6ju2RVzJ1Ba10GbXmZQAVFheMd6kfVxAcwNskAFkb7ZHUq7CcQbDemqP43b9n637taxlz0So25Xpqi1VnupuVXwqAOUqHMKSeqSMEfHodo6WnV41Oybjaq1PJdaPqTUqV4RMN/NPgRnIPQ+IJBpfWCw5HUK2GpynLZFUZb72QmkkcLyCM92pXVCs5B6HB5ZBk2pyE9TKk5TajJvyk62rhUw6gpWD8OuehGx6Rx7SwqGvopcNnD4zlrB9PmtXLbdZp9w0OUrNLeD0pNI421ciOhBHQgggjoQY6EL3s+UCr27pvLytaQtmYffcmUS6xhTCFYwkjoTgqI5jiwdwYYUFtJIuVvKWR8sLXvFiQLhEJ7tZ/c7p35Yb/ALl6HDCe7Wf3O6d+WG/7l6GydkoTF/opOCmKCCCAl5uiHX2R1KF2VtAUoIMgglOdiQ5scfSfrMJSHT2SP54Vr8np/vBD4+0FZ4N9dHxP4KpWCCCDV6OiPWZdgzAmSy2XgnhDnCOIDwzzxHshda2akS9kUj0SRW09XZtB9HaO/co3HerHgCMAe8fIHHHEAXKhqJ44IzJIbALN9ofU0UeWetKgzBFTfbxOTDah9rNq9wHo4ofSkHPMjE0gADAGBHtmph+bmnZqaecfmHllx11xXEpaiclRPUkwxdDtNV3vU1T9US43QJReHSk8JmXBg90k8wMHKiOmwwTkBkmRywFRNPitTZo4DcPmsrS9nfTE1KYZu+4Jb7QaIXT5dxO0woZ+yqB9wbcI9478gOLea8amotKnmiUZwLr0037YIIk0H3yPnH3R9J5AHs6tX1T9P7YSmWQyqpPNlqnSgACU4GAtSRybTtsOewGM5EiVKdm6lUJioT8wuYm5lwuPOr5rUeZ/6DYRI4iMaI1q3raiPCoOi05651n5t3bgvS4tbri3XVqccWoqWtaiVKJOSSTzJPWHv2ctMw+Ze9a/L5aB46XLrHtEZ+zKBHLqj+t80xmtBdNDd1R+WqyyoUKUXgIVkeluD3R4oHvHx28cOTW3URixqImTp5bXXJtBEo0UgpZQNi6oeA5JHU+QOORtAGk5D4VQsjZ02p7I1d/f7b11K3qTbNIvqTtGbmVCbmAA46P4thasd2hZ6FWfoyM4zGX1+0zF0yJuCiM4rkq3hbaR/wBsbHu/hj3T19k9MS6+47MPOPTDrjzrqitxxxRUpaiclSidySeZikOztqaatLtWjcExmosoxIzC/wDvDaR7Cj1cSAd/eA33BJcJA/quRVPikeJOdTVIsHdnu7uP9KbSOYI8iCIoDs7an8Xo9mXFMkr2RTZp1Y3GwDCievzT19noMnaO0zKjMXtQJclXt1SXbHPkO+SB/b/rfOJn7YiI843Ko/8AIweq+WI+eRVPdoLTL+EMou5qBK8VZYR9sstp9acbAAGB1WkDbqQMb4TExRUegWpwuiTTb1cf/wBuSzZKHVkD0xsdR9+kcx1A4vHGN7RemZkH3ryoEv8AabquOpS6B/ErJ/jUj5pPteB35E4e9ocNJqsMUo46uLptNt7Q9eO/zXz9nbUsUaZbtKvTITTXlYkX3DgSzhOeBR+Yo8j0PkdqUKElQUUgkcjjeIBIBGCMiKT7PWp4qss1adxTZNSaHDJTLqt5lHzFHqtPjzUPMEnsUn+JU2BYrqppj/qfT28tydkEEEELWohN9rV0JsOlM43XVkqz4YZd/fDkhLdrj+ZlG/Kf+U5DJOyVW4x9FJwU1QQQQEvN0Q6eyR/PCtfk9P8AeCEtDp7JH88K1+T0/wB4IfH2grPBvro+J/BVKwQQQavR18VwVAUmhVCqqZW8JOWcfLaBlS+BJVgeZxEO3BWajcFYmaxVZgvzkyvjWrOw8EpHRIGwHQRdj7TT7DjD7aHWnElC0LTlKkkYIIPMEQhaz2dEu1lS6RcaZSmOLJDT0sXHGU9EhXEOP4nBxjOTvEMrXOtZZ7HqKpqgzmRcDWPXNKrS2yJ++rjFOlipiTZAcnZrhyGkE7AdONWCAPInkDFQ3NWLe0tsFJYlm2ZWUR3MjJoVhTzhyQkE7kk5UpW59onMeVMkLW0rsVxQIl5GVTxzD6hl2YcOBk49pSjgAchsBgCJX1KvKo3vcrlVnSW5dGW5OWHssNZyB5qPNR6nyAAZ/EO9Bnm8Fp7a5Xfb9D7n7cq6K7U7lrszWqu/3s3MKycZ4UJ6ISCThI5Af4kmO/pPYc7fdweiIUtimy5SqemU4yhJzhKc++rBx4bk8sHjWbbdUuu4Jei0lkredOVrI9RlvI4nFnokZ+k4A3IiskfwW0j09SlxZakpbmdi9NvqGTge8tWDtyAHRKdmMZpG51Kswyg6W909QeoMyTt8fyvC/bnommFkNCVlWUFCfR6bIo9ULUB9fCOalf4kZka4KvUK/WpqsVWYL85NL4nF4wOWAAOgAAAHgI6F+XXU7yuN6s1RQClDgYZSfVYbBOED68k9SSfKOfSaRUKo1POyTBcakJVU1NLJwlttPUnxJOAOZ+AJCe/SOSbieIOrpNCMdQah6/NQXwx5NOONOodZcW062oKQtCilSFA5BBG4IO+Y8Y+12lzzdEl60phRkH5hcsl4DIDqAlRSfA4VkeOD4GI1UgE5jYql0N1HZvWkGl1RaE12Ub+zpxgTLfLvEj6godCfAiFFr5poq06ia7RZcmgzS/WQgbSbhPsfgH3TyHs/NytaLU56jVaVqtMmFS85KuBxlxPQ+Y6gjIIOxBIiu9Orto2plmupmpdhb3AGKnIrGQlRHMDJPArcpPkRzBidpEg0TrWpppmYtB0aY2kGo7/m3zUfyM3MyE6xOyT65eZl3A4y6g4UhQOQRFbaNagSl/W85LT6WE1eWRwTstgcLqTt3iUnmk8iOhyOWCZ31dsKbsW4jLjvHqVMkrkZhW5Kf6NZxjjT+kYPiBnLardStyuS1apD4ZnJZWUEjKVAjBSodUkbH9GDgwxriw5qsoquXC6gskGW0eo+Zrda5abO2bV1VKlsrXQJteWiAT6Ks/7pRyTj5pPw5jJWzLjrLyHmHVtOtqC23EKKVIUDkKBG4IO4MWTaNet/VKxHQ7LocafR3E/JOYKmXMZx9eFJUPI7EEBYTPZycNYPo10JRTCrI7yW4n0pz7OQQknHvbfCHOivm1G12DOkeJqMXa7PXq/X4TU0fuSZuvT2m1idTibUlTT6sYC1oUUlY+OM+RJHSNdHOtmiU+3KFKUWlMlqUlUcKATknJJKiepJJJPiY6MEtuBmthA17YmtkN3AC/FEJbtcfzMo35T/AMpyHTCW7XH8zKN+U/8AKchkvYKCxj6KTh6qaoIIIDXm6IcnZKfSm+qrLEK43KYVg9MJdQD+2P0wm4bnZP8Aulzv5Ge/vmIfH2grLCDatj4qooIIINXpCI9M/Ny0hJPzs48hiWl21OuuLOEoSkZJPkAI90S3r/qYbonV27RH/wDYks59ldQo/bjif1tpPLxI4vCGPeGhAYjXsootN2vYN5+a1wtZ9Qpm+a6ES5WzRZNREmycguHkXVj5x3x80HHMnOKpcjOVSoy9Op8uuZm5lwNstI5rUeQ8B8TsBudo9CUqUoJSkqUogJSBkknkAPGKl0J03bs2mLuCvpaTWZhrJ4jtJM4yU55cRxlR6chsCSK0GRyxVLTTYrUlzz3k7vmxdjTi1aNpbY785VJpluYLQfqk6eQIHsJ2yUpyQkYySTtk4idtXr9m77uIzADjFKliUyMsrmB1Wrpxq/QMDxJ7Wuupbl41I0ikulNAlXMoIyDNuD/eK+9Huj6TvgJWksw9NTLUtLNLefeWltptAypa1HASB1JJAhz3/wCLdSnxTEGvApab+Nv3Pt+Tmvst2jVG4K1LUelS6n5uZXwoSOQHVSj0SBuT0EUxW7Lp1j6DXBS5PDswuQWucmSMKfdxufJI5AdB4nJPQ0R05Zsmi+lz7TTlem0/bDowruUcw0k+HIkjmfEAR2NZvuVXJ+IOfqiRkei0kq3w/Cui0r5ZB1y0+At+d6i+KR7O9Eptx6MVOjVZgPykzUnkrTnBBCWyFA9CCAQfERN0VF2UfuaTP5Ue/YbiOIXcqfk+0Oq9EjItPokFqNZtTsi43KVPgusq9eUmgnCJhvxHgRnCk9D5EE/HZdyVO0ril65SXAH2spW2ongebPtIUBzB/QQCNxFf6k2ZTb3ttylTxDLyfXlZpKApcu54jxB5EdR4HBEcXLRKjbtcmaNVmO5m5ZXCscwocwpJ6pI3BjkjCw3C5imHPw+YSRdm+R3Hd7Kt0qtfV3TxWxclJjI9YAPSb6RzHgtOfgQeoO8pXxa9UtC4X6NVWiFoPEy6BhD7eTwuJ8jjl0OQeUdLS2+KhYtxCflwt+SewidleLAdRn2h04074J8SORMUlfVtUHVexZebp0yyt1TZepk8B7CuRSrbISSMKTzBHLKYf/IO9HvDMZg0m5TN+4+eRUwWBdtUsu4mqxTD3mPUmJdSiETDfVKsdeoPQ777g2RaVxUm6aExWaNMh6Wd2IOy21DmhY6KHh9IyCDEQVWQnaVUpim1GWclZuWWW3WnBgpI/WOoPIggjnGs0k1AnrDrvfcLkzSZkhM7KhXMf0iBy4x+kbHGxDY36JsUFhGKOon81L2D9j81qyYI9MhNy0/IsT0m8h+WmG0usuJOy0KGUkeRBEe6C1vAb5hEJbtcfzMo35T/AMpyHTCK7Xv8j28OnpL37AiOXsFVuMm1DJw9Qp2ggggNecIhudk/7pc7+Rnv75iFHDc7J/3S538jPf3zEOZ2grHCfrY+KqKCCCDl6SvB9BdYcbC1IK0lIUk4KcjmPOIcue1q3a9ZNGq0g81MBfAyoIJRMDOAps+8Dty33wcHaLmgiN8emqvE8LbXht3WI8daRPZ60tekHmruuaTU1NJGafKOjCmsj+NWnorB2SeW5O+McftCapGouP2hbcyhUgPUqE02c98rO7ST8wdSPaO3IHi0naJ1MVRmF2lQJkoqTyPt2YbVhUsg4IQkjktQ680jzIImoAAYGwiF7g0aLVncRqo6OLoVL/8AR393v5IJAGTsIpfs8aZGiyzV2V+X4am+jMnLrG8s2oe0oHk4odPdBxzJAy/Z20yNSmGbwuCX+0WlBVPlnEkF5YIIeP3g6D3jvyA4qQh0Uf8AkUVgOFWtUzDgPX289yIyOs33Krk/EHP1RroyOs33Krk/EHP1RO7UVpKv+B/A/hRfFRdlH7mkz+VHv2G4l2Ki7KP3NJn8qPfsNwLD2liuTv1vgfRNyF/rTp5L3xQw5KhDNak0kyjpwA4OrSz809D0O/iCwIIKIBFitxPAyeMxyC4KgaclpiTm3pObZWxMMOKbdbWMKQoHBB8wYYeiGpLtk1X0CpLUugTbgL4wVGWVy71IHTlxAcwMjcYLU7QmmZuGUcuihMZrEs19ssoG820kHkBzcA5eI26JiYgQRkHIgMgxuXn9RDPhNUC08DvHzWqr1s03lr4o6K7b4l/lptsLaWlQCZ1rGQgq5ZxgpUduh2ORMbVGrDtYTRkUqeNSUrhEoWFB3PmkjI+J2htdnzVBNEeatS4plKKU4SJKZcO0ssn2FHo2cnB9089j6tLRLoNkzCvOg02MWqI3aJ/yGv5x27lndNaLN29YVGo08vjmpWVSl71uIJUdykHqBnA8hGiggicCwstNGwRsDG6hkiEV2vf5Ht78Ze/YTD1hFdr3+R7e/GXv2EwyXsFV2NfQyeH5CnaCCCA15yiGr2XZ2TkNRZx6em2JVo0h1IW84EJJ75k4yeux+qFY62tl1bTqChxCilaSMFJBwQY8CAeYBjoNjdEUs5ppmy2vZXX/AAjt7/x6l/8Au2/3x0JZ9iZZS/LvNvNLGUrbUFJUPEERAfCn5o+qNhpVfE/Y1xtTbK3V0x5YTPyiT6riOqgOXGnmDtnGM4JicT55haeDlMHSBsjLDffV9laEL7XW+l2Vag9BI+VqiVMyZIBDWB6zuDz4cjA8SnO2Y3VPm5aoSLE9JPoflphtLrTiDlK0qGQR9EYPXuyl3hZpVItcdVpxL8okc3Bj12vzgBj75KYmffRyV/XGU0zzB2rZfrw1KRnnXX3nH33XHnXFFbjjiipS1E5KiTuSTvmGXoXpqu8qoKpVWlJoEovDgOQZtf8ARpPzRtxH6BucpWUNbQ/VZdoLTQ64XHqCtRLa0p4lyiickgDcoJJJA3B3HUERltLNYDDej9Jb0js/a/f3fNSqZlttllDLLaG20JCUIQMJSBsAAOQjyj0U6dlKjIsz0hMNTMq+gLadbVxJWk8iDHvg1elAgjJEZHWb7lVyfiDn6o10fFX6XKVuizlIn0qVKzjKmXQk4PCoY2PQxwi4Uc7DJE5g2ghQdFRdlH7mkz+VHv2G4y8x2cZj5QxL3Y2JInPE5JEupG+2AsA9N9vh4uexLWp1nW2xQ6Z3immyVuOuH13Vq9pRx/8AQABEETHB1ysxgmF1NPUmSVtgARrHou7BBBBC1iInftGaZGVdfvSgS+ZdZ46lLNpJKFEkl8fen3h09rqcUQSACScAczE9646wszUtM2xaMyHGnAW5yotkFK0kboaI5g7gr+rnkRy6OjmqjGujdGInPDffu9UhTuMGKd7Mt6ztfok1b9VccfmqWEFmYWclbKsgJUeqkkEZ6gjqCTMOwHgIpnsz2IqjUlV21NlSJ+oNcEq2oYLUuSDnHisgHyAT4mIIr6WSzHJ/nuljm9W3h/epOaCCJb7RV/v165Hbdpc4oUenq7t3u1EJmHx7ZJ95KfZA5ZCjvtBD3houthiFeyii5x2Z2DeqdVOSiVFKppgEHBBcGxhG9rd9h6kW93TzbmJl7PCoHHqJieO7R8xP1R+pSlPspA+AiB02kLWWVrcfNVA6Hm7X7/0v2CCPHiT84fXEKzt0/wDVHQ2r1C5Zqs2tMyjjM88p96XmXC2ppxRyrhIBBSSSd8EefTLy+gV+u8XG5RWMYx3k2s5+HCg/piqYILMLSbr0CXAKOR5eQRfvUrVHQe85CkTtQemqS8ZVlTqWJZxxxx3hBJSnKBvtsOsKkEEAjkYprtE6kihyTlp0SYxVZlv7bdQd5VpQ5Ag7OKGMeCTnqkxMw2GBA8gaDYLK4vBSwTCOn2a9ufzWn72V7zc7x6yJ1ZKAlczT1E+zvlxv9JWPz/KKBiduzFYc4upt3zUElmVaStEghSfWeUoFKnPJIBUB4knoN6JgmK+jmtbgfO9Dbzvhw2fruU79ovTIyrj9529KksLJXUpZpH8WeZfAHQ+9jkfW5cRCJi/iAQQRkHmIQerehwcU9WbHZQhRJW9S84SSTuWSdk/gHbwxsIjki2tVTjGCOLjPTjiPUeyV2m+o1w2NMcNPcTNU5a+J6RfJ7tR2ypJG6FY6jbxBikdPtVbUu9LUu3NCnVNexkZpQSpR+8VyX9G/iBEgzLD8rMuS00w7LvtK4XGnUFC0HwKTuD8Y9RAIwRmI2SFqqKHGKij6utu4+m75kr/giLbZ1Ive3Uoap1wzRl0YAYmcPt48AFglI/BIjf0ztFXA0AKjb1Mm8cyw6tknbz4+sTCZp1rSw8o6R4692nhf8eypOCJ8/wBZB/8A4Mb/APlD/wDyj5Kh2jKw4jEha8hLrwN35pbwznfYJR0847zzFOceoAO39j7KjozF737a9nscdaqSUvkEtyrQ43nPgkcvicDziYrk1cv6uIU07W1SDCubUggMf2xlfXlxYjCnJUpZJKlHKidyT4mGOn3KsquUzQLQM8T7fsJk6n6vV68A7T5MKpNGVlJl215cfT/5ih0I9wbb78WxhbR5y7L0zMNy8uy4886oIbbbQVKWo8gANyYfGkeh7pfZrV8MIDafXZpZPFxHoXiNsdeAZ8+qTEA55VFHFV4pNfWd+we3BcHQTS525Jxm5K9L8NEZXxMNLBHpixy2/oweZ94jHLMVDH4hKUIShCQlKRgADAA8I/YKYwNFluqCgjootBmvad6Wmvl/otC3FU6QeUmt1FtSZco5sI5KdJ6Eck+fwMSYOUVH2krFm7mocvXKQyt+o0tKwuXQnKn2VYKsdSpJGQOoKgMkiJcG4yIHmvpZrJconTGqs/s26vr439ExbJ0eue7bXbr9PmqdLNPOKSy3NLWkuJScFeUpOBkED4R0n9AL8bb4kP0N459lE05n+02BHW7N2oq6bPM2ZWHcyMysinuqP8S6Tnuz96o8vBRx721Iw9kbXC6sMOwqhrKcPF76jntUyW12frmmqm2m4JySkaekguql3S66sZ3SkYABI948vAw9/wCAlo/8PyH/AKCf3RpIIlbG1qu6TC6alBDG3vvzRGZ1QuZVo2NUa600l19lCUMIVyLi1BCc+IBVkjwBjTRxr2t6Tuu1p6gTylIam28BxIyW1ghSVj4KAOOuMQ517ZIucPMThH2rG3HYohqE5N1Gffn5+YXMTUw4XHnV81qJyTDI0I01F6VByq1cKTQ5JwJWlJwZpzAPd55hIBBUfMAdSF/cVGqNv1uao1VYLM5Kr4HE9D4KSeqSMEHwMd3TO+6vYtZM5I/bEo9gTUmteEPDoc78Kh0Vjy3EBNsHdZecUhijqQaoEgHPj3+OtWUtUlTKflSpeSkpZvGSQ220hI+gJAEI+/O0C1KzipOzqexOpQcKnZwKDa/HgQCFEffEj4EblXanakV2+ZtTcysylJQviYkGz6oxyUs++r47DoB1xUSvmJyarnEOUD3nQpshv2nhu/PBVXplrRQ7oeaptXQijVVxQQ2ha8svk8ghZ5KPzT4jBMNOIAIBGCMgw5dFtX6tS6lJW7cTrlRpsw6lhmYWSp6WKiEpyffRnGx3AOxOOGOsm2ORGGcoNIiOp8/f3TxvuwLYvNjFZkftlKSlucYPA+38FciPJQI8oSF29n64ZJTj1uVCXqzAyUsvEMv/AABPqK+JKfhFMQRK6NrtauqvCqarze3PeMj84qGq5atzUMq+V7fqcmlPNxcuot88bLAKTuRyPUeMcVKkq9lQPwMX/HLqduW9U/5SoVLnfWCvtiUbc3AwD6wO+NoiMG4qkl5Lj/1yeY9f0oVjxUtKfaUkfExb38BLI/4Nt3/4xn/9Y6NNoNCpiOCm0WnSSd9peVQ2N9z7IEc5g71E3kxITnIPL+lFlDtO6K4U/JNv1ObSrk4mXUG+ePbOEjfz6HwhnWl2fa/OqafuSoy9LYOCthgh5/HUZ9hJ8wVRS0EPEIGtWFPycpozeQl32HzxWYsqwbVtBANFpbaJnh4Vzbv2R9Xj655A+AwPKNPBCa1v1ectmdmLZt1rNWQhPfzbiQUS3EAoBKT7S+Eg77DI57gSEhgVrNNT0EOkeq0bB6LZam6jUKxZIelq9LqTicsSLSwFq++UfcT5kfAGFXbfaInjVeC4qHKinuOYDkkpQcZT4kKJDmOuOHyHSEdPzc1Pzr09PTLszNPq43XnVFS1nxJMemBjM4nJY+p5QVUkulGdFo2e6vChVem12lMVSkTjU5Jvpy262cg+IPUEciDuDsYRPaH0valm5u9aCgIb4u9qUqOQJO7qPpOVD6fGFJZF41+zqkJ2iTqm0qUC9Lrypl8DotP6MjBHQxotVtU6vfKGpEM/J1Kb4VqlULKi65gZK1bcQCs8IwOhO+MOdI1zc9aLqsYpaykLZm9fZx3g/n1S9IBGCMiK17PV5zl22e41VFl2oU1wMOvHm8gpyhZ++5g+OM9Yk1ltx55DLLa3XXFBDaEDKlqJwAB1JO2IsTRSylWTZqJOaUF1GbX6TOEckrIACB4hIAGepyeschvpKDk22XpBLezbP0+cVuIIIIKW4RBBBCSSw1+08F3UL5VpbINckEEtAc5hoblr48ynz22yTEofQR8Yv6E3qjohLXHWXK1b08xS5mYJVNMOtktOrJyXARuknfOxBO+xzmCWO+YWZxvB3Tu56AdbaN/epnZadfebYYacedcUENttpKlLUdgABuSfARQmkmh7TCWqze7KHnjhbNMJyhHm90UeXqjbxzyG70r0votjM+kcSajWFghyecb4eEb+q2nJ4Bg4O+T1OMAdnU64hati1WtpUkPss8MsFDILyzwo26jiIJ8gY4yINF3JlBgjKZhnqsyBe2wcd5+3FSNqVL0eUv6tylAaLNOYm1NNIKshJTssAn3eMKx5Yj3aU0V2v6i0SnNZCfSkvuqHutt+ur4ZCcDzIjMbnckqJ5knJPnFA9ky2+FuqXY+g5X9oyuR0GFOK+k8A/NVETBpOVBQQ9MrQLWBNz3DX+k/YUmoWuVFtyrPUmlU5yszUurgfWHu6ZQsHCkcWCSRjfAx0zzx9vaCv0WnbPyZTnyitVNCkMlCsKYa5Ld8jvhPnuPZMScAAABsBE0shBsFo8axh9M7mYD1tp3dyo+j9oujO4FXtyoShJwVSrqHwPP1uAxuLW1Xsa455mQkqx3M48cNsTTSmipWcBIURwlR6AHJ6RHMfiioAqQopUN0kHBB6ERGJnBVEPKKrZbTs4cM/t7K/wCMvd+oNoWm+Jat1lpmZIB9HbQp1wA8iUoBIHmcR3KFOipUSQqKeU1LNvD85IP+MRbqTOmoah3FOHhwupPpTgEZSlZSnn1wkRNI/RGS0mLYk6iia6MAl29Pesdoe2WARS6NVJ5WObnAyg/Tkn9Eei1+0LS56pNStdoblKZdUE+ktzIeQ3nqsFKSB4kZx4RN8EQc65Zj/qCt09LSFt1hb3+6vxpxt1pDrS0uNrSFJUk5CgeRB6iJW7T1EdpupK6oclirS6Hkq8FtpS2pP0BKD+dGx7MN+d61/AiqPfZGwpymLWfaTuVM/EbqHlkckiNX2lbd+WtOnagynMzSHPS0+JbxhwfDhPF+YImd12XCvq1zcTw0yM1jO24jWPK6lilrk26nKOVFpbsil9szKEKIUpoKHGARuCU55RS2oWitu12jNzloNS9Knm2gWQ3nuJlONgodCdvXG/jnpMMVh2bLkNc06ZkH3AqbpC/RFDqWgMtH4cPq/mGIogDcFUuBNgnc+nmaDpDLfl3/ADUpcrlKqVEqj9Lq0m7JzjBw404Nx4EHkQehGQekfFFr6hWPQr3pfolWY4X2wfRptvZ1gnwPUbDKTsfqMK+1ez0xKVwTNw1puoyDLmUSzLBbL42xxkqPCM5ykZyOo5QnQuByTqnk7UMl0Ys2nbu4/pevsz6eBDbd8Vhn11g/JbSx7KTkF4jxO4T5ZPUEPuPFpttppDTSEttoSEpSkYCQOQA6CPKCWtDRZa6io2UcIiZ4953oggghyLRBBBCSRBBBCSRCP7XUzOIt2hSiEK9DdnHFurHLvEo9RJ+IUs/mw8I59xUWl3DSXqVWZNubk3gONteRuORBG4I6Ebw17dJtkJXU7qmndE02JUIxs7D1NuyzW25Wmzjb9OQon0KZbCm9yScEYUk5JOxxnmDG61F0FqEhxz1mvOVGX3KpJ9aQ+j8BWwWPI4P4RhLzktMyU27KTku7LTLKuFxp1BQtB8CDuDAZDmFefywVWHSXN2neNR8fRdG77hqN03DNVuqOcUxMK2SCeFpA9lCc8kgf4nmTHY0msx+97vZpmVtyLI76edSPZaB9kHopR2H0nfEZJtC3HEttIU44tQShCRkqJ2AA6kxY2i9losuzWpV9CflObw/PLG/rkbIz4JG3xyesOjbpuzROFUTq+p0pMwMz393il3qro3aNBsqq1+lOVNmYlGw420qYC2zuBg8SScb555ifIs3W1lb+lFxoRjIk1LOT0SQo/oBiMo7M0A5KblBTRQTtEbQARs4lWLo7VkO6NUSoOElErTy2vlkBniR8OSP3xHanFvKLzmONwlasDqdzDJtjVRVE0snLJFIU+t9mZabmw+EhsPcXNPCc4Kj1haAYGBHHuBAUWKVrKmKFrTctGfHL2Tk0J0vt697anavWZmopcZnlyqW5d1KEYDbawo5STnKyOeOW0cjXfThuyalLz9JDiqJOngbC1lSmHQMlBJ5ggEg89lA8hlrdlFgtabTbpUCH6q64AOmG2kY/s5+mGNd9Ap90W5OUOpoKpeab4eJPtNq5pWn75JwR8PCJRGHM71dQ4RDU4c3RaA8i9+/9qHJOZmJObZnJR5bEyw4lxl1B9ZC0nII+Bjf3nrHeVyyKqeX5emybrJafalEbvAjCuJSskA77JxscHMYu5KPPW9Xp2iVJARNybpbcxyV1Chn3VAhQ8iI56QVKShIKlKICQBkknkBA9yMllWzzwB0bXEX1jgiHH2TX51N9VOXZCjJuU4rmNvVC0uJ7sk+PrOY+nwj0abaH1uvBufuUvUWnHcMlOJp0fgn+LHPdQzt7O4MUXalt0S16WmnUOQalGBuop3W4fnLUd1HzMSxxm91e4NhNRzrah/VA8yuvBBBBS2iIIIISSIIIISSIIIISSIIIISSIIIISSIzd7WPbN4sJRXKah51sYamGyUPN+QUN8eRyPKNJBHCAdaZJGyRpa8XHel/ZWkFm2rVEVSUYm52cbOWXZ10Od0fFIAAz5kEjoYYEEEINA1JsMEUDdGNoA7lxL+p7tVsau02Xb71+Zpz7TSM44lltQSPrxEObjYggjYgjBEX9Ey6rU2nf6aZZr0CV7uYW8t9Pcpw6rgzlQx6xzvkxDONRWb5SUwcGS37vNJuCHb8gUL/wWm/+1R+6PppNvUByqyjblDpi0KfQFJVKIIIKhsdoHss2KS+1MHs309yR0mpy3WlNrm3HZnCuqVLISfgUhJ+mGPHi02200hppCW20JCUpSMBIHIAdBHlBzRYWXo1NEIYWRjYAFidR9Mbcvl5mbqPpMpPMp4BMyqkpWpGc8KgoEEbnG2RnnzgsPS+0rOcTMyMmubnxynJwhxxP4IwEo+IAPiTG2gjmgL3sm9Dg53ntAaW9EEEEORKIIIISSIIIISSIIIISS//Z" alt="ВШТЭ" style={{width:"30px",height:"30px",objectFit:"contain",borderRadius:"6px",background:"#fff",padding:"2px"}}/>
        </div>
      </nav>

      {/* ── HERO — Split Screen ── */}
      <section className="hero">

        {/* ─── Левая часть: белая, с бумажной текстурой ─── */}
        <div className="hleft">
          <div className="hl-noise" aria-hidden="true"/>
          <div className="hl-decoline" aria-hidden="true"/>
          <div className="hl-content">
            <div className="stud-tag">
              <div style={{width:32,height:32,background:"linear-gradient(135deg,#1a3220,#3d6b52)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
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
               Кейс-чемпионат<br/>
              <em>СВЕЗА</em> 
            </h1>
            <p className="hsub">
              Четыре недели мы анализируем реальные управленческие задачи компании{" "}
              <strong>СВЕЗА</strong> — крупнейшего производителя берёзовой фанеры в мире.
              Каждую неделю — новый кейс, новая презентация, новые выводы.
            </p>
            <div className="hbtns">
              <a className="hbtn hbtn-primary" href="#cases">Смотреть кейсы →</a>
              <a className="hbtn hbtn-ghost" href="#team">Команда · Непризнанные гении</a>
            </div>
          </div>
        </div>

        {/* ─── Правая часть: тёмно-зелёная, парящие логотипы ─── */} 
        <div className="hright">
  <div className="hr-rings" aria-hidden="true">
    <WoodRings style={{width:"100%",height:"100%",color:"rgba(255,255,255,0.04)"}}/>
  </div>
  <div className="glow-blob"/>
    <div className="glow-blob"/>
    <div className="hr-spinner" aria-hidden="true">
  <svg viewBox="0 0 400 400" width="100%" height="100%">
    {[40,70,100,130,160,190,220].map((r,i) => (
      <polygon key={i}
        points={Array.from({length:6},(_,k)=>{
          const a = (k*60 - 90) * Math.PI/180;
          return `${200+r*Math.cos(a)},${200+r*Math.sin(a)}`;
        }).join(' ')}
        fill="none"
        stroke="rgba(141,198,110,0.07)"
        strokeWidth="1.2"
      />
    ))}
    {[55,110,165].map((r,i) => (
      <polygon key={`d${i}`}
        points={Array.from({length:3},(_,k)=>{
          const a = (k*120 - 90) * Math.PI/180;
          return `${200+r*Math.cos(a)},${200+r*Math.sin(a)}`;
        }).join(' ')}
        fill="none"
        stroke="rgba(90,154,90,0.05)"
        strokeWidth="0.8"
      />
    ))}
  </svg>
</div>
          <div className="company-logo logo-vshte-wrap">
            <img
              src="/sveza/vshte.png"
              alt="ВШТЭ"
              className="logo-vshte"
            />
            <span className="logo-vshte-text">ВЫСШАЯ ШКОЛА<br/>ТЕХНОЛОГИЙ И ЭНЕРГЕТИКИ</span>
          </div>

  <div className="logo-sveza">
    <img src="/sveza/sveza-short.png" alt="СВЕЗА" className="logo-sveza-img"/>
    <span className="logo-sveza-label">СВЕЗА</span>
  </div>
</div>
      </section>

        <div className="sec-divider" />

      {/* ══ КОМАНДА ══ */}
      <section className="sec" id="team">
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
        <div className="tgrid">
  {members.filter(m => !m.isVictor).map((m, i) => (
    <div key={m.id} id={`m${m.id}`} data-obs className={`fi d${(i % 5) + 1} ${vis[`m${m.id}`] ? "v" : ""}`}>
      <MemberCard member={m}/>
    </div>
  ))}
</div>

<div className="curator-divider">
  <span>Куратор команды</span>
</div>

<div className="tgrid-curator">
  {members.filter(m => m.isVictor).map((m) => (
    <div key={m.id} id={`m${m.id}`} data-obs className={`fi d1 ${vis[`m${m.id}`] ? "v" : ""}`}>
      <MemberCard member={m}/>
    </div>
  ))}
</div>
      </section>
    <div className="sec-divider sec-divider--mid" />
      {/* ══ КЕЙСЫ ══ */}
      <section className="sec" id="cases">

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
              <button className="abtn" data-num={String(wi + 1).padStart(2, '0')} onClick={() => setActiveWeek(activeWeek === wi ? null : wi)}>
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

          </div>
        </div>
      </footer>
      <ChatBubble/>
    </>
  );
}