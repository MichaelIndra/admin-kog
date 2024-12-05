import { ServiceTypeData } from '@/components/types/ServiceTypeProps';
import Dialog from '../dialog_homepage';
import EventDialog from '../event_dialog';
import HeroDialog from '../hero_dialog';
import PastorDialog from '../pastor_dialog';
import ServiceDialog from '../service_dialog';
import ServiceTypeDialog from '../service_type_dialog';
import styles from './cardhomepage.module.scss'
import React, { useState } from 'react';
import { PastorData } from '@/components/types/PastorProps';


interface CustomCardProps extends CardProps{
  serviceTypes? :  ServiceTypeData[]
  pastors? : PastorData[]
}

const Card: React.FC<CustomCardProps> = ({ leftText, type, onSuccessAdd ,serviceTypes, pastors}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const getDialogContent = () => {
    switch (type) {
      case 'hero':
        return <HeroDialog onClose={closeDialog} onSuccessAdd={onSuccessAdd} />;
      case 'pastor':
        return <PastorDialog onClose={closeDialog} onSuccessAdd={onSuccessAdd} mode='add' />;
      case 'event':
        return <EventDialog onClose={closeDialog} onSuccessAdd={onSuccessAdd} mode='add' />;
      case 'services':
        return <ServiceDialog onClose={closeDialog} onSuccessAdd={onSuccessAdd} mode='add' serviceTypes={serviceTypes} />;
      case 'serviceType' : 
        return <ServiceTypeDialog onClose={closeDialog} onSuccessAdd={onSuccessAdd} mode='add'  pastors={pastors}/>
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