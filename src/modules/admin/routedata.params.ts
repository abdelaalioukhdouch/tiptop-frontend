import { Appsettings } from "src/app/app.settings";
import { RouteData } from "./routedata.interface";

export const usersRouteData: RouteData = {

    pageTitle: `Users`,
    selectedNavItem: 'Users',
    fetchUrl: `${Appsettings.API_ENDPOINT}/users`,
    fetchQueryStatic: `admin=true`,
    formModel: [
        { name: 'name', placeholder: 'Name', type: 'text', required: true },
        { name: 'firstName', placeholder: 'First Name', type: 'text', required: true },
        { name: 'email', placeholder: 'Email', type: 'email', required: true },
        { name: 'password', placeholder: 'Password', type: 'password' },
    ],
    primaryKey: `_id`,
    addFormTitle: `Add User`,
    editFormTitle: `Edit User`,
    addButtonTitle: `Add New User`,

    viewMainTitleField: 'name',
    viewMainSubtitleField: 'email',
    pagination: {
        responseField: 'data',
        perPageField: 'perPage',
        pageField: 'page',
        countField: 'count',
        perPage: 20
    },
}

export const ticketsRouteData: RouteData = {

    pageTitle: `Tickets`,
    selectedNavItem: 'Tickets',
    fetchUrl: `${Appsettings.API_ENDPOINT}/ticket`,
    fetchQueryStatic: `admin=true`,
    formModel: [
        { name: 'Status', placeholder: 'Status', type: 'text' }
    ],
    primaryKey: `_id`,
    addFormTitle: `Add Ticket`,
    editFormTitle: `Edit Ticket`,
    addButtonTitle: `Add New Ticket`,

    viewMainTitleField: 'title',

    pagination: {
        responseField: 'data',
        perPageField: 'perPage',
        pageField: 'page',
        countField: 'count',
        perPage: 20
    },
}

export const gainsRouteData: RouteData = {

    pageTitle: `Gains`,
    selectedNavItem: 'Gains',
    fetchUrl: `${Appsettings.API_ENDPOINT}/gain`,
    fetchQueryStatic: `admin=true`,
    formModel: [
        { name: 'Status', placeholder: 'Status', type: 'text' }
    ],
    primaryKey: `_id`,
    addFormTitle: `Add Gain`,
    editFormTitle: `Edit Gain`,
    addButtonTitle: `Add New Gain`,

    viewMainTitleField: 'title',

    pagination: {
        responseField: 'data',
        perPageField: 'perPage',
        pageField: 'page',
        countField: 'count',
        perPage: 20
    },
}
