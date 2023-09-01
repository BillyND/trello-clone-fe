import axios, { baseURL } from "./customAxios";

const triggerApi = () => {
  fetch(baseURL);
};

const getAllColumn = (data) => {
  const options = {
    boardId: data,
  };
  const resAllColumn = axios.post("/column", options);
  return resAllColumn;
};

const putUpdateBoards = (data) => {
  const resUpdate = axios.put(data);
  return resUpdate;
};

const updateColumnOrder = (boardId, columnOrder) => {
  const options = {
    id: boardId,
    columnOrder: columnOrder,
  };

  const resUpdateColOrder = axios.post("update-board", options);
  return resUpdateColOrder;
};

const createColumn = (dataCreate) => {
  const options = {
    id: dataCreate?.id,
    boardId: dataCreate?.boardId,
    cardOrder: dataCreate?.cardOrder,
    title: dataCreate?.title,
    cards: dataCreate?.cards,
  };
  const resCreateColumn = axios.post("/add-column", options);
  return resCreateColumn;
};

const updateColumn = (dataUpdate) => {
  const options = {
    id: dataUpdate?.id,
    title: dataUpdate?.title,
    boardId: dataUpdate?.boardId,
    cardOrder: dataUpdate?.cardOrder,
    cards: dataUpdate?.cards,
  };
  const resCreateColumn = axios.post("/update-column", options);
  return resCreateColumn;
};

const deleteColumn = (columnId, boardId, columnOrder) => {
  const options = {
    id: columnId,
    boardId: boardId,
    columnOrder: columnOrder,
  };
  const resDeleteColumn = axios.post("/delete-column", options);
  return resDeleteColumn;
};

const createCard = (dataCreate) => {
  const options = {
    id: dataCreate?.id,
    columnId: dataCreate?.columnId,
    title: dataCreate?.title,
    boardId: dataCreate?.boardId,
  };
  const resCreateCard = axios.post("add-card", options);
  return resCreateCard;
};

const updateCard = (cardId, cardTitle) => {
  const options = {
    id: cardId,
    title: cardTitle,
  };

  const resUpdateCard = axios.post("update-card", options);
};

const deleteCard = (cardId, columnId, cardOrder) => {
  const options = {
    id: cardId,
    columnId: columnId,
    cardOrder: cardOrder,
  };
  const resDeleteCard = axios.post("/delete-card", options);
  return resDeleteCard;
};

const postSwapCard = (colStart, colEnd, cardStart, cardEnd) => {
  const resSwap = axios.post("swap-card", {
    colStart,
    colEnd,
    cardStart,
    cardEnd,
  });

  return resSwap;
};

export {
  triggerApi,
  getAllColumn,
  putUpdateBoards,
  updateColumnOrder,
  createColumn,
  createCard,
  deleteCard,
  deleteColumn,
  updateCard,
  updateColumn,
  postSwapCard,
};
