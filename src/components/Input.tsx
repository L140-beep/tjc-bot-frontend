import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

export const Input: React.FC<ComponentPropsWithoutRef<'input'>> = ({
  className,
  placeholder,
  type,
  ...other
}) => {
  return (
    <div>
      <input
        className={twMerge(
          'w-72 rounded border border-gray-400 bg-transparent px-2 py-1 text-gray-200 outline-none placeholder:text-gray-500',
          className && className,
          other.disabled && 'cursor-default opacity-50',
        )}
        placeholder={placeholder}
        type={type}
        {...other}
      />
    </div>
  );
};
