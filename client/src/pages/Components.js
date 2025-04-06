import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useAuth } from '../context/AuthContext';

const Components = () => {
  const { category } = useParams();
  const { user } = useAuth();
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/components/category/${category}`);
        setComponents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching components:', error);
        setLoading(false);
      }
    };

    fetchComponents();
  }, [category]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        await axios.delete(`http://localhost:5000/api/components/${id}`);
        setComponents(components.filter(comp => comp._id !== id));
      } catch (error) {
        console.error('Error deleting component:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 capitalize">{category} Components</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((component) => (
          <div
            key={component._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{component.name}</h2>
              <p className="text-gray-600 mb-4">{component.description}</p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedComponent(component)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Code
                </button>
                {user && (
                  <button
                    onClick={() => handleDelete(component._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold">{selectedComponent.name}</h2>
              <button
                onClick={() => setSelectedComponent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Code:</h3>
              <div className="relative">
                <SyntaxHighlighter language="jsx">
                  {selectedComponent.code}
                </SyntaxHighlighter>
                <CopyToClipboard
                  text={selectedComponent.code}
                  onCopy={() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  <button className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded text-sm">
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </CopyToClipboard>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Style:</h3>
              <div className="relative">
                <SyntaxHighlighter language="css">
                  {selectedComponent.style}
                </SyntaxHighlighter>
                <CopyToClipboard
                  text={selectedComponent.style}
                  onCopy={() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  <button className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded text-sm">
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Components; 