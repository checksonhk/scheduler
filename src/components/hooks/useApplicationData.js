import React, { useEffect, useReducer } from "react";
import axios from "axios";

let DISPATCH = null;

const reducer = function(oldState, action) {
  switch (action.type) {
    case "INIT_DATA":
      return {
        ...oldState,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      };
    case "UPDATE_DAY":
      console.log("updating day");
      return { ...oldState, day: action.value };
    case "BOOK_INTERVIEW": {
      const { id, interview } = action;
      const appointment = {
        ...oldState.appointments[id],
        interview: { interview }
      };
      axios.put(`/api/appointments/${id}`, appointment).then(() => {
        DISPATCH({ type: "UPDATE_INTERVIEW", id, interview });
      });
      return oldState;
    }
    case "CANCEL_INTERVIEW": {
      const { id, interview } = action;
      const appointment = {
        ...oldState.appointments[id],
        interview: { interview }
      };
      axios.delete(`/api/appointments/${id}`, appointment).then(success => {
        DISPATCH({ type: "UPDATE_INTERVIEW", id, interview: null });
      });
      return oldState;
    }
    case "UPDATE_INTERVIEW": {
      console.log("updating interview");

      const appointment = {
        ...oldState.appointments[action.id],
        interview: { ...action.interview }
      };

      const appointments = {
        ...oldState.appointments,
        [action.id]: appointment
      };
      return { ...oldState, appointments: appointments };
    }
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
  DISPATCH = dispatch;
  useEffect(() => {
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
  }, []);

  const setDay = day => dispatch({ type: "UPDATE_DAY", days: day });

  const bookInterview = function(id, interview) {
    dispatch({ type: "BOOK_INTERVIEW", id, interview });
  };

  const cancelInterview = function(id) {
    dispatch({ type: "CANCEL_INTERVIEW", id });
  };

  return { state, setDay, bookInterview, cancelInterview };
}
