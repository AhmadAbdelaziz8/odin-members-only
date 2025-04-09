import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to Members Only
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            A private message board where members can share thoughts and ideas. Join our community to
            see who's behind each message and become part of the conversation.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            {user ? (
              <Link
                to="/messages"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                View Messages
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Log in <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <div className="ring-1 ring-inset ring-gray-900/10 rounded-lg overflow-hidden">
                <div className="bg-white p-8">
                  <div className="space-y-6">
                    {/* Sample message preview */}
                    <div className="border-l-4 border-primary-500 bg-primary-50 p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900">Welcome to our community!</h3>
                        <span className="text-sm text-gray-500">2 hours ago</span>
                      </div>
                      <p className="mt-2 text-gray-600">
                        Join us to see who's behind each message. Members can view author details and
                        participate in exclusive discussions.
                      </p>
                      <div className="mt-3 text-sm text-gray-500">
                        Posted by: {user ? 'John Doe' : '[Members Only]'}
                      </div>
                    </div>

                    {/* Feature highlights */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-gray-200 p-4">
                        <h4 className="text-sm font-medium text-gray-900">Anonymous Posting</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Share your thoughts freely without revealing your identity to non-members
                        </p>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-4">
                        <h4 className="text-sm font-medium text-gray-900">Member Benefits</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          See who's behind each message and engage with the community
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}