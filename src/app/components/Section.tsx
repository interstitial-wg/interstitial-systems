"use client";

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export default function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="flex flex-col m-4 mx-auto p-4">
      <div className="mb-4 uppercase border-b-2 border-black">
        <div className="p-2 text-sm">{title}</div>
      </div>
      {children}
      <hr className="p-4 border-t-2 border-gray-300" />
    </section>
  );
}
