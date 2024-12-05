import React, { useEffect, useState } from "react";
import config from "@/config";
import styles from "./cardserviceloaded.module.scss";
import { ServiceData } from "@/components/types/ServiceProps";
import { ServiceTypeData } from "@/components/types/ServiceTypeProps";

interface CardLoadedServiceProps extends ServiceData {
  onDeleteSuccess: () => void;
  onEdit: () => void;
  serviceTypes: ServiceTypeData[];
}

const CardLoadedService: React.FC<CardLoadedServiceProps> = ({
  id,
  service_title,
  service_description,
  service_url,
  service_start_date,
  service_end_date,
  service_type_id,
  service_image,
  onDeleteSuccess,
  onEdit,
  serviceTypes,
}) => {
  const [token, setToken] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceTypeData | null>(null);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }); // Output: dd/mm/yyyy
  };

  const onDelete = async () => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/admin/services/${id}`,
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
      closeAlert();
      onDeleteSuccess();
    } catch (error) {
      console.error("Error delete data:", error);
      alert("Failed to delete data");
      closeAlert();
    }
  };

  const getDataServiceTypebyId = () => {
    if (serviceTypes) {
      const dataServiceType = serviceTypes.find(
        (serviceType) => serviceType.id === service_type_id
      );
      setServiceType(dataServiceType ?? null);
    }
  };

  useEffect(() => {
    getDataServiceTypebyId();
  });
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={service_image}
          alt={service_title}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          {service_title} - {serviceType?.service_type}
        </h3>
        <p className={styles.name}>{service_description}</p>

        <div className={styles.name}>
          <h2>Link :</h2>
          <ul>
            <li>
              <strong>{service_url}</strong>{" "}
            </li>
          </ul>
        </div>
        <p className={styles.name}>{formatDate(service_start_date)}</p>
        <p className={styles.name}>{formatDate(service_end_date)}</p>
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
  );
};

export default CardLoadedService;
