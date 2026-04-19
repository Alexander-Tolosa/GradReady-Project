import React from 'react';
import { User, Book, Phone, Mail, Building, LogIn, Award } from 'lucide-react';

export default function ProfileDetails({ student }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Details */}
      <div className="card p-6 flex flex-col gap-5">
        <div className="flex items-center gap-3 text-maroon-light">
          <User className="w-5 h-5" />
          <h3 className="text-lg font-semibold text-white">Personal Details</h3>
        </div>
        
        <div className="space-y-4">
          <DetailItem label="Date of Birth" value={student.birthDate || 'October 15, 2000'} />
          <DetailItem label="Gender" value={student.gender || 'Male'} />
          <DetailItem label="Civil Status" value={student.civilStatus || 'Single'} />
          <DetailItem label="Nationality" value={student.nationality || 'Filipino'} />
          <DetailItem label="Address" value={student.address || 'Block 12, Lot 5, Green Meadows, Iloilo City'} />
        </div>
      </div>

      {/* Academic History */}
      <div className="card p-6 flex flex-col gap-5">
        <div className="flex items-center gap-3 text-maroon-light">
          <Book className="w-5 h-5" />
          <h3 className="text-lg font-semibold text-white">Academic History</h3>
        </div>

        <div className="space-y-4">
          <DetailItem label="Previous School" value={student.previousSchool || 'Iloilo National High School'} />
          <DetailItem label="Date of Admission" value={student.admissionDate || 'August 2021'} />
          <DetailItem label="Major" value={student.program || 'Information Technology'} />
          <DetailItem label="Academic Standing" value={student.standing || 'Good'} />
          <DetailItem label="GPA" value={student.gpa || '3.5'} />
        </div>
      </div>

      {/* Contact Information */}
      <div className="card p-6 flex flex-col gap-5">
        <div className="flex items-center gap-3 text-maroon-light">
          <Phone className="w-5 h-5" />
          <h3 className="text-lg font-semibold text-white">Contact Information</h3>
        </div>

        <div className="space-y-4">
          <DetailItem label="Email" value={student.email || 'juandelacruz@usa.edu.ph'} />
          <DetailItem label="Phone Number" value={student.phone || '0912-345-6789'} />
          <DetailItem label="Guardian's Name" value={student.guardianName || 'Maria Dela Cruz'} />
          <DetailItem label="Guardian's Contact" value={student.guardianPhone || '0923-456-7890'} />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-zinc-800 pb-3 last:border-0 last:pb-0">
      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">{label}</span>
      <span className="text-sm text-zinc-200 font-medium">{value}</span>
    </div>
  );
}
