import React from 'react';
import { LucideIcon } from 'lucide-react'; // Certifique-se de ter 'lucide-react' instalado

interface SectionTitleProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  gradient: string; // Ex: "from-blue-500 to-indigo-600"
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ icon: Icon, title, subtitle, gradient }) => {
  return (
    <div className="text-center mb-12 p-6 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl dark:from-gray-700 dark:to-gray-800">
      <div className={`inline-flex items-center justify-center p-3 rounded-full mb-4 ${gradient} text-white shadow-lg`}>
        <Icon size={32} strokeWidth={2.5} />
      </div>
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight">
        {title}
      </h2>
      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};