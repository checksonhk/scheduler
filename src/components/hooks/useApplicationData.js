import React, { useEffect, useReducer } from "react";
import axios from "axios";

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
    case "UPDATE_APPLICATION_DATA":
      console.log("updating data");
      return { ...oldState, [action.param]: action.value };
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
    const appointment = {
      ...state.appointments[id],
      interview: interview
    };
    return axios.put(`/api/appointments/${id}`, appointment).then(success => {
      dispatch({ type: "UPDATE_INTERVIEW", id, interview });
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
        dispatch({ type: "UPDATE_INTERVIEW", id, interview: null });
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
}
