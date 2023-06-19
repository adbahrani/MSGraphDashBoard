import React, { Component } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import DashboardBoxes from "./DashboardBoxes";

export default function DashBoard() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary
  }));

  return (
    <center>
      <h1>DashBoard</h1>
      <Grid container spacing={2}>
        <Grid xs={6} md={8}>
          <DashboardBoxes title={"Users"} count={100} />
        </Grid>
        <Grid xs={6} md={4}>
          <DashboardBoxes title={"Users"} count={100} />
        </Grid>
        <Grid xs={6} md={4}>
          <DashboardBoxes title={"Users"} count={100} />
        </Grid>
        <Grid xs={6} md={8}>
          <DashboardBoxes title={"Users"} count={100} />
        </Grid>
      </Grid>
    </center>
  );
}
