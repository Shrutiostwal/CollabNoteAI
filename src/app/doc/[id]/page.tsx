"use client";

import Document from "@/components/Document/Document";
// params = to access the variable in url
const DocumentPage = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <div className="flex flex-col flex-1">
      <Document id={id} />
    </div>
  );
};
export default DocumentPage;
