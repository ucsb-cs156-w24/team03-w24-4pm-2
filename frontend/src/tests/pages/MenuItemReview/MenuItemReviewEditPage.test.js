import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

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
            id: 1
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreviews", { params: { id: 1 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Menu Item Review");
            expect(screen.queryByTestId("MenuItemReviewForm-itemId")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/menuitemreviews", { params: { id: 1 } }).reply(200, {
                id: 1,
                itemId: "5",
                reviewerEmail: "angelinasuy@ucsb.edu",
                stars: "3",
                dateReviewed: "2022-01-02T12:00:00",
                comments: "a little dry, but still good"
            });
            axiosMock.onPut('/api/menuitemreviews').reply(200, {
                id: 1,
                itemId: "2",
                reviewerEmail: "angelinasuy@gmail.com",
                stars: "1",
                dateReviewed: "2022-12-25T08:00",
                comments: "Not the best."
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-itemId");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toHaveValue('1');
            expect(itemIdField).toHaveValue('5');
            expect(reviewerEmailField).toHaveValue('angelinasuy@ucsb.edu');
            expect(starsField).toHaveValue('3');
            expect(dateReviewedField).toHaveValue('2022-01-02T12:00');
            expect(commentsField).toHaveValue('a little dry, but still good');
            expect(submitButton).toBeInTheDocument();

        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-itemId");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toHaveValue('1');
            expect(itemIdField).toHaveValue('5');
            expect(reviewerEmailField).toHaveValue('angelinasuy@ucsb.edu');
            expect(starsField).toHaveValue('3');
            expect(dateReviewedField).toHaveValue('2022-01-02T12:00');
            expect(commentsField).toHaveValue('a little dry, but still good');

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(itemIdField, {target: {value: '2'}});
            fireEvent.change(reviewerEmailField, {target: {value: 'angelinasuy@gmail.com'}});
            fireEvent.change(starsField, {target: {value: '1'}});
            fireEvent.change(dateReviewedField, {target: {value: '2022-12-25T08:00'}});
            fireEvent.change(commentsField, {target: {value: 'Not the best.'}});

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("MenuItemReview Updated - id: 1 itemId: 2");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreviews" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemId: "2",
                reviewerEmail: "angelinasuy@gmail.com",
                stars: "1",
                dateReviewed: "2022-12-25T08:00",
                comments: "Not the best."
            })); // posted object

        });

       
    });
});


