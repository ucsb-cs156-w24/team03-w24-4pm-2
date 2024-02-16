import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm";
import { ucsbOrganizationsFixtures } from "fixtures/ucsbOrganizationsFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("UCSBOrganizationForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm />
            </Router>
        );
        await screen.findByText(/Inactive/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a UCSBOrganization", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm initialContents={ucsbOrganizationsFixtures.oneOrg} />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationForm-orgCode");
        expect(screen.getByText(/Organization Code/)).toBeInTheDocument();
        expect(screen.getByTestId(/UCSBOrganizationForm-orgCode/)).toHaveValue("ZBT");
    });


    test("Correct Error messages on missing input", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationForm-submit");
        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/orgCode is required/);
        expect(screen.getByText(/orgTranslationShort is required/)).toBeInTheDocument();
        expect(screen.getByText(/orgTranslation is required/)).toBeInTheDocument();
        expect(screen.getByText(/inactive is required/)).toBeInTheDocument();
    });

    test("No Error messages on good input", async () => {

        const mockSubmitAction = jest.fn();

        render(
            <Router  >
                <UCSBOrganizationForm submitAction={mockSubmitAction} initialContents={{}}/>
            </Router>
        );

        await screen.findByTestId("UCSBOrganizationForm-orgCode");

        const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
        const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
        const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
        const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

        fireEvent.change(orgCodeField, { target: { value: 'ZBT' } });
        fireEvent.change(orgTranslationShortField, { target: { value: 'Zeta Beta Tau' } });
        fireEvent.change(orgTranslationField, { target: { value: 'Zeta Beta Tau at UCSB' } });
        fireEvent.change(inactiveField, { target: { value: false } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/orgCode is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/orgTranslationShort is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/orgTranslation is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/inactive is required/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationForm-cancel");
        const cancelButton = screen.getByTestId("UCSBOrganizationForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


