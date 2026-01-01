import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const Terminal = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type: "system", text: "Welcome to Dimas's Terminal! Type 'help' for available commands." }
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const commands = {
    help: () => `Available commands:
  about     - Learn about me
  skills    - View my technical skills
  projects  - See my projects
  contact   - Get my contact info
  social    - View social links
  clear     - Clear terminal
  date      - Show current date/time`,
    
    about: () => `
Hi! I'm Dimas Tri Mulyo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI Engineer & Full-Stack Developer
Based in Central Java, Indonesia
Passionate about AI, Web Development & UI/UX
4+ years of coding experience`,
    
    skills: () => `
Technical Skills:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend  : React, Vue, Tailwind CSS, Framer Motion
Backend   : Python, Node.js, Express
AI/ML     : TensorFlow, PyTorch, YOLO, Scikit-learn
Database  : MongoDB, PostgreSQL, MySQL
DevOps    : Docker, Git, GitHub Actions
Tools     : VS Code, Figma, Google Colab`,
    
    projects: () => `
Featured Projects:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. House Price Prediction (ML)
2. Road Pothole Detection (YOLO)
3. Decision Support System
4. Modern Portfolio Website

Type 'open projects' to navigate to projects page`,
    
    contact: () => `
Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email   : dimsartz021@gmail.com
Location: Central Java, Indonesia`,
    
    social: () => `
Social Links:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GitHub   : github.com/DimasTriM
LinkedIn : linkedin.com/in/dimas-tri-mulyo-1283a5392`,
    
    date: () => new Date().toLocaleString("id-ID", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }),
    
    clear: () => "CLEAR_TERMINAL",
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.toLowerCase().trim();
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    
    let output;
    if (commands[cmd]) {
      output = commands[cmd]();
      if (output === "CLEAR_TERMINAL") {
        setHistory([{ type: "system", text: "Terminal cleared. Type 'help' for commands." }]);
        setInput("");
        return;
      }
    } else if (cmd === "open projects") {
      window.location.href = "/projects";
      output = "Navigating to projects...";
    } else if (cmd === "open contact") {
      window.location.href = "/contact";
      output = "Navigating to contact...";
    } else {
      output = `Command not found: ${input}. Type 'help' for available commands.`;
    }

    setHistory(prev => [
      ...prev,
      { type: "command", text: `$ ${input}` },
      { type: "output", text: output }
    ]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto mt-8"
    >
      <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-700/50">
        {/* Terminal Header */}
        <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        
        {/* Terminal Body */}
        <div 
          ref={terminalRef}
          className="bg-[#0d1117] p-4 h-80 overflow-y-auto font-mono text-sm"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((item, index) => (
            <div 
              key={index} 
              className={`mb-2 whitespace-pre-wrap ${
                item.type === "command" 
                  ? "text-green-400" 
                  : item.type === "system" 
                    ? "text-yellow-400" 
                    : "text-gray-300"
              }`}
            >
              {item.text}
            </div>
          ))}
          
          {/* Input Line */}
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className="text-green-400 mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white outline-none font-mono caret-green-400"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Terminal;
