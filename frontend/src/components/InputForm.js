// import React from "react";
// import { TextField, Select, MenuItem } from "@mui/material";
// import PropTypes from "prop-types";
// import '../index.css';

// const InputForm = ({
//   name,
//   setName,
//   language,
//   setLanguage,
//   question,
//   setQuestion,
// }) => {
//   return (
//     <>
//       <TextField
//         label={
//           language === "sinhala"
//             ? "ඔබේ නම"
//             : language === "tamil"
//             ? "உங்கள் பெயர்"
//             : "Your Name"
//         }
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         fullWidth
//         variant="outlined"
//         style={{ marginBottom: "20px", backgroundColor: "#fff" }}
//       />

//       <Select
//         value={language}
//         onChange={(e) => setLanguage(e.target.value)}
//         fullWidth
//         variant="outlined"
//         style={{ marginBottom: "20px", backgroundColor: "#fff" }}
//       >
//         <MenuItem value="english">English</MenuItem>
//         <MenuItem value="sinhala">සිංහල</MenuItem>
//         <MenuItem value="tamil">தமிழ்</MenuItem>
//       </Select>

//       <TextField
//         label={
//           language === "sinhala"
//             ? "ප්‍රශ්නයක් අසන්න"
//             : language === "tamil"
//             ? "ஒரு கேள்வியைக் கேளுங்கள்"
//             : "Ask a question"
//         }
//         value={question}
//         onChange={(e) => setQuestion(e.target.value)}
//         fullWidth
//         variant="outlined"
//         style={{ marginBottom: "20px", backgroundColor: "#fff" }}
//       />
//     </>
//   );
// };

// InputForm.propTypes = {
//   name: PropTypes.string.isRequired,
//   setName: PropTypes.func.isRequired,
//   language: PropTypes.string.isRequired,
//   setLanguage: PropTypes.func.isRequired,
//   question: PropTypes.string.isRequired,
//   setQuestion: PropTypes.func.isRequired,
// };

// export default InputForm;

import React from "react";
import { TextField, Select, MenuItem, Tooltip } from "@mui/material";
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
      <Tooltip
        title={
          language === "sinhala"
            ? "ඔබේ නම මෙහි ඇතුළත් කරන්න"
            : language === "tamil"
            ? "உங்கள் பெயரை இங்கு உள்ளிடவும்"
            : "Enter your name here"
        }
      >
        <TextField
          label={
            language === "sinhala"
              ? "ඔබේ නම"
              : language === "tamil"
              ? "உங்கள் பெயர்"
              : "Your Name"
          }
          placeholder={
            language === "sinhala"
              ? "උදා: සමන්"
              : language === "tamil"
              ? "எ.கா: சமன்"
              : "E.g., Saman"
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: "20px", backgroundColor: "#fff" }}
          aria-label={
            language === "sinhala"
              ? "ඔබේ නම ඇතුළත් කරන්න"
              : language === "tamil"
              ? "உங்கள் பெயரை உள்ளிடவும்"
              : "Enter your name"
          }
        />
      </Tooltip>
      <Tooltip
        title={
          language === "sinhala"
            ? "ඔබට කතා කිරීමට භාෂාව තෝරන්න"
            : language === "tamil"
            ? "பேசுவதற்கு மொழியைத் தேர்ந்தெடுக்கவும்"
            : "Choose the language to interact"
        }
      >
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: "20px", backgroundColor: "#fff" }}
          aria-label={
            language === "sinhala"
              ? "භාෂාව තෝරන්න"
              : language === "tamil"
              ? "மொழியைத் தேர்ந்தெடுக்கவும்"
              : "Select language"
          }
        >
          <MenuItem value="english">English</MenuItem>
          <MenuItem value="sinhala">සිංහල</MenuItem>
          <MenuItem value="tamil">தமிழ்</MenuItem>
        </Select>
      </Tooltip>
      <Tooltip
        title={
          language === "sinhala"
            ? "ඔබේ ගොවිතැන් ප්‍රශ්නය මෙහි ඇතුළත් කරන්න"
            : language === "tamil"
            ? "உங்கள் விவசாய கேள்வியை இங்கு உள்ளிடவும்"
            : "Enter your farming question here"
        }
      >
        <TextField
          label={
            language === "sinhala"
              ? "ප්‍රශ්නයක් අසන්න"
              : language === "tamil"
              ? "ஒரு கேள்வியைக் கேளுங்கள்"
              : "Ask a question"
          }
          placeholder={
            language === "sinhala"
              ? "උදා: තක්කාලි වගා කරන්නේ කොහොමද?"
              : language === "tamil"
              ? "எ.கா: தக்காளி நடவு செய்வது எப்படி?"
              : "E.g., How to plant tomatoes?"
          }
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: "20px", backgroundColor: "#fff" }}
          aria-label={
            language === "sinhala"
              ? "ප්‍රශ්නයක් ඇතුළත් කරන්න"
              : language === "tamil"
              ? "ஒரு கேள்வியை உள்ளிடவும்"
              : "Enter a question"
          }
        />
      </Tooltip>
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

export default InputForm