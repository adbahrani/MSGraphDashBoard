import { Box, Paper } from "@mui/material";
import React from "react";

export default function DashboardBoxes(props: any) {
  const { title, count } = props;
  return (
    <Box>
      <Paper variant="outlined" sx={{ backgroundColor: "whitesmoke" }}>
        <p>{title}</p>
        <p style={{ fontSize: "large", fontWeight: "bold" }}>{count}</p>
      </Paper>
    </Box>
  );
}
