// Boots index.html headlessly against bloodwork.js and asserts it actually RENDERS.
// node --check only proves it parses. This proves it works.
//   usage:  node tools/check-js.js
const fs=require('fs'), path=require('path'), root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const js=html.slice(html.lastIndexOf('<script>')+8, html.lastIndexOf('</script>'));
const src=fs.readFileSync(path.join(root,'bloodwork.js'),'utf8');
const DATA=JSON.parse(src.slice(src.indexOf('{')).trim().replace(/;$/,''));

const el=id=>({id,innerHTML:'',value:'',dataset:{},classList:{add(){},remove(){},toggle(){},contains:()=>false},
 addEventListener(){},focus(){},blur(){},style:{setProperty(){}},offsetLeft:70,offsetWidth:34,offsetTop:0,
 setAttribute(){},title:'',closest:()=>null,tHead:null,querySelector:()=>null,files:[],
 insertAdjacentHTML(){},getBoundingClientRect:()=>({top:0,bottom:0,left:0,right:0,height:70,width:0})});
const n={}; ['chips','toc','tbl','srch','q','qx','sbtn','tbtn','top','topbar','odisc','omoon','osun','pick'].forEach(i=>n[i]=el(i));
global.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
global.document={getElementById:i=>n[i]||(n[i]=el(i)),
 querySelector:q=>(q==='.wrap'||q==='thead tr'||q==='thead th'||q==='meta[name=theme-color]')?el(q):null,
 querySelectorAll:()=>[],addEventListener(){},
 documentElement:{dataset:{},style:{setProperty(){}},classList:{add(){},remove(){}}},
 activeElement:{id:''},createElement:()=>el('x'),fonts:{ready:Promise.resolve()}};
global.window={addEventListener(){},scrollTo(){},scrollBy(){},scrollY:0,scrollX:0,innerHeight:900,
 matchMedia:()=>({matches:false}),storage:null,BLOODWORK:DATA};
global.requestAnimationFrame=f=>f(); global.clearTimeout=()=>{};
global.getComputedStyle=()=>({paddingLeft:'20px',getPropertyValue:()=>'#FFFFFF'});
let fail=0;
process.on('unhandledRejection',e=>{console.log('  ❌ async failure:',e);process.exit(1);});
(0,eval)(js);
setTimeout(()=>{
  const ok=(name,cond,extra='')=>{console.log(`  ${cond?'✅':'❌'} ${name}${extra?'  '+extra:''}`); if(!cond)fail++;};
  const rows=h=>(h.match(/<tr class="m"/g)||[]).length;
  const cols=h=>{const th=(h.match(/<th /g)||[]).length;
    const f=h.slice(h.indexOf('<tr class="m"'),h.indexOf('</tr>',h.indexOf('<tr class="m"')));
    return [th,(f.match(/<td /g)||[]).length];};
  ok('renders 66 rows', rows(n.tbl.innerHTML)===66, rows(n.tbl.innerHTML)+' rows');
  ok('boot placeholder replaced', !n.tbl.innerHTML.includes('Loading…'));
  ['all','flag','crit'].forEach(f=>{ setF(f);
    const [th,td]=cols(n.tbl.innerHTML);
    ok(`view "${f}" columns line up`, th===td, `th=${th} td=${td}`); });
  setF('all');
  ['flip','goto','onQ'].forEach(fn=>{
    try{ ({flip:()=>flip(),goto:()=>goto('cbc'),onQ:()=>onQ('hemoglobine')})[fn](); ok(fn+'()',true); }
    catch(e){ ok(fn+'()',false,e.message); } });
  onQ('');
  // the three data pages render from their blocks, and every entry survives the trip
  const count=(h,c)=>(h.match(new RegExp(`class="${c}`,'g'))||[]).length;
  // mirror the renderer's hour walk exactly: a TALL block must reach a later hour AND sit
  // alone in its starting hour; everything else (sub-hour ranges included) renders as a card
  const R0=DATA.ROUTINE;
  let _hr=parseInt(R0[0].t),_hEnd=parseInt(R0[R0.length-1].t),tallN=0,cardN=0;
  while(_hr<=_hEnd){
    const evs=R0.filter(r=>parseInt(r.t)===_hr);
    const b=evs.length===1&&evs[0].until&&parseInt(evs[0].until)>_hr?evs[0]:null;
    if(b){tallN++;_hr=Math.min(parseInt(b.until),_hEnd+1);continue;}
    cardN+=evs.length;_hr++;
  }
  const want={stack:['srow',DATA.STACK.items.length],
    routine:['rev',R0.length],   // every entry renders one row now — blocks included
    training:['ccard',DATA.TRAINING.cards.length],
    diet:['meal',DATA.DIET.meals.length]};
  Object.entries(want).forEach(([p,[cls,n2]])=>{
    try{ setPage(p);
      ok(`page "${p}" renders ${n2} ${cls}`, count(n.pages.innerHTML,cls)===n2,
        count(n.pages.innerHTML,cls)+' rendered'); }
    catch(e){ ok(`page "${p}"`,false,e.message); } });
  // the routine is a RULER: every hour from wake to lights-out gets a rail mark, and a
  // gym/work block renders as ONE box owning its whole span of hours
  try{ setPage('routine');
    const R=DATA.ROUTINE;
    const hours=parseInt(R[R.length-1].t)-parseInt(R[0].t)+1;
    const blocks=tallN;
    ok(`routine marks ${hours} hours on the rail`, count(n.pages.innerHTML,'rhl')===hours,
      count(n.pages.innerHTML,'rhl')+' marks');
    ok(`routine draws ${blocks} span rows`, count(n.pages.innerHTML,'rhr rblockrow')===blocks,
      count(n.pages.innerHTML,'rhr rblockrow')+' blocks');
    // block starts/ends earn the LONG tics, clamped to the ruler's range
    const H0=parseInt(R[0].t),H1=parseInt(R[R.length-1].t),lt=new Set();
    R.forEach(r=>{if(r.until){lt.add(parseInt(r.t));lt.add(parseInt(r.until));}});
    const ltN=[...lt].filter(hh=>hh>=H0&&hh<=H1).length;
    ok(`routine draws ${ltN} long tics`, count(n.pages.innerHTML,'rhl lt')===ltN,
      count(n.pages.innerHTML,'rhl lt')+' long tics');
    ok(`routine shows ${DATA.CARE.length} care cards`, count(n.pages.innerHTML,'ccard')===DATA.CARE.length,
      count(n.pages.innerHTML,'ccard')+' cards'); }
  catch(e){ ok('routine ruler',false,e.message); }
  // training cards are organised in muscle-group sub-sections; every set renders a column
  try{ setPage('training');
    const grps=DATA.TRAINING.cards.reduce((a,c)=>a+(c.groups?c.groups.length:0),0);
    ok(`training shows ${grps} muscle groups`, count(n.pages.innerHTML,'cgrp')===grps,
      count(n.pages.innerHTML,'cgrp')+' groups');
    let setsN=0,lblN=0;
    DATA.TRAINING.cards.forEach(c=>(c.groups||[]).forEach(g=>g.items.forEach(x=>{
      if(x.sets&&x.sets.length){setsN+=x.sets.length;lblN++;}})));
    ok(`training renders ${setsN} set columns`, count(n.pages.innerHTML,'exset"')===setsN,
      count(n.pages.innerHTML,'exset"')+' columns');
    ok(`training renders ${lblN} kg/reps legends`, count(n.pages.innerHTML,'exset exlbl')===lblN,
      count(n.pages.innerHTML,'exset exlbl')+' legends'); }
  catch(e){ ok('training groups',false,e.message); }
  try{ setPage('markers'); ok('back to markers', n.pages.hidden===true); }
  catch(e){ ok('back to markers',false,e.message); }
  const j2=JSON.parse(JSON.stringify(DATA)); j2.STACK.items[0].status='yolo';
  ok('audit rejects a bad STACK status', audit(j2).length===1);
  console.log(fail?`\n  ${fail} FAILED`:'\n  all passed');
  process.exit(fail?1:0);
},40);
