import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
} from "@mui/material";
import AccountBalance from "@mui/icons-material/AccountBalance";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import ResultItem from "../components/ResultItem";

function GratuityCalculator() {
  const [monthlyBasic, setMonthlyBasic] = useState("");
  const [yearsOfService, setYearsOfService] = useState("");
  const [result, setResult] = useState(null);

  const calculateGratuity = (e) => {
    e.preventDefault();
    const basic = parseFloat(monthlyBasic);
    const years = parseFloat(yearsOfService);

    // Gratuity Formula = (15 * Last drawn monthly salary * Number of years of service) / 26
    const gratuityAmount = (15 * basic * years) / 26;

    // Tax exemption limit for gratuity is 20 lakhs
    const taxExemptAmount = Math.min(gratuityAmount, 2000000);
    const taxableAmount =
      gratuityAmount > 2000000 ? gratuityAmount - 2000000 : 0;

    setResult({
      gratuityAmount,
      taxExemptAmount,
      taxableAmount,
    });
  };

  const formatNumber = (value) => {
    if (!value) return "";
    const number = parseInt(value.replace(/,/g, ""));
    return isNaN(number) ? "" : number.toLocaleString("en-IN");
  };

  return (
    <Container component="main" sx={{ flex: 1, py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mt: 3,
          pb: 2,
          color: "primary.main",
          fontWeight: 700,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: 1.2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <MonetizationOn
          sx={{
            fontSize: "2.5rem",
            color: "primary.dark",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
          }}
        />
        Gratuity Calculator
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ mb: 3, textAlign: "center" }}
      >
        Gratuity is tax-exempt up to ₹20,00,000. Any amount above that is
        taxable.
      </Typography>

      <form onSubmit={calculateGratuity}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Monthly Basic Pay (INR)"
              variant="outlined"
              value={formatNumber(monthlyBasic)}
              onChange={(e) =>
                setMonthlyBasic(e.target.value.replace(/\D/g, ""))
              }
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Years of Service"
              variant="outlined"
              type="number"
              value={yearsOfService}
              onChange={(e) => setYearsOfService(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!monthlyBasic || !yearsOfService}
            >
              Calculate Gratuity
            </Button>
          </Grid>
        </Grid>
      </form>

      {result && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Gratuity Details
          </Typography>
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <ResultItem
                  label="Total Gratuity Amount"
                  value={result.gratuityAmount}
                  boldLabel={true}
                  sx={{ bgcolor: "primary.light", borderRadius: 1, p: 1 }}
                />
                <ResultItem
                  label="Tax Exempt Amount"
                  value={result.taxExemptAmount}
                  sx={{ bgcolor: "success.light", borderRadius: 1, p: 1 }}
                />
                <ResultItem
                  label="Taxable Amount"
                  value={result.taxableAmount}
                  sx={{ bgcolor: "warning.light", borderRadius: 1, p: 1 }}
                />
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
}

export default GratuityCalculator;
