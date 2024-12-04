import React, { useEffect, useState } from "react";
import config from "@/config";
import styles from './cardeventloaded.module.scss';

interface CardLoadedEventProps {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    socialMediaLinks: { [key: string]: string };
    description: string;
    image: string;
    onDeleteSuccess: () => void;
    onEdit: () => void
}

const CardLoadedEvent: React.FC<CardLoadedEventProps> = ({
    id,
    title,
    startDate,
    endDate,
    socialMediaLinks,
    description,
    image,
    onDeleteSuccess,
    onEdit
}) => {
    const [token, setToken] = useState("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const openAlert = () => setIsAlertOpen(true);
    const closeAlert = () => setIsAlertOpen(false);

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

    const onDelete = async () => {
        try {
            const response = await fetch(
                `${config.API_BASE_URL}/api/admin/events/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response);
            if (!response.ok) {
                throw new Error("Failed to delete data");
            }

            alert("Data delete successfully!");
            closeAlert()
            onDeleteSuccess()
        } catch (error) {
            console.error("Error delete data:", error);
            alert("Failed to delete data");
            closeAlert()
        }
    };
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }); // Output: dd/mm/yyyy
      };
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={image} alt={title} className={styles.image} />
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.name}>{formatDate(startDate)}</p>
                <p className={styles.name}>{formatDate(endDate)}</p>
                <div className={styles.socialMediaLinks}>
                    <h4>Social Media Links:</h4>
                    <ul>
                        {Object.entries(socialMediaLinks).map(([platform, url], index) => (
                            <li key={index}>
                                <strong>{platform}:</strong>{" "}
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    {url}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <p className={styles.name}>{description}</p>
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

    )

}

export default CardLoadedEvent;