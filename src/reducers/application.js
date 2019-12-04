export default function reducer(oldState, action) {
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
            spots:
              day.spots +
              (oldState.appointments[action.id].interview
                ? 0
                : action.interview
                ? -1
                : 1)
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
}
