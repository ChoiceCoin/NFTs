import Head from "next/head";

import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvas = useRef(null);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  //   const [canvas, setCanvas] = useState(null);
  const [painting, setPainting] = useState(false);
  const [ctx, setCtx] = useState();

  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    canvas.current.height = window.innerHeight;
    canvas.current.width = window.innerWidth;
  };
  useEffect(() => {
    setCtx(canvas.current.getContext("2d"));
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateWidthAndHeight);
    window.addEventListener("load", updateWidthAndHeight);
    return () => window.removeEventListener("resize", resizeCanva);
  }, []);

  function resizeCanva() {
    console.log(canvas);
    canvas.current.height = window.innerHeight;
    canvas.current.width = window.innerWidth;
  }
  function startPosition(e) {
    setPainting(true);
    draw(e);
  }
  function finishPosition() {
    setPainting(false);
    ctx.beginPath();
  }

  function draw(e) {
    if (!painting) return;

    ctx.lineWidth = 10;
    ctx.lineCap = "round";

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  }

  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="This Page Contains a Canvas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <canvas
        ref={canvas}
        onMouseDown={startPosition}
        onMouseUp={finishPosition}
        onTouchStart={startPosition}
        onMouseMove={draw}
        onTouchMove={draw}
      />
    </>
  );
}
