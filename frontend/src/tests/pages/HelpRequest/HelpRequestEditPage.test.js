import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Help Request");
            expect(screen.queryByTestId("HelpRequest-requesterEmail")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).reply(200, {
                id: 3,
                requesterEmail: "cgaucho@ucsb.edu",
                teamId: "s22-5pm-3",
                tableOrBreakoutRoom: "7",
                explanation: "Need help with Swagger-ui",
                solved: false,
                requestTime: "2022-01-02T12:00"
            });
            axiosMock.onPut('/api/helprequest').reply(200, {
                id: 3,
                requesterEmail: "gaucho@ucsb.edu",
                teamId: "s23-5pm-3",
                tableOrBreakoutRoom: "8",
                explanation: "Need help with mutation tests",
                solved: true,
                requestTime: "2023-12-25T08:00"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-id");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toHaveValue("3");
            expect(requesterEmailField).toHaveValue("cgaucho@ucsb.edu");
            expect(teamIdField).toHaveValue("s22-5pm-3");
            expect(tableOrBreakoutRoomField).toHaveValue("7");
            expect(explanationField).toHaveValue("Need help with Swagger-ui");
            expect(solvedField).not.toBeChecked();
            expect(requestTimeField).toHaveValue("2022-01-02T12:00");
            expect(submitButton).toBeInTheDocument();

            expect(submitButton).toHaveTextContent("Update");

        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-requesterEmail");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toHaveValue("3");
            expect(requesterEmailField).toHaveValue("cgaucho@ucsb.edu");
            expect(teamIdField).toHaveValue("s22-5pm-3");
            expect(tableOrBreakoutRoomField).toHaveValue("7");
            expect(explanationField).toHaveValue("Need help with Swagger-ui");
            expect(solvedField).not.toBeChecked();
            expect(requestTimeField).toHaveValue("2022-01-02T12:00");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(requesterEmailField, { target: { value: 'gaucho@ucsb.edu' } });
            fireEvent.change(teamIdField, { target: { value: 's23-5pm-3' } });
            fireEvent.change(tableOrBreakoutRoomField, { target: { value: '8' } });
            fireEvent.change(requestTimeField, { target: { value: "2023-12-25T08:00" } });
            fireEvent.change(explanationField, { target: { value: 'Need help with mutation tests' } });
            fireEvent.change(solvedField, { target: { value: false } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Help Request Updated - id: 3 requesterEmail: gaucho@ucsb.edu");
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });
        });

       
    });
});


