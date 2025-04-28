import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import customChatImage from "../images/ChatBotIcon.png"; // Bot image
import userIconImage from "../images/User-Icon.png"; // User image
import "../index.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const GreenHarvestAssistant = () => {
  const [language, setLanguage] = useState("english");
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([
    {
      text: "Hi! I’m Green Harvest AI Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("preferredLanguage", language);
  }, [language]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setConversation((prev) => [
            ...prev,
            {
              text:
                language === "sinhala"
                  ? "ඔබේ ස්ථානය ලබා ගැනීමට නොහැකි විය. Colombo වල කාලගුණය භාවිතා කරමි."
                  : language === "tamil"
                  ? "உங்கள் இருப்பிடத்தைப் பெற முடியவில்லை. கொழும்பு வானிலையைப் பயன்படுத்துகிறேன்."
                  : "Unable to get your location. Using Colombo weather.",
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
        }
      );
    } else {
      setConversation((prev) => [
        ...prev,
        {
          text:
            language === "sinhala"
              ? "Geolocation ඔබේ browser එකේ support නොකරයි. Colombo වල කාලගුණය භාවිතා කරමි."
              : language === "tamil"
              ? "Geolocation உங்கள் உலாவியில் ஆதரிக்கப்படவில்லை. கொழும்பு வானிலையைப் பயன்படுத்துகிறேன்."
              : "Geolocation is not supported by your browser. Using Colombo weather.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, [language]);

  const speakReply = async (text) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        language === "sinhala"
          ? "si-LK"
          : language === "tamil"
          ? "ta-IN"
          : "en-US";
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error in speech synthesis:", error);
      setConversation((prev) => [
        ...prev,
        {
          text:
            language === "sinhala"
              ? "හඬ පිළිතුර ලබා දීමට නොහැකි විය."
              : language === "tamil"
              ? "குரல் பதிலை வழங்க முடியவில்லை."
              : "Unable to provide voice reply.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (!name) {
      setConversation((prev) => [
        ...prev,
        {
          text:
            language === "sinhala"
              ? "කරුණාකර ඔබේ නම ඇතුළත් කරන්න."
              : language === "tamil"
              ? "உங்கள் பெயரை உள்ளிடவும்."
              : "Please enter your name.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    if (!question) {
      setConversation((prev) => [
        ...prev,
        {
          text:
            language === "sinhala"
              ? "කරුණාකර ප්‍රශ්නය ඇතුළත් කරන්න."
              : language === "tamil"
              ? "ஒரு கேள்வியை உள்ளிடவும்."
              : "Please enter a question.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    setConversation((prev) => [
      ...prev,
      { text: question, sender: "user", timestamp: new Date() },
    ]);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/ask", {
        name,
        language,
        question,
        lat: location.lat || undefined,
        lon: location.lon || undefined,
      });
      const botReply = response.data.reply;

      setConversation((prev) => [
        ...prev,
        { text: botReply, sender: "bot", timestamp: new Date() },
      ]);
      speakReply(botReply);
      setQuestion("");
    } catch (error) {
      console.error("Error:", error.message);
      const errorMessage =
        language === "sinhala"
          ? "සේවාදායකයට සම්බන්ධ වීමට නොහැකියි. කරුණාකර ඔබේ internet connection එක බලන්න හෝ පසුව උත්සාහ කරන්න."
          : language === "tamil"
          ? "சேவையகத்துடன் இணைக்க முடியவில்லை. உங்கள் இணைய இணைப்பை சரிபார்க்கவும் அல்லது பின்னர் முயற்சிக்கவும்."
          : "Unable to connect to the server. Please check your internet connection or try again later.";

      setConversation((prev) => [
        ...prev,
        { text: errorMessage, sender: "bot", timestamp: new Date() },
      ]);
      speakReply(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang =
      language === "sinhala"
        ? "si-LK"
        : language === "tamil"
        ? "ta-IN"
        : "en-US";
    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setQuestion(voiceText);
      handleSubmit();
    };
    recognition.onerror = () => {
      setConversation((prev) => [
        ...prev,
        {
          text:
            language === "sinhala"
              ? "හඬ හඳුනාගැනීම අසාර්ථකයි."
              : language === "tamil"
              ? "குரல் அடையாளம் காண முடியவில்லை."
              : "Voice recognition failed.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    };
    recognition.start();
  };

  return (
    <>
      <Navbar />

      <Container
        maxWidth="sm"
        className="green-harvest-container" // Added class
        style={{
          marginTop: "20px",
          padding: "20px",
          fontFamily: '"Poppins", sans-serif',
          height: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header with Title and Language Selector */}
        <Box
          className="header-section"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", color: "#2e7d32" }}
          >
            {language === "sinhala"
              ? "Green Harvest AI සහකාර"
              : language === "tamil"
              ? "Green Harvest AI உதவியாளர்"
              : "Green Harvest AI Assistant"}
          </Typography>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            variant="outlined"
            style={{ backgroundColor: "#fff", height: "40px" }}
          >
            <MenuItem value="english">English</MenuItem>
            <MenuItem value="sinhala">සිංහල</MenuItem>
            <MenuItem value="tamil">தமிழ்</MenuItem>
          </Select>
        </Box>

        {/* Name Input */}
        <TextField
          label={
            language === "sinhala"
              ? "ඔබේ නම"
              : language === "tamil"
              ? "உங்கள் பெயர்"
              : "Your Name"
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: "20px", backgroundColor: "#fff" }}
        />

        {/* Chat Window */}
        <Box className="chat-window">
          {conversation.map((msg, index) => (
            <Box
              key={index}
              style={{
                display: "flex",
                flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                alignItems: "flex-start",
                marginBottom: "15px",
              }}
            >
              {/* Profile Image */}
              <Avatar
                style={{
                  margin: msg.sender === "user" ? "0 0 0 10px" : "0 10px 0 0",
                  backgroundColor:
                    msg.sender === "user" ? "#2e7d32" : "#e0e0e0",
                  width: "40px",
                  height: "40px",
                }}
                src={msg.sender === "user" ? userIconImage : customChatImage}
                alt={msg.sender === "user" ? "User" : "Bot"}
              />

              {/* Message Bubble */}
              <Box className={`chat-bubble ${msg.sender}`}>
                <Typography variant="body1">{msg.text}</Typography>
                <Typography
                  variant="caption"
                  style={{ opacity: 0.7, display: "block", marginTop: "5px" }}
                >
                  {msg.timestamp.toLocaleTimeString()}
                </Typography>

                {/* Bubble Tail */}
                <Box
                  style={{
                    position: "absolute",
                    bottom: "-5px",
                    [msg.sender === "user" ? "right" : "left"]: "-10px",
                    width: 0,
                    height: 0,
                    border: "10px solid transparent",
                    borderTopColor:
                      msg.sender === "user" ? "#2e7d32" : "#e0e0e0",
                    borderBottom: 0,
                    transform:
                      msg.sender === "user"
                        ? "rotate(45deg)"
                        : "rotate(-45deg)",
                  }}
                />
              </Box>
            </Box>
          ))}
          <div ref={chatEndRef} />
        </Box>

        {/* Input and Buttons */}
        <Box className="input-section" display="flex" alignItems="center">
          <TextField
            label={
              language === "sinhala"
                ? "ප්‍රශ්නයක් අසන්න"
                : language === "tamil"
                ? "ஒரு கேள்வியைக் கேளுங்கள்"
                : "Ask a question"
            }
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            variant="outlined"
            style={{ backgroundColor: "#fff" }}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: "#2e7d32",
              color: "white",
              textTransform: "uppercase",
            }}
          >
            {language === "sinhala"
              ? "ඉදිරිපත් කරන්න"
              : language === "tamil"
              ? "சமர்ப்பிக்கவும்"
              : "Send"}
          </Button>
          <Button
            variant="contained"
            onClick={startVoiceRecognition}
            style={{
              backgroundColor: "#2e7d32",
              color: "white",
              textTransform: "uppercase",
            }}
          >
            {language === "sinhala"
              ? "හඬ"
              : language === "tamil"
              ? "குரல்"
              : "Voice"}
          </Button>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default GreenHarvestAssistant;
