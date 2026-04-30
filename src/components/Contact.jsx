import React from 'react';

const Contact = () => {
  const contactInfo = [
    {
      icon: '📧',
      label: 'Email',
      value: 'me.simarjit singh@gmail.com',
      href: 'mailto:me.simarjit%20singh@gmail.com'
    },
    {
      icon: '📱',
      label: 'Phone',
      value: '+91 9815118327',
      href: 'tel:+919815118327'
    },
    {
      icon: '💼',
      label: 'LinkedIn',
      value: 'www.linkedin.com/in/simarjit-singh-875235313/',
      href: 'https://www.linkedin.com/in/simarjit-singh-875235313/'
    },
    {
      icon: '🐙',
      label: 'GitHub',
      value: 'github.com/isimarjitsingh',
      href: 'https://github.com/isimarjitsingh'
    }
  ];

  return (
    <section id="contact" className="py-20 px-6 bg-dark-secondary/50">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          <span className="gradient-text">Get In Touch</span>
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="card-dark text-center mb-8">
            <p className="text-lg text-gray-300 mb-8">
              I'm always interested in hearing about new opportunities and exciting projects. 
              Feel free to reach out if you'd like to collaborate or just have a chat!
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {contactInfo.map((contact, index) => (
                <a 
                  key={index}
                  href={contact.href}
                  className="flex items-center gap-4 p-4 bg-dark-tertiary/50 rounded-lg hover:bg-dark-tertiary transition-colors duration-300 group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{contact.icon}</span>
                  <div className="text-left">
                    <p className="text-sm text-gray-400">{contact.label}</p>
                    <p className="text-accent group-hover:text-accent-hover transition-colors">
                      {contact.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <a 
              href="mailto:me.simarjit%20singh@gmail.com" 
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Me an Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
