import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, processing }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="p-6">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-red-500 text-2xl">warning</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button 
                        disabled={processing}
                        onClick={onClose}
                        className="px-5 py-2.5 font-bold text-sm text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        disabled={processing}
                        onClick={onConfirm}
                        className="px-5 py-2.5 font-bold text-sm text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors flex items-center gap-2"
                    >
                        {processing && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                        {processing ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
