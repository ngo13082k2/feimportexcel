import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CustomerRoom() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8080';


  useEffect(() => {
    fetchRoomData();
  }, []);
  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/customer-room/export`, {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customer_room.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setStatus('Xuất file Excel thành công!');
    } catch (err) {
      console.error(err);
      setStatus('Xuất file thất bại!');
    }
  };
  const fetchRoomData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/customer-room/get-all-field`);
      setData(response.data);
    } catch (err) {
      console.error(err);
      setStatus('Không thể tải dữ liệu phòng!');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus('Vui lòng chọn file Excel!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/customer-room/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus(response.data || 'Import room thành công!');
      fetchRoomData(); 
    } catch (err) {
      console.error(err);
      setStatus(
        err.response?.data
          ? 'Lỗi khi import room: ' + err.response.data
          : 'Đã xảy ra lỗi không xác định!'
      );
    }
  };
  const goToImportCustomer = () => {
    navigate('/import-customer');
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">📥 Import Excel danh sách khách + phòng</h2>
      <button
        onClick={goToImportCustomer}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-6"
      >
        ➕ Sang trang Import Khách Hàng
      </button>
      {/* Form upload */}
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

      <h3 className="text-xl font-medium mt-8 mb-2 text-gray-800">📋 Danh sách khách + phòng</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Họ tên</th>
              <th className="px-4 py-2 border">Giới tính</th>
              <th className="px-4 py-2 border">Ngày sinh</th>
              <th className="px-4 py-2 border">Phòng</th>
              <th className="px-4 py-2 border">Passport</th>
              <th className="px-4 py-2 border">Ngày cấp</th>
              <th className="px-4 py-2 border">Ngày hết hạn</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">Không có dữ liệu.</td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{item.fullName}</td>
                  <td className="px-4 py-2 border">{item.sex}</td>
                  <td className="px-4 py-2 border">{item.dob}</td>
                  <td className="px-4 py-2 border">{item.room}</td>
                  <td className="px-4 py-2 border">{item.passportNo || '-'}</td>
                  <td className="px-4 py-2 border">{item.doi || '-'}</td>
                  <td className="px-4 py-2 border">{item.doe || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          📤 Export Excel
        </button>
      </div>
    </div>
  );
}