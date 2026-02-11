
import React from 'react';
import { LayoutDashboard, Users, Bell, BarChart3, Contact, MessageSquare, LogOut } from 'lucide-react';

export const COLORS = {
  primary: '#0F4C81', // Corporate Blue
  secondary: '#F1F5F9',
  accent: '#3B82F6',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'customers', label: 'Khách hàng', icon: <Users size={20} /> },
  { id: 'notifications', label: 'Thông báo', icon: <Bell size={20} /> },
  { id: 'reports', label: 'Báo cáo', icon: <BarChart3 size={20} /> },
  { id: 'employees', label: 'Nhân viên', icon: <Contact size={20} /> },
  { id: 'chat', label: 'Chat Online', icon: <MessageSquare size={20} /> },
];

export const DEPARTMENTS = ['Sóng', 'In', 'Thành phẩm', 'Kho'];
