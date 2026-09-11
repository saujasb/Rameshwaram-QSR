export interface SelectOption {
  value: string;
  label: string;
}

export interface FormFieldConfig {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "datetime" | "textarea" | "checkbox";
  options?: SelectOption[];
  required?: boolean;
  placeholder?: string;
}

export interface ColumnConfig<T> {
  key: string;
  label: string;
  numeric?: boolean;
  render?: (record: T) => import("react").ReactNode;
  sortable?: boolean;
  sortValue?: (record: T) => string | number | null | undefined;
}
