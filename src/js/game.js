let state=null;

function newGame(diff){
  state={
    diff,
    turn:"pink",
    dice:0,
    rolling:false,
    mustMove:false,
    over:false,
    skip:{pink:false,blue:false},
    pieces:{
      pink:[{step:-1,fin:false},{step:-1,fin:false}],
      blue:[{step:-1,fin:false},{step:-1,fin:false}]
    }
  };
  renderAll();
  setMsg("你执粉 💗，先掷骰子开始~");
}

/* ---------- rules ---------- */
function canEnter(color){ return true; } // rolling a 6 (or 1 on easy) enters
function rollDie(){
  // difficulty influences nothing about the die itself; pure chance
  return 1+Math.floor(Math.random()*6);
}
function movablePieces(color,dice){
  const ps=state.pieces[color],res=[];
  ps.forEach((p,idx)=>{
    if(p.fin) return;
    if(p.step<0){
      if(dice===6) res.push(idx);   // need a 6 to launch
      return;
    }
    const ns=p.step+dice;
    if(ns>57) return;              // overshoot not allowed
    res.push(idx);
  });
  return res;
}
function isSafe(color,step){
  if(step<0||step>50) return true;
  const i=(START[color]+step)%52;
  return SAFE.has(i);
}
function applyMove(color,idx,dice){
  const p=state.pieces[color][idx];
  let extra=0,skip=false,msg="";
  if(p.step<0){ p.step=0; msg="起飞！💗"; }
  else { p.step+=dice; }
  if(p.step===57){ p.fin=true; msg="飞回家啦！🎉"; }
  else if(p.step<=50){
    const ti=(START[color]+p.step)%52;
    if(JUMP.has(ti)){ p.step=Math.min(50,p.step+4); msg="踩到跳格 +4！✨"; }
    else if(SKIP.has(ti)){ skip=true; msg="踩到暂停格，停一回合 ✋"; }
    // capture
    if(!isSafe(color,p.step)){
      const opp=color==="pink"?"blue":"pink";
      state.pieces[opp].forEach(q=>{
        if(!q.fin && q.step>=0 && q.step<=50 && q.step===p.step){
          q.step=-1; msg+=" 把 TA 送回家啦 💥";
        }
      });
    }
    // 心动格（仅情趣模式）
    if(HEART.has(ti)){ pendingCard=true; msg+=" 心动格 💋！"; }
  }
  return {extra,skip,msg};
}

/* ---------- AI ---------- */
function aiChoose(color,dice,opts){
  const ai=state.diff;
  if(ai<=0) return opts[Math.floor(Math.random()*opts.length)];
  const opp=color==="pink"?"blue":"pink";
  let best=opts[0],bestScore=-1e9;
  opts.forEach(idx=>{
    const p=state.pieces[color][idx];
    let s=0;
    const ns=p.step<0?0:p.step+dice;
    if(ns>57) return;
    if(ns===57) s+=1000;                       // finishing is best
    // capture value
    if(ns<=50 && !isSafe(color,ns)){
      state.pieces[opp].forEach(q=>{
        if(!q.fin&&q.step===ns&&q.step>=0) s+=120;
      });
    }
    // landing on safe / progress
    if(isSafe(color,ns)) s+=25;
    s+=ns;                                     // progress toward home
    // avoid landing where opponent can hit
    if(ns<=50 && !isSafe(color,ns)){
      state.pieces[opp].forEach(q=>{
        if(q.step>=0&&q.step<=50){
          const dist=(q.step-ns+52)%52;
          if(dist<=6) s-= (7-dist)*8;
        }
      });
    }
    // leaving dock is good early
    if(p.step<0) s+=15;
    if(ai>=3){ // higher levels look a bit ahead
      s+=Math.random()* (5-ai); // less randomness at higher levels
    }else{
      s+=Math.random()*30;
    }
    if(s>bestScore){bestScore=s;best=idx;}
  });
  return best;
}

/* ---------- rendering ---------- */
const boardEl=document.getElementById('board');
const piecesEl=document.getElementById('pieces');
function renderBoard(){
  boardEl.innerHTML='';
  for(let r=0;r<N;r++){
    for(let c=0;c<N;c++){
      const d=document.createElement('div');
      d.className='cell';
      // color regions
      if(r>=6&&r<=8){
        if(c>=6&&c<=8){ /* center */ }
        else if(c<6 && r===7) d.classList.add('red');       // pink home col
        else if(c>8 && r===7) d.classList.add('blue');      // blue home col
      }
      if(c>=6&&c<=8){
        if(r<6 && c===7) d.classList.add('blue');
        if(r>8 && c===7) d.classList.add('red');
      }
      // track coloring by which color's start region
      const ti=T.findIndex(x=>x[0]===r&&x[1]===c);
      if(ti>=0){
        const owner=ti<13?'pink':ti<26?'blue':ti<39?'pink':'blue';
        // color the 5-cell start streak
        if(ti%13<5) d.classList.add(owner==='pink'?'red':'yellow');
        if(SAFE.has(ti)) d.classList.add('safe');
        if(JUMP.has(ti)) d.classList.add('jump');
        if(SKIP.has(ti)) d.classList.add('skip');
        if(HEART.has(ti)) d.classList.add('heart');
      }
      // home columns
      if(HOME.pink.some(x=>x[0]===r&&x[1]===c)) d.classList.add('home','pinkH');
      if(HOME.blue.some(x=>x[0]===r&&x[1]===c)) d.classList.add('home','blueH');
      // center
      if(FINISH_CELLS.some(x=>x[0]===r&&x[1]===c)) d.classList.add('center');
      boardEl.appendChild(d);
    }
  }
}
function cellRect(r,c){
  const s=100/N;
  return {left:c*s, top:r*s, w:s, h:s};
}
function renderPieces(){
  piecesEl.innerHTML='';
  ['pink','blue'].forEach(color=>{
    state.pieces[color].forEach((p,idx)=>{
      const el=document.createElement('div');
      el.className='piece '+color;
      let pos;
      if(p.fin){ pos=cellRect(7,7); }
      else if(p.step<0){
        // dock slot
        const dock=document.getElementById(color==='pink'?'dockPink':'dockBlue');
        const dr=dock.getBoundingClientRect(), wr=document.getElementById('boardWrap').getBoundingClientRect();
        pos={left:(dr.left-wr.left)+dr.width*(0.25+0.5*(idx%2)), top:(dr.top-wr.top)+dr.height*(0.25+0.5*Math.floor(idx/2)), w:dr.width*0.5, h:dr.height*0.5};
      } else {
        const [r,c]=coordFor(color,p.step);
        const base=cellRect(r,c);
        pos={left:base.left+base.w*(0.25+0.18*(idx%2)), top:base.top+base.h*(0.25+0.18*Math.floor(idx/2)), w:base.w*0.64, h:base.h*0.64};
      }
      el.style.left=pos.left+'%'; el.style.top=pos.top+'%';
      el.style.width=pos.w+'%'; el.style.height=pos.h+'%';
      const body=document.createElement('div');
      body.className='body';
      body.textContent=color==='pink'?'💗':'💙';
      if(color===state.turn && state.mustMove && !state.over){
        const opts=movablePieces(color,state.dice);
        if(opts.includes(idx)){ el.classList.add('movable'); body.onclick=()=>onPieceClick(idx); }
      }
      if(p.fin) el.classList.add('fin');
      el.appendChild(body);
      piecesEl.appendChild(el);
    });
  });
}
function renderStatus(){
  const fp=state.pieces.pink.filter(p=>p.fin).length;
  const fb=state.pieces.blue.filter(p=>p.fin).length;
  document.getElementById('scorePink').textContent=fp+'/2';
  document.getElementById('scoreBlue').textContent=fb+'/2';
  document.getElementById('chipPink').classList.toggle('turnpink',state.turn==='pink'&&!state.over);
  document.getElementById('chipBlue').classList.toggle('turnblue',state.turn==='blue'&&!state.over);
}
function renderAll(){renderBoard();renderPieces();renderStatus();}

/* dice */
const PIPMAP={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
function renderDice(v){
  const pips=document.querySelectorAll('#dice .pip');
  pips.forEach(p=>p.classList.remove('on'));
  if(PIPMAP[v]) PIPMAP[v].forEach(i=>pips[i].classList.add('on'));
}
function setMsg(t){document.getElementById('msg').textContent=t;}

/* ---------- flow ---------- */
function roll(){
  if(state.over||state.rolling) return;
  if(state.mustMove) return;
  // handle skip
  if(state.skip[state.turn]){
    state.skip[state.turn]=false;
    setMsg((state.turn==='pink'?'你':'TA')+' 暂停一回合 ✋');
    setTimeout(()=>{endTurn(false);},900);
    return;
  }
  state.rolling=true;
  const d=document.getElementById('dice');
  d.classList.add('rolling');
  let n=0;
  const iv=setInterval(()=>{renderDice(1+Math.floor(Math.random()*6));n++;if(n>8){clearInterval(iv);d.classList.remove('rolling');finishRoll();}},60);
}
function finishRoll(){
  const v=rollDie();
  state.dice=v; renderDice(v); state.rolling=false;
  const color=state.turn;
  const opts=movablePieces(color,v);
  if(opts.length===0){
    setMsg((color==='pink'?'你':'TA')+' 掷到 '+v+'，没有可走的棋~');
    setTimeout(()=>endTurn(true),800);
    return;
  }
  state.mustMove=true;
  if(color==='pink'){ setMsg('掷到 '+v+'！点一颗会发光的棋走一走 💗'); renderPieces(); }
  else { setMsg('TA 掷到 '+v+'，思考中...'); setTimeout(aiMove,700); }
}
function onPieceClick(idx){
  if(!state.mustMove||state.turn!=='pink'||state.over) return;
  doMove('pink',idx);
}
function aiMove(){
  if(state.over) return;
  const opts=movablePieces('blue',state.dice);
  const idx=aiChoose('blue',state.dice,opts);
  doMove('blue',idx);
}
function doMove(color,idx){
  const before=state.pieces[color][idx].step;
  const r=applyMove(color,idx,state.dice);
  state.mustMove=false;
  renderAll();
  setMsg((color==='pink'?'你':'TA')+': '+r.msg);
  // check win
  if(state.pieces[color].every(p=>p.fin)){ endGame(color); return; }
  if(pendingCard){
    pendingCard=false;
    // 记录刚起飞的棋子，用于「拒绝」惩罚
    cardCtx={idx:idx, justLaunched:(before<0 && state.pieces[color][idx].step===0)};
    setTimeout(()=>drawEventCard(color),650);
    return; // 等玩家点「继续 / 拒绝」后再 endTurn
  }
  setTimeout(()=>endTurn(r.skip),700);
}
function endTurn(skipped){
  if(state.over) return;
  if(skipped){ state.skip[state.turn]=true; }
  state.turn=state.turn==='pink'?'blue':'pink';
  state.mustMove=false; state.dice=0;
  renderAll();
  if(state.turn==='blue'){ setMsg('TA 的回合 💙'); setTimeout(roll,600); }
  else { setMsg('你的回合 💗 掷骰子吧~'); }
}
function endGame(winner){
  state.over=true; state.mustMove=false;
  const win=winner==='pink';
  document.getElementById('resultTitle').textContent=win?'💗 你赢啦！':'💙 TA 赢啦';
  document.getElementById('resultText').textContent=win
    ? '两颗心都飞回了家，爱情满满！再来一局？'
    : '差一点点，TA 先到家~ 再试一次吧！';
  document.getElementById('result').classList.remove('hidden');
  renderAll();
}

/* ---------- menu ---------- */
const diffGrid=document.getElementById('diffGrid');
let selDiff=2;
DIFFS.forEach((d,i)=>{
  const b=document.createElement('div');
  b.className='diff-btn'+(i===selDiff?' sel':'');
  b.innerHTML='<div class="t">'+d.name+'</div><div class="d">'+d.desc+'</div>';
  b.onclick=()=>{selDiff=i;[...diffGrid.children].forEach((c,j)=>c.classList.toggle('sel',j===i));};
  diffGrid.appendChild(b);
});
document.getElementById('startBtn').onclick=()=>{
  document.getElementById('menu').classList.add('hidden');
  newGame(selDiff);
};
document.getElementById('againBtn').onclick=()=>{
  document.getElementById('result').classList.add('hidden');
  document.getElementById('menu').classList.remove('hidden');
};
document.getElementById('rollBtn').onclick=roll;
document.getElementById('menuBtn').onclick=()=>{
  document.getElementById('menu').classList.remove('hidden');
};

/* ---------- R18 情趣模式：事件卡（仅成人模式） ---------- */
let pendingCard=false;
let cardTurnSkip=false;       // 踩卡前该颜色是否已处于 skip
let cardCtx=null;             // 当前卡片上下文，用于「拒绝」惩罚
function pickCard(kind){
  const deck=CARDS[kind];
  return deck[Math.floor(Math.random()*deck.length)];
}
function drawEventCard(color){
  cardTurnSkip = state.skip[color] || false;
  // 心动格触发：随机惩罚 / 奖励 / 心动 / 姿势
  const r=Math.random();
  const kind = r<0.40?'punish' : r<0.65?'reward' : r<0.85?'heart':'position';
  let emoji,title,text,tagName,tagCls;
  if(kind==='position'){
    const pos=POSITIONS[Math.floor(Math.random()*POSITIONS.length)];
    emoji='💋'; title=pos[0]; text=pos[1];
    tagName='姿势'; tagCls='tag-position';
  }else{
    const picked=pickCard(kind);
    emoji=picked[0]; text=picked[1];
    const tagMap={punish:['惩罚','tag-punish'],reward:['奖励','tag-reward'],heart:['心动','tag-heart']};
    tagName=tagMap[kind][0]; tagCls=tagMap[kind][1];
  }
  const card=document.getElementById('eventCard');
  card.classList.remove('flipped');
  document.getElementById('eventEmoji').textContent=emoji;
  document.getElementById('eventTitle').textContent=title;
  document.getElementById('eventText').textContent=text;
  const tag=document.getElementById('eventTag');
  tag.textContent=tagName; tag.className='event-tag '+tagCls;
  document.getElementById('eventReject').style.display='';
  document.getElementById('eventOverlay').classList.remove('hidden');
  setMsg((color==='pink'?'你':'TA')+' 踩到心动格 💋 抽到一张'+tagName+'卡！');
}
function closeEventCard(rejected){
  document.getElementById('eventOverlay').classList.add('hidden');
  const ctx=cardCtx; cardCtx=null;
  const skip=cardTurnSkip; cardTurnSkip=false;
  const color=state.turn;
  if(rejected && ctx){
    // 拒绝惩罚：刚起飞的棋回停机坪；否则倒退 1~3 格
    const p=state.pieces[color][ctx.idx];
    if(ctx.justLaunched){ p.step=-1; }
    else if(p.step>=0){ p.step=Math.max(0,p.step-Math.floor(1+Math.random()*3)); }
    renderAll();
  }
  setTimeout(()=>endTurn(skip),300);
}
document.getElementById('eventOk').onclick=()=>closeEventCard(false);
document.getElementById('eventReject').onclick=()=>closeEventCard(true);

/* init */
renderBoard(); renderDice(0);
window.addEventListener('resize',()=>{if(state)renderPieces();});
