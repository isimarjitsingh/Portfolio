import React from 'react';

const Projects = () => {
  const projects = [
    {
      title: 'Fingrow',
      description: 'A secure and scalable peer-to-peer connection system designed specifically to facilitate user loans. Users can connect, negotiate, and manage loans effectively.',
      technologies: ['React.js', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
      icon: '📈',
      gradient: 'from-purple-600 to-blue-600',
      githubLink: 'https://github.com/isimarjitsingh/FinGrow'
    },
    {
      title: 'ATS Score Checker',
      description: 'An intelligent Machine Learning model that evaluates resumes against job descriptions, calculating an ATS compatibility score to help job seekers.',
      technologies: ['Python', 'Machine Learning', 'NLP', 'Transformer'],
      icon: '💼',
      gradient: 'from-green-600 to-green-800',
      githubLink: 'https://github.com/isimarjitsingh'
    }
  ];

  return (
    <section id="projects" className="py-20 px-6 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-500 rounded-full opacity-50 animate-pulse" style={{ animation: 'float 3s ease-in-out infinite' }}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-cyan-500 rounded-full opacity-30 animate-pulse" style={{ animation: 'float 4s ease-in-out infinite 1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-40 animate-pulse" style={{ animation: 'float 3.5s ease-in-out infinite 0.5s' }}></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent hover:from-purple-400 hover:to-cyan-300 transition-all duration-500">
            Projects
          </span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="group relative"
              style={{
                animationDelay: `${index * 200}ms`,
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              {/* Animated gradient border */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} rounded-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>
              
              {/* Main content card */}
              <div className="relative bg-dark-bg rounded-xl p-6 h-full hover:transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 border border-gray-800 hover:border-purple-500/50">
                {/* Header with icon and GitHub link */}
                <div className="flex justify-between items-start mb-4">
                  <div className="text-3xl transform transition-all duration-500 group-hover:scale-150 group-hover:rotate-180 drop-shadow-lg group-hover:drop-shadow-2xl group-hover:drop-shadow-purple-500/50">
                    {project.icon}
                  </div>
                  <a 
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-125 hover:rotate-12 bg-gray-800/50 p-2 rounded-lg hover:bg-purple-900/50"
                  >
                    <svg className="w-6 h-6 transform transition-all duration-300 group-hover/link:scale-110" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
                
                {/* Project title with enhanced hover effect */}
                <h3 className="text-xl font-bold text-white mb-3 transform transition-all duration-500 group-hover:scale-110 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text cursor-default">
                  {project.title}
                </h3>
                
                {/* Description with hover effect */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3 transition-all duration-500 group-hover:text-gray-200 group-hover:font-medium">
                  {project.description}
                </p>
                
                {/* Technologies with enhanced hover */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs border border-gray-700 hover:border-purple-500 hover:bg-purple-900/30 hover:text-purple-300 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/30 relative overflow-hidden group/tech"
                      style={{
                        animationDelay: `${techIndex * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      {/* Tech badge background animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 transform scale-x-0 group-hover/tech:scale-x-100 transition-transform duration-500 origin-left"></div>
                      <span className="relative z-10">{tech}</span>
                    </span>
                  ))}
                </div>
                
                {/* Enhanced hover indicator line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-b-xl"></div>
                
                {/* Additional hover effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
