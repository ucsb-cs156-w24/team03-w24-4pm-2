import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbDatesFixtures } from "fixtures/ucsbDatesFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";


const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("UCSBDatesIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "UCSBDatesTable";

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

    test("Renders with Create Button for admin user", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsbdates/all").reply(200, []);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDatesIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor( ()=>{
            expect(screen.getByText(/Create UCSBDate/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create UCSBDate/);
        expect(button).toHaveAttribute("href", "/ucsbdates/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three dates correctly for regular user", async () => {
        
        // arrange
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsbdates/all").reply(200, ucsbDatesFixtures.threeDates);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDatesIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

        // assert that the Create button is not present when user isn't an admin
        expect(screen.queryByText(/Create UCSBDate/)).not.toBeInTheDocument();

    });


    test("renders empty table when backend unavailable, user only", async () => {
        // arrange
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsbdates/all").timeout();
        const restoreConsole = mockConsole();

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDatesIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/ucsbdates/all");
        restoreConsole();

        expect(screen.queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("what happens when you click delete, admin", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsbdates/all").reply(200, ucsbDatesFixtures.threeDates);
        axiosMock.onDelete("/api/ucsbdates").reply(200, "UCSBDate with id 1 was deleted");

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDatesIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        // act
        fireEvent.click(deleteButton);

        // assert
        await waitFor(() => { expect(mockToast).toBeCalledWith("UCSBDate with id 1 was deleted") });

    });

});


