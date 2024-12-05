import React, { useState, useEffect } from "react";
import { DialogProps } from "@/components/types/DialogProps";
import config from "@/config";
import styles from "./service.module.scss";
import { ServiceData } from "@/components/types/ServiceProps";
import { ServiceTypeData } from "@/components/types/ServiceTypeProps";

interface ServiceDialogProps extends DialogProps {
  mode: "add" | "edit";
  editData?: ServiceData;
  serviceTypes?: ServiceTypeData[];
}

const ServiceDialog: React.FC<ServiceDialogProps> = ({
  onClose,
  onSuccessAdd,
  mode,
  editData,
  serviceTypes,
}) => {
  const [token, setToken] = useState("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceUrl, setServiceUrl] = useState("");
  const [serviceStartDate, setServiceStartDate] = useState("");
  const [serviceEndDate, setServiceEndDate] = useState("");
  const [serviceType, setServiceType] = useState<ServiceTypeData | null>(null);
  const [serviceImage, setServiceImage] = useState<File | null>(null);

  useEffect(() => {
    console.log("service get service type", serviceTypes);
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

  const adjustDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Tambahkan 1 hari
    return date;
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ""; // Jika null atau undefined
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date value:", dateString);
      return "";
    }
    const adjustedDate = adjustDate(dateString); // Sesuaikan tanggal
    return adjustedDate.toISOString().split("T")[0];
  };

  const getDataServiceTypebyId = (service_type_id: number) => {
    if (serviceTypes) {
      const dataServiceType = serviceTypes.find(
        (serviceType) => serviceType.id === service_type_id
      );
      setServiceType(dataServiceType ?? null);
    }
  };

  useEffect(() => {
    if (mode === "edit" && editData) {
      setServiceTitle(editData.service_title);
      setServiceDescription(editData.service_description);
      setServiceUrl(editData.service_url);
      getDataServiceTypebyId(editData.service_type_id);
      setServiceStartDate(editData.service_start_date);
      setServiceEndDate(editData.service_end_date);
    }
  }, [mode, editData, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (
      !serviceTitle ||
      !serviceDescription ||
      !serviceUrl ||
      !serviceStartDate ||
      !serviceEndDate ||
      !serviceType ||
      (!serviceImage && mode === "add")
    ) {
      alert("All fields are required!");
      return;
    }

    // Simpan data
    const formData = new FormData();
    formData.append("service_title", serviceTitle);
    formData.append("service_description", serviceDescription);
    formData.append("service_url", serviceUrl);
    formData.append("service_start_date", serviceStartDate);
    formData.append("service_end_date", serviceEndDate);
    formData.append("service_type_id", serviceType.id.toString());
    if (serviceImage) {
      formData.append("service_image", serviceImage);
    }
    try {
      const url =
        mode === "add"
          ? `${config.API_BASE_URL}/api/admin/services`
          : `${config.API_BASE_URL}/api/admin/services/${editData?.id}`;
      const response = await fetch(url, {
        method: mode === "add" ? "POST" : "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      alert("Data submitted successfully!");
      onClose();
      onSuccessAdd();
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit data");
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Services</h2>
        <p className={styles.subTitle}>Please input service details</p>
        <div className={styles.field}>
          <label className={styles.label}>Service Type Image</label>
          {mode === "edit" && editData?.service_image && (
            <div className={styles.imagePreview}>
              <img
                src={editData.service_image}
                alt="Event Preview"
                className={styles.preview}
              />
            </div>
          )}
          <input
            type="file"
            className={styles.input}
            accept="image/*"
            onChange={(e) =>
              setServiceImage(e.target.files ? e.target.files[0] : null)
            }
            required={mode === "add"}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Service type</label>
          <select
            id="serviceType"
            value={serviceType?.id || ""}
            onChange={(e) => {
              const service = serviceTypes?.find(
                (p) => p.id === Number(e.target.value)
              );
              setServiceType(service || null); // Simpan objek pastor
            }}
            required
          >
            <option value="" disabled>
              -- Select a Service Type --
            </option>
            {serviceTypes?.map((serviceType) => (
              <option key={serviceType.id} value={serviceType.id}>
                {serviceType.service_type}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Service title</label>
          <input
            type="text"
            className={styles.input}
            value={serviceTitle}
            onChange={(e) => setServiceTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Service url</label>
          <input
            type="text"
            className={styles.input}
            value={serviceUrl}
            onChange={(e) => setServiceUrl(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Start date</label>
          <input
            type="date"
            className={styles.input}
            value={
              mode === "edit"
                ? formatDateForInput(serviceStartDate)
                : serviceStartDate
            }
            onChange={(e) => setServiceStartDate(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>End date</label>
          <input
            type="date"
            className={styles.input}
            value={
              mode === "edit"
                ? formatDateForInput(serviceEndDate)
                : serviceEndDate
            }
            onChange={(e) => setServiceEndDate(e.target.value)}
            min={formatDateForInput(serviceStartDate)}
            required
          />
        </div>

        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            {mode === "add" ? "Submit" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceDialog;
