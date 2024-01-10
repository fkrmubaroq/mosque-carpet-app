import Image from "next/image";

export default function Maintenance() {
  return (
    <section className="min-h-screen mt-32 lg:mt-56 tracking-wide text-gray-800">
      <div className="flex flex-col justify-center gap-y-3 items-center">
        <div className="text-3xl font-semibold">Oppss</div>
        <div>
          <Image src="/img/maintenance.png" width={400} height={300}/>
        </div>
        <span className="text-2xl font-semibold">
          Website sedang dalam perbaikan
        </span>
        <span className="text-gray-400">
          Silahkan coba beberapa saat lagi ya
        </span>
      </div>
    </section>
  );
}