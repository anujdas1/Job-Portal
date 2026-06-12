import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api/axiosClient';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Helper component for draggable applicant card
function DraggableCard({ id, applicant }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  // Color based on aiMatchScore
  const score = applicant.aiMatchScore ?? 0;
  let bg = 'bg-gray-100';
  if (score > 80) bg = 'bg-green-200';
  else if (score > 60) bg = 'bg-yellow-200';

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`p-2 mb-2 rounded ${bg} cursor-move dark:text-gray-900`}>
      <p className="font-medium">{applicant.candidateId?.name || 'Unknown Candidate'}</p>
      <p className="text-sm">Score: {score}%</p>
    </div>
  );
}

export default function KanbanBoard() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState({}); // {status: [applicant]}
  const statuses = ['Applied', 'Interviewing', 'Rejected', 'Offer'];

  // Fetch applications for the job
  useEffect(() => {
    const fetchApps = async () => {
      try {
        // Backend applicationController list route takes query params
        const res = await api.get(`/api/applications?jobId=${jobId}`);
        // Data comes back as an array, but Kanban needs an object mapped by status
        const applicationsArray = res.data || [];
        const mappedApps = { Applied: [], Interviewing: [], Rejected: [], Offer: [] };
        
        applicationsArray.forEach(app => {
           if (mappedApps[app.status]) {
             mappedApps[app.status].push(app);
           }
        });

        setApplications(mappedApps);
      } catch (e) {
        console.error('Failed to load applications', e);
      }
    };
    if (jobId) fetchApps();
  }, [jobId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const [fromStatus, fromIndex] = active.id.split('|');
    const [toStatus, toIndex] = over.id.split('|');
    if (fromStatus === toStatus && fromIndex === toIndex) return;

    // Move item in local state
    setApplications((prev) => {
      const sourceList = [...prev[fromStatus]];
      const [moved] = sourceList.splice(fromIndex, 1);
      const destList = [...prev[toStatus]];
      destList.splice(toIndex, 0, moved);
      return { ...prev, [fromStatus]: sourceList, [toStatus]: destList };
    });

    // Persist change via API
    try {
      await api.patch(`/api/applications/${active.id.split('|')[2]}/status`, { status: toStatus });
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-4 gap-4 p-4">
        {statuses.map((status) => (
          <Card key={status} className="h-full">
            <CardHeader>
              <CardTitle>{status}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 overflow-y-auto max-h-96">
              <SortableContext items={applications[status]?.map((app, idx) => `${status}|${idx}|${app._id}`) ?? []} strategy={verticalListSortingStrategy}>
                {applications[status]?.map((app, idx) => (
                  <DraggableCard key={app._id} id={`${status}|${idx}|${app._id}`} applicant={app} />
                ))}
              </SortableContext>
            </CardContent>
          </Card>
        ))}
      </div>
    </DndContext>
  );
}
