import React, { useEffect, useReducer } from "react";
import axios from "axios";

const reducer = function(oldState, action) {
  const dayofAppointment = function(id) {
    // find index of Days depending on which day is changed via appointment id
    // for that index update spots to be +1/-1 depeding on successfull call of book/cancel interview
    const days = [...oldState.days];
    console.log(days);
    return days.findIndex(day => day.appointments.includes(id));
  };

  // REFRACTOR TO OBJECT STATEMENTS
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
      console.log("day", action.day);
      return { ...oldState, day: action.day };
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
    case "UPDATE_SPOTS": {
      const index = dayofAppointment(action.id);
      const spots = oldState.days[index].spots;
      console.log("index", index);
      console.log("spots", spots);
      const newDays = action.increase
        ? oldState.days.splice(index, 1, {
            ...oldState.days[index],
            spots: spots + 1
          })
        : oldState.days.splice(index, 1, {
            ...oldState.days[index],
            spots: spots - 1
          });

      console.log("newDays", newDays);
      return { ...oldState, days: newDays };
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

  const setDay = day => dispatch({ type: "UPDATE_DAY", day: day });

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: interview
    };
    return axios.put(`/api/appointments/${id}`, appointment).then(success => {
      dispatch({ type: "UPDATE_INTERVIEW", id, interview });
      dispatch({ type: "UPDATE_SPOTS", id, increase: true });
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
        dispatch({ type: "UPDATE_SPOTS", id });
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
}
