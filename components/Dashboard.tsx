
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { FileText, Clock, AlertTriangle, CheckCircle, FilePlus } from 'lucide-react';

const COLORS = ['#0F4C81', '#3B82F6', '#10B981', '#F59E0B'];

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Tổng số hồ sơ', value: 1540, change: '+12%', icon: <FileText className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Hồ sơ mới (Hôm nay)', value: 12, change: '+5', icon: <FilePlus className="text-indigo-600" />, bg: 'bg-indigo-50' },
    { label: 'Cảnh báo / Lỗi', value: 4, status: 'Cần kiểm tra ngay', icon: <AlertTriangle className="text-red-600" />, bg: 'bg-red-50' },
    { label: 'Chờ phê duyệt', value: 45, status: 'Đang trong hàng đợi', icon: <Clock className="text-amber-600" />, bg: 'bg-amber-50' },
  ];

  const lineData = [
    { name: 'T2', value: 120 },
    { name: 'T3', value: 135 },
    { name: 'T4', value: 110 },
    { name: 'T5', value: 155 },
    { name: 'T6', value: 140 },
    { name: 'T7', value: 180 },
    { name: 'CN', value: 95 },
  ];

  const pieData = [
    { name: 'Chờ duyệt', value: 45 },
    { name: 'Hủy/Sửa', value: 15 },
    { name: 'Đã duyệt', value: 140 },
  ];

  const errorDeptData = [
    { name: 'Sóng', warning: 4, critical: 2 },
    { name: 'In', warning: 2, critical: 1 },
    { name: 'T.Phẩm', warning: 5, critical: 3 },
    { name: 'Kho', warning: 1, critical: 0 },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tổng quan Hệ thống</h1>
          <p className="text-sm text-gray-500">Cập nhật lúc: {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <FileText size={16} /> Xuất Báo cáo PDF
          </button>
          <button className="px-4 py-2 bg-[#0F4C81] text-white rounded-md text-sm font-medium hover:bg-opacity-90">
            + Báo cáo nhanh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>{stat.icon}</div>
              {stat.change && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>}
            </div>
            <div className="text-gray-500 text-sm mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            {stat.status && <div className="text-xs text-gray-400 mt-1">{stat.status}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Lưu lượng xử lý (Bộ phận Sản xuất)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} dot={{r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Trạng thái Phê duyệt</h3>
          <div className="h-64 relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">100%</span>
              <span className="text-xs text-gray-400">Hoàn thành</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs">
             <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[0]}}></div> Chờ Duyệt</div>
             <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[1]}}></div> Hủy / Sửa</div>
             <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[2]}}></div> Đã Duyệt</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Biểu đồ Báo cáo Lỗi hệ thống</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorDeptData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="warning" name="Cảnh báo" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="critical" name="Lỗi nghiêm trọng" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Hoạt động Gần đây</h3>
          <div className="space-y-4 overflow-y-auto h-64">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 items-start pb-4 border-b last:border-0 border-gray-50">
                <div className={`p-2 rounded-full ${i % 2 === 0 ? 'bg-blue-50' : 'bg-green-50'}`}>
                   {i % 2 === 0 ? <FileText size={16} className="text-blue-500" /> : <CheckCircle size={16} className="text-green-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Cập nhật hồ sơ nhân sự #{2020 + i}</p>
                  <p className="text-xs text-gray-400">Vừa xong • Bởi Nguyễn Văn A</p>
                </div>
                <span className="text-xs text-gray-400">10:30 AM</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
