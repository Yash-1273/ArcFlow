import Link from 'next/link';
import {
  Cpu, Zap, GitBranch, BarChart3, Shield, Users,
  ArrowRight, Star, TrendingUp, DollarSign, Brain,
  Layers, Activity, Globe, Network, Download, Sparkles,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   Inline SVG Hero Illustration
   A mini "live" architecture diagram that mimics the canvas
───────────────────────────────────────────────────────── */
function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Glow blob behind the diagram */}
      <div className="absolute inset-0 bg-blue-600/10 rounded-3xl blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl" />

      <svg
        viewBox="0 0 480 360"
        className="relative z-10 w-full drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Defs: packet glow filter ── */}
        <defs>
          <filter id="node-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Background card ── */}
        <rect x="8" y="8" width="464" height="344" rx="16" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />

        {/* ── Header bar ── */}
        <rect x="8" y="8" width="464" height="36" rx="16" fill="#111827" />
        <rect x="8" y="28" width="464" height="16" fill="#111827" />
        <circle cx="30" cy="26" r="5" fill="#ef4444" opacity="0.7" />
        <circle cx="46" cy="26" r="5" fill="#f59e0b" opacity="0.7" />
        <circle cx="62" cy="26" r="5" fill="#22c55e" opacity="0.7" />
        <rect x="80" y="20" width="120" height="12" rx="6" fill="#1e293b" />
        <rect x="380" y="18" width="60" height="16" rx="8" fill="#2563eb" opacity="0.8" />

        {/* ══ EDGES (draw below nodes) ══ */}

        {/* Load Balancer → API Gateway */}
        <path d="M 170 120 C 200 120 200 155 230 155" stroke="#a855f7" strokeWidth="1.5" fill="none" strokeDasharray="6 3" filter="url(#edge-glow)">
          <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="1s" repeatCount="indefinite" />
        </path>
        {/* Load Balancer → API Gateway 2 */}
        <path d="M 170 120 C 200 120 200 205 230 205" stroke="#a855f7" strokeWidth="1.5" fill="none" strokeDasharray="6 3" filter="url(#edge-glow)">
          <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="1.3s" repeatCount="indefinite" />
        </path>
        {/* API Gateway → Cache */}
        <path d="M 320 155 C 350 155 350 120 380 120" stroke="#14b8a6" strokeWidth="1.5" fill="none" strokeDasharray="6 3" filter="url(#edge-glow)">
          <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="0.9s" repeatCount="indefinite" />
        </path>
        {/* API Gateway → DB */}
        <path d="M 320 205 C 360 205 360 255 380 255" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeDasharray="6 3" filter="url(#edge-glow)">
          <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="1.4s" repeatCount="indefinite" />
        </path>
        {/* Client → LB */}
        <path d="M 90 120 L 120 120" stroke="#818cf8" strokeWidth="1.5" fill="none" strokeDasharray="6 3" filter="url(#edge-glow)">
          <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="0.8s" repeatCount="indefinite" />
        </path>
        {/* API → Queue */}
        <path d="M 320 205 C 360 205 360 305 380 305" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeDasharray="6 3" filter="url(#edge-glow)">
          <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="1.6s" repeatCount="indefinite" />
        </path>

        {/* ══ PACKET DOTS ══ */}
        {/* Packet on LB→API1 */}
        <circle r="4" fill="#a855f7" filter="url(#node-glow)">
          <animateMotion dur="1s" repeatCount="indefinite">
            <mpath href="#pkt-path-1" />
          </animateMotion>
        </circle>
        <path id="pkt-path-1" d="M 170 120 C 200 120 200 155 230 155" fill="none" />

        {/* Packet on API1→Cache */}
        <circle r="3.5" fill="#14b8a6" filter="url(#node-glow)">
          <animateMotion dur="0.9s" begin="0.3s" repeatCount="indefinite">
            <mpath href="#pkt-path-2" />
          </animateMotion>
        </circle>
        <path id="pkt-path-2" d="M 320 155 C 350 155 350 120 380 120" fill="none" />

        {/* Packet on API2→DB */}
        <circle r="3.5" fill="#60a5fa" filter="url(#node-glow)">
          <animateMotion dur="1.4s" begin="0.6s" repeatCount="indefinite">
            <mpath href="#pkt-path-3" />
          </animateMotion>
        </circle>
        <path id="pkt-path-3" d="M 320 205 C 360 205 360 255 380 255" fill="none" />

        {/* ══ NODES ══ */}

        {/* Client / Browser */}
        <rect x="30" y="100" width="60" height="40" rx="8" fill="#1e293b" stroke="#374151" strokeWidth="1.5" />
        <text x="60" y="117" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">CLIENT</text>
        <rect x="38" y="122" width="44" height="10" rx="3" fill="#0f172a" />
        <circle cx="60" cy="127" r="3" fill="#22c55e" />
        <text x="68" y="130" fill="#4b5563" fontSize="6" fontFamily="monospace">200 OK</text>

        {/* Load Balancer */}
        <rect x="120" y="100" width="50" height="40" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="1.5" />
        <text x="145" y="114" textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="monospace">LOAD</text>
        <text x="145" y="124" textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="monospace">BALANCER</text>
        <circle cx="145" cy="134" r="3" fill="#22c55e" filter="url(#node-glow)">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
        </circle>

        {/* API Service 1 */}
        <rect x="230" y="135" width="90" height="40" rx="8" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
        <text x="275" y="151" textAnchor="middle" fill="#a855f7" fontSize="7.5" fontFamily="monospace">API SERVICE</text>
        <rect x="238" y="157" width="74" height="10" rx="3" fill="#0f172a" />
        <text x="242" y="165" fill="#6b7280" fontSize="6" fontFamily="monospace">latency: 28ms</text>
        <circle cx="298" cy="162" r="3" fill="#f59e0b" filter="url(#node-glow)" />

        {/* API Service 2 */}
        <rect x="230" y="185" width="90" height="40" rx="8" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
        <text x="275" y="201" textAnchor="middle" fill="#a855f7" fontSize="7.5" fontFamily="monospace">API SERVICE</text>
        <rect x="238" y="207" width="74" height="10" rx="3" fill="#0f172a" />
        <text x="242" y="215" fill="#6b7280" fontSize="6" fontFamily="monospace">latency: 31ms</text>
        <circle cx="298" cy="212" r="3" fill="#22c55e" filter="url(#node-glow)">
          <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
        </circle>

        {/* Cache */}
        <rect x="380" y="100" width="70" height="40" rx="8" fill="#1e293b" stroke="#14b8a6" strokeWidth="1.5" />
        <text x="415" y="114" textAnchor="middle" fill="#14b8a6" fontSize="7.5" fontFamily="monospace">REDIS</text>
        <text x="415" y="126" textAnchor="middle" fill="#14b8a6" fontSize="7" fontFamily="monospace">CACHE</text>
        <circle cx="415" cy="134" r="3" fill="#14b8a6" filter="url(#node-glow)">
          <animate attributeName="opacity" values="1;0.5;1" dur="0.9s" repeatCount="indefinite" />
        </circle>

        {/* Database */}
        <rect x="380" y="235" width="70" height="40" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="415" y="249" textAnchor="middle" fill="#3b82f6" fontSize="7.5" fontFamily="monospace">POSTGRES</text>
        <text x="415" y="261" textAnchor="middle" fill="#3b82f6" fontSize="7" fontFamily="monospace">PRIMARY</text>
        <circle cx="415" cy="269" r="3" fill="#3b82f6" filter="url(#node-glow)">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Queue */}
        <rect x="380" y="285" width="70" height="40" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="415" y="299" textAnchor="middle" fill="#f59e0b" fontSize="7.5" fontFamily="monospace">KAFKA</text>
        <text x="415" y="311" textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="monospace">QUEUE</text>
        <circle cx="415" cy="319" r="3" fill="#f59e0b" filter="url(#node-glow)">
          <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* ── Status bar at bottom ── */}
        <rect x="8" y="336" width="464" height="16" rx="0" fill="#0a0f1a" />
        <rect x="8" y="336" width="464" height="4" rx="0" fill="#111827" />
        <circle cx="24" cy="344" r="3" fill="#22c55e" filter="url(#node-glow)">
          <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
        </circle>
        <text x="34" y="348" fill="#4b5563" fontSize="7" fontFamily="monospace">SIMULATION RUNNING · 1,247 req/s · 5 nodes healthy</text>
        <text x="390" y="348" fill="#2563eb" fontSize="7" fontFamily="monospace">ARCHFLOW</text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Page Component
───────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="relative bg-[#030712] text-white overflow-x-hidden">

      {/* ─── NAVBAR ─────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Network size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Arch<span className="text-blue-400">flow</span></span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/8 rounded-full px-1 py-1">
            {['Features', 'How It Works', 'About'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                className="px-4 py-1.5 rounded-full text-sm text-gray-400 hover:text-white hover:bg-white/8 transition-all">
                {l}
              </a>
            ))}
          </div>

          <Link href="/workspace"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02]">
            Open Canvas
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* ─── HERO ───────────────────────────────────────── */}
      <section className="relative min-h-screen grid-bg flex items-center overflow-hidden pt-20">
        {/* ambient glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6 tracking-wide">
              <Zap size={12} />  SYSTEM DESIGN · SIMULATE · SHIP
            </div>

            <h1 className="animate-fade-in-up-delay-1 text-5xl md:text-6xl font-black leading-[1.08] tracking-tight mb-6">
              Design systems
              <br />
              that <span className="gradient-text">actually scale</span>
            </h1>

            <p className="animate-fade-in-up-delay-2 text-lg text-gray-400 mb-8 leading-relaxed max-w-lg">
              Visual architecture canvas with real-time traffic simulation, AI-powered
              analysis, and packet-level data flow visualization. From idea to
              production-ready design in minutes.
            </p>

            <div className="animate-fade-in-up-delay-2 flex flex-wrap gap-3 mb-12">
              <Link href="/workspace"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl shimmer-btn text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.03] hover:shadow-blue-500/50">
                Start Designing Free
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a href="#features"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-sm font-semibold transition-all">
                See Features
              </a>
            </div>

            {/* Trust badges */}
            <div className="animate-fade-in-up-delay-3 flex flex-wrap gap-4 text-xs text-gray-500">
              {[
                { label: 'Groq Llama 3', sub: 'AI Engine' },
                { label: 'M/M/c Math', sub: 'Queue Theory' },
                { label: 'WebSocket', sub: 'Live Streaming' },
                { label: 'ReactFlow', sub: 'Visual Canvas' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-2 bg-white/3 border border-white/8 rounded-lg px-3 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-gray-300 font-medium">{b.label}</span>
                  <span className="text-gray-600">·</span>
                  <span>{b.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: live illustration */}
          <div className="animate-fade-in-up-delay-3 hidden lg:block">
            <HeroIllustration />
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs">
          <div className="w-5 h-8 rounded-full border border-gray-700 flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-gray-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────── */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
              <Star size={12} /> FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Everything you need to <span className="gradient-text">master</span> system design
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
              From AI-generated architectures to packet-level simulation, Archflow gives you a complete engineering workbench.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Brain,      color: 'blue',    title: 'AI Architecture Generator',  desc: 'Describe any system in plain English. AI instantly builds the full architecture with descriptions for every component.' },
              { icon: Activity,   color: 'emerald', title: 'Packet-Level Simulation',    desc: 'Watch colored packets travel node-to-node like Cisco Packet Tracer while queueing theory math drives real latency.' },
              { icon: GitBranch,  color: 'purple',  title: 'GitHub Reverse Engineering', desc: 'Paste a repo URL. Archflow reads the code, docker-compose, and README to generate a full architecture diagram.' },
              { icon: TrendingUp, color: 'amber',   title: 'Auto-Scaling Simulation',    desc: 'Infrastructure auto-clones bottlenecked nodes during simulation, just like Kubernetes HPA in production.' },
              { icon: Download,   color: 'teal',    title: 'Export to PNG',              desc: 'One-click export your architecture diagram as a high-resolution PNG for docs, presentations, or sharing.' },
              { icon: Shield,     color: 'red',     title: 'AI Security Scan',           desc: 'AI detects exposed databases, missing load balancers, single points of failure, and suggests fixes.' },
              { icon: BarChart3,  color: 'blue',    title: 'Scoring & Cost Estimate',    desc: 'Get a 0-100 architecture score, estimated monthly cloud cost, and prioritized improvement suggestions.' },
              { icon: Layers,     color: 'purple',  title: 'Custom Workflows',           desc: 'Drag in any of 6 node types — API, Database, Cache, Queue, Load Balancer, Custom — and wire up your own topology.' },
              { icon: Globe,      color: 'amber',   title: 'Data Flow Inspector',        desc: 'Click any node to expand a detailed panel showing how data flows through it step by step.' },
            ].map((feat, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-gray-900/40 border border-white/6 hover:border-white/12 hover:bg-gray-900/60 transition-all hover:-translate-y-1">
                <div className={`w-11 h-11 rounded-xl bg-${feat.color}-500/10 border border-${feat.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feat.icon size={20} className={`text-${feat.color}-400`} />
                </div>
                <h3 className="text-base font-bold mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────── */}
      <section id="how-it-works" className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <Cpu size={12} /> HOW IT WORKS
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Three steps to a <span className="gradient-text">bulletproof</span> design
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* connecting line */}
            <div className="hidden md:block absolute top-14 left-[33%] right-[33%] h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-emerald-500/50" />

            {[
              { step: '01', title: 'Describe or Import', desc: 'Type a system description or paste a GitHub URL. AI builds the full architecture in seconds.', color: 'blue' },
              { step: '02', title: 'Simulate Traffic',   desc: 'Hit Simulate and watch packets flow, latency spike, and auto-scaling kick in under load.', color: 'purple' },
              { step: '03', title: 'Analyze & Export',   desc: 'Get AI scoring, cost estimates, and export your final design to PNG for documentation.', color: 'emerald' },
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-2xl bg-gray-900/50 border border-white/6 text-center hover:border-white/12 transition-all">
                <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center mx-auto mb-5`}>
                  <span className={`text-${item.color}-400 text-xl font-black`}>{item.step}</span>
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ──────────────────────────────────────── */}
      <section id="about" className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
            <Users size={12} /> ABOUT ARCHFLOW
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Built for engineers who <span className="gradient-text">think at scale</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Archflow is a visual system design workbench for software architects, engineering
            students, and founders. Whether you're prepping for a FAANG interview, prototyping
            a new product, or stress-testing existing infrastructure — design, simulate, and ship.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { stat: 'Groq AI',    sub: 'Llama 3.3-70B powered' },
              { stat: 'M/M/c',     sub: 'Queueing theory math' },
              { stat: 'WebSocket', sub: 'Real-time streaming' },
            ].map(s => (
              <div key={s.stat} className="p-6 rounded-2xl bg-gray-900/40 border border-white/6">
                <div className="text-2xl font-black text-white mb-1">{s.stat}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────── */}
      <section className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative p-12 rounded-3xl border border-white/8 overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-indigo-600/5 to-purple-600/8" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <Sparkles size={32} className="text-blue-400 mx-auto mb-4 relative z-10 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-black mb-4 relative z-10">
              Ready to design something <span className="gradient-text">extraordinary</span>?
            </h2>
            <p className="text-gray-400 mb-8 relative z-10 max-w-md mx-auto">
              Open the canvas and start building. No sign-up required.
            </p>
            <Link href="/workspace"
              className="relative z-10 group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl shimmer-btn text-sm font-bold shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.03]">
              Open Archflow Canvas
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Network size={12} className="text-white" />
            </div>
            <span className="font-semibold text-gray-400">Archflow</span>
          </div>
          <span>© 2026 Archflow · System Design Workbench</span>
        </div>
      </footer>
    </div>
  );
}
