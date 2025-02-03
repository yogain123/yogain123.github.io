import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import _ from "lodash";
import ResultItem from "../components/ResultItem";

function NewRegimeCalculator() {
  const [salary, setSalary] = useState("");
  const [employerPf, setEmployerPf] = useState("");
  const [employeePf, setEmployeePf] = useState("");
  const [isPfPartOfSalary, setIsPfPartOfSalary] = useState(false);
  const [lastChangedPf, setLastChangedPf] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (lastChangedPf === "employer") {
      setEmployeePf(employerPf);
    } else if (lastChangedPf === "employee") {
      setEmployerPf(employeePf);
    }
  }, [employerPf, employeePf, lastChangedPf]);

  const calculateTax = (taxableIncome) => {
    const slabs = [
      { limit: 400000, percent: 0 },
      { limit: 800000, percent: 5 },
      { limit: 1200000, percent: 10 },
      { limit: 1600000, percent: 15 },
      { limit: 2000000, percent: 20 },
      { limit: 2400000, percent: 25 },
      { limit: Infinity, percent: 30 },
    ];

    let tax = 0;
    let remaining = taxableIncome;
    let previousLimit = 0;

    for (const slab of slabs) {
      if (remaining <= 0) break;

      const slabAmount = Math.min(slab.limit - previousLimit, remaining);
      tax += slabAmount * (slab.percent / 100);
      remaining -= slabAmount;
      previousLimit = slab.limit;
    }

    // Calculate rebate for taxable income <= 12 lakh
    const rebate = taxableIncome <= 1200000 ? tax : 0;
    return { tax: tax - rebate, rebate };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let inHandYear;

    const totalPfContribution = parseFloat(employeePf) + parseFloat(employerPf);
    const annualSalary = parseFloat(salary);
    const standardDeduction = 75000;

    let taxableIncome = annualSalary - standardDeduction;

    if (isPfPartOfSalary) {
      taxableIncome = taxableIncome - parseFloat(employerPf);
    }

    let { tax, rebate } = calculateTax(taxableIncome);
    let marginalTaxRelief = "No";

    if (tax >= 60000 && taxableIncome <= 1260000) {
      tax = taxableIncome - 1200000;
      marginalTaxRelief = "Yes";
    }

    const cess = tax * 0.04;
    const professionalTax = 200;

    if (isPfPartOfSalary) {
      inHandYear =
        annualSalary - tax - totalPfContribution - cess - professionalTax;
    } else {
      inHandYear =
        annualSalary - tax - parseFloat(employeePf) - cess - professionalTax;
    }
    const inHandMonth = inHandYear / 12;

    setResults({
      annualSalary,
      taxableIncome,
      tax,
      cess,
      professionalTax,
      rebate,
      inHandYear,
      inHandMonth,
      standardDeduction,
      marginalTaxRelief,
      totalPF: isPfPartOfSalary ? totalPfContribution : parseFloat(employeePf),
    });
  };

  const formatNumber = (value) => {
    if (_.isEmpty(value)) return "";
    const number = _.toInteger(value.replace(/,/g, ""));
    return _.isNaN(number) ? "" : number.toLocaleString("en-IN");
  };

  return (
    <Container component="main" sx={{ flex: 1, py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mt: 3,
          pb: 2,
          color: "secondary.main",
          fontWeight: 700,
          borderColor: "secondary.light",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: 1.2,
          mb: 3,
        }}
      >
        🚀 New Tax Regime Calculator
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Annual Salary (INR)"
              variant="outlined"
              type="text"
              value={formatNumber(salary)}
              onChange={(e) => {
                const rawValue = _.replace(e.target.value, /[^0-9]/g, "");
                if (rawValue === "" || /^\d+$/.test(rawValue)) {
                  setSalary(rawValue);
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employee PF Contribution Annually (INR)"
              variant="outlined"
              type="text"
              value={formatNumber(employeePf)}
              onChange={(e) => {
                const rawValue = _.replace(e.target.value, /[^0-9]/g, "");
                if (rawValue === "" || /^\d+$/.test(rawValue)) {
                  setEmployeePf(rawValue);
                  setLastChangedPf("employee");
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employer PF Contribution Annually (INR)"
              variant="outlined"
              type="text"
              value={formatNumber(employerPf)}
              onChange={(e) => {
                const rawValue = _.replace(e.target.value, /[^0-9]/g, "");
                if (rawValue === "" || /^\d+$/.test(rawValue)) {
                  setEmployerPf(rawValue);
                  setLastChangedPf("employer");
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPfPartOfSalary}
                  onChange={(e) => setIsPfPartOfSalary(e.target.checked)}
                />
              }
              label="Is Employ(er) PF part of the salary mentioned above?"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              * Standard deduction of ₹75,000 is applied automatically
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!salary || !employerPf || !employeePf}
            >
              Calculate
            </Button>
          </Grid>
        </Grid>
      </form>

      {results && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Calculation Results
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card
                variant="outlined"
                sx={{
                  borderColor: "divider",
                  boxShadow: 1,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                      mb: 1,
                    }}
                  >
                    Tax Details
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={1}>
                    <ResultItem
                      label="Annual salary"
                      value={results.annualSalary}
                      sx={{ bgcolor: "action.hover", borderRadius: 1, p: 1 }}
                    />
                    <ResultItem
                      label="Total PF Paid"
                      value={results.totalPF}
                      title={`Your salary ${
                        isPfPartOfSalary ? "includes" : "does not include"
                      } employer PF contribution`}
                      sx={{ bgcolor: "action.hover", borderRadius: 1, p: 1 }}
                    />
                  </Grid>

                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <ResultItem
                      label="Rebate"
                      value={results.rebate}
                      sx={{ bgcolor: "success.light", borderRadius: 1, p: 1 }}
                    />
                    <ResultItem
                      label="Marginal Tax Relief"
                      value={results.marginalTaxRelief}
                      sx={{ bgcolor: "error.light", borderRadius: 1, p: 1 }}
                    />
                    <ResultItem
                      label="Total Tax"
                      value={results.tax}
                      sx={{ bgcolor: "error.light", borderRadius: 1, p: 1 }}
                    />
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card
                variant="outlined"
                sx={{
                  boxShadow: 3,
                  border: 2,
                  borderColor: "primary.main",
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary">
                    In-hand Salary
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={1}>
                    <ResultItem label="Annual" value={results.inHandYear} />
                    <ResultItem label="Monthly" value={results.inHandMonth} />
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default NewRegimeCalculator;
