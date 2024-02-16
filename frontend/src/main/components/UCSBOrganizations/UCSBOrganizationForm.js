import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function UCSBOrganizationForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    return (

        <Form onSubmit={handleSubmit(submitAction)}>


            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="orgCode">Organization Code</Form.Label>
                        <Form.Control
                            data-testid="UCSBOrganizationForm-orgCode"
                            id="orgCode"
                            type="text"
                            isInvalid={Boolean(errors.orgCode)}
                            {...register("orgCode", { required: "orgCode is required." })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.orgCode?.message }
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="orgTranslationShort">Organization Name (Short)</Form.Label>
                        <Form.Control
                            data-testid="UCSBOrganizationForm-orgTranslationShort"
                            id="orgTranslationShort"
                            type="text"
                            isInvalid={Boolean(errors.orgTranslationShort)}
                            {...register("orgTranslationShort", { required: "orgTranslationShort is required." })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.orgTranslationShort?.message }
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="orgTranslation">Organization Name</Form.Label>
                        <Form.Control
                            data-testid="UCSBOrganizationForm-orgTranslation"
                            id="orgTranslation"
                            type="text"
                            isInvalid={Boolean(errors.orgTranslation)}
                            {...register("orgTranslation", { required: "orgTranslation is required." })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.orgTranslation?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="inactive">Inactive</Form.Label>
                        <Form.Control
                            data-testid="UCSBOrganizationForm-inactive"
                            id="inactive"
                            type="boolean"
                            isInvalid={Boolean(errors.inactive)}
                            {...register("inactive", { required: 'inactive is required.', validate: value => value === '' || value === "true" || value === "false" || 'inactive must be either true or false.' })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.inactive && errors.inactive.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="UCSBOrganizationForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="UCSBOrganizationForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default UCSBOrganizationForm;
