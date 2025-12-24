import {
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
  AlertTriangle,
  Droplets,
  Wind,
  MapPin,
  BarChart3,
  FileText,
  CheckCircle
} from 'lucide-react';
import { useAppStore } from '../store';

export function LandingPage() {
  const setShowLandingPage = useAppStore((state) => state.setShowLandingPage);
  const setCurrentTab = useAppStore((state) => state.setCurrentTab);
  const setIsReportFormOpen = useAppStore((state) => state.setIsReportFormOpen);

  const handleEnterApp = () => {
    setShowLandingPage(false);
  };

  const handleQuickReport = () => {
    setShowLandingPage(false);
    setIsReportFormOpen(true);
  };

  const features = [
    {
      icon: Wind,
      title: 'Air Quality Monitoring',
      description: 'Real-time tracking of PM2.5, ozone, and other air pollutants across Alabama communities.',
      color: 'text-sky-500',
      bgColor: 'bg-sky-900/20',
      borderColor: 'border-sky-800/30'
    },
    {
      icon: Droplets,
      title: 'Water Quality Testing',
      description: 'Monitor PFAS, lead, and other contaminants in drinking water and natural water sources.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-800/30'
    },
    {
      icon: Shield,
      title: 'Violation Tracking',
      description: 'Document and track environmental violations by industrial facilities and polluters.',
      color: 'text-red-500',
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-800/30'
    },
    {
      icon: Users,
      title: 'Community Reports',
      description: 'Citizen science platform for reporting environmental hazards and health concerns.',
      color: 'text-green-500',
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-800/30'
    },
    {
      icon: BarChart3,
      title: 'Data Visualization',
      description: 'Interactive charts and maps to understand environmental trends and patterns.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-900/20',
      borderColor: 'border-purple-800/30'
    },
    {
      icon: FileText,
      title: 'Educational Resources',
      description: 'AP Chemistry curriculum integration and environmental science learning materials.',
      color: 'text-amber-500',
      bgColor: 'bg-amber-900/20',
      borderColor: 'border-amber-800/30'
    }
  ];

  const stats = [
    { label: 'Active Monitoring Sites', value: '47', icon: MapPin },
    { label: 'Community Reports', value: '1,543', icon: FileText },
    { label: 'Resolved Violations', value: '89', icon: CheckCircle },
    { label: 'Active Users', value: '10,247', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      <header className="bg-dark-900/80 backdrop-blur-sm border-b border-dark-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Alabama Environmental Monitoring
                </h1>
                <p className="text-xs text-gray-400">by Jongwoo Lee</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleQuickReport}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Report Issue
              </button>
              <button
                onClick={handleEnterApp}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span>Enter App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-950 to-accent-900/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-primary-900/30 border border-primary-800/50 rounded-full px-4 py-2 mb-6">
              <TrendingUp className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300 font-medium">Building a Healthier Alabama Together</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Join the Movement for
              <span className="block mt-2 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Environmental Justice
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Together, we're building a healthier Alabama. Your reports help document violations,
              protect communities, and hold corporations accountable. Real-time monitoring,
              community science, and data-driven advocacy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={handleEnterApp}
                className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center space-x-2 shadow-lg shadow-primary-900/50"
              >
                <span>Explore Monitoring Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleQuickReport}
                className="w-full sm:w-auto bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-dark-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>Submit a Report</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-xl p-6">
                    <Icon className="w-6 h-6 text-primary-500 mb-2 mx-auto" />
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Comprehensive Environmental Monitoring</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful tools to track, analyze, and report environmental hazards across Alabama
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`${feature.bgColor} border ${feature.borderColor} rounded-xl p-6 hover:scale-105 transition-all duration-300`}
                >
                  <div className={`${feature.color} mb-4`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary-900/20 to-accent-900/20 border-y border-primary-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Your Voice Matters
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Whether you're experiencing unusual odors, witnessing pollution, or concerned about
              water quality in your community, your observations help build the evidence we need to
              protect public health and demand accountability.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleQuickReport}
                className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center space-x-2"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Report Environmental Issue</span>
              </button>
              <button
                onClick={handleEnterApp}
                className="w-full sm:w-auto text-gray-300 hover:text-white font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>View Recent Reports</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  For Educators and Students
                </h2>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Our platform integrates real-world environmental data with AP Chemistry curriculum,
                  providing hands-on learning opportunities. Students can explore chemical concepts
                  through actual pollution monitoring data from their communities.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Curriculum-aligned environmental chemistry lessons</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Real-time data analysis and interpretation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Community-based science projects</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Interactive learning modules and simulations</span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-900 border border-dark-700 rounded-xl p-6">
                  <div className="text-4xl font-bold text-primary-500 mb-2">9</div>
                  <div className="text-sm text-gray-400">AP Chemistry Units Covered</div>
                </div>
                <div className="bg-dark-900 border border-dark-700 rounded-xl p-6">
                  <div className="text-4xl font-bold text-accent-500 mb-2">45+</div>
                  <div className="text-sm text-gray-400">Educational Modules</div>
                </div>
                <div className="bg-dark-900 border border-dark-700 rounded-xl p-6">
                  <div className="text-4xl font-bold text-blue-500 mb-2">Real</div>
                  <div className="text-sm text-gray-400">Data from Alabama</div>
                </div>
                <div className="bg-dark-900 border border-dark-700 rounded-xl p-6">
                  <div className="text-4xl font-bold text-green-500 mb-2">Free</div>
                  <div className="text-sm text-gray-400">For All Educators</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark-900 border-t border-dark-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-primary-600 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">Alabama Environmental Monitoring</div>
                <div className="text-sm text-gray-400">by Jongwoo Lee</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              Building a healthier Alabama through community science and environmental justice
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
