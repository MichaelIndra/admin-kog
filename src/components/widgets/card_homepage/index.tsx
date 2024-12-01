import Dialog from '../dialog_homepage';
import EventDialog from '../event_dialog';
import HeroDialog from '../hero_dialog';
import PastorDialog from '../pastor_dialog';
import ServiceDialog from '../service_dialog';
import styles from './cardhomepage.module.scss'
import React, { useState } from 'react';


const Card: React.FC<CardProps> = ({ leftText, rightText, type }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const getDialogContent = () => {
    switch (type) {
      case 'hero':
        return <HeroDialog onClose={closeDialog} />;
      case 'pastor':
        return <PastorDialog onClose={closeDialog} />;
      case 'events':
        return <EventDialog onClose={closeDialog} />;
      case 'services':
        return <ServiceDialog onClose={closeDialog} />;
      default:
        return <p>Tidak ada konten untuk tipe ini.</p>;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.leftText}>{leftText}</div>
      <div className={styles.rightText}  onClick={openDialog}>{rightText}</div>

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