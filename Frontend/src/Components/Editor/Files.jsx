import { Box, Button, DialogActions, IconButton, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { deleteFile, getFileData, getFiles, updateFileName } from "../../lib/api-wizard";
import { Delete, Edit } from "@mui/icons-material";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import { Close as CloseIcon } from "@mui/icons-material";

function Files() {
  const [filesData, setFilesData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
    const [filename, setFilename] = useState("");
  const [id,setId] = useState();
  const navigate = useNavigate();
  const handleOpenFile = async (id) => {
    console.log("File ID:", id);
    try {
      const response = await getFileData({ id });
      console.log(response.data.result);
      const data = response.data.result;
      navigate('/editcode',{state : data });
    } catch (err) {
      console.error(err);
    }
  };
  const handleModalClose = () => setOpenModal(false);
  const handleDeleteFile = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    console.log("Delete file with ID:", id);
    if(confirmed){
      try{
        const response = await deleteFile({id});
        console.log(response.data.message);
        fetchFiles();
      }catch(err){
        console.log(err);
      }
    }

    // Implement deletion logic here
  };

  const handleEditFile = async (id) => {
    setOpenModal(true)
    console.log("Edit file with ID:", id);
    setId(id);
    // Implement edit logic here
  };

  const handleEdit = async() =>{
    setOpenModal(false)
    console.log("file : ",filename);
    try{
      const  response = await updateFileName({filename,id})
      console.log("Updated : ",response.data.message);
      fetchFiles();
    }catch(err){
      console.log(err);
    }
  }
  const columns = [
    {
      field: "serialNumber",
      headerName: "Sr. No",
      width: 80,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "filename",
      headerName: "File Name",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            cursor: "pointer",
            "&:hover": { color: "blue" },
            whiteSpace: "nowrap", // Prevents text from breaking
            overflow: "hidden",
            textOverflow: "ellipsis", // Show "..." for overflow
          }}
          onClick={() => handleOpenFile(params.row.id)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "created_at",
      headerName: "Created At",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => handleEditFile(params.row.id)}>
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteFile(params.row.id)}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const fetchFiles = async () => {
    try {
      const id = localStorage.getItem("uid")
      const response = await getFiles({id});
      console.log("Files:", response.data);
      setFilesData(response.data.result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  console.log(filesData)
  const rows = filesData.map((row, index) => ({
    id: row.id, // Ensure a unique ID
    filename: row.name,
    created_at: row.created_at || "",
    updated_at: row.updated_at || "",
  }));

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        bgcolor: "darkslategray",
        flexDirection: { xs: "column", md: "row" }, // Column on small screens, row on large
        height: "100vh",
      }}
    >
      {/* Sidebar (Hidden on small screens) */}
      <Box
        sx={{
          width: { xs: "100%", md: "300px" }, // Full width on small screens
          display: { xs: "none", md: "block" }, // Hide on extra small screens
        }}
      >
        <SideBar />
      </Box>

      {/* DataGrid Wrapper for responsiveness */}
      <Box
        sx={{
          flex: 1,
          overflowX: "auto", // Allows horizontal scrolling if needed
          p: 2,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 2,
          minWidth: 300,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={40}
          sx={{
            "& .MuiTablePagination-displayedRows": { display: "none" }, // Hide "X–Y of Z"
            "& .MuiToolbar-root": { display: "none" }, // Hide selection count
            "& .MuiDataGrid-selectedRowCount": { display: "none" }, // Hides "1 row selected"
          }}
          components={{
            Footer: () => <div />, // Removes default footer
          }}
          // pageSizeOptions={[5]}
          // paginationModel={{ pageSize: 5, page: 0 }}
          // pagination
          autoHeight // Makes DataGrid adapt to content height
        />
      </Box>
      <Modal
          open={openModal}
          onClose={handleModalClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "90%",
              maxWidth: 400,
              bgcolor: "#fff",
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
              position: "relative",
            }}
          >
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "#9A616D",
              }}
              onClick={handleModalClose}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                marginBottom: 2,
                color: "#393f81",
                textAlign: "center",
              }}
            >
              Edit
            </Typography>
            <TextField
              size="small"
              label="File Name"
              fullWidth
              onChange={(e) => setFilename(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <DialogActions
              sx={{ justifyContent: "center", flexDirection: "column" }}
            >
              <Button
                onClick={handleModalClose}
                color="error"
                sx={{
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Box>
        </Modal>
    </Box>
  );
}

export default Files;
