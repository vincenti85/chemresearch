import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { OverviewTab } from './components/tabs/OverviewTab';
import { MonitoringTab } from './components/tabs/MonitoringTab';
import { ViolationsTab } from './components/tabs/ViolationsTab';
import { CommunityTab } from './components/tabs/CommunityTab';
import { DataGuideTab } from './components/tabs/DataGuideTab';
import { AdminTab } from './components/tabs/AdminTab';
import { LandingPage } from './components/LandingPage';
import { ReportSubmissionForm } from './components/forms/ReportSubmissionForm';
import { useAppStore } from './store';
import { useCurriculum } from './hooks/useCurriculum';

function App() {
  const currentTab = useAppStore((state) => state.currentTab);
  const isReportFormOpen = useAppStore((state) => state.isReportFormOpen);
  const setIsReportFormOpen = useAppStore((state) => state.setIsReportFormOpen);
  const showLandingPage = useAppStore((state) => state.showLandingPage);

  useCurriculum();

  const handleReportSuccess = () => {
    alert('Report submitted successfully! Thank you for helping protect our environment.');
  };

  if (showLandingPage) {
    return (
      <>
        <LandingPage />
        <ReportSubmissionForm
          isOpen={isReportFormOpen}
          onClose={() => setIsReportFormOpen(false)}
          onSuccess={handleReportSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Header />
      <Navigation />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentTab === 'overview' && <OverviewTab />}
          {currentTab === 'monitoring' && <MonitoringTab />}
          {currentTab === 'violations' && <ViolationsTab />}
          {currentTab === 'community' && <CommunityTab />}
          {currentTab === 'data-guide' && <DataGuideTab />}
          {currentTab === 'admin' && <AdminTab />}
        </div>
      </main>

      <Footer />

      <ReportSubmissionForm
        isOpen={isReportFormOpen}
        onClose={() => setIsReportFormOpen(false)}
        onSuccess={handleReportSuccess}
      />
    </div>
  );
}

export default App;
