
export enum Dept {
  SONG = 'Sóng',
  IN = 'In',
  THANH_PHAM = 'Thành phẩm',
  KHO = 'Kho'
}

export enum Role {
  ADMIN = 'Admin',
  USER = 'User'
}

export interface Employee {
  id: string;
  name: string;
  dept: Dept;
  role: Role;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  images: string[];
  timestamp: string;
  dept: Dept;
  isRead: boolean;
  isTagged?: boolean;
}

export interface IssueLog {
  id: string;
  date: string;
  recordId: string;
  dept: Dept;
  errorContent: string;
  images: string[];
  fixContent: string;
  note: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'pending' | 'approved';
}

export interface ProductionRecord {
  id: string;
  productId: string;
  productionCode: string; // Phiếu sản xuất
  status: 'new' | 'pending' | 'completed';
  lastUpdated: string;
  logs: IssueLog[];
  chat: ChatMessage[];
}

export interface Product {
  id: string;
  customerId: string;
  code: string;
  name: string;
  specs: Record<string, string>;
  records: ProductionRecord[];
}

export interface Customer {
  id: string;
  name: string;
  products: Product[];
}

export type ViewTab = 'dashboard' | 'customers' | 'notifications' | 'reports' | 'employees' | 'chat';
