import React, { useState } from "react";

export default function useVisualMode(initialValue) {
  const [mode, setMode] = useState(initialValue);
  const [history, setHistory] = useState([initialValue]);

  const transition = function(newMode, replace = false) {
    if (replace) {
      setMode(newMode);
      setHistory(prev => [...prev.slice(0, -1), newMode]);
    } else {
      setMode(newMode);
      setHistory(prev => [...prev, newMode]);
    }
  };

  const back = function() {
    // Back Limit to prevent history array from being empty
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory(prev => [...prev.slice(0, -1)]);
    }
  };

  return { mode, transition, back };
}

/* Another Implementation HISTORY */
/*
export default function useVisualMode(initialValue) {
  const [mode, setMode] = useState([initialValue]);

  const transition = function(newMode, replace = false) {
    replace
      ? setMode(prev => [...prev.slice(0, -1), newMode])
      : setMode(prev => [...prev, newMode]);
  };

  const back = function() {
    if (mode.length > 1) {
      setMode(prev => prev.slice(0, -1));
    }
  };

  return { mode: mode[mode.length - 1], transition, back };
}
*/
