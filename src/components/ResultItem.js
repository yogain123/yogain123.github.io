import React from "react";
import { Grid, Typography, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const ResultItem = ({ label, value, title, boldLabel = false }) => (
  <>
    <Grid item xs={6}>
      <Tooltip title={title || ""} arrow placement="bottom">
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: boldLabel ? "bold" : "normal" }}
          >
            {label}:
          </Typography>
          {title && <InfoIcon color="action" fontSize="small" />}
        </span>
      </Tooltip>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        {isNaN(value)
          ? value
          : `₹${(value || 0).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}`}
      </Typography>
    </Grid>
  </>
);

export default ResultItem;
