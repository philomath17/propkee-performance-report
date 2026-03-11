'use client';

import { useEffect, useMemo, useState } from 'react';

const demoCreds = [
  { role: 'Employee', email: 'ava@company.com', password: 'employee123' },
  { role: 'HR/Admin', email: 'hr.admin@company.com', password: 'hradmin123' },
];

const cardClass = 'rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm';

async function api(path, method = 'GET', token, body) {
  const response = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || 'Request failed');
  return payload;
}

export default function HomePage() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [events, setEvents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [leaveForm, setLeaveForm] = useState({ leaveType: 'casual', startDate: '', endDate: '', reason: '' });
  const [eventForm, setEventForm] = useState({ title: '', description: '', type: 'meeting', date: '' });

  const todayRecord = useMemo(() => attendance.find((entry) => entry.date === new Date().toISOString().slice(0, 10)), [attendance]);

  useEffect(() => {
    const savedToken = window.localStorage.getItem('hrcrm_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const hydrate = async () => {
      try {
        const me = await api('/api/auth/me', 'GET', token);
        setUser(me.user);
        await refreshData(token, me.user.role);
      } catch {
        logout();
      }
    };

    hydrate();
  }, [token]);

  async function refreshData(activeToken = token, role = user?.role) {
    const [attendanceRes, leavesRes, eventsRes, notesRes] = await Promise.all([
      api('/api/attendance', 'GET', activeToken),
      api('/api/leaves', 'GET', activeToken),
      api('/api/events', 'GET', activeToken),
      api('/api/notifications', 'GET', activeToken),
    ]);

    setAttendance(attendanceRes.records);
    setLeaves(leavesRes.leaveRequests);
    setLeaveBalance(leavesRes.leaveBalance);
    setEvents(eventsRes.events);
    setNotifications(notesRes.notifications);

    if (role === 'hr') {
      const empRes = await api('/api/employees', 'GET', activeToken);
      setEmployees(empRes.employees);
    }
  }

  async function login(e) {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api('/api/auth/login', 'POST', null, { email, password });
      setToken(res.token);
      setUser(res.user);
      window.localStorage.setItem('hrcrm_token', res.token);
      setEmail('');
      setPassword('');
      await refreshData(res.token, res.user.role);
    } catch (error) {
      setMessage(error.message);
    }
  }

  function logout() {
    setToken('');
    setUser(null);
    window.localStorage.removeItem('hrcrm_token');
  }

  async function checkIn() {
    await api('/api/attendance', 'POST', token);
    await refreshData();
  }

  async function checkOut() {
    await api('/api/attendance', 'PATCH', token);
    await refreshData();
  }

  async function applyLeave(e) {
    e.preventDefault();
    await api('/api/leaves', 'POST', token, leaveForm);
    setLeaveForm({ leaveType: 'casual', startDate: '', endDate: '', reason: '' });
    await refreshData();
  }

  async function decideLeave(leaveId, action) {
    await api('/api/leaves', 'PATCH', token, { leaveId, action });
    await refreshData();
  }

  async function createEvent(e) {
    e.preventDefault();
    await api('/api/events', 'POST', token, eventForm);
    setEventForm({ title: '', description: '', type: 'meeting', date: '' });
    await refreshData();
  }

  if (!user) {
    return (
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-white p-8 shadow-md">
          <h1 className="text-4xl font-bold text-zinc-900">Internal HR CRM</h1>
          <p className="mt-3 text-zinc-600">Secure attendance, leave, and HR event management portal.</p>

          <form className="mt-8 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 md:grid-cols-2" onSubmit={login}>
            <input className="rounded-lg border px-3 py-2" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input
              type="password"
              className="rounded-lg border px-3 py-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white md:col-span-2">Login</button>
            {message && <p className="text-red-600 md:col-span-2">{message}</p>}
          </form>

          <div className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm">
            <p className="font-semibold text-zinc-700">Demo credentials</p>
            {demoCreds.map((cred) => (
              <p key={cred.role} className="text-zinc-600">
                {cred.role}: {cred.email} / {cred.password}
              </p>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">HR CRM Dashboard</h1>
          <p className="text-zinc-600">Welcome, {user.name} ({user.role.toUpperCase()})</p>
        </div>
        <button className="rounded-lg bg-zinc-900 px-4 py-2 text-white" onClick={logout}>Logout</button>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <article className={cardClass}><p className="text-sm text-zinc-500">Employees</p><p className="text-2xl font-semibold">{user.role === 'hr' ? employees.length : 1}</p></article>
        <article className={cardClass}><p className="text-sm text-zinc-500">Attendance Records</p><p className="text-2xl font-semibold">{attendance.length}</p></article>
        <article className={cardClass}><p className="text-sm text-zinc-500">Pending Leaves</p><p className="text-2xl font-semibold">{leaves.filter((l) => l.status === 'pending').length}</p></article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className={cardClass}>
          <h2 className="text-xl font-semibold">Attendance Tracking</h2>
          <div className="mt-3 flex gap-3">
            <button className="rounded-lg bg-emerald-600 px-3 py-2 text-white disabled:bg-zinc-300" onClick={checkIn} disabled={Boolean(todayRecord)}>
              Check-in
            </button>
            <button className="rounded-lg bg-amber-600 px-3 py-2 text-white disabled:bg-zinc-300" onClick={checkOut} disabled={!todayRecord || Boolean(todayRecord.checkOut)}>
              Check-out
            </button>
          </div>
          <div className="mt-4 max-h-56 overflow-auto text-sm">
            {attendance.map((entry) => (
              <div key={entry.id} className="mb-2 rounded-lg border p-2">
                <p>{entry.employeeName} • {entry.date}</p>
                <p className="text-zinc-600">In: {entry.checkIn ? new Date(entry.checkIn).toLocaleTimeString() : '-'} | Out: {entry.checkOut ? new Date(entry.checkOut).toLocaleTimeString() : '-'} | {entry.hoursWorked}h</p>
              </div>
            ))}
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="text-xl font-semibold">Leave Management</h2>
          {leaveBalance && (
            <p className="mt-2 text-sm text-zinc-600">
              Balance: Casual {leaveBalance.casual}, Sick {leaveBalance.sick}, Paid {leaveBalance.paid}
            </p>
          )}
          <form className="mt-4 grid gap-2" onSubmit={applyLeave}>
            <select className="rounded border px-3 py-2" value={leaveForm.leaveType} onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}>
              <option value="casual">Casual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="paid">Paid Leave</option>
            </select>
            <input type="date" className="rounded border px-3 py-2" value={leaveForm.startDate} onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })} />
            <input type="date" className="rounded border px-3 py-2" value={leaveForm.endDate} onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })} />
            <textarea className="rounded border px-3 py-2" placeholder="Reason" value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} />
            <button className="rounded bg-indigo-600 px-3 py-2 font-medium text-white">Submit Leave Request</button>
          </form>
          <div className="mt-4 max-h-48 overflow-auto text-sm">
            {leaves.map((leave) => (
              <div key={leave.id} className="mb-2 rounded border p-2">
                <p>{leave.employeeName} • {leave.leaveType} • {leave.totalDays} day(s)</p>
                <p className="text-zinc-600">{leave.startDate} → {leave.endDate} | {leave.status}</p>
                {user.role === 'hr' && leave.status === 'pending' && (
                  <div className="mt-2 flex gap-2">
                    <button className="rounded bg-emerald-600 px-2 py-1 text-white" onClick={() => decideLeave(leave.id, 'approved')}>Approve</button>
                    <button className="rounded bg-rose-600 px-2 py-1 text-white" onClick={() => decideLeave(leave.id, 'rejected')}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="text-xl font-semibold">HR Events</h2>
          {user.role === 'hr' && (
            <form className="mt-3 grid gap-2" onSubmit={createEvent}>
              <input className="rounded border px-3 py-2" placeholder="Event title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
              <textarea className="rounded border px-3 py-2" placeholder="Description" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
              <select className="rounded border px-3 py-2" value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}>
                <option value="meeting">Meeting</option>
                <option value="training">Training</option>
                <option value="workshop">Workshop</option>
                <option value="celebration">Celebration</option>
              </select>
              <input type="datetime-local" className="rounded border px-3 py-2" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
              <button className="rounded bg-indigo-600 px-3 py-2 font-medium text-white">Create Event</button>
            </form>
          )}
          <div className="mt-4 max-h-48 overflow-auto text-sm">
            {events.map((event) => (
              <div key={event.id} className="mb-2 rounded border p-2">
                <p className="font-medium">{event.title}</p>
                <p className="text-zinc-600">{new Date(event.date).toLocaleString()} • {event.type}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="text-xl font-semibold">Notifications</h2>
          <div className="mt-3 max-h-48 overflow-auto text-sm">
            {notifications.length ? notifications.map((note) => (
              <div key={note.id} className="mb-2 rounded border p-2">
                <p>{note.message}</p>
                <p className="text-zinc-500">{new Date(note.createdAt).toLocaleString()}</p>
              </div>
            )) : <p className="text-zinc-500">No notifications yet.</p>}
          </div>
        </div>
      </section>

      {user.role === 'hr' && (
        <section className={`${cardClass} mt-6`}>
          <h2 className="text-xl font-semibold">Employee Directory</h2>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {employees.map((employee) => (
              <div key={employee.id} className="rounded border p-3 text-sm">
                <p className="font-medium">{employee.name}</p>
                <p className="text-zinc-600">{employee.email}</p>
                <p className="text-zinc-600">{employee.department} • {employee.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
