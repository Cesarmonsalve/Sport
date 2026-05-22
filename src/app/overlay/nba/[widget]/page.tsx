import { OverlayWidgetPage } from "@/components/overlay/overlay-widget-page";

export default async function OverlayNbaWidgetPage({
  params,
}: {
  params: Promise<{ widget: string }>;
}) {
  const { widget } = await params;
  return <OverlayWidgetPage sport="nba" widget={widget} />;
}
