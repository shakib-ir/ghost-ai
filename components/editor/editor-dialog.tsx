import type { ReactNode } from "react"

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type EditorDialogContentProps = {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer: ReactNode
}

/**
 * Shared dialog layout for editor features. It is intentionally only a
 * content pattern; individual dialogs will provide their own root and trigger
 * when those features are implemented.
 */
export function EditorDialogContent({
  title,
  description,
  children,
  footer,
}: EditorDialogContentProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description ? (
          <DialogDescription>{description}</DialogDescription>
        ) : null}
      </DialogHeader>
      {children}
      <DialogFooter>{footer}</DialogFooter>
    </DialogContent>
  )
}
