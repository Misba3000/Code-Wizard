// import "./App.css";
import Login from "./Components/Login";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Registration from "./Components/Registration";
import { ToastContainer } from "react-toastify";
import Profile from "./Components/Profile";
import { useEffect, useState } from "react";
import EditCode from "./Components/Editor/EditCode";
import CodeEditor from "./Components/Editor/CodeEditor";
import Files from "./Components/Editor/Files";
import VideoCall from "./Components/Meet/VideoCall";

function App() {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    // auth.onAuthStateChanged((user) => {
    //   setUser(user);
    // });
    const storedLogin = localStorage.getItem("username") !== "null";
    setLogin(storedLogin);
  }, []);

  
  return (
    <div className="App">
      {/* <Provider> */}
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={login ? <Navigate to="/profile" /> : <Login />}
            ></Route>
            <Route path="/Register" element={<Registration />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/Editor" element={<CodeEditor />}></Route>
            <Route path="/editcode" element={<EditCode />}></Route>
            <Route path="/file" element={<Files />}></Route>
            {/* <Route path="/videocall/:roomId" element={<VideoCall />}></Route> */}
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      {/* </Provider> */}
    </div>
  );
}

export default App;
