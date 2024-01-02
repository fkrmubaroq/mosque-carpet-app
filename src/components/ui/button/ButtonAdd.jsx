import { Button } from ".";

export default function ButtonAdd({
  text,
  onClick,
}) {
  return (
    <Button onClick={onClick}>
      Tambah {text}
    </Button>
  );
}
