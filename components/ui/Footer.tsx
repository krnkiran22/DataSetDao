'use client';

import Link from 'next/link';
import { Twitter, Github, MessageCircle, Linkedin, Mail } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Upload Dataset', href: '/upload' },
    { label: 'Bounties', href: '/bounties' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'API', href: '/api' },
  ],
  resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'Tutorials', href: '/tutorials' },
    { label: 'Blog', href: '/blog' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Community', href: '/community' },
    { label: 'Support', href: '/support' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: MessageCircle, href: '#', label: 'Discord' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-bg-elevated)] border-t border-white/6">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-teal)] rounded-lg" />
              <span className="text-xl font-display font-semibold text-white">
                DatasetDAO
              </span>
            </div>
            <p className="text-sm text-[var(--color-fg-tertiary)] mb-6">
              AI-Verified Datasets
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-[var(--color-fg-tertiary)] hover:text-white transition-all hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-fg-secondary)] hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-fg-secondary)] hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-fg-secondary)] hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--color-fg-tertiary)]">
            © 2025 DatasetDAO. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="text-[var(--color-fg-secondary)] hover:text-white transition-colors">
              Privacy
            </Link>
            <span className="text-[var(--color-fg-tertiary)]">•</span>
            <Link href="/terms" className="text-[var(--color-fg-secondary)] hover:text-white transition-colors">
              Terms
            </Link>
            <span className="text-[var(--color-fg-tertiary)]">•</span>
            <Link href="/cookies" className="text-[var(--color-fg-secondary)] hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
