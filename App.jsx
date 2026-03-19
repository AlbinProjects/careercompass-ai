// CareerCompass AI v3 — powered by real Excel data
// Import your data file: import { CAREER_DATA, PATHWAY_DATA, ABROAD_DATA } from './careerData';
// For this demo the data arrays are embedded below from your uploaded Excel files.
// In production: move CAREER_DATA, PATHWAY_DATA, ABROAD_DATA to careerData.js and import them.

import { useState, useMemo } from "react";
import { CAREER_DATA, PATHWAY_DATA, ABROAD_DATA } from "./careerData";

// ─── theme ───────────────────────────────────────────────────────────────────
const C = {
  bg:"#0d0d1a", card:"#161628", cardBorder:"#2a2a45",
  accent:"#e94560", teal:"#0f9b8e", gold:"#f5a623",
  lavender:"#8b5cf6", mint:"#10b981", sky:"#3b82f6",
  pink:"#ec4899", orange:"#f97316",
  textPrimary:"#f0f0ff", textSecondary:"#9999bb", textMuted:"#5555aa",
};

// Category → color + icon map
const CAT_META = {
  "IT & Computer":      { color: C.sky,      icon: "⟨⟩" },
  "Healthcare":         { color: C.mint,     icon: "⊕"  },
  "Engineering":        { color: C.teal,     icon: "⚙"  },
  "Business & Finance": { color: C.gold,     icon: "◈"  },
  "Law & Government":   { color: C.accent,   icon: "⊖"  },
  "Media & Creative":   { color: C.lavender, icon: "⌘"  },
  "Education":          { color: C.orange,   icon: "⊗"  },
  "Defense":            { color: "#ef4444",  icon: "⊘"  },
  "Design":             { color: "#a855f7",  icon: "✦"  },
  "Aviation":           { color: C.sky,      icon: "✈"  },
  "Biotech":            { color: C.teal,     icon: "⊛"  },
  "Science":            { color: C.mint,     icon: "⊛"  },
  "Space Science":      { color: "#818cf8",  icon: "★"  },
  "Hospitality":        { color: C.orange,   icon: "⌂"  },
  "Fashion":            { color: C.pink,     icon: "✦"  },
  "Sports / Fitness":   { color: C.accent,   icon: "◉"  },
  "Marine":             { color: C.sky,      icon: "≋"  },
  "Forensics":          { color: "#94a3b8",  icon: "⊕"  },
  "Research":           { color: C.lavender, icon: "⊛"  },
};

const CATEGORIES = [...new Set(CAREER_DATA.map(c => c.Category))].sort();

// Score field → skill id mapping (from Excel 0-1 scale → multiply by 100)
const SKILL_MAP = {
  analytical: "analytical_required",
  numeric:    "numerical_required",
  verbal:     "communication_required",
  creative:   "creativity_required",
  social:     "social_required",
};

const ASSESSMENT_MODULES = [
  { id:"analytical", title:"Analytical Reasoning",  subtitle:"Logic & Pattern Recognition",  color:C.sky,
    questions:[
      {q:"If A > B and B > C, which is true?", opts:["A > C","C > A","A = C","Cannot determine"], ans:0},
      {q:"Complete: 2, 6, 12, 20, ?",          opts:["28","30","32","36"],                     ans:1},
      {q:"Apples: 3 for ₹10. How many for ₹50?",opts:["12","15","18","20"],                    ans:1},
      {q:"All cats are animals; some animals are pets →", opts:["All cats are pets","Some cats may be pets","No cats are pets","Cats ≠ animals"], ans:1},
      {q:"Next: △ ◇ △△ ◇◇ △△△ ?",             opts:["◇◇◇","△△△△","◇△","△◇◇"],              ans:0},
    ]},
  { id:"numeric", title:"Numerical Ability", subtitle:"Math & Data Interpretation", color:C.teal,
    questions:[
      {q:"15% of 240?",                        opts:["32","36","38","40"],  ans:1},
      {q:"300 km in 4 hrs → km/h?",            opts:["65","70","75","80"], ans:2},
      {q:"x² = 144, x = ?",                   opts:["10","11","12","14"], ans:2},
      {q:"Mode of 4,7,9,7,5,7?",              opts:["5","6.5","7","9"],   ans:2},
      {q:"(3×4)+(6÷2)−5 = ?",                opts:["10","12","14","16"], ans:0},
    ]},
  { id:"verbal", title:"Verbal & Communication", subtitle:"Language & Expression", color:C.lavender,
    questions:[
      {q:"Opposite of 'Benevolent'?",          opts:["Kind","Malevolent","Generous","Caring"],               ans:1},
      {q:"Grammatically correct sentence?",    opts:["Him and me went.","He and I went.","He and me went.","Him and I went."], ans:1},
      {q:"'Loquacious' means?",                opts:["Silent","Talkative","Wise","Thoughtful"],              ans:1},
      {q:"Best definition of 'empathy'?",      opts:["Sympathy","Understanding another's feelings","Detachment","Self-awareness"], ans:1},
      {q:"'The team __ working hard.'",        opts:["are","is","were","has"],                               ans:1},
    ]},
  { id:"creative", title:"Creative Thinking", subtitle:"Innovation & Problem Solving", color:C.accent,
    questions:[
      {q:"Uses for a brick? (closest)",        opts:["2-3","4-6","7-10","10+"],                              ans:3},
      {q:"When facing a problem, you first:", opts:["Follow steps","Ask others","Create new solutions","Avoid it"], ans:2},
      {q:"You prefer projects that:",         opts:["Have clear guidelines","Let you improvise","Follow templates","Have strict rules"], ans:1},
      {q:"Ideal work environment:",           opts:["Quiet & structured","Dynamic & flexible","Remote & solo","Team & collaborative"], ans:1},
      {q:"When reading, you prefer:",         opts:["Textbooks","Fiction","News","Visual infographics"],      ans:3},
    ]},
  { id:"social", title:"Social & Leadership", subtitle:"Teamwork & Interpersonal Skills", color:C.mint,
    questions:[
      {q:"In a group project, you usually:",  opts:["Lead & delegate","Support others","Work alone","Coordinate & mediate"], ans:0},
      {q:"How do you handle conflict?",       opts:["Avoid it","Address directly","Seek compromise","Ask someone else"], ans:2},
      {q:"You feel most energized when:",     opts:["Alone","With close friends","In large groups","On stage"], ans:2},
      {q:"Others describe you as:",           opts:["Reserved","Outgoing","Thoughtful","Unpredictable"],      ans:1},
      {q:"Explaining something difficult?",   opts:["Use analogies","Use data","Show visuals","All of these"], ans:3},
    ]},
];

const HOBBY_OPTIONS = ["Coding","Gaming","Reading","Writing","Music","Drawing/Art","Sports","Cooking","Photography","Travel","Science Experiments","Volunteering","Debating","Robotics","Fashion","Business/Trading"];
const SUBJECT_OPTIONS = ["Mathematics","Physics","Chemistry","Biology","Computer Science","Literature","History","Geography","Economics","Psychology","Fine Arts","Physical Education","Philosophy","Sociology"];

const SESSIONS = [
  {id:"home",      label:"Home"},
  {id:"assessment",label:"Career Assessment"},
  {id:"results",   label:"My Results"},
  {id:"explore",   label:"Explore Careers"},
  {id:"coursetest",label:"Course Finder"},
  {id:"pathway",   label:"Career Pathway"},
  {id:"govtjobs",  label:"Govt & Exams"},
  {id:"abroad",    label:"Study Abroad"},
  {id:"resume",    label:"Resume Builder"},
  {id:"jobs",      label:"Job Market"},
  {id:"mentor",    label:"AI Mentor 🔒"},
];

// ─── small helpers ────────────────────────────────────────────────────────────
const st = {
  card: { background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:"16px", padding:"18px", marginBottom:"12px" },
  btn:  (col=C.accent)=>({ background:col, color:"#fff", border:"none", borderRadius:"10px", padding:"11px 20px", fontSize:"13px", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }),
  btnOut: { background:"transparent", color:C.textSecondary, border:`1px solid ${C.cardBorder}`, borderRadius:"10px", padding:"9px 16px", fontSize:"12px", cursor:"pointer", fontFamily:"inherit" },
  tag: (on,col=C.accent)=>({ padding:"6px 13px", borderRadius:"20px", fontSize:"12px", cursor:"pointer", border:`1px solid ${on?col:C.cardBorder}`, background:on?`${col}22`:"transparent", color:on?col:C.textSecondary, fontWeight:on?600:400, fontFamily:"inherit" }),
  input: { background:C.bg, border:`1px solid ${C.cardBorder}`, borderRadius:"10px", padding:"10px 13px", color:C.textPrimary, fontSize:"13px", width:"100%", boxSizing:"border-box", fontFamily:"inherit", outline:"none" },
  label: { fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"6px" },
};
const PBar = ({pct})=>(
  <div style={{height:"4px",background:C.cardBorder,borderRadius:"2px",overflow:"hidden",marginBottom:"20px"}}>
    <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${C.accent},${C.lavender})`,transition:"width .5s ease",borderRadius:"2px"}}/>
  </div>
);
const Badge = ({text,col})=>(
  <span style={{fontSize:"10px",padding:"3px 9px",borderRadius:"20px",background:`${col}20`,color:col,fontWeight:600}}>{text}</span>
);
const splitSemi = v => v ? v.split(";").map(s=>s.trim()).filter(Boolean) : [];
const splitPipe = v => v ? v.split("|").map(s=>s.trim()).filter(Boolean) : [];

// ─── main app ─────────────────────────────────────────────────────────────────
export default function CareerCompassApp() {
  const [session, setSession]       = useState("home");
  const [step,    setStep]          = useState(0);
  const [modIdx,  setModIdx]        = useState(0);
  const [qIdx,    setQIdx]          = useState(0);
  const [answers, setAnswers]       = useState({});
  const [scores,  setScores]        = useState({});
  const [hobbies, setHobbies]       = useState([]);
  const [subjects,setSubjects]      = useState([]);
  const [grades,  setGrades]        = useState({math:75,science:75,lang:75,social:75,cs:75});
  const [topCareers,setTopCareers]  = useState([]);

  // explore
  const [expCat,  setExpCat]        = useState("all");
  const [expSearch,setExpSearch]    = useState("");

  // course finder
  const [courseField, setCourseField] = useState("all");
  const [courseLevel, setCourseLevel] = useState("all");

  // pathway
  const [pathSearch,  setPathSearch]  = useState("");
  const [pathCareer,  setPathCareer]  = useState(null);

  // abroad
  const [abroadField, setAbroadField] = useState("all");
  const [abroadLevel, setAbroadLevel] = useState("all");

  // govt exams filter
  const [govtSearch, setGovtSearch] = useState("");

  // resume
  const [resume,setResume] = useState({name:"",email:"",phone:"",dob:"",address:"",edu:"",skills:"",experience:"",achievements:"",languages:"",jd:""});
  const [resumeSaved,setResumeSaved] = useState(false);

  // job market
  const [jobCat, setJobCat] = useState("all");
  const [jobSort,setJobSort] = useState("demand");

  const progressPct = step===4 ? Math.round(((modIdx*5+qIdx)/25)*100) : step>=5 ? 100 : Math.round((step/5)*100);

  // ── assessment ──
  const handleAnswer = (optIdx) => {
    const mod = ASSESSMENT_MODULES[modIdx];
    const key = `${mod.id}_${qIdx}`;
    const correct = optIdx === mod.questions[qIdx].ans;
    const newAns = {...answers,[key]:{selected:optIdx,correct}};
    setAnswers(newAns);
    setTimeout(()=>{
      if(qIdx < mod.questions.length-1){ setQIdx(q=>q+1); return; }
      const modScore = Object.entries(newAns).filter(([k])=>k.startsWith(mod.id)).filter(([,v])=>v.correct).length;
      const newScores = {...scores,[mod.id]:((modScore/mod.questions.length)*100).toFixed(0)};
      setScores(newScores);
      if(modIdx < ASSESSMENT_MODULES.length-1){ setModIdx(m=>m+1); setQIdx(0); }
      else { computeResults(newScores); setStep(5); setSession("results"); }
    },400);
  };

  const computeResults = (sc) => {
    const fs = {};
    ASSESSMENT_MODULES.forEach(m=>{ fs[m.id] = sc[m.id] ? +sc[m.id]/100 : Math.random()*0.3+0.5; });
    // Score each career from CAREER_DATA using skill weights
    const scored = CAREER_DATA.map(career => {
      const diff =
        Math.abs(fs.analytical - (career.analytical_required||0.5)) +
        Math.abs(fs.numeric    - (career.numerical_required||0.5))  +
        Math.abs(fs.verbal     - (career.communication_required||0.5)) +
        Math.abs(fs.creative   - (career.creativity_required||0.5)) +
        Math.abs(fs.social     - (career.social_required||0.5));
      // hobby bonus
      const hobbyBonus = hobbies.filter(h=>{
        const cat = career.Category;
        if(cat==="IT & Computer") return ["Coding","Robotics","Gaming"].includes(h);
        if(cat==="Media & Creative") return ["Drawing/Art","Music","Photography","Writing"].includes(h);
        if(cat==="Business & Finance") return ["Business/Trading","Debating"].includes(h);
        if(cat==="Sports / Fitness") return ["Sports"].includes(h);
        if(cat==="Fashion") return ["Fashion","Drawing/Art"].includes(h);
        return false;
      }).length * 0.05;
      const match = Math.min(99, Math.round((1 - diff/5)*100 + hobbyBonus*100));
      return {...career, match};
    }).sort((a,b)=>b.match-a.match);
    setTopCareers(scored);
    saveCSV(fs, scored[0]?.Career_name);
  };

  const saveCSV = (fs, topCareer) => {
    const ts = new Date().toISOString();
    const row = [ts,hobbies.join("|"),subjects.join("|"),
      grades.math,grades.science,grades.lang,grades.social,grades.cs,
      Math.round((fs.analytical||0)*100),Math.round((fs.numeric||0)*100),
      Math.round((fs.verbal||0)*100),Math.round((fs.creative||0)*100),
      Math.round((fs.social||0)*100),topCareer||""].join(",");
    const hdr = "timestamp,hobbies,subjects,grade_math,grade_science,grade_lang,grade_social,grade_cs,score_analytical,score_numeric,score_verbal,score_creative,score_social,top_career_match";
    const existing = localStorage.getItem("cc_data")||hdr;
    localStorage.setItem("cc_data", existing+"\n"+row);
  };

  const downloadCSV = () => {
    const data = localStorage.getItem("cc_data")||"No data yet";
    const blob = new Blob([data],{type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="careercompass_students.csv"; a.click();
  };

  const downloadResume = () => {
    const txt = `CAREER COMPASS — STUDENT RESUME\n${"=".repeat(50)}\nNAME: ${resume.name}\nEMAIL: ${resume.email}  |  PHONE: ${resume.phone}\nDOB: ${resume.dob}  |  ADDRESS: ${resume.address}\n\nEDUCATION\n${"-".repeat(30)}\n${resume.edu}\n\nSKILLS\n${"-".repeat(30)}\n${resume.skills}\n\nEXPERIENCE / INTERNSHIPS\n${"-".repeat(30)}\n${resume.experience||"Fresher"}\n\nACHIEVEMENTS & EXTRACURRICULARS\n${"-".repeat(30)}\n${resume.achievements}\n\nLANGUAGES\n${"-".repeat(30)}\n${resume.languages}\n\n${resume.jd?`TARGET JOB DESCRIPTION\n${"-".repeat(30)}\n${resume.jd}`:""}\n`;
    const blob = new Blob([txt],{type:"text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`resume_${resume.name||"student"}.txt`; a.click();
    setResumeSaved(true);
    const existing = JSON.parse(localStorage.getItem("cc_resumes")||"[]");
    existing.push({...resume,timestamp:new Date().toISOString()});
    localStorage.setItem("cc_resumes",JSON.stringify(existing));
  };

  // ── derived data ──
  const abroadFields  = useMemo(()=>["all",...new Set(ABROAD_DATA.map(a=>a.field))].sort(),[]);
  const abroadLevels  = useMemo(()=>["all",...new Set(ABROAD_DATA.map(a=>a.program_level))].sort(),[]);
  const filteredAbroad = useMemo(()=>ABROAD_DATA.filter(a=>(abroadField==="all"||a.field===abroadField)&&(abroadLevel==="all"||a.program_level===abroadLevel)),[abroadField,abroadLevel]);

  const filteredCareers = useMemo(()=>{
    let d = CAREER_DATA;
    if(expCat!=="all") d=d.filter(c=>c.Category===expCat);
    if(expSearch) d=d.filter(c=>c.Career_name.toLowerCase().includes(expSearch.toLowerCase()));
    return d;
  },[expCat,expSearch]);

  const filteredCourses = useMemo(()=>{
    let d = ABROAD_DATA;
    if(courseField!=="all") d=d.filter(c=>c.field===courseField);
    if(courseLevel!=="all") d=d.filter(c=>c.program_level===courseLevel);
    return d;
  },[courseField,courseLevel]);

  const pathResults = useMemo(()=>{
    if(!pathSearch||pathSearch.length<2) return [];
    return PATHWAY_DATA.filter(p=>p.Career_name.toLowerCase().includes(pathSearch.toLowerCase())).slice(0,8);
  },[pathSearch]);

  const jobData = useMemo(()=>{
    let d = CAREER_DATA.filter(c=>c.demand_score);
    if(jobCat!=="all") d=d.filter(c=>c.Category===jobCat);
    if(jobSort==="demand") d=[...d].sort((a,b)=>b.demand_score-a.demand_score);
    else d=[...d].sort((a,b)=>(b.salary_range_india||"").localeCompare(a.salary_range_india||""));
    return d.slice(0,30);
  },[jobCat,jobSort]);

  // ── GOVT exams from career data ──
  const govtExamCareers = useMemo(()=>{
    let d = CAREER_DATA.filter(c=>c.government_jobs && c.government_jobs!=="");
    if(govtSearch) d=d.filter(c=>c.Career_name.toLowerCase().includes(govtSearch.toLowerCase())||c.government_jobs.toLowerCase().includes(govtSearch.toLowerCase()));
    return d.slice(0,40);
  },[govtSearch]);

  // ══════════════════════════════════════════════════════════
  // RENDERS
  // ══════════════════════════════════════════════════════════

  const renderHome = ()=>(
    <div>
      <div style={{textAlign:"center",padding:"28px 0 20px"}}>
        <div style={{fontSize:"10px",letterSpacing:"3px",color:C.accent,textTransform:"uppercase",marginBottom:"10px"}}>Your Future Starts Here</div>
        <h1 style={{fontSize:"32px",fontWeight:700,margin:"0 0 10px",lineHeight:1.2,background:`linear-gradient(135deg,${C.textPrimary},${C.lavender})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>CareerCompass AI</h1>
        <p style={{color:C.textSecondary,fontSize:"14px",maxWidth:"460px",margin:"0 auto 10px",lineHeight:1.6}}>Discover your ideal career — <strong style={{color:C.textPrimary}}>214 career roles</strong> · <strong style={{color:C.textPrimary}}>354 study abroad programs</strong> · full pathways, govt exams, resume builder and more.</p>
        <div style={{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap",marginBottom:"24px"}}>
          <Badge text="214 Career Roles" col={C.sky}/>
          <Badge text="19 Categories" col={C.teal}/>
          <Badge text="354 Abroad Programs" col={C.lavender}/>
          <Badge text="ML Data Collection" col={C.mint}/>
        </div>
        <button style={st.btn()} onClick={()=>{setSession("assessment");setStep(0);}}>Start Career Assessment →</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:"10px"}}>
        {[
          ["◈","Skill Assessment","5 modules · matched to 214 real careers",C.sky,"assessment"],
          ["⬢","Explore Careers","Browse all 214 roles across 19 categories",C.teal,"explore"],
          ["⌘","Course Finder","354 global study abroad programs",C.lavender,"coursetest"],
          ["◎","Career Pathway","Full journey from 12th to senior level",C.gold,"pathway"],
          ["⊛","Govt & Exams","All entrance exams & government jobs",C.accent,"govtjobs"],
          ["✈","Study Abroad","Courses by field, level & salary",C.pink,"abroad"],
          ["⊗","Resume Builder","Build, download & save data for ML",C.mint,"resume"],
          ["◈","AI Mentor","Coming soon — Claude AI powered",C.textMuted,"mentor"],
        ].map(([icon,title,desc,col,sid])=>(
          <div key={title} style={{...st.card,borderLeft:`3px solid ${col}`,padding:"13px",cursor:"pointer",marginBottom:0}} onClick={()=>setSession(sid)}>
            <div style={{fontSize:"18px",marginBottom:"5px"}}>{icon}</div>
            <div style={{fontWeight:600,fontSize:"13px",marginBottom:"3px"}}>{title}</div>
            <div style={{color:C.textSecondary,fontSize:"11px",lineHeight:1.5}}>{desc}</div>
          </div>
        ))}
      </div>
      <div style={{textAlign:"right",marginTop:"12px"}}>
        <button style={{...st.btnOut,fontSize:"11px"}} onClick={downloadCSV}>⬇ Export Student Data CSV</button>
      </div>
    </div>
  );

  const renderAssessment = ()=>{
    if(step===0) return(
      <div>
        <div style={{...st.label,color:C.accent}}>Step 1 of 5</div>
        <h2 style={{fontSize:"21px",fontWeight:700,margin:"0 0 6px"}}>Your Hobbies</h2>
        <p style={{color:C.textSecondary,fontSize:"13px",marginBottom:"18px"}}>Select all you genuinely enjoy.</p>
        <PBar pct={progressPct}/>
        <div style={{display:"flex",flexWrap:"wrap",gap:"7px",marginBottom:"18px"}}>
          {HOBBY_OPTIONS.map(h=><button key={h} style={st.tag(hobbies.includes(h))} onClick={()=>setHobbies(p=>p.includes(h)?p.filter(x=>x!==h):[...p,h])}>{h}</button>)}
        </div>
        <button style={st.btn()} onClick={()=>setStep(1)}>Continue →</button>
      </div>
    );
    if(step===1) return(
      <div>
        <div style={{...st.label,color:C.teal}}>Step 2 of 5</div>
        <h2 style={{fontSize:"21px",fontWeight:700,margin:"0 0 6px"}}>Favourite Subjects</h2>
        <p style={{color:C.textSecondary,fontSize:"13px",marginBottom:"18px"}}>Which subjects excite you most?</p>
        <PBar pct={progressPct}/>
        <div style={{display:"flex",flexWrap:"wrap",gap:"7px",marginBottom:"18px"}}>
          {SUBJECT_OPTIONS.map(s=><button key={s} style={st.tag(subjects.includes(s),C.teal)} onClick={()=>setSubjects(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}>{s}</button>)}
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          <button style={st.btnOut} onClick={()=>setStep(0)}>← Back</button>
          <button style={st.btn(C.teal)} onClick={()=>setStep(2)}>Continue →</button>
        </div>
      </div>
    );
    if(step===2) return(
      <div>
        <div style={{...st.label,color:C.lavender}}>Step 3 of 5</div>
        <h2 style={{fontSize:"21px",fontWeight:700,margin:"0 0 6px"}}>Academic Marks</h2>
        <p style={{color:C.textSecondary,fontSize:"13px",marginBottom:"18px"}}>Approximate % in each subject.</p>
        <PBar pct={progressPct}/>
        <div style={st.card}>
          {[["math","Mathematics",C.sky],["science","Science",C.teal],["lang","Languages",C.lavender],["social","Social Studies",C.gold],["cs","Computer Science",C.accent]].map(([k,l,col])=>(
            <div key={k} style={{marginBottom:"16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                <span style={{fontSize:"13px"}}>{l}</span>
                <span style={{fontSize:"13px",fontWeight:600,color:col}}>{grades[k]}%</span>
              </div>
              <input type="range" min="0" max="100" step="1" value={grades[k]} onChange={e=>setGrades(g=>({...g,[k]:+e.target.value}))} style={{width:"100%",accentColor:col}}/>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          <button style={st.btnOut} onClick={()=>setStep(1)}>← Back</button>
          <button style={st.btn(C.lavender)} onClick={()=>setStep(3)}>Continue →</button>
        </div>
      </div>
    );
    if(step===3) return(
      <div>
        <div style={{...st.label,color:C.gold}}>Step 4 of 5</div>
        <h2 style={{fontSize:"21px",fontWeight:700,margin:"0 0 6px"}}>Skill Assessments</h2>
        <p style={{color:C.textSecondary,fontSize:"13px",marginBottom:"18px"}}>5 modules · 5 questions each · ~10 min</p>
        <PBar pct={progressPct}/>
        <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"18px"}}>
          {ASSESSMENT_MODULES.map((m,i)=>(
            <div key={m.id} style={{...st.card,display:"flex",alignItems:"center",gap:"12px",padding:"13px 16px",borderLeft:`3px solid ${m.color}`,marginBottom:0}}>
              <div style={{width:"30px",height:"30px",borderRadius:"50%",background:`${m.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,color:m.color,flexShrink:0}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:"13px"}}>{m.title}</div>
                <div style={{color:C.textSecondary,fontSize:"11px"}}>{m.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          <button style={st.btnOut} onClick={()=>setStep(2)}>← Back</button>
          <button style={st.btn(C.gold)} onClick={()=>{setStep(4);setModIdx(0);setQIdx(0);setAnswers({});setScores({});}}>Start Tests →</button>
        </div>
      </div>
    );
    if(step===4){
      const mod=ASSESSMENT_MODULES[modIdx];
      const q=mod.questions[qIdx];
      const answered=answers[`${mod.id}_${qIdx}`];
      return(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
            <div style={{...st.label,color:mod.color,marginBottom:0}}>{mod.title}</div>
            <div style={{fontSize:"10px",color:C.textSecondary}}>Module {modIdx+1}/5 · Q{qIdx+1}/5</div>
          </div>
          <PBar pct={progressPct}/>
          <div style={{...st.card,borderLeft:`3px solid ${mod.color}`,marginBottom:"14px"}}>
            <div style={{fontSize:"15px",fontWeight:600,lineHeight:1.5}}>{q.q}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {q.opts.map((opt,i)=>{
              let border=`1px solid ${C.cardBorder}`,bg=C.card,col=C.textPrimary;
              if(answered){
                if(i===q.ans){border=`1px solid ${C.mint}`;bg=`${C.mint}15`;col=C.mint;}
                else if(i===answered.selected&&!answered.correct){border=`1px solid ${C.accent}`;bg=`${C.accent}15`;col=C.accent;}
              }
              return(
                <button key={i} disabled={!!answered} onClick={()=>handleAnswer(i)}
                  style={{background:bg,border,borderRadius:"12px",padding:"12px 15px",fontSize:"13px",color:col,cursor:answered?"default":"pointer",textAlign:"left",fontFamily:"inherit"}}>
                  <span style={{opacity:0.5,marginRight:"8px"}}>{["A","B","C","D"][i]}.</span>{opt}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderResults = ()=>{
    if(!topCareers.length) return(
      <div style={{textAlign:"center",padding:"48px 0"}}>
        <p style={{color:C.textSecondary}}>Complete the assessment first.</p>
        <button style={st.btn()} onClick={()=>{setSession("assessment");setStep(0);}}>Take Assessment</button>
      </div>
    );
    const top10 = topCareers.slice(0,10);
    return(
      <div>
        <h2 style={{fontSize:"20px",fontWeight:700,marginBottom:"4px"}}>Your Career Profile</h2>
        <p style={{color:C.textSecondary,fontSize:"13px",marginBottom:"18px"}}>Matched against <strong style={{color:C.textPrimary}}>214 real career roles</strong> from your dataset</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:"8px",marginBottom:"18px"}}>
          {ASSESSMENT_MODULES.map(m=>(
            <div key={m.id} style={{background:C.card,border:`1px solid ${C.cardBorder}`,borderRadius:"12px",padding:"11px",textAlign:"center"}}>
              <div style={{fontSize:"19px",fontWeight:700,color:m.color}}>{scores[m.id]||"–"}%</div>
              <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"2px"}}>{m.title.split(" ")[0]}</div>
            </div>
          ))}
        </div>
        <div style={{...st.card,marginBottom:"18px"}}>
          <div style={{fontWeight:600,marginBottom:"12px",fontSize:"13px"}}>Skill Breakdown</div>
          {ASSESSMENT_MODULES.map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"9px"}}>
              <div style={{width:"80px",fontSize:"10px",color:C.textSecondary,flexShrink:0}}>{m.title.split(" ")[0]}</div>
              <div style={{flex:1,height:"6px",background:C.bg,borderRadius:"3px",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${scores[m.id]||0}%`,background:m.color,borderRadius:"3px"}}/>
              </div>
              <div style={{width:"28px",fontSize:"10px",fontWeight:600,color:m.color,textAlign:"right"}}>{scores[m.id]||0}%</div>
            </div>
          ))}
        </div>
        <h3 style={{fontWeight:600,fontSize:"14px",marginBottom:"10px"}}>Top 10 Career Matches from your dataset</h3>
        {top10.map((career,i)=>{
          const meta = CAT_META[career.Category]||{color:C.textMuted,icon:"◉"};
          return(
            <div key={career.id} style={{...st.card,display:"flex",alignItems:"center",gap:"12px",borderLeft:`3px solid ${meta.color}`,cursor:"pointer",marginBottom:"8px"}}
              onClick={()=>{setPathCareer(PATHWAY_DATA.find(p=>p.Career_name===career.Career_name)||null);setSession("pathway");}}>
              <div style={{width:"28px",height:"28px",borderRadius:"50%",background:`${meta.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",flexShrink:0}}>{meta.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:"13px"}}>{career.Career_name}</div>
                <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"2px"}}>{career.Category} · {career.salary_range_india||"–"}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:"18px",fontWeight:700,color:meta.color}}>{career.match}%</div>
                <div style={{fontSize:"9px",color:C.textMuted}}>match</div>
              </div>
            </div>
          );
        })}
        <div style={{marginTop:"10px",display:"flex",gap:"8px",flexWrap:"wrap"}}>
          <button style={st.btn(C.teal)} onClick={()=>setSession("explore")}>Explore All Careers</button>
          <button style={st.btn(C.lavender)} onClick={()=>setSession("pathway")}>Career Pathways</button>
          <button style={st.btn(C.sky)} onClick={downloadCSV}>Export My Data</button>
        </div>
      </div>
    );
  };

  const renderExplore = ()=>(
    <div>
      <h2 style={{fontSize:"20px",fontWeight:700,marginBottom:"4px"}}>Explore 214 Careers</h2>
      <p style={{color:C.textSecondary,fontSize:"13px",marginBottom:"16px"}}>Browse all roles across 19 categories from your dataset</p>
      <input value={expSearch} onChange={e=>setExpSearch(e.target.value)} placeholder="Search career..." style={{...st.input,marginBottom:"12px"}}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"16px"}}>
        <button style={st.tag(expCat==="all")} onClick={()=>setExpCat("all")}>All ({CAREER_DATA.length})</button>
        {CATEGORIES.map(cat=>{
          const meta=CAT_META[cat]||{color:C.textMuted};
          const count=CAREER_DATA.filter(c=>c.Category===cat).length;
          return <button key={cat} style={st.tag(expCat===cat,meta.color)} onClick={()=>setExpCat(expCat===cat?"all":cat)}>{cat} ({count})</button>;
        })}
      </div>
      <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"10px"}}>Showing {filteredCareers.length} careers</div>
      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        {filteredCareers.slice(0,50).map(career=>{
          const meta=CAT_META[career.Category]||{color:C.textMuted,icon:"◉"};
          const match=topCareers.find(t=>t.id===career.id);
          return(
            <div key={career.id} style={{...st.card,display:"flex",gap:"12px",alignItems:"flex-start",padding:"13px 16px",borderLeft:`3px solid ${meta.color}`,cursor:"pointer",marginBottom:0}}
              onClick={()=>{setPathCareer(PATHWAY_DATA.find(p=>p.Career_name===career.Career_name)||null);setSession("pathway");}}>
              <div style={{width:"28px",height:"28px",borderRadius:"50%",background:`${meta.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",flexShrink:0,marginTop:"1px"}}>{meta.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:"13px"}}>{career.Career_name}</div>
                <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"2px"}}>{career.Category}</div>
                <div style={{fontSize:"10px",color:C.textMuted,marginTop:"2px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{career.required_stream}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"4px",flexShrink:0}}>
                <span style={{fontSize:"10px",color:C.mint,fontWeight:600}}>{career.salary_range_india||"–"}</span>
                {match&&<Badge text={`${match.match}% match`} col={meta.color}/>}
                <Badge text={career.future_scope||"–"} col={career.future_scope==="Very High"?C.mint:career.future_scope==="High"?C.gold:C.textMuted}/>
              </div>
            </div>
          );
        })}
        {filteredCareers.length>50&&<div style={{textAlign:"center",fontSize:"12px",color:C.textMuted,padding:"10px"}}>Showing top 50 — use search to narrow down</div>}
      </div>
    </div>
  );

  const renderCourseFinder = ()=>{
    const fields=["all",...new Set(ABROAD_DATA.map(a=>a.field))].sort();
    const levels=["all",...new Set(ABROAD_DATA.map(a=>a.program_level))].sort();
    return(
      <div>
        <h2 style={{fontSize:"20px",fontWeight:700,marginBottom:"4px"}}>Course Finder</h2>
        <p style={{color:C.textSecondary,fontSize:"13px",marginBottom:"16px"}}>Browse <strong style={{color:C.textPrimary}}>354 study abroad programs</strong> by field and level</p>
        <div style={{marginBottom:"10px"}}>
          <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"6px"}}>Field</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
            {fields.map(f=><button key={f} style={st.tag(courseField===f,C.teal)} onClick={()=>setCourseField(f)}>{f}</button>)}
          </div>
        </div>
        <div style={{marginBottom:"16px"}}>
          <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"6px"}}>Level</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
            {levels.map(l=><button key={l} style={st.tag(courseLevel===l,C.lavender)} onClick={()=>setCourseLevel(l)}>{l}</button>)}
          </div>
        </div>
        <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"10px"}}>Showing {filteredCourses.length} programs</div>
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          {filteredCourses.slice(0,60).map((c,i)=>(
            <div key={i} style={{...st.card,borderLeft:`3px solid ${C.teal}`,padding:"13px 16px",marginBottom:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"8px",marginBottom:"8px"}}>
                <div>
                  <div style={{fontWeight:600,fontSize:"13px"}}>{c.degree_name}</div>
                  <div style={{fontSize:"11px",color:C.textSecondary,marginTop:"2px"}}>{c.major} · {c.field}</div>
                </div>
                <div style={{display:"flex",gap:"6px",alignItems:"center",flexWrap:"wrap"}}>
                  <Badge text={c.program_level} col={C.lavender}/>
                  <span style={{fontSize:"11px",color:C.mint,fontWeight:600}}>{c.estimated_salary}</span>
                </div>
              </div>
              <div style={{fontSize:"11px",color:C.textMuted}}>Eligible: {c.eligible_stream_or_degree}</div>
              <div style={{display:"flex",gap:"10px",marginTop:"8px",flexWrap:"wrap"}}>
                {[["Analytical",c.analytical_score,C.sky],["Math",c.math_score,C.teal],["Creative",c.creativity_score,C.lavender],["Communication",c.communication_score,C.accent],["Social",c.social_score,C.mint]].map(([lbl,val,col])=>(
                  <div key={lbl} style={{textAlign:"center"}}>
                    <div style={{fontSize:"9px",color:C.textMuted}}>{lbl}</div>
                    <div style={{fontSize:"12px",fontWeight:600,color:col}}>{val}/10</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filteredCourses.length>60&&<div style={{textAlign:"center",fontSize:"12px",color:C.textMuted,padding:"10px"}}>Showing top 60 — filter to narrow down</div>}
        </div>
      </div>
    );
  };

  const renderPathway = ()=>{
    const pw = pathCareer;
    return(
      <div>
        <h2 style={{fontSize:"20px",fontWeight:700,marginBottom:"4px"}}>Career Pathway</h2>
        <p style={{color:C.textSecondary,fontSize:"13px",marginBottom:"16px"}}>Search any of the <strong style={{color:C.textPrimary}}>214 career roles</strong> for the full journey</p>
        <input value={pathSearch} onChange={e=>{setPathSearch(e.target.value);setPathCareer(null);}} placeholder="Search career role... e.g. Software, Doctor, Lawyer" style={{...st.input,marginBottom:"10px"}}/>
        {pathResults.length>0&&!pw&&(
          <div style={{display:"flex",flexDirection:"column",gap:"6px",marginBottom:"14px"}}>
            {pathResults.map(p=>{
              const meta=CAT_META[p.Category]||{color:C.textMuted,icon:"◉"};
              return(
                <div key={p.id} style={{...st.card,display:"flex",alignItems:"center",gap:"10px",padding:"11px 15px",cursor:"pointer",borderLeft:`3px solid ${meta.color}`,marginBottom:0}}
                  onClick={()=>{setPathCareer(p);setPathSearch(p.Career_name);}}>
                  <span style={{fontSize:"15px"}}>{meta.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:"13px"}}>{p.Career_name}</div>
                    <div style={{fontSize:"10px",color:C.textSecondary}}>{p.Category}</div>
                  </div>
                  <Badge text={p.future_scope||"–"} col={p.future_scope==="Very High"?C.mint:C.gold}/>
                </div>
              );
            })}
          </div>
        )}
        {!pw&&!pathResults.length&&(
          <div style={{textAlign:"center",padding:"32px",color:C.textMuted,fontSize:"13px"}}>Type a career name above to explore its full pathway</div>
        )}
        {pw&&(()=>{
          const meta=CAT_META[pw.Category]||{color:C.teal,icon:"◉"};
          return(
            <div>
              <div style={{...st.card,borderLeft:`3px solid ${meta.color}`,marginBottom:"10px"}}>
                <div style={{display:"flex",gap:"10px",alignItems:"center",marginBottom:"10px"}}>
                  <div style={{fontSize:"24px"}}>{meta.icon}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:"16px"}}>{pw.Career_name}</div>
                    <div style={{fontSize:"11px",color:C.textSecondary}}>{pw.Category} · {pw.salary_range_india}</div>
                  </div>
                  <div style={{marginLeft:"auto"}}><Badge text={pw.future_scope} col={pw.future_scope==="Very High"?C.mint:C.gold}/></div>
                </div>
              </div>
              {/* Stream & subjects */}
              <div style={{...st.card,borderLeft:`3px solid ${meta.color}`,marginBottom:"8px"}}>
                <div style={{fontWeight:600,fontSize:"12px",color:meta.color,marginBottom:"6px"}}>12th Stream Required</div>
                <div style={{fontSize:"13px",marginBottom:"6px"}}>{pw.required_stream}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
                  {splitSemi(pw.required_subjects_12th).map(s=><span key={s} style={{fontSize:"10px",color:C.textSecondary,background:C.bg,padding:"2px 7px",borderRadius:"8px"}}>{s}</span>)}
                </div>
              </div>
              {/* Degree & exams */}
              <div style={{...st.card,borderLeft:`3px solid ${C.sky}`,marginBottom:"8px"}}>
                <div style={{fontWeight:600,fontSize:"12px",color:C.sky,marginBottom:"6px"}}>Degree / Course</div>
                <div style={{fontSize:"13px",marginBottom:"6px"}}>{pw.degree}</div>
                {pw.alternative_path&&<div style={{fontSize:"11px",color:C.textSecondary,marginBottom:"6px"}}>Alternative: {pw.alternative_path}</div>}
                <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
                  {splitSemi(pw.entrance_exams).map(e=><span key={e} style={{fontSize:"10px",color:C.gold,background:`${C.gold}15`,padding:"2px 7px",borderRadius:"8px"}}>{e}</span>)}
                </div>
              </div>
              {/* PG & PhD */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"8px"}}>
                <div style={{...st.card,borderLeft:`3px solid ${C.teal}`,marginBottom:0}}>
                  <div style={{fontWeight:600,fontSize:"11px",color:C.teal,marginBottom:"5px"}}>Post Graduation</div>
                  <div style={{fontSize:"12px",color:C.textSecondary}}>{pw.postgraduate_options||"–"}</div>
                </div>
                <div style={{...st.card,borderLeft:`3px solid ${C.lavender}`,marginBottom:0}}>
                  <div style={{fontWeight:600,fontSize:"11px",color:C.lavender,marginBottom:"5px"}}>PhD / Research</div>
                  <div style={{fontSize:"12px",color:C.textSecondary}}>{pw.phd_options||"–"}</div>
                </div>
              </div>
              {/* Certifications */}
              {pw.certifications&&(
                <div style={{...st.card,marginBottom:"8px"}}>
                  <div style={{fontWeight:600,fontSize:"12px",marginBottom:"7px"}}>Certifications</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
                    {splitPipe(pw.certifications).map(c=><span key={c} style={{fontSize:"10px",color:C.mint,background:`${C.mint}15`,padding:"3px 9px",borderRadius:"20px"}}>{c}</span>)}
                  </div>
                </div>
              )}
              {/* Career levels */}
              {pw.career_levels&&(
                <div style={{...st.card,marginBottom:"8px"}}>
                  <div style={{fontWeight:600,fontSize:"12px",marginBottom:"8px"}}>Career Progression</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"5px",alignItems:"center"}}>
                    {pw.career_levels.split("->").map((l,i,arr)=>(
                      <span key={i} style={{display:"flex",alignItems:"center",gap:"5px"}}>
                        <span style={{fontSize:"11px",color:meta.color,background:`${meta.color}15`,padding:"4px 10px",borderRadius:"20px"}}>{l.trim()}</span>
                        {i<arr.length-1&&<span style={{color:C.textMuted,fontSize:"12px"}}>→</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Key skills */}
              {pw.key_skills&&(
                <div style={{...st.card,marginBottom:"8px"}}>
                  <div style={{fontWeight:600,fontSize:"12px",marginBottom:"7px"}}>Key Skills</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
                    {splitPipe(pw.key_skills).map(k=><span key={k} style={{fontSize:"10px",color:C.sky,background:`${C.sky}15`,padding:"3px 9px",borderRadius:"20px"}}>{k}</span>)}
                  </div>
                </div>
              )}
              {/* Study abroad */}
              {(pw.study_abroad_courses||pw.study_abroad_countries)&&(
                <div style={{...st.card,borderLeft:`3px solid ${C.lavender}`,marginBottom:"8px"}}>
                  <div style={{fontWeight:600,fontSize:"12px",color:C.lavender,marginBottom:"7px"}}>Study Abroad</div>
                  <div style={{fontSize:"12px",color:C.textSecondary,marginBottom:"5px"}}>{pw.study_abroad_courses}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
                    {splitSemi(pw.study_abroad_countries).map(c=><span key={c} style={{fontSize:"10px",color:C.lavender,background:`${C.lavender}15`,padding:"2px 8px",borderRadius:"20px"}}>{c}</span>)}
                  </div>
                </div>
              )}
              {/* Top companies */}
              {pw.top_companies&&(
                <div style={{...st.card,marginBottom:"8px"}}>
                  <div style={{fontWeight:600,fontSize:"12px",marginBottom:"7px"}}>Top Employers</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
                    {splitPipe(pw.top_companies).map(c=><span key={c} style={{fontSize:"10px",color:C.textSecondary,background:C.bg,padding:"3px 9px",borderRadius:"20px",border:`1px solid ${C.cardBorder}`}}>{c}</span>)}
                  </div>
                </div>
              )}
              {/* Govt jobs */}
              {pw.government_jobs&&(
                <div style={{...st.card,borderLeft:`3px solid ${C.gold}`,marginBottom:"8px"}}>
                  <div style={{fontWeight:600,fontSize:"12px",color:C.gold,marginBottom:"7px"}}>Government Jobs</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
                    {splitSemi(pw.government_jobs).map(g=><span key={g} style={{fontSize:"10px",color:C.gold,background:`${C.gold}15`,padding:"3px 9px",borderRadius:"20px"}}>{g}</span>)}
                  </div>
                </div>
              )}
              {/* Salary */}
              <div style={{...st.card,borderLeft:`3px solid ${C.mint}`,marginBottom:"8px"}}>
                <div style={{fontWeight:600,fontSize:"12px",color:C.mint,marginBottom:"6px"}}>Salary in India</div>
                <div style={{fontSize:"14px",fontWeight:700,color:C.mint}}>{pw.salary_range_india||"–"}</div>
                <div style={{fontSize:"10px",color:C.textMuted,marginTop:"2px"}}>Demand Score: {pw.demand_score}/100 · {pw.future_scope}</div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  const renderGovtJobs = ()=>(
    <div>
      <h2 style={{fontSize:"20px",fontWeight:700,marginBottom:"4px"}}>Govt Jobs & Entrance Exams</h2>
      <p style={{color:C.textSecondary,fontSize:"13px",marginBottom:"14px"}}>Government job opportunities across all 214 career roles</p>
      <input value={govtSearch} onChange={e=>setGovtSearch(e.target.value)} placeholder="Search career or exam..." style={{...st.input,marginBottom:"14px"}}/>
      <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"10px"}}>Showing {govtExamCareers.length} careers with govt opportunities</div>
      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        {govtExamCareers.map(career=>{
          const meta=CAT_META[career.Category]||{color:C.gold,icon:"◉"};
          return(
            <div key={career.id} style={{...st.card,borderLeft:`3px solid ${meta.color}`,padding:"13px 16px",marginBottom:0}}>
              <div style={{display:"flex",gap:"10px",alignItems:"flex-start",marginBottom:"8px"}}>
                <span style={{fontSize:"16px"}}>{meta.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:"13px"}}>{career.Career_name}</div>
                  <div style={{fontSize:"10px",color:C.textSecondary}}>{career.Category}</div>
                </div>
                <Badge text={career.future_scope||"–"} col={career.future_scope==="Very High"?C.mint:C.gold}/>
              </div>
              <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"6px"}}>Government Opportunities:</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
                {splitSemi(career.government_jobs).map(g=><span key={g} style={{fontSize:"10px",color:C.gold,background:`${C.gold}15`,padding:"3px 9px",borderRadius:"20px"}}>{g}</span>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAbroad = ()=>(
    <div>
      <h2 style={{fontSize:"20px",fontWeight:700,marginBottom:"4px"}}>Study Abroad Programs</h2>
      <p style={{color:C.textSecondary,fontSize:"13px",marginBottom:"14px"}}><strong style={{color:C.textPrimary}}>354 programs</strong> across 11 fields and 5 levels worldwide</p>
      <div style={{marginBottom:"10px"}}>
        <div style={{fontSize:"10px",color:C.textMuted,marginBottom:"5px"}}>Field</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
          {abroadFields.map(f=><button key={f} style={st.tag(abroadField===f,C.lavender)} onClick={()=>setAbroadField(f)}>{f}</button>)}
        </div>
      </div>
      <div style={{marginBottom:"14px"}}>
        <div style={{fontSize:"10px",color:C.textMuted,marginBottom:"5px"}}>Level</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
          {abroadLevels.map(l=><button key={l} style={st.tag(abroadLevel===l,C.pink)} onClick={()=>setAbroadLevel(l)}>{l}</button>)}
        </div>
      </div>
      <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"10px"}}>Showing {Math.min(filteredAbroad.length,60)} of {filteredAbroad.length} programs</div>
      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        {filteredAbroad.slice(0,60).map((a,i)=>(
          <div key={i} style={{...st.card,borderLeft:`3px solid ${C.lavender}`,padding:"13px 16px",marginBottom:0}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"8px",marginBottom:"6px"}}>
              <div>
                <div style={{fontWeight:600,fontSize:"13px"}}>{a.degree_name}</div>
                <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"2px"}}>{a.major} · {a.field}</div>
              </div>
              <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
                <Badge text={a.program_level} col={C.lavender}/>
                <span style={{fontSize:"11px",color:C.mint,fontWeight:600}}>{a.estimated_salary}</span>
              </div>
            </div>
            <div style={{fontSize:"10px",color:C.textMuted,marginBottom:"7px"}}>Eligible: {a.eligible_stream_or_degree}</div>
            <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
              {[["Analytical",a.analytical_score,C.sky],["Math",a.math_score,C.teal],["Creative",a.creativity_score,C.lavender],["Comm",a.communication_score,C.accent],["Social",a.social_score,C.mint],["Demand",a.demand_score,C.gold]].map(([lbl,val,col])=>(
                <div key={lbl} style={{textAlign:"center"}}>
                  <div style={{fontSize:"9px",color:C.textMuted}}>{lbl}</div>
                  <div style={{fontSize:"12px",fontWeight:600,color:col}}>{val}/10</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResume = ()=>(
    <div>
      <h2 style={{fontSize:"20px",fontWeight:700,marginBottom:"4px"}}>Resume Builder</h2>
      <p style={{color:C.textSecondary,fontSize:"13px",marginBottom:"18px"}}>Fill your details · add a job description for ML matching · download your resume</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:"14px"}}>
        <div style={st.card}>
          <div style={{fontWeight:600,fontSize:"12px",color:C.sky,marginBottom:"10px"}}>Personal Information</div>
          {[["name","Full Name","text"],["email","Email","email"],["phone","Phone","tel"],["dob","Date of Birth","date"],["address","City / Address","text"]].map(([k,l,t])=>(
            <div key={k} style={{marginBottom:"9px"}}>
              <div style={{fontSize:"10px",color:C.textSecondary,marginBottom:"3px"}}>{l}</div>
              <input type={t} value={resume[k]} onChange={e=>setResume(r=>({...r,[k]:e.target.value}))} style={st.input} placeholder={l}/>
            </div>
          ))}
        </div>
        <div style={st.card}>
          <div style={{fontWeight:600,fontSize:"12px",color:C.teal,marginBottom:"10px"}}>Education & Skills</div>
          <div style={{marginBottom:"9px"}}>
            <div style={{fontSize:"10px",color:C.textSecondary,marginBottom:"3px"}}>Education</div>
            <textarea value={resume.edu} onChange={e=>setResume(r=>({...r,edu:e.target.value}))} rows={3} placeholder="12th - CBSE - 92% (2024)&#10;B.Tech CSE - 1st Year" style={{...st.input,resize:"vertical"}}/>
          </div>
          <div style={{marginBottom:"9px"}}>
            <div style={{fontSize:"10px",color:C.textSecondary,marginBottom:"3px"}}>Skills (comma separated)</div>
            <input value={resume.skills} onChange={e=>setResume(r=>({...r,skills:e.target.value}))} style={st.input} placeholder="Python, Communication, Leadership"/>
          </div>
          <div style={{marginBottom:"9px"}}>
            <div style={{fontSize:"10px",color:C.textSecondary,marginBottom:"3px"}}>Languages</div>
            <input value={resume.languages} onChange={e=>setResume(r=>({...r,languages:e.target.value}))} style={st.input} placeholder="Malayalam, English, Hindi"/>
          </div>
        </div>
        <div style={st.card}>
          <div style={{fontWeight:600,fontSize:"12px",color:C.lavender,marginBottom:"10px"}}>Experience & Achievements</div>
          <div style={{marginBottom:"9px"}}>
            <div style={{fontSize:"10px",color:C.textSecondary,marginBottom:"3px"}}>Internships / Projects</div>
            <textarea value={resume.experience} onChange={e=>setResume(r=>({...r,experience:e.target.value}))} rows={3} placeholder="Fresher or list internships" style={{...st.input,resize:"vertical"}}/>
          </div>
          <div style={{marginBottom:"9px"}}>
            <div style={{fontSize:"10px",color:C.textSecondary,marginBottom:"3px"}}>Achievements & Extracurriculars</div>
            <textarea value={resume.achievements} onChange={e=>setResume(r=>({...r,achievements:e.target.value}))} rows={3} placeholder="Sports captain, NSS, prizes..." style={{...st.input,resize:"vertical"}}/>
          </div>
        </div>
        <div style={st.card}>
          <div style={{fontWeight:600,fontSize:"12px",color:C.gold,marginBottom:"6px"}}>Target Job Description</div>
          <div style={{fontSize:"10px",color:C.textSecondary,marginBottom:"7px"}}>Paste the JD you're applying for — used for ML keyword matching</div>
          <textarea value={resume.jd} onChange={e=>setResume(r=>({...r,jd:e.target.value}))} rows={6} placeholder="Looking for a software engineer with 0–2 yrs experience in Python, REST APIs..." style={{...st.input,resize:"vertical"}}/>
        </div>
      </div>
      <div style={{marginTop:"14px",display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center"}}>
        <button style={st.btn(C.mint)} onClick={downloadResume}>⬇ Download Resume (.txt)</button>
        <button style={st.btn(C.sky)} onClick={downloadCSV}>⬇ Export All Student Data (CSV)</button>
        {resumeSaved&&<span style={{fontSize:"11px",color:C.mint}}>✓ Saved for ML training</span>}
      </div>
      <div style={{...st.card,marginTop:"12px",background:`${C.gold}10`,border:`1px solid ${C.gold}30`}}>
        <div style={{fontWeight:600,fontSize:"11px",color:C.gold,marginBottom:"5px"}}>Data collected per student (for ML)</div>
        <div style={{fontSize:"11px",color:C.textSecondary,lineHeight:1.6}}>Skill scores (5 dimensions) · hobbies · subject preferences · academic grades · top career match · job description keywords. Exportable as CSV from Home or here.</div>
      </div>
    </div>
  );

  const renderJobs = ()=>(
    <div>
      <h2 style={{fontSize:"20px",fontWeight:700,marginBottom:"4px"}}>Job Market Insights</h2>
      <p style={{color:C.textSecondary,fontSize:"13px",marginBottom:"14px"}}>Demand scores & salary data from your 214 career dataset</p>
      <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"10px"}}>
        <button style={st.tag(jobSort==="demand",C.gold)} onClick={()=>setJobSort("demand")}>Sort by Demand</button>
        <button style={st.tag(jobSort==="salary",C.mint)} onClick={()=>setJobSort("salary")}>Sort by Salary</button>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"14px"}}>
        <button style={st.tag(jobCat==="all")} onClick={()=>setJobCat("all")}>All</button>
        {CATEGORIES.map(cat=>{
          const meta=CAT_META[cat]||{color:C.textMuted};
          return <button key={cat} style={st.tag(jobCat===cat,meta.color)} onClick={()=>setJobCat(jobCat===cat?"all":cat)}>{cat}</button>;
        })}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
        {jobData.map(job=>{
          const meta=CAT_META[job.Category]||{color:C.textMuted,icon:"◉"};
          return(
            <div key={job.id} style={{...st.card,padding:"13px 16px",marginBottom:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"8px"}}>
                <div>
                  <div style={{fontWeight:600,fontSize:"13px"}}>{job.Career_name}</div>
                  <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"2px"}}>{job.Category} · {job.salary_range_india||"–"}</div>
                </div>
                <div style={{display:"flex",gap:"5px",alignItems:"center"}}>
                  <Badge text={job.future_scope||"–"} col={job.future_scope==="Very High"?C.mint:job.future_scope==="High"?C.gold:C.textMuted}/>
                </div>
              </div>
              <div style={{marginTop:"8px"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"9px",marginBottom:"3px",color:C.textSecondary}}>
                  <span>Demand Score</span><span style={{color:C.textPrimary,fontWeight:600}}>{job.demand_score}/100</span>
                </div>
                <div style={{height:"5px",background:C.bg,borderRadius:"3px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${job.demand_score}%`,background:`linear-gradient(90deg,${C.teal},${C.sky})`,borderRadius:"3px"}}/>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMentor = ()=>(
    <div style={{textAlign:"center",padding:"60px 20px"}}>
      <div style={{fontSize:"44px",marginBottom:"14px"}}>🔒</div>
      <h2 style={{fontSize:"22px",fontWeight:700,margin:"0 0 8px"}}>AI Mentor</h2>
      <div style={{display:"inline-block",background:`${C.accent}20`,border:`1px solid ${C.accent}40`,borderRadius:"20px",padding:"5px 16px",fontSize:"11px",color:C.accent,fontWeight:600,marginBottom:"16px"}}>Coming Soon</div>
      <p style={{color:C.textSecondary,fontSize:"13px",maxWidth:"380px",margin:"0 auto 20px",lineHeight:1.7}}>Our Claude AI–powered career mentor will answer questions about courses, colleges, entrance exams, scholarships and career planning — launching soon.</p>
      <div style={{display:"flex",flexDirection:"column",gap:"8px",maxWidth:"320px",margin:"0 auto"}}>
        {["What careers suit me based on my results?","Best colleges for CSE in Kerala?","How to prepare for NEET in 6 months?","Scholarships for engineering students?","Salary expectations for a fresher?"].map(q=>(
          <div key={q} style={{background:C.card,border:`1px solid ${C.cardBorder}`,borderRadius:"10px",padding:"10px 14px",fontSize:"12px",color:C.textMuted,textAlign:"left"}}>{q}</div>
        ))}
      </div>
    </div>
  );

  const renderSession = ()=>{
    switch(session){
      case "home":       return renderHome();
      case "assessment": return renderAssessment();
      case "results":    return renderResults();
      case "explore":    return renderExplore();
      case "coursetest": return renderCourseFinder();
      case "pathway":    return renderPathway();
      case "govtjobs":   return renderGovtJobs();
      case "abroad":     return renderAbroad();
      case "resume":     return renderResume();
      case "jobs":       return renderJobs();
      case "mentor":     return renderMentor();
      default:           return renderHome();
    }
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.textPrimary,fontFamily:"'Space Grotesk','Segoe UI',sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2a2a45;border-radius:2px}input,textarea,button{font-family:inherit}`}</style>
      <nav style={{background:C.card,borderBottom:`1px solid ${C.cardBorder}`,padding:"0 12px",display:"flex",alignItems:"center",gap:"2px",overflowX:"auto",position:"sticky",top:0,zIndex:100,scrollbarWidth:"none"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:C.accent,marginRight:"8px",flexShrink:0}}>◈ CC</div>
        {SESSIONS.map(s=>(
          <button key={s.id} onClick={()=>setSession(s.id)}
            style={{padding:"12px 10px",fontSize:"11px",fontWeight:session===s.id?600:400,color:session===s.id?C.accent:C.textSecondary,cursor:"pointer",background:"none",border:"none",borderBottom:`2px solid ${session===s.id?C.accent:"transparent"}`,whiteSpace:"nowrap",fontFamily:"inherit"}}>
            {s.label}
          </button>
        ))}
      </nav>
      <main style={{flex:1,padding:"20px 16px",maxWidth:"920px",margin:"0 auto",width:"100%"}}>
        {renderSession()}
      </main>
    </div>
  );
}
