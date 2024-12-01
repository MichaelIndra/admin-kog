import Card from "@/components/widgets/card_homepage";
import styles from "./homepage.module.scss";
import React, { useEffect, useState } from "react";
import CardLoadedPastor from "@/components/widgets/card_pastor_loaded";
import { PastorData } from "@/components/types/PastorProps";
import config from "@/config";

const Homepage = () => {
  const [pastorData, setPastorData] = useState<PastorData[]>([]);

  useEffect(() => {
    const getCookie = (name: string) => {
      const cookies = document.cookie.split("; ");
      const cookie = cookies.find((row) => row.startsWith(`${name}=`));
      return cookie ? cookie.split("=")[1] : null;
    };

    const token = getCookie("token");

    // Simulate fetch from server
    const fetchPastorData = async () => {
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

    fetchPastorData();
  }, []);

  const handleEdit = (id: number) => {
    console.log(`Edit pastor with ID: ${id}`);
    // Add edit functionality here
  };

  const handleDelete = (id: number) => {
    console.log(`Delete pastor with ID: ${id}`);
    // Add delete functionality here
  };

  const handleAdd = (type: string) => {
    switch (type) {
      case 'pastor':
        // router.push('/add-pastor'); // Navigasi ke halaman Add Pastor
        break;
      case 'hero':
        // router.push('/add-hero'); // Navigasi ke halaman Add Hero
        break;
      case 'events':
        // router.push('/add-events'); // Navigasi ke halaman Add Events
        break;
      case 'services':
        // router.push('/add-services'); // Navigasi ke halaman Add Services
        break;
      default:
        console.warn('Unknown type:', type);
    }
  };

  const cards = [
    { leftText: "Hero Section", rightText: "+ Add Data", type: "hero" },
    { leftText: "Our Pastors", rightText: "+ Add Data", type: "pastor" },
    { leftText: "Incoming Events", rightText: "+ Add Data", type: "events" },
    { leftText: "Our Service", rightText: "+ Add Data", type: "services" },
  ];
  return (
    <div className={styles.homepage}>
      <h1 className={styles.title}>Homepage</h1>
      <div className={styles.cardContainer}>
        <Card
          key={0}
          leftText={cards[0].leftText}
          rightText={cards[0].rightText}
          type={cards[0].type}
        />
      </div>

      {pastorData.length === 0 ? (
        <div className={styles.cardContainer}>
          <Card
            key={1}
            leftText={cards[1].leftText}
            rightText={cards[1].rightText}
            type={cards[1].type}
          />
        </div>
      ) : (
        <div className={styles.loadedCardContainer}>
          <div className="{styles.header}">
            <h2>Pastors</h2>
            <button className={styles.addButton} onClick={() => handleAdd('pastor')}>
              + Add
            </button>
          </div>
          <div className={styles.cardWrapper}>
            {pastorData.map((pastor) => (
              <CardLoadedPastor
                key={pastor.id}
                image={pastor.pastor_image}
                title={pastor.pastor_title}
                name={pastor.pastor_name}
                description={pastor.pastor_description}
                onEdit={() => handleEdit(pastor.id)}
                onDelete={() => handleDelete(pastor.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.cardContainer}>
        <Card
          key={2}
          leftText={cards[2].leftText}
          rightText={cards[2].rightText}
          type={cards[2].type}
        />
      </div>

      <div className={styles.cardContainer}>
        <Card
          key={3}
          leftText={cards[3].leftText}
          rightText={cards[3].rightText}
          type={cards[3].type}
        />
      </div>

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
