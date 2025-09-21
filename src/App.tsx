import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Admissions from "./pages/Admissions";
import Library from "./pages/Library";
import ELearning from "./pages/ELearning";
import SchoolFees from "./pages/SchoolFees";
import Portals from "./pages/Portals";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import SchoolFeesAdmin from "./pages/SchoolFeesAdmin";
import AdminPortal from "./pages/portals/AdminPortal";
import FullAdminCMS from "./pages/FullAdminCMS";
import AdminCMS from "./pages/AdminCMS";
import StaffPortal from "./pages/portals/StaffPortal";
import ParentPortal from "./pages/portals/ParentPortal";
import StudentPortal from "./pages/portals/StudentPortal";
import NotFound from "./pages/NotFound";

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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/library" element={<Library />} />
              <Route path="/e-learning" element={<ELearning />} />
              <Route path="/school-fees" element={<SchoolFees />} />
              <Route path="/portals" element={<Portals />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/admin/school-fees" element={<SchoolFeesAdmin />} />
              <Route path="/portal/admin" element={<AdminPortal />} />
              <Route path="/portals/admin" element={<AdminPortal />} />
              <Route path="/admin/cms" element={<AdminCMS />} />
          <Route path="/admin-cms" element={<FullAdminCMS />} />
          <Route path="/admin-cms-legacy" element={<AdminCMS />} />
              <Route path="/portal/staff" element={<StaffPortal />} />
              <Route path="/portal/parent" element={<ParentPortal />} />
              <Route path="/portal/student" element={<StudentPortal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
