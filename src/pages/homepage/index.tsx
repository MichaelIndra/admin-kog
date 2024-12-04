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
import { EventData } from "@/components/types/EventProps";
import CardLoadedEvent from "@/components/widgets/card_event_loaded";

const Homepage = () => {
  const [pastorData, setPastorData] = useState<PastorData[]>([]);
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentType, setCurrentType] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>("");
  const [editDataPastor, setEditDataPastor] = useState<PastorData | null>(null);
  const [editDataEvent, setEditDataEvent] = useState<EventData | null>(null);

  const fetchPastorData = async () => {
    if (!token) {
      console.error("Token is missing. Cannot fetch data.");
      setError("Authentication token is missing. Please log in again.");
      return;
    }
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/admin/pastors`, {
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
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const fetchEventData = async () => {
    console.log('get event data')
    if (!token) {
      console.error("Token is missing. Cannot fetch data.");
      setError("Authentication token is missing. Please log in again.");
      return;
    }
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/admin/events`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token dalam header
        },
      });

      // Periksa status HTTP
      if (!response.ok) {
        console.error(`Error fetching events: ${response.status}`);
        const errorMessage = await response.text(); // Ambil pesan error dari server (jika ada)
        setError(
          `Failed to fetch events. Server responded with status: ${response.status}. ${errorMessage}`
        );
        return;
      }

      // Proses data jika respons sukses
      const data = await response.json();
      console.log("Event data fetched:", data);
      setEventData(data);
    } catch (error) {
      console.error("An error occurred while fetching event data:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const handleOpenDialog = (type: string) => {
    setCurrentType(type);
    setEditDataPastor(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Tutup dialog
    setCurrentType(null); // Reset tipe data
  };

  const handleEdit = (id: number, type: string) => {
    console.log(`id ${id}, type : ${type}`)
    if (type === "pastor") {
      const dataToEdit = pastorData.find((pastor) => pastor.id === id);
      console.log(dataToEdit)
      setCurrentType("pastor");
      setEditDataPastor(dataToEdit);
      setIsDialogOpen(true);
    } else if (type === "event") {
      const dataToEdit = eventData.find((event) => event.id === id)
      console.log(dataToEdit)
      setCurrentType("event");
      setEditDataEvent(dataToEdit)
      setIsDialogOpen(true);


    }
    // Add edit functionality here
  };

  const getDialogContent = () => {
    switch (currentType) {
      case "hero":
        return <HeroDialog onClose={handleCloseDialog} onSuccessAdd={fetchAll} />;
      case "pastor":
        return <PastorDialog onClose={handleCloseDialog} onSuccessAdd={fetchAll}
          mode={editDataPastor ? "edit" : "add"}
          editData={editDataPastor || undefined}
        />;
      case "event":
        return <EventDialog onClose={handleCloseDialog} onSuccessAdd={fetchAll}
          mode={editDataEvent ? "edit" : "add"}
          editData={editDataEvent || undefined}
        />;
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

  useEffect(() => {
    if (token) {
      fetchPastorData()
      fetchEventData()
    }
  }, [token])

  const fetchAll = () => {
    fetchPastorData()
    fetchEventData()
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
                onEdit={() => handleEdit(pastor.id, "pastor")}
              />
            ))}
          </div>
        </div>
      )}
      {/* Pastor akhir */}

      {/* Event awal */}
      {eventData.length === 0 ? (
        <div className={styles.cardContainer}>
          <Card key={1} leftText="Incoming Events" type="event" onSuccessAdd={fetchAll} />
        </div>
      ) : (
        <div className={styles.loadedCardContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>Events</h2>
            <span
              className={styles.addText}
              onClick={() => handleOpenDialog("event")}
            >
              + Add Data
            </span>
          </div>
          <div className={styles.cardWrapper}>
            {eventData.map((event) => (
              <CardLoadedEvent
                key={event.id}
                image={event.event_image}
                title={event.event_title}
                startDate={event.event_start_date}
                endDate={event.event_end_date}
                id={event.id}
                socialMediaLinks={event.event_social_media_links}
                description={event.event_description}
                onDeleteSuccess={fetchEventData}
                onEdit={() => handleEdit(event.id, "event")}
              />
            ))}
          </div>
        </div>
      )


      }

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
