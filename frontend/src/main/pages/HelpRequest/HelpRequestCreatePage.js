import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestCreatePage({storybook=false}) {

    const objectToAxiosParams = (helprequest) => ({
        url: "/api/ucsbhelprequest/post",
        method: "POST",
        params: {
            requesterEmail: helprequest.requesterEmail,
            teamId: helprequest.teamId,
            tableOrBreakoutRoom: helprequest.tableOrBreakoutRoom,
            explanation: helprequest.explanation,
            solved: helprequest.solved,
            requestTime: helprequest.requestTime,
        }
    });

    // requesterEmail: ${helprequest.requesterEmail} teamId: ${helprequest.teamId}
    const onSuccess = (helprequest) => {
        toast(`New helprequest Created - id: ${helprequest.id}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
         { onSuccess }, 
         // Stryker disable next-line all : hard to set up test for caching
         ["/api/ucsbhelprequest/all"] // mutation makes this key stale so that pages relying on it reload
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
            <h1>Create New Help Request</h1>
            <HelpRequestForm submitAction={onSubmit} />
          </div>
        </BasicLayout>
    )
}