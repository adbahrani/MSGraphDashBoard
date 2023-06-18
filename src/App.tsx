import React, { useState } from "react";

import { PageLayout } from "./components/PageLayout";

import "./App.css";

import Button from "react-bootstrap/Button";
import { MainContent } from "./components/MainContent";
export default function App() {
  return (
    <PageLayout>
      <center>
        <MainContent />
      </center>

      <Button>
        
      </Button>
    </PageLayout>
  );
}
