import React from 'react';
import CodePlayground from '../components/CodePlayground';

const PlaygroundPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full animate-gradient bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#0ea5e9] opacity-90"></div>
        {/* Subtle overlay grid pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        {/* Glass highlight effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-32 bg-white/10 rounded-b-full blur-2xl"></div>
      </div>

      {/* Hero Header */}
      <header className="py-12 px-4 text-center text-white z-10 relative">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-xl tracking-tight">
          🚀 React Live Playground
        </h1>
        <p className="max-w-xl mx-auto text-lg md:text-xl font-medium opacity-90 mb-8">
          Write, run, and experiment with React, Bootstrap, and Tailwind code in real time. Perfect for learning, prototyping, and sharing UI ideas!
        </p>
      </header>

      {/* Main Card Container */}
      <main className="flex-1 flex justify-center items-start pb-12 z-10 relative">
        <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-10 mt-0 md:mt-[-4rem] border border-gray-200">
          <CodePlayground
            isEditMode={true}
            code={`function Demo() {\n  return <div className=\"p-4\">\n    <h2 className=\"text-gray-900 dark:text-white text-2xl font-bold mb-4\">Hello World!</h2>\n    <button className=\"bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-lg transition hover:scale-105\">Click Me</button>\n  </div>;\n}`}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-white/70 py-6 text-sm z-10 relative">
        <span>
          Made with <span className="text-pink-400">♥</span> for devs · Sasta Templates Playground
        </span>
      </footer>

      {/* Animated Gradient Keyframes (Tailwind plugin or custom) */}
      <style>{`
        @keyframes gradient {
          0%, 100% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PlaygroundPage;
