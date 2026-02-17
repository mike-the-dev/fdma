import React from "react";
import { HeroUIProvider } from "@heroui/system";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import CreateStripeRedirectSession from "./CreateStripeRedirectSession";

const mutateAsyncMock = vi.fn();

vi.mock("../stripeRedirectSessions.service", () => ({
  useCreateStripeRedirectSession: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
    error: null,
  }),
}));

vi.mock("@heroui/toast", () => ({
  addToast: vi.fn(),
}));

const renderView = (): void => {
  render(
    <HeroUIProvider navigate={() => undefined}>
      <CreateStripeRedirectSession />
    </HeroUIProvider>
  );
};

const fillValidRequiredFields = (): void => {
  fireEvent.change(screen.getByLabelText("Stripe ID"), {
    target: { value: "acct_1ABCDEF" },
  });
  fireEvent.change(screen.getByLabelText("Customer Name"), {
    target: { value: "Jane Doe" },
  });
  fireEvent.change(screen.getByLabelText("Company Name"), {
    target: { value: "Acme Dental" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "jane@acmedental.com" },
  });
};

describe("CreateStripeRedirectSession", () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset();
  });
  
  afterEach(() => {
    cleanup();
  });

  it("shows a validation error and blocks submit when stripe ID does not start with acct_", async () => {
    mutateAsyncMock.mockResolvedValue({
      sessionId: "sess_1",
      redirectUrl: "https://example.com/redirect",
      expiresAt: "2026-12-31T00:00:00.000Z",
    });

    renderView();

    fireEvent.change(screen.getByLabelText("Stripe ID"), {
      target: { value: "bad_stripe_id" },
    });
    fireEvent.change(screen.getByLabelText("Customer Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Company Name"), {
      target: { value: "Acme Dental" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@acmedental.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Session" }));

    expect(
      await screen.findByText('Stripe ID must start with "acct_".')
    ).toBeInTheDocument();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("shows a validation error and blocks submit when customer name is missing", async () => {
    mutateAsyncMock.mockResolvedValue({
      sessionId: "sess_2",
      redirectUrl: "https://example.com/redirect-2",
      expiresAt: "2026-12-31T00:00:00.000Z",
    });

    renderView();

    fireEvent.change(screen.getByLabelText("Stripe ID"), {
      target: { value: "acct_1ABCDEF" },
    });
    fireEvent.change(screen.getByLabelText("Customer Name"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Company Name"), {
      target: { value: "Acme Dental" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@acmedental.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Session" }));

    expect(await screen.findByText("Customer name is required")).toBeInTheDocument();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("shows a validation error and blocks submit when customer name is whitespace only", async () => {
    mutateAsyncMock.mockResolvedValue({
      sessionId: "sess_2",
      redirectUrl: "https://example.com/redirect-2",
      expiresAt: "2026-12-31T00:00:00.000Z",
    });

    renderView();

    fireEvent.change(screen.getByLabelText("Stripe ID"), {
      target: { value: "acct_1ABCDEF" },
    });
    fireEvent.change(screen.getByLabelText("Customer Name"), {
      target: { value: "   " },
    });
    fireEvent.change(screen.getByLabelText("Company Name"), {
      target: { value: "Acme Dental" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@acmedental.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Session" }));

    expect(await screen.findByText("Customer name is required")).toBeInTheDocument();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("shows a validation error and blocks submit when company name is missing", async () => {
    mutateAsyncMock.mockResolvedValue({
      sessionId: "sess_2",
      redirectUrl: "https://example.com/redirect-2",
      expiresAt: "2026-12-31T00:00:00.000Z",
    });

    renderView();

    fireEvent.change(screen.getByLabelText("Stripe ID"), {
      target: { value: "acct_1ABCDEF" },
    });
    fireEvent.change(screen.getByLabelText("Customer Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Company Name"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@acmedental.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Session" }));

    expect(await screen.findByText("Company name is required")).toBeInTheDocument();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("shows a validation error and blocks submit when company name is whitespace only", async () => {
    mutateAsyncMock.mockResolvedValue({
      sessionId: "sess_2",
      redirectUrl: "https://example.com/redirect-2",
      expiresAt: "2026-12-31T00:00:00.000Z",
    });

    renderView();

    fireEvent.change(screen.getByLabelText("Stripe ID"), {
      target: { value: "acct_1ABCDEF" },
    });
    fireEvent.change(screen.getByLabelText("Customer Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Company Name"), {
      target: { value: "   " },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@acmedental.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Session" }));

    expect(await screen.findByText("Company name is required")).toBeInTheDocument();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("shows a validation error and blocks submit when email is invalid", async () => {
    mutateAsyncMock.mockResolvedValue({
      sessionId: "sess_2",
      redirectUrl: "https://example.com/redirect-2",
      expiresAt: "2026-12-31T00:00:00.000Z",
    });

    renderView();

    fireEvent.change(screen.getByLabelText("Stripe ID"), {
      target: { value: "acct_1ABCDEF" },
    });
    fireEvent.change(screen.getByLabelText("Customer Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Company Name"), {
      target: { value: "Acme Dental" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "not-an-email" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Session" }));

    expect(
      await screen.findByText("Email must be a valid email address")
    ).toBeInTheDocument();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("shows a validation error and blocks submit when stripe ID is whitespace only", async () => {
    mutateAsyncMock.mockResolvedValue({
      sessionId: "sess_2",
      redirectUrl: "https://example.com/redirect-2",
      expiresAt: "2026-12-31T00:00:00.000Z",
    });

    renderView();

    fireEvent.change(screen.getByLabelText("Stripe ID"), {
      target: { value: "   " },
    });
    fireEvent.change(screen.getByLabelText("Customer Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Company Name"), {
      target: { value: "Acme Dental" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@acmedental.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Session" }));

    expect(await screen.findByText("Stripe ID is required")).toBeInTheDocument();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("submits valid payload with sendEmail false when checkbox is not selected", async () => {
    mutateAsyncMock.mockResolvedValue({
      sessionId: "sess_2",
      redirectUrl: "https://example.com/redirect-2",
      expiresAt: "2026-12-31T00:00:00.000Z",
    });

    renderView();
    fillValidRequiredFields();

    fireEvent.click(screen.getByRole("button", { name: "Create Session" }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
    });

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      stripeId: "acct_1ABCDEF",
      customerName: "Jane Doe",
      companyName: "Acme Dental",
      email: "jane@acmedental.com",
      sendEmail: false,
    });
  });

  it("submits parsed payload with sendEmail true when checkbox is selected", async () => {
    mutateAsyncMock.mockResolvedValue({
      sessionId: "sess_3",
      redirectUrl: "https://example.com/redirect-3",
      expiresAt: "2026-12-31T00:00:00.000Z",
    });

    renderView();

    fireEvent.change(screen.getByLabelText("Stripe ID"), {
      target: { value: "  acct_1ABCDEF  " },
    });
    fireEvent.change(screen.getByLabelText("Customer Name"), {
      target: { value: "  Jane Doe  " },
    });
    fireEvent.change(screen.getByLabelText("Company Name"), {
      target: { value: "  Acme Dental  " },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "  jane@acmedental.com  " },
    });
    fireEvent.click(screen.getByLabelText("Send email notification"));

    fireEvent.click(screen.getByRole("button", { name: "Create Session" }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
    });

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      stripeId: "acct_1ABCDEF",
      customerName: "Jane Doe",
      companyName: "Acme Dental",
      email: "jane@acmedental.com",
      sendEmail: true,
    });
  });
});
