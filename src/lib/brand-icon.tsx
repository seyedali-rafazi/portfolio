import { ImageResponse } from "next/og";
import { SrMark } from "@/components/common/SrMark";

/** Renders the SR brand mark as a PNG (favicons / app icons). */
export function renderBrandIcon(size: number, rounded = true) {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <SrMark size={size} rounded={rounded} />
      </div>
    ),
    { width: size, height: size },
  );
}
