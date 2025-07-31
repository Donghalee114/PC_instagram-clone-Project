import React from 'react';
import '../utills/LoginPage.css'; // CSS 파일 불러오기

type InputProps = {
  type?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function Input({
  type = 'text',
  placeholder = '',
  onChange,
  className = '',
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className={`custom-input ${className}`}
    />
  );
}
