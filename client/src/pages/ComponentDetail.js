import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { componentsAPI } from '../services/api';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CodePlayground from '../components/CodePlayground';

const ComponentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Move fetchComponent to top-level so it can be reused
  const fetchComponent = async () => {
    try {
      const response = await componentsAPI.getById(id);
      setComponent(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching component:', err);
      setError('Failed to load component');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponent();
  }, [id]);

  const handleSave = async ({ code, styles }) => {
    try {
      await componentsAPI.update(id, {
        ...component,
        code,
        styles
      });
      // Refresh the component data
      await fetchComponent();
    } catch (err) {
      console.error('Error saving component:', err);
      setError('Failed to save changes');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this component?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await componentsAPI.delete(id);
      navigate('/admin'); // Redirect to admin dashboard after successful deletion
    } catch (err) {
      console.error('Error deleting component:', err);
      setError('Failed to delete component');
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!component) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{component.name}</h1>
                <p className="text-gray-600">{component.description}</p>
              </div>
              <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
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

            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-6">
                <button
                  onClick={() => {
                    setActiveTab('preview');
                    setIsEditing(false);
                  }}
                  className={`${
                    activeTab === 'preview'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Preview
                </button>
                <button
                  onClick={() => {
                    setActiveTab('preview');
                    setIsEditing(true);
                  }}
                  className={`${
                    isEditing && activeTab === 'preview'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Edit Live
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`${
                    activeTab === 'code'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  View Code
                </button>
              </nav>
            </div>

            {activeTab === 'preview' ? (
              <CodePlayground 
                code={component.code}
                styles={component.styles}
                isEditMode={isEditing}
                onSave={handleSave}
              />
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Component Code</h3>
                  <div className="rounded-lg overflow-hidden">
                    <SyntaxHighlighter language="jsx" style={atomDark} className="rounded-lg">
                      {component.code}
                    </SyntaxHighlighter>
                  </div>
                </div>
                {component.styles && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Styles</h3>
                    <div className="rounded-lg overflow-hidden">
                      <SyntaxHighlighter language="css" style={atomDark} className="rounded-lg">
                        {component.styles}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>{isDeleting ? 'Deleting...' : 'Delete Component'}</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(component.code);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>Copy Code</span>
              </button>
              {component.styles && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(component.styles);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>Copy Styles</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentDetail; 