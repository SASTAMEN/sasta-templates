  import React, { useEffect } from 'react';
  import { LiveProvider, LivePreview, LiveError } from 'react-live';
  import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';


  const LiveComponentPreview = ({ code, styles }) => {
    //Inject custom styles
    useEffect(() => {
      if (!styles) return;

      const styleElement = document.createElement('style');
      styleElement.id = 'component-styles';
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);

      return () => {
        const existingStyle = document.getElementById('component-styles');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }, [styles]);

    //Format code for react-live
    const formatCode = (code) => {
      //Remove imports and exports
      let formattedCode = code.replace(/^import.*$/gm, '');
      formattedCode = formattedCode.replace(/^export.*$/gm, '');
      
      //Extract component name if it's a function component
      const componentNameMatch = formattedCode.match(/const\s+(\w+)\s*=/);
      const componentName = componentNameMatch ? componentNameMatch[1] : 'Component';
      
      // Check if it's a function component
      const isFunction = /(function|=>)\s*\(?.*\)?\s*{/.test(formattedCode);
      
      if (isFunction) {
        //If it's a function, wrap it in render(...)
        return `${formattedCode}\nrender(<${componentName} />)`;
      } else {
        ///If it's just JSX, wrap it in render(...)
        return `render(${formattedCode})`;
      }
    };

    return (
      <div className="space-y-6">
        <LiveProvider 
          code={formatCode(code)} 
          noInline={true}
          scope={{ React }}
          theme={dracula}
        >
          <div className="border rounded-lg p-6 bg-white min-h-[400px] flex items-center justify-center">
            <LivePreview className="w-full" />
          </div>
          <LiveError className="text-red-500 font-mono text-sm mt-2" />
        </LiveProvider>
      </div>
    );
  };

  export default LiveComponentPreview; 
