import React, { useState, useEffect } from "react";
import { DialogProps } from '@/components/types/DialogProps';
import config from "@/config";
import styles from "./event.module.scss"
import { EventData } from "@/components/types/EventProps";


interface EventDialogProps extends DialogProps {
  mode: "add" | "edit";
  editData?: EventData
}

const EventDialog: React.FC<EventDialogProps> = ({
  onClose,
  onSuccessAdd,
  mode,
  editData,
}) => {
  const [token, setToken] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventSocialMediaLinks, setEventSocialMediaLinks] = useState("");
  const [eventDescription, setEventDescription] = useState("");

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

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }); // Output: dd/mm/yyyy
  };

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
      setEventTitle(editData.event_title);
      setEventStartDate(editData.event_start_date);
      setEventEndDate(editData.event_end_date);
      setEventSocialMediaLinks(JSON.stringify(editData.event_social_media_links, null, 2));
      setEventDescription(editData.event_description);
    }
  }, [mode, editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!eventTitle || !eventStartDate || !eventEndDate || !eventSocialMediaLinks || !eventDescription || (!eventImage && mode === "add")) {
      alert("All fields are required!");
      return;
    }

    // Simpan data
    const formData = new FormData();
    formData.append("event_title", eventTitle);
    formData.append("event_start_date", eventStartDate);
    formData.append("event_end_date", eventEndDate);
    try {
      const socialMediaLinks = JSON.parse(eventSocialMediaLinks); // Pastikan valid JSON
      formData.append("event_social_media_links", JSON.stringify(socialMediaLinks));
    } catch (error) {
      alert("Invalid JSON format for social media links");
      return;
    }
    formData.append("event_description", eventDescription);
    if (eventImage) {
      formData.append("event_image", eventImage);
    }

    try {
      const url =
        mode === "add"
          ? `${config.API_BASE_URL}/api/admin/events`
          : `${config.API_BASE_URL}/api/admin/events/${editData?.id}`;
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
        <h2 className={styles.title}>Events</h2>
        <p className={styles.subTitle}>Please input event details</p>

        <div className={styles.field}>
          <label className={styles.label}>Event Title</label>
          <input
            type="text"
            className={styles.input}
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Start date</label>
          <input
            type="date"
            className={styles.input}
            value={mode === "edit" ? formatDateForInput(eventStartDate) : eventStartDate}
            onChange={(e) => setEventStartDate(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>End date</label>
          <input
            type="date"
            className={styles.input}
            value={mode === "edit"? formatDateForInput(eventEndDate) : eventEndDate}
            onChange={(e) => setEventEndDate(e.target.value)}
            min={formatDateForInput(eventStartDate)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Social Media Links</label>
          <textarea
            className={styles.textarea}
            value={eventSocialMediaLinks}
            onChange={(e) => setEventSocialMediaLinks(e.target.value)}
            placeholder='{"instagram": "url", "facebook": "url"}'
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Event description</label>
          <input
            type="text"
            className={styles.input}
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Event Image</label>
          {mode === "edit" && editData?.event_image && (
            <div className={styles.imagePreview}>
              <img
                src={editData.event_image}
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
              setEventImage(e.target.files ? e.target.files[0] : null)
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

export default EventDialog;