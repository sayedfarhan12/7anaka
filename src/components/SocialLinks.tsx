import React from 'react';
import { SOCIAL_LINKS } from '../data/socials';
import { SocialIcon } from './SocialIcon';

export const SocialLinks: React.FC = () => {
  return (
    <nav
      id="social-links-container"
      aria-label="Official Social Media Profiles"
      className="w-full max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 sm:mt-4 lg:mt-5 z-20 flex flex-col items-center"
    >
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {SOCIAL_LINKS.map((social, index) => (
          <SocialIcon key={social.id} social={social} index={index} />
        ))}
      </div>
    </nav>
  );
};
