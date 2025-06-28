import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { Heart, ArrowRight, Database, LogOut } from "lucide-react";
import { supabase } from "./lib/supabase";
import QuestionnaireForm from "./components/QuestionnaireForm";
import TrustSection from "./components/TrustSection";
import HeroSection from "./components/HeroSection";
import WhyChooseSection from "./components/WhyChooseSection";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import AssessmentData from "./components/AssessmentData";
import LoginPage from "./components/LoginPage";
import AboutSection from "./components/AboutSection";
import TreatmentsSection from "./components/TreatmentsSection";
import ConsultationSection from "./components/ConsultationSection";
import BlogSection from "./components/BlogSection";
import BlogPost from "./pages/BlogPost";
import ContactSection from "./components/ContactSection";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  const [session, setSession] = useState<any>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session as any);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session as any);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation
          session={session}
          handleLogout={handleLogout}
          setShowQuestionnaire={setShowQuestionnaire}
        />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/login"
              element={session ? <Navigate to="/admin" /> : <LoginPage />}
            />
            <Route
              path="/admin"
              element={session ? <AssessmentData /> : <Navigate to="/login" />}
            />
            <Route path="/about" element={<AboutSection />} />
            <Route path="/treatments" element={<TreatmentsSection />} />
            <Route path="/how-it-works" element={<HowItWorksSection />} />
            <Route path="/consultation" element={<ConsultationSection />} />
            <Route path="/blog" element={<BlogSection />} />
            <Route path="/blog/:postId" element={<BlogPost />} />
            <Route path="/contact" element={<ContactSection />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/"
              element={
                <>
                  <HeroSection
                    onStartAssessment={() => setShowQuestionnaire(true)}
                  />
                  <WhyChooseSection />
                  <HowItWorksSection />
                  <TestimonialsSection />
                  <TrustSection />
                </>
              }
            />
          </Routes>
        </main>
        <Footer />

        {showQuestionnaire && (
          <QuestionnaireForm onClose={() => setShowQuestionnaire(false)} />
        )}
      </div>
    </Router>
  );
}

export default App