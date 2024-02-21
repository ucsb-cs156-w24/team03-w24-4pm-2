import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import HelpRequestForm from 'main/components/HelpRequest/HelpRequestForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: request, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/ucsbhelprequest?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/ucsbhelprequest`,
                params: {
                    id
                }
            }
        );

    const objectToAxiosPutParams = (request) => ({
        url: "/api/ucsbhelprequest",
        method: "PUT",
        params: {
            id: request.id,
        },
        data: {
            requesterEmail: request.requesterEmail,
            teamId: request.teamId,
            tableOrBreakoutRoom: request.tableOrBreakoutRoom,
            explanation: request.explanation,
            solved: request.solved,
            requestTime: request.requestTime
        }
    });

    const onSuccess = (request) => {
        toast(`Help Request Updated - id: ${request.id} requesterEmail: ${request.requesterEmail}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/ucsbhelprequest?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/ucsbhelprequest" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Help Request</h1>
                {
                    request && <HelpRequestForm submitAction={onSubmit} buttonLabel="Update" initialContents={request} />
                }
            </div>
        </BasicLayout>
    )
}