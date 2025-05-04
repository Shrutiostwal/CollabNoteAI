"use client";

import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";

const SidebarOption = ({ href, id }: { href: string; id: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const pathname = usePathname();
  const isActive = href.includes(pathname) && pathname !== "/";
  const { isMobile, setOpenMobile } = useSidebar();

  if (!data) return null;

  const closeSideBar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} onClick={closeSideBar}>
        <Link href={href}>
          <p className="truncate">{data.title}</p>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
export default SidebarOption;
