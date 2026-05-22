"use client";

import { createContext, useContext } from "react";

type EditorSyncContextValue = {
  publishNow: () => void;
};

const EditorSyncContext = createContext<EditorSyncContextValue>({
  publishNow: () => {},
});

export function EditorSyncProvider({
  publishNow,
  children,
}: {
  publishNow: () => void;
  children: React.ReactNode;
}) {
  return (
    <EditorSyncContext.Provider value={{ publishNow }}>{children}</EditorSyncContext.Provider>
  );
}

export function useEditorSync() {
  return useContext(EditorSyncContext);
}
