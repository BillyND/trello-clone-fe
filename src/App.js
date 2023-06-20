import "./App.scss";
import BoardContent from "./components/BoardContent/BoardContent";
import BoardHeader from "./components/BoardHeader/BoardHeader";
import AppHeader from "./components/AppHeader/AppHeader";

function App() {
  return (
    <div className="trello-container">
      <AppHeader />
      <BoardHeader />
      <BoardContent />
    </div>
  );
}

export default App;
