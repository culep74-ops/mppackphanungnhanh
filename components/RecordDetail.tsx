
import React, { useState } from 'react';
import { Product, Dept, ProductionRecord, IssueLog, ChatMessage, Role, Employee } from '../types';
import { 
  FileText, Info, MessageSquare, Save, CheckCircle, Image as ImageIcon, 
  Send, User, Search, Filter, ChevronRight, MoreVertical, Clock 
} from 'lucide-react';
import { DEPARTMENTS, COLORS } from '../constants';

interface RecordDetailProps {
  product: Product;
  user: Employee;
  onUpdateRecord: (recordId: string, updates: Partial<ProductionRecord>) => void;
}

const RecordDetail: React.FC<RecordDetailProps> = ({ product, user, onUpdateRecord }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tech' | 'chat' | 'approve'>('overview');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(product.records[0]?.id || null);
  const [chatInput, setChatInput] = useState('');
  const [pendingImages, setPendingImages] = useState<string[]>([]);

  const selectedRecord = product.records.find(r => r.id === selectedRecordId);

  const handleSendMessage = () => {
    if ((!chatInput.trim() && pendingImages.length === 0) || !selectedRecord) return;
    
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      senderName: user.name,
      text: chatInput,
      images: pendingImages,
      timestamp: new Date().toISOString(),
      dept: user.dept,
      isRead: false
    };

    onUpdateRecord(selectedRecord.id, {
      chat: [...selectedRecord.chat, newMessage]
    });

    setChatInput('');
    setPendingImages([]);
  };

  const handleImageDoubleClick = (imageUrl: string) => {
    // Jump to Approval Tab with this image
    setActiveTab('approve');
  };

  const renderOverview = () => {
    if (!selectedRecord) return <div className="p-8 text-center text-gray-400">Chưa có phiếu sản xuất</div>;

    const groupedLogs: Record<string, IssueLog[]> = {};
    selectedRecord.logs.forEach(log => {
      if (!groupedLogs[log.date]) groupedLogs[log.date] = [];
      groupedLogs[log.date].push(log);
    });

    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Mã SP</label>
            <p className="text-sm font-medium bg-white p-2 border rounded mt-1">{product.code}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Tên SP</label>
            <p className="text-sm font-medium bg-white p-2 border rounded mt-1">{product.name}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Phiếu SX</label>
            <p className="text-sm font-medium bg-white p-2 border rounded mt-1">{selectedRecord.productionCode}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            {/* Added Clock to imports above */}
            <Clock size={18} className="text-blue-600" /> Nhật Ký Lỗi & Khắc Phục
          </h3>
          <div className="overflow-hidden border rounded-xl bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
                <tr>
                  <th className="p-4 border-b w-32">NGÀY</th>
                  <th className="p-4 border-b">CHI TIẾT LỖI</th>
                  <th className="p-4 border-b">KHẮC PHỤC</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {Object.entries(groupedLogs).map(([date, logs]) => (
                  <tr key={date} className="group">
                    <td className="p-4 align-top font-semibold text-slate-700">
                      {new Date(date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-0 align-top">
                      <div className="divide-y divide-slate-100">
                        {logs.map(log => (
                          <div key={log.id} className="p-4 flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                               <span className="text-[10px] font-bold text-blue-600">{log.dept.slice(0, 2).toUpperCase()}</span>
                            </div>
                            <div>
                               <p className="font-medium text-slate-800">{log.dept.toUpperCase()}</p>
                               <p className="text-slate-500 mt-1">{log.errorContent}</p>
                               {log.images.length > 0 && (
                                 <div className="flex gap-2 mt-2">
                                   {log.images.map((img, idx) => (
                                     <img key={idx} src={img} className="w-12 h-12 object-cover rounded border" />
                                   ))}
                                 </div>
                               )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-0 align-top bg-green-50/20">
                      <div className="divide-y divide-green-100">
                        {logs.map(log => (
                          <div key={log.id} className="p-4 h-full flex items-center">
                            <p className="text-green-700 font-medium italic">{log.fixContent || '---'}</p>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {selectedRecord.logs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-gray-400">Không có bản ghi nhật ký nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderChat = () => {
    if (!selectedRecord) return null;
    return (
      <div className="flex flex-col h-[calc(100vh-280px)] bg-white rounded-xl border overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
           {selectedRecord.chat.map((msg) => (
             <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.senderId === user.id ? 'bg-[#0F4C81] text-white' : 'bg-white border text-gray-800'} rounded-2xl p-3 shadow-sm`}>
                   <div className="flex justify-between items-center mb-1 gap-4">
                      <span className="text-[10px] font-bold opacity-70 uppercase">{msg.senderName} ({msg.dept})</span>
                      <span className="text-[10px] opacity-50">{new Date(msg.timestamp).toLocaleTimeString('vi-VN')}</span>
                   </div>
                   <p className="text-sm">{msg.text}</p>
                   {msg.images.length > 0 && (
                     <div className="grid grid-cols-2 gap-2 mt-2">
                        {msg.images.map((img, i) => (
                          <img 
                            key={i} 
                            src={img} 
                            className="rounded-lg cursor-pointer hover:opacity-80 transition" 
                            onDoubleClick={() => handleImageDoubleClick(img)} 
                            alt="Chat attachment" 
                          />
                        ))}
                     </div>
                   )}
                </div>
             </div>
           ))}
        </div>
        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full transition">
              <ImageIcon size={20} />
            </button>
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Nhập tin nhắn..." 
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-[#0F4C81]"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage}
              className="p-2 bg-[#0F4C81] text-white rounded-full shadow-md hover:bg-opacity-90 transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderApproval = () => {
    return (
      <div className="p-6 bg-white border rounded-xl shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Duyệt & Lưu Dữ Liệu Lỗi</h3>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">Chế độ chờ duyệt</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-dashed">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Hình ảnh từ Chat Online</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="relative group aspect-square">
                    <img src={`https://picsum.photos/200/200?random=${i+10}`} className="w-full h-full object-cover rounded-lg" />
                    <button className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">×</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung lỗi</label>
              <textarea 
                className="w-full border rounded-lg p-3 text-sm focus:ring-[#0F4C81]" 
                rows={3} 
                placeholder="Mô tả chi tiết lỗi sản xuất..."
              ></textarea>
            </div>
          </div>

          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bộ phận</label>
                  <select className="w-full border rounded-lg p-2 text-sm">
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phiếu SX</label>
                  <input type="text" value={selectedRecord?.productionCode} disabled className="w-full bg-gray-50 border rounded-lg p-2 text-sm" />
                </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Cách khắc phục</label>
               <textarea 
                 className="w-full border rounded-lg p-3 text-sm focus:ring-green-500 border-green-100 bg-green-50/30" 
                 rows={3} 
                 placeholder="Hướng giải quyết..."
               ></textarea>
             </div>

             <div className="flex gap-2 pt-4">
               <button className="flex-1 px-4 py-3 border rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 uppercase">Lưu tạm</button>
               <button className="flex-1 px-4 py-3 bg-[#0F4C81] text-white rounded-lg text-sm font-bold hover:bg-opacity-90 shadow-lg shadow-blue-900/10 uppercase">Duyệt & Ghi sổ</button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{product.name}</h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-xs font-semibold text-slate-400">{product.code}</span>
             <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
             <span className="text-xs font-semibold text-blue-600">HEINEKEN VIETNAM</span>
          </div>
        </div>
        <div className="flex gap-1 mt-4 md:mt-0 bg-slate-100 p-1 rounded-xl">
          {[
            {id: 'overview', label: 'Tổng quan', icon: <FileText size={16}/>},
            {id: 'tech', label: 'Chi tiết', icon: <Info size={16}/>},
            {id: 'chat', label: 'Chat Online', icon: <MessageSquare size={16}/>},
            {id: 'approve', label: 'Duyệt & Lưu', icon: <CheckCircle size={16}/>}
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-[#0F4C81] shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'chat' && renderChat()}
        {activeTab === 'approve' && renderApproval()}
        {activeTab === 'tech' && (
          <div className="p-10 text-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed">
            Thông tin chi tiết kỹ thuật đang được cập nhật...
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordDetail;
