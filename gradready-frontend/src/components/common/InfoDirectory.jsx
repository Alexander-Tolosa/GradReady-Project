import React, { useState, useMemo } from 'react';
import { Search, MapPin, Clock, Phone, Mail, Building2 } from 'lucide-react';

const offices = [
  {
    id: 'library',
    name: 'University Library',
    location: 'Main Building, 2nd Floor',
    room: 'Room 201-205',
    hours: 'Mon–Fri: 7:30 AM – 6:00 PM | Sat: 8:00 AM – 12:00 PM',
    phone: '(033) 337-4841 loc. 210',
    email: 'library@usa.edu.ph',
    head: 'Ms. Elena R. Santos',
    status: 'open',
  },
  {
    id: 'registrar',
    name: "Registrar's Office",
    location: 'Administration Building, Ground Floor',
    room: 'Room 101',
    hours: 'Mon–Fri: 8:00 AM – 5:00 PM',
    phone: '(033) 337-4841 loc. 101',
    email: 'registrar@usa.edu.ph',
    head: 'Dr. Marco L. Villanueva',
    status: 'open',
  },
  {
    id: 'dean',
    name: "Dean's Office (CITE)",
    location: 'CITE Building, 3rd Floor',
    room: 'Room 301',
    hours: 'Mon–Fri: 8:00 AM – 5:00 PM',
    phone: '(033) 337-4841 loc. 301',
    email: 'cite.dean@usa.edu.ph',
    head: 'Dr. Anna Mae T. Cruz',
    status: 'open',
  },
  {
    id: 'accounting',
    name: 'Accounting Office',
    location: 'Administration Building, Ground Floor',
    room: 'Room 103-104',
    hours: 'Mon–Fri: 8:00 AM – 4:30 PM',
    phone: '(033) 337-4841 loc. 103',
    email: 'accounting@usa.edu.ph',
    head: 'Mr. Roberto A. Domingo',
    status: 'open',
  },
  {
    id: 'student-affairs',
    name: 'Student Affairs Office',
    location: 'Student Center, 2nd Floor',
    room: 'Room 210',
    hours: 'Mon–Fri: 8:00 AM – 5:00 PM',
    phone: '(033) 337-4841 loc. 210',
    email: 'studentaffairs@usa.edu.ph',
    head: 'Ms. Patricia G. Reyes',
    status: 'open',
  },
  {
    id: 'dormitory',
    name: 'Dormitory Management',
    location: 'Dormitory Building, Ground Floor',
    room: 'Room 001',
    hours: 'Mon–Sat: 7:00 AM – 9:00 PM',
    phone: '(033) 337-4841 loc. 400',
    email: 'dormitory@usa.edu.ph',
    head: 'Mr. Angelo J. Ferrer',
    status: 'open',
  },
];

export default function InfoDirectory() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOffices = useMemo(() => {
    if (!searchQuery.trim()) return offices;
    const query = searchQuery.toLowerCase();
    return offices.filter(
      (office) =>
        office.name.toLowerCase().includes(query) ||
        office.location.toLowerCase().includes(query) ||
        office.head.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Office Directory
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Find office locations, contact details, and operating hours
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search offices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            id="directory-search"
          />
        </div>
      </div>

      {/* Office Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredOffices.map((office, index) => (
          <div
            key={office.id}
            className="card p-4 animate-fade-in"
            style={{ animationDelay: `${index * 40}ms` }}
            id={`office-${office.id}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-maroon/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-maroon-light" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {office.name}
                  </h3>
                  <p className="text-xs text-zinc-500">{office.head}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-status-cleared/10 text-status-cleared uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-status-cleared" />
                Open
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-400">{office.location}</span>
                  <span className="text-zinc-600 ml-1">• {office.room}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Clock className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-0.5" />
                <span className="text-zinc-400">{office.hours}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                <span className="text-zinc-400">{office.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                <span className="text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer">
                  {office.email}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOffices.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <Search className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500">No offices found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
