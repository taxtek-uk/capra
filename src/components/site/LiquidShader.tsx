"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A slow, bright "liquid" wash in the site palette (bone, sand, clay, brass), drawn by one WebGL
 * fragment shader. It is decoration only: it starts when it scrolls into view, stops when it leaves,
 * uses the CSS gradient under reduced motion or without WebGL.
 * Rendered at half resolution and ~30fps; the wash is soft, so nobody sees the difference.
 */
const VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
const FRAG = `
precision mediump float;
uniform vec2 r; uniform float t; uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*n(p);p=R*p*2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r; float k=r.x/r.y; vec2 p=vec2(uv.x*k,uv.y)*1.4; float T=t*.035;
  vec2 d=(uv-m)*vec2(k,1.); float pull=exp(-dot(d,d)*5.);
  vec2 q=vec2(fbm(p+vec2(0.,T)),fbm(p+vec2(5.2,1.3)-T));
  vec2 w=vec2(fbm(p+3.*q+vec2(1.7,9.2)+.15*T+pull*.5),fbm(p+3.*q+vec2(8.3,2.8)-.12*T-pull*.3));
  float f=fbm(p+2.5*w);
  vec3 bone=vec3(.980,.973,.957), sand=vec3(.918,.886,.847), clay=vec3(.835,.725,.647), brass=vec3(.890,.800,.612);
  vec3 c=mix(bone,sand,smoothstep(.25,.85,f));
  c=mix(c,clay,smoothstep(.6,1.,length(q))*.45);
  c=mix(c,brass,smoothstep(.5,.9,w.x)*.4);
  c+=(smoothstep(.6,.64,f)-smoothstep(.64,.72,f))*.07;
  gl_FragColor=vec4(mix(c,bone,.3),1.);
}`;

export function LiquidShader({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Save-Data visitors keep the CSS gradient: no GPU work for decoration on a metered connection.
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Context creation and shader compilation must not compete with the initial page paint.
    let dispose: (() => void) | undefined;
    const near = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      near.disconnect();
      dispose = startLiquid(canvas, host);
    }, { rootMargin: "200px" });
    near.observe(canvas);
    return () => { near.disconnect(); dispose?.(); };
  }, []);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none opacity-0 transition-opacity duration-1000", className)} />;
}

function startLiquid(canvas: HTMLCanvasElement, host: HTMLElement) {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) return;

  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  const vert = shader(gl.VERTEX_SHADER, VERT), frag = shader(gl.FRAGMENT_SHADER, FRAG);
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { gl.deleteProgram(prog); return; }
  gl.useProgram(prog);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const u = { r: gl.getUniformLocation(prog, "r"), t: gl.getUniformLocation(prog, "t"), m: gl.getUniformLocation(prog, "m") };

  const mouse = [0.5, 0.5], target = [0.5, 0.5];
  let raf = 0, last = 0, visible = false;
  const start = performance.now() - 40_000; // open mid-flow rather than on the noise's starting pattern

  const size = () => {
    canvas.width = Math.max(1, Math.round(canvas.clientWidth / 2));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight / 2));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  const draw = (now: number) => {
    mouse[0] += (target[0] - mouse[0]) * 0.04;
    mouse[1] += (target[1] - mouse[1]) * 0.04;
    gl.uniform2f(u.r, canvas.width, canvas.height);
    gl.uniform1f(u.t, (now - start) / 1000);
    gl.uniform2f(u.m, mouse[0], mouse[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    canvas.style.opacity = "1";
  };
  const loop = (now: number) => {
    raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    if (now - last < 32) return;
    last = now;
    draw(now);
  };
  const play = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
  const onVisibility = () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else play();
  };

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    play();
  });
  const ro = new ResizeObserver(() => { size(); draw(performance.now()); });
  const onMove = (e: PointerEvent) => {
    const b = canvas.getBoundingClientRect();
    target[0] = (e.clientX - b.left) / b.width;
    target[1] = 1 - (e.clientY - b.top) / b.height;
  };
  size();
  io.observe(canvas);
  ro.observe(canvas);
  host.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    host.removeEventListener("pointermove", onMove);
    document.removeEventListener("visibilitychange", onVisibility);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(prog);
    // Keep the reusable context for Strict Mode remounts; free our GPU resources.
  };
}
