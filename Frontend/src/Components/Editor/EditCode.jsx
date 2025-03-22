import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";
import {
  Box,
  Button,
  // DialogActions,
  // IconButton,
  // Modal,
  // TextField,
  Typography,
} from "@mui/material";
// import { Close as CloseIcon } from "@mui/icons-material";
import { Run, UpdateCode } from "../../lib/api-wizard";
import SideBar from "./SideBar";
import { useLocation } from "react-router-dom";

export default function EditCode() {
  // const [openModal, setOpenModal] = useState(false);
  const  location  = useLocation();
  const codeData = location.state;
  const [code, setCode] = useState(codeData[0]?.code || "");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState(codeData[0]?.langauge || "");
  const [theme, setTheme] = useState("vs-dark");
  // const [filename, setFilename] = useState("");
  
  console.log("Code : ",codeData);

  // const handleModalClose = () => setOpenModal(false);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleUpdate = async () => {
    // setOpenModal(false);
    const id = codeData[0].id;
    try {
      const response = await UpdateCode({  language, code,id });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRunCode = async () => {
    try {
      const response = await Run({ code, language });
      setOutput(response.data.output || "No output returned.");
    } catch (error) {
      setOutput(error.response?.data?.output || "Error executing code.");
    }
  };

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
      <SideBar />
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        {/* Header */}
        <Box
          sx={{
            padding: "10px",
            backgroundColor: "#282c34",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "2px solid white",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            <strong>WIZARD</strong> Code Editor
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              sx={{ bgcolor: "white", color: "black" }}
              onClick={handleRunCode}
            >
              Run Code
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "white", color: "black" }}
              onClick={() => handleUpdate()}
            >
              Update
            </Button>
            <Box sx={{ display: "flex", gap: 1 }}>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ padding: "5px" }}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="c">C</option>
                <option value="java">Java</option>
              </select>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{ padding: "5px" }}
              >
                <option value="vs-dark">Vs-Dark</option>
                <option value="vs">Vs-Light</option>
                <option value="hc-black">hc-black</option>
              </select>
            </Box>
          </Box>
        </Box>

        {/* Editor and Output Area (Horizontal) */}
        <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
          {/* Editor */}
          <Box sx={{ flex: 1, borderRight: "1px solid #ddd" }}>
            <Editor
              height="500px"
              theme={theme}
              language={language}
              value={code
                // language === "javascript"
                //   ? "console.log('Hello');\n"
                //   : language === "python"
                //   ? "print('Hello')\n"
                //   : language === "java"
                //   ? 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello");\n    }\n}'
                //   : language === "c"
                //   ? '#include <stdio.h>\n\nint main() {\n    printf("Hello\\n");\n    return 0;\n}'
                //   : ""
              }
              onChange={handleEditorChange}
              options={{ fontSize: 14, automaticLayout: true }}
            />
          </Box>

          {/* Output */}
          <Box sx={{ flex: 0.4, p: 2, backgroundColor: "#f5f5f5" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Output
            </Typography>
            <pre
              style={{
                whiteSpace: "pre-wrap", // Ensure that long lines of text wrap within the container
                wordWrap: "break-word", // Enable word wrapping
                maxHeight: "90px", // Set the maximum height
                overflow: "auto", // Add a scrollbar when content exceeds the height
                background: "#222",
                color: "#fff",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              {output || "Your output will appear here..."}
            </pre>
          </Box>
        </Box>

        {/* Save File Modal */}
        {/* <Modal
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
              Save
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
              onClick={handleSave}
            >
              Save
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
        </Modal> */}
      </Box>
    </Box>
  );
}
