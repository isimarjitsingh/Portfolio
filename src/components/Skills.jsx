import React from 'react';

const Skills = () => {
  const skills = {
    Frontend: [
      { name: 'React.js', icon: '⚛️', category: 'framework' },
      { name: 'HTML', icon: '📄', category: 'language' },
      { name: 'CSS', icon: '🎨', category: 'language' },
      { name: 'Tailwind CSS', icon: '🔷', category: 'framework' },
      { name: 'JavaScript', icon: '🟨', category: 'language' }
    ],
    AI: [
      { name: 'LangChain', icon: '🔗', category: 'framework' },
      { name: 'RAG Pipeline', icon: '📊', category: 'architecture' },
      { name: 'Agentic AI', icon: '🤖', category: 'framework' },
      { name: 'Machine Learning', icon: '🧠', category: 'technology' },
      { name: 'NLP', icon: '💬', category: 'technology' }
    ],
    Tools: [
      { name: 'Git', icon: '📦', category: 'version-control' },
      { name: 'GitHub', icon: '🐙', category: 'platform' },
      { name: 'VS Code', icon: '💻', category: 'editor' },
      { name: 'Vercel', icon: '▲', category: 'deployment' },
      { name: 'NPM', icon: '📦', category: 'package-manager' }
    ]
  };

  return (
    <section id="skills" className="py-20 px-6 bg-gradient-to-br from-dark-secondary/20 to-dark-tertiary/20">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Technical Skills
          </span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(skills).map(([category, skillList]) => (
            <div key={category} className="relative group">
              {/* Card with gradient border */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-dark-bg border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 group">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-cyan-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Category Header with enhanced hover */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white transform transition-all duration-300 group-hover:scale-105">
                    {category}
                  </h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg group-hover:shadow-purple-500/50">
                    {category === 'Frontend' && '🎨'}
                    {category === 'AI' && '🤖'}
                    {category === 'Tools' && '🛠️'}
                  </div>
                </div>
                
                {/* Skills Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {skillList.map((skill, index) => (
                    <div 
                      key={skill.name} 
                      className="flex flex-col items-center p-3 bg-dark-tertiary/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-500 group/item relative overflow-hidden"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Skill icon with enhanced hover */}
                      <div className="relative z-10">
                        <span className="text-2xl mb-2 block transform transition-all duration-300 group-hover/item:scale-125 group-hover/item:rotate-12 drop-shadow-lg">{skill.icon}</span>
                      </div>
                      
                      {/* Skill name with hover effects */}
                      <span className="relative z-10 text-gray-300 text-sm font-medium text-center transition-all duration-300 group-hover/item:text-white group-hover/item:font-semibold">
                        {skill.name}
                      </span>
                      
                      {/* Hover indicator */}
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 transform scale-x-0 group-hover/item:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  ))}
                </div>
                
                {/* Category Stats with enhanced hover */}
                <div className="relative z-10 mt-6 pt-4 border-t border-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">Technologies</span>
                    <span className="text-purple-400 font-semibold transform transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-400">{skillList.length}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Skills Summary */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-dark-tertiary/50 border border-gray-700 rounded-lg px-6 py-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">15+ Technologies</span>
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Frontend Developer</span>
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Modern Tech Stack</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
