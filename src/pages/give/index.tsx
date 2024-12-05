import { BankData } from '@/components/types/BankProps';
import styles from './give.module.scss'
import Card from "@/components/widgets/card_homepage";
import Dialog from '@/components/widgets/dialog_homepage';
import HeroDialog from '@/components/widgets/hero_dialog';
import React, { useEffect, useState } from "react";
import config from '@/config';
import GiveDialog from '@/components/widgets/give_dialog';
import CardLoadedGive from '@/components/widgets/card_give_loaded';

const Give = () => {
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentType, setCurrentType] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>("");

    const [bankData, setBank] = useState<BankData[]>([])

    const [editDataBank, setEditDataBank] = useState<BankData | null>(null)

    const fetchBankData = async () => {
        if (!token) {
            console.error("Token is missing. Cannot fetch data.");
            setError("Authentication token is missing. Please log in again.");
            return;
        }

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/admin/banks`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`, // Sertakan token dalam header
              },
            });
            console.log(`data bank : ${response.status}`);
            const data = await response.json();
            console.log(data);
            setBank(data);
          } catch (error) {
            console.error("An error occurred while fetching pastor data:", error);
            setError("An unexpected error occurred. Please try again later.");
          }

    }




    const fetchAll = () => {
        if (token) {
            fetchBankData()
        }
    }

    const handleOpenDialog = (type: string) => {
        setCurrentType(type);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setCurrentType(null);
    };

    const handleEdit = (id:number, type: string) =>{
        if (type === 'give'){
            const dataToEdit = bankData.find((bank) => bank.id === id)
            setCurrentType("give")
            setEditDataBank(dataToEdit ?? null)
            setIsDialogOpen(true);
        }
    }

    const getDialogContent = () => {
        console.log(currentType)
        switch (currentType) {
            case "hero":
                return <HeroDialog onClose={handleCloseDialog} onSuccessAdd={fetchAll} />;
            case "give":
                return <GiveDialog onClose={handleCloseDialog} onSuccessAdd={fetchAll}
                    mode={editDataBank ? "edit" : "add"}
                    editData={editDataBank || undefined}
                />;
            // case "event":
            //     return <EventDialog onClose={handleCloseDialog} onSuccessAdd={fetchAll}
            //         mode={editDataEvent ? "edit" : "add"}
            //         editData={editDataEvent || undefined}
            //     />;
            // case "serviceType":
            //     return <ServiceTypeDialog onClose={handleCloseDialog} onSuccessAdd={fetchAll}
            //         mode={editDataServiceType ? "edit" : "add"}
            //         editData={editDataServiceType || undefined}
            //         pastors={pastorData}
            //     />;
            // case "services":
            //     console.log('homepage get service type data', serviceTypeData)
            //     return <ServiceDialog onClose={handleCloseDialog} onSuccessAdd={fetchAll}
            //         mode={editDataService ? "edit" : "add"}
            //         editData={editDataService || undefined}
            //         serviceTypes={serviceTypeData}
            //     />;
            default:
                return <p>No content available for this type.</p>;
        }
    };

    useEffect(() => {
        const getCookie = (name: string) => {
            const cookies = document.cookie.split("; ");
            const cookie = cookies.find((row) => row.startsWith(`${name}=`));
            return cookie ? cookie.split("=")[1] : null;
        };

        const getToken = getCookie("token");
        console.log("Token from cookie:", getToken); // Log token untuk debugging
        if (!getToken) {
            setError("Token not found. Please log in again.");
            return;
        }
        setToken(getToken)
        // Simulate fetch from server


    }, []);

    useEffect(() => {
        if (token) {
            fetchAll()
        }
      }, [token])
    return (<div className={styles.mainContent}>
        <h1 className={styles.title}>Give</h1>
        {error && <p className={styles.error}>{error}</p>}

        {isDialogOpen && (
            <Dialog onClose={handleCloseDialog}>{getDialogContent()}</Dialog>
        )}

        {/* Hero awal */}
        <div className={styles.cardContainer}>
            <Card key={0} leftText="Hero Section" type="hero" onSuccessAdd={fetchAll} />
        </div>
        {/* Hero akhir */}
        {/* Give Awal */}
        {bankData.length === 0 ? (
        <div className={styles.cardContainer}>
          <Card key={1} leftText="Bank Account" type="give" onSuccessAdd={fetchAll} />
        </div>
      ) : (
        <div className={styles.loadedCardContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>Bank Account</h2>
            <span
              className={styles.addText}
              onClick={() => handleOpenDialog("give")}
            >
              + Add Data
            </span>
          </div>
          <div className={styles.cardWrapper}>
            {bankData.map((bank) => (
              <CardLoadedGive
                key={bank.id}
                id={bank.id}

                bank_logo={bank.bank_logo || ""}
                bank_qr={bank.bank_qr || ""}
                bank_title={bank.bank_title}
                bank_account_name={bank.bank_account_name}
                bank_account_number={bank.bank_account_number}
                onDeleteSuccess={fetchBankData}
                onEdit={() => handleEdit(bank.id, "give")}
              />
            ))}
          </div>
        </div>
      )}
    </div>)
}

export default Give;