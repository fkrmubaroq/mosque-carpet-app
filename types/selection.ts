export type TSelection = {
  value: string;
  onReset?: () => void;
  required?: boolean;
  placeholder?: string;
  invalid?: string;
};