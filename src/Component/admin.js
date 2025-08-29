import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminOverview from './AdminOverview';
import AdminUsersList from './AdminUsersList';
import AdminMembersList from './AdminMembersList';
import UserMembers from './UserMembers';

const Admin = () => {
    const location = useLocation();
    const { userId } = useParams();
    
    // Determine which page to show based on the current path
    const getActivePage = () => {
        if (location.pathname === '/admin') return 'dashboard';
        if (location.pathname === '/admin/users') return 'users';
        if (location.pathname.startsWith('/admin/members')) return 'members';
        if (location.pathname === '/admin/settings') return 'settings';
        return 'dashboard';
    };

    const getPageContent = () => {
        // If we're on a specific user's members page
        if (userId) {
            return <UserMembers userId={userId} />;
        }

        switch (getActivePage()) {
            case 'dashboard':
                return <AdminOverview />;
            case 'users':
                return <AdminUsersList />;
            case 'members':
                return <AdminMembersList />;
            case 'settings':
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Configure system settings and preferences.
                            </p>
                        </div>
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <p className="text-gray-500">Settings page coming soon...</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <AdminOverview />;
        }
    };

    return (
        <AdminDashboard activePage={getActivePage()}>
            {getPageContent()}
        </AdminDashboard>
    );
};

export default Admin;