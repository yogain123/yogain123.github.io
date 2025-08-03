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
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import CreditCard from "@mui/icons-material/CreditCard";
import ResultItem from "../components/ResultItem";

function CreditCardCalculator() {
  // Basic card information
  const [cardName, setCardName] = useState("");
  const [spendAmount, setSpendAmount] = useState("");
  const [pointsEarned, setPointsEarned] = useState("");
  const [pointValue, setPointValue] = useState("");

  // Example spend calculation
  const [exampleSpend, setExampleSpend] = useState("");

  // Airmiles feature
  const [hasAirmiles, setHasAirmiles] = useState(false);
  const [pointsToAirmiles, setPointsToAirmiles] = useState("");
  const [airmilesValue, setAirmilesValue] = useState("");
  const [exampleSpendAirmiles, setExampleSpendAirmiles] = useState("");

  // Results
  const [basicResult, setBasicResult] = useState(null);
  const [airmilesResult, setAirmilesResult] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const formatNumber = (value) => {
    if (!value) return "";
    const number = parseFloat(value.replace(/,/g, ""));
    return isNaN(number) ? "" : number.toLocaleString("en-IN");
  };

  const calculateBasicRewards = (e) => {
    e.preventDefault();
    const spend = parseFloat(spendAmount);
    const points = parseFloat(pointsEarned);
    const value = parseFloat(pointValue);

    // Calculate reward percentage
    const rewardPercentage = ((points * value) / spend) * 100;

    setBasicResult({
      rewardPercentage,
      pointsPerRupee: points / spend,
      valuePerPoint: value,
    });
  };

  const calculateExampleRewards = () => {
    if (!exampleSpend || !basicResult) return;

    const spend = parseFloat(exampleSpend.replace(/,/g, ""));
    const pointsEarned = spend * basicResult.pointsPerRupee;
    const rewardAmount = pointsEarned * basicResult.valuePerPoint;

    return {
      pointsEarned,
      rewardAmount,
    };
  };

  const calculateAirmilesRewards = (e) => {
    e.preventDefault();
    const spend = parseFloat(spendAmount);
    const points = parseFloat(pointsEarned);
    const airmilesRatio = parseFloat(pointsToAirmiles);
    const airmilesVal = parseFloat(airmilesValue);

    // Calculate airmiles earned from the points (not from spend directly)
    const airmilesEarned = points * airmilesRatio;
    const airmilesRewardValue = airmilesEarned * airmilesVal;
    const airmilesRewardPercentage = (airmilesRewardValue / spend) * 100;

    setAirmilesResult({
      airmilesEarned,
      airmilesRewardValue,
      airmilesRewardPercentage,
      airmilesPerRupee: airmilesEarned / spend,
    });
  };

  const calculateExampleAirmilesRewards = () => {
    if (!exampleSpendAirmiles || !airmilesResult) return;

    const spend = parseFloat(exampleSpendAirmiles.replace(/,/g, ""));
    const airmilesEarned = spend * airmilesResult.airmilesPerRupee;
    const rewardAmount = airmilesEarned * parseFloat(airmilesValue);

    return {
      airmilesEarned,
      rewardAmount,
    };
  };

  const getSummaryData = () => {
    const exampleBasic = calculateExampleRewards();
    const exampleAirmiles = calculateExampleAirmilesRewards();

    return {
      cardName,
      basicRewards: {
        percentage: basicResult?.rewardPercentage || 0,
        exampleAmount: exampleBasic?.rewardAmount || 0,
        examplePoints: exampleBasic?.pointsEarned || 0,
      },
      airmilesRewards:
        hasAirmiles && airmilesResult
          ? {
              percentage: airmilesResult.airmilesRewardPercentage,
              exampleAmount: exampleAirmiles?.rewardAmount || 0,
              exampleAirmiles: exampleAirmiles?.airmilesEarned || 0,
            }
          : null,
    };
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
        <CreditCard
          sx={{
            fontSize: "2.5rem",
            color: "primary.dark",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
          }}
        />
        Credit Card Rewards Calculator
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ mb: 3, textAlign: "center" }}
      >
        Calculate your credit card rewards percentage and compare different
        reward structures
      </Typography>

      {/* Basic Card Information */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Card Information
          </Typography>
          <form onSubmit={calculateBasicRewards}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Card Name"
                  variant="outlined"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="On Spend of (₹)"
                  variant="outlined"
                  value={formatNumber(spendAmount)}
                  onChange={(e) =>
                    setSpendAmount(e.target.value.replace(/\D/g, ""))
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="You Get Points"
                  variant="outlined"
                  type="number"
                  value={pointsEarned}
                  onChange={(e) => setPointsEarned(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="1 Point Equals (₹)"
                  variant="outlined"
                  type="number"
                  step="0.01"
                  value={pointValue}
                  onChange={(e) => setPointValue(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={
                    !cardName || !spendAmount || !pointsEarned || !pointValue
                  }
                >
                  Calculate Rewards Percentage
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Basic Results */}
      {basicResult && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Rewards Percentage
            </Typography>
            <Grid container spacing={2}>
              <ResultItem
                label="Reward Percentage"
                value={`${basicResult.rewardPercentage.toFixed(2)}%`}
                boldLabel={true}
              />
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Example Spend Calculation */}
      {basicResult && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Example Calculation
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Example Spend Amount (₹)"
                  variant="outlined"
                  value={formatNumber(exampleSpend)}
                  onChange={(e) =>
                    setExampleSpend(e.target.value.replace(/\D/g, ""))
                  }
                />
              </Grid>
            </Grid>

            {exampleSpend && calculateExampleRewards() && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <ResultItem
                    label="Points Earned"
                    value={calculateExampleRewards().pointsEarned.toFixed(0)}
                  />
                  <ResultItem
                    label="Reward Amount"
                    value={calculateExampleRewards().rewardAmount}
                    boldLabel={true}
                  />
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Airmiles Feature */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasAirmiles}
                onChange={(e) => setHasAirmiles(e.target.checked)}
              />
            }
            label="Does your card support airmiles transfer?"
          />

          {hasAirmiles && (
            <Box sx={{ mt: 2 }}>
              <form onSubmit={calculateAirmilesRewards}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="1 Point = How Many Air Miles"
                      variant="outlined"
                      type="number"
                      step="0.01"
                      value={pointsToAirmiles}
                      onChange={(e) => setPointsToAirmiles(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="1 Air Mile Equals (₹)"
                      variant="outlined"
                      type="number"
                      step="0.01"
                      value={airmilesValue}
                      onChange={(e) => setAirmilesValue(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      disabled={
                        !pointsToAirmiles || !airmilesValue || !basicResult
                      }
                    >
                      Calculate Airmiles Rewards
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Airmiles Results */}
      {airmilesResult && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="secondary">
              Airmiles Rewards Percentage
            </Typography>
            <Grid container spacing={2}>
              <ResultItem
                label="Airmiles Reward Percentage"
                value={`${airmilesResult.airmilesRewardPercentage.toFixed(2)}%`}
                boldLabel={true}
              />
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Airmiles Example Calculation */}
      {airmilesResult && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="secondary">
              Airmiles Example Calculation
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Example Spend Amount (₹)"
                  variant="outlined"
                  value={formatNumber(exampleSpendAirmiles)}
                  onChange={(e) =>
                    setExampleSpendAirmiles(e.target.value.replace(/\D/g, ""))
                  }
                />
              </Grid>
            </Grid>

            {exampleSpendAirmiles && calculateExampleAirmilesRewards() && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <ResultItem
                    label="Air Miles Earned"
                    value={calculateExampleAirmilesRewards().airmilesEarned.toFixed(
                      2
                    )}
                  />
                  <ResultItem
                    label="Reward Amount"
                    value={calculateExampleAirmilesRewards().rewardAmount}
                    boldLabel={true}
                  />
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary Button */}
      {basicResult && (
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={() => setShowSummary(true)}
          >
            Get Summary
          </Button>
        </Box>
      )}

      {/* Summary Table */}
      {showSummary && basicResult && (
        <Card variant="outlined">
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              color="success.main"
              sx={{ textAlign: "center" }}
            >
              Credit Card Rewards Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.light" }}>
                    <TableCell>
                      <strong>Metric</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Basic Rewards</strong>
                    </TableCell>
                    {hasAirmiles && airmilesResult && (
                      <TableCell>
                        <strong>Airmiles Rewards</strong>
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Card Name</strong>
                    </TableCell>
                    <TableCell colSpan={hasAirmiles && airmilesResult ? 2 : 1}>
                      {cardName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Reward Percentage</TableCell>
                    <TableCell>
                      {basicResult.rewardPercentage.toFixed(2)}%
                    </TableCell>
                    {hasAirmiles && airmilesResult && (
                      <TableCell>
                        {airmilesResult.airmilesRewardPercentage.toFixed(2)}%
                      </TableCell>
                    )}
                  </TableRow>
                  {exampleSpend && (
                    <>
                      <TableRow sx={{ bgcolor: "grey.50" }}>
                        <TableCell>
                          <strong>
                            Example: ₹{formatNumber(exampleSpend)} Spend
                          </strong>
                        </TableCell>
                        <TableCell>
                          <strong>Basic Rewards</strong>
                        </TableCell>
                        {hasAirmiles && airmilesResult && (
                          <TableCell>
                            <strong>Airmiles Rewards</strong>
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow>
                        <TableCell>Points/Miles Earned</TableCell>
                        <TableCell>
                          {calculateExampleRewards()?.pointsEarned.toFixed(0)}{" "}
                          points
                        </TableCell>
                        {hasAirmiles &&
                          airmilesResult &&
                          exampleSpendAirmiles && (
                            <TableCell>
                              {calculateExampleAirmilesRewards()?.airmilesEarned.toFixed(
                                2
                              )}{" "}
                              miles
                            </TableCell>
                          )}
                      </TableRow>
                      <TableRow>
                        <TableCell>Reward Value</TableCell>
                        <TableCell>
                          ₹
                          {calculateExampleRewards()?.rewardAmount.toLocaleString(
                            "en-IN",
                            { maximumFractionDigits: 2 }
                          )}
                        </TableCell>
                        {hasAirmiles &&
                          airmilesResult &&
                          exampleSpendAirmiles && (
                            <TableCell>
                              ₹
                              {calculateExampleAirmilesRewards()?.rewardAmount.toLocaleString(
                                "en-IN",
                                { maximumFractionDigits: 2 }
                              )}
                            </TableCell>
                          )}
                      </TableRow>
                    </>
                  )}
                  <TableRow sx={{ bgcolor: "success.light" }}>
                    <TableCell>
                      <strong>Best Option</strong>
                    </TableCell>
                    <TableCell colSpan={hasAirmiles && airmilesResult ? 2 : 1}>
                      <strong>
                        {!hasAirmiles || !airmilesResult
                          ? "Basic Rewards"
                          : basicResult.rewardPercentage >=
                            airmilesResult.airmilesRewardPercentage
                          ? "Basic Rewards"
                          : "Airmiles Rewards"}
                        (
                        {!hasAirmiles || !airmilesResult
                          ? basicResult.rewardPercentage.toFixed(2)
                          : Math.max(
                              basicResult.rewardPercentage,
                              airmilesResult.airmilesRewardPercentage
                            ).toFixed(2)}
                        %)
                      </strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default CreditCardCalculator;
