"use client"

import { BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onCreateClick: () => void
}

export default function Header({ onCreateClick }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">QuickPoll</h1>
              <p className="text-sm text-muted-foreground">Real-time opinion polling</p>
            </div>
          </div>
          <Button onClick={onCreateClick} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Create Poll
          </Button>
        </div>
      </div>
    </header>
  )
}
