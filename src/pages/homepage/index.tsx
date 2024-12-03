import Card from "@/components/widgets/card_homepage";
import styles from "./homepage.module.scss";
import React, { useEffect, useState } from "react";
import CardLoadedPastor from "@/components/widgets/card_pastor_loaded";
import { PastorData } from "@/components/types/PastorProps";
import config from "@/config";
import Dialog from "@/components/widgets/dialog_homepage";
import HeroDialog from "@/components/widgets/hero_dialog";
import PastorDialog from "@/components/widgets/pastor_dialog";
import EventDialog from "@/components/widgets/event_dialog";
import ServiceDialog from "@/components/widgets/service_dialog";

const Homepage = () => {
  const [pastorData, setPastorData] = useState<PastorData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentType, setCurrentType] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>("");

  const fetchPastorData = async () => {
    if (!token) {
      console.error("Token is missing. Cannot fetch data.");
      setError("Authentication token is missing. Please log in again.");
      return;
    }
    const response = await fetch(`${config.API_BASE_URL}/api/admin/pastors`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Sertakan token dalam header
      },
    });
    console.log(response);
    const data = await response.json();
    console.log(data);
    setPastorData(data);
  };

  const handleOpenDialog = (type: string) => {
    setCurrentType(type); // Set tipe data
    setIsDialogOpen(true); // Tampilkan dialog
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Tutup dialog
    setCurrentType(null); // Reset tipe data
  };

  const handleEdit = (id: number, type: string) => {
    console.log(`Edit pastor with ID: ${id}`);
    // Add edit functionality here
  };

  const handleDelete = (id: number, type: string) => {
    console.log(`Delete pastor with ID: ${id}`);
    // Add delete functionality here
  };

  const getDialogContent = () => {
    switch (currentType) {
      case "hero":
        return <HeroDialog onClose={handleCloseDialog} onSuccessAdd={fetchAll} />;
      case "pastor":
        return <PastorDialog onClose={handleCloseDialog} onSuccessAdd={fetchAll} mode="add" />;
      case "events":
        return <EventDialog onClose={handleCloseDialog} onSuccessAdd={fetchAll} />;
      case "services":
        return <ServiceDialog onClose={handleCloseDialog} onSuccessAdd={fetchAll} />;
      default:
        return <p>No content available for this type.</p>;
    }
  };

  // const cards = [
  //   { leftText: "Hero Section", rightText: "+ Add Data", type: "hero" },
  //   { leftText: "Our Pastors", rightText: "+ Add Data", type: "pastor" },
  //   { leftText: "Incoming Events", rightText: "+ Add Data", type: "events" },
  //   { leftText: "Our Service", rightText: "+ Add Data", type: "services" },
  // ];

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

  useEffect(()=>{
    if(token){
      fetchPastorData()
    }
  },[token])

  const fetchAll = () => {
    fetchPastorData()
  }
  return (
    <div className={styles.homepage}>
      <h1 className={styles.title}>Homepage</h1>

      {error && <p className={styles.error}>{error}</p>}

      {isDialogOpen && (
        <Dialog onClose={handleCloseDialog}>{getDialogContent()}</Dialog>
      )}

      {/* Hero awal */}
      <div className={styles.cardContainer}>
        <Card key={0} leftText="Hero Section" type="hero" onSuccessAdd={fetchAll} />
      </div>
      {/* Hero akhir */}
      {/* Pastor awal */}
      {pastorData.length === 0 ? (
        <div className={styles.cardContainer}>
          <Card key={1} leftText="Our Pastors" type="pastor" onSuccessAdd={fetchAll} />
        </div>
      ) : (
        <div className={styles.loadedCardContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>Pastors</h2>
            <span
              className={styles.addText}
              onClick={() => handleOpenDialog("pastor")}
            >
              + Add Data
            </span>
          </div>
          <div className={styles.cardWrapper}>
            {pastorData.map((pastor) => (
              <CardLoadedPastor
                key={pastor.id}
                image={pastor.pastor_image}
                title={pastor.pastor_title}
                name={pastor.pastor_name}
                description={pastor.pastor_description}
                id={pastor.id}
                onDeleteSuccess={fetchPastorData}
              />
            ))}
          </div>
        </div>
      )}
      {/* Pastor akhir */}

      {/* Event awal */}
      <div className={styles.cardContainer}>
        <Card key={2} leftText="Incoming Events" type="events" onSuccessAdd={fetchAll} />
      </div>
      {/* Event akhir */}
      {/* Service awal */}
      <div className={styles.cardContainer}>
        <Card key={3} leftText="Our Service" type="services" onSuccessAdd={fetchAll} />
      </div>
      {/* Service akhir */}

      {/* {cards.map((card, index) => (
                    <Card
                        key={index}
                        leftText={card.leftText}
                        rightText={card.rightText}
                        type={card.type}
                    />
                ))} */}
    </div>
  );
};

export default Homepage;
