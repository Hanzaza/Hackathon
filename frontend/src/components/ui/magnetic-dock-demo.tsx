"use client"

import {
    MagneticDock,
    DockIconHome,
    DockIconSearch,
    DockIconFolder,
    DockIconMail,
    DockIconMusic,
    DockIconSettings,
    DockIconTrash,
} from "@/components/ui/magnetic-dock"

export default function MagneticDockDemo() {
    const items = [
        { id: "home", label: "Home", icon: <DockIconHome />, isActive: true },
        { id: "search", label: "Search", icon: <DockIconSearch /> },
        { id: "files", label: "Files", icon: <DockIconFolder /> },
        { id: "mail", label: "Mail", icon: <DockIconMail />, badge: 3 },
        { id: "music", label: "Music", icon: <DockIconMusic /> },
        { id: "settings", label: "Settings", icon: <DockIconSettings /> },
        { id: "trash", label: "Trash", icon: <DockIconTrash /> },
    ]

    return (
        <div className="flex min-h-[320px] w-full items-end justify-center pb-8">
            <MagneticDock items={items} />
        </div>
    )
}
