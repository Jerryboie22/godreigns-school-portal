import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Admissions = lazy(() => import("./pages/Admissions"));
const Library = lazy(() => import("./pages/Library"));
const ELearning = lazy(() => import("./pages/ELearning"));  
const SchoolFees = lazy(() => import("./pages/SchoolFees"));
const Portals = lazy(() => import("./pages/Portals"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const SchoolFeesAdmin = lazy(() => import("./pages/SchoolFeesAdmin"));
const AdminPortal = lazy(() => import("./pages/portals/AdminPortal"));
const AdminCMS = lazy(() => import("./pages/AdminCMS"));
const StaffPortal = lazy(() => import("./pages/portals/StaffPortal"));
const ParentPortal = lazy(() => import("./pages/portals/ParentPortal"));
const StudentPortal = lazy(() => import("./pages/portals/StudentPortal"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1">
            <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="text-center"><div className="animate-pulse text-primary font-medium">Loading...</div></div></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/library" element={<Library />} />
              <Route path="/e-learning" element={<ELearning />} />
              <Route path="/school-fees" element={<SchoolFees />} />
              <Route path="/portals" element={<Portals />} />
              <Route path="/login" element={<Login />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/admin/school-fees" element={<SchoolFeesAdmin />} />
              <Route path="/portal/admin" element={<AdminPortal />} />
              <Route path="/portals/admin" element={<AdminPortal />} />
              <Route path="/admin/cms" element={<AdminCMS />} />
              <Route path="/admin-cms" element={<AdminCMS />} />
              <Route path="/portals/staff" element={<StaffPortal />} />
              <Route path="/portals/parent" element={<ParentPortal />} />
              <Route path="/portals/student" element={<StudentPortal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
