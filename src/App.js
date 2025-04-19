import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
} from "@mui/material";
import NewRegimeCalculator from "./views/NewRegime";
import OldRegimeCalculator from "./views/OldRegime";
import GratuityCalculator from "./views/GratuityCalculator";
import LeaveEncashmentCalculator from "./views/LeaveEncashmentCalculator";
import HRACalculator from "./views/HRACalculator";

function App() {
  // Style for active links
  const navLinkStyle = ({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: isActive ? "underline" : "none",
    backgroundColor: isActive ? "rgba(255, 255, 255, 0.15)" : "transparent",
    borderRadius: "4px",
    padding: "6px 8px",
  });

  return (
    <Router>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography
              onClick={() => {
                window.location.href = "/";
              }}
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, cursor: "pointer" }}
            >
              Salary Calculator
            </Typography>
            <NavLink to="/new-regime" style={navLinkStyle}>
              {({ isActive }) => (
                <Button
                  style={{ color: "white" }}
                  sx={{
                    fontWeight: isActive ? "bold" : "normal",
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 0.15)"
                      : "trarwdnsparent",
                  }}
                >
                  New Regime
                </Button>
              )}
            </NavLink>
            <NavLink to="/old-regime" style={navLinkStyle}>
              {({ isActive }) => (
                <Button
                  style={{ color: "white" }}
                  sx={{
                    fontWeight: isActive ? "bold" : "normal",
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 0.15)"
                      : "transparent",
                  }}
                >
                  Old Regime
                </Button>
              )}
            </NavLink>
            <NavLink to="/gratuity" style={navLinkStyle}>
              {({ isActive }) => (
                <Button
                  style={{ color: "white" }}
                  sx={{
                    fontWeight: isActive ? "bold" : "normal",
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 0.15)"
                      : "transparent",
                  }}
                >
                  Gratuity Calculator
                </Button>
              )}
            </NavLink>
            <NavLink to="/leave-encashment" style={navLinkStyle}>
              {({ isActive }) => (
                <Button
                  style={{ color: "white" }}
                  sx={{
                    fontWeight: isActive ? "bold" : "normal",
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 0.15)"
                      : "transparent",
                  }}
                >
                  Leave Encashment
                </Button>
              )}
            </NavLink>
            <NavLink to="/hra" style={navLinkStyle}>
              {({ isActive }) => (
                <Button
                  style={{ color: "white" }}
                  sx={{
                    fontWeight: isActive ? "bold" : "normal",
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 0.15)"
                      : "transparent",
                  }}
                >
                  Optimal Rent
                </Button>
              )}
            </NavLink>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<Navigate to="/new-regime" replace />} />
          <Route path="/new-regime" element={<NewRegimeCalculator />} />
          <Route path="/old-regime" element={<OldRegimeCalculator />} />
          <Route path="/gratuity" element={<GratuityCalculator />} />
          <Route
            path="/leave-encashment"
            element={<LeaveEncashmentCalculator />}
          />
          <Route path="/hra" element={<HRACalculator />} />
        </Routes>

        <Box
          component="footer"
          sx={{ bgcolor: "primary.main", color: "white", py: 3, mt: "auto" }}
        >
          <Container>
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              Made by{" "}
              <a
                href="https://www.github.com/yogain123"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "white", textDecoration: "none" }}
              >
                Yogendra
              </a>{" "}
              for all Indian ❤️
            </Typography>
          </Container>
        </Box>
      </div>
    </Router>
  );
}

export default App;
