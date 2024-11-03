import users from "../assets/recipientsData.json";
import React, { useState, useEffect } from "react";
import { Checkbox } from "./ui/checkbox";
import { TableBody, Table, Input, Button, Grid, GridItem } from "@chakra-ui/react";
import {
  ActionBarContent,
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
} from "@chakra-ui/react";

interface User {
  email: string;
  isSelected: boolean;
}

const App = () => {
  const [userEmails, setUserEmails] = useState<User[]>(users);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [checkedAvailableUsers, setCheckedAvailableUsers] = useState<User[]>([]);
  const [checkedSelectedUsers, setCheckedSelectedUsers] = useState<User[]>([]);

  const filteredEmails = userEmails.filter((entry) =>
    entry.email.toLowerCase().includes(searchQuery.toLowerCase()) && !entry.isSelected
  );

  const availableIndeterminate =
    checkedAvailableUsers.length > 0 && checkedAvailableUsers.length < filteredEmails.length;

  const selectedIndeterminate =
    checkedSelectedUsers.length > 0 && checkedSelectedUsers.length < selectedUsers.length;

  useEffect(() => {
    const selected = userEmails.filter(user => user.isSelected);

    setSelectedUsers(selected);
  }, [userEmails]);

  const addEmail = (newEmail: string) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailRegex.test(newEmail)) {
      setUserEmails([...userEmails, {email: newEmail, isSelected: false}]);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const addRecipients = () => {
    checkedAvailableUsers.forEach((user) => user.isSelected = true);
    setSelectedUsers(selectedUsers.concat(checkedAvailableUsers));
    setCheckedAvailableUsers([]);
  }

  const removeRecipients = () => {
    checkedSelectedUsers.forEach((user) => user.isSelected = false);
    setSelectedUsers(selectedUsers.filter((user) => !checkedSelectedUsers.includes(user)));
    setCheckedSelectedUsers([]);
  }

  const getRows = (users: User[], checkedUsers: User[], setCheckedUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
    return users.map((user) => (
        <Table.Row
          key={user.email}
          data-selected={checkedUsers.includes(user) ? "" : undefined}
        >
        <Table.Cell>
          <Checkbox
            top="1"
            aria-label="Select row"
            checked={checkedUsers.includes(user) ? true : false}
            onCheckedChange={(changes) => {
              setCheckedUsers((prev) =>
                changes.checked
                  ? [...prev, user]
                  : checkedUsers.filter((name) => name !== user),
              )
            }}
          />
        </Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
      </Table.Row>
      )
    )
  }

  return (
    <div>
      <Grid templateColumns="repeat(6, 1fr)" gap="6">
        <GridItem offset={2} colStart={3} colSpan={1}>
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w="6">
                  <Checkbox
                    top="1"
                    aria-label="Select all rows"
                    checked={availableIndeterminate ? "indeterminate" : checkedAvailableUsers.length > 0}
                    onCheckedChange={(changes) => {
                      setCheckedAvailableUsers(
                        changes.checked ? filteredEmails.map((item) => item) : [],
                      )
                    }}
                  />
                </Table.ColumnHeader>
                <Table.ColumnHeader>Available Recipients</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <TableBody>{getRows(filteredEmails, checkedAvailableUsers, setCheckedAvailableUsers)}</TableBody>
          </Table.Root>

          <ActionBarRoot open={checkedAvailableUsers.length > 0}>
            <ActionBarContent>
              <ActionBarSelectionTrigger>
                {checkedAvailableUsers.length} selected
              </ActionBarSelectionTrigger>
              <ActionBarSeparator />
              <Button variant="outline" size="sm" onClick={() => addRecipients()}>
                Add
              </Button>
            </ActionBarContent>
          </ActionBarRoot>
          <Button onClick={() => addEmail(searchQuery)}>Add Email</Button>
        </GridItem>

        <GridItem offset={2} colStart={4} colSpan={1}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w="6">
                <Checkbox
                    top="1"
                    aria-label="Select all rows"
                    checked={selectedIndeterminate ? "indeterminate" : checkedSelectedUsers.length > 0}
                    onCheckedChange={(changes) => {
                      setCheckedSelectedUsers(
                        changes.checked ? selectedUsers.map((item) => item) : [],
                      )
                    }}
                  />
                </Table.ColumnHeader>
                <Table.ColumnHeader>Selected Recipients</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <TableBody>{getRows(selectedUsers, checkedSelectedUsers, setCheckedSelectedUsers)}</TableBody>
          </Table.Root>

          <ActionBarRoot open={checkedSelectedUsers.length > 0}>
            <ActionBarContent>
              <ActionBarSelectionTrigger>
                {checkedSelectedUsers.length} selected
              </ActionBarSelectionTrigger>
              <ActionBarSeparator />
              <Button variant="outline" size="sm" onClick={() => removeRecipients()}>
                Remove
              </Button>
            </ActionBarContent>
          </ActionBarRoot>
        </GridItem>
      </Grid>
    </div>
  );
};

export default App;