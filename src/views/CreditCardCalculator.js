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
  Paper,
  Divider,
  Alert,
  AlertTitle,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  IconButton,
  FormGroup,
} from "@mui/material";
import CreditCard from "@mui/icons-material/CreditCard";
import Calculate from "@mui/icons-material/Calculate";
import TrendingUp from "@mui/icons-material/TrendingUp";
import StarBorder from "@mui/icons-material/StarBorder";
import Compare from "@mui/icons-material/Compare";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";

function CreditCardCalculator() {
  // Multiple cards state
  const [activeTab, setActiveTab] = useState(0);
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Card 1",
      cardName: "",
      spendAmount: "",
      pointsEarned: "",
      pointValue: "",
      exampleSpend: "100000",
      hasAirmiles: false,
      pointsToAirmiles: "",
      airmilesValue: "",
      basicResult: null,
      airmilesResult: null,
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

  // Utility functions
  const formatNumber = (value) => {
    if (!value) return "";
    const number = parseFloat(value.replace(/,/g, ""));
    return isNaN(number) ? "" : number.toLocaleString("en-IN");
  };

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
      exampleSpend: "100000",
      hasAirmiles: false,
      pointsToAirmiles: "",
      airmilesValue: "",
      basicResult: null,
      airmilesResult: null,
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

  const calculateBasicRewards = (e) => {
    e.preventDefault();
    const currentCard = getCurrentCard();
    const spend = parseFloat(currentCard.spendAmount);
    const points = parseFloat(currentCard.pointsEarned);
    const value = parseFloat(currentCard.pointValue);

    if (!spend || !points || !value) return;

    // Calculate reward percentage
    const rewardPercentage = ((points * value) / spend) * 100;

    const basicResult = {
      rewardPercentage,
      pointsPerRupee: points / spend,
      valuePerPoint: value,
    };

    let airmilesResult = null;

    // Auto-calculate airmiles if enabled and values are provided
    if (
      currentCard.hasAirmiles &&
      currentCard.pointsToAirmiles &&
      currentCard.airmilesValue
    ) {
      const airmilesRatio = parseFloat(currentCard.pointsToAirmiles);
      const airmilesVal = parseFloat(currentCard.airmilesValue);

      if (airmilesRatio && airmilesVal) {
        // Calculate airmiles earned from the points
        const airmilesEarned = points * airmilesRatio;
        const airmilesRewardValue = airmilesEarned * airmilesVal;
        const airmilesRewardPercentage = (airmilesRewardValue / spend) * 100;

        airmilesResult = {
          airmilesEarned,
          airmilesRewardValue,
          airmilesRewardPercentage,
          airmilesPerRupee: airmilesEarned / spend,
        };
      }
    }

    updateCurrentCard({ basicResult, airmilesResult });
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

  const calculateExampleAirmilesRewards = () => {
    const currentCard = getCurrentCard();
    if (!currentCard.exampleSpend || !currentCard.airmilesResult) return;

    const spend = parseFloat(currentCard.exampleSpend.replace(/,/g, ""));
    const airmilesEarned = spend * currentCard.airmilesResult.airmilesPerRupee;
    const rewardAmount = airmilesEarned * parseFloat(currentCard.airmilesValue);

    return {
      airmilesEarned,
      rewardAmount,
    };
  };

  const resetCurrentCard = () => {
    updateCurrentCard({
      cardName: "",
      spendAmount: "",
      pointsEarned: "",
      pointValue: "",
      exampleSpend: "100000",
      hasAirmiles: false,
      pointsToAirmiles: "",
      airmilesValue: "",
      basicResult: null,
      airmilesResult: null,
    });
  };

  const saveAsFavorite = () => {
    const currentCard = getCurrentCard();
    const favoriteName = window.prompt("Enter a name for this credit card:");
    if (!favoriteName) return;

    const newFavorite = {
      id: Date.now(),
      name: favoriteName,
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
  const isFormValid =
    currentCard.cardName &&
    currentCard.spendAmount &&
    currentCard.pointsEarned &&
    currentCard.pointValue;
  const hasResults = currentCard.basicResult !== null;

  return (
    <Container component="main" sx={{ flex: 1, py: 4, maxWidth: "md" }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "primary.main",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <CreditCard sx={{ fontSize: "2.5rem" }} />
          Credit Card Rewards Calculator
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Enter your card details to calculate reward percentages and see how
          much you can earn
        </Typography>
      </Box>

      {/* Instructions */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>How to use this calculator</AlertTitle>
        Fill in your card's reward structure below. For example: If you spend
        ₹100 and get 2 points, and each point is worth ₹0.25, your reward rate
        is 0.5%.
      </Alert>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Quick Load Favorites
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
          </CardContent>
        </Card>
      )}

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

      {/* Main Input Form */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            color="primary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <CreditCard />
            Card Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Name (e.g., HDFC Regalia)"
                variant="outlined"
                value={currentCard.cardName}
                onChange={(e) =>
                  updateCurrentCard({ cardName: e.target.value })
                }
                placeholder="Enter your credit card name"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Spend Amount (₹)"
                variant="outlined"
                value={formatNumber(currentCard.spendAmount)}
                onChange={(e) =>
                  updateCurrentCard({
                    spendAmount: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="e.g., 100"
                helperText="Amount you need to spend"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Points Earned"
                variant="outlined"
                type="number"
                value={currentCard.pointsEarned}
                onChange={(e) =>
                  updateCurrentCard({ pointsEarned: e.target.value })
                }
                placeholder="e.g., 2"
                helperText="Points earned for the above spend"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Point Value (₹)"
                variant="outlined"
                type="number"
                step="0.01"
                value={currentCard.pointValue}
                onChange={(e) =>
                  updateCurrentCard({ pointValue: e.target.value })
                }
                placeholder="e.g., 0.25"
                helperText="Value of 1 point in rupees"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Example Spend (₹)"
                variant="outlined"
                value={formatNumber(currentCard.exampleSpend)}
                onChange={(e) =>
                  updateCurrentCard({
                    exampleSpend: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="100000"
                helperText="Amount for example calculation"
              />
            </Grid>
          </Grid>

          {/* Airmiles Section */}
          <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentCard.hasAirmiles}
                  onChange={(e) => {
                    const hasAirmiles = e.target.checked;
                    if (!hasAirmiles) {
                      updateCurrentCard({
                        hasAirmiles: false,
                        pointsToAirmiles: "",
                        airmilesValue: "",
                      });
                    } else {
                      updateCurrentCard({ hasAirmiles: true });
                    }
                  }}
                />
              }
              label={
                <Typography variant="body1" fontWeight="medium">
                  My card supports airmiles transfer
                </Typography>
              }
            />

            {currentCard.hasAirmiles && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Points to Airmiles Ratio"
                    variant="outlined"
                    type="number"
                    step="0.01"
                    value={currentCard.pointsToAirmiles}
                    onChange={(e) =>
                      updateCurrentCard({ pointsToAirmiles: e.target.value })
                    }
                    placeholder="e.g., 1"
                    helperText="How many airmiles per point"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Airmile Value (₹)"
                    variant="outlined"
                    type="number"
                    step="0.01"
                    value={currentCard.airmilesValue}
                    onChange={(e) =>
                      updateCurrentCard({ airmilesValue: e.target.value })
                    }
                    placeholder="e.g., 0.50"
                    helperText="Value of 1 airmile in rupees"
                  />
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 3,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Calculate />}
              onClick={calculateBasicRewards}
              disabled={!isFormValid}
            >
              Calculate Rewards
            </Button>
            {hasResults && (
              <Button
                variant="outlined"
                size="large"
                startIcon={<StarBorder />}
                onClick={saveAsFavorite}
                color="secondary"
              >
                Save as Favorite
              </Button>
            )}
            <Button variant="outlined" size="large" onClick={resetCurrentCard}>
              Reset
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Results Section */}
      {hasResults && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              color="primary"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <TrendingUp />
              Your Rewards Summary
            </Typography>

            <Grid container spacing={3}>
              {/* Basic Rewards */}
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{ p: 3, textAlign: "center", bgcolor: "success.light" }}
                >
                  <Typography
                    variant="h4"
                    color="success.dark"
                    fontWeight="bold"
                  >
                    {currentCard.basicResult.rewardPercentage.toFixed(2)}%
                  </Typography>
                  <Typography variant="body1" color="success.dark">
                    Basic Reward Rate
                  </Typography>
                </Paper>
              </Grid>

              {/* Airmiles Rewards */}
              {currentCard.hasAirmiles && currentCard.airmilesResult && (
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{ p: 3, textAlign: "center", bgcolor: "info.light" }}
                  >
                    <Typography
                      variant="h4"
                      color="info.dark"
                      fontWeight="bold"
                    >
                      {currentCard.airmilesResult.airmilesRewardPercentage.toFixed(
                        2
                      )}
                      %
                    </Typography>
                    <Typography variant="body1" color="info.dark">
                      Airmiles Reward Rate
                    </Typography>
                  </Paper>
                </Grid>
              )}

              {/* Example Calculation */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Example: On ₹{formatNumber(currentCard.exampleSpend)} spend
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Basic Rewards
                      </Typography>
                      <Typography
                        variant="h6"
                        color="success.main"
                        fontWeight="bold"
                      >
                        ₹
                        {calculateExampleRewards()?.rewardAmount?.toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          }
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                  {currentCard.hasAirmiles &&
                    currentCard.airmilesResult &&
                    calculateExampleAirmilesRewards() && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Airmiles Rewards
                          </Typography>
                          <Typography
                            variant="h6"
                            color="info.main"
                            fontWeight="bold"
                          >
                            ₹
                            {calculateExampleAirmilesRewards()?.rewardAmount?.toLocaleString(
                              "en-IN",
                              { maximumFractionDigits: 0 }
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                </Grid>
              </Grid>

              {/* Best Option */}
              {currentCard.hasAirmiles && currentCard.airmilesResult && (
                <Grid item xs={12}>
                  <Alert
                    severity={
                      currentCard.airmilesResult.airmilesRewardPercentage >
                      currentCard.basicResult.rewardPercentage
                        ? "info"
                        : "success"
                    }
                    sx={{ mt: 2 }}
                  >
                    <AlertTitle>Best Option</AlertTitle>
                    {currentCard.airmilesResult.airmilesRewardPercentage >
                    currentCard.basicResult.rewardPercentage
                      ? `Use airmiles transfer for ${currentCard.airmilesResult.airmilesRewardPercentage.toFixed(
                          2
                        )}% rewards`
                      : `Stick with basic rewards for ${currentCard.basicResult.rewardPercentage.toFixed(
                          2
                        )}% rewards`}
                  </Alert>
                </Grid>
              )}
            </Grid>
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
