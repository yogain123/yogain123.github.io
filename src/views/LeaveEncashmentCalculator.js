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
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import AccountBalance from "@mui/icons-material/AccountBalance";
import EventAvailable from "@mui/icons-material/EventAvailable";
import ResultItem from "../components/ResultItem";

function LeaveEncashmentCalculator() {
  const [payType, setPayType] = useState("basic");
  const [payAmount, setPayAmount] = useState("");
  const [numberOfLeaves, setNumberOfLeaves] = useState("");
  const [result, setResult] = useState(null);

  const calculateLeaveEncashment = (e) => {
    e.preventDefault();
    const amount = parseFloat(payAmount);
    const leaves = parseFloat(numberOfLeaves);

    // Formula: (amount/12/30)*numberOfLeaves
    const encashmentAmount = (amount / 12 / 30) * leaves;

    // Tax exemption limit is 20 lakhs (2000000)
    const taxExemptAmount = Math.min(encashmentAmount, 2000000);
    const taxableAmount =
      encashmentAmount > 2000000 ? encashmentAmount - 2000000 : 0;

    setResult({
      encashmentAmount,
      perDayAmount: amount / 12 / 30,
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
        <EventAvailable
          sx={{
            fontSize: "2.5rem",
            color: "primary.dark",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
          }}
        />
        Leave Encashment Calculator
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ mb: 3, textAlign: "center" }}
      >
        Leave encashment is tax-exempt up to ₹20,00,000. Any amount above that
        is taxable.
      </Typography>

      <form onSubmit={calculateLeaveEncashment}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1" gutterBottom>
                Select Pay Type
              </Typography>
              <RadioGroup
                row
                value={payType}
                onChange={(e) => setPayType(e.target.value)}
              >
                <FormControlLabel
                  value="basic"
                  control={<Radio />}
                  label="Basic Pay"
                />
                <FormControlLabel
                  value="gross"
                  control={<Radio />}
                  label="Gross Pay"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label={`Annual ${
                payType === "basic" ? "Basic" : "Gross"
              } Pay (INR)`}
              variant="outlined"
              value={formatNumber(payAmount)}
              onChange={(e) => setPayAmount(e.target.value.replace(/\D/g, ""))}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Number of Leaves"
              variant="outlined"
              type="number"
              value={numberOfLeaves}
              onChange={(e) => setNumberOfLeaves(e.target.value)}
              required
              inputProps={{ step: "0.5", min: "0" }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!payAmount || !numberOfLeaves}
            >
              Calculate Leave Encashment
            </Button>
          </Grid>
        </Grid>
      </form>

      {result && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Leave Encashment Details
          </Typography>
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <ResultItem
                  label="Per Day Amount"
                  value={result.perDayAmount}
                  sx={{ bgcolor: "primary.light", borderRadius: 1, p: 1 }}
                />
                <ResultItem
                  label="Total Encashment Amount"
                  value={result.encashmentAmount}
                  boldLabel={true}
                  sx={{
                    bgcolor: "#ff5722",
                    color: "white",
                    borderRadius: 1,
                    p: 1,
                    fontWeight: 900,
                    fontSize: "1.1rem",
                  }}
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

export default LeaveEncashmentCalculator;
