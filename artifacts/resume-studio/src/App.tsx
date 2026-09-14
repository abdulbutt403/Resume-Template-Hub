import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, FileText, HelpCircle, Mail, MapPin, Plus, Printer, RotateCcw, Trash2 } from 'lucide-react';

type Experience = { id: string; role: string; company: string; location: string; start: string; end: string; details: string };
type Education = { id: string; degree: string; school: string; location: string; year: string };
type ResumeData = {
  profile: { name: string; role: string; email: string; phone: string; location: string; website: string };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  template: number;
};

const starter: ResumeData = {
  profile: { name: 'Mara Ellison', role: 'Product designer & storyteller', email: 'mara@ellison.studio', phone: '+1 415 555 0147', location: 'San Francisco, CA', website: 'maraellison.com' },
  summary: 'Product designer with 7 years of experience turning complex systems into clear, human experiences. I work at the intersection of research, narrative, and visual craft — helping teams make work people remember.',
  experience: [
    { id: 'exp-1', role: 'Senior Product Designer', company: 'Northstar Labs', location: 'San Francisco, CA', start: '2021', end: 'Present', details: 'Led the design of a new planning suite used by 18k teams. Built the research practice from the ground up and partnered with engineering to ship a cohesive system across web and mobile.' },
    { id: 'exp-2', role: 'Product Designer', company: 'Common Thread', location: 'Oakland, CA', start: '2018', end: '2021', details: 'Designed tools that made financial products feel more approachable. Ran workshops with customers, created a modular design system, and improved activation by 31%.' },
  ],
  education: [{ id: 'edu-1', degree: 'BFA, Interaction Design', school: 'California College of the Arts', location: 'San Francisco, CA', year: '2018' }],
  skills: ['Product strategy', 'UX research', 'Interaction design', 'Prototyping', 'Design systems', 'Figma'],
  template: 1,
};

const templates = [
  ['Northstar', 'Elegant editorial'], ['Field Notes', 'Quiet & considered'], ['Column', 'Classic sidebar'], ['Signal', 'Crisp & modern'], ['Ledger', 'Warm authority'],
  ['Baseline', 'Structured clarity'], ['Morrow', 'Humanist serif'], ['Index', 'Brutalist detail'], ['Harbor', 'Confident dark'], ['Cedar', 'Soft precision'],
];
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function Field({ label, value, onChange, multiline = false, placeholder }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; placeholder?: string }) {
  return <div className="field"><label>{label}</label>{multiline ? <textarea data-testid={`textarea-${label.toLowerCase().replace(/\s/g, '-')}`} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} /> : <input data-testid={`input-${label.toLowerCase().replace(/\s/g, '-')}`} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}</div>;
}

function TemplatePicker({ selected, onSelect }: { selected: number; onSelect: (value: number) => void }) {
  return <div className="form-section">
    <div className="form-section-head"><span className="form-section-title">Choose a layout</span><span className="form-section-note">10 designs</span></div>
    <div className="template-grid">
      {templates.map(([name, description], index) => <button data-testid={`button-template-${index + 1}`} key={name} className={`template-card ${selected === index + 1 ? 'selected' : ''}`} onClick={() => onSelect(index + 1)}>
        {selected === index + 1 && <span className="selected-check"><Check size={11} strokeWidth={3} /></span>}
        <div className={`template-thumb template-thumb-${index + 1}`}><div className="template-thumb-name" /><div className="template-thumb-rule" /><div className="template-thumb-line" /><div className="template-thumb-line short" /><div className="template-thumb-line" />{index === 2 && <div className="template-thumb-columns" />}</div>
        <span className="template-card-label">{String(index + 1).padStart(2, '0')} / {name}</span><span className="template-card-meta">{description}</span>
      </button>)}
    </div>
  </div>;
}

function ResumePreview({ data }: { data: ResumeData }) {
  const { profile, experience, education, skills, summary, template } = data;
  return <div className={`resume-paper template-${template}`} data-testid="resume-preview">
    {template === 3 ? <><aside className="resume-aside"><h1 className="resume-name">{profile.name || 'Your Name'}</h1><div className="resume-role">{profile.role || 'Your role'}</div><div className="resume-contact"><span><Mail size={10} />{profile.email}</span><span>{profile.phone}</span><span><MapPin size={10} />{profile.location}</span><span>{profile.website}</span></div></aside><main className="resume-main"><PreviewMain data={data} /></main></> : <PreviewMain data={data} />}
  </div>;
}

function PreviewMain({ data }: { data: ResumeData }) {
  const { profile, experience, education, skills, summary, template } = data;
  return <><header><h1 className="resume-name">{profile.name || 'Your Name'}</h1><div className="resume-role">{profile.role || 'Your role'}</div>{template !== 3 && <div className="resume-contact"><span><Mail size={10} />{profile.email || 'email@example.com'}</span><span>{profile.phone}</span><span><MapPin size={10} />{profile.location}</span><span>{profile.website}</span></div>}</header>
    {summary && <p className="resume-intro">{summary}</p>}
    <section className="resume-block"><h2 className="resume-block-title">Experience</h2>{experience.length ? experience.map((item) => <article className="resume-entry" key={item.id}><div className="resume-entry-top"><h3 className="resume-entry-title">{item.role || 'Role title'}</h3><span className="resume-entry-date">{item.start} — {item.end}</span></div><div className="resume-entry-sub">{item.company}{item.location ? ` · ${item.location}` : ''}</div>{item.details && <p className="resume-entry-copy">{item.details}</p>}</article>) : <p className="resume-entry-copy resume-empty">Your experience will appear here.</p>}</section>
    <section className="resume-block"><h2 className="resume-block-title">Education</h2>{education.length ? education.map((item) => <article className="resume-entry" key={item.id}><div className="resume-entry-top"><h3 className="resume-entry-title">{item.degree || 'Degree or certificate'}</h3><span className="resume-entry-date">{item.year}</span></div><div className="resume-entry-sub">{item.school}{item.location ? ` · ${item.location}` : ''}</div></article>) : <p className="resume-entry-copy resume-empty">Your education will appear here.</p>}</section>
    <section className="resume-block"><h2 className="resume-block-title">Skills</h2><div className="resume-skills">{skills.filter(Boolean).map((skill) => <span className="resume-skill" key={skill}>{skill}</span>)}</div></section>
  </>;
}

function ExperienceEditor({ items, onChange }: { items: Experience[]; onChange: (items: Experience[]) => void }) {
  const update = (id: string, key: keyof Experience, value: string) => onChange(items.map((item) => item.id === id ? { ...item, [key]: value } : item));
  return <div className="form-section"><div className="form-section-head"><span className="form-section-title">Experience</span><span className="form-section-note">Most recent first</span></div>
    {items.map((item, index) => <div className="entry-card" key={item.id}><div className="entry-card-head"><div className="entry-number"><span>{index + 1}</span> Work chapter</div><button className="icon-btn" data-testid={`button-remove-experience-${index}`} aria-label="Remove experience" onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}><Trash2 size={14} /></button></div><Field label="Role" value={item.role} onChange={(value) => update(item.id, 'role', value)} /><Field label="Company" value={item.company} onChange={(value) => update(item.id, 'company', value)} /><div className="field-grid"><Field label="Start" value={item.start} onChange={(value) => update(item.id, 'start', value)} /><Field label="End" value={item.end} onChange={(value) => update(item.id, 'end', value)} /></div><Field label="Location" value={item.location} onChange={(value) => update(item.id, 'location', value)} /><Field label="What changed" value={item.details} multiline onChange={(value) => update(item.id, 'details', value)} /></div>)}
    <button className="add-btn" data-testid="button-add-experience" onClick={() => onChange([...items, { id: uid(), role: '', company: '', location: '', start: '', end: 'Present', details: '' }])}><Plus size={14} /> Add experience</button>
  </div>;
}

function EducationEditor({ items, onChange }: { items: Education[]; onChange: (items: Education[]) => void }) {
  const update = (id: string, key: keyof Education, value: string) => onChange(items.map((item) => item.id === id ? { ...item, [key]: value } : item));
  return <div className="form-section"><div className="form-section-head"><span className="form-section-title">Education</span><span className="form-section-note">Degrees & study</span></div>
    {items.map((item, index) => <div className="entry-card" key={item.id}><div className="entry-card-head"><div className="entry-number"><span>{index + 1}</span> Learning chapter</div><button className="icon-btn" data-testid={`button-remove-education-${index}`} aria-label="Remove education" onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}><Trash2 size={14} /></button></div><Field label="Degree" value={item.degree} onChange={(value) => update(item.id, 'degree', value)} /><Field label="School" value={item.school} onChange={(value) => update(item.id, 'school', value)} /><div className="field-grid"><Field label="Year" value={item.year} onChange={(value) => update(item.id, 'year', value)} /><Field label="Location" value={item.location} onChange={(value) => update(item.id, 'location', value)} /></div></div>)}
    <button className="add-btn" data-testid="button-add-education" onClick={() => onChange([...items, { id: uid(), degree: '', school: '', location: '', year: '' }])}><Plus size={14} /> Add education</button>
  </div>;
}

function Editor({ data, setData, active, setActive }: { data: ResumeData; setData: (data: ResumeData) => void; active: string; setActive: (value: string) => void }) {
  const setProfile = (key: keyof ResumeData['profile'], value: string) => setData({ ...data, profile: { ...data.profile, [key]: value } });
  const sections = [['design', 'Design'], ['story', 'Story'], ['work', 'Work'], ['education', 'Study'], ['skills', 'Skills']];
  return <aside className="editor-panel">
    <div className="editor-heading"><div><div className="eyebrow">Your draft</div><h2 className="editor-title">Make it<br /><em>memorable.</em></h2></div><ChevronDown size={17} color="#9c8877" /></div>
    <div className="section-nav">{sections.map(([id, label]) => <button data-testid={`button-section-${id}`} className={active === id ? 'active' : ''} key={id} onClick={() => setActive(id)}>{label}</button>)}</div>
    {active === 'design' && <TemplatePicker selected={data.template} onSelect={(template) => setData({ ...data, template })} />}
    {active === 'story' && <div className="form-section"><div className="form-section-head"><span className="form-section-title">Profile & contact</span><span className="form-section-note">The essentials</span></div><Field label="Full name" value={data.profile.name} onChange={(value) => setProfile('name', value)} /><Field label="Headline" value={data.profile.role} onChange={(value) => setProfile('role', value)} /><Field label="Summary" value={data.summary} multiline onChange={(value) => setData({ ...data, summary: value })} placeholder="A few clear lines about the work you do best." /><div className="form-section-head"><span className="form-section-title">Contact details</span></div><Field label="Email" value={data.profile.email} onChange={(value) => setProfile('email', value)} /><Field label="Phone" value={data.profile.phone} onChange={(value) => setProfile('phone', value)} /><Field label="Location" value={data.profile.location} onChange={(value) => setProfile('location', value)} /><Field label="Website" value={data.profile.website} onChange={(value) => setProfile('website', value)} /></div>}
    {active === 'work' && <ExperienceEditor items={data.experience} onChange={(experience) => setData({ ...data, experience })} />}
    {active === 'education' && <EducationEditor items={data.education} onChange={(education) => setData({ ...data, education })} />}
    {active === 'skills' && <div className="form-section"><div className="form-section-head"><span className="form-section-title">Your toolkit</span><span className="form-section-note">Separate with commas</span></div><Field label="Skills" value={data.skills.join(', ')} multiline onChange={(value) => setData({ ...data, skills: value.split(',').map((skill) => skill.trim()).filter(Boolean) })} /><div className="tip-card"><HelpCircle size={15} /><span>Keep this tight — six to eight skills that reinforce the role you want next usually land better than a long list.</span></div></div>}
    <div className="tip-card"><FileText size={15} /><span>Your changes save automatically in this browser. Choose a layout any time — your story stays intact.</span></div>
  </aside>;
}

function Home() {
  const [data, setData] = useState<ResumeData>(() => { try { return JSON.parse(localStorage.getItem('resume-studio-draft') || 'null') || starter; } catch { return starter; } });
  const [active, setActive] = useState('design');
  const [saved, setSaved] = useState(true);
  useEffect(() => { setSaved(false); const timer = window.setTimeout(() => { localStorage.setItem('resume-studio-draft', JSON.stringify(data)); setSaved(true); }, 500); return () => window.clearTimeout(timer); }, [data]);
  const templateName = useMemo(() => templates[data.template - 1]?.[0] || templates[0][0], [data.template]);
  const reset = () => { if (window.confirm('Start over with the original sample resume?')) { setData(starter); setActive('design'); } };
  return <div className="studio-shell">
    <header className="studio-topbar"><div className="brand-mark"><div className="brand-seal">R</div><div><div className="brand-name">Resume Studio</div><div className="brand-kicker">A considered first draft</div></div></div><div className="top-actions"><div className="save-status" data-testid="status-autosave"><span className={`save-dot ${saved ? '' : 'animate-pulse-soft'}`} />{saved ? 'Saved just now' : 'Saving your changes…'}</div><button className="outline-btn desktop-only" data-testid="button-reset" onClick={reset}><RotateCcw size={13} /> Start over</button><button className="primary-btn" data-testid="button-print" onClick={() => window.print()}><Printer size={14} /> <span className="desktop-only">Print / save PDF</span><span className="mobile-only">Print</span></button></div></header>
    <main className="studio-body"><Editor data={data} setData={setData} active={active} setActive={setActive} /><section className="preview-panel"><div className="preview-toolbar"><div className="preview-label"><span className="live-pip" /> Live preview <strong>·</strong> {templateName}</div><span className="zoom-label">Print-ready document</span></div><div className="paper-wrap"><ResumePreview data={data} /></div></section></main>
  </div>;
}

export default Home;
