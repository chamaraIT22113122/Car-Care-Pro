import React, { useState, useEffect, useRef } from "react";
import "./ChatbotIcon.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatbotIcon = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [greeting, setGreeting] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState(""); // Add this line
    const [isMuted, setIsMuted] = useState(false);
    
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
  
  // Your Gemini API key - should be stored in environment variables in production
  const GEMINI_API_KEY = "AIzaSyBCKqQgd_uoZiTxfpz1LB-g8dXcqXd0DWo";
  
  // Initialize the Google Generative AI client
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      playGreeting();
      setGreeting(true);
      
      setTimeout(() => {
        setGreeting(false);
      }, 6000);
      
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } else {
      // Cancel any ongoing speech when closing
      window.speechSynthesis.cancel();
    }
  };

  const playGreeting = () => {
    // Using the Web Speech API for voice synthesis
    speakText("Hi, I'm Car Care Pro assistance. How can I help with your vehicle today?");
  };
  
  const speakText = (text) => {
    if (isMuted) return; // Don't speak if muted
    
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes("Female") || 
      voice.name.includes("female") ||
      voice.name.includes("Samantha") ||
      voice.name.includes("Google") && voice.name.includes("US")
    );
    
    if (femaleVoice) {
      speech.voice = femaleVoice;
    }
    
    window.speechSynthesis.speak(speech);
  };
  
  // Send message to Gemini API using Google GenAI SDK
   const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { type: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setStreamingMessage(""); // This will now work

    try {
      const prompt = `You are Car Care Pro...`; // Your existing prompt
      
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          responseMimeType: 'text/plain'
        }
      });

      const streamingResponse = await model.generateContentStream({
        contents: [{ 
          role: 'user',
          parts: [{ text: prompt }] 
        }]
      });

      let fullResponse = "";
      
      for await (const chunk of streamingResponse.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        setStreamingMessage(fullResponse); // This will now work
      }

      if (fullResponse) {
        const botMessage = { type: 'bot', text: fullResponse };
        setMessages(prev => [...prev, botMessage]);
        setStreamingMessage("");
        speakText(fullResponse);
      }
      
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: "I'm having technical difficulties. Please try again." 
      }]);
      setStreamingMessage("");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };
  
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };
  
  // Handle pressing Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    loadVoices();
    
    // Chrome needs this event to load voices
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      // Cancel any ongoing speech when component unmounts
      window.speechSynthesis.cancel();
    };
  }, []);


  return (
    <div className="chatbot-container">
      {/* Chat Button */}
      <button 
        className={`chatbot-icon ${isOpen ? 'active' : ''}`}
        onClick={toggleChatbot}
        aria-label="Open chatbot assistant"
      >
        <svg 
          className="bot-icon" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <path d="M7.5 10.5c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm9 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
          <path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          <path d="M6.5 14h11v1h-11zm9.5-6H8v1h8z" />
          <path d="M18 7.5h-1v4h1zm-11 0h-1v4h1z" />
        </svg>
        
        {/* Engine Indicator - gives a mechanical feel for car assistance */}
        <div className="bot-engine">
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        {/* Greeting Speech Bubble */}
        {greeting && (
          <div className="speech-bubble">
            Hi, I'm Car Care Pro assistance. How can I help with your vehicle today?
          </div>
        )}
      </button>
      
      {/* Chatbot Interface - Would expand to include the full chatbot */}
      {isOpen && (
  <div className="chatbot-interface">
    <div className="chatbot-header">
      <div className="chatbot-title">Car Care Pro Assistant</div>
      <div className="chatbot-controls">
        <button 
          className="mute-btn" 
          onClick={() => setIsMuted(!isMuted)}
          aria-label={isMuted ? "Unmute voice" : "Mute voice"}
        >
          {isMuted ? (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>
        <button className="close-btn" onClick={toggleChatbot}>&times;</button>
      </div>
    </div>
    <div className="chatbot-body">
      {messages.length === 0 ? (
        <div className="welcome-message">
          <div className="assistant-avatar">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M8 11c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm8 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
              <path d="M12 18c2.28 0 4.22-1.66 5-4H7c.78 2.34 2.72 4 5 4z"/>
            </svg>
          </div>
          <div className="message">
            Hi there! I'm your Car Care Pro assistant. How can I help with your vehicle today?
            <div className="voice-controls">
              <button 
                className="voice-toggle" 
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? '🔇 Voice Off' : '🔊 Voice On'}
              </button>
            </div>
            <ul>
              <li>Need maintenance advice?</li>
              <li>Troubleshooting engine issues?</li>
              <li>Looking for parts information?</li>
              <li>Want service recommendations?</li>
            </ul>
          </div>
        </div>
      )  : (
              <div className="messages-container">
                {messages.map((msg, index) => (
                  <div key={index} className={`message-wrapper ${msg.type}`}>
                    {msg.type === 'bot' && (
                      <div className="assistant-avatar">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                          <path d="M8 11c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm8 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
                          <path d="M12 18c2.28 0 4.22-1.66 5-4H7c.78 2.34 2.72 4 5 4z"/>
                        </svg>
                      </div>
                    )}
                    <div className={`message ${msg.type}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message-wrapper bot">
                    <div className="assistant-avatar">
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        <path d="M8 11c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm8 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
                        <path d="M12 18c2.28 0 4.22-1.66 5-4H7c.78 2.34 2.72 4 5 4z"/>
                      </svg>
                    </div>
                    <div className="message bot loading">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
            
            {/* Chat input area */}
            <form onSubmit={handleSubmit} className="chat-input-area">
              <input 
                type="text" 
                placeholder="Ask about your vehicle concerns..." 
                className="chat-input"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                ref={inputRef}
              />
              <button type="submit" className="send-btn" disabled={isLoading}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotIcon;