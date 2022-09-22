import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'dotfield'
})
export class DotfieldPipe implements PipeTransform {
    transform(obj: any, field: any): string {
        return DotfieldPipe.dottedField(obj, field);
    }

    public static dottedField(obj: any, field2: any) {
        let fields = (field2 || "").split(".");
        let value = obj;
        fields.forEach((field: string) => {
            try {
                value = value[field];
            } catch (err) {
                console.warn("Error", obj, field2);
            }
        })
        return value || '';
    }
}