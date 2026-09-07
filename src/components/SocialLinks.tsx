import React from 'react';
import { SOCIAL_LINKS } from '../data/socials';
import { SocialIcon } from './SocialIcon';

export const SocialLinks: React.FC = () => {
  return (
    <nav
      id="social-links-container"
      aria-label="Official Social Media Profiles"
      className="w-full max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 lg:mt-12 z-20 flex flex-col items-center"
    >
      <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-9">
        {SOCIAL_LINKS.map((social, index) => (
          <SocialIcon key={social.id} social={social} index={index} />
        ))}
      </div>
    </nav>
  );
};
