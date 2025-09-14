import { useMemo, useState } from 'react';
import { MessageSquare, Filter, Search, Eye, Trash2, MessageCircle, CheckCircle } from 'lucide-react';
import { useGetAllFeedbacksQuery, useReplyToFeedbackMutation } from '../../Store/Api/feedBackApi';
import type { Feedback } from '../../Store/interface';
import ReplyModal from '../Components/ReplyModal';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Store/store';

type SortOrder = 'newest' | 'oldest';

export default function FeedBack() {
  const { data: feedbackResponse, isLoading, error, refetch } = useGetAllFeedbacksQuery();
  const [replyToFeedback] = useReplyToFeedbackMutation();
  const { user } = useSelector((state: RootState) => state.auth);
  const feedback: Feedback[] = Array.isArray(feedbackResponse?.data) ? feedbackResponse!.data : [];

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isReplying, setIsReplying] = useState(false);

  const safeDate = (value: unknown) => {
    const d = new Date(String(value ?? ''));
    return isNaN(d.getTime()) ? null : d;
  };

  const formatDate = (dateString: string) => {
    const d = safeDate(dateString);
    if (!d) return '—';
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return 'NA';
    return fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() ?? '')
      .join('') || 'NA';
  };

  const stats = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    let thisMonth = 0;
    let last7 = 0;
    const uniqueEmails = new Set<string>();

    for (const f of feedback) {
      if (f?.email) uniqueEmails.add(f.email);
      const d = safeDate((f as any)?.createdAt);
      if (!d) continue;
      if (d.getMonth() === month && d.getFullYear() === year) thisMonth++;
      if (d >= weekAgo) last7++;
    }

    return {
      total: feedback.length,
      thisMonth,
      last7,
      uniqueUsers: uniqueEmails.size,
    };
  }, [feedback]);

  const filteredAndSorted = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtered = term
      ? feedback.filter((item) => {
          const name = (item.fullName ?? '').toLowerCase();
          const email = (item.email ?? '').toLowerCase();
          const message = (item.message ?? '').toLowerCase();
          return name.includes(term) || email.includes(term) || message.includes(term);
        })
      : feedback;

    const sorted = [...filtered].sort((a, b) => {
      const da = safeDate((a as any)?.createdAt)?.getTime() ?? 0;
      const db = safeDate((b as any)?.createdAt)?.getTime() ?? 0;
      return sortOrder === 'newest' ? db - da : da - db;
    });

    return sorted;
  }, [feedback, searchTerm, sortOrder]);

  const handleReply = (item: Feedback) => {
    setSelectedFeedback(item);
    setIsReplying(true);
  };

  const handleSendReply = async (message: string) => {
    if (!selectedFeedback || !user) return;
    
    try {
      await replyToFeedback({
        id: selectedFeedback.id,
        message,
        adminName: user.fullName || 'Admin',
        adminEmail: user.email || 'admin@karnue.com',
      }).unwrap();
      
      // Refresh the feedback list
      refetch();
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to send reply:', error);
      return Promise.reject(error);
    }
  };

  const onDelete = (item: Feedback) => {
    // TODO: wire to a delete mutation with a confirm dialog
    console.log('Delete feedback', item.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
          <p className="text-gray-600">Monitor and respond to user feedback</p>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">{stats.total} Total Feedback</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-green-600">{stats.thisMonth}</p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Filter className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recent (7 days)</p>
              <p className="text-2xl font-bold text-purple-600">{stats.last7}</p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Users</p>
              <p className="text-2xl font-bold text-orange-600">{stats.uniqueUsers}</p>
            </div>
            <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading feedback...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-red-300 mx-auto mb-4" />
            <p className="text-red-500 font-medium">Error loading feedback</p>
            <p className="text-sm text-gray-600 mt-2">
              {'data' in (error as any) ? JSON.stringify((error as any).data) : 'Network or API error'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              API URL: {import.meta.env.VITE_API_URL || 'Not set'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAndSorted.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {getInitials(item.fullName)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.fullName || 'Unnamed'}</h3>
                        <p className="text-sm text-gray-500">{item.email || 'No email'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-600">{formatDate((item as any).createdAt)}</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 text-sm leading-relaxed">{item.message || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {item.replied ? (
                          <span className="text-green-600" title="Replied">
                            <CheckCircle className="h-5 w-5" />
                          </span>
                        ) : (
                          <button
                            onClick={() => handleReply(item)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Reply to feedback"
                          >
                            <MessageCircle className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(item)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete feedback"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </div>
                </div>
              </div>
            ))}

            {filteredAndSorted.length === 0 && (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No feedback found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {isReplying && selectedFeedback && (
        <ReplyModal
          feedback={selectedFeedback}
          onClose={() => {
            setIsReplying(false);
            setSelectedFeedback(null);
          }}
          onSendReply={handleSendReply}
          isSending={false}
        />
      )}
    </div>
  );
}
