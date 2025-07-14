
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ImportCustomer from './page/importExcel';  // Đường dẫn đúng đến file bạn đã tạo
import CustomerRoom from './page/CustomerRoom';


function App() {
  return (
    <Router>
      <Routes>
        {/* Khi truy cập / → chuyển hướng sang /import-customer */}
        <Route path="/" element={<Navigate to="/import-customer" />} />

        {/* Khi truy cập /import-customer → hiển thị ImportCustomer */}
        <Route path="/import-customer" element={<ImportCustomer />} />

        {/* Khi truy cập /import-room → hiển thị CustomerRoom */}
        <Route path="/import-room" element={<CustomerRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
