import React, { useEffect, useReducer } from "react";
import axios from "axios";

const reducer = function(oldState, action) {
  // REFRACTOR TO OBJECT STATEMENTS

  /* Helper Functions */
  switch (action.type) {
    case "INIT_DATA":
      return {
        ...oldState,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      };
    case "SET_DAY":
      return {
        ...oldState,
        day: action.day
      };
    case "SET_INTERVIEW": {
      const appointment = {
        ...oldState.appointments[action.id],
        interview: action.interview
      };

      const appointments = {
        ...oldState.appointments,
        [action.id]: appointment
      };

      /* SET_SPOTS logic added to SET_INTERVIEW */
      const idx = oldState.days.findIndex(day =>
        day.appointments.includes(action.id)
      );
      // Calculate the spots instead of updating;
      const newDays = oldState.days.map((day, index) => {
        if (index === idx && action.fromRemote) {
          return {
            ...day,
            spots: day.spots + (action.interview ? -1 : 1)
          };
        }
        return day;
      });

      return {
        ...oldState,
        days: newDays,
        appointments: appointments
      };
    }
    case "SET_SOCKET":
      return {
        ...oldState,
        webSocket: action.socket
      };

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
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    webSocket.addEventListener("open", () => {
      console.log("CONNECTED");
      dispatch({
        type: "SET_SOCKET",
        value: webSocket
      });
    });
    /* Socket Listener to listen to events from Server */
    webSocket.addEventListener("message", msg => {
      const data = JSON.parse(msg.data);
      dispatch({
        ...data,
        fromRemote: true
      });
    });
    /* Uses axios to get data from api-server */
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

  const setDay = day =>
    dispatch({
      type: "SET_DAY",
      day: day
    });

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: interview
    };
    return axios.put(`/api/appointments/${id}`, appointment).then(success => {
      dispatch({
        type: "SET_INTERVIEW",
        id,
        interview: interview
      });
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
        dispatch({
          type: "SET_INTERVIEW",
          id,
          interview: null,
          increase: true
        });
      });
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}
