import React, { useState, useRef, useEffect } from "react";
import { VITE_BACKEND_URL } from "../config/config";

import "./SevaBot.css";

interface Message {
  sender: "bot" | "user";
  text: string;
}

interface IntentData {
  issueType: string;
  department: string;
  title: string;
}

interface ChatData {
  intent?: IntentData;
  location?: string;
}

const SevaBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("initial");
  const [chatData, setChatData] = useState<ChatData>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize with welcome message when opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "Hello! I'm SevaBot, your civic issue assistant. 🤖\n\nI can help you report issues like:\n• Garbage/Waste problems\n• Water leakage\n• Power failure\n• Road damage (potholes)\n• Environmental issues\n• Public safety concerns\n\nWhat would you like to report today?"
        }
      ]);
      setStep("initial");
      setChatData({});
    }
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    // Check authentication
    const token = localStorage.getItem("auth_token");
    const userRole = localStorage.getItem("auth_role");

    // If not authenticated, inform user
    if (!token || userRole !== "citizen") {
      setMessages((prev) => [
        ...prev,
        { 
          sender: "bot", 
          text: "⚠️ You need to be logged in as a citizen to report issues.\n\nPlease sign in or sign up first, then come back to report your issue through SevaBot.\n\nYou can also use the manual form to report issues without logging in." 
        }
      ]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${VITE_BACKEND_URL}/api/chatbot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: userMessage,
          step: step,
          data: chatData
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Add bot response to chat
        setMessages((prev) => [...prev, { sender: "bot", text: result.reply }]);
        
        // Update step and data
        setStep(result.step || "initial");
        
        if (result.step === "location" && result.intent) {
          setChatData({ intent: result.intent });
        } else if (result.step === "description" && result.intent) {
          setChatData((prev) => ({
            ...prev,
            intent: result.intent,
            location: result.location
          }));
        } else if (result.step === "complete") {
          // Reset after completion
          setTimeout(() => {
            setStep("initial");
            setChatData({});
          }, 5000);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Sorry, I encountered an error. Please try again." }
        ]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't connect to the server. Please try again later." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickReply = (issue: string) => {
    setInput(issue);
    setTimeout(() => sendMessage(), 100);
  };

  const resetChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hello! I'm SevaBot, your civic issue assistant. 🤖\n\nI can help you report issues like:\n• Garbage/Waste problems\n• Water leakage\n• Power failure\n• Road damage (potholes)\n• Environmental issues\n• Public safety concerns\n\nWhat would you like to report today?"
      }
    ]);
    setStep("initial");
    setChatData({});
  };

  const getQuickReplies = () => {
    if (step === "initial") {
      return ["Garbage issue", "Water leak", "Power failure", "Pothole"];
    }
    if (step === "location") {
      return ["Enter address manually"];
    }
    return [];
  };

  return (
    <>

      {/* SevaBot Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: "10px 18px",
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
          transition: "all 0.3s ease"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(37, 99, 235, 0.4)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
        }}
      >
        <span>🤖</span>
        <span>SevaBot</span>
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "380px",
            height: "520px",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden"
          }}
        >

          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "white",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>🤖</span>
              <div>
                <div style={{ fontWeight: "600", fontSize: "16px" }}>SevaBot</div>
                <div style={{ fontSize: "12px", opacity: 0.9 }}>AI Assistant</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Close
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ 
            flex: 1, 
            padding: "16px", 
            overflowY: "auto",
            background: "#f8fafc"
          }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "12px 16px",
                    borderRadius: "16px",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap",
                    background: msg.sender === "user" 
                      ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                      : "white",
                    color: msg.sender === "user" ? "white" : "#1e293b",
                    boxShadow: msg.sender === "user" 
                      ? "0 2px 8px rgba(37, 99, 235, 0.3)"
                      : "0 2px 8px rgba(0,0,0,0.1)",
                    border: msg.sender === "bot" ? "1px solid #e2e8f0" : "none"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "12px" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "16px",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                >
                  <div style={{ display: "flex", gap: "4px" }}>
                    <span style={{ 
                      animation: "bounce 1s infinite", 
                      animationDelay: "0ms",
                      fontSize: "10px"
                    }}>●</span>
                    <span style={{ 
                      animation: "bounce 1s infinite", 
                      animationDelay: "150ms",
                      fontSize: "10px"
                    }}>●</span>
                    <span style={{ 
                      animation: "bounce 1s infinite", 
                      animationDelay: "300ms",
                      fontSize: "10px"
                    }}>●</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Buttons */}
          {getQuickReplies().length > 0 && !loading && (
            <div style={{ 
              padding: "8px 16px", 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "8px",
              borderTop: "1px solid #e2e8f0",
              background: "white"
            }}>
              {getQuickReplies().map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  style={{
                    padding: "6px 12px",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "20px",
                    color: "#2563eb",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#dbeafe";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#eff6ff";
                  }}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ 
            display: "flex", 
            borderTop: "1px solid #e2e8f0",
            padding: "12px",
            background: "white"
          }}>
            <input
              placeholder={step === "complete" ? "Chat reset soon..." : "Type your message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading || step === "complete"}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #e2e8f0",
                borderRadius: "24px",
                outline: "none",
                fontSize: "14px",
                background: "#f8fafc"
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim() || step === "complete"}
              style={{
                background: loading || !input.trim() || step === "complete"
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                color: "white",
                border: "none",
                padding: "12px 16px",
                borderRadius: "24px",
                marginLeft: "8px",
                cursor: loading || !input.trim() || step === "complete" ? "not-allowed" : "pointer",
                transition: "all 0.2s"
              }}
            >
              ➤
            </button>
          </div>

        </div>
      )}

      {/* CSS Animation for loading dots */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>

    </>
  );
};

export default SevaBot;