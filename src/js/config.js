/* ---------- board geometry ---------- */
const N=15;
// Build the 52-cell loop explicitly (row,col), clockwise from red start.
const TRACK=[];
// bottom arm: row6, col1..5
for(let c=1;c<=5;c++) TRACK.push([6,c]);
// left column up: row6..8 at col0 -- we go around the perimeter clockwise
// Rebuild cleanly clockwise starting at red start (6,1):
// Segment A: (6,1)->(6,5)        [bottom arm, top edge]  5 cells
// Segment B: (7,5),(8,5)         [left col lower]        2
// Segment C: (8,4)->(8,1)        [bottom row right->left]4
// Segment D: (9,0),(10,0)...(14,0)[left col down]        6
// Segment E: (14,1)->(14,5)      [bottom row]            5
// Segment F: (14,6)...(14,8)     [right col lower]       3
// Segment G: (13,9)...(9,9)      [bottom of top arm]     5
// Segment H: (8,9),(8,8)         [right col upper]       2  -- careful
// Let's instead use a known-correct coordinate list.
const T=[
 [6,1],[6,2],[6,3],[6,4],[6,5],
 [7,5],[8,5],
 [8,4],[8,3],[8,2],[8,1],
 [9,0],[10,0],[11,0],[12,0],[13,0],[14,0],
 [14,1],[14,2],[14,3],[14,4],[14,5],
 [14,6],[14,7],[14,8],
 [13,8],[12,8],[11,8],[10,8],[9,8],
 [8,8],[8,9],
 [8,10],[8,11],[8,12],[8,13],
 [7,13],[6,13],
 [6,12],[6,11],[6,10],[6,9],
 [5,8],[4,8],[3,8],[2,8],[1,8],
 [0,8],[0,7],[0,6],
 [1,6],[2,6],[3,6],[4,6],[5,6]
];
// T.length should be 52
const HOME={ pink:[], blue:[] };
// pink home column: row7, col1..5 (enter after index 50)
for(let c=1;c<=5;c++) HOME.pink.push([7,c]);
// blue home column: col13? blue starts at index10 (14,8)-> moves up col8? define blue home col8 row1..5
HOME.blue=[];
for(let r=1;r<=5;r++) HOME.blue.push([r,8]);
const START={pink:0, blue:10}; // T index where each color enters
const HOMEENTRY={pink:51, blue:9}; // after this track index, piece goes to home column
const SAFE=new Set([0,10,13,23,26,36,39,52]); // start cells + star corners
const JUMP=new Set([3,16,29,42]);   // +4 jump cells (one per color region)
const SKIP=new Set([7,20,33,46]);   // pause cells
const HEART=new Set([1,14,27,40,53]); // 心动格（触发事件卡）
const LUCKY=new Set([5,18,31,44,50]);  // 🍀 幸运格：触发奖励卡
const TRAP=new Set([9,22,35,48,54]);   // 💥 陷阱格：触发惩罚卡
// finish center cells
const FINISH_CELLS=[[6,6],[6,7],[6,8],[7,6],[7,7],[7,8],[8,6],[8,7],[8,8]];

/* map a piece's logical step -> grid coord */
function coordFor(color,step){
  if(step<0) return null;            // in dock
  if(step<=53){ const i=(START[color]+step)%55; return T[i]; }
  if(step<=56){ return HOME[color][step-51]; }
  return [7,7]; // finished (center)
}

/* ---------- game state ---------- */
const DIFFS=[
 {name:"① 懵懂小白",desc:"TA 随手乱走，纯靠运气 💭",ai:0},
 {name:"② 心有灵犀",desc:"TA 偶尔会吃你的子 🌱",ai:1},
 {name:"③ 默契搭档",desc:"TA 懂得躲危险、抢安全格 🌿",ai:2},
 {name:"④ 心有千结",desc:"TA 会算收益，认真追你 🍂",ai:3},
 {name:"⑤ 灵魂伴侣",desc:"TA 全程最优策略，超难 🥀",ai:4},
];
