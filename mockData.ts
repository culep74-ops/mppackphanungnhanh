
import { Customer, Employee, Role, Dept } from './types';

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'NV001', name: 'Nguyễn Văn Admin', dept: Dept.IN, role: Role.ADMIN },
  { id: 'NV002', name: 'Trần Thị Sóng', dept: Dept.SONG, role: Role.USER },
  { id: 'NV003', name: 'Lê Văn In', dept: Dept.IN, role: Role.USER },
  { id: 'NV004', name: 'Phạm Thành Phẩm', dept: Dept.THANH_PHAM, role: Role.USER },
  { id: 'NV005', name: 'Hoàng Kho', dept: Dept.KHO, role: Role.USER },
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'HEINEKEN VIETNAM',
    products: [
      {
        id: 'p1',
        customerId: 'c1',
        code: 'SKU-TIGER-CRYSTAL-24',
        name: 'Thùng Tiger Crystal 24 lon 330ml',
        specs: { dimensions: '405 x 265 x 125 mm', material: 'Duplex 250' },
        records: [
          {
            id: 'r1',
            productId: 'p1',
            productionCode: 'LSX-2023-11-001',
            status: 'pending',
            lastUpdated: '2023-11-20T10:30:00Z',
            chat: [
              {
                id: 'm1',
                senderId: 'NV002',
                senderName: 'Trần Thị Sóng',
                text: 'Phát hiện hở nắp ở bộ phận Sóng.',
                images: ['https://picsum.photos/400/300?random=1'],
                timestamp: '2023-11-20T08:00:00Z',
                dept: Dept.SONG,
                isRead: false
              }
            ],
            logs: [
              {
                id: 'l1',
                date: '2023-11-20',
                recordId: 'r1',
                dept: Dept.SONG,
                errorContent: 'Hở nắp',
                images: ['https://picsum.photos/400/300?random=1'],
                fixContent: 'Điều chỉnh nhiệt độ lô sấy',
                note: 'Đã xử lý xong',
                status: 'approved',
                approvedBy: 'NV001',
                approvedAt: '2023-11-20T09:00:00Z'
              }
            ]
          }
        ]
      },
      {
        id: 'p2',
        customerId: 'c1',
        code: 'SKU-LARUE-EX-12',
        name: 'Thùng Larue Biere Xuất Khẩu',
        specs: { dimensions: '300 x 200 x 150 mm', material: 'BC Flute' },
        records: []
      }
    ]
  },
  {
    id: 'c2',
    name: 'SUNTORY PEPSICO',
    products: []
  },
  {
    id: 'c3',
    name: 'UNILEVER VIETNAM',
    products: []
  }
];
