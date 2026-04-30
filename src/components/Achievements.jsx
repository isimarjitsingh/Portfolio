import React from 'react';

const Achievements = () => {
  const achievements = [
    {
      title: 'Winner – Best Tech for Education Innovation',
      event: 'National Hackathon',
      icon: '🏆',
      description: 'Developed innovative educational technology solution',
      year: '2023',
      category: 'hackathon'
    },
    {
      title: 'Winner – Best Finance Project',
      event: 'CT University Hackathon',
      icon: '🥇',
      description: 'Created outstanding finance-related project',
      year: '2023',
      category: 'hackathon'
    },
    {
      title: 'Ranked 25th – GSSoC',
      event: 'GirlScript Summer of Code',
      icon: '🌟',
      description: 'Top 25 contributor among thousands of participants',
      year: '2024',
      category: 'opensource'
    },
    {
      title: 'Frontend Developer',
      event: 'Technical Excellence',
      icon: '💻',
      description: 'Recognized for exceptional frontend development skills',
      year: '2024',
      category: 'academic'
    }
  ];

  const getCategoryColor = (category) => {
    switch(category) {
      case 'hackathon': return 'from-purple-600 to-purple-800';
      case 'opensource': return 'from-cyan-600 to-cyan-800';
      case 'academic': return 'from-green-600 to-green-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <section id="achievements" className="py-16 sm:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 lg:px-8 xl:px-12 bg-dark-secondary/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-3 h-3 bg-yellow-500 rounded-full opacity-30 animate-pulse" style={{ animation: 'float 4s ease-in-out infinite' }}></div>
        <div className="absolute top-1/3 right-15 w-2 h-2 bg-purple-500 rounded-full opacity-40 animate-pulse" style={{ animation: 'float 3.5s ease-in-out infinite 1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-4 h-4 bg-cyan-500 rounded-full opacity-20 animate-pulse" style={{ animation: 'float 5s ease-in-out infinite 0.5s' }}></div>
      </div>
      
      <div className="container mx-auto relative z-10 max-w-7xl xl:max-w-8xl 2xl:max-w-9xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-12 sm:mb-16 lg:mb-20">
          <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent hover:from-purple-400 hover:to-cyan-300 transition-all duration-500">
            Achievements
          </span>
        </h2>
        
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className="group relative"
              style={{
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              {/* Enhanced gradient border */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(achievement.category)} rounded-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 blur-sm`}></div>
              
              {/* Main content card */}
              <div className="relative bg-dark-bg border border-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
                    <div className="text-3xl sm:text-4xl lg:text-5xl transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 drop-shadow-lg group-hover:drop-shadow-2xl group-hover:drop-shadow-yellow-500/50">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2 transform transition-all duration-300 group-hover:scale-105 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text cursor-default">
                        {achievement.title}
                      </h3>
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-gray-300">
                        <span className="text-purple-400 font-medium transition-all duration-300 group-hover:text-purple-300 group-hover:font-semibold text-sm sm:text-base lg:text-lg">{achievement.event}</span>
                        <span className="text-gray-500 text-sm sm:text-base lg:text-lg">•</span>
                        <span className="text-sm sm:text-base lg:text-lg transition-colors duration-300 group-hover:text-gray-200">{achievement.year}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm lg:text-base text-gray-400 bg-gray-800 px-2 py-1 sm:px-3 sm:py-1.5 rounded transition-all duration-300 group-hover:bg-purple-900/50 group-hover:text-purple-300 group-hover:scale-110">
                    {achievement.year}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed transition-all duration-300 group-hover:text-gray-200 group-hover:font-medium mb-3 sm:mb-4 lg:mb-6">
                  {achievement.description}
                </p>
                
                <div className="mt-3 sm:mt-4 lg:mt-6">
                  <span className={`inline-block px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r ${getCategoryColor(achievement.category)} text-white text-xs sm:text-sm lg:text-base rounded-full font-medium transform transition-all duration-300 group-hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30 relative overflow-hidden group/badge`}>
                    {/* Badge background animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform scale-x-0 group-hover/badge:scale-x-100 transition-transform duration-500 origin-left"></div>
                    <span className="relative z-10">{achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}</span>
                  </span>
                </div>
                
                {/* Hover indicator line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-b-xl"></div>
                
                {/* Additional hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced Achievement Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 bg-dark-tertiary/50 border border-gray-700 rounded-lg px-8 py-4 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="text-center transform transition-all duration-300 hover:scale-110">
              <div className="text-2xl font-bold text-purple-400 transition-all duration-300 hover:text-purple-300 hover:scale-125">2+</div>
              <div className="text-sm text-gray-400 transition-colors duration-300 hover:text-gray-300">Hackathon Wins</div>
            </div>
            <div className="w-px h-8 bg-gray-600 transition-colors duration-300 group-hover:bg-purple-500"></div>
            <div className="text-center transform transition-all duration-300 hover:scale-110">
              <div className="text-2xl font-bold text-cyan-400 transition-all duration-300 hover:text-cyan-300 hover:scale-125">25th</div>
              <div className="text-sm text-gray-400 transition-colors duration-300 hover:text-gray-300">GSSoC Rank</div>
            </div>
            <div className="w-px h-8 bg-gray-600 transition-colors duration-300 group-hover:bg-purple-500"></div>
            <div className="text-center transform transition-all duration-300 hover:scale-110">
              <div className="text-2xl font-bold text-green-400 transition-all duration-300 hover:text-green-300 hover:scale-125">4+</div>
              <div className="text-sm text-gray-400 transition-colors duration-300 hover:text-gray-300">Total Achievements</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
