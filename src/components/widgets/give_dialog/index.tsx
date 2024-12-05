import styles from './givedialog.module.scss'
import React, { useState, useEffect } from "react";
import { DialogProps } from "@/components/types/DialogProps";
import config from "@/config";
import { BankData } from '@/components/types/BankProps';

interface GiveDialogProps extends DialogProps {
    mode: "add" | "edit"
    editData?: BankData
}

const GiveDialog: React.FC<GiveDialogProps> = ({
    onClose,
    onSuccessAdd,
    mode,
    editData
}) => {
    const [token, setToken] = useState("");
    const [bankTitle, setbankTitle] = useState("");
    const [bankAccountName, setbankAccountName] = useState("");
    const [bankAccountNumber, setbankAccountNumber] = useState("");
    const [bankLogo, setbankLogo] = useState<File | null>(null);
    const [bankQr, setbankQr] = useState<File | null>(null);

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
            setbankTitle(editData.bank_title);
            setbankAccountName(editData.bank_account_name);
            setbankAccountNumber(editData.bank_account_number);
        }
    }, [mode, editData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // console.log(`${mode} ${bankTitle} - ${bankAccountName} - ${bankAccountNumber} - ${bankLogo} - ${bankQr}`)

        if (!bankTitle || !bankAccountName || !bankAccountNumber || (!bankLogo && mode === "add") || (!bankQr && mode === "add")) {
            alert("All fields are required!");
            return;
        }

        // Simpan data
        const formData = new FormData();
        formData.append("bank_title", bankTitle);
        formData.append("bank_account_name", bankAccountName);
        formData.append("bank_account_number", bankAccountNumber);
        if (bankLogo) {
            formData.append("bank_logo", bankLogo);
        }
        if (bankQr) {
            formData.append("bank_qr", bankQr);
        }

        try {
            const url =
                mode === "add"
                    ? `${config.API_BASE_URL}/api/admin/banks`
                    : `${config.API_BASE_URL}/api/admin/banks/${editData?.id}`;
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
                <h2 className={styles.title}>Bank Details</h2>
                <p className={styles.subTitle}>Please input bank details</p>

                <div className={styles.field}>
                    <label className={styles.label}>Logo</label>
                    {mode === "edit" && editData?.bank_logo && (
                        <div className={styles.imagePreview}>
                            <img
                                src={editData.bank_logo}
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
                            setbankLogo(e.target.files ? e.target.files[0] : null)
                        }
                        required={mode === "add"}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>QR</label>
                    {mode === "edit" && editData?.bank_qr && (
                        <div className={styles.imagePreview}>
                            <img
                                src={editData.bank_qr}
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
                            setbankQr(e.target.files ? e.target.files[0] : null)
                        }
                        required={mode === "add"}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Title Bank </label>
                    <input
                        type="text"
                        className={styles.input}
                        value={bankTitle}
                        onChange={(e) => setbankTitle(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Name Bank Account</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={bankAccountName}
                        onChange={(e) => setbankAccountName(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Bank Account Number</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={bankAccountNumber}
                        onChange={(e) => setbankAccountNumber(e.target.value)}
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
    )


}

export default GiveDialog