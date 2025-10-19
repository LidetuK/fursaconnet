
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Clock } from 'lucide-react';

interface Consultation {
  expert: string;
  topic: string;
  date: string;
  time: string;
  status: string;
}

interface ConsultationListProps {
  consultations: Consultation[];
}

const ConsultationList = ({ consultations }: ConsultationListProps) => {
  return (
    <div className="space-y-4">
      {consultations.map((consultation, index) => (
        <Card key={index}>
          <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="font-medium text-lg">{consultation.topic}</h3>
              <div className="flex flex-col md:flex-row md:items-center gap-x-6 text-sm text-gray-500 mt-1">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{consultation.expert}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{consultation.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{consultation.time}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  consultation.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {consultation.status}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              {consultation.status === 'Confirmed' && (
                <Button variant="outline">Add to Calendar</Button>
              )}
              <Button 
                variant={consultation.status === 'Confirmed' ? "outline" : "default"}
                className={consultation.status === 'Confirmed' ? "" : "bg-skilllink-green hover:bg-skilllink-dark-green"}
              >
                {consultation.status === 'Confirmed' ? 'Reschedule' : 'Confirm'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConsultationList;
