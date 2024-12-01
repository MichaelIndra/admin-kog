import React from 'react';
import { DialogProps } from '@/components/types/DialogProps';

const HeroDialog: React.FC<DialogProps> = ({onClose}) => {
  return (
    <div><p>Form untuk menambahkan data ke Hero Section.</p>
    <button onClick={onClose}>Close</button></div>
  );
};

export default HeroDialog;