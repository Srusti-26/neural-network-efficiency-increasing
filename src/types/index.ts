export type UserRole = 'student' | 'faculty' | 'admin' | 'librarian';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  department?: string;
  photoURL?: string;
  createdAt: string;
}

export interface AcademicResource {
  id: string;
  title: string;
  type: 'notes' | 'pyq' | 'assignment';
  semester: number;
  subject: string;
  fileUrl: string;
  fileName: string;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  coverUrl: string;
  fileUrl: string;
  status: 'available' | 'borrowed';
  createdAt: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  status: 'pending' | 'approved' | 'rejected';
  registrations: number;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent';
  method: string;
  subject: string;
}

export interface Notification {
  id: string;
  userId: string | null;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}
