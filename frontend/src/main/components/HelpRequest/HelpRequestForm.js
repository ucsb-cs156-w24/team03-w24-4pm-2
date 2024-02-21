import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function HelpRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {

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

    const testIdPrefix = "HelpRequestForm";

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
    const teamid_regex = /(w(\d{2}))-(([1-9]|1[0-2])(a|p)m)-([1-4])/i;
    const email_regex = /[A-Za-z0-9_]@[A-Za-z0-9_]/i;

    // Stryker disable next-line all
    //const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={"HelpRequestForm-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
                <Form.Control
                    data-testid={"HelpRequestForm-requesterEmail"}
                    id="requesterEmail"
                    type="text"
                    isInvalid={Boolean(errors.requesterEmail)}
                    {...register("requesterEmail", {
                        required: "Requester Email is required.",
                        pattern: email_regex
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.requesterEmail && 'Requester Email is required. '}
                    {errors.requesterEmail?.type === 'pattern' && 'Requester Email must be a valid email'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="teamId">TeamID</Form.Label>
                <Form.Control
                    data-testid={"HelpRequestForm-teamId"}
                    id="teamId"
                    type="text"
                    isInvalid={Boolean(errors.teamId)}
                    {...register("teamId", {
                        required: "TeamID is required.",
                        pattern: teamid_regex
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.teamId && 'TeamID is required. '}
                    {errors.teamId?.type === 'pattern' && 'TeamID must be a valid team id'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="tableOrBreakoutRoom">Table Or Breakout Room</Form.Label>
                <Form.Control
                    data-testid={"HelpRequestForm-tableOrBreakoutRoom"}
                    id="tableOrBreakoutRoom"
                    type="text"
                    isInvalid={Boolean(errors.tableOrBreakoutRoom)}
                    {...register("tableOrBreakoutRoom", {
                        required: "Table Or Breakout Room is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.tableOrBreakoutRoom?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="requestTime">Request Time ISO Format</Form.Label>
                <Form.Control
                    data-testid={"HelpRequestForm-requestTime"}
                    id="requestTime"
                    type="datetime-local"
                    isInvalid={Boolean(errors.requestTime)}
                    {...register("requestTime", {
                        required: "Request Time ISO Format is required.",
                        pattern: isodate_regex
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.requestTime && 'Request time is required and must be provided in ISO format.'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="explanation">Explanation</Form.Label>
                <Form.Control
                    data-testid={"HelpRequestForm-explanation"}
                    id="explanation"
                    type="text"
                    isInvalid={Boolean(errors.explanation)}
                    {...register("explanation", {
                        required: "Explanation is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.explanation?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="solved">Solved</Form.Label>
                <Form.Check
                    data-testid={"HelpRequestForm-solved"}
                    id="solved"
                    type="switch"
                    isInvalid={Boolean(errors.done)}
                    {...register("solved", {})}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.solved?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid={"HelpRequestForm-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={"HelpRequestForm-cancel"}
            >
                Cancel
            </Button>

        </Form>
    )
}

export default HelpRequestForm;
