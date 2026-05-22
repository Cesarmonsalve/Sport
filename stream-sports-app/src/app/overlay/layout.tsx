import { OverlayBodyReset } from "@/components/overlay/overlay-body";

export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: 1920,
        height: 1080,
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <OverlayBodyReset />
      {children}
    </div>
  );
}
