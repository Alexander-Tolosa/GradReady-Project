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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl text-white tracking-wider">
            Office Directory
          </h2>
          <p className="text-sm font-body text-white/40 mt-1">
            Find office locations, contact details, and operating hours
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOffices.map((office, index) => (
          <div
            key={office.id}
            className="glass-card p-5 animate-slide-up"
            style={{ animationDelay: `${index * 60}ms` }}
            id={`office-${office.id}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-usa-maroon/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-usa-gold" />
                </div>
                <div>
                  <h3 className="text-base font-body font-semibold text-white">
                    {office.name}
                  </h3>
                  <p className="text-xs font-body text-white/30">{office.head}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-body font-semibold bg-status-cleared/10 text-status-cleared border border-status-cleared/20 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-status-cleared animate-pulse-soft" />
                Open
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 text-sm font-body">
                <MapPin className="w-4 h-4 text-white/20 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-white/60">{office.location}</span>
                  <span className="text-white/30 ml-1">• {office.room}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-sm font-body">
                <Clock className="w-4 h-4 text-white/20 flex-shrink-0 mt-0.5" />
                <span className="text-white/60">{office.hours}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-body">
                <Phone className="w-4 h-4 text-white/20 flex-shrink-0" />
                <span className="text-white/60">{office.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-body">
                <Mail className="w-4 h-4 text-white/20 flex-shrink-0" />
                <span className="text-usa-gold/80 hover:text-usa-gold transition-colors cursor-pointer">
                  {office.email}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOffices.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <Search className="w-12 h-12 text-white/10 mx-auto mb-3" />
          <p className="text-white/30 font-body">No offices found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
