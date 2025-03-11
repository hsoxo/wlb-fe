import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useGetAllKnowledges } from "@/queries/knowledges";

interface KnowledgeTableProps {
  kbId: string;
}

const KnowledgeTable = ({ kbId }: KnowledgeTableProps) => {
  const { data: knowledges, isLoading, error } = useGetAllKnowledges(kbId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>内容</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>更新时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {knowledges?.items.map((knowledge) => (
            <TableRow key={knowledge.id}>
              <TableCell className="max-w-[100px] overflow-hidden text-ellipsis">
                {knowledge.id}
              </TableCell>
              <TableCell className="max-w-[500px] overflow-hidden text-ellipsis">
                {knowledge.content}
              </TableCell>
              <TableCell className="max-w-[100px] overflow-hidden text-ellipsis">
                {knowledge.createdAt}
              </TableCell>
              <TableCell className="max-w-[100px] overflow-hidden text-ellipsis">
                {knowledge.updatedAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default KnowledgeTable;
