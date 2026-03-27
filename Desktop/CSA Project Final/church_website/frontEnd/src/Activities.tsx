import React, { useEffect, useState } from "react";

interface WeeklyActivity {
  id: number;
  day: string;
  time: string;
  activity: string;
  venue: string;
  parsedDate?: Date;
}

interface SemesterActivity {
  id: number;
  title: string;
  datetime: string;
  venue: string;
  description: string;
  parsedDate?: Date;
}

const fallbackWeekly: WeeklyActivity[] = [
  { id: 1, day: "Monday", time: "7:30 PM – 8:00 PM", activity: "Rosary", venue: "Church" },
  { id: 2, day: "Tuesday", time: "6:00 PM – 8:00 PM", activity: "Choir Practice", venue: "Church" },
  { id: 3, day: "Wednesday", time: "7:00 PM – 8:00 PM", activity: "Bible Study", venue: "Church" },
  { id: 4, day: "Thursday", time: "7:30 PM – 8:00 PM", activity: "Rosary", venue: "Church" },
  { id: 5, day: "Friday", time: "7:00 PM – 9:00 PM", activity: "Mass", venue: "Church" },
  { id: 6, day: "Saturday", time: "1:00 PM – 4:00 PM", activity: "Choir Practice", venue: "School" },
];

const fallbackSemester: SemesterActivity[] = [
  { id: 1, title: "Recollection Day", datetime: "2025-12-20T08:00:00", venue: "Church Hall", description: "A day of prayer, reflection, and spiritual renewal for all CSA members." },
  { id: 2, title: "Charity Work", datetime: "2026-01-10T08:00:00", venue: "Bethlehem Children's Home", description: "Outreach and service project — bringing hope to those in need." },
  { id: 3, title: "Fun Day", datetime: "2026-01-25T07:30:00", venue: "School Grounds", description: "A day of games, fellowship, and community bonding for all students." },
  { id: 4, title: "4th Years' Bash", datetime: "2026-04-11T08:00:00", venue: "Church", description: "A farewell celebration honouring our graduating fourth-year members." },
];

const getNextWeeklyDate = (day: string, timeStr: string): Date => {
  const daysOfWeek: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };
  const now = new Date();
  const dayNum = daysOfWeek[day as keyof typeof daysOfWeek];
  const todayNum = now.getDay();
  let daysAhead = (dayNum - todayNum + 7) % 7;
  const nextDay = new Date(now.getTime());
  nextDay.setDate(now.getDate() + daysAhead);
  const timePart = timeStr.split(' – ')[0].trim();
  const timeMatch = timePart.match(/(\\d{1,2}):(\\d{2})\\s*(AM|PM)/i);
  if (!timeMatch) return new Date(NaN);
  const [, hourStr, minStr, ampm] = timeMatch;
  let hour = parseInt(hourStr, 10);
  const mins = parseInt(minStr, 10);
  if (/pm/i.test(ampm) && hour !== 12) hour += 12;
  if (/am/i.test(ampm) && hour === 12) hour = 0;
  nextDay.setHours(hour, mins, 0, 0);
  if (nextDay <= now) nextDay.setDate(nextDay.getDate() + 7);
  return nextDay;
};

function useCountdown(targetDate: string) {
  const countDownDate = new Date(targetDate).getTime();
  const [timeLeft, setTimeLeft] = useState(countDownDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(countDownDate - new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (timeLeft <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

const Activities: React.FC = () => {
  const [weekly, setWeekly] = useState<WeeklyActivity[]>(fallbackWeekly);
  const [semester, setSemester] = useState<SemesterActivity[]>(fallbackSemester);

  useEffect(() => {
    fetch('/api/weekly')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setWeekly(data);
        }
      })
      .catch(() => {});
    
    fetch('/api/semester')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setSemester(data);
        }
      })
      .catch(() => {});
  }, []);

  const now = new Date();
  const nextWeekly = weekly
    .map(w => ({ ...w, parsedDate: getNextWeeklyDate(w.day, w.time) }))
    .filter((w): w is WeeklyActivity & {parsedDate: Date} => Boolean(w.parsedDate && !isNaN(w.parsedDate.getTime()) && w.parsedDate > now))
    .sort((a, b) => a.parsedDate!.getTime() - b.parsedDate!.getTime())[0];

  const nextSemester = semester
    .map(e => ({ ...e, parsedDate: new Date(e.datetime) }))
    .filter((e): e is SemesterActivity & {parsedDate: Date} => Boolean(e.parsedDate && e.parsedDate > now))
    .sort((a, b) => a.parsedDate!.getTime() - b.parsedDate!.getTime())[0];

  const weeklyCountdown = nextWeekly ? useCountdown(nextWeekly.parsedDate!.toISOString()) : null;
  const semesterCountdown = nextSemester ? useCountdown(nextSemester.parsedDate!.toISOString()) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-liturgical-purple-50 text-on-background font-body scroll-smooth">
      <main className="pt-32 pb-20">
        
        {/* Highlight next weekly activity */}
        {nextWeekly && (
          <section className="max-w-7xl mx-auto px-8 mb-24">
            <div className="upcoming-highlight bg-gradient-to-br from-liturgical-purple-50 to-surface rounded-3xl p-8 md:p-12 shadow-2xl ring-1 ring-liturgical-purple-200/50 flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-liturgical-purple-500/25 transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-liturgical-purple-400/10 before:blur-xl">
              <div className="relative z-10">
                <span className="text-secondary font-bold text-xs uppercase mb-2 block">Next Weekly Activity</span>
                <h2 className="font-headline text-4xl text-primary mb-2 italic group-hover:text-liturgical-purple-700 transition-colors">{nextWeekly.activity}</h2>
                <p className="text-on-surface-variant">
                  {nextWeekly.day} • {nextWeekly.parsedDate!.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {nextWeekly.venue}
                </p>
              </div>
              {weeklyCountdown && (
                <div className="flex gap-6 p-4 bg-white/70 rounded-2xl backdrop-blur-md shadow-inner relative z-10">
                  {Object.entries(weeklyCountdown).map(([label, value]) => (
                    <div key={label} className="flex flex-col items-center">
                      <span className="text-3xl font-bold text-primary">{value}</span>
                      <span className="text-xs uppercase text-secondary tracking-wider">{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Highlight next semester activity */}
        {nextSemester && (
          <section className="max-w-7xl mx-auto px-8 mb-24">
            <div className="upcoming-highlight bg-gradient-to-br from-indigo-50 via-purple-50 to-surface rounded-3xl p-8 md:p-12 shadow-2xl ring-1 ring-indigo-200/50 flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-indigo-500/25 transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-indigo-400/10 before:blur-xl">
              <div className="relative z-10">
                <span className="text-secondary font-bold text-xs uppercase mb-2 block">Next Semester Event</span>
                <h2 className="font-headline text-4xl text-primary mb-2 italic group-hover:text-indigo-700 transition-colors">{nextSemester.title}</h2>
                <p className="text-on-surface-variant">
                  {nextSemester.parsedDate!.toLocaleDateString()} • {nextSemester.parsedDate!.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {nextSemester.venue}
                </p>
              </div>
              {semesterCountdown && (
                <div className="flex gap-6 p-4 bg-white/70 rounded-2xl backdrop-blur-md shadow-inner relative z-10">
                  {Object.entries(semesterCountdown).map(([label, value]) => (
                    <div key={label} className="flex flex-col items-center">
                      <span className="text-3xl font-bold text-primary">{value}</span>
                      <span className="text-xs uppercase text-secondary tracking-wider">{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Weekly Rhythms */}
        <section className="max-w-7xl mx-auto px-8 mb-32">
          <h2 className="text-3xl md:text-4xl font-headline bg-gradient-to-r from-primary to-liturgical-purple-600 bg-clip-text text-transparent mb-12 text-center animate-glow">Weekly Rhythms ✨</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weekly.map(activity => (
              <div key={activity.id} className="group p-8 rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl border border-outline-variant/30 hover:shadow-2xl hover:shadow-liturgical-purple-500/30 hover:-translate-y-2 hover:border-liturgical-purple-300 transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-liturgical-purple-500/10 before:to-primary/10 before:blur-xl">
                <h3 className="text-xl font-bold text-primary relative z-10 group-hover:text-liturgical-purple-600 mb-3 transition-colors">{activity.activity}</h3>
                <p className="text-sm text-on-surface-variant relative z-10">
                  Every {activity.day} • {activity.time} • {activity.venue}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Semester Events */}
        <section className="max-w-7xl mx-auto px-8 mb-32">
          <h2 className="text-3xl md:text-4xl font-headline bg-gradient-to-r from-liturgical-purple-500 to-primary bg-clip-text text-transparent mb-12 text-center animate-float">Semester Events 💜</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {semester.map(activity => {
              const parsedDate = new Date(activity.datetime);
              return (
                <div key={activity.id} className="group p-8 rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl border border-indigo-200/50 hover:shadow-2xl hover:shadow-indigo-400/30 hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-xl font-bold text-primary relative z-10 mb-3 group-hover:text-indigo-600 transition-colors">{activity.title}</h3>
                  <p className="text-sm text-on-surface-variant mb-2 relative z-10">
                    {parsedDate.toLocaleDateString()} • {parsedDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  <p className="text-lg font-semibold text-on-surface mb-4 relative z-10">{activity.venue}</p>
                  <p className="text-sm leading-relaxed relative z-10">{activity.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Activities;
