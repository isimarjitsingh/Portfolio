import React from 'react';

const OpenSource = () => {
  const contributions = [
    {
      organization: 'GirlScript Summer of Code',
      role: 'Contributor',
      period: '2024',
      rank: '25th among contributors',
      icon: '🚀',
      description: 'Active contributor to multiple open-source projects',
      contributions: [
        'Fixed frontend bugs and improved UI/UX',
        'Worked on frontend-backend integration',
        'Collaborated using Git & GitHub',
        'Contributed to documentation and code reviews'
      ],
      stats: {
        pullRequests: 15,
        issues: 8,
        reviews: 12
      }
    },
    {
      organization: 'Various Open Source Projects',
      role: 'Active Contributor',
      period: '2023-2024',
      rank: 'Top Contributor',
      icon: '💻',
      description: 'Regular contributor to community-driven projects',
      contributions: [
        'Developed new features and components',
        'Optimized application performance',
        'Wrote comprehensive documentation',
        'Mentored new contributors'
      ],
      stats: {
        pullRequests: 25,
        issues: 15,
        reviews: 20
      }
    }
  ];

  return (
    <section id="opensource" className="py-16 sm:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 lg:px-8 xl:px-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-15 left-20 w-3 h-3 bg-cyan-500 rounded-full opacity-30 animate-pulse" style={{ animation: 'float 4.5s ease-in-out infinite' }}></div>
        <div className="absolute top-1/2 right-10 w-2 h-2 bg-purple-500 rounded-full opacity-40 animate-pulse" style={{ animation: 'float 3s ease-in-out infinite 1.5s' }}></div>
        <div className="absolute bottom-30 left-1/4 w-4 h-4 bg-green-500 rounded-full opacity-20 animate-pulse" style={{ animation: 'float 5.5s ease-in-out infinite 0.8s' }}></div>
      </div>
      
      <div className="container mx-auto relative z-10 max-w-7xl xl:max-w-8xl 2xl:max-w-9xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-12 sm:mb-16 lg:mb-20">
          <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent hover:from-purple-400 hover:to-cyan-300 transition-all duration-500">
            Open Source
          </span>
        </h2>
        
        <div className="max-w-6xl lg:max-w-7xl xl:max-w-8xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
          {contributions.map((contribution, index) => (
            <div 
              key={index} 
              className="group relative"
              style={{
                animationDelay: `${index * 200}ms`,
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              {/* Enhanced gradient border */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 blur-sm"></div>
              
              {/* Main content card */}
              <div className="relative bg-dark-bg border border-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                {/* Header */}
                <div className="flex items-start gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                  <div className="text-3xl sm:text-4xl lg:text-5xl transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 drop-shadow-lg group-hover:drop-shadow-2xl group-hover:drop-shadow-cyan-500/50">
                    {contribution.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2 transform transition-all duration-300 group-hover:scale-105 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text cursor-default">
                      {contribution.organization}
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-gray-300 mb-2 sm:mb-3">
                      <span className="text-purple-400 font-medium transition-all duration-300 group-hover:text-purple-300 group-hover:font-semibold text-sm sm:text-base lg:text-lg">{contribution.role}</span>
                      <span className="text-gray-500 text-sm sm:text-base lg:text-lg">•</span>
                      <span className="text-sm sm:text-base lg:text-lg transition-colors duration-300 group-hover:text-gray-200">{contribution.period}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-cyan-400 font-medium transition-all duration-300 group-hover:text-cyan-300 group-hover:font-semibold text-sm sm:text-base lg:text-lg">{contribution.rank}</span>
                      <span className="text-gray-500 text-sm sm:text-base lg:text-lg">•</span>
                      <span className="text-sm sm:text-base lg:text-lg text-gray-400 transition-colors duration-300 group-hover:text-gray-300">Active Contributor</span>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Certificate Image for GirlScript */}
                {contribution.organization === 'GirlScript Summer of Code' && (
                  <div className="mb-6">
                    <img 
                      src="/media/Simarjit Singh_Cert_Top Contributor_GSSoC2024Extd.png" 
                      alt="GirlScript Summer of Code Certificate"
                      className="w-full max-w-md mx-auto rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                    />
                  </div>
                )}
                
                {/* Description */}
                <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed transition-all duration-300 group-hover:text-gray-200 group-hover:font-medium mb-4 sm:mb-6 lg:mb-8">
                  {contribution.description}
                </p>
                
                {/* Enhanced Key Contributions */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-purple-400 mb-2 sm:mb-3 transition-all duration-300 group-hover:text-purple-300 group-hover:scale-105">Key Contributions:</h4>
                  <ul className="space-y-1 sm:space-y-2 lg:space-y-3">
                    {contribution.contributions.map((contrib, idx) => (
                      <li 
                        key={idx} 
                        className="flex items-center gap-2 sm:gap-3 text-gray-300 text-xs sm:text-sm lg:text-base transition-all duration-300 group-hover:text-gray-200 group-hover:translate-x-1"
                        style={{
                          animationDelay: `${idx * 100}ms`,
                          animation: 'fadeInUp 0.6s ease-out forwards'
                        }}
                      >
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transform transition-all duration-300 group-hover:scale-150 group-hover:rotate-180"></div>
                        <span className="transition-all duration-300 group-hover:font-medium">{contrib}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Hover indicator line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-b-xl"></div>
                
                {/* Additional hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced GitHub Statistics Summary */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">
            <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent hover:from-purple-400 hover:to-cyan-300 transition-all duration-500">
              GitHub Statistics
            </span>
          </h3>
          <div className="inline-flex items-center gap-6 bg-dark-tertiary/50 border border-gray-700 rounded-lg px-8 py-4 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="text-center transform transition-all duration-300 hover:scale-110">
              <div className="text-2xl font-bold text-purple-400 transition-all duration-300 hover:text-purple-300 hover:scale-125">30</div>
              <div className="text-sm text-gray-400 transition-colors duration-300 hover:text-gray-300">Repositories</div>
            </div>
            <div className="w-px h-8 bg-gray-600 transition-colors duration-300 group-hover:bg-purple-500"></div>
            <div className="text-center transform transition-all duration-300 hover:scale-110">
              <div className="text-2xl font-bold text-cyan-400 transition-all duration-300 hover:text-cyan-300 hover:scale-125">136</div>
              <div className="text-sm text-gray-400 transition-colors duration-300 hover:text-gray-300">Pull Requests</div>
            </div>
            <div className="w-px h-8 bg-gray-600 transition-colors duration-300 group-hover:bg-purple-500"></div>
            <div className="text-center transform transition-all duration-300 hover:scale-110">
              <div className="text-2xl font-bold text-green-400 transition-all duration-300 hover:text-green-300 hover:scale-125">8</div>
              <div className="text-sm text-gray-400 transition-colors duration-300 hover:text-gray-300">Followers</div>
            </div>
            <div className="w-px h-8 bg-gray-600 transition-colors duration-300 group-hover:bg-purple-500"></div>
            <div className="text-center transform transition-all duration-300 hover:scale-110">
              <div className="text-2xl font-bold text-orange-400 transition-all duration-300 hover:text-orange-300 hover:scale-125">2+</div>
              <div className="text-sm text-gray-400 transition-colors duration-300 hover:text-gray-300">Years Active</div>
            </div>
            <div className="w-px h-8 bg-gray-600 transition-colors duration-300 group-hover:bg-purple-500"></div>
            <div className="text-center transform transition-all duration-300 hover:scale-110">
              <a 
                href="https://github.com/isimarjitsingh" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12 inline-block"
              >
                <div className="text-2xl font-bold hover:scale-125 transition-transform duration-300">View Profile</div>
                <div className="text-sm hover:font-semibold transition-all duration-300">@isimarjitsingh</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenSource;
