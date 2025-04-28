import React from "react";
import { TextField, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import '../index.css';

const InputForm = ({
  name,
  setName,
  language,
  setLanguage,
  question,
  setQuestion,
}) => {
  return (
    <>
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

      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        fullWidth
        variant="outlined"
        style={{ marginBottom: "20px", backgroundColor: "#fff" }}
      >
        <MenuItem value="english">English</MenuItem>
        <MenuItem value="sinhala">සිංහල</MenuItem>
        <MenuItem value="tamil">தமிழ்</MenuItem>
      </Select>

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
        style={{ marginBottom: "20px", backgroundColor: "#fff" }}
      />
    </>
  );
};

InputForm.propTypes = {
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  setLanguage: PropTypes.func.isRequired,
  question: PropTypes.string.isRequired,
  setQuestion: PropTypes.func.isRequired,
};

export default InputForm;