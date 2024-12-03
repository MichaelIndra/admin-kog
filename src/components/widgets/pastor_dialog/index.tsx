import React, { useState, useEffect } from "react";
import { DialogProps } from "@/components/types/DialogProps";
import config from "@/config";
import styles from "./pastor.module.scss";

interface PastorDialogProps extends DialogProps {
  mode: "add" | "edit";
  editData?: {
    id: number;
    pastor_title: string;
    pastor_name: string;
    pastor_description: string;
    pastor_image?: string; // URL atau path ke gambar
  };
}

const PastorDialog: React.FC<PastorDialogProps> = ({
  onClose,
  onSuccessAdd,
  mode,
  editData,
}) => {
  const [token, setToken] = useState("");
  const [pastorTitle, setPastorTitle] = useState("");
  const [pastorName, setPastorName] = useState("");
  const [pastorDescription, setPastorDescription] = useState("");
  const [pastorImage, setPastorImage] = useState<File | null>(null);

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

    if (mode === "edit" && editData) {
      setPastorTitle(editData.pastor_title);
      setPastorName(editData.pastor_name);
      setPastorDescription(editData.pastor_description);
    }
  }, [mode, editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!pastorTitle || !pastorName || !pastorDescription || (!pastorImage && mode === "add")) {
      alert("All fields are required!");
      return;
    }

    // Simpan data
    const formData = new FormData();
    formData.append("pastor_title", pastorTitle);
    formData.append("pastor_name", pastorName);
    formData.append("pastor_description", pastorDescription);
    if (pastorImage) {
      formData.append("pastor_image", pastorImage);
    }

    try {
      const url =
        mode === "add"
          ? `${config.API_BASE_URL}/api/admin/pastors`
          : `${config.API_BASE_URL}/api/admin/pastors/${editData?.id}`;
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
        <h2 className={styles.title}>Pastors</h2>
        <p className={styles.subTitle}>Please input pastor details</p>

        <div className={styles.field}>
          <label className={styles.label}>Pastor Title</label>
          <input
            type="text"
            className={styles.input}
            value={pastorTitle}
            onChange={(e) => setPastorTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Pastor Name</label>
          <input
            type="text"
            className={styles.input}
            value={pastorName}
            onChange={(e) => setPastorName(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Pastor Description</label>
          <textarea
            className={styles.textarea}
            value={pastorDescription}
            onChange={(e) => setPastorDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Pastor Image</label>
          {mode === "edit" && editData?.pastor_image && (
            <div className={styles.imagePreview}>
              <img
                src={editData.pastor_image}
                alt="Pastor Preview"
                className={styles.preview}
              />
            </div>
          )}
          <input
            type="file"
            className={styles.input}
            accept="image/*"
            onChange={(e) =>
              setPastorImage(e.target.files ? e.target.files[0] : null)
            }
            required={mode === "add"}
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

export default PastorDialog;
