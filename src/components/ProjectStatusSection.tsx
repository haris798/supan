import React from 'react';
import { Globe, Server, Calendar, CheckCircle2 } from 'lucide-react';
import { SupabaseProject } from '../types';

interface ProjectStatusSectionProps {
  project: SupabaseProject;
  onCardClick?: (metricName: string) => void;
}

export const ProjectStatusSection: React.FC<ProjectStatusSectionProps> = ({
  project,
  onCardClick
}) => {
  return (
    <div className="w-full space-y-2">
      {/* Cards 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Region */}
        <div
          onClick={() => onCardClick && onCardClick('Region')}
          className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors">
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-medium text-gray-400 truncate">Region</span>
            <span className="block text-sm sm:text-base font-bold text-white tracking-wide truncate">
              {project.region}
            </span>
          </div>
        </div>

        {/* Card 2: IP Address */}
        <div
          onClick={() => onCardClick && onCardClick('IP Address')}
          className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors">
            <Server className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-medium text-gray-400 truncate">IP Address</span>
            <span className="block text-sm sm:text-base font-bold text-white tracking-wide truncate">
              {project.ipAddress}
            </span>
          </div>
        </div>

        {/* Card 3: Created Date */}
        <div
          onClick={() => onCardClick && onCardClick('Created Date')}
          className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-medium text-gray-400 truncate">Created</span>
            <span className="block text-sm sm:text-base font-bold text-white tracking-wide truncate">
              {project.createdAt}
            </span>
          </div>
        </div>

        {/* Card 4: Status */}
        <div
          onClick={() => onCardClick && onCardClick('Status')}
          className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors relative">
            <CheckCircle2 className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-medium text-gray-400 truncate">Status</span>
            <span className="block text-sm sm:text-base font-bold text-white tracking-wide truncate flex items-center space-x-1">
              <span>{project.status}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
