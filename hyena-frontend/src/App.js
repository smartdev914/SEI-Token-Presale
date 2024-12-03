import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from './hook/presaleContext';
import { ToastContainer, Slide } from 'react-toastify';

import Landing from './pages/landing';
import Presale from './pages/presale';
import Header from './layout/header';

import './ReactToastify.css';


// import SnackbarProvider from 'react-simple-snackbar'

function App() {
  return (
    <UserProvider>
      <div className="App">
      <BrowserRouter>
        <Header />
            <Routes>
              <Route path='/' exact element={<Landing />} />
              <Route path='/presale' exact element={<Presale />} />
            </Routes>
      </BrowserRouter>
      <ToastContainer theme='dark' pauseOnFocusLoss={true} position="top-right" autoClose={5000} transition={Slide} style={{textAlign: "left", minWidth: "500px", maxWidth: "100%"}}/>
      </div>
    </UserProvider>
  );
}

export default App;
