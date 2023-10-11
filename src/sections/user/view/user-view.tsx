"use client";

import { useState } from "react";

// @mui
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "next/link";

import { User } from "../types";

// import UserHero from '../user-hero';
import UserAdd from "../user-add";
import UserTable from "../user-table";
import EditUser from "../user-edit";
// ----------------------------------------------------------------------

export default function UserView() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddFormVisible, setAddFormVisible] = useState(false); // State to control the visibility of the "Add New" form
  const [editingUserId, setEditingUserId] = useState<string | null>(null); // State to hold the ID of the user to be edited

  const toggleAddForm = () => {
    setAddFormVisible(!isAddFormVisible);
  };

  const handleEditUser = (userId: string) => {
    setEditingUserId(userId);
    setAddFormVisible(false);
  };

  return (
    <Container sx={{ py: 10 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (editingUserId) {
            setEditingUserId(null);
            setAddFormVisible(false);
          } else if (isAddFormVisible) {
            setAddFormVisible(false);
          } else {
            setAddFormVisible(true);
          }
        }}
      >
        {editingUserId
          ? "Show Users List"
          : isAddFormVisible
          ? "Show Users List"
          : "Add New User"}
      </Button>
      {editingUserId ? (
        <EditUser
          key={editingUserId}
          users={users}
          editingUserId={editingUserId}
          onClose={() => setEditingUserId(null)}
        />
      ) : isAddFormVisible ? (
        <UserAdd setUsers={setUsers} />
      ) : (
        <UserTable users={users} onEditUser={handleEditUser} />
      )}
    </Container>
  );
}
