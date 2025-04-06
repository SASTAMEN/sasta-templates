import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { componentsAPI } from '../services/api';

const ComponentShowcase = () => {
  const { category } = useParams();
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = category 
          ? await componentsAPI.getByCategory(category)
          : await componentsAPI.getAll();
        setComponents(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching components:', err);
        setError('Failed to load components');
        setLoading(false);
      }
    };

    fetchComponents();
  }, [category]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Components` : 'All Components'}
        </h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search components..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Categories</option>
            <option value="navigation">Navigation</option>
            <option value="forms">Forms</option>
            <option value="ui">UI Elements</option>
            <option value="layout">Layout</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((component) => (
          <div
            key={component._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {component.name}
              </h2>
              <p className="text-gray-600 mb-4">{component.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {component.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to={`/components/${component._id}`}
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View Component
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentShowcase; 