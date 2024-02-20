import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationCreatePage({storybook=false}) {

  const objectToAxiosParams = (ucsbOrg) => ({
    url: "/api/ucsborganizations/post",
    method: "POST",
    params: {
      orgCode: ucsbOrg.orgCode,
      orgTranslationShort: ucsbOrg.orgTranslationShort,
      orgTranslation: ucsbOrg.orgTranslation,
      inactive: ucsbOrg.inactive
    }
  });

  const onSuccess = (ucsbOrg) => {
    toast(`New ucsbOrganization Created - orgCode: ${ucsbOrg.orgCode} orgTranslation: ${ucsbOrg.orgTranslation}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/ucsborganizations/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganizations" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBOrganization</h1>

        <UCSBOrganizationForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}