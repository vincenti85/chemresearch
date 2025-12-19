import { Github, Heart, Shield } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-dark-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold mb-3">About This Project</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering Alabama communities with real-time environmental data to
              protect public health and promote corporate accountability.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://echo.epa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  EPA ECHO Database
                </a>
              </li>
              <li>
                <a
                  href="https://waterdata.usgs.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  USGS Water Data
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  Legal Rights Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  Community Action Toolkit
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Data Privacy Protected</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-dark-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Alabama Student Environmental Justice Initiative
          </p>
          <div className="flex items-center space-x-1 text-sm text-gray-500 mt-2 sm:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-danger-500 fill-current" />
            <span>for our communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
