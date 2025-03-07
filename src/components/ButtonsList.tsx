import { Button } from './Button';

type ButtonData = {
  text: string;
  action: () => void;
};

interface ButtonsListProps {
  buttons: ButtonData[];
  buttonClassName?: string;
}

export const ButtonsList: React.FC<ButtonsListProps> = ({ buttons, buttonClassName }) => {
  return (
    <div className="flex w-full flex-col gap-2">
      {buttons.map((button) => (
        <Button className={buttonClassName} onClick={button.action} text={button.text} />
      ))}
    </div>
  );
};
