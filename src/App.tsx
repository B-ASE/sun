import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Flame, Crosshair, Zap, Wrench, ChevronRight, X } from 'lucide-react';

export default function App() {
  const [started, setStarted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleStart = () => {
    setStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div className="min-h-screen text-gray-200 font-pixel selection:bg-[#ccff00] selection:text-black">
      <audio loop ref={audioRef} src="https://s.tpvp.uk/SITE/music/The_Last_Hour_of_Amber.mp3" />
      
      <AnimatePresence mode="wait">
        {!started ? (
          <OpeningScreen key="opening" onStart={handleStart} />
        ) : (
          <MainContent key="main" volume={volume} setVolume={setVolume} />
        )}
      </AnimatePresence>
    </div>
  );
}

function OpeningScreen({ onStart }: { onStart: () => void, key?: string }) {
  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a0c] z-50 overflow-hidden"
      exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)", transition: { duration: 0.4, ease: "easeIn" } }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('https://s.tpvp.uk/SITE/image/main.png')] bg-cover bg-center opacity-40 mix-blend-luminosity scale-105"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-[#ff4500]/30"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          className="title-text text-7xl md:text-8xl lg:text-9xl text-center mb-16 flex flex-col gap-4"
          initial={{ x: -200, opacity: 0, skewX: -30 }}
          animate={{ x: 0, opacity: 1, skewX: -5 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 250, damping: 15 }}
        >
          <div><span className="text-red-600">황</span>혼을</div>
          <div>넘어</div>
          <div>달려라</div>
        </motion.div>
        
        <motion.button
          onClick={onStart}
          className="text-2xl md:text-3xl text-[#ccff00] hover:text-white tracking-widest font-display"
          animate={{ opacity: [1, 0, 1], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        >
          - IGNITE ENGINE -
        </motion.button>
      </div>
    </motion.div>
  );
}

function MainContent({ volume, setVolume }: { volume: number, setVolume: (v: number) => void, key?: string }) {
  return (
    <motion.div 
      className="relative min-h-screen pb-20"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Fixed Background */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0c]">
        <div className="absolute inset-0 bg-[url('https://s.tpvp.uk/SITE/image/main.png')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff4500]/10 via-[#0a0a0c]/90 to-[#0a0a0c]"></div>
      </div>

      <Header volume={volume} setVolume={setVolume} />
      
      <main className="container mx-auto px-4 pt-24 space-y-32">
        <HeroSection />
        <WorldviewSection />
        <CharacterSection />
        <WebtoonSection />
      </main>
      
      <footer className="mt-32 py-10 text-center border-t border-[#333] bg-black/80">
        <p className="text-gray-500 text-sm font-sans tracking-widest">© 2026 RUN BEYOND THE TWILIGHT. ALL RIGHTS RESERVED.</p>
      </footer>
    </motion.div>
  );
}

function Header({ volume, setVolume }: { volume: number, setVolume: (v: number) => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/90 border-b border-[#333] backdrop-blur-md z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-xl md:text-2xl font-display text-[#ccff00] tracking-wider">
          황혼을 넘어 달려라
        </div>
        <nav className="hidden md:flex gap-8 text-lg font-display tracking-widest">
          <a href="#worldview" className="hover:text-[#ccff00] transition-colors">WORLDVIEW</a>
          <a href="#characters" className="hover:text-[#ccff00] transition-colors">CHARACTERS</a>
          <a href="#webtoon" className="hover:text-[#ccff00] transition-colors">WEBTOON</a>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setVolume(volume === 0 ? 0.5 : 0)} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-[#ccff00]"
          >
            {volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 md:w-24 accent-[#ccff00] cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center relative mt-10">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
        className="flex flex-col items-center"
      >
        <div className="title-text text-6xl md:text-8xl lg:text-9xl mb-12 flex flex-col gap-2 leading-none">
          <div><span className="text-red-600">황</span>혼을</div>
          <div>넘어</div>
          <div>달려라</div>
        </div>
        
        <div className="biker-box max-w-2xl w-full mb-10">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-sans">
            끝없는 고속도로, 불타는 엔진의 굉음.<br/>
            황혼이 지배하는 디스토피아에서 살아남아라.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="biker-button">
            <span>GAME START</span>
          </button>
          <button className="biker-button !bg-transparent !text-white !border-white hover:!bg-white hover:!text-black hover:!shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            <span>PRE-REGISTER</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function WorldviewSection() {
  const [activeTab, setActiveTab] = useState('background');

  const concepts = [
    { term: "뒷세계", desc: "이능력, 마법, 괴이 등의 초상적인 현상과 관련된 분야를 말함." },
    { term: "괴이", desc: "도시전설, 신화, 소문 등의 다양한 이야기가 실체화 된 생명체. 기본적으로 근간이 되는 본질에 따라 행동하며, 그로 인해 각종 문제를 일으키는 경우가 잦음." },
    { term: "에테르", desc: "인간의 감정이나 생명력에서 비롯되는 에너지. 괴이의 주된 먹이로, 괴이가 인간을 습격하거나 장난치는 주된 원인. 뒷세계에서 화폐로도 사용된다(10에테르=1달러의 가치)." },
    { term: "이계", desc: "일정 수준의 괴이가 형성하는 이공간. 이계의 공간에선 물리적인 법칙을 따르지 않으며, 이계를 형성한 괴이에 따라 고유한 법칙과 환경을 구성하며, 그 법칙은 절대적이다." },
    { term: "괴이 사냥꾼", desc: "편의상 괴이 사냥꾼이라 불리나, 실제로는 뒷세계에서 벌어지는 초상적인 현상을 해결하는 자들의 통칭. 괴이를 토벌하는 일 외를 하는 경우도 자주 발생함." },
    { term: "GH-NET", desc: "뒷세계 인물들이 사용하는 커뮤니티. 다양한 정보가 흘러 들어오지만, 진실을 판별하는 건 이용자들의 몫임." },
    { term: "일반인", desc: "괴이, 이능력, 마법, 초상적인 현상 등을 모르고 살아가는 사람들의 통칭. 극소수의 예외를 제외하면 뒷세계의 일에선 무력함." },
    { term: "이능력", desc: "희귀한 체질을 지닌 인간이 지니는 특수한 힘. 2개 이상의 이능력을 지닌 인물은 세계에서도 손에 꼽을 정도로 적다." },
    { term: "마법", desc: "마력을 통해 초자연적인 현상을 일으키는 기술. 인간은 선천적으로 마력을 타고 나는 경우가 적어 주로 괴이가 사용한다." },
    { term: "황혼의 질주자", desc: "죽음의 개념 중 하나가 실체화 한 최근에 탄생한 괴이. 끝없는 속도를 추구해 폭주하면서, 타인과의 경주를 통해 속도를 겨루는 걸 즐긴다. 타인과의 경주에서 승리할 경우, 패배자의 에너지를 모조리 흡수해 자신의 힘으로 삼는다." },
    { term: "황혼의 도로", desc: "황혼의 질주자가 형성한 이계. 특성상 도로에 형성되어있으며, 주기적으로 근처를 지나가는 탑승물과 탑승자를 무작위로 이계에 끌어들인다. (법칙: 황혼으로 시간대가 고정된 끝없이 이어진 도로에서, 이계에 흘러들어온 자는 황혼의 질주자와 1:1 레이스 경주를 벌여야 한다. 레이스 중에는 환경이나 지형이 시시각각 변하기도 하며, 레이스 경주에서 패배한 인간은 그 즉시 반드시 에테르가 전부 빨려 사망한다(누군가가 대신하는 건 불가능).)" }
  ];

  const factions = [
    { name: "나카츠리", desc: "뒷세계의 이야기가 일반인에게 알려지지 않게 막거나 정보를 통제하며, 괴이 사냥꾼들에게 의뢰를 중개하는 역할도 수행한다." },
    { name: "원스휴먼", desc: "기록으로만 남은 창조신을 섬기는 종교 집단. 인간을 중시하며, 질서를 어지럽히는 괴이를 터부시한다. 무력 해결을 추구하는 강경파, 가급적 대화로 해결하려는 온건파, 어느쪽도 아닌 중립파로 내부의 파벌이 나눠져있다. 인원의 숫자는 강경파>온건파>중립파. 현재는 완벽한 인간을 만들어 인간의 신을 만들어 내는 게 목표(해당 목표는 교단 내부의 인물들만 알고 있음)." },
    { name: "에센티아", desc: "괴이가 주축인 집단. 단 괴이의 특성상 구성원 중 괴이는 소수이며, 대다수는 괴이를 추종하거나 섬기는 인간들이다. 현 세계의 질서를 파괴하고, 무력이 곧 법이 되는 원초적인 세계를 만드는 것이 최종적인 목표." },
    { name: "B.A.221 사무소", desc: "소속원이 두 명 뿐인 작은 사무소. 어려운 상황에 처한 사람의 의뢰라면 범죄를 제외하곤 어떤 의뢰든 받아 해결하는 흥신소이며, 괴이 사냥꾼으로서의 의뢰도 받는다." }
  ];

  return (
    <section id="worldview" className="scroll-mt-24">
      <h3 className="text-3xl md:text-5xl text-center mb-12 font-display text-white tracking-widest">
        <span className="text-[#ccff00]">01.</span> WORLDVIEW
      </h3>
      
      <div className="flex justify-center gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('background')} 
          className={`biker-button !py-2 !px-6 !text-sm ${activeTab === 'background' ? '!bg-[#ccff00] !text-black' : '!bg-transparent !text-gray-400 !border-gray-600 hover:!bg-white/10 hover:!text-white'}`}
        >
          <span>배경 & 개념</span>
        </button>
        <button 
          onClick={() => setActiveTab('factions')} 
          className={`biker-button !py-2 !px-6 !text-sm ${activeTab === 'factions' ? '!bg-[#ccff00] !text-black' : '!bg-transparent !text-gray-400 !border-gray-600 hover:!bg-white/10 hover:!text-white'}`}
        >
          <span>주요 세력</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        {activeTab === 'background' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="biker-box">
              <h4 className="text-2xl font-display text-[#ccff00] mb-4 tracking-wider">BACKGROUND</h4>
              <p className="text-lg text-gray-300 font-sans leading-relaxed">
                <strong className="text-white text-xl">2003년의 현대.</strong><br/>
                이능력, 마법, 괴이 등이 존재하는 어반 판타지 세계.
              </p>
            </div>
            
            <div className="biker-box">
              <h4 className="text-2xl font-display text-[#ccff00] mb-6 tracking-wider">CONCEPTS</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {concepts.map((c, i) => (
                  <div key={i} className="border-l-2 border-[#333] pl-4 hover:border-[#ccff00] transition-colors">
                    <h5 className="text-lg font-bold text-white mb-2 font-sans">{c.term}</h5>
                    <p className="text-sm text-gray-400 font-sans leading-relaxed">
                      {c.desc.includes('레이스 경주에서 패배한 인간은') ? (
                        <span dangerouslySetInnerHTML={{__html: c.desc.replace('레이스 경주에서 패배한 인간은 그 즉시 반드시 에테르가 전부 빨려 사망한다(누군가가 대신하는 건 불가능).', '<strong class="text-red-500">레이스 경주에서 패배한 인간은 그 즉시 반드시 에테르가 전부 빨려 사망한다(누군가가 대신하는 건 불가능).</strong>')}} />
                      ) : c.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'factions' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {factions.map((f, i) => (
              <div key={i} className="biker-box group hover:border-[#ccff00] transition-colors">
                <h4 className="text-2xl font-display text-white group-hover:text-[#ccff00] mb-4 tracking-wider transition-colors">{f.name}</h4>
                <p className="text-sm text-gray-400 font-sans leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function CharacterSection() {
  const [activeFaction, setActiveFaction] = useState('나카츠리');
  const [selectedChar, setSelectedChar] = useState<any>(null);

  const factions = ["나카츠리", "원스휴먼", "에센티아", "B.A.221 사무소", "괴이"];

  const charactersData: Record<string, any[]> = {
    "나카츠리": [
      { name: "겐류", gender: "男", age: "27", appearance: "금발, 단발", outfit: "선글라스, 알로하 셔츠, 갈색 바지", personality: "분위기 메이커, 활발함, 사교성 좋음, 이상주의", traits: "해피 엔딩 추구", combat: "리볼버를 사용한 속사, 다양한 도구를 이용한 보조", speech: "반말(해체), 웃음소리는 '냐하항'", quote: "냐하하하항! 죽을 뻔 했네!", code: "A" }
    ],
    "원스휴먼": [
      { name: "닉스", gender: "女", age: "18", appearance: "백발, 장발, 별빛처럼 반짝이는 머리카락, 적안, 미소녀", outfit: "흰색 민소매 원피스, 안쪽이 별하늘처럼 된 흰색 양산", personality: "겉:(솔직하지 못함, 냉담함, 냉소적임, 무관심함), 속:(순수함, 다정함, 자비로움, 온화함)", traits: "원스휴먼의 수장이자 성녀, 완벽한 인간에 가장 가까운 실패작, 겉으로는 까칠하고 냉소적인 태도를 보이나, 내면에는 항상 타인을 생각하는 다정함을 지님, 중립파", combat: "무한한 마력을 통한 수많은 마법을 구사", speech: "반말(해라체), 까칠하면서도 부드러움", quote: "그런다고 뭐가 되겠니? 의미 없는 짓은 하지 말렴.", code: "D" },
      { name: "루이나", gender: "女", age: "19", appearance: "하늘색 꽁지머리, 청안, 흰색 십자동공", outfit: "흰색 캐미솔, 검은색 자켓, 찢어진 청바지", personality: "외향적, 털털함, 낙천적, 자유분방함, 즉흥적, 예의없음", traits: "루온과 남매, 집단의 규율에 얽매이지 않음, 의외로 신앙심이 뛰어남, 중립파", combat: "손에 마력을 둘러 클로를 만들어 내 육탄전을 벌임", speech: "반말(해체), 활발하고 수다스러움, 닉스에겐 존댓말(해요체)", quote: "안녕~! 오늘도 좋은 하루야!", code: "E" },
      { name: "루온", gender: "男", age: "19", appearance: "회색 올백머리, 청안", outfit: "흰색 셔츠, 데님 셔츠, 갈색 바지", personality: "친절함, 대범함, 단정함, 예의바름, 눈치없음", traits: "루이나의 남매, 규율중시, 루이나에겐 무르면서 허물없음, 가급적이면 대화로 해결하려 하나, 전투도 마다하지 않음, 중립파", combat: "카타나를 사용한 속도전", speech: "반말(해체), 부드럽고 온화함, 닉스에겐 존댓말(다나까체)", quote: "반가워. 잘 부탁할게.", code: "F" }
    ],
    "에센티아": [
      { name: "바엘", gender: "男", age: "불명", appearance: "검정색 울프컷, 백안, 파문형태의 동공, 중년", outfit: "검은색 정장, 검은색 코트, 금색 테두리", personality: "구시대적, 결단적, 독불장군, 무인, 말수가 적음, 무력 중시, 약자 멸시, 강자 존중, 강압적임", traits: "괴이, 에센티아의 수장", combat: "검, 창, 활, 도끼 등, 다양한 냉병기를 마력으로 만들어내 능숙하게 사용함", speech: "반말(해라체), 무뚝뚝하고 간결함, 예스러운 어미", quote: "강함이야말로 절대적일진저.", code: "G" },
      { name: "제라", gender: "女", age: "불명", appearance: "반투명 백발, 장발, 청색의 시크릿 투톤 헤어, 청안", outfit: "검은색 드레스, 검은색 보닛", personality: "어른스러움, 온화함, 잔혹함, 예의바름, 인간에게 호의적", traits: "괴이, 에센티아의 부수장, 무력과 카리스마 외엔 부족한 게 많은 바엘 대신 다양한 업무를 총괄함, 약자에게도 강해질 기회를 줌, 공적으로는 강함과 카리스마를 겸비한 바엘을 존경하나, 사적으로는 무력 외가 부족한 바엘을 한심하게 봄", combat: "환술/정신계 마법을 통해 상대에게 이상한 정보, 풍경을 보여주어 혼란시킴, 상대의 고통을 최대한 이끌어내는 마법 구사", speech: "존댓말(해요체), 나긋나긋하고 온화함", quote: "어머나, 정말로 괜찮으시겠어요?", code: "H" }
    ],
    "B.A.221 사무소": [
      { name: "알레나", gender: "女", age: "22", appearance: "금발, 장발, 연한 갈색 눈", outfit: "흰색 셔츠, 청색 조끼, 갈색 코트", personality: "외강내유, 겉:(외향적, 자신감 넘침, 열정적임, 활기참, 주도적, 대범함, 즉흥적, 거만함), 속:(내향적, 신중함, 선량함, 비관적임, 소심함, 자신감 없음)", traits: "벤자민의 소꿉친구, 이상적인 모습을 위해 허풍을 부림, 의기소침할 때만 내면을 드러냄, 탐정 포지션", combat: "직접적인 전투 능력이 없어 전황을 살피고 분석해 보조함", speech: "반말(해체), 자신감 넘치고 강단 있음, 의기소침할 땐 자신감 없고 소심함", quote: "자, 이번 사건의 진상은 바로 이거다!", code: "I" },
      { name: "벤자민", gender: "男", age: "22", appearance: "갈색 단발, 한쪽 가르마, 갈색 눈, 다크서클, 온화한 인상", outfit: "흰색 셔츠, 갈색 조끼, 갈색 바지", personality: "외유내강, 차분함, 상냥함, 어른스러움, 온화함, 예의바름, 단정함", traits: "알레나의 소꿉친구, 절름발이, 정돈되고 깔끔한 차림새, 별명은 왓슨, 조수 포지션", combat: "롱소드를 이용한 방어적인 검법/상대의 힘을 이용하는 검법을 사용", speech: "존댓말(해요체+하십시오체), 정중하고 차분함, 알레나에겐 반말(해체)", quote: "오늘도 수고 많았어, 알레나.", code: "J" }
    ],
    "괴이": [
      { name: "황혼의 질주자", gender: "男", age: "불명", appearance: "해골 머리", outfit: "불꽃으로 이루어진 스카프, 검은색 가죽자켓, 검은색 가죽바지, 가죽 장갑", personality: "ESTP, 폭주족, 속도광, 경쟁심, 레이스 중시, 두려움과 공포 없음", traits: "항상 오토바이에 탑승한 상태, 레이스 중이라면 레이스를 가장 우선시 함, 1:1 경주에서 패배했다면 깔끔하게 패배를 받아들이나 1:1 경주에 누군가가 난입해서 발생한 패배라면 승패를 받아들이지 않고 분노해 전투를 벌임", combat: "불꽃 마법+속도를 살려 정신없이 몰아붙임", speech: "반말(해체)", quote: "데려가 주마, 스피드의 저편으로!", code: "C" },
      { name: "나일레모나", gender: "女", age: "불명", appearance: "흑발, 은색의 시크릿 투톤 헤어", outfit: "흰색 셔츠, 흑색 원피스, 나비 머리핀", personality: "ENFP, 짓궃음, 장난기 많음, 가챠 중독, 혼돈", traits: "겐류와 계약(대가: 재밌는 이야기를 보여줄 것), 겐류를 계약자라 부름, 장난을 치더라도 선은 넘지 않고 겐류에게 이득이 되는 방향으로 행동", combat: "주사위를 굴려서 랜덤한 디버프를 부여할 수 있는 마법 사용해 보조", speech: "존댓말(해요체)", quote: "자! 신나는 가챠 타임! 이번에 나올 눈은 과연 뭘까요!?", code: "B" }
    ]
  };

  return (
    <section id="characters" className="scroll-mt-24">
      <h3 className="text-3xl md:text-5xl text-center mb-16 font-display text-white tracking-widest">
        <span className="text-[#ccff00]">02.</span> CHARACTERS
      </h3>
      
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {factions.map(faction => (
          <button 
            key={faction}
            onClick={() => setActiveFaction(faction)} 
            className={`biker-button !py-2 !px-4 !text-sm ${activeFaction === faction ? '!bg-[#ccff00] !text-black' : '!bg-transparent !text-gray-400 !border-gray-600 hover:!bg-white/10 hover:!text-white'}`}
          >
            <span>{faction}</span>
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="wait">
          {charactersData[activeFaction].map((c, i) => (
            <motion.div 
              key={`${activeFaction}-${i}`}
              onClick={() => setSelectedChar(c)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="biker-box flex flex-col items-center p-4 cursor-pointer group hover:border-[#ccff00] transition-colors"
            >
              <div className="w-full aspect-[3/4] bg-[#050505] border border-[#333] group-hover:border-[#ccff00] transition-colors overflow-hidden relative flex items-center justify-center mb-4">
                <img 
                  src={`https://s.tpvp.uk/sun/${c.code}/1.webp`} 
                  alt={c.name} 
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://s.tpvp.uk/SITE/image/main.png';
                    e.currentTarget.className = 'w-full h-full object-cover opacity-30 grayscale';
                  }}
                />
              </div>
              <h4 className="text-xl text-[#ccff00] font-display text-center">{c.name}</h4>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedChar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedChar(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="biker-box max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-[#0a0a0c] p-6 md:p-8 relative flex flex-col md:flex-row gap-8 custom-scrollbar"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedChar(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-[#ccff00] transition-colors z-10"
              >
                <X size={28} />
              </button>
              
              <div className="w-full md:w-1/3 flex flex-col items-center gap-4 shrink-0">
                <div className="w-full aspect-[3/4] bg-[#050505] border border-[#333] overflow-hidden relative flex items-center justify-center">
                  <img 
                    src={`https://s.tpvp.uk/sun/${selectedChar.code}/1.webp`} 
                    alt={selectedChar.name} 
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://s.tpvp.uk/SITE/image/main.png';
                      e.currentTarget.className = 'w-full h-full object-cover opacity-30 grayscale';
                    }}
                  />
                </div>
                <div className="flex gap-2 text-xs font-sans text-gray-400">
                  <span className="bg-[#111] px-2 py-1 border border-[#333]">{selectedChar.gender}</span>
                  <span className="bg-[#111] px-2 py-1 border border-[#333]">{selectedChar.age === '불명' ? '나이 불명' : `${selectedChar.age}세`}</span>
                </div>
              </div>
              
              <div className="w-full md:w-2/3 flex flex-col gap-4 mt-4 md:mt-0">
                <h3 className="text-3xl md:text-4xl text-[#ccff00] font-display">{selectedChar.name}</h3>
                <div className="italic text-[#ccff00] font-sans border-l-2 border-[#ccff00] pl-3 py-2 bg-[#ccff00]/5 text-sm md:text-base">
                  "{selectedChar.quote}"
                </div>
                
                <div className="space-y-3 text-sm font-sans text-gray-300 mt-2">
                  <div><strong className="text-white">외모:</strong> {selectedChar.appearance}</div>
                  <div><strong className="text-white">복장:</strong> {selectedChar.outfit}</div>
                  <div><strong className="text-white">성격:</strong> {selectedChar.personality}</div>
                  <div><strong className="text-white">특징:</strong> {selectedChar.traits}</div>
                  <div><strong className="text-white">전투법:</strong> {selectedChar.combat}</div>
                  <div><strong className="text-white">말투:</strong> {selectedChar.speech}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function WebtoonSection() {
  return (
    <section id="webtoon" className="scroll-mt-24">
      <h3 className="text-3xl md:text-5xl text-center mb-16 font-display text-white tracking-widest">
        <span className="text-[#ccff00]">03.</span> WEBTOON
      </h3>
      <div className="max-w-3xl mx-auto biker-box !p-2 md:!p-4 bg-[#050505]">
        <div className="w-full max-h-[70vh] overflow-y-auto custom-scrollbar bg-black flex flex-col items-center">
          <img 
            src="https://s.tpvp.uk/SITE/webtoon/1.webp" 
            alt="Webtoon Episode 1" 
            className="w-full h-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </section>
  );
}
