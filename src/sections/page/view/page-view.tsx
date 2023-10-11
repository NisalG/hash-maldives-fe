"use client";

import { useState } from "react";

// @mui
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "next/link";

import { Page } from "../types";

// import PageHero from '../page-hero';
import PageAdd from "../page-add";
import PageTable from "../page-table";
import EditPage from "../page-edit";
// ----------------------------------------------------------------------

export default function PageView() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isAddFormVisible, setAddFormVisible] = useState(false); // State to control the visibility of the "Add New" form
  const [editingPageId, setEditingPageId] = useState<string | null>(null); // State to hold the ID of the page to be edited

  const toggleAddForm = () => {
    setAddFormVisible(!isAddFormVisible);
  };

  const handleEditPage = (pageId: string) => {
    setEditingPageId(pageId);
    setAddFormVisible(false);
  };

  return (
    <Container sx={{ py: 10 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (editingPageId) {
            setEditingPageId(null);
            setAddFormVisible(false);
          } else if (isAddFormVisible) {
            setAddFormVisible(false);
          } else {
            setAddFormVisible(true);
          }
        }}
      >
        {editingPageId
          ? "Show Pages List"
          : isAddFormVisible
          ? "Show Pages List"
          : "Add New Page"}
      </Button>
      {editingPageId ? (
        <EditPage
          key={editingPageId}
          pages={pages}
          editingPageId={editingPageId}
          onClose={() => setEditingPageId(null)}
        />
      ) : isAddFormVisible ? (
        <PageAdd setPages={setPages} />
      ) : (
        <PageTable pages={pages} onEditPage={handleEditPage} />
      )}
    </Container>
  );
}
