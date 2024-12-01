import React from "react";
import styles from "./dialoghomepage.module.scss";
import ReactDOM from "react-dom";

interface DialogProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Dialog: React.FC<DialogProps> = ({ children, onClose }) => {
  if (typeof document === "undefined") return null;
  const dialogContent = (
    <>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.dialog}>
        <button className={styles.closeButton} onClick={onClose}>
          x
        </button>

        <div className={styles.content}>{children}</div>
      </div>
    </>
  );

  return ReactDOM.createPortal(dialogContent, document.body);
};

export default Dialog;
