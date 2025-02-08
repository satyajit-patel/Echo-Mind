import './App.css'
import axios from "axios";
import { useState } from "react";

function App() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [inputValue, setInputvalue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateSpeech = async (e) => {
    e.preventDefault();
    setAudioUrl(null);
    setIsLoading(true);
    const api = "http://localhost:3000/api/v1/voice";
    const response = await axios.post(api, {inputValue}, {responseType: "blob"});
    const url = URL.createObjectURL(response.data);
    setAudioUrl(url);
    setIsLoading(false);
  };

  return (
    <div>
      <h1>🎙️ EchoMind</h1>
      <p>AI-powered voice synthesis with dynamic tones.</p>
      <form onSubmit={generateSpeech}>
        <input type="inputValue" onChange={(e) => setInputvalue(e.target.value)} required placeholder='Echo your Mind' />
        <button onClick={generateSpeech}>Generate Speech</button>
      </form>
      {audioUrl && <audio controls autoPlay src={audioUrl}></audio>}
      {isLoading && <p>please wait a moment</p>}
    </div>
  );
}

export default App;
