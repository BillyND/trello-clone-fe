import React, { useEffect, useRef, useState } from "react";

function AddCard(props) {
  const { handleAddCard, inputNewCardRef } = props;
  const [titleCard, setTitleCard] = useState("");
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
    inputNewCardRef.current === "" && setTitleCard("");
  }, [inputNewCardRef.current]);
  const objDiv = document.querySelectorAll(".content");
  for (const element of objDiv) {
    setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    });
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddCard(titleCard);
      setTitleCard("");
    }
  };

  return (
    <>
      <textarea
        style={{ outline: "none" }}
        ref={inputRef}
        type="text"
        spellCheck="false"
        className="form-control"
        aria-label="Small"
        value={titleCard}
        onChange={(e) => {
          setTitleCard(e.target.value);
          inputNewCardRef.current = e.target.value;
        }}
        placeholder="Enter title of this card..."
        onKeyDown={(e) => {
          handleKeyDown(e, titleCard);
        }}
      />
    </>
  );
}

export default AddCard;
