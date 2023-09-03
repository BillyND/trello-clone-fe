import React from "react";
import Card from "./Card";

function ListCard(props) {
  const {
    setCards,
    setIsDragCard,
    cards,
    isDragCard,
    handleDragCardStart,
    handleDragEnd,
    handleDragCardEnter,
    listColumns,
    indexColumn,
    draggingCard,
  } = props;
  return (
    <>
      {cards?.map((card, index) => {
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
    </>
  );
}

export default ListCard;
