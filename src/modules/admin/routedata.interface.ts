import { CustomFormModel } from '../shared/custom-form/custom-form.model';
export interface RouteData {

    pageTitle: string,
    selectedNavItem: string,
    fetchUrl: string,
    fetchQueryStatic: string,
    formModel: CustomFormModel[],
    primaryKey: string,
    addFormTitle: string,
    editFormTitle: string,
    addButtonTitle: string,

    viewMainTitleField: string,
    viewMainSubtitleField?: string,
    viewMainSubtitle2Field?: string,
    body?: boolean,
    pagination?: {
        responseField: string,
        perPageField: string,
        pageField: string,
        countField: string,
        perPage: number
    },

}