import { useState, useEffect, useContext, createContext, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── THEME ───────────────────────────────────────────────────────────────────
const colors = {
  indigo: "#4f46e5", indigoLight: "#eef2ff", indigoDark: "#3730a3",
  green: "#10b981", greenLight: "#d1fae5",
  orange: "#f59e0b", orangeLight: "#fef3c7",
  blue: "#3b82f6", blueLight: "#dbeafe",
  red: "#ef4444", redLight: "#fee2e2",
  slate50: "#f8fafc", slate100: "#f1f5f9", slate200: "#e2e8f0",
  slate300: "#cbd5e1", slate400: "#94a3b8", slate500: "#64748b",
  slate600: "#475569", slate700: "#334155", slate800: "#1e293b", slate900: "#0f172a",
  white: "#ffffff", purple: "#7c3aed", purpleLight: "#ede9fe",
  cyan: "#06b6d4", cyanLight: "#cffafe", pink: "#ec4899", pinkLight: "#fce7f3",
};

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);
const STORAGE_KEY = "edusync_user_v2";

const DEMO_ACCOUNTS = [
  { email: "admin@edusync.edu", password: "admin123", role: "admin", name: "Dr. Rajesh Kumar", dept: "Administration", avatar: "RK" },
  { email: "faculty@edusync.edu", password: "faculty123", role: "faculty", name: "Prof. Ananya Sharma", dept: "AI & Data Science", avatar: "AS" },
  { email: "student@edusync.edu", password: "student123", role: "student", name: "Arjun Mehta", dept: "CSE", avatar: "AM" },
  { email: "librarian@edusync.edu", password: "lib123", role: "librarian", name: "Ms. Priya Nair", dept: "Library", avatar: "PN" },
];

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
  });
  const signIn = async (email, password) => {
    const acct = DEMO_ACCOUNTS.find(a => a.email === email);
    if (!acct) throw new Error("No account found. Try demo credentials.");
    if (acct.password !== password) throw new Error("Incorrect password.");
    const u = { uid: acct.email, email: acct.email, name: acct.name, role: acct.role, dept: acct.dept, avatar: acct.avatar };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
  };
  const signOut = () => { localStorage.removeItem(STORAGE_KEY); setUser(null); };
  return <AuthContext.Provider value={{ user, signIn, signOut, isAdmin: user?.role === "admin", isFaculty: user?.role === "faculty", isStudent: user?.role === "student", isLibrarian: user?.role === "librarian" }}>{children}</AuthContext.Provider>;
}
const useAuth = () => useContext(AuthContext);

// ─── ICON SET ─────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color: c, style = {} }) => {
  const icons = {
    dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    library: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
    book: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
    calendar: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
    bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    chart: "M18 20V10 M12 20V4 M6 20v-6",
    flask: "M9 3h6 M10 9l-4 12h12L14 9 M10 9h4",
    cpu: "M9 2H7a5 5 0 0 0-5 5v2 M17 2h2a5 5 0 0 1 5 5v2 M9 22H7a5 5 0 0 1-5-5v-2 M17 22h2a5 5 0 0 0 5-5v-2 M9 9h6v6H9z",
    search: "M11 2a9 9 0 1 0 0 18A9 9 0 0 0 11 2z m6 6 4 4",
    plus: "M12 5v14 M5 12h14",
    check: "M20 6 9 17l-5-5",
    x: "M18 6 6 18 M6 6l12 12",
    edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    trash: "M3 6h18 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M10 6V4h4v2",
    upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
    download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    award: "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M8.21 13.89L7 23l5-3 5 3-1.21-9.12",
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    arrow_right: "M5 12h14 M12 5l7 7-7 7",
    arrow_up: "M12 19V5 M5 12l7-7 7 7",
    globe: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
    menu: "M3 12h18 M3 6h18 M3 18h18",
    github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
    message: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
    ticket: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z M9 12h6",
    settings: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 8v4 M12 16h.01",
    layers: "M12 2 2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
    trending_up: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    briefcase: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
    clipboard: "M9 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2 M9 2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H9V2z",
    robot: "M12 2a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2M6 8h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z M9 12h.01 M15 12h.01 M12 18v2M8 18v2M16 18v2",
    microscope: "M6 18L6 6 M6 6h4 M6 12h4 M2 18h20 M14 18V9a5 5 0 0 0-5-5",
    brain: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-3 2.5 2.5 0 0 1 .03-3.46A2.5 2.5 0 0 1 9.5 2z M14.5 2a2.5 2.5 0 0 0-2.5 2.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-3 2.5 2.5 0 0 0-.03-3.46A2.5 2.5 0 0 0 14.5 2z",
  };
  const d = icons[name] || icons.settings;
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c || "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}><path d={d} /></svg>;
};

// ─── COMMON COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ children, color = "indigo" }) => {
  const map = { indigo: [colors.indigoLight, colors.indigo], green: [colors.greenLight, colors.green], orange: [colors.orangeLight, "#b45309"], red: [colors.redLight, colors.red], blue: [colors.blueLight, "#1d4ed8"], purple: [colors.purpleLight, colors.purple] };
  const [bg, fg] = map[color] || map.indigo;
  return <span style={{ background: bg, color: fg, fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 99, letterSpacing: "0.05em", textTransform: "uppercase" }}>{children}</span>;
};

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: colors.white, border: `1px solid ${colors.slate200}`, borderRadius: 20, padding: "1.5rem", ...style }}>
    {children}
  </div>
);

const StatCard = ({ title, value, sub, icon, color, delta }) => (
  <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ background: color + "20", borderRadius: 12, padding: 10, color }}><Icon name={icon} size={22} color={color} /></div>
      {delta && <span style={{ fontSize: 12, fontWeight: 700, color: colors.green, background: colors.greenLight, padding: "2px 8px", borderRadius: 99 }}>↑ {delta}</span>}
    </div>
    <div><div style={{ fontSize: 26, fontWeight: 700, color: colors.slate900, lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 12, color: colors.slate500, marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: colors.slate400, marginTop: 2 }}>{sub}</div>}
    </div>
  </Card>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", icon, disabled, style: s = {} }) => {
  const base = { display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600, borderRadius: 12, cursor: disabled ? "not-allowed" : "pointer", border: "none", transition: "all 0.15s", opacity: disabled ? 0.5 : 1 };
  const sizes = { sm: { padding: "6px 14px", fontSize: 13 }, md: { padding: "10px 20px", fontSize: 14 }, lg: { padding: "14px 28px", fontSize: 15 } };
  const variants = { primary: { background: colors.indigo, color: colors.white }, secondary: { background: colors.slate100, color: colors.slate700 }, danger: { background: colors.redLight, color: colors.red }, ghost: { background: "transparent", color: colors.slate600, border: `1px solid ${colors.slate200}` }, success: { background: colors.greenLight, color: colors.green } };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...s }}>{icon && <Icon name={icon} size={size === "sm" ? 14 : 16} />}{children}</button>;
};

const Input = ({ label, value, onChange, placeholder, type = "text", style: s = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 700, color: colors.slate600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ border: `1.5px solid ${colors.slate200}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, color: colors.slate800, outline: "none", background: colors.slate50, width: "100%", boxSizing: "border-box", ...s }} />
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
    <div style={{ background: colors.white, borderRadius: 24, padding: "2rem", width: "100%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: colors.slate900 }}>{title}</h2>
        <button onClick={onClose} style={{ background: colors.slate100, border: "none", borderRadius: 8, padding: 6, cursor: "pointer" }}><Icon name="x" size={18} /></button>
      </div>
      {children}
    </div>
  </div>
);

const AvatarCircle = ({ name = "", size = 40, bg = colors.indigoLight, fg = colors.indigo }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.35, flexShrink: 0 }}>
    {name.slice(0, 2).toUpperCase()}
  </div>
);

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = {
  admin: [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "users", label: "User Management", icon: "users" },
    { id: "departments", label: "Departments", icon: "layers" },
    { id: "attendance", label: "Attendance", icon: "check" },
    { id: "events", label: "Events", icon: "calendar" },
    { id: "grievances", label: "Grievances", icon: "alert" },
    { id: "analytics", label: "Analytics", icon: "chart" },
    { id: "library", label: "Library", icon: "library" },
    { id: "community", label: "Communities", icon: "globe" },
    { id: "research", label: "AI Research", icon: "flask" },
    { id: "notifications", label: "Notifications", icon: "bell" },
  ],
  faculty: [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "attendance", label: "Attendance", icon: "check" },
    { id: "resources", label: "Resources", icon: "book" },
    { id: "events", label: "Events", icon: "calendar" },
    { id: "students", label: "My Students", icon: "users" },
    { id: "grievances", label: "Grievances", icon: "alert" },
    { id: "community", label: "Communities", icon: "globe" },
    { id: "research", label: "AI Research", icon: "flask" },
    { id: "notifications", label: "Notifications", icon: "bell" },
  ],
  student: [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "attendance", label: "Attendance", icon: "check" },
    { id: "marks", label: "Marks & GPA", icon: "chart" },
    { id: "resources", label: "Resources", icon: "book" },
    { id: "library", label: "E-Library", icon: "library" },
    { id: "events", label: "Events", icon: "calendar" },
    { id: "forum", label: "Doubt Forum", icon: "message" },
    { id: "grievances", label: "Grievances", icon: "alert" },
    { id: "community", label: "Communities", icon: "globe" },
    { id: "research", label: "AI Research", icon: "flask" },
    { id: "notifications", label: "Notifications", icon: "bell" },
  ],
  librarian: [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "library", label: "Library Mgmt", icon: "library" },
    { id: "notifications", label: "Notifications", icon: "bell" },
  ],
};

function Sidebar({ page, setPage, collapsed, setCollapsed }) {
  const { user, signOut } = useAuth();
  const items = SIDEBAR_ITEMS[user?.role] || SIDEBAR_ITEMS.student;

  return (
    <div style={{ width: collapsed ? 64 : 240, background: colors.white, borderRight: `1px solid ${colors.slate200}`, display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0, transition: "width 0.2s", position: "sticky", top: 0, overflow: "hidden" }}>
      <div style={{ padding: "1.25rem 1rem", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", borderBottom: `1px solid ${colors.slate100}` }}>
        {!collapsed && <span style={{ fontSize: 20, fontWeight: 800, color: colors.slate900, letterSpacing: "-0.5px" }}>Edu<span style={{ color: colors.indigo }}>Sync</span></span>}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: colors.slate100, border: "none", borderRadius: 8, padding: 6, cursor: "pointer", color: colors.slate500 }}>
          <Icon name="menu" size={18} />
        </button>
      </div>

      {!collapsed && (
        <div style={{ padding: "1rem", borderBottom: `1px solid ${colors.slate100}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AvatarCircle name={user?.avatar || user?.name} size={38} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.slate900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
              <Badge color={user?.role === "admin" ? "red" : user?.role === "faculty" ? "blue" : user?.role === "librarian" ? "purple" : "green"}>{user?.role}</Badge>
            </div>
          </div>
        </div>
      )}

      <nav style={{ flex: 1, overflowY: "auto", padding: "0.75rem 0.5rem" }}>
        {items.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px" : "10px 12px", borderRadius: 10, marginBottom: 2, border: "none", cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start", background: page === item.id ? colors.indigoLight : "transparent", color: page === item.id ? colors.indigo : colors.slate600, fontWeight: page === item.id ? 700 : 500, fontSize: 14, transition: "all 0.1s" }}>
            <Icon name={item.icon} size={18} color={page === item.id ? colors.indigo : colors.slate500} />
            {!collapsed && item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "0.75rem 0.5rem", borderTop: `1px solid ${colors.slate100}` }}>
        <button onClick={signOut} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px" : "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start", background: "transparent", color: colors.red, fontWeight: 600, fontSize: 14 }}>
          <Icon name="logout" size={18} color={colors.red} />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ setShowApp }) {
  const features = [
    { icon: "check", title: "Smart Attendance", desc: "AI-powered face recognition with pruned CNNs for real-time campus monitoring.", color: colors.green },
    { icon: "brain", title: "Predictive Analytics", desc: "ML models predict student performance and attendance trends using optimized inference.", color: colors.indigo },
    { icon: "library", title: "E-Library", desc: "Digital library with smart search, PDF viewer, and personalized recommendations.", color: colors.blue },
    { icon: "message", title: "Doubt Forum", desc: "Anonymous & identity-based discussion boards moderated by verified faculty.", color: colors.purple },
    { icon: "alert", title: "Grievance System", desc: "End-to-end anonymous complaint management with department routing.", color: colors.orange },
    { icon: "globe", title: "Dept. Communities", desc: "14 department communities with feeds, resources, placements, and alumni.", color: colors.cyan },
    { icon: "calendar", title: "Event Hub", desc: "Create, register, and track events with QR ticketing and analytics.", color: colors.pink },
    { icon: "layers", title: "Course Planning", desc: "Faculty course scheduling, syllabus tracking, and semester management.", color: "#7c3aed" },
  ];

  const team = [
    { name: "Srusti", role: "1NT23AD052", dept: "AI & DS", avatar: "SR" },
    { name: "Sri Nidhi", role: "1NT23AD050", dept: "AI & DS", avatar: "SN" },
    { name: "Sumangala Vastrad", role: "1NT24AD404", dept: "AI & DS", avatar: "SV" },
    { name: "Vinay V", role: "1NT24AD405", dept: "AI & DS", avatar: "VV" },
  ];

  const metrics = [
    { label: "Parameters Pruned", value: "73.6%", color: colors.indigo },
    { label: "Accuracy Retained", value: "94.2%", color: colors.green },
    { label: "Inference Speed", value: "3.8×", color: colors.orange },
    { label: "Model Size", value: "−68%", color: colors.blue },
  ];

  const pruningData = [
    { step: "Original", params: 100, accuracy: 95 },
    { step: "10% Prune", params: 90, accuracy: 94.8 },
    { step: "30% Prune", params: 70, accuracy: 94.5 },
    { step: "50% Prune", params: 50, accuracy: 94.2 },
    { step: "70% Prune", params: 30, accuracy: 93.8 },
    { step: "HNIS Prune", params: 26.4, accuracy: 94.2 },
  ];

  return (
    <div style={{ background: colors.white, minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${colors.slate100}`, zIndex: 100, padding: "0 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>Edu<span style={{ color: colors.indigo }}>Sync</span></span>
          <div style={{ display: "flex", gap: 8 }}>
            {["About", "Research", "Features", "Team"].map(l => <a key={l} href={`#${l.toLowerCase()}`} style={{ textDecoration: "none", color: colors.slate600, fontSize: 14, fontWeight: 500, padding: "6px 12px" }}>{l}</a>)}
            <Btn onClick={() => setShowApp(true)} icon="arrow_right">Launch Platform</Btn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "5rem 2rem 6rem", textAlign: "center", background: `linear-gradient(180deg, ${colors.indigoLight}30 0%, transparent 100%)` }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: colors.indigoLight, color: colors.indigo, padding: "6px 16px", borderRadius: 99, fontSize: 13, fontWeight: 700, marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
            <Icon name="flask" size={14} color={colors.indigo} /> RESEARCH-BACKED SMART CAMPUS ECOSYSTEM
          </div>
          <h1 style={{ fontSize: "clamp(48px, 8vw, 80px)", fontWeight: 800, letterSpacing: "-2px", color: colors.slate900, margin: "0 0 1.5rem", lineHeight: 1.1 }}>
            Edu<span style={{ color: colors.indigo }}>Sync</span>
          </h1>
          <p style={{ fontSize: 20, color: colors.slate600, lineHeight: 1.7, marginBottom: "2.5rem" }}>
            A modern intelligent university platform integrating <strong style={{ color: colors.slate900 }}>Neuron Pruning</strong> research for optimized smart campus AI — attendance, analytics, recommendations, and more.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => setShowApp(true)} size="lg" icon="arrow_right">Launch Platform</Btn>
            <Btn variant="ghost" size="lg" icon="flask">View Research</Btn>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginTop: "3rem", flexWrap: "wrap" }}>
            {metrics.map(m => (
              <div key={m.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 12, color: colors.slate500, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "5rem 2rem", background: colors.slate50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.indigo, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>ABOUT EDUSYNC</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: colors.slate900, letterSpacing: "-1px", marginBottom: "1.5rem", lineHeight: 1.2 }}>More than a campus portal — an AI ecosystem</h2>
            <p style={{ color: colors.slate600, lineHeight: 1.8, marginBottom: "1rem" }}>EduSync is designed to solve real campus management challenges while extending cutting-edge ML research into production. Unlike traditional ERPs, EduSync integrates pruned neural network models directly into core campus workflows.</p>
            <p style={{ color: colors.slate600, lineHeight: 1.8 }}>Built for universities with 4 role levels — Student, Faculty, Admin, and Librarian — each with tailored dashboards, permissions, and academic tools.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[["2,400+", "Registered Users"], ["14", "Departments"], ["8,500+", "Library Books"], ["94.2%", "AI Accuracy"]].map(([v, l]) => (
              <Card key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: colors.indigo, marginBottom: 4 }}>{v}</div>
                <div style={{ fontSize: 12, color: colors.slate500, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section id="research" style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.indigo, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>RESEARCH CONTRIBUTION</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: colors.slate900, letterSpacing: "-1px" }}>Improving Neural Network Efficiency Using Neuron Pruning</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
            <div>
              {[
                { title: "Hierarchical Neuron Importance Scoring (HNIS)", desc: "A novel formula combining activation magnitude, gradient flow, and inter-neuron Granger causality to rank neurons by true importance." },
                { title: "Iterative Structured Pruning", desc: "Progressive pruning cycles with fine-tuning between each stage, preserving model accuracy while reducing parameters by up to 73.6%." },
                { title: "Real-World Deployment", desc: "Pruned models deployed in EduSync's face attendance and predictive analytics pipelines — 3.8× faster inference on edge hardware." },
              ].map(r => (
                <div key={r.title} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors.indigo, marginTop: 6, flexShrink: 0 }} />
                  <div><div style={{ fontWeight: 700, color: colors.slate900, marginBottom: 4 }}>{r.title}</div><div style={{ fontSize: 14, color: colors.slate600, lineHeight: 1.6 }}>{r.desc}</div></div>
                </div>
              ))}
            </div>
            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.slate500, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pruning vs Accuracy Trade-off</div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pruningData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.slate100} />
                    <XAxis dataKey="step" tick={{ fontSize: 10, fill: colors.slate400 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10, fill: colors.slate400 }} domain={[20, 105]} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: colors.slate400 }} domain={[92, 96]} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${colors.slate200}`, fontSize: 12 }} />
                    <Line yAxisId="left" type="monotone" dataKey="params" stroke={colors.indigo} strokeWidth={2.5} dot={{ r: 4 }} name="Params %" />
                    <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke={colors.green} strokeWidth={2.5} dot={{ r: 4 }} name="Accuracy %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 3, background: colors.indigo, display: "block", borderRadius: 2 }} />Params Remaining %</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 3, background: colors.green, display: "block", borderRadius: 2 }} />Model Accuracy %</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "5rem 2rem", background: colors.slate50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: colors.slate900, letterSpacing: "-1px" }}>Smart Campus Features</h2>
            <p style={{ color: colors.slate600, fontSize: 17 }}>Every module purpose-built for university operations</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {features.map(f => (
              <Card key={f.title} style={{ transition: "transform 0.15s" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: f.color + "20", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name={f.icon} size={24} color={f.color} />
                </div>
                <div style={{ fontWeight: 700, color: colors.slate900, marginBottom: 6, fontSize: 15 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: colors.slate600, lineHeight: 1.6 }}>{f.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: colors.slate900, letterSpacing: "-1px" }}>Multi-Department Communities</h2>
            <p style={{ color: colors.slate600 }}>14 active department communities with dedicated feeds and resources</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {["AI & Data Science", "AIML", "CSE", "ISE", "ECE", "EEE", "Mechanical", "Civil", "Architecture", "Fashion Design", "MBA", "MCA", "Biotechnology", "Commerce"].map((d, i) => (
              <div key={d} style={{ background: [colors.indigoLight, colors.greenLight, colors.blueLight, colors.purpleLight, colors.orangeLight, colors.cyanLight, colors.pinkLight][i % 7], color: [colors.indigo, colors.green, colors.blue, colors.purple, "#b45309", colors.cyan, colors.pink][i % 7], padding: "8px 18px", borderRadius: 99, fontSize: 13, fontWeight: 600 }}>{d}</div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" style={{ padding: "5rem 2rem", background: colors.slate50 }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: colors.slate900, letterSpacing: "-1px" }}>The Team</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
            {team.map(t => (
              <Card key={t.name} style={{ textAlign: "center" }}>
                <AvatarCircle name={t.avatar} size={52} bg={colors.indigoLight} fg={colors.indigo} />
                <div style={{ marginTop: 12, fontWeight: 700, color: colors.slate900, fontSize: 14 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: colors.slate500, marginTop: 2 }}>{t.role}</div>
                <Badge color="indigo">{t.dept}</Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: colors.slate900, color: colors.white, padding: "3rem 2rem", textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Edu<span style={{ color: colors.indigo }}>Sync</span></div>
        <p style={{ color: colors.slate400, marginBottom: "0.5rem" }}>Neural Network Optimization Research Platform · 2026</p>
        <p style={{ color: colors.slate500, marginBottom: "0.5rem", fontSize: 13 }}>Dept. of AI & Data Science · NMIT</p>
        <p style={{ color: colors.slate500, marginBottom: "1.5rem", fontSize: 13 }}>Guide: Prof. Archana Mathue</p>
        <Btn onClick={() => setShowApp(true)} size="lg">Launch Platform</Btn>
        <div style={{ marginTop: "2rem", color: colors.slate600, fontSize: 13 }}>© 2026 EduSync. All rights reserved.</div>
      </footer>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("student@edusync.edu");
  const [password, setPassword] = useState("student123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  const demos = [
    { label: "Admin", email: "admin@edusync.edu", pass: "admin123", color: "red" },
    { label: "Faculty", email: "faculty@edusync.edu", pass: "faculty123", color: "blue" },
    { label: "Student", email: "student@edusync.edu", pass: "student123", color: "green" },
    { label: "Librarian", email: "librarian@edusync.edu", pass: "lib123", color: "purple" },
  ];

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try { await signIn(email, password); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: colors.slate50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, maxWidth: 900, width: "100%", borderRadius: 28, overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.12)" }}>
        {/* Left Panel */}
        <div style={{ background: colors.slate900, padding: "3rem", color: colors.white, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: "1.5rem" }}>Edu<span style={{ color: colors.indigo }}>Sync</span></div>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: "1rem", lineHeight: 1.2 }}>The Neural Edge</h2>
          <p style={{ color: colors.slate400, lineHeight: 1.8, marginBottom: "2rem" }}>By optimizing model architecture through neuron pruning, EduSync delivers real-time smart campus insights with enterprise-level efficiency.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[["94.2%", "Validation Accuracy"], ["12ms", "Avg Inference"], ["3.8×", "Speed Gain"], ["73.6%", "Params Pruned"]].map(([v, l]) => (
              <div key={l}><div style={{ fontSize: 26, fontWeight: 800 }}>{v}</div><div style={{ color: colors.slate400, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div></div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ background: colors.white, padding: "3rem" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: colors.slate500, fontSize: 13, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
            ← Back to Home
          </button>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: "0.5rem", color: colors.slate900 }}>Welcome back</h3>
          <p style={{ color: colors.slate500, fontSize: 14, marginBottom: "1.5rem" }}>Sign in to access your campus portal</p>

          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.slate600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Demo Login</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {demos.map(d => (
                <button key={d.label} onClick={() => { setEmail(d.email); setPassword(d.pass); }}
                  style={{ padding: "5px 14px", borderRadius: 99, border: `1.5px solid ${colors.slate200}`, background: colors.white, cursor: "pointer", fontSize: 13, fontWeight: 600, color: colors.slate700 }}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {error && <div style={{ background: colors.redLight, color: colors.red, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: "1rem" }}>{error}</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Email" value={email} onChange={setEmail} placeholder="name@edusync.edu" type="email" />
            <Input label="Password" value={password} onChange={setPassword} placeholder="••••••••" type="password" />
            <Btn onClick={handleSubmit} disabled={loading} style={{ width: "100%" }}>{loading ? "Signing in..." : "Sign In"}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGES ──────────────────────────────────────────────────────────
const weeklyData = [
  { day: "Mon", attendance: 88, performance: 74 },
  { day: "Tue", attendance: 91, performance: 78 },
  { day: "Wed", attendance: 85, performance: 72 },
  { day: "Thu", attendance: 93, performance: 82 },
  { day: "Fri", attendance: 90, performance: 79 },
  { day: "Sat", attendance: 95, performance: 88 },
];

function DashboardPage() {
  const { user, isAdmin, isFaculty, isStudent } = useAuth();
  const stats = isAdmin
    ? [{ title: "Total Students", value: "2,418", icon: "users", color: colors.indigo, delta: "3.2%" }, { title: "Faculty", value: "148", icon: "briefcase", color: colors.blue, delta: "1%" }, { title: "Active Events", value: "12", icon: "calendar", color: colors.orange, delta: "4" }, { title: "Complaints", value: "7", icon: "alert", color: colors.red }]
    : isFaculty
    ? [{ title: "My Students", value: "124", icon: "users", color: colors.indigo }, { title: "Resources Uploaded", value: "38", icon: "upload", color: colors.green, delta: "5" }, { title: "Avg Attendance", value: "87.3%", icon: "check", color: colors.blue }, { title: "Events Created", value: "4", icon: "calendar", color: colors.orange }]
    : [{ title: "Attendance", value: "92.4%", icon: "check", color: colors.green, delta: "2.1%" }, { title: "CGPA", value: "8.6", icon: "chart", color: colors.indigo, delta: "0.2" }, { title: "Resources", value: "124", icon: "book", color: colors.blue }, { title: "Events Joined", value: "6", icon: "calendar", color: colors.orange }];

  const recentActivity = [
    { title: "Computer Networks - Unit 4 Notes", type: "Resource", time: "2h ago", icon: "book", color: colors.blue },
    { title: "Python for AI Workshop", type: "Event", time: "Yesterday", icon: "calendar", color: colors.orange },
    { title: "Discrete Math PYQ 2025", type: "PYQ", time: "2 days ago", icon: "book", color: colors.green },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: colors.slate900, margin: 0 }}>
          {isAdmin ? "System Administration" : isFaculty ? "Faculty Dashboard" : "My Academic Hub"}
        </h1>
        <p style={{ color: colors.slate500, marginTop: 4 }}>Welcome back, {user?.name} · {user?.dept}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: "2rem" }}>
        {stats.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: "2rem" }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: colors.slate900 }}>Academic Analytics</h3>
            <Badge color="indigo">Weekly View</Badge>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.indigo} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={colors.indigo} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.slate100} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: colors.slate400 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: colors.slate400 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${colors.slate200}`, fontSize: 12 }} />
                <Area type="monotone" dataKey="attendance" stroke={colors.indigo} strokeWidth={2.5} fill="url(#grad1)" name="Attendance %" />
                <Area type="monotone" dataKey="performance" stroke={colors.green} strokeWidth={2.5} fill="none" name="Performance %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ background: colors.slate900, color: colors.white, flex: 1 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, color: colors.indigo }}>
              <Icon name="robot" size={16} color={colors.indigo} />
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Insight</span>
            </div>
            <h4 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>Efficiency improving</h4>
            <p style={{ color: colors.slate400, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Pruned neural network predicts 4% attendance improvement based on current event participation patterns.</p>
          </Card>
          <Card>
            <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: colors.slate900 }}>Quick Actions</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(isAdmin ? [["Add User", "plus", "primary"], ["View Reports", "chart", "ghost"]] :
               isFaculty ? [["Upload Resource", "upload", "primary"], ["Mark Attendance", "check", "ghost"]] :
               [["Register Event", "calendar", "primary"], ["Ask Doubt", "message", "ghost"]]
              ).map(([l, ic, v]) => <Btn key={l} icon={ic} variant={v} style={{ width: "100%", justifyContent: "center" }}>{l}</Btn>)}
            </div>
          </Card>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: colors.slate900 }}>Recent Activity</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentActivity.map(a => (
              <div key={a.title} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px", borderRadius: 12, background: colors.slate50 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: a.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={a.icon} size={16} color={a.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: colors.slate800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: colors.slate500 }}>{a.type} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: colors.slate900 }}>Upcoming Events</h4>
          {[
            { title: "Smart Campus Workshop", time: "Today 10:00 AM", loc: "Hall A", type: "Workshop" },
            { title: "Python for AI Bootcamp", time: "Tomorrow 2:00 PM", loc: "Lab 4", type: "Training" },
            { title: "Hackathon Finale", time: "Fri 9:00 AM", loc: "Main Hall", type: "Competition" },
          ].map(e => (
            <div key={e.title} style={{ padding: "12px", borderRadius: 12, background: colors.slate50, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: colors.slate900 }}>{e.title}</div>
                <Badge color="indigo">{e.type}</Badge>
              </div>
              <div style={{ fontSize: 12, color: colors.slate500, marginTop: 4 }}>{e.time} · {e.loc}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── ATTENDANCE PAGE ──────────────────────────────────────────────────────────
function AttendancePage() {
  const { isFaculty, isAdmin } = useAuth();
  const [selectedClass, setSelectedClass] = useState("CN - Sec B");
  const [date, setDate] = useState("2026-05-19");
  const [records, setRecords] = useState([
    { id: 1, name: "Arjun Mehta", roll: "1CS21CS010", status: "present" },
    { id: 2, name: "Sneha Patel", roll: "1CS21CS011", status: "present" },
    { id: 3, name: "Rahul Singh", roll: "1CS21CS012", status: "absent" },
    { id: 4, name: "Priya Iyer", roll: "1CS21CS013", status: "present" },
    { id: 5, name: "Kiran Kumar", roll: "1CS21CS014", status: "absent" },
    { id: 6, name: "Anjali Rao", roll: "1CS21CS015", status: "present" },
  ]);

  const monthData = [
    { month: "Jan", pct: 88 }, { month: "Feb", pct: 91 }, { month: "Mar", pct: 87 },
    { month: "Apr", pct: 93 }, { month: "May", pct: 92 },
  ];

  const toggle = (id) => setRecords(rs => rs.map(r => r.id === id ? { ...r, status: r.status === "present" ? "absent" : "present" } : r));
  const present = records.filter(r => r.status === "present").length;

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: colors.slate900, margin: 0 }}>Attendance Management</h1>
          <p style={{ color: colors.slate500, marginTop: 4 }}>Track and manage campus attendance records</p></div>
        {(isFaculty || isAdmin) && <Btn icon="upload">Export Report</Btn>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: "2rem" }}>
        <StatCard title="Present Today" value={`${present}/${records.length}`} icon="check" color={colors.green} />
        <StatCard title="Attendance %" value={`${Math.round(present / records.length * 100)}%`} icon="chart" color={colors.indigo} />
        <StatCard title="Total Classes" value="48" icon="calendar" color={colors.blue} />
        <StatCard title="Defaulters" value="3" icon="alert" color={colors.red} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <Card>
          <div style={{ display: "flex", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
            {["CN - Sec B", "DBMS - Sec A", "OS - Sec C"].map(c => (
              <button key={c} onClick={() => setSelectedClass(c)} style={{ padding: "6px 16px", borderRadius: 99, border: `1.5px solid ${selectedClass === c ? colors.indigo : colors.slate200}`, background: selectedClass === c ? colors.indigoLight : colors.white, color: selectedClass === c ? colors.indigo : colors.slate600, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{c}</button>
            ))}
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ border: `1.5px solid ${colors.slate200}`, borderRadius: 10, padding: "6px 12px", fontSize: 13, color: colors.slate700 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {records.map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 14, background: r.status === "present" ? colors.greenLight : colors.redLight, border: `1.5px solid ${r.status === "present" ? colors.green + "40" : colors.red + "40"}` }}>
                <AvatarCircle name={r.name} size={36} bg={r.status === "present" ? colors.green + "30" : colors.red + "30"} fg={r.status === "present" ? colors.green : colors.red} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.slate900 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: colors.slate500 }}>{r.roll}</div>
                </div>
                {(isFaculty || isAdmin) && (
                  <button onClick={() => toggle(r.id)} style={{ padding: "4px 10px", borderRadius: 8, border: "none", cursor: "pointer", background: r.status === "present" ? colors.green : colors.red, color: colors.white, fontSize: 12, fontWeight: 700 }}>
                    {r.status === "present" ? "P" : "A"}
                  </button>
                )}
              </div>
            ))}
          </div>

          {(isFaculty || isAdmin) && <div style={{ marginTop: "1.5rem", display: "flex", gap: 10 }}>
            <Btn icon="check" style={{ flex: 1, justifyContent: "center" }}>Save Attendance</Btn>
            <Btn variant="secondary" icon="upload">Export CSV</Btn>
          </div>}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Monthly Trend</h4>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.slate100} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: colors.slate400 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: colors.slate400 }} axisLine={false} tickLine={false} domain={[80, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${colors.slate200}`, fontSize: 12 }} />
                  <Bar dataKey="pct" fill={colors.indigo} radius={[6, 6, 0, 0]} name="Attendance %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>AI Face Detection</h4>
            <div style={{ background: colors.slate50, borderRadius: 14, padding: "1.5rem", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: colors.indigoLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Icon name="eye" size={28} color={colors.indigo} />
              </div>
              <p style={{ fontSize: 13, color: colors.slate600, margin: "0 0 12px", lineHeight: 1.6 }}>Pruned CNN model deployed for real-time face recognition attendance</p>
              <Badge color="green">Model Active · 12ms</Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── LIBRARY PAGE ─────────────────────────────────────────────────────────────
const BOOKS = [
  { id: 1, title: "Deep Learning", author: "Ian Goodfellow", category: "AI/ML", status: "available", rating: 4.9, year: 2016 },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", category: "Software Engineering", status: "borrowed", rating: 4.7, year: 2008 },
  { id: 3, title: "DBMS Fundamentals", author: "Ramez Elmasri", category: "Database", status: "available", rating: 4.5, year: 2019 },
  { id: 4, title: "Operating Systems", author: "Abraham Silberschatz", category: "Systems", status: "available", rating: 4.6, year: 2018 },
  { id: 5, title: "Computer Networks", author: "Andrew Tanenbaum", category: "Networks", status: "borrowed", rating: 4.8, year: 2021 },
  { id: 6, title: "Algorithms", author: "CLRS", category: "CS Theory", status: "available", rating: 4.9, year: 2022 },
  { id: 7, title: "Machine Learning", author: "Tom Mitchell", category: "AI/ML", status: "available", rating: 4.4, year: 2020 },
  { id: 8, title: "System Design", author: "Alex Xu", category: "Architecture", status: "available", rating: 4.8, year: 2020 },
];

function LibraryPage() {
  const { isLibrarian } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [issued, setIssued] = useState({});

  const categories = ["All", ...new Set(BOOKS.map(b => b.category))];
  const filtered = BOOKS.filter(b => (filter === "All" || b.category === filter) && (b.title + b.author).toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: colors.slate900, margin: 0 }}>E-Library</h1>
          <p style={{ color: colors.slate500, marginTop: 4 }}>Digital library with 8,500+ books and research papers</p></div>
        {isLibrarian && <Btn icon="plus" onClick={() => setShowAddModal(true)}>Add Book</Btn>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: "2rem" }}>
        <StatCard title="Total Books" value="8,547" icon="library" color={colors.blue} />
        <StatCard title="Available" value="6,231" icon="check" color={colors.green} />
        <StatCard title="Borrowed" value="2,316" icon="book" color={colors.orange} />
        <StatCard title="E-Books" value="1,840" icon="globe" color={colors.indigo} />
      </div>

      <Card style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 10, background: colors.slate50, border: `1.5px solid ${colors.slate200}`, borderRadius: 12, padding: "10px 14px" }}>
            <Icon name="search" size={16} color={colors.slate400} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search books, authors..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 14, color: colors.slate700, width: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.slice(0, 5).map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{ padding: "8px 16px", borderRadius: 10, border: `1.5px solid ${filter === c ? colors.indigo : colors.slate200}`, background: filter === c ? colors.indigoLight : colors.white, color: filter === c ? colors.indigo : colors.slate600, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{c}</button>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {filtered.map(b => (
          <Card key={b.id}>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 52, height: 68, borderRadius: 10, background: colors.indigoLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="book" size={24} color={colors.indigo} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: colors.slate900, lineHeight: 1.3 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: colors.slate500, marginTop: 2 }}>{b.author} · {b.year}</div>
                <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <Badge color={b.status === "available" ? "green" : "orange"}>{b.status}</Badge>
                  <span style={{ fontSize: 11, color: colors.orange }}>★ {b.rating}</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
              <Btn size="sm" variant={issued[b.id] ? "success" : "primary"} onClick={() => setIssued(p => ({ ...p, [b.id]: !p[b.id] }))} style={{ flex: 1, justifyContent: "center" }}>
                {issued[b.id] ? "Return" : b.status === "available" ? "Issue" : "Reserve"}
              </Btn>
              <Btn size="sm" variant="ghost" icon="eye">Read</Btn>
            </div>
          </Card>
        ))}
      </div>

      {showAddModal && (
        <Modal title="Add New Book" onClose={() => setShowAddModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Title" value="" onChange={() => {}} placeholder="Book title" />
            <Input label="Author" value="" onChange={() => {}} placeholder="Author name" />
            <Input label="Category" value="" onChange={() => {}} placeholder="Category" />
            <Input label="ISBN" value="" onChange={() => {}} placeholder="ISBN number" />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <Btn variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Btn>
              <Btn onClick={() => setShowAddModal(false)}>Add Book</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── EVENTS PAGE ──────────────────────────────────────────────────────────────
const EVENTS = [
  { id: 1, title: "Smart Campus AI Workshop", date: "2026-05-22", time: "10:00 AM", loc: "Hall A", type: "Workshop", organizer: "AI&DS Dept", seats: 80, registered: 62 },
  { id: 2, title: "Python for Data Science Bootcamp", date: "2026-05-24", time: "2:00 PM", loc: "Lab 4", type: "Training", organizer: "CSE Dept", seats: 40, registered: 39 },
  { id: 3, title: "Hackathon 2026 - EduTech Edition", date: "2026-05-30", time: "9:00 AM", loc: "Main Hall", type: "Competition", organizer: "Student Council", seats: 200, registered: 145 },
  { id: 4, title: "Research Paper Presentation", date: "2026-06-05", time: "11:00 AM", loc: "Seminar Hall B", type: "Academic", organizer: "Research Cell", seats: 60, registered: 28 },
  { id: 5, title: "Campus Recruitment Drive - TCS", date: "2026-06-10", time: "8:30 AM", loc: "Placement Hall", type: "Placement", organizer: "Placement Cell", seats: 150, registered: 98 },
];

function EventsPage() {
  const { isFaculty, isAdmin } = useAuth();
  const [registered, setRegistered] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [tab, setTab] = useState("upcoming");
  const typeColor = { Workshop: "blue", Training: "green", Competition: "orange", Academic: "indigo", Placement: "purple" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: colors.slate900, margin: 0 }}>Event Hub</h1>
          <p style={{ color: colors.slate500, marginTop: 4 }}>Campus events, workshops, and competitions</p></div>
        {(isFaculty || isAdmin) && <Btn icon="plus" onClick={() => setShowCreate(true)}>Create Event</Btn>}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        {["upcoming", "registered", "past"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 20px", borderRadius: 10, border: `1.5px solid ${tab === t ? colors.indigo : colors.slate200}`, background: tab === t ? colors.indigoLight : colors.white, color: tab === t ? colors.indigo : colors.slate600, cursor: "pointer", fontWeight: 600, fontSize: 14, textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {EVENTS.map(e => {
          const pct = Math.round(e.registered / e.seats * 100);
          return (
            <Card key={e.id}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Badge color={typeColor[e.type] || "indigo"}>{e.type}</Badge>
                    {e.registered / e.seats > 0.9 && <Badge color="red">Almost Full</Badge>}
                  </div>
                  <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: colors.slate900 }}>{e.title}</h3>
                  <div style={{ display: "flex", gap: 20, fontSize: 13, color: colors.slate500 }}>
                    <span>📅 {e.date}</span>
                    <span>🕐 {e.time}</span>
                    <span>📍 {e.loc}</span>
                    <span>👤 {e.organizer}</span>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: colors.slate500, marginBottom: 4 }}>
                      <span>Registrations</span><span>{e.registered}/{e.seats}</span>
                    </div>
                    <div style={{ background: colors.slate100, borderRadius: 99, height: 6, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: pct > 90 ? colors.red : pct > 70 ? colors.orange : colors.green, borderRadius: 99 }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
                  <Btn icon={registered[e.id] ? "check" : "ticket"} variant={registered[e.id] ? "success" : "primary"} onClick={() => setRegistered(p => ({ ...p, [e.id]: !p[e.id] }))}>
                    {registered[e.id] ? "Registered ✓" : "Register"}
                  </Btn>
                  {registered[e.id] && <Btn variant="ghost" size="sm">View Ticket</Btn>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {showCreate && (
        <Modal title="Create New Event" onClose={() => setShowCreate(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Event Title" value="" onChange={() => {}} placeholder="e.g., AI Workshop 2026" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Date" value="" onChange={() => {}} type="date" />
              <Input label="Time" value="" onChange={() => {}} type="time" />
            </div>
            <Input label="Location" value="" onChange={() => {}} placeholder="Hall, Room, Lab..." />
            <Input label="Max Seats" value="" onChange={() => {}} type="number" placeholder="100" />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Btn>
              <Btn onClick={() => setShowCreate(false)}>Create Event</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── RESOURCES PAGE ───────────────────────────────────────────────────────────
const RESOURCES = [
  { id: 1, title: "Computer Networks - Unit 3 Notes", type: "notes", subject: "CN", sem: 5, uploaded: "Prof. Ananya", size: "2.4 MB", date: "2026-05-17" },
  { id: 2, title: "Discrete Math PYQ 2025", type: "pyq", subject: "Discrete Math", sem: 3, uploaded: "Prof. Ravi", size: "1.1 MB", date: "2026-05-15" },
  { id: 3, title: "DBMS Assignment 3", type: "assignment", subject: "DBMS", sem: 4, uploaded: "Prof. Nair", size: "450 KB", date: "2026-05-14" },
  { id: 4, title: "AI Ethics Case Study", type: "notes", subject: "AI Ethics", sem: 6, uploaded: "Prof. Ananya", size: "3.1 MB", date: "2026-05-12" },
  { id: 5, title: "OS Previous Year 2024", type: "pyq", subject: "OS", sem: 4, uploaded: "Prof. Gopal", size: "1.8 MB", date: "2026-05-10" },
  { id: 6, title: "ML Lab Manual 2026", type: "notes", subject: "ML", sem: 6, uploaded: "Prof. Ananya", size: "5.2 MB", date: "2026-05-09" },
];

function ResourcesPage() {
  const { isFaculty, isAdmin } = useAuth();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const typeColor = { notes: "blue", pyq: "green", assignment: "orange" };

  const filtered = RESOURCES.filter(r => (filter === "all" || r.type === filter) && (r.title + r.subject).toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: colors.slate900, margin: 0 }}>Academic Resources</h1>
          <p style={{ color: colors.slate500, marginTop: 4 }}>Notes, PYQs, assignments, and study materials</p></div>
        {(isFaculty || isAdmin) && <Btn icon="upload">Upload Resource</Btn>}
      </div>

      <Card style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 10, background: colors.slate50, border: `1.5px solid ${colors.slate200}`, borderRadius: 12, padding: "10px 14px" }}>
            <Icon name="search" size={16} color={colors.slate400} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 14, width: "100%" }} />
          </div>
          {["all", "notes", "pyq", "assignment"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 18px", borderRadius: 10, border: `1.5px solid ${filter === f ? colors.indigo : colors.slate200}`, background: filter === f ? colors.indigoLight : colors.white, color: filter === f ? colors.indigo : colors.slate600, cursor: "pointer", fontWeight: 600, fontSize: 13, textTransform: "uppercase" }}>{f}</button>
          ))}
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(r => (
          <Card key={r.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "1rem 1.5rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: (typeColor[r.type] === "blue" ? colors.blueLight : typeColor[r.type] === "green" ? colors.greenLight : colors.orangeLight), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="book" size={20} color={typeColor[r.type] === "blue" ? colors.blue : typeColor[r.type] === "green" ? colors.green : "#b45309"} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: colors.slate900 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: colors.slate500, marginTop: 2 }}>{r.subject} · Sem {r.sem} · {r.uploaded} · {r.date}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Badge color={typeColor[r.type] || "indigo"}>{r.type.toUpperCase()}</Badge>
              <span style={{ fontSize: 12, color: colors.slate400 }}>{r.size}</span>
              <Btn size="sm" icon="download" variant="ghost">Download</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── MARKS PAGE ───────────────────────────────────────────────────────────────
function MarksPage() {
  const markData = [
    { subject: "Computer Networks", cia1: 28, cia2: 26, see: 68, total: 74, grade: "A" },
    { subject: "DBMS", cia1: 30, cia2: 29, see: 72, total: 79, grade: "A+" },
    { subject: "Discrete Math", cia1: 22, cia2: 25, see: 60, total: 66, grade: "B+" },
    { subject: "Operating Systems", cia1: 27, cia2: 28, see: 65, total: 72, grade: "A" },
    { subject: "AI Fundamentals", cia1: 29, cia2: 30, see: 74, total: 80, grade: "A+" },
  ];
  const semGPA = [
    { sem: "S1", gpa: 7.8 }, { sem: "S2", gpa: 8.1 }, { sem: "S3", gpa: 8.3 }, { sem: "S4", gpa: 8.5 }, { sem: "S5", gpa: 8.6 },
  ];
  const gradeColor = { "A+": colors.green, "A": colors.indigo, "B+": colors.blue, "B": colors.orange };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: colors.slate900, margin: 0 }}>Marks & GPA</h1>
        <p style={{ color: colors.slate500, marginTop: 4 }}>Academic performance overview — Semester 5</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: "2rem" }}>
        <StatCard title="CGPA" value="8.66" icon="award" color={colors.indigo} delta="0.2" />
        <StatCard title="Current Sem GPA" value="8.60" icon="chart" color={colors.green} />
        <StatCard title="Backlogs" value="0" icon="check" color={colors.green} />
        <StatCard title="Class Rank" value="#12" icon="trending_up" color={colors.blue} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: "2rem" }}>
        <Card>
          <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>GPA Trend</h4>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={semGPA}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.slate100} vertical={false} />
                <XAxis dataKey="sem" tick={{ fontSize: 11, fill: colors.slate400 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: colors.slate400 }} axisLine={false} tickLine={false} domain={[7, 10]} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: `1px solid ${colors.slate200}` }} />
                <Line type="monotone" dataKey="gpa" stroke={colors.indigo} strokeWidth={3} dot={{ r: 5, fill: colors.indigo }} name="GPA" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Subject Performance</h4>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={markData.map(m => ({ name: m.subject.split(" ")[0], total: m.total }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.slate100} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: colors.slate400 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: colors.slate400 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: `1px solid ${colors.slate200}` }} />
                <Bar dataKey="total" fill={colors.indigo} radius={[6, 6, 0, 0]} name="Total %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Detailed Marks</h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Subject", "CIA 1 /30", "CIA 2 /30", "SEE /100", "Total %", "Grade"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 12, fontWeight: 700, color: colors.slate500, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${colors.slate100}` }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {markData.map(m => (
                <tr key={m.subject}>
                  {[m.subject, m.cia1, m.cia2, m.see, m.total + "%", <span key="grade" style={{ fontWeight: 800, color: gradeColor[m.grade] || colors.slate600 }}>{m.grade}</span>].map((v, i) => (
                    <td key={i} style={{ padding: "12px", fontSize: 14, borderBottom: `1px solid ${colors.slate50}`, color: colors.slate800 }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── FORUM PAGE ───────────────────────────────────────────────────────────────
function ForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([
    { id: 1, title: "What's the difference between TCP and UDP?", body: "I'm confused about when to use which one...", author: "Anonymous", subject: "CN", votes: 14, answers: 3, solved: true, anon: true, time: "2h ago" },
    { id: 2, title: "How to normalize a database to 3NF?", body: "I have a relation with transitive dependencies...", author: "Arjun M.", subject: "DBMS", votes: 8, answers: 2, solved: false, anon: false, time: "5h ago" },
    { id: 3, title: "Explain process scheduling in OS", body: "What are the different scheduling algorithms?", author: "Anonymous", subject: "OS", votes: 21, answers: 5, solved: true, anon: true, time: "Yesterday" },
  ]);
  const [showPost, setShowPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", subject: "", anon: false });

  const addPost = () => {
    if (!newPost.title) return;
    setPosts(p => [{ id: Date.now(), ...newPost, author: newPost.anon ? "Anonymous" : user?.name, votes: 0, answers: 0, solved: false, time: "Just now" }, ...p]);
    setNewPost({ title: "", body: "", subject: "", anon: false });
    setShowPost(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: colors.slate900, margin: 0 }}>Doubt Forum</h1>
          <p style={{ color: colors.slate500, marginTop: 4 }}>Academic discussions · post anonymously or with identity</p></div>
        <Btn icon="plus" onClick={() => setShowPost(true)}>Ask Doubt</Btn>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {posts.map(p => (
          <Card key={p.id}>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 44 }}>
                <button style={{ background: colors.slate50, border: `1px solid ${colors.slate200}`, borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 13, fontWeight: 700, color: colors.slate600 }}>↑</button>
                <span style={{ fontWeight: 800, fontSize: 16, color: colors.indigo }}>{p.votes}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                  {p.solved && <Badge color="green">Solved</Badge>}
                  <Badge color="blue">{p.subject}</Badge>
                  {p.anon && <Badge color="orange">Anonymous</Badge>}
                </div>
                <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: colors.slate900 }}>{p.title}</h3>
                <p style={{ margin: "0 0 10px", fontSize: 14, color: colors.slate600 }}>{p.body}</p>
                <div style={{ fontSize: 12, color: colors.slate400 }}>{p.author} · {p.time} · {p.answers} answers</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showPost && (
        <Modal title="Ask a Doubt" onClose={() => setShowPost(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Question" value={newPost.title} onChange={v => setNewPost(p => ({ ...p, title: v }))} placeholder="What would you like to know?" />
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: colors.slate600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Details</label>
              <textarea value={newPost.body} onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))} placeholder="Describe your doubt in detail..." style={{ border: `1.5px solid ${colors.slate200}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, color: colors.slate800, width: "100%", minHeight: 80, resize: "vertical", boxSizing: "border-box", outline: "none", background: colors.slate50 }} />
            </div>
            <Input label="Subject" value={newPost.subject} onChange={v => setNewPost(p => ({ ...p, subject: v }))} placeholder="e.g., DBMS, CN, OS" />
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: colors.slate700 }}>
              <input type="checkbox" checked={newPost.anon} onChange={e => setNewPost(p => ({ ...p, anon: e.target.checked }))} />
              Post Anonymously
            </label>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setShowPost(false)}>Cancel</Btn>
              <Btn onClick={addPost}>Post Doubt</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── GRIEVANCES PAGE ──────────────────────────────────────────────────────────
function GrievancesPage() {
  const { isAdmin, isFaculty } = useAuth();
  const [complaints, setComplaints] = useState([
    { id: 1, title: "Projector in Lab 3 not working", category: "Infrastructure", status: "open", priority: "medium", time: "2 days ago" },
    { id: 2, title: "Assignment deadline extension request", category: "Academic", status: "resolved", priority: "low", time: "1 week ago" },
    { id: 3, title: "Hostel maintenance issue - Block C", category: "Hostel", status: "in-progress", priority: "high", time: "3 days ago" },
  ]);
  const [showNew, setShowNew] = useState(false);
  const [newC, setNewC] = useState({ title: "", category: "Infrastructure", details: "", anon: true });

  const addComplaint = () => {
    if (!newC.title) return;
    setComplaints(p => [{ id: Date.now(), ...newC, status: "open", priority: "medium", time: "Just now" }, ...p]);
    setNewC({ title: "", category: "Infrastructure", details: "", anon: true });
    setShowNew(false);
  };

  const statusColor = { open: "red", "in-progress": "orange", resolved: "green" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: colors.slate900, margin: 0 }}>Grievance System</h1>
          <p style={{ color: colors.slate500, marginTop: 4 }}>Submit and track campus complaints anonymously</p></div>
        {!isAdmin && <Btn icon="plus" onClick={() => setShowNew(true)}>Raise Complaint</Btn>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: "2rem" }}>
        <StatCard title="Open" value={complaints.filter(c => c.status === "open").length} icon="alert" color={colors.red} />
        <StatCard title="In Progress" value={complaints.filter(c => c.status === "in-progress").length} icon="trending_up" color={colors.orange} />
        <StatCard title="Resolved" value={complaints.filter(c => c.status === "resolved").length} icon="check" color={colors.green} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {complaints.map(c => (
          <Card key={c.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  <Badge color={statusColor[c.status]}>{c.status}</Badge>
                  <Badge color="blue">{c.category}</Badge>
                  <Badge color={c.priority === "high" ? "red" : c.priority === "medium" ? "orange" : "green"}>{c.priority} priority</Badge>
                </div>
                <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: colors.slate900 }}>{c.title}</h3>
                <div style={{ fontSize: 12, color: colors.slate500 }}>{c.time}</div>
              </div>
              {(isAdmin || isFaculty) && (
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn size="sm" variant="ghost" icon="edit">Update</Btn>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {showNew && (
        <Modal title="Raise a Complaint" onClose={() => setShowNew(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Subject" value={newC.title} onChange={v => setNewC(p => ({ ...p, title: v }))} placeholder="Brief description of the issue" />
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: colors.slate600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Category</label>
              <select value={newC.category} onChange={e => setNewC(p => ({ ...p, category: e.target.value }))} style={{ border: `1.5px solid ${colors.slate200}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, width: "100%", outline: "none", background: colors.slate50 }}>
                {["Academic", "Infrastructure", "Faculty Concern", "Technical", "Hostel", "Harassment"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: colors.slate600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Details</label>
              <textarea value={newC.details} onChange={e => setNewC(p => ({ ...p, details: e.target.value }))} placeholder="Describe the issue in detail..." style={{ border: `1.5px solid ${colors.slate200}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, width: "100%", minHeight: 80, resize: "vertical", boxSizing: "border-box", outline: "none", background: colors.slate50 }} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: colors.slate700 }}>
              <input type="checkbox" checked={newC.anon} onChange={e => setNewC(p => ({ ...p, anon: e.target.checked }))} />
              Submit Anonymously
            </label>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setShowNew(false)}>Cancel</Btn>
              <Btn onClick={addComplaint}>Submit Complaint</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── COMMUNITY PAGE ───────────────────────────────────────────────────────────
const DEPTS = ["AI & DS", "AIML", "CSE", "ISE", "ECE", "EEE", "Mechanical", "Civil", "Architecture", "Fashion Design", "MBA", "MCA", "Biotechnology", "Commerce"];

function CommunityPage() {
  const [active, setActive] = useState("CSE");
  const [posts, setPosts] = useState([
    { id: 1, author: "Rahul Kumar", avatar: "RK", text: "Just got placed at Google! 🎉 Prep hard, it's worth it.", time: "30 min ago", likes: 42 },
    { id: 2, author: "Placement Cell", avatar: "PC", text: "TCS recruitment drive on June 10. Register by June 5!", time: "2h ago", likes: 28 },
    { id: 3, author: "Prof. Ananya", avatar: "PA", text: "Shared: Semester 6 Exam Timetable is now live. Check the notice board.", time: "5h ago", likes: 15 },
  ]);
  const [newMsg, setNewMsg] = useState("");

  const addPost = () => {
    if (!newMsg.trim()) return;
    setPosts(p => [{ id: Date.now(), author: "You", avatar: "ME", text: newMsg, time: "Just now", likes: 0 }, ...p]);
    setNewMsg("");
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: colors.slate900, margin: 0 }}>Department Communities</h1>
        <p style={{ color: colors.slate500, marginTop: 4 }}>Connect with your department · {DEPTS.length} communities active</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1.5rem" }}>
        {DEPTS.map((d, i) => (
          <button key={d} onClick={() => setActive(d)} style={{ padding: "8px 16px", borderRadius: 99, border: `1.5px solid ${active === d ? colors.indigo : colors.slate200}`, background: active === d ? colors.indigoLight : colors.white, color: active === d ? colors.indigo : colors.slate600, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{d}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <AvatarCircle name="ME" size={38} />
              <div style={{ flex: 1 }}>
                <textarea value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder={`Post to ${active} community...`} style={{ border: `1.5px solid ${colors.slate200}`, borderRadius: 12, padding: "10px 14px", fontSize: 14, width: "100%", minHeight: 64, resize: "none", boxSizing: "border-box", outline: "none", background: colors.slate50 }} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <Btn size="sm" onClick={addPost}>Post</Btn>
                </div>
              </div>
            </div>
          </Card>

          {posts.map(p => (
            <Card key={p.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <AvatarCircle name={p.avatar} size={38} bg={colors.indigoLight} fg={colors.indigo} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: colors.slate900 }}>{p.author}</div>
                    <span style={{ fontSize: 12, color: colors.slate400 }}>{p.time}</span>
                  </div>
                  <p style={{ margin: "6px 0 10px", fontSize: 14, color: colors.slate700, lineHeight: 1.6 }}>{p.text}</p>
                  <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: colors.slate500, fontWeight: 600 }}>♥ {p.likes}</button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <h4 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>{active} Community</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              {[["Members", "487"], ["Faculty", "12"], ["Posts this week", "34"], ["Active now", "28"]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${colors.slate100}` }}>
                  <span style={{ color: colors.slate500 }}>{l}</span>
                  <span style={{ fontWeight: 700, color: colors.slate900 }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>Tags</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["#placement", "#academics", "#events", "#pyqs", "#projects", "#internship"].map(t => (
                <span key={t} style={{ background: colors.slate100, color: colors.slate600, padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── RESEARCH PAGE ────────────────────────────────────────────────────────────
function ResearchPage() {
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const radarData = [
    { metric: "Memory", baseline: 100, pruned: 31 },
    { metric: "CPU", baseline: 100, pruned: 38 },
    { metric: "Accuracy", baseline: 95, pruned: 94.2 },
    { metric: "Latency", baseline: 100, pruned: 26 },
    { metric: "Size", baseline: 100, pruned: 32 },
  ];

  const layerData = [
    { layer: "L1", original: 512, pruned: 180 },
    { layer: "L2", original: 256, pruned: 78 },
    { layer: "L3", original: 128, pruned: 32 },
    { layer: "L4", original: 64, pruned: 18 },
    { layer: "L5", original: 32, pruned: 10 },
  ];

  const askAI = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true); setAiResponse("");
    const context = "You are an expert in neural network optimization and neuron pruning. EduSync is a smart campus management system whose research uses HNIS (Hierarchical Neuron Importance Scoring) — combining activation magnitude, gradient flow, and Granger causality — to prune 73.6% of parameters with only 0.8% accuracy drop, achieving 3.8x faster inference. Answer concisely and technically.";
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer sk-or-v1-free", "HTTP-Referer": window.location.origin },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            { role: "system", content: context },
            { role: "user", content: aiQuery }
          ],
        }),
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) { setAiResponse(text); }
      else { throw new Error("empty"); }
    } catch {
      // Fallback: rule-based local responses
      const q = aiQuery.toLowerCase();
      if (q.includes("hnis") || q.includes("hierarchical")) {
        setAiResponse("HNIS (Hierarchical Neuron Importance Score) = |activation magnitude| + gradient flow weight + Granger causality coefficient. This composite score ranks each neuron by its true contribution to model output, allowing safe removal of low-scoring neurons without significant accuracy loss.");
      } else if (q.includes("pruning") || q.includes("prune")) {
        setAiResponse("Neuron pruning removes redundant neurons from a trained neural network. EduSync uses iterative structured pruning: prune → fine-tune → repeat. Each cycle removes neurons with the lowest HNIS scores. After 5 cycles, 73.6% of parameters are removed while retaining 94.2% accuracy.");
      } else if (q.includes("granger")) {
        setAiResponse("Granger causality measures whether one neuron's past activations help predict another's future activations. In HNIS, it identifies neurons that causally influence downstream layers — these are preserved during pruning to maintain information flow.");
      } else if (q.includes("accuracy") || q.includes("performance")) {
        setAiResponse("EduSync's pruned model retains 94.2% validation accuracy (vs 95% baseline) — only a 0.8% drop. Inference time drops from 45ms to 12ms (3.8× speedup). Model size reduces by 68%, enabling deployment on edge devices for real-time face attendance.");
      } else if (q.includes("attendance") || q.includes("face")) {
        setAiResponse("The pruned CNN model is deployed in EduSync's face attendance pipeline. It runs at 12ms per inference (vs 45ms original), enabling smooth 30fps face tracking on mobile/edge hardware. The model uses VGG16 architecture pruned via HNIS across 5 convolutional layers.");
      } else if (q.includes("vgg") || q.includes("architecture")) {
        setAiResponse("EduSync uses a pruned VGG16 architecture. Original: 138M parameters, 22.5MB. After HNIS pruning: ~36M parameters, 7.2MB. The fully-connected layers see the most pruning (up to 85%), while early conv layers are pruned conservatively to preserve low-level feature extraction.");
      } else {
        setAiResponse("EduSync's AI Research module demonstrates that neural networks can be significantly compressed using HNIS-based neuron pruning. Key results: 73.6% parameter reduction, 94.2% accuracy retained, 3.8× inference speedup, 68% model size reduction. The technique combines magnitude pruning with Granger causality analysis for smarter neuron selection.");
      }
    } finally { setAiLoading(false); }
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: colors.indigoLight, color: colors.indigo, padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <Icon name="flask" size={14} color={colors.indigo} /> Research Publication
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: colors.slate900, margin: "0 0 8px" }}>Improving Neural Network Efficiency Using Neuron Pruning</h1>
        <p style={{ color: colors.slate500 }}>Applied research extending into real-world campus AI deployment</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: "2rem" }}>
        {[["73.6%", "Parameters Pruned", colors.indigo], ["94.2%", "Accuracy Retained", colors.green], ["3.8×", "Inference Speed", colors.orange], ["68%", "Model Size Reduction", colors.blue]].map(([v, l, c]) => (
          <Card key={l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: c }}>{v}</div>
            <div style={{ fontSize: 12, color: colors.slate500, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>{l}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: "2rem" }}>
        <Card>
          <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Layer-wise Neuron Reduction</h4>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={layerData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.slate100} vertical={false} />
                <XAxis dataKey="layer" tick={{ fontSize: 11, fill: colors.slate400 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: colors.slate400 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: `1px solid ${colors.slate200}` }} />
                <Bar dataKey="original" fill={colors.slate200} radius={[4, 4, 0, 0]} name="Original Neurons" />
                <Bar dataKey="pruned" fill={colors.indigo} radius={[4, 4, 0, 0]} name="After HNIS Pruning" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, background: colors.slate200, display: "block", borderRadius: 2 }} />Original</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, background: colors.indigo, display: "block", borderRadius: 2 }} />After Pruning</span>
          </div>
        </Card>

        <Card>
          <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Performance Comparison</h4>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke={colors.slate100} />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: colors.slate500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 110]} tick={{ fontSize: 9, fill: colors.slate300 }} />
                <Radar name="Baseline" dataKey="baseline" stroke={colors.slate400} fill={colors.slate400} fillOpacity={0.2} />
                <Radar name="Pruned (HNIS)" dataKey="pruned" stroke={colors.indigo} fill={colors.indigo} fillOpacity={0.3} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Key Concepts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: "2rem" }}>
        {[
          { title: "HNIS Formula", icon: "cpu", color: colors.indigo, desc: "Hierarchical Neuron Importance Score combines |activation magnitude| + gradient flow weight + Granger causality coefficient to rank neurons for pruning." },
          { title: "Granger Causality", icon: "trending_up", color: colors.green, desc: "Applied as inter-neuron dependency analysis to identify neurons that causally influence others, preserving essential information pathways." },
          { title: "Iterative Fine-tuning", icon: "layers", color: colors.orange, desc: "After each pruning round, the model is fine-tuned for 5 epochs to recover lost accuracy before the next pruning cycle begins." },
        ].map(c => (
          <Card key={c.title}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.color + "20", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon name={c.icon} size={22} color={c.color} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: colors.slate900, marginBottom: 6 }}>{c.title}</div>
            <p style={{ fontSize: 13, color: colors.slate600, lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
          </Card>
        ))}
      </div>

      {/* AI Research Assistant */}
      <Card style={{ background: colors.slate900 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, color: colors.indigo }}>
          <Icon name="robot" size={20} color={colors.indigo} />
          <span style={{ fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", color: colors.indigo }}>AI Research Assistant</span>
          <Badge color="indigo">Mistral 7B · Free</Badge>
        </div>
        <p style={{ color: colors.slate400, fontSize: 14, marginBottom: 16 }}>Ask questions about neuron pruning, HNIS, or how EduSync applies AI optimization:</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input value={aiQuery} onChange={e => setAiQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && askAI()} placeholder="e.g., Explain the HNIS formula in detail..." style={{ flex: 1, border: `1px solid ${colors.slate600}`, borderRadius: 12, padding: "10px 14px", fontSize: 14, background: colors.slate800, color: colors.white, outline: "none" }} />
          <Btn onClick={askAI} disabled={aiLoading}>{aiLoading ? "Thinking..." : "Ask"}</Btn>
        </div>
        {aiResponse && (
          <div style={{ background: colors.slate800, borderRadius: 14, padding: "1rem 1.25rem", fontSize: 14, color: colors.slate200, lineHeight: 1.7, maxHeight: 280, overflowY: "auto", whiteSpace: "pre-wrap" }}>
            {aiResponse}
          </div>
        )}
        {!aiResponse && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["What is neuron pruning?", "How does HNIS differ from magnitude pruning?", "How is EduSync attendance AI deployed?"].map(q => (
              <button key={q} onClick={() => setAiQuery(q)} style={{ background: colors.slate800, border: `1px solid ${colors.slate600}`, borderRadius: 99, padding: "6px 14px", color: colors.slate300, fontSize: 12, cursor: "pointer", fontWeight: 500 }}>{q}</button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── NOTIFICATIONS PAGE ────────────────────────────────────────────────────────
function NotificationsPage() {
  const [notifs, setNotifs] = useState([
    { id: 1, title: "Assignment Due: DBMS Project", message: "Your DBMS project is due in 48 hours. Submit via portal.", type: "warning", read: false, time: "30 min ago" },
    { id: 2, title: "Attendance Alert", message: "Your CN attendance dropped below 75%. Please attend upcoming classes.", type: "error", read: false, time: "2h ago" },
    { id: 3, title: "Event Registration Confirmed", message: "You're registered for Python Bootcamp on May 24.", type: "success", read: true, time: "Yesterday" },
    { id: 4, title: "New Resource Uploaded", message: "Prof. Ananya uploaded OS Unit 5 notes.", type: "info", read: true, time: "2 days ago" },
    { id: 5, title: "Grievance Update", message: "Your complaint about Lab 3 projector has been resolved.", type: "success", read: false, time: "3 days ago" },
  ]);

  const typeStyle = { info: [colors.blueLight, colors.blue, "info"], warning: [colors.orangeLight, "#b45309", "alert"], error: [colors.redLight, colors.red, "alert"], success: [colors.greenLight, colors.green, "check"] };
  const markAll = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: colors.slate900, margin: 0 }}>Notifications</h1>
          <p style={{ color: colors.slate500, marginTop: 4 }}>{notifs.filter(n => !n.read).length} unread notifications</p></div>
        <Btn variant="ghost" onClick={markAll}>Mark all read</Btn>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {notifs.map(n => {
          const [bg, fg, icon] = typeStyle[n.type] || typeStyle.info;
          return (
            <div key={n.id} onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))} style={{ background: n.read ? colors.white : bg + "80", border: `1px solid ${n.read ? colors.slate200 : fg + "40"}`, borderRadius: 16, padding: "1rem 1.25rem", cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={icon} size={18} color={fg} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontWeight: n.read ? 600 : 700, fontSize: 14, color: colors.slate900 }}>{n.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {!n.read && <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors.indigo, display: "block" }} />}
                    <span style={{ fontSize: 12, color: colors.slate400 }}>{n.time}</span>
                  </div>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: colors.slate600, lineHeight: 1.5 }}>{n.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ANALYTICS PAGE (Admin) ───────────────────────────────────────────────────
function AnalyticsPage() {
  const deptData = [
    { dept: "CSE", students: 480, attendance: 91 },
    { dept: "AI&DS", students: 320, attendance: 89 },
    { dept: "ECE", students: 290, attendance: 87 },
    { dept: "ISE", students: 180, attendance: 92 },
    { dept: "AIML", students: 220, attendance: 90 },
  ];
  const pieData = [{ name: "Students", value: 2418 }, { name: "Faculty", value: 148 }, { name: "Staff", value: 210 }];
  const PIE_COLORS = [colors.indigo, colors.green, colors.orange];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: colors.slate900, margin: 0 }}>System Analytics</h1>
        <p style={{ color: colors.slate500, marginTop: 4 }}>Campus-wide performance and usage metrics</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: "2rem" }}>
        <StatCard title="Total Users" value="2,776" icon="users" color={colors.indigo} delta="3.2%" />
        <StatCard title="Avg Attendance" value="89.7%" icon="check" color={colors.green} delta="1.2%" />
        <StatCard title="Resources" value="1,247" icon="book" color={colors.blue} delta="48" />
        <StatCard title="Active Events" value="12" icon="calendar" color={colors.orange} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Dept. Attendance Rate</h4>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={colors.slate100} />
                <XAxis type="number" tick={{ fontSize: 11, fill: colors.slate400 }} domain={[80, 100]} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="dept" tick={{ fontSize: 12, fill: colors.slate500 }} axisLine={false} tickLine={false} width={45} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: `1px solid ${colors.slate200}` }} />
                <Bar dataKey="attendance" fill={colors.indigo} radius={[0, 6, 6, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>User Distribution</h4>
          <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PieChart width={200} height={200}>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 12 }}>
            {pieData.map((d, i) => <span key={d.name} style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: PIE_COLORS[i], display: "block" }} />{d.name}: {d.value}</span>)}
          </div>
        </Card>

        <Card style={{ gridColumn: "1 / -1" }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Weekly System Usage</h4>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.indigo} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={colors.indigo} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.slate100} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: colors.slate400 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: colors.slate400 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: `1px solid ${colors.slate200}` }} />
                <Area type="monotone" dataKey="attendance" stroke={colors.indigo} strokeWidth={2.5} fill="url(#g2)" name="Active Users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── USER MANAGEMENT (Admin) ──────────────────────────────────────────────────
function UsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: "Arjun Mehta", email: "arjun@edusync.edu", role: "student", dept: "CSE", status: "active" },
    { id: 2, name: "Prof. Ananya Sharma", email: "ananya@edusync.edu", role: "faculty", dept: "AI&DS", status: "active" },
    { id: 3, name: "Sneha Patel", email: "sneha@edusync.edu", role: "student", dept: "AIML", status: "active" },
    { id: 4, name: "Ms. Priya Nair", email: "priya@edusync.edu", role: "librarian", dept: "Library", status: "active" },
    { id: 5, name: "Rahul Singh", email: "rahul@edusync.edu", role: "student", dept: "ECE", status: "inactive" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const roleColor = { student: "green", faculty: "blue", admin: "red", librarian: "purple" };

  const filtered = users.filter(u => (u.name + u.email + u.role).toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: colors.slate900, margin: 0 }}>User Management</h1></div>
        <Btn icon="plus" onClick={() => setShowAdd(true)}>Add User</Btn>
      </div>

      <Card style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: colors.slate50, border: `1.5px solid ${colors.slate200}`, borderRadius: 12, padding: "10px 14px" }}>
          <Icon name="search" size={16} color={colors.slate400} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 14, flex: 1 }} />
        </div>
      </Card>

      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["User", "Email", "Role", "Department", "Status", "Actions"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 12, fontWeight: 700, color: colors.slate500, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${colors.slate100}` }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${colors.slate50}` }}>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <AvatarCircle name={u.name} size={32} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: colors.slate900 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px", fontSize: 13, color: colors.slate600 }}>{u.email}</td>
                <td style={{ padding: "12px" }}><Badge color={roleColor[u.role]}>{u.role}</Badge></td>
                <td style={{ padding: "12px", fontSize: 13, color: colors.slate600 }}>{u.dept}</td>
                <td style={{ padding: "12px" }}><Badge color={u.status === "active" ? "green" : "orange"}>{u.status}</Badge></td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn size="sm" variant="ghost" icon="edit">Edit</Btn>
                    <Btn size="sm" variant="danger" icon="trash" onClick={() => setUsers(us => us.filter(x => x.id !== u.id))}>Del</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showAdd && (
        <Modal title="Add New User" onClose={() => setShowAdd(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Full Name" value="" onChange={() => {}} placeholder="Full name" />
            <Input label="Email" value="" onChange={() => {}} placeholder="email@edusync.edu" type="email" />
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: colors.slate600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Role</label>
              <select style={{ border: `1.5px solid ${colors.slate200}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, width: "100%", outline: "none", background: colors.slate50 }}>
                {["student", "faculty", "admin", "librarian"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
              <Btn onClick={() => setShowAdd(false)}>Add User</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── DEPARTMENTS PAGE ─────────────────────────────────────────────────────────
function DepartmentsPage() {
  const depts = DEPTS.map((d, i) => ({ name: d, students: [480, 320, 360, 180, 220, 160, 240, 190, 80, 60, 120, 90, 70, 110][i], faculty: [18, 12, 16, 10, 14, 9, 12, 8, 5, 4, 8, 6, 5, 7][i], attendance: [91, 89, 92, 87, 90, 88, 85, 86, 84, 83, 91, 88, 87, 89][i] }));
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: colors.slate900, margin: 0 }}>Department Management</h1>
        <p style={{ color: colors.slate500, marginTop: 4 }}>{depts.length} departments · {depts.reduce((s, d) => s + d.students, 0).toLocaleString()} total students</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {depts.map((d, i) => (
          <Card key={d.name}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: [colors.indigoLight, colors.greenLight, colors.blueLight, colors.purpleLight, colors.orangeLight][i % 5], display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="layers" size={20} color={[colors.indigo, colors.green, colors.blue, colors.purple, "#b45309"][i % 5]} />
              </div>
              <Badge color="green">{d.attendance}% attendance</Badge>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: colors.slate900, marginBottom: 8 }}>{d.name}</div>
            <div style={{ display: "flex", gap: 16, fontSize: 13, color: colors.slate500 }}>
              <span>{d.students} students</span>
              <span>{d.faculty} faculty</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function AppLayout() {
  const { user, isAdmin, isFaculty, isStudent, isLibrarian } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const pageMap = {
    dashboard: <DashboardPage />,
    attendance: <AttendancePage />,
    library: <LibraryPage />,
    resources: <ResourcesPage />,
    events: <EventsPage />,
    marks: <MarksPage />,
    forum: <ForumPage />,
    grievances: <GrievancesPage />,
    community: <CommunityPage />,
    research: <ResearchPage />,
    notifications: <NotificationsPage />,
    analytics: <AnalyticsPage />,
    users: <UsersPage />,
    departments: <DepartmentsPage />,
    students: <UsersPage />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: colors.slate50, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main style={{ flex: 1, overflowY: "auto", padding: "2rem", minWidth: 0 }}>
        {pageMap[page] || <DashboardPage />}
      </main>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function EduSync() {
  const [view, setView] = useState("home"); // home | auth | app

  return (
    <AuthProvider>
      <AuthGate view={view} setView={setView} />
    </AuthProvider>
  );
}

function AuthGate({ view, setView }) {
  const { user } = useAuth();
  useEffect(() => { if (user && view === "auth") setView("app"); }, [user]);
  if (view === "home") return <HomePage setShowApp={() => setView("auth")} />;
  if (view === "auth" && !user) return <AuthPage onBack={() => setView("home")} />;
  if (user) return <AppLayout />;
  return null;
}
