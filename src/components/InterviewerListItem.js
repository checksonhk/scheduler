import React from "react";
import "styles/InterviewListItem.scss";
import classNames from "classnames";

export default function InterviewListItem(props) {
  const interviewerClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });

  const interviewerClassImg = classNames("interviewers__item-image", {
    "interviewers__item-image--selected": props.selected
  });

  return (
    <li className={interviewerClass} onClick={props.setInterviewer}>
      <img
        className={interviewerClassImg}
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}
