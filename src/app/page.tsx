"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Rocket, ChevronRight, TrendingUp, Ticket, Trophy, Sparkles, Users, ArrowUpRight, Globe, Star, Sword, Swords, Wine } from "lucide-react"
import { useEffect, useState } from "react"

const colors = {
  primary: {
    from: '#d64d06',
    to: '#ff6b1a'
  },
  accent: {
    from: '#1a1e4d',  // Deep blue
    to: '#2d3282'     // Slightly lighter blue
  }
}

const FloatingElement = ({ children, initialX, initialY, duration = 20 }: {
  children: React.ReactNode
  initialX: number
  initialY: number
  duration?: number
}) => {
  return (
    <motion.div
      className="absolute text-[#d64d06]/40 pointer-events-none drop-shadow-[0_0_15px_rgba(214,77,6,0.3)] animate-float"
      initial={{ x: initialX, y: initialY }}
      animate={{
        y: [initialY - 30, initialY + 30, initialY - 30],
        x: [initialX - 30, initialX + 30, initialX - 30],
        rotate: [0, 360],
        scale: [1, 1.1, 1]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        filter: 'drop-shadow(0 0 8px rgba(214,77,6,0.3))'
      }}
    >
      {children}
    </motion.div>
  )
}

const GlowingBorder = () => (
  <div className="absolute inset-0 bg-gradient-to-r from-[#d64d06] to-[#ff6b1a] opacity-0 group-hover:opacity-20 rounded-xl blur-xl transition-opacity duration-500" />
)

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 }) // Default values

  useEffect(() => {
    // Update dimensions on mount
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })

    // Handle resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <main className="relative min-h-screen text-white font-sans overflow-hidden">
      {/* Background elements */}
      <FloatingElement initialX={100} initialY={200} duration={25}>
        <TrendingUp size={64} strokeWidth={1} />
      </FloatingElement>
      <FloatingElement initialX={dimensions.width - 200} initialY={300} duration={30}>
        <Ticket size={48} strokeWidth={1} />
      </FloatingElement>
      <FloatingElement initialX={300} initialY={dimensions.height - 400} duration={22}>
        <Trophy size={56} strokeWidth={1} />
      </FloatingElement>
      <FloatingElement initialX={dimensions.width - 400} initialY={500} duration={28}>
        <Globe size={52} strokeWidth={1} />
      </FloatingElement>
      <FloatingElement initialX={200} initialY={600} duration={26}>
        <Star size={48} strokeWidth={1} />
      </FloatingElement>
      <FloatingElement initialX={dimensions.width - 300} initialY={200} duration={24}>
        <Sword size={48} strokeWidth={1} />
      </FloatingElement>
      <FloatingElement initialX={400} initialY={300} duration={27}>
        <Wine size={48} strokeWidth={1} />
      </FloatingElement>
      <FloatingElement initialX={dimensions.width - 500} initialY={400} duration={29}>
        <Swords size={48} strokeWidth={1} />
      </FloatingElement>
      <FloatingElement initialX={600} initialY={dimensions.height - 300} duration={23}>
        <Wine size={48} strokeWidth={1} />
      </FloatingElement>

      <div className="fixed inset-0 -z-10">
        <object
          data="/background.svg"
          type="image/svg+xml"
          className="absolute w-full h-full object-cover min-w-full min-h-screen"
          aria-label="Animated background"
          style={{
            minWidth: '100vw',
            minHeight: '100vh',
            width: '100%',
            height: '100%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(26,30,77,0.1),transparent_50%)]" />
      </div>
      
      <div className="relative z-10">
        <motion.section 
          className="container mx-auto px-4 pt-32 pb-24"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          {/* Hero */}
          <div className="text-center mb-32">
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-from/10 to-accent-to/10 border border-accent-from/20 rounded-full px-6 py-3 mb-12 hover:bg-accent-from/20 transition-all duration-500 hover:scale-105"
              variants={fadeIn}
            >
              <Sparkles className="w-4 h-4 text-accent-from" />
              <span className="text-sm text-accent-from font-medium tracking-wider uppercase">Built by The Arena Community</span>
              <Sparkles className="w-4 h-4 text-accent-from" />
            </motion.div>

            <motion.div 
              className="flex items-center justify-center gap-4 mb-12"
              variants={fadeIn}
            >
              <Sword className="w-16 h-16 md:w-20 md:h-20 text-[#d64d06]" />
              <h1 className="text-7xl md:text-9xl font-black bg-gradient-to-r from-[#d64d06] to-[#ff6b1a] text-transparent bg-clip-text tracking-tight">
                ARENIUM
              </h1>
              <Sword className="w-16 h-16 md:w-20 md:h-20 text-[#d64d06] scale-x-[-1]" />
            </motion.div>

            <motion.p 
              className="text-3xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed mb-8"
              variants={fadeIn}
            >
              Dive into the world's first prediction market platform designed exclusively for The Arena community
            </motion.p>

            <motion.p
              className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
              variants={fadeIn}
            >
              Bet on memecoin trends, predict ticket values, and engage with community events
            </motion.p>
          </div>

          {/* Features */}
          <motion.div 
            id="features"
            className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-32"
            variants={fadeIn}
          >
            {[
              {
                icon: <TrendingUp className="w-10 h-10" />,
                title: "Memecoin Predictions",
                desc: "Stay ahead of the market by betting on your favorite Arena-launched memecoins",
                highlight: "Real-time Price Data"
              },
              {
                icon: <Ticket className="w-10 h-10" />,
                title: "Ticket Value Markets",
                desc: "Bet on user ticket values, a key metric in The Arena's ecosystem",
                highlight: "Dynamic Markets"
              },
              {
                icon: <Globe className="w-10 h-10" />,
                title: "Community Events",
                desc: "Predict outcomes of sports matches and trending cultural events",
                highlight: "Global Events"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="group relative bg-black/40 backdrop-blur-xl p-8 rounded-xl border border-[#d64d06]/20 hover:border-[#d64d06]/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(214,77,6,0.15)] hover:-translate-y-2 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-from/5 to-accent-from/5 group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
                <GlowingBorder />
                <div className="relative">
                  <div className="text-[#d64d06] mb-8 group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-white/80 mb-6 leading-relaxed">{feature.desc}</p>
                  <div className="flex items-center gap-2 text-sm text-[#d64d06] font-medium">
                    <span>{feature.highlight}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* How It Works */}
          <motion.div 
            id="how-it-works"
            className="max-w-4xl mx-auto text-center mb-32"
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-[#d64d06] to-[#ff6b1a] text-transparent bg-clip-text">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { step: "1", title: "Explore Markets", desc: "Browse prediction markets tailored to your interests" },
                { step: "2", title: "Place Bets", desc: "Use $ARENA tokens to make your predictions" },
                { step: "3", title: "Earn Rewards", desc: "Win rewards and climb the community leaderboard" }
              ].map((item) => (
                <div key={item.step} className="text-center group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#d64d06]/20 to-[#ff6b1a]/20 flex items-center justify-center mx-auto mb-6 text-[#d64d06] font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/70 text-base">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div 
            className="max-w-md mx-auto text-center"
            variants={fadeIn}
          >
            <a 
              href="https://arena.social/TheCuriousCake" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex bg-gradient-to-r from-[#d64d06] to-[#ff6b1a] text-white font-bold py-5 px-16 rounded-full text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-[0_0_50px_rgba(214,77,6,0.3)] items-center gap-4 mx-auto group"
            >
              <Rocket className="w-6 h-6 group-hover:translate-x-[-4px] transition-transform duration-500" />
              Learn More
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-500" />
            </a>
            <p className="mt-6 text-white/60 text-sm font-medium tracking-wide">Beta access coming soon</p>
          </motion.div>
        </motion.section>
      </div>
    </main>
  )
}
