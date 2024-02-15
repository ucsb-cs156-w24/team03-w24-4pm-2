import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import MenuItemReviewIndexPage from "main/pages/MenuItemReview/MenuItemReviewIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("MenuItemReviewIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "MenuItemReviewsTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };


    const queryClient = new QueryClient();

    test("Renders with Create Button for admin user", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/menuitemreviews/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create Menu Item Review/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create Menu Item Review/);
        expect(button).toHaveAttribute("href", "/menuitemreviews/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three restaurants correctly for regular user", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/menuitemreviews/all").reply(200, menuItemReviewFixtures.threeReviews);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

        const createRestaurantButton = screen.queryByText("Create Menu Item Review");
        expect(createRestaurantButton).not.toBeInTheDocument();

        const comments = screen.getByText("a little dry, but still good");
        expect(comments).toBeInTheDocument();

        const reviewerEmail = screen.getByText("angelinasuy@ucsb.edu");
        expect(reviewerEmail).toBeInTheDocument();

        // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
        expect(screen.queryByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        axiosMock.onGet("/api/menuitemreviews/all").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        
        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/menuitemreviews/all");
        restoreConsole();

    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();

        axiosMock.onGet("/api/menuitemreviews/all").reply(200, menuItemReviewFixtures.threeReviews);
        axiosMock.onDelete("/api/menuitemreviews").reply(200, "MenuItemReview with id 1 was deleted");


        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");


        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("MenuItemReview with id 1 was deleted") });

        await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
        // expect(axiosMock.history.delete[0].url).toBe("/api/menuitemreviews");
        // expect(axiosMock.history.delete[0].url).toBe("/api/menuitemreviews");
        // expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
    });

});


