import styles from "./tableadminuserloaded.module.scss";
import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AdminData } from "@/components/types/AdminProps";

const TableAdminUserLoaded: React.FC<{
  rows: AdminData[];
  columns: GridColDef[];
}> = ({ rows, columns }) => {
  return (
    <div className={styles.dataGridContainer}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        className={styles.dataGrid}
        
      />
    </div>
  );
};

export default TableAdminUserLoaded;
