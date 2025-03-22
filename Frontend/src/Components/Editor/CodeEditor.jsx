import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  DialogActions,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { AiCode, Run, saveCode } from "../../lib/api-wizard";
import SideBar from "./SideBar";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function EditCode() {
  const [query, setQuery] = useState('');
    const [aiResponse, setAiResponse] = useState('');
  const [toggle, setToggle] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [filename, setFilename] = useState("");

  const handleModalClose = () => setOpenModal(false);
  // async function fetchModels() {
  //   const response = await fetch(
  //     "https://generativelanguage.googleapis.com/v1/models?key=AIzaSyDjDIuoUbmqJ2D7fbx2TEcQ2yrqpnqNFg4"
  //   );
  //   const data = await response.json();
  //   console.log("Available Models:", data);
  // }
  
  // useEffect(()=>{
  //   fetchModels();
  // },[]);
  const handleEditorChange = (value) => {
    setCode(value);
  };
  const handleSubmit = async () => {
      try {
        const response = await AiCode({ query });
        setAiResponse(response.data.response);
      } catch (err) {
        console.log(err);
      }
    };
  const handleSave = async () => {
    setOpenModal(false);
    try {
     const  id = localStorage.getItem("uid");
      const response = await saveCode({ filename, language, code,id });
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
    <Box sx={{ display: "flex",  height: "100vh" }}>
      <SideBar />
      <Box sx={{ display: "flex", flexDirection: "column",flex:1,flexShrink:1}}>
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
            {/* <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            bgcolor: "#D2665A",
                            color: "white",
                            '&:hover': { bgcolor: "#C65550" },
                          }}
                          onClick={() => setToggle(true)}
                        >
                          Chat with AI
                        </Button> */}
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
              onClick={() => setOpenModal(true)}
            >
              Save
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
        {/* <BoX */}
        <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
          {/* Editor */}
          <Box sx={{ flex: 1, borderRight: "1px solid #ddd" }}>
            <Editor
              height="500px"
              theme={theme}
              language={language}
              value={
                language === "javascript"
                  ? "console.log('Hello');\n"
                  : language === "python"
                  ? "print('Hello')\n"
                  : language === "java"
                  ? 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello");\n    }\n}'
                  : language === "c"
                  ? '#include <stdio.h>\n\nint main() {\n    printf("Hello\\n");\n    return 0;\n}'
                  : ""
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
        </Modal>
      </Box>
      { toggle ?
      <Box sx={{height:"100vh",flex:1}} >
        <Card
          sx={{
            borderRadius: 0,
            height: "100vh",
            bgcolor: "#2E3B55",
            color: "white",
            // width: 400,
            overflowY: "auto",
            p: 2
          }}
        >
          <CardContent>
            <Button
              variant="contained"
              sx={{
                bgcolor: "white",
                color: "black",
                '&:hover': { bgcolor: "#f0f0f0" },
                mb: 2,
              }}
              onClick={() => setToggle(false)}
            >
              Close AI Chat
            </Button>

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              🤖 AI Assistant
            </Typography>

            <TextField
              fullWidth
              size="small"
              label="Ask Your Query..."
              variant="outlined"
              sx={{ bgcolor: "white", borderRadius: 1, mb: 2 }}
              onChange={(e) => setQuery(e.target.value)}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ bgcolor: "#D2665A", color: "white", '&:hover': { bgcolor: "#C65550" } }}
              onClick={handleSubmit}
            >
              Submit
            </Button>

            {aiResponse && (
              <Box sx={{ mt: 3, bgcolor: "#1E1E1E", p: 2, borderRadius: 2, overflowY: "auto", maxHeight: "400px" }}>
                <Typography variant="subtitle1" sx={{ color: "white", mb: 1 }}>
                  Generated Code:
                </Typography>
                <SyntaxHighlighter language="c" style={dracula}>
                  {aiResponse}
                </SyntaxHighlighter>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box> :
         <></>
        }
    </Box>
  );
}
