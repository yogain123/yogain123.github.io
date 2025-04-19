import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
} from "@mui/material";
import Home from "@mui/icons-material/Home";
import HelpOutline from "@mui/icons-material/HelpOutline";
import ResultItem from "../components/ResultItem";

function OptimalHRACalculator() {
  const [basicSalary, setBasicSalary] = useState("");
  const [hraProvided, setHraProvided] = useState("");
  const [cityType, setCityType] = useState("metro");
  const [result, setResult] = useState(null);

  const calculateOptimalRent = (e) => {
    e.preventDefault();
    const basic = parseFloat(basicSalary.replace(/,/g, ""));

    // Calculate HRA based on input or default percentage
    let actualHRA;
    if (hraProvided) {
      actualHRA = parseFloat(hraProvided.replace(/,/g, ""));
    } else {
      // Default HRA percentage based on city type
      actualHRA = cityType === "metro" ? 0.5 * basic : 0.4 * basic;
    }

    // To fully utilize HRA exemption, we need to find rent where:
    // min(actualHRA, rentExcess, percentOfBasic) = actualHRA

    // Therefore:
    // 1. rentExcess = (rent - 0.1 * basic) should be >= actualHRA
    // 2. percentOfBasic = (0.5 or 0.4) * basic might be >= actualHRA already

    // Calculate minimum rent needed
    const percentOfBasic = cityType === "metro" ? 0.5 * basic : 0.4 * basic;

    let optimalRent;

    // If HRA is already more than the percentage of basic allowed for exemption
    if (actualHRA > percentOfBasic) {
      // We can only exempt up to percentOfBasic, so we calculate rent based on that
      optimalRent = percentOfBasic + 0.1 * basic;
    } else {
      // We can exempt the full HRA if rent is sufficient
      optimalRent = actualHRA + 0.1 * basic;
    }

    // Calculate the exemption at this optimal rent
    const rentExcess = optimalRent - 0.1 * basic;
    const hraExemption = Math.min(actualHRA, rentExcess, percentOfBasic);
    const taxableHRA = actualHRA - hraExemption;

    setResult({
      basicSalary: basic,
      actualHRA,
      optimalRent,
      rentExcess,
      percentOfBasic,
      hraExemption,
      taxableHRA,
    });
  };

  const formatNumber = (value) => {
    if (!value) return "";
    const numberStr = value.toString().replace(/,/g, "");
    const number = parseFloat(numberStr);
    return isNaN(number) ? "" : number.toLocaleString("en-IN");
  };

  const handleBasicSalaryChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setBasicSalary(value);
  };

  const handleHraProvidedChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setHraProvided(value);
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
        <Home
          sx={{
            fontSize: "2.5rem",
            color: "primary.dark",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
          }}
        />
        Optimal Rent Calculator for HRA
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ mb: 3, textAlign: "center" }}
      >
        Calculate the optimal annual rent to maximize your House Rent Allowance
        (HRA) tax benefits.
      </Typography>

      <form onSubmit={calculateOptimalRent}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Annual Basic Salary (INR)"
              variant="outlined"
              value={formatNumber(basicSalary)}
              onChange={handleBasicSalaryChange}
              required
              helperText="Mandatory field"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Annual HRA Provided by Company (INR)"
              variant="outlined"
              value={formatNumber(hraProvided)}
              onChange={handleHraProvidedChange}
              helperText={`Optional: Leave blank to use ${
                cityType === "metro" ? "50%" : "40%"
              } of basic salary`}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                City Type
                <Tooltip title="Metro cities include Delhi, Mumbai, Kolkata, and Chennai">
                  <HelpOutline fontSize="small" color="action" />
                </Tooltip>
              </Typography>
              <RadioGroup
                row
                value={cityType}
                onChange={(e) => setCityType(e.target.value)}
              >
                <FormControlLabel
                  value="metro"
                  control={<Radio />}
                  label="Metro City (50% of Basic)"
                />
                <FormControlLabel
                  value="non-metro"
                  control={<Radio />}
                  label="Non-Metro City (40% of Basic)"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!basicSalary}
            >
              Calculate Optimal Rent
            </Button>
          </Grid>
        </Grid>
      </form>

      {result && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Optimal Rent Calculation Details
          </Typography>
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <ResultItem
                  label="Annual Basic Salary"
                  value={result.basicSalary}
                  title="Your annual basic salary"
                  sx={{ bgcolor: "primary.light", borderRadius: 1, p: 1 }}
                />
                <ResultItem
                  label="Annual HRA Provided"
                  value={result.actualHRA}
                  title={
                    hraProvided
                      ? "The HRA amount you entered"
                      : `${
                          cityType === "metro" ? "50%" : "40%"
                        } of your basic salary`
                  }
                  sx={{ bgcolor: "primary.light", borderRadius: 1, p: 1 }}
                />
                <ResultItem
                  label="Maximum HRA Exemption by Law"
                  value={result.percentOfBasic}
                  title={`${
                    cityType === "metro" ? "50%" : "40%"
                  } of your annual basic salary as per city type`}
                  sx={{ bgcolor: "primary.light", borderRadius: 1, p: 1 }}
                />
                <ResultItem
                  label="Optimal Annual Rent to Pay"
                  value={result.optimalRent}
                  boldLabel={true}
                  title="The annual rent amount you should pay to maximize your HRA tax benefits"
                  sx={{ bgcolor: "success.light", borderRadius: 1, p: 1 }}
                />
                <ResultItem
                  label="Optimal Monthly Rent to Pay"
                  value={Math.ceil(result.optimalRent / 12)}
                  boldLabel={true}
                  title="The monthly rent amount you should pay to maximize your HRA tax benefits"
                  sx={{ bgcolor: "success.light", borderRadius: 1, p: 1 }}
                />
                <ResultItem
                  label="Expected Annual HRA Exemption"
                  value={result.hraExemption}
                  title="The tax exempt amount you'll get with this rent payment"
                  sx={{ bgcolor: "info.light", borderRadius: 1, p: 1 }}
                />
                {result.taxableHRA > 0 && (
                  <ResultItem
                    label="Annual Taxable HRA"
                    value={result.taxableHRA}
                    title="Portion of your HRA that will still be taxable"
                    sx={{ bgcolor: "warning.light", borderRadius: 1, p: 1 }}
                  />
                )}
              </Grid>
            </CardContent>
          </Card>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Note: This calculation provides the minimum rent needed to maximize
            your HRA tax benefits. The actual amount you pay may be higher based
            on property costs in your area.
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default OptimalHRACalculator;
