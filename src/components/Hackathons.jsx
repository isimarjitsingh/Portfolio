import React from 'react';

const Hackathons = () => {
  const achievements = [
    {
      title: 'Winner – Best Tech for Education Innovation',
      event: 'National Hackathon',
      icon: '🏆',
      description: 'Developed innovative educational technology solution'
    },
    {
      title: 'Winner – Best Finance Project',
      event: 'CT University Hackathon',
      icon: '🥇',
      description: 'Created outstanding finance-related project'
    },
    {
      title: 'Ranked 25th – GSSoC',
      event: 'GirlScript Summer of Code',
      icon: '🌟',
      description: 'Top 25 contributor among thousands of participants'
    }
  ];

  const openSource = {
    title: 'GirlScript Summer of Code (GSSoC) – Contributor',
    rank: '25th among contributors',
    contributions: [
      'Fixed frontend bugs and improved UI',
      'Worked on frontend-backend integration',
      'Collaborated using Git & GitHub'
    ]
  };

  return (
    <section id="hackathons" className="py-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          <span className="gradient-text">Achievements & Hackathons</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {achievements.map((achievement, index) => (
            <div key={index} className="card-dark text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4 animate-bounce-slow">{achievement.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-accent group-hover:text-accent-hover transition-colors">
                {achievement.title}
              </h3>
              <p className="text-gray-400 mb-2">{achievement.event}</p>
              <p className="text-gray-300 text-sm">{achievement.description}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card-dark bg-gradient-to-r from-dark-secondary to-dark-tertiary">
            <div className="flex items-start gap-6">
              <div className="text-5xl">🚀</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-accent">
                  {openSource.title}
                </h3>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm border border-accent/30">
                    Rank: {openSource.rank}
                  </span>
                </div>
                <ul className="space-y-2">
                  {openSource.contributions.map((contribution, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">{contribution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hackathons;
