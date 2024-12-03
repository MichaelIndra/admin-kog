import React, { useEffect, useState } from "react";
import styles from "./cardpastorloaded.module.scss";
import config from "@/config";

interface CardLoadedPastorProps {
  image: string;
  title: string;
  name: string;
  description: string;
  id: number;
  onDeleteSuccess: () => void;
  onEdit : () => void
}

const CardLoadedPastor: React.FC<CardLoadedPastorProps> = ({
  image,
  title,
  name,
  description,
  id,
  onDeleteSuccess,
  onEdit
}) => {
  const [token, setToken] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const openAlert = () => setIsAlertOpen(true);
  const closeAlert = () => {
    
    setIsAlertOpen(false);
  }

  useEffect(() => {
    // Membaca cookies
    const getCookie = (name: string) => {
      const cookies = document.cookie.split("; ");
      const cookie = cookies.find((row) => row.startsWith(`${name}=`));
      return cookie ? cookie.split("=")[1] : null;
    };

    const token = getCookie("token");
    if (token) {
      try {
        // console.log(decoded) masih dapet e {sub: 1, role: 'GUEST', iat: 1733017688, exp: 1733021288}
        setToken(token);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  // const editData = () => {onEdit};
  const onDelete = async () => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/admin/pastors/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      alert("Data submitted successfully!");
      closeAlert()
      onDeleteSuccess()
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit data");
      closeAlert()
    }
  };
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
      <hr className={styles.divider} />
      <div className={styles.actions}>
        <button className={styles.editButton} onClick={onEdit}>
          Edit
        </button>
        <button className={styles.deleteButton} onClick={openAlert}>
          Delete
        </button>
      </div>

      {/* Alert Dialog */}
      {isAlertOpen && (
        <div className={styles.alertOverlay}>
          <div className={styles.alertDialog}>
            <p>Are you sure you want to delete this item?</p>
            <div className={styles.alertActions}>
              <button className={styles.cancelButton} onClick={closeAlert}>
                Cancel
              </button>
              <button className={styles.confirmButton} onClick={onDelete}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardLoadedPastor;
