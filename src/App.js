import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthWrapper from './AuthWrapper';
import FormInscription from './components/login&register/form_register';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/inscription" element={<FormInscription />} />
        <Route path="/*" element={<AuthWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
