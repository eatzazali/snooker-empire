// App.js
import React, { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import './App.css'; // Make sure Tailwind CSS is included here

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectedBallColor, setDetectedBallColor] = useState(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  useEffect(() => {
    const loadModel = async () => {
      const model = await cocoSsd.load();
      detectFrame(videoRef.current, model);
    };

    const detectFrame = (video, model) => {
      model.detect(video).then(predictions => {
        const detectedColor = processPredictions(predictions);
        if (detectedColor) {
          setDetectedBallColor(detectedColor);
          updateScore(detectedColor);
        }
        requestAnimationFrame(() => detectFrame(video, model));
      });
    };

    const processPredictions = (predictions) => {
      let detectedColor = null;
      predictions.forEach(prediction => {
        if (prediction.class === 'sports ball') {
          // Assuming we can determine the color based on some condition or additional logic
          // For demonstration, using a dummy color
          detectedColor = 'red'; // You should implement a real color detection mechanism
        }
      });
      return detectedColor;
    };

    const updateScore = (color) => {
      const ballPoints = { red: 1, yellow: 2, green: 3, brown: 4, blue: 5, pink: 6, black: 7 };
      if (ballPoints[color]) {
        setPlayer1Score(prevScore => prevScore + ballPoints[color]); // Update for Player 1 for demonstration
      }
    };

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        loadModel();
      })
      .catch(err => console.error("Error accessing camera: ", err));
  }, []);

  return (
    <div className="app bg-gray-800 min-h-screen text-white flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Snooker Empire</h1>
      <div className="relative mb-4 w-full max-w-xl">
        <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      </div>
      <div className="flex justify-between w-full max-w-xl p-4 border-t border-gray-600">
        <div>Player 1: {player1Score}</div>
        <div>Player 2: {player2Score}</div>
      </div>
    </div>
  );
};

export default App;
