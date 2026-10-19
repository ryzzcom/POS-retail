"use client";

import * as React from "react";
import { StaffMember, StaffRole } from "../types";
import { MOCK_STAFF_MEMBERS, INITIAL_ROLE_PERMISSIONS } from "../constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { SegmentedFilter } from "@/components/ui/segmented-filter";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import { Switch } from "@/components/ui/switch";
import { AddStaffDialog } from "./AddStaffDialog";
import { Dialog } from "@/components/ui/dialog";
import {
  Users,
  UserCheck,
  ShieldAlert,
  Monitor,
  UserPlus,
  KeyRound,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const ROLE_FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Cashier", value: "cashier" },
  { label: "Manager", value: "manager" },
  { label: "Inventory Clerk", value: "inventory_clerk" },
  { label: "Owner", value: "owner" },
];

export function TeamPermissionsTab() {
  const [staffList, setStaffList] = React.useState<StaffMember[]>(MOCK_STAFF_MEMBERS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");

  // Modal states
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState<StaffMember | null>(null);
  const [deletingMember, setDeletingMember] = React.useState<StaffMember | null>(null);

  // Permission Matrix state
  const [permissions, setPermissions] = React.useState(INITIAL_ROLE_PERMISSIONS);
  const [permSuccess, setPermSuccess] = React.useState(false);

  // KPI calculations
  const totalStaff = staffList.length;
  const activeCashiers = staffList.filter(
    (s) => s.role === "cashier" && s.status === "active"
  ).length;
  const storeManagers = staffList.filter((s) => s.role === "manager").length;
  const activeTerminals = 2;

  // Filtered staff list
  const filteredStaff = React.useMemo(() => {
    return staffList.filter((member) => {
      const matchesRole =
        roleFilter === "all" || member.role === (roleFilter as StaffRole);
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query) ||
        member.assignedTerminal.toLowerCase().includes(query);
      return matchesRole && matchesSearch;
    });
  }, [staffList, searchQuery, roleFilter]);

  const handleSaveStaff = (member: StaffMember) => {
    setStaffList((prev) => {
      const exists = prev.some((s) => s.id === member.id);
      if (exists) {
        return prev.map((s) => (s.id === member.id ? member : s));
      }
      return [member, ...prev];
    });
  };

  const handleToggleStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status: s.status === "active" ? "suspended" : "active",
          };
        }
        return s;
      })
    );
  };

  const handleDeleteStaff = () => {
    if (!deletingMember) return;
    setStaffList((prev) => prev.filter((s) => s.id !== deletingMember.id));
    setDeletingMember(null);
  };

  const handleSavePermissions = () => {
    setPermSuccess(true);
    setTimeout(() => setPermSuccess(false), 3000);
  };

  // Staff Table Column Definitions
  const columns: ColumnDef<StaffMember>[] = [
    {
      id: "name",
      header: "Staff Member",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <p className="font-heading font-medium text-heading text-xs sm:text-sm">
            {row.name}
          </p>
          <p className="text-[11px] text-body font-sans">
            {row.phone} · {row.email}
          </p>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
      cell: (row) => {
        if (row.role === "owner") {
          return (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-accent/20 text-accent border border-accent/40">
              Store Owner
            </span>
          );
        }
        if (row.role === "manager") {
          return (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-primary text-dark-primary">
              Manager
            </span>
          );
        }
        if (row.role === "inventory_clerk") {
          return (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-subtle text-body border border-default">
              Inventory
            </span>
          );
        }
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-theme text-heading border border-default/70">
            Cashier
          </span>
        );
      },
    },
    {
      id: "terminal",
      header: "Terminal / Station",
      accessorKey: "assignedTerminal",
      cell: (row) => (
        <span className="text-body text-xs sm:text-sm flex items-center gap-1.5">
          <Monitor className="size-3.5 text-muted" />
          <span>{row.assignedTerminal}</span>
        </span>
      ),
    },
    {
      id: "pin",
      header: "POS PIN",
      accessorKey: "pinSet",
      align: "center",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-mono font-medium ${
            row.pinSet ? "text-status-success" : "text-status-error"
          }`}
        >
          <KeyRound className="size-3" />
          <span>{row.pinSet ? "Configured" : "Not Set"}</span>
        </span>
      ),
    },
    {
      id: "lastActive",
      header: "Last Active",
      accessorKey: "lastActive",
      cell: (row) => <span className="text-xs text-body">{row.lastActive}</span>,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      align: "center",
      cell: (row) => (
        <Badge
          variant={row.status === "active" ? "success" : "failed"}
          className="capitalize text-[11px]"
        >
          {row.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingMember(row);
              setIsAddOpen(true);
            }}
            className="h-8 px-2 text-xs text-body hover:text-heading"
          >
            <Edit2 className="size-3.5" />
          </Button>

          {row.role !== "owner" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleStatus(row.id)}
                title={row.status === "active" ? "Suspend user" : "Activate user"}
                className="h-8 px-2 text-xs text-body hover:text-heading"
              >
                {row.status === "active" ? (
                  <Lock className="size-3.5 text-status-warning" />
                ) : (
                  <Unlock className="size-3.5 text-status-success" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeletingMember(row)}
                className="h-8 px-2 text-xs text-status-error hover:bg-status-error-bg"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4-Metric Summary KPI Strip */}
      <div className="bg-card rounded-[18px] border border-default/50 p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-default/40">
          <div>
            <p className="text-xs font-sans text-body">Total staff accounts</p>
            <p className="font-heading font-semibold text-lg sm:text-2xl text-heading mt-1">
              {totalStaff}
            </p>
          </div>

          <div className="pt-3 sm:pt-0 sm:pl-6">
            <p className="text-xs font-sans text-body">Active cashiers</p>
            <p className="font-heading font-semibold text-lg sm:text-2xl text-status-success mt-1">
              {activeCashiers}
            </p>
          </div>

          <div className="pt-3 sm:pt-0 sm:pl-6">
            <p className="text-xs font-sans text-body">Store managers</p>
            <p className="font-heading font-semibold text-lg sm:text-2xl text-heading mt-1">
              {storeManagers}
            </p>
          </div>

          <div className="pt-3 sm:pt-0 sm:pl-6">
            <p className="text-xs font-sans text-body">Active POS terminals</p>
            <p className="font-heading font-semibold text-lg sm:text-2xl text-accent mt-1">
              {activeTerminals}
            </p>
          </div>
        </div>
      </div>

      {/* Staff Directory Table Card */}
      <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between p-4 sm:p-5 gap-3">
          <div>
            <h3 className="font-heading font-semibold text-heading text-base sm:text-lg">
              Staff & Cashier Directory
            </h3>
            <p className="text-xs text-body font-sans mt-0.5">
              Manage operators, roles, 4-digit PIN authentication, and counter assignments.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingMember(null);
              setIsAddOpen(true);
            }}
            className="gap-2 text-xs font-medium"
          >
            <UserPlus className="size-3.5" />
            <span>Add staff / cashier</span>
          </Button>
        </div>

        {/* Toolbar: Search & Role Filters */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-5 pb-3 gap-3">
          <SearchInput
            placeholder="Search by name, phone, or terminal..."
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            className="w-full sm:w-72"
            sizeVariant="sm"
          />

          <SegmentedFilter
            sizeVariant="sm"
            options={ROLE_FILTER_OPTIONS}
            value={roleFilter}
            onChange={setRoleFilter}
          />
        </div>

        <DataTable
          data={filteredStaff}
          columns={columns}
          keyExtractor={(item) => item.id}
          roundedTop={false}
        />
      </div>

      {/* Role Permission Matrix Card */}
      <div className="bg-card rounded-[18px] border border-default/50 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-default/40 flex-wrap gap-2">
          <div>
            <h3 className="font-heading font-semibold text-heading text-base sm:text-lg">
              Role Permission Matrix & POS Security
            </h3>
            <p className="text-xs text-body font-sans mt-0.5">
              Granular access controls separating Front Cashiers from Shift Managers.
            </p>
          </div>

          {permSuccess && (
            <span className="text-xs font-medium text-status-success flex items-center gap-1">
              <CheckCircle2 className="size-3.5" /> Permissions saved
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Permission Item 1 */}
          <div className="p-4 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
            <div>
              <p className="font-heading font-medium text-heading text-sm">
                Allow manual line discount at register
              </p>
              <p className="text-xs text-body font-sans mt-0.5">
                Cashiers can apply item-level price reductions up to allowed cap.
              </p>
            </div>
            <Switch
              checked={permissions.allowManualDiscount}
              onCheckedChange={(checked) =>
                setPermissions((p) => ({ ...p, allowManualDiscount: checked }))
              }
            />
          </div>

          {/* Permission Item 2 */}
          <div className="p-4 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
            <div>
              <p className="font-heading font-medium text-heading text-sm">
                Process returns & refunds without Owner PIN
              </p>
              <p className="text-xs text-body font-sans mt-0.5">
                Managers can approve item exchanges directly on the terminal.
              </p>
            </div>
            <Switch
              checked={permissions.processReturnsWithoutPin}
              onCheckedChange={(checked) =>
                setPermissions((p) => ({ ...p, processReturnsWithoutPin: checked }))
              }
            />
          </div>

          {/* Permission Item 3 */}
          <div className="p-4 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
            <div>
              <p className="font-heading font-medium text-heading text-sm">
                View inventory unit costs & margins
              </p>
              <p className="text-xs text-body font-sans mt-0.5">
                Restricted to Store Owner and designated Managers only.
              </p>
            </div>
            <Switch
              checked={permissions.viewCostAndMargins}
              onCheckedChange={(checked) =>
                setPermissions((p) => ({ ...p, viewCostAndMargins: checked }))
              }
            />
          </div>

          {/* Permission Item 4 */}
          <div className="p-4 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
            <div>
              <p className="font-heading font-medium text-heading text-sm">
                Open cash drawer without sale
              </p>
              <p className="text-xs text-body font-sans mt-0.5">
                No-sale drawer kick for change exchange or cash counts.
              </p>
            </div>
            <Switch
              checked={permissions.openDrawerWithoutSale}
              onCheckedChange={(checked) =>
                setPermissions((p) => ({ ...p, openDrawerWithoutSale: checked }))
              }
            />
          </div>

          {/* Permission Item 5 */}
          <div className="p-4 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
            <div>
              <p className="font-heading font-medium text-heading text-sm">
                Edit Khata credit limits at checkout
              </p>
              <p className="text-xs text-body font-sans mt-0.5">
                Allows counter staff to adjust customer credit ceiling on demand.
              </p>
            </div>
            <Switch
              checked={permissions.editKhataCreditLimit}
              onCheckedChange={(checked) =>
                setPermissions((p) => ({ ...p, editKhataCreditLimit: checked }))
              }
            />
          </div>

          {/* Permission Item 6: Cap Slider */}
          <div className="p-4 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
            <div>
              <p className="font-heading font-medium text-heading text-sm">
                Default cashier discount threshold
              </p>
              <p className="text-xs text-body font-sans mt-0.5">
                Current limit: {permissions.maxCashierDiscountPercent}% without manager override.
              </p>
            </div>
            <span className="text-sm font-semibold font-heading px-3 py-1 rounded-[12px] bg-subtle text-heading border border-default">
              {permissions.maxCashierDiscountPercent}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <Button variant="primary" size="sm" onClick={handleSavePermissions}>
            Save permission policies
          </Button>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      <AddStaffDialog
        open={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveStaff}
        editingMember={editingMember}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deletingMember)}
        onClose={() => setDeletingMember(null)}
        title="Remove Staff Account?"
        subtitle="This will revoke POS terminal access and disable authentication for this user."
        maxWidthClass="w-full sm:max-w-[440px]"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingMember(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteStaff}
            >
              Remove account
            </Button>
          </div>
        }
      >
        <div className="p-4 rounded-[14px] bg-status-error-bg/60 border border-status-error/30 text-xs text-body font-sans">
          You are removing <strong className="text-heading">{deletingMember?.name}</strong> (
          {deletingMember?.role}). Shift logs and historical invoices tied to this cashier will be
          retained in audit records.
        </div>
      </Dialog>
    </div>
  );
}
