import React, { useState } from "react";
import { userInfo } from "os";

export default function useVisualMode(initialValue) {
  const [mode, setMode] = useState(initialValue);
  const [history, setHistory] = useState([initialValue]);

  const transition = function(newMode, replace = false) {
    console.log(`TRANSITIONING TO ${newMode}...`);
    if (replace) {
      console.log("replacing..");
      setHistory(prev => [...prev.slice(0, -1), newMode]);
    } else {
      setMode(newMode);
      setHistory(prev => [...prev, newMode]);
    }
  };

  const back = function() {
    console.log(`BACKING...`);
    // Back Limit to prevent history array from being empty
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory(prev => [...prev.slice(0, -1)]);
    }
    // gets the last element in history array
  };

  console.log(history);
  return { mode, transition, back };
}

/* FUCK HISTORY */
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
