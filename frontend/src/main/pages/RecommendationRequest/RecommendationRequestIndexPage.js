import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestTable from 'main/components/RecommendationRequest/RecommendationRequestTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser , hasRole} from 'main/utils/currentUser';

export default function RecommendationRequestIndexPage() {

  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
        return (
            <Button
                variant="primary"
                href="/recommendationrequest/create"
                style={{ float: "right" }}
            >
                Create RecommendationRequest 
            </Button>
        )
    } 
  }
  
  const { data: recommendationRequests, error: _error, status: _status } =
    useBackend(
    // Stryker disable all : don't test internal caching of React Query
      ["/api/recommendationrequest/all"],
      { method: "GET", url: "/api/recommendationrequest/all" },
      []
      );
    // Stryker restore all 

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>RecommendationRequests</h1>
        <RecommendationRequestTable recommendationRequests={recommendationRequests} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}