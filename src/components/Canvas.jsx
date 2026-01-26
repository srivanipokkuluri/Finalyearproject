import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Stage, Layer as KonvaLayer, Rect, Text, Image as KonvaImage, Transformer } from "react-konva";

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

 function useHtmlVideo(src) {
   const [video, setVideo] = useState(null);

   useEffect(() => {
     if (!src) {
       setVideo(null);
       return;
     }

     const v = document.createElement("video");
     v.crossOrigin = "anonymous";
     v.src = src;
     v.muted = true;
     v.loop = true;
     v.playsInline = true;

     const onLoaded = () => {
       setVideo(v);
       v.play().catch(() => null);
     };

     const onError = () => setVideo(null);

     v.addEventListener("loadeddata", onLoaded);
     v.addEventListener("error", onError);

     return () => {
       v.pause();
       v.removeEventListener("loadeddata", onLoaded);
       v.removeEventListener("error", onError);
     };
   }, [src]);

   return video;
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

  const orderedLayers = useMemo(() => layers, [layers]);

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

          {orderedLayers.map((l) => {
            if (l.type === "image") {
              return (
                <CanvasImage
                  key={l.id}
                  layer={l}
                  isSelected={l.id === selectedLayerId}
                  onSelect={() => onSelectLayer(l.id)}
                  onChange={(patch) => onUpdateLayer(l.id, patch)}
                />
              );
            }

            if (l.type === "video") {
              return (
                <CanvasVideo
                  key={l.id}
                  layer={l}
                  isSelected={l.id === selectedLayerId}
                  onSelect={() => onSelectLayer(l.id)}
                  onChange={(patch) => onUpdateLayer(l.id, patch)}
                />
              );
            }

            if (l.type === "text") {
              return (
                <CanvasText
                  key={l.id}
                  layer={l}
                  isSelected={l.id === selectedLayerId}
                  onSelect={() => onSelectLayer(l.id)}
                  onChange={(patch) => onUpdateLayer(l.id, patch)}
                />
              );
            }

            return null;
          })}
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

  const shapeRef = useRef(null);
  const trRef = useRef(null);

  useEffect(() => {
    if (!isSelected) return;
    if (!trRef.current || !shapeRef.current) return;
    trRef.current.nodes([shapeRef.current]);
    trRef.current.getLayer()?.batchDraw();
  }, [isSelected]);

  if (!layer.width || !layer.height) {
    return null;
  }

  return (
    <>
      {img ? (
        <KonvaImage
          ref={shapeRef}
          image={img}
          x={layer.x || 0}
          y={layer.y || 0}
          width={layer.width}
          height={layer.height}
          draggable={layer.draggable !== false}
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
          onTransformEnd={() => {
            const node = shapeRef.current;
            if (!node) return;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(20, node.width() * scaleX),
              height: Math.max(20, node.height() * scaleY),
            });
          }}
          stroke={isSelected ? "#0f172a" : undefined}
          strokeWidth={isSelected ? 2 : 0}
        />
      ) : (
        <Rect
          ref={shapeRef}
          x={layer.x || 0}
          y={layer.y || 0}
          width={layer.width}
          height={layer.height}
          fill="#f1f5f9"
          stroke={isSelected ? "#0f172a" : "#cbd5e1"}
          strokeWidth={isSelected ? 2 : 1}
          dash={[10, 6]}
          draggable={layer.draggable !== false}
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
          onTransformEnd={() => {
            const node = shapeRef.current;
            if (!node) return;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(20, node.width() * scaleX),
              height: Math.max(20, node.height() * scaleY),
            });
          }}
        />
      )}
      {isSelected ? (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) return oldBox;
            return newBox;
          }}
        />
      ) : null}
    </>
  );
}

function CanvasVideo({ layer, isSelected, onSelect, onChange }) {
  const video = useHtmlVideo(layer.src);
  const shapeRef = useRef(null);
  const trRef = useRef(null);

  useEffect(() => {
    if (!isSelected) return;
    if (!trRef.current || !shapeRef.current) return;
    trRef.current.nodes([shapeRef.current]);
    trRef.current.getLayer()?.batchDraw();
  }, [isSelected]);

  useEffect(() => {
    if (!video) return;
    let raf = 0;
    const tick = () => {
      shapeRef.current?.getLayer()?.batchDraw();
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(raf);
    };
  }, [video]);

  if (!layer.width || !layer.height) {
    return null;
  }

  return (
    <>
      {layer.src ? (
        <KonvaImage
          ref={shapeRef}
          image={video}
          x={layer.x || 0}
          y={layer.y || 0}
          width={layer.width}
          height={layer.height}
          draggable={layer.draggable !== false}
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
          onTransformEnd={() => {
            const node = shapeRef.current;
            if (!node) return;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(20, node.width() * scaleX),
              height: Math.max(20, node.height() * scaleY),
            });
          }}
          stroke={isSelected ? "#0f172a" : undefined}
          strokeWidth={isSelected ? 2 : 0}
        />
      ) : (
        <Rect
          ref={shapeRef}
          x={layer.x || 0}
          y={layer.y || 0}
          width={layer.width}
          height={layer.height}
          fill="#f1f5f9"
          stroke={isSelected ? "#0f172a" : "#cbd5e1"}
          strokeWidth={isSelected ? 2 : 1}
          dash={[10, 6]}
          draggable={layer.draggable !== false}
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
          onTransformEnd={() => {
            const node = shapeRef.current;
            if (!node) return;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(20, node.width() * scaleX),
              height: Math.max(20, node.height() * scaleY),
            });
          }}
        />
      )}
      {isSelected ? (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) return oldBox;
            return newBox;
          }}
        />
      ) : null}
    </>
  );
}

export default Canvas;
