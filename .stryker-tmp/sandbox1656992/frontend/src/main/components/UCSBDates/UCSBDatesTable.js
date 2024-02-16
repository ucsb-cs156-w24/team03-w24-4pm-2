import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBDateUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBDatesTable({ dates, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/ucsbdates/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/ucsbdates/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'QuarterYYYYQ',
            accessor: 'quarterYYYYQ',
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Date',
            accessor: 'localDateTime',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "UCSBDatesTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "UCSBDatesTable"));
    } 

    return <OurTable
        data={dates}
        columns={columns}
        testid={"UCSBDatesTable"}
    />;
};