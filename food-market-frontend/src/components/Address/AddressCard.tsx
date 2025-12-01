import { Home, Building2, MapPin, Phone, User, Trash2, Edit, Check } from 'lucide-react';
import { UserAddress } from '@/app/(protected)/user/address/page';
import styles from './AddressCard.module.css';

interface AddressCardProps {
  address: UserAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  const fullAddress = `${address.streetAddress}, ${address.ward}, ${address.district}, ${address.province}`;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.name}>
            <User size={16} />
            <strong>{address.recipientName}</strong>
          </div>
          <div className={styles.phone}>
            <Phone size={16} />
            {address.recipientPhone}
          </div>
        </div>
        {address.default && (
          <span className={styles.defaultBadge}>
            <Check size={14} />
            Mặc định
          </span>
        )}
      </div>

      <div className={styles.address}>
        <MapPin size={16} />
        <span>{fullAddress}</span>
      </div>

      {address.addressType && (
        <div className={styles.type}>
          {address.addressType === 'HOME' ? (
            <>
              <Home size={16} />
              Nhà riêng
            </>
          ) : (
            <>
              <Building2 size={16} />
              Văn phòng
            </>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <button onClick={onEdit} className={styles.editBtn}>
          <Edit size={16} />
          Sửa
        </button>
        {!address.default && (
          <button onClick={onSetDefault} className={styles.setDefaultBtn}>
            <Check size={16} />
            Đặt làm mặc định
          </button>
        )}
        <button onClick={onDelete} className={styles.deleteBtn}>
          <Trash2 size={16} />
          Xóa
        </button>
      </div>
    </div>
  );
}