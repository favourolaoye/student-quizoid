import { Value } from "react-quill";

export interface TextEditorProps {
    label?: string;
    placeholder?: string;
    onChange?: (val: string) => void;
    error?: {
      message?: string;
    };
    className?: string;
    ariaLabel?: string;
    labelClassName?: string;
    value?: Value | undefined;
    showRequiredAsterik?: boolean;
    defaultValue?: string;
  }