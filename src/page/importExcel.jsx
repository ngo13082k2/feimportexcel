import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function ImportExcel() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const API_BASE_URL = 'http://localhost:8080';
const navigate = useNavigate();
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('Vui lòng chọn file Excel!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/customer-information/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatus(res.data || 'Import thành công!');
    } catch (err) {
      console.error(err);
      setStatus(
        err.response?.data
          ? 'Import thất bại: ' + err.response.data
          : 'Đã xảy ra lỗi không xác định!'
      );
    }
  };
  const goToImportRoom = () => {
    navigate('/import-room');
  };
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">
        📥 Import khách hàng từ Excel
      </h2>

      {/* Nút sang trang import-room */}
      <div className="mb-6">
        <button
          onClick={goToImportRoom}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          ➕ Sang trang Import Phòng
        </button>
      </div>

      <form onSubmit={handleUpload} className="flex items-center gap-4 mb-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setStatus('');
          }}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </form>

      {status && (
        <p className="mt-2 font-semibold text-green-700">{status}</p>
      )}
    </div>
  );
}
