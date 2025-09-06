/**
 * Tasks Page - Step 8
 * Placeholder for future Kanban board implementation
 */

import Header from '../components/Header';

const TasksPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Task Management - Coming Soon
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            This page will feature a Kanban board for task and project management. 
            Employees will be able to create, assign, and track tasks across different stages.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📋 To Do</h3>
              <p className="text-gray-600">Tasks waiting to be started</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🚧 In Progress</h3>
              <p className="text-gray-600">Tasks currently being worked on</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">✅ Done</h3>
              <p className="text-gray-600">Completed tasks</p>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Planned Features:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-900">Task Creation & Assignment</h4>
                <p className="text-sm text-gray-600">Create tasks and assign them to team members</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-900">Drag & Drop Interface</h4>
                <p className="text-sm text-gray-600">Move tasks between columns with drag and drop</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-900">Due Dates & Priorities</h4>
                <p className="text-sm text-gray-600">Set deadlines and priority levels for tasks</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-900">Comments & Attachments</h4>
                <p className="text-sm text-gray-600">Collaborate with comments and file attachments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
