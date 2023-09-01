import React, { useEffect, useRef, useState } from "react";
import { GrClose } from "react-icons/gr";

function AddColumn(props) {
  const { handleAddColumn, setShowAddColumn } = props;
  const [titleColumnAdd, setTitleColumnAdd] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleKeyUp = (event) => {
    if (event.key === "Enter") {
      handleAddColumn(titleColumnAdd);
      setTitleColumnAdd("");
    }
  };

  const handleClickButtonAddColumn = () => {
    handleAddColumn(titleColumnAdd);
    setTitleColumnAdd("");
    inputRef.current.focus();
  };

  return (
    <div className="form-add-column">
      <input
        onDragStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        type="text"
        className="form-control input-add-col"
        ref={inputRef}
        value={titleColumnAdd}
        spellCheck="false"
        onChange={(e) => setTitleColumnAdd(e.target.value)}
        onKeyDown={(e) => handleKeyUp(e)}
      />
      <div className="control-add-column d-flex align-items-center ">
        <button
          className="btn btn-primary mt-2"
          onClick={() => handleClickButtonAddColumn()}
        >
          Add list
        </button>
        <GrClose
          className="btn-close mt-2 mx-2"
          onClick={() => {
            setTitleColumnAdd("");
            setShowAddColumn(false);
          }}
        />
      </div>
    </div>
  );
}

export default AddColumn;
