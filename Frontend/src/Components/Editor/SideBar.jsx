import { Box, Button, Card, CardContent, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiCode } from '../../lib/api-wizard';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

function SideBar() {
  const [toggle, setToggle] = useState(false);
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async () => {
    try {
      const response = await AiCode({ query });
      setAiResponse(response.data.response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      {toggle ? (
        <Card
          sx={{
            borderRadius: 0,
            height: "100vh",
            bgcolor: "#2E3B55",
            color: "white",
            width: isMobile ? '100%' : 400,
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
      ) : (
        <Card
          sx={{
            borderRadius: 0,
            height: "100vh",
            bgcolor: "#2E3B55",
            color: "white",
            width: isMobile ? '100%' : 200,
            p: 2
          }}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
              🎯 Quick Actions
            </Typography>

            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "white",
                color: "black",
                '&:hover': { bgcolor: "#f0f0f0" },
              }}
              onClick={() => navigate('/file')}
            >
              My Projects
            </Button>

            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "white",
                color: "black",
                '&:hover': { bgcolor: "#f0f0f0" },
              }}
              onClick={() => navigate('/Editor')}
            >
              Create New Project
            </Button>

            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "white",
                color: "black",
                '&:hover': { bgcolor: "#f0f0f0" },
              }}
              onClick={() => navigate('/profile')}
            >
              Dashboard
            </Button>

            <Button
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
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default SideBar;
