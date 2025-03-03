import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  text: string;
}

export const Button: React.FC<ButtonProps> = ({ text, className, ...other }) => {
  return (
    <button
      {...other}
      className={twMerge(
        'h-8 w-20 cursor-pointer rounded border border-gray-400 bg-[#5e7291] text-gray-200',
        className && className,
      )}
    >
      {text}
    </button>
  );
};
