import React, { useEffect, useState } from "react";
import config from "@/config";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import styles from "./admin.module.scss";
import { AdminData } from "@/components/types/AdminProps";
import TableAdminUserLoaded from "@/components/widgets/table_admin_user_loaded";

const Admin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [token, setToken] = useState<string | null>("");

  const [adminDatas, setAdmins] = useState<AdminData[]>([]);

  const [editDataAdmin, setEditDataAdmin] = useState<AdminData | null>(null);

  const fetchAdminData = async () => {
    if (!token) {
      console.error("Token is missing. Cannot fetch data.");
      setError("Authentication token is missing. Please log in again.");
      return;
    }
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/admin/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token dalam header
        },
      });
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error("An error occurred while fetching admin user data:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
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
    setToken(getToken);
    // Simulate fetch from server
  }, []);

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }); // Output: dd/mm/yyyy
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith("+62")) {
      return "0" + phone.slice(3);
    }
    return phone;
  };

  const columns: GridColDef[] = [
    { field: "fullname", headerName: "Full Name", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "telephone_number",
      headerName: "Phone Number",
      width: 150,
      renderCell: (params) => <span>{formatPhoneNumber(params.value)}</span>,
    },
    {
      field: "date_of_birth",
      headerName: "Birthday",
      width: 150,
      renderCell: (params) => <span>{formatDate(params.value)}</span>,
    },
    { field: "gender", headerName: "Gender", width: 150 },
  ];

  return (
    <div className={styles.mainContent}>
      <div className={styles.header}>
        <p className={styles.title}>Admin Table</p>
        <button className={styles.addButton} onClick={handleOpenDialog}>
          + Add
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <TableAdminUserLoaded rows={adminDatas} columns={columns} />
    </div>
  );
};

export default Admin;
