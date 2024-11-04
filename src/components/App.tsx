import React, { useState, useEffect } from "react";
import { Checkbox } from "./ui/checkbox";
import { Table, Input, Button, Grid, GridItem, Collapsible, Box, IconButton } from "@chakra-ui/react";
import {
  ActionBarContent,
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
} from "@chakra-ui/react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";

interface User {
  email: string;
  isSelected: boolean;
}

const App = ({users}) => {
  const [userEmails, setUserEmails] = useState<User[]>(users);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [checkedAvailableUsers, setCheckedAvailableUsers] = useState<User[]>([]);
  const [checkedSelectedUsers, setCheckedSelectedUsers] = useState<User[]>([]);
  const [expandedAvailableGroups, setExpandedAvailableGroups] = useState<Record<string, boolean>>({});
  const [expandedSelectedGroups, setExpandedSelectedGroups] = useState<Record<string, boolean>>({});

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

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

  const groupByDomain = (users: User[]) => {
    const grouped = users.reduce((groups, user) => {
      const domain = user.email.split("@")[1];
      if (!groups[domain]) groups[domain] = [];
      groups[domain].push(user);
      return groups;
    }, {} as Record<string, User[]>);

    return Object.fromEntries(Object.entries(grouped).filter(([_, emails]) => emails.length > 1));
  };

  const getUngroupedUsers = (users: User[], groupedUsers: Record<string, User[]>) => {
    const groupedEmails = new Set(Object.values(groupedUsers).flat().map((user) => user.email));
    return users.filter((user) => !groupedEmails.has(user.email));
  };

  const availableGroups = groupByDomain(filteredEmails);
  const ungroupedAvailableUsers = getUngroupedUsers(filteredEmails, availableGroups);

  const selectedGroups = groupByDomain(selectedUsers);
  const ungroupedSelectedUsers = getUngroupedUsers(selectedUsers, selectedGroups);

  const toggleGroupExpansion = (domain: string, isAvailable: boolean) => {
    if (isAvailable) {
      setExpandedAvailableGroups((prev) => ({ ...prev, [domain]: !prev[domain] }));
    } else {
      setExpandedSelectedGroups((prev) => ({ ...prev, [domain]: !prev[domain] }));
    }
  };

  const addEmail = (newEmail: string) => {
    if (!selectedUsers.some((user) => user.email === newEmail)) {
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

  const getRows = (
    userGroups: Record<string, User[]>,
    ungroupedUsers: User[],
    checkedUsers: User[],
    setCheckedUsers: React.Dispatch<React.SetStateAction<User[]>>,
    expandedGroups: Record<string, boolean>,
    isAvailable: boolean
  ) => {
    return (
      <>
        {Object.entries(userGroups).map(([domain, users]) => (
          <React.Fragment key={domain}>
            <Table.Row>
              <Table.Cell colSpan={2}>
                <Collapsible.Root>
                  <Box display="flex" alignItems="center">
                  <Collapsible.Trigger>
                    <IconButton
                      aria-label="Toggle Group"
                      onClick={() => toggleGroupExpansion(domain, isAvailable)}
                      variant="ghost"
                      size="sm"
                      mr="2"
                    >
                      {expandedGroups[domain] ? <FaChevronDown /> : <FaChevronRight />}
                    </IconButton>
                    </Collapsible.Trigger>
                    <Checkbox
                      checked={users.every((user) => checkedUsers.includes(user))}
                      onCheckedChange={(changes) => {
                        setCheckedUsers((prev) =>
                          changes.checked
                            ? [...prev, ...users.filter((user) => !prev.includes(user))]
                            : prev.filter((user) => !users.includes(user))
                        );
                      }}
                    >
                      {domain} ({users.length})
                    </Checkbox>
                  </Box>
                  <Collapsible.Content>
                  {users.map((user) => (
                    <Table.Row  display="block" ml="11" key={user.email}>
                      <Table.Cell paddingLeft="0px" borderBottom="none">
                        <Checkbox
                          aria-label="Select user"
                          checked={checkedUsers.includes(user)}
                          onCheckedChange={(changes) => {
                            setCheckedUsers((prev) =>
                              changes.checked ? [...prev, user] : prev.filter((u) => u !== user)
                            );
                          }}
                        />
                      </Table.Cell>
                      <Table.Cell borderBottom="none">{user.email}</Table.Cell>
                    </Table.Row>
                  ))}
                  </Collapsible.Content>
                </Collapsible.Root>
              </Table.Cell>
            </Table.Row>
          </React.Fragment>
        ))}
        
        {ungroupedUsers.map((user) => (
          <Table.Row key={user.email}>
            <Table.Cell>
              <Checkbox
                aria-label="Select user"
                checked={checkedUsers.includes(user)}
                onCheckedChange={(changes) => {
                  setCheckedUsers((prev) =>
                    changes.checked ? [...prev, user] : prev.filter((u) => u !== user)
                  );
                }}
              />
            </Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
          </Table.Row>
        ))}
      </>
    );
  };

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
            {filteredEmails.length > 0 && (<Table.Header>
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
            </Table.Header>)}
            <Table.Body>{getRows(availableGroups, ungroupedAvailableUsers, checkedAvailableUsers, setCheckedAvailableUsers, expandedAvailableGroups, true)}</Table.Body>
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
          {filteredEmails.length === 0 && <Button disabled={!emailRegex.test(searchQuery)} onClick={() => addEmail(searchQuery)} mt="5">Add Email</Button>}
        </GridItem>

        <GridItem offset={2} colStart={4} colSpan={1}>
          <Input
            type="text"
            placeholder="Search..."
            className="recipientPlaceholder"
          />
          <Table.Root>
            <Table.Header className="selectedRecipients">
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
            <Table.Body>{getRows(selectedGroups, ungroupedSelectedUsers, checkedSelectedUsers, setCheckedSelectedUsers, expandedSelectedGroups, false)}</Table.Body>
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