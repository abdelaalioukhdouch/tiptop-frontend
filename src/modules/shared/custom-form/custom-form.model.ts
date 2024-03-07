import { AutoChipsConfigModel } from './auto-chips/auto-chips.component';
export class CustomFormModel {
    name: string;
    type:
        'text'
        | 'email'
        | 'number'
        | 'password'
        | 'date'
        | 'time'
        | 'textarea'
        | 'select'
        | 'file'
        | 'quill-editor'
        | 'checkbox'
        | 'color'
        | 'radio'
        | 'date'
        | 'cropper'
        | 'file'
        | 'autochips'
        | 'hidden'
        | 'default'
        ;
    value?: any;
    options?:any;
    placeholder?: string;
    default?: string;
    hint?: string;
    url?: string;//url if data needs to be fetched
    queryField?: string;//query of data
    localSource?: any[]= [];
    bindField?= "id";//for material select
    showField?: string;//for material select
    showField2Prefix?: string;
    showField2?: string;
    showField3?: string;
    showField3Prefix?: string;
    showField4?: string;
    showField4Prefix?: string;
    responseField?: string;//for material select
    selectSuffix?= '';//for material select
    multiple?= false;//for material select
    hasNone?= false;//for material select
    ifField?: string;
    ifField2?: string;
    ifFieldPresent?: boolean;
    ifFieldPresent2?: boolean;
    ifFieldValue?: string;
    isArray?: boolean;
    required?= false;
    suffixLabel?: string;
    disabled?= false;
    hasOther?= false;
    maxlength?: number;
    //////////////////////////////////
    checkDuplicate?= false;
    uniqueKey?: string = 'id';
    //////////////////////////////////
    config?: any;//first case using ckeditor config

    tooltip?: string;
    searchInput?: boolean;

    icon?: string;
    disabledWhenUpdate?= false;
    secondaryValidationField?: string;
    cropperOptions?: {
        roundCorner?: boolean,
        maintainAspectRatio?: boolean,
        aspectRatio?: number,
        resizeToWidth?: number,
        preview?: boolean
    };
    documentOptions?: {
        showLabels: boolean,
        maxFileSize: number,
        fetch: boolean,
        queueLimit: number,
        filesLimit: number,
        allowedFileType: string[],
        urlPrefix?: string
    };
    requiredIf?: {
        logic: 'or' | 'and',
        rules: { field: string, values: string[] }[]
    }

    chipsConfig?: AutoChipsConfigModel;
}