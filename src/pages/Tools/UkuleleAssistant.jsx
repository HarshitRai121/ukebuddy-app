// src/pages/Tools/UkuleleAssistant.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare, Bot } from 'lucide-react'; // Icons for chat UI
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import rehypeRaw from 'rehype-raw'; // Import rehype-raw for rendering raw HTML (e.g., strong, em)

/**
 * UkuleleAssistant component: An AI-powered chatbot that answers ukulele-related questions.
 * It uses the Gemini API for conversational responses.
 */
function UkuleleAssistant() {
  const [messages, setMessages] = useState([]); // Stores chat messages { sender: 'user'|'ai', text: '...' }
  const [inputMessage, setInputMessage] = useState(''); // Current message in the input field
  const [isSending, setIsSending] = useState(false); // Loading state for AI response
  const messagesEndRef = useRef(null); // Ref for auto-scrolling to the latest message

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to call the Gemini API for conversational responses
  const getAIResponse = async (userMessage) => {
    setIsSending(true);
    try {
      // Adjusted prompt to request markdown formatting
      const chatHistory = [
        { role: "user", parts: [{ text: `Please provide a detailed and well-formatted response to "${userMessage}". Use markdown for headings, bold text, bullet points, and code blocks where appropriate to enhance readability. Focus on providing helpful information about ukulele.` }] }
      ];
      const payload = { contents: chatHistory };
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; // Canvas will provide this at runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json();
        console.error("AI API HTTP Error:", response.status, response.statusText, errorData);
        // Provide a more specific error based on status if needed (e.g., 429 for rate limit)
        if (response.status === 429) {
          return "I'm receiving too many requests right now. Please try again in a moment!";
        }
        return `I'm sorry, I encountered an error (${response.status}). Please try again.`;
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        return result.candidates[0].content.parts[0].text;
      } else {
        console.error("AI response structure unexpected:", result);
        return "I'm sorry, I couldn't generate a response. The AI provided an unexpected format. Please try again.";
      }
    } catch (err) {
      console.error("Error calling Gemini API:", err);
      return "I'm having trouble connecting. Please check your internet connection and try again.";
    } finally {
      setIsSending(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isSending) return;

    const newUserMessage = { sender: 'user', text: inputMessage.trim() };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage(''); // Clear input immediately

    // Pass the user's message to the AI for generation
    const aiResponseText = await getAIResponse(newUserMessage.text);
    const newAIResponse = { sender: 'ai', text: aiResponseText };
    setMessages((prevMessages) => [...prevMessages, newAIResponse]);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Allow Shift+Enter for new line
      e.preventDefault(); // Prevent new line in textarea
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[calc(100vh-12rem)] flex flex-col items-center">
      <div className="bg-dark-surface rounded-xl shadow-2xl p-6 md:p-8 border border-dark-border w-full max-w-3xl flex flex-col h-[70vh]"> {/* Fixed height for chat */}
        <h2 className="text-4xl md:text-5xl font-bold text-neon-cyan mb-6 text-center animate-fade-in">
          Ukulele Assistant
        </h2>

        {/* Chat Messages Display Area */}
        <div className="flex-grow overflow-y-auto p-4 rounded-lg bg-dark-bg border border-dark-border mb-6 custom-scrollbar">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-text-muted">
              <MessageSquare className="w-16 h-16 mb-4 text-neon-yellow" />
              <p className="text-lg text-center">Ask me anything about ukulele!</p>
              <p className="text-sm text-center mt-2">e.g., "How do I tune my ukulele?", "What are some easy chords?"</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <Bot className="w-8 h-8 text-neon-lime mr-3 flex-shrink-0" />
              )}
              <div
                className={`p-3 rounded-xl max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'bg-neon-magenta text-dark-bg rounded-br-none'
                    : 'bg-dark-border text-text-light rounded-bl-none'
                } shadow-md`}
              >
                {/* Render markdown for AI messages, plain text for user messages */}
                {msg.sender === 'ai' ? (
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-neon-cyan flex items-center justify-center text-dark-bg font-bold ml-3 flex-shrink-0">
                  U
                </div>
              )}
            </div>
          ))}
          {/* Loading indicator for AI response */}
          {isSending && (
            <div className="flex items-center justify-start mb-4">
              <Bot className="w-8 h-8 text-neon-lime mr-3 flex-shrink-0" />
              <div className="p-3 rounded-xl bg-dark-border text-text-light rounded-bl-none shadow-md flex items-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2 text-neon-yellow" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* For auto-scrolling */}
        </div>

        {/* Message Input Area */}
        <div className="flex items-center space-x-3">
          <textarea
            className="flex-grow p-3 rounded-lg bg-dark-bg border border-dark-border text-text-light
                       focus:outline-none focus:ring-2 focus:ring-neon-lime focus:border-transparent
                       transition-all duration-300 placeholder-text-muted resize-none"
            placeholder="Ask your ukulele question..."
            rows="1" // Start with one row
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending}
          ></textarea>
          <button
            onClick={handleSendMessage}
            disabled={inputMessage.trim() === '' || isSending}
            className={`p-3 rounded-full transition-all duration-300 shadow-lg
                        ${inputMessage.trim() === '' || isSending
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-neon-lime text-dark-bg hover:bg-neon-lime/80 animate-pulse-subtle'
                        }`}
            aria-label="Send message"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UkuleleAssistant;