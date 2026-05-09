// AdvancedAnalysis.jsx — CareerCompass AI v5
// 15 cognitive modules + visual SVG questions + task-based puzzles
// Props: basicCareerScores, basicCourseScores, basicCareerResults, basicCourseResults,
//        CAREER_DATA, ABROAD_DATA, CAT_META, onCareerComplete, onCourseComplete, onNavigate

import { useState } from "react";

const C = {
  bg:"#0d0d1a", card:"#161628", cardBorder:"#2a2a45",
  accent:"#e94560", teal:"#0f9b8e", gold:"#f5a623",
  lavender:"#8b5cf6", mint:"#10b981", sky:"#3b82f6",
  pink:"#ec4899", orange:"#f97316",
  textPrimary:"#f0f0ff", textSecondary:"#9999bb", textMuted:"#5555aa",
};

const st = {
  card:(b=C.cardBorder)=>({background:C.card,border:`1px solid ${b}`,borderRadius:"16px",padding:"16px",marginBottom:"10px"}),
  btn:(col=C.accent)=>({background:col,color:"#fff",border:"none",borderRadius:"10px",padding:"11px 18px",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}),
  btnOut:{background:"transparent",color:C.textSecondary,border:`1px solid ${C.cardBorder}`,borderRadius:"10px",padding:"9px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"},
  opt:(sel,col)=>({background:sel?`${col}18`:C.bg,border:`1px solid ${sel?col:C.cardBorder}`,borderRadius:"10px",padding:"11px 14px",fontSize:"13px",color:C.textPrimary,cursor:"pointer",textAlign:"left",fontFamily:"inherit",width:"100%",marginBottom:"7px"}),
};

const PBar=({pct,col=C.lavender})=>(
  <div style={{height:"4px",background:C.cardBorder,borderRadius:"2px",overflow:"hidden",marginBottom:"16px"}}>
    <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${col},#8b5cf6)`,transition:"width .4s",borderRadius:"2px"}}/>
  </div>
);

const QBox=({children})=>(
  <div style={{background:`${C.sky}0d`,border:`1px solid ${C.sky}44`,borderRadius:"12px",padding:"12px 14px",marginBottom:"9px"}}>
    <div style={{fontSize:"10px",color:C.sky,fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>Solve this first</div>
    {children}
  </div>
);

const Shape=({type,color,size=34,rotate=0})=>{
  const s=size,cx=s/2,cy=s/2,r=s*0.4;
  const st2={transform:`rotate(${rotate}deg)`,transformOrigin:"center",display:"block"};
  if(type==="circle")return <svg width={s} height={s} style={st2}><circle cx={cx} cy={cy} r={r} fill={color}/></svg>;
  if(type==="square")return <svg width={s} height={s} style={st2}><rect x={s*.1} y={s*.1} width={s*.8} height={s*.8} fill={color}/></svg>;
  if(type==="triangle")return <svg width={s} height={s} style={st2}><polygon points={`${cx},${s*.08} ${s*.92},${s*.92} ${s*.08},${s*.92}`} fill={color}/></svg>;
  if(type==="diamond")return <svg width={s} height={s} style={st2}><polygon points={`${cx},${s*.05} ${s*.95},${cy} ${cx},${s*.95} ${s*.05},${cy}`} fill={color}/></svg>;
  if(type==="star")return <svg width={s} height={s} style={st2}><polygon points={`${cx},${s*.05} ${s*.61},${s*.35} ${s*.95},${s*.35} ${s*.68},${s*.57} ${s*.79},${s*.95} ${cx},${s*.73} ${s*.21},${s*.95} ${s*.32},${s*.57} ${s*.05},${s*.35} ${s*.39},${s*.35}`} fill={color}/></svg>;
  if(type==="arrow")return <svg width={s} height={s} style={st2}><polygon points={`${cx},${s*.05} ${s*.95},${cy} ${s*.7},${cy} ${s*.7},${s*.95} ${s*.3},${s*.95} ${s*.3},${cy} ${s*.05},${cy}`} fill={color}/></svg>;
  if(type==="hexagon")return <svg width={s} height={s} style={st2}><polygon points={`${cx},${s*.05} ${s*.9},${s*.27} ${s*.9},${s*.73} ${cx},${s*.95} ${s*.1},${s*.73} ${s*.1},${s*.27}`} fill={color}/></svg>;
  return <svg width={s} height={s} style={st2}><circle cx={cx} cy={cy} r={r} fill={color}/></svg>;
};

const SeqRow=({items,size=30})=>(
  <div style={{display:"flex",alignItems:"center",gap:"5px",background:C.bg,padding:"8px 12px",borderRadius:"10px",border:`1px solid ${C.cardBorder}`,flexWrap:"wrap",marginBottom:"8px"}}>
    {items.map((item,i)=>(
      <span key={i} style={{display:"flex",alignItems:"center",gap:"5px"}}>
        {item==="?"
          ?<div style={{width:size,height:size,borderRadius:"5px",border:`2px dashed ${C.textMuted}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:C.textMuted,fontSize:"13px",fontWeight:700}}>?</span></div>
          :item}
        {i<items.length-1&&<span style={{color:C.textMuted,fontSize:"10px"}}>→</span>}
      </span>
    ))}
  </div>
);

const TRAIT_WEIGHTS = {
  cognitive:     {"IT & Computer":1.2,"Research":1.3,"Science":1.2,"Space Science":1.2,"Engineering":1.1},
  analytical:    {"IT & Computer":1.2,"Business & Finance":1.1,"Engineering":1.2,"Research":1.2},
  spatial:       {"Engineering":1.3,"Design":1.2,"Aviation":1.2,"Space Science":1.1},
  memory:        {"Healthcare":1.2,"Law & Government":1.2,"Education":1.1,"Defense":1.1},
  creative:      {"Media & Creative":1.3,"Design":1.3,"IT & Computer":1.1,"Fashion":1.2},
  learning:      {"Research":1.2,"IT & Computer":1.1,"Biotech":1.2,"Education":1.1},
  curiosity:     {"Research":1.3,"Science":1.2,"Biotech":1.2,"Space Science":1.3},
  drive:         {"Business & Finance":1.2,"Law & Government":1.1,"Defense":1.2},
  workstyle:     {"Business & Finance":1.1,"IT & Computer":1.1,"Media & Creative":1.1},
  problemsolving:{"IT & Computer":1.2,"Engineering":1.2,"Research":1.1,"Forensics":1.3},
  environment:   {"Law & Government":1.2,"Defense":1.2,"Education":1.1,"Healthcare":1.1},
  mindset:       {"Research":1.1,"Business & Finance":1.1,"Space Science":1.2},
  values:        {"Healthcare":1.2,"Education":1.2,"Law & Government":1.1},
  skills:        {"IT & Computer":1.2,"Media & Creative":1.1,"Design":1.2},
  technical:     {"IT & Computer":1.4,"Engineering":1.3,"Space Science":1.2,"Research":1.2},
};

export const ADV_MODULES = [
  {id:"cognitive_puzzle",title:"Cognitive Puzzles",icon:"⬡",color:C.sky,trait:"cognitive",desc:"Abstract reasoning & logical deduction",
    questions:[
      {type:"visual",q:"Which colour fills the '?' — each row uses 3 different colours",
        visual:()=><div style={{marginBottom:"9px"}}><div style={{display:"inline-grid",gridTemplateColumns:"repeat(3,34px)",gap:"3px",background:C.bg,padding:"7px",borderRadius:"9px",border:`1px solid ${C.cardBorder}`}}>
          {[C.sky,C.gold,C.accent,C.gold,C.accent,C.sky,C.accent,"?",C.gold].map((cell,i)=><div key={i} style={{width:34,height:34,background:cell==="?"?C.bg:cell,borderRadius:"4px",border:cell==="?"?`2px dashed ${C.textMuted}`:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>{cell==="?"&&<span style={{color:C.textMuted,fontSize:"14px",fontWeight:700}}>?</span>}</div>)}
        </div></div>,
        opts:["Gold","Blue","Red","Purple"],ans:2},
      {type:"visual",q:"Arrow rotates 90° clockwise each step. What direction next?",
        visual:()=><SeqRow items={[<Shape type="arrow" color={C.mint} size={30} rotate={0}/>,<Shape type="arrow" color={C.mint} size={30} rotate={90}/>,<Shape type="arrow" color={C.mint} size={30} rotate={180}/>,<Shape type="arrow" color={C.mint} size={30} rotate={270}/>,"?"]}/>,
        opts:["Pointing left","Pointing right","Pointing up","Pointing down"],ans:2},
      {type:"visual",q:"Which is the odd one out?",
        visual:()=><div style={{display:"flex",gap:"12px",marginBottom:"8px",flexWrap:"wrap"}}>
          {[{t:"diamond",label:"A"},{t:"diamond",label:"B"},{t:"square",label:"C"},{t:"diamond",label:"D"}].map(({t,label})=>(
            <div key={label} style={{textAlign:"center"}}><Shape type={t} color={C.lavender} size={38}/><div style={{fontSize:"11px",color:C.textSecondary,marginTop:"2px"}}>{label}</div></div>
          ))}
        </div>,
        opts:["A","B","C — it is a square","D"],ans:2},
      {type:"text",q:"Number series: 3→7→13→21→31→? (gaps: +4,+6,+8,+10...)",opts:["41","43","45","47"],ans:1},
      {type:"visual",q:"Shapes gain one side each step: triangle→square→pentagon→?",
        visual:()=><SeqRow items={[<Shape type="triangle" color={C.sky} size={30}/>,<Shape type="square" color={C.sky} size={30}/>,<Shape type="hexagon" color={C.sky} size={30} opacity={0.5}/>,"?"]}/>,
        opts:["Circle","Hexagon","Star","Diamond"],ans:1},
      {type:"text",q:"A box has 6 faces. A shape of 3 connected boxes — how many internal shared faces?",opts:["2","4","6","8"],ans:1},
      // ── Very Hard Analytical ──
      {type:"text",q:"In a tournament, every team plays every other team once. 45 games total. How many teams?",opts:["8","9","10","12"],ans:2},
      {type:"text",q:"A snail is at bottom of 20m well. Climbs 5m/day, slips 3m/night. On which day does it escape?",opts:["8th","9th","10th","11th"],ans:2},
      {type:"text",q:"Series: 1, 1, 2, 3, 5, 8, 13, 21, 34, ? (Fibonacci)",opts:["54","55","56","57"],ans:1},
      {type:"text",q:"If you have 3 red, 4 blue, 5 green balls and pick without looking, minimum balls needed to guarantee 2 of same colour?",opts:["2","3","4","5"],ans:2},
      {type:"text",q:"A clock gains 5 min every hour. Set correctly at 9AM. What time does it show at actual 5PM?",opts:["5:36 PM","5:40 PM","6:00 PM","6:20 PM"],ans:1},
      {type:"text",q:"If all Bloops are Razzles and all Razzles are Lazzles, are all Bloops definitely Lazzles?",opts:["Yes","No","Only some","Cannot determine"],ans:0},
      {type:"text",q:"A number when divided by 3 gives remainder 1, by 4 gives remainder 2, by 5 gives remainder 3. Smallest such number?",opts:["22","34","47","58"],ans:2},
      {type:"text",q:"How many squares are in a 4×4 grid (count all sizes)?",opts:["16","20","24","30"],ans:3},
      {type:"text",q:"P, Q, R, S sit around a round table. P is left of Q. R is not next to P. S is right of R. Who sits opposite P?",opts:["Q","R","S","Cannot determine"],ans:1},
      {type:"text",q:"I have two coins totalling ₹6. One is NOT a ₹5 coin. What are the two coins?",opts:["₹5 and ₹1","₹4 and ₹2","₹3 and ₹3","₹2 and ₹4"],ans:0},
    ]},
  {id:"pattern_recognition",title:"Pattern Recognition",icon:"◈",color:C.teal,trait:"analytical",desc:"Detect rules and sequences in visual data",
    questions:[
      {type:"visual",q:"Size: big→small. Colour: Red→Blue→Gold. What is shape 6?",
        visual:()=><div style={{display:"flex",gap:"6px",alignItems:"center",flexWrap:"wrap",background:C.bg,padding:"8px",borderRadius:"10px",border:`1px solid ${C.cardBorder}`,marginBottom:"8px"}}>
          <Shape type="circle" color={C.accent} size={38}/><Shape type="circle" color={C.sky} size={22}/><Shape type="circle" color={C.gold} size={38}/><Shape type="circle" color={C.accent} size={22}/><Shape type="circle" color={C.sky} size={38}/>
          <div style={{width:30,height:30,borderRadius:"5px",border:`2px dashed ${C.textMuted}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:C.textMuted,fontSize:"12px",fontWeight:700}}>?</span></div>
        </div>,
        opts:["Small gold circle","Large gold circle","Small red circle","Large blue circle"],ans:0},
      {type:"visual",q:"Shading moves clockwise in each 2×2 grid. What comes next?",
        visual:()=><div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap",background:C.bg,padding:"8px",borderRadius:"10px",border:`1px solid ${C.cardBorder}`,marginBottom:"8px"}}>
          {[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]].map((row,ri)=>(
            <svg key={ri} width="36" height="36">
              <rect x="1" y="1" width="16" height="16" fill={row[0]?C.teal:C.cardBorder} rx="2"/>
              <rect x="19" y="1" width="16" height="16" fill={row[1]?C.teal:C.cardBorder} rx="2"/>
              <rect x="1" y="19" width="16" height="16" fill={row[2]?C.teal:C.cardBorder} rx="2"/>
              <rect x="19" y="19" width="16" height="16" fill={row[3]?C.teal:C.cardBorder} rx="2"/>
            </svg>
          ))}
          <div style={{width:36,height:36,border:`2px dashed ${C.textMuted}`,borderRadius:"4px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:C.textMuted,fontSize:"12px"}}>?</span></div>
        </div>,
        opts:["Top-left shaded","Top-right shaded","Bottom-left shaded","Bottom-right shaded"],ans:0},
      {type:"visual",q:"Inner shape is the next shape after the outer. What fills the last gap?",
        visual:()=><div style={{display:"flex",gap:"12px",marginBottom:"8px",flexWrap:"wrap",alignItems:"center",background:C.bg,padding:"8px",borderRadius:"10px",border:`1px solid ${C.cardBorder}`}}>
          {[{outer:"triangle",inner:"square",col:C.sky},{outer:"square",inner:"hexagon",col:C.gold},{outer:"hexagon",inner:null,col:C.accent}].map(({outer,inner,col},i)=>(
            <div key={i} style={{position:"relative",width:52,height:52,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Shape type={outer} color={col} size={52}/><div style={{position:"absolute"}}>
                {inner?<Shape type={inner} color={col} size={20}/>:<div style={{width:20,height:20,border:`2px dashed ${C.textMuted}`,borderRadius:"4px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:C.textMuted,fontSize:"10px"}}>?</span></div>}
              </div>
            </div>
          ))}
        </div>,
        opts:["A triangle","A circle","A square","A star"],ans:0},
      {type:"text",q:"Letter pattern (gaps +2,+3,+4,+5...): A, C, F, J, O, ?",opts:["T","U","V","W"],ans:1},
      {type:"visual",q:"Stars increase by 1 each row (1,2,3...). How many in row 4?",
        visual:()=><div style={{background:C.bg,padding:"9px 12px",borderRadius:"10px",border:`1px solid ${C.cardBorder}`,marginBottom:"8px"}}>
          {[1,2,3].map(row=><div key={row} style={{display:"flex",gap:"3px",marginBottom:"4px"}}>{Array(row).fill(0).map((_,i)=><Shape key={i} type="star" color={C.gold} size={18}/>)}</div>)}
          <div style={{display:"flex",gap:"4px",alignItems:"center"}}><span style={{fontSize:"11px",color:C.textMuted,marginRight:"3px"}}>Row 4:</span><div style={{width:22,height:22,border:`2px dashed ${C.textMuted}`,borderRadius:"4px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:C.textMuted,fontSize:"11px",fontWeight:700}}>?</span></div></div>
        </div>,
        opts:["3 stars","4 stars","5 stars","6 stars"],ans:1},
      {type:"text",q:"ABCD : DCBA :: LMNO : ?",opts:["ONML","MNOL","NOML","OLMN"],ans:0},
      // ── Very Hard Analytical Patterns ──
      {type:"text",q:"Find pattern: 2, 12, 36, 80, 150, ?  (n²×(n+1))",opts:["220","245","252","260"],ans:2},
      {type:"text",q:"In a 3×3 magic square where rows, columns & diagonals sum to 15, centre cell must be?",opts:["3","4","5","6"],ans:2},
      {type:"text",q:"Series: 0, 6, 24, 60, 120, 210, ? (n³−n)",opts:["290","316","336","360"],ans:2},
      {type:"text",q:"If 2+3=10, 4+3=24, 6+3=42, 8+3=?  (pattern: a×(a+b))",opts:["55","66","72","88"],ans:1},
      {type:"text",q:"How many triangles in a Star of David (6-pointed star)?",opts:["6","8","12","20"],ans:2},
      {type:"text",q:"Next: AZ, BY, CX, DW, ?",opts:["EV","FU","EW","DX"],ans:0},
      {type:"text",q:"If 1/3 of a number exceeds 1/4 by 15, what is the number?",opts:["120","150","180","210"],ans:2},
      {type:"text",q:"A man walks 5km N, 3km E, 5km S, 3km W. Net displacement?",opts:["0 km","6 km","3 km","16 km"],ans:0},
      {type:"text",q:"Pattern: 1, 8, 27, 64, 125, ? (perfect cubes)",opts:["196","210","216","225"],ans:2},
      {type:"text",q:"Odd one out in sequence: 2, 5, 10, 17, 26, 37, 50, 64  (n²+1)",opts:["37","50","64","26"],ans:2},
    ]},
  {id:"spatial_reasoning",title:"Spatial Reasoning",icon:"⬢",color:C.lavender,trait:"spatial",desc:"3D visualisation and spatial manipulation",
    questions:[
      {type:"visual",q:"Which option shows the triangle rotated 180°?",
        visual:()=><div style={{marginBottom:"9px"}}>
          <div style={{fontSize:"11px",color:C.textSecondary,marginBottom:"7px"}}>Original:</div>
          <Shape type="triangle" color={C.lavender} size={40}/>
          <div style={{fontSize:"11px",color:C.textSecondary,margin:"8px 0 5px"}}>Options:</div>
          <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
            {[0,90,180,270].map((rot,i)=><div key={i} style={{textAlign:"center"}}><Shape type="triangle" color={C.lavender} size={34} rotate={rot}/><div style={{fontSize:"10px",color:C.textSecondary,marginTop:"2px"}}>{["A","B","C","D"][i]}</div></div>)}
          </div>
        </div>,
        opts:["A (0°)","B (90°)","C (180°)","D (270°)"],ans:2},
      {type:"text",q:"A cube painted red on all faces, cut into 27 equal cubes. How many have exactly 2 red faces?",opts:["8","12","6","4"],ans:1},
      {type:"visual",q:"Paper folded once vertically, hole punched. How many holes when unfolded?",
        visual:()=><div style={{display:"flex",gap:"12px",alignItems:"center",marginBottom:"9px",flexWrap:"wrap"}}>
          <div style={{textAlign:"center"}}><svg width="70" height="56"><rect x="4" y="4" width="62" height="48" fill="none" stroke={C.lavender} strokeWidth="2" rx="3"/><line x1="35" y1="4" x2="35" y2="52" stroke={C.lavender} strokeWidth="1.5" strokeDasharray="4 3"/></svg><div style={{fontSize:"10px",color:C.textSecondary}}>fold</div></div>
          <span style={{color:C.textMuted}}>→</span>
          <div style={{textAlign:"center"}}><svg width="42" height="56"><rect x="4" y="4" width="34" height="48" fill="none" stroke={C.lavender} strokeWidth="2" rx="3"/><circle cx="21" cy="28" r="5" fill={C.accent}/></svg><div style={{fontSize:"10px",color:C.textSecondary}}>punch</div></div>
          <span style={{color:C.textMuted}}>→</span>
          <div style={{width:70,height:56,border:`2px dashed ${C.textMuted}`,borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:C.textMuted,fontSize:"11px"}}>unfold?</span></div>
        </div>,
        opts:["1 hole","2 holes","3 holes","4 holes"],ans:1},
      {type:"text",q:"You face North. Turn right 90°, left 180°, right 90°. Which direction now?",opts:["North","South","East","West"],ans:1},
      {type:"visual",q:"Which is the correct mirror image? (dot moves to opposite side)",
        visual:()=><div style={{marginBottom:"9px"}}>
          <div style={{fontSize:"11px",color:C.textSecondary,marginBottom:"6px"}}>Original (dot top-right):</div>
          <svg width="48" height="48"><rect x="2" y="2" width="44" height="44" fill="none" stroke={C.lavender} strokeWidth="2" rx="3"/><polygon points="14,42 34,42 24,10" fill={C.lavender} opacity="0.5"/><circle cx="38" cy="10" r="5" fill={C.accent}/></svg>
          <div style={{fontSize:"11px",color:C.textSecondary,margin:"8px 0 5px"}}>Mirror options:</div>
          <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
            {[{dotX:10,dotY:10,label:"A"},{dotX:38,dotY:38,label:"B"},{dotX:10,dotY:38,label:"C"},{dotX:38,dotY:10,label:"D"}].map(({dotX,dotY,label})=>(
              <div key={label} style={{textAlign:"center"}}>
                <svg width="42" height="42"><rect x="2" y="2" width="38" height="38" fill="none" stroke={C.lavender} strokeWidth="1.5" rx="2"/><polygon points="34,38 14,38 24,8" fill={C.lavender} opacity="0.5"/><circle cx={dotX} cy={dotY} r="4" fill={C.accent}/></svg>
                <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"2px"}}>{label}</div>
              </div>
            ))}
          </div>
        </div>,
        opts:["A","B","C","D"],ans:0},
      {type:"text",q:"How many edges does a triangular prism have?",opts:["6","8","9","12"],ans:2},
    ]},
  {id:"memory_test",title:"Memory & Attention",icon:"◉",color:C.mint,trait:"memory",desc:"Working memory, attention to detail and recall",
    questions:[
      {type:"text",q:"Market opens 9AM, closes 6PM, except Sundays when it closes 2PM. What time Sunday?",opts:["6 PM","2 PM","9 AM","Closed"],ans:1},
      {type:"text",q:"Which word was NOT in: CAT, DOG, FISH, BIRD, LION, TIGER?",opts:["FISH","BEAR","TIGER","BIRD"],ans:1},
      {type:"text",q:"Phone: 984-726-3051. Last 4 digits?",opts:["3051","2630","7263","0512"],ans:0},
      {type:"text",q:"Sequence: 7,2,9,4,6,1. What is the 4th number?",opts:["9","4","6","2"],ans:1},
      {type:"text",q:"How many times does E appear in: EXPERIENCE TEACHES EXCELLENCE?",opts:["4","5","6","7"],ans:2},
      {type:"text",q:"Today is Wednesday. Meeting in 10 days. What day?",opts:["Friday","Saturday","Sunday","Monday"],ans:1},
    ]},
  {id:"creative_analysis",title:"Creative Analysis",icon:"⌘",color:C.accent,trait:"creative",desc:"Originality, visual thinking and creative problem solving",
    questions:[
      {type:"visual",q:"Rule: each colour appears with only one shape. Which breaks the rule?",
        visual:()=><div style={{marginBottom:"9px"}}>
          <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
            {[{shape:"circle",col:C.sky,label:"A"},{shape:"square",col:C.gold,label:"B"},{shape:"triangle",col:C.mint,label:"C"},{shape:"circle",col:C.gold,label:"D"}].map(({shape,col,label})=>(
              <div key={label} style={{textAlign:"center"}}><Shape type={shape} color={col} size={38}/><div style={{fontSize:"10px",color:C.textSecondary,marginTop:"2px"}}>{label}</div></div>
            ))}
          </div>
          <div style={{fontSize:"10px",color:C.textMuted,marginTop:"7px"}}>Rule: Blue=circle, Gold=square, Green=triangle only</div>
        </div>,
        opts:["A — Blue circle","B — Gold square","C — Green triangle","D — Gold circle (breaks rule)"],ans:3},
      {type:"visual",q:"Which set has the most balanced composition (size variety)?",
        visual:()=><div style={{display:"flex",gap:"9px",marginBottom:"9px",flexWrap:"wrap"}}>
          {[{items:[38,38,38],label:"A",type:"circle"},{items:[38,24],label:"B",type:"square"},{items:[44,28,18],label:"C",type:"diamond"},{items:[34,34,34,34],label:"D",type:"hexagon"}].map(({items,label,type:t})=>(
            <div key={label} style={{textAlign:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:"2px",background:C.bg,padding:"5px",borderRadius:"7px",border:`1px solid ${C.cardBorder}`,minHeight:"48px",justifyContent:"center"}}>
                {items.map((s,i)=><Shape key={i} type={t} color={C.lavender} size={s}/>)}
              </div>
              <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"2px"}}>{label}</div>
            </div>
          ))}
        </div>,
        opts:["A — 3 same size","B — 2 shapes","C — varied sizes (balanced)","D — 4 same size"],ans:2},
      {type:"visual",q:"Sequence repeats every 3: star→circle→? Fill all 3 gaps",
        visual:()=><div style={{display:"flex",gap:"4px",alignItems:"center",flexWrap:"wrap",background:C.bg,padding:"8px 11px",borderRadius:"10px",border:`1px solid ${C.cardBorder}`,marginBottom:"8px"}}>
          {[1,2,3].map(g=>[<Shape key={`s${g}`} type="star" color={C.accent} size={26}/>,<Shape key={`c${g}`} type="circle" color={C.sky} size={26}/>,<div key={`q${g}`} style={{width:26,height:26,borderRadius:"4px",border:`2px dashed ${C.textMuted}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:C.textMuted,fontSize:"11px",fontWeight:700}}>?</span></div>]).flat()}
        </div>,
        opts:["Square fills all gaps","Triangle fills all gaps","Diamond fills all gaps","Pentagon fills all gaps"],ans:1},
      {type:"visual",q:"Which uses the most creative combination?",
        visual:()=><div style={{display:"flex",gap:"9px",flexWrap:"wrap",marginBottom:"8px"}}>
          {[{label:"A",items:[["circle",C.teal,28],["circle",C.teal,28],["circle",C.teal,28]]},{label:"B",items:[["star",C.gold,34],["diamond",C.lavender,26],["hexagon",C.accent,20]]},{label:"C",items:[["square",C.sky,30],["square",C.sky,30]]},{label:"D",items:[["triangle",C.mint,34],["triangle",C.mint,34],["triangle",C.mint,34]]}].map(({label,items})=>(
            <div key={label} style={{textAlign:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:"2px",background:C.bg,padding:"5px",borderRadius:"7px",border:`1px solid ${C.cardBorder}`,minHeight:"44px",justifyContent:"center"}}>
                {items.map(([t,c,s],i)=><Shape key={i} type={t} color={c} size={s}/>)}
              </div>
              <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"2px"}}>{label}</div>
            </div>
          ))}
        </div>,
        opts:["A — all circles","B — varied shapes & colours","C — blue squares","D — all triangles"],ans:1},
      {type:"text",q:"A company's sales are falling. Most creative solution:",opts:["Cut prices","Copy competitors","Repackage with completely new identity","Run more ads"],ans:2},
      {type:"text",q:"What do a clock, river, and story all have in common?",opts:["They all have hands","They have beginnings","They all flow in one direction","They are measurable"],ans:2},
    ]},
  {id:"learning_ability",title:"Learning Agility",icon:"⊛",color:C.gold,trait:"learning",desc:"How quickly you learn new rules and apply them",
    questions:[
      {type:"task",q:"In ZORO language: + means subtract, − means add. What is 10 + 4?",
        visual:()=><QBox><div style={{fontFamily:"monospace",fontSize:"13px",color:C.textPrimary,lineHeight:2}}>ZORO: <span style={{color:C.gold}}>+</span>=subtract <span style={{color:C.gold}}>−</span>=add <span style={{color:C.gold}}>×</span>=divide<br/>10 <span style={{color:C.gold}}>+</span> 4 = <span style={{color:C.textMuted}}>?</span></div></QBox>,
        opts:["14","6","40","2.5"],ans:1},
      {type:"task",q:"Same ZORO rules: × means divide. What is 20 × 4?",
        visual:()=><QBox><div style={{fontFamily:"monospace",fontSize:"13px",color:C.textPrimary,lineHeight:2}}>20 <span style={{color:C.gold}}>×</span> 4 = <span style={{color:C.textMuted}}>?</span></div></QBox>,
        opts:["80","16","5","24"],ans:2},
      {type:"task",q:"Red=1, Blue=2, Yellow=3. Blue-Yellow-Red as 3-digit number?",
        visual:()=><QBox><div style={{fontSize:"14px",lineHeight:2.2}}><span style={{color:C.accent}}>Red</span>=1 <span style={{color:C.sky}}>Blue</span>=2 <span style={{color:C.gold}}>Yellow</span>=3<br/><span style={{color:C.sky}}>Blue</span>-<span style={{color:C.gold}}>Yellow</span>-<span style={{color:C.accent}}>Red</span> = <span style={{color:C.textMuted}}>?</span></div></QBox>,
        opts:["6","321","231","123"],ans:2},
      {type:"task",q:"Scoring: correct=+3, skip=0, wrong=−1. Score: 8 correct, 2 skip, 5 wrong?",
        visual:()=><QBox><div style={{fontFamily:"monospace",fontSize:"12px",color:C.textPrimary,lineHeight:2}}>8×(+3)=24<br/>2×0=0<br/>5×(−1)=−5<br/>Total=<span style={{color:C.gold}}>?</span></div></QBox>,
        opts:["19","24","29","11"],ans:0},
      {type:"task",q:"Decode A=1,B=2...Z=26: 8-5-12-12-15",
        visual:()=><QBox><div style={{fontFamily:"monospace",fontSize:"13px",color:C.textPrimary,lineHeight:2.2}}>8=H 5=E 12=L 12=L 15=O<br/>Word: <span style={{color:C.gold}}>_____</span></div></QBox>,
        opts:["WORLD","HELLO","HELP","HOTEL"],ans:1},
      {type:"task",q:"Value = sides × colour_number (R=1,B=2,G=3). Blue square value?",
        visual:()=><QBox><div style={{fontSize:"13px",color:C.textPrimary,lineHeight:2}}>Square=4 sides × <span style={{color:C.sky}}>Blue</span>=2<br/>Value = <span style={{color:C.gold}}>?</span></div></QBox>,
        opts:["4","6","8","2"],ans:2},
    ]},
  {id:"curiosity_openness",title:"Curiosity & Openness",icon:"⊕",color:C.pink,trait:"curiosity",desc:"Intellectual curiosity and openness to new experiences",
    questions:[
      {type:"text",q:"When you read about an unfamiliar topic, you feel:",opts:["Bored","Slightly interested","Excited to learn more","Overwhelmed"],ans:2},
      {type:"text",q:"How often do you explore topics outside your syllabus?",opts:["Rarely","Occasionally","Frequently","Almost daily"],ans:2},
      {type:"text",q:"When you meet someone from a very different background:",opts:["Keep to yourself","Make polite conversation","Ask lots of questions","Feel uncomfortable"],ans:2},
      {type:"text",q:"Reaction to an unexpected experiment result:",opts:["Mark as wrong","Ignore it","Get curious about why","Redo to eliminate it"],ans:2},
      {type:"text",q:"How often do you ask Why or How when learning?",opts:["Rarely","Sometimes","Often","Almost always"],ans:3},
      {type:"text",q:"Which best describes you?",opts:["I prefer routine","I mix old and new","I seek new experiences constantly","I prefer what works"],ans:2},
    ]},
  {id:"goal_clarity",title:"Goal Clarity & Drive",icon:"◎",color:C.teal,trait:"drive",desc:"How clearly you define and pursue your goals",
    questions:[
      {type:"text",q:"When you set a goal, you typically:",opts:["Think vaguely","Write it with a deadline","Tell someone for accountability","Forget it quickly"],ans:1},
      {type:"text",q:"How far ahead do you plan your career?",opts:["I don't think about it","1–2 years","5–10 years","Clear vision but flexible"],ans:3},
      {type:"text",q:"When you face an obstacle in reaching a goal:",opts:["Give up","Look for a workaround","Revise the goal","Push through regardless"],ans:1},
      {type:"text",q:"How often do you review your progress?",opts:["Never","Occasionally","Monthly","Weekly or more"],ans:3},
      {type:"text",q:"Your motivation to achieve goals comes from:",opts:["External rewards","Fear of failure","Personal satisfaction","What others expect"],ans:2},
      {type:"text",q:"Your current career direction:",opts:["Very unclear","Somewhat clear","Fairly clear","Very clear with a plan"],ans:3},
    ]},
  {id:"work_style",title:"Work Style & Personality",icon:"⬡",color:"#f59e0b",trait:"workstyle",desc:"Your natural working style and environment preferences",
    questions:[
      {type:"text",q:"You work best:",opts:["Alone with full focus","In a small team","In a large group","It changes by task"],ans:3},
      {type:"text",q:"When given a project, you prefer:",opts:["Clear step-by-step instructions","A goal with freedom","Collaborate on the plan","Observe others first"],ans:1},
      {type:"text",q:"Your ideal workday has:",opts:["Fixed routine","Variety","Long deep focus","Mix of meetings and solo"],ans:3},
      {type:"text",q:"Under deadline pressure, you:",opts:["Panic","Work intensely","Ask for help","Try to extend deadline"],ans:1},
      {type:"text",q:"You prefer feedback:",opts:["In real time","At end of project","In formal reviews","From peers"],ans:0},
      {type:"text",q:"Which environment would you thrive in?",opts:["Startup — fast, creative","Corporate — structured","Research — deep","Field — outdoors"],ans:0},
    ]},
  {id:"problem_solving",title:"Problem Solving",icon:"⊗",color:C.sky,trait:"problemsolving",desc:"Actual problem-solving through mini-tasks",
    questions:[
      {type:"task",q:"Find the bug — function should return largest number. What is wrong?",
        visual:()=><QBox><div style={{fontFamily:"monospace",fontSize:"12px",color:C.textPrimary,lineHeight:1.9}}><span style={{color:C.lavender}}>function</span> findMax(a,b,c) {"{"}<br/>&nbsp;&nbsp;<span style={{color:C.lavender}}>if</span> (a {">"} b && a {">"} <span style={{color:C.accent}}>b</span>) <span style={{color:C.lavender}}>return</span> a;<br/>&nbsp;&nbsp;<span style={{color:C.lavender}}>if</span> (b {">"} c) <span style={{color:C.lavender}}>return</span> b;<br/>&nbsp;&nbsp;<span style={{color:C.lavender}}>return</span> c;<br/>{"}"}</div></QBox>,
        opts:["Missing return statement","First condition checks a>b twice instead of a>c","Wrong variable names","Function never runs"],ans:1},
      {type:"task",q:"3L jug + 5L jug. Get exactly 4L in the 5L jug.",
        visual:()=><QBox><div style={{fontSize:"13px",color:C.textPrimary,lineHeight:2}}>3L jug + 5L jug + unlimited water<br/>Goal: exactly <span style={{color:C.gold}}>4L</span> in the 5L jug</div></QBox>,
        opts:["Fill 5L, pour into 3L → 2L left. Empty 3L, pour 2L in, fill 5L, top up → 4L remains","Fill 3L twice into 5L → 1L space. Fill 3L, top up 5L → 4L left","Fill 5L twice","Not possible"],ans:1},
      {type:"task",q:"Which month had the highest GROWTH RATE (not absolute amount)?",
        visual:()=><QBox><table style={{fontSize:"12px",color:C.textPrimary,borderCollapse:"collapse",width:"100%"}}>
          <thead><tr style={{color:C.textSecondary}}><th style={{textAlign:"left",padding:"3px 8px"}}>Month</th><th style={{padding:"3px 8px"}}>Sales</th><th style={{padding:"3px 8px"}}>Prev</th><th style={{padding:"3px 8px",color:C.gold}}>Growth%</th></tr></thead>
          <tbody>{[["Jan","₹100","₹80","25%"],["Feb","₹130","₹100","30%"],["Mar","₹150","₹130","15%"],["Apr","₹180","₹150","20%"]].map(([m,s,p,g])=>(<tr key={m} style={{borderTop:`1px solid ${C.cardBorder}`}}><td style={{padding:"3px 8px"}}>{m}</td><td style={{padding:"3px 8px",textAlign:"center"}}>{s}</td><td style={{padding:"3px 8px",textAlign:"center",color:C.textMuted}}>{p}</td><td style={{padding:"3px 8px",textAlign:"center",color:C.gold}}>{g}</td></tr>))}</tbody>
        </table></QBox>,
        opts:["Jan — ₹20 gain","Feb — 30% growth","Mar — 15%","Apr — 20%"],ans:1},
      {type:"task",q:"Alex>Bob>Carol>Dan. Who is second tallest?",
        visual:()=><QBox><div style={{fontFamily:"monospace",fontSize:"13px",color:C.textPrimary,lineHeight:2}}>Alex {">"} Bob {">"} Carol {">"} Dan<br/>2nd = <span style={{color:C.gold}}>?</span></div></QBox>,
        opts:["Alex","Bob","Carol","Dan"],ans:1},
      {type:"task",q:"Product ₹200, +50% markup, then −50% discount. Final price?",
        visual:()=><QBox><div style={{fontFamily:"monospace",fontSize:"13px",color:C.textPrimary,lineHeight:2}}>₹200 + 50% = ₹300<br/>₹300 − 50% = ₹<span style={{color:C.gold}}>?</span></div></QBox>,
        opts:["₹200","₹150","₹100","₹175"],ans:1},
      {type:"task",q:"Find pattern: Input 2→5, 4→9, 6→13, 8→?",
        visual:()=><QBox><table style={{fontSize:"13px",color:C.textPrimary,borderCollapse:"collapse"}}><tbody>{[["Input","2","4","6","8"],["Output","5","9","13","?"]].map((row,i)=>(<tr key={i}>{row.map((cell,j)=>(<td key={j} style={{padding:"5px 10px",border:`1px solid ${C.cardBorder}`,color:cell==="?"?C.gold:j===0?C.textSecondary:C.textPrimary,fontWeight:cell==="?"?700:"normal"}}>{cell}</td>))}</tr>))}</tbody></table></QBox>,
        opts:["15","17","19","21"],ans:1},
    ]},
  {id:"work_environment",title:"Work Environment Fit",icon:"⊘",color:C.mint,trait:"environment",desc:"The environment where you perform best",
    questions:[
      {type:"text",q:"Which sector appeals most?",opts:["Government / Public","Private corporate","Startup","Academia / Research"],ans:0},
      {type:"text",q:"Preferred work output:",opts:["Tangible products","Services to people","Data / Research","Creative content"],ans:0},
      {type:"text",q:"How important is job security?",opts:["Top priority","Important but not only","Moderate risk ok","Not important — value freedom"],ans:1},
      {type:"text",q:"Which work perk matters most?",opts:["High salary","Work-life balance","Learning opportunities","Prestige"],ans:1},
      {type:"text",q:"You prefer working with:",opts:["Data and numbers","People and relationships","Ideas and concepts","Physical objects"],ans:0},
      {type:"text",q:"Ideal team size:",opts:["Solo / freelance","2–5 people","10–20 people","Large 50+"],ans:1},
    ]},
  {id:"growth_mindset",title:"Growth Mindset",icon:"⊛",color:C.lavender,trait:"mindset",desc:"Belief in growth through effort and resilience",
    questions:[
      {type:"text",q:"Intelligence and talent are:",opts:["Fixed — born with them","Mostly fixed","Developed through effort","Only by opportunity"],ans:2},
      {type:"text",q:"When you fail at something important:",opts:["Devastated long time","Briefly upset then improve","Indifferent","Motivated immediately"],ans:1},
      {type:"text",q:"Criticism from a mentor makes you:",opts:["Defensive","Upset but reflect later","Grateful and apply it","Depends on mentor"],ans:2},
      {type:"text",q:"You see challenges as:",opts:["Threats","Necessary evils","Opportunities to grow","Too stressful"],ans:2},
      {type:"text",q:"When someone is better than you:",opts:["Feel inferior","Feel competitive","Feel inspired and learn","Feel indifferent"],ans:2},
      {type:"text",q:"After a major setback, recovery time:",opts:["Weeks to months","A few weeks","A few days","A day or less"],ans:2},
    ]},
  {id:"value_system",title:"Values & Motivation",icon:"✦",color:C.gold,trait:"values",desc:"What drives you and what you value in a career",
    questions:[
      {type:"text",q:"Most important thing in a career:",opts:["Financial security","Making a positive impact","Creative expression","Continuous learning"],ans:1},
      {type:"text",q:"Which resonates most?",opts:["I want financial independence","I want to solve big problems","I want to create beautiful things","I want to understand everything"],ans:0},
      {type:"text",q:"Success to you means:",opts:["Being wealthy","Being recognized","Achieving personal goals","Helping others succeed"],ans:2},
      {type:"text",q:"Which work gives most satisfaction?",opts:["Complex technical challenges","Helping someone","Creating something original","Leading a team"],ans:0},
      {type:"text",q:"You feel most fulfilled when:",opts:["You earn a promotion","You solve a hard problem","You make someone's life easier","You learn something new"],ans:2},
      {type:"text",q:"Which value guides your decisions most?",opts:["Integrity","Ambition","Creativity","Compassion"],ans:0},
    ]},
  {id:"skill_exposure",title:"Skill Exposure",icon:"◈",color:C.teal,trait:"skills",desc:"Your real-world skill exposure across domains",
    questions:[
      {type:"text",q:"Which tools have you used? (most advanced)",opts:["MS Word/Excel only","Programming language (Python/Java)","Design tools (Figma/Photoshop)","Data tools (SQL/Tableau)"],ans:1},
      {type:"text",q:"Have you done any project or internship?",opts:["No experience yet","School/college project","Internship","Freelance / real client work"],ans:1},
      {type:"text",q:"Your coding knowledge:",opts:["None","Basic (HTML/scripts)","Intermediate (small apps)","Advanced (full-stack/ML)"],ans:1},
      {type:"text",q:"Experience with public speaking:",opts:["Very limited","Class presentations","Regular seminars","Competitions / professional"],ans:1},
      {type:"text",q:"Which area have you explored most on your own?",opts:["Technology / Coding","Business / Finance","Arts / Design","Science / Research"],ans:0},
      {type:"text",q:"Online courses or certifications completed:",opts:["None","1–2","3–5","6+"],ans:1},
    ]},
  {id:"coding_knowledge",title:"Technical & Coding",icon:"⟨⟩",color:"#38bdf8",trait:"technical",desc:"Technical thinking and coding aptitude",
    questions:[
      {type:"text",q:"What does a loop do in programming?",opts:["Stops program","Repeats a block of code","Defines a variable","Creates a function"],ans:1},
      {type:"text",q:"Which is first in, first out?",opts:["Stack","Queue","Tree","Graph"],ans:1},
      {type:"text",q:"Output of: print(2 ** 3) in Python?",opts:["6","8","9","23"],ans:1},
      {type:"text",q:"HTML stands for:",opts:["High Tech Markup Language","HyperText Markup Language","HyperText Modern Language","High Transfer Markup Language"],ans:1},
      {type:"text",q:"Which is NOT a programming language?",opts:["Python","Java","Linux","Swift"],ans:2},
      {type:"text",q:"What is a function in programming?",opts:["A type of variable","A reusable block of code","A loop structure","A data type"],ans:1},
    ]},
  {id:"numerical_display",title:"Numerical Ability",icon:"🔢",color:C.teal,trait:"numeric_display",desc:"Advanced math & quantitative reasoning (scored in basic test)",
    _displayOnly:true,
    questions:[]},
];

export default function AdvancedAnalysis({
  basicCareerScores={}, basicCourseScores={},
  basicCareerResults=[], basicCourseResults=[],
  CAREER_DATA=[], ABROAD_DATA=[], CAT_META={},
  onCareerComplete, onCourseComplete, onNavigate
}) {
  const [phase, setPhase]       = useState("intro");   // intro | field | test | done
  const [fieldChoice, setFieldChoice] = useState(null); // "career" | "course"
  const [modIdx, setModIdx]     = useState(0);
  const [qIdx,   setQIdx]       = useState(0);
  const [answers, setAnswers]   = useState({});
  const [traits, setTraits]     = useState({});
  const [results, setResults]   = useState([]);

  // Only active (non-display-only) modules
  const ACTIVE_MODS = ADV_MODULES.filter(m => !m._displayOnly);
  const TOTAL = ACTIVE_MODS.length;
  const totalQ = ACTIVE_MODS.reduce((s,m)=>s+m.questions.length,0);
  const doneQ  = ACTIVE_MODS.slice(0,modIdx).reduce((s,m)=>s+m.questions.length,0)+qIdx;
  const pct    = totalQ>0?Math.round((doneQ/totalQ)*100):0;

  const hasBasicCareer = basicCareerResults.length>0;
  const hasBasicCourse = basicCourseResults.length>0;

  const handleAnswer=(optIdx)=>{
    const mod=ACTIVE_MODS[modIdx];
    const key=`${mod.id}_${qIdx}`;
    // NO correct answer color shown — just store
    const newAns={...answers,[key]:{selected:optIdx,correct:optIdx===mod.questions[qIdx].ans}};
    setAnswers(newAns);
    setTimeout(()=>{
      if(qIdx<mod.questions.length-1){setQIdx(i=>i+1);return;}
      const modScore=Object.entries(newAns).filter(([k])=>k.startsWith(mod.id)).filter(([,v])=>v.correct).length;
      const newTraits={...traits,[mod.trait]:Math.round((modScore/mod.questions.length)*100)};
      setTraits(newTraits);
      const isLast=modIdx>=TOTAL-1;
      if(!isLast){setModIdx(m=>m+1);setQIdx(0);}
      else{computeResults(newAns,newTraits);}
    },350);
  };

  const computeResults=(allAns,t)=>{
    const ts={};
    Object.entries(t).forEach(([k,v])=>{ts[k]=v/100;});

    if(fieldChoice==="course"){
      // Score ABROAD_DATA using trait scores
      const scored=ABROAD_DATA.map((prog,i)=>{
        const analDiff=Math.abs((ts.analytical||0.5)-(prog.analytical_score||5)/10);
        const mathDiff=Math.abs((ts.analytical||0.5)-(prog.math_score||5)/10);
        const creatDiff=Math.abs((ts.creative||0.5)-(prog.creativity_score||5)/10);
        const commDiff=Math.abs((ts.learning||0.5)-(prog.communication_score||5)/10);
        const socDiff=Math.abs((ts.workstyle||0.5)-(prog.social_score||5)/10);
        const avg=(analDiff+mathDiff+creatDiff+commDiff+socDiff)/5;
        // Boost from basic course test if available
        const basicScore=basicCourseResults[i]?.match||50;
        const advMatch=Math.min(99,Math.round((1-avg)*70+(basicScore/100)*20+5));
        return{...prog,id:`abroad_${i}`,advMatch};
      }).sort((a,b)=>b.advMatch-a.advMatch);
      setResults(scored);
      setPhase("done");
      if(onCourseComplete)onCourseComplete(scored,t);
    } else {
      // Score CAREER_DATA using trait + weight boosting
      const scored=CAREER_DATA.map(career=>{
        let boost=1.0;
        Object.entries(TRAIT_WEIGHTS).forEach(([trait,catMap])=>{
          const tScore=ts[trait]||0.5;
          const catBoost=catMap[career.Category]||1.0;
          boost+=(catBoost-1.0)*tScore;
        });
        // Also factor in basic career result
        const basicMatch=(basicCareerResults.find(c=>c.id===career.id)?.match||50)/100;
        const advMatch=Math.min(99,Math.round((basicMatch*0.35+boost*0.65)*60+20));
        return{...career,advMatch,boost:Math.round(boost*100)/100};
      }).sort((a,b)=>b.advMatch-a.advMatch);
      setResults(scored);
      setPhase("done");
      if(onCareerComplete)onCareerComplete(scored,t);
    }
  };

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if(phase==="intro")return(
    <div>
      <div style={{textAlign:"center",padding:"16px 0 12px"}}>
        <div style={{fontSize:"32px",marginBottom:"8px"}}>🧠</div>
        <h2 style={{fontSize:"20px",fontWeight:700,margin:"0 0 6px"}}>Advanced Career Analysis</h2>
        <p style={{color:C.textSecondary,fontSize:"12px",maxWidth:"440px",margin:"0 auto 10px",lineHeight:1.7}}>
          <strong style={{color:C.textPrimary}}>15 modules</strong> — visual puzzles, pattern tasks, cognitive ability, personality profiling and more for maximum accuracy.
        </p>
        <div style={{background:`${C.gold}12`,border:`1px solid ${C.gold}33`,borderRadius:"10px",padding:"8px 14px",maxWidth:"360px",margin:"0 auto 14px",fontSize:"11px",color:C.textSecondary}}>
          ~20–25 minutes · 90 questions · Results build on your basic test
        </div>
        <button style={st.btn(C.lavender)} onClick={()=>setPhase("field")}>Choose Test Type →</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:"7px",marginTop:"6px"}}>
        {ADV_MODULES.map(m=>(
          <div key={m.id} style={{...st.card(m.color+"44"),borderLeft:`3px solid ${m.color}`,padding:"10px"}}>
            <div style={{fontSize:"14px",marginBottom:"3px"}}>{m.icon}</div>
            <div style={{fontWeight:600,fontSize:"10px",marginBottom:"2px"}}>{m.title}</div>
            <div style={{fontSize:"9px",color:C.textSecondary,lineHeight:1.5}}>{m.desc}</div>
            {m._displayOnly&&<div style={{fontSize:"8px",color:m.color,marginTop:"3px",fontWeight:600}}>Scored in Basic Test</div>}
          </div>
        ))}
      </div>
    </div>
  );

  // ── FIELD CHOICE ──────────────────────────────────────────────────────────
  if(phase==="field")return(
    <div style={{maxWidth:"460px",margin:"0 auto",padding:"20px 0"}}>
      <h2 style={{fontSize:"19px",fontWeight:700,marginBottom:"6px"}}>What are you testing for?</h2>
      <p style={{color:C.textSecondary,fontSize:"12px",marginBottom:"16px"}}>Advanced analysis builds on your basic test results — select what to improve</p>
      <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"18px"}}>
        {[
          ["career","💼 Career Roles","Advanced matching for career roles — builds on your Career Assessment",C.teal,hasBasicCareer,"Complete Career Assessment first to unlock"],
          ["course","✈ Study Abroad","Advanced matching for abroad programs — builds on your Course Test",C.lavender,hasBasicCourse,"Complete Course Test first to unlock"],
        ].map(([id,title,desc,col,unlocked,lockMsg])=>(
          <div key={id} onClick={()=>unlocked&&setFieldChoice(id)}
            style={{...st.card(fieldChoice===id?col:unlocked?C.cardBorder:"#333355"),borderLeft:`3px solid ${fieldChoice===id?col:unlocked?C.cardBorder:"#333355"}`,cursor:unlocked?"pointer":"not-allowed",padding:"14px 16px",background:fieldChoice===id?`${col}10`:C.card,opacity:unlocked?1:0.6,transition:"all .2s"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"4px"}}>
              <div style={{width:"14px",height:"14px",borderRadius:"50%",border:`2px solid ${col}`,background:fieldChoice===id?col:"transparent",flexShrink:0}}/>
              <div style={{fontWeight:600,fontSize:"13px",color:fieldChoice===id?col:C.textPrimary}}>{title}</div>
              {!unlocked&&<span style={{fontSize:"10px",color:"#ef4444",marginLeft:"auto"}}>🔒 Locked</span>}
            </div>
            <div style={{fontSize:"11px",color:C.textSecondary,paddingLeft:"24px"}}>{unlocked?desc:lockMsg}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:"8px"}}>
        <button style={st.btnOut} onClick={()=>setPhase("intro")}>← Back</button>
        <button style={{...st.btn(C.lavender),opacity:fieldChoice?1:0.5}} disabled={!fieldChoice}
          onClick={()=>{setModIdx(0);setQIdx(0);setAnswers({});setTraits({});setPhase("test");}}>
          Start 15 Modules →
        </button>
      </div>
    </div>
  );

  // ── TEST ──────────────────────────────────────────────────────────────────
  if(phase==="test"){
    const mod=ACTIVE_MODS[modIdx];
    const q=mod.questions[qIdx];
    const answered=answers[`${mod.id}_${qIdx}`];
    const Visual=q.visual;
    return(
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}>
          <div style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:mod.color}}>{mod.title}</div>
          <div style={{fontSize:"10px",color:C.textSecondary}}>Mod {modIdx+1}/{TOTAL} · Q{qIdx+1}/{mod.questions.length} · {pct}%</div>
        </div>
        <PBar pct={pct} col={mod.color}/>
        <div style={{...st.card(mod.color+"55"),borderLeft:`3px solid ${mod.color}`,marginBottom:"10px"}}>
          <div style={{fontSize:"10px",color:mod.color,marginBottom:"5px",fontWeight:600}}>{mod.icon} {mod.title}</div>
          {Visual&&<Visual/>}
          <div style={{fontSize:"14px",fontWeight:600,lineHeight:1.5,color:C.textPrimary}}>{q.q}</div>
          {q.hint&&<div style={{fontSize:"10px",color:C.textMuted,marginTop:"5px"}}>💡 {q.hint}</div>}
        </div>
        <div>
          {q.opts.map((opt,i)=>{
            const sel=answered?.selected===i;
            // NO correct answer color — only selected highlight
            return(
              <button key={i} disabled={!!answered} onClick={()=>handleAnswer(i)}
                style={st.opt(sel,mod.color)}>
                <span style={{opacity:0.4,marginRight:"8px"}}>{["A","B","C","D"][i]}.</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
        <div style={{display:"flex",gap:"4px",justifyContent:"center",marginTop:"12px",flexWrap:"wrap"}}>
          {ACTIVE_MODS.map((m,i)=>(
            <div key={m.id} style={{width:"6px",height:"6px",borderRadius:"50%",background:i<modIdx?C.mint:i===modIdx?m.color:C.cardBorder,transition:"background .3s"}}/>
          ))}
        </div>
      </div>
    );
  }

  // ── DONE ──────────────────────────────────────────────────────────────────
  if(phase==="done"){
    const top=results.slice(0,10);
    const strongTraits=[...Object.entries(traits)].sort((a,b)=>b[1]-a[1]).slice(0,5);
    const isAbroad=fieldChoice==="course";
    return(
      <div>
        <div style={{textAlign:"center",marginBottom:"14px"}}>
          <div style={{fontSize:"28px",marginBottom:"5px"}}>🎯</div>
          <h2 style={{fontSize:"18px",fontWeight:700,margin:"0 0 3px"}}>Analysis Complete — {isAbroad?"Study Abroad":"Career"} Results</h2>
          <p style={{color:C.textSecondary,fontSize:"11px"}}>Results saved to Adv. Results tab</p>
        </div>
        {/* Trait scores mini grid */}
        <div style={{...st.card(),marginBottom:"10px"}}>
          <div style={{fontWeight:600,fontSize:"11px",marginBottom:"8px"}}>Your Cognitive Profile</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:"5px"}}>
            {ACTIVE_MODS.slice(0,8).map(m=>{
              const score=traits[m.trait]||0;
              return(<div key={m.id} style={{background:C.bg,borderRadius:"8px",padding:"7px",textAlign:"center"}}>
                <div style={{fontSize:"11px",marginBottom:"2px"}}>{m.icon}</div>
                <div style={{fontSize:"8px",color:C.textSecondary,marginBottom:"3px"}}>{m.title.split(" ")[0]}</div>
                <div style={{height:"3px",background:C.cardBorder,borderRadius:"2px",overflow:"hidden",marginBottom:"2px"}}><div style={{height:"100%",width:`${score}%`,background:m.color,borderRadius:"2px"}}/></div>
                <div style={{fontSize:"10px",fontWeight:700,color:m.color}}>{score}%</div>
              </div>);
            })}
          </div>
        </div>
        {/* Top 5 results */}
        <div style={{fontWeight:600,fontSize:"12px",marginBottom:"7px"}}>Top {isAbroad?"Study Abroad Programs":"Career Matches"} — Advanced Score</div>
        {top.slice(0,5).map((item,i)=>{
          if(isAbroad)return(
            <div key={i} style={{...st.card(`${C.lavender}44`),display:"flex",alignItems:"center",gap:"9px",borderLeft:`3px solid ${C.lavender}`,marginBottom:"7px",padding:"11px 13px",cursor:"pointer"}}
              onClick={()=>onNavigate&&onNavigate("abroad")}>
              <div style={{width:"22px",height:"22px",borderRadius:"50%",background:`${C.lavender}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",flexShrink:0}}>✈</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:"12px"}}>{item.degree_name}</div>
                <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"1px"}}>{item.major} · {item.field} · {item.program_level}</div>
                <div style={{fontSize:"10px",color:C.mint,fontWeight:600,marginTop:"1px"}}>{item.estimated_salary}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:"16px",fontWeight:700,color:C.lavender}}>{item.advMatch}%</div>
                <div style={{fontSize:"9px",color:C.textMuted}}>tap → abroad</div>
              </div>
            </div>
          );
          const meta=CAT_META[item.Category]||{color:C.textMuted,icon:"◉"};
          return(
            <div key={item.id} style={{...st.card(meta.color+"44"),display:"flex",alignItems:"center",gap:"9px",borderLeft:`3px solid ${meta.color}`,marginBottom:"7px",padding:"11px 13px",cursor:"pointer"}}
              onClick={()=>onNavigate&&onNavigate("pathway",item.Career_name)}>
              <div style={{width:"22px",height:"22px",borderRadius:"50%",background:`${meta.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",flexShrink:0}}>{meta.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:"12px"}}>{item.Career_name}</div>
                <div style={{fontSize:"10px",color:C.textSecondary,marginTop:"1px"}}>{item.Category} · {item.salary_range_india||"–"}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:"16px",fontWeight:700,color:meta.color}}>{item.advMatch}%</div>
                <div style={{fontSize:"9px",color:C.textMuted}}>tap → pathway</div>
              </div>
            </div>
          );
        })}
        <div style={{display:"flex",gap:"8px",marginTop:"10px",flexWrap:"wrap"}}>
          <button style={st.btn(C.lavender)} onClick={()=>setSession&&setSession("advresults")}>View in Adv. Results →</button>
          <button style={st.btn(isAbroad?C.lavender:C.teal)} onClick={()=>{setPhase("field");setResults([]);setTraits({});setFieldChoice(null);}}>Test Other Type</button>
        </div>
      </div>
    );
  }
  return null;
}
