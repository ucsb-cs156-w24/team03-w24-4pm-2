import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function MenuItemReviewForm({ initialContents, submitAction, buttonLabel = "Create" }) {

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

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    // Stryker disable next-line all
    // const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.

    const int_regex = /^\d+$/i;
    const stars_regex = /^[0-5]$/i;

    const testIdPrefix = "MenuItemReviewForm";

    return (

        <Form onSubmit={handleSubmit(submitAction)}>


            <Row>

            {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid={testIdPrefix + "-id"}
                                id="id"
                                type="number"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="itemId">Item ID</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-itemId"}
                            id="itemId"
                            type="number"
                            isInvalid={Boolean(errors.itemId)}
                            {...register("itemId", { required: true, pattern: int_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.itemId && 'Item ID is required.'}
                            {errors.itemId?.type === 'pattern' && ' Item ID must be a positive integer'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="reviewerEmail">Reviewer Email</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-reviewerEmail"}
                            id="reviewerEmail"
                            type="text"
                            isInvalid={Boolean(errors.reviewerEmail)}
                            {...register("reviewerEmail", { required: true})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.reviewerEmail && "Reviewer Email is required."}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="stars">Stars</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-stars"}
                            id="stars"
                            type="number"
                            isInvalid={Boolean(errors.stars)}
                            {...register("stars", { required: true, pattern: stars_regex})}
                        />
                        <Form.Control.Feedback type="invalid">
                        {errors.stars && 'Stars are required. '}
                        {errors.stars?.type === 'pattern' && 'Stars must be a positive integer ranging from 0-5'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>                
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="dateReviewed">Date Reviewed(iso format)</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-dateReviewed"}
                            id="dateReviewed"
                            type="datetime-local"
                            isInvalid={Boolean(errors.dateReviewed)}
                            {...register("dateReviewed", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.dateReviewed && 'Date Reviewed is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="comments">Comments</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-comments"}
                            id="comments"
                            type="text"
                            isInvalid={Boolean(errors.comments)}
                            {...register("comments", { required: "Comments are required."})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.comments?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>                
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid={testIdPrefix + "-submit"}
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid={testIdPrefix + "-cancel"}
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default MenuItemReviewForm;
