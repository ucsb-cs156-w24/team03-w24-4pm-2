import React from 'react';
import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm"
import { ucsbOrganizationsFixtures } from 'fixtures/ucsbOrganizationsFixtures';

export default {
    title: 'components/UCSBOrganizations/UCSBOrganizationForm',
    component: UCSBOrganizationForm,
};


const Template = (args) => {
    return (
        <UCSBOrganizationForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: ucsbOrganizationsFixtures.oneOrg,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};
