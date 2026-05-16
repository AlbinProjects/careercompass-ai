import { useState, useMemo } from "react";
import { CAREER_DATA, PATHWAY_DATA, ABROAD_DATA } from "./careerData";
import AdvancedAnalysis from "./AdvancedAnalysis";

const C = {
  bg:"#0d0d1a", card:"#161628", cardBorder:"#2a2a45",
  accent:"#e94560", teal:"#0f9b8e", gold:"#f5a623",
  lavender:"#8b5cf6", mint:"#10b981", sky:"#3b82f6",
  pink:"#ec4899", orange:"#f97316",
  textPrimary:"#f0f0ff", textSecondary:"#9999bb", textMuted:"#5555aa",
};

const CAT_META = {
  "IT & Computer":      {color:C.sky,     icon:"⟨⟩"},
  "Healthcare":         {color:C.mint,    icon:"⊕"},
  "Engineering":        {color:C.teal,    icon:"⚙"},
  "Business & Finance": {color:C.gold,    icon:"◈"},
  "Law & Government":   {color:C.accent,  icon:"⊖"},
  "Media & Creative":   {color:C.lavender,icon:"⌘"},
  "Education":          {color:C.orange,  icon:"⊗"},
  "Defense":            {color:"#ef4444", icon:"⊘"},
  "Design":             {color:"#a855f7", icon:"✦"},
  "Aviation":           {color:C.sky,     icon:"✈"},
  "Biotech":            {color:C.teal,    icon:"⊛"},
  "Science":            {color:C.mint,    icon:"⊛"},
  "Space Science":      {color:"#818cf8", icon:"★"},
  "Hospitality":        {color:C.orange,  icon:"⌂"},
  "Fashion":            {color:C.pink,    icon:"✦"},
  "Sports / Fitness":   {color:C.accent,  icon:"◉"},
  "Marine":             {color:C.sky,     icon:"≋"},
  "Forensics":          {color:"#94a3b8", icon:"⊕"},
  "Research":           {color:C.lavender,icon:"⊛"},
};
const CATEGORIES = [...new Set(CAREER_DATA.map(c=>c.Category))].sort();

const SESSIONS = [
  {id:"home",       label:"Home"},
  {id:"assessment", label:"Career Assessment"},
  {id:"coursetest", label:"Course Test"},
  {id:"results",    label:"My Results"},
  {id:"advanced",   label:"Advanced Analysis"},
  {id:"advresults", label:"Adv. Results"},
  {id:"dashboard",label:"Dashboard"},
  {id:"explore",    label:"Explore Careers"},
  {id:"pathway",    label:"Career Pathway"},
  {id:"govtjobs",   label:"Govt & Exams"},
  {id:"abroad",     label:"Study Abroad"},
  {id:"jobs",       label:"Job Market"},
  {id:"resume",     label:"Resume Builder"},
  {id:"planner",    label:"Study Planner"},
  {id:"internship", label:"Courses & Internship"},
  {id:"mentor",     label:"AI Mentor 🔒"},
];

const ASSESSMENT_MODULES = [
  {id:"analytical",title:"Analytical Reasoning",subtitle:"Logic & Pattern Recognition",color:C.sky,
    questions:[
      // ── Level 1: Basic ──
      {q:"If A > B and B > C, which is definitely true?",opts:["A > C","C > A","A = C","Cannot determine"],ans:0},
      {q:"Complete: 2, 6, 12, 20, 30, ?",opts:["40","42","44","46"],ans:1},
      {q:"All cats are animals. Some animals are pets. Therefore:",opts:["All cats are pets","Some cats may be pets","No cats are pets","Cannot be determined"],ans:1},
      {q:"Next in series: △ ◇ △△ ◇◇ △△△ ◇◇◇ ?",opts:["△△△△","◇◇◇◇","△◇","◇△△"],ans:0},
      {q:"If ROSE = 6521, CHAIR = 73456. What is RICE?",opts:["6432","6452","6532","6542"],ans:1},
      // ── Level 2: Medium ──
      {q:"Find the odd one out: 16, 25, 36, 48, 64, 81",opts:["25","48","64","81"],ans:1},
      {q:"A is B's sister. B is C's brother. C is D's father. How is A related to D?",opts:["Aunt","Mother","Sister","Grandmother"],ans:0},
      {q:"In a row of 40 students, Riya is 11th from left and Priya is 31st from right. How many students are between them?",opts:["0","1","2","3"],ans:0},
      {q:"Series: 1, 4, 9, 16, 25, 36, ? (pattern: n²)",opts:["42","49","48","56"],ans:1},
      {q:"If 5 workers build 5 houses in 5 days, how many days for 1 worker to build 1 house?",opts:["1","5","10","25"],ans:1},
      // ── Level 3: Hard ──
      {q:"A clock shows 3:15. What is the angle between hour and minute hands?",opts:["0°","7.5°","15°","22.5°"],ans:1},
      {q:"Series: 2, 3, 5, 8, 13, 21, ? (Fibonacci-like but starts at 2)",opts:["29","33","34","35"],ans:2},
      {q:"If 'TRAIN' is coded as 'GIZVA' (T→G, R→I, A→Z, I→V, N→A), what is 'BRAIN'?",opts:["YIZVA","YRIVA","BZIVA","BIAVA"],ans:0},
      {q:"In a competition, if you overtake the person in 3rd place, what position are you in?",opts:["1st","2nd","3rd","4th"],ans:2},
      {q:"All P are Q. Some Q are R. No R is S. Which is definitely true?",opts:["Some P are R","No P is S","Some Q are not S","All Q are P"],ans:2},
      // ── Level 4: Very Hard ──
      {q:"A snail climbs 3m up a 10m pole each day but slips 2m each night. On which day does it reach the top?",opts:["7th day","8th day","9th day","10th day"],ans:1},
      {q:"Series: 1, 2, 6, 24, 120, ? (pattern: n!)",opts:["600","720","840","960"],ans:1},
      {q:"If DECEMBER has 5 vowels and 8 letters, which month has ratio vowels:consonants = 1:1?",opts:["JUNE","JULY","MARCH","AUGUST"],ans:0},
      {q:"3 boxes each contain 10 balls: Box A all red, Box B all blue, Box C mixed. Labels are ALL wrong. You pick 1 ball from 'Mixed' box and it's red. What's in Box C?",opts:["All red","All blue","Mixed","Cannot determine"],ans:1},
      {q:"P says Q is lying. Q says R is lying. R says both P and Q are lying. Who is telling truth?",opts:["P only","Q only","R only","Cannot determine"],ans:0},
    ]},
  {id:"numeric",title:"Numerical Ability",subtitle:"Math & Data Interpretation",color:C.teal,
    questions:[
      // ── Level 1: Basic ──
      {q:"15% of 240 = ?",opts:["32","36","38","40"],ans:1},
      {q:"300 km in 4 hours. Speed in km/h?",opts:["65","70","75","80"],ans:2},
      {q:"x² = 144, x = ?",opts:["10","11","12","14"],ans:2},
      {q:"Mode of: 4, 7, 9, 7, 5, 7, 4 = ?",opts:["4","5","7","9"],ans:2},
      {q:"(3×4) + (6÷2) − 5 = ?",opts:["10","12","14","16"],ans:0},
      // ── Level 2: Medium ──
      {q:"A train 120m long passes a pole in 12 sec. Speed in km/h?",opts:["32","36","40","45"],ans:1},
      {q:"Simple interest on ₹5000 at 8% per year for 3 years?",opts:["₹1000","₹1200","₹1500","₹1800"],ans:1},
      {q:"If 40% of a number is 120, what is 25% of that number?",opts:["60","70","75","80"],ans:2},
      {q:"LCM of 12, 18, and 24 = ?",opts:["48","60","72","96"],ans:2},
      {q:"A can complete work in 10 days, B in 15 days. Working together, days needed?",opts:["5","6","7","8"],ans:1},
      // ── Level 3: Hard ──
      {q:"Compound interest on ₹8000 at 10% per annum for 2 years?",opts:["₹1600","₹1680","₹1720","₹1800"],ans:1},
      {q:"In a class, ratio of boys to girls is 3:2. If 10 more boys join, ratio becomes 2:1. Total students originally?",opts:["40","50","60","70"],ans:1},
      {q:"A mixture has milk:water = 3:1. How much water added to 40L mixture to make ratio 3:2?",opts:["5L","10L","12L","15L"],ans:1},
      {q:"Two pipes fill a tank in 20 and 30 min. A drain empties in 15 min. All open: time to fill?",opts:["60 min","90 min","120 min","Never fills"],ans:2},
      {q:"Train A leaves at 6AM at 60km/h. Train B leaves same station at 8AM at 90km/h. When does B catch A?",opts:["10 AM","11 AM","12 PM","1 PM"],ans:2},
      // ── Level 4: Very Hard ──
      {q:"A shopkeeper marks price 40% above cost. Gives 25% discount. Profit or loss %?",opts:["Profit 5%","Loss 5%","Profit 10%","No profit/loss"],ans:0},
      {q:"The sum of first n natural numbers is 210. Find n.",opts:["18","19","20","21"],ans:2},
      {q:"Average of 5 numbers is 18. If one number is excluded, average drops to 16. Excluded number?",opts:["24","26","28","30"],ans:1},
      {q:"A boat goes 15km upstream in 5 hr and 15km downstream in 3 hr. Speed of stream?",opts:["1 km/h","1.5 km/h","2 km/h","2.5 km/h"],ans:0},
      {q:"In how many ways can 5 students be arranged in a row if 2 specific students must always be together?",opts:["24","48","72","120"],ans:1},
    ]},
  {id:"verbal",title:"Verbal & Communication",subtitle:"Language & Expression",color:C.lavender,
    questions:[
      {q:"Opposite of 'Benevolent'?",opts:["Kind","Malevolent","Generous","Caring"],ans:1},
      {q:"Grammatically correct?",opts:["Him and me went.","He and I went.","He and me went.","Him and I went."],ans:1},
      {q:"'Loquacious' means?",opts:["Silent","Talkative","Wise","Thoughtful"],ans:1},
      {q:"Best definition of 'empathy'?",opts:["Sympathy","Understanding another's feelings","Detachment","Self-awareness"],ans:1},
      {q:"'The team __ working hard.'",opts:["are","is","were","has"],ans:1},
    ]},
  {id:"creative",title:"Creative Thinking",subtitle:"Innovation & Problem Solving",color:C.accent,
    questions:[
      {q:"Uses for a brick? (closest)",opts:["2-3","4-6","7-10","10+"],ans:3},
      {q:"When facing a problem, you first:",opts:["Follow steps","Ask others","Create new solutions","Avoid it"],ans:2},
      {q:"You prefer projects that:",opts:["Have clear guidelines","Let you improvise","Follow templates","Have strict rules"],ans:1},
      {q:"Ideal work environment:",opts:["Quiet & structured","Dynamic & flexible","Remote & solo","Team & collaborative"],ans:1},
      {q:"When reading, you prefer:",opts:["Textbooks","Fiction","News","Visual infographics"],ans:3},
    ]},
  {id:"social",title:"Social & Leadership",subtitle:"Teamwork & Interpersonal Skills",color:C.mint,
    questions:[
      {q:"In a group project, you usually:",opts:["Lead & delegate","Support others","Work alone","Coordinate & mediate"],ans:0},
      {q:"How do you handle conflict?",opts:["Avoid it","Address directly","Seek compromise","Ask someone else"],ans:2},
      {q:"You feel most energized when:",opts:["Alone","With close friends","In large groups","On stage"],ans:2},
      {q:"Others describe you as:",opts:["Reserved","Outgoing","Thoughtful","Unpredictable"],ans:1},
      {q:"Explaining something difficult?",opts:["Use analogies","Use data","Show visuals","All of these"],ans:3},
    ]},
];

const HOBBY_OPTIONS = ["Coding","Gaming","Reading","Writing","Music","Drawing/Art","Sports","Cooking","Photography","Travel","Science Experiments","Volunteering","Debating","Robotics","Fashion","Business/Trading"];
const SUBJECT_OPTIONS = ["Mathematics","Physics","Chemistry","Biology","Computer Science","Literature","History","Geography","Economics","Psychology","Fine Arts","Physical Education","Philosophy","Sociology"];

const GOVT_EXAMS = [
  {category:"Engineering",color:C.sky,exams:[
    {name:"JEE Main",body:"NTA",elig:"12th PCM",level:"National",for:"NITs / IIITs / CFTIs"},
    {name:"JEE Advanced",body:"IITs",elig:"JEE Main top 2.5L",level:"National",for:"IITs"},
    {name:"BITSAT",body:"BITS Pilani",elig:"12th PCM 75%+",level:"National",for:"BITS Pilani/Goa/Hyderabad"},
    {name:"VITEEE",body:"VIT",elig:"12th PCM",level:"National",for:"VIT campuses"},
    {name:"KEAM",body:"CEE Kerala",elig:"12th PCM",level:"State",for:"Kerala Engineering Colleges"},
    {name:"KCET",body:"KEA",elig:"12th PCM",level:"State",for:"Karnataka Engineering"},
    {name:"MHT CET",body:"Maharashtra",elig:"12th PCM",level:"State",for:"Maharashtra Engineering"},
    {name:"GATE",body:"IIT/IISc",elig:"B.Tech/B.E.",level:"National",for:"M.Tech / PSU Jobs"},
  ]},
  {category:"Medical",color:C.mint,exams:[
    {name:"NEET UG",body:"NTA",elig:"12th PCB min 50%",level:"National",for:"MBBS / BDS / BAMS / BHMS"},
    {name:"NEET PG",body:"NBE",elig:"MBBS + internship",level:"National",for:"MD / MS specializations"},
    {name:"AIIMS PG",body:"AIIMS",elig:"MBBS",level:"National",for:"AIIMS super specialty"},
    {name:"JIPMER",body:"JIPMER",elig:"12th PCB 60%+",level:"National",for:"JIPMER MBBS"},
  ]},
  {category:"UPSC",color:C.gold,exams:[
    {name:"UPSC CSE",body:"UPSC",elig:"Any degree, age 21-32",level:"National",for:"IAS / IPS / IFS / IRS — 24 services"},
    {name:"UPSC CDS",body:"UPSC",elig:"Graduate, age 19-25",level:"National",for:"IMA / OTA / AFA / INA officer"},
    {name:"UPSC NDA",body:"UPSC",elig:"12th PCM, age 16.5-19.5",level:"National",for:"National Defence Academy cadet"},
    {name:"UPSC CAPF AC",body:"UPSC",elig:"Graduate",level:"National",for:"BSF/CRPF/CISF/ITBP/SSB Asst Commandant"},
    {name:"UPSC ESE / IES",body:"UPSC",elig:"B.Tech/B.E.",level:"National",for:"Engineering Services Civil/Mech/Elec/E&T"},
    {name:"UPSC CMS",body:"UPSC",elig:"MBBS",level:"National",for:"Central Health Services doctor"},
    {name:"UPSC CISF AC",body:"UPSC",elig:"B.Tech / Graduate",level:"National",for:"CISF Assistant Commandant"},
    {name:"UPSC SO/Steno",body:"UPSC",elig:"Graduate",level:"National",for:"Section Officer / Stenographer Grade B"},
    {name:"UPSC SCRA",body:"UPSC",elig:"12th PCM, age 17-21",level:"National",for:"Special Class Railway Apprentice"},
  ]},
  {category:"State PSC",color:C.teal,exams:[
    {name:"Kerala PSC",body:"KPSC",elig:"Varies by post",level:"State",for:"All Kerala Government posts"},
    {name:"TNPSC Group 1",body:"TNPSC",elig:"Graduate",level:"State",for:"TN Deputy Collector / DSP"},
    {name:"TNPSC Group 2",body:"TNPSC",elig:"Graduate/12th",level:"State",for:"TN sub-officer posts"},
    {name:"MPPSC",body:"MPPSC",elig:"Graduate",level:"State",for:"MP Civil Services"},
    {name:"UPPSC PCS",body:"UPPSC",elig:"Graduate",level:"State",for:"UP Civil Services SDM/DSP"},
    {name:"BPSC",body:"BPSC",elig:"Graduate",level:"State",for:"Bihar Civil Services"},
    {name:"KPSC Karnataka",body:"KPSC",elig:"Graduate",level:"State",for:"Karnataka Admin Service KAS"},
    {name:"RPSC RAS",body:"RPSC",elig:"Graduate",level:"State",for:"Rajasthan Administrative Service"},
  ]},
  {category:"Defence",color:"#ef4444",exams:[
    {name:"NDA",body:"UPSC",elig:"12th, age 16.5-19.5",level:"National",for:"National Defence Academy"},
    {name:"CDS",body:"UPSC",elig:"Graduate",level:"National",for:"IMA / OTA / AFA / INA officer"},
    {name:"AFCAT",body:"IAF",elig:"Graduate",level:"National",for:"Air Force officer Flying/GD/Edu"},
    {name:"SSC GD",body:"SSC",elig:"10th pass",level:"National",for:"BSF/CISF/CRPF constable"},
    {name:"SSC CPO SI",body:"SSC",elig:"Graduate",level:"National",for:"Delhi Police / CAPF Sub-Inspector"},
    {name:"Indian Coast Guard",body:"CG HQ",elig:"12th/B.Tech",level:"National",for:"Navik / Yantrik / Asst Commandant"},
    {name:"Agniveer Army",body:"Indian Army",elig:"10th/12th, age 17.5-21",level:"National",for:"4-year Army service Soldier"},
    {name:"Agniveer Navy",body:"Indian Navy",elig:"10th/12th",level:"National",for:"4-year Navy service Sailor"},
    {name:"Agniveer Air Force",body:"IAF",elig:"12th PCM",level:"National",for:"4-year Air Force service"},
  ]},
  {category:"Banking",color:C.lavender,exams:[
    {name:"SBI PO",body:"SBI",elig:"Graduate, age 21-30",level:"National",for:"State Bank of India Probationary Officer"},
    {name:"SBI Clerk",body:"SBI",elig:"Graduate",level:"National",for:"SBI Junior Associate"},
    {name:"IBPS PO",body:"IBPS",elig:"Graduate",level:"National",for:"All nationalised banks PO"},
    {name:"IBPS Clerk",body:"IBPS",elig:"Graduate",level:"National",for:"Bank clerk posts"},
    {name:"IBPS SO",body:"IBPS",elig:"Graduate + specialisation",level:"National",for:"Specialist Officer IT/Law/HR/Marketing"},
    {name:"RBI Grade B",body:"RBI",elig:"Graduate 60%+",level:"National",for:"Reserve Bank of India Officer"},
    {name:"NABARD Grade A",body:"NABARD",elig:"Graduate/PG",level:"National",for:"Agricultural dev bank officer"},
    {name:"LIC AAO",body:"LIC",elig:"Graduate",level:"National",for:"Life Insurance Corporation Asst Officer"},
    {name:"SEBI Grade A",body:"SEBI",elig:"Graduate",level:"National",for:"Securities & Exchange Board officer"},
  ]},
  {category:"Railways & SSC",color:C.orange,exams:[
    {name:"RRB NTPC",body:"RRB",elig:"Graduate/12th",level:"National",for:"Station Master / Clerk / Goods Guard"},
    {name:"RRB JE",body:"RRB",elig:"Diploma/B.Tech",level:"National",for:"Junior Engineer"},
    {name:"RRB ALP",body:"RRB",elig:"ITI/Diploma",level:"National",for:"Loco Pilot / Technician"},
    {name:"RRB Group D",body:"RRB",elig:"10th/ITI",level:"National",for:"Track Maintainer / Helper / Porter"},
    {name:"SSC CGL",body:"SSC",elig:"Graduate",level:"National",for:"Central Govt Group B & C posts"},
    {name:"SSC CHSL",body:"SSC",elig:"12th pass",level:"National",for:"LDC / DEO / PA / SA"},
    {name:"SSC MTS",body:"SSC",elig:"10th pass",level:"National",for:"Multi Tasking Staff"},
    {name:"SSC JE",body:"SSC",elig:"Diploma/B.Tech",level:"National",for:"Junior Engineer Civil/Mech/Elec"},
    {name:"SSC Steno",body:"SSC",elig:"12th pass",level:"National",for:"Stenographer Grade C & D"},
  ]},
  {category:"Law & Judiciary",color:C.pink,exams:[
    {name:"CLAT",body:"Consortium",elig:"12th any stream 45%+",level:"National",for:"NLU BA LLB / LLM"},
    {name:"AILET",body:"NLU Delhi",elig:"12th any stream",level:"National",for:"NLU Delhi BA LLB"},
    {name:"LSAT India",body:"LSAC",elig:"12th/Graduate",level:"National",for:"Private law schools LLB/LLM"},
    {name:"PCS-J",body:"State HCs",elig:"LLB",level:"State",for:"Civil Judge / Munsiff all states"},
    {name:"APO",body:"State PSC",elig:"LLB, age 21-35",level:"State",for:"Assistant Public Prosecutor"},
    {name:"Bar Enrollment",body:"Bar Council",elig:"LLB pass",level:"State",for:"Advocate license to practice"},
  ]},
  {category:"Teaching",color:"#a855f7",exams:[
    {name:"CTET",body:"CBSE",elig:"Grad + B.Ed or D.El.Ed",level:"National",for:"Central school teacher Class 1-8"},
    {name:"TET State",body:"State Boards",elig:"Grad + B.Ed",level:"State",for:"State government school teacher"},
    {name:"KVS TGT/PGT",body:"KVS",elig:"Grad/PG + B.Ed",level:"National",for:"Kendriya Vidyalaya teacher"},
    {name:"NVS TGT/PGT",body:"NVS",elig:"Grad/PG + B.Ed",level:"National",for:"Navodaya Vidyalaya teacher"},
    {name:"UGC NET",body:"NTA",elig:"PG 55%+",level:"National",for:"Assistant Professor / JRF PhD fellowship"},
    {name:"DSSSB TGT/PGT",body:"DSSSB",elig:"Grad/PG + B.Ed",level:"State",for:"Delhi Govt school teacher"},
  ]},
];

const st = {
  card:(bl=C.cardBorder)=>({background:C.card,border:`1px solid ${bl}`,borderRadius:"16px",padding:"18px",marginBottom:"12px"}),
  btn:(col=C.accent)=>({background:col,color:"#fff",border:"none",borderRadius:"10px",padding:"11px 20px",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}),
  btnOut:{background:"transparent",color:C.textSecondary,border:`1px solid ${C.cardBorder}`,borderRadius:"10px",padding:"9px 16px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"},
  tag:(on,col=C.accent)=>({padding:"6px 12px",borderRadius:"20px",fontSize:"11px",cursor:"pointer",border:`1px solid ${on?col:C.cardBorder}`,background:on?`${col}22`:"transparent",color:on?col:C.textSecondary,fontWeight:on?600:400,fontFamily:"inherit"}),
  input:{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px",padding:"10px 13px",color:C.textPrimary,fontSize:"13px",width:"100%",boxSizing:"border-box",fontFamily:"inherit",outline:"none"},
};
const PBar=({pct,col=C.accent})=>(
  <div style={{height:"4px",background:C.cardBorder,borderRadius:"2px",overflow:"hidden",marginBottom:"18px"}}>
    <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${col},#8b5cf6)`,transition:"width .5s",borderRadius:"2px"}}/>
  </div>
);
const Badge=({text,col})=>(<span style={{fontSize:"10px",padding:"2px 8px",borderRadius:"20px",background:`${col}20`,color:col,fontWeight:600}}>{text}</span>);
const splitPipe=v=>v?String(v).split("|").map(s=>s.trim()).filter(Boolean):[];
const splitSemi=v=>v?String(v).split(";").map(s=>s.trim()).filter(Boolean):[];

export default function App() {
  const [session,setSession]=useState("home");

  // ── Basic career assessment state ──
  const [step,setStep]=useState(0);
  const [modIdx,setModIdx]=useState(0);
  const [qIdx,setQIdx]=useState(0);
  const [answers,setAnswers]=useState({});
  const [scores,setScores]=useState({});   // {analytical:85, numeric:70, ...}
  const [hobbies,setHobbies]=useState([]);
  const [subjects,setSubjects]=useState([]);
  const [grades,setGrades]=useState({math:75,science:75,lang:75,social:75,cs:75});
  const [careerResults,setCareerResults]=useState([]);  // basic career matches

  // ── Basic course test state (separate from career) ──
  const [courseStep,setCourseStep]=useState(0);
  const [courseModIdx,setCourseModIdx]=useState(0);
  const [courseQIdx,setCourseQIdx]=useState(0);
  const [courseAnswers,setCourseAnswers]=useState({});
  const [courseScores,setCourseScores]=useState({});
  const [courseResults,setCourseResults]=useState([]);  // basic abroad matches

  // ── Advanced analysis state (separate for career vs course) ──
  const [advCareerResults,setAdvCareerResults]=useState([]);   // adv career
  const [advCourseResults,setAdvCourseResults]=useState([]);   // adv abroad
  const [advCareerTraits,setAdvCareerTraits]=useState({});
  const [advCourseTraits,setAdvCourseTraits]=useState({});

  // ── Results tab sub-tab ──
  const [resultsTab,setResultsTab]=useState("career");     // "career" | "course"
  const [advResultsTab,setAdvResultsTab]=useState("career"); // "career" | "course"

  // ── Explore / pathway / other state ──
  const [expCat,setExpCat]=useState("all");
  const [expSearch,setExpSearch]=useState("");
  const [pathSearch,setPathSearch]=useState("");
  const [pathCareer,setPathCareer]=useState(null);
  const [abroadField,setAbroadField]=useState("all");
  const [abroadLevel,setAbroadLevel]=useState("all");
  const [govtTab,setGovtTab]=useState("exams");
  const [govtExamCat,setGovtExamCat]=useState("all");
  const [govtSearch,setGovtSearch]=useState("");
  const [jobCat,setJobCat]=useState("all");
  const [resume,setResume]=useState({name:"",email:"",phone:"",dob:"",address:"",objective:"",edu:"",skills:"",expType:"fresher",experience:"",projects:"",achievements:"",languages:"",jd:""});
  const [resumeSaved,setResumeSaved]=useState(false);
  const [atsScore,setAtsScore]=useState(null);
  const [atsMatched,setAtsMatched]=useState([]);
  const [atsMissing,setAtsMissing]=useState([]);
  const [resumeGenerated,setResumeGenerated]=useState(false);
  const [generatingResume,setGeneratingResume]=useState(false);

  // ── Study Planner state (top-level so hooks rules are satisfied) ──────────
  const [planTab,setPlanTab]=useState("goals");
  const [goals,setGoals]=useState([
    {id:1,text:"Complete Career Assessment",done:true,period:"daily",priority:"high"},
    {id:2,text:"Study Mathematics for 2 hours",done:false,period:"daily",priority:"high"},
    {id:3,text:"Read 20 pages of chosen book",done:false,period:"daily",priority:"medium"},
    {id:4,text:"Revise Physics notes",done:false,period:"weekly",priority:"medium"},
  ]);
  const [newGoal,setNewGoal]=useState("");
  const [newPeriod,setNewPeriod]=useState("daily");
  const [newPriority,setNewPriority]=useState("high");
  const [planExams,setPlanExams]=useState([
    {id:1,name:"JEE Main 2025",date:"2025-04-02",color:C.sky},
    {id:2,name:"NEET 2025",date:"2025-05-04",color:C.mint},
    {id:3,name:"Kerala PSC Prelim",date:"2025-06-15",color:C.gold},
  ]);
  const [newExam,setNewExam]=useState({name:"",date:""});
  const [schedule,setSchedule]=useState([
    {id:1,day:"Monday",    subject:"Mathematics",time:"06:00",dur:"2h",col:C.sky},
    {id:2,day:"Monday",    subject:"Physics",    time:"08:00",dur:"1.5h",col:C.teal},
    {id:3,day:"Tuesday",   subject:"Chemistry",  time:"06:00",dur:"2h",col:C.mint},
    {id:4,day:"Tuesday",   subject:"English",    time:"08:00",dur:"1h",col:C.lavender},
    {id:5,day:"Wednesday", subject:"Mathematics",time:"06:00",dur:"2h",col:C.sky},
    {id:6,day:"Thursday",  subject:"Biology",    time:"06:00",dur:"2h",col:C.gold},
    {id:7,day:"Friday",    subject:"Revision",   time:"06:00",dur:"3h",col:C.accent},
    {id:8,day:"Saturday",  subject:"Mock Test",  time:"09:00",dur:"3h",col:C.orange},
  ]);
  const [newSched,setNewSched]=useState({day:"Monday",subject:"",time:"06:00",dur:"1h"});
  const [habits,setHabits]=useState([
    {id:1,name:"Morning Study",icon:"📖",streak:5,target:7,days:[1,1,1,1,1,0,0]},
    {id:2,name:"Exercise",icon:"🏃",streak:3,target:5,days:[1,1,1,0,0,0,0]},
    {id:3,name:"Revise Notes",icon:"📝",streak:7,target:7,days:[1,1,1,1,1,1,1]},
    {id:4,name:"No Social Media",icon:"📵",streak:2,target:5,days:[1,1,0,0,0,0,0]},
    {id:5,name:"Sleep by 10PM",icon:"😴",streak:4,target:7,days:[1,1,1,1,0,0,0]},
  ]);
  const [newHabit,setNewHabit]=useState({name:"",icon:"📖",target:7});

  const progressPct=step===4?Math.round(((modIdx*5+qIdx)/25)*100):step>=5?100:Math.round((step/5)*100);

  // ── Career matching (basic) ───────────────────────────────────────────────
  const matchCareers=(sc,hob)=>{
    const fs={analytical:(sc.analytical||50)/100,numeric:(sc.numeric||50)/100,verbal:(sc.verbal||50)/100,creative:(sc.creative||50)/100,social:(sc.social||50)/100};
    return CAREER_DATA.map(career=>{
      const diff=Math.abs(fs.analytical-(career.analytical_required||0.5))+Math.abs(fs.numeric-(career.numerical_required||0.5))+Math.abs(fs.verbal-(career.communication_required||0.5))+Math.abs(fs.creative-(career.creativity_required||0.5))+Math.abs(fs.social-(career.social_required||0.5));
      const hb=hob.filter(h=>{const cat=career.Category;if(cat==="IT & Computer")return["Coding","Robotics","Gaming"].includes(h);if(cat==="Media & Creative")return["Drawing/Art","Music","Photography","Writing"].includes(h);if(cat==="Business & Finance")return["Business/Trading","Debating"].includes(h);return false;}).length*0.05;
      return{...career,match:Math.min(99,Math.round((1-diff/5)*100+hb*100))};
    }).sort((a,b)=>b.match-a.match);
  };

  // ── Abroad matching (basic) ───────────────────────────────────────────────
  const matchAbroad=(sc)=>{
    const fs={analytical:(sc.analytical||50)/100,numeric:(sc.numeric||50)/100,verbal:(sc.verbal||50)/100,creative:(sc.creative||50)/100,social:(sc.social||50)/100};
    return ABROAD_DATA.map((prog,i)=>{
      const analDiff=Math.abs(fs.analytical-(prog.analytical_score||5)/10);
      const mathDiff=Math.abs(fs.numeric-(prog.math_score||5)/10);
      const creatDiff=Math.abs(fs.creative-(prog.creativity_score||5)/10);
      const commDiff=Math.abs(fs.verbal-(prog.communication_score||5)/10);
      const socDiff=Math.abs(fs.social-(prog.social_score||5)/10);
      const avg=(analDiff+mathDiff+creatDiff+commDiff+socDiff)/5;
      const match=Math.min(99,Math.round((1-avg)*80+((prog.demand_score||5)/10)*10+5));
      return{...prog,id:`abroad_${i}`,match};
    }).sort((a,b)=>b.match-a.match);
  };

  // ── Save CSV ──────────────────────────────────────────────────────────────
  const saveCareerCSV=(sc,matched)=>{
    const top=matched.slice(0,5).map(c=>c.Career_name||"");
    while(top.length<5)top.push("");
    const row=[grades.math,grades.science,grades.lang,grades.social,grades.cs,
      sc.analytical||0,sc.numeric||0,sc.verbal||0,sc.creative||0,sc.social||0,
      top[0],top[1],top[2],top[3],top[4]].join(",");
    const hdr="grade_math,grade_science,grade_lang,grade_social,grade_cs,score_analytical,score_numeric,score_verbal,score_creative,score_social,top_career_1,top_career_2,top_career_3,top_career_4,top_career_5";
    const existing=localStorage.getItem("cc_career")||hdr;
    localStorage.setItem("cc_career",existing+"\n"+row);
  };

  const saveCourseCSV=(sc,matched)=>{
    const top=matched.slice(0,5).map(c=>c.degree_name||"");
    while(top.length<5)top.push("");
    const row=[grades.math,grades.science,grades.lang,grades.social,grades.cs,
      sc.analytical||0,sc.numeric||0,sc.verbal||0,sc.creative||0,sc.social||0,
      top[0],top[1],top[2],top[3],top[4]].join(",");
    const hdr="grade_math,grade_science,grade_lang,grade_social,grade_cs,score_analytical,score_numeric,score_verbal,score_creative,score_social,top_course_1,top_course_2,top_course_3,top_course_4,top_course_5";
    const existing=localStorage.getItem("cc_course")||hdr;
    localStorage.setItem("cc_course",existing+"\n"+row);
  };

  const downloadCareerCSV=()=>{
    const d=localStorage.getItem("cc_career")||"No career assessment data yet.";
    const b=new Blob([d],{type:"text/csv"});const u=URL.createObjectURL(b);
    const a=document.createElement("a");a.href=u;a.download="career_results.csv";a.click();
  };

  const downloadCourseCSV=()=>{
    const d=localStorage.getItem("cc_course")||"No course test data yet.";
    const b=new Blob([d],{type:"text/csv"});const u=URL.createObjectURL(b);
    const a=document.createElement("a");a.href=u;a.download="course_results.csv";a.click();
  };

  // ── BASIC CAREER ASSESSMENT ───────────────────────────────────────────────
  const handleAnswer=(optIdx)=>{
    const mod=ASSESSMENT_MODULES[modIdx];
    const key=`${mod.id}_${qIdx}`;
    // No correct answer highlighting — just record selection
    const newAns={...answers,[key]:{selected:optIdx,correct:optIdx===mod.questions[qIdx].ans}};
    setAnswers(newAns);
    setTimeout(()=>{
      if(qIdx<mod.questions.length-1){setQIdx(q=>q+1);return;}
      const modScore=Object.entries(newAns).filter(([k])=>k.startsWith(mod.id)).filter(([,v])=>v.correct).length;
      const newScores={...scores,[mod.id]:Math.round((modScore/mod.questions.length)*100)};
      setScores(newScores);
      if(modIdx<ASSESSMENT_MODULES.length-1){setModIdx(m=>m+1);setQIdx(0);}
      else{
        const matched=matchCareers(newScores,hobbies);
        setCareerResults(matched);
        saveCareerCSV(newScores,matched);
        setStep(5);setSession("results");setResultsTab("career");
      }
    },350);
  };

  // ── BASIC COURSE TEST (reuses same questions for now) ────────────────────
  const handleCourseAnswer=(optIdx)=>{
    const mod=ASSESSMENT_MODULES[courseModIdx];
    const key=`${mod.id}_${courseQIdx}`;
    const newAns={...courseAnswers,[key]:{selected:optIdx,correct:optIdx===mod.questions[courseQIdx].ans}};
    setCourseAnswers(newAns);
    setTimeout(()=>{
      if(courseQIdx<mod.questions.length-1){setCourseQIdx(q=>q+1);return;}
      const modScore=Object.entries(newAns).filter(([k])=>k.startsWith(mod.id)).filter(([,v])=>v.correct).length;
      const newScores={...courseScores,[mod.id]:Math.round((modScore/mod.questions.length)*100)};
      setCourseScores(newScores);
      if(courseModIdx<ASSESSMENT_MODULES.length-1){setCourseModIdx(m=>m+1);setCourseQIdx(0);}
      else{
        const matched=matchAbroad(newScores);
        setCourseResults(matched);
        saveCourseCSV(newScores,matched);
        setCourseStep(5);setSession("results");setResultsTab("course");
      }
    },350);
  };

  // ── Resume download as txt ────────────────────────────────────────────────
  const downloadResume=()=>{
    const expLabel=resume.expType==="fresher"?"FRESHER":resume.expType==="internship"?"INTERNSHIP EXPERIENCE":"WORK EXPERIENCE";
    const txt=`CAREER COMPASS — STUDENT RESUME\n${"=".repeat(50)}\nNAME: ${resume.name}\nEMAIL: ${resume.email}  |  PHONE: ${resume.phone}\nDOB: ${resume.dob}  |  ADDRESS: ${resume.address}\n\nCAREER OBJECTIVE\n${"-".repeat(30)}\n${resume.objective||"Not provided"}\n\nEDUCATION\n${"-".repeat(30)}\n${resume.edu}\n\nSKILLS\n${"-".repeat(30)}\n${resume.skills}\n\n${expLabel}\n${"-".repeat(30)}\n${resume.expType==="fresher"?"Fresher — seeking first opportunity.":resume.experience||"–"}\n\nPROJECTS\n${"-".repeat(30)}\n${resume.projects||"–"}\n\nACHIEVEMENTS\n${"-".repeat(30)}\n${resume.achievements}\n\nLANGUAGES\n${"-".repeat(30)}\n${resume.languages}\n\n${resume.jd?`TARGET JOB DESCRIPTION\n${"-".repeat(30)}\n${resume.jd}`:""}\n`;
    const b=new Blob([txt],{type:"text/plain"});const u=URL.createObjectURL(b);
    const a=document.createElement("a");a.href=u;a.download=`resume_${resume.name||"student"}.txt`;a.click();
    setResumeSaved(true);
  };

  // ── ATS keyword extractor ────────────────────────────────────────────────
  const escapeRTF=(str)=>{
    if(!str)return"";
    return String(str).replace(/\\/g,"\\\\").replace(/\{/g,"\\{").replace(/\}/g,"\\}").replace(/[\u0080-\uffff]/g,c=>`\\u${c.charCodeAt(0)}?`);
  };

  const extractKeywords=(jdText)=>{
    if(!jdText)return[];
    const SKILLS=new Set([
      // Programming languages
      "python","java","javascript","typescript","c","ruby","golang","swift","kotlin","php","scala","rust","dart","perl","bash","matlab","r",
      // Web & frameworks
      "html","css","react","angular","vue","nextjs","nodejs","express","django","flask","fastapi","spring","jquery","bootstrap","tailwind","redux","graphql","webpack","vite","sass",
      // Mobile
      "android","ios","flutter","reactnative","xamarin",
      // Databases
      "sql","mysql","postgresql","mongodb","sqlite","oracle","redis","firebase","cassandra","dynamodb","elasticsearch","nosql",
      // Cloud & DevOps
      "aws","azure","gcp","docker","kubernetes","jenkins","git","github","gitlab","linux","terraform","ansible","nginx","heroku","vercel","devops",
      // Data / ML / AI
      "machine learning","deep learning","nlp","computer vision","tensorflow","pytorch","keras","scikit-learn","pandas","numpy","matplotlib","tableau","powerbi","hadoop","spark","airflow","llm","langchain","data analysis","data science",
      // Design
      "figma","photoshop","illustrator","canva","ux","ui","wireframe","adobe","sketch",
      // Office & tools
      "excel","word","powerpoint","ms office","jira","confluence","notion","slack","trello","asana","postman","swagger","selenium","pytest","jest","cypress",
      // Soft skills
      "leadership","communication","teamwork","collaboration","problem solving","critical thinking","analytical","creativity","adaptability","time management","project management","presentation","negotiation","mentoring","research","documentation","multitasking","decision making","public speaking","attention to detail","interpersonal","planning","coordination",
      // Domain
      "finance","accounting","marketing","sales","operations","supply chain","logistics","healthcare","legal","business analysis","product management","customer service","content writing","seo","digital marketing","social media","auditing","investment","banking","insurance","pharmaceutical","manufacturing","civil","mechanical","electrical","electronics","telecommunications","cybersecurity","networking","encryption","testing","qa","automation","agile","scrum","kanban","microservices","api","blockchain","iot","embedded",
    ]);
    const text=jdText.toLowerCase().replace(/[^a-z0-9\s\+\#\.\-\/]/g," ");
    const found=new Set();
    // Multi-word skills first
    SKILLS.forEach(skill=>{if(skill.includes(" ")&&text.includes(skill))found.add(skill);});
    // Single word skills
    text.split(/\s+/).forEach(w=>{const c=w.replace(/[^a-z0-9\+\#\.]/g,"");if(c.length>1&&SKILLS.has(c))found.add(c);});
    // Uppercase abbreviations (AWS, SQL, API etc)
    const abbrs=[...jdText.matchAll(/\b([A-Z]{2,8})\b/g)].map(m=>m[1].toLowerCase());
    abbrs.forEach(a=>{if(SKILLS.has(a))found.add(a);});
    return[...found].slice(0,40);
  };

  const generateATS=()=>{
    setGeneratingResume(true);
    setTimeout(()=>{
      const jdKws=extractKeywords(resume.jd);
      const resumeText=[resume.objective,resume.skills,resume.experience,resume.projects,resume.achievements,resume.edu].join(" ").toLowerCase();
      const matched=jdKws.filter(kw=>resumeText.includes(kw));
      const missing=jdKws.filter(kw=>!resumeText.includes(kw)).slice(0,12);
      const score=jdKws.length>0?Math.min(98,Math.round((matched.length/jdKws.length)*100)):null;
      setAtsScore(score);
      setAtsMatched(matched);
      setAtsMissing(missing);
      setResumeGenerated(true);
      setGeneratingResume(false);
    },600);
  };

  const downloadResumeDOCX=()=>{
    const expLabel=resume.expType==="fresher"?"Fresher (Seeking First Opportunity)":resume.expType==="internship"?"Internship Experience":"Work Experience";
    const skillsArr=resume.skills.split(",").map(s=>s.trim()).filter(Boolean);
    const jdKws=extractKeywords(resume.jd);
    const resumeText=[resume.objective,resume.skills,resume.experience,resume.projects,resume.achievements].join(" ").toLowerCase();
    const matchedKws=jdKws.filter(kw=>resumeText.includes(kw));

    const e=escapeRTF;
    const secHeader=(t)=>`\\pard\\sb200\\brdrb\\brdrs\\brdrw8\\brdrclr2 {\\f0\\fs22\\b\\cf2 ${e(t)}}\\par\\pard\\sb0`;
    const bullet=(t)=>`\\pard\\sb40\\li360\\fi-240{\\f0\\fs20 \\bullet  ${e(t)}}\\par`;
    const para=(t)=>`\\pard\\sb50{\\f0\\fs20 ${e(t)}}\\par`;

    const expLines=resume.expType==="fresher"
      ?[`Fresher — seeking first professional opportunity. Strong academic foundation with project experience.`]
      :(resume.experience||"").split("\n").filter(Boolean);

    const lines=[
      "{\\rtf1\\ansi\\deff0",
      "{\\fonttbl{\\f0 Calibri;}}",
      "{\\colortbl ;\\red27\\green58\\blue107;\\red14\\green116\\blue161;\\red22\\green163\\blue74;}",
      "\\paperw12240\\paperh15840\\margl1440\\margr1440\\margt1000\\margb1000",
      // Header block
      `\\pard\\qc\\sb60{\\f0\\fs52\\b\\cf1 ${e(resume.name||"Your Name")}}\\par`,
      resume.objective?`\\pard\\qc\\sb40{\\f0\\fs20\\i\\cf2 ${e(resume.objective.slice(0,120)+"...")}}\\par`:"",
      `\\pard\\qc\\sb40{\\f0\\fs18 ${[resume.phone,resume.email,resume.address,resume.dob].filter(Boolean).map(e).join("   |   ")}}\\par`,
      `\\pard\\sb60\\brdrb\\brdrs\\brdrw20\\brdrclr1 \\par`,
      // Objective
      resume.objective?secHeader("CAREER OBJECTIVE")+para(resume.objective)+"\\pard\\sb60\\brdrb\\brdrs\\brdrw6\\brdrclr2 \\par":"",
      // Education
      secHeader("EDUCATION"),
      ...resume.edu.split("\n").filter(Boolean).map(l=>para(l)),
      `\\pard\\sb60\\brdrb\\brdrs\\brdrw6\\brdrclr2 \\par`,
      // Skills
      skillsArr.length?secHeader("SKILLS")+`\\pard\\sb50{\\f0\\fs20 ${skillsArr.map(e).join("   \\u8226?   ")}}\\par\\pard\\sb60\\brdrb\\brdrs\\brdrw6\\brdrclr2 \\par`:"",
      // Experience
      secHeader(expLabel.toUpperCase()),
      ...expLines.map(l=>l.trim().startsWith("-")||l.trim().startsWith("•")||l.trim().startsWith("*")?bullet(l.replace(/^[-•*]\s*/,"")): para(l)),
      `\\pard\\sb60\\brdrb\\brdrs\\brdrw6\\brdrclr2 \\par`,
      // Projects
      resume.projects?secHeader("PROJECTS")+resume.projects.split("\n").filter(Boolean).map((l,i)=>{
        const isBullet=l.trim().startsWith("-")||l.trim().startsWith("•")||l.trim().startsWith("*");
        const isNum=/^\d+\./.test(l.trim());
        return isBullet?bullet(l.replace(/^[-•*]\s*/,"")):isNum?`\\pard\\sb80\\li0{\\f0\\fs20\\b ${e(l)}}\\par`:para(l);
      }).join("")+`\\pard\\sb60\\brdrb\\brdrs\\brdrw6\\brdrclr2 \\par`:"",
      // Achievements
      resume.achievements?secHeader("ACHIEVEMENTS & EXTRACURRICULARS")+resume.achievements.split("\n").filter(Boolean).map(l=>bullet(l.replace(/^[-•*]\s*/,""))).join("")+`\\pard\\sb60\\brdrb\\brdrs\\brdrw6\\brdrclr2 \\par`:"",
      // Languages
      resume.languages?secHeader("LANGUAGES")+para(resume.languages)+`\\pard\\sb60\\brdrb\\brdrs\\brdrw6\\brdrclr2 \\par`:"",
      // ATS Keywords section
      matchedKws.length?secHeader("CORE COMPETENCIES")+`\\pard\\sb50{\\f0\\fs20 ${matchedKws.map(k=>k.charAt(0).toUpperCase()+k.slice(1)).map(e).join("   |   ")}}\\par`:"",
      "}"
    ].filter(Boolean).join("\n");

    const blob=new Blob([lines],{type:"application/rtf"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`ATS_Resume_${(resume.name||"Student").replace(/\s+/g,"_")}.rtf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Derived data ──────────────────────────────────────────────────────────
  const abroadFields=useMemo(()=>["all",...new Set(ABROAD_DATA.map(a=>a.field))].sort(),[]);
  const abroadLevels=useMemo(()=>["all",...new Set(ABROAD_DATA.map(a=>a.program_level))].sort(),[]);
  const filteredAbroad=useMemo(()=>ABROAD_DATA.filter(a=>(abroadField==="all"||a.field===abroadField)&&(abroadLevel==="all"||a.program_level===abroadLevel)),[abroadField,abroadLevel]);
  const filteredCareers=useMemo(()=>{let d=CAREER_DATA;if(expCat!=="all")d=d.filter(c=>c.Category===expCat);if(expSearch)d=d.filter(c=>c.Career_name.toLowerCase().includes(expSearch.toLowerCase()));return d;},[expCat,expSearch]);
  const pathResults=useMemo(()=>{if(!pathSearch||pathSearch.length<2)return[];return PATHWAY_DATA.filter(p=>p.Career_name.toLowerCase().includes(pathSearch.toLowerCase())).slice(0,8);},[pathSearch]);
  const jobData=useMemo(()=>{let d=CAREER_DATA.filter(c=>c.demand_score);if(jobCat!=="all")d=d.filter(c=>c.Category===jobCat);return[...d].sort((a,b)=>b.demand_score-a.demand_score).slice(0,30);},[jobCat]);

  const navTo=(sess,careerName)=>{if(careerName){const pw=PATHWAY_DATA.find(p=>p.Career_name===careerName)||null;setPathCareer(pw);setPathSearch(careerName);}setSession(sess);};

  // ════════ RENDERS ════════════════════════════════════════════════════════

  // ── HOME ──────────────────────────────────────────────────────────────────
  const renderHome=()=>(
    <div>
      <div style={{textAlign:"center",padding:"24px 0 18px"}}>
        <div style={{fontSize:"10px",letterSpacing:"3px",color:C.accent,textTransform:"uppercase",marginBottom:"8px"}}>Your Future Starts Here</div>
        <h1 style={{fontSize:"30px",fontWeight:700,margin:"0 0 8px",lineHeight:1.2,background:`linear-gradient(135deg,${C.textPrimary},${C.lavender})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>CareerCompass AI</h1>
        <p style={{color:C.textSecondary,fontSize:"13px",maxWidth:"440px",margin:"0 auto 12px",lineHeight:1.6}}><strong style={{color:C.textPrimary}}>214 career roles</strong> · <strong style={{color:C.textPrimary}}>354 abroad programs</strong> · AI-powered guidance for students</p>
        <div style={{display:"flex",gap:"6px",justifyContent:"center",flexWrap:"wrap",marginBottom:"18px"}}>
          {[["214 Careers",C.sky],["354 Abroad Programs",C.lavender],["15-Module Advanced Test",C.lavender],["ML Data Collection",C.mint]].map(([t,col])=>(<span key={t} style={{fontSize:"10px",padding:"3px 9px",borderRadius:"20px",background:`${col}20`,color:col,fontWeight:600}}>{t}</span>))}
        </div>
        <div style={{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap"}}>
          <button style={st.btn()} onClick={()=>{setSession("assessment");setStep(0);}}>Career Assessment →</button>
          <button style={st.btn(C.lavender)} onClick={()=>{setSession("coursetest");setCourseStep(0);}}>Course Test →</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:"9px"}}>
        {[
          ["◈","Career Assessment","5 skill modules matched to 214 real careers",C.sky,"assessment"],
          ["⬢","Course Test","Match with 354 global study abroad programs",C.teal,"coursetest"],
          ["🧠","Advanced Analysis","15-module cognitive & personality deep test",C.lavender,"advanced"],
          ["📊","My Results","View career & course test results",C.gold,"results"],
          ["◎","Career Pathway","Full journey from 12th to senior level",C.gold,"pathway"],
          ["⊛","Govt & Exams","JEE, NEET, UPSC, PSC, Defence & more",C.accent,"govtjobs"],
          ["✈","Study Abroad","Programs by field, level & salary",C.lavender,"abroad"],
          ["📊","Job Market","Demand scores & salary trends",C.teal,"jobs"],
          ["⊗","Resume Builder","ATS-friendly resume builder",C.mint,"resume"],
          ["📋","Study Planner","Goals, exam countdowns, habits & schedule",C.mint,"planner"],
          ["💼","Courses & Internship","Curated courses & internship finder — coming soon","#94a3b8","internship"],
          ["◈","AI Mentor","Claude AI powered — coming soon",C.textMuted,"mentor"],
        ].map(([icon,title,desc,col,sid])=>(
          <div key={title} style={{...st.card(C.cardBorder),borderLeft:`3px solid ${col}`,padding:"12px",cursor:"pointer",marginBottom:0}} onClick={()=>setSession(sid)}>
            <div style={{fontSize:"16px",marginBottom:"4px"}}>{icon}</div>
            <div style={{fontWeight:600,fontSize:"12px",marginBottom:"2px"}}>{title}</div>
            <div style={{color:C.textSecondary,fontSize:"10px",lineHeight:1.5}}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── GENERIC ASSESSMENT RENDERER ───────────────────────────────────────────
  const renderAssessmentFlow=(isCourse)=>{
    const curStep=isCourse?courseStep:step;
    const setS=isCourse?setCourseStep:setStep;
    const curModIdx=isCourse?courseModIdx:modIdx;
    const curQIdx=isCourse?courseQIdx:qIdx;
    const curAnswers=isCourse?courseAnswers:answers;
    const handleAns=isCourse?handleCourseAnswer:handleAnswer;
    const totalQ=25; const doneQ=curModIdx*5+curQIdx;
    const pct=curStep===4?Math.round((doneQ/totalQ)*100):curStep>=5?100:Math.round((curStep/5)*100);
    const accentCol=isCourse?C.teal:C.accent;
    const typeLabel=isCourse?"Course Test":"Career Assessment";

    if(curStep===0)return(<div>
      <div style={{fontSize:"10px",letterSpacing:"2px",color:accentCol,textTransform:"uppercase",marginBottom:"6px"}}>Step 1 of 5 — {typeLabel}</div>
      <h2 style={{fontSize:"20px",fontWeight:700,margin:"0 0 6px"}}>Your Hobbies</h2>
      <p style={{color:C.textSecondary,fontSize:"12px",marginBottom:"16px"}}>Select all you genuinely enjoy.</p>
      <PBar pct={pct} col={accentCol}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"16px"}}>
        {HOBBY_OPTIONS.map(h=><button key={h} style={st.tag(hobbies.includes(h),accentCol)} onClick={()=>setHobbies(p=>p.includes(h)?p.filter(x=>x!==h):[...p,h])}>{h}</button>)}
      </div>
      <button style={st.btn(accentCol)} onClick={()=>setS(1)}>Continue →</button>
    </div>);

    if(curStep===1)return(<div>
      <div style={{fontSize:"10px",letterSpacing:"2px",color:C.teal,textTransform:"uppercase",marginBottom:"6px"}}>Step 2 of 5 — {typeLabel}</div>
      <h2 style={{fontSize:"20px",fontWeight:700,margin:"0 0 6px"}}>Favourite Subjects</h2>
      <PBar pct={pct} col={C.teal}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"16px"}}>
        {SUBJECT_OPTIONS.map(s=><button key={s} style={st.tag(subjects.includes(s),C.teal)} onClick={()=>setSubjects(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}>{s}</button>)}
      </div>
      <div style={{display:"flex",gap:"8px"}}><button style={st.btnOut} onClick={()=>setS(0)}>← Back</button><button style={st.btn(C.teal)} onClick={()=>setS(2)}>Continue →</button></div>
    </div>);

    if(curStep===2)return(<div>
      <div style={{fontSize:"10px",letterSpacing:"2px",color:C.lavender,textTransform:"uppercase",marginBottom:"6px"}}>Step 3 of 5 — {typeLabel}</div>
      <h2 style={{fontSize:"20px",fontWeight:700,margin:"0 0 6px"}}>Academic Marks</h2>
      <PBar pct={pct} col={C.lavender}/>
      <div style={st.card()}>
        {[["math","Mathematics",C.sky],["science","Science",C.teal],["lang","Languages",C.lavender],["social","Social Studies",C.gold],["cs","Computer Science",C.accent]].map(([k,l,col])=>(
          <div key={k} style={{marginBottom:"14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}><span style={{fontSize:"12px"}}>{l}</span><span style={{fontSize:"12px",fontWeight:600,color:col}}>{grades[k]}%</span></div>
            <input type="range" min="0" max="100" step="1" value={grades[k]} onChange={e=>setGrades(g=>({...g,[k]:+e.target.value}))} style={{width:"100%",accentColor:col}}/>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:"8px"}}><button style={st.btnOut} onClick={()=>setS(1)}>← Back</button><button style={st.btn(C.lavender)} onClick={()=>setS(3)}>Continue →</button></div>
    </div>);

    if(curStep===3)return(<div>
      <div style={{fontSize:"10px",letterSpacing:"2px",color:C.gold,textTransform:"uppercase",marginBottom:"6px"}}>Step 4 of 5 — {typeLabel}</div>
      <h2 style={{fontSize:"20px",fontWeight:700,margin:"0 0 6px"}}>Skill Assessments</h2>
      <p style={{color:C.textSecondary,fontSize:"12px",marginBottom:"16px"}}>5 modules · 5 questions each · ~10 min</p>
      <PBar pct={pct} col={C.gold}/>
      <div style={{display:"flex",flexDirection:"column",gap:"7px",marginBottom:"16px"}}>
        {ASSESSMENT_MODULES.map((m,i)=>(
          <div key={m.id} style={{...st.card(m.color),display:"flex",alignItems:"center",gap:"10px",padding:"11px 14px",borderLeft:`3px solid ${m.color}`,marginBottom:0}}>
            <div style={{width:"26px",height:"26px",borderRadius:"50%",background:`${m.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:700,color:m.color,flexShrink:0}}>{i+1}</div>
            <div><div style={{fontWeight:600,fontSize:"12px"}}>{m.title}</div><div style={{color:C.textSecondary,fontSize:"10px"}}>{m.subtitle}</div></div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:"8px"}}>
        <button style={st.btnOut} onClick={()=>setS(2)}>← Back</button>
        <button style={st.btn(C.gold)} onClick={()=>{
          setS(4);
          if(isCourse){setCourseModIdx(0);setCourseQIdx(0);setCourseAnswers({});}
          else{setModIdx(0);setQIdx(0);setAnswers({});}
        }}>Start Tests →</button>
      </div>
    </div>);

    if(curStep===4){
      const mod=ASSESSMENT_MODULES[curModIdx];
      const q=mod.questions[curQIdx];
      const answered=curAnswers[`${mod.id}_${curQIdx}`];
      return(<div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
          <div style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:mod.color}}>{mod.title}</div>
          <div style={{fontSize:"10px",color:C.textSecondary}}>M{curModIdx+1}/5 · Q{curQIdx+1}/5</div>
        </div>
        <PBar pct={pct} col={mod.color}/>
        <div style={{...st.card(mod.color+"55"),borderLeft:`3px solid ${mod.color}`,marginBottom:"12px"}}>
          <div style={{fontSize:"14px",fontWeight:600,lineHeight:1.5}}>{q.q}</div>
        </div>
        <div>
          {q.opts.map((opt,i)=>{
            // NO correct answer color — only show selected highlight
            const sel=answered?.selected===i;
            const bg=sel?`${mod.color}22`:C.bg;
            const border=sel?`1px solid ${mod.color}`:`1px solid ${C.cardBorder}`;
            const col=sel?mod.color:C.textPrimary;
            return(<button key={i} disabled={!!answered} onClick={()=>handleAns(i)}
              style={{background:bg,border,borderRadius:"12px",padding:"11px 14px",fontSize:"13px",color:col,cursor:answered?"default":"pointer",textAlign:"left",fontFamily:"inherit",width:"100%",marginBottom:"7px"}}>
              <span style={{opacity:0.4,marginRight:"8px"}}>{["A","B","C","D"][i]}.</span>{opt}
            </button>);
          })}
        </div>
        <div style={{display:"flex",gap:"4px",justifyContent:"center",marginTop:"12px",flexWrap:"wrap"}}>
          {ASSESSMENT_MODULES.map((m,i)=>(
            <div key={m.id} style={{width:"6px",height:"6px",borderRadius:"50%",background:i<curModIdx?C.mint:i===curModIdx?m.color:C.cardBorder}}/>
          ))}
        </div>
      </div>);
    }

    // ── Step 5: Already completed screen ──────────────────────────────────
    if(curStep>=5){
      const doneResults=isCourse?courseResults:careerResults;
      const doneScores=isCourse?courseScores:scores;
      const col=isCourse?C.teal:C.accent;
      const top3=doneResults.slice(0,3);
      return(<div>
        <div style={{textAlign:"center",padding:"14px 0 10px"}}>
          <div style={{fontSize:"36px",marginBottom:"6px"}}>{isCourse?"✈":"🎯"}</div>
          <h2 style={{fontSize:"18px",fontWeight:700,margin:"0 0 4px"}}>{typeLabel} Completed!</h2>
          <p style={{color:C.textSecondary,fontSize:"12px",margin:"0 0 14px"}}>You have already completed this test.</p>
        </div>
        {/* Mini score strip */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"5px",marginBottom:"14px"}}>
          {[["Analytical",doneScores.analytical||0,C.sky],["Numerical",doneScores.numeric||0,C.teal],["Verbal",doneScores.verbal||0,C.lavender],["Creative",doneScores.creative||0,C.accent],["Social",doneScores.social||0,C.mint]].map(([l,v,c])=>(
            <div key={l} style={{background:C.card,border:`1px solid ${c}44`,borderRadius:"10px",padding:"8px 4px",textAlign:"center"}}>
              <div style={{fontSize:"14px",fontWeight:700,color:c}}>{v}%</div>
              <div style={{fontSize:"8px",color:C.textSecondary,marginTop:"1px"}}>{l}</div>
            </div>
          ))}
        </div>
        {/* Top 3 quick view */}
        <div style={{...st.card(),marginBottom:"14px"}}>
          <div style={{fontWeight:600,fontSize:"11px",marginBottom:"8px",color:col}}>Top 3 Matches</div>
          {top3.map((item,i)=>{
            const name=isCourse?item.degree_name:item.Career_name;
            const sub=isCourse?`${item.major||""} · ${item.field||""}`:`${item.Category} · ${item.salary_range_india||""}`;
            const match=item.match||0;
            const meta=!isCourse&&(CAT_META[item.Category]||{color:col,icon:"◉"});
            return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",padding:"7px 0",borderBottom:i<2?`1px solid ${C.cardBorder}`:"none"}}>
                <div style={{width:"20px",height:"20px",borderRadius:"50%",background:`${col}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",fontWeight:700,color:col,flexShrink:0}}>{i+1}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:"11px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{name}</div>
                  <div style={{fontSize:"9px",color:C.textSecondary,marginTop:"1px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{sub}</div>
                </div>
                <div style={{fontSize:"14px",fontWeight:700,color:col,flexShrink:0}}>{match}%</div>
              </div>
            );
          })}
        </div>
        {/* Action buttons */}
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
          <button style={st.btn(col)} onClick={()=>setSession("results")}>My Results →</button>
          <button style={st.btnOut} onClick={()=>{
            if(isCourse){setCourseResults([]);setCourseScores({});setCourseStep(0);setCourseModIdx(0);setCourseQIdx(0);setCourseAnswers({});}
            else{setCareerResults([]);setScores({});setStep(0);setModIdx(0);setQIdx(0);setAnswers({});}
          }}>Redo Test ↺</button>
          <button style={st.btn(C.lavender)} onClick={()=>setSession("advanced")}>Advanced Analysis →</button>
        </div>
      </div>);
    }
    return null;
  };

  // ── RESULTS (with 2 sub-tabs: career / course) ───────────────────────────
  const renderResults=()=>{
    const hasCareer=careerResults.length>0;
    const hasCourse=courseResults.length>0;
    if(!hasCareer&&!hasCourse)return(
      <div style={{textAlign:"center",padding:"60px 20px"}}>
        <div style={{fontSize:"44px",marginBottom:"12px"}}>📊</div>
        <h2 style={{fontSize:"20px",fontWeight:700,margin:"0 0 8px"}}>No Tests Completed Yet</h2>
        <p style={{color:C.textSecondary,fontSize:"13px",maxWidth:"360px",margin:"0 auto 20px",lineHeight:1.7}}>Complete the Career Assessment or Course Test to see your results here.</p>
        <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}>
          <button style={st.btn()} onClick={()=>{setSession("assessment");setStep(0);}}>Career Assessment →</button>
          <button style={st.btn(C.teal)} onClick={()=>{setSession("coursetest");setCourseStep(0);}}>Course Test →</button>
        </div>
      </div>
    );

    return(<div>
      <h2 style={{fontSize:"19px",fontWeight:700,marginBottom:"4px"}}>My Results</h2>
      <p style={{color:C.textSecondary,fontSize:"12px",marginBottom:"14px"}}>Your career & course test matches</p>

      {/* Sub-tabs */}
      <div style={{display:"flex",gap:"0",marginBottom:"18px",background:C.bg,borderRadius:"12px",padding:"3px",border:`1px solid ${C.cardBorder}`}}>
        {[["career","💼 Career Results",hasCareer],["course","✈ Course Results",hasCourse]].map(([id,label,has])=>(
          <button key={id} onClick={()=>has?setResultsTab(id):null} style={{flex:1,padding:"9px",fontSize:"12px",fontWeight:resultsTab===id?600:400,color:resultsTab===id?C.textPrimary:has?C.textSecondary:C.textMuted,background:resultsTab===id?C.card:"transparent",border:"none",borderRadius:"10px",cursor:has?"pointer":"default",fontFamily:"inherit",opacity:has?1:0.5}}>
            {label}{!has&&" (not done)"}
          </button>
        ))}
      </div>

      {resultsTab==="career"&&(!hasCareer?(
        <div style={{textAlign:"center",padding:"32px",color:C.textMuted}}>
          <p style={{marginBottom:"14px"}}>Career Assessment not done yet.</p>
          <button style={st.btn()} onClick={()=>{setSession("assessment");setStep(0);}}>Start Career Assessment →</button>
        </div>
      ):(()=>{
        const hasAdv=advCareerResults.length>0;
        // Merge: if both done, combine using weighted average (40% basic + 60% adv)
        // Build a lookup map from Career_name → advMatch for reliable matching
        const advCareerMap={};
        advCareerResults.forEach(a=>{advCareerMap[a.Career_name]=a.advMatch||0;});
        const combined=hasAdv
          ? careerResults.map(c=>{
              const advMatch=advCareerMap[c.Career_name];
              const combinedScore=advMatch!=null
                ?Math.round(c.match*0.4+advMatch*0.6)
                :c.match;
              return{...c,combinedScore,advMatch:advMatch||null};
            }).sort((a,b)=>b.combinedScore-a.combinedScore)
          : careerResults.map(c=>({...c,combinedScore:c.match}));
        const scoreKey=hasAdv?"combinedScore":"match";
        const modeLabel=hasAdv?"Combined (Basic + Advanced)":"Basic Test Only";
        const modeCol=hasAdv?C.lavender:C.sky;
        return(<div>
          {/* Mode badge */}
          <div style={{display:"inline-flex",alignItems:"center",gap:"6px",background:`${modeCol}18`,border:`1px solid ${modeCol}44`,borderRadius:"20px",padding:"4px 12px",fontSize:"10px",color:modeCol,fontWeight:600,marginBottom:"12px"}}>
            {hasAdv?"🧠 Combined Basic + Advanced":"📊 Basic Test Only"}
            {!hasAdv&&<span style={{color:C.textMuted,fontWeight:400}}>— take advanced for better accuracy</span>}
          </div>
          {/* Score bars */}
          <div style={{...st.card(),marginBottom:"12px"}}>
            <div style={{fontWeight:600,fontSize:"11px",marginBottom:"8px"}}>Skill Scores — Basic Test</div>
            {ASSESSMENT_MODULES.map(m=>(<div key={m.id} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"7px"}}>
              <div style={{width:"70px",fontSize:"10px",color:C.textSecondary,flexShrink:0}}>{m.title.split(" ")[0]}</div>
              <div style={{flex:1,height:"5px",background:C.bg,borderRadius:"3px",overflow:"hidden"}}><div style={{height:"100%",width:`${scores[m.id]||0}%`,background:m.color,borderRadius:"3px"}}/></div>
              <div style={{width:"28px",fontSize:"10px",fontWeight:600,color:m.color,textAlign:"right"}}>{scores[m.id]||0}%</div>
            </div>))}
            {hasAdv&&(<>
              <div style={{fontWeight:600,fontSize:"11px",marginBottom:"8px",marginTop:"10px",color:C.lavender}}>Top Cognitive Traits — Advanced</div>
              {Object.entries(advCareerTraits).slice(0,5).map(([trait,score])=>(
                <div key={trait} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
                  <div style={{width:"70px",fontSize:"10px",color:C.textSecondary,flexShrink:0,textTransform:"capitalize"}}>{trait}</div>
                  <div style={{flex:1,height:"4px",background:C.bg,borderRadius:"3px",overflow:"hidden"}}><div style={{height:"100%",width:`${score}%`,background:C.lavender,borderRadius:"3px"}}/></div>
                  <div style={{width:"28px",fontSize:"10px",fontWeight:600,color:C.lavender,textAlign:"right"}}>{score}%</div>
                </div>
              ))}
            </>)}
          </div>
          {/* Career list */}
          <div style={{fontWeight:600,fontSize:"12px",marginBottom:"8px",color:modeCol}}>
            Top Career Matches — {modeLabel}
          </div>
          {combined.slice(0,10).map(career=>{
            const meta=CAT_META[career.Category]||{color:C.textMuted,icon:"◉"};
            return(<div key={career.id} style={{...st.card(meta.color+"44"),display:"flex",alignItems:"center",gap:"10px",borderLeft:`3px solid ${meta.color}`,cursor:"pointer",marginBottom:"7px",padding:"11px 14px"}}
              onClick={()=>navTo("pathway",career.Career_name)}>
              <div style={{width:"24px",height:"24px",borderRadius:"50%",background:`${meta.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",flexShrink:0}}>{meta.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:"12px"}}>{career.Career_name}</div>
                <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"1px"}}>{career.Category} · {career.salary_range_india||"–"}</div>
                {hasAdv&&career.advMatch&&<div style={{fontSize:"9px",color:C.textMuted,marginTop:"1px"}}>Basic {career.match}% · Adv {career.advMatch}%</div>}
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:"17px",fontWeight:700,color:hasAdv?C.lavender:meta.color}}>{career[scoreKey]}%</div>
                <div style={{fontSize:"9px",color:C.textMuted}}>tap → pathway</div>
              </div>
            </div>);
          })}
          <div style={{display:"flex",gap:"8px",marginTop:"10px",flexWrap:"wrap"}}>
            <button style={st.btn(C.sky)} onClick={downloadCareerCSV}>⬇ Career CSV (Top 5)</button>
            {!hasAdv&&<button style={st.btn(C.lavender)} onClick={()=>setSession("advanced")}>Take Advanced →</button>}
            <button style={st.btnOut} onClick={()=>{setCareerResults([]);setScores({});setStep(0);setSession("assessment");}}>Redo ↺</button>
          </div>
        </div>);
      })())}

      {resultsTab==="course"&&(!hasCourse?(
        <div style={{textAlign:"center",padding:"32px",color:C.textMuted}}>
          <p style={{marginBottom:"14px"}}>Course Test not done yet.</p>
          <button style={st.btn(C.teal)} onClick={()=>{setSession("coursetest");setCourseStep(0);}}>Start Course Test →</button>
        </div>
      ):(()=>{
        const hasAdv=advCourseResults.length>0;
        // Merge abroad: match by index position since ids differ
        // Build lookup map from degree_name+field → advMatch
        const advCourseMap={};
        advCourseResults.forEach(a=>{
          const key=(a.degree_name||"")+"__"+(a.field||"");
          advCourseMap[key]=a.advMatch||0;
        });
        const combined=hasAdv
          ? courseResults.map(c=>{
              const key=(c.degree_name||"")+"__"+(c.field||"");
              const advMatch=advCourseMap[key];
              const combinedScore=advMatch!=null
                ?Math.round(c.match*0.4+advMatch*0.6)
                :c.match;
              return{...c,combinedScore,advMatch:advMatch||null};
            }).sort((a,b)=>b.combinedScore-a.combinedScore)
          : courseResults.map(c=>({...c,combinedScore:c.match}));
        const scoreKey=hasAdv?"combinedScore":"match";
        const modeLabel=hasAdv?"Combined (Basic + Advanced)":"Basic Test Only";
        const modeCol=hasAdv?C.lavender:C.teal;
        return(<div>
          <div style={{display:"inline-flex",alignItems:"center",gap:"6px",background:`${modeCol}18`,border:`1px solid ${modeCol}44`,borderRadius:"20px",padding:"4px 12px",fontSize:"10px",color:modeCol,fontWeight:600,marginBottom:"12px"}}>
            {hasAdv?"🧠 Combined Basic + Advanced":"📊 Basic Test Only"}
            {!hasAdv&&<span style={{color:C.textMuted,fontWeight:400}}>— take advanced for better accuracy</span>}
          </div>
          {hasAdv&&(<div style={{...st.card(),marginBottom:"12px"}}>
            <div style={{fontWeight:600,fontSize:"11px",marginBottom:"8px",color:C.lavender}}>Top Cognitive Traits — Advanced</div>
            {Object.entries(advCourseTraits).slice(0,5).map(([trait,score])=>(
              <div key={trait} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
                <div style={{width:"70px",fontSize:"10px",color:C.textSecondary,flexShrink:0,textTransform:"capitalize"}}>{trait}</div>
                <div style={{flex:1,height:"4px",background:C.bg,borderRadius:"3px",overflow:"hidden"}}><div style={{height:"100%",width:`${score}%`,background:C.lavender,borderRadius:"3px"}}/></div>
                <div style={{width:"28px",fontSize:"10px",fontWeight:600,color:C.lavender,textAlign:"right"}}>{score}%</div>
              </div>
            ))}
          </div>)}
          <div style={{fontWeight:600,fontSize:"12px",marginBottom:"8px",color:modeCol}}>
            Top Study Abroad Matches — {modeLabel}
          </div>
          {combined.slice(0,10).map((prog,i)=>(
            <div key={i} style={{...st.card(`${modeCol}44`),display:"flex",alignItems:"center",gap:"10px",borderLeft:`3px solid ${modeCol}`,cursor:"pointer",marginBottom:"7px",padding:"11px 14px"}}
              onClick={()=>setSession("abroad")}>
              <div style={{width:"24px",height:"24px",borderRadius:"50%",background:`${modeCol}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",flexShrink:0}}>✈</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:"12px"}}>{prog.degree_name}</div>
                <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"1px"}}>{prog.major} · {prog.field} · {prog.program_level}</div>
                <div style={{display:"flex",gap:"8px",marginTop:"2px"}}>
                  <span style={{fontSize:"10px",color:C.mint,fontWeight:600}}>{prog.estimated_salary}</span>
                  {hasAdv&&prog.advMatch&&<span style={{fontSize:"9px",color:C.textMuted}}>Basic {prog.match}% · Adv {prog.advMatch}%</span>}
                </div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:"17px",fontWeight:700,color:modeCol}}>{prog[scoreKey]}%</div>
                <div style={{fontSize:"9px",color:C.textMuted}}>tap → abroad</div>
              </div>
            </div>
          ))}
          <div style={{display:"flex",gap:"8px",marginTop:"10px",flexWrap:"wrap"}}>
            <button style={st.btn(C.sky)} onClick={downloadCourseCSV}>⬇ Course CSV (Top 5)</button>
            {!hasAdv&&<button style={st.btn(C.lavender)} onClick={()=>setSession("advanced")}>Take Advanced →</button>}
            <button style={st.btnOut} onClick={()=>{setCourseResults([]);setCourseScores({});setCourseStep(0);setSession("coursetest");}}>Redo ↺</button>
          </div>
        </div>);
      })())}
    </div>);
  };

  // ── ADV RESULTS (with 2 sub-tabs) ─────────────────────────────────────────
  const renderAdvResults=()=>{
    const hasAdvCareer=advCareerResults.length>0;
    const hasAdvCourse=advCourseResults.length>0;

    if(!hasAdvCareer&&!hasAdvCourse)return(
      <div style={{textAlign:"center",padding:"60px 20px"}}>
        <div style={{fontSize:"44px",marginBottom:"12px"}}>🧠</div>
        <h2 style={{fontSize:"20px",fontWeight:700,margin:"0 0 8px"}}>Advanced Analysis Not Done</h2>
        <p style={{color:C.textSecondary,fontSize:"13px",maxWidth:"360px",margin:"0 auto 20px",lineHeight:1.7}}>Complete the Advanced Analysis to get a deeper, more accurate career and course match.</p>
        <button style={st.btn(C.lavender)} onClick={()=>setSession("advanced")}>Start Advanced Analysis →</button>
      </div>
    );

    const downloadAdvCareerCSV=()=>{
      const top=advCareerResults.slice(0,5).map(c=>c.Career_name||"");
      while(top.length<5)top.push("");
      const traits=Object.values(advCareerTraits);
      const row=[...traits,...top].join(",");
      const traitKeys=Object.keys(advCareerTraits).join(",");
      const hdr=traitKeys+",top_career_1,top_career_2,top_career_3,top_career_4,top_career_5";
      const existing=localStorage.getItem("cc_adv_career")||hdr;
      localStorage.setItem("cc_adv_career",existing+"\n"+row);
      const b=new Blob([existing+"\n"+row],{type:"text/csv"});const u=URL.createObjectURL(b);
      const a=document.createElement("a");a.href=u;a.download="advanced_career_results.csv";a.click();
    };

    const downloadAdvCourseCSV=()=>{
      const top=advCourseResults.slice(0,5).map(c=>c.degree_name||"");
      while(top.length<5)top.push("");
      const traits=Object.values(advCourseTraits);
      const row=[...traits,...top].join(",");
      const traitKeys=Object.keys(advCourseTraits).join(",");
      const hdr=traitKeys+",top_course_1,top_course_2,top_course_3,top_course_4,top_course_5";
      const existing=localStorage.getItem("cc_adv_course")||hdr;
      localStorage.setItem("cc_adv_course",existing+"\n"+row);
      const b=new Blob([existing+"\n"+row],{type:"text/csv"});const u=URL.createObjectURL(b);
      const a=document.createElement("a");a.href=u;a.download="advanced_course_results.csv";a.click();
    };

    return(<div>
      <h2 style={{fontSize:"19px",fontWeight:700,marginBottom:"4px"}}>Advanced Analysis Results</h2>
      <p style={{color:C.textSecondary,fontSize:"12px",marginBottom:"14px"}}>Cognitive & personality-based career and course matches</p>

      {/* Sub-tabs */}
      <div style={{display:"flex",gap:"0",marginBottom:"18px",background:C.bg,borderRadius:"12px",padding:"3px",border:`1px solid ${C.cardBorder}`}}>
        {[["career","💼 Career Results",hasAdvCareer],["course","✈ Course Results",hasAdvCourse]].map(([id,label,has])=>(
          <button key={id} onClick={()=>has?setAdvResultsTab(id):null} style={{flex:1,padding:"9px",fontSize:"12px",fontWeight:advResultsTab===id?600:400,color:advResultsTab===id?C.textPrimary:has?C.textSecondary:C.textMuted,background:advResultsTab===id?C.card:"transparent",border:"none",borderRadius:"10px",cursor:has?"pointer":"default",fontFamily:"inherit",opacity:has?1:0.5}}>
            {label}{!has&&" (not done)"}
          </button>
        ))}
      </div>

      {advResultsTab==="career"&&(!hasAdvCareer?(
        <div style={{textAlign:"center",padding:"32px",color:C.textMuted}}>
          <p style={{marginBottom:"14px"}}>Run Advanced Analysis → Career Roles to see results here.</p>
          <button style={st.btn(C.lavender)} onClick={()=>setSession("advanced")}>Go to Advanced Analysis →</button>
        </div>
      ):(
        <div>
          <div style={{fontWeight:600,fontSize:"13px",marginBottom:"8px"}}>Top Career Matches — Advanced Score</div>
          {advCareerResults.slice(0,10).map(career=>{
            const meta=CAT_META[career.Category]||{color:C.textMuted,icon:"◉"};
            return(<div key={career.id} style={{...st.card(meta.color+"44"),display:"flex",alignItems:"center",gap:"10px",borderLeft:`3px solid ${meta.color}`,cursor:"pointer",marginBottom:"8px",padding:"12px 15px"}}
              onClick={()=>navTo("pathway",career.Career_name)}>
              <div style={{width:"24px",height:"24px",borderRadius:"50%",background:`${meta.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",flexShrink:0}}>{meta.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:"12px"}}>{career.Career_name}</div>
                <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"1px"}}>{career.Category} · {career.salary_range_india||"–"}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:"17px",fontWeight:700,color:meta.color}}>{career.advMatch}%</div>
                <div style={{fontSize:"9px",color:C.textMuted}}>tap → pathway</div>
              </div>
            </div>);
          })}
          <div style={{display:"flex",gap:"8px",marginTop:"10px",flexWrap:"wrap"}}>
            <button style={st.btn(C.sky)} onClick={downloadAdvCareerCSV}>⬇ Adv Career CSV (Top 5)</button>
            <button style={st.btnOut} onClick={()=>setAdvCareerResults([])}>Redo Career ↺</button>
          </div>
        </div>
      ))}

      {advResultsTab==="course"&&(!hasAdvCourse?(
        <div style={{textAlign:"center",padding:"32px",color:C.textMuted}}>
          <p style={{marginBottom:"14px"}}>Run Advanced Analysis → Study Abroad to see results here.</p>
          <button style={st.btn(C.lavender)} onClick={()=>setSession("advanced")}>Go to Advanced Analysis →</button>
        </div>
      ):(
        <div>
          <div style={{fontWeight:600,fontSize:"13px",marginBottom:"8px"}}>Top Study Abroad Matches — Advanced Score</div>
          {advCourseResults.slice(0,10).map((prog,i)=>(
            <div key={i} style={{...st.card(`${C.lavender}44`),display:"flex",alignItems:"center",gap:"10px",borderLeft:`3px solid ${C.lavender}`,cursor:"pointer",marginBottom:"8px",padding:"12px 15px"}}
              onClick={()=>setSession("abroad")}>
              <div style={{width:"24px",height:"24px",borderRadius:"50%",background:`${C.lavender}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",flexShrink:0}}>✈</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:"12px"}}>{prog.degree_name}</div>
                <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"1px"}}>{prog.major} · {prog.field} · {prog.program_level}</div>
                <div style={{fontSize:"10px",color:C.mint,marginTop:"1px",fontWeight:600}}>{prog.estimated_salary}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:"17px",fontWeight:700,color:C.lavender}}>{prog.advMatch}%</div>
                <div style={{fontSize:"9px",color:C.textMuted}}>tap → study abroad</div>
              </div>
            </div>
          ))}
          <div style={{display:"flex",gap:"8px",marginTop:"10px",flexWrap:"wrap"}}>
            <button style={st.btn(C.sky)} onClick={downloadAdvCourseCSV}>⬇ Adv Course CSV (Top 5)</button>
            <button style={st.btnOut} onClick={()=>setAdvCourseResults([])}>Redo Course ↺</button>
          </div>
        </div>
      ))}
    </div>);
  };

  // ── DASHBOARD ────────────────────────────────────────────────────────────
  const renderDashboard=()=>{
    const hasCareer   = careerResults.length>0;
    const hasCourse   = courseResults.length>0;
    const hasAdvCar   = advCareerResults.length>0;
    const hasAdvCou   = advCourseResults.length>0;
    const anyDone     = hasCareer||hasCourse||hasAdvCar||hasAdvCou;

    const ScoreBar=({label,val,col,max=100})=>(
      <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"7px"}}>
        <div style={{width:"85px",fontSize:"10px",color:C.textSecondary,flexShrink:0,lineHeight:1.3}}>{label}</div>
        <div style={{flex:1,height:"6px",background:C.bg,borderRadius:"3px",overflow:"hidden"}}>
          <div style={{height:"100%",width:`${Math.round((val/max)*100)}%`,background:col,borderRadius:"3px",transition:"width .6s"}}/>
        </div>
        <div style={{width:"30px",fontSize:"10px",fontWeight:700,color:col,textAlign:"right",flexShrink:0}}>{val}{max===100?"%":""}</div>
      </div>
    );

    const Section=({title,col,icon,children})=>(
      <div style={{...st.card(col+"44"),borderLeft:`3px solid ${col}`,marginBottom:"10px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"12px"}}>
          <span style={{fontSize:"16px"}}>{icon}</span>
          <div style={{fontWeight:700,fontSize:"13px",color:col}}>{title}</div>
        </div>
        {children}
      </div>
    );

    const TopCareerList=({items,scoreKey,col,isAbroad=false,onTap})=>(
      <div style={{display:"flex",flexDirection:"column",gap:"5px",marginTop:"8px"}}>
        {items.slice(0,5).map((item,i)=>{
          const name=isAbroad?(item.degree_name||item.Career_name):item.Career_name;
          const sub=isAbroad?`${item.major||""} · ${item.field||item.program_level||""}`:item.Category;
          const score=item[scoreKey]||0;
          const meta=!isAbroad&&(CAT_META[item.Category]||{color:col,icon:"◉"});
          return(
            <div key={i} style={{background:C.bg,borderRadius:"10px",padding:"8px 11px",display:"flex",alignItems:"center",gap:"8px",cursor:onTap?"pointer":"default",border:`1px solid ${C.cardBorder}`}}
              onClick={()=>onTap&&onTap(item)}>
              <div style={{width:"18px",height:"18px",borderRadius:"50%",background:`${col}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",flexShrink:0,fontWeight:700,color:col}}>{i+1}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:"11px",color:C.textPrimary,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{name}</div>
                <div style={{fontSize:"9px",color:C.textSecondary,marginTop:"1px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{sub}</div>
              </div>
              <div style={{fontSize:"14px",fontWeight:700,color:col,flexShrink:0}}>{score}%</div>
            </div>
          );
        })}
      </div>
    );

    return(<div>
      <h2 style={{fontSize:"19px",fontWeight:700,marginBottom:"4px"}}>Dashboard</h2>
      <p style={{color:C.textSecondary,fontSize:"12px",marginBottom:"16px"}}>All your test results and scores in one place</p>

      {!anyDone&&(
        <div style={{textAlign:"center",padding:"50px 20px"}}>
          <div style={{fontSize:"40px",marginBottom:"10px"}}>📋</div>
          <h3 style={{fontSize:"16px",fontWeight:700,marginBottom:"6px"}}>No tests completed yet</h3>
          <p style={{color:C.textSecondary,fontSize:"12px",maxWidth:"320px",margin:"0 auto 18px",lineHeight:1.7}}>Complete the Career Assessment or Course Test to see your dashboard.</p>
          <div style={{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap"}}>
            <button style={st.btn()} onClick={()=>{setSession("assessment");setStep(0);}}>Career Assessment</button>
            <button style={st.btn(C.teal)} onClick={()=>{setSession("coursetest");setCourseStep(0);}}>Course Test</button>
          </div>
        </div>
      )}

      {anyDone&&(<>

        {/* ── Summary strip ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:"7px",marginBottom:"14px"}}>
          {[
            ["Career Test",    hasCareer  ?"Done":"Pending", hasCareer  ?C.mint:C.textMuted,   "◈"],
            ["Course Test",    hasCourse  ?"Done":"Pending", hasCourse  ?C.mint:C.textMuted,   "✈"],
            ["Adv Career",     hasAdvCar  ?"Done":"Pending", hasAdvCar  ?C.lavender:C.textMuted,"🧠"],
            ["Adv Course",     hasAdvCou  ?"Done":"Pending", hasAdvCou  ?C.lavender:C.textMuted,"✈"],
          ].map(([label,status,col,icon])=>(
            <div key={label} style={{...st.card(col+"33"),textAlign:"center",padding:"10px 8px",marginBottom:0}}>
              <div style={{fontSize:"14px",marginBottom:"3px"}}>{icon}</div>
              <div style={{fontSize:"10px",color:C.textSecondary,marginBottom:"3px"}}>{label}</div>
              <div style={{fontSize:"11px",fontWeight:700,color:col}}>{status}</div>
            </div>
          ))}
        </div>

        {/* ── BASIC CAREER TEST ── */}
        {hasCareer&&(
          <Section title="Career Assessment — Skill Scores" col={C.sky} icon="◈">
            {[["Analytical", scores.analytical||0, C.sky],
              ["Numerical",  scores.numeric   ||0, C.teal],
              ["Verbal",     scores.verbal    ||0, C.lavender],
              ["Creative",   scores.creative  ||0, C.accent],
              ["Social",     scores.social    ||0, C.mint],
            ].map(([l,v,c])=><ScoreBar key={l} label={l} val={v} col={c}/>)}
            <div style={{marginTop:"6px",fontSize:"10px",color:C.textMuted}}>Academic Grades</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:"5px",marginTop:"5px"}}>
              {[["Math",grades.math,C.sky],["Science",grades.science,C.teal],["Language",grades.lang,C.lavender],["Social",grades.social,C.gold],["CS",grades.cs,C.accent]].map(([l,v,c])=>(
                <div key={l} style={{background:C.bg,borderRadius:"8px",padding:"6px",textAlign:"center"}}>
                  <div style={{fontSize:"9px",color:C.textSecondary,marginBottom:"2px"}}>{l}</div>
                  <div style={{fontSize:"13px",fontWeight:700,color:c}}>{v}%</div>
                </div>
              ))}
            </div>
            <div style={{fontWeight:600,fontSize:"11px",marginTop:"10px",marginBottom:"5px",color:C.sky}}>Top 5 Career Matches</div>
            <TopCareerList items={careerResults} scoreKey="match" col={C.sky} onTap={item=>navTo("pathway",item.Career_name)}/>
            <div style={{display:"flex",gap:"6px",marginTop:"8px",flexWrap:"wrap"}}>
              <button style={{...st.btn(C.sky),fontSize:"11px",padding:"7px 13px"}} onClick={downloadCareerCSV}>⬇ Career CSV</button>
              <button style={{...st.btnOut,fontSize:"11px",padding:"6px 12px"}} onClick={()=>{setCareerResults([]);setScores({});setStep(0);setSession("assessment");}}>Redo ↺</button>
            </div>
          </Section>
        )}

        {/* ── BASIC COURSE TEST ── */}
        {hasCourse&&(
          <Section title="Course Test — Skill Scores" col={C.teal} icon="✈">
            {[["Analytical", courseScores.analytical||0, C.sky],
              ["Numerical",  courseScores.numeric   ||0, C.teal],
              ["Verbal",     courseScores.verbal    ||0, C.lavender],
              ["Creative",   courseScores.creative  ||0, C.accent],
              ["Social",     courseScores.social    ||0, C.mint],
            ].map(([l,v,c])=><ScoreBar key={l} label={l} val={v} col={c}/>)}
            <div style={{fontWeight:600,fontSize:"11px",marginTop:"10px",marginBottom:"5px",color:C.teal}}>Top 5 Abroad Matches</div>
            <TopCareerList items={courseResults} scoreKey="match" col={C.teal} isAbroad={true} onTap={()=>setSession("abroad")}/>
            <div style={{display:"flex",gap:"6px",marginTop:"8px",flexWrap:"wrap"}}>
              <button style={{...st.btn(C.teal),fontSize:"11px",padding:"7px 13px"}} onClick={downloadCourseCSV}>⬇ Course CSV</button>
              <button style={{...st.btnOut,fontSize:"11px",padding:"6px 12px"}} onClick={()=>{setCourseResults([]);setCourseScores({});setCourseStep(0);setSession("coursetest");}}>Redo ↺</button>
            </div>
          </Section>
        )}

        {/* ── ADVANCED CAREER ── */}
        {hasAdvCar&&(
          <Section title="Advanced Analysis — Career Results" col={C.lavender} icon="🧠">
            {Object.entries(advCareerTraits).length>0&&(<>
              <div style={{fontWeight:600,fontSize:"10px",color:C.textMuted,marginBottom:"6px"}}>COGNITIVE TRAIT SCORES</div>
              {Object.entries(advCareerTraits).map(([trait,score])=>(
                <ScoreBar key={trait} label={trait.charAt(0).toUpperCase()+trait.slice(1)} val={score} col={C.lavender}/>
              ))}
            </>)}
            <div style={{fontWeight:600,fontSize:"11px",marginTop:"10px",marginBottom:"5px",color:C.lavender}}>Top 5 Career Matches (Advanced)</div>
            <TopCareerList items={advCareerResults} scoreKey="advMatch" col={C.lavender} onTap={item=>navTo("pathway",item.Career_name)}/>
            <div style={{display:"flex",gap:"6px",marginTop:"8px",flexWrap:"wrap"}}>
              <button style={{...st.btn(C.lavender),fontSize:"11px",padding:"7px 13px"}} onClick={()=>{
                const top=advCareerResults.slice(0,5).map(c=>c.Career_name||"");
                while(top.length<5)top.push("");
                const traits=Object.values(advCareerTraits);
                const row=[...traits,...top].join(",");
                const traitKeys=Object.keys(advCareerTraits).join(",");
                const hdr=traitKeys+",top_career_1,top_career_2,top_career_3,top_career_4,top_career_5";
                const existing=localStorage.getItem("cc_adv_career")||hdr;
                localStorage.setItem("cc_adv_career",existing+"\n"+row);
                const b=new Blob([existing+"\n"+row],{type:"text/csv"});const u=URL.createObjectURL(b);
                const a=document.createElement("a");a.href=u;a.download="advanced_career_results.csv";a.click();
              }}>⬇ Adv Career CSV</button>
              <button style={{...st.btnOut,fontSize:"11px",padding:"6px 12px"}} onClick={()=>setAdvCareerResults([])}>Redo ↺</button>
            </div>
          </Section>
        )}

        {/* ── ADVANCED COURSE ── */}
        {hasAdvCou&&(
          <Section title="Advanced Analysis — Study Abroad Results" col={C.pink} icon="✈">
            {Object.entries(advCourseTraits).length>0&&(<>
              <div style={{fontWeight:600,fontSize:"10px",color:C.textMuted,marginBottom:"6px"}}>COGNITIVE TRAIT SCORES</div>
              {Object.entries(advCourseTraits).map(([trait,score])=>(
                <ScoreBar key={trait} label={trait.charAt(0).toUpperCase()+trait.slice(1)} val={score} col={C.pink}/>
              ))}
            </>)}
            <div style={{fontWeight:600,fontSize:"11px",marginTop:"10px",marginBottom:"5px",color:C.pink}}>Top 5 Abroad Matches (Advanced)</div>
            <TopCareerList items={advCourseResults} scoreKey="advMatch" col={C.pink} isAbroad={true} onTap={()=>setSession("abroad")}/>
            <div style={{display:"flex",gap:"6px",marginTop:"8px",flexWrap:"wrap"}}>
              <button style={{...st.btn(C.pink),fontSize:"11px",padding:"7px 13px"}} onClick={()=>{
                const top=advCourseResults.slice(0,5).map(c=>c.degree_name||"");
                while(top.length<5)top.push("");
                const traits=Object.values(advCourseTraits);
                const row=[...traits,...top].join(",");
                const traitKeys=Object.keys(advCourseTraits).join(",");
                const hdr=traitKeys+",top_course_1,top_course_2,top_course_3,top_course_4,top_course_5";
                const existing=localStorage.getItem("cc_adv_course")||hdr;
                localStorage.setItem("cc_adv_course",existing+"\n"+row);
                const b=new Blob([existing+"\n"+row],{type:"text/csv"});const u=URL.createObjectURL(b);
                const a=document.createElement("a");a.href=u;a.download="advanced_course_results.csv";a.click();
              }}>⬇ Adv Course CSV</button>
              <button style={{...st.btnOut,fontSize:"11px",padding:"6px 12px"}} onClick={()=>setAdvCourseResults([])}>Redo ↺</button>
            </div>
          </Section>
        )}

      </>)}
    </div>);
  };

  // ── EXPLORE ───────────────────────────────────────────────────────────────
  const renderExplore=()=>(<div>
    <h2 style={{fontSize:"19px",fontWeight:700,marginBottom:"4px"}}>Explore 214 Careers</h2>
    <p style={{color:C.textSecondary,fontSize:"12px",marginBottom:"14px"}}>Browse all roles across 19 categories</p>
    <input value={expSearch} onChange={e=>setExpSearch(e.target.value)} placeholder="Search career..." style={{...st.input,marginBottom:"10px"}}/>
    <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"12px"}}>
      <button style={st.tag(expCat==="all")} onClick={()=>setExpCat("all")}>All ({CAREER_DATA.length})</button>
      {CATEGORIES.map(cat=>{const meta=CAT_META[cat]||{color:C.textMuted};return<button key={cat} style={st.tag(expCat===cat,meta.color)} onClick={()=>setExpCat(expCat===cat?"all":cat)}>{cat}</button>;})}
    </div>
    <div style={{fontSize:"10px",color:C.textMuted,marginBottom:"8px"}}>Showing {Math.min(filteredCareers.length,50)} of {filteredCareers.length}</div>
    <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
      {filteredCareers.slice(0,50).map(career=>{
        const meta=CAT_META[career.Category]||{color:C.textMuted,icon:"◉"};
        const bMatch=careerResults.find(t=>t.id===career.id);
        return(<div key={career.id} style={{...st.card(meta.color+"44"),display:"flex",gap:"10px",alignItems:"flex-start",padding:"11px 14px",borderLeft:`3px solid ${meta.color}`,cursor:"pointer",marginBottom:0}}
          onClick={()=>navTo("pathway",career.Career_name)}>
          <div style={{width:"24px",height:"24px",borderRadius:"50%",background:`${meta.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",flexShrink:0,marginTop:"1px"}}>{meta.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,fontSize:"12px"}}>{career.Career_name}</div>
            <div style={{fontSize:"9px",color:C.textSecondary,marginTop:"1px"}}>{career.Category}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"3px",flexShrink:0}}>
            <span style={{fontSize:"10px",color:C.mint,fontWeight:600}}>{career.salary_range_india||"–"}</span>
            {bMatch&&<Badge text={`${bMatch.match}% match`} col={meta.color}/>}
            <Badge text={career.future_scope||"–"} col={career.future_scope==="Very High"?C.mint:career.future_scope==="High"?C.gold:C.textMuted}/>
          </div>
        </div>);
      })}
    </div>
  </div>);

  // ── PATHWAY ───────────────────────────────────────────────────────────────
  const renderPathway=()=>(<div>
    <h2 style={{fontSize:"19px",fontWeight:700,marginBottom:"4px"}}>Career Pathway</h2>
    <p style={{color:C.textSecondary,fontSize:"12px",marginBottom:"14px"}}>Search any of 214 career roles for the full journey</p>
    <input value={pathSearch} onChange={e=>{setPathSearch(e.target.value);setPathCareer(null);}} placeholder="Search career... e.g. Doctor, Software Engineer" style={{...st.input,marginBottom:"8px"}}/>
    {pathResults.length>0&&!pathCareer&&(<div style={{display:"flex",flexDirection:"column",gap:"5px",marginBottom:"12px"}}>
      {pathResults.map(p=>{const meta=CAT_META[p.Category]||{color:C.textMuted,icon:"◉"};return(
        <div key={p.id} style={{...st.card(meta.color+"44"),display:"flex",alignItems:"center",gap:"8px",padding:"10px 14px",cursor:"pointer",borderLeft:`3px solid ${meta.color}`,marginBottom:0}}
          onClick={()=>{setPathCareer(p);setPathSearch(p.Career_name);}}>
          <span style={{fontSize:"13px"}}>{meta.icon}</span>
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:"12px"}}>{p.Career_name}</div><div style={{fontSize:"10px",color:C.textSecondary}}>{p.Category}</div></div>
          <Badge text={p.future_scope||"–"} col={p.future_scope==="Very High"?C.mint:C.gold}/>
        </div>
      );})}
    </div>)}
    {!pathCareer&&!pathResults.length&&<div style={{textAlign:"center",padding:"28px",color:C.textMuted,fontSize:"12px"}}>Type a career name above to see its full pathway</div>}
    {pathCareer&&(()=>{
      const meta=CAT_META[pathCareer.Category]||{color:C.teal,icon:"◉"};
      const sp=(v,sep=";")=>v?v.split(sep).map(s=>s.trim()).filter(Boolean):[];
      const pp=(v)=>v?v.split("|").map(s=>s.trim()).filter(Boolean):[];
      return(<div>
        <div style={{...st.card(meta.color+"55"),borderLeft:`3px solid ${meta.color}`,marginBottom:"8px"}}>
          <div style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"6px"}}>
            <div style={{fontSize:"18px"}}>{meta.icon}</div>
            <div><div style={{fontWeight:700,fontSize:"14px"}}>{pathCareer.Career_name}</div><div style={{fontSize:"10px",color:C.textSecondary}}>{pathCareer.Category} · {pathCareer.salary_range_india}</div></div>
            <div style={{marginLeft:"auto"}}><Badge text={pathCareer.future_scope} col={pathCareer.future_scope==="Very High"?C.mint:C.gold}/></div>
          </div>
        </div>
        {[[meta.color,"12th Stream",<><div style={{fontSize:"12px",marginBottom:"5px"}}>{pathCareer.required_stream}</div><div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{sp(pathCareer.required_subjects_12th).map(s=><span key={s} style={{fontSize:"10px",color:C.textSecondary,background:C.bg,padding:"2px 6px",borderRadius:"6px"}}>{s}</span>)}</div></>],
          [C.sky,"Degree / Entrance",<><div style={{fontSize:"12px",marginBottom:"4px"}}>{pathCareer.degree}</div><div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{sp(pathCareer.entrance_exams,"/").map(e=><span key={e} style={{fontSize:"10px",color:C.gold,background:`${C.gold}15`,padding:"2px 7px",borderRadius:"8px"}}>{e}</span>)}</div></>],
        ].map(([col,title,content])=>(<div key={title} style={{...st.card(col+"44"),borderLeft:`3px solid ${col}`,marginBottom:"7px"}}><div style={{fontWeight:600,fontSize:"11px",color:col,marginBottom:"5px"}}>{title}</div>{content}</div>))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px",marginBottom:"7px"}}>
          {[[C.teal,"Post Graduation",pathCareer.postgraduate_options],[C.lavender,"PhD",pathCareer.phd_options]].map(([col,t,v])=>(<div key={t} style={{...st.card(col+"44"),borderLeft:`3px solid ${col}`,marginBottom:0}}><div style={{fontWeight:600,fontSize:"10px",color:col,marginBottom:"4px"}}>{t}</div><div style={{fontSize:"10px",color:C.textSecondary}}>{v||"–"}</div></div>))}
        </div>
        {pathCareer.certifications&&<div style={{...st.card(),marginBottom:"7px"}}><div style={{fontWeight:600,fontSize:"11px",marginBottom:"5px"}}>Certifications</div><div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{pp(pathCareer.certifications).map(c=><span key={c} style={{fontSize:"10px",color:C.mint,background:`${C.mint}15`,padding:"3px 8px",borderRadius:"20px"}}>{c}</span>)}</div></div>}
        {pathCareer.career_levels&&<div style={{...st.card(),marginBottom:"7px"}}><div style={{fontWeight:600,fontSize:"11px",marginBottom:"6px"}}>Career Progression</div><div style={{display:"flex",flexWrap:"wrap",gap:"4px",alignItems:"center"}}>{pathCareer.career_levels.split("->").map((l,i,arr)=>(<span key={i} style={{display:"flex",alignItems:"center",gap:"4px"}}><span style={{fontSize:"10px",color:meta.color,background:`${meta.color}15`,padding:"3px 9px",borderRadius:"20px"}}>{l.trim()}</span>{i<arr.length-1&&<span style={{color:C.textMuted,fontSize:"10px"}}>→</span>}</span>))}</div></div>}
        {pathCareer.key_skills&&<div style={{...st.card(),marginBottom:"7px"}}><div style={{fontWeight:600,fontSize:"11px",marginBottom:"5px"}}>Key Skills</div><div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{pp(pathCareer.key_skills).map(k=><span key={k} style={{fontSize:"10px",color:C.sky,background:`${C.sky}15`,padding:"3px 8px",borderRadius:"20px"}}>{k}</span>)}</div></div>}
        {pathCareer.government_jobs&&<div style={{...st.card(`${C.gold}44`),borderLeft:`3px solid ${C.gold}`,marginBottom:"7px"}}><div style={{fontWeight:600,fontSize:"11px",color:C.gold,marginBottom:"5px"}}>Govt Jobs</div><div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{sp(pathCareer.government_jobs).map(g=><span key={g} style={{fontSize:"10px",color:C.gold,background:`${C.gold}15`,padding:"3px 8px",borderRadius:"20px"}}>{g}</span>)}</div></div>}
        {(pathCareer.study_abroad_courses||pathCareer.study_abroad_countries)&&<div style={{...st.card(`${C.lavender}44`),borderLeft:`3px solid ${C.lavender}`,marginBottom:"7px"}}><div style={{fontWeight:600,fontSize:"11px",color:C.lavender,marginBottom:"5px"}}>Study Abroad</div><div style={{fontSize:"11px",color:C.textSecondary,marginBottom:"4px"}}>{pathCareer.study_abroad_courses}</div><div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{sp(pathCareer.study_abroad_countries).map(c=><span key={c} style={{fontSize:"10px",color:C.lavender,background:`${C.lavender}15`,padding:"2px 7px",borderRadius:"20px"}}>{c}</span>)}</div></div>}
        <div style={{...st.card(`${C.mint}44`),borderLeft:`3px solid ${C.mint}`}}><div style={{fontWeight:600,fontSize:"11px",color:C.mint,marginBottom:"4px"}}>Salary in India</div><div style={{fontSize:"15px",fontWeight:700,color:C.mint}}>{pathCareer.salary_range_india||"–"}</div><div style={{fontSize:"9px",color:C.textMuted,marginTop:"2px"}}>Demand: {pathCareer.demand_score}/100 · {pathCareer.future_scope}</div></div>
      </div>);
    })()}
  </div>);

  // ── GOVT JOBS ─────────────────────────────────────────────────────────────
  const renderGovtJobs=()=>{
    const govtRoles=(()=>{let d=CAREER_DATA.filter(c=>c.government_jobs&&c.government_jobs!=="");if(govtSearch)d=d.filter(c=>c.Career_name.toLowerCase().includes(govtSearch.toLowerCase())||c.government_jobs.toLowerCase().includes(govtSearch.toLowerCase()));return d.slice(0,40);})();
    const filteredExams=govtExamCat==="all"?GOVT_EXAMS:GOVT_EXAMS.filter(g=>g.category===govtExamCat);
    return(<div>
      <h2 style={{fontSize:"19px",fontWeight:700,marginBottom:"4px"}}>Govt Jobs & Entrance Exams</h2>
      <div style={{display:"flex",gap:"0",marginBottom:"16px",background:C.bg,borderRadius:"12px",padding:"3px",border:`1px solid ${C.cardBorder}`}}>
        {[["exams","📋 Entrance Exams"],["roles","👔 Govt Job Roles"]].map(([id,label])=>(
          <button key={id} onClick={()=>setGovtTab(id)} style={{flex:1,padding:"9px",fontSize:"12px",fontWeight:govtTab===id?600:400,color:govtTab===id?C.textPrimary:C.textSecondary,background:govtTab===id?C.card:"transparent",border:"none",borderRadius:"10px",cursor:"pointer",fontFamily:"inherit"}}>{label}</button>
        ))}
      </div>
      {govtTab==="exams"&&(<div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"14px"}}>
          <button style={st.tag(govtExamCat==="all",C.gold)} onClick={()=>setGovtExamCat("all")}>All</button>
          {GOVT_EXAMS.map(g=><button key={g.category} style={st.tag(govtExamCat===g.category,g.color)} onClick={()=>setGovtExamCat(govtExamCat===g.category?"all":g.category)}>{g.category}</button>)}
        </div>
        {filteredExams.map(group=>(<div key={group.category} style={{marginBottom:"16px"}}>
          <div style={{fontWeight:600,fontSize:"12px",color:group.color,marginBottom:"7px",borderLeft:`3px solid ${group.color}`,paddingLeft:"10px"}}>{group.category}</div>
          {group.exams.map(exam=>(<div key={exam.name} style={{...st.card(group.color+"33"),display:"flex",flexWrap:"wrap",gap:"10px",alignItems:"flex-start",padding:"10px 13px",marginBottom:"6px"}}>
            <div style={{flex:1,minWidth:"120px"}}><div style={{fontWeight:600,fontSize:"12px"}}>{exam.name}</div><div style={{fontSize:"10px",color:C.textSecondary}}>by {exam.body}</div></div>
            <div style={{flex:2,minWidth:"140px"}}><div style={{fontSize:"11px",color:C.textSecondary,marginBottom:"2px"}}><span style={{color:C.textMuted}}>Elig: </span>{exam.elig}</div><div style={{fontSize:"11px",color:C.textSecondary}}><span style={{color:C.textMuted}}>For: </span>{exam.for}</div></div>
            <span style={{fontSize:"10px",padding:"3px 9px",borderRadius:"20px",background:exam.level==="National"?`${C.sky}20`:`${C.teal}20`,color:exam.level==="National"?C.sky:C.teal}}>{exam.level}</span>
          </div>))}
        </div>))}
      </div>)}
      {govtTab==="roles"&&(<div>
        <input value={govtSearch} onChange={e=>setGovtSearch(e.target.value)} placeholder="Search career or govt role..." style={{...st.input,marginBottom:"10px"}}/>
        {govtRoles.map(career=>{const meta=CAT_META[career.Category]||{color:C.gold,icon:"◉"};return(
          <div key={career.id} style={{...st.card(meta.color+"44"),borderLeft:`3px solid ${meta.color}`,padding:"11px 14px",marginBottom:"7px"}}>
            <div style={{display:"flex",gap:"8px",alignItems:"flex-start",marginBottom:"6px"}}><span style={{fontSize:"13px"}}>{meta.icon}</span><div style={{flex:1}}><div style={{fontWeight:600,fontSize:"12px"}}>{career.Career_name}</div><div style={{fontSize:"10px",color:C.textSecondary}}>{career.Category}</div></div><Badge text={career.future_scope||"–"} col={career.future_scope==="Very High"?C.mint:C.gold}/></div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{career.government_jobs.split(";").map(g=>g.trim()).filter(Boolean).map(g=><span key={g} style={{fontSize:"10px",color:C.gold,background:`${C.gold}15`,padding:"3px 8px",borderRadius:"20px"}}>{g}</span>)}</div>
          </div>
        );})}
      </div>)}
    </div>);
  };

  // ── STUDY ABROAD ──────────────────────────────────────────────────────────
  const renderAbroad=()=>(<div>
    <h2 style={{fontSize:"19px",fontWeight:700,marginBottom:"4px"}}>Study Abroad Programs</h2>
    <p style={{color:C.textSecondary,fontSize:"12px",marginBottom:"12px"}}><strong style={{color:C.textPrimary}}>354 programs</strong> worldwide</p>
    <div style={{marginBottom:"8px"}}><div style={{fontSize:"10px",color:C.textMuted,marginBottom:"4px"}}>Field</div><div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{abroadFields.map(f=><button key={f} style={st.tag(abroadField===f,C.lavender)} onClick={()=>setAbroadField(f)}>{f}</button>)}</div></div>
    <div style={{marginBottom:"12px"}}><div style={{fontSize:"10px",color:C.textMuted,marginBottom:"4px"}}>Level</div><div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{abroadLevels.map(l=><button key={l} style={st.tag(abroadLevel===l,C.pink)} onClick={()=>setAbroadLevel(l)}>{l}</button>)}</div></div>
    <div style={{fontSize:"10px",color:C.textMuted,marginBottom:"8px"}}>Showing {Math.min(filteredAbroad.length,60)} of {filteredAbroad.length}</div>
    <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
      {filteredAbroad.slice(0,60).map((a,i)=>(<div key={i} style={{...st.card(`${C.lavender}44`),borderLeft:`3px solid ${C.lavender}`,padding:"11px 14px",marginBottom:0}}>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"6px",marginBottom:"5px"}}>
          <div><div style={{fontWeight:600,fontSize:"12px"}}>{a.degree_name}</div><div style={{fontSize:"10px",color:C.textSecondary,marginTop:"1px"}}>{a.major} · {a.field}</div></div>
          <div style={{display:"flex",gap:"5px",alignItems:"center"}}><Badge text={a.program_level} col={C.lavender}/><span style={{fontSize:"10px",color:C.mint,fontWeight:600}}>{a.estimated_salary}</span></div>
        </div>
        <div style={{fontSize:"10px",color:C.textMuted,marginBottom:"5px"}}>Eligible: {a.eligible_stream_or_degree}</div>
        <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
          {[["Analytical",a.analytical_score,C.sky],["Math",a.math_score,C.teal],["Creative",a.creativity_score,C.lavender],["Comm",a.communication_score,C.accent],["Social",a.social_score,C.mint],["Demand",a.demand_score,C.gold]].map(([lbl,val,col])=>(<div key={lbl} style={{textAlign:"center"}}><div style={{fontSize:"9px",color:C.textMuted}}>{lbl}</div><div style={{fontSize:"11px",fontWeight:600,color:col}}>{val}/10</div></div>))}
        </div>
      </div>))}
    </div>
  </div>);

  // ── JOB MARKET ────────────────────────────────────────────────────────────
  const renderJobs=()=>(<div>
    <h2 style={{fontSize:"19px",fontWeight:700,marginBottom:"4px"}}>Job Market Insights</h2>
    <p style={{color:C.textSecondary,fontSize:"12px",marginBottom:"12px"}}>Demand scores & salary from 214 career dataset</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"12px"}}>
      <button style={st.tag(jobCat==="all")} onClick={()=>setJobCat("all")}>All</button>
      {CATEGORIES.map(cat=>{const meta=CAT_META[cat]||{color:C.textMuted};return<button key={cat} style={st.tag(jobCat===cat,meta.color)} onClick={()=>setJobCat(jobCat===cat?"all":cat)}>{cat}</button>;})}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
      {jobData.map(job=>{const meta=CAT_META[job.Category]||{color:C.textMuted};return(
        <div key={job.id} style={{...st.card(meta.color+"33"),padding:"11px 14px",marginBottom:0}}>
          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"6px"}}>
            <div><div style={{fontWeight:600,fontSize:"12px"}}>{job.Career_name}</div><div style={{fontSize:"10px",color:C.textSecondary,marginTop:"1px"}}>{job.Category} · {job.salary_range_india||"–"}</div></div>
            <Badge text={job.future_scope||"–"} col={job.future_scope==="Very High"?C.mint:job.future_scope==="High"?C.gold:C.textMuted}/>
          </div>
          <div style={{marginTop:"6px"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"9px",marginBottom:"2px",color:C.textSecondary}}><span>Demand</span><span style={{fontWeight:600,color:C.textPrimary}}>{job.demand_score}/100</span></div>
            <div style={{height:"4px",background:C.bg,borderRadius:"2px",overflow:"hidden"}}><div style={{height:"100%",width:`${job.demand_score}%`,background:`linear-gradient(90deg,${C.teal},${C.sky})`,borderRadius:"2px"}}/></div>
          </div>
        </div>
      );})}
    </div>
  </div>);

  // ── RESUME BUILDER ────────────────────────────────────────────────────────
  const renderResume=()=>{
    const EXP_TYPES=[{id:"fresher",label:"🎓 Fresher",desc:"No work experience"},{id:"internship",label:"📋 Internship",desc:"Done internship(s)"},{id:"experience",label:"💼 Experience",desc:"Have work experience"}];
    return(<div>
      <h2 style={{fontSize:"19px",fontWeight:700,marginBottom:"4px"}}>Resume Builder</h2>
      <p style={{color:C.textSecondary,fontSize:"12px",marginBottom:"16px"}}>Fill your details and download an ATS-optimized resume</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"12px"}}>
        <div style={st.card()}>
          <div style={{fontWeight:600,fontSize:"11px",color:C.sky,marginBottom:"9px"}}>👤 Personal Information</div>
          {[["name","Full Name","text"],["email","Email","email"],["phone","Phone","tel"],["dob","Date of Birth","date"],["address","City / Address","text"]].map(([k,l,t])=>(
            <div key={k} style={{marginBottom:"8px"}}><div style={{fontSize:"9px",color:C.textSecondary,marginBottom:"3px"}}>{l}</div><input type={t} value={resume[k]} onChange={e=>setResume(r=>({...r,[k]:e.target.value}))} style={st.input} placeholder={l}/></div>
          ))}
        </div>
        <div style={st.card()}>
          <div style={{fontWeight:600,fontSize:"11px",color:C.accent,marginBottom:"6px"}}>🎯 Career Objective</div>
          <div style={{fontSize:"9px",color:C.textSecondary,marginBottom:"6px"}}>2–3 sentences: your goal, field and top strength</div>
          <textarea value={resume.objective} onChange={e=>setResume(r=>({...r,objective:e.target.value}))} rows={5} placeholder="A motivated CS student seeking internship in software development to apply skills in Python and web development..." style={{...st.input,resize:"vertical"}}/>
          <div style={{fontSize:"9px",color:C.textMuted,marginTop:"4px"}}>💡 Mention field, goal, and key strength</div>
        </div>
        <div style={st.card()}>
          <div style={{fontWeight:600,fontSize:"11px",color:C.teal,marginBottom:"9px"}}>🎓 Education & Skills</div>
          <div style={{marginBottom:"8px"}}><div style={{fontSize:"9px",color:C.textSecondary,marginBottom:"3px"}}>Education</div><textarea value={resume.edu} onChange={e=>setResume(r=>({...r,edu:e.target.value}))} rows={3} placeholder={"12th - CBSE - 92% (2024)\nB.Tech CSE - XYZ College - 2nd Year"} style={{...st.input,resize:"vertical"}}/></div>
          <div style={{marginBottom:"8px"}}><div style={{fontSize:"9px",color:C.textSecondary,marginBottom:"3px"}}>Skills (comma separated)</div><input value={resume.skills} onChange={e=>setResume(r=>({...r,skills:e.target.value}))} style={st.input} placeholder="Python, Communication, Leadership, MS Office"/></div>
          <div><div style={{fontSize:"9px",color:C.textSecondary,marginBottom:"3px"}}>Languages Known</div><input value={resume.languages} onChange={e=>setResume(r=>({...r,languages:e.target.value}))} style={st.input} placeholder="Malayalam, English, Hindi"/></div>
        </div>
        <div style={st.card()}>
          <div style={{fontWeight:600,fontSize:"11px",color:C.lavender,marginBottom:"9px"}}>💼 Experience</div>
          <div style={{display:"flex",gap:"6px",marginBottom:"10px",flexWrap:"wrap"}}>
            {EXP_TYPES.map(t=>(
              <div key={t.id} onClick={()=>setResume(r=>({...r,expType:t.id}))} style={{flex:1,minWidth:"75px",padding:"7px 8px",borderRadius:"10px",cursor:"pointer",border:`1px solid ${resume.expType===t.id?C.lavender:C.cardBorder}`,background:resume.expType===t.id?`${C.lavender}18`:C.bg,textAlign:"center",transition:"all .15s"}}>
                <div style={{fontSize:"12px",marginBottom:"1px"}}>{t.label.split(" ")[0]}</div>
                <div style={{fontSize:"9px",fontWeight:600,color:resume.expType===t.id?C.lavender:C.textSecondary}}>{t.label.split(" ").slice(1).join(" ")}</div>
                <div style={{fontSize:"8px",color:C.textMuted,marginTop:"1px"}}>{t.desc}</div>
              </div>
            ))}
          </div>
          {resume.expType==="fresher"
            ?<div style={{background:`${C.mint}10`,border:`1px solid ${C.mint}33`,borderRadius:"9px",padding:"9px 12px",fontSize:"11px",color:C.mint,textAlign:"center"}}>✓ Fresher — education, skills & projects will highlight your profile.</div>
            :<><div style={{fontSize:"9px",color:C.textSecondary,marginBottom:"3px"}}>{resume.expType==="internship"?"Internship Details":"Work Experience Details"}</div>
              <textarea value={resume.experience} onChange={e=>setResume(r=>({...r,experience:e.target.value}))} rows={4} placeholder={resume.expType==="internship"?"e.g.\nSoftware Intern — XYZ Company (Jun–Aug 2024)\n• Built REST APIs using Python Flask":"e.g.\nJunior Developer — ABC Pvt Ltd\n• Developed web applications"} style={{...st.input,resize:"vertical"}}/></>}
        </div>
        <div style={st.card()}>
          <div style={{fontWeight:600,fontSize:"11px",color:C.sky,marginBottom:"6px"}}>🛠 Projects</div>
          <div style={{fontSize:"9px",color:C.textSecondary,marginBottom:"6px"}}>Personal, academic or open-source projects</div>
          <textarea value={resume.projects} onChange={e=>setResume(r=>({...r,projects:e.target.value}))} rows={5} placeholder={"1. CareerCompass AI — Django + React\n   Tech: Python, Django, React, SQLite\n\n2. Attendance System — Python + MySQL"} style={{...st.input,resize:"vertical"}}/>
          <div style={{fontSize:"9px",color:C.textMuted,marginTop:"4px"}}>💡 Include name, tech stack and impact</div>
        </div>
        <div style={st.card()}>
          <div style={{fontWeight:600,fontSize:"11px",color:C.gold,marginBottom:"6px"}}>🏆 Achievements & Extracurriculars</div>
          <textarea value={resume.achievements} onChange={e=>setResume(r=>({...r,achievements:e.target.value}))} rows={4} placeholder="Sports captain, NSS, Hackathon winner, State-level debate..." style={{...st.input,resize:"vertical"}}/>
        </div>
        <div style={st.card()}>
          <div style={{fontWeight:600,fontSize:"11px",color:C.gold,marginBottom:"6px"}}>📄 Target Job Description</div>
          <div style={{fontSize:"9px",color:C.textSecondary,marginBottom:"6px"}}>Paste the JD — used to generate ATS-optimized keywords</div>
          <textarea value={resume.jd} onChange={e=>setResume(r=>({...r,jd:e.target.value}))} rows={6} placeholder="Looking for a software engineer with 0–2 yrs experience in Python, REST APIs..." style={{...st.input,resize:"vertical"}}/>
        </div>
      </div>
      {/* ── Step 1: Generate ATS Resume ─────────────────────────── */}
      <div style={{...st.card(`${C.lavender}44`),marginTop:"14px",background:`${C.lavender}08`}}>
        <div style={{fontWeight:700,fontSize:"13px",color:C.lavender,marginBottom:"5px"}}>🧠 Step 1 — Generate ATS Resume</div>
        <div style={{fontSize:"11px",color:C.textSecondary,marginBottom:"10px",lineHeight:1.6}}>
          Click below to analyse your resume against the job description and generate an ATS-optimised version.
          {resume.jd?"":(" — ")} {!resume.jd&&<span style={{color:C.gold}}>Paste a JD above for keyword matching</span>}
        </div>
        <button style={{...st.btn(C.lavender),opacity:generatingResume?0.6:1}} onClick={generateATS} disabled={generatingResume}>
          {generatingResume?"⏳ Analysing...":"🧠 Generate ATS Resume"}
        </button>
      </div>

      {/* ── ATS Score + Download ──────────────────────────────────── */}
      {resumeGenerated&&(<div style={{...st.card(`${atsScore>=85?C.mint:atsScore>=70?C.gold:C.accent}44`),marginTop:"8px",background:`${atsScore>=85?C.mint:atsScore>=70?C.gold:C.accent}08`}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"8px",marginBottom:"10px"}}>
          <div>
            <div style={{fontWeight:700,fontSize:"13px"}}>
              {resume.jd
                ?<>ATS Score: <span style={{color:atsScore>=85?C.mint:atsScore>=70?C.gold:C.accent,fontSize:"20px"}}>{atsScore}%</span></>
                :"✓ Resume Generated (no JD — paste one for ATS score)"}
            </div>
            {resume.jd&&<div style={{fontSize:"10px",color:C.textSecondary,marginTop:"2px"}}>
              {atsScore>=85?"Excellent — strong JD match":atsScore>=70?"Good — consider adding missing keywords":"Needs improvement — add missing keywords below"}
            </div>}
          </div>
          {resume.jd&&atsScore!==null&&(
            <div style={{width:"52px",height:"52px",borderRadius:"50%",background:`${atsScore>=85?C.mint:atsScore>=70?C.gold:C.accent}22`,border:`3px solid ${atsScore>=85?C.mint:atsScore>=70?C.gold:C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:"13px",fontWeight:800,color:atsScore>=85?C.mint:atsScore>=70?C.gold:C.accent}}>{atsScore}%</span>
            </div>
          )}
        </div>

        {/* Matched keywords */}
        {atsMatched.length>0&&(<div style={{marginBottom:"8px"}}>
          <div style={{fontSize:"10px",color:C.mint,fontWeight:600,marginBottom:"4px"}}>✓ Matched Keywords ({atsMatched.length})</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>
            {atsMatched.slice(0,20).map(kw=><span key={kw} style={{fontSize:"10px",padding:"2px 8px",borderRadius:"20px",background:`${C.mint}18`,color:C.mint}}>{kw}</span>)}
          </div>
        </div>)}

        {/* Missing keywords */}
        {atsMissing.length>0&&(<div style={{marginBottom:"10px"}}>
          <div style={{fontSize:"10px",color:C.gold,fontWeight:600,marginBottom:"4px"}}>⚠ Add these to improve score ({atsMissing.length})</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>
            {atsMissing.map(kw=><span key={kw} style={{fontSize:"10px",padding:"2px 8px",borderRadius:"20px",background:`${C.gold}18`,color:C.gold}}>{kw}</span>)}
          </div>
        </div>)}

        {/* Step 2: Download */}
        <div style={{borderTop:`1px solid ${C.cardBorder}`,paddingTop:"10px",marginTop:"4px"}}>
          <div style={{fontWeight:600,fontSize:"11px",marginBottom:"7px"}}>📄 Step 2 — Download Your Resume</div>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            <button style={st.btn(C.mint)} onClick={downloadResumeDOCX}>⬇ Download ATS Resume (.rtf)</button>
            <button style={{...st.btnOut,fontSize:"12px"}} onClick={downloadResume}>⬇ Plain Text (.txt)</button>
          </div>
          <div style={{fontSize:"9px",color:C.textMuted,marginTop:"6px"}}>
            .rtf opens in Microsoft Word, Google Docs and LibreOffice — ATS scanners read it perfectly
          </div>
        </div>
      </div>)}
    </div>);
  };


  // ── STUDY PLANNER ────────────────────────────────────────────────────────
  const renderPlanner=()=>{

    const DAYS_SHORT=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const DAYS_FULL=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    const priorityCol={high:C.accent,medium:C.gold,low:C.teal};

    const daysUntil=(dateStr)=>{
      // Parse YYYY-MM-DD directly as LOCAL date (not UTC) to avoid timezone shift
      const [y,m,d]=dateStr.split("-").map(Number);
      const examDate=new Date(y,m-1,d);          // local midnight
      const today=new Date();today.setHours(0,0,0,0); // local today midnight
      return Math.round((examDate-today)/(1000*60*60*24));
    };

    const tabs=[
      {id:"goals",    icon:"🎯",label:"Goals"},
      {id:"exams",    icon:"⏰",label:"Exam Countdown"},
      {id:"schedule", icon:"📅",label:"Schedule"},
      {id:"habits",   icon:"✅",label:"Habits"},
    ];

    return(<div>
      <h2 style={{fontSize:"19px",fontWeight:700,marginBottom:"4px"}}>Study Planner</h2>
      <p style={{color:C.textSecondary,fontSize:"12px",marginBottom:"14px"}}>Your personal study execution tool — goals, countdowns, schedule & habits</p>

      {/* Tab switcher */}
      <div style={{display:"flex",gap:"4px",marginBottom:"16px",background:C.bg,borderRadius:"12px",padding:"3px",border:`1px solid ${C.cardBorder}`}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setPlanTab(t.id)} style={{flex:1,padding:"8px 4px",fontSize:"11px",fontWeight:planTab===t.id?700:400,color:planTab===t.id?C.textPrimary:C.textSecondary,background:planTab===t.id?C.card:"transparent",border:"none",borderRadius:"10px",cursor:"pointer",fontFamily:"inherit"}}>
            <span style={{fontSize:"13px",display:"block",marginBottom:"1px"}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ── GOALS ── */}
      {planTab==="goals"&&(<div>
        <div style={{display:"flex",gap:"7px",marginBottom:"12px",flexWrap:"wrap"}}>
          {["daily","weekly"].map(p=>(
            <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
              <div style={{fontSize:"10px",color:C.textSecondary,fontWeight:600,textTransform:"uppercase",letterSpacing:"1px"}}>{p} goals</div>
              {goals.filter(g=>g.period===p).map(g=>(
                <div key={g.id} style={{...st.card(priorityCol[g.priority]+"44"),display:"flex",alignItems:"center",gap:"9px",padding:"10px 13px",borderLeft:`3px solid ${priorityCol[g.priority]}`,marginBottom:0,minWidth:"280px"}}>
                  <input type="checkbox" checked={g.done} onChange={()=>setGoals(gs=>gs.map(x=>x.id===g.id?{...x,done:!x.done}:x))}
                    style={{width:"16px",height:"16px",accentColor:priorityCol[g.priority],cursor:"pointer",flexShrink:0}}/>
                  <div style={{flex:1,textDecoration:g.done?"line-through":"none",color:g.done?C.textMuted:C.textPrimary,fontSize:"13px"}}>{g.text}</div>
                  <span style={{fontSize:"9px",padding:"2px 7px",borderRadius:"20px",background:`${priorityCol[g.priority]}22`,color:priorityCol[g.priority],fontWeight:600,flexShrink:0}}>{g.priority}</span>
                  <button onClick={()=>setGoals(gs=>gs.filter(x=>x.id!==g.id))} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:"14px",padding:"0 2px",flexShrink:0}}>×</button>
                </div>
              ))}
              {goals.filter(g=>g.period===p).length===0&&<div style={{fontSize:"11px",color:C.textMuted,padding:"8px 0"}}>No {p} goals yet</div>}
            </div>
          ))}
        </div>
        <div style={{...st.card(),marginTop:"6px"}}>
          <div style={{fontWeight:600,fontSize:"11px",marginBottom:"9px",color:C.sky}}>+ Add New Goal</div>
          <input value={newGoal} onChange={e=>setNewGoal(e.target.value)} placeholder="e.g. Solve 30 maths problems" style={{...st.input,marginBottom:"7px"}}
            onKeyDown={e=>{if(e.key==="Enter"&&newGoal.trim()){setGoals(gs=>[...gs,{id:Date.now(),text:newGoal.trim(),done:false,period:newPeriod,priority:newPriority}]);setNewGoal("");}}}/>
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
            {["daily","weekly"].map(p=><button key={p} onClick={()=>setNewPeriod(p)} style={{...st.tag(newPeriod===p,C.sky),fontSize:"11px"}}>{p}</button>)}
            <div style={{flex:1}}/>
            {["high","medium","low"].map(p=><button key={p} onClick={()=>setNewPriority(p)} style={{...st.tag(newPriority===p,priorityCol[p]),fontSize:"11px"}}>{p}</button>)}
            <button onClick={()=>{if(newGoal.trim()){setGoals(gs=>[...gs,{id:Date.now(),text:newGoal.trim(),done:false,period:newPeriod,priority:newPriority}]);setNewGoal("");}}} style={st.btn(C.sky)}>Add</button>
          </div>
        </div>
        <div style={{display:"flex",gap:"8px",marginTop:"8px",flexWrap:"wrap",fontSize:"11px",color:C.textSecondary,alignItems:"center"}}>
          <span>✓ {goals.filter(g=>g.done).length}/{goals.length} done</span>
          <button onClick={()=>setGoals(gs=>gs.map(g=>({...g,done:false})))} style={{...st.btnOut,fontSize:"10px",padding:"4px 10px"}}>Reset Daily</button>
        </div>
      </div>)}

      {/* ── EXAM COUNTDOWN ── */}
      {planTab==="exams"&&(<div>
        <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"14px"}}>
          {planExams.sort((a,b)=>new Date(a.date)-new Date(b.date)).map(exam=>{
            const days=daysUntil(exam.date);
            const urgent=days>0&&days<=30;const soon=days>0&&days<=90;
            const col=urgent?C.accent:soon?C.gold:exam.color;
            const pct=Math.max(0,Math.min(100,Math.round((1-(days/365))*100)));
            return(
              <div key={exam.id} style={{...st.card(col+"44"),borderLeft:`3px solid ${col}`,padding:"14px 16px",marginBottom:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:"14px"}}>{exam.name}</div>
                    <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"2px"}}>{(()=>{const[y,m,d]=exam.date.split("-").map(Number);return new Date(y,m-1,d).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});})()}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:"26px",fontWeight:800,color:col,lineHeight:1}}>{days<0?"Completed ✓":days===0?"Today!":days}</div>
                    {days>0&&<div style={{fontSize:"10px",color:C.textMuted}}>days left</div>}
                  </div>
                </div>
                <div style={{height:"5px",background:C.bg,borderRadius:"3px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${col}88,${col})`,borderRadius:"3px"}}/>
                </div>
                {urgent&&days>0&&<div style={{fontSize:"10px",color:C.accent,marginTop:"5px",fontWeight:600}}>⚠ Less than 30 days — increase study intensity!</div>}
                <button onClick={()=>setPlanExams(es=>es.filter(e=>e.id!==exam.id))} style={{...st.btnOut,fontSize:"10px",padding:"4px 10px",marginTop:"8px"}}>Remove</button>
              </div>
            );
          })}
          {planExams.length===0&&<div style={{textAlign:"center",padding:"24px",color:C.textMuted,fontSize:"12px"}}>No exams added yet</div>}
        </div>
        <div style={st.card()}>
          <div style={{fontWeight:600,fontSize:"11px",color:C.accent,marginBottom:"9px"}}>+ Add Exam</div>
          <input value={newExam.name} onChange={e=>setNewExam(x=>({...x,name:e.target.value}))} placeholder="Exam name e.g. JEE Main 2026" style={{...st.input,marginBottom:"7px"}}/>
          <input type="date" value={newExam.date} onChange={e=>setNewExam(x=>({...x,date:e.target.value}))}
            style={{...st.input,marginBottom:"7px",colorScheme:"dark",color:C.textPrimary,background:C.bg}}/>
          {newExam.name&&!newExam.date&&<div style={{fontSize:"10px",color:C.gold,marginBottom:"5px"}}>⚠ Please pick a date above</div>}
          <button onClick={()=>{
            if(newExam.name&&newExam.date){
              setPlanExams(es=>[...es,{id:Date.now(),name:newExam.name,date:newExam.date,color:C.sky}]);
              setNewExam({name:"",date:""});
            }
          }} style={{...st.btn(C.accent),opacity:newExam.name&&newExam.date?1:0.5}}>Add Exam</button>
        </div>
      </div>)}

      {/* ── SCHEDULE ── */}
      {planTab==="schedule"&&(<div>
        <div style={{marginBottom:"12px"}}>
          {DAYS_FULL.map(day=>{
            const dayItems=schedule.filter(s=>s.day===day);
            if(dayItems.length===0)return null;
            return(<div key={day} style={{marginBottom:"10px"}}>
              <div style={{fontWeight:600,fontSize:"12px",color:C.sky,marginBottom:"5px",borderLeft:`3px solid ${C.sky}`,paddingLeft:"9px"}}>{day}</div>
              <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
                {dayItems.map(s=>(
                  <div key={s.id} style={{background:C.bg,border:`1px solid ${s.col}44`,borderLeft:`3px solid ${s.col}`,borderRadius:"10px",padding:"8px 12px",display:"flex",alignItems:"center",gap:"10px"}}>
                    <div style={{width:"52px",fontSize:"10px",color:C.textSecondary,flexShrink:0}}>{(()=>{const [h,m]=s.time.split(":");const hr=parseInt(h);return `${hr===0?12:hr>12?hr-12:hr}:${m} ${hr<12?"AM":"PM"}`})()}</div>
                    <div style={{flex:1,fontWeight:600,fontSize:"12px"}}>{s.subject}</div>
                    <span style={{fontSize:"10px",padding:"2px 7px",borderRadius:"20px",background:`${s.col}22`,color:s.col}}>{s.dur}</span>
                    <button onClick={()=>setSchedule(ss=>ss.filter(x=>x.id!==s.id))} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:"14px"}}>×</button>
                  </div>
                ))}
              </div>
            </div>);
          })}
        </div>
        <div style={st.card()}>
          <div style={{fontWeight:600,fontSize:"11px",color:C.teal,marginBottom:"9px"}}>+ Add Session</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px",marginBottom:"7px"}}>
            <select value={newSched.day} onChange={e=>setNewSched(s=>({...s,day:e.target.value}))} style={{...st.input,padding:"9px 12px"}}>
              {DAYS_FULL.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
            <input type="time" id="sched-time"
              defaultValue={newSched.time}
              onChange={e=>setNewSched(s=>({...s,time:e.target.value}))}
              style={{...st.input,colorScheme:"dark",color:C.textPrimary,background:C.bg,
                WebkitAppearance:"none",appearance:"none",cursor:"pointer"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px",marginBottom:"7px"}}>
            <input value={newSched.subject} onChange={e=>setNewSched(s=>({...s,subject:e.target.value}))} placeholder="Subject / Activity" style={st.input}/>
            <select value={newSched.dur} onChange={e=>setNewSched(s=>({...s,dur:e.target.value}))} style={{...st.input,padding:"9px 12px"}}>
              {["30min","45min","1h","1.5h","2h","2.5h","3h"].map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button onClick={()=>{if(newSched.subject.trim()){const colors=[C.sky,C.teal,C.mint,C.lavender,C.gold,C.accent,C.orange,C.pink];setSchedule(ss=>[...ss,{id:Date.now(),...newSched,col:colors[ss.length%colors.length]}]);setNewSched(s=>({...s,subject:""}));}}} style={st.btn(C.teal)}>Add Session</button>
        </div>
        <button onClick={()=>setSchedule([])} style={{...st.btnOut,fontSize:"11px",padding:"6px 13px",marginTop:"6px"}}>Clear All</button>
      </div>)}

      {/* ── HABITS ── */}
      {planTab==="habits"&&(<div>
        <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"14px"}}>
          {habits.map(h=>{
            const done=h.days.filter(Boolean).length;
            const pct=Math.round((done/7)*100);
            return(
              <div key={h.id} style={{...st.card(),marginBottom:0}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}>
                  <span style={{fontSize:"20px"}}>{h.icon}</span>
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:"13px"}}>{h.name}</div><div style={{fontSize:"10px",color:C.textSecondary,marginTop:"1px"}}>🔥 {h.streak} day streak · {done}/{h.target} this week</div></div>
                  <button onClick={()=>setHabits(hs=>hs.filter(x=>x.id!==h.id))} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:"16px"}}>×</button>
                </div>
                <div style={{display:"flex",gap:"4px",marginBottom:"6px"}}>
                  {DAYS_SHORT.map((day,i)=>(
                    <button key={day} onClick={()=>setHabits(hs=>hs.map(x=>x.id===h.id?{...x,days:x.days.map((d,j)=>j===i?d?0:1:d),streak:x.days[i]?Math.max(0,x.streak-1):x.streak+1}:x))}
                      style={{flex:1,padding:"5px 2px",borderRadius:"7px",border:`1px solid ${h.days[i]?C.mint:C.cardBorder}`,background:h.days[i]?`${C.mint}22`:C.bg,cursor:"pointer",fontSize:"10px",color:h.days[i]?C.mint:C.textMuted,fontFamily:"inherit"}}>
                      <div>{day}</div><div style={{marginTop:"2px"}}>{h.days[i]?"✓":"○"}</div>
                    </button>
                  ))}
                </div>
                <div style={{height:"5px",background:C.bg,borderRadius:"3px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${C.mint},${C.sky})`,borderRadius:"3px"}}/>
                </div>
                <div style={{fontSize:"9px",color:C.textMuted,marginTop:"3px",textAlign:"right"}}>{pct}% this week</div>
              </div>
            );
          })}
        </div>
        <div style={st.card()}>
          <div style={{fontWeight:600,fontSize:"11px",color:C.mint,marginBottom:"9px"}}>+ Add Habit</div>
          <div style={{display:"grid",gridTemplateColumns:"48px 1fr",gap:"7px",marginBottom:"7px"}}>
            <input value={newHabit.icon} onChange={e=>setNewHabit(h=>({...h,icon:e.target.value}))} style={{...st.input,textAlign:"center",fontSize:"18px"}} maxLength="2"/>
            <input value={newHabit.name} onChange={e=>setNewHabit(h=>({...h,name:e.target.value}))} placeholder="Habit name e.g. Morning Study" style={st.input}/>
          </div>
          <div style={{display:"flex",gap:"6px",alignItems:"center",marginBottom:"7px"}}>
            <span style={{fontSize:"11px",color:C.textSecondary}}>Target:</span>
            {[3,5,7].map(n=><button key={n} onClick={()=>setNewHabit(h=>({...h,target:n}))} style={st.tag(newHabit.target===n,C.mint)}>{n}×/week</button>)}
          </div>
          <button onClick={()=>{if(newHabit.name.trim()){setHabits(hs=>[...hs,{id:Date.now(),...newHabit,streak:0,days:[0,0,0,0,0,0,0]}]);setNewHabit({name:"",icon:"📖",target:7});}}} style={st.btn(C.mint)}>Add Habit</button>
        </div>
        <div style={{...st.card(`${C.gold}44`),background:`${C.gold}08`,marginTop:"2px"}}>
          <div style={{fontWeight:600,fontSize:"11px",color:C.gold,marginBottom:"5px"}}>📊 Weekly Summary</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"7px"}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:"18px",fontWeight:700,color:C.mint}}>{habits.reduce((s,h)=>s+h.days.filter(Boolean).length,0)}</div><div style={{fontSize:"9px",color:C.textSecondary}}>Total Check-ins</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:"18px",fontWeight:700,color:C.gold}}>{Math.max(...habits.map(h=>h.streak),0)}</div><div style={{fontSize:"9px",color:C.textSecondary}}>Longest Streak</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:"18px",fontWeight:700,color:C.sky}}>{habits.length}</div><div style={{fontSize:"9px",color:C.textSecondary}}>Active Habits</div></div>
          </div>
        </div>
      </div>)}
    </div>);
  };

  // ── COMING SOON ───────────────────────────────────────────────────────────
  const comingSoon=(icon,title,desc,col,features)=>(
    <div style={{textAlign:"center",padding:"60px 20px"}}>
      <div style={{fontSize:"40px",marginBottom:"10px"}}>{icon}</div>
      <h2 style={{fontSize:"21px",fontWeight:700,margin:"0 0 6px"}}>{title}</h2>
      <span style={{fontSize:"10px",padding:"4px 14px",borderRadius:"20px",background:`${col}20`,color:col,fontWeight:600,display:"inline-block",marginBottom:"14px"}}>Coming Soon</span>
      <p style={{color:C.textSecondary,fontSize:"13px",maxWidth:"380px",margin:"0 auto 18px",lineHeight:1.7}}>{desc}</p>
      <div style={{display:"flex",flexDirection:"column",gap:"7px",maxWidth:"320px",margin:"0 auto"}}>
        {features.map(f=><div key={f} style={{background:C.card,border:`1px solid ${C.cardBorder}`,borderRadius:"9px",padding:"9px 13px",fontSize:"12px",color:C.textMuted,textAlign:"left"}}>{f}</div>)}
      </div>
    </div>
  );

  const useMemo2=useMemo;

  const renderSession=()=>{
    switch(session){
      case "home":       return renderHome();
      case "assessment": return renderAssessmentFlow(false);
      case "coursetest": return renderAssessmentFlow(true);
      case "results":    return renderResults();
      case "advanced":   return <AdvancedAnalysis
          basicCareerScores={scores}
          basicCourseScores={courseScores}
          basicCareerResults={careerResults}
          basicCourseResults={courseResults}
          CAREER_DATA={CAREER_DATA}
          ABROAD_DATA={ABROAD_DATA}
          CAT_META={CAT_META}
          onCareerComplete={(results,traits)=>{setAdvCareerResults(results);setAdvCareerTraits(traits);setAdvResultsTab("career");setSession("advresults");}}
          onCourseComplete={(results,traits)=>{setAdvCourseResults(results);setAdvCourseTraits(traits);setAdvResultsTab("course");setSession("advresults");}}
          onNavigate={navTo}
        />;
      case "advresults": return renderAdvResults();
      case "dashboard":  return renderDashboard();
      case "explore":    return renderExplore();
      case "pathway":    return renderPathway();
      case "govtjobs":   return renderGovtJobs();
      case "abroad":     return renderAbroad();
      case "jobs":       return renderJobs();
      case "resume":     return renderResume();
      case "planner":    return renderPlanner();
      case "internship": return comingSoon("💼","Courses & Internship","Curated courses and internship finder for your career","#94a3b8",["🔍 Listings matching your assessment","📍 Filter by location & stipend","🏢 Top companies","📝 One-click resume + JD match"]);
      case "mentor":     return comingSoon("🔒","AI Mentor","Claude AI career counsellor",C.textMuted,["What careers suit me?","Best colleges for CSE in Kerala?","How to crack NEET in 6 months?","Scholarships for engineering students?"]);
      default:           return renderHome();
    }
  };

  return(<div style={{minHeight:"100vh",width:"100%",maxWidth:"100vw",overflowX:"hidden",background:C.bg,color:C.textPrimary,fontFamily:"'Space Grotesk','Segoe UI',sans-serif",display:"flex",flexDirection:"column"}}>
    <style>{`
      *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
      html,body,#root{width:100%;max-width:100vw;overflow-x:hidden;margin:0;padding:0}
      ::-webkit-scrollbar{width:4px;height:4px}
      ::-webkit-scrollbar-thumb{background:#2a2a45;border-radius:2px}
      input,textarea,button,select{font-family:inherit}
      input[type=range]{width:100%}
      input[type=date],input[type=time],input[type=datetime-local]{color-scheme:dark;color:#f0f0ff;background:#0d0d1a}
      img{max-width:100%}
    `}</style>
    <nav style={{background:C.card,borderBottom:`1px solid ${C.cardBorder}`,padding:"0 10px",display:"flex",alignItems:"center",gap:"1px",overflowX:"auto",overflowY:"hidden",position:"sticky",top:0,zIndex:100,scrollbarWidth:"none",WebkitOverflowScrolling:"touch",width:"100%",maxWidth:"100vw"}}>
      <div style={{fontSize:"12px",fontWeight:700,color:C.accent,marginRight:"6px",flexShrink:0}}>◈ CC</div>
      {SESSIONS.map(s=>(<button key={s.id} onClick={()=>setSession(s.id)} style={{padding:"12px 9px",fontSize:"10px",fontWeight:session===s.id?600:400,color:session===s.id?C.accent:C.textSecondary,cursor:"pointer",background:"none",border:"none",borderBottom:`2px solid ${session===s.id?C.accent:"transparent"}`,whiteSpace:"nowrap",fontFamily:"inherit"}}>{s.label}</button>))}
    </nav>
    <main style={{flex:1,padding:"18px 14px",maxWidth:"900px",margin:"0 auto",width:"100%",minWidth:0,overflowX:"hidden"}}>
      {renderSession()}
    </main>
  </div>);
}
