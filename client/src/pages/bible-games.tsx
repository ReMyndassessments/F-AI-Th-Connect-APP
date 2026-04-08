import { useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, RotateCcw, Lightbulb, Home, RefreshCw } from "lucide-react";

type GameType = 'hub' | 'path' | 'wordle' | 'memory' | 'wordsearch' | 'unscramble' | 'booksorder';
type Difficulty = 'easy' | 'medium' | 'hard';

// =====================================================================
// SHARED UI: Difficulty Picker & Header
// =====================================================================
function DifficultyPicker({ value, onChange }: { value: Difficulty; onChange: (d: Difficulty) => void }) {
  const opts: { d: Difficulty; label: string; color: string }[] = [
    { d:'easy',   label:'Easy',   color:'bg-green-500 text-white' },
    { d:'medium', label:'Medium', color:'bg-amber-500 text-white' },
    { d:'hard',   label:'Hard',   color:'bg-red-500 text-white'   },
  ];
  return (
    <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
      {opts.map(o => (
        <button key={o.d} onClick={() => onChange(o.d)}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${value===o.d ? o.color : 'text-gray-500 hover:text-gray-700'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function GameHeader({ title, subtitle, onBack, onRefresh }: { title: string; subtitle: string; onBack: () => void; onRefresh: () => void }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 flex-shrink-0"><ArrowLeft className="w-5 h-5"/></button>
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-gray-900 truncate">{title}</h1>
        <p className="text-sm text-gray-500 truncate">{subtitle}</p>
      </div>
      <button onClick={onRefresh} className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold flex-shrink-0">
        <RefreshCw className="w-4 h-4"/> New
      </button>
    </div>
  );
}

// =====================================================================
// DATA
// =====================================================================

const PATH_PUZZLES = [
  {
    name: "Creation's Path", theme: "Trace God's creation journey", size: 6,
    numbers: { '0,0':1,'5,0':2,'5,5':3,'0,5':4,'0,1':5,'2,4':6,'2,3':7 },
    solution: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[4,5],[3,5],[2,5],[1,5],[0,5],[0,4],[0,3],[0,2],[0,1],[1,1],[2,1],[3,1],[4,1],[4,2],[4,3],[4,4],[3,4],[2,4],[1,4],[1,3],[1,2],[2,2],[3,2],[3,3],[2,3]]
  },
  {
    name: "Exodus Journey", theme: "Follow Moses through the wilderness", size: 6,
    numbers: { '0,0':1,'0,5':2,'1,5':3,'2,0':4,'2,5':5,'3,0':6,'4,5':7,'5,0':8 },
    solution: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[1,4],[1,3],[1,2],[1,1],[1,0],[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[3,5],[3,4],[3,3],[3,2],[3,1],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[5,5],[5,4],[5,3],[5,2],[5,1],[5,0]]
  },
  {
    name: "Jerusalem Spiral", theme: "Spiral your way to the Holy City", size: 6,
    numbers: { '0,0':1,'0,5':2,'5,5':3,'5,0':4,'1,1':5,'3,2':6 },
    solution: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[5,4],[5,3],[5,2],[5,1],[5,0],[4,0],[3,0],[2,0],[1,0],[1,1],[1,2],[1,3],[1,4],[2,4],[3,4],[4,4],[4,3],[4,2],[4,1],[3,1],[2,1],[2,2],[2,3],[3,3],[3,2]]
  }
];

const WORDLE_WORDS = [
  'GRACE','FAITH','PEACE','CROSS','GLORY','MERCY','PSALM','ANGEL','DAVID',
  'BLOOD','CROWN','FLESH','HEART','LIGHT','SWORD','TRIBE','WATER','SHEEP',
  'BREAD','EARTH','STONE','SERVE','ABIDE','JACOB','MOSES','JESUS','PETER',
  'JAMES','SARAH','HEROD','FEAST','GRAIN','HONEY','MOUNT','OLIVE','RIVER',
  'THORN','TOWER','WHEAT','KINGS','LIONS','PALMS'
];
const WORD_CLUES: Record<string,string> = {
  GRACE:"God's unmerited favor",FAITH:"Trust in what we cannot see",PEACE:"Surpasses all understanding",
  CROSS:"Where Jesus gave His life",GLORY:"The majesty of God",MERCY:"Compassion for the undeserving",
  PSALM:"A sacred song or poem",ANGEL:"God's heavenly messenger",DAVID:"Israel's greatest king",
  BLOOD:"Price of our redemption",CROWN:"The victor's reward",FLESH:"Our human nature",
  HEART:"God desires this above all",LIGHT:"Jesus called Himself this",SWORD:"Word of God is called this",
  TRIBE:"Israel divided into 12 of these",WATER:"Jesus turned this into wine",SHEEP:"Jesus shepherds these",
  BREAD:"Jesus — the Bread of Life",EARTH:"Created on Day 3",STONE:"Ten Commandments tablets",
  SERVE:"To minister to others",ABIDE:"To remain in Christ",JACOB:"He wrestled with God",
  MOSES:"Led Israel out of Egypt",JESUS:"The Son of God, our Savior",PETER:"Rock of the early church",
  JAMES:"Son of Zebedee, brother of John",SARAH:"Mother of nations, wife of Abraham",HEROD:"King who sought to kill Jesus",
  FEAST:"Celebration Jesus attended",GRAIN:"Disciples picked this on the Sabbath",HONEY:"Promised land flows with milk and this",
  MOUNT:"Jesus was transfigured on one",OLIVE:"Garden where Jesus prayed",RIVER:"Jordan — Jesus' baptism site",
  THORN:"Crown placed on Jesus' head",TOWER:"Built at Babel in pride",WHEAT:"Parable of the tares and this",
  KINGS:"Books of OT history",LIONS:"Daniel's den",PALMS:"Waved at Jesus' triumphal entry"
};

const ALL_MEMORY_PAIRS = [
  {id:1,a:'"For God so loved the world..."',b:'John 3:16'},
  {id:2,a:'"I can do all things through Christ..."',b:'Philippians 4:13'},
  {id:3,a:'"The Lord is my shepherd..."',b:'Psalm 23:1'},
  {id:4,a:'"Trust in the Lord with all your heart..."',b:'Proverbs 3:5'},
  {id:5,a:'"Be still and know that I am God..."',b:'Psalm 46:10'},
  {id:6,a:'"Love is patient, love is kind..."',b:'1 Corinthians 13:4'},
  {id:7,a:'"I am the way, the truth, and the life..."',b:'John 14:6'},
  {id:8,a:'"The joy of the Lord is your strength..."',b:'Nehemiah 8:10'},
];

const WORD_SEARCH_GRID = [
  ['G','L','O','R','Y','M','E','R','C','Y'],
  ['R','P','S','A','L','M','L','O','V','E'],
  ['G','D','A','V','I','D','B','T','X','K'],
  ['R','A','N','G','E','L','M','P','Q','Z'],
  ['A','F','A','I','T','H','W','N','J','X'],
  ['C','C','R','O','S','S','Y','K','L','M'],
  ['E','P','E','A','C','E','N','D','V','R'],
  ['X','B','Z','Q','W','R','T','Y','U','I'],
  ['S','T','P','A','L','M','J','K','H','G'],
  ['D','F','G','H','J','K','L','Z','X','C'],
];
const ALL_WORD_SEARCH_ANSWERS = [
  {word:'GLORY',cells:[[0,0],[0,1],[0,2],[0,3],[0,4]],color:'bg-yellow-300 text-yellow-900'},
  {word:'MERCY',cells:[[0,5],[0,6],[0,7],[0,8],[0,9]],color:'bg-blue-300 text-blue-900'},
  {word:'PSALM',cells:[[1,1],[1,2],[1,3],[1,4],[1,5]],color:'bg-green-300 text-green-900'},
  {word:'LOVE', cells:[[1,6],[1,7],[1,8],[1,9]],      color:'bg-pink-300 text-pink-900'},
  {word:'DAVID',cells:[[2,1],[2,2],[2,3],[2,4],[2,5]],color:'bg-orange-300 text-orange-900'},
  {word:'GRACE',cells:[[2,0],[3,0],[4,0],[5,0],[6,0]],color:'bg-purple-300 text-purple-900'},
  {word:'ANGEL',cells:[[3,1],[3,2],[3,3],[3,4],[3,5]],color:'bg-teal-300 text-teal-900'},
  {word:'FAITH',cells:[[4,1],[4,2],[4,3],[4,4],[4,5]],color:'bg-red-300 text-red-900'},
  {word:'CROSS',cells:[[5,1],[5,2],[5,3],[5,4],[5,5]],color:'bg-amber-300 text-amber-900'},
  {word:'PEACE',cells:[[6,1],[6,2],[6,3],[6,4],[6,5]],color:'bg-cyan-300 text-cyan-900'},
];

const ALL_UNSCRAMBLE_VERSES = [
  {ref:'Proverbs 3:5',     words:['Trust','in','the','Lord','with','all','your','heart'],           difficulty:'easy'   as Difficulty},
  {ref:'Psalm 23:1',       words:['The','Lord','is','my','shepherd','I','shall','not','want'],       difficulty:'easy'   as Difficulty},
  {ref:'Philippians 4:13', words:['I','can','do','all','things','through','Christ','who','strengthens','me'], difficulty:'medium' as Difficulty},
  {ref:'Romans 8:28',      words:['We','know','that','in','all','things','God','works','for','good'],difficulty:'medium' as Difficulty},
  {ref:'Joshua 1:9',       words:['Be','strong','and','courageous','the','Lord','your','God','is','with','you'], difficulty:'medium' as Difficulty},
  {ref:'John 3:16',        words:['For','God','so','loved','the','world','that','He','gave','His','only','Son'], difficulty:'hard'   as Difficulty},
  {ref:'Isaiah 40:31',     words:['Those','who','hope','in','the','Lord','will','renew','their','strength','and','soar'], difficulty:'hard' as Difficulty},
];

const ALL_BOOKS_SETS = [
  {testament:'Old Testament', books:['Genesis','Exodus','Leviticus','Numbers','Deuteronomy']},
  {testament:'New Testament', books:['Matthew','Mark','Luke','John','Acts']},
  {testament:'Old Testament', books:['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth']},
  {testament:'New Testament', books:['Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','Galatians']},
  {testament:'Old Testament', books:['Job','Psalms','Proverbs','Ecclesiastes','Isaiah','Jeremiah','Ezekiel','Daniel','Hosea','Amos','Jonah','Malachi']},
  {testament:'New Testament', books:['Ephesians','Philippians','Colossians','Hebrews','James','1 Peter','2 Peter','1 John','2 John','Jude','Revelation']},
];

// =====================================================================
// GAME 1: BIBLE PATH
// =====================================================================
function BiblePath({ onBack }: { onBack: () => void }) {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [path, setPath] = useState<number[][]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [key, setKey] = useState(0);

  const puzzle = PATH_PUZZLES[puzzleIdx];
  const size = puzzle.size;
  const maxGuesses = difficulty === 'easy' ? Infinity : difficulty === 'medium' ? Infinity : Infinity;
  const hintsAllowed = difficulty !== 'hard';
  const autoHint = difficulty === 'easy';

  const isInPath = (r: number, c: number) => path.some(([pr,pc]) => pr===r && pc===c);
  const isLastInPath = (r: number, c: number) => path.length>0 && path[path.length-1][0]===r && path[path.length-1][1]===c;
  const isAdjacent = (r1:number,c1:number,r2:number,c2:number) =>
    (Math.abs(r1-r2)===1&&c1===c2)||(Math.abs(c1-c2)===1&&r1===r2);

  const getNextRequired = () => {
    let maxNum=0;
    path.forEach(([r,c])=>{ const n=puzzle.numbers[`${r},${c}`]; if(n) maxNum=Math.max(maxNum,n); });
    return maxNum+1;
  };

  const handleCellClick = (r:number,c:number) => {
    const cellNum=puzzle.numbers[`${r},${c}`];
    if(isComplete) return;
    if(path.length===0){ if(cellNum===1) setPath([[r,c]]); return; }
    const [lastR,lastC]=path[path.length-1];
    if(lastR===r&&lastC===c){ setPath(prev=>prev.slice(0,-1)); return; }
    const ei=path.findIndex(([pr,pc])=>pr===r&&pc===c);
    if(ei!==-1){ setPath(prev=>prev.slice(0,ei+1)); return; }
    if(!isAdjacent(lastR,lastC,r,c)) return;
    const nextRequired=getNextRequired();
    if(cellNum&&cellNum!==nextRequired) return;
    const newPath=[...path,[r,c]];
    setPath(newPath);
    const maxNumber=Math.max(...Object.values(puzzle.numbers));
    if(newPath.length===size*size&&cellNum===maxNumber) setIsComplete(true);
  };

  const getHintCell = () => path.length<puzzle.solution.length ? puzzle.solution[path.length] : null;
  const reset = () => { setPath([]); setIsComplete(false); setShowHint(false); setKey(k=>k+1); };
  const hint = (autoHint || showHint) ? getHintCell() : null;

  const handleDifficultyChange = (d: Difficulty) => { setDifficulty(d); reset(); };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <GameHeader title={puzzle.name} subtitle={puzzle.theme} onBack={onBack} onRefresh={reset}/>

        <div className="mb-4"><DifficultyPicker value={difficulty} onChange={handleDifficultyChange}/></div>

        {difficulty==='easy' && <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 mb-3 text-xs text-green-800 font-medium">Hint cells highlighted automatically</div>}
        {difficulty==='hard' && <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 mb-3 text-xs text-red-800 font-medium">No hints available — good luck!</div>}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-sm text-blue-800">
          <p className="font-semibold">Connect the numbers in order — fill every cell</p>
          <p className="text-blue-600 mt-0.5">Tap cells to draw your path. Tap the last cell to undo a step.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <div className="grid gap-1.5" style={{gridTemplateColumns:`repeat(${size},1fr)`}}>
            {Array.from({length:size},(_,r)=>Array.from({length:size},(_,c)=>{
              const num=puzzle.numbers[`${r},${c}`];
              const inPath=isInPath(r,c);
              const isLast=isLastInPath(r,c);
              const isHintCell=hint&&hint[0]===r&&hint[1]===c;
              return(
                <div key={`${r},${c}`} onClick={()=>handleCellClick(r,c)}
                  className={`aspect-square flex items-center justify-center rounded-xl border-2 cursor-pointer transition-all select-none
                    ${isLast?'bg-green-500 border-green-600':inPath?'bg-green-200 border-green-300':isHintCell?'bg-amber-100 border-amber-400 animate-pulse':num?'bg-white border-gray-700 hover:bg-blue-50':'bg-white border-gray-200 hover:bg-blue-50'}`}>
                  {num?<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${inPath?'bg-gray-900 text-white':'bg-gray-800 text-white'}`}>{num}</div>
                     :inPath?<div className="w-3 h-3 rounded-full bg-green-500 opacity-60"/>:null}
                </div>
              );
            }))}
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-500 mb-3 px-1">
          <span>{path.length}/{size*size} cells filled</span>
          <span>Next: <strong>#{getNextRequired()}</strong></span>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 text-sm font-semibold text-gray-700">
            <RotateCcw className="w-4 h-4"/> Reset
          </button>
          {hintsAllowed && (
            <button onClick={()=>setShowHint(h=>!h)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold ${showHint||autoHint?'bg-amber-200 text-amber-800':'bg-amber-50 hover:bg-amber-100 text-amber-700'}`}>
              <Lightbulb className="w-4 h-4"/> {showHint||autoHint?'Hide Hint':'Hint'}
            </button>
          )}
          {!hintsAllowed && <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-gray-50 text-gray-300 cursor-not-allowed"><Lightbulb className="w-4 h-4"/> No Hints</div>}
        </div>

        <div className="flex gap-2">
          {PATH_PUZZLES.map((p,i)=>(
            <button key={i} onClick={()=>{setPuzzleIdx(i);reset();}} className={`flex-1 py-2.5 text-xs rounded-xl font-semibold ${puzzleIdx===i?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{p.name}</button>
          ))}
        </div>

        {isComplete&&(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Path Complete!</h2>
              <p className="text-gray-500 mb-1">You filled every cell and connected all the dots!</p>
              <p className="text-blue-600 font-semibold mb-6 capitalize">{difficulty} difficulty complete</p>
              <div className="flex gap-3">
                <button onClick={reset} className="flex-1 py-3 bg-gray-100 rounded-2xl font-semibold">Play Again</button>
                {puzzleIdx<PATH_PUZZLES.length-1&&<button onClick={()=>{setPuzzleIdx(i=>i+1);reset();}} className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-semibold">Next Puzzle</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// GAME 2: BIBLE WORDLE
// =====================================================================
const KEYBOARD_ROWS=[['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['ENTER','Z','X','C','V','B','N','M','DEL']];

function BibleWordle({ onBack }: { onBack: () => void }) {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const maxGuessesMap: Record<Difficulty,number> = {easy:8, medium:6, hard:5};
  const maxGuesses = maxGuessesMap[difficulty];

  const newWord = () => WORDLE_WORDS[Math.floor(Math.random()*WORDLE_WORDS.length)];
  const [targetWord, setTargetWord] = useState(newWord);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showClue, setShowClue] = useState(false);

  const resetGame = (newDiff?: Difficulty) => {
    setTargetWord(newWord()); setGuesses([]); setCurrent('');
    setGameOver(false); setWon(false);
    setShowClue((newDiff||difficulty)==='easy');
  };

  const handleDifficultyChange = (d: Difficulty) => { setDifficulty(d); resetGame(d); };

  const getLetterState=(letter:string,pos:number,guess:string):'correct'|'present'|'absent'=>{
    if(guess[pos]===letter) return 'correct';
    if(targetWord.includes(letter)) return 'present';
    return 'absent';
  };
  const getKeyState=(key:string):'correct'|'present'|'absent'|'unused'=>{
    let state:'correct'|'present'|'absent'|'unused'='unused';
    guesses.forEach(g=>g.split('').forEach((l,i)=>{
      if(l===key){const s=getLetterState(l,i,g);if(s==='correct')state='correct';else if(s==='present'&&state!=='correct')state='present';else if(s==='absent'&&state==='unused')state='absent';}
    }));
    return state;
  };
  const handleKey=(key:string)=>{
    if(gameOver) return;
    if(key==='DEL'||key==='BACKSPACE'){setCurrent(c=>c.slice(0,-1));}
    else if(key==='ENTER'){
      if(current.length!==5) return;
      const ng=[...guesses,current];setGuesses(ng);
      if(current===targetWord){setWon(true);setGameOver(true);}
      else if(ng.length>=maxGuesses){setGameOver(true);}
      setCurrent('');
    } else if(current.length<5&&/^[A-Z]$/.test(key)){setCurrent(c=>c+key);}
  };

  const tileColor=(state:string)=>{
    if(state==='correct') return 'bg-green-500 text-white border-green-600';
    if(state==='present') return 'bg-yellow-400 text-white border-yellow-500';
    if(state==='absent')  return 'bg-gray-500 text-white border-gray-600';
    return 'bg-white border-gray-300';
  };
  const keyColor=(state:string)=>{
    if(state==='correct') return 'bg-green-500 text-white';
    if(state==='present') return 'bg-yellow-400 text-white';
    if(state==='absent')  return 'bg-gray-400 text-white';
    return 'bg-gray-200 text-gray-800';
  };

  const diffLabel: Record<Difficulty,string> = {easy:'8 guesses + auto clue',medium:'6 guesses',hard:'5 guesses, no clues'};

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <GameHeader title="Bible Wordle" subtitle={`Guess the 5-letter Bible word — ${diffLabel[difficulty]}`} onBack={onBack} onRefresh={()=>resetGame()}/>

        <div className="mb-4"><DifficultyPicker value={difficulty} onChange={handleDifficultyChange}/></div>

        {showClue&&(
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-800 text-center">
            <span className="font-semibold">Clue:</span> {WORD_CLUES[targetWord]}
          </div>
        )}

        <div className="flex flex-col items-center gap-1.5 mb-4">
          {Array.from({length:maxGuesses},(_,rowIdx)=>{
            const guess=guesses[rowIdx]||'';
            const isCurrentRow=rowIdx===guesses.length&&!gameOver;
            const displayWord=isCurrentRow?current.padEnd(5,' '):guess.padEnd(5,' ');
            return(
              <div key={rowIdx} className="flex gap-1.5">
                {Array.from({length:5},(_,colIdx)=>{
                  const letter=displayWord[colIdx]?.trim()||'';
                  const state=guess?getLetterState(guess[colIdx],colIdx,guess):'empty';
                  return(
                    <div key={colIdx} className={`w-10 h-10 sm:w-12 sm:h-12 border-2 flex items-center justify-center text-base sm:text-lg font-bold rounded-lg transition-colors
                      ${guess?tileColor(state):isCurrentRow&&letter?'border-gray-500 bg-white':'border-gray-200 bg-white'}`}>
                      {letter}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-1.5 mb-4">
          {KEYBOARD_ROWS.map((row,ri)=>(
            <div key={ri} className="flex gap-1">
              {row.map(key=>(
                <button key={key} onClick={()=>handleKey(key)}
                  className={`${key.length>1?'px-1.5 text-xs min-w-[36px] sm:min-w-[44px]':'w-7 sm:w-9'} h-10 sm:h-12 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center select-none touch-manipulation ${keyColor(getKeyState(key))}`}>
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {difficulty!=='hard'&&(
            <button onClick={()=>setShowClue(s=>!s)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-50 rounded-xl text-amber-700 text-sm font-semibold hover:bg-amber-100">
              <Lightbulb className="w-4 h-4"/> {showClue?'Hide Clue':'Show Clue'}
            </button>
          )}
          {difficulty==='hard'&&<div className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl text-gray-300 text-sm font-semibold cursor-not-allowed"><Lightbulb className="w-4 h-4"/> No Clues</div>}
          <button onClick={()=>resetGame()} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl text-gray-700 text-sm font-semibold hover:bg-gray-200">
            <RotateCcw className="w-4 h-4"/> New Word
          </button>
        </div>

        {gameOver&&(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl">
              <div className="text-5xl mb-4">{won?'🎉':'📖'}</div>
              <h2 className="text-2xl font-bold mb-2">{won?'Well done!':'The word was...'}</h2>
              <div className="text-3xl font-bold text-blue-600 mb-2">{targetWord}</div>
              <p className="text-gray-500 mb-6 italic">{WORD_CLUES[targetWord]}</p>
              <button onClick={()=>resetGame()} className="w-full py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700">Play Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// GAME 3: MEMORY MATCH
// =====================================================================
function MemoryMatch({ onBack }: { onBack: () => void }) {
  const shuffleFn=<T,>(arr:T[])=>[...arr].sort(()=>Math.random()-0.5);
  const pairsCount: Record<Difficulty,number>={easy:4,medium:6,hard:8};

  const [difficulty,setDifficulty]=useState<Difficulty>('medium');

  const makeCards=(diff:Difficulty)=>{
    const pairs=ALL_MEMORY_PAIRS.slice(0,pairsCount[diff]);
    return shuffleFn(pairs.flatMap(p=>[{id:`${p.id}a`,pairId:p.id,text:p.a,type:'verse'},{id:`${p.id}b`,pairId:p.id,text:p.b,type:'ref'}]));
  };

  const [cards,setCards]=useState(()=>makeCards('medium'));
  const [flipped,setFlipped]=useState<string[]>([]);
  const [matched,setMatched]=useState<number[]>([]);
  const [moves,setMoves]=useState(0);
  const [isChecking,setIsChecking]=useState(false);
  const [won,setWon]=useState(false);

  const reset=(diff=difficulty)=>{setCards(makeCards(diff));setFlipped([]);setMatched([]);setMoves(0);setWon(false);setIsChecking(false);};
  const handleDifficultyChange=(d:Difficulty)=>{setDifficulty(d);reset(d);};

  const totalPairs=pairsCount[difficulty];
  const isFlipped=(id:string)=>flipped.includes(id)||matched.includes(cards.find(c=>c.id===id)!.pairId);

  const handleFlip=(id:string)=>{
    if(isChecking||flipped.includes(id)) return;
    const card=cards.find(c=>c.id===id);
    if(!card||matched.includes(card.pairId)) return;
    const nf=[...flipped,id];setFlipped(nf);
    if(nf.length===2){
      setMoves(m=>m+1);setIsChecking(true);
      const [first,second]=nf.map(fid=>cards.find(c=>c.id===fid)!);
      if(first.pairId===second.pairId){
        const nm=[...matched,first.pairId];setMatched(nm);setFlipped([]);setIsChecking(false);
        if(nm.length===totalPairs) setWon(true);
      } else {setTimeout(()=>{setFlipped([]);setIsChecking(false);},1000);}
    }
  };

  const cols=difficulty==='easy'?4:difficulty==='medium'?4:4;
  const diffLabel:Record<Difficulty,string>={easy:'4 pairs',medium:'6 pairs',hard:'8 pairs'};

  return(
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 flex-shrink-0"><ArrowLeft className="w-5 h-5"/></button>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900">Memory Match</h1>
              <p className="text-sm text-gray-500">Match verse with its reference — {diffLabel[difficulty]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right"><div className="text-2xl font-bold text-blue-600">{moves}</div><div className="text-xs text-gray-400">moves</div></div>
            <button onClick={()=>reset()} className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold">
              <RefreshCw className="w-4 h-4"/> New
            </button>
          </div>
        </div>

        <div className="mb-4"><DifficultyPicker value={difficulty} onChange={handleDifficultyChange}/></div>

        <div className="flex justify-between text-sm text-gray-500 mb-3 px-1">
          <span>{matched.length}/{totalPairs} pairs found</span>
        </div>

        <div className={`grid gap-2 sm:gap-3 ${difficulty==='easy'?'grid-cols-4':difficulty==='medium'?'grid-cols-4':'grid-cols-4'}`}>
          {cards.map(card=>{
            const isMatch=matched.includes(card.pairId);
            const isFaceUp=isFlipped(card.id);
            return(
              <div key={card.id} onClick={()=>handleFlip(card.id)}
                className={`h-20 sm:h-24 rounded-xl flex items-center justify-center p-2 cursor-pointer transition-all text-center text-xs font-medium select-none leading-tight
                  ${isMatch?'bg-green-100 border-2 border-green-400 text-green-800':isFaceUp?(card.type==='verse'?'bg-blue-100 border-2 border-blue-400 text-blue-900':'bg-amber-100 border-2 border-amber-400 text-amber-900'):'bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-700'}`}>
                {isFaceUp||isMatch?card.text:<span className="text-2xl">✝</span>}
              </div>
            );
          })}
        </div>

        {won&&(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl">
              <div className="text-5xl mb-4">🌟</div>
              <h2 className="text-2xl font-bold mb-2">All Matched!</h2>
              <p className="text-gray-500 mb-1">Completed in <strong>{moves} moves</strong></p>
              <p className="text-blue-600 font-semibold mb-6 capitalize">{difficulty} — {moves<=totalPairs*2?'Amazing!':moves<=totalPairs*3?'Well done!':'Good effort!'}</p>
              <button onClick={()=>reset()} className="w-full py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700">Play Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// GAME 4: BIBLE WORD SEARCH
// =====================================================================
function WordSearch({ onBack }: { onBack: () => void }) {
  const wordCounts:Record<Difficulty,number>={easy:6,medium:8,hard:10};
  const [difficulty,setDifficulty]=useState<Difficulty>('medium');
  const [foundWords,setFoundWords]=useState<string[]>([]);
  const [selecting,setSelecting]=useState(false);
  const [selStart,setSelStart]=useState<[number,number]|null>(null);
  const [selEnd,setSelEnd]=useState<[number,number]|null>(null);
  const [wrongFlash,setWrongFlash]=useState(false);
  const gridRef=useRef<HTMLDivElement>(null);

  const targetAnswers=ALL_WORD_SEARCH_ANSWERS.slice(0,wordCounts[difficulty]);

  const reset=(diff=difficulty)=>{setFoundWords([]);setSelStart(null);setSelEnd(null);};
  const handleDifficultyChange=(d:Difficulty)=>{setDifficulty(d);reset(d);};

  const getCellsInLine=(start:[number,number],end:[number,number]):[number,number][]=>{
    const [r1,c1]=start;const [r2,c2]=end;
    const dr=Math.sign(r2-r1);const dc=Math.sign(c2-c1);
    const cells:[number,number][]=[];let r=r1,c=c1;
    while(true){cells.push([r,c]);if(r===r2&&c===c2) break;r+=dr;c+=dc;}
    return cells;
  };
  const getSelectedCells=():[number,number][]=>{
    if(!selStart||!selEnd) return [];
    const [r1,c1]=selStart;const [r2,c2]=selEnd;
    const dr=r2-r1;const dc=c2-c1;
    if(dr!==0&&dc!==0&&Math.abs(dr)!==Math.abs(dc)) return [];
    return getCellsInLine(selStart,selEnd);
  };
  const getCellFromPoint=(x:number,y:number):[number,number]|null=>{
    if(!gridRef.current) return null;
    const cells=gridRef.current.querySelectorAll('[data-cell]');
    for(const cell of cells){const rect=cell.getBoundingClientRect();if(x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom){const[r,c]=(cell as HTMLElement).dataset.cell!.split(',').map(Number);return[r,c];}}
    return null;
  };
  const commitSelection=()=>{
    if(!selecting) return;setSelecting(false);
    const sel=getSelectedCells();
    const word=sel.map(([r,c])=>WORD_SEARCH_GRID[r][c]).join('');
    const wordRev=[...word].reverse().join('');
    const match=targetAnswers.find(a=>a.word===word||a.word===wordRev);
    if(match&&!foundWords.includes(match.word)){setFoundWords(prev=>[...prev,match.word]);}
    else if(!match&&sel.length>1){setWrongFlash(true);setTimeout(()=>setWrongFlash(false),400);}
    setSelStart(null);setSelEnd(null);
  };

  const selectedCells=getSelectedCells();
  const isCellSelected=(r:number,c:number)=>selectedCells.some(([sr,sc])=>sr===r&&sc===c);
  const getFoundColor=(r:number,c:number)=>{
    for(const ans of targetAnswers){if(foundWords.includes(ans.word)&&ans.cells.some(([ar,ac])=>ar===r&&ac===c)) return ans.color;}
    return null;
  };

  const won=foundWords.length===targetAnswers.length;
  const diffLabel:Record<Difficulty,string>={easy:'6 words',medium:'8 words',hard:'10 words'};

  return(
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <GameHeader title="Bible Word Search" subtitle={`Find the hidden words — ${diffLabel[difficulty]}`} onBack={onBack} onRefresh={()=>reset()}/>
        <div className="mb-4"><DifficultyPicker value={difficulty} onChange={handleDifficultyChange}/></div>

        <div className="bg-white rounded-2xl shadow-lg p-3 mb-4 select-none" ref={gridRef} onMouseUp={commitSelection}
          onTouchEnd={e=>{e.preventDefault();commitSelection();}}>
          <div className="grid gap-0.5" style={{gridTemplateColumns:'repeat(10,1fr)'}}>
            {WORD_SEARCH_GRID.map((row,r)=>row.map((letter,c)=>{
              const fc=getFoundColor(r,c);const isSel=isCellSelected(r,c);
              return(
                <div key={`${r},${c}`} data-cell={`${r},${c}`}
                  onMouseDown={()=>{setSelecting(true);setSelStart([r,c]);setSelEnd([r,c]);}}
                  onMouseEnter={()=>{if(selecting)setSelEnd([r,c]);}}
                  onTouchStart={e=>{e.preventDefault();setSelecting(true);setSelStart([r,c]);setSelEnd([r,c]);}}
                  onTouchMove={e=>{e.preventDefault();const t=e.touches[0];const cell=getCellFromPoint(t.clientX,t.clientY);if(cell)setSelEnd(cell);}}
                  className={`aspect-square flex items-center justify-center text-xs sm:text-sm font-bold rounded cursor-pointer transition-colors
                    ${fc?fc:isSel?(wrongFlash?'bg-red-200':'bg-blue-200'):'hover:bg-gray-100'}`}>
                  {letter}
                </div>
              );
            }))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {targetAnswers.map(ans=>(
            <div key={ans.word} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${foundWords.includes(ans.word)?`${ans.color} line-through opacity-60`:'bg-white text-gray-700 border border-gray-200'}`}>
              {foundWords.includes(ans.word)&&<span>✓</span>}{ans.word}
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500">{foundWords.length}/{targetAnswers.length} words found</div>

        {won&&(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold mb-2">All Words Found!</h2>
              <p className="text-gray-500 mb-1">You found all {targetAnswers.length} hidden Bible words!</p>
              <p className="text-blue-600 font-semibold mb-6 capitalize">{difficulty} difficulty complete</p>
              <button onClick={()=>reset()} className="w-full py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700">Play Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// GAME 5: VERSE UNSCRAMBLE
// =====================================================================
function VerseUnscramble({ onBack }: { onBack: () => void }) {
  const shuffleFn=<T,>(arr:T[])=>[...arr].sort(()=>Math.random()-0.5);
  const [difficulty,setDifficulty]=useState<Difficulty>('medium');

  const getVerses=(diff:Difficulty)=>ALL_UNSCRAMBLE_VERSES.filter(v=>
    diff==='easy'?v.difficulty==='easy':
    diff==='medium'?v.difficulty!=='hard':true
  );

  const pickVerse=(diff:Difficulty)=>{const list=getVerses(diff);return list[Math.floor(Math.random()*list.length)];};

  const [verse,setVerse]=useState(()=>pickVerse('medium'));
  const [state,setState]=useState(()=>{
    const v=pickVerse('medium');
    return{bank:shuffleFn(v.words.map((w,i)=>({word:w,id:`${i}-${w}-${Math.random()}`}))),answer:[] as{word:string,id:string}[]};
  });
  const [won,setWon]=useState(false);
  const [showResult,setShowResult]=useState<'correct'|'wrong'|null>(null);

  const makeState=(v:typeof verse)=>({
    bank:shuffleFn(v.words.map((w,i)=>({word:w,id:`${i}-${w}-${Math.random()}`}))),
    answer:[] as{word:string,id:string}[]
  });

  const reset=(diff=difficulty)=>{const v=pickVerse(diff);setVerse(v);setState(makeState(v));setWon(false);setShowResult(null);};
  const handleDifficultyChange=(d:Difficulty)=>{setDifficulty(d);reset(d);};

  const pickFromBank=(id:string)=>{
    const item=state.bank.find(b=>b.id===id);if(!item) return;
    setState(s=>({bank:s.bank.filter(b=>b.id!==id),answer:[...s.answer,item]}));
  };
  const returnToBank=(id:string)=>{
    const item=state.answer.find(a=>a.id===id);if(!item) return;
    setState(s=>({answer:s.answer.filter(a=>a.id!==id),bank:shuffleFn([...s.bank,item])}));
    setShowResult(null);
  };
  const checkAnswer=()=>{
    const isCorrect=state.answer.map(a=>a.word).join(' ')===verse.words.join(' ');
    setShowResult(isCorrect?'correct':'wrong');
    if(isCorrect) setWon(true);
    if(!isCorrect) setTimeout(()=>setShowResult(null),1200);
  };

  const diffLabel:Record<Difficulty,string>={easy:'Short verses',medium:'Medium verses',hard:'Longer verses'};

  return(
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <GameHeader title="Verse Unscramble" subtitle={verse.ref} onBack={onBack} onRefresh={()=>reset()}/>
        <div className="mb-4"><DifficultyPicker value={difficulty} onChange={handleDifficultyChange}/></div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-sm text-blue-800">
          Tap words to build the verse in the correct order. Tap placed words to remove them.
        </div>

        <div className={`bg-white rounded-2xl shadow-lg p-4 mb-3 min-h-24 border-2 transition-colors ${showResult==='correct'?'border-green-400 bg-green-50':showResult==='wrong'?'border-red-400 bg-red-50':'border-dashed border-gray-200'}`}>
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Your Answer</p>
          <div className="flex flex-wrap gap-2">
            {state.answer.length===0?<span className="text-gray-300 text-sm italic">Tap words below...</span>
              :state.answer.map(item=>(
                <button key={item.id} onClick={()=>returnToBank(item.id)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 active:scale-95">{item.word}
                </button>
              ))
            }
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 min-h-20">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Word Bank</p>
          <div className="flex flex-wrap gap-2">
            {state.bank.map(item=>(
              <button key={item.id} onClick={()=>pickFromBank(item.id)}
                className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-200 border border-gray-200 active:scale-95">{item.word}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={()=>reset()} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl text-sm font-semibold hover:bg-gray-200">
            <RotateCcw className="w-4 h-4"/> New Verse
          </button>
          <button onClick={checkAnswer} disabled={state.answer.length!==verse.words.length}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-40">
            Check Answer
          </button>
        </div>

        {won&&(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl">
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-2xl font-bold mb-2">Correct!</h2>
              <p className="text-blue-600 font-semibold mb-1">{verse.ref}</p>
              <p className="text-gray-500 italic mb-6 text-sm">"{verse.words.join(' ')}"</p>
              <div className="flex gap-3">
                <button onClick={()=>reset()} className="flex-1 py-3 bg-gray-100 rounded-2xl font-semibold">New Verse</button>
                <button onClick={()=>reset(difficulty==='easy'?'medium':difficulty==='medium'?'hard':difficulty)} className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-semibold">Try Harder</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// GAME 6: BOOKS OF THE BIBLE ORDER
// =====================================================================
function BooksOrder({ onBack }: { onBack: () => void }) {
  const shuffleFn=<T,>(arr:T[])=>[...arr].sort(()=>Math.random()-0.5);
  const booksSetsMap:Record<Difficulty,number[]>={easy:[0,1],medium:[2,3],hard:[4,5]};
  const [difficulty,setDifficulty]=useState<Difficulty>('medium');
  const [setIdx,setSetIdx]=useState(0);

  const getCurrentSets=(diff:Difficulty)=>booksSetsMap[diff].map(i=>ALL_BOOKS_SETS[i]);

  const makeState=(diff:Difficulty,idx:number)=>{
    const sets=getCurrentSets(diff);
    const bs=sets[idx%sets.length];
    return{books:bs.books,testament:bs.testament,scrambled:shuffleFn([...bs.books]),placed:[] as string[]};
  };

  const [state,setState]=useState(()=>makeState('medium',0));
  const [won,setWon]=useState(false);
  const [showResult,setShowResult]=useState<'correct'|'wrong'|null>(null);

  const reset=(diff=difficulty,idx=setIdx)=>{setState(makeState(diff,idx));setWon(false);setShowResult(null);};
  const handleDifficultyChange=(d:Difficulty)=>{setDifficulty(d);setSetIdx(0);reset(d,0);};

  const placeBook=(book:string)=>{
    const np=[...state.placed,book];
    setState(s=>({...s,scrambled:s.scrambled.filter(b=>b!==book),placed:np}));
    if(np.length===state.books.length){
      const isCorrect=np.every((b,i)=>b===state.books[i]);
      setShowResult(isCorrect?'correct':'wrong');
      if(isCorrect) setTimeout(()=>setWon(true),500);
      else setTimeout(()=>setShowResult(null),1500);
    }
  };

  const removeBook=(book:string)=>{
    setState(s=>({...s,scrambled:shuffleFn([...s.scrambled,book]),placed:s.placed.filter(b=>b!==book)}));
    setShowResult(null);
  };

  const sets=getCurrentSets(difficulty);
  const diffLabel:Record<Difficulty,string>={easy:'5 books',medium:'8 books',hard:'11-12 books'};

  return(
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <GameHeader title="Books in Order" subtitle={`${state.testament} — ${diffLabel[difficulty]}`} onBack={onBack} onRefresh={()=>reset()}/>
        <div className="mb-4"><DifficultyPicker value={difficulty} onChange={handleDifficultyChange}/></div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-sm text-blue-800">
          Tap books to place them in the correct biblical order. Tap placed books to remove them.
        </div>

        <div className={`bg-white rounded-2xl shadow-lg p-4 mb-3 min-h-24 border-2 transition-colors ${showResult==='correct'?'border-green-400 bg-green-50':showResult==='wrong'?'border-red-400 bg-red-50':'border-dashed border-gray-200'}`}>
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Your Order ({state.placed.length}/{state.books.length})</p>
          {state.placed.length===0?<p className="text-gray-300 text-sm italic text-center py-4">Tap books below...</p>
            :<div className="flex flex-wrap gap-2">
              {state.placed.map((book,i)=>(
                <button key={book} onClick={()=>removeBook(book)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold
                    ${showResult==='correct'?'bg-green-600 text-white':showResult==='wrong'&&book!==state.books[i]?'bg-red-500 text-white':'bg-blue-600 text-white hover:bg-blue-700'}`}>
                  <span className="text-xs opacity-70">{i+1}.</span> {book}
                </button>
              ))}
            </div>
          }
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Book Bank</p>
          <div className="flex flex-wrap gap-2">
            {state.scrambled.map(book=>(
              <button key={book} onClick={()=>placeBook(book)}
                className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-semibold hover:bg-blue-50 hover:text-blue-700 border border-gray-200 active:scale-95">{book}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={()=>reset()} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl text-sm font-semibold hover:bg-gray-200">
            <RotateCcw className="w-4 h-4"/> Reset
          </button>
        </div>

        {sets.length>1&&(
          <div className="flex gap-2">
            {sets.map((bs,i)=>(
              <button key={i} onClick={()=>{setSetIdx(i);reset(difficulty,i);}}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${setIdx===i?'bg-blue-600 text-white':'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                {bs.testament}
              </button>
            ))}
          </div>
        )}

        {won&&(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl">
              <div className="text-5xl mb-4">📚</div>
              <h2 className="text-2xl font-bold mb-2">Perfect Order!</h2>
              <p className="text-gray-500 mb-1">All {state.books.length} {state.testament} books in the correct order!</p>
              <p className="text-blue-600 font-semibold mb-6 capitalize">{difficulty} difficulty complete</p>
              <div className="flex gap-3">
                <button onClick={()=>reset()} className="flex-1 py-3 bg-gray-100 rounded-2xl font-semibold">Play Again</button>
                <button onClick={()=>{const ni=(setIdx+1)%sets.length;setSetIdx(ni);reset(difficulty,ni);}} className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-semibold">Next Set</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// GAMES HUB
// =====================================================================
const GAMES=[
  {id:'path'       as GameType,title:'Bible Path',      desc:'Connect numbered dots in order, filling every cell',      emoji:'🗺️',color:'from-green-400 to-emerald-600',badge:'Puzzle'},
  {id:'wordle'     as GameType,title:'Bible Wordle',    desc:'Guess the hidden 5-letter Bible word in 6 tries',          emoji:'🔤',color:'from-blue-400 to-blue-600',    badge:'Word'},
  {id:'memory'     as GameType,title:'Memory Match',    desc:'Flip cards to match Bible verses with their references',    emoji:'🃏',color:'from-purple-400 to-violet-600',badge:'Memory'},
  {id:'wordsearch' as GameType,title:'Word Search',     desc:'Find hidden Bible words in the letter grid',                emoji:'🔍',color:'from-amber-400 to-orange-500', badge:'Search'},
  {id:'unscramble' as GameType,title:'Verse Unscramble',desc:'Rearrange the words to rebuild a Bible verse correctly',    emoji:'📖',color:'from-rose-400 to-red-500',     badge:'Verse'},
  {id:'booksorder' as GameType,title:'Books in Order',  desc:'Arrange Books of the Bible in their correct canonical order',emoji:'📚',color:'from-teal-400 to-cyan-600',  badge:'Scripture'},
];

export default function BibleGames() {
  const [currentGame,setCurrentGame]=useState<GameType>('hub');

  if(currentGame==='path')       return <BiblePath onBack={()=>setCurrentGame('hub')}/>;
  if(currentGame==='wordle')     return <BibleWordle onBack={()=>setCurrentGame('hub')}/>;
  if(currentGame==='memory')     return <MemoryMatch onBack={()=>setCurrentGame('hub')}/>;
  if(currentGame==='wordsearch') return <WordSearch onBack={()=>setCurrentGame('hub')}/>;
  if(currentGame==='unscramble') return <VerseUnscramble onBack={()=>setCurrentGame('hub')}/>;
  if(currentGame==='booksorder') return <BooksOrder onBack={()=>setCurrentGame('hub')}/>;

  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/"><button className="p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all"><Home className="w-5 h-5 text-gray-600"/></button></Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bible Games</h1>
            <p className="text-gray-500 text-sm">6 visual games — Easy, Medium & Hard difficulty</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GAMES.map(game=>(
            <button key={game.id} onClick={()=>setCurrentGame(game.id)}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left group border border-gray-100 hover:border-gray-200 active:scale-[0.98]">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform`}>
                {game.emoji}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900">{game.title}</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{game.badge}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{game.desc}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">Easy</span>
                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">Medium</span>
                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold">Hard</span>
                <span className="ml-auto text-sm font-semibold text-blue-600">Play →</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <p className="text-gray-500 text-sm italic">"Your word is a lamp to my feet and a light to my path." — Psalm 119:105</p>
        </div>
      </div>
    </div>
  );
}
