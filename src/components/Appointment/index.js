import React, { useState, useEffect } from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import useVisualMode from "../hooks/useVisualMode";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

export default function Appointment(props) {
  const [message, setMessage] = useState("");
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const STATUS = "STATUS";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  useEffect(() => {
    /* causes to transition state when props.interview is changed */
    props.interview ? transition(SHOW) : transition(EMPTY);
  }, [props.interview]);

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    setMessage("Saving");
    transition(STATUS, true);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(err => {
        transition(ERROR_SAVE, true);
      });
  };

  const cancel = function() {
    setMessage("Deleting");
    transition(STATUS, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(err => {
        transition(ERROR_DELETE, true);
      });
  };

  return (
    <article className="appointment">
      <Header time={props.time}></Header>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === STATUS && <Status message={message} />}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you want to delete this interview?"
          onCancel={back}
          onConfirm={cancel}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === ERROR_DELETE && <Error message={message} onClose={back} />}
      {mode === ERROR_SAVE && <Error message={message} onClose={back} />}
    </article>
  );
}
