import React from "react";
import styles from './cardpastorloaded.module.scss'

interface CardLoadedPastorProps {
    image: string;
    title: string;
    name: string;
    description: string;
    onEdit: () => void;
    onDelete: () => void;
  }

  const CardLoadedPastor: React.FC<CardLoadedPastorProps> = ({
    image,
    title,
    name,
    description,
    onEdit,
    onDelete,
  }) => {
    return (
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.image} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.name}>{name}</p>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.editButton} onClick={onEdit}>
            Edit
          </button>
          <button className={styles.deleteButton} onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    );
  };
  
  export default CardLoadedPastor;