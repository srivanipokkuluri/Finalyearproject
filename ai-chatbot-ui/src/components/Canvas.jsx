import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Stage, Layer as KonvaLayer, Rect, Text, Image as KonvaImage } from "react-konva";

function useHtmlImage(src) {
  const [img, setImg] = useState(null);

  useEffect(() => {
    if (!src) {
      setImg(null);
      return;
    }

    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = src;

    const onLoad = () => setImg(image);
    const onError = () => setImg(null);

    image.addEventListener("load", onLoad);
    image.addEventListener("error", onError);

    return () => {
      image.removeEventListener("load", onLoad);
      image.removeEventListener("error", onError);
    };
  }, [src]);

  return img;
}

const Canvas = forwardRef(function Canvas(
  { canvasWidth, canvasHeight, layers, selectedLayerId, onSelectLayer, onUpdateLayer },
  ref
) {
  const stageRef = useRef(null);

  useImperativeHandle(ref, () => ({
    exportAsDataUrl() {
      const stage = stageRef.current;
      if (!stage) return "";
      try {
        return stage.toDataURL({ pixelRatio: 2 });
      } catch (err) {
        return "";
      }
    },
  }));

  const imageLayers = useMemo(() => layers.filter((l) => l.type === "image"), [layers]);
  const textLayers = useMemo(() => layers.filter((l) => l.type === "text"), [layers]);

  const handleStageMouseDown = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) onSelectLayer(null);
  };

  return (
    <div className="inline-block">
      <Stage
        ref={stageRef}
        width={canvasWidth}
        height={canvasHeight}
        className="bg-white"
        onMouseDown={handleStageMouseDown}
        onTouchStart={handleStageMouseDown}
      >
        <KonvaLayer>
          <Rect x={0} y={0} width={canvasWidth} height={canvasHeight} fill="#ffffff" />

          {imageLayers.map((l) => (
            <CanvasImage
              key={l.id}
              layer={l}
              isSelected={l.id === selectedLayerId}
              onSelect={() => onSelectLayer(l.id)}
              onChange={(patch) => onUpdateLayer(l.id, patch)}
            />
          ))}

          {textLayers.map((l) => (
            <CanvasText
              key={l.id}
              layer={l}
              isSelected={l.id === selectedLayerId}
              onSelect={() => onSelectLayer(l.id)}
              onChange={(patch) => onUpdateLayer(l.id, patch)}
            />
          ))}
        </KonvaLayer>
      </Stage>
    </div>
  );
});

function CanvasText({ layer, isSelected, onSelect, onChange }) {
  return (
    <Text
      text={layer.text || ""}
      x={layer.x || 0}
      y={layer.y || 0}
      fontSize={layer.fontSize || 24}
      fontFamily={layer.fontFamily || "Inter"}
      fill={layer.fill || "#111827"}
      draggable={layer.draggable !== false}
      lineHeight={1.15}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      stroke={isSelected ? "#0f172a" : undefined}
      strokeWidth={isSelected ? 1 : 0}
      padding={isSelected ? 6 : 0}
    />
  );
}

function CanvasImage({ layer, isSelected, onSelect, onChange }) {
  const img = useHtmlImage(layer.src);

  return (
    <KonvaImage
      image={img}
      x={layer.x || 0}
      y={layer.y || 0}
      width={layer.width}
      height={layer.height}
      draggable={layer.draggable !== false}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      stroke={isSelected ? "#0f172a" : undefined}
      strokeWidth={isSelected ? 2 : 0}
    />
  );
}

export default Canvas;
