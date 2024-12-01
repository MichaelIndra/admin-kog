import React from 'react';
import { DialogProps } from '@/components/types/DialogProps';


const EventDialog: React.FC<DialogProps> = ({onClose}) => {
  return(
  <div>
    <p>Form untuk menambahkan data Event.</p>
    <button onClick={onClose}>Close</button>
  </div>
  );
  
};

export default EventDialog;