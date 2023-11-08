import { Button } from ".";

export default function ButtonAdd({
  text,
  onClick,
}: React.ComponentPropsWithoutRef<"button"> & {
  text: string;
}) {
  return (
    <Button onClick={onClick}>
      Add {text}
    </Button>
  );
}
