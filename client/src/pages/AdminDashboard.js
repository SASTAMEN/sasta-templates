import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { componentsAPI } from '../services/api';

// Available component templates
const componentTemplates = {
  navbar: {
    name: 'Navbar',
    description: 'A responsive navigation bar with logo and menu items',
    code: `() => (
  <nav className="bg-white shadow-lg">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center h-16">
        <div className="text-xl font-bold text-gray-800">Logo</div>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-600 hover:text-gray-800">Home</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">About</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">Contact</a>
        </div>
      </div>
    </div>
  </nav>
)`,
    styles: `.navbar-link {
  transition: color 0.2s ease-in-out;
}

.navbar-link:hover {
  color: #1a202c;
}`
  },
  button: {
    name: 'Button',
    description: 'A customizable button component with hover effects',
    code: `({ children }) => (
  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
    {children || 'Click me'}
  </button>
)`,
    styles: `.button {
  transition: background-color 0.2s ease-in-out;
}

.button:hover {
  background-color: #2b6cb0;
}`
  },
  card: {
    name: 'Card',
    description: 'A card component for displaying content',
    code: `({ title, content }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">{title || 'Card Title'}</h2>
      <p className="text-gray-600">{content || 'Card content goes here'}</p>
    </div>
  </div>
)`,
    styles: `.card {
  transition: box-shadow 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}`
  }
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [showDeletedComponents, setShowDeletedComponents] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'navbar',
    description: '',
    code: '',
    styles: '',
    tags: '',
    preview: ''
  });

  // Move fetchComponents to top level
  const fetchComponents = async () => {
    try {
      const response = await componentsAPI.getAll();
      setComponents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching components:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    fetchComponents();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const template = componentTemplates[category];
    
    setFormData(prev => ({
      ...prev,
      category,
      name: template.name,
      description: template.description,
      code: template.code,
      styles: template.styles,
      preview: template.preview || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim());
      let formattedCode = formData.code.trim();
      if (formattedCode.includes('export default')) {
        const match = formattedCode.match(/const\s+(\w+)\s*=\s*\(\)\s*=>\s*{([\s\S]*)}/);
        if (match) {
          formattedCode = `() => {${match[2]}}`;
        }
      }
      let preview = formattedCode;
      const jsxMatch = formattedCode.match(/return\s*\((.*?)\);/s);
      if (jsxMatch) {
        preview = jsxMatch[1];
      }
      const componentData = {
        ...formData,
        code: formattedCode,
        preview,
        tags: tagsArray
      };
      if (editingComponent) {
        await componentsAPI.update(editingComponent._id, componentData);
      } else {
        await componentsAPI.create(componentData);
      }
      setShowAddForm(false);
      setEditingComponent(null);
      await fetchComponents();
      setFormData({
        name: '',
        category: 'navbar',
        description: '',
        code: '',
        styles: '',
        tags: '',
        preview: ''
      });
    } catch (error) {
      console.error('Error saving component:', error);
    }
  };

  const handleHardDelete = async (id) => {
    if (window.confirm('This will permanently delete the component. Are you sure?')) {
      try {
        await componentsAPI.hardDelete(id);
        await fetchComponents();
      } catch (error) {
        console.error('Error permanently deleting component:', error);
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await componentsAPI.restore(id);
      await fetchComponents();
    } catch (error) {
      console.error('Error restoring component:', error);
    }
  };

  // Add handleSoftDelete function
  const handleSoftDelete = async (id) => {
    try {
      await componentsAPI.softDelete(id);
      await fetchComponents();
    } catch (error) {
      console.error('Error soft deleting component:', error);
    }
  };

  const handleEdit = (component) => {
    setEditingComponent(component);
    setFormData({
      name: component.name,
      category: component.category,
      description: component.description,
      code: component.code,
      styles: component.styles,
      tags: component.tags.join(', '),
      preview: component.preview
    });
    setShowAddForm(true);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Component Library</h1>
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDeletedComponents}
                  onChange={(e) => setShowDeletedComponents(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Show Deleted</span>
              </label>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Component</span>
          </button>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Add New Component</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="navbar">Navbar</option>
                      <option value="button">Button</option>
                      <option value="card">Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Component Code</label>
                  <div className="relative">
                    <textarea
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
                      rows="15"
                      required
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(formData.code);
                        }}
                        className="p-2 text-gray-500 hover:text-gray-700"
                        title="Copy code"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Styles</label>
                  <div className="relative">
                    <textarea
                      name="styles"
                      value={formData.styles}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
                      rows="8"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(formData.styles);
                        }}
                        className="p-2 text-gray-500 hover:text-gray-700"
                        title="Copy styles"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., navigation, responsive, dark-mode"
                  />
                </div>

                <div className="sticky bottom-0 bg-white pt-4 border-t">
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {editingComponent ? 'Update Component' : 'Add Component'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components
            .filter(component => showDeletedComponents ? component.deleted : !component.deleted)
            .map((component) => (
            <div
              key={component._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{component.name}</h2>
                    <p className="text-gray-600 mt-1">{component.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(component)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {!component.deleted ? (
                      <button
                        onClick={() => handleSoftDelete(component._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Soft Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleRestore(component._id)}
                          className="text-green-500 hover:text-green-700 transition-colors"
                          title="Restore"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleHardDelete(component._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Permanently Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {component.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 