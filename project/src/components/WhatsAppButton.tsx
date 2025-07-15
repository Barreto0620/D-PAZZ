import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export const WhatsAppButton: React.FC = () => {
  const phoneNumber = '+5511958431653';

  const defaultMessage = 'Olá! Tenho uma dúvida sobre um produto do site D\'Pazz Imports. Pode me ajudar?';

  return (
    <a
      href={`https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(defaultMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out"
      title="Fale conosco no WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};
