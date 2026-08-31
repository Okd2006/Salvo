/**
 * src/ui/components/audit/AuditFilters.tsx
 *
 * Search and filtering controls for the audit ledger
 */
import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/button.js';

export interface AuditFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedEventType: string;
  onEventTypeChange: (t: string) => void;
  selectedActor: string;
  onActorChange: (a: string) => void;
  onResetFilters: () => void;
}

export const AuditFilters: React.FC<AuditFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedEventType,
  onEventTypeChange,
  selectedActor,
  onActorChange,
  onResetFilters,
}) => {
  const hasActiveFilters = searchQuery !== '' || selectedEventType !== 'ALL' || selectedActor !== 'ALL';

  return (
    <div className="p-4 rounded-[16px] bg-[#020626]/95 border border-border-hairline flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-text-tertiary pointer-events-none" />
        <input
          type="text"
          placeholder="Filter by Transaction ID or Event ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#03081A] border border-border-hairline text-white font-sans text-xs rounded-[10px] py-1.5 pl-8 pr-3 focus:border-primary focus:outline-none transition-all placeholder:text-text-tertiary"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
        {/* Event Type Filter */}
        <select
          value={selectedEventType}
          onChange={(e) => onEventTypeChange(e.target.value)}
          className="bg-[#03081A] border border-border-hairline text-text-secondary font-mono text-xs rounded-[10px] py-1.5 px-3 focus:border-primary focus:outline-none"
        >
          <option value="ALL">All Event Types</option>
          <option value="transaction_created">Transaction Created</option>
          <option value="diagnosis_completed">Diagnosis Completed</option>
          <option value="policy_checked">Policy Checked</option>
          <option value="action_approved">Action Approved</option>
          <option value="action_executed">Action Executed</option>
          <option value="action_blocked">Action Blocked</option>
          <option value="recovery_completed">Recovery Completed</option>
        </select>

        {/* Actor Filter */}
        <select
          value={selectedActor}
          onChange={(e) => onActorChange(e.target.value)}
          className="bg-[#03081A] border border-border-hairline text-text-secondary font-mono text-xs rounded-[10px] py-1.5 px-3 focus:border-primary focus:outline-none"
        >
          <option value="ALL">All Subsystems</option>
          <option value="system">System Core</option>
          <option value="gemini_agent">AI Analyst (Groq/Gemini)</option>
          <option value="policy_gate">Deterministic Policy Gate</option>
          <option value="razorpay_executor">Razorpay Executor</option>
        </select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-8 text-xs font-mono gap-1 text-text-tertiary hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear</span>
          </Button>
        )}
      </div>
    </div>
  );
};
