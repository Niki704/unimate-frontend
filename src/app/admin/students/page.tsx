import { studentRepo } from "@/lib/repositories/student.repo";
import { PageHeader } from "@/components/layout/dashboard-shell";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/table";
import { AccountStatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { format, parseISO } from "date-fns";

export default async function AdminStudentsPage() {
  const students = await studentRepo.getAll();

  return (
    <div>
      <PageHeader
        title="Students"
        description={`${students.length} registered student${students.length !== 1 ? "s" : ""}`}
      />
      {students.length === 0 ? (
        <EmptyState
          title="No students yet"
          description="Students will appear here once they register."
        />
      ) : (
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Student ID</TableHeaderCell>
              <TableHeaderCell>Batch</TableHeaderCell>
              <TableHeaderCell>Enrolled</TableHeaderCell>
              <TableHeaderCell>Verified By</TableHeaderCell>
              <TableHeaderCell>Registered</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {students.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-slate-900">
                  {s.firstName} {s.lastName}
                </TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>
                  <AccountStatusBadge status={s.accountStatus} />
                </TableCell>
                <TableCell>
                  {s.studentIdNumber ?? (
                    <span className="text-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {s.batchCode ?? <span className="text-slate-400">—</span>}
                </TableCell>
                <TableCell>{s.enrollmentYear}</TableCell>
                <TableCell>
                  {s.verifiedByName ?? (
                    <span className="text-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell className="text-slate-500">
                  {format(parseISO(s.createdDate), "MMM d, yyyy")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
