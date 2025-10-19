
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimeSlot {
  date: string;
  slots: string[];
}

interface TimeSlotSelectorProps {
  availableSlots: TimeSlot[];
  onSelectSlot?: (date: string, time: string) => void;
}

const TimeSlotSelector = ({ availableSlots, onSelectSlot }: TimeSlotSelectorProps) => {
  return (
    <div>
      <h3 className="font-medium text-lg mb-4">3. Select a Date and Time</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {availableSlots.map((day, index) => (
          <Card key={index}>
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm">{day.date}</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {day.slots.map((time, i) => (
                  <div 
                    key={i}
                    className="text-sm py-1 px-2 bg-gray-100 rounded hover:bg-skilllink-green hover:text-white cursor-pointer text-center"
                    onClick={() => onSelectSlot?.(day.date, time)}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
