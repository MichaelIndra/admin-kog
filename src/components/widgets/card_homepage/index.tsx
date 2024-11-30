import styles from './cardhomepage.module.scss'



const Card: React.FC<CardProps> = ({ leftText, rightText }) => {
  return (
    <div className={styles.card}>
      <div className={styles.leftText}>{leftText}</div>
      <div className={styles.rightText}>{rightText}</div>
    </div>
  );
};

export default Card;