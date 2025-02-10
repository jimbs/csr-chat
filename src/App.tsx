import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Chat } from "./pages/Chat";
import { Login } from "./pages/Login";  
import { CSR } from "./pages/Main";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<CSR />}>
          <Route path=":id" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
