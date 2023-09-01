import React, { useState } from "react";
import UpdateTitleCol from "./UpdateTitleCol";
import Swal from "sweetalert2";

function HeaderColumn(props) {
  const { column, handleChangeTitleColumn, handleDeleteColumn } = props;
  const [isChangeTitleCol, setIsChangeTitleCol] = useState(false);

  window.addEventListener("mousedown", (e) => {
    if (e.target.classList[0] !== "form-control") {
      setIsChangeTitleCol(false);
    }
  });

  return (
    <>
      <span
        className="title-column-inside"
        onClick={() => setIsChangeTitleCol(true)}
      >
        {!isChangeTitleCol ? (
          <span className="title"> {column.title}</span>
        ) : (
          <UpdateTitleCol
            handleChangeTitleColumn={handleChangeTitleColumn}
            column={column}
            setIsChangeTitleCol={setIsChangeTitleCol}
          />
        )}
      </span>
      {!isChangeTitleCol && (
        <i
          className="icon-delete-column ti-trash mb-2 mt-2"
          onClick={() => {
            Swal.fire(
              "Are you sure delete column?",
              `"${column.title}"`,
              "question"
            ).then((e) => {
              if (e.isConfirmed) {
                handleDeleteColumn();
              }
            });
          }}
        />
      )}
    </>
  );
}

export default HeaderColumn;
