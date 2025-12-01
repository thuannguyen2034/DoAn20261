'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { UserAddress } from '@/app/(protected)/user/address/page';
import styles from './AddressModal.module.css';

interface AddressModalProps {
  initialData: UserAddress | null;
  onClose: () => void;
  onSave: (address: UserAddress) => void;
}

export default function AddressModal({ initialData, onClose, onSave }: AddressModalProps) {
  const { authedFetch } = useAuth();
  const isEdit = !!initialData;

  const [formData, setFormData] = useState<Partial<UserAddress>>(
    initialData || {
      recipientName: '',
      recipientPhone: '',
      province: '',
      district: '',
      ward: '',
      streetAddress: '',
      addressType: null,
      default: false,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.recipientName || !formData.recipientPhone) {
      toast.error('Vui lòng nhập đầy đủ thông tin người nhận');
      return;
    }

    if (!formData.province || !formData.district || !formData.ward || !formData.streetAddress) {
      toast.error('Vui lòng nhập đầy đủ địa chỉ');
      return;
    }

    try {
      const url = isEdit ? `/api/v1/users/addresses/${initialData?.id}` : '/api/v1/users/addresses';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await authedFetch(url, {
        method,
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error();

      const saved = await res.json();
      onSave(saved);
      toast.success(isEdit ? 'Cập nhật thành công!' : 'Thêm địa chỉ thành công!');
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isEdit ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Họ và tên <span className={styles.required}>*</span></label>
              <input
                type="text"
                placeholder="Nhập họ và tên"
                value={formData.recipientName || ''}
                onChange={e => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Số điện thoại <span className={styles.required}>*</span></label>
              <input
                type="tel"
                placeholder="Nhập số điện thoại"
                value={formData.recipientPhone || ''}
                onChange={e => setFormData(prev => ({ ...prev, recipientPhone: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Tỉnh/Thành phố <span className={styles.required}>*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: Hà Nội"
                value={formData.province || ''}
                onChange={e => setFormData(prev => ({ ...prev, province: e.target.value }))}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Quận/Huyện <span className={styles.required}>*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: Hoàn Kiếm"
                value={formData.district || ''}
                onChange={e => setFormData(prev => ({ ...prev, district: e.target.value }))}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Phường/Xã <span className={styles.required}>*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: Hàng Bạc"
                value={formData.ward || ''}
                onChange={e => setFormData(prev => ({ ...prev, ward: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Địa chỉ cụ thể <span className={styles.required}>*</span></label>
            <input
              type="text"
              placeholder="Số nhà, tên đường..."
              value={formData.streetAddress || ''}
              onChange={e => setFormData(prev => ({ ...prev, streetAddress: e.target.value }))}
              required
            />
          </div>

          <div className={styles.addressTypes}>
            <label>Loại địa chỉ:</label>
            <div className={styles.radioGroup}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="type"
                  checked={formData.addressType === 'HOME'}
                  onChange={() => setFormData(prev => ({ ...prev, addressType: 'HOME' }))}
                />
                <span>Nhà riêng</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="type"
                  checked={formData.addressType === 'OFFICE'}
                  onChange={() => setFormData(prev => ({ ...prev, addressType: 'OFFICE' }))}
                />
                <span>Văn phòng</span>
              </label>
            </div>
          </div>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.default || false}
              onChange={e => setFormData(prev => ({ ...prev, default: e.target.checked }))}
            />
            <span>Đặt làm địa chỉ mặc định</span>
          </label>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Trở lại
            </button>
            <button type="submit" className={styles.saveBtn}>
              Hoàn thành
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}