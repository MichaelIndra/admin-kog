import React, { useEffect, useState } from "react";
import config from "@/config";
import styles from "./cardservicetypeloaded.module.scss"
import { ServiceTypeData } from "@/components/types/ServiceTypeProps";
import { PastorData } from "@/components/types/PastorProps";

interface CardLoadedServiceTypeProps extends ServiceTypeData {
    onDeleteSuccess: () => void;
    onEdit: () => void
}

const CardLoadedServiceType: React.FC<CardLoadedServiceTypeProps> = ({
    id,
    service_type,
    service_type_content,
    service_type_url,
    pastor_id,
    service_type_image,
    service_type_thumbnail,
    onDeleteSuccess,
    onEdit
}) => {
    const [token, setToken] = useState("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [pastorData, setPastorData] = useState<PastorData | null>(null);

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
                `${config.API_BASE_URL}/api/admin/service-types/${id}`,
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

    const getDataPastor = async () =>{
        if (!token) {
            console.error("Token is missing. Cannot fetch data.");
            return;
        }
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/admin/pastors/${pastor_id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`, // Sertakan token dalam header
                },
            });
            console.log(`data pastor : ${response.status}`);
            const data = await response.json();
            console.log(data);
            setPastorData(data);
        } catch (error) {
            console.error("An error occurred while fetching pastor data:", error);
            
        }
    }

    useEffect(() => {
        if(token){
            getDataPastor()
        }
    }, [ token])
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={service_type_image} alt={service_type} className={styles.image} />
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{service_type} - {pastorData?.pastor_name}</h3>
                <p className={styles.name}>{service_type_url}</p>

                <div className={styles.socialMediaLinks}>
                    <h2>Content Type:</h2>
                    <ul>
                        {Object.entries(service_type_content).map(([platform, data], index) => (
                            <li key={index}>
                                <strong>{platform}:{data}</strong>{" "}
                                
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.imageThumbnail}>
                    <img src={service_type_thumbnail} alt={service_type} className={styles.imageThumnailDetail} />
                </div>
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

export default CardLoadedServiceType;