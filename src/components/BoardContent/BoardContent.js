import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import {
  createColumn,
  getAllColumn,
  triggerApi,
  updateColumnOrder,
} from "../../services/apiServices";
import { mapOrder } from "../../utilities/sorts";
import Column from "../Column/Column";
import AddColumn from "./AddColumn";
import "./BoardContent.scss";
function BoardContent(props) {
  const [boardFormDB, setBoardFormDB] = useState([]);
  const [columns, setColumns] = useState([]);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [clickMouseX, dropMouseX] = [useRef(null), useRef(null)];
  const [cardStart, cardEnter] = [useRef(null), useRef(null)];
  const [idxColStart, idxColEnter, objColStart, objColEnter, isDragFooter] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [idxCardStart, idxCardEnter, objCardStart, objCardEnter] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [cloneCardDrag, cloneCardDragX, cloneCardDragY] = [
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [cloneColumnDrag, cloneColumnDragX, cloneColumnDragY] = [
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [idxColumnEmpty, columnEmpty, objColEmpty] = [
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [colDragStart, colDragEnd, idxColDragStart, idxColDragEnd] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [clickMouseY, dropMouseY, inputRef, listColumns] = [
    useRef(null),
    useRef(null),
    useRef(),
    useRef(null),
  ];

  useEffect(() => {
    triggerApi();
    window.addEventListener("mousedown", (e) => {
      clickMouseX.current = e.pageX;
    });
    window.addEventListener("dragover", (e) => {
      dropMouseX.current = e.pageX;
    });
    window.addEventListener("mouseup", (e) => {
      if (e.target.className === "board-content") {
        setShowAddColumn(false);
      }
    });

    window.addEventListener("dragend", (e) => {
      e.preventDefault();
      if (cloneColumnDrag.current) {
        cloneColumnDrag.current.style.display = "none";
        cloneColumnDrag.current.remove();
      }
      if (cloneCardDrag.current) {
        cloneCardDrag.current.style.display = "none";
        cloneCardDrag.current.remove();
      }
    });
    fetchAllColumn();
  }, []);

  //fetch all column
  const fetchAllColumn = async () => {
    const boardIdFind = "board-1";
    const resAllBoards = await getAllColumn(boardIdFind);
    setBoardFormDB(resAllBoards.data.data);
    let listColOrder = mapOrder(
      resAllBoards.data.data.columns,
      resAllBoards.data.data.columnOrder,
      "id"
    );
    setColumns(listColOrder);
    listColumns.current = resAllBoards.data.data;
  };

  const handleColumnSwapDragEnter = (e, column) => {
    e.preventDefault();
    colDragEnd.current = column;
    let colDrag = document.querySelector(".is-column-dragging");
    let cardDrag = document.querySelector(".is-card-dragging");

    e.target.className === "footer-add-btn" &&
      colDrag &&
      colDrag.classList.remove("is-column-dragging");
    e.target.classList[0] === "title-item" &&
      colDrag &&
      colDrag.classList.remove("is-column-dragging");
    e.target.classList[0] === "title-column" &&
      colDrag &&
      colDrag.classList.remove("is-column-dragging");
    e.target.classList[0] === "title" &&
      colDrag &&
      colDrag.classList.remove("is-column-dragging");
    e.target.parentElement.classList[0] === "child-column" &&
      colDrag &&
      colDrag.classList.remove("is-column-dragging");
    e.target.parentElement.classList[0] === "child-column" &&
      !cardDrag &&
      e.target.parentElement.classList.add("is-column-dragging");
    e.target.classList[0] === "title-column" &&
      !cardDrag &&
      e.target.parentElement.parentElement.classList.add("is-column-dragging");
    e.target.classList[0] === "title" &&
      !cardDrag &&
      e.target.parentElement.parentElement.parentElement.parentElement.classList.add(
        "is-column-dragging"
      );
    e.target.classList[0] === "title-item" &&
      !cardDrag &&
      e.target.parentElement.parentElement.parentElement.parentElement.classList.add(
        "is-column-dragging"
      );
    e.target.className === "footer-add-btn" &&
      !cardDrag &&
      e.target.parentElement.parentElement.classList.add("is-column-dragging");
  };

  const handleColumnSwapDragEnd = async (e, column) => {
    if (
      colDragEnd.current &&
      colDragStart.current &&
      colDragEnd.current.id !== colDragStart.current.id
    ) {
      idxColDragStart.current = listColumns.current.columns.findIndex(
        (item) => item.id === colDragStart.current.id
      );
      idxColDragEnd.current = listColumns.current.columns.findIndex(
        (item) => item.id === colDragEnd.current.id
      );

      //swap column
      if (idxColDragStart.current !== -1) {
        listColumns.current.columns[idxColDragStart.current] =
          colDragEnd.current;
        listColumns.current.columnOrder[idxColDragStart.current] =
          colDragEnd.current.id;
      }
      if (idxColDragEnd.current !== -1) {
        listColumns.current.columns[idxColDragEnd.current] =
          colDragStart.current;
        listColumns.current.columnOrder[idxColDragEnd.current] =
          colDragStart.current.id;
      }
      //re-render list column
      setColumns([...listColumns.current.columns]);

      //update columnOrder
      updateColumnOrder("board-1", listColumns.current.columnOrder);
      setTimeout(() => {
        colDragEnd.current = null;
        colDragStart.current = null;
      }, 0);
    }
  };

  const handleAddColumn = async (dataTitleNew) => {
    let dataColumnAdd = {
      id: "column-" + Date.now(),
      boardId: boardFormDB.id,
      cardOrder: [],
      title: dataTitleNew.trim(),
      cards: [],
    };

    //validate column title
    if (!dataColumnAdd.title.trim()) return;

    //display column added
    setColumns([...columns, dataColumnAdd]);
    listColumns.current.columns.push(dataColumnAdd);
    listColumns.current.columnOrder.push(dataColumnAdd.id);

    //post column added
    createColumn(dataColumnAdd);
  };

  return (
    <div className="board-content">
      {columns.map((column, index) => {
        return (
          <div
            className={`child-column`}
            key={index + Math.random()}
            onDragEnter={(e) => {
              handleColumnSwapDragEnter(e, column);
            }}
            onDragEnd={(e) => handleColumnSwapDragEnd(e, column)}
          >
            <Column
              columnProps={column}
              cardStart={cardStart}
              cardEnter={cardEnter}
              listColumns={listColumns}
              idxColStart={idxColStart}
              idxColEnter={idxColEnter}
              objColStart={objColStart}
              objColEnter={objColEnter}
              idxCardStart={idxCardStart}
              idxCardEnter={idxCardEnter}
              objCardStart={objCardStart}
              objCardEnter={objCardEnter}
              cloneCardDrag={cloneCardDrag}
              cloneCardDragX={cloneCardDragX}
              cloneCardDragY={cloneCardDragY}
              cloneColumnDrag={cloneColumnDrag}
              cloneColumnDragX={cloneColumnDragX}
              cloneColumnDragY={cloneColumnDragY}
              columnEmpty={columnEmpty}
              idxColumnEmpty={idxColumnEmpty}
              objColEmpty={objColEmpty}
              colDragStart={colDragStart}
              colDragEnd={colDragEnd}
              setColumns={setColumns}
              idxColDragStart={idxColDragStart}
              idxColDragEnd={idxColDragEnd}
              indexColumn={index}
              clickMouseY={clickMouseY}
              dropMouseY={dropMouseY}
              isDragFooter={isDragFooter}
            />
          </div>
        );
      })}
      {!showAddColumn ? (
        <button
          className="btn btn-add-column"
          onClick={async () => {
            await setShowAddColumn(true);
          }}
        >
          <AiOutlinePlus className="icon-" />
          Add another list
        </button>
      ) : (
        <AddColumn
          handleAddColumn={handleAddColumn}
          setShowAddColumn={setShowAddColumn}
        />
      )}
    </div>
  );
}

export default BoardContent;
