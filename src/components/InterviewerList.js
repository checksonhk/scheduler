import React from "react";
import PropTypes from "prop-types";
import "styles/InterviewList.scss";
import InterviewListItem from "components/InterviewerListItem";

export default function InterviewList(props) {
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {props.interviewers.map(interviewer => (
          <InterviewListItem
            key={interviewer.id}
            name={interviewer.name}
            avatar={interviewer.avatar}
            selected={interviewer.id === props.value}
            setInterviewer={() => props.onChange(interviewer.id)}
          />
        ))}
      </ul>
    </section>
  );
}

InterviewList.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired
};
