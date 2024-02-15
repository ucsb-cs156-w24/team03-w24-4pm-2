import React from 'react';
import UCSBOrganizationTable from "main/components/UCSBOrganizations/UCSBOrganizationTable";
import { ucsbOrganizationsFixtures } from 'fixtures/ucsbOrganizationsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/UCSBOrganizations/UCSBOrganizationTable',
    component: UCSBOrganizationTable
};

const Template = (args) => {
    return (
        <UCSBOrganizationTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    orgs: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    orgs: ucsbOrganizationsFixtures.threeOrgs,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    orgs: ucsbOrganizationsFixtures.threeOrgs,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/ucsborganizations', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};

