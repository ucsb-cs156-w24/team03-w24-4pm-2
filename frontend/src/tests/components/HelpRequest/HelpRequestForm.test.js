import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("HelpRequestForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Requester Email", "TeamID", "Table Or Breakout Room", "Request Time ISO Format", "Explanation", "Solved"];
    const testId = "HelpRequestForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm /> 
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm initialContents={helpRequestFixtures.oneHelpRequest} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("correct error messsages on missing input", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email is required./);
        expect(screen.getByText(/TeamID is required./)).toBeInTheDocument();
        expect(screen.getByText(/Table Or Breakout Room is required./)).toBeInTheDocument();
        expect(screen.getByText(/Request time is required and must be provided in ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    });

    test("correct error messsages on bad input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-requesterEmail");
        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(requestTimeField, { target: { value: 'bad-input' } });
        fireEvent.change(teamIdField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email must be a valid email/);
        expect(screen.getByText(/TeamID must be a valid team id/)).toBeInTheDocument();
    });

    test("no error messsages on good input1", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <HelpRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId(`${testId}-requesterEmail`);

        const requesterEmailField = screen.getByTestId(`${testId}-requesterEmail`);
        const teamIdField = screen.getByTestId(`${testId}-teamId`);
        const tableOrBreakoutRoomField = screen.getByTestId(`${testId}-tableOrBreakoutRoom`);
        const requestTimeField = screen.getByTestId(`${testId}-requestTime`);
        const explanationField = screen.getByTestId(`${testId}-explanation`);
        const solvedField = screen.getByTestId(`${testId}-solved`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.change(requesterEmailField, { target: { value: 'cgaucho@gmail.com' } });
        fireEvent.change(teamIdField, { target: { value: 'w24-12pm-2' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: '6' } });
        fireEvent.change(requestTimeField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(explanationField, { target: { value: 'explanation' } });
        fireEvent.change(solvedField, { target: { value: false } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Requester Email is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Requester Email must be a valid email/)).not.toBeInTheDocument();
        expect(screen.queryByText(/TeamID is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/TeamID must be a valid team id/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Table Or Breakout Room is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Request time is required and must be provided in ISO format./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Explanation is required./)).not.toBeInTheDocument();

    });

    test("no error messsages on good input2", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <HelpRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId(`${testId}-requesterEmail`);

        const requesterEmailField = screen.getByTestId(`${testId}-requesterEmail`);
        const teamIdField = screen.getByTestId(`${testId}-teamId`);
        const tableOrBreakoutRoomField = screen.getByTestId(`${testId}-tableOrBreakoutRoom`);
        const requestTimeField = screen.getByTestId(`${testId}-requestTime`);
        const explanationField = screen.getByTestId(`${testId}-explanation`);
        const solvedField = screen.getByTestId(`${testId}-solved`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.change(requesterEmailField, { target: { value: 'cgaucho@gmail.com' } });
        fireEvent.change(teamIdField, { target: { value: 'w24-4pm-2' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: '6' } });
        fireEvent.change(requestTimeField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(explanationField, { target: { value: 'explanation' } });
        fireEvent.change(solvedField, { target: { value: false } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Requester Email is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Requester Email must be a valid email/)).not.toBeInTheDocument();
        expect(screen.queryByText(/TeamID is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/TeamID must be a valid team id/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Table Or Breakout Room is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Request time is required and must be provided in ISO format./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Explanation is required./)).not.toBeInTheDocument();

    });

});