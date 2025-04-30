import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "./Components/Home/Home";
import Crop_Add from "./Components/Crop_Add/Crop_Add";
import Crop_History from "./Components/Crop_History/Crop_History";
import Crop_Update from "./Components/Crop_Update/Crop_Update";
import Main_Home from './Components/Main_Home/Main_Home';
import SignUp from './Components/SignUp/SignUp';
import Login from './Components/Login/Login';
import Crop_Expenses from './Components/Crop_Expenses/Crop_Expenses';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Main_Home/>} />
        <Route path="/Crop_Add" element={<Crop_Add />} />
        <Route path="/Crop_History" element={<Crop_History />} />
        <Route path="/Crop_History/:id" element={<Crop_Update />} />
        <Route path="/Home" element={<Home/>}/>
        <Route path="/SignUp" element={<SignUp/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Crop_Expenses" element={<Crop_Expenses/>}/>
      </Routes>
    </div>
  );
}

export default App;

// import React from 'react';
// import { Route, Routes } from 'react-router-dom';
// import './App.css';
// import Home from "./Components/Home/Home";
// import Crop_Add from "./Components/Crop_Add/Crop_Add";
// import Crop_History from "./Components/Crop_History/Crop_History";
// import Crop_Update from "./Components/Crop_Update/Crop_Update";
// import Main_Home from './Components/Main_Home/Main_Home';
// import SignUp from './Components/SignUp/SignUp';

// function App() {
//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/Crop_Add" element={<Crop_Add />} />
//         <Route path="/Crop_History" element={<Crop_History />} />
//         <Route path="/Crop_History/:id" element={<Crop_Update />} />
//         <Route path="/Main_Home" element={<Main_Home/>}/>
//         <Route path="/SignUp" element={<SignUp/>}/>
//       </Routes>
//     </div>
//   );
// }

// export default App;
