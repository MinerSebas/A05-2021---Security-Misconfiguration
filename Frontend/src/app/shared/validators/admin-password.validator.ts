import { AbstractControl } from '@angular/forms';

export function forbiddenAdminPassword(control: AbstractControl): { [key: string]: any } | null {
  let regexABC = new RegExp('[A-Z]+');

  if (!regexABC.test(control.value)) {
    return { unallowedpassword: { value: control.value } };
  }

  let regexabc = new RegExp('[a-z]+');

  if (!regexabc.test(control.value)) {
    return { unallowedpassword: { value: control.value } };
  }

  let regex123 = new RegExp('[0-9]+');

  if (!regex123.test(control.value)) {
    return { unallowedpassword: { value: control.value } };
  }

  let regexSpecial = new RegExp('[^A-Za-z0-9]+');

  if (!regexSpecial.test(control.value)) {
    return { unallowedpassword: { value: control.value } };
  }

  return null;
}
