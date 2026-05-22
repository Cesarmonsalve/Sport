import { OverlayWidgetPage } from "@/components/overlay/overlay-widget-page";

export default async function OverlayMlbWidgetPage({
  params,
}: {
  params: Promise<{ widget: string }>;
}) {
  const { widget } = await params;
  return <OverlayWidgetPage sport="mlb" widget={widget} />;
}
