import React, { useState, useEffect, useCallback } from 'react';
import { 
    LayoutGrid, 
    Search, 
    Filter, 
    RefreshCw, 
    UserCheck, 
    Users, 
    BookOpen,
    Eye,
    AlertCircle
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

// --- THEME COLORS (Using Blue for Student/System Consistency) ---
const PRIMARY_COLOR_CLASS = 'bg-[#007bff]';
const HOVER_COLOR_CLASS = 'hover:bg-[#0056b3]';
const TEXT_COLOR_CLASS = 'text-[#007bff]';
const RING_COLOR_CLASS = 'focus:ring-[#007bff]';
const LIGHT_BG_CLASS = 'bg-[#007bff]/10';
const LIGHT_HOVER_CLASS = 'hover:bg-[#e6f2ff]';

interface AuthUser {
    id: number;
    name: string;
    student?: {
        id: number;
        student_id: string;
        course_id?: number;
        year_level?: number;
        current_class_id?: number;
    };
}

interface ClassInfo {
    id: number;
    class_code: string;
    class_name: string;
    program?: string;
    section?: string;
    year_level?: number;
    course_id?: number;
    course?: {
        id: number;
        course_code: string;
        course_name: string;
    };
    adviser_id?: number;
    adviser?: {
        id: number;
        first_name: string;
        last_name: string;
        full_name?: string;
    };
    academic_year_id?: number;
    academic_year?: {
        id: number;
        year_name: string;
    };
    semester_id?: number;
    semester?: {
        id: number;
        semester_name: string;
    };
    student_count?: number;
}

interface Notification {
    type: 'success' | 'error';
    message: string;
}

// Format grade level display
const formatGradeLevel = (grade: number | undefined): string => {
    if (!grade) return '';
    if (grade >= 13) {
        const yearNames = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
        return yearNames[grade - 13] || `${grade - 12}th Year`;
    }
    return `Grade ${grade}`;
};

const MyClasses: React.FC = () => {
    const { auth } = usePage().props as { auth: { user: AuthUser | null } };
    const user = auth?.user;
    const studentId = user?.student?.id;
    const currentClassId = user?.student?.current_class_id;

    const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchClassInfo = useCallback(async () => {
        if (!studentId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // First try to get class info from student-subjects endpoint
            const subjectsResponse = await axios.get('/api/course-year-subjects/student-subjects', {
                params: { student_id: studentId }
            });

            if (subjectsResponse.data.success && subjectsResponse.data.class_info) {
                const classInfoData = subjectsResponse.data.class_info;
                
                // If we have a class_id, fetch full class details
                if (classInfoData.class_id || currentClassId) {
                    const classId = classInfoData.class_id || currentClassId;
                    try {
                        const classResponse = await axios.get(`/api/classes/${classId}`);
                        if (classResponse.data.success) {
                            setClassInfo(classResponse.data.data);
                        } else {
                            // Fallback to class_info from subjects
                            setClassInfo({
                                id: classInfoData.class_id,
                                class_code: classInfoData.class_code || 'N/A',
                                class_name: `${classInfoData.course_name || ''} - Section ${classInfoData.section || ''}`.trim(),
                                program: classInfoData.course_code,
                                section: classInfoData.section,
                                year_level: classInfoData.year_level,
                                semester: classInfoData.semester ? { id: 0, semester_name: classInfoData.semester } : undefined,
                            } as ClassInfo);
                        }
                    } catch (error) {
                        // Fallback to class_info from subjects
                        setClassInfo({
                            id: classInfoData.class_id,
                            class_code: classInfoData.class_code || 'N/A',
                            class_name: `${classInfoData.course_name || ''} - Section ${classInfoData.section || ''}`.trim(),
                            program: classInfoData.course_code,
                            section: classInfoData.section,
                            year_level: classInfoData.year_level,
                            semester: classInfoData.semester ? { id: 0, semester_name: classInfoData.semester } : undefined,
                        } as ClassInfo);
                    }
                } else {
                    // Use class_info directly
                    setClassInfo({
                        id: classInfoData.class_id,
                        class_code: classInfoData.class_code || 'N/A',
                        class_name: `${classInfoData.course_name || ''} - Section ${classInfoData.section || ''}`.trim(),
                        program: classInfoData.course_code,
                        section: classInfoData.section,
                        year_level: classInfoData.year_level,
                        semester: classInfoData.semester ? { id: 0, semester_name: classInfoData.semester } : undefined,
                    } as ClassInfo);
                }
            } else if (currentClassId) {
                // Fallback: fetch directly by class ID
                try {
                    const classResponse = await axios.get(`/api/classes/${currentClassId}`);
                    if (classResponse.data.success) {
                        setClassInfo(classResponse.data.data);
                    }
                } catch (error) {
                    console.error('Error fetching class:', error);
                    setNotification({ type: 'error', message: 'Failed to load class information.' });
                }
            } else {
                setNotification({ type: 'error', message: 'No class information available.' });
            }
        } catch (error: any) {
            console.error('Error fetching class info:', error);
            setNotification({ 
                type: 'error', 
                message: error.response?.data?.message || 'Failed to connect to the server.' 
            });
        } finally {
            setLoading(false);
        }
    }, [studentId, currentClassId]);

    useEffect(() => {
        fetchClassInfo();
    }, [fetchClassInfo]);

    // Calculate stats
    const stats = {
        total_classes: classInfo ? 1 : 0,
        total_students: classInfo?.student_count || 0,
        has_adviser: !!classInfo?.adviser,
        total_courses: classInfo?.course ? 1 : 0,
    };

    // Filter classes (for students, typically just one class)
    const filteredClasses = classInfo && (
        !searchTerm || 
        classInfo.class_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classInfo.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classInfo.program?.toLowerCase().includes(searchTerm.toLowerCase())
    ) ? [classInfo] : [];

    const NotificationComponent: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
        useEffect(() => {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }, [onClose]);

        const bgColor = notification.type === 'success' ? PRIMARY_COLOR_CLASS : 'bg-red-500';

        return (
            <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
                <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm`}>
                    <div className="flex items-center justify-between">
                        <div className="font-medium">{notification.message}</div>
                        <button onClick={onClose} className="ml-4 rounded-full p-1 hover:bg-white/20 transition-colors">
                            <AlertCircle className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900">
                <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
                    {/* Header */}
                    <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center mb-4 sm:mb-6 md:mb-0">
                            <div className={`${PRIMARY_COLOR_CLASS} p-2 sm:p-3 rounded-lg sm:rounded-xl mr-2 sm:mr-3 md:mr-4`}>
                                <LayoutGrid className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Class</h1>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5 sm:mt-1">View your enrolled class information and details</p>
                            </div>
                        </div>
                        <div className="flex space-x-2 sm:space-x-3">
                            <button 
                                onClick={fetchClassInfo}
                                className="inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
                            >
                                <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${loading ? 'animate-spin' : ''} dark:text-gray-300`} />
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards - Mobile: Centered with icon below, Desktop: Icon on right */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100 dark:border-gray-700">
                            {/* Mobile: Centered layout */}
                            <div className="flex flex-col items-center text-center md:hidden">
                                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">Total</p>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">{stats.total_classes}</p>
                                <div className={`${LIGHT_BG_CLASS} dark:bg-gray-700 p-2 sm:p-3 rounded-full`}>
                                    <LayoutGrid className={`h-5 w-5 sm:h-6 sm:w-6 ${TEXT_COLOR_CLASS} dark:text-white`} />
                                </div>
                            </div>
                            {/* Desktop: Original layout with icon on right */}
                            <div className="hidden md:flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Total Classes</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_classes}</p>
                                </div>
                                <div className={`${LIGHT_BG_CLASS} dark:bg-gray-700 p-3 rounded-xl`}>
                                    <LayoutGrid className={`h-8 w-8 ${TEXT_COLOR_CLASS} dark:text-white`} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100 dark:border-gray-700">
                            {/* Mobile: Centered layout */}
                            <div className="flex flex-col items-center text-center md:hidden">
                                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">Students</p>
                                <p className={`text-2xl sm:text-3xl font-bold ${TEXT_COLOR_CLASS} dark:text-white mb-2 sm:mb-3`}>{stats.total_students}</p>
                                <div className={`${LIGHT_BG_CLASS} dark:bg-gray-700 p-2 sm:p-3 rounded-full`}>
                                    <Users className={`h-5 w-5 sm:h-6 sm:w-6 ${TEXT_COLOR_CLASS} dark:text-white`} />
                                </div>
                            </div>
                            {/* Desktop: Original layout with icon on right */}
                            <div className="hidden md:flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Total Students</p>
                                    <p className={`text-3xl font-bold ${TEXT_COLOR_CLASS} dark:text-white`}>{stats.total_students}</p>
                                </div>
                                <div className={`${LIGHT_BG_CLASS} dark:bg-gray-700 p-3 rounded-xl`}>
                                    <Users className={`h-8 w-8 ${TEXT_COLOR_CLASS} dark:text-white`} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100 dark:border-gray-700">
                            {/* Mobile: Centered layout */}
                            <div className="flex flex-col items-center text-center md:hidden">
                                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">Adviser</p>
                                <p className={`text-2xl sm:text-3xl font-bold ${TEXT_COLOR_CLASS} dark:text-white mb-2 sm:mb-3`}>{stats.has_adviser ? '1' : '0'}</p>
                                <div className={`${LIGHT_BG_CLASS} dark:bg-gray-700 p-2 sm:p-3 rounded-full`}>
                                    <UserCheck className={`h-5 w-5 sm:h-6 sm:w-6 ${TEXT_COLOR_CLASS} dark:text-white`} />
                                </div>
                            </div>
                            {/* Desktop: Original layout with icon on right */}
                            <div className="hidden md:flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Adviser Assigned</p>
                                    <p className={`text-3xl font-bold ${TEXT_COLOR_CLASS} dark:text-white`}>{stats.has_adviser ? '1' : '0'}</p>
                                </div>
                                <div className={`${LIGHT_BG_CLASS} dark:bg-gray-700 p-3 rounded-xl`}>
                                    <UserCheck className={`h-8 w-8 ${TEXT_COLOR_CLASS} dark:text-white`} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100 dark:border-gray-700">
                            {/* Mobile: Centered layout */}
                            <div className="flex flex-col items-center text-center md:hidden">
                                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">Course</p>
                                <p className={`text-2xl sm:text-3xl font-bold ${TEXT_COLOR_CLASS} dark:text-white mb-2 sm:mb-3`}>{stats.total_courses}</p>
                                <div className={`${LIGHT_BG_CLASS} dark:bg-gray-700 p-2 sm:p-3 rounded-full`}>
                                    <BookOpen className={`h-5 w-5 sm:h-6 sm:w-6 ${TEXT_COLOR_CLASS} dark:text-white`} />
                                </div>
                            </div>
                            {/* Desktop: Original layout with icon on right */}
                            <div className="hidden md:flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Total Courses</p>
                                    <p className={`text-3xl font-bold ${TEXT_COLOR_CLASS} dark:text-white`}>{stats.total_courses}</p>
                                </div>
                                <div className={`${LIGHT_BG_CLASS} dark:bg-gray-700 p-3 rounded-xl`}>
                                    <BookOpen className={`h-8 w-8 ${TEXT_COLOR_CLASS} dark:text-white`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters - Compact on Mobile */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border border-gray-100 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`pl-10 sm:pl-12 w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 ${RING_COLOR_CLASS} focus:border-transparent transition-all text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                    placeholder="Search code, name, or program..."
                                />
                            </div>
                            <div className="flex items-center">
                                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500 mr-2 sm:mr-3" />
                                <input
                                    type="text"
                                    value=""
                                    disabled
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm sm:text-base cursor-not-allowed`}
                                    placeholder="Filter by Program..."
                                />
                            </div>
                            <div className="flex items-center">
                                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500 mr-2 sm:mr-3" />
                                <input
                                    type="text"
                                    value=""
                                    disabled
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm sm:text-base cursor-not-allowed`}
                                    placeholder="Filter by Grade Level..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table - Responsive: Mobile shows Class Code & Name + Actions, Desktop shows all columns */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className={`${PRIMARY_COLOR_CLASS}`}>
                                    <tr>
                                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Class Code & Name</th>
                                        <th className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Program & Section</th>
                                        <th className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Year</th>
                                        <th className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Adviser</th>
                                        <th className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Students</th>
                                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-3 sm:px-6 py-8 sm:py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <RefreshCw className={`h-6 w-6 sm:h-8 sm:w-8 ${TEXT_COLOR_CLASS} dark:text-white animate-spin mb-2`} />
                                                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Loading class information...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : !studentId ? (
                                        <tr>
                                            <td colSpan={6} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 dark:text-gray-600 mb-3 sm:mb-4" />
                                                    <p className="text-base sm:text-lg font-medium dark:text-white">Student profile not found</p>
                                                    <p className="text-xs sm:text-sm dark:text-gray-400">Please contact the administrator</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredClasses.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <LayoutGrid className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 dark:text-gray-600 mb-3 sm:mb-4" />
                                                    <p className="text-base sm:text-lg font-medium dark:text-white">
                                                        {searchTerm ? 'No classes match your search' : 'No class enrolled'}
                                                    </p>
                                                    <p className="text-xs sm:text-sm dark:text-gray-400">
                                                        {searchTerm 
                                                            ? 'Try adjusting your search criteria'
                                                            : 'You are not currently enrolled in any class'}
                                                    </p>
                                                    {searchTerm && (
                                                        <button
                                                            onClick={() => setSearchTerm('')}
                                                            className={`mt-4 px-4 py-2 ${PRIMARY_COLOR_CLASS} text-white rounded-lg ${HOVER_COLOR_CLASS} transition-all font-medium text-sm`}
                                                        >
                                                            Clear Search
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredClasses.map((classItem) => (
                                            <tr 
                                                key={classItem.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                                                    <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">{classItem.class_code}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{classItem.class_name}</div>
                                                    {/* Show additional info on mobile */}
                                                    <div className="md:hidden mt-1 space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-xs text-gray-600 dark:text-gray-300">{classItem.program || classItem.course?.course_code || ''} {classItem.section ? `- Section ${classItem.section}` : ''}</span>
                                                            <span className="text-xs text-gray-600 dark:text-gray-300">{formatGradeLevel(classItem.year_level)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <UserCheck className='h-3 w-3 text-gray-400 dark:text-gray-500' />
                                                            <span className="text-xs text-gray-600 dark:text-gray-300">
                                                                {classItem.adviser?.full_name || 
                                                                 (classItem.adviser ? `${classItem.adviser.first_name} ${classItem.adviser.last_name}` : 'Unassigned')}
                                                            </span>
                                                        </div>
                                                        <button
                                                            className="text-xs text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                                                        >
                                                            {classItem.student_count || 0} {classItem.student_count === 1 ? 'student' : 'students'}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                    <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{classItem.program || classItem.course?.course_code || '-'}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Section {classItem.section || 'N/A'}</div>
                                                </td>
                                                <td className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-white">{formatGradeLevel(classItem.year_level)}</td>
                                                <td className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                    <div className='flex items-center text-xs sm:text-sm text-gray-900 dark:text-white'>
                                                        <UserCheck className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-gray-400 dark:text-gray-500' />
                                                        {classItem.adviser?.full_name || 
                                                         (classItem.adviser ? `${classItem.adviser.first_name} ${classItem.adviser.last_name}` : 'Unassigned')}
                                                    </div>
                                                </td>
                                                <td className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                    <span className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium">
                                                        {classItem.student_count || 0} {classItem.student_count === 1 ? 'student' : 'students'}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                                                    <div className="flex justify-end space-x-1 sm:space-x-2">
                                                        <a
                                                            href="/student/my-subjects"
                                                            className="p-1.5 sm:p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                            title="View Subjects"
                                                        >
                                                            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Results count */}
                        {!loading && filteredClasses.length > 0 && (
                            <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                    Showing {filteredClasses.length} of {filteredClasses.length} class
                                </p>
                            </div>
                        )}
                    </div>

                    {notification && (
                        <NotificationComponent
                            notification={notification}
                            onClose={() => setNotification(null)}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default MyClasses;


