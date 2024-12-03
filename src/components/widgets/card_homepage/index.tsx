import Dialog from '../dialog_homepage';
import EventDialog from '../event_dialog';
import HeroDialog from '../hero_dialog';
import PastorDialog from '../pastor_dialog';
import ServiceDialog from '../service_dialog';
import styles from './cardhomepage.module.scss'
import React, { useState } from 'react';


const Card: React.FC<CardProps> = ({ leftText, type, onSuccessAdd }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const getDialogContent = () => {
    switch (type) {
      case 'hero':
        return <HeroDialog onClose={closeDialog} onSuccessAdd={onSuccessAdd} />;
      case 'pastor':
        return <PastorDialog onClose={closeDialog} onSuccessAdd={onSuccessAdd} mode='add' />;
      case 'events':
        return <EventDialog onClose={closeDialog} onSuccessAdd={onSuccessAdd} />;
      case 'services':
        return <ServiceDialog onClose={closeDialog} onSuccessAdd={onSuccessAdd} />;
      default:
        return <p>Tidak ada konten untuk tipe ini.</p>;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.leftText}>{leftText}</div>
      <div className={styles.rightText}  onClick={openDialog}>+ Add Data</div>

      {/* Dialog */}
      {isDialogOpen && (
        <Dialog onClose={closeDialog}>
        {getDialogContent()}
      </Dialog>
      )}
    </div>
  );
};

export default Card;