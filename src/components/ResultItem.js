import React from "react";
import { Grid, Typography, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const ResultItem = ({ label, value, title }) => (
  <>
    <Grid item xs={6}>
      <Tooltip title={title || ""} arrow placement="bottom">
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Typography variant="body2">{label}:</Typography>
          {title && <InfoIcon color="action" fontSize="small" />}
        </span>
      </Tooltip>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        ₹{(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
      </Typography>
    </Grid>
  </>
);

export default ResultItem;
