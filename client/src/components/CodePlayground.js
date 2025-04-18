import React, { useState, useEffect, useMemo } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import styled from 'styled-components';
import * as ReactBootstrap from 'react-bootstrap';
import * as ReactIcons from 'react-icons/fa';
import { Dropdown, Button, ButtonGroup, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// Add Tailwind CSS for the playground
import 'tailwindcss/tailwind.css';

// Styled components for better styling
const EditorWrapper = styled.div`
  .prism-code {
    border-radius: 0.5rem;
    padding: 1rem;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    height: 300px;
    overflow: auto;
  }
`;

const PreviewWrapper = styled.div`
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
  color: #1a1a1a;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
  transition: background 0.2s, color 0.2s;
  &.dark {
    background-color: #18181b;
    color: #fafafa;
  }
`;

const ErrorWrapper = styled(LiveError)`
  color: #ef4444;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 0.375rem;
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
`;

// Styled components available in the playground
const StyledButton = styled(Button)`
  margin: 0.25rem;
`;

const defaultTemplates = {
  'Basic Component': `function Demo() {
  return (
    <div className="p-4">
      <h2 className="text-primary">Hello World</h2>
      <Button variant="primary">Click Me</Button>
    </div>
  );
}`,
  'Bootstrap Grid': `function GridDemo() {
  return (
    <Container>
      <Row className="mb-4">
        <Col md={4} className="bg-light p-3 border">Column 1</Col>
        <Col md={4} className="bg-light p-3 border">Column 2</Col>
        <Col md={4} className="bg-light p-3 border">Column 3</Col>
      </Row>
    </Container>
  );
}`,
  'Bootstrap Navbar': `function BootstrapNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Brand</a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Pricing</a>
            </li>
          </ul>
          <div className="d-flex">
            <button className="btn btn-outline-light">Login</button>
          </div>
        </div>
      </div>
    </nav>
  );
}`,
  'Card Layout': `function CardDemo() {
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <FaReact className="me-2" />Featured
      </Card.Header>
      <Card.Body>
        <Card.Title>Special Card</Card.Title>
        <Card.Text>This is a special card with custom styling.</Card.Text>
        <Button variant="outline-primary">Learn More</Button>
      </Card.Body>
    </Card>
  );
}`,
  'Tailwind Navbar': `const CustomNavbar = () => {
  return (
    <nav className="bg-purple-600 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
        <div className="text-2xl font-semibold">BrandName</div>
        <div className="flex gap-4">
          <button className="bg-white text-purple-600 px-4 py-1 rounded hover:bg-purple-100">Sign In</button>
          <button className="border border-white px-4 py-1 rounded hover:bg-purple-800">Sign Up</button>
        </div>
      </div>
    </nav>
  );
}`
};

const viewportSizes = {
  'Mobile S (320px)': '320px',
  'Mobile L (425px)': '425px',
  'Tablet (768px)': '768px',
  'Laptop (1024px)': '1024px',
  'Full Width': '100%'
};

const themeStyles = {
  'Light': {
    background: '#ffffff',
    text: '#000000'
  },
  'Dark': {
    background: '#1a1a1a',
    text: '#ffffff'
  },
  'Custom': null
};

const CodePlayground = ({ 
  code: initialCode = '', 
  styles = '', 
  isEditMode = false,
  onSave = null // Optional save callback
}) => {
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState(null);
  const [viewportSize, setViewportSize] = useState('100%');
  const [selectedTheme, setSelectedTheme] = useState('Light');
  const [customStyles, setCustomStyles] = useState(styles);
  const [showStyleEditor, setShowStyleEditor] = useState(false);

  // Handle styles including theme and custom styles
  useEffect(() => {
    const styleContainer = document.createElement('div');
    styleContainer.id = 'playground-style-container';

    // Theme styles
    const themeStyle = document.createElement('style');
    const theme = themeStyles[selectedTheme] || themeStyles.Light;
    themeStyle.textContent = `
      .preview-container {
        background-color: ${theme.background};
        color: ${theme.text};
      }
    `;
    styleContainer.appendChild(themeStyle);

    // Add CSS utility classes for both Tailwind and Bootstrap
    const utilityStyle = document.createElement('style');
    utilityStyle.textContent = `
      /* Tailwind Colors */
      .bg-purple-600, .bg-purple-700 { background-color: #7c3aed; }
      .bg-purple-800 { background-color: #5b21b6; }
      .bg-purple-100 { background-color: #ede9fe; }
      .bg-purple-300 { background-color: #c4b5fd; }
      .text-purple-600 { color: #7c3aed; }
      .text-purple-300 { color: #c4b5fd; }
      .text-white { color: #ffffff; }
      .border-white { border-color: #ffffff; }
      
      /* Tailwind Spacing */
      .p-4 { padding: 1rem; }
      .p-1, .p-2, .p-3 { padding: 0.25rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
      .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
      .gap-4, .gap-6 { gap: 1rem; }
      .mx-auto { margin-left: auto; margin-right: auto; }
      .mb-3, .mb-4 { margin-bottom: 1rem; }
      .me-2 { margin-right: 0.5rem; }
      
      /* Tailwind Flexbox */
      .flex { display: flex; }
      .justify-between { justify-content: space-between; }
      .items-center { align-items: center; }
      
      /* Tailwind Typography */
      .text-2xl, .text-xl, .text-lg { font-size: 1.5rem; line-height: 2rem; }
      .font-semibold, .font-bold { font-weight: 600; }
      
      /* Tailwind Borders */
      .rounded { border-radius: 0.25rem; }
      .border { border-width: 1px; }
      .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
      
      /* Tailwind Max Width */
      .max-w-6xl, .max-w-7xl { max-width: 72rem; }
      
      /* Tailwind Hover/Cursor */
      .hover\\:bg-purple-100:hover { background-color: #ede9fe; }
      .hover\\:bg-purple-800:hover { background-color: #5b21b6; }
      .hover\\:text-purple-300:hover { color: #c4b5fd; }
      .cursor-pointer { cursor: pointer; }
      
      /* Bootstrap Colors */
      .bg-primary { background-color: #0d6efd; }
      .bg-secondary { background-color: #6c757d; }
      .bg-success { background-color: #198754; }
      .bg-danger { background-color: #dc3545; }
      .bg-warning { background-color: #ffc107; }
      .bg-info { background-color: #0dcaf0; }
      .bg-light { background-color: #f8f9fa; }
      .bg-dark { background-color: #212529; }
      
      .text-primary { color: #0d6efd; }
      .text-secondary { color: #6c757d; }
      .text-success { color: #198754; }
      .text-danger { color: #dc3545; }
      .text-warning { color: #ffc107; }
      .text-info { color: #0dcaf0; }
      .text-light { color: #f8f9fa; }
      .text-dark { color: #212529; }
      
      /* Bootstrap Spacing */
      .m-1, .m-2, .m-3, .m-4, .m-5 { margin: 0.25rem; }
      .mt-1, .mt-2, .mt-3, .mt-4, .mt-5 { margin-top: 0.25rem; }
      .mb-1, .mb-2 { margin-bottom: 0.25rem; }
      .ms-1, .ms-2, .ms-3 { margin-left: 0.25rem; }
      .me-1, .me-3, .me-4 { margin-right: 0.25rem; }
      
      /* Bootstrap Display/Flex */
      .d-flex { display: flex; }
      .justify-content-center { justify-content: center; }
      .justify-content-between { justify-content: space-between; }
      .align-items-center { align-items: center; }
      .gap-2, .gap-3 { gap: 0.5rem; }
      
      /* Bootstrap Text */
      .text-center { text-align: center; }
      .fw-bold { font-weight: bold; }
      
      /* Bootstrap Borders */
      .rounded-circle { border-radius: 50%; }
      .shadow-sm { box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); }
      
      /* Bootstrap Buttons */
      .btn { display: inline-block; font-weight: 400; text-align: center; vertical-align: middle; user-select: none; border: 1px solid transparent; padding: 0.375rem 0.75rem; font-size: 1rem; line-height: 1.5; border-radius: 0.25rem; }
      .btn-primary { color: #fff; background-color: #0d6efd; border-color: #0d6efd; }
      .btn-secondary { color: #fff; background-color: #6c757d; border-color: #6c757d; }
      .btn-success { color: #fff; background-color: #198754; border-color: #198754; }
      .btn-outline-primary { color: #0d6efd; border-color: #0d6efd; }
    `;
    styleContainer.appendChild(utilityStyle);

    // Custom styles
    if (customStyles) {
      const customStyleElement = document.createElement('style');
      customStyleElement.textContent = customStyles;
      styleContainer.appendChild(customStyleElement);
    }

    document.head.appendChild(styleContainer);

    return () => {
      const container = document.getElementById('playground-style-container');
      if (container) {
        document.head.removeChild(container);
      }
    };
  }, [customStyles, selectedTheme]);

  // Enhanced scope with all Bootstrap components and Icons
  const scope = useMemo(() => {
    // Create a base scope without ReactBootstrap to avoid conflicts
    const baseScope = {
      React,
      styled,
      // Only include specific Bootstrap components to avoid conflicts
      Container: ReactBootstrap.Container,
      Row: ReactBootstrap.Row,
      Col: ReactBootstrap.Col,
      Button: ReactBootstrap.Button,
      Alert: ReactBootstrap.Alert,
      Card: ReactBootstrap.Card,
      // Add commonly used icons
      FaBeer: ReactIcons.FaBeer,
      FaCoffee: ReactIcons.FaCoffee,
      FaReact: ReactIcons.FaReact,
    };
    
    // Add other icons but avoid overriding existing components
    Object.keys(ReactIcons).forEach(key => {
      if (!baseScope[key]) {
        baseScope[key] = ReactIcons[key];
      }
    });
    
    return baseScope;
  }, []);

  // Store processed code for react-live
  const [processedCode, setProcessedCode] = useState("");

  useEffect(() => {
    try {
      let processed = code;
      
      // If code is empty, set a default
      if (!processed || processed.trim() === '') {
        setProcessedCode('render(<div>Type some JSX here</div>)');
        setError(null);
        return;
      }
      
      // Handle Node.js specific code that won't work in the browser
      // Remove import statements
      processed = processed.replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '');
      processed = processed.replace(/import\s+{.*?}\s+from\s+['"].*?['"];?\n?/g, '');
      
      // Remove require statements
      processed = processed.replace(/(?:const|let|var)\s+.*?=\s+require\(['"].*?['"]\);?\n?/g, '');
      processed = processed.replace(/require\(['"].*?['"]\);?\n?/g, '');
      
      // Remove export statements
      processed = processed.replace(/export\s+default\s+/g, '');
      processed = processed.replace(/export\s+/g, '');
      processed = processed.replace(/module\.exports\s*=\s*/g, '');
      
      // Clean up standalone component references (e.g., "Component;")
      processed = processed.replace(/^\s*\w+;\s*$/gm, '');
      
      // If user code already calls render, use it as is
      if (/render\s*\(/.test(processed)) {
        // Just clean up the code a bit more
        processed = processed.replace(/;\s*render\s*\(/g, '\n\nrender(');
        setProcessedCode(processed);
        setError(null);
        return;
      }
      
      // Check for component name conflicts with common React/Bootstrap names
      const checkComponentNameConflict = (name) => {
        // List of common component names that might conflict
        const commonComponentNames = [
          'Navbar', 'Button', 'Card', 'Container', 'Row', 'Col', 'Alert',
          'Form', 'Modal', 'Dropdown', 'Nav', 'Table', 'Tabs', 'Accordion'
        ];
        return commonComponentNames.includes(name);
      };
      
      // Better component detection - look for const X =, or function X()
      // Note: We've already removed export statements above
      const componentMatch = processed.match(/(?:const\s+|function\s+|class\s+)(\w+)/);
      let componentName = componentMatch ? componentMatch[1] : null;
      
      // Also check for arrow function components without const/let/var
      if (!componentName) {
        const arrowComponentMatch = processed.match(/^\s*(\w+)\s*=\s*\(?.*?\)?\s*=>\s*{/m);
        if (arrowComponentMatch) {
          componentName = arrowComponentMatch[1];
        }
      }
      
      // Check for default export without a name (export default () => {...})
      if (!componentName && /\bconst\s+\w+\s*=\s*\(\)\s*=>/.test(processed)) {
        // Extract the variable name from the arrow function
        const arrowMatch = processed.match(/\bconst\s+(\w+)\s*=\s*\(\)\s*=>/);
        if (arrowMatch) {
          componentName = arrowMatch[1];
        }
      }
      
      // If still no component name but has JSX, create a wrapper component
      if (!componentName && /<[\w\.]+[\s\/>]/.test(processed)) {
        processed = `function CustomComponent() {
  return (
    ${processed}
  );
}
${processed}`;
        componentName = 'CustomComponent';
      }
      
      // If the component name conflicts with common names, rename it
      let originalName = null;
      if (componentName && checkComponentNameConflict(componentName)) {
        try {
          originalName = componentName;
          const newName = `Custom${componentName}`;
          // Replace all instances of the component name in the code
          const nameRegex = new RegExp(`\\b${componentName}\\b`, 'g');
          processed = processed.replace(nameRegex, newName);
          componentName = newName;
          console.log(`Renamed component from '${originalName}' to '${newName}' to avoid conflicts`);
          // Don't set error for rename - just do it silently
        } catch (renameErr) {
          console.warn('Failed to rename component:', renameErr);
          // Continue with original name if rename fails
        }
      }
      
      // Better JSX detection - look for any JSX tags
      const hasJSX = /<[\w\.]+[\s\/>]/.test(processed);
      
      // If we found a component name and JSX, render that component
      if (componentName && hasJSX) {
        try {
          // Ensure we don't have duplicate render calls
          setProcessedCode(`${processed}\n\nrender(<${componentName} />)`);
          setError(null); // Clear any previous errors
        } catch (renderErr) {
          console.error('Error setting up component render:', renderErr);
          // Fallback to direct JSX rendering if component rendering fails
          setProcessedCode(`render(<div className="p-4">Component render failed, check console</div>)`);
        }
      } 
      // If we just have JSX without a component, wrap it in render
      else if (hasJSX) {
        try {
          // Check if the JSX is a complete element or fragment
          if (processed.trim().startsWith('<') && processed.trim().endsWith('>')) {
            setProcessedCode(`render(${processed})`);
          } else {
            // If it's not a complete element, wrap it
            setProcessedCode(`render(<>${processed}</>)`);
          }
          setError(null);
        } catch (jsxErr) {
          console.error('Error processing JSX:', jsxErr);
          setProcessedCode(`render(<div>Error processing JSX</div>)`);
        }
      } 
      // If no JSX found but we have a component, try to render it anyway
      else if (componentName) {
        try {
          setProcessedCode(`${processed}\n\nrender(<${componentName} />)`);
          setError(null);
        } catch (compErr) {
          console.error('Error rendering component:', compErr);
          setProcessedCode(`render(<div>Error rendering component</div>)`);
        }
      }
      // Last resort - no component or JSX found
      else {
        setError('No valid JSX or component found. Add some JSX or a component definition.');
        // Still try to render something
        setProcessedCode(`render(<div className="p-4 bg-light text-center">Add some JSX or a component definition</div>)`);
      }
    } catch (err) {
      console.error('Code processing error:', err);
      setError(err.message);
      setProcessedCode(`render(<div className="p-4 bg-danger text-white">Error: ${err.message}</div>)`);
    }
  }, [code]); // Remove scope from dependencies



  const theme = {
    plain: {
      color: '#D4D4D4',
      backgroundColor: '#1E1E1E'
    },
    styles: [
      {
        types: ['prolog', 'constant', 'builtin'],
        style: { color: '#569CD6' }
      },
      {
        types: ['inserted', 'function'],
        style: { color: '#C8C8C8' }
      },
      {
        types: ['deleted'],
        style: { color: 'rgb(255, 85, 85)' }
      },
      {
        types: ['changed'],
        style: { color: 'rgb(255, 184, 108)' }
      },
      {
        types: ['punctuation', 'symbol'],
        style: { color: '#808080' }
      },
      {
        types: ['string', 'char', 'tag', 'selector'],
        style: { color: '#CE9178' }
      },
      {
        types: ['keyword', 'variable'],
        style: { color: '#569CD6' }
      },
      {
        types: ['comment'],
        style: { color: '#6A9955' }
      },
      {
        types: ['attr-name'],
        style: { color: '#9CDCFE' }
      }
    ]
  };

  return (
    <div className="space-y-6">
      {isEditMode && (
        <div className="flex flex-wrap gap-4 items-center mb-4">
          {/* Template Selector */}
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle variant="outline-secondary" id="template-dropdown">
              Load Template
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.entries(defaultTemplates).map(([name, templateCode]) => (
                <Dropdown.Item key={name} onClick={() => setCode(templateCode)}>
                  {name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Viewport Size Selector */}
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle variant="outline-secondary" id="viewport-dropdown">
              Viewport: {Object.entries(viewportSizes).find(([, size]) => size === viewportSize)?.[0]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.entries(viewportSizes).map(([name, size]) => (
                <Dropdown.Item key={name} onClick={() => setViewportSize(size)}>
                  {name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Theme Selector */}
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle variant="outline-secondary" id="theme-dropdown">
              Theme: {selectedTheme}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.keys(themeStyles).map((themeName) => (
                <Dropdown.Item key={themeName} onClick={() => setSelectedTheme(themeName)}>
                  {themeName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Style Editor Toggle */}
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowStyleEditor(!showStyleEditor)}
          >
            {showStyleEditor ? 'Hide Styles' : 'Edit Styles'}
          </Button>

          {/* Save Button */}
          {onSave && (
            <Button 
              variant="primary" 
              onClick={() => onSave({ code, styles: customStyles })}
            >
              Save Changes
            </Button>
          )}
        </div>
      )}

      <LiveProvider 
        code={processedCode} 
        scope={scope} 
        theme={theme}
        noInline
      >
        {isEditMode ? (
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Editor Section */}
            <div className="space-y-4 lg:w-1/2 w-full">
              <EditorWrapper>
                <LiveEditor onChange={setCode} />
              </EditorWrapper>
              {showStyleEditor && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Custom Styles</h3>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={customStyles}
                    onChange={(e) => setCustomStyles(e.target.value)}
                    placeholder="Enter custom CSS here..."
                    className="font-mono text-sm"
                  />
                </div>
              )}
              {error && (
                <div className="text-red-500 text-sm mt-2 p-2 border border-red-300 rounded bg-red-50">
                  {error}
                </div>
              )}
              <ErrorWrapper />
            </div>

            {/* Preview Section */}
            <div className="lg:w-1/2 w-full">
              <div style={{ width: viewportSize }} className="mx-auto transition-all duration-300">
                <PreviewWrapper className={`preview-container transition-colors duration-300` + (selectedTheme === 'Dark' ? ' dark' : '')}>
                  <div className="w-full">
                    <LivePreview />
                  </div>
                </PreviewWrapper>
              </div>

              <div className="mt-4 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="font-medium mb-2">Available Components:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bootstrap: Container, Row, Col, Button, Alert, Card</li>
                  <li>Icons: FaReact, FaBeer, FaCoffee, and other FA icons</li>
                  <li>Styling: Both Bootstrap and Tailwind CSS classes are fully supported</li>
                  <li>Frameworks: React hooks, state, and effects are supported</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-6 bg-white min-h-[400px] flex items-center justify-center preview-container">
            <div className="w-full">
              <LivePreview />
            </div>
          </div>
        )}
      </LiveProvider>
    </div>
  );
};

export default CodePlayground;
