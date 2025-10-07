import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

type User = {
  id: string;
  login: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  name: string;
  subjects?: string[];
  classId?: string;
};

type Class = {
  id: string;
  name: string;
  students: string[];
};

type Grade = {
  id: string;
  studentId: string;
  subject: string;
  grade: number;
  date: string;
  teacherId: string;
  type: 'ОТВ' | 'КР' | 'ДЗ' | 'ПР' | 'Д' | 'СР' | 'ПРКТ';
};

type Homework = {
  id: string;
  subject: string;
  description: string;
  dueDate: string;
  classId: string;
  teacherId?: string;
};

type ScheduleLesson = {
  id: string;
  classId: string;
  dayOfWeek: string;
  time: string;
  subject: string;
  teacherId: string;
};

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      login: 'Админ',
      password: 'Админ2011',
      role: 'admin',
      name: 'Администратор Школы'
    }
  ]);

  const [classes, setClasses] = useState<Class[]>([
    { id: '1', name: '9А', students: [] },
    { id: '2', name: '10Б', students: [] }
  ]);

  const [grades, setGrades] = useState<Grade[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [schedules, setSchedules] = useState<ScheduleLesson[]>([]);
  const [subjects, setSubjects] = useState<string[]>(['Математика', 'Русский язык', 'Литература', 'Физика', 'Химия', 'История', 'Обществознание', 'Английский язык']);

  const [newClassName, setNewClassName] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserLogin, setNewUserLogin] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'teacher' | 'student'>('student');
  const [newUserClass, setNewUserClass] = useState('');
  const [newUserSubjects, setNewUserSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  const [newHomework, setNewHomework] = useState({
    subject: '',
    description: '',
    dueDate: '',
    classId: ''
  });

  const [newSchedule, setNewSchedule] = useState({
    classId: '',
    dayOfWeek: '',
    time: '',
    subject: '',
    teacherId: ''
  });

  const [newGrade, setNewGrade] = useState({
    studentId: '',
    subject: '',
    grade: 5,
    type: 'ОТВ' as 'ОТВ' | 'КР' | 'ДЗ' | 'ПР' | 'Д' | 'СР' | 'ПРКТ'
  });

  const [newSubject, setNewSubject] = useState('');

  const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const gradeTypes = ['ОТВ', 'КР', 'ДЗ', 'ПР', 'Д', 'СР', 'ПРКТ'] as const;

  const handleLogin = () => {
    const user = users.find(u => u.login === loginInput && u.password === passwordInput);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
    } else {
      alert('Неверный логин или пароль');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setLoginInput('');
    setPasswordInput('');
  };

  const addClass = () => {
    if (newClassName) {
      setClasses([...classes, { id: Date.now().toString(), name: newClassName, students: [] }]);
      setNewClassName('');
    }
  };

  const deleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const addUser = () => {
    if (newUserName && newUserLogin && newUserPassword) {
      const newUser: User = {
        id: Date.now().toString(),
        login: newUserLogin,
        password: newUserPassword,
        role: newUserRole,
        name: newUserName,
        subjects: newUserRole === 'teacher' ? newUserSubjects : undefined,
        classId: newUserRole === 'student' ? newUserClass : undefined
      };
      
      setUsers([...users, newUser]);
      
      if (newUserRole === 'student' && newUserClass) {
        setClasses(classes.map(c => 
          c.id === newUserClass 
            ? { ...c, students: [...c.students, newUser.id] }
            : c
        ));
      }
      
      setNewUserName('');
      setNewUserLogin('');
      setNewUserPassword('');
      setNewUserClass('');
      setNewUserSubjects([]);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const addHomework = () => {
    if (newHomework.subject && newHomework.description && newHomework.classId) {
      setHomeworks([...homeworks, { 
        id: Date.now().toString(), 
        ...newHomework,
        teacherId: currentUser?.id
      }]);
      setNewHomework({ subject: '', description: '', dueDate: '', classId: '' });
    }
  };

  const deleteHomework = (id: string) => {
    setHomeworks(homeworks.filter(h => h.id !== id));
  };

  const addSchedule = () => {
    if (newSchedule.classId && newSchedule.dayOfWeek && newSchedule.subject && newSchedule.teacherId) {
      setSchedules([...schedules, {
        id: Date.now().toString(),
        ...newSchedule
      }]);
      setNewSchedule({ classId: '', dayOfWeek: '', time: '', subject: '', teacherId: '' });
    }
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const addGrade = () => {
    if (newGrade.studentId && newGrade.subject && currentUser) {
      setGrades([...grades, {
        id: Date.now().toString(),
        ...newGrade,
        date: new Date().toLocaleDateString(),
        teacherId: currentUser.id
      }]);
      setNewGrade({ studentId: '', subject: '', grade: 5, type: 'ОТВ' });
    }
  };

  const addSubject = () => {
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
      setNewSubject('');
    }
  };

  const deleteSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject));
  };

  const getStudentGrades = (studentId: string) => {
    return grades.filter(g => g.studentId === studentId);
  };

  const getAverageBySubject = (studentId: string, subject: string) => {
    const studentGrades = grades.filter(g => g.studentId === studentId && g.subject === subject);
    if (studentGrades.length === 0) return 0;
    return (studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length).toFixed(2);
  };

  const getClassAnalytics = () => {
    return subjects.map(subject => {
      const subjectGrades = grades.filter(g => g.subject === subject);
      const avg = subjectGrades.length > 0 
        ? (subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length).toFixed(1)
        : 0;
      return { subject, average: Number(avg) };
    });
  };

  const getGradeDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0 };
    grades.forEach(g => {
      if (g.grade in distribution) {
        distribution[g.grade as keyof typeof distribution]++;
      }
    });
    return Object.entries(distribution).map(([grade, count]) => ({ 
      grade: `Оценка ${grade}`, 
      count 
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-success/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6 shadow-lg">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="bg-primary rounded-2xl p-4 shadow-lg">
                <Icon name="GraduationCap" size={48} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Электронный дневник</h1>
            <p className="text-muted-foreground">Войдите в систему</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Введите свой логин</Label>
              <Input
                id="login"
                placeholder="Логин"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Пароль"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            
            <Button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90">
              Войти
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (currentUser?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5">
        <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-xl p-2">
                <Icon name="GraduationCap" size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Электронный дневник</h1>
                <p className="text-sm text-muted-foreground">{currentUser.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6">
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="bg-white p-1 shadow-sm">
              <TabsTrigger value="analytics" className="gap-2">
                <Icon name="BarChart3" size={18} />
                Аналитика
              </TabsTrigger>
              <TabsTrigger value="classes" className="gap-2">
                <Icon name="Users" size={18} />
                Классы
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Icon name="UserCog" size={18} />
                Пользователи
              </TabsTrigger>
              <TabsTrigger value="subjects" className="gap-2">
                <Icon name="BookText" size={18} />
                Предметы
              </TabsTrigger>
              <TabsTrigger value="schedule" className="gap-2">
                <Icon name="Calendar" size={18} />
                Расписание
              </TabsTrigger>
              <TabsTrigger value="homework" className="gap-2">
                <Icon name="BookOpen" size={18} />
                Домашние задания
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Всего классов</p>
                      <p className="text-4xl font-bold mt-2">{classes.length}</p>
                    </div>
                    <Icon name="School" size={48} className="opacity-50" />
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-success to-success/80 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Учеников</p>
                      <p className="text-4xl font-bold mt-2">{users.filter(u => u.role === 'student').length}</p>
                    </div>
                    <Icon name="Users" size={48} className="opacity-50" />
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-warning to-warning/80 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Учителей</p>
                      <p className="text-4xl font-bold mt-2">{users.filter(u => u.role === 'teacher').length}</p>
                    </div>
                    <Icon name="UserCheck" size={48} className="opacity-50" />
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} />
                  Средний балл по предметам
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getClassAnalytics()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="average" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="PieChart" size={20} />
                  Распределение оценок
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getGradeDistribution()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            <TabsContent value="classes" className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="School" size={24} />
                    Управление классами
                  </h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-success hover:bg-success/90">
                        <Icon name="Plus" size={18} className="mr-2" />
                        Создать класс
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Создать новый класс</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Название класса</Label>
                          <Input
                            placeholder="Например: 9А"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                          />
                        </div>
                        <Button onClick={addClass} className="w-full bg-success hover:bg-success/90">
                          Создать
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {classes.map((cls) => (
                    <Card key={cls.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 rounded-lg p-3">
                            <Icon name="Users" size={24} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{cls.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {cls.students.length} учеников
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteClass(cls.id)}
                        >
                          <Icon name="Trash2" size={16} className="text-destructive" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="UserCog" size={24} />
                    Управление пользователями
                  </h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-success hover:bg-success/90">
                        <Icon name="UserPlus" size={18} className="mr-2" />
                        Добавить пользователя
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Добавить пользователя</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Роль</Label>
                          <Select value={newUserRole} onValueChange={(v: 'teacher' | 'student') => setNewUserRole(v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Ученик</SelectItem>
                              <SelectItem value="teacher">Учитель</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Имя</Label>
                          <Input
                            placeholder="ФИО"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Логин</Label>
                          <Input
                            placeholder="Логин"
                            value={newUserLogin}
                            onChange={(e) => setNewUserLogin(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Пароль</Label>
                          <Input
                            placeholder="Пароль"
                            value={newUserPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                          />
                        </div>

                        {newUserRole === 'student' && (
                          <div className="space-y-2">
                            <Label>Класс</Label>
                            <Select value={newUserClass} onValueChange={setNewUserClass}>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите класс" />
                              </SelectTrigger>
                              <SelectContent>
                                {classes.map(c => (
                                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {newUserRole === 'teacher' && (
                          <div className="space-y-2">
                            <Label>Предметы</Label>
                            <Select value={selectedSubject} onValueChange={(v) => {
                              if (!newUserSubjects.includes(v)) {
                                setNewUserSubjects([...newUserSubjects, v]);
                              }
                              setSelectedSubject('');
                            }}>
                              <SelectTrigger>
                                <SelectValue placeholder="Добавить предмет" />
                              </SelectTrigger>
                              <SelectContent>
                                {subjects.map(s => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {newUserSubjects.map(s => (
                                <Badge key={s} variant="secondary" className="gap-1">
                                  {s}
                                  <Icon 
                                    name="X" 
                                    size={14} 
                                    className="cursor-pointer"
                                    onClick={() => setNewUserSubjects(newUserSubjects.filter(sub => sub !== s))}
                                  />
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <Button onClick={addUser} className="w-full bg-success hover:bg-success/90">
                          Добавить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="UserCheck" size={20} />
                      Учителя
                    </h3>
                    <div className="space-y-2">
                      {users.filter(u => u.role === 'teacher').map(user => (
                        <Card key={user.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className="bg-warning/10 rounded-full p-2">
                              <Icon name="User" size={20} className="text-warning" />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">Логин: {user.login}</p>
                              {user.subjects && user.subjects.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {user.subjects.map(s => (
                                    <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteUser(user.id)}
                          >
                            <Icon name="Trash2" size={16} className="text-destructive" />
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="Users" size={20} />
                      Ученики
                    </h3>
                    <div className="space-y-2">
                      {users.filter(u => u.role === 'student').map(user => (
                        <Card key={user.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className="bg-success/10 rounded-full p-2">
                              <Icon name="User" size={20} className="text-success" />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Логин: {user.login} | Класс: {classes.find(c => c.id === user.classId)?.name || '-'}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteUser(user.id)}
                          >
                            <Icon name="Trash2" size={16} className="text-destructive" />
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="BookText" size={24} />
                    Управление предметами
                  </h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-success hover:bg-success/90">
                        <Icon name="Plus" size={18} className="mr-2" />
                        Добавить предмет
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Добавить предмет</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Название предмета</Label>
                          <Input
                            placeholder="Например: География"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                          />
                        </div>
                        <Button onClick={addSubject} className="w-full bg-success hover:bg-success/90">
                          Добавить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {subjects.map((subject) => (
                    <Card key={subject} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-lg p-2">
                          <Icon name="Book" size={20} className="text-primary" />
                        </div>
                        <p className="font-medium">{subject}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSubject(subject)}
                      >
                        <Icon name="Trash2" size={16} className="text-destructive" />
                      </Button>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="Calendar" size={24} />
                    Управление расписанием
                  </h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-success hover:bg-success/90">
                        <Icon name="Plus" size={18} className="mr-2" />
                        Добавить урок
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Добавить урок в расписание</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Класс</Label>
                          <Select value={newSchedule.classId} onValueChange={(v) => setNewSchedule({...newSchedule, classId: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите класс" />
                            </SelectTrigger>
                            <SelectContent>
                              {classes.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>День недели</Label>
                          <Select value={newSchedule.dayOfWeek} onValueChange={(v) => setNewSchedule({...newSchedule, dayOfWeek: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите день" />
                            </SelectTrigger>
                            <SelectContent>
                              {daysOfWeek.map(d => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Время</Label>
                          <Input
                            type="time"
                            value={newSchedule.time}
                            onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Предмет</Label>
                          <Select value={newSchedule.subject} onValueChange={(v) => setNewSchedule({...newSchedule, subject: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите предмет" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Учитель</Label>
                          <Select value={newSchedule.teacherId} onValueChange={(v) => setNewSchedule({...newSchedule, teacherId: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите учителя" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.filter(u => u.role === 'teacher').map(t => (
                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button onClick={addSchedule} className="w-full bg-success hover:bg-success/90">
                          Добавить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {classes.map(cls => {
                    const classSchedule = schedules.filter(s => s.classId === cls.id);
                    return (
                      <Card key={cls.id} className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Icon name="School" size={20} />
                          Расписание {cls.name}
                        </h3>
                        {classSchedule.length === 0 ? (
                          <p className="text-muted-foreground text-sm">Расписание не создано</p>
                        ) : (
                          <div className="space-y-3">
                            {daysOfWeek.map(day => {
                              const dayLessons = classSchedule.filter(s => s.dayOfWeek === day);
                              if (dayLessons.length === 0) return null;
                              return (
                                <div key={day} className="space-y-2">
                                  <p className="font-medium text-sm text-primary">{day}</p>
                                  {dayLessons.map(lesson => {
                                    const teacher = users.find(u => u.id === lesson.teacherId);
                                    return (
                                      <div key={lesson.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                                        <div className="space-y-1">
                                          <p className="font-medium text-sm">{lesson.subject}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {lesson.time} • {teacher?.name || 'Не назначен'}
                                          </p>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => deleteSchedule(lesson.id)}
                                        >
                                          <Icon name="Trash2" size={14} className="text-destructive" />
                                        </Button>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="homework" className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="BookOpen" size={24} />
                    Домашние задания
                  </h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-success hover:bg-success/90">
                        <Icon name="Plus" size={18} className="mr-2" />
                        Добавить задание
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Добавить домашнее задание</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Предмет</Label>
                          <Select value={newHomework.subject} onValueChange={(v) => setNewHomework({...newHomework, subject: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите предмет" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Класс</Label>
                          <Select value={newHomework.classId} onValueChange={(v) => setNewHomework({...newHomework, classId: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите класс" />
                            </SelectTrigger>
                            <SelectContent>
                              {classes.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Описание</Label>
                          <Textarea
                            placeholder="Описание задания"
                            value={newHomework.description}
                            onChange={(e) => setNewHomework({...newHomework, description: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Срок сдачи</Label>
                          <Input
                            type="date"
                            value={newHomework.dueDate}
                            onChange={(e) => setNewHomework({...newHomework, dueDate: e.target.value})}
                          />
                        </div>

                        <Button onClick={addHomework} className="w-full bg-success hover:bg-success/90">
                          Добавить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-3">
                  {homeworks.map(hw => (
                    <Card key={hw.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary">{hw.subject}</Badge>
                            <Badge variant="outline">{classes.find(c => c.id === hw.classId)?.name}</Badge>
                          </div>
                          <p className="text-sm">{hw.description}</p>
                          {hw.dueDate && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Icon name="Calendar" size={14} />
                              Срок: {new Date(hw.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHomework(hw.id)}
                        >
                          <Icon name="Trash2" size={16} className="text-destructive" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  if (currentUser?.role === 'teacher') {
    const teacherSubjects = currentUser.subjects || [];
    const students = users.filter(u => u.role === 'student');

    return (
      <div className="min-h-screen bg-gradient-to-br from-warning/5 via-background to-primary/5">
        <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-warning rounded-xl p-2">
                <Icon name="BookOpen" size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Электронный дневник</h1>
                <p className="text-sm text-muted-foreground">{currentUser.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6">
          <Tabs defaultValue="grades" className="space-y-6">
            <TabsList className="bg-white p-1 shadow-sm">
              <TabsTrigger value="grades" className="gap-2">
                <Icon name="Award" size={18} />
                Выставить оценки
              </TabsTrigger>
              <TabsTrigger value="schedule" className="gap-2">
                <Icon name="Calendar" size={18} />
                Расписание
              </TabsTrigger>
              <TabsTrigger value="homework" className="gap-2">
                <Icon name="BookOpen" size={18} />
                Домашние задания
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grades" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Icon name="Award" size={24} />
                  Выставление оценок
                </h2>

                <div className="space-y-6">
                  {teacherSubjects.map(subject => {
                    const subjectStudents = students.filter(s => {
                      const studentClass = classes.find(c => c.id === s.classId);
                      return studentClass && schedules.some(sch => 
                        sch.classId === studentClass.id && 
                        sch.subject === subject && 
                        sch.teacherId === currentUser?.id
                      );
                    });

                    if (subjectStudents.length === 0) return null;

                    return (
                      <Card key={subject} className="p-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <Icon name="BookOpen" size={20} className="text-primary" />
                          {subject}
                        </h3>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[200px]">Ученик</TableHead>
                                <TableHead className="w-[100px]">Класс</TableHead>
                                <TableHead className="w-[80px]">Оценка</TableHead>
                                <TableHead className="w-[120px]">Тип</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {subjectStudents.map(student => (
                                <TableRow key={student.id}>
                                  <TableCell className="font-medium">{student.name}</TableCell>
                                  <TableCell>{classes.find(c => c.id === student.classId)?.name}</TableCell>
                                  <TableCell>
                                    <Select 
                                      value={newGrade.studentId === student.id && newGrade.subject === subject ? String(newGrade.grade) : '5'}
                                      onValueChange={(v) => setNewGrade({
                                        studentId: student.id,
                                        subject: subject,
                                        grade: Number(v),
                                        type: newGrade.type
                                      })}
                                    >
                                      <SelectTrigger className="w-[70px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <Select
                                      value={newGrade.studentId === student.id && newGrade.subject === subject ? newGrade.type : 'ОТВ'}
                                      onValueChange={(v) => setNewGrade({
                                        ...newGrade,
                                        studentId: student.id,
                                        subject: subject,
                                        type: v as typeof newGrade.type
                                      })}
                                    >
                                      <SelectTrigger className="w-[100px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {gradeTypes.map(type => (
                                          <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      size="sm"
                                      onClick={() => {
                                        if (newGrade.studentId === student.id && newGrade.subject === subject) {
                                          addGrade();
                                        } else {
                                          setNewGrade({
                                            studentId: student.id,
                                            subject: subject,
                                            grade: 5,
                                            type: 'ОТВ'
                                          });
                                          addGrade();
                                        }
                                      }}
                                      className="bg-success hover:bg-success/90"
                                    >
                                      <Icon name="Plus" size={14} className="mr-1" />
                                      Поставить
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="font-medium text-sm mb-3">История оценок по предмету</h4>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {grades
                              .filter(g => g.subject === subject && teacherSubjects.includes(g.subject))
                              .slice(-10)
                              .reverse()
                              .map(grade => {
                                const student = users.find(u => u.id === grade.studentId);
                                return (
                                  <div key={grade.id} className="flex items-center gap-3 bg-muted/50 rounded p-2 text-sm">
                                    <span className="flex-1">{student?.name}</span>
                                    <Badge className={
                                      grade.grade === 5 ? 'bg-success' : 
                                      grade.grade === 4 ? 'bg-primary' : 
                                      grade.grade === 3 ? 'bg-warning' : 'bg-destructive'
                                    }>
                                      {grade.grade}
                                    </Badge>
                                    <Badge variant="outline">{grade.type}</Badge>
                                    <span className="text-xs text-muted-foreground">{grade.date}</span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Icon name="Calendar" size={24} />
                  Моё расписание
                </h2>

                <div className="space-y-4">
                  {daysOfWeek.map(day => {
                    const dayLessons = schedules.filter(s => 
                      s.dayOfWeek === day && 
                      s.teacherId === currentUser?.id
                    );
                    if (dayLessons.length === 0) return null;
                    
                    return (
                      <div key={day} className="space-y-2">
                        <h3 className="font-semibold text-primary">{day}</h3>
                        <div className="grid gap-2">
                          {dayLessons.map(lesson => {
                            const lessonClass = classes.find(c => c.id === lesson.classId);
                            return (
                              <Card key={lesson.id} className="p-3 flex items-center justify-between">
                                <div className="space-y-1">
                                  <p className="font-medium">{lesson.subject}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {lesson.time} • {lessonClass?.name}
                                  </p>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="homework" className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="BookOpen" size={24} />
                    Домашние задания
                  </h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-success hover:bg-success/90">
                        <Icon name="Plus" size={18} className="mr-2" />
                        Добавить задание
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Добавить домашнее задание</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Предмет</Label>
                          <Select value={newHomework.subject} onValueChange={(v) => setNewHomework({...newHomework, subject: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите предмет" />
                            </SelectTrigger>
                            <SelectContent>
                              {teacherSubjects.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Класс</Label>
                          <Select value={newHomework.classId} onValueChange={(v) => setNewHomework({...newHomework, classId: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите класс" />
                            </SelectTrigger>
                            <SelectContent>
                              {classes.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Описание</Label>
                          <Textarea
                            placeholder="Описание задания"
                            value={newHomework.description}
                            onChange={(e) => setNewHomework({...newHomework, description: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Срок сдачи</Label>
                          <Input
                            type="date"
                            value={newHomework.dueDate}
                            onChange={(e) => setNewHomework({...newHomework, dueDate: e.target.value})}
                          />
                        </div>

                        <Button onClick={addHomework} className="w-full bg-success hover:bg-success/90">
                          Добавить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-3">
                  {homeworks
                    .filter(hw => teacherSubjects.includes(hw.subject))
                    .map(hw => (
                      <Card key={hw.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-warning">{hw.subject}</Badge>
                              <Badge variant="outline">{classes.find(c => c.id === hw.classId)?.name}</Badge>
                            </div>
                            <p className="text-sm">{hw.description}</p>
                            {hw.dueDate && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Icon name="Calendar" size={14} />
                                Срок: {new Date(hw.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          {hw.teacherId === currentUser?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteHomework(hw.id)}
                            >
                              <Icon name="Trash2" size={16} className="text-destructive" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  if (currentUser?.role === 'student') {
    const studentGrades = getStudentGrades(currentUser.id);
    const studentClass = classes.find(c => c.id === currentUser.classId);
    const classHomeworks = homeworks.filter(hw => hw.classId === currentUser.classId);

    return (
      <div className="min-h-screen bg-gradient-to-br from-success/5 via-background to-primary/5">
        <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-success rounded-xl p-2">
                <Icon name="User" size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Электронный дневник</h1>
                <p className="text-sm text-muted-foreground">{currentUser.name} • {studentClass?.name || 'Без класса'}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6">
          <Tabs defaultValue="grades" className="space-y-6">
            <TabsList className="bg-white p-1 shadow-sm">
              <TabsTrigger value="grades" className="gap-2">
                <Icon name="Award" size={18} />
                Мои оценки
              </TabsTrigger>
              <TabsTrigger value="schedule" className="gap-2">
                <Icon name="Calendar" size={18} />
                Расписание
              </TabsTrigger>
              <TabsTrigger value="homework" className="gap-2">
                <Icon name="BookOpen" size={18} />
                Домашние задания
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grades" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {subjects.map(subject => {
                  const avg = getAverageBySubject(currentUser.id, subject);
                  const subjectGrades = studentGrades.filter(g => g.subject === subject);
                  
                  return (
                    <Card key={subject} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary/10 rounded-xl p-3">
                          <Icon name="BookOpen" size={24} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{subject}</h3>
                          <p className="text-2xl font-bold mt-1">
                            {avg > 0 ? avg : '-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {subjectGrades.slice(-5).map(g => (
                          <div key={g.id} className="flex flex-col items-center">
                            <Badge 
                              className={
                                g.grade === 5 ? 'bg-success' : 
                                g.grade === 4 ? 'bg-primary' : 
                                g.grade === 3 ? 'bg-warning' : 'bg-destructive'
                              }
                            >
                              {g.grade}
                            </Badge>
                            <span className="text-xs text-muted-foreground mt-0.5">{g.type}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} />
                  Средний балл по предметам
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjects.map(s => ({
                    subject: s,
                    average: Number(getAverageBySubject(currentUser.id, s))
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="average" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="History" size={20} />
                  История оценок
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Предмет</TableHead>
                      <TableHead>Оценка</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Дата</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentGrades.slice(-15).reverse().map(grade => (
                      <TableRow key={grade.id}>
                        <TableCell>{grade.subject}</TableCell>
                        <TableCell>
                          <Badge className={
                            grade.grade === 5 ? 'bg-success' : 
                            grade.grade === 4 ? 'bg-primary' : 
                            grade.grade === 3 ? 'bg-warning' : 'bg-destructive'
                          }>
                            {grade.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{grade.type}</Badge>
                        </TableCell>
                        <TableCell>{grade.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Icon name="Calendar" size={24} />
                  Расписание {studentClass?.name}
                </h2>

                <div className="space-y-4">
                  {daysOfWeek.map(day => {
                    const dayLessons = schedules.filter(s => 
                      s.dayOfWeek === day && 
                      s.classId === currentUser.classId
                    );
                    if (dayLessons.length === 0) return null;
                    
                    return (
                      <div key={day} className="space-y-2">
                        <h3 className="font-semibold text-primary">{day}</h3>
                        <div className="grid gap-2">
                          {dayLessons.map(lesson => {
                            const teacher = users.find(u => u.id === lesson.teacherId);
                            return (
                              <Card key={lesson.id} className="p-3">
                                <div className="flex items-center justify-between">
                                  <div className="space-y-1">
                                    <p className="font-medium">{lesson.subject}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {lesson.time} • {teacher?.name || 'Учитель не назначен'}
                                    </p>
                                  </div>
                                  <Badge variant="outline">{lesson.time}</Badge>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="homework" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Icon name="BookOpen" size={24} />
                  Домашние задания для {studentClass?.name}
                </h2>

                <div className="space-y-3">
                  {classHomeworks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Нет домашних заданий</p>
                  ) : (
                    classHomeworks.map(hw => (
                      <Card key={hw.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary">{hw.subject}</Badge>
                            {hw.dueDate && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Icon name="Calendar" size={12} />
                                {new Date(hw.dueDate).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{hw.description}</p>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  return null;
};

export default Index;
                            type="date"
                            value={newHomework.dueDate}
                            onChange={(e) => setNewHomework({...newHomework, dueDate: e.target.value})}
                          />
                        </div>

                        <Button onClick={addHomework} className="w-full bg-success hover:bg-success/90">
                          Добавить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-3">
                  {homeworks
                    .filter(hw => teacherSubjects.includes(hw.subject))
                    .map(hw => (
                      <Card key={hw.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-warning">{hw.subject}</Badge>
                              <Badge variant="outline">{classes.find(c => c.id === hw.classId)?.name}</Badge>
                            </div>
                            <p className="text-sm">{hw.description}</p>
                            {hw.dueDate && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Icon name="Calendar" size={14} />
                                Срок: {new Date(hw.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          {hw.teacherId === currentUser?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteHomework(hw.id)}
                            >
                              <Icon name="Trash2" size={16} className="text-destructive" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  if (currentUser?.role === 'student') {
    const studentGrades = getStudentGrades(currentUser.id);
    const studentClass = classes.find(c => c.id === currentUser.classId);
    const classHomeworks = homeworks.filter(hw => hw.classId === currentUser.classId);

    return (
      <div className="min-h-screen bg-gradient-to-br from-success/5 via-background to-primary/5">
        <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-success rounded-xl p-2">
                <Icon name="User" size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Электронный дневник</h1>
                <p className="text-sm text-muted-foreground">{currentUser.name} • {studentClass?.name || 'Без класса'}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6">
          <Tabs defaultValue="grades" className="space-y-6">
            <TabsList className="bg-white p-1 shadow-sm">
              <TabsTrigger value="grades" className="gap-2">
                <Icon name="Award" size={18} />
                Мои оценки
              </TabsTrigger>
              <TabsTrigger value="homework" className="gap-2">
                <Icon name="BookOpen" size={18} />
                Домашние задания
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grades" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {subjects.map(subject => {
                  const avg = getAverageBySubject(currentUser.id, subject);
                  const subjectGrades = studentGrades.filter(g => g.subject === subject);
                  
                  return (
                    <Card key={subject} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary/10 rounded-xl p-3">
                          <Icon name="BookOpen" size={24} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{subject}</h3>
                          <p className="text-2xl font-bold mt-1">
                            {avg > 0 ? avg : '-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {subjectGrades.slice(-5).map(g => (
                          <Badge 
                            key={g.id}
                            className={
                              g.grade === 5 ? 'bg-success' : 
                              g.grade === 4 ? 'bg-primary' : 
                              g.grade === 3 ? 'bg-warning' : 'bg-destructive'
                            }
                          >
                            {g.grade}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} />
                  Средний балл по предметам
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjects.map(s => ({
                    subject: s,
                    average: Number(getAverageBySubject(currentUser.id, s))
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="average" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="History" size={20} />
                  История оценок
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Предмет</TableHead>
                      <TableHead>Оценка</TableHead>
                      <TableHead>Дата</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentGrades.slice(-15).reverse().map(grade => (
                      <TableRow key={grade.id}>
                        <TableCell>{grade.subject}</TableCell>
                        <TableCell>
                          <Badge className={
                            grade.grade === 5 ? 'bg-success' : 
                            grade.grade === 4 ? 'bg-primary' : 
                            grade.grade === 3 ? 'bg-warning' : 'bg-destructive'
                          }>
                            {grade.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>{grade.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="homework" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Icon name="BookOpen" size={24} />
                  Домашние задания для {studentClass?.name}
                </h2>

                <div className="space-y-3">
                  {classHomeworks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Нет домашних заданий</p>
                  ) : (
                    classHomeworks.map(hw => (
                      <Card key={hw.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary">{hw.subject}</Badge>
                            {hw.dueDate && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Icon name="Calendar" size={12} />
                                {new Date(hw.dueDate).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{hw.description}</p>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  return null;
};

export default Index;