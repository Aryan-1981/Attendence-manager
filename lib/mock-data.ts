// lib/mock-data.ts

export interface Student {
  id: string;
  name: string;
  department: string;
  avatar: string;
  email: string;
  phone: string;
  joinDate: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  status: "Present" | "Absent" | "Late";
}

export interface WeeklyDataPoint {
  day: string;
  present: number;
  absent: number;
}

export interface ActivityItem {
  id: string;
  name: string;
  avatar: string;
  action: string;
  time: string;
  color: string;
}

const firstNames = [
  "Arjun", "Priya", "Rahul", "Ananya", "Vikram", "Sneha", "Aditya", "Kavya",
  "Rohan", "Ishita", "Karan", "Meera", "Siddharth", "Nisha", "Amit",
  "Divya", "Harsh", "Pooja", "Nikhil", "Riya", "Varun", "Shruti",
  "Akash", "Neha", "Deepak", "Tanvi", "Manish", "Sakshi", "Rajesh", "Aarti",
  "James", "Sarah", "Michael", "Emma", "David", "Olivia", "Daniel", "Sophie",
  "Alex", "Mia", "Chris", "Isabella", "Ryan", "Chloe", "Nathan", "Grace",
  "Ethan", "Lily", "Lucas", "Zara"
];

const lastNames = [
  "Sharma", "Patel", "Gupta", "Singh", "Kumar", "Reddy", "Nair", "Joshi",
  "Mehta", "Verma", "Kapoor", "Malhotra", "Chauhan", "Desai", "Iyer",
  "Rao", "Bhat", "Pillai", "Saxena", "Mishra", "Thakur", "Das",
  "Anderson", "Williams", "Johnson", "Brown", "Wilson", "Taylor", "Clark",
  "Moore", "Lee", "Harris", "Martin", "Thompson", "White", "Jackson",
  "Walker", "Hall", "Allen", "Young", "King", "Wright", "Scott", "Hill",
  "Adams", "Baker", "Nelson", "Carter", "Mitchell", "Roberts"
];

const departments = [
  "Computer Science", "Electrical Engineering", "Mechanical Engineering",
  "Business Administration", "Data Science", "Information Technology",
  "Civil Engineering", "Mathematics", "Physics", "Chemistry"
];

const avatarColors = [
  "bg-indigo-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500",
  "bg-cyan-500", "bg-violet-500", "bg-pink-500", "bg-teal-500",
  "bg-orange-500", "bg-blue-500"
];

function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
}

function randomTime(startHour: number, startMin: number, endHour: number, endMin: number): string {
  const hour = startHour + Math.floor(Math.random() * (endHour - startHour));
  const min = Math.floor(Math.random() * (endMin - startMin + 1)) + startMin;
  return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}

function calculateDuration(checkIn: string, checkOut: string): string {
  const [inH, inM] = checkIn.split(":").map(Number);
  const [outH, outM] = checkOut.split(":").map(Number);
  const totalMinutes = (outH * 60 + outM) - (inH * 60 + inM);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

// Generate 50 students
export const students: Student[] = Array.from({ length: 50 }, (_, i) => {
  const name = `${firstNames[i]} ${lastNames[i]}`;
  return {
    id: `STU-${String(i + 1).padStart(3, "0")}`,
    name,
    department: departments[i % departments.length],
    avatar: getInitials(name),
    email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@university.edu`,
    phone: `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
    joinDate: `2024-${String(Math.floor(Math.random() * 6) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
  };
});

// Generate 30 days of attendance records
function generateRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  let recordId = 1;

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dateStr = date.toISOString().split("T")[0];

    for (const student of students) {
      const rand = Math.random();
      let status: "Present" | "Absent" | "Late";
      let checkIn = "";
      let checkOut = "";
      let duration = "";

      if (rand < 0.75) {
        status = "Present";
        checkIn = randomTime(8, 0, 8, 45);
        checkOut = randomTime(16, 0, 18, 0);
        duration = calculateDuration(checkIn, checkOut);
      } else if (rand < 0.90) {
        status = "Absent";
        checkIn = "--:--";
        checkOut = "--:--";
        duration = "--";
      } else {
        status = "Late";
        checkIn = randomTime(9, 15, 10, 30);
        checkOut = randomTime(16, 30, 18, 30);
        duration = calculateDuration(checkIn, checkOut);
      }

      records.push({
        id: `REC-${String(recordId++).padStart(5, "0")}`,
        studentId: student.id,
        studentName: student.name,
        studentAvatar: student.avatar,
        department: student.department,
        date: dateStr,
        checkIn,
        checkOut,
        duration,
        status,
      });
    }
  }

  return records;
}

export const attendanceRecords = generateRecords();

// Today's statistics
const todayRecords = attendanceRecords.filter(r => {
  const today = new Date().toISOString().split("T")[0];
  return r.date === today;
});

const presentToday = todayRecords.filter(r => r.status === "Present").length || 213;
const lateToday = todayRecords.filter(r => r.status === "Late").length || 12;
const absentToday = todayRecords.filter(r => r.status === "Absent").length || 35;

export const todayStats = {
  totalStudents: 248,
  presentToday: presentToday || 213,
  absentToday: absentToday || 35,
  attendanceRate: 85.9,
  lateToday: lateToday || 12,
  yesterdayRate: 83.2,
  yesterdayPresent: 206,
  yesterdayAbsent: 42,
};

export const weeklyData: WeeklyDataPoint[] = [
  { day: "Mon", present: 220, absent: 28 },
  { day: "Tue", present: 235, absent: 13 },
  { day: "Wed", present: 228, absent: 20 },
  { day: "Thu", present: 213, absent: 35 },
  { day: "Fri", present: 240, absent: 8 },
  { day: "Sat", present: 0, absent: 0 },
  { day: "Sun", present: 0, absent: 0 },
];

export const lastWeekData: WeeklyDataPoint[] = [
  { day: "Mon", present: 215, absent: 33 },
  { day: "Tue", present: 225, absent: 23 },
  { day: "Wed", present: 210, absent: 38 },
  { day: "Thu", present: 230, absent: 18 },
  { day: "Fri", present: 238, absent: 10 },
  { day: "Sat", present: 0, absent: 0 },
  { day: "Sun", present: 0, absent: 0 },
];

const actions = ["Checked In", "Checked Out"];
const timeAgo = [
  "just now", "1 min ago", "2 mins ago", "3 mins ago", "5 mins ago",
  "8 mins ago", "10 mins ago", "12 mins ago", "15 mins ago", "18 mins ago",
  "20 mins ago", "25 mins ago", "30 mins ago", "35 mins ago", "40 mins ago",
];

export const recentActivity: ActivityItem[] = Array.from({ length: 15 }, (_, i) => {
  const student = students[Math.floor(Math.random() * students.length)];
  return {
    id: `act-${i}`,
    name: student.name,
    avatar: student.avatar,
    action: actions[Math.floor(Math.random() * actions.length)],
    time: timeAgo[i],
    color: avatarColors[Math.floor(Math.random() * avatarColors.length)],
  };
});

export const avatarColorMap: Record<string, string> = {};
students.forEach((student, i) => {
  avatarColorMap[student.avatar] = avatarColors[i % avatarColors.length];
});
