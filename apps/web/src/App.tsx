import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Activity,
  X,
  Menu,
  Check,
  Compass,
  Users,
  LineChart,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  loginWithGoogle, 
  registerWithEmail, 
  loginWithEmail, 
  logoutUser, 
  onAuthChanged 
} from './services/firebase';
import MagicRings from './components/MagicRings';

/* ── REUSABLE PAGE TRANSITION WRAPPER ─────────────────────── */
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full min-h-screen bg-black"
    >
      {children}
    </motion.div>
  );
}

/* ── AUTH STATE PROVIDER SIMULATION ──────────────────────── */
interface UserSession {
  uid: string;
  email: string;
  displayName?: string;
  orgName?: string;
  industry?: string;
}

/* ── CORE APPLICATION MAIN ENTRY ─────────────────────────── */
export default function App() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  // Sync auth state with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthChanged((user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Administrator',
          orgName: localStorage.getItem('last_org_name') || 'Acme Industries',
          industry: localStorage.getItem('last_industry') || 'Manufacturing'
        });
      } else {
        const savedMock = localStorage.getItem('sentinel_mock_user');
        if (savedMock) {
          setCurrentUser(JSON.parse(savedMock));
        } else {
          setCurrentUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSetUser = (user: UserSession | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('sentinel_mock_user', JSON.stringify(user));
      if (user.orgName) localStorage.setItem('last_org_name', user.orgName);
      if (user.industry) localStorage.setItem('last_industry', user.industry);
    } else {
      localStorage.removeItem('sentinel_mock_user');
      logoutUser();
    }
  };

  return (
    <Router>
      <AnimatedRoutes user={currentUser} setUser={handleSetUser} />
    </Router>
  );
}

interface AnimatedRoutesProps {
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
}

function AnimatedRoutes({ user, setUser }: AnimatedRoutesProps) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage setUser={setUser} /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignupPage setUser={setUser} /></PageTransition>} />
        <Route path="/dashboard-preview" element={<PageTransition><DashboardPreview user={user} setUser={setUser} /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. LANDING PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [dashboardActiveTab, setDashboardActiveTab] = useState<'revenue' | 'hr' | 'ops'>('revenue');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);

  // Demo Request Form state
  const [demoName, setDemoName] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoSize, setDemoSize] = useState('100-500');

  // AI Copilot Interactive Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; highlight?: string }>>([
    { sender: 'bot', text: 'Welcome to Sentinel AI Copilot. I can query ledger databases, provisions workflow nodes, and generate real-time analytics.' },
    { sender: 'user', text: 'Show me pending approvals older than 48 hours.' },
    { sender: 'bot', text: 'Found ', highlight: '7 approvals exceeding 48hrs: 3 Purchase Orders (₹12.4L total), 2 Leave Requests, and 2 Expense Claims. Shall I escalate them to respective managers?' }
  ]);
  const [chatTyping, setChatTyping] = useState(false);

  // Scroll event listener for navigation background
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Card glow coordinates tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  // AI Chat Suggestions trigger
  const triggerChatResponse = (prompt: string, response: string, highlight?: string) => {
    if (chatTyping) return;
    setChatMessages(prev => [...prev, { sender: 'user', text: prompt }]);
    setChatTyping(true);

    setTimeout(() => {
      setChatTyping(false);
      setChatMessages(prev => [...prev, { sender: 'bot', text: response, highlight }]);
    }, 1400);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoName || !demoEmail) return;
    setDemoSuccess(true);
    setTimeout(() => {
      setDemoModalOpen(false);
      setDemoSuccess(false);
      setDemoName('');
      setDemoEmail('');
    }, 2500);
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden font-sans">
      <div className="page-glow" aria-hidden="true" />

      {/* ── HEADER / NAVIGATION ── */}
      <nav className={`nav ${navScrolled ? 'scrolled' : ''}`} id="main-nav">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <div className="logo-mark" aria-hidden="true">
              <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="black" />
              </svg>
            </div>
            <span>Sentinel ERP</span>
          </Link>

          <ul className="nav-links" role="list">
            <li><a href="#features" className="nav-link">Features</a></li>
            <li><a href="#ai" className="nav-link">AI Copilot</a></li>
            <li><a href="#analytics" className="nav-link">Analytics</a></li>
            <li><a href="#updates" className="nav-link">Updates</a></li>
            <li><a href="#stories" className="nav-link">Customers</a></li>
          </ul>

          <div className="nav-actions">
            <button onClick={() => navigate('/login')} className="btn-ghost cursor-pointer">Log in</button>
            <button onClick={() => setDemoModalOpen(true)} className="btn-primary cursor-pointer">Request Demo</button>
          </div>

          <button 
            className="hamburger text-white/50 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#features" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
        <a href="#ai" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>AI Copilot</a>
        <a href="#analytics" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Analytics</a>
        <a href="#updates" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Updates</a>
        <a href="#stories" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Customers</a>
        <div className="mobile-actions">
          <button 
            onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} 
            className="btn-outline justify-center w-full"
          >
            Log in
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); setDemoModalOpen(true); }} 
            className="btn-primary justify-center w-full"
          >
            Request Demo
          </button>
        </div>
      </div>

      {/* ── SECTION 01: HERO ── */}
      <section className="hero relative overflow-hidden" id="hero">
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 opacity-35 mix-blend-screen" style={{ minHeight: '700px' }}>
          <MagicRings
            color="#A855F7"
            colorTwo="#6366F1"
            ringCount={8}
            speed={0.35}
            attenuation={11}
            lineThickness={1.5}
            baseRadius={0.28}
            radiusStep={0.09}
            scaleRate={0.05}
            opacity={0.85}
            blur={0}
            noiseAmount={0.04}
            rotation={30}
            ringGap={1.25}
            fadeIn={0.6}
            fadeOut={0.6}
            followMouse={true}
            mouseInfluence={0.12}
            hoverScale={1.1}
            parallax={0.02}
            clickBurst={true}
          />
        </div>
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap relative z-10">
          
          {/* Announcement Badge */}
          <div className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            <span>Now with AI-Powered Operations</span>
          </div>

          <h1 className="hero-title">
            Enterprise Intelligence.<br />
            <span className="line2">Unified Operations.</span>
          </h1>

          <p className="hero-sub">
            Manage HR, Finance, CRM, Inventory, Procurement, Assets, Analytics, Workflows, and AI Operations from a single intelligent ERP platform.
          </p>

          <div className="hero-actions">
            <button onClick={() => navigate('/signup')} className="btn-primary lg cursor-pointer">
              <ArrowRight size={16} />
              Start Free Trial
            </button>
            <button onClick={() => setDemoModalOpen(true)} className="btn-outline lg cursor-pointer">Book Enterprise Demo</button>
          </div>
          <p className="hero-note">No credit card required · SOC 2 Type II certified · 99.9% uptime SLA</p>

          {/* Dynamic ERP Dashboard Mockup */}
          <div className="hero-visual">
            <div className="hero-frame">
              
              {/* Browser bar */}
              <div className="chrome-bar" aria-hidden="true">
                <div className="chrome-dots">
                  <span className="chrome-dot dot-red"></span>
                  <span className="chrome-dot dot-yellow"></span>
                  <span className="chrome-dot dot-green"></span>
                </div>
                <div className="chrome-url">app.sentinelerp.io — Command Center</div>
              </div>

              {/* Layout body */}
              <div className="erp-layout">
                {/* Sidebar */}
                <aside className="erp-sidebar">
                  <div className="sidebar-org">
                    <div className="org-mark"></div>
                    <span>Acme Corp</span>
                  </div>

                  <div className="sidebar-group">
                    <div className="sidebar-group-label">Operations</div>
                    <div className="sidebar-item active">
                      <span className="sidebar-item-dot bg-white"></span>
                      Command Center
                      <span className="sidebar-count">12</span>
                    </div>
                    <div className="sidebar-item">
                      <span className="sidebar-item-dot bg-white/45"></span>
                      HRMS
                      <span className="sidebar-count">8</span>
                    </div>
                    <div className="sidebar-item">
                      <span className="sidebar-item-dot bg-white/45"></span>
                      Finance
                      <span className="sidebar-count">5</span>
                    </div>
                    <div className="sidebar-item">
                      <span className="sidebar-item-dot bg-white/45"></span>
                      CRM
                      <span className="sidebar-count">24</span>
                    </div>
                  </div>

                  <div className="sidebar-group">
                    <div className="sidebar-group-label">Supply Chain</div>
                    <div className="sidebar-item">
                      <span className="sidebar-item-dot bg-white/30"></span>
                      Inventory
                      <span className="sidebar-count">3</span>
                    </div>
                    <div className="sidebar-item">
                      <span className="sidebar-item-dot bg-white/30"></span>
                      Procurement
                    </div>
                  </div>

                  <div className="sidebar-group">
                    <div className="sidebar-group-label">Intelligence</div>
                    <div className="sidebar-item">
                      <span className="sidebar-item-dot bg-white/20"></span>
                      AI Copilot
                    </div>
                    <div className="sidebar-item">
                      <span className="sidebar-item-dot bg-white/20"></span>
                      Analytics
                    </div>
                  </div>
                </aside>

                {/* Dashboard Panel */}
                <div className="erp-main">
                  <div className="erp-topbar">
                    <span className="topbar-title">Executive Command Center</span>
                    <span className="topbar-badge">AI Active</span>
                    <div className="topbar-actions">
                      <button className="topbar-btn">Export</button>
                      <button className="topbar-btn">Share</button>
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="kpi-row">
                    <div className="kpi-card">
                      <div className="kpi-label">Revenue (MTD)</div>
                      <div className="kpi-value">₹4.2Cr</div>
                      <div className="kpi-change up">↑ 18.4% vs last month</div>
                    </div>
                    <div className="kpi-card">
                      <div className="kpi-label">Active Employees</div>
                      <div className="kpi-value">1,284</div>
                      <div className="kpi-change up">↑ 12 hired this month</div>
                    </div>
                    <div className="kpi-card">
                      <div className="kpi-label">Open Approvals</div>
                      <div className="kpi-value">47</div>
                      <div className="kpi-change dn">↓ Needs attention</div>
                    </div>
                    <div className="kpi-card">
                      <div className="kpi-label">Inventory Health</div>
                      <div className="kpi-value">96.2%</div>
                      <div className="kpi-change up">↑ Optimal levels</div>
                    </div>
                  </div>

                  {/* Workflow and AI feeds */}
                  <div className="erp-body">
                    <div className="workflow-panel">
                      <div className="panel-title">Pending Approvals</div>
                      <div className="workflow-row">
                        <span className="wf-status bg-white/60"></span>
                        <span className="wf-label">Purchase Order — Office Equipment</span>
                        <span className="wf-dept">Procurement</span>
                        <span className="wf-badge badge-pending">Pending</span>
                      </div>
                      <div className="workflow-row">
                        <span className="wf-status bg-white"></span>
                        <span className="wf-label">Leave Request — Priya Sharma</span>
                        <span className="wf-dept">HRMS</span>
                        <span className="wf-badge badge-approved">Approved</span>
                      </div>
                      <div className="workflow-row">
                        <span className="wf-status bg-white/40"></span>
                        <span className="wf-label">Expense Claim — Sales Team Q2</span>
                        <span className="wf-dept">Finance</span>
                        <span className="wf-badge badge-review">In Review</span>
                      </div>
                    </div>

                    <div className="ai-feed-panel border-l border-white/5">
                      <div className="ai-feed-header">
                        <div className="ai-orb">✦</div>
                        <span className="ai-feed-title">Sentinel AI</span>
                      </div>
                      <div className="ai-feed-item">
                        <strong>Anomaly detected:</strong> Inventory for SKU-2847 below threshold.
                      </div>
                      <div className="ai-feed-item">
                        <strong>Forecast:</strong> Revenue on track to exceed Q2 target by 14%.
                      </div>
                      <div className="ai-feed-item">
                        <strong>Action:</strong> 3 approvals pending &gt;48hrs — escalating.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 02: TRUST BAR (MARQUEE) ── */}
      <div className="landing-reverted-brand relative">
        <div className="page-glow" aria-hidden="true" />
        <section className="trust-bar" aria-labelledby="trust-label">
        <div className="wrap">
          <p className="trust-label" id="trust-label">Trusted by leading enterprises across industries</p>
        </div>
        <div className="marquee-wrap" aria-hidden="true">
          <div className="marquee-track">
            {/* Duplicated list of sector-specific CSS glyphs */}
            {[1, 2].map((set) => (
              <React.Fragment key={set}>
                <span className="trust-item"><span className="trust-icon"><div className="ic-trust ic-trust-mfg" /></span>Tata Manufacturing</span>
                <span className="trust-item"><span className="trust-icon"><div className="ic-trust ic-trust-hc" /></span>Apollo Healthcare</span>
                <span className="trust-item"><span className="trust-icon"><div className="ic-trust ic-trust-log" /></span>BlueDart Logistics</span>
                <span className="trust-item"><span className="trust-icon"><div className="ic-trust ic-trust-edu" /></span>Manipal Education</span>
                <span className="trust-item"><span className="trust-icon"><div className="ic-trust ic-trust-ret" /></span>Reliance Retail</span>
                <span className="trust-item"><span className="trust-icon"><div className="ic-trust ic-trust-ent" /></span>Infosys Enterprise</span>
                <span className="trust-item"><span className="trust-icon"><div className="ic-trust ic-trust-ind" /></span>L&amp;T Industries</span>
                <span className="trust-item"><span className="trust-icon"><div className="ic-trust ic-trust-fin" /></span>Axis Financial</span>
                <span className="trust-item"><span className="trust-icon"><div className="ic-trust ic-trust-avi" /></span>IndiGo Aviation</span>
                <span className="trust-item"><span className="trust-icon"><div className="ic-trust ic-trust-hos" /></span>Taj Hospitality</span>
                <span className="trust-item"><span className="trust-icon"><div className="ic-trust ic-trust-ph" /></span>Sun Pharma Group</span>
                <span className="trust-item"><span className="trust-icon"><div className="ic-trust ic-trust-en" /></span>Greenko Energy</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 03: INTRODUCTION ── */}
      <section className="intro-section" id="intro">
        <div className="wrap">
          <div className="intro-grid">
            
            {/* Left intro text */}
            <div>
              <div className="section-eyebrow">
                <span className="section-eyebrow-dot" />
                <span>The Next Generation</span>
              </div>
              <h2 className="section-title">The next generation of enterprise management.</h2>
              <p className="section-body">
                Traditional ERP systems are fragmented, complex, and difficult to scale. Sentinel ERP unifies operations, automation, analytics, intelligence, and AI into a single enterprise platform designed for modern organizations.
              </p>
            </div>

            {/* Right grid of feature cards */}
            <div className="intro-visual">
              <div className="intro-card" onMouseMove={handleMouseMove}>
                <div className="intro-card-icon"><div className="ic-topology" /></div>
                <div className="intro-card-title">Unified Platform</div>
                <div className="intro-card-desc">One system, all departments, zero silos.</div>
              </div>
              <div className="intro-card" onMouseMove={handleMouseMove}>
                <div className="intro-card-icon">
                  <div className="ic-pulse"><i></i><i></i><i></i><i></i></div>
                </div>
                <div className="intro-card-title">Real-time Intelligence</div>
                <div className="intro-card-desc">Live data across every business function.</div>
              </div>
              <div className="intro-card" onMouseMove={handleMouseMove}>
                <div className="intro-card-icon"><div className="ic-branch"><span className="ic-branch-dot" /></div></div>
                <div className="intro-card-title">AI-Native Design</div>
                <div className="intro-card-desc">Built with AI at the core, not as an add-on.</div>
              </div>
              <div className="intro-card" onMouseMove={handleMouseMove}>
                <div className="intro-card-icon"><div className="ic-scale"><span className="ic-scale-dot" /></div></div>
                <div className="intro-card-title">Enterprise Scale</div>
                <div className="intro-card-desc">Scales from 50 to 50,000 employees seamlessly.</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── SECTION 04: THREE PILLARS ── */}
      <section className="pillars-section" id="features">
        <div className="wrap">
          <div className="pillars-header">
            <div className="section-eyebrow justify-center">
              <span className="section-eyebrow-dot" />
              <span>Core Platform</span>
            </div>
            <h2 className="section-title text-center max-w-xl mx-auto mb-4">Three pillars. One platform.</h2>
            <p className="section-body text-center max-w-lg mx-auto">Everything your enterprise needs to operate, automate, and grow — unified in a single intelligent system.</p>
          </div>

          <div className="pillars-grid">
            {/* Pillar 1 */}
            <article className="pillar-card p1" onMouseMove={handleMouseMove}>
              <div className="pillar-icon"><div className="ic-nodes"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
              <h3 className="pillar-title">Unified Operations</h3>
              <p className="pillar-desc">Manage every department from a centralized operating system. Complete visibility across your entire enterprise.</p>
              <div className="pillar-modules">
                <span className="pillar-module">HRMS</span>
                <span className="pillar-module">CRM</span>
                <span className="pillar-module">Inventory</span>
                <span className="pillar-module">Procurement</span>
                <span className="pillar-module">Finance</span>
              </div>
            </article>

            {/* Pillar 2 */}
            <article className="pillar-card p2" onMouseMove={handleMouseMove}>
              <div className="pillar-icon"><div className="ic-orbit"><b className="ic-orbit-core"></b></div></div>
              <h3 className="pillar-title">Intelligent Automation</h3>
              <p className="pillar-desc">Automate approvals, notifications, workflows, escalations, and repetitive tasks. Reduce manual effort by up to 80%.</p>
              <div className="pillar-modules">
                <span className="pillar-module">Approval Chains</span>
                <span className="pillar-module">Event Triggers</span>
                <span className="pillar-module">Escalations</span>
                <span className="pillar-module">Scheduling</span>
              </div>
            </article>

            {/* Pillar 3 */}
            <article className="pillar-card p3" onMouseMove={handleMouseMove}>
              <div className="pillar-icon"><div className="ic-neural"><b className="ic-neural-core"></b></div></div>
              <h3 className="pillar-title">AI Business Intelligence</h3>
              <p className="pillar-desc">Turn enterprise data into actionable decisions through predictive insights, anomaly detection, and AI assistance.</p>
              <div className="pillar-modules">
                <span className="pillar-module">Forecasting</span>
                <span className="pillar-module">Anomaly Detection</span>
                <span className="pillar-module">AI Reports</span>
                <span className="pillar-module">Insights</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── SECTION 05: WORKFLOW AUTOMATION ── */}
      <section className="automation-section">
        <div className="wrap">
          <div className="feature-layout">
            <div>
              <div className="section-eyebrow">
                <span className="section-eyebrow-dot" />
                <span>Workflow Automation</span>
              </div>
              <h2 className="section-title">Automate business operations.</h2>
              <p className="section-body">
                Reduce manual effort across departments through intelligent workflow automation, approval chains, event triggers, and AI-powered actions. Set rules once — Sentinel handles the rest.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span className="text-white text-base">✓</span> Multi-level approval routing
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span className="text-white text-base">✓</span> Auto-escalation on SLA breach
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span className="text-white text-base">✓</span> Cross-department event triggers
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span className="text-white text-base">✓</span> AI-powered anomaly detection
                </div>
              </div>
            </div>

            <div className="workflow-visual">
              <div className="workflow-header">
                <div className="ic-wf-hdr" />
                <span>Workflow Builder</span>
              </div>
              <div className="workflow-items">
                <div className="wf-item">
                  <div className="wf-item-icon"><div className="ic-wf-po" /></div>
                  <div className="wf-item-info">
                    <div className="wf-item-title">Purchase Approval Flow</div>
                    <div className="wf-item-sub">Manager → Finance → CFO</div>
                  </div>
                  <span className="wf-item-status badge-pending">Pending</span>
                </div>
                <div className="wf-item">
                  <div className="wf-item-icon"><div className="ic-wf ic-wf-leave" /></div>
                  <div className="wf-item-info">
                    <div className="wf-item-title">Leave Request Automation</div>
                    <div className="wf-item-sub">HR → Department Head</div>
                  </div>
                  <span className="wf-item-status badge-approved">Active</span>
                </div>
                <div className="wf-item">
                  <div className="wf-item-icon"><div className="ic-wf-exp"><i></i><i></i><i></i></div></div>
                  <div className="wf-item-info">
                    <div className="wf-item-title">Expense Approval Chain</div>
                    <div className="wf-item-sub">Team Lead → Finance Controller</div>
                  </div>
                  <span className="wf-item-status badge-approved">Active</span>
                </div>
                <div className="wf-item">
                  <div className="wf-item-icon"><div className="ic-wf-asset"><span className="ic-wf-asset-link"></span></div></div>
                  <div className="wf-item-info">
                    <div className="wf-item-title">Asset Assignment Request</div>
                    <div className="wf-item-sub">IT → Admin → Manager</div>
                  </div>
                  <span className="wf-item-status badge-review">In Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── SECTION 06: EXECUTIVE DASHBOARD ── */}
      <section className="visibility-section">
        <div className="wrap">
          <div className="feature-layout reverse">
            <div>
              <div className="section-eyebrow">
                <span className="section-eyebrow-dot" />
                <span>Executive Dashboard</span>
              </div>
              <h2 className="section-title">Gain complete business visibility.</h2>
              <p className="section-body">
                Track company-wide KPIs, department performance, revenue trends, workforce metrics, operational efficiency, and strategic goals from a single executive view.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="p-4 bg-white/5 border border-white/8 rounded-xl">
                  <div className="text-2xl font-bold tracking-tight">₹18.4Cr</div>
                  <div className="text-[11px] text-white/50 mt-1">Quarterly Revenue</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/8 rounded-xl">
                  <div className="text-2xl font-bold tracking-tight text-white">96.2%</div>
                  <div className="text-[11px] text-white/50 mt-1">Inventory Accuracy</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/8 rounded-xl">
                  <div className="text-2xl font-bold tracking-tight text-white/80">84%</div>
                  <div className="text-[11px] text-white/50 mt-1">Workflow Automation</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/8 rounded-xl">
                  <div className="text-2xl font-bold tracking-tight">1,284</div>
                  <div className="text-[11px] text-white/50 mt-1">Active Employees</div>
                </div>
              </div>
            </div>

            {/* Interactive chart preview */}
            <div className="dashboard-visual">
              <div className="dash-header">
                <span>Executive Dashboard</span>
                <div className="dash-tabs ml-auto">
                  <button 
                    onClick={() => setDashboardActiveTab('revenue')}
                    className={`dash-tab ${dashboardActiveTab === 'revenue' ? 'active' : ''}`}
                  >
                    Revenue
                  </button>
                  <button 
                    onClick={() => setDashboardActiveTab('hr')}
                    className={`dash-tab ${dashboardActiveTab === 'hr' ? 'active' : ''}`}
                  >
                    HR
                  </button>
                  <button 
                    onClick={() => setDashboardActiveTab('ops')}
                    className={`dash-tab ${dashboardActiveTab === 'ops' ? 'active' : ''}`}
                  >
                    Ops
                  </button>
                </div>
              </div>

              {/* KPI indicators inside dashboard */}
              <div className="dash-kpis">
                <div className="dash-kpi">
                  <div className="dash-kpi-val">
                    {dashboardActiveTab === 'revenue' ? '₹4.2Cr' : dashboardActiveTab === 'hr' ? '1,284' : '96.2%'}
                  </div>
                  <div className="dash-kpi-lbl">
                    {dashboardActiveTab === 'revenue' ? 'Revenue MTD' : dashboardActiveTab === 'hr' ? 'Headcount' : 'Inventory Accuracy'}
                  </div>
                  <div className="dash-kpi-delta delta-up">↑ {dashboardActiveTab === 'revenue' ? '18.4%' : dashboardActiveTab === 'hr' ? '+12 hired' : 'Optimal'}</div>
                </div>
                <div className="dash-kpi">
                  <div className="dash-kpi-val">
                    {dashboardActiveTab === 'revenue' ? '28.6%' : dashboardActiveTab === 'hr' ? '91.3%' : '84.0%'}
                  </div>
                  <div className="dash-kpi-lbl">
                    {dashboardActiveTab === 'revenue' ? 'Profit Margin' : dashboardActiveTab === 'hr' ? 'Workforce Util.' : 'Auto-resolutions'}
                  </div>
                  <div className="dash-kpi-delta delta-up">↑ {dashboardActiveTab === 'revenue' ? '3.2%' : dashboardActiveTab === 'hr' ? '+15%' : '+12%'}</div>
                </div>
                <div className="dash-kpi">
                  <div className="dash-kpi-val">
                    {dashboardActiveTab === 'revenue' ? '₹2.1Cr' : dashboardActiveTab === 'hr' ? '14' : '47'}
                  </div>
                  <div className="dash-kpi-lbl">
                    {dashboardActiveTab === 'revenue' ? 'Sales Forecast' : dashboardActiveTab === 'hr' ? 'Open Requisitions' : 'Pending Approvals'}
                  </div>
                  <div className="dash-kpi-delta delta-up">↑ On Track</div>
                </div>
              </div>

              {/* Bar charts responsive data adjustment */}
              <div className="dash-chart">
                <div className="text-[11px] text-white/50 mb-3 font-semibold">Monthly Performance Trend</div>
                <div className="chart-bars">
                  {dashboardActiveTab === 'revenue' && (
                    <>
                      <div className="chart-bar" style={{ height: '45%' }}></div>
                      <div className="chart-bar" style={{ height: '60%' }}></div>
                      <div className="chart-bar" style={{ height: '50%' }}></div>
                      <div className="chart-bar" style={{ height: '72%' }}></div>
                      <div className="chart-bar" style={{ height: '65%' }}></div>
                      <div className="chart-bar" style={{ height: '80%' }}></div>
                      <div className="chart-bar highlight" style={{ height: '95%' }}></div>
                      <div className="chart-bar" style={{ height: '88%' }}></div>
                    </>
                  )}
                  {dashboardActiveTab === 'hr' && (
                    <>
                      <div className="chart-bar" style={{ height: '75%' }}></div>
                      <div className="chart-bar" style={{ height: '78%' }}></div>
                      <div className="chart-bar" style={{ height: '82%' }}></div>
                      <div className="chart-bar" style={{ height: '80%' }}></div>
                      <div className="chart-bar highlight" style={{ height: '88%' }}></div>
                      <div className="chart-bar" style={{ height: '90%' }}></div>
                      <div className="chart-bar" style={{ height: '93%' }}></div>
                      <div className="chart-bar" style={{ height: '95%' }}></div>
                    </>
                  )}
                  {dashboardActiveTab === 'ops' && (
                    <>
                      <div className="chart-bar" style={{ height: '90%' }}></div>
                      <div className="chart-bar" style={{ height: '92%' }}></div>
                      <div className="chart-bar" style={{ height: '95%' }}></div>
                      <div className="chart-bar" style={{ height: '91%' }}></div>
                      <div className="chart-bar" style={{ height: '93%' }}></div>
                      <div className="chart-bar highlight" style={{ height: '96%' }}></div>
                      <div className="chart-bar" style={{ height: '94%' }}></div>
                      <div className="chart-bar" style={{ height: '96%' }}></div>
                    </>
                  )}
                </div>
                <div className="chart-labels">
                  <div className="chart-lbl">Nov</div>
                  <div className="chart-lbl">Dec</div>
                  <div className="chart-lbl">Jan</div>
                  <div className="chart-lbl">Feb</div>
                  <div className="chart-lbl">Mar</div>
                  <div className="chart-lbl">Apr</div>
                  <div className="chart-lbl">May</div>
                  <div className="chart-lbl">Jun</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── SECTION 07: COLLABORATION BOARD ── */}
      <section className="collab-section">
        <div className="wrap">
          <div className="feature-layout">
            <div>
              <div className="section-eyebrow">
                <span className="section-eyebrow-dot" />
                <span>Cross-Department</span>
              </div>
              <h2 className="section-title">Connect departments seamlessly.</h2>
              <p className="section-body">
                Unify communication and workflows between HR, Finance, CRM, Procurement, Operations, and Leadership teams. Break silos and accelerate decision-making across your entire organization.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-xs text-white/80">HR &amp; Recruitment</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-xs text-white/85">Finance &amp; Payroll</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-xs text-white">CRM &amp; Sales</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-xs text-white/70">Procurement</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-xs text-white/60">Operations</span>
              </div>
            </div>

            {/* Board visual */}
            <div className="collab-board">
              <div className="board-header">
                <span>Cross-Functional Workflow Board</span>
                <div className="ml-auto text-[11px] text-white/40">Live</div>
              </div>
              <div className="board-columns">
                <div className="board-col">
                  <div className="board-col-header"><span className="col-dot bg-white/30" />Backlog</div>
                  <div className="board-ticket">
                    <div className="ticket-dept text-white/40">Finance</div>
                    <span>Q3 Budget Review</span>
                  </div>
                  <div className="board-ticket">
                    <div className="ticket-dept text-white/40">HR</div>
                    <span>Policy Update 2026</span>
                  </div>
                </div>
                <div className="board-col">
                  <div className="board-col-header"><span className="col-dot bg-white/60" />In Progress</div>
                  <div className="board-ticket">
                    <div className="ticket-dept text-white/60">Procurement</div>
                    <span>Vendor Negotiation</span>
                  </div>
                  <div className="board-ticket">
                    <div className="ticket-dept text-white/60">CRM</div>
                    <span>Enterprise Deal — Acme</span>
                  </div>
                </div>
                <div className="board-col">
                  <div className="board-col-header"><span className="col-dot bg-white/80" />Review</div>
                  <div className="board-ticket">
                    <div className="ticket-dept text-white/80">Operations</div>
                    <span>Inventory Audit</span>
                  </div>
                </div>
                <div className="board-col">
                  <div className="board-col-header"><span className="col-dot bg-white" />Done</div>
                  <div className="board-ticket">
                    <div className="ticket-dept text-white">HR</div>
                    <span>Onboarding — 12 Hires</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── SECTION 08: AI COPILOT (INTERACTIVE CHAT) ── */}
      <section className="ai-section" id="ai">
        <div className="wrap">
          <div className="ai-layout">
            
            {/* Interactive Chat interface */}
            <div className="ai-interface">
              <div className="ai-header">
                <div className="ai-header-orb">✦</div>
                <div className="ai-header-info">
                  <div className="ai-name">Sentinel AI Copilot</div>
                  <div className="ai-status">● Online — Ready</div>
                </div>
              </div>

              <div className="ai-messages min-h-[260px] max-h-[300px] overflow-y-auto">
                <AnimatePresence>
                  {chatMessages.map((msg, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`ai-msg ${msg.sender === 'user' ? 'user' : 'bot'}`}
                    >
                      <div className="ai-bubble">
                        <span>{msg.text}</span>
                        {msg.highlight && <strong className="text-white">{msg.highlight}</strong>}
                      </div>
                    </motion.div>
                  ))}
                  {chatTyping && (
                    <div className="ai-typing-indicator">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Suggestions chips */}
              <div className="ai-suggestions border-t border-white/5 pt-3">
                <button 
                  onClick={() => triggerChatResponse(
                    'Forecast inventory shortages for next quarter.',
                    'Analyzing May inventory flow... Suggest auto-reordering SKU-1092 and SKU-4410 by June 15 to avoid a forecasted ',
                    '14% stockout risk in Manufacturing.'
                  )}
                  className="ai-suggestion"
                >
                  Forecast inventory shortages
                </button>
                <button 
                  onClick={() => triggerChatResponse(
                    'Analyze employee utilization rate.',
                    'Workforce utilization is currently at ',
                    '91.3% with peak allocations in the Engineering and Logistics units. 4 teams are approaching overallocation.'
                  )}
                  className="ai-suggestion"
                >
                  Analyze utilization
                </button>
                <button 
                  onClick={() => triggerChatResponse(
                    'Identify operational risks.',
                    'Identified ',
                    '2 major risks: 1) Purchase Order approvals pending >48hrs in Finance, 2) Freight supplier SLA breach warning.'
                  )}
                  className="ai-suggestion"
                >
                  Identify operational risks
                </button>
              </div>
            </div>

            {/* AI description */}
            <div>
              <div className="section-eyebrow">
                <span className="section-eyebrow-dot" />
                <span>AI Copilot</span>
              </div>
              <h2 className="section-title">Work with your AI ERP Copilot.</h2>
              <p className="section-body">Ask questions, generate reports, summarize activities, forecast outcomes, detect anomalies, and automate business decisions in natural language.</p>

              <div className="ai-features mt-8">
                <div className="ai-feature" onMouseMove={handleMouseMove}>
                  <div className="ai-feature-icon"><div className="ic-ai-report" /></div>
                  <div>
                    <div className="ai-feature-title">Instant Report Generation</div>
                    <div className="ai-feature-desc">Generate finance, HR, sales, and operational reports in seconds with a single prompt.</div>
                  </div>
                </div>
                <div className="ai-feature" onMouseMove={handleMouseMove}>
                  <div className="ai-feature-icon">
                    <div className="ic-ai-forecast"><span className="ic-ai-forecast-dot" /></div>
                  </div>
                  <div>
                    <div className="ai-feature-title">Predictive Forecasting</div>
                    <div className="ai-feature-desc">Forecast revenue, inventory needs, workforce requirements, and operational loads.</div>
                  </div>
                </div>
                <div className="ai-feature" onMouseMove={handleMouseMove}>
                  <div className="ai-feature-icon"><div className="ic-ai-anomaly" /></div>
                  <div>
                    <div className="ai-feature-title">Anomaly Detection</div>
                    <div className="ai-feature-desc">Automatically detect outliers, fraud signals, SLA breaches, and operational risks.</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── SECTION 09: ENTERPRISE ANALYTICS ── */}
      <section className="analytics-section" id="analytics">
        <div className="wrap">
          <div className="analytics-layout">
            <div>
              <div className="section-eyebrow">
                <span className="section-eyebrow-dot" />
                <span>Enterprise Analytics</span>
              </div>
              <h2 className="section-title">Monitor enterprise performance at scale.</h2>
              <p className="section-body">
                Track business growth through real-time dashboards, predictive analytics, operational intelligence, and executive reporting across every department and business unit.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span className="text-white font-bold">◆</span> Real-time revenue &amp; profitability charts
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span className="text-white font-bold">◆</span> Department KPI scorecards
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span className="text-white font-bold">◆</span> Workforce &amp; attrition analytics
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span className="text-white font-bold">◆</span> Inventory &amp; supply chain metrics
                </div>
              </div>
            </div>

            {/* Sparkline cards */}
            <div className="analytics-grid">
              <div className="analytics-card" onMouseMove={handleMouseMove}>
                <div className="ac-title">Revenue Growth</div>
                <div className="ac-value text-white">+18.4%</div>
                <div className="mini-sparkline">
                  <div className="spark-bar" style={{ height: '40%' }} />
                  <div className="spark-bar" style={{ height: '55%' }} />
                  <div className="spark-bar" style={{ height: '48%' }} />
                  <div className="spark-bar" style={{ height: '70%' }} />
                  <div className="spark-bar active" style={{ height: '90%' }} />
                </div>
              </div>
              <div className="analytics-card" onMouseMove={handleMouseMove}>
                <div className="ac-title">Dept KPI Score</div>
                <div className="ac-value text-white">87/100</div>
                <div className="mini-sparkline">
                  <div className="spark-bar" style={{ height: '75%' }} />
                  <div className="spark-bar" style={{ height: '82%' }} />
                  <div className="spark-bar" style={{ height: '79%' }} />
                  <div className="spark-bar active" style={{ height: '87%' }} />
                </div>
              </div>
              <div className="analytics-card" onMouseMove={handleMouseMove}>
                <div className="ac-title">Workforce Util.</div>
                <div className="ac-value">91.3%</div>
                <div className="mini-sparkline">
                  <div className="spark-bar" style={{ height: '85%' }} />
                  <div className="spark-bar" style={{ height: '88%' }} />
                  <div className="spark-bar active" style={{ height: '91%' }} />
                  <div className="spark-bar" style={{ height: '89%' }} />
                </div>
              </div>
              <div className="analytics-card" onMouseMove={handleMouseMove}>
                <div className="ac-title">Inventory Fill Rate</div>
                <div className="ac-value text-white">96.2%</div>
                <div className="mini-sparkline">
                  <div className="spark-bar" style={{ height: '90%' }} />
                  <div className="spark-bar" style={{ height: '93%' }} />
                  <div className="spark-bar" style={{ height: '95%' }} />
                  <div className="spark-bar active" style={{ height: '96%' }} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── SECTION 10: PRODUCT UPDATES ── */}
      <section className="updates-section" id="updates">
        <div className="wrap">
          <div className="updates-layout">
            <div>
              <div className="section-eyebrow">
                <span className="section-eyebrow-dot" />
                <span>What's New</span>
              </div>
              <h2 className="section-title">Product Updates</h2>
              <p className="section-body">Recent releases, roadmap highlights, and upcoming modules — Sentinel ERP ships fast with enterprise-grade reliability.</p>
              <div className="mt-8">
                <a href="#" className="btn-outline inline-flex">View full roadmap →</a>
              </div>
            </div>

            <div className="changelog-feed">
              <article className="changelog-item" onMouseMove={handleMouseMove}>
                <div className="changelog-meta">
                  <span className="changelog-date">June 2026</span>
                  <span className="changelog-tag tag-new">New</span>
                </div>
                <div className="changelog-title">AI Copilot v2 — Natural Language Operations</div>
                <div className="changelog-desc">Ask the AI to run any ERP operation in plain English. Full support for report generation, approval actions, and anomaly alerts.</div>
              </article>
              <article className="changelog-item" onMouseMove={handleMouseMove}>
                <div className="changelog-meta">
                  <span className="changelog-date">May 2026</span>
                  <span className="changelog-tag tag-improve">Improved</span>
                </div>
                <div className="changelog-title">Advanced Workflow Builder with Conditional Logic</div>
                <div className="changelog-desc">New drag-and-drop builder with if/else branches, time delays, and cross-department routing rules.</div>
              </article>
              <article className="changelog-item" onMouseMove={handleMouseMove}>
                <div className="changelog-meta">
                  <span className="changelog-date">April 2026</span>
                  <span className="changelog-tag tag-new">New</span>
                </div>
                <div className="changelog-title">Predictive Inventory Forecasting Module</div>
                <div className="changelog-desc">ML-powered demand forecasting with automatic reorder alerts, supplier suggestions, and stockout prevention.</div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── SECTION 11: SUCCESS STORIES ── */}
      <section className="stories-section" id="stories">
        <div className="wrap">
          <div className="text-center mb-16">
            <div className="section-eyebrow justify-center">
              <span className="section-eyebrow-dot" />
              <span>Enterprise Success Stories</span>
            </div>
            <h2 className="section-title text-center max-w-xl mx-auto">Real results from real enterprises.</h2>
          </div>

          <div className="stories-grid">
            <article className="story-card" onMouseMove={handleMouseMove}>
              <div className="story-metric">72%</div>
              <div className="story-metric-label">Reduction in approval times</div>
              <p className="story-quote">"Sentinel ERP transformed our procurement process. What used to take 5 days now resolves in under 2 hours with automated routing."</p>
              <div className="story-author">
                <div className="story-avatar">R</div>
                <div>
                  <div className="story-name">Rajesh Mehta</div>
                  <div className="story-title">VP Operations · Tata Manufacturing</div>
                </div>
              </div>
            </article>

            <article className="story-card" onMouseMove={handleMouseMove}>
              <div className="story-metric">80%</div>
              <div className="story-metric-label">Operational workflows automated</div>
              <p className="story-quote">"We automated 80% of our repetitive HR and finance workflows in the first month. Our teams now focus on strategy, not paperwork."</p>
              <div className="story-author">
                <div className="story-avatar">P</div>
                <div>
                  <div className="story-name">Priya Nair</div>
                  <div className="story-title">CHRO · Apollo Healthcare Network</div>
                </div>
              </div>
            </article>

            <article className="story-card" onMouseMove={handleMouseMove}>
              <div className="story-metric">96%</div>
              <div className="story-metric-label">Inventory accuracy achieved</div>
              <p className="story-quote">"The AI forecasting module eliminated our stockout issues entirely. We went from 78% to 96% inventory accuracy in just two quarters."</p>
              <div className="story-author">
                <div className="story-avatar">K</div>
                <div>
                  <div className="story-name">Kavya Sharma</div>
                  <div className="story-title">Supply Chain Director · Reliance Retail</div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── SECTION 12: FINAL CTA ── */}
      <section className="cta-section" id="pricing-cta">
        <div className="cta-glow" aria-hidden="true" />
        <div className="wrap">
          <div className="cta-eyebrow">
            <span>✦</span>
            <span>Built for modern enterprises</span>
          </div>
          <h2 className="cta-title">
            Built for modern enterprises.<br />
            <em>Ready for tomorrow.</em>
          </h2>
          <p className="cta-sub">Deploy an intelligent ERP platform designed to scale with your business — from 50 to 50,000 employees.</p>
          <div className="cta-actions">
            <button onClick={() => setDemoModalOpen(true)} className="btn-primary lg cursor-pointer">Request Demo</button>
            <button onClick={() => navigate('/signup')} className="btn-outline lg cursor-pointer">Start Free Trial</button>
          </div>
          <p className="cta-note">14-day free trial · No credit card · Dedicated onboarding support</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer role="contentinfo">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="nav-logo">
                <div className="logo-mark" aria-hidden="true">
                  <svg viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="black" /></svg>
                </div>
                <span>Sentinel ERP</span>
              </Link>
              <p className="footer-tagline">AI-powered enterprise operations platform for modern organizations.</p>
              <div className="footer-social">
                <a href="#" className="social-icon">𝕏</a>
                <a href="#" className="social-icon">in</a>
                <a href="#" className="social-icon">⌥</a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Product</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">HRMS <span className="badge-new">New</span></a></li>
                <li><a href="#" className="footer-link">CRM</a></li>
                <li><a href="#" className="footer-link">Inventory</a></li>
                <li><a href="#" className="footer-link">Finance</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">About</a></li>
                <li><a href="#" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Blog</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Documentation</a></li>
                <li><a href="#" className="footer-link">API Reference</a></li>
                <li><a href="#" className="footer-link">Support</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Legal</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Privacy Policy</a></li>
                <li><a href="#" className="footer-link">Terms of Service</a></li>
                <li><a href="#" className="footer-link">SLA Uptime</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">© 2026 Sentinel ERP. All rights reserved.</p>
            <nav className="footer-legal">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Compliance</a>
            </nav>
          </div>
        </div>
      </footer>
      </div>

      {/* ── DEMO BOOKING MODAL (INTERACTIVE OVERLAY) ── */}
      <AnimatePresence>
        {demoModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDemoModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-6 animate-pulse-glow"
            >
              <button 
                onClick={() => setDemoModalOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <AnimatePresence mode="wait">
                {!demoSuccess ? (
                  <motion.div key="form" className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white tracking-tight">Request Enterprise Demo</h3>
                      <p className="text-xs text-white/50">Schedule a dedicated system walkthrough with a platform engineer.</p>
                    </div>

                    <form onSubmit={handleDemoSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">Full Name</label>
                        <input 
                          type="text" 
                          required 
                          value={demoName}
                          onChange={(e) => setDemoName(e.target.value)}
                          placeholder="e.g. Alexander Sterling"
                          className="w-full h-11 px-4 text-sm bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-1 focus:ring-white/10 outline-none text-white placeholder-white/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">Corporate Email</label>
                        <input 
                          type="email" 
                          required 
                          value={demoEmail}
                          onChange={(e) => setDemoEmail(e.target.value)}
                          placeholder="admin@company.com"
                          className="w-full h-11 px-4 text-sm bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-1 focus:ring-white/10 outline-none text-white placeholder-white/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">Organization Size</label>
                        <select 
                          value={demoSize}
                          onChange={(e) => setDemoSize(e.target.value)}
                          className="w-full h-11 px-4 text-sm bg-white/5 border border-white/10 rounded-xl outline-none text-white select-none appearance-none"
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="50-100">50 - 100 Employees</option>
                          <option value="100-500">100 - 500 Employees</option>
                          <option value="500-2000">500 - 2,000 Employees</option>
                          <option value="2000+">2,000+ Employees</option>
                        </select>
                      </div>

                      <button 
                        type="submit"
                        className="w-full h-12 mt-4 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Schedule Call</span>
                        <ArrowRight size={16} />
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-6 flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg shadow-white/10">
                      <Check size={24} strokeWidth={3} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white">Request Received</h4>
                      <p className="text-xs text-white/50 leading-relaxed max-w-[260px] mx-auto">
                        An onboarding director will reach out to <strong>{demoEmail}</strong> within 2 business hours.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. ENTERPRISE SIGN UP COMPONENT
   ═══════════════════════════════════════════════════════════ */
function SignupPage({ setUser }: { setUser: (user: UserSession | null) => void }) {
  const navigate = useNavigate();

  // Form states
  const [orgName, setOrgName] = useState('');
  const [industry, setIndustry] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });

  // Provisioning Simulation State: 'form' | 'loading'
  const [provisioningState, setProvisioningState] = useState<'form' | 'loading'>('form');
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Establishing secure cloud gateway...",
    "Provisioning isolated database tier...",
    "Deploying Entra ID credentials check...",
    "Injecting Enterprise Security Modules...",
    "Calibrating Neural Decision Engines...",
    "Activating AI-Native Operating System..."
  ];

  useEffect(() => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  const isPasswordValid = 
    passwordRequirements.length && 
    passwordRequirements.uppercase &&
    passwordRequirements.number && 
    passwordRequirements.special;

  const isFormValid = 
    orgName.trim() !== '' && 
    industry.trim() !== '' && 
    email.includes('@') && 
    isPasswordValid;

  const runProvisioning = (authUser: any) => {
    setProvisioningState('loading');
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setUser({
              uid: authUser.uid,
              email: authUser.email || email,
              displayName: authUser.displayName || email.split('@')[0],
              orgName: orgName || 'Acme Industries',
              industry: industry || 'Technology'
            });
            navigate('/dashboard-preview');
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const authUser = await registerWithEmail(email, password);
    if (authUser) {
      runProvisioning(authUser);
    }
  };

  const handleGoogleSSO = async () => {
    const authUser = await loginWithGoogle();
    if (authUser) {
      runProvisioning(authUser);
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-black selection:bg-white/30 p-2 lg:h-screen lg:overflow-hidden lg:p-4 transition-all duration-500">
      
      {/* LEFT COLUMN: Hero (Immersive Video) */}
      <section className="relative hidden lg:flex w-[52%] flex-col items-center justify-end pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full border border-white/5 select-none">
        
        {/* Absolute Background Video */}
        <video 
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* Hero Content Container */}
        <div className="z-10 w-full max-w-sm space-y-8 text-left">
          
          {/* Logo row */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center border border-white">
              <span className="text-black font-black text-xs">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SENTINEL ERP</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h2 className="text-3xl font-medium tracking-tight text-white leading-tight">
              The Intelligent Operating System For Modern Enterprises
            </h2>
            <p className="text-white/60 text-xs leading-relaxed">
              Sentinel ERP connects every department, process, and decision into one secure ecosystem. Replace fragmented tools with a unified enterprise platform built for operational excellence, intelligent automation, and real-time visibility.
            </p>
          </div>

          {/* Highlights checklist */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-semibold text-white/80">
            <div>✓ Unified Operations</div>
            <div>✓ Intelligent Workflow Automation</div>
            <div>✓ AI Business Intelligence</div>
            <div>✓ Enterprise Analytics</div>
            <div>✓ Real-Time Decision Support</div>
            <div>✓ Secure Role-Based Access</div>
          </div>

          {/* Steps calibration */}
          <div className="space-y-2.5">
            <StepItem number={1} text="Create Enterprise Workspace" active />
            <StepItem number={2} text="Configure Business Operations" />
            <StepItem number={3} text="Activate AI Intelligence Layer" />
          </div>

          {/* Statistics blocks */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              <div className="text-xl font-bold text-white">95%</div>
              <div className="text-[9px] text-white/50 font-semibold tracking-wider uppercase mt-0.5">Automation Efficiency</div>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <div className="text-xl font-bold text-white">80%</div>
              <div className="text-[9px] text-white/50 font-semibold tracking-wider uppercase mt-0.5">Manual Reductions</div>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <div className="text-xl font-bold text-white">24/7</div>
              <div className="text-[9px] text-white/50 font-semibold tracking-wider uppercase mt-0.5">AI Monitoring</div>
            </div>
          </div>

        </div>

        {/* Floating Badges */}
        <div className="absolute right-8 top-16 pointer-events-none select-none z-10 flex flex-col space-y-3">
          <div className="px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center space-x-1.5 text-[10px] font-bold text-white uppercase tracking-widest">
            <ShieldCheck size={12} className="text-neutral-400" />
            <span>Enterprise Ready</span>
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center space-x-1.5 text-[10px] font-bold text-white uppercase tracking-widest translate-x-2">
            <Cpu size={12} className="text-neutral-400" />
            <span>AI Native</span>
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center space-x-1.5 text-[10px] font-bold text-white uppercase tracking-widest">
            <Activity size={12} className="text-neutral-400" />
            <span>Real-Time Intelligence</span>
          </div>
        </div>

      </section>

      {/* RIGHT COLUMN: Signup Form Panel */}
      <section className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden bg-black">
        
        <AnimatePresence mode="wait">
          {provisioningState === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10 text-left"
            >
              
              {/* Header */}
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-3xl font-medium tracking-tight text-white">Launch Your Enterprise Workspace</h2>
                <p className="text-white/40 text-sm">Create your organization's intelligent operating system and gain access to unified operations.</p>
              </div>

              {/* SSOs */}
              <div className="grid grid-cols-2 gap-4">
                <SocialButton 
                  icon={
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                  }
                  label="Google Workspace"
                  onClick={handleGoogleSSO}
                />
                <SocialButton 
                  icon={
                    <svg viewBox="0 0 23 23" className="w-4 h-4 shrink-0" fill="currentColor">
                      <rect x="0" y="0" width="11" height="11" fill="#F25022" />
                      <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
                      <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
                      <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
                    </svg>
                  }
                  label="Microsoft Azure"
                  onClick={handleGoogleSSO}
                />
              </div>

              {/* Divider */}
              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-white/10" />
                <span className="flex-shrink mx-4 text-xs font-semibold text-white/40 uppercase tracking-widest text-center">
                  OR CONTINUE WITH ORGANIZATION DETAILS
                </span>
                <div className="flex-grow border-t border-white/10" />
              </div>

              {/* Form Layout */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup 
                    label="Organization Name"
                    placeholder="Acme Manufacturing Pvt. Ltd."
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    helperText="This becomes your primary Sentinel ERP workspace."
                  />
                  <InputGroup 
                    label="Industry"
                    placeholder="e.g. Manufacturing, Logistics..."
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    helperText="Used to personalize automation templates."
                  />
                </div>

                <InputGroup 
                  label="Business Email"
                  placeholder="admin@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  helperText="Primary administrator account for your organization."
                />

                <div className="space-y-1.5 relative text-left">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-white block">Create Secure Password</label>
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-white/40 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="relative flex items-center rounded-xl bg-brand-gray border border-white/5 transition-all duration-300">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a secure enterprise password"
                      required
                      className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-white/20 border-none outline-none h-11 focus:ring-2 focus:ring-white/20 rounded-xl"
                    />
                  </div>

                  {/* Password rules checkers */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-left">
                    <div className="flex items-center space-x-1.5 text-[9px] font-semibold tracking-wider">
                      <div className={`h-1.5 w-1.5 rounded-full ${passwordRequirements.length ? 'bg-white' : 'bg-white/10'}`}></div>
                      <span className={passwordRequirements.length ? 'text-white/70' : 'text-white/30'}>8+ symbols</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[9px] font-semibold tracking-wider">
                      <div className={`h-1.5 w-1.5 rounded-full ${passwordRequirements.uppercase ? 'bg-white' : 'bg-white/10'}`}></div>
                      <span className={passwordRequirements.uppercase ? 'text-white/70' : 'text-white/30'}>1 Uppercase</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[9px] font-semibold tracking-wider">
                      <div className={`h-1.5 w-1.5 rounded-full ${passwordRequirements.number ? 'bg-white' : 'bg-white/10'}`}></div>
                      <span className={passwordRequirements.number ? 'text-white/70' : 'text-white/30'}>1 Number</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[9px] font-semibold tracking-wider">
                      <div className={`h-1.5 w-1.5 rounded-full ${passwordRequirements.special ? 'bg-white' : 'bg-white/10'}`}></div>
                      <span className={passwordRequirements.special ? 'text-white/70' : 'text-white/30'}>1 Special</span>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full h-14 bg-white text-black font-semibold rounded-xl transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2 group mt-4 ${
                    isFormValid 
                      ? 'hover:bg-white/90 active:scale-[0.98] cursor-pointer' 
                      : 'opacity-20 cursor-not-allowed border border-white/10 bg-transparent text-white'
                  }`}
                >
                  <span>Create Enterprise Workspace</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Security Assurance list */}
              <div className="border-t border-white/5 pt-4 text-left">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2 text-center sm:text-left">
                  Enterprise Security Included
                </span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[10px] text-white/50 font-semibold tracking-wider">
                  <div>🛡️ Role-Based Access</div>
                  <div>🔑 End-to-End Encryption</div>
                  <div>🔐 Secure Authentication</div>
                  <div>🏢 Department Governance</div>
                  <div>📋 Audit Logs</div>
                  <div>📈 AI monitoring</div>
                </div>
              </div>

              {/* Sign In Footer */}
              <p className="text-center text-xs text-white/40">
                Already managing operations with Sentinel ERP?{' '}
                <button 
                  onClick={() => navigate('/login')} 
                  className="text-white hover:underline font-semibold cursor-pointer"
                >
                  Sign In To Workspace
                </button>
              </p>

              {/* Premium microcopy */}
              <p className="text-[10px] text-white/20 text-center leading-relaxed">
                By creating a workspace, you agree to Sentinel ERP Terms of Service, Privacy Policy, and Enterprise Security Standards.
              </p>

            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md mx-auto my-auto space-y-8 flex flex-col items-center text-center py-10"
            >
              {/* Spinner */}
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-ping opacity-25"></div>
                <div className="absolute inset-2 rounded-full border-2 border-white/10 animate-pulse opacity-50"></div>
                <div className="absolute inset-4 rounded-full border-t-2 border-r-2 border-transparent border-t-white border-r-white/50 animate-spin"></div>
                <div className="absolute inset-9 rounded-full bg-white flex items-center justify-center">
                  <Activity className="h-5 w-5 text-black animate-pulse" />
                </div>
              </div>

              <div className="space-y-4 w-full">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Initializing Platform Core</h3>
                  <p className="text-xs text-white/40">Configuring dedicated cloud environment</p>
                </div>

                {/* Stagger step console log */}
                <div className="bg-brand-gray border border-white/5 p-4 rounded-xl min-h-[96px] flex flex-col justify-center items-center">
                  <div className="text-xs font-mono text-white/90 flex items-center space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
                    <span>{loadingSteps[loadingStep]}</span>
                  </div>
                  
                  {/* Small progress meter */}
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-4 max-w-[200px]">
                    <motion.div 
                      className="bg-white h-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>

    </main>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. ENTERPRISE LOG IN COMPONENT
   ═══════════════════════════════════════════════════════════ */
function LoginPage({ setUser }: { setUser: (user: UserSession | null) => void }) {
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [provisioningState, setProvisioningState] = useState<'form' | 'loading'>('form');
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Establishing secure connection key...",
    "Querying tenant ledger registry...",
    "Authenticating credential matrix...",
    "Provisioning session encryption key...",
    "Syncing active company operations...",
    "Launching Command Center interface..."
  ];

  const isFormValid = email.includes('@') && password.length >= 6;

  const runProvisioning = (authUser: any) => {
    setProvisioningState('loading');
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setUser({
              uid: authUser.uid,
              email: authUser.email || email,
              displayName: authUser.displayName || email.split('@')[0],
              orgName: localStorage.getItem('last_org_name') || 'Acme Industries',
              industry: localStorage.getItem('last_industry') || 'Manufacturing'
            });
            navigate('/dashboard-preview');
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const authUser = await loginWithEmail(email, password);
    if (authUser) {
      runProvisioning(authUser);
    }
  };

  const handleGoogleSSO = async () => {
    const authUser = await loginWithGoogle();
    if (authUser) {
      runProvisioning(authUser);
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-black selection:bg-white/30 p-2 lg:h-screen lg:overflow-hidden lg:p-4 transition-all duration-500">
      
      {/* LEFT COLUMN: Hero (Immersive Video) */}
      <section className="relative hidden lg:flex w-[52%] flex-col items-center justify-end pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full border border-white/5 select-none">
        
        {/* Absolute Background Video */}
        <video 
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* Hero Content Container */}
        <div className="z-10 w-full max-w-sm space-y-8 text-left">
          
          {/* Logo row */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center border border-white">
              <span className="text-black font-black text-xs">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SENTINEL ERP</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h2 className="text-3xl font-medium tracking-tight text-white leading-tight">
              The Intelligent Operating System For Modern Enterprises
            </h2>
            <p className="text-white/60 text-xs leading-relaxed">
              Sentinel ERP connects every department, process, and decision into one secure ecosystem. Replace fragmented tools with a unified enterprise platform built for operational excellence, intelligent automation, and real-time visibility.
            </p>
          </div>

          {/* Highlights checklist */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-semibold text-white/80">
            <div>✓ Unified Operations</div>
            <div>✓ Intelligent Workflow Automation</div>
            <div>✓ AI Business Intelligence</div>
            <div>✓ Enterprise Analytics</div>
            <div>✓ Real-Time Decision Support</div>
            <div>✓ Secure Role-Based Access</div>
          </div>

          {/* Steps calibration */}
          <div className="space-y-2.5">
            <StepItem number={1} text="Verify Enterprise Identity" active />
            <StepItem number={2} text="Secure Ledger & Operations Framework" />
            <StepItem number={3} text="Launch Agentic AI Intelligence Core" />
          </div>

          {/* Statistics blocks */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              <div className="text-xl font-bold text-white">95%</div>
              <div className="text-[9px] text-white/50 font-semibold tracking-wider uppercase mt-0.5">Automation Efficiency</div>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <div className="text-xl font-bold text-white">80%</div>
              <div className="text-[9px] text-white/50 font-semibold tracking-wider uppercase mt-0.5">Manual Reductions</div>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <div className="text-xl font-bold text-white">24/7</div>
              <div className="text-[9px] text-white/50 font-semibold tracking-wider uppercase mt-0.5">AI Monitoring</div>
            </div>
          </div>

        </div>

        {/* Floating Badges */}
        <div className="absolute right-8 top-16 pointer-events-none select-none z-10 flex flex-col space-y-3">
          <div className="px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center space-x-1.5 text-[10px] font-bold text-white uppercase tracking-widest">
            <ShieldCheck size={12} className="text-neutral-400" />
            <span>Enterprise Ready</span>
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center space-x-1.5 text-[10px] font-bold text-white uppercase tracking-widest translate-x-2">
            <Cpu size={12} className="text-neutral-400" />
            <span>AI Native</span>
          </div>
        </div>

      </section>

      {/* RIGHT COLUMN: Login Form Panel */}
      <section className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden bg-black">
        
        <AnimatePresence mode="wait">
          {provisioningState === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10 text-left"
            >
              
              {/* Header */}
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-3xl font-medium tracking-tight text-white">Welcome Back</h2>
                <p className="text-white/40 text-sm">Access your Sentinel ERP workspace and continue managing operations, automation, analytics, and intelligence.</p>
              </div>

              {/* SSOs */}
              <div className="grid grid-cols-2 gap-4">
                <SocialButton 
                  icon={
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                  }
                  label="Google Workspace"
                  onClick={handleGoogleSSO}
                />
                <SocialButton 
                  icon={
                    <svg viewBox="0 0 23 23" className="w-4 h-4 shrink-0" fill="currentColor">
                      <rect x="0" y="0" width="11" height="11" fill="#F25022" />
                      <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
                      <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
                      <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
                    </svg>
                  }
                  label="Microsoft Azure"
                  onClick={handleGoogleSSO}
                />
              </div>

              {/* Divider */}
              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-white/10" />
                <span className="flex-shrink mx-4 text-xs font-semibold text-white/40 uppercase tracking-widest text-center">
                  OR CONTINUE WITH WORKSPACE CREDENTIALS
                </span>
                <div className="flex-grow border-t border-white/10" />
              </div>

              {/* Form Layout */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputGroup 
                  label="Business Email"
                  placeholder="admin@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  helperText="Enter your registered administrator email."
                />

                <div className="space-y-1.5 relative text-left">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-white block">Password</label>
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-white/40 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="relative flex items-center rounded-xl bg-brand-gray border border-white/5 transition-all duration-300">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your secure password"
                      required
                      className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-white/20 border-none outline-none h-11 focus:ring-2 focus:ring-white/20 rounded-xl"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full h-14 bg-white text-black font-semibold rounded-xl transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2 mt-6 ${
                    isFormValid 
                      ? 'hover:bg-white/90 active:scale-[0.98] cursor-pointer' 
                      : 'opacity-20 cursor-not-allowed border border-white/10 bg-transparent text-white'
                  }`}
                >
                  <span>Access Workspace</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Sign In Footer */}
              <p className="text-center text-xs text-white/40">
                Don't have an enterprise workspace?{' '}
                <button 
                  onClick={() => navigate('/signup')} 
                  className="text-white hover:underline font-semibold cursor-pointer"
                >
                  Create One
                </button>
              </p>

              {/* Premium microcopy */}
              <p className="text-[10px] text-white/20 text-center leading-relaxed">
                By logging in, you agree to Sentinel ERP Terms of Service, Privacy Policy, and Enterprise Security Standards.
              </p>

            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md mx-auto my-auto space-y-8 flex flex-col items-center text-center py-10"
            >
              {/* Spinner */}
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-ping opacity-25"></div>
                <div className="absolute inset-2 rounded-full border-2 border-white/10 animate-pulse opacity-50"></div>
                <div className="absolute inset-4 rounded-full border-t-2 border-r-2 border-transparent border-t-white border-r-white/50 animate-spin"></div>
                <div className="absolute inset-9 rounded-full bg-white flex items-center justify-center">
                  <Activity className="h-5 w-5 text-black animate-pulse" />
                </div>
              </div>

              <div className="space-y-4 w-full">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Opening Workspace Node</h3>
                  <p className="text-xs text-white/40">Verifying security certificates</p>
                </div>

                {/* Stagger step console log */}
                <div className="bg-brand-gray border border-white/5 p-4 rounded-xl min-h-[96px] flex flex-col justify-center items-center">
                  <div className="text-xs font-mono text-white/90 flex items-center space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
                    <span>{loadingSteps[loadingStep]}</span>
                  </div>
                  
                  {/* Small progress meter */}
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-4 max-w-[200px]">
                    <motion.div 
                      className="bg-white h-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>

    </main>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. INTERACTIVE DASHBOARD PREVIEW
   ═══════════════════════════════════════════════════════════ */
function DashboardPreview({ user, setUser }: AnimatedRoutesProps) {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<'kpi' | 'hr' | 'finance' | 'copilot'>('kpi');
  
  // Simulated Chatbot inside dashboard
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Sentinel AI Core initialized. Enter natural language instructions to configure workflows or query the ledger.' }
  ]);
  const [chatTyping, setChatTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatTyping) return;

    const query = chatInput.trim();
    setChatHistory(prev => [...prev, { sender: 'user', text: query }]);
    setChatInput('');
    setChatTyping(true);

    setTimeout(() => {
      setChatTyping(false);
      let reply = '';
      if (query.toLowerCase().includes('approval')) {
        reply = 'Loaded 4 open approval sequences. CFO authorization pending for Purchase Order SN-PO-991 (₹4,20,000). Would you like me to trigger an automated SLA reminder?';
      } else if (query.toLowerCase().includes('revenue') || query.toLowerCase().includes('finance')) {
        reply = 'May Revenue totaled ₹4.2Cr, yielding a profit margin of 28.6%. Revenue forecast for June stands at ₹4.55Cr with a 92% confidence index.';
      } else if (query.toLowerCase().includes('employee') || query.toLowerCase().includes('hr')) {
        reply = 'Total active headcount is 1,284. Average workforce utilization rate matches 91.3%. No anomalies found in the May payroll ledger.';
      } else {
        reply = `Command received. Querying corporate database for "${query}"... Operations status matches optimal parameters. Ledgers are aligned.`;
      }
      setChatHistory(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 1200);
  };

  const handleSignOut = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden select-none border border-white/10 rounded-2xl">
      
      {/* Sidebar navigation */}
      <aside className="w-64 border-r border-white/8 bg-neutral-950 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-2.5 cursor-pointer px-2"
          >
            <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
              <span className="text-black font-extrabold text-xs">S</span>
            </div>
            <span className="font-bold tracking-tight text-white text-md">SENTINEL ERP</span>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setCurrentTab('kpi')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                currentTab === 'kpi' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass size={14} />
              <span>Command Center</span>
            </button>
            <button 
              onClick={() => setCurrentTab('hr')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                currentTab === 'hr' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={14} />
              <span>HRMS Operations</span>
            </button>
            <button 
              onClick={() => setCurrentTab('finance')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                currentTab === 'finance' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <LineChart size={14} />
              <span>Finance Ledgers</span>
            </button>
            <button 
              onClick={() => setCurrentTab('copilot')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                currentTab === 'copilot' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu size={14} />
              <span>AI Copilot Chat</span>
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1 text-left">
            <div className="flex items-center space-x-2 text-[10px] text-white/50 font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
              <span>Active Operator</span>
            </div>
            <div className="text-[11px] font-semibold text-white/90 overflow-hidden text-ellipsis">{user?.displayName || 'Administrator'}</div>
            <div className="text-[9px] font-mono text-white/40 overflow-hidden text-ellipsis">{user?.email}</div>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1 text-left">
            <div className="flex items-center space-x-2 text-[10px] text-white/50 font-bold uppercase tracking-wider">
              <span>Workspace Node</span>
            </div>
            <div className="text-[11px] font-mono text-white/70 overflow-hidden text-ellipsis">
              {user?.orgName ? user.orgName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.sentinel.io' : 'acme.sentinel.io'}
            </div>
          </div>

          <button 
            onClick={handleSignOut} 
            className="w-full py-2.5 border border-white/10 hover:border-white/20 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition-all cursor-pointer text-center block"
          >
            Exit Workspace
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col overflow-hidden bg-neutral-900/40 text-left">
        
        {/* Top Header */}
        <header className="h-14 border-b border-white/8 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 text-left">
            <h1 className="text-sm font-bold tracking-tight text-white uppercase text-left">
              {currentTab === 'kpi' && 'Command Center Overview'}
              {currentTab === 'hr' && 'Human Resource Management System'}
              {currentTab === 'finance' && 'Corporate Financial Ledgers'}
              {currentTab === 'copilot' && 'Sentinel Agentic AI Core'}
            </h1>
            <span className="h-4 w-px bg-white/10" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
              Secure Session Active
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs font-medium text-white/80">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
            <span>OS VERSION 7.1.0</span>
          </div>
        </header>

        {/* Dynamic Inner Dashboard Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: GENERAL OVERVIEW */}
            {currentTab === 'kpi' && (
              <motion.div
                key="kpi"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-5 bg-black/40 border border-white/8 rounded-xl space-y-2">
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Corporate Revenue (Q2 MTD)</div>
                    <div className="text-2xl font-bold tracking-tight">₹4.20 Cr</div>
                    <div className="text-[10px] text-white/60">↑ 18.4% compared to Q1</div>
                  </div>
                  <div className="p-5 bg-black/40 border border-white/8 rounded-xl space-y-2">
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Active Workspace Staff</div>
                    <div className="text-2xl font-bold tracking-tight">1,284</div>
                    <div className="text-[10px] text-white/60">✓ 91.3% utilization rate</div>
                  </div>
                  <div className="p-5 bg-black/40 border border-white/8 rounded-xl space-y-2">
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Unassigned Approvals</div>
                    <div className="text-2xl font-bold tracking-tight">47</div>
                    <div className="text-[10px] text-white/60">⚠️ CFO escalations active</div>
                  </div>
                  <div className="p-5 bg-black/40 border border-white/8 rounded-xl space-y-2">
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Inventory Accuracy</div>
                    <div className="text-2xl font-bold tracking-tight">96.2%</div>
                    <div className="text-[10px] text-white/60">✓ Optimum reorder trigger</div>
                  </div>
                </div>

                {/* Operations grid panels */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Left checklist panel */}
                  <div className="col-span-2 p-5 bg-black/40 border border-white/8 rounded-2xl space-y-4 text-left">
                    <div className="flex justify-between items-center text-left">
                      <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Active Operations Queue</span>
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-white/10 text-white rounded border border-white/10 uppercase text-center">Ledger Sync</span>
                    </div>

                    <div className="space-y-3 text-left">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                          <div className="text-left">
                            <div className="text-xs font-semibold text-left">Purchase Order approval — Office Equipment</div>
                            <div className="text-[10px] text-white/40 text-left">Procurement · ₹3,20,000 · Pending Manager Approval</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 text-[9px] font-semibold bg-white/5 border border-white/5 rounded-full text-white/50 text-center">CFO Review</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="h-2 w-2 rounded-full bg-white" />
                          <div className="text-left">
                            <div className="text-xs font-semibold text-left">Asset Assignment — Developer Laptop #1092</div>
                            <div className="text-[10px] text-white/40 text-left">IT Assets · Assigned to Jane Doe · Provisioned</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 text-[9px] font-semibold bg-white/10 border border-white/10 rounded-full text-white text-center">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="h-2 w-2 rounded-full bg-white" />
                          <div className="text-left">
                            <div className="text-xs font-semibold text-left">Leave approval request — Alex Sterling</div>
                            <div className="text-[10px] text-white/40 text-left">HRMS · Annual Leave · Approved by Dept Head</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 text-[9px] font-semibold bg-white/10 border border-white/10 rounded-full text-white text-center">Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Right quick stats panel */}
                  <div className="p-5 bg-black/40 border border-white/8 rounded-2xl space-y-4">
                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest block text-left">AI-Powered Forecasting</span>
                    <div className="space-y-3 text-left">
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-[11px] font-semibold text-left">
                          <span>Inventory Shortage Risk</span>
                          <span className="text-white">14% (SKU-1092)</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-white h-full" style={{ width: '14%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-[11px] font-semibold text-left">
                          <span>Workflow Automation Rate</span>
                          <span className="text-white">84%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-white h-full" style={{ width: '84%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-[11px] font-semibold text-left">
                          <span>Ledger Audit Synchronization</span>
                          <span className="text-white">100%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-white h-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: HRMS */}
            {currentTab === 'hr' && (
              <motion.div
                key="hr"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-5 bg-black/40 border border-white/8 rounded-xl text-left">
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider text-left">Total Headcount</div>
                    <div className="text-2xl font-bold mt-1 text-left">1,284</div>
                  </div>
                  <div className="p-5 bg-black/40 border border-white/8 rounded-xl text-left">
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider text-left">May Utilisation Rate</div>
                    <div className="text-2xl font-bold mt-1 text-left">91.3%</div>
                  </div>
                  <div className="p-5 bg-black/40 border border-white/8 rounded-xl text-left">
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider text-left">Hires This Month</div>
                    <div className="text-2xl font-bold mt-1 text-left">12</div>
                  </div>
                </div>

                <div className="p-5 bg-black/40 border border-white/8 rounded-2xl space-y-4 text-left">
                  <span className="text-xs font-bold text-white/50 uppercase tracking-widest block text-left">Workforce Distribution</span>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2 text-left">
                      <span className="text-white/60">Operations</span>
                      <span className="font-bold text-right">428 Staff</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2 text-left">
                      <span className="text-white/60">Engineering</span>
                      <span className="font-bold text-right">310 Staff</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2 text-left">
                      <span className="text-white/60">Sales &amp; Marketing</span>
                      <span className="font-bold text-right">295 Staff</span>
                    </div>
                    <div className="flex justify-between text-xs pb-2 text-left">
                      <span className="text-white/60">Finance &amp; HR</span>
                      <span className="font-bold text-right">251 Staff</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: FINANCE */}
            {currentTab === 'finance' && (
              <motion.div
                key="finance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-black/40 border border-white/8 rounded-xl text-left">
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider text-left">Gross Operating Profit</div>
                    <div className="text-2xl font-bold mt-1 text-left">₹1.72 Cr</div>
                    <p className="text-[10px] text-white/50 mt-1 text-left">44.7% margin on ₹3.82Cr May billings</p>
                  </div>
                  <div className="p-5 bg-black/40 border border-white/8 rounded-xl text-left">
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider text-left">CFO Ledger Balance</div>
                    <div className="text-2xl font-bold mt-1 text-left">₹18.42 Cr</div>
                    <p className="text-[10px] text-white/50 mt-1 text-left">SOC 2 compliant isolated bank sync</p>
                  </div>
                </div>

                <div className="p-5 bg-black/40 border border-white/8 rounded-2xl space-y-4 text-left">
                  <span className="text-xs font-bold text-white/50 uppercase tracking-widest block text-left">Recent Finance Actions</span>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center text-xs p-2 bg-white/5 rounded border border-white/5 text-left">
                      <span>Payroll Disbursed — May</span>
                      <span className="font-mono text-white/60 text-right">₹1,12,04,200</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2 bg-white/5 rounded border border-white/5 text-left">
                      <span>Vendor Invoices Settled (Tata Mfg)</span>
                      <span className="font-mono text-white/60 text-right">₹24,80,000</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2 bg-white/5 rounded border border-white/5 text-left">
                      <span>CFO Approved Expense Claim — Sales Q2</span>
                      <span className="font-mono text-white/60 text-right">₹8,45,000</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: AI CHAT DIRECT */}
            {currentTab === 'copilot' && (
              <motion.div
                key="copilot"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-[480px] bg-black/40 border border-white/8 rounded-2xl overflow-hidden text-left"
              >
                {/* Chat history */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.sender === 'user' ? 'bg-white/10 text-white' : 'bg-white/5 border border-white/5 text-white/90'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatTyping && (
                    <div className="flex justify-start">
                      <div className="ai-typing-indicator px-2">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input box */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/8 bg-neutral-950 flex items-center gap-2">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type instructions (e.g. 'Show pending approvals', 'Analyze revenue')..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none text-white focus:border-white/20 focus:ring-1 focus:ring-white/10"
                  />
                  <button 
                    type="submit"
                    className="h-9 px-4 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Send</span>
                    <ArrowRight size={12} />
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. ATOM / BASE COMPONENT DECLARATIONS
   ═══════════════════════════════════════════════════════════ */

interface StepItemProps {
  number: number;
  text: string;
  active?: boolean;
}

function StepItem({ number, text, active = false }: StepItemProps) {
  return (
    <div className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all duration-300 ${
      active 
        ? 'bg-white text-black border-white shadow-lg shadow-white/5' 
        : 'bg-brand-gray text-white border-transparent'
    }`}>
      <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
        active ? 'bg-black text-white' : 'bg-white/10 text-white/40'
      }`}>
        {number}
      </div>
      <span className="text-xs font-semibold tracking-tight leading-none text-left">{text}</span>
    </div>
  );
}

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function SocialButton({ icon, label, onClick }: SocialButtonProps) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2.5 bg-black border border-white/10 rounded-xl h-11 px-4 text-xs font-semibold text-white/80 hover:bg-white/5 hover:text-white transition-all duration-200 active:scale-[0.98] cursor-pointer"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

interface InputGroupProps {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
}

function InputGroup({ label, placeholder, type, value, onChange, helperText }: InputGroupProps) {
  return (
    <div className="space-y-1 text-left w-full">
      <label className="text-sm font-medium text-white block">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full bg-brand-gray border border-white/5 rounded-xl h-11 px-4 text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 outline-none transition-all duration-200"
      />
      {helperText && <p className="text-[10px] text-white/30 leading-normal mt-0.5 text-left">{helperText}</p>}
    </div>
  );
}
