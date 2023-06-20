import React, { useEffect, useRef, useState } from "react";
import "./Card.scss";
import { deleteCard, updateCard } from "../../services/apiServices";
import Swal from "sweetalert2";

function Card(props) {
  const {
    card,
    listColumns,
    indexColumn,
    indexCard,
    setIsDragCard,
    draggingCard,
    setCards,
  } = props;
  const [cardTitle, setCardTitle] = useState(card.title);
  const [inputCardTitle, setInputCardTitle] = useState("");
  const [isChangeTitleCard, setIsChangeTitleCard] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    window.addEventListener("mouseup", (e) => {
      if (
        e.target.className === "board-content" ||
        e.target.className.baseVal === "icon-change-title-card"
      ) {
        setIsChangeTitleCard(false);
        setIsDragCard(true);
      }
    });
  }, []);

  const handleClickEditCard = async (e) => {
    await setIsChangeTitleCard(true);
    setInputCardTitle(cardTitle);
    inputRef.current.focus();
    await setIsDragCard(false);
  };

  const handleChangeCardTitle = async (e) => {
    setInputCardTitle(e);

    //validate title card
    if (!e.trim()) return;

    //set data title card
    setCardTitle(e.trim());
    listColumns.current.columns[indexColumn].cards[indexCard].title =
      inputCardTitle.trim();

    //update title column
    setIsDragCard(false);
    updateCard(card.id, e.trim());
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setIsChangeTitleCard(false);
    }
  };

  const handleDeleteCard = async () => {
    //remove card in listColumns
    listColumns.current.columns[indexColumn].cards =
      listColumns.current.columns[indexColumn].cards.filter(
        (item) => item.id !== card.id
      );
    listColumns.current.columns[indexColumn].cardOrder =
      listColumns.current.columns[indexColumn].cardOrder.filter(
        (item) => item !== card.id
      );

    //remove list cards
    setCards(listColumns.current.columns[indexColumn].cards);

    deleteCard(
      card.id,
      card.columnId,
      listColumns.current.columns[indexColumn].cardOrder
    );
  };

  return (
    <>
      {!isChangeTitleCard ? (
        <div className="content-item d-flex">
          <span
            className="title-item"
            onClick={async (e) => handleClickEditCard(e)}
          >
            {cardTitle}
          </span>
          {!draggingCard && (
            <span
              className="icon-delete-card d-flex align-items-center mx-2"
              onClick={() => {
                Swal.fire(
                  "Are you sure delete card?",
                  `"${card.title}"`,
                  "question"
                ).then((e) => {
                  if (e.isConfirmed) {
                    handleDeleteCard();
                  }
                });
              }}
            >
              <i className="ti-trash"></i>
            </span>
          )}
        </div>
      ) : (
        <div className="form-change-card">
          <input
            className="form-control input-title-card"
            ref={inputRef}
            value={inputCardTitle}
            onChange={(e) => handleChangeCardTitle(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e)}
          />
          <button
            className="btn btn-primary mt-3"
            onClick={() => setIsChangeTitleCard(false)}
          >
            Save
          </button>
        </div>
      )}
    </>
  );
}

export default Card;
