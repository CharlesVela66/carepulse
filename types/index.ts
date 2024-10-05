/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control } from 'react-hook-form';

export declare type CustomInputProps = {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  fieldType: FormFieldType;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
};

export enum FormFieldType {
  INPUT = 'input',
  CHECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETEON = 'skeleton',
}

export declare type ButtonProps = {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
};
