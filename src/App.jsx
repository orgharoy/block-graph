import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [boxes, setBoxes] = useState([{
    id: 1,
    top: Math.random() * (window.innerHeight - 120),
    left: Math.random() * (window.innerWidth - 120),
    children: []
  }]);

  const boxRefs = useRef({});
  const [dragging, setDragging] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const createChildBox = (parentBoxId) => {

    setBoxes((prevBoxes) => {
      const highestNumberedBox = Math.max(...prevBoxes.map((box) => box.id));
      const newBoxId = highestNumberedBox + 1;
      const parentBoxIndex = prevBoxes.findIndex((box) => box.id === parentBoxId);
      if (parentBoxIndex === -1) return prevBoxes;

      const newBox = {
        id: newBoxId,
        top: Math.random() * (window.innerHeight - 120),
        left: Math.random() * (window.innerWidth - 120),
        children: [],
      };

      const updatedBoxes = [...prevBoxes];
      updatedBoxes[parentBoxIndex].children.push(newBoxId);
      updatedBoxes.push(newBox);

      return updatedBoxes;
    });
  };

  const handleDragStart = (event, id) => {
    setDragging(id);
    const box = boxRefs.current[id];
    const x = event.clientX - box.offsetLeft;
    const y = event.clientY - box.offsetTop;
    setOffset({ x, y });
  };

  const handleDragEnd = () => {
    setDragging(null);
    setOffset({ x: 0, y: 0 });
  };

  const handleDrag = (event) => {
    if (dragging) {
      setBoxes(prevBoxes => prevBoxes.map(box => {
        if (box.id === dragging) {
          return {
            ...box,
            top: event.clientY - offset.y,
            left: event.clientX - offset.x,
          };
        }
        return box;
      }));
    }
  };

  useEffect(() => {
    // Update boxRefs whenever boxes change
    boxRefs.current = boxes.reduce((acc, box) => {
      acc[box.id] = document.getElementById(`box-${box.id}`);
      return acc;
    }, {});
  }, [boxes]);


  useEffect(() => {
    const drawLines = () => {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      boxes.forEach((box) => {
        box.children.forEach((childId) => {
          const childBox = boxes.find((b) => b.id === childId);
          const parentX = box.left + 56;
          const parentY = box.top + 56;
          const childX = childBox.left + 56;
          const childY = childBox.top + 56;
  
          ctx.beginPath();
          ctx.moveTo(parentX, parentY);
          ctx.lineTo(parentX, childY);
          ctx.lineTo(childX, childY);
          ctx.strokeStyle = '#000';
          ctx.setLineDash([5, 3]);
          ctx.stroke();
        });
      });
    };
  
    drawLines();
  }, [boxes]);


  return (
    <div className="h-screen w-screen bg-pink-100" onMouseMove={handleDrag} onMouseUp={handleDragEnd} >
      <canvas id="canvas" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} width={window.innerWidth} height={window.innerHeight} />

      {boxes.map((box) => (
        <div key={box.id} id={`box-${box.id}`} className="absolute z-10 p-4 h-28 w-28 bg-pink-600 flex flex-col items-center justify-between cursor-move"  style={{ top: box.top, left: box.left }} onMouseDown={(event) => handleDragStart(event, box.id)} ref={ref => (boxRefs.current[box.id] = ref)} >
          <h1 className="text-pink-200 text-center">{box.id}</h1>
          <button className="p-2 w-full bg-pink-200 text-pink-600" onClick={() => createChildBox(box.id)}>
            +
          </button>
        </div>
      ))}
    </div>
  );
};

export default App;