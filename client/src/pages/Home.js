import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const categories = [
    {
      name: 'Navigation',
      components: ['Navbar', 'Sidebar', 'Breadcrumbs'],
      description: 'Essential navigation components for your web applications'
    },
    {
      name: 'Forms',
      components: ['Login Form', 'Registration Form', 'Contact Form'],
      description: 'Ready-to-use form components with validation'
    },
    {
      name: 'UI Elements',
      components: ['Cards', 'Buttons', 'Modals', 'Dropdowns'],
      description: 'Beautiful UI components to enhance your design'
    },
    {
      name: 'Layout',
      components: ['Headers', 'Footers', 'Grids', 'Hero Sections'],
      description: 'Layout components to structure your pages'
    }
  ];

  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          React Component Library
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Browse our collection of ready-to-use React components. Copy the code and start building your next project!
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category) => (
          <div
            key={category.name}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {category.name}
            </h2>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <ul className="space-y-2">
              {category.components.map((component) => (
                <li key={component} className="text-indigo-600 hover:text-indigo-800">
                  <Link to={`/components/${component.toLowerCase().replace(/\s+/g, '-')}`}>
                    {component}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="text-center py-8">
        <Link
          to="/components"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Browse All Components
        </Link>
      </section>
    </div>
  );
};

export default Home; 