import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { FamilySection } from './components/FamilySection';
import { MonthlyChandaSection } from './components/MonthlyChandaSection';
import { EidEventsSection } from './components/EidEventsSection';
import { TrustFundSection } from './components/TrustFundSection';
import { LoginModal } from './components/LoginModal';
import { ProfileModal } from './components/ProfileModal';
import { LiveTreasuryBanner } from './components/LiveTreasuryBanner';
import { Footer } from './components/Footer';

function MainLayout() {
  const [activeTab, setActiveTab] = useState<'family' | 'chanda' | 'eid' | 'trust'>('family');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { currentUser } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-emerald-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Live Automatic Balance Banner */}
        <LiveTreasuryBanner onNavigateTab={setActiveTab} />

        {activeTab === 'family' && (
          <FamilySection onOpenLogin={() => setIsLoginModalOpen(true)} />
        )}

        {activeTab === 'chanda' && <MonthlyChandaSection />}

        {activeTab === 'eid' && <EidEventsSection />}

        {activeTab === 'trust' && <TrustFundSection />}
      </main>

      {/* Footer with mandatory developer credit */}
      <Footer
        onOpenLogin={() => setIsLoginModalOpen(true)}
        setActiveTab={setActiveTab}
      />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
