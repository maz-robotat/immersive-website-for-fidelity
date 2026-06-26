import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Services from "./pages/Services";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
  { to: "/services", label: "Services" }
];

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex bg-background text-foreground">
        <aside className="w-64 shrink-0 border-r bg-card">
          <div className="h-16 flex items-center px-6 border-b">
            <span className="text-lg font-semibold tracking-tight">Robotat</span>
          </div>
          <nav className="p-3 space-y-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                  (isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container py-8">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
