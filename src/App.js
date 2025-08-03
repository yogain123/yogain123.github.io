import React, { useState } from "react";
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
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NewRegimeCalculator from "./views/NewRegime";
import OldRegimeCalculator from "./views/OldRegime";
import GratuityCalculator from "./views/GratuityCalculator";
import LeaveEncashmentCalculator from "./views/LeaveEncashmentCalculator";
import HRACalculator from "./views/HRACalculator";
import CreditCardCalculator from "./views/CreditCardCalculator";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Style for active links
  const navLinkStyle = ({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: isActive ? "underline" : "none",
    backgroundColor: isActive ? "rgba(255, 255, 255, 0.15)" : "transparent",
    borderRadius: "4px",
    padding: "6px 8px",
    display: "block",
    width: "100%",
  });

  const navItems = [
    { path: "/new-regime", label: "New Regime" },
    { path: "/old-regime", label: "Old Regime" },
    { path: "/gratuity", label: "Gratuity" },
    { path: "/leave-encashment", label: "Leave" },
    { path: "/hra", label: "Optimal Rent" },
    { path: "/credit-card", label: "Credit Card" },
  ];

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

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {isMobile ? (
                <>
                  <IconButton
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenuOpen}
                    edge="end"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    MenuListProps={{
                      "aria-labelledby": "mobile-menu-button",
                    }}
                  >
                    {navItems.map((item) => (
                      <MenuItem key={item.path} onClick={handleMenuClose}>
                        <NavLink
                          to={item.path}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            width: "100%",
                            display: "block",
                          }}
                        >
                          {item.label}
                        </NavLink>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <>
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      style={navLinkStyle}
                    >
                      {({ isActive }) => (
                        <Button
                          style={{ color: "white" }}
                          sx={{
                            fontWeight: isActive ? "bold" : "normal",
                            backgroundColor: isActive
                              ? "rgba(255, 255, 255, 0.15)"
                              : "transparent",
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.8rem",
                              md: "0.875rem",
                            },
                            whiteSpace: "nowrap",
                            px: { xs: 1, sm: 1.5, md: 2 },
                          }}
                        >
                          {item.label}
                        </Button>
                      )}
                    </NavLink>
                  ))}
                </>
              )}
            </Box>
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
          <Route path="/credit-card" element={<CreditCardCalculator />} />
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
