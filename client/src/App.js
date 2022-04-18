import {BrowserRouter, Routes, Route} from "react-router-dom"; 
import LandingPage from './components/LandingPage/LandingPage';
import Home from './components/Home/Home';
import CountryDetails from './components/CountryDetails/CountryDetails';
import CreateActivity from './components/CreateActivity/CreateActivity';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
        <Route  exact path='/' element={<LandingPage />} />
        <Route  exact path='/home' element={<Home />} />
        <Route  exact path='/country/:id' element={<CountryDetails />} /> 
        <Route  path='/createActivity' element={<CreateActivity />} />  
        </Routes>
        
        </div>
     </BrowserRouter>
  );
}

export default App;