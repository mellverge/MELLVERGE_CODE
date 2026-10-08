import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Command,
  CreditCard,
  FileText,
  FolderKanban,
  Home,
  LayoutGrid,
  ListChecks,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

type PublicRoute = 'home' | 'features' | 'pricing' | 'about' | 'contact' | 'privacy' | 'terms' | 'security' | 'login' | 'signup' | 'onboarding';
type AppRoute = 'dashboard' | 'meetings' | 'tasks' | 'follow-ups' | 'calendar' | 'team' | 'assistant' | 'memory' | 'settings' | 'billing';
type Route = PublicRoute | AppRoute;

let goTo: (route: Route) => void = () => undefined;

const productFeatures = [
  { icon: MessageSquareText, title: 'AI Meeting Assistant', body: 'Turn meetings into clear summaries, decisions and action items while the conversation is still fresh.' },
  { icon: ListChecks, title: 'Automatic Action Items', body: 'Know what needs to happen, who owns it and when it is due without writing another follow-up note.' },
  { icon: FolderKanban, title: 'Smart Tasks', body: 'Give every piece of work a priority, owner, deadline and clear next step.' },
  { icon: Bell, title: 'Intelligent Reminders', body: 'Keep important commitments visible until the right person has moved them forward.' },
  { icon: Users, title: 'Follow-Up Manager', body: 'Track who needs to be contacted, why it matters and when to reach out.' },
  { icon: CalendarDays, title: 'Calendar Management', body: 'Make meetings easier to prepare for and understand what is coming next.' },
  { icon: ShieldCheck, title: 'Business Memory', body: 'Keep important decisions, clients, people and context close at hand.' },
  { icon: Sparkles, title: 'AI Business Assistant', body: 'Ask useful questions about today, this week, your clients and your commitments.' },
  { icon: LayoutGrid, title: 'Operations Dashboard', body: 'Give owners one calm, clear view of what is happening across the business.' },
];

const plans = [
  { name: 'Starter', monthly: 19, description: 'For small businesses getting organised.', features: ['AI meeting summaries', 'Meeting organisation', 'Tasks', 'Reminders', 'Basic AI assistant', 'Core operations dashboard'] },
  { name: 'Growth', monthly: 59, description: 'For growing businesses ready to automate more.', featured: true, features: ['Everything in Starter', 'Unlimited meetings', 'Automatic action items', 'Follow-up management', 'Team task management', 'Business memory', 'Calendar integration', 'Email integration'] },
  { name: 'Pro', monthly: 129, description: 'For businesses ready to automate more of their operations.', features: ['Everything in Growth', 'Advanced AI automation', 'Advanced follow-ups', 'CRM integrations', 'Advanced business memory', 'Workflow automation', 'Team analytics'] },
  { name: 'Plus', monthly: 199, description: 'For businesses that want Marlow managing more of their operations.', features: ['Everything in Pro', 'Advanced autonomous workflows', 'Multiple teams', 'Advanced reporting', 'Custom workflows', 'Full operations dashboard', 'Priority support'] },
];

const navItems: { route: AppRoute; label: string; icon: typeof Home }[] = [
  { route: 'dashboard', label: 'Dashboard', icon: Home },
  { route: 'meetings', label: 'Meetings', icon: MessageSquareText },
  { route: 'tasks', label: 'Tasks', icon: ListChecks },
  { route: 'follow-ups', label: 'Follow-ups', icon: Users },
  { route: 'calendar', label: 'Calendar', icon: CalendarDays },
  { route: 'team', label: 'Team', icon: Users },
  { route: 'assistant', label: 'AI Assistant', icon: Sparkles },
  { route: 'memory', label: 'Business Memory', icon: ShieldCheck },
];

function Logo({ light = false }: { light?: boolean }) {
  return <button className={`brand ${light ? 'brand-light' : ''}`} onClick={() => goTo('home')} aria-label="Marlow home"><span className="brand-image-wrap"><img src="/IMG_1451.png" alt="" /></span><span>Marlow</span></button>;
}

function App() {
  const [route, setRoute] = useState<Route>(() => readRoute());
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cookieState, setCookieState] = useState<'hidden' | 'banner' | 'manage'>('hidden');
  const [marketingCookies, setMarketingCookies] = useState(false);
  const [analyticsCookies, setAnalyticsCookies] = useState(true);

  goTo = (next: Route) => {
    setRoute(next);
    setMobileMenu(false);
    window.history.pushState({}, '', `#/${next}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPopState = () => setRoute(readRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Show cookie banner after 5 seconds if not handled yet
  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = localStorage.getItem('marlow_cookie_consent');
      if (!stored) {
        setCookieState('banner');
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('marlow_cookie_consent', 'accepted_all');
    setCookieState('hidden');
  };

  const handleRejectAll = () => {
    localStorage.setItem('marlow_cookie_consent', 'rejected_all');
    setCookieState('hidden');
  };

  const handleSavePreferences = () => {
    localStorage.setItem('marlow_cookie_consent', 'custom');
    setCookieState('hidden');
  };

  return (
    <div className="site-shell">
      {isAppRoute(route) ? <AppShell route={route} /> : route === 'login' || route === 'signup' ? <AuthPage mode={route} /> : route === 'onboarding' ? <Onboarding /> : <Marketing route={route} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />}
      
      {/* Cookie Banner */}
      {cookieState === 'banner' && (
        <div className="cookie-banner">
          <div className="cookie-content">
            <p>By clicking <strong>Accept all cookies</strong>, you allow Marlow to store cookies on your device to optimize site performance, analyze usage trends, and tailor our marketing outreach. You can customize your preferences anytime by choosing <u>Manage cookies</u>.</p>
          </div>
          <div className="cookie-actions">
            <button className="button button-light cookie-btn" onClick={handleAcceptAll}>Accept all cookies</button>
            <button className="button button-light cookie-btn" onClick={handleRejectAll}>Reject All</button>
            <button className="cookie-manage-link" onClick={() => setCookieState('manage')}>Manage cookies</button>
          </div>
        </div>
      )}

      {/* Cookie Management Modal */}
      {cookieState === 'manage' && (
        <div className="cookie-modal-backdrop">
          <div className="cookie-modal">
            <div className="cookie-modal-header">
              <h3>Cookies settings</h3>
              <button onClick={() => setCookieState('banner')}><X size={18} /></button>
            </div>
            <p className="cookie-modal-desc">When you visit Marlow, we may store or retrieve information on your browser through cookies. This helps the site operate as expected, remember your preferences, and deliver a personalized experience. You can toggle specific categories below.</p>
            
            <div className="cookie-category-list">
              <div className="cookie-category-row">
                <span><b>Marketing cookies</b><small>Used to deliver relevant ads and measure campaigns.</small></span>
                <button className={`toggle ${marketingCookies ? 'on' : ''}`} onClick={() => setMarketingCookies(!marketingCookies)}><span /></button>
              </div>
              <div className="cookie-category-row">
                <span><b>Analytics / performance cookies</b><small>Helps us understand how visitors interact with our site.</small></span>
                <button className={`toggle ${analyticsCookies ? 'on' : ''}`} onClick={() => setAnalyticsCookies(!analyticsCookies)}><span /></button>
              </div>
              <div className="cookie-category-row">
                <span><b>Essential cookies</b><small>Required for core website security, network management, and accessibility.</small></span>
                <span className="always-active">Always active</span>
              </div>
            </div>

            <div className="cookie-modal-actions">
              <button className="button button-outline" onClick={handleRejectAll}>Reject All</button>
              <button className="button button-dark" onClick={handleSavePreferences}>Confirm my choices</button>
            </div>
            <div className="cookie-modal-footer">
              <span>Powered by <strong>Marlow Privacy</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function readRoute(): Route {
  const value = window.location.hash.replace('#/', '') as Route;
  return value || 'home';
}

function isAppRoute(route: Route): route is AppRoute {
  return ['dashboard', 'meetings', 'tasks', 'follow-ups', 'calendar', 'team', 'assistant', 'memory', 'settings', 'billing'].includes(route);
}

function Marketing({ route, mobileMenu, setMobileMenu }: { route: PublicRoute; mobileMenu: boolean; setMobileMenu: (open: boolean) => void }) {
  return <div className="site-shell"><header className="site-header"><Logo /><nav className="desktop-nav"><button onClick={() => scrollHomeSection('solutions')}>Solutions</button><button onClick={() => goTo('pricing')}>Pricing</button><button onClick={() => scrollHomeSection('how-it-works')}>How it works</button><button onClick={() => scrollHomeSection('faq')}>FAQ</button></nav><div className="header-actions"><button className="login-link" onClick={() => goTo('login')}>Log in</button><button className="button button-dark header-cta" onClick={() => scrollHomeSection('audit')}>Book Free Audit <ArrowRight size={15} /></button><button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Open navigation">{mobileMenu ? <X size={20} /> : <Menu size={20} />}</button></div></header>{mobileMenu && <nav className="mobile-nav"><button onClick={() => scrollHomeSection('solutions')}>Solutions</button><button onClick={() => goTo('pricing')}>Pricing</button><button onClick={() => scrollHomeSection('how-it-works')}>How it works</button><button onClick={() => scrollHomeSection('faq')}>FAQ</button><button onClick={() => goTo('login')}>Log in</button><button className="button button-dark" onClick={() => scrollHomeSection('audit')}>Book Free Audit <ArrowRight size={15} /></button></nav>}{route === 'features' ? <FeaturesPage /> : route === 'pricing' ? <PricingPage /> : route === 'about' ? <AboutPage /> : route === 'contact' ? <ContactPage /> : route === 'security' ? <SecurityPage /> : route === 'privacy' ? <PrivacyPage /> : route === 'terms' ? <TermsPage /> : <HomePage />}<MarketingFooter /></div>;
}

function scrollHomeSection(id: string) {
  if (readRoute() !== 'home') goTo('home');
  window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 0);
}

function HomePage() {
  return <main className="conversion-home"><section className="conversion-hero section-pad"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" /> AI operations for small business</div><h1>Your business shouldn’t depend on you doing <em>everything manually.</em></h1><p className="hero-text">Marlow builds practical AI systems that capture enquiries, qualify leads, automate follow-ups and remove repetitive admin — so your business can run faster without adding more hours to your day.</p><div className="hero-buttons"><button className="button button-dark" onClick={() => scrollHomeSection('audit')}>Book a Free AI Operations Audit <ArrowRight size={16} /></button><button className="text-button" onClick={() => scrollHomeSection('solutions')}>See What We Automate <ChevronRight size={16} /></button></div><div className="trust-statement"><span>Built for UK small businesses</span><span>Practical automation</span><span>Human oversight</span></div></div><OperationsSignal /></section><section className="problem-strip section-pad"><span className="problem-strip-label">The cost of manual work</span><div><strong>Slow replies become lost opportunities.</strong><span>Unanswered enquiries. Missed calls. Follow-ups that depend on memory.</span></div></section><section id="problem" className="problem-section section-pad"><div className="section-kicker">The operations gap</div><div className="problem-content"><h2>Most small businesses don’t have a lead problem.<br /><em>They have an operations problem.</em></h2><p>When every enquiry, reply, appointment and update relies on the owner, growth starts to feel like more admin. Marlow takes the repetitive work out of the path between interest and action.</p><div className="problem-list"><span>Enquiries sitting unanswered</span><span>Missed calls becoming lost customers</span><span>Leads not being followed up</span><span>Repetitive questions consuming time</span><span>Manual data entry between systems</span><span>Owners becoming the bottleneck</span></div></div></section><OperationsEngine /><ServicesSection /><BeforeAfter /><ProcessSection /><section className="human-section section-pad"><div><div className="section-kicker">Practical by design</div><h2>Automate the work.<br /><em>Keep the human judgement.</em></h2><p>Marlow focuses on repetitive, predictable processes while keeping important customer and business decisions under your control.</p></div><div className="benefit-grid"><Benefit title="Save time" body="Remove repetitive work from the team’s day." /><Benefit title="Respond faster" body="Make sure potential customers aren’t waiting hours for a reply." /><Benefit title="Scale operations" body="Handle more enquiries without automatically increasing admin workload." /></div></section><TrustSection /><AuditSection /><FaqSection /><section className="final-cta"><div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> A clearer way to operate</div><h2>Stop being the bottleneck<br />in your own <em>business.</em></h2><p>Let’s identify the repetitive work, missed opportunities and manual processes that AI can take off your plate.</p><button className="button button-light" onClick={() => scrollHomeSection('audit')}>Book a Free AI Operations Audit <ArrowRight size={16} /></button></section><button className="mobile-sticky-cta" onClick={() => scrollHomeSection('audit')}>Book Free Audit <ArrowRight size={15} /></button></main>;
}

function OperationsSignal() {
  return <div className="operations-signal"><div className="signal-top"><span><i /> Live operations view</span><span>Today / 09:42</span></div><div className="signal-heading"><div><span className="mini-label">Marlow engine</span><h3>Good morning, Northstar.</h3></div><span className="signal-status">Running <Check size={12} /></span></div><div className="signal-flow"><div><span className="signal-icon"><MessageSquareText size={16} /></span><b>New enquiry</b><small>Website form · 2m ago</small></div><ArrowRight size={16} /><div><span className="signal-icon signal-lime"><Sparkles size={16} /></span><b>Qualified</b><small>Budget and timing captured</small></div><ArrowRight size={16} /><div><span className="signal-icon"><Bell size={16} /></span><b>Follow-up</b><small>Owner notified · 10:00</small></div></div><div className="signal-footer"><span>5 workflows active</span><span>2 opportunities routed</span><span>0 missed follow-ups</span></div></div>;
}

function OperationsEngine() {
  const stages = [['01', 'Capture', 'Website enquiries, forms, calls and messages enter the system.'], ['02', 'Qualify', 'AI identifies serious opportunities and gathers the important information.'], ['03', 'Respond', 'The customer receives a fast, useful response.'], ['04', 'Follow up', 'The system keeps conversations moving without the owner remembering everything.'], ['05', 'Convert', 'Qualified opportunities are routed toward booking, sales or the right next step.']];
  return <section id="solutions" className="engine-section section-pad"><div className="section-intro"><div><div className="section-kicker">The AI operations engine</div><h2>From first signal<br /><em>to next step.</em></h2></div><p>One connected flow for the work that keeps your business moving.</p></div><div className="engine-flow">{stages.map(([number, title, body], index) => <div className="engine-stage" key={title}><span className="engine-number">{number}</span><div className="engine-stage-icon"><span>{index === 0 ? <MessageSquareText size={17} /> : index === 1 ? <Sparkles size={17} /> : index === 2 ? <ArrowRight size={17} /> : index === 3 ? <Bell size={17} /> : <Check size={17} />}</span></div><h3>{title}</h3><p>{body}</p>{index < stages.length - 1 && <span className="engine-connector" />}</div>)}</div></section>;
}

const serviceItems = [{ number: '01', title: 'AI Lead Capture', body: 'Capture enquiries from websites and other channels and make sure opportunities don’t disappear into an inbox.', details: ['Smart enquiry forms', 'AI qualification', 'Instant responses', 'Lead routing', 'CRM updates'] }, { number: '02', title: 'AI Follow-Up', body: 'Automatically keep suitable prospects moving through the pipeline without relying on memory.', details: ['Follow-up sequences', 'Lead status tracking', 'Personalised responses', 'Reminder workflows', 'Reactivation of old enquiries'] }, { number: '03', title: 'AI Admin Automation', body: 'Remove repetitive tasks from everyday operations so the team can focus on customers and growth.', details: ['Data entry', 'Document processing', 'Email workflows', 'CRM updates', 'Internal notifications', 'Repetitive reporting'] }, { number: '04', title: 'AI Customer Operations', body: 'Handle repetitive customer interactions faster while giving people a clear path to human help.', details: ['FAQ automation', 'Enquiry handling', 'Appointment workflows', 'Customer information collection', 'Human handoff when needed'] }];

function ServicesSection() {
  const [open, setOpen] = useState(0);
  return <section id="services" className="services-section section-pad"><div className="section-intro"><div><div className="section-kicker">What we automate</div><h2>Practical systems.<br /><em>Clear outcomes.</em></h2></div><p>Start with the bottleneck that is costing your business the most time or opportunity.</p></div><div className="service-grid">{serviceItems.map((service, index) => <article className={`service-card ${open === index ? 'open' : ''}`} key={service.title}><button className="service-trigger" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span className="service-number">{service.number}</span><span><h3>{service.title}</h3><p>{service.body}</p></span><ChevronDown size={17} /></button>{open === index && <div className="service-details"><span>How it works</span>{service.details.map((detail) => <div key={detail}><Check size={14} />{detail}</div>)}</div>}</article>)}</div><button className="button button-dark section-cta" onClick={() => scrollHomeSection('audit')}>Book a Free AI Operations Audit <ArrowRight size={16} /></button></section>;
}

function BeforeAfter() {
  const before = ['New enquiry', 'Inbox', 'Owner notices it later', 'Manual reply', 'Maybe follow up', 'Lead gets forgotten'];
  const after = ['New enquiry', 'AI captures it', 'AI qualifies it', 'Instant response', 'CRM updated', 'Follow-up triggered', 'Qualified opportunity reaches the owner'];
  return <section className="before-after section-pad"><div className="section-kicker">The difference in practice</div><h2>Less chasing.<br /><em>More conversations.</em></h2><div className="comparison-grid"><Comparison title="Before Marlow" items={before} muted /><Comparison title="After Marlow" items={after} /></div><button className="text-button" onClick={() => scrollHomeSection('audit')}>See what your business could automate <ArrowRight size={16} /></button></section>;
}

function Comparison({ title, items, muted = false }: { title: string; items: string[]; muted?: boolean }) { return <div className={`comparison-card ${muted ? 'muted' : 'active'}`}><div className="comparison-title"><span>{muted ? '01' : '02'}</span><b>{title}</b></div><div className="comparison-flow">{items.map((item, index) => <div key={item}><span className="comparison-node">{index + 1}</span><span>{item}</span>{index < items.length - 1 && <i />}</div>)}</div></div>; }

function ProcessSection() {
  const steps = [['01', 'Audit', 'We identify where your business is losing time, leads and opportunities.'], ['02', 'Build', 'We design the automation around your existing workflow.'], ['03', 'Connect', 'We connect the relevant tools and systems.'], ['04', 'Optimise', 'We monitor the workflow and improve it over time.']];
  return <section id="how-it-works" className="process-section section-pad"><div className="section-kicker">How it works</div><div className="process-grid">{steps.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div><button className="button button-dark" onClick={() => scrollHomeSection('audit')}>Book Your Free AI Operations Audit <ArrowRight size={16} /></button></section>;
}

function Benefit({ title, body }: { title: string; body: string }) { return <article className="benefit"><span><Check size={15} /></span><h3>{title}</h3><p>{body}</p></article>; }

function TrustSection() { return <section className="trust-section section-pad"><div><div className="section-kicker">Built around your business</div><h2>Not the other<br /><em>way around.</em></h2><p>Marlow fits around the way your business already works. We keep the implementation practical, the reporting clear and the important decisions human.</p></div><div className="trust-points"><span>Custom workflows</span><span>Existing tools can often be retained</span><span>Human oversight</span><span>Practical implementation</span><span>Clear reporting</span><span>No unnecessary complexity</span></div><div className="measure-strip"><div><b>Response time</b><span>How quickly enquiries receive a useful reply</span></div><div><b>Lead qualification rate</b><span>How many opportunities meet your criteria</span></div><div><b>Follow-up completion</b><span>Whether the next step keeps moving</span></div><div><b>Hours removed</b><span>Repetitive admin taken off the team’s plate</span></div></div></section>; }

interface AuditFields { name: string; business: string; email: string; website: string; type: string; manualTime: string; enquiries: string; automate: string; }
const emptyAudit: AuditFields = { name: '', business: '', email: '', website: '', type: '', manualTime: '', enquiries: '', automate: '' };

function AuditSection() {
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState<AuditFields>(emptyAudit);
  const [sent, setSent] = useState(false);
  const update = (key: keyof AuditFields, value: string) => setFields((current) => ({ ...current, [key]: value }));
  const next = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (step < 3) setStep(step + 1); else setSent(true); };
  return <section id="audit" className="audit-section section-pad"><div className="audit-intro"><div className="eyebrow"><span className="eyebrow-dot" /> Free AI operations audit</div><h2>Find out what your business could <em>automate.</em></h2><p>Tell us how your business currently handles enquiries, admin and follow-up. We’ll identify the highest-value opportunities for practical AI automation.</p><div className="audit-proof"><span>03 steps</span><span>No obligation</span><span>Built around your workflow</span></div></div><div className="audit-card">{sent ? <div className="audit-success"><span><Check size={22} /></span><div className="section-kicker">Audit request received</div><h3>We’ll review where your time is going.</h3><p>Your answers are saved for this session. Connect this form to your preferred inbox before launch to receive real submissions.</p><button className="button button-light" onClick={() => { setSent(false); setStep(1); setFields(emptyAudit); }}>Submit another audit</button></div> : <form onSubmit={next}><div className="audit-card-top"><span>Step 0{step} of 03</span><div><i className={step >= 1 ? 'active' : ''} /><i className={step >= 2 ? 'active' : ''} /><i className={step >= 3 ? 'active' : ''} /></div></div>{step === 1 && <div className="audit-fields"><label>Name<input required value={fields.name} onChange={(event) => update('name', event.target.value)} placeholder="Your name" /></label><label>Business name<input required value={fields.business} onChange={(event) => update('business', event.target.value)} placeholder="Your business" /></label><label>Email<input required type="email" value={fields.email} onChange={(event) => update('email', event.target.value)} placeholder="you@company.com" /></label><label>Website <small>optional</small><input value={fields.website} onChange={(event) => update('website', event.target.value)} placeholder="https://yourbusiness.co.uk" /></label></div>}{step === 2 && <div className="audit-fields"><label>What type of business do you run?<select required value={fields.type} onChange={(event) => update('type', event.target.value)}><option value="">Choose one</option><option>Professional services</option><option>Home and local services</option><option>Retail and ecommerce</option><option>Healthcare and wellbeing</option><option>Other</option></select></label><label>What takes up the most manual time?<textarea required value={fields.manualTime} onChange={(event) => update('manualTime', event.target.value)} placeholder="For example: replying to the same questions or updating our CRM" rows={4} /></label><label>How do you currently handle new enquiries?<textarea required value={fields.enquiries} onChange={(event) => update('enquiries', event.target.value)} placeholder="Tell us what happens today" rows={4} /></label></div>}{step === 3 && <div className="audit-fields"><label>What would you most like to automate?<textarea required value={fields.automate} onChange={(event) => update('automate', event.target.value)} placeholder="Describe the process you would most like to remove" rows={7} /></label><div className="audit-reminder"><ShieldCheck size={16} /><span>We’ll keep the recommendation practical and focused on your business. No inflated promises.</span></div></div>}<button className="button button-light audit-next" type="submit">{step === 3 ? 'Get My Free AI Operations Audit' : 'Continue'} <ArrowRight size={16} /></button></form>}</div></section>;
}

function FaqSection() {
  const [open, setOpen] = useState(0);
  const faqs = [['What is AI operations?', 'AI operations means using practical automation to handle repeatable business work, such as capturing enquiries, updating systems, sending useful replies and keeping follow-up moving.'], ['What can Marlow automate?', 'Marlow can help automate lead capture, qualification, follow-up, admin, customer questions, appointment workflows and updates between connected tools.'], ['Will AI replace my team?', 'No. The goal is to remove repetitive work and keep people in control of important customer and business decisions.'], ['Do I need to change all my existing software?', 'Not necessarily. We start with the tools and workflow you already use, then identify where a connection or change will add real value.'], ['Can you automate lead follow-up?', 'Yes. Suitable prospects can be routed into follow-up sequences with status tracking, reminders and human handoff when needed.'], ['Can AI respond to customers?', 'It can handle clearly defined, repeatable questions and collect useful information. More sensitive or complex situations can be passed to a person.'], ['How long does implementation take?', 'It depends on the workflow. The audit helps define a realistic first step rather than promising a fixed timeline before understanding your business.'], ['How much does AI automation cost?', 'Cost depends on the number and complexity of workflows. We scope the work after the audit so the recommendation is proportionate to the opportunity.'], ['Is there human oversight?', 'Yes. Human oversight is part of the operating model, especially for important decisions, exceptions and customer situations that need judgement.'], ['What happens after the initial audit?', 'You receive a practical view of the best automation opportunities and a sensible next-step recommendation. You decide whether to continue.']];
  return <section id="faq" className="faq-section section-pad"><div className="section-intro"><div><div className="section-kicker">Questions, answered</div><h2>Before you<br /><em>get started.</em></h2></div><button className="button button-dark" onClick={() => scrollHomeSection('audit')}>Book Free Audit <ArrowRight size={15} /></button></div><div className="faq-list">{faqs.map(([question, answer], index) => <div className={`faq-item ${open === index ? 'open' : ''}`} key={question}><button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span>{question}</span><ChevronDown size={16} /></button>{open === index && <p>{answer}</p>}</div>)}</div></section>;
}

function ProductPreview({ expanded = false }: { expanded?: boolean }) {
  return <div className={`product-preview ${expanded ? 'expanded-preview' : ''}`}><div className="preview-sidebar"><div className="preview-mini-logo"><span className="brand-image-wrap mini-brand-image"><img src="/IMG_1451.png" alt="" /></span><b>Marlow</b></div>{['Dashboard', 'Meetings', 'Tasks', 'Follow-ups', 'Calendar'].map((item, index) => <span className={index === 0 ? 'selected' : ''} key={item}><span className="preview-dot" />{item}</span>)}<div className="preview-sidebar-fade" /></div><div className="preview-main"><div className="preview-top"><span>Tuesday, 14 October 2025</span><span className="preview-avatar">JD</span></div><div className="preview-heading"><div><div className="mini-label">Overview / Product preview</div><h3>Good morning, Jamie.</h3><p>Here’s what needs your attention today.</p></div><span className="preview-date">This week <ChevronDown size={12} /></span></div><div className="preview-metrics"><PreviewMetric label="Today's meetings" value="6" /><PreviewMetric label="Open tasks" value="12" /><PreviewMetric label="Follow-ups" value="5" /><PreviewMetric label="Overdue" value="2" danger /></div><div className="preview-lower"><div className="preview-list"><b>Today’s priorities</b><PreviewRow time="09:00" title="Team meeting" /><PreviewRow time="10:30" title="Client call" /><PreviewRow time="12:00" title="Send proposal" /><PreviewRow time="15:00" title="Follow up with Acme" /></div><div className="insight-box"><div><Sparkles size={13} /> AI insights</div><p>You have 3 commitments due this week.</p><p>You have 2 clients waiting for follow-up.</p><p>The proposal discussed yesterday has not been sent yet.</p></div></div></div></div>;
}

function PreviewMetric({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) { return <div className="preview-metric"><span>{label}</span><strong className={danger ? 'danger-text' : ''}>{value}</strong></div>; }
function PreviewRow({ time, title }: { time: string; title: string }) { return <div className="preview-row"><time>{time}</time><span>{title}</span><ChevronRight size={11} /></div>; }

function FeaturesPage() {
  return <main><section className="page-hero section-pad"><div className="eyebrow"><span className="eyebrow-dot" /> One connected operating layer</div><h1>The work behind<br /><em>your business.</em></h1><p>Everything Marlow does is designed to help your team know what matters next.</p></section><section className="feature-detail section-pad"><div className="detail-preview"><ProductPreview expanded /></div><div className="detail-copy"><div className="section-kicker">The daily view</div><h2>Less admin.<br /><em>More control.</em></h2><p>Marlow keeps meetings, actions, tasks, reminders and business context connected, so your team can spend less time chasing information and more time doing the work.</p><button className="button button-dark" onClick={() => goTo('signup')}>Create your workspace <ArrowRight size={15} /></button></div></section><section className="all-features section-pad"><div className="section-kicker">Everything included</div><div className="all-features-grid">{productFeatures.map((feature, index) => <div className="feature-row" key={feature.title}><span className="row-number">0{index + 1}</span><span className="row-icon"><feature.icon size={19} /></span><div><h3>{feature.title}</h3><p>{feature.body}</p></div><ChevronRight size={17} /></div>)}</div></section></main>;
}

function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  return (
    <main>
      <section className="page-hero pricing-hero section-pad">
        <div className="eyebrow"><span className="eyebrow-dot" /> Simple pricing. Powerful operations.</div>
        <h1>Start small.<br /><em>Scale with confidence.</em></h1>
        <p>Choose the room you need today. Change plans as your business grows.</p>
        <div className="billing-toggle">
          <span className={billing === 'monthly' ? 'active' : ''} onClick={() => setBilling('monthly')} style={{ cursor: 'pointer' }}>Monthly</span>
          <span className={billing === 'annual' ? 'active' : ''} onClick={() => setBilling('annual')} style={{ cursor: 'pointer' }}>Annual</span>
          <small>Save 20%</small>
        </div>
      </section>
      <section className="pricing-grid section-pad">
        {plans.map((plan) => {
          const priceNum = billing === 'annual' ? Math.round(plan.monthly * 12 * 0.8) : plan.monthly;
          return (
            <article className={`price-card ${plan.featured ? 'featured' : ''}`} key={plan.name}>
              {plan.featured && <div className="popular">Most popular</div>}
              <div className="price-top">
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>
              <div className="price">
                <strong>£{priceNum}</strong>
                <span> {billing === 'annual' ? ' / year' : ' / month'}</span>
              </div>
              <div className="price-detail">
                {billing === 'annual' ? 'billed annually · save 20%' : 'billed monthly · cancel any time'}
              </div>
              <button className={`button ${plan.featured ? 'button-light' : 'button-outline'}`} onClick={() => goTo('signup')}>
                Start with {plan.name} <ArrowRight size={15} />
              </button>
              <div className="price-features">
                {plan.features.map((feature) => (
                  <div key={feature}><Check size={14} /> {feature}</div>
                ))}
              </div>
            </article>
          );
        })}
      </section>
      <section className="pricing-note section-pad">
        <ShieldCheck size={20} />
        <p>No payments are connected yet. Pricing buttons take you to workspace setup. Need help choosing? <button onClick={() => goTo('signup')}>Start a conversation.</button></p>
      </section>
    </main>
  );
}

function AboutPage() {
  const beliefs = [
    ['01', 'Our Mission', 'To give small businesses the clarity and organisation they need to operate with the confidence of a much larger company.'],
    ['02', 'Our Vision', "We believe the best business software shouldn't create more work. It should remove it."],
    ['03', 'What we are building', 'Marlow is being built to become the intelligent operational layer behind a business — connecting meetings, tasks, reminders, follow-ups and business knowledge in one place.'],
    ['04', 'A considered beginning', 'Marlow is growing carefully, with the needs of small and growing businesses at the centre of every product decision.'],
  ];
  return <main className="editorial-page"><section className="page-hero section-pad editorial-hero"><div className="eyebrow"><span className="eyebrow-dot" /> About Marlow</div><h1>Built to make<br /><em>business feel simpler.</em></h1><p>Marlow was created to solve a simple problem: too much important work gets lost between meetings, messages, tasks and busy days.</p></section><section className="story-section section-pad"><div className="section-kicker">Meet the founder</div><div className="story-copy"><h2>Good businesses deserve<br /><em>clearer days.</em></h2><p>Michael Onuegbu created Marlow after recognising how easily important business commitments can disappear in the day-to-day running of a company.</p><p>Meetings happen. Decisions are made. Tasks are promised. Follow-ups are discussed. But without a simple system connecting everything together, people forget, deadlines slip and valuable time is lost.</p><p>Marlow was created to change that.</p><p>The vision is simple: give small businesses an intelligent operations manager that helps them stay organised, remember what matters and keep work moving forward.</p></div></section><section className="beliefs-section section-pad">{beliefs.map(([number, title, body]) => <Belief key={number} number={number} title={title}>{body}</Belief>)}</section></main>;
}

function Belief({ number, title, children }: { number: string; title: string; children: string }) { return <article className="belief"><span>{number}</span><h3>{title}</h3><p>{children}</p></article>; }

function ContactPage() {
  const [sent, setSent] = useState(false);
  return <main className="editorial-page"><section className="page-hero section-pad editorial-hero"><div className="eyebrow"><span className="eyebrow-dot" /> Contact</div><h1>Let's <em>talk.</em></h1><p>Have a question, need help or want to learn more about Marlow? We'd love to hear from you.</p></section><section className="contact-layout section-pad"><div className="contact-info"><div className="section-kicker">Start a conversation</div><h2>Tell us what<br /><em>you need.</em></h2><div className="contact-note"><h3>Business enquiries</h3><p>Interested in Marlow for your business? Get in touch and we'll help you find the right way to get started.</p></div><div className="contact-note"><h3>Support</h3><p>For help with your Marlow account, contact our support team through the form and include as much useful detail as possible.</p></div></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>{sent ? <div className="contact-success"><Check size={20} /><h3>Message received.</h3><p>Thank you for getting in touch. This contact flow is ready for your support inbox to be connected.</p><button type="button" className="button button-dark" onClick={() => setSent(false)}>Send another message</button></div> : <><div className="form-two"><label>Name<input required placeholder="Your name" /></label><label>Business email<input required type="email" placeholder="you@company.com" /></label></div><div className="form-two"><label>Company<input placeholder="Your company" /></label><label>Subject<input required placeholder="How can we help?" /></label></div><label>Message<textarea required placeholder="Tell us a little more" rows={6} /></label><button className="button button-dark" type="submit">Send message <ArrowRight size={15} /></button></>}</form></section></main>;
}

const policySections = [
  ['What information Marlow may collect', 'Marlow may collect information you provide directly, information about how you use the website or product, and technical information needed to keep the service working.'],
  ['Account information', 'This may include your name, business email, password-related details and other information needed to create and manage an account.'],
  ['Business information', 'Marlow may process business information that you choose to add, such as meeting notes, tasks, follow-ups, client context and operational records. You decide what to provide.'],
  ['Usage information', 'We may receive basic information about pages visited, product interactions, device type and general diagnostics so we can understand usage and improve the experience.'],
  ['How information is used', 'Information may be used to provide and improve Marlow, support your account, keep the service secure, communicate important service updates and understand how the product is used.'],
  ['How information is stored', 'Information is intended to be stored with appropriate access controls and operational safeguards. The final technical and organisational arrangements should be confirmed before commercial launch.'],
  ['Service providers', 'Marlow may use trusted providers for hosting, authentication, communications, analytics or other services needed to operate the platform. Providers should only receive information relevant to their role.'],
  ['Your rights', 'Depending on your circumstances and applicable law, you may have rights to request access, correction, deletion, restriction or a copy of personal information. Contact us through the Contact page to make a request.'],
  ['Data retention', 'We intend to keep information only for as long as it is needed for the purposes described here, to provide the service, meet legitimate business needs or address legal and security matters.'],
  ['Cookies', 'The website may use essential cookies or similar technologies to remember preferences and understand basic usage. Any non-essential cookies should be clearly explained and managed before launch.'],
  ['Security', 'Marlow is designed with privacy and security in mind, but no online service can promise absolute security. Please see the Security page for our current product principles.'],
  ['Changes to this policy', 'We may update this draft as the product develops. The date at the top of this page will show when it was last updated.'],
  ['Contact information', 'For privacy questions or requests, please use the Contact page. A dedicated privacy contact process should be confirmed before commercial launch.'],
];

function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const isPrivacy = kind === 'privacy';
  const sections = isPrivacy ? policySections : [
    ['1. Introduction', 'These Terms of Service describe the basis on which Marlow may be used. They are a website draft and should be reviewed and finalised before commercial launch.'],
    ['2. Using Marlow', 'Marlow is intended to help small and growing businesses organise meetings, tasks, reminders, follow-ups and business information. You must use the service lawfully and responsibly.'],
    ['3. Accounts', 'You are responsible for keeping account details accurate and for taking reasonable care of your login credentials. Tell us promptly if you believe an account has been accessed without permission.'],
    ['4. Business Workspaces', 'A workspace may contain information belonging to a business and its team. Workspace administrators are responsible for inviting appropriate users and managing access.'],
    ['5. Subscriptions and Billing', 'The current plan references are Starter at £19/month, Growth at £59/month, Pro at £129/month and Plus at £199/month. The final billing cycle, taxes, payment terms and cancellation mechanics must be confirmed before launch.'],
    ['6. Free Trials or Promotional Access', 'Any trial or promotional access will only apply where it is expressly offered. The duration, eligibility and end-of-trial arrangements should be set out at the time of the offer.'],
    ['7. Acceptable Use', 'You must not misuse Marlow, interfere with its operation, attempt to access another workspace without permission, upload unlawful material or use the service to harm others.'],
    ['8. User Content', 'You retain responsibility for the information and content you add to Marlow. You should ensure you have the necessary rights and permissions to provide it to the service.'],
    ['9. AI-Generated Information', 'AI-generated summaries, suggestions or answers may be incomplete or inaccurate. They are provided to assist with work and should be reviewed before being relied on for important decisions.'],
    ['10. Third-Party Integrations', 'Some integrations may be offered in the future. Their availability will depend on the relevant provider and any additional terms that provider applies.'],
    ['11. Intellectual Property', 'Marlow and its underlying software, brand and materials are owned by or licensed to Marlow. These Terms do not transfer ownership of either party’s intellectual property.'],
    ['12. Service Availability', 'We will aim to provide a reliable service, but availability, features and supporting infrastructure may change. No uninterrupted or error-free service is promised in this draft.'],
    ['13. Cancellation', 'The final process for cancelling an account or subscription will be made clear before commercial launch. You remain responsible for any properly due charges up to the effective cancellation date.'],
    ['14. Limitation of Liability', 'The final allocation of responsibility and any applicable liability limits must be reviewed by legal professionals and will depend on the service and applicable law.'],
    ['15. Changes to the Service', 'Marlow may evolve as we learn what businesses need. We may add, change or remove features, while aiming to communicate material changes appropriately.'],
    ['16. Changes to These Terms', 'We may update these Terms as the product develops. The updated version will show a new date and should be reviewed before continued use.'],
    ['17. Governing Law', 'The governing law and courts for the final Terms should be confirmed before commercial launch. The intended business context is the United Kingdom.'],
    ['18. Contact', 'Questions about these Terms should be sent through the Contact page.'],
  ];
  return <main className="legal-page"><section className="page-hero section-pad editorial-hero"><div className="eyebrow"><span className="eyebrow-dot" /> {isPrivacy ? 'Privacy' : 'Terms of service'}</div><h1>{isPrivacy ? <>Privacy,<br /><em>made clear.</em></> : <>Terms for a<br /><em>clear relationship.</em></>}</h1><p>Last updated: October 2026</p></section><div className="legal-layout section-pad"><article className="legal-copy"><div className="legal-notice"><ShieldCheck size={18} /><span>This is a website draft. The final {isPrivacy ? 'Privacy Policy' : 'Terms'} should be reviewed by appropriate legal professionals before commercial launch.</span></div>{sections.map(([title, body]) => <section className="legal-section" key={title}><h2>{title}</h2><p>{body}</p></section>)}</article><aside className="legal-aside"><div className="section-kicker">On this page</div>{sections.slice(0, 7).map(([title]) => <span key={title}>{title}</span>)}<button onClick={() => goTo('contact')}>Questions? Contact us <ArrowRight size={14} /></button></aside></div></main>;
}

function PrivacyPage() { return <LegalPage kind="privacy" />; }
function TermsPage() { return <LegalPage kind="terms" />; }
function SecurityPage() {
  const sections = [['Data Protection', 'Marlow is designed with security and privacy in mind. Access to business information should be limited to the people and systems that need it.'], ['Account Security', 'User accounts are designed to use secure authentication and access controls.'], ['Data Isolation', "Business workspaces are designed so that one company's information is not accessible to another company's users."], ['Third-Party Services', 'Marlow may use trusted infrastructure and service providers to operate parts of the platform. These services are selected with security and reliability in mind.'], ['Security Development', 'We continuously improve the security of Marlow as the platform develops.'], ['Report a Security Concern', 'If you believe you have discovered a security issue affecting Marlow, please contact us through the Contact page with as much relevant information as possible.']];
  return <main className="security-page"><section className="page-hero section-pad editorial-hero"><div className="eyebrow"><span className="eyebrow-dot" /> Security</div><h1>Security at<br /><em>Marlow.</em></h1><p>Your business information deserves to be protected.</p></section><section className="security-grid section-pad"><div className="security-intro"><div className="security-symbol"><ShieldCheck size={28} /></div><h2>Designed with<br /><em>care.</em></h2><p>Security is part of how Marlow is being built, not a layer added at the end.</p></div><div className="security-sections">{sections.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></section></main>;
}

function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const login = mode === 'login';
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return <div className="auth-shell"><aside className="auth-side"><Logo light /><div className="auth-statement"><span className="auth-logo-wrap"><img src="/IMG_1451.png" alt="Marlow logo" /></span><p>Your business,<br /><em>under control.</em></p></div><small>MARLOW / PRODUCT 001</small></aside><main className="auth-main"><button className="auth-back" onClick={() => goTo('home')}><ArrowLeft size={15} /> Back to site</button><div className="auth-form-wrap"><div className="section-kicker">{login ? 'Welcome back' : 'Start with Marlow'}</div><h1>{login ? 'Good to see you.' : 'Build a clearer day.'}</h1><p>{login ? 'Enter your details to continue to your workspace.' : 'Create your workspace and get your business under control.'}</p>{sent ? <div className="success-box"><Check size={20} /><b>{login ? 'You’re on your way in.' : 'Your workspace is ready to shape.'}</b><span>This preview keeps everything local for now. Continue to explore the product.</span><button className="button button-dark" onClick={() => goTo(login ? 'dashboard' : 'onboarding')}>Continue <ArrowRight size={15} /></button></div> : <form className="auth-form" onSubmit={submit}>{!login && <div className="form-two"><label>First name<input required placeholder="Jamie" /></label><label>Last name<input required placeholder="Doyle" /></label></div>}{!login && <label>Business name<input required placeholder="Your business" /></label>}<label>Work email<input required type="email" placeholder="you@company.com" /></label><label>Password<input required type="password" placeholder="At least 8 characters" /></label>{login && <button type="button" className="forgot">Forgot password?</button>}<button className="button button-dark full-button" type="submit">{login ? 'Log in' : 'Create account'} <ArrowRight size={15} /></button><div className="form-divider"><span>or continue with</span></div><button type="button" className="button button-social"><Command size={15} /> Continue with Google</button></form>}<p className="auth-switch">{login ? 'New to Marlow?' : 'Already have an account?'} <button onClick={() => goTo(login ? 'signup' : 'login')}>{login ? 'Create an account' : 'Log in'}</button></p></div></main></div>;
}

function Onboarding() {
  const [step, setStep] = useState(1);
  const questions = [
    { eyebrow: '01 / Your workspace', title: 'What’s your business called?', body: 'This will be the home for your team’s work.', input: true },
    { eyebrow: '02 / Your context', title: 'What industry are you in?', body: 'We’ll tune your workspace around the way you operate.', choices: ['Professional services', 'Product & technology', 'Retail & commerce', 'Other'] },
    { eyebrow: '03 / Your team', title: 'How many people are on your team?', body: 'A little context helps us shape the right starting point.', choices: ['Just me', '2–10 people', '11–50 people', '51+ people'] },
    { eyebrow: '04 / Your role', title: 'What do you do day to day?', body: 'We’ll make your first view useful from the start.', choices: ['Founder or owner', 'Operations', 'Team lead', 'Other'] },
    { eyebrow: '05 / Your challenge', title: 'What needs the most control?', body: 'Pick the one thing you want to feel easier first.', choices: ['Keeping track of commitments', 'Following up with clients', 'Organising the team', 'Seeing what needs attention'] },
    { eyebrow: '06 / Your tools', title: 'What do you use today?', body: 'Marlow is designed to bring the moving parts together.', choices: ['Spreadsheets and notes', 'Calendar and email', 'Project management tools', 'A bit of everything'] },
  ];
  const current = questions[step - 1];
  return <div className="onboarding-shell"><header className="onboarding-header"><Logo /><span>Workspace setup <b>0{step}</b> / 06</span><button onClick={() => goTo('dashboard')}>Skip for now <ArrowRight size={15} /></button></header><main className="onboarding-main"><div className="onboarding-progress">{questions.map((_, index) => <span key={index} className={index < step ? 'done' : ''} />)}</div><div className="onboarding-card"><div className="section-kicker">{current.eyebrow}</div><h1>{current.title}</h1><p>{current.body}</p>{current.input ? <label className="onboarding-input">Business name<input autoFocus placeholder="e.g. Northstar Studio" /></label> : <div className="choice-grid">{current.choices?.map((choice, index) => <button key={choice} className={index === 0 ? 'selected' : ''}>{choice}<span>{index === 0 && <Check size={13} />}</span></button>)}</div>}</div><button className="button button-dark onboarding-next" onClick={() => step < 6 ? setStep(step + 1) : goTo('dashboard')}>{step === 6 ? 'Welcome to Marlow' : 'Continue'} <ArrowRight size={16} /></button><p className="onboarding-foot">Your answers help shape your starting workspace. You can change them later.</p></main></div>;
}

function AppShell({ route }: { route: AppRoute }) {
  const [mobileNav, setMobileNav] = useState(false);
  const activeLabel = navItems.find((item) => item.route === route)?.label ?? 'Settings';
  return <div className="app-shell"><aside className={`app-sidebar ${mobileNav ? 'open' : ''}`}><div className="app-sidebar-top"><Logo /><button className="sidebar-close" onClick={() => setMobileNav(false)}><X size={18} /></button></div><button className="workspace-switcher"><span className="workspace-avatar">N</span><span><b>Northstar Studio</b><small>Scale workspace</small></span><ChevronDown size={14} /></button><nav className="app-nav">{navItems.map(({ route: itemRoute, label, icon: Icon }) => <button key={itemRoute} className={route === itemRoute ? 'active' : ''} onClick={() => goTo(itemRoute)}><Icon size={17} />{label}</button>)}<div className="nav-divider" /><button className={route === 'settings' ? 'active' : ''} onClick={() => goTo('settings')}><Settings size={17} />Settings</button><button className={route === 'billing' ? 'active' : ''} onClick={() => goTo('billing')}><CreditCard size={17} />Billing</button></nav><div className="sidebar-bottom"><button><CircleHelp size={17} /> Help centre</button><div className="user-chip"><span className="user-avatar">JD</span><span><b>Jamie Doyle</b><small>Admin</small></span><MoreHorizontal size={16} /></div></div></aside><main className="app-main"><header className="app-header"><button className="mobile-app-menu" onClick={() => setMobileNav(true)}><Menu size={20} /></button><div className="app-search"><Search size={16} /><span>Search your workspace</span><kbd>⌘ K</kbd></div><div className="app-actions"><button aria-label="Notifications"><Bell size={18} /></button><button className="button button-dark" onClick={() => goTo('meetings')}><Plus size={15} /> New meeting</button></div></header><div className="app-page"><PageHeader label={activeLabel} /><AppContent route={route} /></div></main></div>;
}

function PageHeader({ label }: { label: string }) { return <div className="app-page-header"><div><div className="section-kicker">Northstar Studio / Workspace</div><h1>{label}</h1></div><div className="app-date">Tuesday, 14 October 2025 <ChevronDown size={14} /></div></div>; }

function AppContent({ route }: { route: AppRoute }) {
  if (route === 'dashboard') return <DashboardView />;
  if (route === 'meetings') return <MeetingsView />;
  if (route === 'tasks') return <TasksView />;
  if (route === 'follow-ups') return <FollowUpsView />;
  if (route === 'calendar') return <CalendarView />;
  if (route === 'team') return <TeamView />;
  if (route === 'assistant') return <AssistantView />;
  if (route === 'memory') return <MemoryView />;
  if (route === 'settings') return <SettingsView />;
  return <BillingView />;
}

function DashboardView() {
  return <><div className="dashboard-greeting"><div><div className="section-kicker">Tuesday, 14 October 2025</div><h2>Good morning, Jamie.</h2><p>Here’s what needs your attention today.</p></div><button className="button button-dark" onClick={() => goTo('meetings')}><Plus size={15} /> Add meeting</button></div><div className="stat-grid"><StatCard title="Today’s meetings" value="6" icon={CalendarDays} /><StatCard title="Open tasks" value="12" icon={ListChecks} /><StatCard title="Follow-ups" value="5" icon={Users} /><StatCard title="Overdue" value="2" icon={Clock3} danger /></div><div className="dashboard-columns"><Panel title="Today’s priorities" kicker="Your next actions"><div className="priority-list"><Priority time="09:00" title="Team meeting" detail="Weekly operations review" type="meeting" /><Priority time="10:30" title="Client call" detail="Acme · Renewal discussion" type="meeting" /><Priority time="12:00" title="Send proposal" detail="Owner: Jamie Doyle" type="task" /><Priority time="15:00" title="Follow up with Acme" detail="Due today" type="follow" /></div><button className="panel-link" onClick={() => goTo('tasks')}>View all tasks <ArrowRight size={14} /></button></Panel><Panel title="AI Insights" kicker="Product examples only"><div className="insight-list"><Insight text="You have 3 commitments due this week." /><Insight text="You have 2 clients waiting for follow-up." /><Insight text="The proposal discussed yesterday has not been sent yet." /></div><button className="panel-link" onClick={() => goTo('assistant')}>Ask the assistant <ArrowRight size={14} /></button></Panel></div><div className="dashboard-columns lower"><Panel title="Momentum this week" kicker="Operations overview"><div className="dashboard-chart"><div className="chart-bars"><i /><i /><i /><i /><i /><i /><i /></div><div className="chart-line" /></div><div className="chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></Panel><Panel title="Latest activity" kicker="What’s moving"><div className="activity-list"><Activity title="Weekly review published" detail="12 minutes ago" icon={FileText} /><Activity title="New action item added" detail="1 hour ago" icon={ListChecks} /><Activity title="Meeting summary ready" detail="3 hours ago" icon={Sparkles} /></div></Panel></div></>;
}

function StatCard({ title, value, icon: Icon, danger = false }: { title: string; value: string; icon: typeof CalendarDays; danger?: boolean }) { return <div className={`stat-card ${danger ? 'danger-card' : ''}`}><span className="stat-icon"><Icon size={16} /></span><div><span>{title}</span><strong>{value}</strong></div><MoreHorizontal size={16} className="stat-more" /></div>; }
function Panel({ title, kicker, children }: { title: string; kicker: string; children: ReactNode }) { return <section className="panel"><div className="panel-heading"><div><div className="section-kicker">{kicker}</div><h2>{title}</h2></div><MoreHorizontal size={17} /></div>{children}</section>; }
function Priority({ time, title, detail, type }: { time: string; title: string; detail: string; type: 'meeting' | 'task' | 'follow' }) { return <div className="priority"><time>{time}</time><span className={`priority-type ${type}`} /> <div><b>{title}</b><small>{detail}</small></div><ChevronRight size={15} /></div>; }
function Insight({ text }: { text: string }) { return <div className="insight"><Sparkles size={15} /><span>{text}</span></div>; }
function Activity({ title, detail, icon: Icon }: { title: string; detail: string; icon: typeof FileText }) { return <div className="activity"><span><Icon size={14} /></span><div><b>{title}</b><small>{detail}</small></div></div>; }

function MeetingsView() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const meetings = tab === 'upcoming' ? [['09:00', 'Team meeting', 'Weekly operations review', '6 attendees'], ['10:30', 'Client call', 'Acme · Renewal discussion', '3 attendees'], ['15:00', 'Growth planning', 'Q4 pipeline and follow-ups', '4 attendees']] : [['Yesterday', 'Product review', 'Website relaunch · Decisions captured', '5 attendees'], ['Monday', '1:1 with Sam', 'Performance and priorities', '2 attendees'], ['Friday', 'Finance review', 'October cashflow check-in', '3 attendees']];
  return <><div className="page-toolbar"><div className="segmented"><button className={tab === 'upcoming' ? 'active' : ''} onClick={() => setTab('upcoming')}>Upcoming <span>3</span></button><button className={tab === 'past' ? 'active' : ''} onClick={() => setTab('past')}>Past <span>18</span></button></div><button className="button button-dark"><Plus size={15} /> Add meeting</button></div><div className="meeting-list">{meetings.map(([time, title, detail, attendees]) => <button className="meeting-row" key={title} onClick={() => goTo('meetings')}><span className="meeting-time">{time}<small>{tab === 'upcoming' ? 'OCT 14' : 'OCT 13'}</small></span><span className="meeting-status" /><span className="meeting-info"><b>{title}</b><small>{detail}</small></span><span className="meeting-attendees"><Users size={14} /> {attendees}</span><ChevronRight size={16} /></button>)}</div><div className="meeting-note"><Sparkles size={17} /><div><b>Meeting intelligence stays in one place.</b><span>Open any meeting to see notes, summaries, decisions, action items and follow-ups together.</span></div></div></>;
}

function TasksView() {
  const [filter, setFilter] = useState('All');
  const [done, setDone] = useState<string[]>([]);
  const tasks = [{ title: 'Send proposal to Acme', owner: 'Jamie Doyle', due: 'Due today', priority: 'High', status: 'To Do', meeting: 'Client call' }, { title: 'Review website copy', owner: 'Sam Okafor', due: 'Tomorrow', priority: 'Medium', status: 'In Progress', meeting: 'Product review' }, { title: 'Confirm Q4 planning date', owner: 'Alex Kim', due: '16 Oct', priority: 'Low', status: 'To Do', meeting: 'Growth planning' }, { title: 'Share weekly operations notes', owner: 'Jamie Doyle', due: '12 Oct', priority: 'High', status: 'Overdue', meeting: 'Weekly review' }];
  const visible = filter === 'All' ? tasks : tasks.filter((task) => filter === 'My Tasks' ? task.owner === 'Jamie Doyle' : filter === 'Overdue' ? task.status === 'Overdue' : filter === 'Completed' ? done.includes(task.title) : filter === 'Due Today' ? task.due === 'Due today' : true);
  return <><div className="page-toolbar"><div className="filter-tabs">{['All', 'My Tasks', 'Due Today', 'This Week', 'Overdue', 'Completed'].map((item) => <button className={filter === item ? 'active' : ''} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><button className="button button-dark"><Plus size={15} /> Add task</button></div><div className="table-card"><div className="table-head"><span>Task</span><span>Owner</span><span>Due</span><span>Priority</span><span>Status</span><span /></div>{visible.map((task) => <div className="task-row" key={task.title}><button className={`task-check ${done.includes(task.title) ? 'checked' : ''}`} onClick={() => setDone(done.includes(task.title) ? done.filter((title) => title !== task.title) : [...done, task.title])}>{done.includes(task.title) && <Check size={12} />}</button><span className="task-name"><b>{task.title}</b><small>From {task.meeting}</small></span><span className="owner"><span className="table-avatar">{task.owner.split(' ').map((name) => name[0]).join('')}</span>{task.owner}</span><span className={task.due === 'Due today' || task.status === 'Overdue' ? 'danger-text' : ''}>{task.due}</span><span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span><span className={`status-tag ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span><MoreHorizontal size={16} /></div>)}</div></>;
}

function FollowUpsView() {
  const followUps = [['Acme', 'Priya Shah', 'Send renewal proposal', 'Today', 'Waiting'], ['Northstar', 'Daniel Reed', 'Share onboarding timeline', 'Tomorrow', 'Open'], ['Lumen Co', 'Tara Williams', 'Check decision on scope', '17 Oct', 'Open'], ['Cedar & Co', 'Mike Evans', 'Confirm next meeting', '21 Oct', 'Scheduled']];
  return <><div className="page-toolbar"><p className="toolbar-description">Keep commitments moving after the conversation.</p><button className="button button-dark"><Plus size={15} /> Add follow-up</button></div><div className="follow-grid">{followUps.map(([company, person, reason, due, status]) => <button className="follow-card" key={company} onClick={() => undefined}><div className="follow-top"><span className="company-badge">{company.slice(0, 1)}</span><span className="status-tag open">{status}</span></div><h3>{reason}</h3><p>{person} · {company}</p><div className="follow-bottom"><span><Clock3 size={13} /> {due}</span><ChevronRight size={15} /></div></button>)}</div></>;
}

function CalendarView() {
  const days = ['Mon 13', 'Tue 14', 'Wed 15', 'Thu 16', 'Fri 17'];
  const blocks = [{ day: 1, start: 1, height: 64, title: 'Team meeting', tone: 'dark' }, { day: 1, start: 4, height: 82, title: 'Client call', tone: 'lime' }, { day: 2, start: 2, height: 65, title: 'Growth planning', tone: 'soft' }, { day: 3, start: 5, height: 75, title: 'Product review', tone: 'dark' }, { day: 4, start: 1, height: 70, title: 'Finance review', tone: 'soft' }];
  return <><div className="calendar-toolbar"><button className="button button-outline"><ArrowLeft size={14} /> Sep</button><b>14 – 18 October 2025</b><button className="button button-outline">Nov <ArrowRight size={14} /></button><button className="button button-dark"><Plus size={15} /> Add event</button></div><div className="calendar-card"><div className="calendar-grid-head"><span />{days.map((day) => <b className={day.includes('14') ? 'today' : ''} key={day}>{day}</b>)}</div><div className="calendar-grid-body"><div className="time-column">{['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'].map((time) => <span key={time}>{time}</span>)}</div>{days.map((day, dayIndex) => <div className="calendar-day" key={day}>{[...Array(7)].map((_, index) => <i key={index} />)}{blocks.filter((block) => block.day === dayIndex).map((block) => <div key={block.title} className={`calendar-event ${block.tone}`} style={{ top: `${block.start * 58}px`, height: `${block.height}px` }}><b>{block.title}</b><small>Northstar Studio</small></div>)}</div>)}</div></div></>;
}

function TeamView() {
  const people = [['Jamie Doyle', 'Admin', 'JD', 'Operations'], ['Sam Okafor', 'Member', 'SO', 'Product'], ['Alex Kim', 'Member', 'AK', 'Growth'], ['Tara Williams', 'Viewer', 'TW', 'Finance']];
  return <><div className="page-toolbar"><p className="toolbar-description">The people helping your business move.</p><button className="button button-dark"><Plus size={15} /> Invite teammate</button></div><div className="table-card"><div className="table-head team-head"><span>Person</span><span>Role</span><span>Team</span><span>Last active</span><span /></div>{people.map(([name, role, initials, team]) => <div className="task-row team-row" key={name}><span className="owner"><span className="table-avatar dark-avatar">{initials}</span><b>{name}</b></span><span className="status-tag open">{role}</span><span>{team}</span><span>Today</span><MoreHorizontal size={16} /></div>)}</div></>;
}

function AssistantView() {
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState(false);
  return <div className="assistant-layout"><div className="assistant-main"><div className="assistant-intro"><span className="assistant-symbol"><Sparkles size={20} /></span><div className="section-kicker">Product preview</div><h2>A clearer way to ask<br /><em>what happens next.</em></h2><p>Marlow will help you find the answer across your meetings, tasks, follow-ups and business memory.</p></div>{asked && <div className="assistant-message user-message">{question}</div>}{asked && <div className="assistant-message assistant-message"><Sparkles size={15} /><div><b>Here’s what I found in your workspace preview.</b><p>There are 3 commitments due this week, including the Acme renewal proposal. No connected AI is running yet, so this is only a product preview.</p></div></div>}<div className="assistant-prompts"><span>Try asking</span><button onClick={() => { setQuestion('What do I need to do today?'); setAsked(true); }}>What do I need to do today?</button><button onClick={() => { setQuestion('Which clients need follow-ups?'); setAsked(true); }}>Which clients need follow-ups?</button><button onClick={() => { setQuestion('What commitments are due this week?'); setAsked(true); }}>What commitments are due this week?</button></div><form className="assistant-input" onSubmit={(event) => { event.preventDefault(); if (question.trim()) setAsked(true); }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask Marlow anything about your business" /><button type="submit"><ArrowRight size={17} /></button></form><small className="assistant-disclaimer">Marlow AI Assistant is a product preview. It is not connected to external services yet.</small></div><aside className="assistant-aside"><div className="section-kicker">Suggested view</div><h3>What is moving</h3><Insight text="3 commitments due this week" /><Insight text="2 follow-ups need attention" /><Insight text="1 overdue task" /></aside></div>;
}

function MemoryView() {
  const [search, setSearch] = useState('');
  const memories = [{ category: 'Clients', title: 'Acme renewal', body: 'Renewal proposal discussed in the 14 October client call.', icon: Users }, { category: 'Decisions', title: 'Website launch date', body: 'Team agreed to launch the updated website on 4 November.', icon: Check }, { category: 'Processes', title: 'Weekly operations review', body: 'Review happens every Tuesday morning with owners of active work.', icon: FolderKanban }, { category: 'People', title: 'Priya Shah', body: 'Primary contact at Acme. Prefers concise written updates.', icon: Users }, { category: 'Commitments', title: 'Q4 planning', body: 'Share the first draft before Friday’s finance review.', icon: Clock3 }];
  const visible = memories.filter((memory) => `${memory.title} ${memory.body} ${memory.category}`.toLowerCase().includes(search.toLowerCase()));
  return <><div className="memory-toolbar"><div className="memory-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your business memory" /></div><button className="button button-dark"><Plus size={15} /> Add memory</button></div><div className="memory-categories">{['All', 'People', 'Clients', 'Decisions', 'Processes', 'Meetings', 'Commitments'].map((category, index) => <button className={index === 0 ? 'active' : ''} key={category}>{category}</button>)}</div><div className="memory-grid">{visible.map((memory) => <article className="memory-card" key={memory.title}><div className="memory-card-top"><span className="memory-icon"><memory.icon size={16} /></span><span>{memory.category}</span></div><h3>{memory.title}</h3><p>{memory.body}</p><button className="card-link">Open memory <ArrowRight size={14} /></button></article>)}</div></>;
}

function SettingsView() {
  const [section, setSection] = useState('Profile');
  const sections = ['Profile', 'Company', 'Team', 'Notifications', 'Integrations', 'Security', 'Billing'];
  return <div className="settings-layout"><aside className="settings-nav">{sections.map((item) => <button className={section === item ? 'active' : ''} key={item} onClick={() => setSection(item)}>{item}<ChevronRight size={14} /></button>)}</aside><section className="settings-panel"><div className="section-kicker">Workspace settings</div><h2>{section}</h2><p className="settings-description">Manage your {section.toLowerCase()} preferences for Marlow.</p><div className="settings-form">{section === 'Profile' && <><SettingField label="First name" value="Jamie" /><SettingField label="Last name" value="Doyle" /><SettingField label="Work email" value="jamie@northstar.studio" /></>}{section === 'Company' && <><SettingField label="Business name" value="Northstar Studio" /><SettingField label="Industry" value="Professional services" /><SettingField label="Team size" value="11–50 people" /></>}{section === 'Notifications' && <><ToggleRow title="Meeting summaries" detail="Notify me when a summary is ready" /><ToggleRow title="Due date reminders" detail="Keep upcoming commitments visible" /><ToggleRow title="Weekly review" detail="Send a considered weekly overview" /></>}{section === 'Integrations' && <><IntegrationRow name="Calendar" detail="Connect when you’re ready" /><IntegrationRow name="Email" detail="Connect when you’re ready" /><IntegrationRow name="CRM" detail="Available on Pro" /></>}{section !== 'Profile' && section !== 'Company' && section !== 'Notifications' && section !== 'Integrations' && <div className="empty-settings"><ShieldCheck size={22} /><b>{section} settings are ready to configure.</b><p>This product preview keeps connections and account changes offline until you choose to enable them.</p></div>}<button className="button button-dark">Save changes</button></div></section></div>;
}
function SettingField({ label, value }: { label: string; value: string }) { return <label className="setting-field">{label}<input defaultValue={value} /></label>; }
function ToggleRow({ title, detail }: { title: string; detail: string }) { const [on, setOn] = useState(true); return <div className="toggle-row"><div><b>{title}</b><small>{detail}</small></div><button className={on ? 'toggle on' : 'toggle'} onClick={() => setOn(!on)}><span /></button></div>; }
function IntegrationRow({ name, detail }: { name: string; detail: string }) { return <div className="integration-row"><span className="integration-icon">{name.slice(0, 1)}</span><span><b>{name}</b><small>{detail}</small></span><button className="button button-outline">Connect</button></div>; }
function BillingView() { return <><div className="billing-intro"><div><div className="section-kicker">Current plan</div><h2>Growth</h2><p>£59 / month · no payment connected</p></div><button className="button button-dark" onClick={() => goTo('pricing')}>Compare plans <ArrowRight size={15} /></button></div><div className="billing-grid"><div className="billing-card"><div className="section-kicker">Workspace usage</div><h3>Good room to grow.</h3><Usage label="Meetings" value="18 / unlimited" progress={42} /><Usage label="Team members" value="4 / unlimited" progress={22} /><Usage label="Business memory" value="38 entries" progress={38} /></div><div className="billing-card billing-note"><ShieldCheck size={20} /><h3>Payments are not connected</h3><p>This preview shows the place where plan details, invoices and payment settings will live when billing is enabled.</p><button className="text-button" onClick={() => goTo('pricing')}>View all plans <ArrowRight size={15} /></button></div></div></>; }
function Usage({ label, value, progress }: { label: string; value: string; progress: number }) { return <div className="usage"><div><span>{label}</span><b>{value}</b></div><i><span style={{ width: `${progress}%` }} /></i></div>; }

function MarketingFooter() { return <footer className="site-footer"><div><Logo /><p>Your business,<br />under control.</p></div><div className="footer-links"><div><b>Product</b><button onClick={() => goTo('features')}>Features</button><button onClick={() => goTo('security')}>Security</button></div><div><b>Company</b><button onClick={() => goTo('about')}>About</button><button onClick={() => goTo('contact')}>Contact</button></div><div><b>Legal</b><button onClick={() => goTo('privacy')}>Privacy</button><button onClick={() => goTo('terms')}>Terms</button></div></div><div className="footer-end"><span>© 2026 Marlow. All rights reserved.</span><span>Made for businesses in motion.</span></div></footer>; }

export default App;
