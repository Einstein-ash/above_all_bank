
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Bank from "./pages/Bank.jsx"
import Scanner from './pages/Scanner.jsx';
import PaymentUI from './pages/PaymentUI.jsx';
import PinEntryScreen from './pages/PinInput.jsx';
import Success from './pages/Success.jsx';



function App() {
  return (


      <Router>
      <Routes>
        {/* <Route path="/" element={<PinEntryScreen />} /> */}
        {/* <Route path="/" element={<Success />} /> */}
        {/* <Route path="/" element={<Scanner />} /> */}
        <Route path="/" element={<Bank />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/payment" element={<PaymentUI />} />
        <Route path="/enterPin" element={<PinEntryScreen />} />
        <Route path="/success" element={<Success />} />
      </Routes>
      </Router>
  );
}

export default App;


