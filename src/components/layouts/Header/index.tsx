import config from "@/config";
import styles from "./header.module.scss";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const Header = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserID] = useState<number | null>(null);
  useEffect(() => {
    // Membaca cookies
    const getCookie = (name: string) => {
      const cookies = document.cookie.split("; ");
      const cookie = cookies.find((row) => row.startsWith(`${name}=`));
      return cookie ? cookie.split("=")[1] : null;
    };

    const token = getCookie("token");
    if (token) {
      setToken(token);
      try {
        const decoded = jwtDecode<{
          [x: string]: string;
          name: string;
        }>(token);
        console.log(decoded);
        setUserID(parseInt(decoded.sub) ?? 0);
        // console.log(decoded) masih dapet e {sub: 1, role: 'GUEST', iat: 1733017688, exp: 1733021288}
        // setUserName(decoded.name);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  const fetchUserData = async () => {
    if (!token) {
      console.error("Token is missing. Cannot fetch data.");
      // setError("Authentication token is missing. Please log in again.");
      return;
    }
    if (!userId) {
      console.error("User is missing. Cannot fetch data.");
      // setError("Authentication token is missing. Please log in again.");
      return;
    }
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/admin/users/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Sertakan token dalam header
          },
        }
      );
      console.log(`data pastor : ${response.status}`);
      const data = await response.json();
      console.log(data);
      setUserName(data.fullname);
    } catch (error) {
      console.error("An error occurred while fetching pastor data:", error);
      // setError("An unexpected error occurred. Please try again later.");
    }
  };
  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);
  return (
    <header className={styles.header}>
      <div className={styles.rightContent}>
        <h1>{userName || "Guest"}</h1>
      </div>
    </header>
  );
};

export default Header;
