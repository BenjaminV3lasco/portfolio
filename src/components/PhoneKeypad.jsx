import React, { useEffect, useRef } from "react";
import { phoneKeys } from "../data/deskLayout.js";

export function PhoneKeypad({ surfaceRef, interaction, onPress }) {
  const releaseTimer = useRef(null);
  useEffect(() => () => {
    clearTimeout(releaseTimer.current);
    interaction.current.hovered = interaction.current.focused = interaction.current.pressed = null;
  }, [interaction]);

  function press(digit) {
    clearTimeout(releaseTimer.current);
    interaction.current.pressed = digit;
    onPress(digit);
    releaseTimer.current = setTimeout(() => { interaction.current.pressed = null; }, 150);
  }

  return <div ref={surfaceRef} className="phone-keypad" role="group" aria-label="Teclado del teléfono">
    {phoneKeys.map(({ digit }) => <button key={digit} type="button" data-sfx="none"
      aria-label={`Marcar ${digit}`}
      onPointerEnter={() => { interaction.current.hovered = digit; }}
      onPointerLeave={() => { interaction.current.hovered = null; }}
      onFocus={event => { interaction.current.focused = event.currentTarget.matches(":focus-visible") ? digit : null; }}
      onBlur={() => { interaction.current.focused = null; }}
      onClick={() => press(digit)} />)}
  </div>;
}
