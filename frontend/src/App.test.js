import { render, screen } from "@testing-library/react";
import App from "./App";
import React from "react";
import { getUserProfiles } from "./api";

global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
  unobserve(element) {}
};

jest.mock("./api");

beforeEach(() => {
  // Reset the mock before each test
  getUserProfiles.mockReset();
});

test("renders User Profiles header", async () => {
  getUserProfiles.mockResolvedValue({
    data: [
      { id: 1, user: "user 1" },
      { id: 2, user: "user 2" },
    ],
  });

  render(<App />);

  const headerElement = await screen.findByText(/User Profiles/i);
  expect(headerElement).toBeInTheDocument();
});

test("renders user profiles from API", async () => {
  getUserProfiles.mockResolvedValue({
    data: [
      { id: 1, user: "user 1" },
      { id: 2, user: "user 2" },
    ],
  });

  render(<App />);

  const profileElements = await screen.findAllByRole("listitem");
  expect(profileElements).toHaveLength(2);
  expect(profileElements[0]).toHaveTextContent("user 1");
  expect(profileElements[1]).toHaveTextContent("user 2");
});
