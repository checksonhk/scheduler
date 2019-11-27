export const getAppointmentsForDay = function(state, day) {
  const days = state.days.find(x => x.name === day);
  if (!days) {
    return [];
  }
  return days.appointments.map(
    appointment => state.appointments[String(appointment)]
  );
};

export const getInterview = function(state, interview) {
  return interview
    ? {
        ...interview,
        interviewer: state.interviewers[String(interview.interviewer)]
      }
    : null;
};

export const getInterviewersForDay = function(state, day) {
  const days = state.days.find(x => x.name === day);
  if (!days) {
    return [];
  }
  return days.interviewers.map(
    interviewer => state.interviewers[String(interviewer)]
  );
};
