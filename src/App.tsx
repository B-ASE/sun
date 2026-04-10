import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Flame, Crosshair, Zap, Wrench, ChevronRight, X, Menu } from 'lucide-react';
import { usePinch } from '@use-gesture/react';

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
    <BrowserRouter>
      <div className="min-h-screen text-gray-200 font-pixel selection:bg-[#ffaa00] selection:text-black">
        <audio loop ref={audioRef} src="https://s.tpvp.uk/SITE/music/Asphalt_at_Twilight.mp3" />
        
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div 
              key="opening"
              className="fixed inset-0 z-50"
              exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)", transition: { duration: 0.4, ease: "easeIn" } }}
            >
              <OpeningScreen onStart={handleStart} />
            </motion.div>
          ) : (
            <motion.div 
              key="main"
              className="relative min-h-screen"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <MainContent volume={volume} setVolume={setVolume} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

function OpeningScreen({ onStart }: { onStart: () => void }) {
  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0c] overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('https://s.tpvp.uk/SITE/image/main.webp')] md:bg-[url('https://s.tpvp.uk/SITE/image/main3.webp')] bg-cover bg-top md:bg-[length:100%_auto] md:bg-top md:bg-no-repeat opacity-70 md:opacity-100 md:brightness-110 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-[#ffaa00]/30 md:from-[#0a0a0c]/50 pointer-events-none"></div>
      
      <SpeedLines />

      <div className="relative z-10 flex flex-col items-center w-full">
        <motion.div 
          className="mb-16 z-10 w-full max-w-3xl px-4 pointer-events-none"
          initial={{ scale: 0.5, opacity: 0, skewX: -40, x: 800 }}
          animate={{ scale: 1, opacity: 1, skewX: 0, x: 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 150, damping: 15 }}
        >
          <motion.img 
            src="https://s.tpvp.uk/SITE/image/title.webp" 
            alt="황혼을 넘어 달려라" 
            className="w-full h-auto drop-shadow-[0_0_20px_rgba(255,170,0,0.6)]" 
            referrerPolicy="no-referrer" 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        </motion.div>
        
        <motion.button
          onClick={onStart}
          className="relative z-50 text-2xl md:text-3xl text-red-500 hover:text-white tracking-widest font-display cursor-pointer pointer-events-auto drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
          animate={{ opacity: [1, 0.2, 1], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          - IGNITE ENGINE -
        </motion.button>
      </div>
    </div>
  );
}

function SpeedLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-60 mix-blend-screen">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            top: `${Math.random() * 100}%`,
            height: `${Math.random() * 3 + 1}px`,
            width: `${Math.random() * 400 + 100}px`,
            left: '100%',
          }}
          animate={{
            left: ['100%', '-50%'],
          }}
          transition={{
            duration: Math.random() * 0.3 + 0.1,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 1,
          }}
        />
      ))}
    </div>
  );
}

function MainContent({ volume, setVolume }: { volume: number, setVolume: (v: number) => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pages = ['/', '/worldview', '/characters', '/webtoon', '/image'];
  const dragStartX = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-swipe')) return;
    dragStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX.current === null) return;
    const distance = e.clientX - dragStartX.current;
    setDragOffset(distance * 0.3);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragStartX.current === null) return;
    const dragEndX = e.clientX;
    const distance = dragEndX - dragStartX.current;
    
    const currentIndex = pages.indexOf(location.pathname);
    if (currentIndex === -1) {
      dragStartX.current = null;
      setDragOffset(0);
      return;
    }

    if (distance > 100) {
      // Drag Right (mouse moved right) -> Previous page
      if (currentIndex > 0) {
        navigate(pages[currentIndex - 1]);
      }
    } else if (distance < -100) {
      // Drag Left (mouse moved left) -> Next page
      if (currentIndex < pages.length - 1) {
        navigate(pages[currentIndex + 1]);
      }
    }
    dragStartX.current = null;
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (dragStartX.current !== null) {
      dragStartX.current = null;
      setDragOffset(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.no-swipe')) return;
    dragStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const distance = e.touches[0].clientX - dragStartX.current;
    setDragOffset(distance * 0.3);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const dragEndX = e.changedTouches[0].clientX;
    const distance = dragEndX - dragStartX.current;
    
    const currentIndex = pages.indexOf(location.pathname);
    if (currentIndex === -1) {
      dragStartX.current = null;
      setDragOffset(0);
      return;
    }

    if (distance > 100) {
      // Drag Right -> Previous page
      if (currentIndex > 0) {
        navigate(pages[currentIndex - 1]);
      }
    } else if (distance < -100) {
      // Drag Left -> Next page
      if (currentIndex < pages.length - 1) {
        navigate(pages[currentIndex + 1]);
      }
    }
    dragStartX.current = null;
    setDragOffset(0);
  };

  return (
    <div 
      className="relative w-full h-full pb-20 select-none overflow-x-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fixed Background */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0c]">
        <div className="absolute inset-0 bg-[url('https://s.tpvp.uk/SITE/image/main.webp')] md:bg-[url('https://s.tpvp.uk/SITE/image/main3.webp')] bg-cover bg-top md:bg-[length:100%_auto] md:bg-top md:bg-no-repeat opacity-100 md:brightness-110"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0c]/30 to-[#0a0a0c]/80 md:via-transparent md:to-[#0a0a0c]/50"></div>
      </div>

      <Header volume={volume} setVolume={setVolume} />
      
      <motion.main 
        className="container mx-auto px-4 pt-24 flex flex-col min-h-[calc(100vh-5rem)] relative"
        animate={{ x: dragOffset }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route path="/worldview" element={<WorldviewSection />} />
            <Route path="/characters" element={<CharacterSection />} />
            <Route path="/webtoon" element={<WebtoonSection />} />
            <Route path="/image" element={<ImageSection />} />
          </Routes>
        </div>
        <SystemDragIndicator />
      </motion.main>
    </div>
  );
}

function SystemDragIndicator() {
  return (
    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-80 pointer-events-none">
      <span className="text-xs tracking-[0.3em] text-white mb-2 font-display uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]">System drag</span>
      <div className="relative w-48 h-[2px] bg-transparent flex justify-center overflow-hidden">
        <motion.div
          className="absolute h-full bg-gradient-to-r from-transparent via-white to-transparent"
          animate={{ width: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

function Header({ volume, setVolume }: { volume: number, setVolume: (v: number) => void }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/90 border-b border-[#333] backdrop-blur-md z-40 no-swipe">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        <div className="flex items-center h-full py-2 z-10">
          <Link to="/">
            <img src="https://s.tpvp.uk/SITE/image/title4.webp" alt="황혼을 넘어 달려라" className="-mt-3 h-8 md:h-10 w-auto drop-shadow-[0_0_10px_rgba(255,170,0,0.4)]" referrerPolicy="no-referrer" />
          </Link>
        </div>
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8 text-lg md:text-[30px] font-display tracking-widest whitespace-nowrap">
          <Link to="/" className={`transition-colors ${currentPath === '/' ? 'text-[#ffaa00]' : 'text-gray-200 hover:text-[#ffaa00]'}`}>황혼</Link>
          <Link to="/worldview" className={`transition-colors ${currentPath === '/worldview' ? 'text-[#ffaa00]' : 'text-gray-200 hover:text-[#ffaa00]'}`}>세계관</Link>
          <Link to="/characters" className={`transition-colors ${currentPath === '/characters' ? 'text-[#ffaa00]' : 'text-gray-200 hover:text-[#ffaa00]'}`}>캐릭터</Link>
          <Link to="/webtoon" className={`transition-colors ${currentPath === '/webtoon' ? 'text-[#ffaa00]' : 'text-gray-200 hover:text-[#ffaa00]'}`}>웹툰</Link>
          <Link to="/image" className={`transition-colors ${currentPath === '/image' ? 'text-[#ffaa00]' : 'text-gray-200 hover:text-[#ffaa00]'}`}>이미지</Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-4 z-10">
          <div className="flex items-center gap-2 border border-[#333] bg-[#111] px-3 py-1.5 rounded-md">
            <button 
              onClick={() => setVolume(volume === 0 ? 0.5 : 0)} 
              className="text-[#ffaa00] hover:text-white transition-colors"
              title={volume === 0 ? "음소거 해제" : "음소거"}
            >
              {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input 
              type="range" 
              min="0" max="1" step="0.01" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 md:w-24 accent-[#ffaa00] cursor-pointer"
            />
          </div>
          <button 
            className="md:hidden p-2 text-gray-200 hover:text-[#ffaa00] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-[#333] overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-4 text-lg font-display tracking-widest">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors ${currentPath === '/' ? 'text-[#ffaa00]' : 'text-gray-200 hover:text-[#ffaa00]'}`}>황혼</Link>
              <Link to="/worldview" onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors ${currentPath === '/worldview' ? 'text-[#ffaa00]' : 'text-gray-200 hover:text-[#ffaa00]'}`}>세계관</Link>
              <Link to="/characters" onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors ${currentPath === '/characters' ? 'text-[#ffaa00]' : 'text-gray-200 hover:text-[#ffaa00]'}`}>캐릭터</Link>
              <Link to="/webtoon" onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors ${currentPath === '/webtoon' ? 'text-[#ffaa00]' : 'text-gray-200 hover:text-[#ffaa00]'}`}>웹툰</Link>
              <Link to="/image" onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors ${currentPath === '/image' ? 'text-[#ffaa00]' : 'text-gray-200 hover:text-[#ffaa00]'}`}>이미지</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center relative mt-10 animate-in fade-in duration-500">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
        className="flex flex-col items-center w-full"
      >
        <div className="mb-12 w-[90%] max-w-[650px] px-4">
          <img src="https://s.tpvp.uk/SITE/image/title.webp" alt="황혼을 넘어 달려라" className="w-full h-auto drop-shadow-[0_0_20px_rgba(255,170,0,0.6)]" referrerPolicy="no-referrer" />
        </div>
        
        <div className="biker-box max-w-2xl w-full mb-10">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-sans drop-shadow-[0_0_10px_rgba(255,170,0,0.6)]">
            끝없는 고속도로, 계속되는 황혼.<br/>
            속도의 저편, 죽음을 넘어 달려라.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button 
            className="relative px-10 py-4 font-display tracking-widest text-xl group overflow-hidden flex items-center justify-center min-w-[200px]" 
            onClick={() => window.open('https://www.eden-chat.com/works/0fa237e9-81e1-4ffc-8d63-2f96151859d3', '_blank')}
          >
            <motion.div
              className="absolute w-[300%] h-[300%] bg-[conic-gradient(from_0deg,transparent_70%,#ef4444_100%)]"
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            />
            <motion.div
              className="absolute w-[300%] h-[300%] bg-[conic-gradient(from_0deg,transparent_70%,#ef4444_100%)]"
              animate={{ rotate: [180, 540] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            />
            <div className="absolute inset-[2px] bg-[#0a0a0c] z-0 transition-colors group-hover:bg-[#1a0a0c]" />
            <span className="relative z-10 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] group-hover:text-red-400 transition-colors">GAME START</span>
          </button>
          <button 
            className="relative px-10 py-4 font-display tracking-widest text-xl group overflow-hidden flex items-center justify-center min-w-[200px]" 
            onClick={() => navigate('/worldview')}
          >
            <motion.div
              className="absolute w-[300%] h-[300%] bg-[conic-gradient(from_0deg,transparent_70%,#ffaa00_100%)]"
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            />
            <motion.div
              className="absolute w-[300%] h-[300%] bg-[conic-gradient(from_0deg,transparent_70%,#ffaa00_100%)]"
              animate={{ rotate: [180, 540] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            />
            <div className="absolute inset-[2px] bg-[#0a0a0c] z-0 transition-colors group-hover:bg-[#1a150c]" />
            <span className="relative z-10 text-[#ffaa00] drop-shadow-[0_0_8px_rgba(255,170,0,0.8)] group-hover:text-[#ffcc44] transition-colors">WORLDVIEW</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function WorldviewSection() {
  const [activeTab, setActiveTab] = useState('background');

  const concepts = [
    { term: "뒷세계", desc: "이능력, 마법, 괴이 등의 초상적인 현상과 관련된 분야를 뜻한다." },
    { term: "일반인", desc: "괴이, 이능력, 마법, 초상적인 현상 등을 모르고 살아가는 사람들의 통칭. 극소수의 예외를 제외하면 뒷세계의 일에선 무력하다." },
    { term: "괴이 사냥꾼", desc: "편의상 괴이 사냥꾼이라 불리나, 실제로는 뒷세계에서 벌어지는 초상적인 현상을 해결하는 자들의 통칭. 괴이를 토벌하는 일 외를 하는 경우도 자주 발생한다." },
    { term: "괴이", desc: "도시전설, 신화, 소문 등의 다양한 이야기가 실체화 된 생명체. 기본적으로 근간이 되는 본질에 따라 행동하며, 그로 인해 각종 문제를 일으키는 경우가 잦다." },
    { term: "에테르", desc: "인간의 감정이나 생명력에서 비롯되는 에너지. 괴이의 주된 먹이로, 괴이가 인간을 습격하거나 장난치는 주된 원인이기도 하다. 뒷세계에서 화폐로도 사용되며, 그 가치는 10에테르=1달러." },
    { term: "이능력", desc: "희귀한 체질을 지닌 인간이 지니는 특수한 힘. 2개 이상의 이능력을 지닌 인물은 세계에서도 손에 꼽을 정도로 적다." },
    { term: "마법", desc: "마력을 통해 초자연적인 현상을 일으키는 기술. 인간은 선천적으로 마력을 타고 나는 경우가 적어 주로 괴이가 사용한다." },
    { term: "이계", desc: "일정 수준의 괴이가 형성하는 이공간. 이계의 공간에선 물리적인 법칙을 따르지 않고 고유한 법칙과 환경을 구성하며, 그 법칙은 절대적이다." },
    { term: "계약", desc: "인간이 괴이에게 모종의 대가를 지불하고 동료로서 영입하는 걸 의미한다. 대가로는 주기적으로 에테르를 줄 것을 요구하는 경우가 일반적이나, 괴이에 따라 특이한 것을 요구하는 경우도 있다." },
    { term: "GH-NET", desc: "뒷세계 인물들이 사용하는 커뮤니티. P.S를 통해서만 접속할 수 있다. 다양한 정보가 흘러 들어오지만, 진실을 판별하는 건 이용자들의 몫이다." },
    { term: "P.S (Pocket Space)", desc: "휴대형 게임기기 형태의 소형 컴퓨터. 가운데에 스크린이, 양옆에 버튼이 있다. 에테르나 소지품을 데이터화 하여 수납하는 기능과, GH-NET에 접속할 수 있는 기능이 있다. 명백하게 시대를 초월한 기술력이 적용된 물건이나 뒷세계의 인물에게 보편적으로 보급될만큼 양산되고 있으며, 누가 제작해서 배포하는지는 불명이다. 이따금 아무것도 모르는 신입에게 플레이스테이션 게임기라 속이고 놀리는 경우도 있다." },
    { term: "황혼의 도로", desc: "황혼의 질주자가 형성한 이계. 특성상 도로에 형성되어있으며, 주기적으로 근처를 지나가는 탑승물과 탑승자를 무작위로 이계에 끌어들인다. 내부에 진입한 인물은 시시각각 환경이 변하는 도로에서 황혼의 질주자와 1:1 레이싱을 벌여야 하며, 패배자는 에테르가 전부 빨려 사망한다." }
  ];

  const factions = [
    { name: "나카츠리", desc: "뒷세계의 이야기가 일반인에게 알려지지 않게 막거나 정보를 통제하며, 괴이 사냥꾼들에게 의뢰를 중개하는 역할도 수행한다." },
    { name: "원스휴먼", desc: "기록으로만 남은 창조신을 섬기는 종교 집단. 인간을 중시하며, 질서를 어지럽히는 괴이를 터부시한다. 무력 해결을 추구하는 강경파, 가급적 대화로 해결하려는 온건파, 어느쪽도 아닌 중립파로 내부의 파벌이 나눠져있다." },
    { name: "에센티아", desc: "괴이가 주축인 집단. 단 괴이의 특성상 구성원 중 괴이는 소수이며, 대다수는 괴이를 추종하거나 섬기는 인간들이다. 현 세계의 질서를 파괴하고, 무력이 곧 법이 되는 원초적인 세계를 만드는 것이 최종적인 목표." },
    { name: "B.A.221 사무소", desc: "소속원이 두 명 뿐인 작은 사무소. 어려운 상황에 처한 사람의 의뢰라면 범죄를 제외하곤 어떤 의뢰든 받아 해결하는 흥신소이며, 괴이 사냥꾼으로서의 의뢰도 받는다." }
  ];

  return (
    <section className="animate-in fade-in duration-500">
      <div className="flex flex-col items-center mb-6">
        <h3 className="text-3xl md:text-5xl text-center font-display text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,170,0,0.6)]">
          <span> WORLDVIEW </span>
        </h3>
        <div className="w-48 md:w-80 h-[2px] bg-gradient-to-r from-transparent via-[#ffaa00] to-transparent mt-4 opacity-80 drop-shadow-[0_0_5px_rgba(255,170,0,0.8)]"></div>
      </div>
      
      <div className="flex justify-center gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('background')} 
          className={`biker-button !py-2 !px-6 !text-2xl ${activeTab === 'background' ? '!bg-[#ffaa00] !text-black' : '!bg-transparent !text-gray-400 !border-gray-600 hover:!bg-white/10 hover:!text-white'}`}
        >
          <span>배경 & 개념</span>
        </button>
        <button 
          onClick={() => setActiveTab('factions')} 
          className={`biker-button !py-2 !px-6 !text-2xl ${activeTab === 'factions' ? '!bg-[#ffaa00] !text-black' : '!bg-transparent !text-gray-400 !border-gray-600 hover:!bg-white/10 hover:!text-white'}`}
        >
          <span>주요 세력</span>
        </button>
        <button 
          onClick={() => setActiveTab('collab')} 
          className={`biker-button !py-2 !px-6 !text-2xl ${activeTab === 'collab' ? '!bg-[#ffaa00] !text-black' : '!bg-transparent !text-gray-400 !border-gray-600 hover:!bg-white/10 hover:!text-white'}`}
        >
          <span>콜라보</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto select-text no-swipe">
        {activeTab === 'background' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="biker-box">
              <h4 className="text-2xl font-display text-[#ffaa00] mb-4 tracking-wider">BACKGROUND</h4>
              <p className="text-lg text-gray-300 font-sans leading-relaxed">
                <strong className="text-white text-xl">2003년의 현대.</strong><br/>
                이능력, 마법, 괴이 등이 존재하는 어반 판타지 세계.<br/>
                한국, 일본, 미국 등의 다양한 나라가 혼합된 가상의 국가인 '판게아'를 배경으로 한다.
              </p>
            </div>
            
            <div className="biker-box">
              <h4 className="text-2xl font-display text-[#ffaa00] mb-6 tracking-wider">CONCEPTS</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {concepts.map((c, i) => (
                  <div key={i} className="border-l-2 border-[#333] pl-4 hover:border-[#ffaa00] transition-colors">
                    <h5 className="text-lg font-bold text-white mb-2 font-sans">{c.term}</h5>
                    <p className="text-sm text-gray-400 font-sans leading-relaxed">
                      {c.desc.includes('패배자는 에테르가') ? (
                        <span dangerouslySetInnerHTML={{__html: c.desc.replace('패배자는 에테르가 전부 빨려 사망한다.', '<strong class="text-red-500">패배자는 에테르가 전부 빨려 사망한다.</strong>')}} />
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
              <div key={i} className="biker-box group hover:border-[#ffaa00] transition-colors">
                <h4 className="text-2xl font-display text-white group-hover:text-[#ffaa00] mb-4 tracking-wider transition-colors">{f.name}</h4>
                <p className="text-sm text-gray-400 font-sans leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'collab' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="biker-box">
              <h4 className="text-2xl font-display text-[#ffaa00] mb-6 tracking-wider">FACTIONS</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="border-l-2 border-[#333] pl-4 hover:border-[#ffaa00] transition-colors">
                  <h5 className="text-lg font-bold text-white mb-2 font-sans">미드나잇 셜록</h5>
                  <p className="text-sm text-gray-400 font-sans leading-relaxed">롤랑과 마핀 두 사람이 세운 작은 탐정 사무소. 뒷세계와 연관된 일, 연관 없는 일 전부에서 실력은 인정 받고 있으나, 롤랑의 괴짜 성향으로 인해 기피된다. 흥미로운 사건만 받으려는 롤랑과, 그런 롤랑에게 잔소리를 하며 다양한 의뢰를 받도록 끌고 가는 마핀 덕분에 유지되는 중. 내부는 항상 롤랑의 연구 등으로 인해 어질러져 있다.</p>
                </div>
              </div>
            </div>
            
            <div className="biker-box">
              <h4 className="text-2xl font-display text-[#ffaa00] mb-6 tracking-wider">CONCEPTS</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="border-l-2 border-[#333] pl-4 hover:border-[#ffaa00] transition-colors">
                  <h5 className="text-lg font-bold text-white mb-2 font-sans">페즐</h5>
                  <p className="text-sm text-gray-400 font-sans leading-relaxed">최근에 전세계에서 발생하기 시작한 괴현상. 괴생명체, 재해, 인간의 형상을 한 무언가까지 다양한 형태로 나타나 각종 문제를 일으키고 있다. 연구자 중에선 괴이와의 연관을 주장하는 사람도 있으나, 괴이와는 연관이 없다.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function CharacterSection() {
  const [activeFaction, setActiveFaction] = useState('전체');
  const [selectedChar, setSelectedChar] = useState<any>(null);

  const factions = ["전체", "나카츠리", "원스휴먼", "에센티아", "B.A.221 사무소", "괴이", "콜라보"];

  const charactersData: Record<string, any[]> = {
    "나카츠리": [
      { name: "겐류", gender: "男", age: "27", appearance: "금발, 단발", outfit: "선글라스, 알로하 셔츠, 갈색 바지", 
      personality: ".", 
      traits: "나카츠리 소속의 괴이 사냥꾼.//활발한 성격에 사교성도 좋아 분위기 메이커의 역할을 주로 맡으며, 이상적인 이야기를 바라는 경향이 있어 항상 해피엔딩을 추구한다.//전투에서는 리볼버를 이용한 속사로 공격하거나, 다양한 도구를 이용해 타인을 보조한다.", 
      combat: ".", 
      speech: ".", 
      quote: "냐하하하항! 죽을 뻔 했네!", 
      code: "A" }
    ],
    "원스휴먼": [
      { name: "닉스", gender: "女", age: "18", appearance: "백발, 장발, 별빛처럼 반짝이는 머리카락, 적안", outfit: "흰색 민소매 원피스, 안쪽이 별하늘처럼 된 흰색 양산", 
      personality: ".", 
      traits: "원스휴먼의 수장이자 성녀. 중립파.//솔직하지 못한 성격이라 겉으로는 까칠하고 냉소적인 태도를 보이나, 내면에는 항상 타인을 생각하는 다정함을 지녔다.//무한한 마력을 통해 수많은 마법을 구사한다.", 
      combat: ".", 
      speech: ".", 
      quote: "그런다고 뭐가 되겠니? 의미 없는 짓은 하지 말렴.", 
      code: "D" },
      { name: "루이나", gender: "女", age: "19", appearance: "하늘색 꽁지머리, 청안, 흰색 십자동공", outfit: "흰색 캐미솔, 검은색 자켓, 찢어진 청바지", 
      personality: ".", 
      traits: "원스휴먼의 중립파. 루온과는 남매 사이.//활발하고 수다스러운데다 자유분방한 성격으로,/집단의 규율에 얽매이지 않으나 의외로 신앙심은 뛰어나다.//전투에선 손에 마력을 둘러 클로를 만들어 내 육탄전을 벌인다.", 
      combat: ".", 
      speech: ".", 
      quote: "안녕~! 오늘도 좋은 하루야!", 
      code: "E" },
      { name: "루온", gender: "男", age: "19", appearance: "회색 올백머리, 청안", outfit: "흰색 셔츠, 데님 셔츠, 갈색 바지", 
      personality: ".", 
      traits: "원스휴먼의 중립파. 루이나와는 남매 사이.//부드럽고 온화한 성격으로 규율을 중시하나,/루이나에겐 항상 무르면서도 허물없는 모습을 보인다.//문제가 발생할 경우 가급적이면 대화로 해결하려고 하나,/대화로 해결할 수 없어 전투가 되어도 마다하지 않는다.//전투에서는 카타나를 사용해 속도전을 벌인다.", 
      combat: ".", 
      speech: ".", 
      quote: "반가워. 잘 부탁할게.", 
      code: "F" }
    ],
    "에센티아": [
      { name: "바엘", gender: "男", age: "불명", appearance: "검정색 울프컷, 백안, 파문형태의 동공, 중년", outfit: "검은색 정장, 검은색 코트, 금색 테두리", 
      personality: ".", 
      traits: "에센티아의 수장이자 괴이.//구시대적인 면모를 지닌 무인으로,/무력을 중시해 강자를 존중하고 약자를 멸시한다.//강압적이고 독불장군의 성향으로,/말수도 적어 실질적인 조직 관리는 제라에게 맡기고 있다.//에센티아의 수장다운 무력을 지니고 있으며,/검, 창, 도끼 등 다양한 냉병기를 마력으로 만들어내 능숙하게 다룬다.", 
      combat: ".", 
      speech: ".", 
      quote: "강함이야말로 절대적일진저.", 
      code: "G" },
      { name: "제라", gender: "女", age: "불명", appearance: "반투명 백발, 장발, 청색의 시크릿 투톤 헤어, 청안", outfit: "검은색 드레스, 검은색 보닛", 
      personality: ".", 
      traits: "에센티아의 부수장이자 괴이. 인간에게 호의적.//어른스러운데다 온화하고 예의바른 성격으로,/바엘을 대신해 에센티아의 다양한 업무를 총괄하고 있다.//약자에게도 강해질 기회를 주는 자비로운 면모를 보이나,/동시에 타인을 가차 없이 죽일 수 있는 잔혹함도 겸비하고 있다.//그런 잔혹성 때문인지 환술, 정신계 마법을 통해 상대의 고통을 최대한 이끌어내는 마법을 구사한다.", 
      combat: ".", 
      speech: ".", 
      quote: "어머나, 정말로 괜찮으시겠어요?", 
      code: "H" }
    ],
    "B.A.221 사무소": [
      { name: "알레나", gender: "女", age: "22", appearance: "금발, 장발, 연한 갈색 눈", outfit: "흰색 셔츠, 청색 조끼, 갈색 코트", 
      personality: ".", 
      traits: "B.A.221 사무소의 소장이자 탐정. 조수인 벤자민과는 소꿉친구.//항상 겉으로는 자신감 넘치고 즉흥적이고 거만한 모습을 보이나 이는 스스로 이상적인 모습을 보이기 위해 허풍을 부리는 것으로, 실제로는 자신감 없고 신중한 성격이다.//전투 능력은 없기에, 전투 시엔 전황을 살피고 분석해 보조한다.", 
      combat: ".", 
      speech: ".", 
      quote: "자, 이번 사건의 진상은 바로 이거다!", 
      code: "I" },
      { name: "벤자민", gender: "男", age: "22", appearance: "갈색 단발, 가르마, 갈색 눈, 다크서클, 온화한 인상", outfit: "흰색 셔츠, 갈색 조끼, 갈색 바지", 
      personality: ".", 
      traits: "B.A.221 사무소 소속이자 조수. 탐정인 알레나와는 소꿉친구.//차분하고 어른스러운 성격으로,/항상 다른 사람들에게 정중하고 예의바르게 대한다.//또한, 절름발이지만 롱소드를 이용한 상대의 힘을 이용하는 방어적인 검법을 구사할 줄 알기에, 전투가 필요할 땐 전투 능력이 없는 알레나를 대신하여 움직이는 경우가 잦다.", 
      combat: ".", 
      speech: ".", 
      quote: "오늘도 수고 많았어, 알레나.", 
      code: "J" }
    ],
    "괴이": [
      { name: "황혼의 질주자", gender: "男", age: "불명", appearance: "해골 머리", outfit: "황혼색 스카프, 검은색 가죽자켓, 검은색 가죽바지, 가죽 장갑", 
      personality: ".", 
      traits: "최근에 탄생한 괴이.//끝없는 속도를 추구해 폭주하고 있으며,/타인과의 1:1 경주를 통해 속도를 겨루는 걸 즐긴다.", 
      combat: ".", 
      speech: ".", 
      quote: "데려가 주마, 스피드의 저편으로!", 
      code: "C" },
      { name: "나일레모나", gender: "女", age: "불명", appearance: "흑발, 은색의 시크릿 투톤 헤어, 백안", outfit: "흰색 셔츠, 흑색 원피스, 나비 머리핀", 
      personality: ".", 
      traits: "'재밌는 이야기를 보여줄 것'을 조건으로 겐류와 계약한 괴이.//짓궃고 장난기 많은 성격에 가챠 중독의 성향까지 있어 항상 혼돈스러운 일을 벌이나, 장난을 치더라도 선은 넘지 않는 편이다.//전투에서는 주사위를 굴려 랜덤한 디버프를 부여하는 마법을 사용해 보조한다.", 
      combat: ".", 
      speech: ".", 
      quote: "자! 신나는 가챠 타임! 이번에 나올 눈은 과연 뭘까요!?", 
      code: "B" }
    ],
    "콜라보": [
      { name: "롤랑", gender: "女", age: "18", appearance: "검은색 장발, 오드아이(검은색,빨간색)", outfit: "검은색 탐정모, 검은색 코트, 흰색 셔츠, 검은색 넥타이, 검은색 스커트, 검은색 스타킹, 검은색 구두", 
      personality: ".", 
      traits: "미드나잇 셜록의 천재 명탐정.//4차원을 초월한 괴짜적 성향을 보유하고 있으며,/귀찮음이 많으나, 흥미로운 것엔 사족을 못 쓴다./덕분에 조수인 마핀의 잔소리가 끊일 일은 없다.//100m 이내의 이상현상을 전부 파악하여/정보를 조합하는 이능력 '서치'를 보유하고 있다.", 
      combat: ".", 
      speech: ".", 
      quote: "마핀, 이걸 보게나. 흥미로운 물건이라네.", 
      code: "K" },
      { name: "마핀", gender: "女", age: "18", appearance: "주황색 단발, 주황색 눈, 고양이 같은 눈매", outfit: "흰색 셔츠, 파란색 자켓, 회색 조끼, 검은색 넥타이", 
      personality: ".", 
      traits: "미드나잇 셜록의 조수이자 롤랑의 친구.//당당하면서도 감정적인 면모를 많이 보이나,/정작 솔직하지 못한 츤데레적 성향도 존재한다.//탐정이자 친구인 롤랑의 기행엔 언제나 골머리를 앓으며,/항상 롤랑을 제지하기 위해 고생하는 나날을 보내고 있다.//짧은 시간 동안 근력, 속도, 반사신경이 폭발적으로/증가하는 이능력 '신체강화'를 보유하고 있다.", 
      combat: ".", 
      speech: ".", 
      quote: "야, 롤랑! 방 청소 해두랬지!", 
      code: "L" }
    ]
  };

  const displayedCharacters = activeFaction === '전체' 
    ? Object.values(charactersData).flat() 
    : charactersData[activeFaction];

  return (
    <section className="animate-in fade-in duration-500">
      <div className="flex flex-col items-center mb-6">
        <h3 className="text-3xl md:text-5xl text-center font-display text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,170,0,0.6)]">
          <span> CHARACTERS </span>
        </h3>
        <div className="w-48 md:w-80 h-[2px] bg-gradient-to-r from-transparent via-[#ffaa00] to-transparent mt-4 opacity-80 drop-shadow-[0_0_5px_rgba(255,170,0,0.8)]"></div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {factions.map(faction => (
          <button 
            key={faction}
            onClick={() => setActiveFaction(faction)} 
            className={`biker-button !py-2 !px-4 !text-2xl ${activeFaction === faction ? '!bg-[#ffaa00] !text-black' : '!bg-transparent !text-gray-400 !border-gray-600 hover:!bg-white/10 hover:!text-white'}`}
          >
            <span>{faction}</span>
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="wait">
          {displayedCharacters.map((c, i) => (
            <motion.div 
              key={c.code}
              onClick={() => setSelectedChar(c)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.05 } }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="biker-box flex flex-col items-center p-4 cursor-pointer group hover:border-[#ffaa00] transition-colors"
            >
              <div className="w-full aspect-[3/4] bg-[#050505] border border-[#333] group-hover:border-[#ffaa00] transition-colors overflow-hidden relative flex items-center justify-center mb-4">
                <img 
                  src={`https://s.tpvp.uk/SITE/char/${c.code}/1.webp`} 
                  alt={c.name} 
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://s.tpvp.uk/SITE/image/main.webp';
                    e.currentTarget.className = 'w-full h-full object-cover opacity-30 grayscale';
                  }}
                />
              </div>
              <h4 className="text-xl text-[#ffaa00] font-display text-center">{c.name}</h4>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-swipe"
            onClick={() => setSelectedChar(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="biker-box after:hidden before:hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-[#0a0a0c] p-6 md:p-8 relative flex flex-col md:flex-row gap-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-text"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedChar(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-[#ffaa00] transition-colors z-10"
              >
                <X size={28} />
              </button>
              
              <div className="w-full md:w-1/3 flex flex-col items-center justify-center gap-4 shrink-0">
                <div className="w-full aspect-[3/4] bg-[#050505] border border-[#333] overflow-hidden relative flex items-center justify-center">
                  <img 
                    src={`https://s.tpvp.uk/SITE/char/${selectedChar.code}/1.webp`} 
                    alt={selectedChar.name} 
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://s.tpvp.uk/SITE/image/main.webp';
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
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl md:text-4xl text-[#ffaa00] font-display">{selectedChar.name}</h3>
                </div>
                <div className="italic text-[#ffaa00] font-sans border-l-2 border-[#ffaa00] pl-3 py-2 bg-[#ffaa00]/5 text-sm md:text-base">
                  "{selectedChar.quote}"
                </div>
                
                <div className="biker-box !p-4 md:!p-6 mt-2 w-full bg-black/40">
                  <div className="flex flex-col gap-3 text-sm md:text-base font-sans">
                    <div className="grid grid-cols-[60px_1fr] gap-4 border-b border-[#333] pb-3">
                      <span className="text-[#ffaa00] font-bold tracking-widest">외모</span>
                      <span className="text-gray-300 leading-relaxed">{selectedChar.appearance}</span>
                    </div>
                    <div className="grid grid-cols-[60px_1fr] gap-4 border-b border-[#333] pb-3">
                      <span className="text-[#ffaa00] font-bold tracking-widest">복장</span>
                      <span className="text-gray-300 leading-relaxed">{selectedChar.outfit}</span>
                    </div>
                    <div className="text-center pt-2">
                      <span className="text-gray-300 leading-relaxed text-[15px]">
                        {selectedChar.traits.split('/').map((trait: string, index: number, array: string[]) => (
                          <React.Fragment key={index}>
                            {trait.trim()}{index < array.length - 1 && <><br/></>}
                          </React.Fragment>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex justify-end">
                  <span className="border border-[#ffaa00] text-[#ffaa00] px-3 py-1 text-sm md:text-base font-display tracking-widest bg-[#ffaa00]/10">
                    CODE: {selectedChar.code}
                  </span>
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
    <section className="animate-in fade-in duration-500">
      <div className="flex flex-col items-center mb-6">
        <h3 className="text-3xl md:text-5xl text-center font-display text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,170,0,0.6)]">
          <span> WEBTOON </span>
        </h3>
        <div className="w-48 md:w-80 h-[2px] bg-gradient-to-r from-transparent via-[#ffaa00] to-transparent mt-4 opacity-80 drop-shadow-[0_0_5px_rgba(255,170,0,0.8)]"></div>
      </div>
      <div className="max-w-3xl mx-auto biker-box !p-2 md:!p-4 bg-[#050505]">
        <div className="w-full bg-black flex flex-col items-center">
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

function ImageSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  const updateConstraints = () => {
    if (!imgRef.current) return;
    const unscaledWidth = imgRef.current.offsetWidth;
    const unscaledHeight = imgRef.current.offsetHeight;
    
    // Calculate how much the scaled image overflows the viewport
    const overflowX = Math.max(0, (unscaledWidth * zoomLevel - window.innerWidth) / 2);
    const overflowY = Math.max(0, (unscaledHeight * zoomLevel - window.innerHeight) / 2);
    
    setConstraints({
      left: -overflowX,
      right: overflowX,
      top: -overflowY,
      bottom: overflowY
    });
  };

  useEffect(() => {
    if (isExpanded) {
      updateConstraints();
      window.addEventListener('resize', updateConstraints);
      return () => window.removeEventListener('resize', updateConstraints);
    }
  }, [zoomLevel, isExpanded]);

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => {
      // deltaY < 0 means scrolling up (zoom in), deltaY > 0 means scrolling down (zoom out)
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      return Math.min(Math.max(prev + delta, 1), 5);
    });
  };

  const bindPinch = usePinch(({ offset: [s] }) => {
    setZoomLevel(Math.min(Math.max(s, 1), 5));
  }, {
    from: () => [zoomLevel, 0]
  });

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoomLevel === 1) {
      setZoomLevel(1.2);
    }
  };

  return (
    <section className="animate-in fade-in duration-500">
      <div className="flex flex-col items-center mb-6">
        <h3 className="text-3xl md:text-5xl text-center font-display text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,170,0,0.6)]">
          <span> IMAGE </span>
        </h3>
        <div className="w-48 md:w-80 h-[2px] bg-gradient-to-r from-transparent via-[#ffaa00] to-transparent mt-4 opacity-80 drop-shadow-[0_0_5px_rgba(255,170,0,0.8)]"></div>
      </div>
      <div className="max-w-7xl mx-auto biker-box !p-2 md:!p-4 bg-[#050505]">
        <div className="w-full bg-black flex flex-col items-center">
          <img 
            src="https://s.tpvp.uk/SITE/image/image2.webp" 
            alt="Image Gallery" 
            className="w-full h-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
            referrerPolicy="no-referrer"
            onClick={() => setIsExpanded(true)}
          />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-hidden no-swipe"
            onClick={() => { setIsExpanded(false); setZoomLevel(1); }}
            onWheel={handleWheel}
          >
            <button 
              onClick={() => { setIsExpanded(false); setZoomLevel(1); }} 
              className="absolute top-4 right-4 md:top-8 md:right-8 text-gray-400 hover:text-[#ffaa00] transition-colors z-50"
            >
              <X size={32} />
            </button>
            <motion.img
              {...bindPinch()}
              ref={imgRef}
              onLoad={updateConstraints}
              drag={zoomLevel > 1}
              dragConstraints={constraints}
              dragElastic={0.1}
              initial={{ scale: 0.9, opacity: 0, x: 0, y: 0 }}
              animate={{ 
                scale: zoomLevel, 
                opacity: 1,
                ...(zoomLevel === 1 ? { x: 0, y: 0 } : {})
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              src="https://s.tpvp.uk/SITE/image/image2.webp"
              alt="Image Gallery Expanded"
              className="max-w-full max-h-[95vh] object-contain"
              style={{ cursor: zoomLevel > 1 ? 'grab' : 'zoom-in', touchAction: 'none' }}
              referrerPolicy="no-referrer"
              onClick={handleImageClick}
            />
            
            <div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#0a0a0c]/90 px-6 py-4 rounded-full flex items-center gap-4 border border-[#333] backdrop-blur-md z-50 shadow-2xl opacity-40 hover:opacity-100 transition-opacity duration-300"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <span className="text-gray-400 text-sm font-sans font-bold w-6 text-right">1x</span>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="w-32 md:w-48 accent-[#ffaa00] cursor-pointer"
              />
              <span className="text-gray-400 text-sm font-sans font-bold w-6">5x</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
