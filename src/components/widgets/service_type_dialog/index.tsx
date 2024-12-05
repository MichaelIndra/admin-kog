import React, { useState, useEffect } from "react";
import { DialogProps } from '@/components/types/DialogProps';
import config from "@/config";
import styles from './servicetypedialog.module.scss'
import { ServiceTypeData } from "@/components/types/ServiceTypeProps";
import { PastorData } from "@/components/types/PastorProps";

interface ServiceTypeDialogProps extends DialogProps {
    mode: "add" | "edit";
    editData?: ServiceTypeData
    pastors?: PastorData[]
}

const ServiceTypeDialog: React.FC<ServiceTypeDialogProps> = ({
    onClose,
    onSuccessAdd,
    mode,
    editData,
    pastors
}) => {
    const [token, setToken] = useState("");
    const [serviceType, setServiceType] = useState("")
    const [serviceTypeContent, setServiceTypeContent] = useState("")
    const [serviceTypeUrl, setServiceTypeUrl] = useState("")
    const [pastorData, setPastorData] = useState<PastorData | null>(null);
    const [serviceTypeImage, setServiceTypeImage] = useState<File | null>(null);
    const [serviceTypeThumbnail, setServiceThumbnail] = useState<File | null>(null);
    const [serviceTypeDescription, setServiceTypeDescription] = useState("")

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

    const getDataPastorById =  (pastor_id: number) => {
        if(pastors){
            const dataPastor = pastors.find((pastor) => pastor.id === pastor_id)
        setPastorData(dataPastor ?? null)
        }
        
    }

    

    

    useEffect(() => {
        if (mode === "edit" && editData) {
            setServiceType(editData.service_type);
            setServiceTypeContent(JSON.stringify(editData.service_type_content));
            setServiceTypeUrl(editData.service_type_url);
            getDataPastorById(editData.pastor_id)
            setServiceTypeDescription(editData.service_type_description)

        }
    }, [mode, editData, token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi
        if (!serviceType || !serviceTypeContent || !serviceTypeUrl || !serviceTypeDescription || !pastorData || (!serviceTypeImage && mode === "add") || (!serviceTypeThumbnail && mode === "add")) {
            alert("All fields are required!");
            return;
        }

        // Simpan data
        const formData = new FormData();
        formData.append("service_type", serviceType);
        formData.append("service_type_url", serviceTypeUrl);
        formData.append("service_type_description", serviceTypeDescription);
        formData.append("pastor_id", pastorData.id.toString());
        try {
            const jsonDataString = JSON.parse(serviceTypeContent); // Pastikan valid JSON
            formData.append("service_type_content", JSON.stringify(jsonDataString));
        } catch (error) {
            console.error(error)
            alert("Invalid JSON format for social media links");
            return;
        }

        if (serviceTypeImage) {
            formData.append("service_type_image", serviceTypeImage);
        }
        if (serviceTypeThumbnail) {
            formData.append("service_type_thumbnail", serviceTypeThumbnail);
        }
        console.log(formData)
        try {
            const url =
                mode === "add"
                    ? `${config.API_BASE_URL}/api/admin/service-types`
                    : `${config.API_BASE_URL}/api/admin/service-types/${editData?.id}`;
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
                <h2 className={styles.title}>Service Type {mode}</h2>
                <p className={styles.subTitle}>Please input service type details</p>

                <div className={styles.field}>
                    <label className={styles.label}>Service Type</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Service Type Content</label>
                    <textarea
                        className={styles.textarea}
                        value={serviceTypeContent}
                        onChange={(e) => setServiceTypeContent(e.target.value)}
                        placeholder='{"instagram": "url", "facebook": "url"}'
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Service Type URL</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={serviceTypeUrl}
                        onChange={(e) => setServiceTypeUrl(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Pastor</label>
                    <select
                        id="pastor"
                        value={pastorData?.id || ""}
                        onChange={(e) => {
                            const pastor = pastors?.find(
                                (p) => p.id === Number(e.target.value)
                            );
                            setPastorData(pastor || null); // Simpan objek pastor
                        }}
                        required
                    >
                        <option value="" disabled>
                            -- Select a Pastor --
                        </option>
                        {pastors?.map((pastor) => (
                            <option key={pastor.id} value={pastor.id}>
                                {pastor.pastor_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Service Type Description</label>
                    <textarea
                        className={styles.textareaNormal}
                        value={serviceTypeDescription}
                        onChange={(e) => setServiceTypeDescription(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Service Type Image</label>
                    {mode === "edit" && editData?.service_type_image && (
                        <div className={styles.imagePreview}>
                            <img
                                src={editData.service_type_image}
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
                            setServiceTypeImage(e.target.files ? e.target.files[0] : null)
                        }
                        required={mode === "add"}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Service Type Thumbnail</label>
                    {mode === "edit" && editData?.service_type_thumbnail && (
                        <div className={styles.imagePreview}>
                            <img
                                src={editData.service_type_thumbnail}
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
                            setServiceThumbnail(e.target.files ? e.target.files[0] : null)
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
    )
}

export default ServiceTypeDialog;