
import React, { useState, useMemo } from 'react';
import { ViewTab, Customer, Employee, Role, Dept, ProductionRecord, Product } from './types';
import { COLORS, NAV_ITEMS } from './constants';
import { MOCK_CUSTOMERS, MOCK_EMPLOYEES } from './mockData';
import Dashboard from './components/Dashboard';
import RecordDetail from './components/RecordDetail';
import { 
  ChevronRight, Search, LogOut, Package, UserCircle, 
  Settings, Menu, X, Bell, LayoutGrid, Filter
} from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_EMPLOYEES.find(emp => emp.id === employeeId);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      // For standard users, jump directly to relevant section
      if (user.role === Role.USER) {
        setActiveTab('chat');
      }
    } else {
      alert('Mã nhân viên không hợp lệ!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setEmployeeId('');
    setActiveTab('dashboard');
  };

  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    for (const c of customers) {
      const p = c.products.find(prod => prod.id === selectedProductId);
      if (p) return p;
    }
    return null;
  }, [selectedProductId, customers]);

  const updateRecord = (recordId: string, updates: Partial<ProductionRecord>) => {
    setCustomers(prev => prev.map(c => ({
      ...c,
      products: c.products.map(p => ({
        ...p,
        records: p.records.map(r => r.id === recordId ? { ...r, ...updates } : r)
      }))
    })));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-[#0F4C81] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
               <Package size={40} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F4C81]">CartonRecord Login</h1>
            <p className="text-gray-400 text-sm mt-1">Hệ thống quản lý sản xuất bao bì</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Mã Nhân Viên</label>
              <input 
                type="text" 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Ví dụ: NV001" 
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-[#0F4C81] focus:ring-0 outline-none transition text-lg font-medium"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#0F4C81] text-white font-bold py-3 px-6 rounded-xl hover:bg-opacity-90 shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group"
            >
              VÀO HỆ THỐNG <ChevronRight size={20} className="group-hover:translate-x-1 transition" />
            </button>
          </form>
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-xs text-gray-400">© 2024 Carton Packaging Solutions. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* COLUMN 1: NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-20 md:relative md:w-20 lg:w-64 bg-[#0F4C81] text-white flex flex-col transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
             <Package size={24} />
          </div>
          <span className="font-bold text-xl hidden lg:block">CartonRecord</span>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-white text-[#0F4C81] shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <div className="shrink-0">{item.icon}</div>
              <span className="font-semibold text-sm hidden lg:block">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
           <div className="mb-4 hidden lg:flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl">
              <UserCircle size={24} className="text-blue-300" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-white/50">{currentUser?.dept}</p>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-300 hover:bg-red-500/20 transition-all"
           >
             <LogOut size={20} />
             <span className="font-semibold text-sm hidden lg:block">Đăng xuất</span>
           </button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />}

      {/* COLUMN 2: LIST (DYNAMIC) */}
      <div className={`flex-col md:w-80 border-r bg-white h-full transition-all ${selectedProductId ? 'hidden md:flex' : 'flex w-full'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="md:hidden p-2 -ml-2" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <h2 className="font-bold text-lg">
              {activeTab === 'customers' ? 'Danh sách Khách hàng' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
             {/* Filter is now imported above */}
             <Filter size={18} />
          </button>
        </div>

        <div className="p-4 bg-slate-50 border-b">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-[#0F4C81] outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'customers' && (
            <div className="divide-y divide-slate-100">
              {customers.map(customer => (
                <div key={customer.id} className="group">
                  <button 
                    onClick={() => setSelectedCustomerId(selectedCustomerId === customer.id ? null : customer.id)}
                    className={`w-full text-left p-4 hover:bg-slate-50 flex items-center justify-between transition-colors ${selectedCustomerId === customer.id ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-[#0F4C81] group-hover:bg-blue-200 transition">
                          <LayoutGrid size={20} />
                       </div>
                       <div>
                         <p className="font-bold text-slate-800 uppercase text-xs tracking-wide">{customer.name}</p>
                         <p className="text-[10px] text-slate-400 mt-0.5">{customer.products.length} nhãn hàng</p>
                       </div>
                    </div>
                    <ChevronRight size={16} className={`text-slate-300 transition-transform ${selectedCustomerId === customer.id ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {selectedCustomerId === customer.id && (
                    <div className="bg-slate-50/80 px-4 py-2 space-y-2">
                       {customer.products.length > 0 ? customer.products.map(product => (
                         <button 
                           key={product.id}
                           onClick={() => setSelectedProductId(product.id)}
                           className={`w-full text-left p-3 rounded-xl border transition-all ${selectedProductId === product.id ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500' : 'bg-white/50 border-slate-200 hover:border-blue-300'}`}
                         >
                            <div className="flex justify-between items-start mb-2">
                               <p className="font-bold text-slate-800 text-sm leading-tight">{product.name}</p>
                               <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>
                            </div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase mb-3">{product.code}</p>
                            <div className="flex gap-1.5 overflow-x-hidden">
                               {product.records.slice(0, 1).map(r => (
                                 <span key={r.id} className="text-[9px] bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded border border-blue-100 whitespace-nowrap">
                                   {r.productionCode}
                                 </span>
                               ))}
                               <span className="text-[9px] text-slate-400 py-1">Cập nhật: 2023-11-20</span>
                            </div>
                         </button>
                       )) : (
                         <p className="text-center py-4 text-slate-400 text-xs italic">Chưa có sản phẩm</p>
                       )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {activeTab !== 'customers' && (
             <div className="p-10 text-center text-slate-400">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} />
               </div>
               <p className="text-sm">Vui lòng chọn mục quản lý</p>
             </div>
          )}
        </div>
      </div>

      {/* COLUMN 3: CONTENT / DETAILS */}
      <main className="flex-1 h-full overflow-hidden bg-white">
        {activeTab === 'dashboard' ? (
          <Dashboard />
        ) : selectedProduct ? (
          <div className="h-full flex flex-col p-6 animate-in slide-in-from-right duration-500">
             <RecordDetail 
               product={selectedProduct} 
               user={currentUser!} 
               onUpdateRecord={updateRecord}
             />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
             <div className="p-8 rounded-full bg-slate-50 mb-4 animate-pulse">
                <Package size={80} />
             </div>
             <h3 className="text-xl font-bold text-slate-600">Chọn một hồ sơ để bắt đầu làm việc</h3>
             <p className="max-w-xs text-center mt-2 text-sm leading-relaxed">Sử dụng menu cột bên trái để tìm kiếm khách hàng, nhãn hàng và phiếu sản xuất cụ thể.</p>
          </div>
        )}
      </main>

      {/* RIGHT-SIDE FLOATING NOTIFICATIONS (Simulation) */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
         {/* Placeholder for real-time toast notifications */}
      </div>
    </div>
  );
};

export default App;
