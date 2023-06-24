// import { useState } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";

// const localizer = momentLocalizer(moment);

// const MyCalendar = () => {
//   const [title, setTitle] = useState("");
//   const [start, setStart] = useState(new Date());
//   const [end, setEnd] = useState(new Date());

//   const [events, setEvents] = useState([
//     {
//       title: "Task 1",
//       start: new Date(2023, 5, 15, 10, 0), // example start time
//       end: new Date(2023, 5, 15, 12, 0), // example end time
//     },
//     {
//       title: "Task 2",
//       start: new Date(2023, 5, 16, 14, 0), // example start time
//       end: new Date(2023, 5, 16, 16, 0), // example end time
//     },
//     // Add more tasks here
//   ]);

//   const handleEventCreation = (e: any) => {
//     e.preventDefault();
//     const newEvent = {
//       title: title,
//       start: start,
//       end: end,
//     };

//     setEvents([...events, newEvent]);
//   };

//   const handleEventUpdate = (updatedEvent: any) => {
//     const updatedEvents = events.map((event) =>
//       event.title === updatedEvent.title ? updatedEvent : event
//     );

//     setEvents(updatedEvents);
//   };

//   const handleEventDelete = (deletedEvent: any) => {
//     const filteredEvents = events.filter(
//       (event) => event.title !== deletedEvent.title
//     );

//     setEvents(filteredEvents);
//   };

//   return (
//     <div>
//       {/* Event Creation Form */}
//       <form onSubmit={handleEventCreation}>
//         <input
//           type="text"
//           placeholder="Title"
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <input
//           type="datetime-local"
//           onChange={(e) => setStart(new Date(e.target.value))}
//         />
//         <input
//           type="datetime-local"
//           onChange={(e) => setEnd(new Date(e.target.value))}
//         />
//         <button type="submit">Create Event</button>
//       </form>

//       {/* Calendar */}
//       <Calendar
//         localizer={localizer}
//         events={events}
//         startAccessor="start"
//         endAccessor="end"
//         onSelectEvent={(event) => handleEventUpdate(event)}
//         onDoubleClickEvent={(event) => handleEventDelete(event)}
//       />
//     </div>
//   );
// };

import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Event } from "./types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Rootpage from "./components/auth/Rootpage";

const localizer = momentLocalizer(moment);

type Props = {};

export const MyCalendar: React.FC<Props> = () => {
  const [title, setTitle] = useState<string>("");
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([
    {
      title: "Task 1",
      start: new Date(2023, 5, 15, 10, 0), // example start time
      end: new Date(2023, 5, 15, 12, 0), // example end time
    },
    {
      title: "Task 2", 
      start: new Date(2023, 5, 16, 14, 0), // example start time
      end: new Date(2023, 5, 16, 16, 0), // example end time
    },
  ]);

  const handleEventCreation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newEvent = {
      title: title,
      start: start,
      end: end,
    };

    setEvents([...events, newEvent]);
  };

  const handleEventUpdate = () => {
    if (selectedEvent) {
      const updatedEvents = events.map((event) =>
        event.title === selectedEvent.title ? selectedEvent : event
      );
      setEvents(updatedEvents);
      setSelectedEvent(null);
    }
  };

  const handleEventDelete = () => {
    if (selectedEvent) {
      const filteredEvents = events.filter(
        (event) => event.title !== selectedEvent.title
      );

      setEvents(filteredEvents);
      setSelectedEvent(null);
    }
  };

  return (
    <div>
      {/* Event Creation Form */}
      <form onSubmit={handleEventCreation}>
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="datetime-local"
          onChange={(e) => setStart(new Date(e.target.value))}
        />
        <input
          type="datetime-local"
          onChange={(e) => setEnd(new Date(e.target.value))}
        />
        <button type="submit">Create Event</button>
      </form>

      {/* Event Update and Delete Buttons */}
      {selectedEvent && (
        <div>
          <form onSubmit={handleEventUpdate}>
            <input
              type="text"
              placeholder="Title"
              value={selectedEvent.title}
              onChange={(e) =>
                setSelectedEvent({
                  ...selectedEvent,
                  title: e.target.value,
                })
              }
            />
            <input
              type="datetime-local"
              value={moment(selectedEvent.start).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) =>
                setSelectedEvent({
                  ...selectedEvent,
                  start: new Date(e.target.value),
                })
              }
            />
            <input
              type="datetime-local"
              value={moment(selectedEvent.end).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) =>
                setSelectedEvent({
                  ...selectedEvent,
                  end: new Date(e.target.value),
                })
              }
            />
            <button type="submit">Update Event</button>
          </form>

          <form onSubmit={handleEventDelete}>
            <button type="submit">Delete Event</button>
          </form>
        </div>
      )}

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(event) => setSelectedEvent(event)}
      />
    </div>
  );
};

function App() {
  return (
    <>
      <Rootpage />
    </>
  );
}

export default App;
