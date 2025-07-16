import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="rounded-2xl overflow-hidden shadow-md group"
    >
      <Link to={`/categoria/${category.id}`} className="block relative">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={category.image} 
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-xl font-semibold text-white">{category.name}</h3>
          <p className="text-sm text-gray-200 mt-1">{category.description}</p>
        </div>
      </Link>
    </motion.div>
  );
};