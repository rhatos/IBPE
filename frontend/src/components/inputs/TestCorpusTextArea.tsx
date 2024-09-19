import React from "react";
import DOMPurify from "dompurify";

// Define the interface for the props
interface TestCorpusTextAreaProps {
  text: string; // The text to be displayed
  setText: (text: string) => void; // A function to update the text on the parent component
}

// Text area component
const TestCorpusTextArea: React.FC<TestCorpusTextAreaProps> = ({ text, setText }) => {
  const maxWords = 200; // Maximum number of words allowed

  // Function to handle changes in the textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let  value = e.target.value;
    const wordCount = value.trim().split(/\s+/).length; // Count words in the input

    if (wordCount <= maxWords) { // Check if the word count is within the limit
      // Sanitize the input before setting it
      value = DOMPurify.sanitize(value);
      setText(value);
    }
  };

  return (
    <textarea
      placeholder="Enter some text (max 200 words)"
      value={text}
      onChange={handleChange}
      className="w-full max-w-[40rem] h-[19rem] p-2 border-2 border-bpelightgrey bg-black bg-opacity-50 rounded-md text-slate-300 outline-none font-mono text-xs resize-none"
    /> // Text area
  );
};

export default TestCorpusTextArea;
