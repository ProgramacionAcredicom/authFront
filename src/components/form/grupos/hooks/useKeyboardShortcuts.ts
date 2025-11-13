import { useEffect, useRef } from "react";

interface KeyboardState {
  metaKey: boolean;
  ctrlKey: boolean;
}

/**
 * Hook para capturar el estado de las teclas Cmd/Ctrl globalmente
 */
export function useKeyboardShortcuts() {
  const keyStateRef = useRef<KeyboardState>({ metaKey: false, ctrlKey: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        keyStateRef.current = {
          metaKey: e.metaKey,
          ctrlKey: e.ctrlKey,
        };
      }
    };

    const handleKeyUp = () => {
      setTimeout(() => {
        keyStateRef.current = { metaKey: false, ctrlKey: false };
      }, 100);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const isMultiSelectKeyPressed = (event?: React.MouseEvent | KeyboardEvent): boolean => {
    if (event) {
      return event.metaKey || event.ctrlKey;
    }
    return keyStateRef.current.metaKey || keyStateRef.current.ctrlKey;
  };

  const updateKeyState = (event: React.MouseEvent) => {
    keyStateRef.current = {
      metaKey: event.metaKey,
      ctrlKey: event.ctrlKey,
    };
  };

  return {
    isMultiSelectKeyPressed,
    updateKeyState,
  };
}

