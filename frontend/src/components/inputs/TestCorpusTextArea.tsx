import React from "react";

interface TestCorpusTextAreaProps {
  text: string;
  setText: (text: string) => void;
}

const TestCorpusTextArea: React.FC<TestCorpusTextAreaProps> = ({ text, setText }) => {
  const maxWords = 200;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const wordCount = value.trim().split(/\s+/).length;

    if (wordCount <= maxWords) {
      setText(value);
    }
  };

  return (
    <textarea
      placeholder="Enter some text (max 200 words)"
      value={text}
      onChange={handleChange}
      className="w-full max-w-[40rem] h-[19rem] p-2 border-2 border-bpelightgrey bg-black bg-opacity-50 rounded-md text-slate-300 outline-none font-mono text-xs resize-none"
    />
  );
};

export default TestCorpusTextArea;
