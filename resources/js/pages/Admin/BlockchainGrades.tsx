import React, { useState, useEffect } from 'react';
import { RefreshCw, Eye, Users, ChevronRight, ChevronDown, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { adminClassesService, Class, Student } from '../../../services/AdminClassesService';

const PRIMARY_COLOR_CLASS = 'bg-gradient-to-r from-purple-600 to-indigo-600';
const TEXT_COLOR_CLASS = 'text-purple-600';

interface Notification {
    type: 'success' | 'error' | 'info';
    message: string;
}

const Notification: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = notification.type === 'success' 
        ? 'bg-green-600'
        : notification.type === 'error'
        ? 'bg-red-600'
        : 'bg-blue-600';

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
            <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm`}>
                <div className="flex items-center justify-between">
                    <div className="font-medium">{notification.message}</div>
                    <button onClick={onClose} className="ml-4 rounded-full p-1 hover:bg-white/20 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const BlockchainGrades: React.FC = () => {
    const [notification, setNotification] = useState<Notification | null>(null);
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<Class[]>([]);
    const [expandedClassId, setExpandedClassId] = useState<number | null>(null);
    const [students, setStudents] = useState<Map<number, Student[]>>(new Map());
    const [loadingStudents, setLoadingStudents] = useState<Set<number>>(new Set());

    const loadClasses = async () => {
        setLoading(true);
        try {
            const response = await adminClassesService.getClasses({ per_page: 9999 });
            if (response.success) {
                setClasses(response.data || []);
            } else {
                setNotification({ type: 'error', message: response.message || 'Failed to load classes' });
            }
        } catch (error: any) {
            setNotification({ type: 'error', message: error.message || 'Failed to load classes' });
        } finally {
            setLoading(false);
        }
    };

    const loadStudentsForClass = async (classId: number) => {
        if (students.has(classId)) {
            // Already loaded, just toggle
            setExpandedClassId(expandedClassId === classId ? null : classId);
            return;
        }

        setLoadingStudents(new Set([...loadingStudents, classId]));
        try {
            const response = await adminClassesService.getClassStudents(classId);
            if (response.success) {
                setStudents(new Map(students.set(classId, response.data || [])));
                setExpandedClassId(classId);
            } else {
                setNotification({ type: 'error', message: response.message || 'Failed to load students' });
            }
        } catch (error: any) {
            setNotification({ type: 'error', message: error.message || 'Failed to load students' });
        } finally {
            const newSet = new Set(loadingStudents);
            newSet.delete(classId);
            setLoadingStudents(newSet);
        }
    };

    useEffect(() => {
        loadClasses();
    }, []);

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                    Blockchain Grades
                                </h1>
                                <p className="text-gray-600">View student grades by class</p>
                            </div>
                            <button
                                onClick={loadClasses}
                                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <RefreshCw className={`h-8 w-8 ${TEXT_COLOR_CLASS} animate-spin`} />
                            </div>
                        ) : classes.length === 0 ? (
                            <div className="px-6 py-12 text-center text-gray-500">
                                No classes found
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {classes.map((classItem) => {
                                    const isExpanded = expandedClassId === classItem.id;
                                    const classStudents = students.get(classItem.id) || [];
                                    const isLoading = loadingStudents.has(classItem.id);

                                    return (
                                        <div key={classItem.id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900">{classItem.class_code}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">{classItem.class_name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {classItem.student_count || 0} students
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => loadStudentsForClass(classItem.id)}
                                                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                >
                                                    {isLoading ? (
                                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Users className="w-4 h-4 mr-2" />
                                                            View Students
                                                        </>
                                                    )}
                                                    {isExpanded ? (
                                                        <ChevronDown className="w-4 h-4 ml-2" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4 ml-2" />
                                                    )}
                                                </button>
                                            </div>

                                            {isExpanded && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    {isLoading ? (
                                                        <div className="flex items-center justify-center py-8">
                                                            <RefreshCw className={`h-6 w-6 ${TEXT_COLOR_CLASS} animate-spin`} />
                                                        </div>
                                                    ) : classStudents.length === 0 ? (
                                                        <p className="text-center text-gray-500 py-8">No students found in this class</p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {classStudents.map((student) => (
                                                                <div
                                                                    key={student.id}
                                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">{student.full_name}</p>
                                                                        <p className="text-sm text-gray-600">{student.student_id}</p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => router.visit(`/admin/blockchain-transactions/grades/${student.id}?class_id=${classItem.id}`)}
                                                                        className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                                    >
                                                                        <Eye className="w-4 h-4 mr-1.5" />
                                                                        View Grades
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {notification && (
                        <Notification
                            notification={notification}
                            onClose={() => setNotification(null)}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default BlockchainGrades;
