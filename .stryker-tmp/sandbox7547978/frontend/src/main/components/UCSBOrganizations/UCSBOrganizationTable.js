import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBOrganizationUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBOrganizationTable({ orgs, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/ucsborganizations/edit/${cell.row.values.orgCode}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/ucsborganizations/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'OrgCode',
            accessor: 'orgCode', // accessor is the "key" in the data
        },
        {
            Header: 'OrgTranslationShort',
            accessor: 'orgTranslationShort',
        },
        {
            Header: 'OrgTranslation',
            accessor: 'orgTranslation',
        },
        {
            Header: 'Inactive',
            accessor: 'inactive',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "UCSBOrganizationTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "UCSBOrganizationTable"));
    } 

    const orgsWithInactiveToString = orgs.map(org => ({
        ...org,
        inactive: org.inactive ? 'true' : 'false'
    }));

    return <OurTable
        data={orgsWithInactiveToString}
        columns={columns}
        testid={"UCSBOrganizationTable"}
    />;
};