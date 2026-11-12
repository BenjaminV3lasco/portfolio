import React, { useEffect, useRef } from "react";

export function CursorCompanion({ interactive }) {
  const markerRef = useRef(null);

  useEffect(() => {
    const marker = markerRef.current;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let visible = false;

    function hide() {
      visible = false;
      marker.dataset.visible = "false";
      marker.dataset.pressed = "false";
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function draw() {
      x += (targetX - x) * (reducedMotion.matches ? 1 : 0.25);
      y += (targetY - y) * (reducedMotion.matches ? 1 : 0.25);
      marker.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.2) frame = requestAnimationFrame(draw);
      else frame = 0;
    }

    function move(event) {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") { hide(); return; }
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) { x = targetX; y = targetY; }
      visible = true;
      marker.dataset.visible = "true";
      const control = event.target.closest?.("button:not(:disabled), a[href], summary");
      marker.dataset.control = Boolean(control);
      marker.dataset.map = Boolean(event.target.closest?.(".tree-canvas"));
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function press() { if (visible) marker.dataset.pressed = "true"; }
    function release() { marker.dataset.pressed = "false"; }
    function visibility() { if (document.hidden) hide(); }
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("pointerleave", hide);
    document.addEventListener("visibilitychange", visibility);
    reducedMotion.addEventListener("change", hide);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.removeEventListener("visibilitychange", visibility);
      reducedMotion.removeEventListener("change", hide);
    };
  }, []);

  return <div ref={markerRef} className="cursor-light" data-interactive={Boolean(interactive)} aria-hidden="true"><span /></div>;
}
