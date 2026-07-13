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
  console.log(fail?`\n  ${fail} FAILED`:'\n  all passed');
  process.exit(fail?1:0);
},40);
