import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
}

export default function Select({
  id,
  value,
  onChange,
  children,
  className = "",
  ...props
}: SelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={
        `border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full ` +
        className
      }
      {...props}
    >
      {children}
    </select>
  );
}
