// src/components/Footer.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import Logo from '../../assets/logo.png'


const Footer = () => {
  const footerLinks = {
    quickLinks: [
      'Service Charter',
      'Tenders',
      'Publications',
      'Contact Us',
    ],
    statistics: [
      'Economic Statistics',
      'Social Statistics',
      'Demographic Statistics',
      'Agricultural Statistics',
    ],
    dataPortals: [
      'Rwanda Data Portal',
      'Economic Indicators',
      'Social Indicators',
      'Survey Data',
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Linkedin, href: '#', name: 'LinkedIn' },
    { icon: Youtube, href: '#', name: 'YouTube' },
  ];

  return (
    <footer className="bg-primary-900 text-white w-full">
      {/* Main Footer */}
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Institute Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-4">
<div className=" h-16  rounded-lg flex items-center justify-center ">
                  <img src={Logo} alt="NISR Logo" className="w-full h-full" />
                </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              National Institute of Statistics of Rwanda provides reliable and timely statistical data to inform policy and development.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <ul className="space-y-2">
              {footerLinks.statistics.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Data Portals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Data Portals</h3>
            <ul className="space-y-2">
              {footerLinks.dataPortals.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm"
            >
              © 2025 NISR. Data & analysis licensed under{' '}
              <a href="https://creativecommons.org/licenses/by/4.0/" className="underline hover:text-primary-400">
                Creative Commons Attribution 4.0
              </a>.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.2, color: '#e6f0fa' }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;