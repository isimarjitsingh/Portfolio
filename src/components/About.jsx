import React from 'react';

const About = () => {
  const education = [
    {
      degree: "B.Tech Computer Science & Engineering",
      institution: "CT University",
      period: "2023 - 2027",
      details: "CGPA: 8.83 / 10"
    },
    {
      degree: "Higher Secondary (12th Standard)",
      institution: "Your School Name",
      period: "2021 - 2022",
      details: "Percentage: 85%"
    },
    {
      degree: "Secondary (10th Standard)",
      institution: "Your School Name", 
      period: "2019 - 2020",
      details: "Percentage: 90%"
    }
  ];

  return (
    <section id="about" className="py-20 px-6 bg-dark-secondary/30">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
            About & Education
          </span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Who am I section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Who am I?</h3>
            <p className="text-gray-300 leading-relaxed">
              I am a passionate B.Tech Computer Science Engineering student with a strong focus on frontend development 
              and emerging technologies. My journey in tech has been driven by curiosity and a desire to create innovative 
              solutions that make a real impact.
            </p>
            <p className="text-gray-300 leading-relaxed">
              With expertise in React.js, Tailwind CSS, and modern frontend technologies, I love building beautiful, responsive user interfaces 
              that create exceptional user experiences. I'm also exploring the fascinating world of Machine Learning and Generative AI, 
              constantly expanding my skill set to stay at the forefront of technology.
            </p>
            <p className="text-gray-300 leading-relaxed">
              When I'm not coding, you can find me participating in hackathons, contributing to open-source projects, 
              or learning about the latest tech trends. I believe in continuous learning and am always excited to take on 
              new challenges that push me to grow as a developer.
            </p>
          </div>
          
          {/* Education section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Education</h3>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="bg-dark-tertiary/50 border border-gray-700 rounded-lg p-6 hover:border-purple-500/50 transition-all duration-300">
                  <h4 className="text-lg font-semibold text-purple-400 mb-2">{edu.degree}</h4>
                  <p className="text-gray-300 mb-1">{edu.institution}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{edu.period}</span>
                    <span className="text-accent font-medium">{edu.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
