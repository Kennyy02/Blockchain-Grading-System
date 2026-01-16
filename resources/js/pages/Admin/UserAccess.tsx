import React, { useState, useEffect } from 'react';
import { User, Search, Eye, EyeOff, X, RefreshCw, UserCheck, GraduationCap, Users, ChevronDown, CheckCircle, AlertCircle, Mail, Lock, Phone, MapPin, Calendar, BookOpen } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

// --- MARITIME THEME COLORS ---
const PRIMARY_COLOR_CLASS = 'bg-[#003366]';
const HOVER_COLOR_CLASS = 'hover:bg-[#002244]';
const TEXT_COLOR_CLASS = 'text-[#003366]';
const RING_COLOR_CLASS = 'focus:ring-[#003366]';
const LIGHT_BG_CLASS = 'bg-[#003366]/10';
const LIGHT_HOVER_CLASS = 'hover:bg-[#e6f2ff]';

interface UserData {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'teacher' | 'student' | 'parent';
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
    teacher?: {
        id: number;
        teacher_id: string;
        first_name: string;
        middle_name?: string;
        last_name: string;
        email: string;
        phone?: string;
        address?: string;
        department?: string;
        gender?: string;
    };
    student?: {
        id: number;
        student_id: string;
        first_name: string;
        middle_name?: string;
        last_name: string;
        email: string;
        phone?: string;
        program?: string;
        year_level: number;
        course?: {
            id: number;
            course_name: string;
            course_code: string;
        };
    };
    parent?: {
        id: number;
        first_name: string;
        middle_name?: string;
        last_name: string;
        email: string;
        phone?: string;
        address?: string;
        gender?: string;
    };
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface UsersResponse {
    data: UserData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const UserAccess: React.FC = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [pagination, setPagination] = useState<Pagination>({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });
    const [showPassword, setShowPassword] = useState(false);

    // Get role from URL query parameter
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const roleParam = urlParams.get('role');
        if (roleParam && ['teacher', 'student', 'parent'].includes(roleParam)) {
            setSelectedRole(roleParam);
        }
    }, []);

    const getCsrfToken = (): string => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        return token || '';
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.current_page.toString(),
                per_page: pagination.per_page.toString(),
            });

            if (selectedRole !== 'all') {
                params.append('role', selectedRole);
            }

            if (searchQuery) {
                params.append('search', searchQuery);
            }

            const response = await fetch(`/api/users/access/list?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();

            if (data.success) {
                setUsers(data.data.data);
                setPagination({
                    current_page: data.data.current_page,
                    last_page: data.data.last_page,
                    per_page: data.data.per_page,
                    total: data.data.total,
                });
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [selectedRole, pagination.current_page]);

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, current_page: 1 }));
        fetchUsers();
    };

    const handleViewUser = async (userId: number) => {
        try {
            const response = await fetch(`/api/users/access/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }

            const data = await response.json();

            if (data.success) {
                setSelectedUser(data.data);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'teacher':
                return <UserCheck className="h-4 w-4" />;
            case 'student':
                return <GraduationCap className="h-4 w-4" />;
            case 'parent':
                return <User className="h-4 w-4" />;
            default:
                return <Users className="h-4 w-4" />;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'teacher':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'student':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'parent':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getUserName = (user: UserData): string => {
        if (user.teacher) {
            return `${user.teacher.first_name} ${user.teacher.middle_name ? user.teacher.middle_name.charAt(0) + '. ' : ''}${user.teacher.last_name}`;
        }
        if (user.student) {
            return `${user.student.first_name} ${user.student.middle_name ? user.student.middle_name.charAt(0) + '. ' : ''}${user.student.last_name}`;
        }
        if (user.parent) {
            return `${user.parent.first_name} ${user.parent.middle_name ? user.parent.middle_name.charAt(0) + '. ' : ''}${user.parent.last_name}`;
        }
        return user.name;
    };

    const getUserLevel = (user: UserData): string => {
        if (user.student) {
            if (user.student.year_level >= 13) {
                const yearNames = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
                return yearNames[user.student.year_level - 13] || `${user.student.year_level - 12}th Year`;
            }
            return `Grade ${user.student.year_level}`;
        }
        return '—';
    };

    const getUserProgram = (user: UserData): string => {
        if (user.student) {
            if (user.student.course) {
                return user.student.course.course_name;
            }
            return user.student.program || '—';
        }
        if (user.teacher) {
            return user.teacher.department || '—';
        }
        return '—';
    };

    const getUserGrade = (user: UserData): string => {
        // Grade information would need to be fetched separately or included in the response
        // For now, returning placeholder
        return '—';
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <UserCheck className="h-8 w-8" />
                            User Access
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage and view user access information
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Role Filter */}
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Filter by Role
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedRole}
                                    onChange={(e) => {
                                        setSelectedRole(e.target.value);
                                        setPagination(prev => ({ ...prev, current_page: 1 }));
                                    }}
                                    className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 ${RING_COLOR_CLASS} bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none pr-10`}
                                >
                                    <option value="all">All Users</option>
                                    <option value="teacher">Teachers</option>
                                    <option value="parent">Parents</option>
                                    <option value="student">Students</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Search */}
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Search by name or email..."
                                    className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 ${RING_COLOR_CLASS} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                />
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="flex items-end">
                            <button
                                onClick={handleSearch}
                                className={`${PRIMARY_COLOR_CLASS} ${HOVER_COLOR_CLASS} text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2`}
                            >
                                <Search className="h-4 w-4" />
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12">
                            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">No users found</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className={`${PRIMARY_COLOR_CLASS} text-white`}>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Level</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Program</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Grade</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {getRoleIcon(user.role)}
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {getUserName(user)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                    {getUserLevel(user)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                    {getUserProgram(user)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                    {getUserGrade(user)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        user.status === 'active'
                                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                                            : 'bg-red-100 text-red-800 border border-red-200'
                                                    }`}>
                                                        {user.status === 'active' ? (
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                        ) : (
                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                        )}
                                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => handleViewUser(user.id)}
                                                        className={`${TEXT_COLOR_CLASS} ${LIGHT_HOVER_CLASS} px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2`}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.last_page > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} users
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, current_page: Math.max(1, prev.current_page - 1) }))}
                                            disabled={pagination.current_page === 1}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                pagination.current_page === 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : `${PRIMARY_COLOR_CLASS} text-white ${HOVER_COLOR_CLASS}`
                                            }`}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, current_page: Math.min(prev.last_page, prev.current_page + 1) }))}
                                            disabled={pagination.current_page === pagination.last_page}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                pagination.current_page === pagination.last_page
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : `${PRIMARY_COLOR_CLASS} text-white ${HOVER_COLOR_CLASS}`
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* View User Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>
                    
                    <div className="relative w-full max-w-3xl mx-auto my-8 transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
                        <div className={`${PRIMARY_COLOR_CLASS} px-6 py-4`}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">User Details</h2>
                                <button 
                                    onClick={() => setShowModal(false)} 
                                    className="rounded-full p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {/* User Header */}
                            <div className="flex items-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                                <div className={`${LIGHT_BG_CLASS} p-4 rounded-full mr-4`}>
                                    {getRoleIcon(selectedUser.role)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {getUserName(selectedUser)}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(selectedUser.role)}`}>
                                            {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                                        </span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                                            selectedUser.status === 'active'
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : 'bg-red-100 text-red-800 border-red-200'
                                        }`}>
                                            {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* User Information */}
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                        Basic Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Email</label>
                                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg border dark:border-gray-600">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <p className="text-sm text-gray-900 dark:text-white">{selectedUser.email}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                                                Password (Hashed)
                                                <span className="ml-2 text-xs font-normal text-gray-400">(Encrypted - cannot be decrypted)</span>
                                            </label>
                                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg border dark:border-gray-600">
                                                <Lock className="h-4 w-4 text-gray-400" />
                                                <p className="text-sm text-gray-900 dark:text-white font-mono flex-1 break-all">
                                                    {showPassword ? selectedUser.password : '••••••••••••••••••••••••'}
                                                </p>
                                                <button
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
                                                    title={showPassword ? 'Hide password' : 'Show password'}
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Role-Specific Information */}
                                {selectedUser.teacher && (
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                            <UserCheck className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                            Teacher Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Teacher ID</label>
                                                <p className="text-sm bg-gray-50 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-lg border dark:border-gray-600">
                                                    {selectedUser.teacher.teacher_id}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Department</label>
                                                <p className="text-sm bg-gray-50 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-lg border dark:border-gray-600">
                                                    {selectedUser.teacher.department || '—'}
                                                </p>
                                            </div>
                                            {selectedUser.teacher.phone && (
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Phone</label>
                                                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg border dark:border-gray-600">
                                                        <Phone className="h-4 w-4 text-gray-400" />
                                                        <p className="text-sm text-gray-900 dark:text-white">{selectedUser.teacher.phone}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedUser.teacher.address && (
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Address</label>
                                                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg border dark:border-gray-600">
                                                        <MapPin className="h-4 w-4 text-gray-400" />
                                                        <p className="text-sm text-gray-900 dark:text-white">{selectedUser.teacher.address}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedUser.teacher.gender && (
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Gender</label>
                                                    <p className="text-sm bg-gray-50 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-lg border dark:border-gray-600">
                                                        {selectedUser.teacher.gender}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedUser.student && (
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                            <GraduationCap className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                                            Student Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Student ID</label>
                                                <p className="text-sm bg-gray-50 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-lg border dark:border-gray-600">
                                                    {selectedUser.student.student_id}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Year Level</label>
                                                <p className="text-sm bg-gray-50 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-lg border dark:border-gray-600">
                                                    {getUserLevel(selectedUser)}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Program/Course</label>
                                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg border dark:border-gray-600">
                                                    <BookOpen className="h-4 w-4 text-gray-400" />
                                                    <p className="text-sm text-gray-900 dark:text-white">{getUserProgram(selectedUser)}</p>
                                                </div>
                                            </div>
                                            {selectedUser.student.phone && (
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Phone</label>
                                                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg border dark:border-gray-600">
                                                        <Phone className="h-4 w-4 text-gray-400" />
                                                        <p className="text-sm text-gray-900 dark:text-white">{selectedUser.student.phone}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedUser.parent && (
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                            <User className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                                            Parent Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedUser.parent.phone && (
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Phone</label>
                                                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg border dark:border-gray-600">
                                                        <Phone className="h-4 w-4 text-gray-400" />
                                                        <p className="text-sm text-gray-900 dark:text-white">{selectedUser.parent.phone}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedUser.parent.address && (
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Address</label>
                                                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg border dark:border-gray-600">
                                                        <MapPin className="h-4 w-4 text-gray-400" />
                                                        <p className="text-sm text-gray-900 dark:text-white">{selectedUser.parent.address}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedUser.parent.gender && (
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Gender</label>
                                                    <p className="text-sm bg-gray-50 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-lg border dark:border-gray-600">
                                                        {selectedUser.parent.gender}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Account Information */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                        <Calendar className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                                        Account Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Created At</label>
                                            <p className="text-sm bg-gray-50 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-lg border dark:border-gray-600">
                                                {new Date(selectedUser.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Last Updated</label>
                                            <p className="text-sm bg-gray-50 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-lg border dark:border-gray-600">
                                                {new Date(selectedUser.updated_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className={`${PRIMARY_COLOR_CLASS} ${HOVER_COLOR_CLASS} text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
};

export default UserAccess;

