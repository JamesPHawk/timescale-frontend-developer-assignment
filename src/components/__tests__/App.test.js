import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

const mockUsers = [
    { email: "tim.duncan@sse.com", isSelected: true },
    { email: "boris.diaw@natgeo.com", isSelected: false },
    { email: "john@hello.com", isSelected: false }
];

test("Lists render successfully", () => {
    render(<App users={mockUsers}/>);

    expect(screen.getByText("tim.duncan@sse.com")).toBeInTheDocument();
    expect(screen.getByText("boris.diaw@natgeo.com")).toBeInTheDocument();
    expect(screen.getByText("john@hello.com")).toBeInTheDocument();
});

test("Search filters results successfully", () => {
    render(<App users={mockUsers}/>);

    expect(screen.getByText("tim.duncan@sse.com")).toBeInTheDocument();
    expect(screen.getByText("boris.diaw@natgeo.com")).toBeInTheDocument();
    expect(screen.getByText("john@hello.com")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "tim" } });
    
    expect(screen.getByText("tim.duncan@sse.com")).toBeInTheDocument();
    expect(screen.getByText("boris.diaw@natgeo.com")).not.toBeInTheDocument();
    expect(screen.getByText("john@hello.com")).not.toBeInTheDocument();
});

test ("Add email button appears when there are no search results", () => {
    render(<App users={mockUsers}/>);

    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "thisisnoonesemail" } });

    expect(screen.getByText("Add Email")).toBeInTheDocument();

    expect(screen.getByText("tim.duncan@sse.com")).not.toBeInTheDocument();
    expect(screen.getByText("boris.diaw@natgeo.com")).not.toBeInTheDocument();
    expect(screen.getByText("john@hello.com")).not.toBeInTheDocument();
})
