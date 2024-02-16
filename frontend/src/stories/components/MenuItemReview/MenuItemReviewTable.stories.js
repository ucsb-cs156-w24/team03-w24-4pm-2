import React from 'react';
import MenuItemReviewsTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { menuItemReviewFixtures } from 'fixtures/menuItemReviewFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/MenuItemReview/MenuItemReviewTable',
    component: MenuItemReviewsTable
};

const Template = (args) => {
    return (
        <MenuItemReviewsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    reviews: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    reviews: menuItemReviewFixtures.threeReviews,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    reviews: menuItemReviewFixtures.threeReviews,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/menuitemreviews', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};

