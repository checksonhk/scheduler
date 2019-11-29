import React, { useEffect, useReducer } from "react";
import axios from "axios";

const reducer = function(oldState, action) {
  // REFRACTOR TO OBJECT STATEMENTS
  switch (action.type) {
    case "INIT_DATA":
      return {
        ...oldState,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      };
    case "SET_DAY":
      console.log("updating day");
      return { ...oldState, day: action.day };
    case "SET_INTERVIEW": {
      console.log("updating interview");

      const appointment = {
        ...oldState.appointments[action.id],
        interview: action.interview
      };

      const appointments = {
        ...oldState.appointments,
        [action.id]: appointment
      };
      return { ...oldState, appointments: appointments };
    }
    case "SET_SPOTS": {
      const idx = oldState.days.findIndex(day =>
        day.appointments.includes(action.id)
      );
      const newDay = {
        ...oldState,
        days: oldState.days.map((day, index) => {
          if (index === idx) {
            return { ...day, spots: day.spots + (action.increase ? 1 : -1) };
          }
          return day;
        })
      };
      return newDay;
    }
    case "SET_SOCKET":
      return { ...oldState, socket: action.socket };

    default: {
      console.log("Unknown Action", action);
      return oldState;
    }
  }
};

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  useEffect(() => {
    /* Connect to Server */
    const webSocket = new WebSocket("ws://localhost:8001");
    webSocket.addEventListener("open", () => {
      console.log("CONNECTED");
      dispatch({ type: "SET_SOCKET", value: webSocket });
    });

    webSocket.addEventListener("message", msg => {
      const data = JSON.parse(msg.data);
      console.log("data", data);
      dispatch({ ...data });
    });

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      dispatch({
        type: "INIT_DATA",
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      });
    });

    /* CleanUp Function to close connection */
    return () => {
      webSocket.close();
    };
  }, [dispatch]);

  const setDay = day => dispatch({ type: "SET_DAY", days: day });

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: interview
    };
    return axios.put(`/api/appointments/${id}`, appointment).then(success => {
      dispatch({ type: "SET_INTERVIEW", id, interview: interview });
      dispatch({ type: "SET_SPOTS", id });
    });
  };

  const cancelInterview = function(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    return axios
      .delete(`/api/appointments/${id}`, appointment)
      .then(success => {
        dispatch({ type: "SET_INTERVIEW", id, interview: null });
        dispatch({ type: "SET_SPOTS", id, increase: true });
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
}
