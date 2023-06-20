import React, { useEffect, useRef, useState } from "react";
import Card from "../Card/Card";
import "./Column.scss";
import { GrClose } from "react-icons/gr";
import { mapOrder } from "../../utilities/sorts";
import {
  createCard,
  deleteColumn,
  postSwapCard,
  updateColumn,
} from "../../services/apiServices";
import AddCard from "./AddCard";
import UpdateTitleCol from "./UpdateTitleCol";
import Swal from "sweetalert2";

const Column = (props) => {
  const {
    columnProps,
    cardStart,
    cardEnter,
    listColumns,
    idxColStart,
    objColStart,
    idxCardStart,
    objCardStart,
    idxColEnter,
    objColEnter,
    idxCardEnter,
    objCardEnter,
    cloneCardDrag,
    cloneCardDragX,
    cloneCardDragY,
    cloneColumnDrag,
    cloneColumnDragX,
    cloneColumnDragY,
    columnEmpty,
    idxColumnEmpty,
    objColEmpty,
    colDragStart,
    colDragEnd,
    indexColumn,
    setColumns,
    clickMouseY,
    dropMouseY,
    isDragFooter,
  } = props;
  const [column, setColumn] = useState(columnProps);

  const [cards, setCards] = useState(
    mapOrder(columnProps.cards, columnProps.cardOrder, "id")
  );
  const [showAddCard, setShowAddCard] = useState(false);
  const [isDragCard, setIsDragCard] = useState(true);
  const [draggingCard, setDraggingCard] = useState(false);
  const [isChangeTitleCol, setIsChangeTitleCol] = useState(false);
  const inputNewCardRef = useRef(null);
  useEffect(() => {
    window.addEventListener("mousedown", (e) => {
      clickMouseY.current = e.clientY;
      dropMouseY.current = e.clientY;
      if (e.target.classList[0] !== "form-control") {
        setIsChangeTitleCol(false);
        setIsDragCard(true);
      }
    });

    //hide from add card when click board
    window.addEventListener("mouseup", (e) => {
      e.target.className === "board-content" && setShowAddCard(false);
    });

    //move column drag clone with mouse
    window.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropMouseY.current = e.clientY;
      //css clone column drag
      if (cloneColumnDrag.current) {
        document.body.appendChild(cloneColumnDrag.current);
        cloneColumnDrag.current.style.position = "absolute";
        cloneColumnDragX.current = e.pageX - 130;
        cloneColumnDragY.current = e.pageY + 10;
        cloneColumnDrag.current.style.left = cloneColumnDragX.current + "px";
        cloneColumnDrag.current.style.top = cloneColumnDragY.current + "px";
        cloneColumnDrag.current.style.transform = "rotate(4deg)";
      }

      //css clone card drag
      if (cloneCardDrag.current) {
        document.body.appendChild(cloneCardDrag.current);
        cloneCardDrag.current.style.position = "absolute";
        cloneCardDrag.current.style.backgroundColor = "white";
        cloneCardDragX.current = e.pageX - 130;
        cloneCardDragY.current = e.pageY + 10;
        cloneCardDrag.current.style.left = cloneCardDragX.current + "px";
        cloneCardDrag.current.style.top = cloneCardDragY.current + "px";
        cloneCardDrag.current.style.transform = "rotate(4deg)";
        cloneCardDrag.current.style.borderRadius = "7px";
      }
    });

    //remove clone node when drag end
    window.addEventListener("dragend", async (e) => {
      e.target.classList.remove("is-card-dragging");
      if (
        (objColEnter.current &&
          objColStart.current &&
          objColEnter.current.id === objColStart.current.id) ||
        columnEmpty.current
      ) {
        if (column?.id === objColEnter.current?.id) {
          setColumn({ ...objColEnter.current });
          setCards([...objColEnter.current.cards]);
        }
        if (columnEmpty.current && columnEmpty.current.id === column.id) {
          setCards([...objColEmpty.current.cards]);
          setColumn({ ...objColEmpty.current });
          setTimeout(() => {
            columnEmpty.current = null;
          }, 0);
        }
      } else {
        if (
          column &&
          objColStart.current &&
          column.id === objColStart.current?.id
        ) {
          setColumn({ ...objColStart.current });
          setCards([...objColStart.current.cards]);
        } else if (
          column &&
          objColEnter.current &&
          column.id === objColEnter.current.id
        ) {
          setColumn({ ...objColEnter.current });
          setCards([...objColEnter.current.cards]);
        }
      }

      setTimeout(() => {
        columnEmpty.current = null;
        objColStart.current = null;
        objColEnter.current = null;
        cardStart.current = null;
        cardEnter.current = null;
      }, 0);
    });
  }, []);

  const handleCardDragOver = (e) => {
    e.preventDefault();
    if (cards.length === 0) {
      columnEmpty.current = column;
      cardEnter.current = cardStart.current;
    }

    if (!colDragStart.current) {
      colDragEnd.current = null;
    } else {
      colDragEnd.current = column;
    }
  };

  const handleDragCardLeave = (e) => {
    // colDragEnd.current = null

    if (cards.length === 0) {
      columnEmpty.current = null;
    }
  };

  const handleDragCardStart = (e, card) => {
    setDraggingCard(true);
    cardStart.current = card;
    colDragStart.current = null;
    colDragEnd.current = null;
    e.target.classList.add("is-card-dragging");

    //clone column drag
    cloneCardDrag.current = e.target.cloneNode(true);

    //remove class drag in clone node
    cloneCardDrag.current.classList.remove("is-card-dragging");
    //remove ghost when drag column
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleDragEnd = async (e, card) => {
    await setDraggingCard(false);
    await swapCard();
    let cardDrag = document.querySelector(".is-card-dragging");
    cardDrag && cardDrag.classList.remove("is-card-dragging");

    if (columnEmpty.current) {
      await postSwapCard(
        objColStart.current,
        columnEmpty.current,
        objCardStart.current,
        objCardEnter.current
      );
    } else {
      await postSwapCard(
        objColStart.current,
        objColEnter.current,
        objCardStart.current,
        objCardEnter.current
      );
    }
  };

  const handleDragCardEnter = (e, card) => {
    isDragFooter.current = false;
    e.preventDefault();
    if (colDragStart.current === null) {
      cardEnter.current = card;
      let colDrag = document.querySelector(".is-column-dragging");
      let cardDrag = document.querySelector(".is-card-dragging");
      cardDrag && cardDrag.classList.remove("is-card-dragging");
      !colDrag && e.target.classList.add("is-card-dragging");
    } else {
      colDragEnd.current = column;
    }
  };

  const swapCard = () => {
    //find  column start / enter
    idxColStart.current = listColumns.current.columns.findIndex(
      (item) => item.id === cardStart.current.columnId
    );
    idxColEnter.current = listColumns.current.columns.findIndex(
      (item) => item.id === cardEnter.current.columnId
    );

    if (idxColStart.current !== -1) {
      objColStart.current = listColumns.current.columns[idxColStart.current];
    }

    if (idxColEnter.current !== -1) {
      objColEnter.current = listColumns.current.columns[idxColEnter.current];
    }

    //find card start / enter
    idxCardStart.current = objColStart.current.cards.findIndex(
      (item) => item.id === cardStart.current.id
    );
    idxCardEnter.current = objColEnter.current.cards.findIndex(
      (item) => item.id === cardEnter.current.id
    );
    objCardStart.current = objColStart.current.cards[idxCardStart.current];
    objCardEnter.current = objColEnter.current.cards[idxCardEnter.current];

    //swap card start/enter
    if (
      idxColStart.current === idxColEnter.current &&
      columnEmpty.current === null
    ) {
      //swap card in one column
      listColumns.current.columns[idxColStart.current].cards[
        idxCardStart.current
      ] = objCardEnter.current;
      listColumns.current.columns[idxColEnter.current].cards[
        idxCardEnter.current
      ] = objCardStart.current;

      //swap orderCard in one column
      listColumns.current.columns[idxColStart.current].cardOrder[
        idxCardStart.current
      ] = objCardEnter.current.id;

      listColumns.current.columns[idxColEnter.current].cardOrder[
        idxCardEnter.current
      ] = objCardStart.current.id;
    } else {
      objCardStart.current.columnId =
        columnEmpty.current === null
          ? objCardEnter.current.columnId
          : columnEmpty.current.id;

      //remove card from column start
      listColumns.current.columns[idxColStart.current].cards =
        listColumns.current.columns[idxColStart.current].cards.filter(
          (item) => item.id !== objCardStart.current.id
        );
      listColumns.current.columns[idxColStart.current].cardOrder =
        listColumns.current.columns[idxColStart.current].cardOrder.filter(
          (item) => item !== objCardStart.current.id
        );

      if (columnEmpty.current === null) {
        //push //push card to column enter
        if (isDragFooter.current) {
          listColumns.current.columns[idxColEnter.current].cards.push(
            objCardStart.current
          );
          listColumns.current.columns[idxColEnter.current].cardOrder.push(
            objCardStart.current.id
          );
          isDragFooter.current = false;
        } else {
          listColumns.current.columns[idxColEnter.current].cards.splice(
            idxCardEnter.current,
            0,
            objCardStart.current
          );
          listColumns.current.columns[idxColEnter.current].cardOrder.splice(
            idxCardEnter.current,
            0,
            objCardStart.current.id
          );
        }
      } else {
        idxColumnEmpty.current = listColumns.current.columns.findIndex(
          (item) => item.id === columnEmpty.current.id
        );
        objColEmpty.current =
          listColumns.current.columns[idxColumnEmpty.current];
        //push card to column empty
        listColumns.current.columns[idxColumnEmpty.current].cards.push(
          objCardStart.current
        );
        listColumns.current.columns[idxColumnEmpty.current].cardOrder.push(
          objCardStart.current.id
        );
      }
    }
  };

  const handleHeaderColDragStart = (e) => {
    e.target.parentElement.classList.add("is-column-dragging");
    colDragStart.current = column;
    //clone column drag
    cloneColumnDrag.current = e.target.parentElement.cloneNode(true);

    //remove class drag in clone node
    cloneColumnDrag.current.classList.remove("is-column-dragging");

    // remove ghost when drag column
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleHeaderColDragEnter = (e) => {
    e.preventDefault();
    colDragEnd.current = column;
    if (
      cards.length > 0 &&
      cardStart?.current?.columnId !== cards[0]?.columnId
    ) {
      cardEnter.current = cards[0];
    }
  };

  const handleHeaderColDragEnd = (e) => {
    let colDrag = document.querySelector(".is-column-dragging");
    colDrag && colDrag.classList.remove("is-column-dragging");
  };

  const handleAddCard = async (dataTitleNew) => {
    //data add card
    let dataCardNew = {
      id: "card-" + Date.now(),
      columnId: column.id,
      title: dataTitleNew.trim(),
      boardId: column.boardId,
    };

    //validate data card
    if (!dataCardNew.title.trim()) return;

    //add card in to column
    await setCards([...cards, dataCardNew]);

    //add card into listColumns
    let idxCardAdd = listColumns.current.columns.findIndex(
      (item) => item.id === column.id
    );
    listColumns.current.columns[idxCardAdd].cards.push(dataCardNew);

    //add order card
    listColumns.current.columns[idxCardAdd].cardOrder.push(dataCardNew.id);
    await createCard(dataCardNew);
  };

  const handleDeleteColumn = async () => {
    //remove column in listColumns
    listColumns.current.columns = listColumns.current.columns.filter(
      (item) => item.id !== column.id
    );
    listColumns.current.columnOrder = listColumns.current.columnOrder.filter(
      (item) => item !== column.id
    );

    //remove column
    await setColumns(listColumns.current.columns);

    await deleteColumn(
      column.id,
      column.boardId,
      listColumns.current.columnOrder
    );
  };

  const handleChangeTitleColumn = async (e) => {
    //validate title column
    if (!e.trim()) {
      return;
    }

    //set data title column
    listColumns.current.columns[indexColumn].title = e.trim();
    await setColumn(listColumns.current.columns[indexColumn]);

    //update title column
    let dataUpdate = {
      id: column.id,
      title: e,
    };
    await updateColumn(dataUpdate);
  };

  return (
    <>
      <header
        className="header"
        draggable={isDragCard}
        onDragStart={(e) => handleHeaderColDragStart(e)}
        onDragEnter={(e) => handleHeaderColDragEnter(e)}
        onDragEnd={(e) => handleHeaderColDragEnd(e)}
        onDragOver={(e) => handleCardDragOver(e)}
      >
        <span
          className="title-column"
          onClick={() => {
            setIsChangeTitleCol(true);
            setIsDragCard(false);
          }}
        >
          {!isChangeTitleCol ? (
            <span className="title mt-3"> {column.title}</span>
          ) : (
            <UpdateTitleCol
              handleChangeTitleColumn={handleChangeTitleColumn}
              column={column}
              setIsChangeTitleCol={setIsChangeTitleCol}
            />
          )}
        </span>
        {!isChangeTitleCol && (
          <div
            className="icon-delete-column"
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
          >
            <i className="ti-trash"></i>
          </div>
        )}
      </header>

      <div
        className="content"
        onDragOver={(e) => handleCardDragOver(e)}
        onDragLeave={(e) => handleDragCardLeave(e)}
      >
        {cards.map((card, index) => {
          return (
            <div
              key={card.id}
              draggable={isDragCard}
              onDragStart={(e) => handleDragCardStart(e, card)}
              onDragEnd={(e) => handleDragEnd(e, card)}
              onDragEnter={(e) => handleDragCardEnter(e, card)}
            >
              <Card
                card={card}
                listColumns={listColumns}
                indexColumn={indexColumn}
                indexCard={index}
                setIsDragCard={setIsDragCard}
                draggingCard={draggingCard}
                setCards={setCards}
              />
            </div>
          );
        })}

        {showAddCard && (
          <>
            <AddCard
              handleAddCard={handleAddCard}
              inputNewCardRef={inputNewCardRef}
            />
            <div className="btn-handle-card">
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleAddCard(inputNewCardRef.current);
                  inputNewCardRef.current = "";
                }}
              >
                Add card
              </button>
              <GrClose
                className="btn-close"
                onClick={() => {
                  setShowAddCard(false);
                }}
              />
            </div>
          </>
        )}
      </div>
      <footer
        className="footer"
        onDragOver={(e) => {
          handleCardDragOver(e);
          isDragFooter.current = true;
        }}
        onDragEnter={(e) => {
          handleHeaderColDragEnter(e);
          isDragFooter.current = true;
        }}
        onDragLeave={(e) => handleDragCardLeave(e)}
        onClick={(e) => {
          setShowAddCard(true);
        }}
      >
        {!showAddCard && <span className="footer-add-btn"> + Add a card</span>}
      </footer>
    </>
  );
};

export default Column;
