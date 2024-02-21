import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const helprequest = {
            id: 17,
            requesterEmail: "cgaucho@ucsb.edu",
            teamId: "s22-5pm-3",
            tableOrBreakoutRoom: "7",
            explanation: "Need help with Swagger-ui",
            solved: false,
            requestTime: "2022-01-02T12:00"
        };

        axiosMock.onPost("/api/helprequest/post").reply( 202, helprequest );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await screen.findByTestId("HelpRequestForm-requesterEmail");

        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: "cgaucho@ucsb.edu" } });
        fireEvent.change(teamIdField, { target: { value: "s22-5pm-3" } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: "7" } });
        fireEvent.change(explanationField, { target: { value: "Need help with Swagger-ui" } });
        fireEvent.click(solvedField);
        fireEvent.change(requestTimeField, { target: { value: "2022-01-02T12:00" } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                requesterEmail: "cgaucho@ucsb.edu",
                teamId: "s22-5pm-3",
                tableOrBreakoutRoom: "7",
                explanation: "Need help with Swagger-ui",
                solved: true,
                requestTime: "2022-01-02T12:00"
        });

        expect(mockToast).toBeCalledWith("New help request Created - id: 17 requesterEmail: cgaucho@ucsb.edu teamId: s22-5pm-3");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            requesterEmail: "cgaucho@ucsb.edu",
            teamId: "s22-5pm-3",
            tableOrBreakoutRoom: "7",
            explanation: "Need help with Swagger-ui",
            solved: true,
            requestTime: "2022-01-02T12:00"
    });
    });

});