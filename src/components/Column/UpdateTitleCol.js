import React, { useEffect, useRef, useState } from "react";

function UpdateTitleCol(props) {
  const { setIsChangeTitleCol, handleChangeTitleColumn, column } = props;
  const [inputColTitle, setInputColTitle] = useState("");
  const inputRefTitle = useRef();

  useEffect(() => {
    inputRefTitle.current.focus();
    setInputColTitle(column.title);
  }, []);

  const handleKeyDownTitle = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setIsChangeTitleCol(false);
    }
  };

  return (
    <div className="input-change-title-col">
      <textarea
        spellCheck="false"
        value={inputColTitle}
        onChange={(e) => {
          handleChangeTitleColumn(e.target.value);
          setInputColTitle(e.target.value);
        }}
        ref={inputRefTitle}
        className="form-control input-change-title"
        onKeyDown={(e) => handleKeyDownTitle(e)}
      />
    </div>
  );
}

export default UpdateTitleCol;
