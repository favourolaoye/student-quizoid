"use client";
import clsx from "clsx";
import { TextEditorProps } from "./type";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const TextEditor = ({
  defaultValue,
  error,
  ariaLabel,
  label,
  className,
  labelClassName,
  placeholder,
  value,
  onChange,
  showRequiredAsterik = false,
}: TextEditorProps) => {
  return (
    <div className="py-3">
      {label && (
        <label
          htmlFor={label || ariaLabel}
          className={`block text-xs font-medium  ${
            labelClassName ? labelClassName : ""
          }`}
        >
          {label}{" "}
          {showRequiredAsterik && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative mt-1 rounded-md h-56">
        <ReactQuill
          className={clsx("h-48 rounded", className)}
          theme="snow"
          value={value ?? defaultValue}
          defaultValue={defaultValue}
          onChange={(value) => onChange?.(value)}
          placeholder={placeholder}
        />
      </div>
      <p className="text-red-500 text-xs pt-4">{error?.message}</p>
    </div>
  );
};

export default TextEditor;
