const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/components';

// Helper function to create placeholder image URLs
const getPlaceholderImage = (text, width = 600, height = 400) => 
  `https://via.placeholder.com/${width}x${height}.png/2563eb/ffffff?text=${encodeURIComponent(text)}`;

const components = [
  // Navigation Components
  {
    name: 'Modern Navbar with Dropdown',
    description: 'A responsive navbar with dropdown menus and mobile toggle',
    category: 'Navigation',
    code: `import React, { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="text-xl font-bold text-indigo-600">Logo</a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="px-3 py-2 text-gray-700 hover:text-indigo-600">Home</a>
            <a href="#" className="px-3 py-2 text-gray-700 hover:text-indigo-600">About</a>
            <a href="#" className="px-3 py-2 text-gray-700 hover:text-indigo-600">Services</a>
            <a href="#" className="px-3 py-2 text-gray-700 hover:text-indigo-600">Contact</a>
          </div>
          
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden">
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Home</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50">About</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Services</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Contact</a>
        </div>
      )}
    </nav>
  );
}`,
    styles: '',
    preview: getPlaceholderImage('Modern-Navbar'),
    tags: ['navbar', 'navigation', 'responsive', 'tailwind']
  },
  // Add more components here...
];

async function seedComponents() {
  console.log('Starting to seed components...');
  let success = 0;
  let failed = 0;

  for (const component of components) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(component)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`✅ Successfully added component: ${component.name}`);
      success++;
    } catch (error) {
      console.error(`❌ Failed to add component: ${component.name}`);
      console.error(`Error: ${error.message}`);
      failed++;
    }

    // Add a small delay between requests to prevent overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\nSeeding completed!\nSuccessful: ${success}\nFailed: ${failed}`);
}

// Run the seeding function
seedComponents().catch(console.error);
