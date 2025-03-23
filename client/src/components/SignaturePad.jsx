import React, { useRef, useState } from 'react';
import axios from 'axios';

const SignaturePad = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState(null);
  const [message, setMessage] = useState('');

  const startDrawing = () => {
    setIsDrawing(true);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setSignature(canvas.toDataURL('image/png').split(',')[1]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
    setMessage('');
  };

  const saveSignature = async () => {
    try {
      await axios.post('http://localhost:3000/save-signature', { signature });
      setMessage('Signature saved successfully');
    } catch (error) {
      setMessage('Error saving the signature');
    }
  };

  return (
    <div className="p-4">
      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        className="border border-black"
      />
      <button onClick={clearCanvas} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Clear</button>
      <button onClick={saveSignature} className="mt-2 bg-green-500 text-white px-4 py-2 rounded ml-2">Save</button>
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
};

export default SignaturePad;
