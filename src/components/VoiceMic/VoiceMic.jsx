import { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { processVoiceCommand, queryAssistant } from '../../services/voiceService';
import { useLanguage } from '../../i18n';
import './VoiceMic.css';

const VoiceMic = ({ onCommandParsed, onAssistantResponse, onSampleClick }) => {
  const { lang, t } = useLanguage();
  
  const getSpeechLocale = (langCode) => {
    const map = {
      en: 'en-IN',
      te: 'te-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      ml: 'ml-IN'
    };
    return map[langCode] || 'en-IN';
  };

  const { isListening, transcript, error, startListening, stopListening, hasSupport } = useSpeechRecognition(getSpeechLocale(lang));
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isListening && transcript && !processing) {
      handleProcessCommand(transcript);
    }
  }, [isListening, transcript]);

  const handleProcessCommand = async (text) => {
    setProcessing(true);
    try {
      const res = await processVoiceCommand(text, lang);
      const parsedData = res.data;
      
      if (parsedData.intent === 'QUERY_STOCK' || parsedData.intent === 'QUERY_LOW_STOCK') {
         const queryRes = await queryAssistant(text, lang);
         if (onAssistantResponse) {
           onAssistantResponse(queryRes.data.answer);
         }
      } else {
         if (onCommandParsed) {
           onCommandParsed(parsedData);
         }
      }
    } catch (err) {
      console.error(err);
      if (onAssistantResponse) {
        onAssistantResponse("Sorry, I had trouble understanding. Please try again.");
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleTryText = (sampleText) => {
    if (onSampleClick) {
      onSampleClick(sampleText);
    } else {
      handleProcessCommand(sampleText);
    }
  };

  return (
    <div className="voice-mic-banner">
      <div className="mic-banner-left">
        <div className="banner-title-row">
          <span className="banner-mic-icon">🎙️</span>
          <div className="banner-titles">
            <h3>Add Product with Voice</h3>
            <p>Just speak naturally in your language!</p>
          </div>
        </div>
        <div className="sample-chips">
          <span className="sample-chip" onClick={() => handleTryText("Add 2 bags of rice")}>
            "Add 2 bags of rice"
          </span>
          <span className="sample-chip" onClick={() => handleTryText("10 kg sugar")}>
            "10 kg sugar"
          </span>
          <span className="sample-chip" onClick={() => handleTryText("5 cartons milk")}>
            "5 cartons milk"
          </span>
        </div>
      </div>

      <div className="mic-banner-center">
        <div className={`mic-ring-wrapper ${isListening ? 'listening' : ''}`}>
          <button 
            className={`large-mic-button ${isListening ? 'active' : ''}`}
            onClick={isListening ? stopListening : startListening}
            disabled={processing}
            title="Tap to speak"
          >
            <span className="mic-emoji">🎤</span>
          </button>
        </div>
        <div className="mic-status-label">
          {processing ? (
            <span className="text-processing">Processing...</span>
          ) : isListening ? (
            <span className="text-listening">Listening...</span>
          ) : (
            <span className="text-tap">Tap to Speak</span>
          )}
        </div>
        {transcript && isListening && (
          <div className="transcript-live">"{transcript}"</div>
        )}
        {error && <div className="mic-err-msg">{error}</div>}
      </div>

      <div className="mic-banner-right">
        <div className="try-saying-card">
          <div className="try-header">
            <span>💡</span> <strong>Try saying...</strong>
          </div>
          <ul className="try-list">
            <li onClick={() => handleTryText("Add 1 kg tea at 320 rupees")}>
              "Add 1 kg tea at 320 rupees"
            </li>
            <li onClick={() => handleTryText("Show my stock")}>
              "Show my stock"
            </li>
            <li onClick={() => handleTryText("How much rice is left?")}>
              "How much rice is left?"
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceMic;
