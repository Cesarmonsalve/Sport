/** Returns true if widget should render given OBS ?widget= filter */
export function shouldShowWidget(
  widgetFilter: string | null | undefined,
  widgetId: string,
  aliases: string[] = []
): boolean {
  if (!widgetFilter) return true;
  if (widgetFilter === widgetId) return true;
  return aliases.includes(widgetFilter);
}

export function widgetOnly(
  widgetFilter: string | null | undefined,
  allowedIds: string[]
): boolean {
  if (!widgetFilter) return true;
  return allowedIds.includes(widgetFilter);
}
