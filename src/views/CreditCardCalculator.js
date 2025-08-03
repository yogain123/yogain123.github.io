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
  Chip,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
} from "@mui/material";
import CreditCard from "@mui/icons-material/CreditCard";
import StarBorder from "@mui/icons-material/StarBorder";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import Compare from "@mui/icons-material/Compare";
import ResultItem from "../components/ResultItem";

function CreditCardCalculator() {
  // Tabs and multiple cards state
  const [activeTab, setActiveTab] = useState(0);
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Card 1",
      cardName: "",
      spendAmount: "",
      pointsEarned: "",
      pointValue: "",
      exampleSpend: "",
      hasAirmiles: false,
      pointsToAirmiles: "",
      airmilesValue: "",
      exampleSpendAirmiles: "",
      basicResult: null,
      airmilesResult: null,
      showSummary: false,
    },
  ]);

  // Favorites functionality
  const [favorites, setFavorites] = useState([]);

  // Comparison functionality
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [selectedCardsForComparison, setSelectedCardsForComparison] = useState(
    []
  );
  const [showComparisonResults, setShowComparisonResults] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("creditCardFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("creditCardFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Get current active card
  const getCurrentCard = () => cards[activeTab];

  // Update current card data
  const updateCurrentCard = (updates) => {
    setCards((prevCards) =>
      prevCards.map((card, index) =>
        index === activeTab ? { ...card, ...updates } : card
      )
    );
  };

  // Add new card
  const addNewCard = () => {
    const newCard = {
      id: Date.now(),
      name: `Card ${cards.length + 1}`,
      cardName: "",
      spendAmount: "",
      pointsEarned: "",
      pointValue: "",
      exampleSpend: "",
      hasAirmiles: false,
      pointsToAirmiles: "",
      airmilesValue: "",
      exampleSpendAirmiles: "",
      basicResult: null,
      airmilesResult: null,
      showSummary: false,
    };
    setCards((prevCards) => [...prevCards, newCard]);
    setActiveTab(cards.length);
  };

  // Remove card
  const removeCard = (index) => {
    if (cards.length === 1) return; // Don't allow removing the last card

    setCards((prevCards) => prevCards.filter((_, i) => i !== index));

    // Adjust active tab if necessary
    if (activeTab >= index && activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const formatNumber = (value) => {
    if (!value) return "";
    const number = parseFloat(value.replace(/,/g, ""));
    return isNaN(number) ? "" : number.toLocaleString("en-IN");
  };

  const calculateBasicRewards = (e) => {
    e.preventDefault();
    const currentCard = getCurrentCard();
    const spend = parseFloat(currentCard.spendAmount);
    const points = parseFloat(currentCard.pointsEarned);
    const value = parseFloat(currentCard.pointValue);

    // Calculate reward percentage
    const rewardPercentage = ((points * value) / spend) * 100;

    const basicResult = {
      rewardPercentage,
      pointsPerRupee: points / spend,
      valuePerPoint: value,
    };

    updateCurrentCard({ basicResult });
  };

  const calculateExampleRewards = () => {
    const currentCard = getCurrentCard();
    if (!currentCard.exampleSpend || !currentCard.basicResult) return;

    const spend = parseFloat(currentCard.exampleSpend.replace(/,/g, ""));
    const pointsEarned = spend * currentCard.basicResult.pointsPerRupee;
    const rewardAmount = pointsEarned * currentCard.basicResult.valuePerPoint;

    return {
      pointsEarned,
      rewardAmount,
    };
  };

  const calculateAirmilesRewards = (e) => {
    e.preventDefault();
    const currentCard = getCurrentCard();
    const spend = parseFloat(currentCard.spendAmount);
    const points = parseFloat(currentCard.pointsEarned);
    const airmilesRatio = parseFloat(currentCard.pointsToAirmiles);
    const airmilesVal = parseFloat(currentCard.airmilesValue);

    // Calculate airmiles earned from the points (not from spend directly)
    const airmilesEarned = points * airmilesRatio;
    const airmilesRewardValue = airmilesEarned * airmilesVal;
    const airmilesRewardPercentage = (airmilesRewardValue / spend) * 100;

    const airmilesResult = {
      airmilesEarned,
      airmilesRewardValue,
      airmilesRewardPercentage,
      airmilesPerRupee: airmilesEarned / spend,
    };

    updateCurrentCard({ airmilesResult });
  };

  const calculateExampleAirmilesRewards = () => {
    const currentCard = getCurrentCard();
    if (!currentCard.exampleSpendAirmiles || !currentCard.airmilesResult)
      return;

    const spend = parseFloat(
      currentCard.exampleSpendAirmiles.replace(/,/g, "")
    );
    const airmilesEarned = spend * currentCard.airmilesResult.airmilesPerRupee;
    const rewardAmount = airmilesEarned * parseFloat(currentCard.airmilesValue);

    return {
      airmilesEarned,
      rewardAmount,
    };
  };

  const getSummaryData = () => {
    const currentCard = getCurrentCard();
    const exampleBasic = calculateExampleRewards();
    const exampleAirmiles = calculateExampleAirmilesRewards();

    return {
      cardName: currentCard.cardName,
      basicRewards: {
        percentage: currentCard.basicResult?.rewardPercentage || 0,
        exampleAmount: exampleBasic?.rewardAmount || 0,
        examplePoints: exampleBasic?.pointsEarned || 0,
      },
      airmilesRewards:
        currentCard.hasAirmiles && currentCard.airmilesResult
          ? {
              percentage: currentCard.airmilesResult.airmilesRewardPercentage,
              exampleAmount: exampleAirmiles?.rewardAmount || 0,
              exampleAirmiles: exampleAirmiles?.airmilesEarned || 0,
            }
          : null,
    };
  };

  const saveAsFavorite = () => {
    const currentCard = getCurrentCard();
    const favoriteName = window.prompt("Enter a name for this credit card:");
    if (!favoriteName) return;

    const newFavorite = {
      id: Date.now(),
      name: favoriteName || `Unnamed Card ${favorites.length + 1}`,
      values: { ...currentCard },
    };
    setFavorites([...favorites, newFavorite]);
  };

  const loadFavorite = (fav) => {
    updateCurrentCard({ ...fav.values });
  };

  const deleteFavorite = (id) => {
    if (window.confirm("Are you sure you want to delete this favorite?")) {
      setFavorites(favorites.filter((fav) => fav.id !== id));
    }
  };

  // Comparison functions
  const handleCompareClick = () => {
    // Filter cards that have basic results (have been calculated)
    const cardsWithResults = cards.filter((card) => card.basicResult);
    if (cardsWithResults.length < 2) {
      alert("Please calculate at least 2 cards before comparing.");
      return;
    }
    setShowCompareDialog(true);
  };

  const handleCompareDialogClose = () => {
    setShowCompareDialog(false);
    setSelectedCardsForComparison([]);
    setShowComparisonResults(false);
  };

  const handleCardSelectionChange = (cardId, isSelected) => {
    if (isSelected) {
      setSelectedCardsForComparison((prev) => [...prev, cardId]);
    } else {
      setSelectedCardsForComparison((prev) =>
        prev.filter((id) => id !== cardId)
      );
    }
  };

  const handleStartComparison = () => {
    if (selectedCardsForComparison.length < 2) {
      alert("Please select at least 2 cards to compare.");
      return;
    }
    setShowComparisonResults(true);
  };

  const handleBackToSelection = () => {
    setShowComparisonResults(false);
  };

  const getSelectedCards = () => {
    return cards.filter((card) => selectedCardsForComparison.includes(card.id));
  };

  const currentCard = getCurrentCard();

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

      {/* Tabs for multiple cards */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent sx={{ pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" color="primary">
              Credit Cards
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Compare />}
                onClick={handleCompareClick}
                sx={{ minWidth: "auto" }}
              >
                Compare
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<Add />}
                onClick={addNewCard}
                sx={{ minWidth: "auto" }}
              >
                Add Card
              </Button>
            </Box>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {cards.map((card, index) => (
                <Tab
                  key={card.id}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {card.cardName || card.name}
                      {cards.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCard(index);
                          }}
                          sx={{ ml: 1, p: 0.5 }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>
        </CardContent>
      </Card>

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
                  value={currentCard.cardName}
                  onChange={(e) =>
                    updateCurrentCard({ cardName: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="On Spend of (₹)"
                  variant="outlined"
                  value={formatNumber(currentCard.spendAmount)}
                  onChange={(e) =>
                    updateCurrentCard({
                      spendAmount: e.target.value.replace(/\D/g, ""),
                    })
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
                  value={currentCard.pointsEarned}
                  onChange={(e) =>
                    updateCurrentCard({ pointsEarned: e.target.value })
                  }
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
                  value={currentCard.pointValue}
                  onChange={(e) =>
                    updateCurrentCard({ pointValue: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={
                    !currentCard.cardName ||
                    !currentCard.spendAmount ||
                    !currentCard.pointsEarned ||
                    !currentCard.pointValue
                  }
                >
                  Calculate Rewards Percentage
                </Button>
              </Grid>

              {favorites.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Saved Favorites
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {favorites.map((fav) => (
                      <Chip
                        key={fav.id}
                        label={fav.name}
                        onClick={() => loadFavorite(fav)}
                        onDelete={() => deleteFavorite(fav.id)}
                        color="primary"
                        variant="outlined"
                        sx={{ cursor: "pointer" }}
                      />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Basic Results */}
      {currentCard.basicResult && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Rewards Percentage
            </Typography>
            <Grid container spacing={2}>
              <ResultItem
                label="Reward Percentage"
                value={`${currentCard.basicResult.rewardPercentage.toFixed(
                  2
                )}%`}
                boldLabel={true}
              />
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Example Spend Calculation */}
      {currentCard.basicResult && (
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
                  value={formatNumber(currentCard.exampleSpend)}
                  onChange={(e) =>
                    updateCurrentCard({
                      exampleSpend: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />
              </Grid>
            </Grid>

            {currentCard.exampleSpend && calculateExampleRewards() && (
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
                checked={currentCard.hasAirmiles}
                onChange={(e) => {
                  const hasAirmiles = e.target.checked;
                  if (!hasAirmiles) {
                    // Clear airmiles data when unchecked
                    updateCurrentCard({
                      hasAirmiles,
                      airmilesResult: null,
                      pointsToAirmiles: "",
                      airmilesValue: "",
                      exampleSpendAirmiles: "",
                    });
                  } else {
                    updateCurrentCard({ hasAirmiles });
                  }
                }}
              />
            }
            label="Does your card support airmiles transfer?"
          />

          {currentCard.hasAirmiles && (
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
                      value={currentCard.pointsToAirmiles}
                      onChange={(e) =>
                        updateCurrentCard({ pointsToAirmiles: e.target.value })
                      }
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
                      value={currentCard.airmilesValue}
                      onChange={(e) =>
                        updateCurrentCard({ airmilesValue: e.target.value })
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      disabled={
                        !currentCard.pointsToAirmiles ||
                        !currentCard.airmilesValue ||
                        !currentCard.basicResult
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
      {currentCard.hasAirmiles && currentCard.airmilesResult && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="secondary">
              Airmiles Rewards Percentage
            </Typography>
            <Grid container spacing={2}>
              <ResultItem
                label="Airmiles Reward Percentage"
                value={`${currentCard.airmilesResult.airmilesRewardPercentage.toFixed(
                  2
                )}%`}
                boldLabel={true}
              />
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Airmiles Example Calculation */}
      {currentCard.hasAirmiles && currentCard.airmilesResult && (
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
                  value={formatNumber(currentCard.exampleSpendAirmiles)}
                  onChange={(e) =>
                    updateCurrentCard({
                      exampleSpendAirmiles: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />
              </Grid>
            </Grid>

            {currentCard.exampleSpendAirmiles &&
              calculateExampleAirmilesRewards() && (
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

      {/* Summary and Save Buttons */}
      {currentCard.basicResult && (
        <Box
          sx={{
            textAlign: "center",
            mb: 3,
            display: "flex",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={() => updateCurrentCard({ showSummary: true })}
          >
            Get Summary
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={saveAsFavorite}
            startIcon={<StarBorder />}
          >
            Save Favorite
          </Button>
        </Box>
      )}

      {/* Summary Table */}
      {currentCard.showSummary && currentCard.basicResult && (
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
                    {currentCard.hasAirmiles && currentCard.airmilesResult && (
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
                    <TableCell
                      colSpan={
                        currentCard.hasAirmiles && currentCard.airmilesResult
                          ? 2
                          : 1
                      }
                    >
                      {currentCard.cardName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Reward Percentage</TableCell>
                    <TableCell>
                      {currentCard.basicResult.rewardPercentage.toFixed(2)}%
                    </TableCell>
                    {currentCard.hasAirmiles && currentCard.airmilesResult && (
                      <TableCell>
                        {currentCard.airmilesResult.airmilesRewardPercentage.toFixed(
                          2
                        )}
                        %
                      </TableCell>
                    )}
                  </TableRow>
                  {currentCard.exampleSpend && (
                    <>
                      <TableRow sx={{ bgcolor: "grey.50" }}>
                        <TableCell>
                          <strong>
                            Example: ₹{formatNumber(currentCard.exampleSpend)}{" "}
                            Spend
                          </strong>
                        </TableCell>
                        <TableCell>
                          <strong>Basic Rewards</strong>
                        </TableCell>
                        {currentCard.hasAirmiles &&
                          currentCard.airmilesResult && (
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
                        {currentCard.hasAirmiles &&
                          currentCard.airmilesResult &&
                          currentCard.exampleSpendAirmiles && (
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
                        {currentCard.hasAirmiles &&
                          currentCard.airmilesResult &&
                          currentCard.exampleSpendAirmiles && (
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
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Comparison Dialog */}
      <Dialog
        open={showCompareDialog}
        onClose={handleCompareDialogClose}
        maxWidth={showComparisonResults ? "lg" : "sm"}
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h6"
              color="primary"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Compare />
              {showComparisonResults
                ? "Credit Cards Comparison Results"
                : "Select Cards to Compare"}
            </Typography>
            {showComparisonResults && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleBackToSelection}
              >
                Back to Selection
              </Button>
            )}
          </Box>
        </DialogTitle>

        <DialogContent>
          {!showComparisonResults ? (
            // Card Selection View
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Choose the credit cards you want to compare. Only cards with
                calculated results are shown.
              </Typography>
              <FormGroup>
                {cards
                  .filter((card) => card.basicResult)
                  .map((card) => (
                    <FormControlLabel
                      key={card.id}
                      control={
                        <Checkbox
                          checked={selectedCardsForComparison.includes(card.id)}
                          onChange={(e) =>
                            handleCardSelectionChange(card.id, e.target.checked)
                          }
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {card.cardName || card.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {card.basicResult.rewardPercentage.toFixed(2)}%
                            reward rate
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
              </FormGroup>
            </>
          ) : (
            // Comparison Results View
            <>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 3 }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "primary.light" }}>
                      <TableCell>
                        <strong>Metric</strong>
                      </TableCell>
                      {getSelectedCards().map((card) => (
                        <TableCell key={card.id} align="center">
                          <strong>{card.cardName || card.name}</strong>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Basic Reward Percentage */}
                    <TableRow>
                      <TableCell>
                        <strong>Basic Reward Rate</strong>
                      </TableCell>
                      {getSelectedCards().map((card) => (
                        <TableCell key={card.id} align="center">
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color={
                              Math.max(
                                ...getSelectedCards().map(
                                  (c) => c.basicResult.rewardPercentage
                                )
                              ) === card.basicResult.rewardPercentage
                                ? "success.main"
                                : "text.primary"
                            }
                          >
                            {card.basicResult.rewardPercentage.toFixed(2)}%
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Airmiles Reward Percentage */}
                    {getSelectedCards().some(
                      (card) => card.hasAirmiles && card.airmilesResult
                    ) && (
                      <TableRow>
                        <TableCell>
                          <strong>Airmiles Reward Rate</strong>
                        </TableCell>
                        {getSelectedCards().map((card) => (
                          <TableCell key={card.id} align="center">
                            {card.hasAirmiles && card.airmilesResult ? (
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color={
                                  Math.max(
                                    ...getSelectedCards()
                                      .filter(
                                        (c) => c.hasAirmiles && c.airmilesResult
                                      )
                                      .map(
                                        (c) =>
                                          c.airmilesResult
                                            .airmilesRewardPercentage
                                      )
                                  ) ===
                                  card.airmilesResult.airmilesRewardPercentage
                                    ? "success.main"
                                    : "text.primary"
                                }
                              >
                                {card.airmilesResult.airmilesRewardPercentage.toFixed(
                                  2
                                )}
                                %
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                N/A
                              </Typography>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    )}

                    {/* Example Calculation Row */}
                    <TableRow sx={{ bgcolor: "info.light" }}>
                      <TableCell colSpan={getSelectedCards().length + 1}>
                        <Typography
                          variant="subtitle1"
                          color="info.dark"
                          sx={{ textAlign: "center", fontWeight: "bold" }}
                        >
                          Example: ₹1,00,000 Annual Spend
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* Points Earned */}
                    <TableRow>
                      <TableCell>
                        <strong>Points Earned</strong>
                      </TableCell>
                      {getSelectedCards().map((card) => {
                        const pointsPerRupee = card.basicResult.pointsPerRupee;
                        const pointsEarned = 100000 * pointsPerRupee;
                        return (
                          <TableCell key={card.id} align="center">
                            <Typography variant="body2">
                              {pointsEarned.toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                              })}
                            </Typography>
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* Basic Reward Amount */}
                    <TableRow>
                      <TableCell>
                        <strong>Basic Reward Amount</strong>
                      </TableCell>
                      {getSelectedCards().map((card) => {
                        const pointsPerRupee = card.basicResult.pointsPerRupee;
                        const valuePerPoint = card.basicResult.valuePerPoint;
                        const rewardAmount =
                          100000 * pointsPerRupee * valuePerPoint;
                        return (
                          <TableCell key={card.id} align="center">
                            <Typography
                              variant="body2"
                              color={
                                Math.max(
                                  ...getSelectedCards().map((c) => {
                                    const ppr = c.basicResult.pointsPerRupee;
                                    const vpp = c.basicResult.valuePerPoint;
                                    return 100000 * ppr * vpp;
                                  })
                                ) === rewardAmount
                                  ? "success.main"
                                  : "text.primary"
                              }
                            >
                              ₹
                              {rewardAmount.toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                              })}
                            </Typography>
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* Airmiles Reward Amount */}
                    {getSelectedCards().some(
                      (card) => card.hasAirmiles && card.airmilesResult
                    ) && (
                      <TableRow>
                        <TableCell>
                          <strong>Airmiles Reward Amount</strong>
                        </TableCell>
                        {getSelectedCards().map((card) => (
                          <TableCell key={card.id} align="center">
                            {card.hasAirmiles && card.airmilesResult ? (
                              (() => {
                                const airmilesPerRupee =
                                  card.airmilesResult.airmilesPerRupee;
                                const airmilesValue = parseFloat(
                                  card.airmilesValue
                                );
                                const rewardAmount =
                                  100000 * airmilesPerRupee * airmilesValue;
                                return (
                                  <Typography
                                    variant="body2"
                                    color={
                                      Math.max(
                                        ...getSelectedCards()
                                          .filter(
                                            (c) =>
                                              c.hasAirmiles && c.airmilesResult
                                          )
                                          .map((c) => {
                                            const apr =
                                              c.airmilesResult.airmilesPerRupee;
                                            const av = parseFloat(
                                              c.airmilesValue
                                            );
                                            return 100000 * apr * av;
                                          })
                                      ) === rewardAmount
                                        ? "success.main"
                                        : "text.primary"
                                    }
                                  >
                                    ₹
                                    {rewardAmount.toLocaleString("en-IN", {
                                      maximumFractionDigits: 0,
                                    })}
                                  </Typography>
                                );
                              })()
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                N/A
                              </Typography>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Winner Section */}
              <Box sx={{ p: 2, bgcolor: "success.light", borderRadius: 1 }}>
                <Typography variant="h6" color="success.dark" gutterBottom>
                  🏆 Best Card for ₹1,00,000 Annual Spend
                </Typography>
                {(() => {
                  const bestCard = getSelectedCards().reduce(
                    (best, current) => {
                      const currentBasicRate =
                        current.basicResult.rewardPercentage;
                      const currentAirmilesRate =
                        current.hasAirmiles && current.airmilesResult
                          ? current.airmilesResult.airmilesRewardPercentage
                          : 0;
                      const currentBestRate = Math.max(
                        currentBasicRate,
                        currentAirmilesRate
                      );

                      const bestBasicRate = best.basicResult.rewardPercentage;
                      const bestAirmilesRate =
                        best.hasAirmiles && best.airmilesResult
                          ? best.airmilesResult.airmilesRewardPercentage
                          : 0;
                      const bestRate = Math.max(
                        bestBasicRate,
                        bestAirmilesRate
                      );

                      return currentBestRate > bestRate ? current : best;
                    }
                  );

                  const bestBasicRate = bestCard.basicResult.rewardPercentage;
                  const bestAirmilesRate =
                    bestCard.hasAirmiles && bestCard.airmilesResult
                      ? bestCard.airmilesResult.airmilesRewardPercentage
                      : 0;
                  const overallBestRate = Math.max(
                    bestBasicRate,
                    bestAirmilesRate
                  );
                  const rewardType =
                    bestBasicRate >= bestAirmilesRate
                      ? "Basic Rewards"
                      : "Airmiles";

                  return (
                    <Typography variant="body1" color="success.dark">
                      <strong>{bestCard.cardName || bestCard.name}</strong> with{" "}
                      {overallBestRate.toFixed(2)}% reward rate using{" "}
                      {rewardType}
                    </Typography>
                  );
                })()}
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCompareDialogClose}>
            {showComparisonResults ? "Close" : "Cancel"}
          </Button>
          {!showComparisonResults && (
            <Button
              onClick={handleStartComparison}
              variant="contained"
              disabled={selectedCardsForComparison.length < 2}
            >
              Compare Selected ({selectedCardsForComparison.length})
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CreditCardCalculator;
