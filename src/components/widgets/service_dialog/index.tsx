import React from 'react';
import { DialogProps } from '@/components/types/DialogProps';

const ServiceDialog: React.FC<DialogProps> = ({onClose}) => {
  return(
    <div>
      <p>Form untuk menambahkan data Service.</p>
      <button onClick={onClose}>Close</button>
    </div>
    );
};

export default ServiceDialog;