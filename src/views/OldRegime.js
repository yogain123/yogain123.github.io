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

function OldRegimeCalculator() {
  const [salary, setSalary] = useState("");
  const [hra, setHra] = useState("");
  const [section80D, setSection80D] = useState("");
  const [section24, setSection24] = useState("");
  const [section80EE, setSection80EE] = useState("");
  const [otherDeductions, setOtherDeductions] = useState("");
  const [employerPf, setEmployerPf] = useState("");
  const [employeePf, setEmployeePf] = useState("");
  const [isPfPartOfSalary, setIsPfPartOfSalary] = useState(false);
  const [lastChangedPf, setLastChangedPf] = useState(null);
  const [results, setResults] = useState(null);
  const [section80C, setSection80C] = useState("");

  useEffect(() => {
    if (lastChangedPf === "employer") {
      setEmployeePf(employerPf);
    } else if (lastChangedPf === "employee") {
      setEmployerPf(employeePf);
    }
  }, [employerPf, employeePf, lastChangedPf]);

  const calculateOldTax = (taxableIncome) => {
    const oldSlabs = [
      { limit: 250000, percent: 0 },
      { limit: 500000, percent: 5 },
      { limit: 1000000, percent: 20 },
      { limit: Infinity, percent: 30 },
    ];

    let tax = 0;
    let remaining = taxableIncome;
    let previousLimit = 0;

    for (const slab of oldSlabs) {
      if (remaining <= 0) break;
      const slabAmount = Math.min(slab.limit - previousLimit, remaining);
      tax += slabAmount * (slab.percent / 100);
      remaining -= slabAmount;
      previousLimit = slab.limit;
    }

    return tax;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const annualSalary = parseFloat(salary);
    const standardDeduction = 50000;
    const totalPfContribution = parseFloat(employeePf) + parseFloat(employerPf);

    // Calculate 80C deduction (PF + other investments, capped at 1.5L)
    const total80C = Math.min(
      (parseFloat(section80C) || 0) + (parseFloat(employeePf) || 0),
      150000
    );

    let taxableIncome = annualSalary - standardDeduction;

    if (isPfPartOfSalary) {
      taxableIncome = taxableIncome - parseFloat(employerPf);
    }

    const totalDeductions =
      parseFloat(hra || 0) +
      parseFloat(section80D || 0) +
      parseFloat(section24 || 0) +
      parseFloat(section80EE || 0) +
      parseFloat(otherDeductions || 0) +
      total80C;

    taxableIncome = taxableIncome - totalDeductions;
    const tax = calculateOldTax(taxableIncome);

    const cess = tax * 0.04;
    const professionalTax = 200;

    // Calculate in-hand salary
    let inHandYear;
    if (isPfPartOfSalary) {
      inHandYear =
        annualSalary - tax - totalPfContribution - cess - professionalTax;
    } else {
      inHandYear =
        annualSalary - tax - parseFloat(employeePf) - cess - professionalTax;
    }

    setResults({
      annualSalary,
      taxableIncome,
      tax,
      inHandYear,
      inHandMonth: inHandYear / 12,
      standardDeduction,
      totalDeductions,
      hra,
      section80D,
      section24,
      section80EE,
      otherDeductions,
      totalPF: isPfPartOfSalary ? totalPfContribution : parseFloat(employeePf),
      section80C: parseFloat(section80C) || 0,
      employeePfFor80C: parseFloat(employeePf) || 0,
      total80C,
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
          color: "primary.main",
          fontWeight: 700,
          borderColor: "primary.light",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: 1.2,
          mb: 3,
        }}
      >
        🏛️ Old Tax Regime Calculator
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Annual Salary (INR)"
              variant="outlined"
              value={formatNumber(salary)}
              onChange={(e) => setSalary(e.target.value.replace(/\D/g, ""))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="HRA Exemption"
              variant="outlined"
              value={formatNumber(hra)}
              onChange={(e) => setHra(e.target.value.replace(/\D/g, ""))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Section 80D (Health Insurance)"
              variant="outlined"
              value={formatNumber(section80D)}
              onChange={(e) => setSection80D(e.target.value.replace(/\D/g, ""))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Section 24 (Home Loan Interest)"
              variant="outlined"
              value={formatNumber(section24)}
              onChange={(e) => setSection24(e.target.value.replace(/\D/g, ""))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Section 80EE (Home Loan Deduction)"
              variant="outlined"
              value={formatNumber(section80EE)}
              onChange={(e) =>
                setSection80EE(e.target.value.replace(/\D/g, ""))
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Section 80C (Other than PF)"
              variant="outlined"
              value={formatNumber(section80C)}
              onChange={(e) => setSection80C(e.target.value.replace(/\D/g, ""))}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Other Deductions"
              variant="outlined"
              value={formatNumber(otherDeductions)}
              onChange={(e) =>
                setOtherDeductions(e.target.value.replace(/\D/g, ""))
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employee PF Contribution Annually (INR)"
              variant="outlined"
              value={formatNumber(employeePf)}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                setEmployeePf(rawValue);
                setLastChangedPf("employee");
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employer PF Contribution Annually (INR)"
              variant="outlined"
              value={formatNumber(employerPf)}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                setEmployerPf(rawValue);
                setLastChangedPf("employer");
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
              label="Is Employer PF part of the salary mentioned above?"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              * Standard deduction of ₹50,000 is applied automatically
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
                    Deductions/Exemptions
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={1}>
                    {[
                      ["Total 80C Deduction", results.total80C],
                      ["HRA Exemption", formatNumber(results.hra)],
                      ["Section 80D", formatNumber(results.section80D)],
                      ["Section 24", formatNumber(results.section24)],
                      ["Section 80EE", formatNumber(results.section80EE)],
                      [
                        "Other Deductions",
                        formatNumber(results.otherDeductions),
                      ],
                      [
                        "Total",
                        results.totalDeductions + results.standardDeduction,
                      ],
                    ].map(([label, value]) => (
                      <ResultItem
                        key={label}
                        label={label}
                        value={value}
                        sx={{
                          bgcolor:
                            label === "Total"
                              ? "primary.light"
                              : "action.hover",
                          borderRadius: 1,
                          p: 1,
                        }}
                      />
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

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

            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Total PF Paid</Typography>
                  <Divider sx={{ my: 2 }} />
                  <ResultItem
                    label="Total PF Paid"
                    value={results.totalPF}
                    title={`Your salary ${
                      isPfPartOfSalary ? "includes" : "does not include"
                    } employer PF contribution`}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default OldRegimeCalculator;
